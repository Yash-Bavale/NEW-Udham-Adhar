// Multi-stage cancellation / refund workflow.
//
// Stage map (in applications.closure_stage):
//   none                  → no cancellation in progress (initial)
//   request_received      → Step 1 email sent. Cron auto-advances after cancel_wait_hours.
//   closed                → Step 2 email sent + order marked cancelled (auto, 24h after Step 1).
//   concern_reply_sent    → Staff manually sent Step 3 reply. Auto-advances after 24h.
//   final_ticket_closed   → Step 4 email sent (auto, 24h after Step 3).
//   refund_reviewed       → Staff manually sent Step 5 refund decision. Auto-advances after 24h.
//   acknowledged          → Staff manually sent Step 7 post-closure acknowledgement.
//
// All emails use the cancel-* templates seeded in the migration; reason_block is
// pulled from workflow_delay_reasons.description so the customer always sees the
// exact policy paragraph for the chosen reason.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SUPPORT_EMAIL =
  (typeof process !== "undefined" && process.env?.INTERNAL_NOTIFICATION_EMAIL) ||
  "help@businesshelpservices.in";

async function loadContext(applicationId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: app, error: appErr } = await supabaseAdmin
    .from("applications")
    .select(
      "id, application_code, lead_id, closure_stage, closure_reason_code, closure_reason_text",
    )
    .eq("id", applicationId)
    .maybeSingle();
  if (appErr || !app) throw new Error("Application not found");

  const { data: lead } = app.lead_id
    ? await supabaseAdmin
        .from("leads")
        .select("name, email, service")
        .eq("id", app.lead_id)
        .maybeSingle()
    : { data: null };

  let reasonBlock = (app as any).closure_reason_text ?? "";
  const reasonCode = (app as any).closure_reason_code as string | null;
  if (reasonCode) {
    const { data: rr } = await supabaseAdmin
      .from("workflow_delay_reasons")
      .select("description, label")
      .eq("code", reasonCode)
      .maybeSingle();
    if (rr?.description) reasonBlock = rr.description as string;
    else if (rr?.label) reasonBlock = rr.label as string;
  }

  const { data: settings } = await supabaseAdmin
    .from("workflow_settings")
    .select("cancel_wait_hours, enabled")
    .limit(1)
    .maybeSingle();

  return { supabaseAdmin, app, lead, reasonBlock, settings };
}

async function logActivity(
  applicationId: string,
  leadId: string | null,
  userId: string,
  activity_type: string,
  description: string,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("activity_logs").insert({
    lead_id: leadId,
    application_id: applicationId,
    user_id: userId,
    activity_type,
    activity_description: description,
  });
}

async function assertStaff(supabase: any, userId: string) {
  const { data: isStaff } = await supabase.rpc("has_any_staff_role", {
    _user_id: userId,
  });
  if (!isStaff) throw new Error("Forbidden");
}

const hoursFromNow = (h: number) =>
  new Date(Date.now() + h * 3600 * 1000).toISOString();

// ── Step 1: staff records a cancellation request ─────────────────────────────
export const requestCancellation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        applicationId: z.string().uuid(),
        reasonCode: z.string().min(2).max(80),
        reasonText: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { enqueueFromTemplateInternal } = await import(
      "@/lib/emails/emails.server"
    );
    const { supabaseAdmin, app, lead, settings } = await loadContext(
      data.applicationId,
    );

    if (app.closure_stage && app.closure_stage !== "none") {
      throw new Error("Cancellation workflow already in progress");
    }
    if (settings?.enabled === false)
      throw new Error("Workflow automation is disabled");

    const waitHours = (settings as any)?.cancel_wait_hours ?? 24;

    // Resolve the policy block for this reason code.
    const { data: rr } = await supabaseAdmin
      .from("workflow_delay_reasons")
      .select("description, label")
      .eq("code", data.reasonCode)
      .maybeSingle();
    const reasonBlock = (rr?.description as string) || (rr?.label as string) || data.reasonText || "";

    const { error: updErr } = await supabaseAdmin
      .from("applications")
      .update({
        cancellation_requested_at: new Date().toISOString(),
        closure_stage: "request_received",
        closure_next_at: hoursFromNow(waitHours),
        closure_reason_code: data.reasonCode,
        closure_reason_text: data.reasonText ?? null,
      } as never)
      .eq("id", app.id);
    if (updErr) throw new Error(updErr.message);

    await logActivity(
      app.id,
      app.lead_id,
      context.userId,
      "cancellation_requested",
      `Cancellation requested (${data.reasonCode})${data.reasonText ? `: ${data.reasonText}` : ""}`,
    );

    if (lead?.email) {
      try {
        await enqueueFromTemplateInternal(
          "cancel-action-required",
          lead.email,
          {
            customer_name: lead.name ?? "",
            order_number: app.application_code ?? "",
            service_name: lead.service ?? "",
            reason_block: reasonBlock,
          },
          { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined },
        );
      } catch (e) {
        console.error("[cancellation] step1 email failed", e);
      }
    }

    return { ok: true, closureNextAt: hoursFromNow(waitHours) };
  });

// ── Step 3: staff manually replies to customer concern ───────────────────────
export const sendConcernReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ applicationId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { enqueueFromTemplateInternal } = await import(
      "@/lib/emails/emails.server"
    );
    const { supabaseAdmin, app, lead, reasonBlock, settings } =
      await loadContext(data.applicationId);

    if (app.closure_stage !== "closed") {
      throw new Error(
        "Concern reply can only be sent after the order is closed (Step 2).",
      );
    }
    const waitHours = (settings as any)?.cancel_wait_hours ?? 24;

    if (lead?.email) {
      await enqueueFromTemplateInternal(
        "cancel-concern-reply",
        lead.email,
        {
          customer_name: lead.name ?? "",
          order_number: app.application_code ?? "",
          reason_block: reasonBlock,
        },
        { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined },
      );
    }

    await supabaseAdmin
      .from("applications")
      .update({
        closure_stage: "concern_reply_sent",
        closure_next_at: hoursFromNow(waitHours),
      } as never)
      .eq("id", app.id);

    await logActivity(
      app.id,
      app.lead_id,
      context.userId,
      "cancellation_concern_reply",
      "Step 3 concern-reply email sent to customer",
    );
    return { ok: true };
  });

// ── Step 5: staff manually communicates refund decision ──────────────────────
export const sendRefundDecision = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ applicationId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { enqueueFromTemplateInternal } = await import(
      "@/lib/emails/emails.server"
    );
    const { supabaseAdmin, app, lead, settings } = await loadContext(
      data.applicationId,
    );

    if (app.closure_stage !== "final_ticket_closed") {
      throw new Error(
        "Refund decision can only be sent after the support ticket is closed (Step 4).",
      );
    }
    const waitHours = (settings as any)?.cancel_wait_hours ?? 24;

    if (lead?.email) {
      await enqueueFromTemplateInternal(
        "cancel-refund-reviewed",
        lead.email,
        {
          customer_name: lead.name ?? "",
          order_number: app.application_code ?? "",
        },
        { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined },
      );
    }
    await supabaseAdmin
      .from("applications")
      .update({
        closure_stage: "refund_reviewed",
        closure_next_at: hoursFromNow(waitHours),
      } as never)
      .eq("id", app.id);

    await logActivity(
      app.id,
      app.lead_id,
      context.userId,
      "cancellation_refund_decision",
      "Step 5 refund-decision email sent to customer",
    );
    return { ok: true };
  });

// ── Step 7: acknowledge any further customer reply after final closure ───────
export const acknowledgePostClosure = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ applicationId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { enqueueFromTemplateInternal } = await import(
      "@/lib/emails/emails.server"
    );
    const { supabaseAdmin, app, lead } = await loadContext(data.applicationId);

    if (lead?.email) {
      await enqueueFromTemplateInternal(
        "cancel-post-closure-ack",
        lead.email,
        {
          customer_name: lead.name ?? "",
          order_number: app.application_code ?? "",
        },
        { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined },
      );
    }
    await supabaseAdmin
      .from("applications")
      .update({ closure_stage: "acknowledged", closure_next_at: null } as never)
      .eq("id", app.id);

    await logActivity(
      app.id,
      app.lead_id,
      context.userId,
      "cancellation_acknowledged",
      "Step 7 post-closure acknowledgement email sent to customer",
    );
    return { ok: true };
  });

// ── Admin override: revert a cancellation workflow ──────────────────────────
export const cancelClosureWorkflow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ applicationId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("applications")
      .update({
        closure_stage: "none",
        closure_next_at: null,
        closure_reason_code: null,
        closure_reason_text: null,
        cancellation_requested_at: null,
      } as never)
      .eq("id", data.applicationId);
    if (error) throw new Error(error.message);
    await logActivity(
      data.applicationId,
      null,
      context.userId,
      "cancellation_reverted",
      "Cancellation workflow reverted by staff",
    );
    return { ok: true };
  });

export const _CANCEL_SUPPORT_EMAIL = SUPPORT_EMAIL;

// ── Super-admin override: resume a cancelled order ──────────────────────────
// Clears the closure workflow, restores fulfillment_status to a valid prior
// stage, cancels any pending reminders, and logs an activity + workflow event.
export const resumeCancelledOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        applicationId: z.string().uuid(),
        toStatus: z
          .enum([
            "order_received",
            "details_pending",
            "details_received",
            "under_process",
            "submitted_to_gov",
          ])
          .default("order_received"),
        note: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isSuper } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    if (!isSuper) throw new Error("Forbidden — super admin only");

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: app, error: appErr } = await supabaseAdmin
      .from("applications")
      .select("id, lead_id, fulfillment_status, closure_stage, workflow_status")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (appErr || !app) throw new Error("Application not found");

    await supabaseAdmin
      .from("workflow_reminders")
      .update({ status: "cancelled" } as never)
      .eq("application_id", app.id)
      .eq("status", "pending");

    const { error } = await supabaseAdmin
      .from("applications")
      .update({
        fulfillment_status: data.toStatus,
        workflow_status: "processing_resumed",
        workflow_delay_reason: null,
        workflow_expected_review_at: null,
        closure_stage: "none",
        closure_next_at: null,
        closure_reason_code: null,
        closure_reason_text: null,
        cancellation_requested_at: null,
      } as never)
      .eq("id", app.id);
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("workflow_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: "resumed",
      title: "Cancelled order resumed by super admin",
      description: data.note ?? null,
      customer_visible: false,
      actor_id: context.userId,
      is_system: false,
      metadata: {
        from_fulfillment_status: (app as any).fulfillment_status ?? null,
        from_closure_stage: (app as any).closure_stage ?? null,
        to_fulfillment_status: data.toStatus,
      },
    } as never);

    await logActivity(
      app.id,
      app.lead_id,
      context.userId,
      "cancellation_resumed",
      `Cancelled order resumed by super admin → ${data.toStatus}${
        data.note ? ` — ${data.note}` : ""
      }`,
    );

    return { ok: true };
  });
