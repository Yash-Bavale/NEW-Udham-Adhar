import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CallView = {
  id: string; callId: string; direction: string; status: string;
  callerNumber: string | null; employeeId: string | null; employeeName: string | null;
  customerId: string | null; leadId: string | null; applicationId: string | null;
  contactName: string | null; orderCode: string | null; serviceName: string | null;
  startedAt: string; answeredAt: string | null; endedAt: string | null;
  durationSeconds: number | null; disposition: string | null;
};

async function enrich(db: any, rows: any[]): Promise<CallView[]> {
  if (!rows.length) return [];
  const ids = (k: string) => Array.from(new Set(rows.map((r) => r[k]).filter(Boolean)));
  const none = ["00000000-0000-0000-0000-000000000000"];
  const [emp, cust, lead, app] = await Promise.all([
    db.from("profiles").select("id, full_name, display_name, email").in("id", ids("employee_id").length ? ids("employee_id") : none),
    db.from("customers").select("id, name").in("id", ids("customer_id").length ? ids("customer_id") : none),
    db.from("leads").select("id, name, lead_code").in("id", ids("lead_id").length ? ids("lead_id") : none),
    db.from("applications").select("id, application_code, service_id").in("id", ids("application_id").length ? ids("application_id") : none),
  ]);
  const svcIds = Array.from(new Set((app.data ?? []).map((a: any) => a.service_id).filter(Boolean)));
  const svc = await db.from("services").select("id, name").in("id", svcIds.length ? svcIds : none);
  const m = (r: any) => new Map((r.data ?? []).map((x: any) => [x.id, x]));
  const E = m(emp), C = m(cust), L = m(lead), A = m(app), S = m(svc);
  return rows.map((r) => {
    const e: any = E.get(r.employee_id); const a: any = A.get(r.application_id);
    return {
      id: r.id, callId: r.call_id, direction: r.direction, status: r.status,
      callerNumber: r.caller_number, employeeId: r.employee_id,
      employeeName: e ? e.full_name || e.display_name || e.email?.split("@")[0] : null,
      customerId: r.customer_id, leadId: r.lead_id, applicationId: r.application_id,
      contactName: (C.get(r.customer_id) as any)?.name ?? (L.get(r.lead_id) as any)?.name ?? null,
      orderCode: a?.application_code ?? null, serviceName: (S.get(a?.service_id) as any)?.name ?? null,
      startedAt: r.started_at, answeredAt: r.answered_at, endedAt: r.ended_at,
      durationSeconds: r.duration_seconds, disposition: r.disposition,
    };
  });
}

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin as any;
}

const STALE_OUTBOUND_MS = 2 * 60_000;

/** Fallback for missing Smartflo events: outbound calls stuck ringing >2 min become 'no_response'.
 *  Guarded by status/answered_at/ended_at filters so it is idempotent and never overrides real events.
 *  'no_response' is unranked in the webhook, so a late real answered/hangup event still applies. */
async function expireStaleOutbound() {
  try {
    await (await admin()).from("telephony_calls")
      .update({ status: "no_response", last_event: "timeout", updated_at: new Date().toISOString() })
      .eq("direction", "outbound").eq("status", "ringing")
      .is("answered_at", null).is("ended_at", null)
      .lt("started_at", new Date(Date.now() - STALE_OUTBOUND_MS).toISOString());
  } catch (e) { console.error("expireStaleOutbound failed", e); }
}

function isStaleOutbound(v: CallView) {
  return v.direction === "outbound" && v.status === "ringing" && !v.answeredAt && !v.endedAt
    && Date.now() - new Date(v.startedAt).getTime() > STALE_OUTBOUND_MS;
}

/** Current employee: live call (ringing/answered) + most recent ended call still needing a disposition. */
export const getMyCallState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await expireStaleOutbound();
    const { data: rows } = await (context.supabase as any).from("telephony_calls").select("*")
      .eq("employee_id", context.userId).gte("started_at", new Date(Date.now() - 12 * 3600_000).toISOString())
      .order("started_at", { ascending: false }).limit(5);
    const views = await enrich(await admin(), rows ?? []);
    return {
      active: views.find((v) => (v.status === "ringing" || v.status === "answered") && !isStaleOutbound(v)) ?? null,
      pendingDisposition: views.find((v) => v.status === "ended" && !v.disposition) ?? null,
    };
  });

export const DISPOSITIONS = ["Customer Query", "Follow-up Required", "Payment Related", "Documents Required", "Technical Issue", "Completed", "Other"] as const;

export const saveCallDisposition = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid(), disposition: z.enum(DISPOSITIONS), notes: z.string().max(2000).optional() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: own } = await (context.supabase as any).from("telephony_calls").select("id").eq("id", data.id).maybeSingle();
    if (!own) throw new Error("Call not found");
    const { error } = await (await admin()).from("telephony_calls").update({
      disposition: data.disposition, disposition_notes: data.notes || null,
      disposition_by: context.userId, disposition_at: new Date().toISOString(),
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin / Super Admin: all live calls (RLS limits non-admins to their own). */
export const listLiveCalls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase as any;
    const [{ data: a }, { data: s }] = await Promise.all([
      sb.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      sb.rpc("has_role", { _user_id: context.userId, _role: "super_admin" }),
    ]);
    if (!a && !s) throw new Error("Unauthorized");
    await expireStaleOutbound();
    const { data: rows } = await sb.from("telephony_calls").select("*")
      .in("status", ["ringing", "answered"]).gte("started_at", new Date(Date.now() - 6 * 3600_000).toISOString())
      .order("started_at", { ascending: false }).limit(100);
    return (await enrich(await admin(), rows ?? [])).filter((v) => !isStaleOutbound(v));
  });
