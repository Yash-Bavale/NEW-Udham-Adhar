/**
 * CallerDesk — the only telephony provider (server-only).
 * Docs: https://api.callerdesk.io/ (getmemberlist_V2, click_to_call_v4, webhook payload).
 */
import { timingSafeEqual } from "crypto";

const BASE = "https://app.callerdesk.io/api";

export function verifyCallerDesk(request: Request): boolean {
  const secret = process.env["CALLERDESK_WEBHOOK_TOKEN"];
  if (!secret) return false;
  const given = new URL(request.url).searchParams.get("token") || request.headers.get("x-callerdesk-token") || "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type CallerDeskMember = { memberId: string; mobile10: string };

/** Parses the verified getmemberlist_V2 shape `{ type: "success", getmember: [...] }`. */
export function parseMemberList(body: unknown): CallerDeskMember[] {
  const b = body as any;
  if (!b || String(b.type ?? "").toLowerCase() !== "success" || !Array.isArray(b.getmember)) return [];
  const out: CallerDeskMember[] = [];
  for (const m of b.getmember) {
    const id = String(m?.member_id ?? "").trim();
    const num = String(m?.member_num ?? m?.member_number ?? m?.mobile ?? "").replace(/\D/g, "").slice(-10);
    if (/^\d+$/.test(id) && num.length === 10) out.push({ memberId: id, mobile10: num });
  }
  return out;
}

/** Resolves the employee's member id: explicit CRM mapping first (validated), else by mobile. */
export function resolveMemberId(members: CallerDeskMember[], mobile10: string | null, mappedId: string | null): string | null {
  const mapped = mappedId?.trim();
  if (mapped) return members.some((m) => m.memberId === mapped) ? mapped : null;
  if (!mobile10) return null;
  return members.find((m) => m.mobile10 === mobile10)?.memberId ?? null;
}

async function fetchMembers(authcode: string): Promise<CallerDeskMember[]> {
  const fd = new FormData();
  fd.set("authcode", authcode);
  let res: Response;
  try { res = await fetch(`${BASE}/getmemberlist_V2`, { method: "POST", body: fd, signal: AbortSignal.timeout(10_000) }); }
  catch { throw new Error("Could not reach CallerDesk to verify your agent. Please try again."); }
  const body: unknown = await res.json().catch(() => null);
  const members = parseMemberList(body);
  console.log(JSON.stringify({ event: "callerdesk_member_list", http: res.status, count: members.length }));
  if (!res.ok) throw new Error("CallerDesk member lookup failed. Please try again or contact an admin.");
  return members;
}

/** Starts an agent-first CallerDesk click-to-call (v4, member id). No fallbacks. */
export async function callerDeskClickToCall(agentMobile10: string | null, mappedMemberId: string | null, customer10: string) {
  const authcode = process.env["CALLERDESK_AUTHCODE"];
  const deskphone = process.env["CALLERDESK_DESKPHONE"];
  if (!authcode || !deskphone) throw new Error("CallerDesk calling is not configured yet. Please contact an admin.");

  const memberId = resolveMemberId(await fetchMembers(authcode), agentMobile10, mappedMemberId);
  if (!memberId) {
    throw new Error(mappedMemberId
      ? "Your CallerDesk Member ID was not found in CallerDesk. Ask an admin to correct it on your employee profile."
      : "No CallerDesk member matches your mobile number. Ask an admin to add you in CallerDesk or set your CallerDesk Member ID.");
  }

  const q = new URLSearchParams({ calling_party_b: customer10, deskphone, authcode, call_from_did: "1", member_id: memberId });
  let res: Response;
  try { res = await fetch(`${BASE}/click_to_call_v4?${q}`, { signal: AbortSignal.timeout(15_000) }); }
  catch { throw new Error("Could not reach CallerDesk. Please try again."); }
  const body: any = await res.json().catch(() => null);
  const ok = res.ok && String(body?.type ?? "").toLowerCase() === "success";
  console.log(JSON.stringify({ event: "callerdesk_click_to_call", http: res.status, ok }));
  if (!ok) {
    const msg = typeof body?.message === "string" && body.message.length < 200 ? body.message : null;
    throw new Error(msg ? `Call not started: ${msg}` : "CallerDesk did not start this call. Please try again.");
  }
  const campid = body?.campid != null ? String(body.campid) : null;
  return { campid, memberId };
}

// ---------- Webhook payload helpers ----------

const s = (v: unknown) => { if (v == null) return null; const t = String(v).trim(); return t && !t.startsWith("$") ? t : null; };
export function pick(i: Record<string, unknown>, ...k: string[]) { for (const x of k) { const v = s(i[x]); if (v) return v; } return null; }
export const campaignId = (i: Record<string, unknown>) => pick(i, "Campid", "campid", "camp_id", "CampId");
export const callSid = (i: Record<string, unknown>) => pick(i, "CallSid", "callsid", "Uniqueid", "uniqueid");

/** Final report has EndTime/CallDuration; live payload does not. */
export function mapCallerDeskStatus(i: Record<string, unknown>): "ringing" | "answered" | "ended" | "missed" {
  const final = !!pick(i, "EndTime", "CallDuration", "TalkDuration", "CallRecordingUrl");
  const st = String(pick(i, "Status") ?? "").toLowerCase();
  const talk = Number(pick(i, "TalkDuration") ?? 0);
  if (!final) return /^(answer(?:ed)?|engaged|connected)$/.test(st) ? "answered" : "ringing";
  if (/^answer/.test(st) || talk > 0) return "ended";
  return "missed";
}

export function callerDeskDirection(i: Record<string, unknown>): "inbound" | "outbound" | null {
  const direction = String(pick(i, "Direction") ?? "").trim().toUpperCase();
  if (/^(OBD|OUT|OUTBOUND)$/.test(direction)) return "outbound";
  if (/^(IBD|IN|INBOUND)$/.test(direction)) return "inbound";
  return null;
}

/** CallerDesk IST timestamp ("YYYY-MM-DD HH:MM:SS") → ISO, or null. */
export const callerDeskTs = (v: string | null) => { if (!v) return null; const d = new Date(v.replace(/n(?=\d{2}:)/, " ").replace(" ", "T") + "+05:30"); return isNaN(d.getTime()) ? null : d.toISOString(); };

/**
 * Fields a late Call Report may add to an already-final call: only values that are missing
 * on the row (or a real EndTime that differs). Never changes status or call associations.
 * Empty result = true duplicate.
 */
export function reportEnrichment(existing: Record<string, any>, i: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const rec = pick(i, "CallRecordingUrl");
  if (rec && /^https?:\/\//.test(rec) && !existing.recording_url) out.recording_url = rec;
  const talk = Number(pick(i, "TalkDuration") ?? NaN);
  const duration = Number(pick(i, "CallDuration") ?? NaN);
  // TalkDuration is authoritative. A prior CallDuration may include ringing/IVR time.
  const d = Number.isFinite(talk) ? talk : duration;
  if (Number.isFinite(d) && d >= 0 && (existing.duration_seconds == null || (Number.isFinite(talk) && existing.duration_seconds !== Math.round(d)))) out.duration_seconds = Math.round(d);
  const end = callerDeskTs(pick(i, "EndTime"));
  if (end && (!existing.ended_at || new Date(existing.ended_at).getTime() !== new Date(end).getTime())) out.ended_at = end;
  const picked = callerDeskTs(pick(i, "LegB_Picked_time"));
  if (picked && !existing.answered_at) out.answered_at = picked;
  const st = pick(i, "Status"); if (st && !existing.hangup_cause) out.hangup_cause = st;
  return out;
}
