const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const cronSecret = Deno.env.get("CRON_SECRET") ?? "";
  const authorization = req.headers.get("authorization") ?? "";
  const bearer = authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : "";
  const apiKey = req.headers.get("apikey") ?? "";
  const authorized =
    (!!serviceKey && (bearer === serviceKey || apiKey === serviceKey)) ||
    (!!cronSecret && (bearer === cronSecret || apiKey === cronSecret));
  if (!authorized) {
    return Response.json(
      { error: "unauthorized" },
      {
        status: 401,
        headers: CORS_HEADERS,
      },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: CORS_HEADERS });
  }

  const workerUrl = Deno.env.get("CLOUDFLARE_WORKER_URL");
  if (!workerUrl) {
    return Response.json(
      { error: "Cloudflare worker URL is not configured." },
      {
        status: 503,
        headers: CORS_HEADERS,
      },
    );
  }

  let endpoint: URL;
  try {
    endpoint = new URL("/api/internal/delete-order-documents", workerUrl);
    if (endpoint.protocol !== "https:") throw new Error("Worker URL must use HTTPS.");
  } catch {
    return Response.json(
      { error: "Cloudflare worker URL is invalid." },
      {
        status: 503,
        headers: CORS_HEADERS,
      },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization,
        apikey: apiKey,
      },
      body: JSON.stringify(payload),
    });
    const headers = new Headers(CORS_HEADERS);
    const contentType = response.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    return new Response(response.body, { status: response.status, headers });
  } catch {
    return Response.json(
      { error: "Could not reach the Cloudflare worker." },
      {
        status: 502,
        headers: CORS_HEADERS,
      },
    );
  }
});
