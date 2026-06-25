// Closure & Refund server functions for the Service Workflow Engine.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole, writeAudit } from "@/lib/audit";

const STAFF = [
  "super_admin", "admin", "manager", "operations", "executive", "support", "finance", "accounts",
] as const;
const ADMIN_ONLY = ["super_admin", "admin"] as const;
const REFUND_ROLES = ["super_admin", "admin", "finance", "accounts"] as const;

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}
async function actorName(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase.from("profiles").select("display_name, email").eq("id", userId).maybeSingle();
  return data?.display_name || data?.email || "Staff";
}

// ───────── Close order ─────────

export const closeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      reasonCode: z.string().min(1).max(64),
      reasonLabel: z.string().min(1).max(160),
      notes: z.string().max(4000).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...ADMIN_ONLY]);
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
      .select("name, email, service, lead_code")
      .eq("id", app.lead_id!)
      .maybeSingle();

    // Cancel reminders
    await admin
      .from("workflow_reminders")
      .update({ status: "cancelled" } as never)
      .eq("application_id", app.id)
      .eq("status", "pending");

    await admin
      .from("applications")
      .update({ workflow_status: "closed" } as never)
      .eq("id", app.id);

    await admin.from("workflow_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: "order_closed",
      title: `Order closed — ${data.reasonLabel}`,
      description: data.notes ?? null,
      customer_visible: true,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: { reason_code: data.reasonCode },
    } as never);

    // Customer email
    if (lead?.email) {
      try {
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
        const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");
        await enqueueFromTemplateInternal(
          "workflow_closure_notice",
          lead.email,
          {
            customer_name: lead.name ?? "Customer",
            order_id: app.application_code ?? "",
            service_name: lead.service ?? "",
            reason: data.reasonLabel,
            date: new Date().toLocaleDateString("en-IN"),
            company_name: COMPANY_NAME,
            support_email: SUPPORT_EMAIL,
          },
          { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined, applicationId: app.id },
        );
      } catch (e) { console.error("[workflow] closure email failed", e); }
    }

    await writeAudit({
      supabase: context.supabase,
      entityType: "application",
      entityId: app.id,
      action: "workflow_close_order",
      oldValue: { workflow_status: app.workflow_status },
      newValue: { workflow_status: "closed", reason: data.reasonCode },
      actorId: context.userId,
    });

    return { ok: true };
  });

// ───────── Refund Requests ─────────

export const createRefundRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      paymentId: z.string().uuid().optional(),
      reason: z.string().max(2000).optional(),
      reasonCode: z.string().max(64).optional(),
      customerNotes: z.string().max(2000).optional(),
      refundAmount: z.number().nonnegative().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    const name = await actorName(context.supabase, context.userId);

    const { data: app } = await admin
      .from("applications")
      .select("id, lead_id, application_code")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (!app) throw new Error("Application not found");

    const { data: row, error } = await admin
      .from("refund_requests")
      .insert({
        application_id: app.id,
        lead_id: app.lead_id,
        payment_id: data.paymentId ?? null,
        reason: data.reason ?? null,
        reason_code: data.reasonCode ?? null,
        customer_notes: data.customerNotes ?? null,
        refund_amount: data.refundAmount ?? null,
        status: "pending",
        created_by: context.userId,
      } as never)
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await admin
      .from("applications")
      .update({ workflow_status: "refund_review" } as never)
      .eq("id", app.id);

    await admin.from("workflow_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: "refund_requested",
      title: "Refund requested",
      description: data.reason ?? null,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: { refund_request_id: row.id, amount: data.refundAmount ?? null },
    } as never);

    // Email confirmation
    const { data: lead } = await admin.from("leads").select("name, email, service").eq("id", app.lead_id!).maybeSingle();
    if (lead?.email) {
      try {
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
        const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");
        await enqueueFromTemplateInternal(
          "workflow_refund_received",
          lead.email,
          {
            customer_name: lead.name ?? "Customer",
            order_id: app.application_code ?? "",
            service_name: lead.service ?? "",
            date: new Date().toLocaleDateString("en-IN"),
            company_name: COMPANY_NAME,
            support_email: SUPPORT_EMAIL,
          },
          { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined, applicationId: app.id },
        );
      } catch (e) { console.error("[workflow] refund-received email failed", e); }
    }

    return { ok: true, id: row.id };
  });

export const listRefundRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      status: z.enum(["pending","approved","rejected","info_needed","escalated"]).optional(),
      applicationId: z.string().uuid().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF]);
    const admin = await getAdmin();
    let q = admin
      .from("refund_requests")
      .select("*, application:applications(application_code, lead_id), lead:leads(name,email,lead_code,service)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status) q = q.eq("status", data.status);
    if (data.applicationId) q = q.eq("application_id", data.applicationId);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const decideRefundRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      decision: z.enum(["approved","rejected","info_needed","escalated"]),
      adminNotes: z.string().max(4000).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...REFUND_ROLES]);
    const admin = await getAdmin();
    const name = await actorName(context.supabase, context.userId);

    const { data: row } = await admin
      .from("refund_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) throw new Error("Refund request not found");

    const decided = ["approved","rejected"].includes(data.decision);
    await admin
      .from("refund_requests")
      .update({
        status: data.decision,
        admin_notes: data.adminNotes ?? row.admin_notes,
        reviewer_id: context.userId,
        decided_at: decided ? new Date().toISOString() : null,
      } as never)
      .eq("id", data.id);

    if (data.decision === "approved" || data.decision === "rejected") {
      await admin
        .from("applications")
        .update({ workflow_status: data.decision === "approved" ? "refund_closed" : "closed" } as never)
        .eq("id", row.application_id);
    }

    await admin.from("workflow_events").insert({
      application_id: row.application_id,
      lead_id: row.lead_id,
      event_type: `refund_${data.decision}`,
      title: `Refund ${data.decision.replace("_", " ")}`,
      description: data.adminNotes ?? null,
      customer_visible: ["approved","rejected"].includes(data.decision),
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: { refund_request_id: row.id },
    } as never);

    // Email customer
    const { data: lead } = await admin.from("leads").select("name,email,service").eq("id", row.lead_id!).maybeSingle();
    const { data: app } = await admin.from("applications").select("application_code").eq("id", row.application_id).maybeSingle();
    if (lead?.email) {
      try {
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
        const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");
        const tplMap: Record<string, string> = {
          approved: "workflow_refund_approved",
          rejected: "workflow_refund_rejected",
          info_needed: "workflow_refund_info_needed",
          escalated: "workflow_refund_escalated",
        };
        await enqueueFromTemplateInternal(
          tplMap[data.decision],
          lead.email,
          {
            customer_name: lead.name ?? "Customer",
            order_id: app?.application_code ?? "",
            service_name: lead.service ?? "",
            refund_amount: row.refund_amount ?? "",
            admin_notes: data.adminNotes ?? "",
            date: new Date().toLocaleDateString("en-IN"),
            company_name: COMPANY_NAME,
            support_email: SUPPORT_EMAIL,
          },
          { toName: lead.name ?? undefined, leadId: row.lead_id ?? undefined, applicationId: row.application_id },
        );
      } catch (e) { console.error("[workflow] refund-decision email failed", e); }
    }

    await writeAudit({
      supabase: context.supabase,
      entityType: "application",
      entityId: row.application_id,
      action: `refund_${data.decision}`,
      oldValue: { status: row.status },
      newValue: { status: data.decision },
      actorId: context.userId,
    });

    return { ok: true };
  });
