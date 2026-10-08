import { createFileRoute } from "@tanstack/react-router";

/**
 * CallerDesk call webhook (Call Report + Live Call payloads, configured in CallerDesk →
 * Webhook configuration with ?token=CALLERDESK_WEBHOOK_TOKEN). Writes to the shared
 * telephony_calls table with provider='callerdesk'; realtime pushes rows to the CRM call panel.
 */
const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const RANK: Record<string, number> = { ringing: 0, answered: 1, ended: 2, missed: 2 };

const s = (v: unknown) => { if (v == null) return null; const t = String(v).trim(); return t || null; };
const pick = (i: Record<string, unknown>, ...k: string[]) => { for (const x of k) { const v = s(i[x]); if (v) return v; } return null; };
const ts = (v: string | null) => { if (!v) return null; const d = new Date(v.replace(/n(?=\d{2}:)/, " ").replace(" ", "T") + "+05:30"); return isNaN(d.getTime()) ? null : d.toISOString(); };

/** Final report has EndTime/CallDuration; live payload does not. */
export function mapCallerDeskStatus(i: Record<string, unknown>): "ringing" | "answered" | "ended" | "missed" {
  const final = !!pick(i, "EndTime", "CallDuration", "TalkDuration", "CallRecordingUrl");
  const st = String(pick(i, "Status") ?? "").toLowerCase();
  const talk = Number(pick(i, "TalkDuration") ?? 0);
  if (!final) return /answer|engaged|connected/.test(st) ? "answered" : "ringing";
  if (/^answer/.test(st) || talk > 0) return "ended";
  return "missed";
}

async function handle(request: Request): Promise<Response> {
  const { verifyCallerDesk } = await import("@/lib/telephony/callerdesk.server");
  if (!verifyCallerDesk(request)) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers });
  try {
    const url = new URL(request.url);
    let input: Record<string, unknown> = Object.fromEntries(url.searchParams);
    delete input.token;
    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > 20_000) throw new Error("payload_too_large");
      const ct = request.headers.get("content-type") ?? "";
      input = { ...input, ...(ct.includes("json") ? (raw ? JSON.parse(raw) : {}) : Object.fromEntries(new URLSearchParams(raw))) };
    }
    const { normalizeIndianMobile, dbLookup } = await import("@/lib/telephony/smartflo.server");
    const callSid = pick(input, "CallSid", "Uniqueid", "uniqueid");
    const campid = pick(input, "campid");
    if (!callSid && !campid) return new Response(JSON.stringify({ ok: false, error: "missing_call_id" }), { status: 400, headers });
    const outbound = String(pick(input, "Direction") ?? "").toUpperCase().includes("OBD");
    const status = mapCallerDeskStatus(input);
    console.log(JSON.stringify({ event: "callerdesk_call_event", status, outbound, fields: Object.keys(input).sort() }));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;
    let existing: any = null;
    if (callSid) ({ data: existing } = await db.from("telephony_calls").select("*").eq("call_id", callSid).maybeSingle());
    if (!existing && campid) {
      ({ data: existing } = await db.from("telephony_calls").select("*").eq("provider", "callerdesk")
        .eq("ref_id", campid).order("started_at", { ascending: false }).limit(1).maybeSingle());
    }
    if (existing && (RANK[existing.status] ?? 0) >= RANK[status] && !(existing.status === "ringing" && status !== "ringing")) {
      return new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200, headers });
    }

    const now = new Date().toISOString();
    const row: Record<string, unknown> = { status, last_event: status, updated_at: now };
    if (callSid) { row.call_id = callSid; row.provider_uuid = callSid; }
    if (!existing) {
      const customerRaw = outbound ? pick(input, "DestinationNumber", "DialWhomNumber") : pick(input, "SourceNumber");
      const mobile = normalizeIndianMobile(customerRaw);
      Object.assign(row, {
        provider: "callerdesk", direction: outbound ? "outbound" : "inbound", ref_id: campid,
        caller_number: outbound ? pick(input, "SourceNumber") : (mobile ?? customerRaw),
        called_number: outbound ? (mobile ?? customerRaw) : pick(input, "DestinationNumber"),
        started_at: ts(pick(input, "StartTime")) ?? now,
      });
      if (!row.call_id) row.call_id = campid;
      if (mobile) {
        try {
          const m = await dbLookup(mobile);
          Object.assign(row, { customer_id: m.customerId, lead_id: m.leadId, application_id: m.applicationId, employee_id: m.employeeId });
        } catch { /* best-effort match */ }
      }
    }
    // Answering agent → employee, when the agent number matches a staff mobile.
    const agent = normalizeIndianMobile(pick(input, "DialWhomNumber"));
    if (agent && !outbound) {
      row.agent_id = agent;
      const { data: p } = await db.from("profiles").select("id").ilike("mobile", `%${agent}`).limit(1).maybeSingle();
      if (p?.id) row.employee_id = p.id;
    }
    if ((status === "answered" || status === "ended") && !existing?.answered_at) {
      row.answered_at = ts(pick(input, "LegB_Picked_time")) ?? now;
    }
    if (status === "ended" || status === "missed") {
      row.ended_at = ts(pick(input, "EndTime")) ?? now;
      row.hangup_cause = pick(input, "Status");
      row.recording_url = pick(input, "CallRecordingUrl");
      const d = Number(pick(input, "TalkDuration") ?? pick(input, "CallDuration") ?? 0);
      row.duration_seconds = Number.isFinite(d) ? Math.round(d) : 0;
    }
    const { error } = existing
      ? await db.from("telephony_calls").update(row).eq("id", existing.id)
      : await db.from("telephony_calls").upsert(row, { onConflict: "call_id" });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e) {
    console.log(JSON.stringify({ event: "callerdesk_call_event", error: (e as Error)?.message }));
    return new Response(JSON.stringify({ ok: false }), { status: 200, headers });
  }
}

export const Route = createFileRoute("/api/public/telephony/callerdesk/events")({
  server: { handlers: { POST: ({ request }) => handle(request), GET: ({ request }) => handle(request) } },
});
