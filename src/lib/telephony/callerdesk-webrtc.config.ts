/**
 * Pure (browser-safe) CallerDesk WebRTC configuration + state rules. No secrets live here.
 * CallerDesk's documented browser phone is SIP over secure WebSocket to their Asterisk
 * server, reachable only through the company FortiClient VPN (docs.callerdesk.io/webrtc-user-registration).
 */
export const WEBRTC_CONFIG_NAMES = [
  "CALLERDESK_ASTERISK_HOST",
  "CALLERDESK_WS_PORT",
  "CALLERDESK_WS_PATH",
  "CALLERDESK_SIP_DOMAIN",
  "CALLERDESK_SIP_EXTENSION",
  "CALLERDESK_SIP_PASSWORD",
  "CALLERDESK_DISPLAY_NAME",
] as const;

/** Proof of concept is limited to Sid (CallerDesk member 122142). */
export const WEBRTC_TEST_MEMBER_ID = "122142";
export const WEBRTC_TEST_USER_IDS = ["58ae8526-a228-4085-8978-308ec9eee4d6"] as const;

export type Env = Record<string, string | undefined>;

export function missingConfig(env: Env): string[] {
  return WEBRTC_CONFIG_NAMES.filter((n) => !(env[n] ?? "").trim());
}

export function buildWssUrl(host: string, port: string, path: string): string | null {
  const h = host.trim();
  if (!h || /[\s/:]/.test(h)) return null;
  if (!/^\d{1,5}$/.test(port.trim()) || Number(port) < 1 || Number(port) > 65535) return null;
  const p = path.trim().startsWith("/") ? path.trim() : `/${path.trim()}`;
  return `wss://${h}:${Number(port)}${p}`;
}

/** Live registration only when explicitly enabled, the caller is the test agent, and config is complete. */
export function webRtcAccess(input: { userId: string; memberId: string | null; enabledFlag: string | undefined; env: Env }) {
  const authorized = (WEBRTC_TEST_USER_IDS as readonly string[]).includes(input.userId) || input.memberId === WEBRTC_TEST_MEMBER_ID;
  const missing = missingConfig(input.env);
  const enabled = (input.enabledFlag ?? "").trim().toLowerCase() === "true";
  return { authorized, missing, enabled, canRegister: authorized && enabled && missing.length === 0 };
}

/** Redact secrets and full phone numbers from any diagnostic string. */
export function redact(text: string, secrets: Array<string | undefined> = []): string {
  let out = text;
  for (const s of secrets) if (s && s.length >= 3) out = out.split(s).join("[redacted]");
  return out.replace(/(?:\+?91)?\d{6,}(\d{4})/g, "******$1");
}

export type PhoneState =
  | "DISCONNECTED" | "CHECKING_CONFIGURATION" | "SETUP_INCOMPLETE" | "CONNECTING" | "REGISTERED"
  | "RECONNECTING" | "CALLING" | "RINGING" | "CONNECTED" | "ENDED" | "FAILED";

export type PhoneEvent =
  | "check" | "config_missing" | "config_ok" | "registered" | "register_failed" | "transport_lost"
  | "dial" | "incoming" | "accepted" | "rejected" | "hangup" | "reset" | "disconnect";

const T: Partial<Record<PhoneState, Partial<Record<PhoneEvent, PhoneState>>>> = {
  DISCONNECTED: { check: "CHECKING_CONFIGURATION" },
  FAILED: { check: "CHECKING_CONFIGURATION", reset: "DISCONNECTED" },
  SETUP_INCOMPLETE: { check: "CHECKING_CONFIGURATION" },
  CHECKING_CONFIGURATION: { config_missing: "SETUP_INCOMPLETE", config_ok: "CONNECTING", register_failed: "FAILED" },
  CONNECTING: { registered: "REGISTERED", register_failed: "FAILED", transport_lost: "FAILED" },
  RECONNECTING: { registered: "REGISTERED", register_failed: "FAILED" },
  REGISTERED: { dial: "CALLING", incoming: "RINGING", transport_lost: "RECONNECTING" },
  CALLING: { accepted: "CONNECTED", rejected: "ENDED", hangup: "ENDED", transport_lost: "ENDED" },
  RINGING: { accepted: "CONNECTED", rejected: "ENDED", hangup: "ENDED", transport_lost: "ENDED" },
  CONNECTED: { hangup: "ENDED", transport_lost: "ENDED" },
  ENDED: { reset: "REGISTERED", incoming: "RINGING", dial: "CALLING", transport_lost: "RECONNECTING" },
};

/** Returns the next state, or the same state when the event is not valid (never fakes progress). */
export function nextState(s: PhoneState, e: PhoneEvent): PhoneState {
  if (e === "disconnect") return "DISCONNECTED";
  return T[s]?.[e] ?? s;
}

export function canDial(s: PhoneState, inFlight: boolean): boolean {
  return !inFlight && (s === "REGISTERED" || s === "ENDED");
}

/** Safe, actionable message for a rejected SIP REGISTER (no secrets). */
export function registrationError(code: number | undefined): string {
  if (code === 401 || code === 403 || code === 407) return "CallerDesk rejected the SIP login. Check the extension and SIP password.";
  if (code === 404) return "CallerDesk does not recognise this SIP extension or domain.";
  if (code === 408 || code === 503 || code === 504) return "CallerDesk phone server did not respond. Check FortiClient VPN and retry.";
  return code ? `CallerDesk refused registration (code ${code}).` : "CallerDesk refused registration.";
}
