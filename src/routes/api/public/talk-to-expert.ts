import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  enqueueFromTemplateInternal,
  enqueueEmailInternal,
} from "@/lib/emails/emails.server";
import { INDIAN_STATES, LANGUAGES } from "@/lib/constants";

const FALLBACK_INTERNAL_EMAIL = "vinoddaware28@gmail.com";

// Talk-to-Expert is a paid consultation. ₹99 + 18% GST.
const BASE = 99;
const GST = +(BASE * 0.18).toFixed(2);
const TOTAL = +(BASE + GST).toFixed(2);

const Schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile"),
  state: z.string().trim().refine((v) => INDIAN_STATES.includes(v), "Invalid state"),
  language: z.string().trim().refine((v) => LANGUAGES.includes(v), "Invalid language"),
  problem: z.string().trim().min(10).max(2000),
});

export const Route = createFileRoute("/api/public/talk-to-expert")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
      POST: async ({ request }) => {
        const cors = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        let parsed: z.infer<typeof Schema>;
        try {
          parsed = Schema.parse(await request.json());
        } catch (e) {
          return new Response(
            JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Invalid input" }),
            { status: 400, headers: cors },
          );
        }

        // 60s dedup guard: same email + talk_to_expert
        const since = new Date(Date.now() - 60_000).toISOString();
        const { data: recent } = await supabaseAdmin
          .from("leads")
          .select("id, lead_code, status")
          .eq("email", parsed.email)
          .eq("lead_source", "talk_to_expert")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        let leadId: string;
        let leadCode: string | null;
        if (recent?.id) {
          leadId = recent.id;
          leadCode = recent.lead_code ?? null;
        } else {
          const { data: lead, error } = await supabaseAdmin
            .from("leads")
            .insert({
              name: parsed.name,
              email: parsed.email,
              mobile: parsed.mobile,
              state: parsed.state,
              language: parsed.language,
              service: "Expert Consultation",
              lead_source: "talk_to_expert",
              status: "lead_created",
              notes: parsed.problem,
              base_amount: BASE,
              gst_amount: GST,
              total_amount: TOTAL,
            })
            .select("id, lead_code")
            .single();
          if (error || !lead) {
            return new Response(
              JSON.stringify({ ok: false, error: "Could not save your request. Please try again." }),
              { status: 500, headers: cors },
            );
          }
          leadId = lead.id;
          leadCode = lead.lead_code ?? null;

          await supabaseAdmin.from("activity_logs").insert({
            lead_id: leadId,
            activity_type: "lead_created",
            activity_description: `Talk-to-Expert request from ${parsed.name}`,
            metadata: { source: "talk_to_expert", problem: parsed.problem } as never,
          });
        }

        // Notify admin (best-effort)
        const adminTo = process.env.INTERNAL_NOTIFICATION_EMAIL || FALLBACK_INTERNAL_EMAIL;
        const origin = new URL(request.url).origin;
        try {
          await enqueueEmailInternal({
            toEmail: adminTo,
            subject: `Talk-to-Expert request: ${parsed.name}`,
            bodyHtml: `<p><b>${parsed.name}</b> (${parsed.email}, +91 ${parsed.mobile}) booked a ₹${TOTAL} expert consultation.</p><p><b>Problem:</b><br/>${parsed.problem.replace(/\n/g, "<br/>")}</p><p><a href="${origin}/admin/leads/${leadId}">Open in CRM</a></p>`,
            leadId,
          });
          await enqueueFromTemplateInternal(
            "contact_acknowledgement",
            parsed.email,
            {
              name: parsed.name,
              service: "Expert Consultation",
              total_amount: String(TOTAL),
            },
            { toName: parsed.name, leadId },
          ).catch(() => undefined);
        } catch {
          // ignore email backend issues
        }

        return new Response(
          JSON.stringify({ ok: true, leadId, leadCode, totalAmount: TOTAL }),
          { status: 200, headers: cors },
        );
      },
    },
  },
});
