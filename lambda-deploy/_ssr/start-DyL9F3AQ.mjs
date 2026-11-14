import { b as createMiddleware } from "./server-BFjd5iLF.mjs";
import { i as isAbortError, r as renderErrorPage } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
function dedupeSerializationAdapters(deduped, serializationAdapters) {
  for (let i = 0, len = serializationAdapters.length; i < len; i++) {
    const current = serializationAdapters[i];
    if (!deduped.has(current)) {
      deduped.add(current);
      if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
    }
  }
}
var createStart = (getOptions) => {
  return {
    getOptions: async () => {
      const options = await getOptions();
      if (options.serializationAdapters) {
        const deduped = /* @__PURE__ */ new Set();
        dedupeSerializationAdapters(deduped, options.serializationAdapters);
        options.serializationAdapters = Array.from(deduped);
      }
      return options;
    },
    createMiddleware
  };
};
let redirecting = false;
const attachSupabaseAuthLazy = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const { supabase } = await import("./client-BX5UfqqR.mjs");
    const { data } = await supabase.auth.getSession();
    let token = data.session?.access_token;
    const expiresAt = data.session?.expires_at ?? 0;
    if (!token || expiresAt * 1e3 < Date.now() + 3e4) {
      for (let i = 0; i < 2 && !token; i++) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        token = refreshed.session?.access_token;
        if (!token && i === 0) await new Promise((r) => setTimeout(r, 500));
      }
      if (!token && data.session?.access_token && expiresAt * 1e3 > Date.now()) {
        token = data.session.access_token;
      }
    }
    if (!token && typeof window !== "undefined" && !redirecting) {
      const path = window.location.pathname;
      if (path.startsWith("/admin") && !path.startsWith("/admin-login")) {
        redirecting = true;
        await supabase.auth.signOut({ scope: "local" }).catch(() => void 0);
        alert("Your login session has ended. Please sign in again to continue.");
        window.location.href = "/admin-login";
      }
    }
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
);
const errorMiddleware = createMiddleware().server(async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/lovable/") || url.pathname === "/email/unsubscribe") {
    return next();
  }
  try {
    return await next();
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
});
const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
  functionMiddleware: [attachSupabaseAuthLazy]
}));
export {
  startInstance
};
