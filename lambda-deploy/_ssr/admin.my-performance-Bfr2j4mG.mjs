import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, a2 as getMyPerformanceDashboard, a as cn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { R as RefreshCw, aT as Zap, am as Activity, aE as TrendingUp, C as Clock, H as Hourglass, a8 as ShoppingBag, w as ShieldCheck, au as ExternalLink, l as CircleCheck, aV as Archive, aM as CircleAlert, a$ as Layers, i as Flame, b0 as CircleCheckBig, b1 as Trophy, v as Search, ak as History, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function getGreeting(name) {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  let timeStr = "Good morning";
  if (hour >= 12 && hour < 17) timeStr = "Good afternoon";
  else if (hour >= 17) timeStr = "Good evening";
  const firstName = name.split(" ")[0];
  return `${timeStr}, ${firstName} 👋`;
}
function formatISTTimeOnly(iso) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}
function formatISTDateOnly(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short"
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
function LiveActionIdleTicker({
  latestActionAt,
  latestActionLabel,
  latestActionOrderCode
}) {
  const [elapsedMs, setElapsedMs] = reactExports.useState(() => latestActionAt ? Math.max(0, Date.now() - new Date(latestActionAt).getTime()) : 0);
  reactExports.useEffect(() => {
    if (!latestActionAt) return;
    const tick = () => {
      setElapsedMs(Math.max(0, Date.now() - new Date(latestActionAt).getTime()));
    };
    tick();
    const interval = setInterval(tick, 1e3);
    return () => clearInterval(interval);
  }, [latestActionAt]);
  if (!latestActionAt) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Live Open Idle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-slate-400" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold tracking-tight text-slate-400", children: "—" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "No action in selected period" })
    ] });
  }
  const seconds = Math.floor(elapsedMs / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const displayTime = hours > 0 ? `${hours}h ${String(minutes % 60).padStart(2, "0")}m ${String(seconds % 60).padStart(2, "0")}s` : `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
  const isHealthy = minutes < 30;
  const isAttention = minutes >= 30 && minutes < 120;
  const toneCls = isHealthy ? "text-emerald-700 bg-emerald-50 border-emerald-200" : isAttention ? "text-amber-800 bg-amber-50 border-amber-200" : "text-rose-700 bg-rose-50 border-rose-200";
  const dotCls = isHealthy ? "bg-emerald-500 animate-pulse" : isAttention ? "bg-amber-500 animate-pulse" : "bg-rose-500 animate-ping";
  const statusText = isHealthy ? "Active Pace" : isAttention ? "Idle Attention" : "Extended Idle";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Live Open Idle" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border", toneCls), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-1.5 h-1.5 rounded-full", dotCls) }),
        statusText
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-3xl font-black tracking-tight text-slate-900", children: displayTime }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 truncate", title: `Since: ${latestActionLabel || "Action"} on #${latestActionOrderCode || "Order"}`, children: [
      "Since ",
      latestActionLabel || "Action",
      " ",
      latestActionOrderCode ? `(#${latestActionOrderCode})` : ""
    ] })
  ] });
}
function MyPerformanceDashboardPage() {
  const [dateFilter, setDateFilter] = reactExports.useState("today");
  const [orderFilter, setOrderFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [intervalSearch, setIntervalSearch] = reactExports.useState("");
  const [isRotating, setIsRotating] = reactExports.useState(false);
  const queryClient = useQueryClient();
  const getMyPerfFn = useServerFn(getMyPerformanceDashboard);
  const {
    data,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["employee.my-performance", dateFilter],
    queryFn: () => getMyPerfFn({
      data: {
        dateFilter
      }
    }),
    refetchInterval: 2e4
  });
  reactExports.useEffect(() => {
    const channel = supabase.channel("my_perf_action_sync_v5").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "application_events"
    }, () => {
      queryClient.invalidateQueries({
        queryKey: ["employee.my-performance"]
      });
    }).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "order_schedulers"
    }, () => {
      queryClient.invalidateQueries({
        queryKey: ["employee.my-performance"]
      });
    }).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "applications"
    }, () => {
      queryClient.invalidateQueries({
        queryKey: ["employee.my-performance"]
      });
    }).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "order_action_logs"
    }, () => {
      queryClient.invalidateQueries({
        queryKey: ["employee.my-performance"]
      });
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  const emp = data?.employee;
  const kpis = data?.kpiCards;
  const flow = data?.workloadFlow;
  const priorityHopper = data?.priorityHopper ?? [];
  const topPerformers = data?.topPerformers ?? [];
  const rawOrders = data?.orders ?? [];
  const timeline = data?.timeline ?? [];
  const actionMetrics = data?.actionResponseMetrics;
  const rawIntervals = data?.actionIntervals ?? [];
  const session = data?.session;
  const empName = emp?.name || "Employee";
  const initials = empName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "OP";
  const handleSyncNow = () => {
    setIsRotating(true);
    refetch();
    setTimeout(() => setIsRotating(false), 700);
  };
  (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const isEmpActive = emp?.presenceStatus === "active";
  const filteredIntervals = reactExports.useMemo(() => {
    if (!intervalSearch.trim()) return rawIntervals;
    const q = intervalSearch.toLowerCase().trim();
    return rawIntervals.filter((item) => item.orderCode?.toLowerCase().includes(q) || item.previousAction?.toLowerCase().includes(q) || item.nextAction?.toLowerCase().includes(q) || item.employeeName?.toLowerCase().includes(q));
  }, [rawIntervals, intervalSearch]);
  const filteredOrders = reactExports.useMemo(() => {
    return rawOrders.filter((ord) => {
      if (orderFilter === "needs_action") {
        const needsActionStages = ["lead_received", "payment_done", "form_submitted", "order_reopened"];
        if (!needsActionStages.includes(ord.currentStage || "") && !ord.isHot) return false;
      } else if (orderFilter === "hot") {
        if (!ord.isHot) return false;
      } else if (orderFilter === "pending") {
        if (ord.isCompleted || ord.isClosed) return false;
      } else if (orderFilter === "customer_delay") {
        if (!ord.isCustomerDelay) return false;
      } else if (orderFilter === "technical_delay") {
        if (!ord.isTechnicalDelay) return false;
      } else if (orderFilter === "completed") {
        if (!ord.isCompleted) return false;
      } else if (orderFilter === "closed") {
        if (!ord.isClosed) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = ord.orderNumber?.toLowerCase().includes(q);
        const matchCustomer = ord.customerName?.toLowerCase().includes(q);
        const matchMobile = ord.customerMobile?.toLowerCase().includes(q);
        const matchService = ord.serviceName?.toLowerCase().includes(q);
        return matchCode || matchCustomer || matchMobile || matchService;
      }
      return true;
    });
  }, [rawOrders, orderFilter, searchQuery]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-6 pb-20 font-sans antialiased", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-xs", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white", isEmpActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: isLoading ? "Loading profile..." : getGreeting(empName) }),
            isEmpActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping" }),
              "Active • Connected"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-slate-400" }),
              "Offline"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: emp?.email || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: emp?.role || "Operations Executive" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-between md:justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200", children: [{
          id: "today",
          label: "Today"
        }, {
          id: "yesterday",
          label: "Yesterday"
        }, {
          id: "7d",
          label: "7 Days"
        }, {
          id: "15d",
          label: "15 Days"
        }, {
          id: "30d",
          label: "30 Days"
        }, {
          id: "this_month",
          label: "This Month"
        }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDateFilter(t.id), className: cn("px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer", dateFilter === t.id ? "bg-white text-blue-700 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900"), children: t.label }, t.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSyncNow, type: "button", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition shadow-xs cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3.5 w-3.5 text-blue-600 transition-transform duration-500", (isRotating || isFetching) && "rotate-180 animate-spin") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sync" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-purple-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-800", children: [
            "Action Response & Idle Metrics (",
            dateFilter.replace("_", " "),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Calculated from verified employee action history" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-purple-100 shadow-xs flex flex-col justify-between transition hover:border-purple-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-purple-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-purple-700", children: isLoading ? "--" : actionMetrics?.totalActions ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Human staff actions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-indigo-100 shadow-xs flex flex-col justify-between transition hover:border-indigo-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tracked Intervals" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-indigo-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-indigo-700", children: isLoading ? "--" : actionMetrics?.trackedIntervals ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Action-to-action steps" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-blue-100 shadow-xs flex flex-col justify-between transition hover:border-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Average Idle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-blue-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-bold tracking-tight text-blue-700", children: isLoading ? "--" : actionMetrics?.avgIdleFormatted ?? "0s" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Mean response cadence" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-amber-100 shadow-xs flex flex-col justify-between transition hover:border-amber-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Longest Idle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hourglass, { className: "h-4 w-4 text-amber-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-bold tracking-tight text-amber-800", children: isLoading ? "--" : actionMetrics?.longestIdleFormatted ?? "0s" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Max single interval" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveActionIdleTicker, { latestActionAt: actionMetrics?.latestActionAt ?? null, latestActionLabel: actionMetrics?.latestActionLabel ?? null, latestActionOrderCode: actionMetrics?.latestActionOrderCode ?? null }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-emerald-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-800", children: [
            "Daily Employee Activity & Continuous Telemetry (",
            dateFilter.replace("_", " "),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-700", children: [
              "Active (",
              session?.activeDuration || "0m",
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-700", children: [
              "Idle (",
              session?.idleDuration || "0m",
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-amber-700 inline-block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-700", children: [
              "Away / Minimized (",
              session?.awayDuration || "0m",
              ")"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-emerald-100 shadow-xs flex flex-col justify-between transition hover:border-emerald-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CRM Active Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-bold tracking-tight text-emerald-700", children: isLoading ? "--" : session?.activeDuration || "0m" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Direct user interaction" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-amber-100 shadow-xs flex flex-col justify-between transition hover:border-amber-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CRM Idle Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-bold tracking-tight text-amber-700", children: isLoading ? "--" : session?.idleDuration || "0m" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Paused or tab inactive" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-orange-100 shadow-xs flex flex-col justify-between transition hover:border-orange-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CRM Away Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-orange-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-bold tracking-tight text-orange-700", children: isLoading ? "--" : session?.awayDuration || "0m" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Minimized / break" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-blue-100 shadow-xs flex flex-col justify-between transition hover:border-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Meaningful Actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-blue-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-blue-700", children: isLoading ? "--" : session?.meaningfulActions ?? actionMetrics?.totalActions ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Verified operations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-indigo-100 shadow-xs flex flex-col justify-between transition hover:border-indigo-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Orders Worked" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-indigo-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-indigo-700", children: isLoading ? "--" : session?.ordersWorked ?? kpis?.worked ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Unique orders actioned" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-teal-100 shadow-xs flex flex-col justify-between transition hover:border-teal-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SLA Compliance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-teal-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5 flex items-baseline gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold tracking-tight text-teal-700", children: [
            isLoading ? "--" : session?.slaCompliance ?? 100,
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-teal-700 font-medium", children: "On-time order turnaround" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Continuous Telemetry Timeline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Sequential execution timeline (Active → Idle → Away) showing verified interval duration and order actions" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs font-semibold text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-xs bg-emerald-600" }),
              " Active"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-xs bg-amber-500" }),
              " Idle"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-xs bg-amber-700" }),
              " Away"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-9 bg-slate-100 rounded-lg p-1 flex items-stretch gap-1 overflow-x-auto shadow-inner min-w-full", children: (session?.sessionSegments ?? []).length > 0 ? (session?.sessionSegments ?? []).map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full rounded flex items-center justify-center text-white text-[10px] tracking-wider font-bold transition hover:opacity-90 cursor-help relative overflow-hidden px-2 truncate flex-shrink-0", style: {
            width: `${Math.max(4, seg.percent)}%`,
            minWidth: "48px",
            backgroundColor: seg.color || (seg.type === "active" ? "#059669" : seg.type === "idle" ? "#f59e0b" : seg.type === "away" ? "#d97706" : "#94a3b8")
          }, title: `${seg.startTime} – ${seg.endTime}: ${seg.label} (${seg.durationMins}m)`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: seg.label }),
            seg.label?.includes("NOW") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-1 w-2 h-2 rounded-full bg-white animate-ping" })
          ] }, seg.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-semibold", children: "No continuous session telemetry logged for selected period" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-slate-500 text-[11px] px-1 font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-emerald-700", children: session?.firstLogin ? `${session.firstLogin} (Login)` : session?.sessionSegments?.[0]?.startTime ? `${session.sessionSegments[0].startTime} (Login)` : "Login / Session Start" }),
            (session?.sessionSegments?.length ?? 0) > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline-block text-slate-400", children: session?.sessionSegments?.[Math.floor((session.sessionSegments.length - 1) / 2)]?.startTime || "" }),
            (session?.sessionSegments?.length ?? 0) > 4 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline-block text-slate-400", children: session?.sessionSegments?.[Math.floor((session.sessionSegments.length - 1) * 0.75)]?.startTime || "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-blue-600", children: isEmpActive || session?.presenceStatus === "ACTIVE" ? `Now (${(/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })})` : session?.sessionSegments?.[(session?.sessionSegments?.length ?? 1) - 1]?.endTime || "Session End" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-800", children: "Order Action Event Chronology" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400", children: "Verified Order Action Taken events only (excludes telemetry, views & logins)" })
          ] }),
          (session?.actionChronology ?? session?.stepperEvents ?? []).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 overflow-x-auto pb-1", children: (session?.actionChronology ?? session?.stepperEvents ?? []).map((step, idx) => {
            const timestampStr = step.timestamp || step.timeIST || step.time || "—";
            const titleStr = step.actionTitle || step.title || "Order Action Taken";
            const descStr = step.notes || step.desc || "";
            const codeStr = step.orderCode || (step.orderId ? step.orderId.slice(0, 8) : null);
            const empNameStr = step.employeeName || empName;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg border bg-white border-slate-200 shadow-2xs hover:border-blue-300 flex flex-col justify-between transition min-w-[150px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-slate-600 font-semibold", children: timestampStr }),
                step.actionType && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-100", children: step.actionType.replace(/_/g, " ").slice(0, 12) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-900 line-clamp-1", title: titleStr, children: titleStr }),
                descStr && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 line-clamp-1 mt-0.5", title: descStr, children: descStr })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 pt-1 border-t border-slate-100 flex items-center justify-between gap-1", children: [
                codeStr ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/admin/orders/${step.orderId || ""}`, className: "text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 truncate", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "#",
                    codeStr
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-2.5 w-2.5 flex-shrink-0" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-400", children: "Order" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-400 truncate max-w-[65px]", title: empNameStr, children: empNameStr })
              ] })
            ] }, step.id || idx);
          }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium", children: "No qualifying employee order actions recorded for the selected period." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-500", children: "Order Performance Pipeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: "Realtime verified from CRM orders & events" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Assigned Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-blue-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-slate-900", children: isLoading ? "--" : kpis?.assigned ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Orders allocated to you today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Worked Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-blue-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-blue-600", children: isLoading ? "--" : kpis?.worked ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Unique orders actioned today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Completed Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-emerald-700", children: isLoading ? "--" : kpis?.completed ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-emerald-700 font-medium", children: "Certificates delivered today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Closed Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-4 w-4 text-slate-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-slate-800", children: isLoading ? "--" : kpis?.closed ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Orders archived today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pending" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hourglass, { className: "h-4 w-4 text-amber-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-amber-700", children: isLoading ? "--" : kpis?.pending ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-amber-800/80 font-medium", children: "Current active workload" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Customer Delay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-amber-800", children: isLoading ? "--" : kpis?.customerDelays ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Delay actions added today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Technical Delay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-rose-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-rose-700", children: isLoading ? "--" : kpis?.technicalDelays ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Portal / tech holds today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hot Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-rose-600" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold tracking-tight text-rose-700", children: isLoading ? "--" : kpis?.hotOrders ?? 0 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-rose-700 font-medium", children: "High priority / due now" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-rose-50 text-rose-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-slate-900 text-sm", children: "My Priority Work Hopper" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold", children: [
              priorityHopper.length,
              " remaining"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 font-medium", children: "Hot → SLA Risk → Earliest First" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3 flex-1", children: [
          priorityHopper.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-8 w-8 text-emerald-500 mb-2 opacity-80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700 text-sm", children: "Priority Hopper Clear" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No high-urgency or pending orders in your active queue." })
          ] }) : priorityHopper.slice(0, 5).map((ord) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3", ord.isHot ? "bg-rose-50/40 border-rose-200 hover:border-rose-300" : "bg-slate-50/50 border-slate-200 hover:border-slate-300"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", ord.priorityTone === "red" && "bg-rose-100 text-rose-700", ord.priorityTone === "amber" && "bg-amber-100 text-amber-700", ord.priorityTone === "blue" && "bg-blue-100 text-blue-700", ord.priorityTone === "slate" && "bg-slate-200 text-slate-700"), children: ord.priorityBadge }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-900", children: [
                  "#",
                  ord.orderNumber
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700 truncate max-w-[160px]", children: ord.customerName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400", children: [
                  "(",
                  ord.customerMobile,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Service: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-700 font-semibold", children: ord.serviceName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Stage: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 font-medium", children: ord.stageName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Last Action: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: ord.lastAction })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/admin/orders/${ord.orderId}`, className: "px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open Order" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
            ] }) })
          ] }, ord.orderId)),
          priorityHopper.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOrderFilter("pending"), className: "text-xs font-semibold text-blue-600 hover:text-blue-700 transition", children: [
            "View all ",
            priorityHopper.length,
            " priority orders →"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-amber-50 text-amber-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-slate-900 text-sm", children: "Today's Top Performers" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 font-medium", children: "Completed Orders" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col justify-center", children: [
          topPerformers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center text-slate-400 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-8 w-8 text-slate-300 mx-auto mb-2 opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No order completions logged yet today." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: topPerformers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg flex-shrink-0", children: p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0", children: p.initial }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800 text-sm truncate", children: p.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200", children: [
              "Rank #",
              p.rank
            ] })
          ] }, p.rank)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center", children: "Rankings updated live on verified completion events" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-slate-900 text-base", children: "My Order Tracking Flow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Real-time pipeline progression of your assigned workload" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-blue-50/70 border border-blue-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-blue-700 uppercase tracking-wider", children: "1. Assigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-900 mt-1", children: flow?.assigned ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-blue-600 mt-0.5", children: "Allocated today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-indigo-700 uppercase tracking-wider", children: "2. Worked" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-indigo-900 mt-1", children: flow?.worked ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-indigo-600 mt-0.5", children: "Unique actioned" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-amber-50/70 border border-amber-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-amber-700 uppercase tracking-wider", children: "3. Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-amber-900 mt-1", children: flow?.pending ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-amber-700 mt-0.5", children: "Active workload" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-sky-50/70 border border-sky-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-sky-700 uppercase tracking-wider", children: "4. In Progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-sky-900 mt-1", children: flow?.inProgress ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-sky-600 mt-0.5", children: "Under fulfillment" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-emerald-700 uppercase tracking-wider", children: "5. Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-emerald-900 mt-1", children: flow?.completed ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-emerald-700 mt-0.5", children: "Delivered today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-slate-100 border border-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-slate-700 uppercase tracking-wider", children: "6. Closed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-slate-900 mt-1", children: flow?.closed ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 mt-0.5", children: "Archived today" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Customer Delays (Added / Active):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900 font-bold", children: [
            flow?.customerDelayAdded ?? 0,
            " / ",
            flow?.currentCustomerDelay ?? 0
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Technical Delays (Added / Active):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900 font-bold", children: [
            flow?.technicalDelayAdded ?? 0,
            " / ",
            flow?.currentTechnicalDelay ?? 0
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Closed Due to Delays (Cust / Tech):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900 font-bold", children: [
            flow?.closedDueToCustomerDelay ?? 0,
            " / ",
            flow?.closedDueToTechnicalDelay ?? 0
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Hot Orders Handled Today:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-rose-600 font-bold", children: flow?.hotOrdersHandled ?? 0 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden space-y-3 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-slate-900 text-base", children: "My Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Orders assigned to your queue with live operational status" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search order #, customer, phone...", className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3", children: [{
        id: "all",
        label: "All Orders",
        count: rawOrders.length
      }, {
        id: "needs_action",
        label: "Needs Action"
      }, {
        id: "hot",
        label: "Hot Orders"
      }, {
        id: "pending",
        label: "Pending"
      }, {
        id: "customer_delay",
        label: "Customer Delay"
      }, {
        id: "technical_delay",
        label: "Technical Delay"
      }, {
        id: "completed",
        label: "Completed"
      }, {
        id: "closed",
        label: "Closed"
      }].map((tab) => {
        const countVal = "count" in tab ? tab.count : void 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOrderFilter(tab.id), className: cn("px-3 py-1 rounded-lg text-xs font-semibold transition", orderFilter === tab.id ? "bg-slate-900 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70"), children: [
          tab.label,
          countVal !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-70 font-normal", children: [
            "(",
            countVal,
            ")"
          ] })
        ] }, tab.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs text-slate-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Order #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Current Stage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Last Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3 text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-8 text-center text-slate-400", children: "No orders matching the selected filter." }) }) : filteredOrders.slice(0, 15).map((ord) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/60 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-bold text-slate-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            ord.isHot && /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5 text-rose-600 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "#",
              ord.orderNumber
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-800", children: ord.customerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: ord.customerMobile })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-medium text-slate-700", children: ord.serviceName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100", children: ord.stageName }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium", children: ord.currentStatus || "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 text-slate-500 max-w-[180px] truncate", children: ord.lastActionText }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/admin/orders/${ord.orderId}`, className: "px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold shadow-2xs transition inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 text-slate-400" })
          ] }) })
        ] }, ord.orderId)) })
      ] }) }),
      filteredOrders.length > 15 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/orders", className: "text-xs font-semibold text-blue-600 hover:text-blue-700 transition", children: [
        "View all ",
        filteredOrders.length,
        " orders in Orders Workspace →"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden space-y-3 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-indigo-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-slate-900 text-base", children: "Historical Action Intervals (Action Cadence)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Inter-action idle duration measured from Previous Employee Action → Next Employee Action" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: intervalSearch, onChange: (e) => setIntervalSearch(e.target.value), placeholder: "Filter order #, action title...", className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 font-semibold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200", children: [
            filteredIntervals.length,
            " Tracked"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs text-slate-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Order #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Previous Employee Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-2 text-center", children: "Flow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Next Employee Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Action Idle Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3 text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: filteredIntervals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 7, className: "py-8 text-center text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-8 w-8 text-slate-300 mx-auto mb-2 opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No multi-action intervals recorded for this timeframe yet." })
        ] }) }) : filteredIntervals.slice(0, 30).map((interval) => {
          const idleMinutes = Math.floor(interval.idleDurationMs / 6e4);
          const isQuick = idleMinutes < 30;
          const isModerate = idleMinutes >= 30 && idleMinutes < 120;
          const badgeCls = isQuick ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold" : isModerate ? "bg-amber-50 text-amber-800 border-amber-200 font-semibold" : "bg-rose-50 text-rose-700 border-rose-200 font-bold";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/60 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-3 font-bold text-slate-900 font-mono", children: [
              "#",
              interval.orderCode
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-800", children: interval.previousAction }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-400", children: [
                formatISTDateOnly(interval.previousActionTime),
                " ",
                formatISTTimeOnly(interval.previousActionTime),
                " IST"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2 text-center text-slate-400 font-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 mx-auto text-indigo-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-800", children: interval.nextAction }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-400", children: [
                formatISTDateOnly(interval.nextActionTime),
                " ",
                formatISTTimeOnly(interval.nextActionTime),
                " IST"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border shadow-2xs font-mono", badgeCls), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: interval.idleDurationFormatted })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 text-slate-600 font-medium", children: interval.employeeName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 text-right", children: interval.orderId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/admin/orders/${interval.orderId}`, className: "px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold shadow-2xs transition inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 text-slate-400" })
            ] }) })
          ] }, interval.id);
        }) })
      ] }) }),
      filteredIntervals.length > 30 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center pt-2 text-xs text-slate-400", children: [
        "Showing latest 30 of ",
        filteredIntervals.length,
        " recorded action intervals in selected period."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-slate-900 text-base", children: [
            "Real Activity Timeline (",
            dateFilter.replace("_", " "),
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Chronological operational CRM events performed by you in this period" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400 font-medium", children: [
          timeline.length,
          " actions logged"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: timeline.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center text-slate-400 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-8 w-8 text-slate-300 mx-auto mb-2 opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No CRM operations recorded for today yet." })
      ] }) : timeline.slice(0, 10).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800", children: item.actionLabel }),
              item.orderCode && item.orderCode !== "—" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold", children: [
                "#",
                item.orderCode
              ] })
            ] }),
            item.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 text-[11px] truncate max-w-[400px]", children: item.notes })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-400 text-[11px] font-medium flex-shrink-0 ml-3", children: item.time })
      ] }, item.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Active Session & Heartbeat Telemetry: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Connected" }),
          " (Metrics will populate automatically as shift progresses)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400", children: "Phase 3 Telemetry Engine" })
    ] })
  ] });
}
export {
  MyPerformanceDashboardPage as component
};
