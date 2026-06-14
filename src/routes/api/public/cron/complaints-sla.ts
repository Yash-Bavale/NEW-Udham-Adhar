// pg_cron calls this every 6h to flag SLA-breached complaints + enqueue reminder emails.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { enqueueEmailInternal } from "@/lib/emails/emails.server";

export const Route = createFileRoute("/api/public/cron/complaints-sla")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Server-only CRON_SECRET — never VITE_-prefixed, never shipped to client.
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const now = new Date().toISOString();
        // 1) Mark newly-breached complaints
        const { data: breaching } = await supabaseAdmin
          .from("complaints")
          .select("id, complaint_number, lead_id, severity, category, sla_due_at")
          .lt("sla_due_at", now)
          .is("breached_at", null)
          .not("status", "in", "(resolved,closed)")
          .limit(200);

        const breachedIds = (breaching ?? []).map((c) => c.id);
        if (breachedIds.length) {
          await supabaseAdmin
            .from("complaints")
            .update({ breached_at: now })
            .in("id", breachedIds);
        }

        // 2) For all open + breached complaints, enqueue an SLA alert email
        //    (max 1 per 24h via last_reminded_at guard)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: openBreached } = await supabaseAdmin
          .from("complaints")
          .select("id, complaint_number, lead_id, severity, category, sla_due_at, last_reminded_at, reminder_count")
          .not("breached_at", "is", null)
          .not("status", "in", "(resolved,closed)")
          .or(`last_reminded_at.is.null,last_reminded_at.lt.${dayAgo}`)
          .limit(100);

        let queued = 0;
        for (const c of openBreached ?? []) {
          const { data: lead } = await supabaseAdmin
            .from("leads")
            .select("email, name")
            .eq("id", c.lead_id)
            .single();
          if (!lead?.email) continue;
          await enqueueEmailInternal({
            toEmail: lead.email,
            toName: lead.name,
            subject: `[Action Required] Update on grievance ${c.complaint_number ?? c.id.slice(0, 8)}`,
            bodyHtml: `<div style="font-family:Arial,sans-serif;padding:20px">
              <p>Dear ${lead.name ?? "Customer"},</p>
              <p>Your grievance <b>${c.complaint_number ?? ""}</b> has crossed the expected resolution window.
              Our senior operations team has been alerted and will revert within 24 hours.</p>
              <p>Severity: <b>${(c.severity ?? "normal").toUpperCase()}</b></p>
              <p>Thank you for your patience.</p>
            </div>`,
            templateCode: "complaint_sla_breach",
            leadId: c.lead_id,
          });
          await supabaseAdmin
            .from("complaints")
            .update({ last_reminded_at: now, reminder_count: (c.reminder_count ?? 0) + 1 })
            .eq("id", c.id);
          queued += 1;
        }

        return Response.json({
          ok: true,
          newly_breached: breachedIds.length,
          alerts_queued: queued,
        });
      },
    },
  },
});
