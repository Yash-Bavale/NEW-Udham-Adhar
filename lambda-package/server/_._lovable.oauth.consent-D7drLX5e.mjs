import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { an as Route$Z, ao as oauth } from "./_ssr/router-QgJicixe.mjs";
import "./_libs/seroval.mjs";
import "./_libs/sonner.mjs";
import "./_ssr/index.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/seroval-plugins.mjs";
import "./_libs/cookie-es.mjs";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "./_ssr/constants-CKRzJJF_.mjs";
import "./_ssr/createSsrRpc-BO-AEXHh.mjs";
import "./_ssr/server-BFjd5iLF.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/auth-middleware-CWWVaY7_.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/client.functions-WMvtjq1i.mjs";
import "./_ssr/customer-access-core-Bd_9lLsD.mjs";
import "./_ssr/brand-DLB0j9eh.mjs";
import "./_libs/tanstack__zod-adapter.mjs";
import "./_libs/zod.mjs";
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_ssr/datetime-DvkGwlJs.mjs";
import "./_ssr/orders-filter-CXWoZisU.mjs";
import "./_ssr/computeOrderStage-D7ejTUnj.mjs";
import "./_ssr/consultation-asWR5IET.mjs";
import "./_libs/radix-ui__react-checkbox.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_ssr/roles-CFhgFhhh.mjs";
import "./_ssr/permissions.functions-DO0h7DgB.mjs";
import "./_ssr/client-BX5UfqqR.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/lovable.dev__webhooks-js.mjs";
import "./_libs/lovable.dev__email-js.mjs";
import "./_ssr/registry-DV_lUXjY.mjs";
import "./_libs/react-email__html.mjs";
import "./_libs/react-email__head.mjs";
import "./_libs/react-email__preview.mjs";
import "./_libs/react-email__body.mjs";
import "./_libs/react-email__container.mjs";
import "./_libs/react-email__heading.mjs";
import "./_libs/react-email__text.mjs";
import "./_libs/react-email__section.mjs";
import "./_libs/react-email__button.mjs";
import "./_libs/react-email__hr.mjs";
import "./_libs/lucide-react.mjs";
import "./_libs/date-fns.mjs";
import "./_libs/react-day-picker.mjs";
import "./_libs/date-fns__tz.mjs";
function Consent() {
  const details = Route$Z.useLoaderData();
  const {
    authorization_id
  } = Route$Z.useSearch();
  const [busy, setBusy] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const clientName = details?.client?.name ?? "an app";
  async function decide(approve) {
    setBusy(true);
    setError(null);
    const {
      data,
      error: error2
    } = approve ? await (await oauth()).approveAuthorization(authorization_id) : await (await oauth()).denyAuthorization(authorization_id);
    if (error2) {
      setBusy(false);
      setError(error2.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-md px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold", children: [
      "Connect ",
      clientName
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
      clientName,
      " is requesting access to the Udyam Ops CRM as you. It will be able to read leads and orders you can already see, and add internal notes."
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { role: "alert", className: "mt-4 text-sm text-destructive", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => decide(true), className: "flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50", children: busy ? "Working…" : "Approve" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => decide(false), className: "flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50", children: "Deny" })
    ] })
  ] }) });
}
export {
  Consent as component
};
