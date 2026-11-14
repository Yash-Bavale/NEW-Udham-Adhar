const ALLOWLIST_TTL_MS = 5 * 60 * 1e3;
let cachedSites = null;
async function loadWebsites() {
  const now = Date.now();
  if (cachedSites && now - cachedSites.at < ALLOWLIST_TTL_MS) return cachedSites.rows;
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const { data } = await supabaseAdmin.from("websites").select("id, domain, name, brand_name, is_primary").eq("is_active", true);
  const rows = data ?? [];
  cachedSites = { at: now, rows };
  return rows;
}
function normalizeHostname(value) {
  return value.toLowerCase().trim().replace(/^www\./, "");
}
function extraAllowedOrigins() {
  const raw = process.env["ALLOWED_WEBSITE_ORIGINS"];
  if (!raw) return [];
  return raw.split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
}
async function resolveCallerWebsite(request) {
  const originHeader = request.headers.get("origin") || request.headers.get("referer");
  if (!originHeader) return { website: null, origin: null };
  let hostname;
  let origin;
  try {
    const url = new URL(originHeader);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      return { website: null, origin: null };
    }
    hostname = normalizeHostname(url.hostname);
    origin = url.origin;
  } catch {
    return { website: null, origin: null };
  }
  if (extraAllowedOrigins().includes(origin.toLowerCase())) {
    const sites2 = await loadWebsites();
    const match2 = sites2.find((s) => normalizeHostname(s.domain) === hostname) ?? null;
    return { website: match2, origin };
  }
  const isDevOrigin = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".lovable.app") || hostname.endsWith(".lovableproject.com");
  const sites = await loadWebsites();
  const match = sites.find((s) => normalizeHostname(s.domain) === hostname) ?? null;
  if (!match && isDevOrigin) {
    const primary = sites.find((s) => s.is_primary) ?? sites[0] ?? null;
    return { website: primary, origin };
  }
  return { website: match, origin: match ? origin : null };
}
function corsHeaders(origin, methods) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    Vary: "Origin"
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = `${methods}, OPTIONS`;
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "600";
  }
  return headers;
}
function jsonOk(body, origin, methods = "POST") {
  return new Response(JSON.stringify({ ok: true, ...body }), {
    status: 200,
    headers: corsHeaders(origin, methods)
  });
}
function jsonError(status, code, error, origin, methods = "POST") {
  return new Response(JSON.stringify({ ok: false, error, code }), {
    status,
    headers: corsHeaders(origin, methods)
  });
}
function preflight(origin, methods) {
  return new Response(null, { status: 204, headers: corsHeaders(origin, methods) });
}
function b64url(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - padded.length % 4) % 4));
  const out = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}
async function hmacKey() {
  const secret = process.env["PUBLIC_API_TOKEN_SECRET"];
  if (!secret) throw new Error("PUBLIC_API_TOKEN_SECRET is not configured");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}
async function issueCheckoutToken(leadCode, websiteId, ttlSeconds = 3600) {
  const payload = {
    c: leadCode,
    w: websiteId,
    exp: Math.floor(Date.now() / 1e3) + ttlSeconds
  };
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), new TextEncoder().encode(body));
  return `${body}.${b64url(new Uint8Array(sig))}`;
}
async function verifyCheckoutToken(token, expectedLeadCode) {
  if (!token || typeof token !== "string" || token.length > 600) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      b64urlDecode(sig),
      new TextEncoder().encode(body)
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body)));
    if (!payload?.c || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1e3)) return null;
    if (payload.c.toUpperCase() !== expectedLeadCode.toUpperCase()) return null;
    return payload;
  } catch {
    return null;
  }
}
function maskName(value) {
  const name = String(value ?? "").trim();
  if (!name) return "";
  return name.split(/\s+/).map((part) => part.length <= 2 ? part : `${part[0]}${"*".repeat(Math.min(part.length - 1, 6))}`).join(" ");
}
function maskEmail(value) {
  const email = String(value ?? "").trim();
  const at = email.indexOf("@");
  if (at < 1) return "";
  const user = email.slice(0, at);
  const domain = email.slice(at);
  const head = user.slice(0, Math.min(2, user.length));
  return `${head}${"*".repeat(Math.max(user.length - head.length, 2))}${domain}`;
}
function maskMobile(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length < 4) return "";
  return `${"*".repeat(Math.max(digits.length - 4, 0))}${digits.slice(-4)}`;
}
const buckets = /* @__PURE__ */ new Map();
function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5e3) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}
function clientKey(request, scope) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return `${scope}:${ip}`;
}
async function resolveWebsiteOrigin(websiteId) {
  const fallback = process.env["APP_BASE_URL"] || process.env["PUBLIC_SITE_URL"] || "https://udyamadhar.in";
  if (!websiteId) return fallback;
  const sites = await loadWebsites();
  const site = sites.find((s) => s.id === websiteId);
  if (!site?.domain) return fallback;
  return `https://${normalizeHostname(site.domain)}`;
}
export {
  clientKey,
  corsHeaders,
  issueCheckoutToken,
  jsonError,
  jsonOk,
  loadWebsites,
  maskEmail,
  maskMobile,
  maskName,
  preflight,
  rateLimit,
  resolveCallerWebsite,
  resolveWebsiteOrigin,
  verifyCheckoutToken
};
