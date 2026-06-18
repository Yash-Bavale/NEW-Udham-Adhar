// Cancellation closure workflow runner. pg_cron hits this hourly (or daily) with
// CRON_SECRET in the `apikey` header. Advances applications through:
//   request_received -> closure_pending (after step2_days)
//                    -> notice_sent     (after step3_days)
//                    -> closed
// Step 1 email is enqueued at the moment the request is recorded (server fn),
// Step 2 and Step 3 emails are enqueued here as stages advance.
import { createFileRoute } from "@tanstack/react-router";

const SUPPORT_EMAIL = process.env.INTERNAL_NOTIFICATION_EMAIL || "support@udyamadhar.in";
const REFUND_POLICY_URL = "https://udyamadhar.in/refund-policy";

export const Route = createFileRoute("/api/public/cron/closure-workflow")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");

        // Load workflow settings (singleton row).
        const { data: settingsRow } = await supabaseAdmin
          .from("workflow_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (!settingsRow || settingsRow.enabled === false) {
          return Response.json({ ok: true, skipped: "disabled" });
        }

        const now = new Date();
        const nowIso = now.toISOString();

        // Find applications whose next stage transition is due.
        const { data: due, error } = await supabaseAdmin
          .from("applications")
          .select("id, application_code, lead_id, closure_stage, closure_next_at")
          .in("closure_stage", ["request_received", "closure_pending"])
          .lte("closure_next_at", nowIso)
          .limit(200);

        if (error) {
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        let advanced = 0;
        let failed = 0;

        for (const app of due ?? []) {
          try {
            // Pull lead + customer info for email merge.
            const { data: lead } = await supabaseAdmin
              .from("leads")
              .select("name, email, service")
              .eq("id", app.lead_id)
              .maybeSingle();

            if (!lead?.email) {
              failed++;
              continue;
            }

            const baseVars = {
              customer_name: lead.name ?? "",
              order_number: app.application_code ?? "",
              service_name: lead.service ?? "",
              refund_policy_url: REFUND_POLICY_URL,
              support_email: SUPPORT_EMAIL,
            };

            if (app.closure_stage === "request_received") {
              // -> closure_pending, send Step 2 email, set next due in step3_days
              await enqueueFromTemplateInternal(
                settingsRow.step2_template_code ?? "final-notice-before-closure",
                lead.email,
                baseVars,
                { toName: lead.name ?? undefined, leadId: app.lead_id },
              );
              const nextAt = new Date(
                now.getTime() + (settingsRow.step3_days ?? 7) * 86400_000,
              ).toISOString();
              await supabaseAdmin
                .from("applications")
                .update({ closure_stage: "closure_pending", closure_next_at: nextAt })
                .eq("id", app.id);
              advanced++;
            } else if (app.closure_stage === "closure_pending") {
              // -> closed (notice_sent + closure email)
              await enqueueFromTemplateInternal(
                settingsRow.step3_template_code ?? "order-closed-notice",
                lead.email,
                baseVars,
                { toName: lead.name ?? undefined, leadId: app.lead_id },
              );
              await supabaseAdmin
                .from("applications")
                .update({
                  closure_stage: "closed",
                  closure_next_at: null,
                  application_status: "cancelled",
                })
                .eq("id", app.id);
              advanced++;
            }
          } catch (e) {
            console.error("[closure-workflow] failed", { applicationId: app.id, e });
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
