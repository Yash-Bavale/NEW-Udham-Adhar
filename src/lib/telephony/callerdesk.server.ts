/**
 * CallerDesk provider helpers (server-only). Smartflo code stays in place for history/rollback.
 * Docs: https://api.callerdesk.io/ (click_to_call_v2 / v4, getmemberlist_V2, webhook payload).
 */
import { timingSafeEqual } from "crypto";

const BASE = "https://app.callerdesk.io/api";

export function activeProvider(): "smartflo" | "callerdesk" {
  return (process.env["TELEPHONY_PROVIDER"] ?? "").toLowerCase() === "callerdesk" ? "callerdesk" : "smartflo";
}

export function verifyCallerDesk(request: Request): boolean {
  const secret = process.env["CALLERDESK_WEBHOOK_TOKEN"];
  if (!secret) return false;
  const given = new URL(request.url).searchParams.get("token") || request.headers.get("x-callerdesk-token") || "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Finds the CallerDesk member id whose number matches the employee's mobile (last 10 digits). */
async function findMemberId(authcode: string, mobile10: string): Promise<string | null> {
  try {
    const fd = new FormData();
    fd.set("authcode", authcode);
    const res = await fetch(`${BASE}/getmemberlist_V2`, { method: "POST", body: fd, signal: AbortSignal.timeout(10_000) });
    const body: any = await res.json().catch(() => null);
    const list: any[] = body?.member || body?.data || body?.members || [];
    for (const m of Array.isArray(list) ? list : []) {
      const num = String(m?.member_num ?? m?.member_number ?? m?.mobile ?? "").replace(/\D/g, "").slice(-10);
      if (num === mobile10) return String(m?.member_id ?? m?.id ?? "") || null;
    }
  } catch { /* fall back to number-based call */ }
  return null;
}

/**
 * Starts a CallerDesk click-to-call. Prefers member-ID calling (v4) so CallerDesk rings the
 * member's registered device — the WebRTC browser phone when the agent is registered on it —
 * and falls back to the agent's mobile number (v2).
 */
export async function callerDeskClickToCall(agentMobile10: string, customer10: string) {
  const authcode = process.env["CALLERDESK_AUTHCODE"];
  const deskphone = process.env["CALLERDESK_DESKPHONE"];
  if (!authcode || !deskphone) throw new Error("CallerDesk calling is not configured yet. Please contact an admin.");

  const memberId = await findMemberId(authcode, agentMobile10);
  const q = new URLSearchParams({ calling_party_b: customer10, deskphone, authcode, call_from_did: "1" });
  let url: string;
  if (memberId) { q.set("member_id", memberId); url = `${BASE}/click_to_call_v4?${q}`; }
  else { q.set("calling_party_a", agentMobile10); url = `${BASE}/click_to_call_v2?${q}`; }

  let res: Response;
  try { res = await fetch(url, { signal: AbortSignal.timeout(15_000) }); }
  catch { throw new Error("Could not reach CallerDesk. Please try again."); }
  const body: any = await res.json().catch(() => null);
  const ok = res.ok && String(body?.type ?? "").toLowerCase() === "success";
  console.log(JSON.stringify({ event: "callerdesk_click_to_call", http: res.status, ok, via: memberId ? "member" : "mobile" }));
  if (!ok) {
    const msg = typeof body?.message === "string" && body.message.length < 200 ? body.message : null;
    throw new Error(msg ? `Call not started: ${msg}` : "CallerDesk did not start this call. Please try again.");
  }
  const campid = body?.campid != null ? String(body.campid) : null;
  return { campid, memberId };
}
