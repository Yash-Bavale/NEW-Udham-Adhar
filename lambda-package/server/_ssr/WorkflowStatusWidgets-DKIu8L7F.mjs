import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, a4 as Tabs, a5 as TabsList, a6 as TabsTrigger, a0 as DateRangePicker$1, Y as useFinancialVisibility, bh as useDashboardPrivacy, a as cn, a1 as Badge, H as Button } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { k as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CjqxMl2c.mjs";
import { S as ScrollArea } from "./scroll-area-DRnwZlXV.mjs";
import { R as Root } from "../_libs/radix-ui__react-separator.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as formatIST } from "./datetime-DvkGwlJs.mjs";
import { am as Activity, aF as Cog, T as Timer, aG as AlarmClock, aH as CirclePause, u as Ticket, a as Mail, aI as CircleX, J as Users, a8 as ShoppingBag, ax as TriangleAlert, Z as Bell, w as ShieldCheck, R as RefreshCw, B as Briefcase, o as UserCheck, aq as EyeOff, ad as Eye, aD as Wallet, aJ as Target, G as Globe, aE as TrendingUp, aK as Database, as as Send, aL as TrendingDown } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, C as ComposedChart, a as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, B as Bar, A as Area } from "../_libs/recharts.mjs";
const getDashboardKpis = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(createSsrRpc("020bc091654580d284d6e4b547596976d7ba10c1d2943a465532548eab44aa1b"));
const getDashboardCharts = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(createSsrRpc("f9335ee0512e2040f1278ffbfbca707cf7f62c095040043ebf802308a0d21d58"));
const getDashboardTopServices = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(createSsrRpc("bdaed249103b005012ed7d34cfef7ba34eb0153b3495781d2cfb1198a3a96d1a"));
const getDashboardSecondary = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(createSsrRpc("c05623c763ae910a4af76c3fd6df3625512dcaa1e542a58253897255d67e2aa0"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(createSsrRpc("955f3d0f1d75646335826c5e99af658baebab9f38a2231baf0ecdd5b4405ff94"));
const processEmailQueueNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("624e2203c3ff26f8a5838a9c68aac9cf7a9b7638a95506f34c62101a15a48a8d"));
const seedMissingEmailTemplates = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5bed9aac48aaba6b4ffaa620ccdb3f7be37412157c85ee73443c642675dbdcfb"));
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-md bg-primary/10", className), ...props });
}
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root.displayName;
function DateRangePicker({
  from,
  to,
  onChange,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DateRangePicker$1,
    {
      value: { from, to },
      onChange: (range) => onChange(range),
      className
    }
  );
}
const fmtN = (n) => new Intl.NumberFormat("en-IN").format(n || 0);
function pctDelta(curr, prev) {
  if (!prev && !curr) return null;
  if (!prev) return { pct: 100, up: true };
  const pct = (curr - prev) / prev * 100;
  return { pct: Math.abs(Math.round(pct * 10) / 10), up: pct >= 0 };
}
const PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 days" },
  { value: "15d", label: "15 days" },
  { value: "30d", label: "30 days" },
  { value: "mtd", label: "This month" },
  { value: "custom", label: "Custom" }
];
function SuperAdminDashboard({
  superMode = false,
  range,
  onRangeChange,
  title = "Executive Dashboard"
}) {
  const queryClient = useQueryClient();
  const fetchKpis = useServerFn(getDashboardKpis);
  const fetchCharts = useServerFn(getDashboardCharts);
  const fetchTopServices = useServerFn(getDashboardTopServices);
  const fetchSecondary = useServerFn(getDashboardSecondary);
  const isToday = range.preset === "today";
  const kpiStaleTime = isToday ? 3e4 : 3e5;
  const analyticsStaleTime = isToday ? 6e4 : 3e5;
  const kpisQuery = useQuery({
    queryKey: ["dash-kpis", range.preset, range.fromIso ?? "", range.toIso ?? ""],
    queryFn: () => fetchKpis({ data: range }),
    placeholderData: keepPreviousData,
    refetchInterval: isToday ? 6e4 : false,
    staleTime: kpiStaleTime
  });
  const chartsQuery = useQuery({
    queryKey: ["dash-charts", range.preset, range.fromIso ?? "", range.toIso ?? ""],
    queryFn: () => fetchCharts({ data: range }),
    placeholderData: keepPreviousData,
    refetchInterval: isToday ? 6e4 : false,
    staleTime: analyticsStaleTime
  });
  const topServicesQuery = useQuery({
    queryKey: ["dash-top-services", range.preset, range.fromIso ?? "", range.toIso ?? ""],
    queryFn: () => fetchTopServices({ data: range }),
    placeholderData: keepPreviousData,
    refetchInterval: isToday ? 6e4 : false,
    staleTime: analyticsStaleTime
  });
  const secondaryQuery = useQuery({
    queryKey: ["dash-secondary", range.preset, range.fromIso ?? "", range.toIso ?? ""],
    queryFn: () => fetchSecondary({ data: range }),
    placeholderData: keepPreviousData,
    refetchInterval: 6e4,
    staleTime: 6e4
  });
  const prefetchedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!kpisQuery.data || prefetchedRef.current || range.preset !== "today") return;
    prefetchedRef.current = true;
    const commonPresets = ["7d", "15d", "30d", "mtd"];
    const timeouts = [];
    commonPresets.forEach((preset, index) => {
      const delay = (index + 1) * 800;
      const t = setTimeout(() => {
        const prefetchRange = { preset };
        queryClient.prefetchQuery({
          queryKey: ["dash-kpis", preset, "", ""],
          queryFn: () => fetchKpis({ data: prefetchRange }),
          staleTime: 3e5
        });
        queryClient.prefetchQuery({
          queryKey: ["dash-charts", preset, "", ""],
          queryFn: () => fetchCharts({ data: prefetchRange }),
          staleTime: 3e5
        });
      }, delay);
      timeouts.push(t);
    });
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [kpisQuery.data, range.preset, queryClient, fetchKpis, fetchCharts]);
  const handleRefresh = () => {
    kpisQuery.refetch();
    chartsQuery.refetch();
    topServicesQuery.refetch();
    secondaryQuery.refetch();
  };
  const [now, setNow] = reactExports.useState(() => /* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(id);
  }, []);
  const customFrom = range.fromIso ? new Date(range.fromIso) : void 0;
  const customTo = range.toIso ? new Date(range.toIso) : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-emerald-500 animate-pulse" }),
          "Live · ",
          formatIST(now, { timeOnly: true }),
          " IST"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-bold tracking-tight", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          kpisQuery.data?.range.label ?? "Loading…",
          " · auto-refresh every 60s"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tabs,
          {
            value: range.preset,
            onValueChange: (v) => onRangeChange({ preset: v, fromIso: range.fromIso, toIso: range.toIso }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-9", children: PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: p.value, className: "text-xs px-2.5", children: p.label }, p.value)) })
          }
        ),
        range.preset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DateRangePicker,
          {
            from: customFrom,
            to: customTo,
            onChange: (r) => onRangeChange({
              preset: "custom",
              fromIso: r.from?.toISOString(),
              toIso: r.to?.toISOString()
            })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(KpiGrid, { data: kpisQuery.data, loading: kpisQuery.isLoading, range }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendCard, { data: chartsQuery.data, rangePreset: range.preset, loading: chartsQuery.isLoading, className: "lg:col-span-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TopServicesCard, { data: topServicesQuery.data, loading: topServicesQuery.isLoading })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WorkflowCard, { data: secondaryQuery.data?.workflow, loading: secondaryQuery.isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EmailQueueCard, { data: secondaryQuery.data?.emailQueue, loading: secondaryQuery.isLoading }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertsCard, { data: secondaryQuery.data?.alerts, loading: secondaryQuery.isLoading })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityCard, { data: secondaryQuery.data?.activity, loading: secondaryQuery.isLoading, className: superMode ? "lg:col-span-2" : "lg:col-span-3" }),
      superMode && /* @__PURE__ */ jsxRuntimeExports.jsx(SuperActionsCard, { onChanged: handleRefresh })
    ] })
  ] });
}
const TONE_STYLES = {
  indigo: { chip: "bg-indigo-50 text-indigo-600", ring: "ring-indigo-100", value: "text-slate-900", barA: "bg-indigo-500", barB: "bg-indigo-200" },
  emerald: { chip: "bg-emerald-50 text-emerald-600", ring: "ring-emerald-100", value: "text-slate-900", barA: "bg-emerald-500", barB: "bg-emerald-200" },
  amber: { chip: "bg-amber-50 text-amber-600", ring: "ring-amber-100", value: "text-slate-900", barA: "bg-amber-500", barB: "bg-amber-200" },
  rose: { chip: "bg-rose-50 text-rose-600", ring: "ring-rose-100", value: "text-slate-900", barA: "bg-rose-500", barB: "bg-rose-200" },
  sky: { chip: "bg-sky-50 text-sky-600", ring: "ring-sky-100", value: "text-slate-900", barA: "bg-sky-500", barB: "bg-sky-200" },
  violet: { chip: "bg-violet-50 text-violet-600", ring: "ring-violet-100", value: "text-slate-900", barA: "bg-violet-500", barB: "bg-violet-200" },
  slate: { chip: "bg-slate-100 text-slate-600", ring: "ring-slate-200", value: "text-slate-900", barA: "bg-slate-500", barB: "bg-slate-200" },
  teal: { chip: "bg-teal-50 text-teal-600", ring: "ring-teal-100", value: "text-slate-900", barA: "bg-teal-500", barB: "bg-teal-200" }
};
function DeltaPill({ d }) {
  if (!d) return null;
  const Icon = d.up ? TrendingUp : TrendingDown;
  const cls = d.up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-2.5" }),
    " ",
    d.pct,
    "%"
  ] });
}
function StatChip({
  label,
  value,
  tone,
  href
}) {
  const navigate = useNavigate();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const cls = {
    emerald: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
    rose: "text-rose-700 bg-rose-50 hover:bg-rose-100",
    amber: "text-amber-700 bg-amber-50 hover:bg-amber-100",
    sky: "text-sky-700 bg-sky-50 hover:bg-sky-100",
    slate: "text-slate-600 bg-slate-100 hover:bg-slate-200",
    indigo: "text-indigo-700 bg-indigo-50 hover:bg-indigo-100",
    violet: "text-violet-700 bg-violet-50 hover:bg-violet-100",
    teal: "text-teal-700 bg-teal-50 hover:bg-teal-100"
  };
  const displayVal = isPrivacyEnabled ? "•••" : typeof value === "number" ? fmtN(value) : value;
  const body = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums", children: displayVal })
  ] });
  const base = `inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${cls[tone]}`;
  if (href) {
    const [path, qs] = href.split("?");
    const search = {};
    if (qs) for (const kv of qs.split("&")) {
      const [k, v] = kv.split("=");
      if (k) search[k] = decodeURIComponent(v ?? "");
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate({ to: path, search });
        },
        className: `${base} transition-colors cursor-pointer`,
        children: body
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: base, children: body });
}
function ModernKpi({
  icon,
  label,
  value,
  tone,
  delta,
  subs,
  footer,
  href,
  action
}) {
  const navigate = useNavigate();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const t = TONE_STYLES[tone];
  const displayVal = isPrivacyEnabled ? "•••" : value;
  const displayFooter = isPrivacyEnabled && typeof footer === "string" && footer.includes("(") ? footer.replace(/\([^)]+\)/, "(••• / •••)") : footer;
  const body = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: () => {
        if (!href) return;
        const [path, qs] = href.split("?");
        const search = {};
        if (qs) for (const kv of qs.split("&")) {
          const [k, v] = kv.split("=");
          if (k) search[k] = decodeURIComponent(v ?? "");
        }
        navigate({ to: path, search });
      },
      className: `group relative flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition ring-1 ${t.ring} ${href ? "hover:shadow-md hover:border-slate-300 cursor-pointer" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-semibold uppercase tracking-wide text-slate-500", children: label }),
          delta !== void 0 && !isPrivacyEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(DeltaPill, { d: delta ?? null })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid size-8 shrink-0 place-items-center rounded-lg ${t.chip}`, children: icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold leading-tight tabular-nums truncate ${t.value}`, children: displayVal })
          ] }),
          action
        ] }),
        subs && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: subs }),
        displayFooter && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-2 text-[10px] text-slate-500", children: displayFooter })
      ]
    }
  );
  return body;
}
const KpiGrid = reactExports.memo(function KpiGrid2({ data, loading, range }) {
  const { formatShortINR, isFinancialPrivacyEnabled, toggleFinancialPrivacy } = useFinancialVisibility();
  if (loading || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr", children: Array.from({ length: 13 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[112px] rounded-xl" }, i)) });
  }
  const m = data.metrics;
  const leadsDelta = pctDelta(m.uniqueLeads, m.uniqueLeadsPrev);
  const paidDelta = pctDelta(m.paidOrders, m.paidOrdersPrev);
  const ticketsDelta = pctDelta(m.ticketsRaised, m.ticketsRaisedPrev);
  const revDelta = pctDelta(m.revenueInclTax, m.revenueInclTaxPrev);
  const convDelta = pctDelta(m.conversionRate, m.conversionRatePrev);
  const rangeQuery = range.preset === "custom" ? range.fromIso && range.toIso ? `dateFrom=${range.fromIso.slice(0, 10)}&dateTo=${range.toIso.slice(0, 10)}` : "" : `preset=${range.preset}`;
  const withRange = (url) => {
    if (!rangeQuery) return url;
    return url.includes("?") ? `${url}&${rangeQuery}` : `${url}?${rangeQuery}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-fr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }),
        label: "Unique Leads",
        value: fmtN(m.uniqueLeads),
        tone: "indigo",
        delta: leadsDelta,
        href: withRange("/admin/leads"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Not Contacted", value: m.leadsNotContacted, tone: "rose", href: withRange("/admin/leads?filter=not_contacted") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Contacted", value: m.leadsContacted, tone: "sky", href: withRange("/admin/leads?status=contacted") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Converted", value: m.leadsConverted, tone: "emerald", href: withRange("/admin/leads?filter=converted") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Repeated", value: m.repeatedLeads, tone: "amber", href: withRange("/admin/leads?filter=repeated") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-4" }),
        label: "Orders",
        value: fmtN(m.paidOrders),
        tone: "emerald",
        delta: paidDelta,
        href: withRange("/admin/orders"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Pending", value: m.paidOrdersPending, tone: "amber", href: withRange("/admin/orders?filter=pending") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Closed", value: m.paidOrdersClosed, tone: "emerald", href: withRange("/admin/orders?filter=closed") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }),
        label: "Technical Delay",
        value: fmtN(m.technicalDelay),
        tone: m.technicalDelay > 0 ? "amber" : "slate",
        href: withRange("/admin/orders?filter=technical_delay"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Customer Delay", value: m.customerDelay, tone: "rose", href: withRange("/admin/orders?filter=customer_delay") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Form Not Submitted Delay", value: m.formNotSubmitted, tone: "amber", href: withRange("/admin/orders?filter=form_not_submitted") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
        label: "Order Alerts",
        value: fmtN(m.ordersDelayed3d),
        tone: m.ordersDelayed7d > 0 ? "rose" : m.ordersDelayed3d > 0 ? "amber" : "slate",
        href: withRange("/admin/orders?filter=delayed_3d"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "3+ Days", value: m.ordersDelayed3d, tone: "amber", href: withRange("/admin/orders?filter=delayed_3d") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "7+ Days", value: m.ordersDelayed7d, tone: "rose", href: withRange("/admin/orders?filter=delayed_7d") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
        label: "Support Tickets Raised",
        value: fmtN(m.ticketsRaised),
        tone: m.ticketsRaised > 0 ? "sky" : "slate",
        delta: ticketsDelta,
        href: withRange("/admin/support/tickets"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Closed", value: m.ticketsClosed, tone: "emerald", href: withRange("/admin/support/tickets?status=closed") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Pending 3+d", value: m.ticketsPending3d, tone: "rose", href: withRange("/admin/support/tickets?status=open") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4" }),
        label: "Refund Requests",
        value: fmtN(m.refundAccepted + m.refundRejected),
        tone: "violet",
        href: withRange("/admin/refunds"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Accepted", value: m.refundAccepted, tone: "emerald", href: withRange("/admin/refunds?status=approved") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Rejected", value: m.refundRejected, tone: "rose", href: withRange("/admin/refunds?status=rejected") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }),
        label: "Email Delivery",
        value: fmtN(m.emailSent + m.emailQueued + m.emailFailed),
        tone: m.emailFailed > 0 ? "rose" : "teal",
        href: withRange("/admin/help/email-matrix"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Sent", value: m.emailSent, tone: "emerald" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Queued", value: m.emailQueued, tone: "amber" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Failed", value: m.emailFailed, tone: "rose" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4" }),
        label: "Active Staff",
        value: fmtN(m.staffActiveToday),
        tone: "indigo",
        href: "/admin/performance",
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Total", value: m.staffTotal, tone: "slate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Inactive", value: m.staffInactive, tone: "rose" })
        ] }),
        footer: "Signed in today (IST)"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-4" }),
        label: "Orders Not Contacted",
        value: fmtN(m.ordersNotContacted3h),
        tone: m.ordersNotContacted5h > 0 ? "rose" : m.ordersNotContacted3h > 0 ? "amber" : "slate",
        href: withRange("/admin/orders?filter=not_contacted"),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "3+ hrs", value: m.ordersNotContacted3h, tone: "amber", href: withRange("/admin/orders?filter=not_contacted") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "5+ hrs", value: m.ordersNotContacted5h, tone: "rose", href: withRange("/admin/orders?filter=not_contacted_5h") })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4" }),
        label: "Revenue (excl. Tax)",
        value: formatShortINR(m.revenueExclTax),
        tone: "emerald",
        delta: revDelta,
        href: "/admin/finance",
        action: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleFinancialPrivacy();
            },
            className: "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/80 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer shadow-2xs",
            title: isFinancialPrivacyEnabled ? "Show financial amounts" : "Hide financial amounts",
            "aria-label": "Toggle financial privacy",
            children: isFinancialPrivacyEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-3.5 text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5 text-emerald-600" })
          }
        ),
        subs: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Incl. Tax", value: formatShortINR(m.revenueInclTax), tone: "emerald", href: "/admin/finance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatChip, { label: "Tax", value: formatShortINR(m.taxCollected), tone: "slate", href: "/admin/finance/gst" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "size-4" }),
        label: "Conversion %",
        value: `${m.conversionRate.toFixed(1)}%`,
        tone: "teal",
        delta: convDelta,
        href: "/admin/leads?filter=converted",
        footer: `Paid ÷ Unique Leads (${fmtN(m.paidOrders)} / ${fmtN(m.uniqueLeads)})`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4" }),
        label: "Webhook Errors (24h)",
        value: fmtN(m.webhookErrors24h),
        tone: m.webhookErrors24h > 0 ? "rose" : "emerald",
        footer: m.webhookErrors24h > 0 ? "Investigate failures" : "All webhooks healthy"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModernKpi,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-4" }),
        label: "Gateway Status",
        value: (data.gatewaysCollected ?? []).filter((g) => g.revenue > 0).length > 1 ? `${(data.gatewaysCollected ?? []).filter((g) => g.revenue > 0).length} Gateways` : data.gatewaysCollected?.[0]?.name ?? "PayU",
        tone: data.payu.isProduction ? "emerald" : "amber",
        href: "/admin/settings?tab=gateways",
        subs: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: (data.gatewaysCollected ?? []).slice(0, 3).map((gw) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatChip,
          {
            label: gw.name,
            value: formatShortINR(gw.revenue),
            tone: gw.revenue > 0 ? "emerald" : "slate",
            href: "/admin/settings?tab=gateways"
          },
          gw.code
        )) }),
        footer: data.payu.isProduction ? "Live production mode" : "All webhooks healthy"
      }
    )
  ] });
});
function CustomTrendTooltip({ active, payload, label }) {
  const { formatINR } = useFinancialVisibility();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  if (!active || !payload || !payload.length) return null;
  const leads = payload.find((p) => p.dataKey === "Leads")?.value ?? 0;
  const orders = payload.find((p) => p.dataKey === "Orders")?.value ?? 0;
  const revenue = payload.find((p) => p.dataKey === "Revenue")?.value ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md min-w-[175px] text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-slate-800 border-b border-slate-100 pb-1.5 mb-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "IST" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-sm bg-indigo-500" }),
          " Leads"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold font-mono text-indigo-600", children: isPrivacyEnabled ? "•••" : fmtN(leads) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-sm bg-sky-500" }),
          " Orders"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold font-mono text-sky-600", children: isPrivacyEnabled ? "•••" : fmtN(orders) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 pt-1 border-t border-slate-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-slate-700 font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-emerald-500" }),
          " Revenue"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold font-mono text-emerald-600", children: isPrivacyEnabled ? "₹••••••" : formatINR(revenue) })
      ] })
    ] })
  ] });
}
const TrendCard = reactExports.memo(function TrendCard2({ data, rangePreset = "today", loading, className }) {
  const { formatShortINR } = useFinancialVisibility();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const isSingleDay = rangePreset === "today" || rangePreset === "yesterday";
  const [viewMode, setViewMode] = reactExports.useState("days");
  reactExports.useEffect(() => {
    if (isSingleDay) {
      setViewMode("hourly");
    } else {
      setViewMode("days");
    }
  }, [isSingleDay, rangePreset]);
  const chartData = reactExports.useMemo(() => {
    if (!data) return [];
    if (viewMode === "hourly" && data.hourly) {
      return data.hourly.hours.map((h, i) => ({
        label: h,
        Leads: data.hourly.leads[i] ?? 0,
        Orders: data.hourly.orders?.[i] ?? 0,
        Revenue: data.hourly.revenueInr[i] ?? 0
      }));
    }
    return data.days.map((d, i) => ({
      label: d.slice(5),
      // MM-DD
      Leads: data.leads[i] ?? 0,
      Orders: data.orders?.[i] ?? 0,
      Revenue: data.revenueInr[i] ?? 0
    }));
  }, [data, viewMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-emerald-600" }),
          " Revenue, Leads & Orders (",
          viewMode === "hourly" ? "Hourly Time-wise" : "Day-wise",
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "All times in IST · paid payments only · exact counts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("days"),
              className: cn(
                "px-2 py-0.5 rounded-md font-semibold transition cursor-pointer",
                viewMode === "days" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              ),
              children: "Day-wise"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("hourly"),
              className: cn(
                "px-2 py-0.5 rounded-md font-semibold transition cursor-pointer",
                viewMode === "hourly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              ),
              children: "Time-wise (Hourly)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-muted-foreground font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-sm bg-indigo-500" }),
            " Leads"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-sm bg-sky-500" }),
            " Orders"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2.5 rounded-full bg-emerald-500" }),
            " Revenue"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[260px] w-full" }) : chartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-[260px] place-items-center text-sm text-muted-foreground", children: "No data in range" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[260px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ComposedChart, { data: chartData, margin: { top: 12, right: 14, left: -4, bottom: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "revenueGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#10B981", stopOpacity: 0.25 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#10B981", stopOpacity: 0 })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, className: "stroke-slate-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", tick: { fontSize: 11, fill: "#64748b" }, stroke: "#cbd5e1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        YAxis,
        {
          yAxisId: "left",
          tick: { fontSize: 11, fill: "#64748b" },
          stroke: "#cbd5e1",
          tickFormatter: (v) => isPrivacyEnabled ? "•••" : fmtN(Number(v)),
          domain: [0, (dataMax) => Math.ceil(Math.max(dataMax * 1.15, 10))]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        YAxis,
        {
          yAxisId: "right",
          orientation: "right",
          tick: { fontSize: 11, fill: "#64748b" },
          stroke: "#cbd5e1",
          tickFormatter: (v) => isPrivacyEnabled ? "•••" : formatShortINR(Number(v)),
          domain: [0, (dataMax) => Math.ceil(Math.max(dataMax * 1.15, 1e3))]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTrendTooltip, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { yAxisId: "left", dataKey: "Leads", fill: "#6366F1", radius: [3, 3, 0, 0], maxBarSize: 18, name: "Leads" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { yAxisId: "left", dataKey: "Orders", fill: "#0EA5E9", radius: [3, 3, 0, 0], maxBarSize: 18, name: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { yAxisId: "right", type: "monotone", dataKey: "Revenue", stroke: "#10B981", fill: "url(#revenueGrad)", strokeWidth: 2.5, name: "Revenue", dot: false, activeDot: { r: 5, fill: "#10B981", stroke: "#fff", strokeWidth: 2 } })
    ] }) }) }) })
  ] });
});
const TopServicesCard = reactExports.memo(function TopServicesCard2({ data, loading }) {
  const { formatShortINR } = useFinancialVisibility();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const rows = data ?? [];
  const max = Math.max(1, ...rows.map((r) => r.revenueInr));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Top Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "By revenue in selected range" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "No orders in range" }) : rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate pr-2 font-medium", children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums text-emerald-600 dark:text-emerald-400", children: isPrivacyEnabled ? "•••" : formatShortINR(r.revenueInr) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1.5 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400",
          style: { width: `${r.revenueInr / max * 100}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[10px] text-muted-foreground", children: isPrivacyEnabled ? "••• orders" : `${r.orders} orders` })
    ] }, r.name)) })
  ] });
});
const WorkflowCard = reactExports.memo(function WorkflowCard2({ data, loading }) {
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const items = [
    { label: "External Delay", value: data?.externalDelay ?? 0 },
    { label: "Waiting on Customer", value: data?.onHold ?? 0 },
    { label: "Refunds Pending", value: data?.refundPending ?? 0 },
    { label: "Reminders Due", value: data?.remindersDue ?? 0 },
    { label: "Closed in Range", value: data?.closedInRange ?? 0 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4" }),
      " Workflow Health"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-1.5", children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, i)) : items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: it.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: it.value > 0 ? "secondary" : "outline", className: "tabular-nums", children: isPrivacyEnabled ? "•••" : fmtN(it.value) })
    ] }, it.label)) })
  ] });
});
const EmailQueueCard = reactExports.memo(function EmailQueueCard2({ data, loading }) {
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const items = [
    { label: "Queued", value: data?.queued ?? 0, tone: "default" },
    { label: "Processing", value: data?.processing ?? 0, tone: "default" },
    { label: "Failed", value: data?.failed ?? 0, tone: (data?.failed ?? 0) > 0 ? "bad" : "default" },
    { label: "Sent", value: data?.sent ?? 0, tone: "good" }
  ];
  const tones = {
    default: "",
    good: "text-emerald-600 dark:text-emerald-400",
    bad: "text-rose-600 dark:text-rose-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }),
      " Email Queue"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-1.5", children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, i)) : items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: it.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold tabular-nums ${tones[it.tone]}`, children: isPrivacyEnabled ? "•••" : fmtN(it.value) })
    ] }, it.label)) })
  ] });
});
const AlertsCard = reactExports.memo(function AlertsCard2({ data, loading }) {
  const alerts = data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
      " System Alerts"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
      !loading && alerts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300", children: "✓ All systems healthy. No active alerts." }),
      alerts.map((a) => {
        const isHigh = a.severity === "high";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${isHigh ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300" : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 size-3.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: a.message })
            ]
          },
          a.id
        );
      })
    ] })
  ] });
});
const ActivityCard = reactExports.memo(function ActivityCard2({
  data,
  loading,
  className
}) {
  const items = data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
        " Recent Activity"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "All timestamps in IST" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[260px] w-full" }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "No recent activity" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[260px] pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: items.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: a.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[11px] tabular-nums text-muted-foreground", children: formatIST(a.created_at) })
    ] }, a.id)) }) }) })
  ] });
});
function SuperActionsCard({ onChanged }) {
  const processQueue = useServerFn(processEmailQueueNow);
  const seed = useServerFn(seedMissingEmailTemplates);
  const processMut = useMutation({
    mutationFn: () => processQueue(),
    onSuccess: () => {
      toast.success("Email queue processed");
      onChanged();
    },
    onError: (e) => toast.error(e.message)
  });
  const seedMut = useMutation({
    mutationFn: () => seed(),
    onSuccess: (r) => {
      toast.success(`Seed complete · ${r.inserted}/${r.total}`);
      onChanged();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "size-4" }),
        " Super Actions"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Super-admin only" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => processMut.mutate(),
          disabled: processMut.isPending,
          className: "w-full justify-start gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5" }),
            processMut.isPending ? "Processing…" : "Process Email Queue"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => seedMut.mutate(),
          disabled: seedMut.isPending,
          variant: "outline",
          className: "w-full justify-start gap-2",
          size: "sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5" }),
            seedMut.isPending ? "Seeding…" : "Seed Email Templates"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "w-full justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/employees", children: "Manage Employees" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "w-full justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/audit", children: "View Audit Log" }) })
    ] })
  ] });
}
const getWorkflowDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("f0e7d80f063c91dc5897e4c06084e2a959baadc70f5e772b1e16d17f27df34bb"));
const STAGE_LABEL = {
  payment_successful: "Payment",
  form: "Form",
  verification: "Verification",
  government_portal: "Government",
  completed: "Completed",
  closed: "Closed"
};
const TIMER_LABEL = {
  incomplete_form: "Form nudge",
  closure: "Auto-closure",
  reminder: "Gov reminder",
  custom: "Custom"
};
const AUTO_LABEL = {
  incomplete_form_flow: "Incomplete-form flow",
  closure_flow: "Closure flow",
  gov_reminder_flow: "Government reminder"
};
function StatRow({ label, value, tone }) {
  const { isPrivacyEnabled } = useDashboardPrivacy();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: tone, children: isPrivacyEnabled ? "•••" : value })
  ] });
}
function WorkflowStatusWidgets() {
  const fetchFn = useServerFn(getWorkflowDashboard);
  const q = useQuery({
    queryKey: ["workflow-dashboard"],
    queryFn: () => fetchFn(),
    refetchInterval: 3e4,
    refetchOnWindowFocus: true
  });
  if (q.isLoading || !q.data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }, i)) });
  }
  const d = q.data;
  const stages = Object.entries(d.states.byStage).sort((a, b) => b[1] - a[1]);
  const kinds = Object.entries(d.timers.byKind).sort((a, b) => b[1] - a[1]);
  const autos = Object.entries(d.automations.byCode).sort((a, b) => b[1] - a[1]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
        "Workflow Engine"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        "Live · ",
        new Date(d.updatedAt).toLocaleTimeString("en-IN")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Orders in workflow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cog, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: d.states.total }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            d.states.paused,
            " paused · ",
            d.states.activeTickets,
            " with active ticket"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: stages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "No active state" }) : stages.map(([stage, n]) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: STAGE_LABEL[stage] ?? stage, value: n }, stage)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Pending timers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: d.timers.running }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-2 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlarmClock, { className: "h-3 w-3" }),
              d.timers.dueNext1h,
              " in next 1h"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { className: "h-3 w-3" }),
              d.timers.paused,
              " paused"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: kinds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "No timers" }) : kinds.map(([k, n]) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: TIMER_LABEL[k] ?? k, value: n }, k)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Automations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: d.automations.running }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
            d.automations.paused,
            " paused"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: autos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "No active automation" }) : autos.map(([c, n]) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: AUTO_LABEL[c] ?? c, value: n }, c)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Emails (24h)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: d.emails24h.total }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-2", children: "unique messages (last 24h)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "Sent", value: d.emails24h.sent, tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "Failed / DLQ", value: d.emails24h.failed, tone: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "Suppressed", value: d.emails24h.suppressed, tone: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatRow, { label: "Pending", value: d.emails24h.pending }),
          d.emails24h.failed > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs text-red-600 dark:text-red-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
            " Some sends failed — check Emails admin."
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  SuperAdminDashboard as S,
  WorkflowStatusWidgets as W
};
