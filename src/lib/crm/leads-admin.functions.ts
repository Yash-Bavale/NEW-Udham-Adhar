import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { writeAudit, assertRole } from "@/lib/audit";
import { Database } from "@/integrations/supabase/types";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
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
      .select("*, applications!fk_applications_lead(*), lead_notes(*)")
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

export const getLeadCounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin", "support"]);
    const admin = await getAdmin();
    const { data, error } = await admin.from("leads").select("status");
    if (error) throw new Error(error.message);
    const counts: Record<string, number> = { all: data.length };
    for (const r of data) counts[r.status] = (counts[r.status] ?? 0) + 1;
    return { counts };
  });

const AddLeadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Mobile must be a 10-digit Indian number"),
  state: z.string().trim().min(2),
  district: z.string().trim().optional(),
  language: z.string().trim().min(2).default("en"),
  service: z.string().trim().min(2),
  lead_source: z.string().trim().default("manual"),
  base_amount: z.number().nonnegative().default(0),
  gst_amount: z.number().nonnegative().default(0),
  total_amount: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

export const addLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => AddLeadSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin"]);
    const admin = await getAdmin();

    // Match existing customer by mobile, then email.
    const { data: existing } = await admin
      .from("customers")
      .select("id")
      .or(`primary_mobile.eq.${data.mobile},primary_email.eq.${data.email.toLowerCase()}`)
      .maybeSingle();
    const isReturningCustomer = !!existing?.id;

    // Find or create customer via RPC (handles dedupe + bookkeeping).
    const { data: customerId, error: rpcErr } = await admin.rpc("find_or_create_customer", {
      p_name: data.name,
      p_email: data.email,
      p_mobile: data.mobile,
      p_state: data.state,
      p_language: data.language,
    });
    if (rpcErr) throw new Error(rpcErr.message);

    const { notes, district, ...rest } = data;
    const composedNotes = [notes, district ? `District: ${district}` : null].filter(Boolean).join("\n") || null;
    const { data: inserted, error } = await admin
      .from("leads")
      .insert({
        ...rest,
        customer_id: customerId as string,
        notes: composedNotes,
        status: "new_lead",
        lead_status_v2: "new_lead",
      } as never)
      .select("id, lead_code")
      .single();
    if (error) throw new Error(error.message);

    // Log lead_created to application_events (canonical Phase 1 timeline).
    const [{ data: profile }, { data: roleRows }] = await Promise.all([
      admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(),
      admin.from("user_roles").select("role").eq("user_id", context.userId),
    ]);
    const staff_name = profile?.display_name || profile?.email || "Staff";
    const staff_role = roleRows?.[0]?.role ?? "staff";
    await admin.from("application_events").insert({
      lead_id: inserted.id,
      customer_id: customerId as string,
      event_type: "lead_created",
      note: notes ?? null,
      new_value: "new_lead",
      created_by: context.userId,
      staff_name,
      staff_role,
    } as never);

    await writeAudit({
      supabase: context.supabase,
      entityType: "lead",
      entityId: inserted.id,
      action: "create_lead",
      oldValue: null,
      newValue: data,
      actorId: context.userId,
    });

    return {
      id: inserted.id,
      lead_code: inserted.lead_code,
      isReturningCustomer,
    };
  });

const UpdateAssigneeSchema = z.object({
  leadId: z.string().uuid(),
  assignedTo: z.string().uuid().nullable(),
});

export const updateLeadAssignee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpdateAssigneeSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin"]);
    const admin = await getAdmin();
    const { data: prev } = await admin
      .from("leads")
      .select("assigned_to, customer_id")
      .eq("id", data.leadId)
      .single();
    if (!prev) throw new Error("Lead not found");
    const { error } = await admin
      .from("leads")
      .update({ assigned_to: data.assignedTo } as never)
      .eq("id", data.leadId);
    if (error) throw new Error(error.message);

    const [{ data: profile }, { data: roleRows }] = await Promise.all([
      admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(),
      admin.from("user_roles").select("role").eq("user_id", context.userId),
    ]);
    await admin.from("application_events").insert({
      lead_id: data.leadId,
      customer_id: prev.customer_id ?? null,
      event_type: "assignment_change",
      old_value: prev.assigned_to ?? null,
      new_value: data.assignedTo ?? null,
      created_by: context.userId,
      staff_name: profile?.display_name || profile?.email || "Staff",
      staff_role: roleRows?.[0]?.role ?? "staff",
    } as never);

    return { ok: true };
  });
