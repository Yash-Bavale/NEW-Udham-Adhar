import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const STATUSES = ["draft", "submitted", "under_review", "awaiting_response", "resolved", "closed"] as const;
const SEVERITIES = ["low", "normal", "high", "critical"] as const;

export const listComplaints = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { status?: string; severity?: string; q?: string }) =>
    z
      .object({
        status: z.string().optional(),
        severity: z.string().optional(),
        q: z.string().optional(),
      })
      .parse(i ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    let q = supabase
      .from("complaints")
      .select(
        "id, complaint_number, status, severity, category, notes, submitted_at, created_at, updated_at, sla_due_at, lead_id, application_id, reminder_count",
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (data.status) q = q.eq("status", data.status);
    if (data.severity) q = q.eq("severity", data.severity);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const leadIds = Array.from(new Set((rows ?? []).map((r) => r.lead_id).filter(Boolean)));
    const appIds = Array.from(new Set((rows ?? []).map((r) => r.application_id).filter(Boolean)));
    const [leadsRes, appsRes] = await Promise.all([
      leadIds.length
        ? supabase.from("leads").select("id, name, email, mobile, service").in("id", leadIds as string[])
        : Promise.resolve({ data: [] as any[] }),
      appIds.length
        ? supabase
            .from("applications")
            .select("id, application_code, application_status")
            .in("id", appIds as string[])
        : Promise.resolve({ data: [] as any[] }),
    ]);
    const leadMap = new Map((leadsRes.data ?? []).map((l: any) => [l.id, l]));
    const appMap = new Map((appsRes.data ?? []).map((a: any) => [a.id, a]));

    const enriched = (rows ?? []).map((r: any) => {
      const lead = leadMap.get(r.lead_id);
      const app = r.application_id ? appMap.get(r.application_id) : null;
      const created = new Date(r.created_at).getTime();
      const daysOpen = Math.max(0, Math.floor((Date.now() - created) / 86_400_000));
      return {
        ...r,
        lead: lead
          ? { id: lead.id, name: lead.name, email: lead.email, mobile: lead.mobile, service: lead.service }
          : null,
        application: app ? { id: app.id, application_code: app.application_code, application_status: app.application_status } : null,
        days_open: daysOpen,
      };
    });

    const text = (data.q || "").trim().toLowerCase();
    const filtered = text
      ? enriched.filter(
          (r: any) =>
            (r.complaint_number || "").toLowerCase().includes(text) ||
            (r.lead?.name || "").toLowerCase().includes(text) ||
            (r.lead?.email || "").toLowerCase().includes(text) ||
            (r.lead?.mobile || "").includes(text) ||
            (r.application?.application_code || "").toLowerCase().includes(text),
        )
      : enriched;

    // counts (over unfiltered set, but using current status/severity filters is fine — keep separate via raw)
    const { data: allRaw } = await supabase
      .from("complaints")
      .select("status, severity")
      .limit(5000);
    const counts: Record<string, number> = { all: (allRaw ?? []).length };
    STATUSES.forEach((s) => (counts[s] = (allRaw ?? []).filter((x: any) => x.status === s).length));

    return { rows: filtered, counts };
  });

export const updateComplaintStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: (typeof STATUSES)[number] }) =>
    z.object({ id: z.string().uuid(), status: z.enum(STATUSES) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const patch: { status: string; resolved_at?: string } = { status: data.status };
    if (data.status === "resolved" || data.status === "closed") {
      patch.resolved_at = new Date().toISOString();
    }
    const { error } = await supabase.from("complaints").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const searchLeadsForComplaint = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { q: string }) => z.object({ q: z.string().min(1) }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const term = `%${data.q}%`;
    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, lead_code, name, email, mobile, service")
      .or(`name.ilike.${term},email.ilike.${term},mobile.ilike.${term},lead_code.ilike.${term}`)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return { leads: leads ?? [] };
  });

export const createComplaint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: {
    lead_id: string;
    category?: string;
    severity?: (typeof SEVERITIES)[number];
    notes: string;
    application_id?: string | null;
  }) =>
    z
      .object({
        lead_id: z.string().uuid(),
        category: z.string().max(120).optional(),
        severity: z.enum(SEVERITIES).optional(),
        notes: z.string().min(1).max(4000),
        application_id: z.string().uuid().nullish(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: inserted, error } = await supabase
      .from("complaints")
      .insert({
        lead_id: data.lead_id,
        application_id: data.application_id ?? null,
        category: data.category ?? null,
        severity: data.severity ?? "normal",
        notes: data.notes,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .select("id, complaint_number")
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  });
