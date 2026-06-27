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
        const expected =
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_ANON_KEY ||
          process.env.CRON_SECRET;
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

            if (app.closure_stage === "request_received") {
              if (lead?.email) {
                await enqueueFromTemplateInternal(
                  "cancel-closure-confirmation",
                  lead.email,
                  baseVars,
                  { toName: lead.name ?? undefined, leadId: app.lead_id },
                );
              }
              await supabaseAdmin
                .from("applications")
                .update({
                  closure_stage: "closed",
                  closure_next_at: null,
                  application_status: "cancelled",
                  fulfillment_status: "cancelled",
                } as never)
                .eq("id", app.id);
              advanced++;
            } else if (app.closure_stage === "concern_reply_sent") {
              if (lead?.email) {
                await enqueueFromTemplateInternal(
                  "cancel-ticket-closed",
                  lead.email,
                  baseVars,
                  { toName: lead.name ?? undefined, leadId: app.lead_id },
                );
              }
              await supabaseAdmin
                .from("applications")
                .update({
                  closure_stage: "final_ticket_closed",
                  closure_next_at: null,
                } as never)
                .eq("id", app.id);
              advanced++;
            } else if (app.closure_stage === "refund_reviewed") {
              if (lead?.email) {
                await enqueueFromTemplateInternal(
                  "cancel-ticket-closed-final",
                  lead.email,
                  baseVars,
                  { toName: lead.name ?? undefined, leadId: app.lead_id },
                );
              }
              await supabaseAdmin
                .from("applications")
                .update({
                  closure_stage: "closed",
                  closure_next_at: null,
                } as never)
                .eq("id", app.id);
              advanced++;
            }
          } catch (e) {
            console.error("[closure-workflow] failed", {
              applicationId: app.id,
              e,
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
