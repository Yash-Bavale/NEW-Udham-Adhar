import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function UnauthorizedPage() {
  reactExports.useEffect(() => {
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FAF8F4] p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full rounded-2xl bg-white shadow-xl p-8 text-center border border-slate-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto size-14 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-2xl", children: "!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-xl font-semibold text-slate-900", children: "Access denied" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-600", children: "You are signed in, but your account does not have permission to access the admin area. Contact your administrator if you believe this is an error." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50", children: "Go to website" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
        await supabase.auth.signOut();
        window.location.href = "/admin-login";
      }, className: "rounded-xl bg-[#0F1F3D] px-4 py-2 text-sm font-medium text-white hover:opacity-95", children: "Sign out" })
    ] })
  ] }) });
}
export {
  UnauthorizedPage as component
};
