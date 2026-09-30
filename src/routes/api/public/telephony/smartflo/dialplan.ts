import { createFileRoute } from "@tanstack/react-router";

const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };

async function handle(request: Request): Promise<Response> {
  const { verifySmartflo, routeCall, fallbackResponse } = await import("@/lib/telephony/smartflo.server");
  try {
    if (!verifySmartflo(request)) {
      console.log(JSON.stringify({ event: "smartflo_dialplan", decision: "rejected", failure_reason: "auth_failed" }));
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers });
    }
    let input: Record<string, unknown> = {};
    if (request.method === "GET") {
      input = Object.fromEntries(new URL(request.url).searchParams);
    } else {
      const ct = request.headers.get("content-type") ?? "";
      const raw = await request.text();
      if (raw.length > 20_000) throw new Error("payload_too_large");
      if (ct.includes("application/x-www-form-urlencoded")) input = Object.fromEntries(new URLSearchParams(raw));
      else input = raw ? JSON.parse(raw) : {};
    }
    const { response } = await routeCall(input);
    return new Response(JSON.stringify(response), { status: 200, headers });
  } catch (e) {
    console.log(JSON.stringify({ event: "smartflo_dialplan", decision: "fallback", failure_reason: `handler_error:${(e as Error)?.message}` }));
    return new Response(JSON.stringify(fallbackResponse()), { status: 200, headers });
  }
}

export const Route = createFileRoute("/api/public/telephony/smartflo/dialplan")({
  server: { handlers: { POST: ({ request }) => handle(request), GET: ({ request }) => handle(request) } },
});
