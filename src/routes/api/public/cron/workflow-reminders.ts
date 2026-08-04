// Workflow reminder engine — fires due reminders, sends templated emails,
// reschedules follow-ups (3d → 5d → 7d), and writes timeline events.
// Called by pg_cron with the CRON_SECRET in the apikey header.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/cron/workflow-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
          const { SUPPORT_EMAIL, COMPANY_NAME } = await import("@/lib/brand");

          const nowIso = new Date().toISOString();
          const { data: due, error } = await supabaseAdmin
            .from("workflow_reminders")
            .select("*")
            .eq("status", "pending")
            .lte("due_at", nowIso)
            .order("due_at", { ascending: true })
            .limit(50);
          if (error) throw new Error(error.message);

          let processed = 0;
          let sent = 0;
          const NEXT_KIND: Record<string, { kind: string; tplCode: string; daysFromNow: number } | null> = {
            followup_3d: null,
            followup_5d: null,
            followup_7d: null,
            custom: null,
            pending_closure_followup: null,
            internal_review: null,
          };


          for (const r of due ?? []) {
            processed++;
            try {
              // Mark as sent (advance state regardless of email)
              await supabaseAdmin
                .from("workflow_reminders")
                .update({ status: "sent", sent_at: nowIso } as never)
                .eq("id", r.id);

              const { data: app } = await supabaseAdmin
                .from("applications")
                .select("id, lead_id, application_code, workflow_status, order_status, fulfillment_status")
                .eq("id", r.application_id)
                .maybeSingle();
              if (!app) continue;

              // Skip if order is already closed/completed/cancelled/refunded (any status field)
              const skipWorkflow = ["processing_resumed","completed","closed","cancelled","refund_closed"].includes(app.workflow_status as string);
              const skipOrder = ["CLOSED","COMPLETED","REFUND_PROCESSED"].includes(app.order_status as string);
              const skipFulfillment = ["order_closed","order_completed","cancelled"].includes(app.fulfillment_status as string);
              if (skipWorkflow || skipOrder || skipFulfillment) {
                continue;
              }

              const { data: lead } = await supabaseAdmin
                .from("leads")
                .select("name, email, service")
                .eq("id", app.lead_id!)
                .maybeSingle();

              // Auto-close overrides the queued template to E010 so the
              // customer receives the correct closure notice.
              const isAutoClose = r.kind === "pending_closure_followup";
              const effectiveTemplate = isAutoClose ? "E010" : r.template_code;

              if (effectiveTemplate && lead?.email) {
                const payload: any = r.payload ?? {};
                const allowedTemplates = new Set([
                  "order_confirmation", "welcome_and_form_link", "bhs_e003_customer_delay",
                  "bhs_e004_our_side_delay", "order_closure_confirmation", "order_completed",
                  "talk_to_expert_completed", "support_ticket_reply", "support_ticket_closed",
                  "support_ticket_closed_final", "refund_processed_confirmation", "bhs_e012_submitted_to_govt",
                  "E010",
                ]);
                if (allowedTemplates.has(String(effectiveTemplate))) {
                  await enqueueFromTemplateInternal(
                    effectiveTemplate,
                    lead.email,
                    {
                      customer_name: lead.name ?? "Customer",
                      customerName: lead.name ?? "Customer",
                      customer_email: lead.email ?? "",
                      order_id: app.application_code ?? "",
                      order_number: app.application_code ?? "",
                      orderNumber: app.application_code ?? "",
                      service_name: lead.service ?? "",
                      reason: payload.reason ?? "Customer delay unresolved within the 8-hour window",
                      reason_block: payload.reason_block ?? payload.reason ?? "Customer delay unresolved within the 8-hour window",
                      closure_reason: payload.closure_reason ?? payload.reason ?? "Customer delay unresolved within the 8-hour window",
                      employee_remarks: payload.employee_remarks ?? payload.customer_note ?? payload.internal_note ?? "—",
                      closure_date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }),
                      date: new Date().toLocaleDateString("en-IN"),
                      company_name: COMPANY_NAME,
                      support_email: SUPPORT_EMAIL,
                      fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
                    },
                    { toName: lead.name ?? undefined, leadId: app.lead_id ?? undefined, applicationId: app.id },
                  );
                  sent++;

                  await supabaseAdmin.from("workflow_events").insert({
                    application_id: app.id,
                    lead_id: app.lead_id,
                    event_type: "followup_email_sent",
                    title: `Automated follow-up sent (${r.kind})`,
                    description: null,
                    customer_visible: false,
                    actor_name: "System",
                    is_system: true,
                    metadata: { reminder_id: r.id, template: effectiveTemplate },
                  } as never);
                }
              }

              // Auto-close the order when the 8h pending-closure window elapses.
              // Direct admin updates — the security-definer RPC requires auth.uid()
              // which is NULL from cron/service-role and silently rejects.
              if (isAutoClose) {
                const { data: reason } = await supabaseAdmin
                  .from("order_close_reasons")
                  .select("id, label")
                  .eq("is_active", true)
                  .order("number")
                  .limit(1)
                  .maybeSingle();
                const reasonId = (reason as any)?.id ?? null;
                const remarks = "Auto-close: customer delay unresolved within 8 hours";

                const { error: uErr } = await supabaseAdmin
                  .from("applications")
                  .update({
                    order_status: "CLOSED",
                    fulfillment_status: "order_closed",
                    application_status: "cancelled",
                    closure_reason_id: reasonId,
                    closure_remarks: remarks,
                    customer_hold_started_at: null,
                    active_reason_id: null,
                    active_reason_text: null,
                    updated_at: new Date().toISOString(),
                  } as never)
                  .eq("id", app.id);

                if (uErr) {
                  console.error("[workflow-cron] auto-close update failed", app.id, uErr.message);
                } else {
                  // Cancel any still-armed schedulers for this order.
                  try {
                    const { cancelAllForOrder } = await import("@/lib/scheduling/schedulers.server");
                    await cancelAllForOrder(app.id, "auto_close_customer_delay");
                  } catch (e) { console.error("[workflow-cron] cancelAll failed", e); }

                  await supabaseAdmin.from("application_events").insert({
                    application_id: app.id,
                    lead_id: app.lead_id,
                    event_type: "order_status_change",
                    old_value: app.order_status,
                    new_value: "CLOSED",
                    note: remarks,
                    staff_name: "System",
                    staff_role: "system",
                  } as never);

                  await supabaseAdmin.from("workflow_events").insert({
                    application_id: app.id,
                    lead_id: app.lead_id,
                    event_type: "order_auto_closed",
                    title: "Order auto-closed after 8h customer-delay window",
                    description: "No response received within the 8-hour customer-delay window.",
                    customer_visible: false,
                    actor_name: "System",
                    is_system: true,
                    metadata: { reminder_id: r.id, reason: (reason as any)?.label ?? null },
                  } as never);
                }
              }


              // Internal-side delay review: notify assignee, do not email customer.
              if ((r.kind as string) === "internal_review") {
                const payload: any = r.payload ?? {};
                if (r.assigned_to) {
                  await supabaseAdmin.from("notifications").insert({
                    user_id: r.assigned_to,
                    title: `Internal delay review due — ${payload.reason ?? "review"}`,
                    body: `Order ${app.application_code ?? ""} needs an internal review.`,
                    kind: "workflow_internal_review",
                    link_to: `/admin/orders/${app.id}`,
                  } as never);
                }
                await supabaseAdmin.from("workflow_events").insert({
                  application_id: app.id,
                  lead_id: app.lead_id,
                  event_type: "internal_review_due",
                  title: "Internal delay review due",
                  description: payload.reason ?? null,
                  customer_visible: false,
                  actor_name: "System",
                  is_system: true,
                  metadata: { reminder_id: r.id },
                } as never);
              }

              const next = NEXT_KIND[r.kind as string];
              if (next) {
                const dueAt = new Date(Date.now() + next.daysFromNow * 86400 * 1000).toISOString();
                await supabaseAdmin.from("workflow_reminders").insert({
                  application_id: app.id,
                  lead_id: app.lead_id,
                  kind: next.kind,
                  template_code: next.tplCode,
                  due_at: dueAt,
                  assigned_to: r.assigned_to,
                  status: "pending",
                  payload: r.payload,
                  created_by: r.created_by,
                } as never);
              }
            } catch (innerErr) {
              console.error("[workflow-cron] reminder failed", r.id, innerErr);
              await supabaseAdmin
                .from("workflow_reminders")
                .update({ status: "failed", error: String(innerErr) } as never)
                .eq("id", r.id);
            }
          }

          return Response.json({ ok: true, processed, sent });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "unknown";
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
    },
  },
});
