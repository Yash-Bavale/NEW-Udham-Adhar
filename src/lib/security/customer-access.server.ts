/**
 * Server-only issue/verify for customer access tokens. Only SHA-256 hashes
 * are stored; the raw token exists only in the customer's link/browser.
 */
import {
  GENERIC_LINK_ERROR,
  KIND_SCOPES,
  KIND_TTL_HOURS,
  evaluateToken,
  parseTokenKind,
  type AccessScope,
  type TokenKind,
} from "./customer-access-core";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sha256Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function issueCustomerToken(
  leadId: string,
  kind: TokenKind,
  opts: { reason?: string; ttlHours?: number; maxUses?: number | null; createdBy?: string | null } = {},
): Promise<string> {
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
    expires_at: new Date(Date.now() + hours * 3600_000).toISOString(),
    max_uses: opts.maxUses ?? null,
    issued_reason: opts.reason ?? null,
    created_by: opts.createdBy ?? null,
  });
  if (error) throw new Error("Could not create a secure link.");
  return raw;
}

/** Issue a token and return `${origin}${path}#t=<token>` (fragment never reaches servers/logs). */
export async function secureCustomerUrl(
  origin: string,
  path: string,
  leadId: string,
  kind: TokenKind,
  reason: string,
): Promise<string> {
  const t = await issueCustomerToken(leadId, kind, { reason });
  return `${origin.replace(/\/$/, "")}${path}#t=${t}`;
}

export async function revokeLeadTokens(leadId: string): Promise<void> {
  const db = await admin();
  await db
    .from("customer_access_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("lead_id", leadId)
    .is("revoked_at", null);
}

async function requestFingerprint(): Promise<{ ipHash: string | null; ua: string | null }> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const ip =
      req?.headers.get("cf-connecting-ip") ||
      req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      null;
    return {
      ipHash: ip ? (await sha256Hex(`ip:${ip}`)).slice(0, 32) : null,
      ua: req?.headers.get("user-agent")?.slice(0, 200) ?? null,
    };
  } catch {
    return { ipHash: null, ua: null };
  }
}

export async function logAccessEvent(e: {
  event: string;
  reason?: string | null;
  scope?: string | null;
  leadCode?: string | null;
  leadId?: string | null;
}): Promise<void> {
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
      user_agent: fp.ua,
    });
  } catch {
    /* logging must never break the request */
  }
}

const MAX_FAILURES = 30;
const WINDOW_MS = 10 * 60_000;

async function tooManyFailures(): Promise<boolean> {
  const fp = await requestFingerprint();
  if (!fp.ipHash) return false;
  const db = await admin();
  const { count } = await db
    .from("customer_access_events")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", fp.ipHash)
    .eq("event", "denied")
    .gte("created_at", new Date(Date.now() - WINDOW_MS).toISOString());
  return (count ?? 0) >= MAX_FAILURES;
}

/**
 * Verify `rawToken` grants `scope` on the lead with `leadId`.
 * Throws the generic link error on any failure (no existence disclosure).
 */
export async function assertCustomerAccess(
  rawToken: string | null | undefined,
  leadId: string | null | undefined,
  scope: AccessScope,
  leadCode?: string | null,
): Promise<void> {
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
  const { data: row } = await db
    .from("customer_access_tokens")
    .select("id, kind, lead_id, scopes, expires_at, revoked_at, max_uses, use_count")
    .eq("token_hash", await sha256Hex(rawToken as string))
    .maybeSingle();
  const verdict = evaluateToken(row ?? null, kind, leadId ?? null, scope);
  if (!verdict.ok) {
    await logAccessEvent({ event: "denied", reason: verdict.reason, scope, leadCode, leadId: leadId ?? null });
    throw new Error(GENERIC_LINK_ERROR);
  }
  await db
    .from("customer_access_tokens")
    .update({ use_count: (row.use_count ?? 0) + 1, last_used_at: new Date().toISOString() })
    .eq("id", row.id);
}

/** Look up a lead id by lead code without revealing anything to the caller. */
export async function leadIdByCode(leadCode: string): Promise<string | null> {
  const db = await admin();
  const { data } = await db.from("leads").select("id").eq("lead_code", leadCode).maybeSingle();
  return data?.id ?? null;
}

const LINK_RE =
  /(https?:\/\/[A-Za-z0-9.-]+(?::\d+)?)\/(onboarding|payment)\/([A-Za-z]{2}(?:-|%2D)\d{4}(?:-|%2D)\d{6})(\/(?:documents|done))?(?![\w\/#%-])/g;
const RESUME_RE = /(https?:\/\/[A-Za-z0-9.-]+(?::\d+)?)?\/resume\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?![\w\/#-])/gi;

/**
 * Rewrite customer form/payment links inside outgoing text so each carries a
 * freshly issued, correctly scoped token in the URL fragment. Links that
 * already carry a token, or whose order cannot be found, are left unchanged.
 */
export async function secureCustomerLinksInText(text: string, reason: string): Promise<string> {
  if (!text || (!text.includes("/onboarding/") && !text.includes("/payment/") && !text.includes("/resume/"))) {
    return text;
  }
  const db = await admin();
  const cache = new Map<string, string | null>();
  const leadIdCache = new Map<string, string | null>();

  async function tokenFor(leadId: string, kind: TokenKind): Promise<string | null> {
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

  // 1) /resume/<order uuid>  ->  /onboarding/<code>#t=...
  const resumeMatches = [...text.matchAll(RESUME_RE)];
  for (const m of resumeMatches) {
    const { data: app } = await db.from("applications").select("lead_id").eq("id", m[2]).maybeSingle();
    if (!app?.lead_id) continue;
    const { data: lead } = await db.from("leads").select("lead_code").eq("id", app.lead_id).maybeSingle();
    if (!lead?.lead_code) continue;
    const origin = m[1] || process.env.APP_BASE_URL || "https://udyamadhar.in";
    text = text.split(m[0]).join(`${origin}/onboarding/${lead.lead_code}`);
  }

  // 2) /onboarding/<code> and /payment/<code>
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
    const kind: TokenKind = m[2] === "payment" ? "co" : "ob";
    const t = leadId ? await tokenFor(leadId, kind) : null;
    out += t ? `${m[0]}#t=${t}` : m[0];
  }
  return out + text.slice(last);
}
