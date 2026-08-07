// TEMPORARY one-off: sends the E010 closure email for orders auto-closed by the
// 8h backfill that did not get an email due to an earlier enqueue bug.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/cron/backfill-e010")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const auth = request.headers.get("authorization") ?? "";
        if (!secret || auth !== `Bearer ${secret}`) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
        const { BHS_EMAILS } = await import("@/lib/emails/bhs-templates");

        const { data: apps } = await supabaseAdmin
          .from("applications")
          .select("id, application_code, lead_id, customer_id, closure_remarks")
          .eq("order_status", "CLOSED")
          .like("closure_remarks", "%within 8 hours%");

        const results: Array<{ code: string; sent: boolean }> = [];
        for (const a of ((apps as any[]) ?? [])) {
          const { data: existing } = await supabaseAdmin
            .from("email_queue")
            .select("id")
            .eq("application_id", a.id)
            .eq("template_code", "E010")
            .limit(1);
          if ((existing as any[])?.length) continue;

          let email: string | null = null;
          let name: string | null = null;
          if (a.lead_id) {
            const { data: lead } = await supabaseAdmin
              .from("leads").select("email, name").eq("id", a.lead_id).maybeSingle();
            email = (lead as any)?.email ?? null;
            name = (lead as any)?.name ?? null;
          }
          if (!email && a.customer_id) {
            const { data: cust } = await supabaseAdmin
              .from("customers").select("primary_email, name").eq("id", a.customer_id).maybeSingle();
            email = (cust as any)?.primary_email ?? null;
            name = name ?? (cust as any)?.name ?? null;
          }
          if (!email) { results.push({ code: a.application_code, sent: false }); continue; }

          await enqueueFromTemplateInternal(
            BHS_EMAILS.E010_ORDER_CLOSED,
            email,
            {
              customerName: name || "Customer",
              orderNumber: a.application_code,
              closure_reason: "Customer unresponsive after multiple attempts",
              employee_remarks: a.closure_remarks,
              reason: `Customer unresponsive after multiple attempts — ${a.closure_remarks}`,
              fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
            },
            { applicationId: a.id, leadId: a.lead_id ?? undefined, trigger: "auto" },
          );
          results.push({ code: a.application_code, sent: true });
        }
        return Response.json({ ok: true, results });
      },
    },
  },
});
