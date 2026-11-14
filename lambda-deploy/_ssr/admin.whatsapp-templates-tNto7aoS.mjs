import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SectionCard } from "./ui-BVv-e2FI.mjs";
import { a as Mail, b as MessageCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const TEMPLATES = [{
  code: "payment-received",
  name: "Payment Received",
  trigger: "Successful payment captured",
  body: "Hi {{customer_name}}, we've received your payment of ₹{{amount}} for {{service_name}}. Order: {{order_number}}. Our team will reach out shortly."
}, {
  code: "documents-required",
  name: "Documents Required",
  trigger: "Application moves to Documents Pending",
  body: "Hi {{customer_name}}, please share your {{document_list}} to continue with {{service_name}}. Upload here: {{upload_link}}"
}, {
  code: "service-started",
  name: "Service Started",
  trigger: "Application moves to Processing",
  body: "Hi {{customer_name}}, we've started working on your {{service_name}} (Order {{order_number}}). Expected completion: {{eta}}."
}, {
  code: "complaint-submitted",
  name: "Complaint Submitted",
  trigger: "Complaint filed with authority",
  body: "Hi {{customer_name}}, your complaint #{{complaint_number}} has been filed with {{authority_name}}. We'll keep you posted."
}, {
  code: "service-completed",
  name: "Service Completed",
  trigger: "Application status = Completed",
  body: "Hi {{customer_name}}, your {{service_name}} (Order {{order_number}}) is complete. Certificate: {{certificate_link}}. Thank you for choosing us!"
}];
function WhatsAppTemplatesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-medium tracking-tight", style: {
          color: "var(--admin-fg)"
        }, children: "WhatsApp Templates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          "Outbound message templates used by automated workflows. Merge tags wrapped in ",
          "{{ }}",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/emails", className: "inline-flex items-center gap-1.5 text-xs rounded-md border px-3 py-1.5", style: {
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5" }),
        " Email Templates"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border-l-4 p-3 text-xs", style: {
      borderLeftColor: "var(--admin-info)",
      background: "var(--admin-surface-2)",
      color: "var(--admin-fg-muted)"
    }, children: "WhatsApp Business API integration ships in the next phase. Templates below mirror the approved structure and will be wired to the messaging queue once the provider is connected." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-4", children: TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: t.name, action: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", style: {
      color: "var(--admin-fg-subtle)"
    }, children: t.code }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Trigger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", style: {
        color: "var(--admin-fg)"
      }, children: t.trigger }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide pt-2", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Message" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border p-3 text-sm whitespace-pre-wrap", style: {
        borderColor: "var(--admin-border)",
        background: "var(--admin-surface-2)",
        color: "var(--admin-fg)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "inline size-3.5 mr-1.5 align-text-bottom", style: {
          color: "var(--admin-success)"
        } }),
        t.body
      ] })
    ] }) }, t.code)) })
  ] });
}
export {
  WhatsAppTemplatesPage as component
};
