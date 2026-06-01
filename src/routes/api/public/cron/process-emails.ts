// pg_cron calls this every minute with the anon apikey header.
import { createFileRoute } from "@tanstack/react-router";
import { processQueueInternal } from "@/lib/emails/emails.functions";

export const Route = createFileRoute("/api/public/cron/process-emails")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Anon apikey is acceptable — endpoint only drains the queue and writes
        // to email_logs (admin-readable). No PII returned.
        const apikey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const result = await processQueueInternal(50);
          return Response.json({ ok: true, ...result });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "unknown";
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      },
    },
  },
});
