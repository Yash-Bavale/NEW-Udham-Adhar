import { buildWssUrl, missingConfig, webRtcAccess, type Env } from "./callerdesk-webrtc.config";

/** Reads CallerDesk WebRTC config from server secrets. Values never leave here except via sessionCredentials(). */
export function readEnv(): Env {
  const e = process.env;
  return {
    CALLERDESK_ASTERISK_HOST: e["CALLERDESK_ASTERISK_HOST"],
    CALLERDESK_WS_PORT: e["CALLERDESK_WS_PORT"],
    CALLERDESK_WS_PATH: e["CALLERDESK_WS_PATH"],
    CALLERDESK_SIP_DOMAIN: e["CALLERDESK_SIP_DOMAIN"],
    CALLERDESK_SIP_EXTENSION: e["CALLERDESK_SIP_EXTENSION"],
    CALLERDESK_SIP_PASSWORD: e["CALLERDESK_SIP_PASSWORD"],
    CALLERDESK_DISPLAY_NAME: e["CALLERDESK_DISPLAY_NAME"],
  };
}

export function accessFor(userId: string, memberId: string | null, env: Env = readEnv()) {
  return webRtcAccess({ userId, memberId, enabledFlag: process.env["CALLERDESK_WEBRTC_ENABLED"], env });
}

/**
 * SIP digest auth runs in the browser, so the agent's own SIP secret must reach that agent's
 * browser. It is released only to the authorised test agent, only when the feature flag is on,
 * kept in memory (never storage/logs/URLs), and is per-agent (not the shared API auth code).
 */
export function sessionCredentials(env: Env) {
  if (missingConfig(env).length) return null;
  const wssUrl = buildWssUrl(env.CALLERDESK_ASTERISK_HOST!, env.CALLERDESK_WS_PORT!, env.CALLERDESK_WS_PATH!);
  if (!wssUrl) return null;
  return {
    wssUrl,
    sipDomain: env.CALLERDESK_SIP_DOMAIN!.trim(),
    extension: env.CALLERDESK_SIP_EXTENSION!.trim(),
    password: env.CALLERDESK_SIP_PASSWORD!,
    displayName: env.CALLERDESK_DISPLAY_NAME!.trim(),
  };
}
