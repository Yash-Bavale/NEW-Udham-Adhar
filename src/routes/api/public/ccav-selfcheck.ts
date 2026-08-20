import { createFileRoute } from "@tanstack/react-router";

/** Temporary read-only CCAvenue Order Status API probe (no writes). */
export const Route = createFileRoute("/api/public/ccav-selfcheck")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { encryptRequest, getCcavCreds, CCAV_API_URL } = await import(
            "@/lib/payments/ccavenue.server"
          );
          const { accessCode, workingKey } = getCcavCreds();
          const enc = encryptRequest(
            JSON.stringify({ order_no: "CCAV-SELFCHECK-000000" }),
            workingKey,
          );
          const res = await fetch(CCAV_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              enc_request: enc,
              access_code: accessCode,
              command: "orderStatusTracker",
              request_type: "JSON",
              response_type: "JSON",
              version: "1.2",
            }),
          });
          const text = await res.text();
          return Response.json({ httpStatus: res.status, text: text.slice(0, 1000) });
        } catch (e) {
          return Response.json({ error: (e as Error).message });
        }
      },
    },
  },
});
