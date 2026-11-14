function isAbortError(error, depth = 0) {
  if (depth > 3 || error == null) return false;
  const err = error;
  const name = String(err.name || "");
  const message = String(err.message || "").toLowerCase();
  const code = String(err.code || "");
  if (name === "AbortError" || code === "ECONNRESET" || code === "ERR_STREAM_PREMATURE_CLOSE" || message.includes("aborted") || message.includes("the operation was aborted")) {
    return true;
  }
  if (err.cause && err.cause !== error) {
    return isAbortError(err.cause, depth + 1);
  }
  return false;
}
let lastCapturedError;
const TTL_MS = 5e3;
function record(error) {
  if (isAbortError(error)) return;
  lastCapturedError = { error, at: Date.now() };
  try {
    const stack = error instanceof Error ? error.stack : void 0;
    console.error("[ssr-capture]", stack ?? String(error));
  } catch {
  }
}
if (typeof console !== "undefined") {
  const originalConsoleError = console.error.bind(console);
  console.error = (...args) => {
    if (args.some((arg) => isAbortError(arg))) return;
    originalConsoleError(...args);
  };
}
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record(event.error ?? event));
  globalThis.addEventListener(
    "unhandledrejection",
    (event) => record(event.reason)
  );
}
function consumeLastCapturedError() {
  if (!lastCapturedError) return void 0;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = void 0;
    return void 0;
  }
  const { error } = lastCapturedError;
  lastCapturedError = void 0;
  return error;
}
function renderErrorPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
function envList(name) {
  const raw = process.env[name];
  if (!raw) return [];
  return raw.split(",").map((v) => v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "")).filter(Boolean);
}
function hostOf(url, fallback) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return fallback;
  }
}
function getCrmBaseUrl() {
  return process.env.CRM_BASE_URL || "https://crm.businesshelpservices.com";
}
function getApiBaseUrl() {
  return process.env.API_BASE_URL || "https://api.businesshelpservices.com";
}
function getCrmHost() {
  return hostOf(getCrmBaseUrl(), "crm.businesshelpservices.com");
}
function getApiHost() {
  return hostOf(getApiBaseUrl(), "api.businesshelpservices.com");
}
function getPublicHosts() {
  const configured = envList("PUBLIC_HOSTS");
  if (configured.length) return configured;
  return ["udyamadhar.in", "udyamregistrations.in", "gstcertificate.in"];
}
function isDevHost(host) {
  return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host.endsWith(".localhost") || host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com") || host.endsWith(".lovable.dev");
}
function normalizeHost(hostHeader) {
  return (hostHeader ?? "").toLowerCase().split(":")[0].trim();
}
function classifyHost(hostHeader) {
  const host = normalizeHost(hostHeader);
  if (!host || isDevHost(host)) return "dev";
  if (host === getCrmHost()) return "crm";
  if (host === getApiHost()) return "api";
  const stripped = host.replace(/^www\./, "");
  if (getPublicHosts().includes(stripped)) return "public";
  return "public";
}
function isInfrastructurePath(pathname) {
  return pathname.startsWith("/_") || pathname.startsWith("/assets/") || pathname.startsWith("/@") || pathname.startsWith("/node_modules/") || pathname.startsWith("/.well-known/") || pathname === "/favicon.ico" || pathname === "/sw.js" || /\.[a-z0-9]{2,5}$/i.test(pathname);
}
function isCrmPath(pathname) {
  return pathname === "/admin-login" || pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/unauthorized" || pathname.startsWith("/auth/callback") || pathname.startsWith("/seo-admin");
}
function isApiPath(pathname) {
  return pathname === "/api" || pathname.startsWith("/api/");
}
function decideHostRouting(host, pathname) {
  const role = classifyHost(host);
  if (role === "dev") return { action: "allow" };
  if (isInfrastructurePath(pathname)) return { action: "allow" };
  if (role === "api") {
    return isApiPath(pathname) ? { action: "allow" } : { action: "notFound" };
  }
  if (role === "crm") {
    if (pathname === "/") return { action: "redirect", location: "/admin-login" };
    if (isCrmPath(pathname) || isApiPath(pathname)) return { action: "allow" };
    return { action: "notFound" };
  }
  if (isCrmPath(pathname)) return { action: "notFound" };
  return { action: "allow" };
}
let serverEntryPromise;
async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("./server-BFjd5iLF.mjs").then((n) => n.J).then(
      (m) => m.default ?? m
    );
  }
  return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(request, response) {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }
  if (request.signal.aborted) {
    return new Response(null, { status: 499, statusText: "Client Closed Request" });
  }
  const captured = consumeLastCapturedError();
  if (!captured || isAbortError(captured)) {
    return response;
  }
  const stack = captured instanceof Error ? captured.stack : void 0;
  console.error("[ssr-500]", stack ?? captured ?? `h3 swallowed SSR error: ${body}`);
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
const PRIMARY_HOST = "udyamadhar.in";
async function rewriteHostInHtml(request, response) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === PRIMARY_HOST || host.includes("lovable") || host === "localhost") return response;
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;
  const html = await response.text();
  const origin = `${url.protocol}//${url.host}`;
  const body = html.split(`https://www.${PRIMARY_HOST}`).join(origin).split(`https://${PRIMARY_HOST}`).join(origin);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
const NOT_FOUND_BODY = '<!doctype html><html><head><meta charset="utf-8"><title>404 Not Found</title><meta name="robots" content="noindex,nofollow"></head><body style="font-family:system-ui;padding:3rem;text-align:center"><h1>404</h1><p>Page not found.</p></body></html>';
const server = {
  async fetch(request, env, ctx) {
    try {
      const reqUrl = new URL(request.url);
      const decision = decideHostRouting(reqUrl.hostname, reqUrl.pathname);
      if (decision.action === "redirect") {
        return new Response(null, { status: 302, headers: { Location: decision.location } });
      }
      if (decision.action === "notFound") {
        return new Response(NOT_FOUND_BODY, {
          status: 404,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "x-robots-tag": "noindex, nofollow"
          }
        });
      }
      const safeCtx = ctx && typeof ctx === "object" && typeof ctx.waitUntil === "function" ? ctx : { ...ctx && typeof ctx === "object" ? ctx : {}, waitUntil: () => void 0 };
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, safeCtx);
      const normalized = await normalizeCatastrophicSsrResponse(request, response);
      return await rewriteHostInHtml(request, normalized);
    } catch (error) {
      if (isAbortError(error)) {
        return new Response(null, { status: 499, statusText: "Client Closed Request" });
      }
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }
  }
};
export {
  server as default,
  isAbortError as i,
  renderErrorPage as r
};
