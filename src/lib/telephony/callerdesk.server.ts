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
  if (!final) return /answer|engaged|connected/.test(st) ? "answered" : "ringing";
  if (/^answer/.test(st) || talk > 0) return "ended";
  return "missed";
}
