import { createFileRoute } from "@tanstack/react-router";

const BUCKET = "invoices";

export const Route = createFileRoute("/api/public/invoice/$leadCode")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const leadCode = String(params.leadCode || "").trim();
        if (!leadCode) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: lead } = await supabaseAdmin
          .from("leads")
          .select("id")
          .eq("lead_code", leadCode)
          .maybeSingle();
        if (!lead) return new Response("Not found", { status: 404 });

        const { data: inv } = await supabaseAdmin
          .from("invoices")
          .select("pdf_path")
          .eq("lead_id", lead.id)
          .order("issued_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!inv?.pdf_path) {
          return new Response("Invoice not ready yet. Please try again in a minute.", { status: 404 });
        }

        const { data: signed, error } = await supabaseAdmin
          .storage.from(BUCKET).createSignedUrl(inv.pdf_path, 60 * 10);
        if (error || !signed?.signedUrl) {
          return new Response("Could not generate download link.", { status: 500 });
        }

        return new Response(null, {
          status: 302,
          headers: { Location: signed.signedUrl },
        });
      },
    },
  },
});
