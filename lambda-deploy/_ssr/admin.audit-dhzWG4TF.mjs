import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn, I as Input, a1 as Badge } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CjqxMl2c.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { w as ShieldCheck, L as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as object, n as number, s as string } from "../_libs/zod.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const listAuditLogs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  entityType: string().optional(),
  entityId: string().optional(),
  actorEmail: string().optional(),
  limit: number().default(200)
})).handler(createSsrRpc("cf4cf9cddbb6aac45968f2c2632802af04240c2e67fd4aa06efe0025d51553b1"));
function AuditPage() {
  const fetchFn = useServerFn(listAuditLogs);
  const [entityType, setEntityType] = reactExports.useState("");
  const [actorEmail, setActorEmail] = reactExports.useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.audit", entityType, actorEmail],
    queryFn: () => fetchFn({
      data: {
        entityType: entityType || void 0,
        actorEmail: actorEmail || void 0,
        limit: 200
      }
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-6 h-6" }),
        " Audit Log"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Every privileged action across the admin panel. Super admin only." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-3 border-b bg-slate-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Filter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: entityType, onChange: (e) => setEntityType(e.target.value), className: "h-8 rounded-md border px-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All entity types" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "lead", children: "Lead" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "application", children: "Application" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "complaint", children: "Complaint" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "payment", children: "Payment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "onboarding", children: "Onboarding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "document", children: "Document" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "certificate", children: "Certificate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "payment_gateway", children: "Payment Gateway" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: actorEmail, onChange: (e) => setActorEmail(e.target.value), placeholder: "Filter by actor email…", className: "h-8 w-56 text-xs" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mx-auto" }) }) : data?.rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-slate-400 italic", children: "No audit entries match these filters." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-4", children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Actor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Entity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-4", children: "Changes" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: data?.rows.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 align-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-4 text-xs whitespace-nowrap", children: new Date(a.created_at).toLocaleString("en-IN") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-xs", children: a.actor_email || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 italic", children: "system" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "uppercase text-[10px]", children: a.entity_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 font-mono mt-1", children: (a.entity_id || "").slice(0, 8) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-xs", children: a.action.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-4", children: a.old_value || a.new_value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-slate-500", children: "View diff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-1 p-2 bg-slate-50 rounded text-[10px] overflow-auto max-w-md", children: JSON.stringify({
              before: a.old_value,
              after: a.new_value
            }, null, 2) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-300", children: "—" }) })
        ] }, a.id)) })
      ] }) })
    ] })
  ] });
}
export {
  AuditPage as component
};
