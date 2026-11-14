const SHARED_CONFIG_NAMES = ["CALLERDESK_ASTERISK_HOST", "CALLERDESK_WS_PORT", "CALLERDESK_WS_PATH", "CALLERDESK_SIP_DOMAIN"];
const LEGACY_AGENT_NAMES = ["CALLERDESK_SIP_EXTENSION", "CALLERDESK_SIP_PASSWORD", "CALLERDESK_DISPLAY_NAME"];
const WEBRTC_CONFIG_NAMES = [...SHARED_CONFIG_NAMES, ...LEGACY_AGENT_NAMES];
const LEGACY_ENV_USER_IDS = ["58ae8526-a228-4085-8978-308ec9eee4d6"];
function missingConfig(env, names = WEBRTC_CONFIG_NAMES) {
  return names.filter((n) => !(env[n] ?? "").trim());
}
function buildWssUrl(host, port, path) {
  const h = host.trim();
  if (!h || /[\s/:]/.test(h)) return null;
  if (!/^\d{1,5}$/.test(port.trim()) || Number(port) < 1 || Number(port) > 65535) return null;
  const p = path.trim().startsWith("/") ? path.trim() : `/${path.trim()}`;
  return `wss://${h}:${Number(port)}${p}`;
}
function webRtcAccess(input) {
  const enabled = (input.enabledFlag ?? "").trim().toLowerCase() === "true";
  const legacy = !input.account && LEGACY_ENV_USER_IDS.includes(input.userId);
  const source = input.account ? "vault" : legacy ? "legacy" : null;
  const missing = missingConfig(input.env, legacy ? WEBRTC_CONFIG_NAMES : SHARED_CONFIG_NAMES);
  const a = input.account;
  let reason;
  if (!source) reason = "no_account";
  else if (a && a.status === "disabled") reason = "disabled";
  else if (a && (a.status !== "active" || !a.sipUsername || !a.hasSecret)) reason = "unprovisioned";
  else if (!enabled) reason = "flag_off";
  else if (missing.length) reason = "config_missing";
  else reason = "ready";
  return { authorized: !!source, source, reason, missing, enabled, canRegister: reason === "ready" };
}
const ACCESS_MESSAGE = {
  no_account: "Browser calling is not enabled for your account.",
  unprovisioned: "Your browser phone account is not set up yet. Ask an admin to add your CallerDesk SIP login.",
  disabled: "Your browser phone account is switched off. Ask an admin to re-enable it.",
  flag_off: "Browser calling is switched off for the CRM.",
  config_missing: "CallerDesk phone server settings are incomplete. Ask an admin.",
  ready: "Ready to connect."
};
function redact(text, secrets = []) {
  let out = text;
  for (const s of secrets) if (s && s.length >= 3) out = out.split(s).join("[redacted]");
  return out.replace(/(?:\+?91)?\d{6,}(\d{4})/g, "******$1");
}
const T = {
  DISCONNECTED: { check: "CHECKING_CONFIGURATION" },
  FAILED: { check: "CHECKING_CONFIGURATION", reset: "DISCONNECTED" },
  SETUP_INCOMPLETE: { check: "CHECKING_CONFIGURATION" },
  CHECKING_CONFIGURATION: { config_missing: "SETUP_INCOMPLETE", config_ok: "CONNECTING", register_failed: "FAILED" },
  CONNECTING: { registered: "REGISTERED", register_failed: "FAILED", transport_lost: "FAILED" },
  RECONNECTING: { check: "CHECKING_CONFIGURATION", registered: "REGISTERED", register_failed: "FAILED" },
  REGISTERED: { dial: "CALLING", incoming: "RINGING", transport_lost: "RECONNECTING" },
  CALLING: { accepted: "CONNECTED", rejected: "ENDED", hangup: "ENDED", transport_lost: "ENDED" },
  RINGING: { accepted: "CONNECTED", rejected: "ENDED", hangup: "ENDED", transport_lost: "ENDED" },
  CONNECTED: { hangup: "ENDED", transport_lost: "ENDED" },
  ENDED: { reset: "REGISTERED", incoming: "RINGING", dial: "CALLING", transport_lost: "RECONNECTING" }
};
function nextState(s, e) {
  if (e === "disconnect") return "DISCONNECTED";
  return T[s]?.[e] ?? s;
}
function canDial(s, inFlight) {
  return !inFlight && (s === "REGISTERED" || s === "ENDED");
}
function registrationError(code) {
  if (code === 401 || code === 403 || code === 407) return "CallerDesk rejected the SIP login. Check the extension and SIP password.";
  if (code === 404) return "CallerDesk does not recognise this SIP extension or domain.";
  if (code === 408 || code === 503 || code === 504) return "CallerDesk phone server did not respond. Check FortiClient VPN and retry.";
  return code ? `CallerDesk refused registration (code ${code}).` : "CallerDesk refused registration.";
}
export {
  ACCESS_MESSAGE,
  LEGACY_AGENT_NAMES,
  LEGACY_ENV_USER_IDS,
  SHARED_CONFIG_NAMES,
  WEBRTC_CONFIG_NAMES,
  buildWssUrl,
  canDial,
  missingConfig,
  nextState,
  redact,
  registrationError,
  webRtcAccess
};
