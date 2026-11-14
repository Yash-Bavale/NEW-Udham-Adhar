import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { _ as useRole, Y as useFinancialVisibility, j as useServerFn, a0 as DateRangePicker } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { S as SectionCard, T as TableSkeleton } from "./ui-BVv-e2FI.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { J as Users, af as Receipt, bd as IndianRupee, am as Activity, z as Calendar, r as ChevronLeft, s as ChevronRight, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { o as object, s as string, n as number } from "../_libs/zod.mjs";
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
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const getDailyReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  date: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(i)).handler(createSsrRpc("6f604ae370005824cf7df12f962d0123c2ef10434d597db0e6341ff48570a720"));
const getMonthlyReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  month: string().regex(/^\d{4}-\d{2}$/)
}).parse(i)).handler(createSsrRpc("0f0aede5fde78ba31eb70dc9a300dd72476ee819f62ff6349f9eceabc59c03b2"));
const getFinanceReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  from: string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(i)).handler(createSsrRpc("9bb41a1d650a9b2d7e3d6f466b34e28587533984bbc075a247e50cedf6a73acb"));
const listAuditLog = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(25),
  staffId: string().uuid().optional(),
  tableName: string().max(80).optional(),
  from: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).parse(i ?? {})).handler(createSsrRpc("ab44d51e25f84e10cd4513a24068b08803d793165397a24448b0ef62ed9ac300"));
function ReportsPage() {
  const role = useRole();
  const [tab, setTab] = reactExports.useState("daily");
  const tabs = [{
    id: "daily",
    label: "Daily"
  }, {
    id: "monthly",
    label: "Monthly"
  }, {
    id: "finance",
    label: "Finance"
  }, {
    id: "audit",
    label: "Audit Log",
    gated: true
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-medium tracking-tight", style: {
        color: "var(--admin-fg)"
      }, children: "Reports" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Daily snapshots, monthly performance, finance reconciliation, and audit trail." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex overflow-hidden rounded-md border text-xs font-medium", style: {
      borderColor: "var(--admin-border)"
    }, children: tabs.filter((t) => !t.gated || role.hasAny(["super_admin", "admin"])).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t.id), className: "px-4 py-1.5", style: {
      background: tab === t.id ? "var(--admin-accent)" : "var(--admin-surface)",
      color: tab === t.id ? "var(--admin-accent-fg)" : "var(--admin-fg)",
      borderRight: "1px solid var(--admin-border)"
    }, children: t.label }, t.id)) }),
    tab === "daily" && /* @__PURE__ */ jsxRuntimeExports.jsx(DailyTab, {}),
    tab === "monthly" && /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyTab, {}),
    tab === "finance" && /* @__PURE__ */ jsxRuntimeExports.jsx(FinanceTab, {}),
    tab === "audit" && role.hasAny(["super_admin", "admin"]) && /* @__PURE__ */ jsxRuntimeExports.jsx(AuditTab, {})
  ] });
}
function fmtN(n) {
  return new Intl.NumberFormat("en-IN").format(n || 0);
}
function formatIST(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(d).replace(",", "");
}
function todayIST() {
  const d = /* @__PURE__ */ new Date();
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(d);
  return fmt;
}
function monthIST() {
  return todayIST().slice(0, 7);
}
function DailyTab() {
  const {
    formatINR
  } = useFinancialVisibility();
  const [date, setDate] = reactExports.useState(todayIST());
  const fn = useServerFn(getDailyReport);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["daily-report", date],
    queryFn: () => fn({
      data: {
        date
      }
    })
  });
  const cards = [{
    label: "New Leads",
    icon: Users,
    value: data?.counts.leads,
    fmt: fmtN
  }, {
    label: "New Orders",
    icon: Receipt,
    value: data?.counts.orders,
    fmt: fmtN
  }, {
    label: "Revenue",
    icon: IndianRupee,
    value: data?.counts.revenue,
    fmt: (v) => formatINR(v)
  }, {
    label: "Pending Cases",
    icon: Activity,
    value: data?.counts.pending,
    fmt: fmtN
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4", style: {
        color: "var(--admin-fg-muted)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "rounded-md border bg-transparent px-2 py-1 text-sm", style: {
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-4", style: {
      background: "var(--admin-surface)",
      borderColor: "var(--admin-border)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium uppercase tracking-wide", style: {
          color: "var(--admin-fg-muted)"
        }, children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "size-4", style: {
          color: "var(--admin-fg-muted)"
        } })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-7 w-24 animate-pulse rounded", style: {
        background: "var(--admin-surface-2)"
      } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-medium tabular-nums", style: {
        color: "var(--admin-fg)"
      }, children: c.fmt(c.value ?? 0) })
    ] }, c.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Expandable, { title: `New Leads (${data?.leads.length ?? 0})`, loading: isLoading, rows: (data?.leads ?? []).map((l) => ({
      id: l.id,
      primary: `${l.lead_code} — ${l.name ?? "—"}`,
      secondary: [l.service, l.mobile].filter(Boolean).join(" · "),
      tail: formatIST(l.created_at)
    })) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Expandable, { title: `New Orders (${data?.orders.length ?? 0})`, loading: isLoading, rows: (data?.orders ?? []).map((o) => ({
      id: o.id,
      primary: `${o.application_code} — ${o.service_name ?? "—"}`,
      secondary: [o.customers?.name, o.fulfillment_status].filter(Boolean).join(" · "),
      tail: formatIST(o.created_at)
    })) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Expandable, { title: `Payments Received (${data?.payments.length ?? 0})`, loading: isLoading, rows: (data?.payments ?? []).map((p) => ({
      id: p.id,
      primary: p.leads?.name ?? p.leads?.lead_code ?? "—",
      secondary: formatINR(Number(p.amount ?? 0)),
      tail: formatIST(p.created_at)
    })) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Expandable, { title: `Pending Cases (${data?.pending.length ?? 0})`, loading: isLoading, rows: (data?.pending ?? []).map((o) => ({
      id: o.id,
      primary: `${o.application_code} — ${o.service_name ?? "—"}`,
      secondary: [o.customers?.name, o.fulfillment_status].filter(Boolean).join(" · "),
      tail: formatIST(o.created_at)
    })) })
  ] });
}
function Expandable({
  title,
  loading,
  rows
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), className: "flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium", style: {
      color: "var(--admin-fg)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: title }),
      open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-80 divide-y overflow-y-auto border-t", style: {
      borderColor: "var(--admin-border)"
    }, children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 4, cols: 3 }),
      !loading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 text-center text-xs", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Nothing to show." }),
      !loading && rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            color: "var(--admin-fg)"
          }, children: r.primary }),
          r.secondary && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]", style: {
            color: "var(--admin-fg-muted)"
          }, children: r.secondary })
        ] }),
        r.tail && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: r.tail })
      ] }, r.id))
    ] })
  ] });
}
function MonthlyTab() {
  const {
    formatINR
  } = useFinancialVisibility();
  const [month, setMonth] = reactExports.useState(monthIST());
  const fn = useServerFn(getMonthlyReport);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["monthly-report", month],
    queryFn: () => fn({
      data: {
        month
      }
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4", style: {
        color: "var(--admin-fg-muted)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "month", value: month, onChange: (e) => setMonth(e.target.value), className: "rounded-md border bg-transparent px-2 py-1 text-sm", style: {
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total Revenue", value: data ? formatINR(data.totalRevenue) : "—", loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total Leads", value: data ? fmtN(data.conversion.totalLeads) : "—", loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Conversion Rate", value: data ? `${data.conversion.conversionRate}%` : "—", loading: isLoading, hint: data ? `${fmtN(data.conversion.convertedLeads)} converted` : void 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Service-wise Revenue", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wide", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Revenue" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 4, cols: 3 }) }) }),
        !isLoading && (data?.serviceRevenue ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "px-4 py-6 text-center text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: "No revenue recorded this month." }) }),
        (data?.serviceRevenue ?? []).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
          borderColor: "var(--admin-border)",
          background: i % 2 ? "var(--admin-surface-2)" : "transparent"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", style: {
            color: "var(--admin-fg)"
          }, children: s.service }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right tabular-nums", children: fmtN(s.count) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right tabular-nums", children: formatINR(s.revenue) })
        ] }, s.service))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Staff Performance", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wide", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Assigned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Completed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Pending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Completion %" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 4, cols: 5 }) }) }),
        !isLoading && (data?.staffPerformance ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-6 text-center text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: "No assigned orders this month." }) }),
        (data?.staffPerformance ?? []).map((s, i) => {
          const pct = s.assigned > 0 ? Math.round(s.completed / s.assigned * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
            borderColor: "var(--admin-border)",
            background: i % 2 ? "var(--admin-surface-2)" : "transparent"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", style: {
              color: "var(--admin-fg)"
            }, children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right tabular-nums", children: fmtN(s.assigned) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right tabular-nums", style: {
              color: "var(--admin-success)"
            }, children: fmtN(s.completed) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right tabular-nums", style: {
              color: "var(--admin-warn)"
            }, children: fmtN(s.pending) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-right tabular-nums", children: [
              pct,
              "%"
            ] })
          ] }, s.user_id);
        })
      ] })
    ] }) })
  ] });
}
function Stat({
  label,
  value,
  hint,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-4", style: {
    background: "var(--admin-surface)",
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase tracking-wide", style: {
      color: "var(--admin-fg-muted)"
    }, children: label }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-7 w-24 animate-pulse rounded", style: {
      background: "var(--admin-surface-2)"
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-medium tabular-nums", style: {
      color: "var(--admin-fg)"
    }, children: value }),
    hint && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px]", style: {
      color: "var(--admin-fg-muted)"
    }, children: hint })
  ] });
}
function FinanceTab() {
  const {
    formatINR
  } = useFinancialVisibility();
  const today = todayIST();
  const [from, setFrom] = reactExports.useState(monthIST() + "-01");
  const [to, setTo] = reactExports.useState(today);
  const fn = useServerFn(getFinanceReport);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["finance-report", from, to],
    queryFn: () => fn({
      data: {
        from,
        to
      }
    })
  });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border p-4 text-sm", style: {
      borderColor: "var(--admin-border)",
      color: "var(--admin-danger)"
    }, children: error?.message ?? "Failed to load finance report" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DateRangePicker, { value: {
      from: from ? new Date(from) : void 0,
      to: to ? new Date(to) : void 0
    }, onChange: (range) => {
      setFrom(range.from ? range.from.toISOString().slice(0, 10) : "");
      setTo(range.to ? range.to.toISOString().slice(0, 10) : "");
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total Revenue", value: data ? formatINR(data.revenue) : "—", loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "GST Collected", value: data ? formatINR(data.gst.total) : "—", loading: isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Refunds Issued", value: data ? formatINR(data.refunds.total) : "—", loading: isLoading, hint: data ? `${data.refunds.count} refunds` : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Pending Payments", value: data ? formatINR(data.pending.total) : "—", loading: isLoading, hint: data ? `${data.pending.count} unpaid` : void 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "GST Breakdown", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [["Taxable Base", data?.gst.base ?? 0], ["CGST", data?.gst.cgst ?? 0], ["SGST", data?.gst.sgst ?? 0], ["IGST", data?.gst.igst ?? 0], ["Total GST", data?.gst.total ?? 0]].map(([label, val], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
      borderColor: "var(--admin-border)",
      background: i % 2 ? "var(--admin-surface-2)" : "transparent"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", style: {
        color: "var(--admin-fg)"
      }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right tabular-nums", children: formatINR(val) })
    ] }, label)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Expandable, { title: `Refunds (${data?.refunds.count ?? 0})`, loading: isLoading, rows: (data?.refunds.rows ?? []).map((r) => ({
      id: r.id,
      primary: r.leads?.name ?? r.leads?.lead_code ?? "—",
      secondary: formatINR(Number(r.amount ?? 0)),
      tail: formatIST(r.created_at)
    })) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Expandable, { title: `Pending Payments (${data?.pending.count ?? 0})`, loading: isLoading, rows: (data?.pending.rows ?? []).map((p) => ({
      id: p.id,
      primary: p.leads?.name ?? p.leads?.lead_code ?? "—",
      secondary: formatINR(Number(p.amount ?? 0)),
      tail: formatIST(p.created_at)
    })) })
  ] });
}
function AuditTab() {
  const [page, setPage] = reactExports.useState(1);
  const [tableName, setTableName] = reactExports.useState("");
  const [from, setFrom] = reactExports.useState("");
  const [to, setTo] = reactExports.useState("");
  const fn = useServerFn(listAuditLog);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["audit-log", page, tableName, from, to],
    queryFn: () => fn({
      data: {
        page,
        pageSize: 25,
        tableName: tableName || void 0,
        from: from || void 0,
        to: to || void 0
      }
    })
  });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border p-4 text-sm", style: {
      borderColor: "var(--admin-border)",
      color: "var(--admin-danger)"
    }, children: error?.message ?? "Failed to load audit log" });
  }
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 25));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: tableName, onChange: (e) => {
        setTableName(e.target.value);
        setPage(1);
      }, className: "rounded-md border bg-transparent px-2 py-1 text-sm", style: {
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All tables" }),
        (data?.tableNames ?? []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DateRangePicker, { value: {
        from: from ? new Date(from) : void 0,
        to: to ? new Date(to) : void 0
      }, onChange: (range) => {
        setFrom(range.from ? range.from.toISOString().slice(0, 10) : "");
        setTo(range.to ? range.to.toISOString().slice(0, 10) : "");
        setPage(1);
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wide", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Timestamp (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Staff" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Table" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Changes" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 6, cols: 6 }) }) }),
          !isLoading && (data?.rows ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-10 text-center text-xs", style: {
            color: "var(--admin-fg-muted)"
          }, children: "No audit entries match these filters." }) }),
          (data?.rows ?? []).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(AuditRow, { row: r, alt: i % 2 === 1 }, r.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex items-center justify-between border-t px-4 py-2 text-xs", style: {
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: data?.total ? `Page ${page} of ${totalPages} · ${fmtN(data.total)} entries` : "0 entries" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: page <= 1, onClick: () => setPage((p) => Math.max(1, p - 1)), className: "inline-flex items-center gap-1 rounded border px-2 py-1 disabled:opacity-40", style: {
            borderColor: "var(--admin-border)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3" }),
            " Prev"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: page >= totalPages, onClick: () => setPage((p) => p + 1), className: "inline-flex items-center gap-1 rounded border px-2 py-1 disabled:opacity-40", style: {
            borderColor: "var(--admin-border)"
          }, children: [
            "Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function AuditRow({
  row,
  alt
}) {
  const [open, setOpen] = reactExports.useState(false);
  const fields = Array.isArray(row.changed_fields) ? row.changed_fields : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
      borderColor: "var(--admin-border)",
      background: alt ? "var(--admin-surface-2)" : "transparent"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", style: {
        color: "var(--admin-fg-muted)"
      }, children: formatIST(row.created_at) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", style: {
        color: "var(--admin-fg)"
      }, children: row.changed_by_name ?? "System" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-[11px] uppercase", style: {
        color: "var(--admin-fg-muted)"
      }, children: row.changed_by_role ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-mono text-xs", children: row.table_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase", style: {
        background: "var(--admin-surface-2)",
        color: "var(--admin-fg)"
      }, children: row.action }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), className: "inline-flex items-center gap-1", style: {
        color: "var(--admin-accent)"
      }, children: [
        open ? "Hide" : `${fields.length || "View"} changes`,
        open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3" })
      ] }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: {
      background: "var(--admin-surface-2)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-2 text-[11px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto whitespace-pre-wrap", style: {
      color: "var(--admin-fg-muted)"
    }, children: JSON.stringify({
      record_id: row.record_id,
      changed_fields: row.changed_fields,
      old: row.old_data,
      new: row.new_data
    }, null, 2) }) }) })
  ] });
}
export {
  ReportsPage as component
};
