import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { writeAudit, assertRole } from "@/lib/audit";
import { Database } from "@/integrations/supabase/types";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.(await getAdmin());
}


const LEAD_STATUS_ENUM = [
  "new_lead",
  "contacted",
  "payment_pending",
  "payment_successful",
  "under_process",
  "completed",
  "closed",
  "refund_requested",
  "lead_created",
  "details_pending",
  "documents_pending",
  "under_review"
] as const;

const LeadUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUS_ENUM).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  state: z.string().optional(),
  language: z.string().optional(),
  lead_source: z.string().optional(),
  notes: z.string().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  remarks: z.string().optional(),
  service: z.string().optional(),
  base_amount: z.number().optional(),
  gst_amount: z.number().optional(),
  total_amount: z.number().optional(),
});

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LeadUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id: leadId, ...patch } = data;
    const supabase = context.supabase;

    await assertRole(supabase, ["super_admin", "operations", "admin"]);

    const financeFields = ["service", "base_amount", "gst_amount", "total_amount"];
    const hasFinanceField = Object.keys(patch).some(k => financeFields.includes(k));
    if (hasFinanceField) {
      await assertRole(supabase, ["super_admin", "finance"]);
    }

    const { data: prev, error: fetchErr } = await (await getAdmin())
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();
    
    if (fetchErr || !prev) throw new Error("Lead not found");

    const { error: updateErr } = await (await getAdmin())
      .from("leads")
      .update(patch)
      .eq("id", leadId);

    if (updateErr) throw new Error(updateErr.message);

    await writeAudit({
      supabase,
      entityType: "lead",
      entityId: leadId,
      action: "update_lead",
      oldValue: prev,
      newValue: { ...prev, ...patch },
      actorId: context.userId,
    });

    return { ok: true };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    page: z.number().default(1),
    pageSize: z.number().default(25),
    search: z.string().optional(),
    status: z.enum(LEAD_STATUS_ENUM).optional(),
  }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin", "support"]);
    
    let query = (await getAdmin())
      .from("leads")
      .select("*", { count: "exact" });

    if (data.status) {
      query = query.eq("status", data.status);
    }

    if (data.search) {
      query = query.or(`name.ilike.%${data.search}%,email.ilike.%${data.search}%,mobile.ilike.%${data.search}%,lead_code.ilike.%${data.search}%`);
    }

    const { data: rows, count, error } = await query
      .order("created_at", { ascending: false })
      .range((data.page - 1) * data.pageSize, data.page * data.pageSize - 1);

    if (error) throw new Error(error.message);
    return { rows: rows || [], total: count || 0 };
  });

export const getLead = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin", "support"]);
    
    const { data: lead, error } = await (await getAdmin())
      .from("leads")
      .select("*, applications(*), lead_notes(*)")
      .eq("id", data.id)
      .single();

    if (error || !lead) throw new Error("Lead not found");

    return { 
      lead, 
      applications: lead.applications ?? [], 
      notes: lead.lead_notes ?? [] 
    };
  });

export const addLeadNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ lead_id: z.string().uuid(), note: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin", "support"]);
    
    const { error } = await (await getAdmin())
      .from("lead_notes")
      .insert({
        lead_id: data.lead_id,
        note: data.note,
        user_id: context.userId,
      });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin"]);
    
    const { data: staffRoles, error: rolesErr } = await (await getAdmin())
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["super_admin", "admin", "operations", "support", "finance", "accounts"]);

    if (rolesErr) throw new Error(rolesErr.message);
    const userIds = Array.from(new Set(staffRoles.map(r => r.user_id)));

    const { data: profiles, error: profilesErr } = await (await getAdmin())
      .from("profiles")
      .select("id, display_name, email")
      .in("id", userIds);

    if (profilesErr) throw new Error(profilesErr.message);

    return { profiles };
  });
