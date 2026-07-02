// Cancellation closure-workflow runner.
// pg_cron hits this hourly with CRON_SECRET (or apikey) in the `apikey` header.
//
// Auto-advances applications through:
//   request_received     → closed                 (Step 2 email; order CANCELLED)
//   concern_reply_sent   → final_ticket_closed    (Step 4 email)
//   refund_reviewed      → closed (terminal)       (Step 6 email)
//
// All wait windows use workflow_settings.cancel_wait_hours (default 24h).
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/cron/closure-workflow")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { enqueueFromTemplateInternal } = await import(
          "@/lib/emails/emails.server"
        );

        const { data: settingsRow } = await supabaseAdmin
          .from("workflow_settings")
          .select("*")
          .limit(1)
          .maybeSingle();
        if (!settingsRow || (settingsRow as any).enabled === false) {
          return Response.json({ ok: true, skipped: "disabled" });
        }

        const now = new Date();
        const nowIso = now.toISOString();
        const STAGES_DUE = [
          "request_received",
          "concern_reply_sent",
          "refund_reviewed",
        ];

        const { data: due, error } = await supabaseAdmin
          .from("applications")
          .select(
            "id, application_code, lead_id, closure_stage, closure_next_at, closure_reason_code, closure_reason_text",
          )
          .in("closure_stage", STAGES_DUE as never)
          .lte("closure_next_at", nowIso)
          .limit(200);

        if (error) {
          return Response.json(
            { ok: false, error: error.message },
            { status: 500 },
          );
        }

        let advanced = 0;
        let failed = 0;

        const writeAudit = async (
          app: any,
          fromStage: string,
          toStage: string,
          templateCode: string,
          extra?: Record<string, unknown>,
        ) => {
          await Promise.all([
            supabaseAdmin.from("activity_logs").insert({
              lead_id: app.lead_id,
              application_id: app.id,
              user_id: null,
              activity_type: "cancellation_auto_advanced",
              activity_description: `Cancellation workflow auto-advanced: ${fromStage} → ${toStage} (email: ${templateCode})`,
            } as never),
            supabaseAdmin.from("workflow_events").insert({
              application_id: app.id,
              lead_id: app.lead_id,
              event_type: "closure_auto_advanced",
              title: `Cancellation workflow: ${fromStage} → ${toStage}`,
              description: `Auto-advanced by 24h timer. Email '${templateCode}' delivered.`,
              customer_visible: true,
              is_system: true,
              metadata: {
                from_stage: fromStage,
                to_stage: toStage,
                template_code: templateCode,
                ...(extra ?? {}),
              },
            } as never),
          ]);
        };

        for (const app of due ?? []) {
          try {
            const { data: lead } = await supabaseAdmin
              .from("leads")
              .select("name, email, service")
              .eq("id", app.lead_id)
              .maybeSingle();

            // Resolve reason_block from the stored reason code.
            let reasonBlock = (app as any).closure_reason_text ?? "";
            if ((app as any).closure_reason_code) {
              const { data: rr } = await supabaseAdmin
                .from("workflow_delay_reasons")
                .select("description, label")
                .eq("code", (app as any).closure_reason_code)
                .maybeSingle();
              if (rr?.description) reasonBlock = rr.description as string;
              else if (rr?.label) reasonBlock = rr.label as string;
            }

            const baseVars = {
              customer_name: lead?.name ?? "",
              order_number: app.application_code ?? "",
              service_name: lead?.service ?? "",
              reason_block: reasonBlock,
              ticket_id: app.application_code ?? "",
              date_ist: now.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              }),
            };

            const fromStage = String(app.closure_stage);

            if (fromStage === "request_received") {
              if (!lead?.email) {
                console.error(
                  "[closure-workflow] no email on lead — skipping",
                  { applicationId: app.id },
                );
                failed++;
                continue;
              }
              await enqueueFromTemplateInternal(
                "cancel-closure-confirmation",
                lead.email,
                baseVars,
                {
                  toName: lead.name ?? undefined,
                  leadId: app.lead_id,
                  applicationId: app.id,
                  requireImmediateSuccess: true,
                },
              );
              await supabaseAdmin
                .from("applications")
                .update({
                  closure_stage: "closed",
                  closure_next_at: null,
                  application_status: "cancelled",
                  fulfillment_status: "cancelled",
                } as never)
                .eq("id", app.id);
              await writeAudit(app, fromStage, "closed", "cancel-closure-confirmation", {
                application_status: "cancelled",
                fulfillment_status: "cancelled",
              });
              advanced++;
            } else if (fromStage === "concern_reply_sent") {
              if (!lead?.email) { failed++; continue; }
              await enqueueFromTemplateInternal(
                "cancel-ticket-closed",
                lead.email,
                baseVars,
                {
                  toName: lead.name ?? undefined,
                  leadId: app.lead_id,
                  applicationId: app.id,
                  requireImmediateSuccess: true,
                },
              );
              await supabaseAdmin
                .from("applications")
                .update({
                  closure_stage: "final_ticket_closed",
                  closure_next_at: null,
                } as never)
                .eq("id", app.id);
              await writeAudit(app, fromStage, "final_ticket_closed", "cancel-ticket-closed");
              advanced++;
            } else if (fromStage === "refund_reviewed") {
              if (!lead?.email) { failed++; continue; }
              await enqueueFromTemplateInternal(
                "cancel-ticket-closed-final",
                lead.email,
                baseVars,
                {
                  toName: lead.name ?? undefined,
                  leadId: app.lead_id,
                  applicationId: app.id,
                  requireImmediateSuccess: true,
                },
              );
              await supabaseAdmin
                .from("applications")
                .update({
                  closure_stage: "closed",
                  closure_next_at: null,
                } as never)
                .eq("id", app.id);
              await writeAudit(app, fromStage, "closed", "cancel-ticket-closed-final");
              advanced++;
            }
          } catch (e) {
            console.error("[closure-workflow] failed", {
              applicationId: app.id,
              applicationCode: (app as any).application_code,
              stage: app.closure_stage,
              error: e instanceof Error ? e.message : String(e),
            });
            failed++;
          }
        }

        return Response.json({
          ok: true,
          due: due?.length ?? 0,
          advanced,
          failed,
          at: nowIso,
        });
      },
    },
  },
});
