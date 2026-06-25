import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const FALLBACK_INTERNAL_EMAIL = "help@businesshelpservices.in";

const ComplaintSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile"),
  application_ref: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(10).max(2000),
});


function genComplaintNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CMP-${y}${m}-${rand}`;
}

export const Route = createFileRoute("/api/public/complaint")({
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
        let parsed: z.infer<typeof ComplaintSchema>;
        try {
          parsed = ComplaintSchema.parse(await request.json());
        } catch (e) {
          return new Response(
            JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Invalid input" }),
            { status: 400, headers: cors },
          );
        }

        // De-dup: same email + complaint_form within last 60s
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const since = new Date(Date.now() - 60_000).toISOString();
        const { data: recent } = await supabaseAdmin
          .from("leads")
          .select("id")
          .eq("email", parsed.email)
          .eq("lead_source", "complaint_form")
          .gte("created_at", since)
          .limit(1)
          .maybeSingle();

        let leadId: string;
        if (recent?.id) {
          leadId = recent.id;
        } else {
          const { data: lead, error: leadErr } = await supabaseAdmin
            .from("leads")
            .insert({
              name: parsed.name,
              email: parsed.email,
              mobile: parsed.mobile,
              state: "Not Provided",
              language: "English",
              service: "Complaint",
              lead_source: "complaint_form",
              status: "lead_created",
              notes: parsed.message,
              total_amount: 0,
              gst_amount: 0,
              base_amount: 0,
            })
            .select("id")
            .single();
          if (leadErr || !lead) {
            return new Response(
              JSON.stringify({ ok: false, error: "Could not save complaint. Please try again." }),
              { status: 500, headers: cors },
            );
          }
          leadId = lead.id;
        }

        const complaintNumber = genComplaintNumber();
        const noteText = parsed.application_ref
          ? `Ref: ${parsed.application_ref}\n\n${parsed.message}`
          : parsed.message;

        const { data: complaint, error: cErr } = await supabaseAdmin
          .from("complaints")
          .insert({
            lead_id: leadId,
            complaint_number: complaintNumber,
            notes: noteText,
            status: "pending",
            submitted_at: new Date().toISOString(),
          })
          .select("id, complaint_number")
          .single();

        if (cErr || !complaint) {
          return new Response(
            JSON.stringify({ ok: false, error: "Could not save complaint. Please try again." }),
            { status: 500, headers: cors },
          );
        }

        // Activity log (best-effort)
        await supabaseAdmin.from("activity_logs").insert({
          lead_id: leadId,
          activity_type: "complaint_submitted",
          activity_description: `Complaint ${complaint.complaint_number} submitted by ${parsed.name}`,
          metadata: { source: "complaint_form", complaint_id: complaint.id } as never,
        });

        // Internal notification recipient (private, env-configured)

        const adminTo =
          process.env.INTERNAL_NOTIFICATION_EMAIL || FALLBACK_INTERNAL_EMAIL;

        const origin = new URL(request.url).origin;

        try {
          const { enqueueEmailInternal } = await import("@/lib/emails/emails.server");
          // Admin/internal notification only — no customer acknowledgement
          await enqueueEmailInternal({
            toEmail: adminTo,
            subject: `New complaint ${complaint.complaint_number} — ${parsed.name}`,
            bodyHtml: `
              <h2>New complaint received</h2>
              <p><b>Complaint #:</b> ${complaint.complaint_number}</p>
              <p><b>Name:</b> ${parsed.name}</p>
              <p><b>Email:</b> ${parsed.email}</p>
              <p><b>Mobile:</b> +91 ${parsed.mobile}</p>
              <p><b>Application Ref:</b> ${parsed.application_ref || "—"}</p>
              <p><b>Message:</b></p>
              <p style="white-space:pre-wrap">${parsed.message.replace(/</g, "&lt;")}</p>
              <p><a href="${origin}/admin/complaints">Open in CRM →</a></p>
            `,
            leadId,
          });
        } catch {
          /* never block user on email backend */
        }


        return new Response(
          JSON.stringify({ ok: true, complaintNumber: complaint.complaint_number }),
          { status: 200, headers: cors },
        );
      },
    },
  },
});
