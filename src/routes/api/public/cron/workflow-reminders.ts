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
            followup_3d: { kind: "followup_5d", tplCode: "workflow_processing_update_3d", daysFromNow: 2 },
            followup_5d: { kind: "followup_7d", tplCode: "workflow_processing_update_3d", daysFromNow: 2 },
            followup_7d: null,
            custom: null,
            pending_closure_followup: null,
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
                .select("id, lead_id, application_code, workflow_status")
                .eq("id", r.application_id)
                .maybeSingle();
              if (!app) continue;

              // Skip if order is resumed/closed/cancelled
              if (["processing_resumed","completed","closed","cancelled","refund_closed"].includes(app.workflow_status as string)) {
                continue;
              }

              const { data: lead } = await supabaseAdmin
                .from("leads")
                .select("name, email, service")
                .eq("id", app.lead_id!)
                .maybeSingle();

              if (r.template_code && lead?.email) {
                const payload: any = r.payload ?? {};
                await enqueueFromTemplateInternal(
                  r.template_code,
                  lead.email,
                  {
                    customer_name: lead.name ?? "Customer",
                    order_id: app.application_code ?? "",
                    service_name: lead.service ?? "",
                    reason: payload.reason ?? "Processing update",
                    date: new Date().toLocaleDateString("en-IN"),
                    company_name: COMPANY_NAME,
                    support_email: SUPPORT_EMAIL,
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
                  metadata: { reminder_id: r.id, template: r.template_code },
                } as never);
              }

              // Reschedule next step in the 3/5/7 cadence
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
