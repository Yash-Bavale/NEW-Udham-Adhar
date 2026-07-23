// Server functions for the Employee Action Panel — atomic order actions that
// combine transition + email + scheduler side-effects.
//
// Phase 3 delivers the Customer-Side Delay action. Additional actions
// (Our-Side Delay, Send Form Link, Mark Submitted, Complete, Refund) land in
// Phase 5 on top of these primitives.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CustomerSideDelayInput = z.object({
  orderId: z.string().uuid(),
  reasonId: z.string().uuid(),
  remarks: z.string().max(2000).optional().nullable(),
});

/**
 * Customer-Side Delay:
 *   1. Transition order → CUSTOMER_HOLD (enforced by SQL map).
 *   2. Queue email E003 to the customer.
 *   3. Start Scheduler 2 (24h business-time auto-close → E004).
 */
export const customerSideDelay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => CustomerSideDelayInput.parse(raw))
  .handler(async ({ data, context }) => {
    // 1. Transition (RLS/security-definer enforces map)
    const { data: updated, error: tErr } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: "CUSTOMER_HOLD",
      _reason_id: data.reasonId,
      _remarks: data.remarks ?? undefined,
      _force: false,
    });
    if (tErr) throw new Error(tErr.message);

    // 2 + 3 run server-side with admin client
    const [{ enqueueFromTemplateInternal }, { startCustomerClosureScheduler }, { supabaseAdmin }] = await Promise.all([
      import("@/lib/emails/emails.server"),
      import("@/lib/scheduling/schedulers.server"),
      import("@/integrations/supabase/client.server"),
    ]);
    const { BHS_EMAILS } = await import("@/lib/emails/bhs-templates");

    // Stamp S06 Customer Delay fulfillment stage so header + journey reflect it.
    await supabaseAdmin
      .from("applications")
      .update({
        customer_hold_started_at: new Date().toISOString(),
        active_reason_id: data.reasonId,
        fulfillment_status: "customer_delay",
      } as never)
      .eq("id", data.orderId);


    // Reason label for E003
    const { data: reason } = await supabaseAdmin
      .from("delay_reasons")
      .select("label")
      .eq("id", data.reasonId)
      .maybeSingle();

    const app = updated as Record<string, unknown> | null;
    const customerId = (app?.customer_id as string | undefined) ?? null;
    const orderCode = (app?.application_code as string | undefined) ?? data.orderId.slice(0, 8);
    const leadId = (app?.lead_id as string | undefined) ?? null;

    let emailQueued = false;
    if (customerId) {
      const { data: cust } = await supabaseAdmin
        .from("customers")
        .select("primary_email, name")
        .eq("id", customerId)
        .maybeSingle();
      if (cust?.primary_email) {
        try {
          await enqueueFromTemplateInternal(
            BHS_EMAILS.E004_CUSTOMER_DELAY,
            cust.primary_email as string,
            {
              customerName: (cust.name as string) || "Customer",
              orderNumber: orderCode,
              delayReason: (reason?.label as string) || "Awaiting information from your side",
              fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
            },
            { applicationId: data.orderId, leadId: leadId ?? undefined },
          );
          emailQueued = true;
        } catch (e) {
          console.error("[customerSideDelay] E003 enqueue failed", e);
        }
      }
    }

    const scheduler = await startCustomerClosureScheduler({
      applicationId: data.orderId,
      reasonId: data.reasonId,
      remarks: data.remarks ?? null,
      createdBy: context.userId,
    });

    await notifyOrderEvent({
      order: {
        id: data.orderId,
        application_code: orderCode,
        assigned_to: (app?.assigned_to as string | null) ?? null,
      },
      kind: "customer_hold_started",
      title: `${orderCode} moved to Customer Hold`,
      body: `24h auto-close timer started. Reason: ${reason?.label ?? "Awaiting customer information"}.`,
    });

    return {
      ok: true,
      order: updated,
      emailQueued,
      scheduler: { id: scheduler?.id, firesAt: scheduler?.fires_at },
    };
  });

// ─────────────────────── Our-Side Delay (Scheduler 3) ───────────────────────

const OurSideDelayInput = z.object({
  orderId: z.string().uuid(),
  reasonId: z.string().uuid(),
  remarks: z.string().max(2000).optional().nullable(),
  /** grace = 30-min business-time hold before auto reminders kick in.
   *  auto  = start recurring 2h business-time reminders immediately.
   *  manual = one-shot reminder at explicit remindAt.
   *  stop  = transition without arming any reminder (reason is enough). */
  mode: z.enum(["grace", "auto", "manual", "stop"]),
  intervalSeconds: z.number().int().min(300).max(24 * 3600).optional(),
  remindAt: z.string().datetime().optional(),
});

/**
 * Our-Side Delay: order → OUR_SIDE_DELAY + optionally arm reminder loop.
 * No customer email is sent (per PRD — this is internal accountability only).
 */
export const ourSideDelay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => OurSideDelayInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: updated, error: tErr } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: "OUR_SIDE_DELAY",
      _reason_id: data.reasonId,
      _remarks: data.remarks ?? undefined,
      _force: false,
    });
    if (tErr) throw new Error(tErr.message);

    if (data.mode === "stop") {
      return { ok: true, order: updated, scheduler: null };
    }

    const { startOurSideReminder } = await import("@/lib/scheduling/schedulers.server");
    const scheduler = await startOurSideReminder({
      applicationId: data.orderId,
      mode: data.mode,
      intervalSeconds: data.intervalSeconds,
      remindAt: data.remindAt ? new Date(data.remindAt) : undefined,
      reasonId: data.reasonId,
      remarks: data.remarks ?? null,
      createdBy: context.userId,
    });

    const app = updated as Record<string, unknown> | null;
    await notifyOrderEvent({
      order: {
        id: data.orderId,
        application_code: (app?.application_code as string | null) ?? null,
        assigned_to: (app?.assigned_to as string | null) ?? null,
      },
      kind: "our_side_delay_start",
      title: `${(app?.application_code as string) ?? data.orderId.slice(0, 8)} — Our Side Delay armed`,
      body:
        data.mode === "auto"
          ? "Recurring 2h business-time reminders started."
          : data.mode === "manual"
          ? `Manual reminder scheduled${data.remindAt ? ` for ${new Date(data.remindAt).toLocaleString("en-IN")}` : ""}.`
          : "30-min grace period before auto-reminders kick in.",
    });

    return {
      ok: true,
      order: updated,
      scheduler: { id: scheduler?.id, firesAt: scheduler?.fires_at },
    };
  });

// ─────────────────────── Shared helper: fetch order + customer ───────────────────────

async function loadOrderContext(supabase: any, orderId: string) {
  const { data: order, error } = await supabase
    .from("applications")
    .select("id, lead_id, customer_id, order_status, application_code, service_id, assigned_to, workflow_status, closure_stage")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) throw new Error("Order not found");
  let customer: { primary_email: string | null; name: string | null } | null = null;
  if (order.customer_id) {
    const { data: c } = await supabase
      .from("customers")
      .select("primary_email, name")
      .eq("id", order.customer_id)
      .maybeSingle();
    customer = c as any;
  }
  // Fall back to the lead record when the customer profile has no email
  // (leads are the source of truth for that specific order's recipient).
  let lead: { email: string | null; name: string | null } | null = null;
  if (order.lead_id && (!customer?.primary_email || !customer?.name)) {
    const { data: l } = await supabase
      .from("leads")
      .select("email, name")
      .eq("id", order.lead_id)
      .maybeSingle();
    lead = l as any;
  }
  const recipientEmail = customer?.primary_email || lead?.email || null;
  const recipientName = customer?.name || lead?.name || "Customer";
  return { order, customer, lead, recipientEmail, recipientName };
}

/** Fire-and-forget: notify assignee (+ optional extra roles) about an order event. Never throws. */
async function notifyOrderEvent(input: {
  order: { id: string; application_code: string | null; assigned_to: string | null };
  kind: string;
  title: string;
  body?: string;
  alsoRoles?: string[]; // e.g. ["super_admin","finance"]
}) {
  try {
    const { emitToUsers, emitToRole } = await import("@/lib/notifications/emit.server");
    const href = `/admin/orders/${input.order.id}`;
    const base = {
      kind: input.kind,
      title: input.title,
      body: input.body,
      href,
      entityKind: "order" as const,
      entityId: input.order.id,
    };
    const targets: string[] = [];
    if (input.order.assigned_to) targets.push(input.order.assigned_to);
    if (targets.length > 0) await emitToUsers(targets, base);
    for (const role of input.alsoRoles ?? []) {
      await emitToRole(role, base);
    }
  } catch (e) {
    console.warn("[notifyOrderEvent] failed:", e);
  }
}

async function queueTemplateEmail(
  templateCode: string,
  to: string,
  vars: Record<string, unknown>,
  refs: { applicationId: string; leadId?: string | null },
) {
  const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
  try {
    await enqueueFromTemplateInternal(templateCode, to, vars, {
      applicationId: refs.applicationId,
      leadId: refs.leadId ?? undefined,
      // Button-initiated sends are always manual triggers — bypasses the
      // dispatch_mode='manual' gate that silently drops "auto" attempts.
      trigger: "manual",
    });
    return true;
  } catch (e) {
    console.error(`[order-actions] enqueue ${templateCode} failed`, e);
    return false;
  }
}

async function transition(
  supabase: any,
  orderId: string,
  newStatus: string,
  extras: { reasonId?: string | null; remarks?: string | null; force?: boolean } = {},
) {
  const { data, error } = await supabase.rpc("transition_order_status", {
    _order_id: orderId,
    _new_status: newStatus,
    _reason_id: extras.reasonId ?? undefined,
    _remarks: extras.remarks ?? undefined,
    _force: extras.force ?? false,
  });
  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────── Send / Resend Form Link (E002) ───────────────────────

export const sendFormLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ orderId: z.string().uuid(), transitionToWaiting: z.boolean().default(true) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { order, customer } = await loadOrderContext(context.supabase, data.orderId);
    const { assertTransitionAllowed } = await import("@/lib/workflow/transition-guard.server");
    assertTransitionAllowed({
      stage: (order as any).order_status,
      workflowStatus: (order as any).workflow_status ?? null,
      closureStage: (order as any).closure_stage ?? null,
      action: "send_form_link",
    });
    const fromName = process.env.ZOHO_FROM_NAME || "Udyam Support";
    let emailQueued = false;
    const { recipientEmail, recipientName } = { recipientEmail: (customer?.primary_email || (order as any).lead?.email || null) as string | null, recipientName: (customer?.name || "Customer") as string };
    // Use combined recipient (customer profile → lead fallback) built by loadOrderContext.
    const _ctx = await loadOrderContext(context.supabase, data.orderId);
    const to = _ctx.recipientEmail;
    const name = _ctx.recipientName;
    if (to) {
      const link = `${process.env.APP_BASE_URL || ""}/resume/${order.id}`;
      emailQueued = await queueTemplateEmail(
        "welcome_and_form_link",
        to,
        {
          customerName: name,
          orderNumber: order.application_code || order.id.slice(0, 8),
          formLink: link,
          fromName,
        },
        { applicationId: order.id, leadId: order.lead_id },
      );
    }
    let updated = order;
    if (data.transitionToWaiting && order.order_status === "NEW_ORDER") {
      updated = await transition(context.supabase, order.id, "WAITING_CUSTOMER_INFO");
    }
    // Stamp S02/S03 fulfillment stage so the journey map + UI badges reflect
    // "Awaiting Customer Form" (link armed) → "Waiting for Customer Submission"
    // (link delivered) without waiting for another action.
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("applications")
        .update({ fulfillment_status: (emailQueued ? "waiting_for_customer_submission" : "awaiting_customer_form") } as never)
        .eq("id", order.id);
    } catch (e) {
      console.error("[sendFormLink] stamp fulfillment_status failed", e);
    }
    if (emailQueued) {
      await notifyOrderEvent({
        order: { id: order.id, application_code: order.application_code, assigned_to: (order as any).assigned_to ?? null },
        kind: "form_link_sent",
        title: `Form link sent for ${order.application_code || order.id.slice(0, 8)}`,
        body: `Delivered to ${to}.`,
      });
    }
    if (!to) {
      throw new Error("No email on file for this customer or lead — cannot send form link.");
    }
    return { ok: true, order: updated, emailQueued };
  });


// ─────────────────────── Start Processing ───────────────────────

export const startProcessing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ orderId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const updated = await transition(context.supabase, data.orderId, "IN_PROCESSING");
    // Cancel any active waiting/reminder schedulers.
    const { cancelAllForOrder } = await import("@/lib/scheduling/schedulers.server");
    await cancelAllForOrder(data.orderId, "started_processing");
    return { ok: true, order: updated };
  });

// ─────────────────────── Mark Submitted to Govt (E012) ───────────────────────

export const markSubmittedToGovt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ orderId: z.string().uuid(), referenceNumber: z.string().max(200).optional() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { order, customer } = await loadOrderContext(context.supabase, data.orderId);
    const updated = await transition(context.supabase, data.orderId, "SUBMITTED_TO_GOVT", {
      remarks: data.referenceNumber ? `Ref: ${data.referenceNumber}` : null,
    });
    let emailQueued = false;
    // Stamp S07 Government Processing so the journey map reflects the move.
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("applications")
        .update({ fulfillment_status: "government_processing" } as never)
        .eq("id", data.orderId);
    } catch (e) {
      console.error("[markSubmittedToGovt] stamp fulfillment_status failed", e);
    }
    if (customer?.primary_email) {
      emailQueued = await queueTemplateEmail(
        "bhs_e012_submitted_to_govt",
        customer.primary_email,
        {
          customerName: customer.name || "Customer",
          orderNumber: order.application_code || order.id.slice(0, 8),
          referenceNumber: data.referenceNumber || "",
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
        },
        { applicationId: order.id, leadId: order.lead_id },
      );
    }
    await notifyOrderEvent({
      order: { id: order.id, application_code: order.application_code, assigned_to: (order as any).assigned_to ?? null },
      kind: "order_status_change",
      title: `${order.application_code || order.id.slice(0, 8)} submitted to authority`,
      body: data.referenceNumber ? `Ref: ${data.referenceNumber}` : undefined,
    });
    return { ok: true, order: updated, emailQueued };
  });

// ─────────────────────── Mark Certificate Issued ───────────────────────

export const markCertificateIssued = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ orderId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const updated = await transition(context.supabase, data.orderId, "CERTIFICATE_ISSUED");
    return { ok: true, order: updated };
  });

// ─────────────────────── Complete Order (E006) ───────────────────────

export const completeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ orderId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { order, customer } = await loadOrderContext(context.supabase, data.orderId);
    const updated = await transition(context.supabase, data.orderId, "COMPLETED");
    const { cancelAllForOrder, startFeedbackFollowupScheduler } = await import(
      "@/lib/scheduling/schedulers.server"
    );
    await cancelAllForOrder(data.orderId, "completed");
    let emailQueued = false;
    if (customer?.primary_email) {
      emailQueued = await queueTemplateEmail(
        "order_completed",
        customer.primary_email,
        {
          customerName: customer.name || "Customer",
          orderNumber: order.application_code || order.id.slice(0, 8),
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
        },
        { applicationId: order.id, leadId: order.lead_id },
      );
    }
    // Arm E007 feedback follow-up (24 business hours post-completion).
    try {
      await startFeedbackFollowupScheduler({
        applicationId: data.orderId,
        createdBy: context.userId,
      });
    } catch (e) {
      console.error("[completeOrder] feedback follow-up scheduler failed", e);
    }
    await notifyOrderEvent({
      order: { id: order.id, application_code: order.application_code, assigned_to: (order as any).assigned_to ?? null },
      kind: "order_completed",
      title: `${order.application_code || order.id.slice(0, 8)} completed`,
      body: "Delivery email sent to customer.",
    });
    return { ok: true, order: updated, emailQueued };
  });

// ─────────────────────── Refund Lifecycle (E011) ───────────────────────

/** Customer / staff files a refund request → REFUND_REQUESTED + refund_requests row. */
export const requestRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      reason: z.string().min(3).max(2000),
      amount: z.number().positive().optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const updated = await transition(context.supabase, data.orderId, "REFUND_REQUESTED", {
      remarks: data.reason,
    });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const app = updated as Record<string, unknown>;
    await supabaseAdmin.from("refund_requests").insert({
      application_id: data.orderId,
      lead_id: (app.lead_id as string | null) ?? null,
      reason: data.reason,
      status: "pending",
      refund_amount: data.amount ?? null,
      created_by: context.userId,
    } as never);
    await notifyOrderEvent({
      order: {
        id: data.orderId,
        application_code: (app.application_code as string | null) ?? null,
        assigned_to: (app.assigned_to as string | null) ?? null,
      },
      kind: "refund_requested",
      title: `Refund requested on ${(app.application_code as string) || data.orderId.slice(0, 8)}`,
      body: `Reason: ${data.reason.slice(0, 200)}${data.amount ? ` · Amount: ₹${data.amount}` : ""}`,
      alsoRoles: ["super_admin", "finance", "admin"],
    });
    return { ok: true, order: updated };
  });

/** Admin approves refund → REFUND_APPROVED. Requires admin role. */
export const approveRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      amount: z.number().positive(),
      adminNotes: z.string().max(2000).optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admin required");
    const updated = await transition(context.supabase, data.orderId, "REFUND_APPROVED", {
      remarks: data.adminNotes ?? null,
    });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("refund_requests")
      .update({
        status: "approved",
        refund_amount: data.amount,
        admin_notes: data.adminNotes ?? null,
        reviewer_id: context.userId,
        decided_at: new Date().toISOString(),
      } as never)
      .eq("application_id", data.orderId)
      .eq("status", "pending");
    const app2 = updated as Record<string, unknown> | null;
    await notifyOrderEvent({
      order: {
        id: data.orderId,
        application_code: (app2?.application_code as string | null) ?? null,
        assigned_to: (app2?.assigned_to as string | null) ?? null,
      },
      kind: "refund_approved",
      title: `Refund approved on ${(app2?.application_code as string) || data.orderId.slice(0, 8)}`,
      body: `₹${data.amount} approved. Awaiting payout.`,
      alsoRoles: ["finance"],
    });
    return { ok: true, order: updated };
  });

/** Admin rejects refund → back to previous status (kept as REFUND_REQUESTED, note only). */
export const rejectRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      reason: z.string().min(3).max(2000),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admin required");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("refund_requests")
      .update({
        status: "rejected",
        admin_notes: data.reason,
        reviewer_id: context.userId,
        decided_at: new Date().toISOString(),
      } as never)
      .eq("application_id", data.orderId)
      .eq("status", "pending");
    // Move order back to IN_PROCESSING (force — REFUND_REQUESTED can't reach it normally).
    const updated = await transition(context.supabase, data.orderId, "IN_PROCESSING", {
      remarks: `Refund rejected: ${data.reason}`,
      force: true,
    });
    return { ok: true, order: updated };
  });

/**
 * Mark refund processed → REFUND_PROCESSED, send E011, auto-close order.
 * Records payment reference in admin_notes.
 */
export const markRefundProcessed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      amount: z.number().positive(),
      paymentReference: z.string().min(1).max(200),
      processedOn: z.string().datetime().optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden: admin required");

    const { order, customer } = await loadOrderContext(context.supabase, data.orderId);
    const updated = await transition(context.supabase, data.orderId, "REFUND_PROCESSED", {
      remarks: `Refund of ₹${data.amount} processed. Ref: ${data.paymentReference}`,
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const processedAt = data.processedOn ?? new Date().toISOString();
    await supabaseAdmin
      .from("refund_requests")
      .update({
        admin_notes: `PROCESSED @ ${processedAt} | Ref: ${data.paymentReference} | Amount: ₹${data.amount}`,
        refund_amount: data.amount,
      } as never)
      .eq("application_id", data.orderId)
      .eq("status", "approved");

    let emailQueued = false;
    if (customer?.primary_email) {
      emailQueued = await queueTemplateEmail(
        "refund_processed_confirmation",
        customer.primary_email,
        {
          customerName: customer.name || "Customer",
          orderNumber: order.application_code || order.id.slice(0, 8),
          refundAmount: `₹${data.amount.toFixed(2)}`,
          paymentReference: data.paymentReference,
          processedOn: processedAt.slice(0, 10),
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
        },
        { applicationId: order.id, leadId: order.lead_id },
      );
    }

    // Auto-close after processing.
    try {
      await transition(context.supabase, data.orderId, "CLOSED", {
        remarks: "Auto-closed after refund processed",
      });
      const { cancelAllForOrder } = await import("@/lib/scheduling/schedulers.server");
      await cancelAllForOrder(data.orderId, "refund_processed");
    } catch (e) {
      console.error("[markRefundProcessed] auto-close failed", e);
    }

    return { ok: true, order: updated, emailQueued };
  });


// ─────────────────────── Reopen Order ───────────────────────

export const reopenOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ orderId: z.string().uuid(), remarks: z.string().max(2000).optional() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("restart_order", {
      _order_id: data.orderId,
      _note: data.remarks ?? undefined,
    });
    if (error) throw new Error(error.message);
    return { ok: true, order: result };
  });

// ─────────────────────── Close Order (manual) ───────────────────────

export const closeOrderManual = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      orderId: z.string().uuid(),
      reasonId: z.string().uuid().optional(),
      remarks: z.string().max(2000).optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const updated = await transition(context.supabase, data.orderId, "CLOSED", {
      reasonId: data.reasonId ?? null,
      remarks: data.remarks ?? null,
    });
    const { cancelAllForOrder } = await import("@/lib/scheduling/schedulers.server");
    await cancelAllForOrder(data.orderId, "manually_closed");
    return { ok: true, order: updated };
  });

// ─────────────────────── Send Manual Reminder (E005) ───────────────────────

export const sendManualReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ orderId: z.string().uuid(), note: z.string().max(1000).optional() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { order, customer } = await loadOrderContext(context.supabase, data.orderId);
    if (!customer?.primary_email) return { ok: false, reason: "no_email" };
    const emailQueued = await queueTemplateEmail(
      "bhs_e005_manual_reminder",
      customer.primary_email,
      {
        customerName: customer.name || "Customer",
        orderNumber: order.application_code || order.id.slice(0, 8),
        message: data.note || "",
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
      },
      { applicationId: order.id, leadId: order.lead_id },
    );
    return { ok: emailQueued };
  });
