// Service Workflow Engine — server functions
// Drives the chronological timeline, External Delay popup, Resume, and reminder lifecycle.
// All actions write to workflow_events (timeline) + audit_logs, and may schedule
// workflow_reminders that the cron route (/api/public/cron/workflow-reminders) fires.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole, writeAudit } from "@/lib/audit";

const STAFF = [
  "super_admin", "admin", "manager", "operations", "executive", "support", "finance", "accounts",
] as const;

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function actorName(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", userId)
    .maybeSingle();
  return data?.display_name || data?.email || "Staff";
}

// ───────────────────────── Reads ─────────────────────────

export const listWorkflowEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ applicationId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const { data: rows, error } = await admin
      .from("workflow_events")
      .select("*")
      .eq("application_id", data.applicationId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { events: rows ?? [] };
  });

export const listWorkflowReminders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ applicationId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const { data: rows, error } = await admin
      .from("workflow_reminders")
      .select("*")
      .eq("application_id", data.applicationId)
      .order("due_at", { ascending: true })
      .limit(100);
    if (error) throw new Error(error.message);
    return { reminders: rows ?? [] };
  });

export const listDelayReasons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const { data, error } = await admin
      .from("workflow_delay_reasons")
      .select("code,label,description")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return { reasons: data ?? [] };
  });

export const listClosureReasons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const { data, error } = await admin
      .from("workflow_closure_reasons")
      .select("code,label,description")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return { reasons: data ?? [] };
  });

// ───────────────────────── Writes ─────────────────────────

export const appendWorkflowEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      eventType: z.string().min(1).max(64),
      title: z.string().min(1).max(200),
      description: z.string().max(4000).optional(),
      customerVisible: z.boolean().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const { data: app } = await admin.from("applications").select("lead_id").eq("id", data.applicationId).maybeSingle();
    const name = await actorName(context.supabase, context.userId);
    const { error } = await admin.from("workflow_events").insert({
      application_id: data.applicationId,
      lead_id: app?.lead_id ?? null,
      event_type: data.eventType,
      title: data.title,
      description: data.description ?? null,
      customer_visible: data.customerVisible ?? false,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: data.metadata ?? {},
    } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const PRIORITY = z.enum(["low", "normal", "high", "urgent"]);

export const setExternalDelay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      reasonCode: z.string().min(1).max(64),
      reasonLabel: z.string().min(1).max(160),
      internalNote: z.string().max(4000).optional(),
      customerNote: z.string().max(4000).optional(),
      expectedReviewAt: z.string().min(1),
      priority: PRIORITY.default("normal"),
      kind: z.enum(["external_dependency", "government_portal_pending"]).default("external_dependency"),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const name = await actorName(context.supabase, context.userId);

    const { data: app } = await admin
      .from("applications")
      .select("id, lead_id, application_code, workflow_status")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (!app) throw new Error("Application not found");

    const { data: lead } = await admin
      .from("leads")
      .select("name, email, service, lead_code, assigned_to")
      .eq("id", app.lead_id!)
      .maybeSingle();

    const expectedReviewIso = new Date(data.expectedReviewAt).toISOString();

    // 1) Update application
    const { error: updErr } = await admin
      .from("applications")
      .update({
        workflow_status: data.kind,
        workflow_delay_reason: data.reasonCode,
        workflow_expected_review_at: expectedReviewIso,
        workflow_priority: data.priority,
      } as never)
      .eq("id", app.id);
    if (updErr) throw new Error(updErr.message);

    // 2) Timeline events (internal + customer-visible if note provided)
    const events: any[] = [{
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: "external_delay",
      title: `External delay — ${data.reasonLabel}`,
      description: data.internalNote ?? null,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: {
        reason_code: data.reasonCode,
        priority: data.priority,
        expected_review_at: expectedReviewIso,
        kind: data.kind,
      },
    }];
    if (data.customerNote && data.customerNote.trim()) {
      events.push({
        application_id: app.id,
        lead_id: app.lead_id,
        event_type: "customer_communication",
        title: "Customer-visible delay note",
        description: data.customerNote.trim(),
        customer_visible: true,
        actor_id: context.userId,
        actor_name: name,
        is_system: false,
        metadata: { reason_code: data.reasonCode },
      });
    }
    await admin.from("workflow_events").insert(events as never);

    // 3) Schedule 24-hour review follow-up reminder (assigned to executive)
    const dueAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    await admin.from("workflow_reminders").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      kind: "custom",
      template_code: null,
      due_at: dueAt,
      assigned_to: lead?.assigned_to ?? null,
      status: "pending",
      payload: { type: "review_external_delay", reason: data.reasonCode },
      created_by: context.userId,
    } as never);

    // 4) Schedule 3-day customer email (engine will reschedule 5/7 day on each tick)
    const threeDays = new Date(Date.now() + 3 * 86400 * 1000).toISOString();
    await admin.from("workflow_reminders").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      kind: "followup_3d",
      template_code: "workflow_processing_update_3d",
      due_at: threeDays,
      assigned_to: lead?.assigned_to ?? null,
      status: "pending",
      payload: { reason: data.reasonLabel, customer_email: lead?.email ?? null },
      created_by: context.userId,
    } as never);

    // 5) Immediate "delay notice" email to customer
    if (lead?.email) {
      try {
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
        const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");
        await enqueueFromTemplateInternal(
          "workflow_external_delay_notice",
          lead.email,
          {
            customer_name: lead.name ?? "Customer",
            order_id: app.application_code ?? "",
            service_name: lead.service ?? "",
            reason: data.reasonLabel,
            date: new Date().toLocaleDateString("en-IN"),
            company_name: COMPANY_NAME,
            support_email: SUPPORT_EMAIL,
            customer_note: data.customerNote ?? "",
          },
          { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined, applicationId: app.id },
        );
      } catch (e) {
        console.error("[workflow] delay-notice email failed", e);
      }
    }

    await writeAudit({
      supabase: context.supabase,
      entityType: "application",
      entityId: app.id,
      action: "workflow_external_delay",
      oldValue: { workflow_status: app.workflow_status },
      newValue: { workflow_status: data.kind, reason: data.reasonCode },
      actorId: context.userId,
    });

    return { ok: true };
  });

export const resumeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      note: z.string().max(2000).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const name = await actorName(context.supabase, context.userId);

    const { data: app } = await admin
      .from("applications")
      .select("id, lead_id, workflow_status")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (!app) throw new Error("Application not found");

    // Cancel all pending reminders for this application
    await admin
      .from("workflow_reminders")
      .update({ status: "cancelled" } as never)
      .eq("application_id", app.id)
      .eq("status", "pending");

    await admin
      .from("applications")
      .update({
        workflow_status: "processing_resumed",
        workflow_delay_reason: null,
        workflow_expected_review_at: null,
      } as never)
      .eq("id", app.id);

    await admin.from("workflow_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: "resumed",
      title: "Order resumed",
      description: data.note ?? null,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: {},
    } as never);

    await writeAudit({
      supabase: context.supabase,
      entityType: "application",
      entityId: app.id,
      action: "workflow_resume",
      oldValue: { workflow_status: app.workflow_status },
      newValue: { workflow_status: "processing_resumed" },
      actorId: context.userId,
    });

    return { ok: true };
  });

export const markCustomerReplied = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      summary: z.string().max(2000).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const name = await actorName(context.supabase, context.userId);
    const { data: app } = await admin
      .from("applications")
      .select("id, lead_id")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (!app) throw new Error("Application not found");

    await admin.from("workflow_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: "customer_replied",
      title: "Customer replied",
      description: data.summary ?? null,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: {},
    } as never);

    // Notify assignee through existing notifications table.
    const { data: lead } = await admin.from("leads").select("assigned_to, name, lead_code").eq("id", app.lead_id!).maybeSingle();
    if (lead?.assigned_to) {
      await admin.from("notifications").insert({
        user_id: lead.assigned_to,
        title: "Customer replied",
        body: `${lead.name ?? "Customer"} replied on ${lead.lead_code ?? ""}`,
        kind: "customer_reply",
        link_to: `/admin/orders/${app.id}`,
      } as never);
    }
    return { ok: true };
  });

export const cancelWorkflowReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const { error } = await admin
      .from("workflow_reminders")
      .update({ status: "cancelled" } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
