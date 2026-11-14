import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { C as CustomerRefGate, u as useCustomerLeadCode } from "./CustomerRefGate-B4GXNjz6.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { ai as useAccessToken, j as useServerFn, b as trackEvent, H as Button } from "./router-QgJicixe.mjs";
import { C as Card } from "./card-CjqxMl2c.mjs";
import { i as getApplicationSummary } from "./gateways.functions-CnMuOyBZ.mjs";
import { S as SecureLinkNotice } from "./SecureLinkNotice-SV_fcG-2.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { L as LoaderCircle, C as Clock, ax as TriangleAlert } from "../_libs/lucide-react.mjs";
import "./customer-access.functions-N17nWKMW.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./constants-CKRzJJF_.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./datetime-DvkGwlJs.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./roles-CFhgFhhh.mjs";
import "./permissions.functions-DO0h7DgB.mjs";
import "./client-BX5UfqqR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/lovable.dev__webhooks-js.mjs";
import "../_libs/lovable.dev__email-js.mjs";
import "./registry-DV_lUXjY.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
const PAID_STATUSES = /* @__PURE__ */ new Set(["payment_successful", "under_process", "completed"]);
function PendingPage() {
  const leadCode = useCustomerLeadCode();
  const accessToken = useAccessToken(leadCode, ["co", "ob"]);
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const [stillPending, setStillPending] = reactExports.useState(false);
  reactExports.useEffect(() => {
    trackEvent("payment_pending_page_view", {
      leadCode
    });
  }, [leadCode]);
  reactExports.useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    let attempt = 0;
    const poll = async () => {
      while (!cancelled) {
        try {
          const res = await getSummary({
            data: {
              leadCode,
              accessToken
            }
          });
          if (cancelled) return;
          const isPaid = !!res?.lead?.payment || PAID_STATUSES.has(res?.lead?.status);
          if (isPaid) {
            navigate({
              to: "/success/$leadCode",
              params: {
                leadCode
              },
              replace: true
            });
            return;
          }
        } catch {
        }
        attempt++;
        setElapsed(attempt * 4);
        if (attempt >= 30) {
          setStillPending(true);
          return;
        }
        await new Promise((r) => setTimeout(r, 4e3));
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [leadCode, getSummary, navigate, accessToken]);
  if (accessToken === null) return /* @__PURE__ */ jsxRuntimeExports.jsx(SecureLinkNotice, { leadCode });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-b from-amber-50/40 to-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden shadow-xl border-amber-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-4 ring-8 ring-amber-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-10 h-10 text-amber-600 animate-spin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-brand-navy font-display mb-2", children: "Confirming your payment…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 text-sm mb-1", children: "PayU is still confirming this transaction. This usually takes under a minute." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mb-6", children: [
        "Ref: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-brand-navy", children: leadCode }),
        elapsed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · ",
          elapsed,
          "s elapsed"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center text-xs text-slate-500 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Please don't close or refresh this page." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400", children: "If your account was debited, the payment will be auto-reconciled — please do not pay twice." })
    ] }),
    stillPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-amber-200 bg-amber-50/60 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-brand-navy text-sm mb-1", children: "Taking longer than usual" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600", children: "We still haven't received confirmation from PayU. You can retry the payment, or contact our support team for help." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/payment/$leadCode", params: {
          leadCode
        }, className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-brand-navy hover:bg-brand-navy-deep text-white rounded-full", children: "Retry Payment" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full rounded-full", children: "Contact Support" }) })
      ] })
    ] })
  ] }) }) });
}
function PendingPageGated() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerRefGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PendingPage, {}) });
}
export {
  PendingPageGated as component
};
