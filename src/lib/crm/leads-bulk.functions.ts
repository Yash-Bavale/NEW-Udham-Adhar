import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LEAD_STATUSES, type LeadStatus } from "./types";
import { enqueueFromTemplateInternal } from "@/lib/emails/emails.server";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.(await getAdmin());
}


// ─────────────────────── helpers ───────────────────────

async function assertOps(userId: string) {
  const { data } = await (await getAdmin())
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "super_admin", "operations"]);
  if (!data || data.length === 0) throw new Error("Forbidden: ops access required.");
}

async function assertAdmin(userId: string) {
  const { data } = await (await getAdmin())
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "super_admin"]);
  if (!data || data.length === 0) throw new Error("Forbidden: admin access required.");
}

async function logAudit(actorId: string, action: string, entityIds: string[], extra: Record<string, unknown> = {}) {
  await (await getAdmin()).from("audit_logs").insert({
    actor_id: actorId,
    entity_type: "lead",
    entity_id: entityIds.length === 1 ? entityIds[0] : `${entityIds.length} leads`,
    action,
    new_value: { ...extra, ids: entityIds.slice(0, 50) } as never,
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ─────────────────────── bulk status / assign / delete ───────────────────────

const IdsStatusInput = z.object({
  ids: z.array(z.string().uuid()).min(1).max(2000),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]),
});

export const bulkUpdateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdsStatusInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertOps(context.userId);
    let updated = 0;
    for (const batch of chunk(data.ids, 200)) {
      const { error, count } = await (await getAdmin())
        .from("leads")
        .update({ status: data.status as LeadStatus }, { count: "exact" })
        .in("id", batch);
      if (error) throw new Error(error.message);
      updated += count ?? 0;
    }
    await logAudit(context.userId, "leads.bulk_status", data.ids, { status: data.status, updated });
    return { updated };
  });

const IdsAssignInput = z.object({
  ids: z.array(z.string().uuid()).min(1).max(2000),
  assignee: z.string().uuid().nullable(),
});

export const bulkAssignLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdsAssignInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertOps(context.userId);
    let updated = 0;
    for (const batch of chunk(data.ids, 200)) {
      const { error, count } = await (await getAdmin())
        .from("leads")
        .update({ assigned_to: data.assignee }, { count: "exact" })
        .in("id", batch);
      if (error) throw new Error(error.message);
      updated += count ?? 0;
    }
    await logAudit(context.userId, "leads.bulk_assign", data.ids, { assignee: data.assignee, updated });
    return { updated };
  });

const IdsInput = z.object({ ids: z.array(z.string().uuid()).min(1).max(500) });

export const bulkDeleteLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => IdsInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    // Block delete if any selected lead has a payment row (financial record).
    const { data: paid } = await (await getAdmin())
      .from("payments")
      .select("lead_id")
      .in("lead_id", data.ids);
    const blocked = new Set((paid ?? []).map((p) => p.lead_id as string));
    const safe = data.ids.filter((id) => !blocked.has(id));

    let deleted = 0;
    for (const batch of chunk(safe, 200)) {
      // Best-effort related rows first (no FK cascades exist).
      await (await getAdmin()).from("documents").delete().in("lead_id", batch);
      await (await getAdmin()).from("onboarding_submissions").delete().in("lead_id", batch);
      await (await getAdmin()).from("applications").delete().in("lead_id", batch);
      await (await getAdmin()).from("activity_logs").delete().in("lead_id", batch);
      await (await getAdmin()).from("lead_notes").delete().in("lead_id", batch);
      const { error, count } = await (await getAdmin())
        .from("leads")
        .delete({ count: "exact" })
        .in("id", batch);
      if (error) throw new Error(error.message);
      deleted += count ?? 0;
    }

    await logAudit(context.userId, "leads.bulk_delete", data.ids, {
      deleted,
      blocked_with_payments: blocked.size,
    });
    return { deleted, blocked: blocked.size };
  });

// ─────────────────────── bulk email ───────────────────────

const BulkEmailInput = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  templateCode: z.string().min(1).max(80),
});

export const bulkEmailLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => BulkEmailInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertOps(context.userId);

    const { data: leads, error } = await (await getAdmin())
      .from("leads")
      .select("id, name, email, lead_code, mobile, service, total_amount")
      .in("id", data.ids);
    if (error) throw new Error(error.message);

    const { data: suppressed } = await (await getAdmin()).from("suppressed_emails").select("email");
    const suppressedSet = new Set((suppressed ?? []).map((s) => (s.email as string).toLowerCase()));

    let queued = 0;
    let skipped = 0;
    let failed = 0;
    for (const lead of leads ?? []) {
      const email = (lead.email as string | null)?.toLowerCase();
      if (!email) { skipped++; continue; }
      if (suppressedSet.has(email)) { skipped++; continue; }
      try {
        await enqueueFromTemplateInternal(
          data.templateCode,
          email,
          {
            name: lead.name,
            lead_code: lead.lead_code,
            mobile: lead.mobile,
            service: lead.service,
            total_amount: lead.total_amount,
          },
          { toName: lead.name as string, leadId: lead.id as string },
        );
        queued++;
      } catch {
        failed++;
      }
    }

    await logAudit(context.userId, "leads.bulk_email", data.ids, {
      template: data.templateCode, queued, skipped, failed,
    });
    return { queued, skipped, failed };
  });

// ─────────────────────── CSV export ───────────────────────

const ExportInput = z.object({
  search: z.string().max(200).optional(),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional(),
  assignedTo: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
}).partial();

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export const exportLeadsCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ExportInput.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertOps(context.userId);

    let q = (await getAdmin())
      .from("leads")
      .select(
        "id, lead_code, created_at, name, email, mobile, state, language, service, status, base_amount, gst_amount, total_amount, assigned_to, lead_source",
      )
      .order("created_at", { ascending: false })
      .limit(50000);

    if (data.status) q = q.eq("status", data.status as LeadStatus);
    if (data.assignedTo) q = q.eq("assigned_to", data.assignedTo);
    if (data.dateFrom) q = q.gte("created_at", data.dateFrom);
    if (data.dateTo) q = q.lte("created_at", data.dateTo);
    if (data.search) {
      const s = data.search.replace(/[,()]/g, " ").trim();
      q = q.or(`lead_code.ilike.%${s}%,name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%`);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    // Resolve assignee display names from profiles.
    const assigneeIds = Array.from(new Set((rows ?? []).map((r) => r.assigned_to).filter(Boolean) as string[]));
    const nameMap = new Map<string, string>();
    if (assigneeIds.length) {
      const { data: profs } = await (await getAdmin())
        .from("profiles")
        .select("id, display_name, email")
        .in("id", assigneeIds);
      (profs ?? []).forEach((p) => nameMap.set(p.id as string, (p.display_name as string) || (p.email as string) || ""));
    }

    const header = [
      "lead_code","created_at","name","email","mobile","state","language",
      "service","status","base_amount","gst_amount","total_amount",
      "assigned_to","lead_source",
    ];
    const lines = [header.join(",")];
    for (const r of rows ?? []) {
      lines.push([
        r.lead_code, r.created_at, r.name, r.email, r.mobile, r.state, r.language,
        r.service, r.status, r.base_amount, r.gst_amount, r.total_amount,
        r.assigned_to ? (nameMap.get(r.assigned_to as string) ?? "") : "",
        r.lead_source,
      ].map(csvEscape).join(","));
    }

    await logAudit(context.userId, "leads.export_csv", (rows ?? []).map((r) => r.id as string), {
      count: rows?.length ?? 0,
      filter: data,
    });

    return { csv: lines.join("\n"), count: rows?.length ?? 0 };
  });

// ─────────────────────── template list (for email dialog) ───────────────────────

export const listEnabledTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("email_templates")
      .select("code, name, subject, is_enabled")
      .eq("is_enabled", true)
      .order("name");
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

// ─────────────────────── assignable staff list ───────────────────────

export const listAssignableStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOps(context.userId);
    const { data: roles } = await (await getAdmin())
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "super_admin", "operations", "support"]);
    const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id as string)));
    if (ids.length === 0) return { rows: [] };
    const { data: profs } = await (await getAdmin())
      .from("profiles")
      .select("id, display_name, email")
      .in("id", ids)
      .eq("is_active", true);
    return {
      rows: (profs ?? []).map((p) => ({
        id: p.id as string,
        name: (p.display_name as string) || (p.email as string) || "(unnamed)",
        email: p.email as string,
      })),
    };
  });
