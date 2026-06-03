import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { writeAudit, assertRole } from "@/lib/audit";

const LeadUpdateSchema = z.object({
  leadId: z.string().uuid(),
  patch: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    mobile: z.string().optional(),
    state: z.string().optional(),
    language: z.string().optional(),
    lead_source: z.string().optional(),
    notes: z.string().optional(),
    assigned_to: z.string().uuid().nullable().optional(),
    remarks: z.string().optional(),
    status: z.string().optional(),
    // Finance fields (super_admin only)
    service: z.string().optional(),
    base_amount: z.number().optional(),
    gst_amount: z.number().optional(),
    total_amount: z.number().optional(),
  }),
});

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LeadUpdateSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { leadId, patch } = data;
    const supabase = context.supabase;

    // Check basic permissions (operations or higher)
    await assertRole(supabase, ["super_admin", "operations", "admin"]);

    // If updating finance fields, check for super_admin
    const financeFields = ["service", "base_amount", "gst_amount", "total_amount"];
    const hasFinanceField = Object.keys(patch).some(k => financeFields.includes(k));
    if (hasFinanceField) {
      await assertRole(supabase, ["super_admin", "finance"]);
    }

    // Get previous state for audit
    const { data: prev, error: fetchErr } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();
    
    if (fetchErr || !prev) throw new Error("Lead not found");

    // Perform update
    const { error: updateErr } = await supabaseAdmin
      .from("leads")
      .update(patch)
      .eq("id", leadId);

    if (updateErr) throw new Error(updateErr.message);

    // Write audit log
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

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, ["super_admin", "operations", "admin"]);
    
    // Get all users with staff roles
    const { data: staffRoles, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["super_admin", "admin", "operations", "support", "finance", "accounts"]);

    if (rolesErr) throw new Error(rolesErr.message);
    const userIds = Array.from(new Set(staffRoles.map(r => r.user_id)));

    // Get profiles for these users
    const { data: profiles, error: profilesErr } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, email")
      .in("id", userIds);

    if (profilesErr) throw new Error(profilesErr.message);

    return { profiles };
  });
