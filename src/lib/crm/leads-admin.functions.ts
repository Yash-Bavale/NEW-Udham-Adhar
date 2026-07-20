import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { writeAudit, assertRole, isUserAdmin } from "@/lib/audit";
import { Database } from "@/integrations/supabase/types";


const STAFF_READ_ROLES: Database["public"]["Enums"]["app_role"][] = [
  "super_admin",
  "operations",
  "admin",
  "support",
  "executive",
  "manager",
  "accounts",
  "finance",
];

const LEAD_WRITE_ROLES: Database["public"]["Enums"]["app_role"][] = [
  "super_admin",
  "operations",
  "admin",
  "manager",
  "executive",
];

const LEAD_FINANCE_WRITE_ROLES: Database["public"]["Enums"]["app_role"][] = [
  "super_admin",
  "admin",
  "finance",
];

const STAFF_MANAGEMENT_ROLES: Database["public"]["Enums"]["app_role"][] = [
  "super_admin",
  "operations",
  "admin",
  "manager",
  "executive",
  "support",
  "accounts",
  "finance",
];

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

    const financeFields = ["service", "base_amount", "gst_amount", "total_amount"];
    const patchKeys = Object.keys(patch);
    const hasFinanceField = patchKeys.some(k => financeFields.includes(k));
    const hasNonFinanceField = patchKeys.some(k => !financeFields.includes(k));

    if (hasNonFinanceField) {
      await assertRole(supabase, LEAD_WRITE_ROLES);
    }
    if (hasFinanceField) {
      await assertRole(supabase, LEAD_FINANCE_WRITE_ROLES);
    }

    const admin = await getAdmin();

    // Completion gate: lead.status="completed" cannot be set manually here.
    // It is set by the fulfillment engine after certificate upload + delivery.
    if (patch.status === "completed") {
      const { data: cur } = await admin.from("leads").select("status").eq("id", leadId).maybeSingle();
      if (cur?.status !== "completed") {
        throw new Error("Cannot mark lead completed manually. Complete the application via the Completion Gate (certificate upload).");
      }
    }
    const { data: prev, error: fetchErr } = await admin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (fetchErr || !prev) throw new Error("Lead not found");

    const { error: updateErr } = await admin
      .from("leads")
      .update(patch)
      .eq("id", leadId);

    if (updateErr) throw new Error(updateErr.message);

    // C1 — log status / assignee changes to the canonical timeline.
    const needStaff =
      (patch.status && patch.status !== prev.status) ||
      (patch.assigned_to !== undefined && patch.assigned_to !== prev.assigned_to);
    if (needStaff) {
      const [{ data: profile }, { data: roleRows }] = await Promise.all([
        admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(),
        admin.from("user_roles").select("role").eq("user_id", context.userId),
      ]);
      const staff_name = profile?.display_name || profile?.email || "Staff";
      const staff_role = roleRows?.[0]?.role ?? "staff";
      if (patch.status && patch.status !== prev.status) {
        await admin.from("application_events").insert({
          lead_id: leadId,
          customer_id: prev.customer_id ?? null,
          event_type: "lead_status_change",
          old_value: prev.status,
          new_value: patch.status,
          created_by: context.userId,
          staff_name, staff_role,
        } as never);
      }
      if (patch.assigned_to !== undefined && patch.assigned_to !== prev.assigned_to) {
        await admin.from("application_events").insert({
          lead_id: leadId,
          customer_id: prev.customer_id ?? null,
          event_type: "assignment_change",
          old_value: prev.assigned_to ?? null,
          new_value: patch.assigned_to ?? null,
          created_by: context.userId,
          staff_name, staff_role,
        } as never);
        if (patch.assigned_to) {
          const { emitToUsers } = await import("@/lib/notifications/emit.server");
          await emitToUsers([patch.assigned_to], {
            kind: "order_assigned",
            title: "New Lead Assigned",
            body: `Lead ${prev.name || prev.lead_code || "New Lead"} has been assigned to your queue.`,
            href: `/admin/leads/${leadId}`,
            entityKind: "lead",
            entityId: leadId,
          });
        }
      }
    }

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
    source: z.string().optional(),
    service: z.string().optional(),
    assignee: z.string().optional(), // uuid | "__unassigned" | "__me"
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, STAFF_READ_ROLES);
    const admin = await getAdmin();
    const isAdmin = await isUserAdmin(context.supabase, context.userId);

    let query = admin.from("leads").select("*", { count: "exact" });

    if (data.status) query = query.eq("status", data.status);
    if (data.source) query = query.ilike("lead_source", data.source);
    if (data.service) query = query.eq("service", data.service);
    if (!isAdmin) {
      query = query.eq("assigned_to", context.userId);
    } else {
      if (data.assignee === "__unassigned") query = query.is("assigned_to", null);
      else if (data.assignee === "__me") query = query.eq("assigned_to", context.userId);
      else if (data.assignee) query = query.eq("assigned_to", data.assignee);
    }
    if (data.dateFrom) query = query.gte("created_at", new Date(data.dateFrom).toISOString());
    if (data.dateTo) {
      const to = new Date(data.dateTo); to.setDate(to.getDate() + 1);
      query = query.lt("created_at", to.toISOString());
    }
    if (data.search) {
      query = query.or(
        `name.ilike.%${data.search}%,email.ilike.%${data.search}%,mobile.ilike.%${data.search}%,lead_code.ilike.%${data.search}%`
      );
    }

    const { data: rows, count, error } = await query
      .order("created_at", { ascending: false })
      .range((data.page - 1) * data.pageSize, data.page * data.pageSize - 1);

    if (error) throw new Error(error.message);

    // C6 — attach assignee profile so the table can show a name, not a UUID.
    const assigneeIds = Array.from(new Set((rows ?? []).map((r: any) => r.assigned_to).filter(Boolean)));
    let profilesById: Record<string, { display_name: string | null; email: string | null }> = {};
    if (assigneeIds.length) {
      const { data: profs } = await admin
        .from("profiles")
        .select("id, display_name, email")
        .in("id", assigneeIds as string[]);
      profilesById = Object.fromEntries((profs ?? []).map((p: any) => [p.id, p]));
    }
    // Pull latest application + onboarding form status for each lead
    const leadIdsRaw = (rows ?? []).map((r: any) => r.id).filter(Boolean) as string[];
    let appsByLead: Record<string, { form_status: string | null }> = {};
    if (leadIdsRaw.length) {
      const { data: apps } = await admin
        .from("applications")
        .select("lead_id, form_status, created_at")
        .in("lead_id", leadIdsRaw)
        .order("created_at", { ascending: false });
      for (const a of apps ?? []) {
        const lid = (a as any).lead_id as string;
        if (!appsByLead[lid]) appsByLead[lid] = { form_status: (a as any).form_status ?? null };
      }
    }

    const enriched = (rows ?? []).map((r: any) => ({
      ...r,
      assignee_name: r.assigned_to
        ? (profilesById[r.assigned_to]?.display_name || profilesById[r.assigned_to]?.email || null)
        : null,
      form_status: appsByLead[r.id]?.form_status ?? null,
    }));

    return { rows: enriched, total: count || 0 };
  });

export const getLead = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, STAFF_READ_ROLES);
    const admin = await getAdmin();
    const isAdmin = await isUserAdmin(context.supabase, context.userId);

    let query = admin
      .from("leads")
      .select("*, applications!fk_applications_lead(*), lead_notes(*)")
      .eq("id", data.id);
    if (!isAdmin) {
      query = query.eq("assigned_to", context.userId);
    }
    const { data: lead, error } = await query.single();

    if (error || !lead) throw new Error("Lead not found");

    let assignee_name: string | null = null;
    if ((lead as any).assigned_to) {
      const { data: p } = await admin
        .from("profiles")
        .select("display_name, email")
        .eq("id", (lead as any).assigned_to)
        .maybeSingle();
      assignee_name = p?.display_name || p?.email || null;
    }

    return {
      lead: { ...lead, assignee_name },
      applications: (lead as any).applications ?? [],
      notes: (lead as any).lead_notes ?? [],
    };
  });

// Fetch a lead by code (e.g. "LD-1234") OR uuid so the Add-Lead dialog can
// prefill from an existing customer profile.
export const findLeadByCodeOrId = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ query: z.string().min(2).max(64) }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, STAFF_READ_ROLES);
    const admin = await getAdmin();
    const q = data.query.trim();
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let row: any = null;
    if (uuidRe.test(q)) {
      const { data: r } = await admin.from("leads").select("*").eq("id", q).maybeSingle();
      row = r;
    }
    if (!row) {
      const { data: r } = await admin.from("leads").select("*").ilike("lead_code", q).maybeSingle();
      row = r;
    }
    if (!row) {
      const { data: rs } = await admin.from("leads")
        .select("*")
        .or(`mobile.eq.${q},email.ilike.${q}`)
        .order("created_at", { ascending: false })
        .limit(1);
      row = rs?.[0] ?? null;
    }
    if (!row) throw new Error("No lead found for that ID / code / mobile / email");
    return { lead: row };
  });

export const addLeadNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ lead_id: z.string().uuid(), note: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, STAFF_READ_ROLES);
    const admin = await getAdmin();
    const { error } = await admin
      .from("lead_notes")
      .insert({ lead_id: data.lead_id, note: data.note, user_id: context.userId });
    if (error) throw new Error(error.message);

    // C2 — also record to canonical timeline so the Timeline tab shows notes.
    const { data: lead } = await admin
      .from("leads").select("customer_id").eq("id", data.lead_id).maybeSingle();
    const [{ data: profile }, { data: roleRows }] = await Promise.all([
      admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(),
      admin.from("user_roles").select("role").eq("user_id", context.userId),
    ]);
    await admin.from("application_events").insert({
      lead_id: data.lead_id,
      customer_id: lead?.customer_id ?? null,
      event_type: "note_added",
      note: data.note,
      created_by: context.userId,
      staff_name: profile?.display_name || profile?.email || "Staff",
      staff_role: roleRows?.[0]?.role ?? "staff",
    } as never);

    return { ok: true };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, STAFF_MANAGEMENT_ROLES);
    
    const { data: staffRoles, error: rolesErr } = await (await getAdmin())
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["super_admin", "admin", "operations", "manager", "executive", "support", "finance", "accounts"]);

    if (rolesErr) throw new Error(rolesErr.message);
    const userIds = Array.from(new Set((staffRoles ?? []).map(r => r.user_id)));

    if (userIds.length === 0) return { profiles: [] };

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
    await assertRole(context.supabase, STAFF_READ_ROLES);
    const admin = await getAdmin();
    const isAdmin = await isUserAdmin(context.supabase, context.userId);

    // Paginate beyond PostgREST's 1000-row cap to get true counts per status.
    const counts: Record<string, number> = { all: 0 };
    const pageSize = 1000;
    for (let from = 0; from < 500_000; from += pageSize) {
      let q = admin.from("leads").select("status");
      if (!isAdmin) {
        q = q.eq("assigned_to", context.userId);
      }
      const { data, error } = await q.range(from, from + pageSize - 1);
      if (error) throw new Error(error.message);
      const rows = data ?? [];
      counts.all += rows.length;
      for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
      if (rows.length < pageSize) break;
    }
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
    await assertRole(context.supabase, LEAD_WRITE_ROLES);
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
    await assertRole(context.supabase, ["super_admin", "operations", "admin", "manager"]);
    const admin = await getAdmin();
    const { data: prev } = await admin
      .from("leads")
      .select("assigned_to, customer_id, name, lead_code")
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

    if (data.assignedTo) {
      const { emitToUsers } = await import("@/lib/notifications/emit.server");
      await emitToUsers([data.assignedTo], {
        kind: "order_assigned",
        title: "New Lead Assigned",
        body: `Lead ${prev.name || prev.lead_code || "New Lead"} has been assigned to your queue.`,
        href: `/admin/leads/${data.leadId}`,
        entityKind: "lead",
        entityId: data.leadId,
      });
    }

    return { ok: true };
  });
