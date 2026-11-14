import { timingSafeEqual } from "crypto";
const BASE = "https://app.callerdesk.io/api";
function verifyCallerDesk(request) {
  const secret = process.env["CALLERDESK_WEBHOOK_TOKEN"];
  const queryToken = new URL(request.url).searchParams.get("token");
  const headerToken = request.headers.get("x-callerdesk-token");
  const source = queryToken ? "query" : headerToken ? "header" : "none";
  const given = queryToken || headerToken || "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret ?? "");
  const ok = !!secret && a.length === b.length && timingSafeEqual(a, b);
  if (!ok) {
    console.log(JSON.stringify({
      event: "callerdesk_auth_failure",
      token_supplied: given.length > 0,
      received_length: a.length,
      expected_length: secret ? b.length : null,
      source
    }));
  }
  return ok;
}
function parseMemberList(body) {
  const b = body;
  if (!b || String(b.type ?? "").toLowerCase() !== "success" || !Array.isArray(b.getmember)) return [];
  const out = [];
  for (const m of b.getmember) {
    const id = String(m?.member_id ?? "").trim();
    const num = String(m?.member_num ?? m?.member_number ?? m?.mobile ?? "").replace(/\D/g, "").slice(-10);
    if (/^\d+$/.test(id) && num.length === 10) out.push({ memberId: id, mobile10: num });
  }
  return out;
}
function resolveMemberId(members, mobile10, mappedId) {
  const mapped = mappedId?.trim();
  if (mapped) return members.some((m) => m.memberId === mapped) ? mapped : null;
  if (!mobile10) return null;
  return members.find((m) => m.mobile10 === mobile10)?.memberId ?? null;
}
async function fetchMembers(authcode) {
  const fd = new FormData();
  fd.set("authcode", authcode);
  let res;
  try {
    res = await fetch(`${BASE}/getmemberlist_V2`, { method: "POST", body: fd, signal: AbortSignal.timeout(1e4) });
  } catch {
    throw new Error("Could not reach CallerDesk to verify your agent. Please try again.");
  }
  const body = await res.json().catch(() => null);
  const members = parseMemberList(body);
  console.log(JSON.stringify({ event: "callerdesk_member_list", http: res.status, count: members.length }));
  if (!res.ok) throw new Error("CallerDesk member lookup failed. Please try again or contact an admin.");
  return members;
}
async function callerDeskClickToCall(agentMobile10, mappedMemberId, customer10) {
  const authcode = process.env["CALLERDESK_AUTHCODE"];
  const deskphone = process.env["CALLERDESK_DESKPHONE"];
  if (!authcode || !deskphone) throw new Error("CallerDesk calling is not configured yet. Please contact an admin.");
  const memberId = resolveMemberId(await fetchMembers(authcode), agentMobile10, mappedMemberId);
  if (!memberId) {
    throw new Error(mappedMemberId ? "Your CallerDesk Member ID was not found in CallerDesk. Ask an admin to correct it on your employee profile." : "No CallerDesk member matches your mobile number. Ask an admin to add you in CallerDesk or set your CallerDesk Member ID.");
  }
  const q = new URLSearchParams({ calling_party_b: customer10, deskphone, authcode, call_from_did: "1", member_id: memberId });
  let res;
  try {
    res = await fetch(`${BASE}/click_to_call_v4?${q}`, { signal: AbortSignal.timeout(15e3) });
  } catch {
    throw new Error("Could not reach CallerDesk. Please try again.");
  }
  const body = await res.json().catch(() => null);
  const ok = res.ok && String(body?.type ?? "").toLowerCase() === "success";
  console.log(JSON.stringify({ event: "callerdesk_click_to_call", http: res.status, ok }));
  if (!ok) {
    const msg = typeof body?.message === "string" && body.message.length < 200 ? body.message : null;
    throw new Error(msg ? `Call not started: ${msg}` : "CallerDesk did not start this call. Please try again.");
  }
  const campid = body?.campid != null ? String(body.campid) : null;
  return { campid, memberId };
}
const s = (v) => {
  if (v == null) return null;
  const t = String(v).trim();
  return t && !t.startsWith("$") ? t : null;
};
function pick(i, ...k) {
  for (const x of k) {
    const v = s(i[x]);
    if (v) return v;
  }
  return null;
}
const campaignId = (i) => pick(i, "Campid", "campid", "camp_id", "CampId");
const callSid = (i) => pick(i, "CallSid", "callsid", "Uniqueid", "uniqueid");
function mapCallerDeskStatus(i) {
  const type = String(pick(i, "type", "Type") ?? "").toLowerCase();
  const final = type === "call_report" || type !== "live_call" && !!pick(i, "EndTime", "CallDuration", "TalkDuration", "CallRecordingUrl");
  const st = String(pick(i, "Status") ?? "").toLowerCase();
  const talk = Number(pick(i, "TalkDuration") ?? 0);
  if (!final) return /^(answer(?:ed)?|engaged|connected|picked)$/.test(st) ? "answered" : "ringing";
  if (/^answer/.test(st) || talk > 0) return "ended";
  return "missed";
}
const OUTBOUND_LABELS = /* @__PURE__ */ new Set(["OBD", "OUT", "OUTBOUND", "WEBOBD"]);
const INBOUND_LABELS = /* @__PURE__ */ new Set(["IBD", "IN", "INBOUND", "IVR"]);
function callerDeskDirection(i) {
  const direction = String(pick(i, "Direction") ?? "").replace(/\s+/g, "").toUpperCase();
  if (OUTBOUND_LABELS.has(direction)) return "outbound";
  if (INBOUND_LABELS.has(direction)) return "inbound";
  return null;
}
const callerDeskTs = (v) => {
  if (!v) return null;
  const d = /* @__PURE__ */ new Date(v.replace(/n(?=\d{2}:)/, " ").replace(" ", "T") + "+05:30");
  return isNaN(d.getTime()) ? null : d.toISOString();
};
function reportEnrichment(existing, i) {
  const out = {};
  const rec = pick(i, "CallRecordingUrl");
  if (rec && /^https?:\/\//.test(rec) && !existing.recording_url) out.recording_url = rec;
  const talk = Number(pick(i, "TalkDuration") ?? NaN);
  const duration = Number(pick(i, "CallDuration") ?? NaN);
  const d = Number.isFinite(talk) ? talk : duration;
  if (Number.isFinite(d) && d >= 0 && (existing.duration_seconds == null || Number.isFinite(talk) && existing.duration_seconds !== Math.round(d))) out.duration_seconds = Math.round(d);
  const end = callerDeskTs(pick(i, "EndTime"));
  if (end && (!existing.ended_at || new Date(existing.ended_at).getTime() !== new Date(end).getTime())) out.ended_at = end;
  const picked = callerDeskTs(pick(i, "LegB_Picked_time"));
  if (picked && !existing.answered_at) out.answered_at = picked;
  const st = pick(i, "Status");
  if (st && !existing.hangup_cause) out.hangup_cause = st;
  return out;
}
const WEBRTC_MATCH_WINDOW_MS = 15 * 6e4;
function pickWebRtcCandidate(rows) {
  const c = rows.filter((r) => String(r.call_id ?? "").startsWith("webrtc:") && !r.provider_uuid);
  return c.length === 1 ? c[0] : null;
}
export {
  WEBRTC_MATCH_WINDOW_MS,
  callSid,
  callerDeskClickToCall,
  callerDeskDirection,
  callerDeskTs,
  campaignId,
  mapCallerDeskStatus,
  parseMemberList,
  pick,
  pickWebRtcCandidate,
  reportEnrichment,
  resolveMemberId,
  verifyCallerDesk
};
