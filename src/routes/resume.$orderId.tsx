import { createFileRoute } from "@tanstack/react-router";

/**
 * /resume/:orderId — the link used in the E002 "incomplete information / form
 * link" email. It resolves the order's lead code and redirects the customer to
 * the onboarding form. Without this route the URL fell through to the catch-all
 * and bounced everyone to the homepage.
 */
export const Route = createFileRoute("/resume/$orderId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const orderId = params.orderId;
        const home = new Response(null, { status: 302, headers: { location: "/" } });
        if (!/^[0-9a-f-]{36}$/i.test(orderId)) return home;

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: app } = await supabaseAdmin
            .from("applications")
            .select("lead_id, leads:lead_id(lead_code)")
            .eq("id", orderId)
            .maybeSingle();

          const leadCode =
            (app as { leads?: { lead_code?: string | null } | null } | null)?.leads?.lead_code ?? null;
          if (!leadCode) return home;

          return new Response(null, {
            status: 302,
            headers: { location: `/onboarding/${encodeURIComponent(leadCode)}` },
          });
        } catch (e) {
          console.error("[resume] redirect failed", e);
          return home;
        }
      },
    },
  },
});
