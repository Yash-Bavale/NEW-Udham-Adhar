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
      .select("code,label,description,side,email_template_code")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return { reasons: (data ?? []) as Array<{ code: string; label: string; description: string | null; side: "customer" | "internal"; email_template_code: string | null }> };
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
      .select("name, email, mobile, service, lead_code, assigned_to, created_at")
      .eq("id", app.lead_id!)
      .maybeSingle();

    const { data: latestInvoice } = await admin
      .from("invoices")
      .select("invoice_number, issued_at")
      .eq("lead_id", app.lead_id!)
      .order("issued_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const fmtIST = (d: Date) =>
      d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST";
    const holdNowIst = fmtIST(new Date());
    const expectedIst = data.expectedReviewAt ? fmtIST(new Date(data.expectedReviewAt)) : "";
    const orderCreatedIst = (lead as any)?.created_at ? fmtIST(new Date((lead as any).created_at)) : "";

    // Load the full reason row (side + optional template override).
    const { data: reasonRow } = await admin
      .from("workflow_delay_reasons")
      .select("code,label,description,side,email_template_code")
      .eq("code", data.reasonCode)
      .maybeSingle();
    const side: "customer" | "internal" = ((reasonRow as { side?: string } | null)?.side === "internal") ? "internal" : "customer";
    const reasonBlock = ((reasonRow as { description?: string } | null)?.description) || data.reasonLabel;
    const defaultTplForSide = side === "internal" ? "bhs_e004_our_side_delay" : "bhs_e003_customer_delay";
    const customerTplCode = ((reasonRow as { email_template_code?: string } | null)?.email_template_code) || defaultTplForSide;
    const holdStatusLabel = ((reasonRow as { label?: string } | null)?.label) || data.reasonLabel;

    const expectedReviewIso = new Date(data.expectedReviewAt).toISOString();

    // Derive workflow_status from the reason side; the client-provided `kind` is ignored
    // to guarantee UI and backend stay in sync with the reason's classification.
    const workflowStatus = side === "internal" ? "government_portal_pending" : "waiting_for_customer";

    const { error: updErr } = await admin
      .from("applications")
      .update({
        workflow_status: workflowStatus,
        workflow_delay_reason: data.reasonCode,
        workflow_expected_review_at: expectedReviewIso,
        workflow_priority: data.priority,
      } as never)
      .eq("id", app.id);
    if (updErr) throw new Error(updErr.message);

    // Timeline events (internal always; customer-visible only for customer-side w/ note).
    const events: any[] = [{
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: side === "internal" ? "internal_delay" : "external_delay",
      title: `${side === "internal" ? "Internal / our-side delay" : "Customer-side delay"} — ${data.reasonLabel}`,
      description: data.internalNote ?? null,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: {
        reason_code: data.reasonCode,
        side,
        priority: data.priority,
        expected_review_at: expectedReviewIso,
      },
    }];
    if (side === "customer" && data.customerNote && data.customerNote.trim()) {
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

    if (side === "customer") {
      // ── Customer-side: 1st intimation email now + auto-closure in 8 business hours ──
      const { addBusinessSeconds, DEFAULT_BUSINESS_HOURS } = await import("@/lib/scheduling/business-hours");
      let cfg = DEFAULT_BUSINESS_HOURS;
      try {
        const { data: bh } = await admin.from("business_hours_config").select("*").limit(1).maybeSingle();
        if (bh) {
          cfg = {
            timezone: (bh as any).timezone ?? cfg.timezone,
            openTime: (bh as any).open_time ?? cfg.openTime,
            closeTime: (bh as any).close_time ?? cfg.closeTime,
            workingDays: (bh as any).working_days ?? cfg.workingDays,
            holidays: (bh as any).holidays ?? cfg.holidays,
          } as typeof cfg;
        }
      } catch { /* fall back to defaults */ }

      const closureDueAt = addBusinessSeconds(new Date(), 8 * 3600, cfg).toISOString();

      await admin.from("workflow_reminders").insert({
        application_id: app.id,
        lead_id: app.lead_id,
        kind: "pending_closure_followup",
        template_code: "order_closure_confirmation",
        due_at: closureDueAt,
        assigned_to: lead?.assigned_to ?? null,
        status: "pending",
        payload: {
          reason: data.reasonLabel,
          reason_block: reasonBlock,
          closure_reason: data.reasonLabel,
          employee_remarks: (data.internalNote ?? data.customerNote ?? "").toString().trim() || "—",
          customer_email: lead?.email ?? null,
        },
        created_by: context.userId,
      } as never);

      if (lead?.email) {
        try {
          const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
          const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");
          await enqueueFromTemplateInternal(
            customerTplCode,
            lead.email,
            {
              customer_name: lead.name ?? "Customer",
              customer_email: lead.email ?? "",
              customer_mobile: (lead as any).mobile ?? "",
              order_id: app.application_code ?? "",
              order_number: app.application_code ?? "",
              service_name: lead.service ?? "",
              invoice_number: latestInvoice?.invoice_number ?? "—",
              order_created_at: orderCreatedIst,
              hold_status_label: holdStatusLabel,
              followup_date: holdNowIst,
              expected_update_date: expectedIst,
              employee_remarks: data.internalNote ?? data.customerNote ?? "—",
              reason: data.reasonLabel,
              reason_block: reasonBlock,
              date: new Date().toLocaleDateString("en-IN"),
              company_name: COMPANY_NAME,
              support_email: SUPPORT_EMAIL,
              customer_note: data.customerNote ?? "",
            },
            { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined, applicationId: app.id, trigger: "manual" },
          );
        } catch (e) {
          console.error("[workflow] customer-side delay email failed", e);
        }
      }

      // Internal notifications for customer-side hold (assignee + Super Admin).
      {
        const { emitToUsers, emitToRole } = await import("@/lib/notifications/emit.server");
        const notifBase = {
          kind: "customer_hold_started" as const,
          title: `Customer-Side Delay — ${data.reasonLabel}`,
          body: `Order ${app.application_code ?? ""} paused. Auto-closes in 8 business hours if no response.`,
          href: `/admin/orders/${app.id}`,
          entityKind: "application",
          entityId: app.id,
        };
        if (lead?.assigned_to) await emitToUsers([lead.assigned_to], notifBase);
        await emitToRole("super_admin", notifBase);
      }
    } else {
      // ── Internal / our-side: notify customer with E005 hold intimation + assignee review reminder ──
      const dueAt = expectedReviewIso ?? new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      await admin.from("workflow_reminders").insert({
        application_id: app.id,
        lead_id: app.lead_id,
        kind: "internal_review",
        template_code: null,
        due_at: dueAt,
        assigned_to: lead?.assigned_to ?? null,
        status: "pending",
        payload: {
          reason: data.reasonLabel,
          reason_block: reasonBlock,
          reason_code: data.reasonCode,
        },
        created_by: context.userId,
      } as never);

      // Internal notifications: assignee (if any) + Super Admin/Admin/Ops so someone always sees it.
      const { emitToUsers, emitToRole } = await import("@/lib/notifications/emit.server");
      const notifBase = {
        kind: "our_side_delay_start" as const,
        title: `Our-Side Delay — ${data.reasonLabel}`,
        body: `Order ${app.application_code ?? ""} paused (internal). Review by ${new Date(dueAt).toLocaleString("en-IN")}.`,
        href: `/admin/orders/${app.id}`,
        entityKind: "application",
        entityId: app.id,
      };
      if (lead?.assigned_to) {
        await emitToUsers([lead.assigned_to], notifBase);
      }
      await emitToRole("super_admin", notifBase);
      await emitToRole("admin", notifBase);


      // Send our-side delay hold intimation email to customer (E005).
      if (lead?.email) {
        try {
          const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
          const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");
          await enqueueFromTemplateInternal(
            customerTplCode,
            lead.email,
            {
              customer_name: lead.name ?? "Customer",
              customer_email: lead.email ?? "",
              customer_mobile: (lead as any).mobile ?? "",
              order_id: app.application_code ?? "",
              order_number: app.application_code ?? "",
              service_name: lead.service ?? "",
              invoice_number: latestInvoice?.invoice_number ?? "—",
              order_created_at: orderCreatedIst,
              hold_status_label: holdStatusLabel,
              followup_date: holdNowIst,
              expected_update_date: expectedIst,
              employee_remarks: data.internalNote ?? "—",
              reason: data.reasonLabel,
              reason_block: reasonBlock,
              date: new Date().toLocaleDateString("en-IN"),
              company_name: COMPANY_NAME,
              support_email: SUPPORT_EMAIL,
            },
            { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined, applicationId: app.id, trigger: "manual" },
          );
        } catch (e) {
          console.error("[workflow] our-side delay email failed", e);
        }
      }
    }

    await writeAudit({
      supabase: context.supabase,
      entityType: "application",
      entityId: app.id,
      action: side === "internal" ? "workflow_internal_delay" : "workflow_external_delay",
      oldValue: { workflow_status: app.workflow_status },
      newValue: { workflow_status: workflowStatus, reason: data.reasonCode, side },
      actorId: context.userId,
    });

    return { ok: true, side };
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
      .select("id, lead_id, workflow_status, application_code")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (!app) throw new Error("Application not found");

    const { data: lead } = await admin
      .from("leads")
      .select("name, email, service")
      .eq("id", app.lead_id!)
      .maybeSingle();

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

    // Notify customer via email that their order is back in processing.
    if (lead?.email) {
      try {
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
        const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");
        await enqueueFromTemplateInternal(
          "bhs_order_resumed",
          lead.email,
          {
            customer_name: lead.name ?? "Customer",
            order_id: app.application_code ?? "",
            order_number: app.application_code ?? "",
            service_name: lead.service ?? "",
            resume_note: data.note ?? "",
            company_name: COMPANY_NAME,
            support_email: SUPPORT_EMAIL,
          },
          { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined, applicationId: app.id, trigger: "manual" },
        );
      } catch (e) {
        console.error("[workflow] resume email failed", e);
      }
    }

    // Internal notifications: assignee + Super Admin that the order was resumed.
    {
      const { emitToUsers, emitToRole } = await import("@/lib/notifications/emit.server");
      const notifBase = {
        kind: "order_status_change" as const,
        title: `Order Resumed — ${app.application_code ?? ""}`,
        body: `${name} resumed processing.${data.note ? ` Note: ${data.note}` : ""}`,
        href: `/admin/orders/${app.id}`,
        entityKind: "application",
        entityId: app.id,
      };
      const { data: leadRow } = await admin
        .from("leads")
        .select("assigned_to")
        .eq("id", app.lead_id!)
        .maybeSingle();
      if (leadRow?.assigned_to && leadRow.assigned_to !== context.userId) {
        await emitToUsers([leadRow.assigned_to], notifBase);
      }
      await emitToRole("super_admin", notifBase);
    }

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
