import { parseTokenKind, GENERIC_LINK_ERROR, evaluateToken, KIND_TTL_HOURS, KIND_SCOPES } from "./customer-access-core-Bd_9lLsD.mjs";
async function admin() {
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  return supabaseAdmin;
}
function b64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function sha256Hex(value) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}
async function issueCustomerToken(leadId, kind, opts = {}) {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const raw = `${kind}_${b64url(bytes)}`;
  const hours = opts.ttlHours ?? KIND_TTL_HOURS[kind];
  const db = await admin();
  const { error } = await db.from("customer_access_tokens").insert({
    token_hash: await sha256Hex(raw),
    kind,
    lead_id: leadId,
    scopes: [...KIND_SCOPES[kind]],
    expires_at: new Date(Date.now() + hours * 36e5).toISOString(),
    max_uses: opts.maxUses ?? null,
    issued_reason: opts.reason ?? null,
    created_by: opts.createdBy ?? null
  });
  if (error) throw new Error("Could not create a secure link.");
  return raw;
}
async function secureCustomerUrl(origin, path, leadId, kind, reason) {
  const t = await issueCustomerToken(leadId, kind, { reason });
  return `${origin.replace(/\/$/, "")}${path}#t=${t}`;
}
async function revokeLeadTokens(leadId) {
  const db = await admin();
  await db.from("customer_access_tokens").update({ revoked_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("lead_id", leadId).is("revoked_at", null);
}
async function requestFingerprint() {
  try {
    const { getRequest } = await import("./server-BvFUsV4_.mjs");
    const req = getRequest();
    const ip = req?.headers.get("cf-connecting-ip") || req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    return {
      ipHash: ip ? (await sha256Hex(`ip:${ip}`)).slice(0, 32) : null,
      ua: req?.headers.get("user-agent")?.slice(0, 200) ?? null
    };
  } catch {
    return { ipHash: null, ua: null };
  }
}
async function logAccessEvent(e) {
  try {
    const fp = await requestFingerprint();
    const db = await admin();
    await db.from("customer_access_events").insert({
      event: e.event,
      reason: e.reason ?? null,
      scope: e.scope ?? null,
      lead_code: e.leadCode?.slice(0, 80) ?? null,
      lead_id: e.leadId ?? null,
      ip_hash: fp.ipHash,
      user_agent: fp.ua
    });
  } catch {
  }
}
const MAX_FAILURES = 30;
const WINDOW_MS = 10 * 6e4;
async function tooManyFailures() {
  const fp = await requestFingerprint();
  if (!fp.ipHash) return false;
  const db = await admin();
  const { count } = await db.from("customer_access_events").select("id", { count: "exact", head: true }).eq("ip_hash", fp.ipHash).eq("event", "denied").gte("created_at", new Date(Date.now() - WINDOW_MS).toISOString());
  return (count ?? 0) >= MAX_FAILURES;
}
async function assertCustomerAccess(rawToken, leadId, scope, leadCode) {
  if (await tooManyFailures()) {
    await logAccessEvent({ event: "denied", reason: "rate_limited", scope, leadCode });
    throw new Error("Too many attempts. Please wait a few minutes and try again.");
  }
  const kind = parseTokenKind(rawToken);
  if (!kind) {
    await logAccessEvent({ event: "denied", reason: "malformed", scope, leadCode });
    throw new Error(GENERIC_LINK_ERROR);
  }
  const db = await admin();
  const { data: row } = await db.from("customer_access_tokens").select("id, kind, lead_id, scopes, expires_at, revoked_at, max_uses, use_count").eq("token_hash", await sha256Hex(rawToken)).maybeSingle();
  const verdict = evaluateToken(row ?? null, kind, leadId ?? null, scope);
  if (!verdict.ok) {
    await logAccessEvent({ event: "denied", reason: verdict.reason, scope, leadCode, leadId: leadId ?? null });
    throw new Error(GENERIC_LINK_ERROR);
  }
  await db.from("customer_access_tokens").update({ use_count: (row.use_count ?? 0) + 1, last_used_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", row.id);
}
async function leadIdByCode(leadCode) {
  const db = await admin();
  const { data } = await db.from("leads").select("id").eq("lead_code", leadCode).maybeSingle();
  return data?.id ?? null;
}
async function publicRefForLeadId(leadId) {
  const db = await admin();
  const { data } = await db.from("leads").select("public_ref").eq("id", leadId).maybeSingle();
  return data?.public_ref ?? null;
}
const LINK_RE = /(https?:\/\/[A-Za-z0-9.-]+(?::\d+)?)\/(onboarding|payment)\/([A-Za-z]{2}(?:-|%2D)\d{4}(?:-|%2D)\d{6})(\/(?:documents|done))?(?![\w\/#%-])/g;
const RESUME_RE = /(https?:\/\/[A-Za-z0-9.-]+(?::\d+)?)?\/resume\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?![\w\/#-])/gi;
async function secureCustomerLinksInText(text, reason) {
  if (!text || !text.includes("/onboarding/") && !text.includes("/payment/") && !text.includes("/resume/")) {
    return text;
  }
  const db = await admin();
  const cache = /* @__PURE__ */ new Map();
  const leadIdCache = /* @__PURE__ */ new Map();
  async function tokenFor(leadId, kind) {
    const k = `${leadId}:${kind}`;
    if (!cache.has(k)) {
      try {
        cache.set(k, await issueCustomerToken(leadId, kind, { reason }));
      } catch {
        cache.set(k, null);
      }
    }
    return cache.get(k) ?? null;
  }
  const resumeMatches = [...text.matchAll(RESUME_RE)];
  for (const m of resumeMatches) {
    const { data: app } = await db.from("applications").select("lead_id").eq("id", m[2]).maybeSingle();
    if (!app?.lead_id) continue;
    const { data: lead } = await db.from("leads").select("lead_code").eq("id", app.lead_id).maybeSingle();
    if (!lead?.lead_code) continue;
    const origin = m[1] || process.env.APP_BASE_URL || "https://udyamadhar.in";
    text = text.split(m[0]).join(`${origin}/onboarding/${lead.lead_code}`);
  }
  const matches = [...text.matchAll(LINK_RE)];
  if (matches.length === 0) return text;
  let out = "";
  let last = 0;
  for (const m of matches) {
    const idx = m.index ?? 0;
    out += text.slice(last, idx);
    last = idx + m[0].length;
    const code = decodeURIComponent(m[3]).toUpperCase();
    if (!leadIdCache.has(code)) leadIdCache.set(code, await leadIdByCode(code));
    const leadId = leadIdCache.get(code);
    const kind = m[2] === "payment" ? "co" : "ob";
    const t = leadId ? await tokenFor(leadId, kind) : null;
    const ref = t && leadId ? await publicRefForLeadId(leadId) : null;
    const linkText = ref ? m[0].replace(m[3], ref) : m[0];
    out += t ? `${linkText}#t=${t}` : m[0];
  }
  return out + text.slice(last);
}
const RETURN_HOST_SUFFIXES = [
  "udyamadhar.in",
  "udyamregistrations.in",
  "businesshelpservices.com",
  "businesshelpservices.in",
  "gstcertificate.in",
  "lovable.app"
];
function normalizeReturnOrigin(input) {
  if (!input) return null;
  try {
    const u = new URL(input);
    const host = u.hostname.toLowerCase();
    if (u.protocol === "http:" && (host === "localhost" || host === "127.0.0.1")) return u.origin;
    if (u.protocol !== "https:") return null;
    if (host.startsWith("crm.") || host.startsWith("api.")) return null;
    return RETURN_HOST_SUFFIXES.some((s) => host === s || host.endsWith(`.${s}`)) ? u.origin : null;
  } catch {
    return null;
  }
}
function newReturnNonce() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return b64url(bytes);
}
async function saveReturnContext(paymentId, origin, nonce) {
  if (!paymentId) return;
  const db = await admin();
  await db.from("payments").update({ return_origin: origin, return_nonce_hash: await sha256Hex(nonce) }).eq("id", paymentId);
}
async function gatewayReturnRedirect(leadCode, page, fallbackOrigin, query, returnNonce) {
  const qs = query ? `?${new URLSearchParams(query).toString()}` : "";
  const path = `/${page}/${encodeURIComponent(leadCode)}${qs}`;
  let location = `${fallbackOrigin.replace(/\/$/, "")}${path}`;
  try {
    const leadId = returnNonce && returnNonce.length >= 20 ? await leadIdByCode(leadCode) : null;
    const db = leadId ? await admin() : null;
    const { data: pay } = db ? await db.from("payments").select("return_origin").eq("lead_id", leadId).eq("return_nonce_hash", await sha256Hex(returnNonce)).limit(1).maybeSingle() : { data: null };
    if (leadId && pay) {
      const origin = normalizeReturnOrigin(pay?.return_origin) ?? fallbackOrigin;
      const kind = page === "success" ? "ob" : "co";
      const ref = await publicRefForLeadId(leadId);
      const refPath = ref ? `/${page}/${ref}${qs}` : path;
      location = await secureCustomerUrl(origin, refPath, leadId, kind, `gateway_${page}`);
    }
  } catch (e) {
    console.error("[gateway-return] could not attach secure link", { page, error: e });
  }
  return new Response(null, { status: 303, headers: { Location: location, "Referrer-Policy": "no-referrer" } });
}
async function withCheckoutToken(url, leadId, createdBy) {
  if (!url) return url ?? null;
  if (url.includes("#t=")) return url;
  const t = await issueCustomerToken(leadId, "co", { reason: "staff_payment_link", createdBy: createdBy ?? void 0 });
  return `${url.split("#")[0]}#t=${t}`;
}
export {
  assertCustomerAccess,
  gatewayReturnRedirect,
  issueCustomerToken,
  leadIdByCode,
  logAccessEvent,
  newReturnNonce,
  normalizeReturnOrigin,
  publicRefForLeadId,
  revokeLeadTokens,
  saveReturnContext,
  secureCustomerLinksInText,
  secureCustomerUrl,
  sha256Hex,
  withCheckoutToken
};
