const KIND_SCOPES = {
  co: ["summary", "payment", "contact_update", "status"],
  ob: ["summary", "status", "onboarding", "documents", "help"]
};
const KIND_TTL_HOURS = {
  co: 24 * 7,
  ob: 24 * 30
};
const TOKEN_RE = /^(co|ob)_[A-Za-z0-9_-]{43}$/;
function parseTokenKind(raw) {
  if (typeof raw !== "string" || !TOKEN_RE.test(raw)) return null;
  return raw.slice(0, 2);
}
function scopeAllowed(kind, scopes, scope) {
  return KIND_SCOPES[kind].includes(scope) && scopes.includes(scope);
}
function evaluateToken(row, rawKind, leadId, scope, now = Date.now()) {
  if (!row) return { ok: false, reason: "not_found" };
  if (row.kind !== rawKind) return { ok: false, reason: "not_found" };
  if (row.revoked_at) return { ok: false, reason: "revoked" };
  if (new Date(row.expires_at).getTime() <= now) return { ok: false, reason: "expired" };
  if (row.max_uses != null && row.use_count >= row.max_uses) return { ok: false, reason: "used_up" };
  if (!scopeAllowed(rawKind, row.scopes, scope)) return { ok: false, reason: "scope" };
  if (!leadId || row.lead_id !== leadId) return { ok: false, reason: "wrong_order" };
  return { ok: true };
}
const GENERIC_LINK_ERROR = "This link is invalid or has expired. Please use the latest link from your email.";
export {
  GENERIC_LINK_ERROR,
  KIND_SCOPES,
  KIND_TTL_HOURS,
  evaluateToken,
  parseTokenKind,
  scopeAllowed
};
