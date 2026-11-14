import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { C as CustomerRefGate, u as useCustomerLeadCode } from "./CustomerRefGate-B4GXNjz6.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { av as Route$z, j as useServerFn } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as getOnboarding } from "./onboarding.functions-DdT_CVNt.mjs";
import { u as useOnboardingAccess } from "./useOnboardingAccess-zWvfHOOA.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { N as PhoneCall, E as Check, ao as Sparkles, m as CheckCheck, aB as Copy, C as Clock, bj as Building2, l as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "./schemas-DClqju6h.mjs";
function DonePage() {
  const leadCode = useCustomerLeadCode();
  const {
    help
  } = Route$z.useSearch();
  const helpMode = help === 1;
  const fetchFn = useServerFn(getOnboarding);
  const accessToken = useOnboardingAccess(leadCode);
  const {
    data
  } = useQuery({
    queryKey: ["onboarding", leadCode, accessToken],
    queryFn: () => fetchFn({
      data: {
        leadCode,
        accessToken
      }
    }),
    enabled: !!accessToken,
    retry: false
  });
  const [copied, setCopied] = reactExports.useState(false);
  const copyReference = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(leadCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2e3);
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-[radial-gradient(circle_at_50%_0%,#ecfdf5_0%,#f8fafc_40%,#ffffff_100%)] text-slate-800 flex flex-col justify-between antialiased selection:bg-teal-100 selection:text-teal-900 py-8 md:py-14 px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "w-full max-w-4xl mx-auto flex-grow flex flex-col items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_25px_-5px_rgba(20,184,166,0.08)] overflow-hidden", "data-purpose": "confirmation-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 sm:p-10 md:p-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-teal-400/25 blur-xl scale-125 pointer-events-none" }),
        helpMode ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-8 ring-indigo-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "w-10 h-10 md:w-12 md:h-12 text-white" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/30 ring-8 ring-teal-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-10 h-10 md:w-12 md:h-12 text-white stroke-[2.5]" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold text-[#0f1f38] tracking-tight mb-3", children: helpMode ? "We'll Call You Shortly" : "Your Information Is Submitted Successfully" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto", children: helpMode ? "Our expert is reaching out to help you submit the form. We will call you on your registered mobile number as soon as possible." : "We have received your details successfully. Our team will call you on your registered mobile number to process your application." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-full text-xs sm:text-sm text-slate-700 shadow-xs", "data-purpose": "reference-pill", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-teal-600 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Reference: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-[#0f1f38] tracking-wide font-bold", children: leadCode })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: copyReference, className: "ml-1 text-slate-400 hover:text-teal-600 transition-colors p-1 rounded hover:bg-slate-200/50 cursor-pointer", title: "Copy Reference Number", children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-4 h-4 text-teal-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }) }),
        copied && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-teal-600 font-medium", children: "Copied!" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-teal-50/60 to-white border border-teal-100 rounded-2xl p-5 flex items-start gap-4 shadow-xs hover:border-teal-200 transition text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800", children: "Processing & Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600 mt-1", children: [
            "Within ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-[#0f1f38] font-semibold", children: "24–48 business hours" }),
            " after the required verification process is completed."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 shadow-xs hover:border-slate-300 transition text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-[#0f1f38]/10 text-[#0f1f38] flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800", children: "Business Operating Hours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-600 mt-1 font-medium text-[#0f1f38]", children: [
            "Monday – Saturday",
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: "10:00 AM – 6:00 PM IST" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 inline-flex items-center text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-md", children: "Sunday & National Holidays: Closed" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 pt-8 border-t border-slate-100 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-[#0f1f38] tracking-tight mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-teal-600 shrink-0" }),
        "What happens next?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50/70 border border-slate-100 rounded-xl p-4 flex flex-col justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0f1f38] text-white text-xs font-bold mb-2", children: "1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-slate-800", children: "Verification Call" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 leading-normal", children: "Keep your registered mobile phone handy. Our executive will reach out to verify documents." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50/70 border border-slate-100 rounded-xl p-4 flex flex-col justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0f1f38] text-white text-xs font-bold mb-2", children: "2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-slate-800", children: "Application Processing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 leading-normal", children: "Your certificate submission is lodged directly with the authorized department." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50/70 border border-slate-100 rounded-xl p-4 flex flex-col justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0f1f38] text-white text-xs font-bold mb-2", children: "3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-slate-800", children: "Digital Delivery" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 leading-normal", children: "Received directly via Email in verified official PDF format." })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-col sm:flex-row items-center justify-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0f1f38] hover:bg-[#172e4d] text-white font-medium text-sm text-center shadow-md focus:ring-4 focus:ring-slate-300 transition-all duration-200", children: "Back to Home" }) })
  ] }) }) }) });
}
function DonePageGated() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerRefGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DonePage, {}) });
}
export {
  DonePageGated as component
};
