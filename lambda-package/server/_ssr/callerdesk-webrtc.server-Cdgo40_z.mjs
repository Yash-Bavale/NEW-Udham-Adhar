import { WEBRTC_CONFIG_NAMES, webRtcAccess, missingConfig, SHARED_CONFIG_NAMES, buildWssUrl } from "./callerdesk-webrtc.config-CFRtE2mu.mjs";
import { decryptSecret } from "./telephony-crypto.server-DKg2AF09.mjs";
function readEnv() {
  const e = process.env;
  const out = {};
  for (const n of WEBRTC_CONFIG_NAMES) out[n] = e[n];
  return out;
}
function toMeta(row) {
  if (!row) return null;
  return { status: row.status, sipUsername: row.sip_username, displayName: row.display_name, hasSecret: !!row.sip_password_ciphertext };
}
async function loadAccount(employeeId) {
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const { data, error } = await supabaseAdmin.from("employee_telephony_accounts").select("employee_id, status, sip_username, display_name, sip_password_ciphertext, member_id").eq("employee_id", employeeId).maybeSingle();
  if (error) throw new Error("Could not load browser phone account.");
  return data ?? null;
}
function accessFor(userId, row, env = readEnv()) {
  return webRtcAccess({ userId, account: toMeta(row), enabledFlag: process.env["CALLERDESK_WEBRTC_ENABLED"], env });
}
function shared(env) {
  if (missingConfig(env, SHARED_CONFIG_NAMES).length) return null;
  const wssUrl = buildWssUrl(env.CALLERDESK_ASTERISK_HOST, env.CALLERDESK_WS_PORT, env.CALLERDESK_WS_PATH);
  return wssUrl ? { wssUrl, sipDomain: env.CALLERDESK_SIP_DOMAIN.trim() } : null;
}
function legacyCredentials(env) {
  const u = env.CALLERDESK_SIP_EXTENSION?.trim(), p = env.CALLERDESK_SIP_PASSWORD, d = env.CALLERDESK_DISPLAY_NAME?.trim();
  return u && p && d ? { username: u, password: p, displayName: d } : null;
}
async function resolveSession(userId, row, env, rawKey) {
  const a = accessFor(userId, row, env);
  if (!a.canRegister) throw new Error(a.reason);
  const s = shared(env);
  if (!s) throw new Error("config_missing");
  if (a.source === "legacy") {
    const l = legacyCredentials(env);
    if (!l) throw new Error("config_missing");
    return { ...s, extension: l.username, password: l.password, displayName: l.displayName };
  }
  const r = row;
  if (r.employee_id !== userId) throw new Error("no_account");
  const password = await decryptSecret(r.sip_password_ciphertext, userId, rawKey);
  return { ...s, extension: r.sip_username.trim(), password, displayName: (r.display_name || r.sip_username).trim() };
}
export {
  accessFor,
  legacyCredentials,
  loadAccount,
  readEnv,
  resolveSession,
  toMeta
};
