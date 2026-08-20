import { createFileRoute } from "@tanstack/react-router";

/**
 * Temporary, secret-guarded read-only CCAvenue Order Status API probe.
 * Requires the x-cron-secret header. No writes.
 */
export const Route = createFileRoute("/api/public/ccav-selfcheck")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env["CRON_SECRET"] ?? "";
        if (!secret || request.headers.get("x-cron-secret") !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { callOrderStatusApi } = await import("@/lib/payments/ccavenue.server");
          const res = await callOrderStatusApi("CCAV-SELFCHECK-000000");
          return Response.json({ ok: true, raw: res.raw, status: res.status });
        } catch (e) {
          return Response.json({ ok: false, error: (e as Error).message }, { status: 200 });
        }
      },
    },
  },
});
