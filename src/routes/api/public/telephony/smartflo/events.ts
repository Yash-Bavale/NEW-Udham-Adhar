import { createFileRoute } from "@tanstack/react-router";

/**
 * Smartflo call-event webhook (separate from the API Dialplan, which is untouched).
 * Configure in Smartflo as webhooks for: call received, call answered, call hangup.
 * Records/updates one row per call in telephony_calls for the CRM call panel.
 */
const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };

function mapStatus(input: Record<string, unknown>, path: string | null): string {
  const raw = String(input.event ?? input.call_status ?? input.status ?? path ?? "").toLowerCase();
  if (/hang|end|complete|disconnect|missed|noanswer|no_answer|busy|fail/.test(raw)) {
    if (/missed|noanswer|no_answer|busy|fail/.test(raw)) return "missed";
    return "ended";
  }
  if (/answer|connect|bridge/.test(raw)) return "answered";
  return "ringing";
}

async function handle(request: Request): Promise<Response> {
  const { verifySmartflo, normalizeIndianMobile, dbLookup } = await import("@/lib/telephony/smartflo.server");
  if (!verifySmartflo(request)) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers });
  try {
    const url = new URL(request.url);
    let input: Record<string, unknown> = Object.fromEntries(url.searchParams);
    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > 20_000) throw new Error("payload_too_large");
      const ct = request.headers.get("content-type") ?? "";
      input = { ...input, ...(ct.includes("x-www-form-urlencoded") ? Object.fromEntries(new URLSearchParams(raw)) : raw ? JSON.parse(raw) : {}) };
    }
    const callId = String(input.call_id ?? input.uuid ?? "").trim();
    if (!callId) return new Response(JSON.stringify({ ok: false, error: "missing_call_id" }), { status: 400, headers });
    const status = mapStatus(input, url.searchParams.get("event"));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;
    const { data: existing } = await db.from("telephony_calls").select("*").eq("call_id", callId).maybeSingle();
    const now = new Date().toISOString();
    const row: Record<string, unknown> = { call_id: callId, status, updated_at: now };
    if (!existing) {
      const mobile = normalizeIndianMobile(input.caller_id_number);
      row.provider_uuid = input.uuid ? String(input.uuid) : null;
      row.caller_number = mobile ?? (input.caller_id_number ? String(input.caller_id_number) : null);
      row.called_number = input.call_to_number ? String(input.call_to_number) : null;
      row.direction = String(input.direction ?? "inbound").toLowerCase().includes("out") ? "outbound" : "inbound";
      if (mobile) {
        try {
          const m = await dbLookup(mobile);
          Object.assign(row, { customer_id: m.customerId, lead_id: m.leadId, application_id: m.applicationId, employee_id: m.employeeId, agent_id: m.agentId });
        } catch { /* matching is best-effort */ }
      }
    } else if (existing.status === "ended" || existing.status === "missed") {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }
    if (status === "answered" && !existing?.answered_at) row.answered_at = now;
    if (status === "ended" || status === "missed") {
      row.ended_at = now;
      const start = existing?.answered_at ?? row.answered_at;
      const d = Number(input.duration ?? input.billsec ?? NaN);
      row.duration_seconds = Number.isFinite(d) ? Math.round(d) : start ? Math.round((Date.now() - new Date(String(start)).getTime()) / 1000) : 0;
    }
    const { error } = await db.from("telephony_calls").upsert(row, { onConflict: "call_id" });
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
