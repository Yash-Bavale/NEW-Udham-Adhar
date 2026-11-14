import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function AuthCallbackPage() {
  reactExports.useEffect(() => {
    const {
      search,
      hash
    } = window.location;
    window.location.replace(`/admin-login${search}${hash}`);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-slate-50 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Signing you in…" }) });
}
export {
  AuthCallbackPage as component
};
