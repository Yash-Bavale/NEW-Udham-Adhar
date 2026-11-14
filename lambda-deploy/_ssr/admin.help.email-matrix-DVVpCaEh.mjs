import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card } from "./card-CjqxMl2c.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "./router-QgJicixe.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./constants-CKRzJJF_.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
const EMAILS = [{
  code: "E001",
  name: "Order Welcome + Invoice",
  trigger: "auto",
  when: "PayU webhook → ORDER_CREATED",
  audience: "Customer"
}, {
  code: "E002",
  name: "Onboarding Form Link",
  trigger: "manual",
  when: "Send/Resend Form Link button",
  audience: "Customer"
}, {
  code: "E003",
  name: "Customer Hold Notice",
  trigger: "auto",
  when: "Transition → CUSTOMER_SIDE_DELAY",
  audience: "Customer"
}, {
  code: "E004",
  name: "Order Closed (Auto)",
  trigger: "auto",
  when: "Scheduler 2: CUSTOMER_SIDE_DELAY > 24h",
  audience: "Customer + staff"
}, {
  code: "E005",
  name: "Our Side Delay Notice",
  trigger: "auto",
  when: "Transition → OUR_SIDE_DELAY",
  audience: "Customer"
}, {
  code: "E006",
  name: "Order Completed",
  trigger: "auto",
  when: "Transition → COMPLETED",
  audience: "Customer"
}, {
  code: "E007",
  name: "Consultation Completed",
  trigger: "manual",
  when: "Talk-to-expert wrap up",
  audience: "Customer"
}, {
  code: "E008",
  name: "Ticket Reply",
  trigger: "manual",
  when: "Reply from ticket workspace",
  audience: "Customer"
}, {
  code: "E009",
  name: "Ticket Resolved",
  trigger: "auto/manual",
  when: "On ticket resolve",
  audience: "Customer"
}, {
  code: "E010",
  name: "Ticket Closed",
  trigger: "auto/manual",
  when: "On ticket close",
  audience: "Customer"
}, {
  code: "E011",
  name: "Technical Delay Resolved",
  trigger: "manual",
  when: "Resolved technical delay in workspace",
  audience: "Customer"
}, {
  code: "E012",
  name: "Service Changed",
  trigger: "auto",
  when: "Change Service in order workspace (same / downgrade / upgrade)",
  audience: "Customer"
}, {
  code: "R001",
  name: "Refund Approved",
  trigger: "manual",
  when: "Refund processed & confirmed",
  audience: "Customer"
}, {
  code: "R002",
  name: "Refund Rejected / Closed",
  trigger: "manual",
  when: "Refund rejected button in support ticket / workspace",
  audience: "Customer"
}];
const STATUSES = [{
  code: "NEW_ORDER",
  description: "Order created (payment received)",
  nextAllowed: "WAITING_CUSTOMER_INFO, CLOSED, REFUND_REQUESTED"
}, {
  code: "WAITING_CUSTOMER_INFO",
  description: "Form link sent, awaiting submission",
  nextAllowed: "INFO_RECEIVED, CUSTOMER_HOLD, CLOSED, REFUND_REQUESTED"
}, {
  code: "INFO_RECEIVED",
  description: "Customer submitted onboarding form",
  nextAllowed: "IN_PROCESSING, CUSTOMER_HOLD, OUR_SIDE_DELAY, CLOSED, REFUND_REQUESTED"
}, {
  code: "IN_PROCESSING",
  description: "Employee working on it",
  nextAllowed: "SUBMITTED_TO_GOVT, CUSTOMER_HOLD, OUR_SIDE_DELAY, HIGH_PRIORITY, CLOSED, REFUND_REQUESTED"
}, {
  code: "CUSTOMER_HOLD",
  description: "Waiting on customer for more info",
  nextAllowed: "INFO_RECEIVED, IN_PROCESSING, CLOSED, REFUND_REQUESTED"
}, {
  code: "OUR_SIDE_DELAY",
  description: "Delayed on our end (reminders active)",
  nextAllowed: "IN_PROCESSING, SUBMITTED_TO_GOVT, HIGH_PRIORITY, CLOSED"
}, {
  code: "SUBMITTED_TO_GOVT",
  description: "Filed with authority, awaiting cert",
  nextAllowed: "CERTIFICATE_ISSUED, OUR_SIDE_DELAY, HIGH_PRIORITY, CLOSED"
}, {
  code: "CERTIFICATE_ISSUED",
  description: "Certificate received, ready to deliver",
  nextAllowed: "COMPLETED, CLOSED"
}, {
  code: "COMPLETED",
  description: "Delivered to customer",
  nextAllowed: "REOPENED"
}, {
  code: "HIGH_PRIORITY",
  description: "Escalated — needs immediate attention",
  nextAllowed: "IN_PROCESSING, SUBMITTED_TO_GOVT, CLOSED"
}, {
  code: "REFUND_REQUESTED",
  description: "Customer/staff requested refund",
  nextAllowed: "REFUND_APPROVED, IN_PROCESSING, CLOSED"
}, {
  code: "REFUND_APPROVED",
  description: "Finance approved refund",
  nextAllowed: "REFUND_PROCESSED"
}, {
  code: "REFUND_PROCESSED",
  description: "Refund paid out",
  nextAllowed: "CLOSED"
}, {
  code: "CLOSED",
  description: "Order closed",
  nextAllowed: "REOPENED"
}, {
  code: "REOPENED",
  description: "Order reopened for rework",
  nextAllowed: "WAITING_CUSTOMER_INFO, IN_PROCESSING"
}];
const NOTIFICATIONS = [{
  event: "New order assigned",
  who: "Assignee",
  template: "You've been assigned SMV[X] — <Service> for <Customer>"
}, {
  event: "Onboarding form submitted",
  who: "Assignee",
  template: "Customer <Name> submitted form for SMV[X]"
}, {
  event: "Incoming email/ticket reply",
  who: "Assignee + Admin",
  template: "New reply on SMV[X] — <preview>"
}, {
  event: "Customer Hold started",
  who: "Assignee",
  template: "SMV[X] moved to Customer Hold — 24h auto-close timer started"
}, {
  event: "Order auto-closed (24h)",
  who: "Assignee + Admin",
  template: "SMV[X] auto-closed — no response in 24h"
}, {
  event: "Our Side Delay — reminder fires",
  who: "Assignee",
  template: "Reminder: SMV[X] still in Our Side Delay"
}, {
  event: "Escalation (6h inaction)",
  who: "Super Admin",
  template: "SMV[X] — Our Side Delay, employee has not acted in 6 hours"
}, {
  event: "HIGH_PRIORITY marked",
  who: "Super Admin + Assignee",
  template: "SMV[X] marked HIGH PRIORITY — immediate attention required"
}, {
  event: "Refund requested",
  who: "Super Admin + Finance",
  template: "Refund requested on SMV[X] — awaiting your approval"
}];
const triggerTone = {
  auto: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  manual: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "auto/manual": "bg-amber-50 text-amber-700 ring-amber-200"
};
function EmailMatrixPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-slate-900", children: "Email & Status Matrix" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Single source of truth for the order lifecycle: which email fires when, allowed status transitions, and who gets notified." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-slate-600", children: "Email templates (E001–E012)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left w-16", children: "Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left w-28", children: "Trigger" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "When" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left w-40", children: "Audience" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: EMAILS.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs text-slate-700", children: e.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-slate-900", children: e.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${triggerTone[e.trigger]}`, children: e.trigger }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600", children: e.when }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600", children: e.audience })
        ] }, e.code)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
        "All outbound emails share one thread per order (RFC-822 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Message-ID" }),
        " + ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "In-Reply-To" }),
        "). Customer replies land in the same conversation and appear in the order's Support Tickets panel automatically."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-slate-600", children: "Order status transitions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left w-56", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left w-96", children: "Can transition to" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/60 align-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs text-slate-700", children: s.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-700", children: s.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-500 text-xs font-mono", children: s.nextAllowed })
        ] }, s.code)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wider text-slate-600", children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left w-72", children: "Event" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left w-56", children: "Recipients" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Message" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: NOTIFICATIONS.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/60 align-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-slate-900", children: n.event }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600", children: n.who }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600 text-xs italic", children: n.template })
        ] }, n.event)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Delivered in-app via the bell icon (with sound + unread badge). Clicking a notification deep-links to the relevant Order Workspace or Ticket." })
    ] })
  ] });
}
export {
  EmailMatrixPage as component
};
