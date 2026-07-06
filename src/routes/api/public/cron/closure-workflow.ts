// Legacy cancellation workflow is disabled. BHS now uses the 12-template
// lifecycle: support tickets + close/refund actions instead of cancel-* emails.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/cron/closure-workflow")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        return Response.json({ ok: true, skipped: "legacy_cancellation_flow_disabled" });
      },
    },
  },
});
