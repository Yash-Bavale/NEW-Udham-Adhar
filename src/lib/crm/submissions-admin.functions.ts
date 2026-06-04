import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        status: z.string().max(40).optional(),
        service_code: z.string().max(80).optional(),
        search: z.string().max(120).optional(),
        limit: z.number().int().min(1).max(200).default(100),
      })
      .parse(i ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    let q = supabase
      .from("onboarding_submissions")
      .select(
        "id, service_code, status, submitted_at, created_at, updated_at, application_id, lead_id",
      )
      .order("submitted_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    if (data.service_code) q = q.eq("service_code", data.service_code);
    const { data: subs, error } = await q;
    if (error) throw new Error(error.message);

    const leadIds = Array.from(new Set((subs ?? []).map((s) => s.lead_id).filter(Boolean)));
    const appIds = Array.from(
      new Set((subs ?? []).map((s) => s.application_id).filter(Boolean)),
    ) as string[];

    const [{ data: leads }, { data: apps }] = await Promise.all([
      leadIds.length
        ? supabase
            .from("leads")
            .select("id, name, email, mobile, lead_code, status, customer_id, service")
            .in("id", leadIds)
        : Promise.resolve({ data: [] as any[] }),
      appIds.length
        ? supabase
            .from("applications")
            .select("id, application_code, application_status, form_status, document_status")
            .in("id", appIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const leadMap = new Map((leads ?? []).map((l: any) => [l.id, l]));
    const appMap = new Map((apps ?? []).map((a: any) => [a.id, a]));

    let rows = (subs ?? []).map((s) => ({
      ...s,
      lead: leadMap.get(s.lead_id) ?? null,
      application: s.application_id ? appMap.get(s.application_id) ?? null : null,
    }));

    if (data.search) {
      const q = data.search.toLowerCase();
      rows = rows.filter((r: any) => {
        const l = r.lead;
        return (
          l?.name?.toLowerCase().includes(q) ||
          l?.email?.toLowerCase().includes(q) ||
          l?.mobile?.includes(q) ||
          l?.lead_code?.toLowerCase().includes(q) ||
          r.application?.application_code?.toLowerCase().includes(q)
        );
      });
    }
    return { rows };
  });

export const getSubmission = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: sub, error } = await supabase
      .from("onboarding_submissions")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const [
      { data: lead },
      { data: app },
      { data: schema },
      { data: workflow },
      { data: docs },
    ] = await Promise.all([
      supabase.from("leads").select("*").eq("id", sub.lead_id).maybeSingle(),
      sub.application_id
        ? supabase.from("applications").select("*").eq("id", sub.application_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("service_form_schemas")
        .select("*")
        .eq("service_code", sub.service_code)
        .eq("is_active", true)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("service_workflows")
        .select("*")
        .eq("service_code", sub.service_code)
        .eq("is_active", true)
        .maybeSingle(),
      sub.application_id
        ? supabase
            .from("documents")
            .select("*")
            .eq("application_id", sub.application_id)
            .order("uploaded_at", { ascending: false })
        : supabase
            .from("documents")
            .select("*")
            .eq("lead_id", sub.lead_id)
            .order("uploaded_at", { ascending: false }),
    ]);

    const customer = lead?.customer_id
      ? (
          await supabase.from("customers").select("*").eq("id", lead.customer_id).maybeSingle()
        ).data
      : null;

    return {
      submission: sub,
      lead: lead ?? null,
      customer,
      application: app ?? null,
      formSchema: schema ?? null,
      workflow: workflow ?? null,
      documents: docs ?? [],
    };
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["draft", "submitted", "approved", "rejected", "needs_changes"]),
        notes: z.string().max(2000).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const patch: { status: string; updated_at: string; submitted_at?: string } = {
      status: data.status,
      updated_at: new Date().toISOString(),
    };
    if (data.status === "submitted") patch.submitted_at = new Date().toISOString();
    const { error } = await supabase
      .from("onboarding_submissions")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    if (data.notes) {
      const { data: sub } = await supabase
        .from("onboarding_submissions")
        .select("lead_id")
        .eq("id", data.id)
        .maybeSingle();
      if (sub?.lead_id) {
        await supabase.from("activity_logs").insert({
          lead_id: sub.lead_id,
          activity_type: "submission_reviewed",
          activity_description: `Submission ${data.status}: ${data.notes}`,
        });
      }
    }
    return { ok: true };
  });
