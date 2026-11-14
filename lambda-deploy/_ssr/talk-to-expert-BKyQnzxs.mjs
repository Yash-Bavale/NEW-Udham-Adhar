import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { p as storeAccessToken } from "./router-QgJicixe.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as INDIAN_STATES, L as LANGUAGES } from "./constants-CKRzJJF_.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import { av as Headphones, w as ShieldCheck, C as Clock, P as Phone, a as Mail } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
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
function TalkToExpertPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const inputCls = "w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      mobile: String(fd.get("mobile") ?? "").trim(),
      state: String(fd.get("state") ?? "").trim(),
      language: String(fd.get("language") ?? "").trim(),
      problem: String(fd.get("problem") ?? "").trim()
    };
    if (typeof window !== "undefined" && window.gtag_report_conversion) {
      window.gtag_report_conversion();
    }
    try {
      const res = await fetch("/api/public/talk-to-expert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok || !json?.leadCode) {
        throw new Error(json?.error || `Could not submit (status ${res.status}).`);
      }
      storeAccessToken(json.leadCode, json.accessToken);
      toast.success("Request received — taking you to payment.");
      navigate({
        to: "/apply/$leadCode/summary",
        params: {
          leadCode: json.leadCode
        }
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-8 md:py-12 grid gap-8 lg:grid-cols-2 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-foreground/90 text-[15px] leading-relaxed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-brand-navy/10 text-brand-navy px-3 py-1 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { className: "w-4 h-4" }),
        " Paid Expert Consultation"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold font-display text-foreground", children: "Talk to an Expert — get unstuck in one call" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Whether your issue is a forgotten registered mobile, a PAN/Aadhaar mismatch, a Udyam re-registration, or something we haven't listed — a dedicated specialist will review your case and give you a clear next step." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "₹99 + GST" }),
            " — fully adjustable against any service we deliver after the call."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Response within working hours (10:00–17:00 IST, Mon–Sat)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Consultation by phone / WhatsApp in Marathi, Hindi or English." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5 text-brand-navy mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "You'll receive a written summary on email after the call." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-3", children: "Business Help Services is a private consultancy. We are not affiliated with any government authority." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-form-header text-white text-center py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display", children: "Book Expert Consultation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-90 mt-0.5", children: "₹99 + GST · Pay securely via PayU" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "p-6 md:p-8 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Your Name / आपका नाम", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "name", required: true, maxLength: 120, className: inputCls, placeholder: "Enter your full name" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email / ईमेल", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "email", type: "email", required: true, maxLength: 160, className: inputCls, placeholder: "you@example.com" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mobile / मोबाइल", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-foreground/80 font-medium", children: "+91" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "mobile", required: true, inputMode: "numeric", pattern: "[6-9][0-9]{9}", maxLength: 10, className: `${inputCls} pl-14`, placeholder: "10-digit mobile" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State / राज्य", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { name: "state", required: true, defaultValue: "", className: inputCls, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select Your State" }),
          INDIAN_STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Preferred Language / भाषा", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { name: "language", required: true, defaultValue: "", className: inputCls, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select Language" }),
          LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l, children: l }, l))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "What problem do you need help with? / आपकी समस्या", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "problem", required: true, rows: 5, minLength: 10, maxLength: 2e3, className: "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring", placeholder: "Briefly describe your situation — what you tried, error messages, what you need." }) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 -mt-2", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold py-3 transition-colors disabled:opacity-60", children: busy ? "Submitting…" : "Continue to Payment — ₹116.82" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-center text-muted-foreground", children: "By continuing you agree to our Terms and acknowledge our Refund & Cancellation policy." })
      ] })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-foreground mb-1.5", children: label }),
    children
  ] });
}
export {
  TalkToExpertPage as component
};
