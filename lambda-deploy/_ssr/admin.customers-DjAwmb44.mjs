import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { Y as useFinancialVisibility, j as useServerFn } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as listCustomers, g as getRepeatPurchaseMetrics } from "./customers.functions-CDRqqLIr.mjs";
import { c as StatCard, S as SectionCard, T as TableSkeleton } from "./ui-BVv-e2FI.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { J as Users, aC as Repeat, aD as Wallet, aE as TrendingUp, v as Search } from "../_libs/lucide-react.mjs";
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
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function CustomersPage() {
  const {
    formatINR
  } = useFinancialVisibility();
  const [q, setQ] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("all");
  const list = useServerFn(listCustomers);
  const metrics = useServerFn(getRepeatPurchaseMetrics);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.customers", q, status],
    queryFn: () => list({
      data: {
        q,
        status,
        limit: 200
      }
    }),
    placeholderData: (p) => p
  });
  const {
    data: m
  } = useQuery({
    queryKey: ["admin.customers.metrics"],
    queryFn: () => metrics()
  });
  const rows = data?.rows ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Customers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Unified Customer 360 — every person who ever bought a service, deduplicated across leads." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 0, label: "Total Customers", value: m?.totalCustomers ?? 0, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }), gradient: "primary", loading: !m }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 1, label: "Repeat Customers", value: m?.repeatCustomers ?? 0, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "size-4" }), gradient: "success", loading: !m, hint: m ? `${Math.round((m.repeatRate ?? 0) * 100)}% repeat rate` : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 2, label: "Lifetime Value", value: formatINR(m?.lifetimeValue ?? 0), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4" }), gradient: "primary", loading: !m }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 3, label: "Avg LTV", value: formatINR(m?.avgLtv ?? 0), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4" }), gradient: "warn", loading: !m })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "All customers", action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", style: {
      color: "var(--admin-fg-muted)"
    }, children: [
      rows.length,
      " shown"
    ] }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[260px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2", style: {
            color: "var(--admin-fg-muted)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search name, email, mobile, customer code…", className: "w-full rounded-lg border pl-8 pr-3 py-2 text-sm bg-transparent", style: {
            borderColor: "var(--admin-border)"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "rounded-lg border px-3 py-2 text-sm bg-transparent", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All statuses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "inactive", children: "Inactive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "blocked", children: "Blocked" })
        ] })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 6, cols: 6 }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm py-10 text-center", style: {
        color: "var(--admin-fg-muted)"
      }, children: "No customers match." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-xs uppercase tracking-wide", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Apps" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "LTV" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "State" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Last seen" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t hover:bg-[var(--admin-surface-2)] transition-colors", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2.5 pr-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/customers/$customerId", params: {
              customerId: r.id
            }, className: "font-medium hover:underline", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]", style: {
              color: "var(--admin-fg-muted)"
            }, children: r.customer_code ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2.5 pr-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: r.primary_mobile ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] truncate max-w-[220px]", style: {
              color: "var(--admin-fg-muted)"
            }, children: r.primary_email ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2.5 pr-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: r.total_applications }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px]", style: {
              color: "var(--admin-fg-muted)"
            }, children: [
              "(",
              r.completed_applications,
              " done · ",
              r.pending_applications,
              " open)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-3 font-medium", children: formatINR(Number(r.lifetime_value ?? 0)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-3 text-xs", children: r.state ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-3 text-xs", style: {
            color: "var(--admin-fg-muted)"
          }, children: new Date(r.last_seen_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }) })
        ] }, r.id)) })
      ] }) })
    ] })
  ] });
}
export {
  CustomersPage as component
};
