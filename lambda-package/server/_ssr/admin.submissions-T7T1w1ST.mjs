import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as listSubmissions } from "./submissions-admin.functions-bHLflT8I.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
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
import "../_libs/tanstack__query-core.mjs";
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
const STATUS_CHIPS = {
  draft: "bg-slate-100 text-slate-700",
  submitted: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  needs_changes: "bg-amber-100 text-amber-700"
};
function SubmissionsPage() {
  const listFn = useServerFn(listSubmissions);
  const [status, setStatus] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.submissions", status, search],
    queryFn: () => listFn({
      data: {
        status: status || void 0,
        search: search || void 0,
        limit: 100
      }
    })
  });
  const rows = data?.rows ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Service Submissions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Review customer intake forms and map them to leads and applications." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-3 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name, mobile, email, code…", className: "flex-1 min-w-[240px] rounded border px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "rounded border px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "draft", children: "Draft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "submitted", children: "Submitted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "approved", children: "Approved" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: "Rejected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "needs_changes", children: "Needs changes" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Lead / Application" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Submitted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-3 py-8 text-center text-slate-500", children: "Loading…" }) }),
        !isLoading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-3 py-8 text-center text-slate-500", children: "No submissions found." }) }),
        rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t hover:bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.lead?.name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
              r.lead?.mobile ?? "",
              " · ",
              r.lead?.email ?? ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs", children: r.service_code }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: r.lead?.lead_code ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500", children: r.application?.application_code ?? "no application" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CHIPS[r.status] ?? "bg-slate-100 text-slate-700"}`, children: r.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-slate-600", children: r.submitted_at ? new Date(r.submitted_at).toLocaleString() : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/submissions/$submissionId", params: {
            submissionId: r.id
          }, className: "text-blue-700 text-xs hover:underline", children: "Review →" }) })
        ] }, r.id))
      ] })
    ] }) })
  ] });
}
export {
  SubmissionsPage as component
};
