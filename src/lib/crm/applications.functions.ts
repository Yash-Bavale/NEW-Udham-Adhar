import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { APPLICATION_STATUSES } from "./types";

const ListInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  status: z.enum(APPLICATION_STATUSES as [string, ...string[]]).optional(),
  search: z.string().trim().max(200).optional(),
});

export const listApplications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ListInput.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    let q = supabase
      .from("applications")
      .select(
        "id, application_code, application_status, created_at, assigned_to, lead_id, leads(lead_code, name, email, service), services(service_name)",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data.status) q = q.eq("application_status", data.status);
    if (data.search) {
      const s = data.search.trim();
      q = q.or(`application_code.ilike.%${s}%`);
    }

    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

const UpdateInput = z.object({
  id: z.string().uuid(),
  application_status: z.enum(APPLICATION_STATUSES as [string, ...string[]]).optional(),
  form_status: z.string().max(50).optional(),
  document_status: z.string().max(50).optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

export const updateApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpdateInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { id, ...patch } = data;
    const { error } = await supabase.from("applications").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
