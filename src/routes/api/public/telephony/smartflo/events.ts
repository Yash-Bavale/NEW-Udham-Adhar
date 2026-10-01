import { createFileRoute } from "@tanstack/react-router";

/**
 * Smartflo call-event webhook (separate from the API Dialplan, which is untouched).
 * Smartflo triggers: "Call received on Server", "Call answered by Agent", "Call hangup (Missed or Answered)".
 * Smartflo bodies are user-defined templates of $variables and carry NO event name, so the event is
 * inferred from which fields are present (optional ?event=received|answered|hangup overrides).
 * Records/updates one row per call in telephony_calls; realtime pushes it to the CRM call panel.
 */
const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
type Ev = "received" | "answered" | "hangup";
const RANK: Record<string, number> = { ringing: 0, answered: 1, ended: 2, missed: 2 };

const s = (v: unknown) => {
  if (v == null) return null;
  const t = String(v).trim();
  // unresolved Smartflo template vars arrive literally as "$var"
  return t && !t.startsWith("$") ? t : null;
};
const pick = (i: Record<string, unknown>, ...k: string[]) => { for (const x of k) { const v = s(i[x]); if (v) return v; } return null; };

export function detectEvent(i: Record<string, unknown>, override: string | null): Ev {
  const o = (override ?? "").toLowerCase();
  if (/hang|end/.test(o)) return "hangup";
  if (/answer/.test(o)) return "answered";
  if (/receiv|ring|incoming/.test(o)) return "received";
  const named = String(pick(i, "event", "event_type", "type") ?? "").toLowerCase();
  if (/hang|end|disconnect/.test(named)) return "hangup";
  if (/answer/.test(named)) return "answered";
  if (pick(i, "end_stamp", "hangup_cause", "billsec", "duration", "call_status", "recording_url")) return "hangup";
  if (pick(i, "answer_stamp", "answered_agent", "answered_agent_number", "answered_agent_name", "agent_number")) return "answered";
  return "received";
}

function hangupStatus(i: Record<string, unknown>, answeredBefore: boolean): "ended" | "missed" {
  const st = String(pick(i, "call_status", "status") ?? "").toLowerCase();
  if (/missed|no.?answer|unanswer|busy|fail|cancel/.test(st)) return "missed";
  if (/answer|complete/.test(st)) return "ended";
  const bill = Number(pick(i, "billsec"));
  if (Number.isFinite(bill)) return bill > 0 ? "ended" : "missed";
  if (pick(i, "answer_stamp", "answered_agent_number")) return "ended";
  return answeredBefore ? "ended" : "missed";
}

const ts = (v: string | null) => { if (!v) return null; const d = new Date(v.includes("T") || /[+Z]/.test(v) ? v : v.replace(" ", "T") + "+05:30"); return isNaN(d.getTime()) ? null : d.toISOString(); };

async function handle(request: Request): Promise<Response> {
  const { verifySmartflo, normalizeIndianMobile, dbLookup } = await import("@/lib/telephony/smartflo.server");
  if (!verifySmartflo(request)) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers });
  try {
    const url = new URL(request.url);
    let input: Record<string, unknown> = Object.fromEntries(url.searchParams);
    delete input.token;
    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > 20_000) throw new Error("payload_too_large");
      const ct = request.headers.get("content-type") ?? "";
      input = { ...input, ...(ct.includes("x-www-form-urlencoded") ? Object.fromEntries(new URLSearchParams(raw)) : raw ? JSON.parse(raw) : {}) };
    }
    const callId = pick(input, "call_id", "uuid", "ref_id");
    if (!callId) return new Response(JSON.stringify({ ok: false, error: "missing_call_id" }), { status: 400, headers });
    const ev = detectEvent(input, url.searchParams.get("event"));
    // Log field NAMES only (no values / PII) so real payload shapes can be confirmed in logs.
    console.log(JSON.stringify({ event: "smartflo_call_event", ev, fields: Object.keys(input).sort() }));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;
    let { data: existing } = await db.from("telephony_calls").select("*").eq("call_id", callId).maybeSingle();
    // Outbound (Click-to-Call) rows are pre-created with the Smartflo ref_id before the PBX
    // issues its own call_id — correlate on ref_id (then provider uuid) so the CRM links
    // chosen by the agent are preserved instead of being re-derived from the caller number.
    if (!existing) {
      const refId = pick(input, "ref_id");
      const providerUuid = pick(input, "uuid");
      for (const probe of [refId ? { col: "ref_id", val: refId } : null, providerUuid ? { col: "provider_uuid", val: providerUuid } : null]) {
        if (!probe || existing) continue;
        const { data: m } = await db.from("telephony_calls").select("*")
          .eq("direction", "outbound").eq(probe.col, probe.val)
          .order("started_at", { ascending: false }).limit(1).maybeSingle();
        if (m) existing = m;
      }
    }
    const now = new Date().toISOString();
    const status = ev === "hangup" ? hangupStatus(input, !!existing?.answered_at) : ev === "answered" ? "answered" : "ringing";

    // Idempotent + monotonic: duplicates or out-of-order earlier events never downgrade a call.
    if (existing && (RANK[existing.status] ?? 0) >= RANK[status] && existing.status !== "ringing") {
      return new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200, headers });
    }
    if (existing && existing.status === "ringing" && status === "ringing") {
      return new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200, headers });
    }

    const row: Record<string, unknown> = { call_id: callId, status, last_event: ev, updated_at: now };
    const ref = pick(input, "ref_id"); if (ref) row.ref_id = ref;
    // Pre-linked outbound row: fill in the PBX identifiers, never the CRM relationships.
    if (existing && existing.direction === "outbound" && !existing.provider_uuid) {
      const u = pick(input, "uuid"); if (u) row.provider_uuid = u;
    }
    if (!existing) {
      const rawNum = pick(input, "caller_id_number", "customer_no_with_prefix", "customer_number");
      const mobile = normalizeIndianMobile(rawNum);
      row.provider_uuid = pick(input, "uuid");
      row.caller_number = mobile ?? rawNum;
      row.called_number = pick(input, "call_to_number");
      row.direction = String(pick(input, "direction") ?? "inbound").toLowerCase().includes("out") ? "outbound" : "inbound";
      row.started_at = ts(pick(input, "start_stamp")) ?? now;
      if (mobile) {
        try {
          const m = await dbLookup(mobile);
          Object.assign(row, { customer_id: m.customerId, lead_id: m.leadId, application_id: m.applicationId, employee_id: m.employeeId, agent_id: m.agentId });
        } catch { /* matching is best-effort */ }
      }
    }
    if ((status === "answered" || status === "ended") && !existing?.answered_at) {
      row.answered_at = ts(pick(input, "answer_stamp")) ?? (status === "answered" ? now : null);
    }
    if (status === "ended" || status === "missed") {
      row.ended_at = ts(pick(input, "end_stamp")) ?? now;
      row.hangup_cause = pick(input, "hangup_cause");
      row.recording_url = pick(input, "recording_url");
      const start = existing?.answered_at ?? row.answered_at;
      const d = Number(pick(input, "billsec") ?? pick(input, "duration") ?? NaN);
      row.duration_seconds = Number.isFinite(d) ? Math.round(d) : start ? Math.max(0, Math.round((Date.now() - new Date(String(start)).getTime()) / 1000)) : 0;
    }
    // Existing row (inbound or pre-linked outbound): update in place by primary key so a
    // ref_id-matched outbound call is never duplicated when the PBX sends its own call_id.
    const { error } = existing
      ? await db.from("telephony_calls").update(row).eq("id", existing.id)
      : await db.from("telephony_calls").upsert(row, { onConflict: "call_id" });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e) {
    console.log(JSON.stringify({ event: "smartflo_call_event", error: (e as Error)?.message }));
    return new Response(JSON.stringify({ ok: false }), { status: 200, headers });
  }
}

export const Route = createFileRoute("/api/public/telephony/smartflo/events")({
  server: { handlers: { POST: ({ request }) => handle(request), GET: ({ request }) => handle(request) } },
});
