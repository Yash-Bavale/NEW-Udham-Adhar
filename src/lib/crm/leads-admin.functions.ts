import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LEAD_STATUSES } from "./types";

const ListInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  search: z.string().trim().max(200).optional(),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional(),
  assignedTo: z.string().uuid().optional(),
});

export const listLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    let q = supabase
      .from("leads")
      .select(
        "id, lead_code, name, email, mobile, state, language, service, status, assigned_to, created_at, total_amount",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data.status) q = q.eq("status", data.status);
    if (data.assignedTo) q = q.eq("assigned_to", data.assignedTo);
    if (data.search) {
      const s = data.search.replace(/[,()]/g, " ").trim();
      q = q.or(
        `lead_code.ilike.%${s}%,name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%`,
      );
    }

    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);

    return { rows: rows ?? [], total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

export const getLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [leadRes, appsRes, notesRes, activityRes] = await Promise.all([
      supabase.from("leads").select("*").eq("id", data.id).single(),
      supabase
        .from("applications")
        .select("id, application_code, application_status, service_id, assigned_to, created_at, updated_at")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("lead_notes")
        .select("id, note, user_id, created_at")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activity_logs")
        .select("id, activity_type, activity_description, user_id, created_at")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    if (leadRes.error) throw new Error(leadRes.error.message);

    return {
      lead: leadRes.data,
      applications: appsRes.data ?? [],
      notes: notesRes.data ?? [],
      activity: activityRes.data ?? [],
    };
  });

const UpdateLeadInput = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  remarks: z.string().max(2000).nullable().optional(),
});

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpdateLeadInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { id, ...patch } = data;
    const { error } = await supabase.from("leads").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const AddNoteInput = z.object({
  lead_id: z.string().uuid(),
  note: z.string().trim().min(1).max(2000),
});

export const addLeadNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => AddNoteInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: data.lead_id, note: data.note, user_id: userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
