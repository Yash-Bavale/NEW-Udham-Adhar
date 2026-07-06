// Cron endpoint: poll Zoho Mail inbox for new messages every 2 minutes.
// Guarded by the Supabase anon key in the `apikey` header (matches the
// project's other /api/public/cron routes).

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/cron/poll-zoho-inbox")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey =
          request.headers.get("apikey") ||
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        // Accept any of the keys the various cron jobs may present. Env
        // rotation (anon → publishable, or a manual CRON_SECRET) previously
        // caused a 401 loop that stopped inbound emails from being ingested
        // and, as a result, no support ticket was ever created for replies.
        const allowed = new Set(
          [
            process.env.SUPABASE_ANON_KEY,
            process.env.SUPABASE_PUBLISHABLE_KEY,
            process.env.CRON_SECRET,
          ].filter((v): v is string => Boolean(v))
        );
        if (!apikey || allowed.size === 0 || !allowed.has(apikey)) {
          return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const { pollZohoInbox } = await import("@/lib/mail/inbox-matcher.server");
          const result = await pollZohoInbox(50);
          return Response.json({ ok: true, ...result });
        } catch (e) {
          const message = e instanceof Error ? e.message : "unknown";
          console.error("[cron:poll-zoho-inbox] failed", message);
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
