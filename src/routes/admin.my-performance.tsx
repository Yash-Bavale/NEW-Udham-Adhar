import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  getMyPerformanceDashboard,
  type DatePeriodFilter,
} from "@/lib/crm/employee-performance.functions";
import {
  ShoppingBag,
  CheckCircle2,
  Flame,
  Clock,
  ExternalLink,
  RefreshCw,
  Calendar,
  AlertCircle,
  Archive,
  Hourglass,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Trophy,
  Activity,
  Phone,
  Tag,
  User,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/my-performance")({
  head: () => ({
    meta: [
      {
        title: "My Activity & Performance — Business Help CRM",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MyPerformanceDashboardPage,
});

function getGreeting(name?: string) {
  const hour = new Date().getHours();
  let timeStr = "Good morning";
  if (hour >= 12 && hour < 17) timeStr = "Good afternoon";
  else if (hour >= 17) timeStr = "Good evening";
  const firstName = name ? name.split(" ")[0] : "Operator";
  return `${timeStr}, ${firstName} 👋`;
}

type OrderTableFilter =
  | "all"
  | "needs_action"
  | "hot"
  | "pending"
  | "customer_delay"
  | "technical_delay"
  | "completed"
  | "closed";

function MyPerformanceDashboardPage() {
  const [dateFilter, setDateFilter] = useState<DatePeriodFilter>("today");
  const [orderFilter, setOrderFilter] = useState<OrderTableFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  const queryClient = useQueryClient();
  const getMyPerfFn = useServerFn(getMyPerformanceDashboard);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["employee.my-performance", dateFilter],
    queryFn: () => getMyPerfFn({ data: { dateFilter } }),
    refetchInterval: 20_000,
  });

  // Realtime subscription on production events
  useEffect(() => {
    const channel = supabase
      .channel("my_perf_action_sync_v5")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "application_events" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["employee.my-performance"],
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_schedulers" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["employee.my-performance"],
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["employee.my-performance"],
          });
        },
      )
      .subscribe();

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

  const empName = emp?.name || "Employee";
  const initials =
    empName
      .split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "OP";

  const handleSyncNow = () => {
    setIsRotating(true);
    refetch();
    setTimeout(() => setIsRotating(false), 700);
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isEmpActive = emp?.presenceStatus === "active";

  // Filtered orders for My Orders table
  const filteredOrders = useMemo(() => {
    return rawOrders.filter((ord) => {
      // 1. Tab filter
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

      // 2. Search query filter
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

  return (
    <div className="w-full space-y-6 pb-20 font-sans antialiased">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. REAL EMPLOYEE IDENTITY & HEADER (PHASE 1)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-xs">
              {initials}
            </div>
            <span
              className={cn(
                "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white",
                isEmpActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400",
              )}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isLoading ? "Loading profile..." : getGreeting(empName)}
              </h1>
              {isEmpActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Active • Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Offline
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs mt-0.5">
              <span>{emp?.email || "—"}</span>
              <span className="text-slate-300">•</span>
              <span className="capitalize">{emp?.role || "Operations Executive"}</span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 font-medium">
            <Calendar className="h-4 w-4 text-slate-400 mr-2" />
            <span>Today, {currentDateFormatted} IST</span>
          </div>

          <button
            onClick={handleSyncNow}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition shadow-xs"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5 text-blue-600 transition-transform duration-500",
                (isRotating || isFetching) && "rotate-180 animate-spin",
              )}
            />
            <span>Sync</span>
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. REAL EMPLOYEE ORDER KPIs (PHASE 2)                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Today's Order Performance
          </h2>
          <span className="text-xs text-slate-400">
            Realtime verified from CRM orders &amp; events
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* 1. ASSIGNED TODAY */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Assigned Today</span>
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {isLoading ? "--" : (kpis?.assigned ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Orders allocated to you today
            </div>
          </div>

          {/* 2. WORKED TODAY */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Worked Today</span>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-blue-600">
                {isLoading ? "--" : (kpis?.worked ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Unique orders actioned today
            </div>
          </div>

          {/* 3. COMPLETED TODAY */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Completed Today</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-emerald-700">
                {isLoading ? "--" : (kpis?.completed ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              Certificates delivered today
            </div>
          </div>

          {/* 4. CLOSED TODAY */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Closed Today</span>
              <Archive className="h-4 w-4 text-slate-500" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-slate-800">
                {isLoading ? "--" : (kpis?.closed ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Orders archived today
            </div>
          </div>

          {/* 5. PENDING WORKLOAD */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Pending</span>
              <Hourglass className="h-4 w-4 text-amber-600" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-amber-700">
                {isLoading ? "--" : (kpis?.pending ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-amber-800/80 font-medium">
              Current active workload
            </div>
          </div>

          {/* 6. CUSTOMER DELAY */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Customer Delay</span>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-amber-800">
                {isLoading ? "--" : (kpis?.customerDelays ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Delay actions added today
            </div>
          </div>

          {/* 7. TECHNICAL DELAY */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Technical Delay</span>
              <Layers className="h-4 w-4 text-rose-600" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-rose-700">
                {isLoading ? "--" : (kpis?.technicalDelays ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Portal / tech holds today
            </div>
          </div>

          {/* 8. HOT ORDERS */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between transition hover:border-slate-300">
            <div className="flex items-center justify-between text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <span>Hot Orders</span>
              <Flame className="h-4 w-4 text-rose-600" />
            </div>
            <div className="my-2.5">
              <div className="text-3xl font-bold tracking-tight text-rose-700">
                {isLoading ? "--" : (kpis?.hotOrders ?? 0)}
              </div>
            </div>
            <div className="text-[11px] text-rose-700 font-medium">
              High priority / due now
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MY PRIORITY WORK HOPPER + TOP 3 PERFORMERS (PHASE 4 & 7)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Work Hopper (2 cols) */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Flame className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                My Priority Work Hopper
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                {priorityHopper.length} remaining
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Hot &rarr; SLA Risk &rarr; Earliest First
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {priorityHopper.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-500 mb-2 opacity-80" />
                <span className="font-semibold text-slate-700 text-sm">Priority Hopper Clear</span>
                <span>No high-urgency or pending orders in your active queue.</span>
              </div>
            ) : (
              priorityHopper.slice(0, 5).map((ord) => (
                <div
                  key={ord.orderId}
                  className={cn(
                    "p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                    ord.isHot
                      ? "bg-rose-50/40 border-rose-200 hover:border-rose-300"
                      : "bg-slate-50/50 border-slate-200 hover:border-slate-300",
                  )}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          ord.priorityTone === "red" && "bg-rose-100 text-rose-700",
                          ord.priorityTone === "amber" && "bg-amber-100 text-amber-700",
                          ord.priorityTone === "blue" && "bg-blue-100 text-blue-700",
                          ord.priorityTone === "slate" && "bg-slate-200 text-slate-700",
                        )}
                      >
                        {ord.priorityBadge}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[160px]">
                        {ord.customerName}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({ord.customerMobile})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span>Service: <strong className="text-slate-700 font-semibold">{ord.serviceName}</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>Stage: <span className="text-blue-600 font-medium">{ord.stageName}</span></span>
                      <span className="text-slate-300">•</span>
                      <span>Last Action: <span className="text-slate-600">{ord.lastAction}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/admin/orders/${ord.orderId}` as any}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5"
                    >
                      <span>Open Order</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}

            {priorityHopper.length > 5 && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setOrderFilter("pending")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  View all {priorityHopper.length} priority orders &rarr;
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Today's Top Performers (1 col) */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Trophy className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Today's Top Performers
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Completed Orders
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-center">
            {topPerformers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Trophy className="h-8 w-8 text-slate-300 mx-auto mb-2 opacity-50" />
                <span>No order completions logged yet today.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {topPerformers.map((p) => (
                  <div
                    key={p.rank}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-lg flex-shrink-0">
                        {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                        {p.initial}
                      </div>
                      <span className="font-bold text-slate-800 text-sm truncate">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Rank #{p.rank}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Rankings updated live on verified completion events
            </div>
          </div>
        </section>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. MY ORDER TRACKING / WORKLOAD FLOW (PHASE 5)                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              My Order Tracking Flow
            </h3>
            <p className="text-xs text-slate-500">
              Real-time pipeline progression of your assigned workload
            </p>
          </div>
        </div>

        {/* Pipeline Stage Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              1. Assigned
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {flow?.assigned ?? 0}
            </div>
            <div className="text-[10px] text-blue-600 mt-0.5">Allocated today</div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              2. Worked
            </div>
            <div className="text-2xl font-bold text-indigo-900 mt-1">
              {flow?.worked ?? 0}
            </div>
            <div className="text-[10px] text-indigo-600 mt-0.5">Unique actioned</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              3. Pending
            </div>
            <div className="text-2xl font-bold text-amber-900 mt-1">
              {flow?.pending ?? 0}
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">Active workload</div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
            <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
              4. In Progress
            </div>
            <div className="text-2xl font-bold text-sky-900 mt-1">
              {flow?.inProgress ?? 0}
            </div>
            <div className="text-[10px] text-sky-600 mt-0.5">Under fulfillment</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              5. Completed
            </div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">
              {flow?.completed ?? 0}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Delivered today</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              6. Closed
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {flow?.closed ?? 0}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Archived today</div>
          </div>
        </div>

        {/* Secondary Detail Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-600">Customer Delays (Added / Active):</span>
            <strong className="text-slate-900 font-bold">{flow?.customerDelayAdded ?? 0} / {flow?.currentCustomerDelay ?? 0}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-600">Technical Delays (Added / Active):</span>
            <strong className="text-slate-900 font-bold">{flow?.technicalDelayAdded ?? 0} / {flow?.currentTechnicalDelay ?? 0}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-600">Closed Due to Delays (Cust / Tech):</span>
            <strong className="text-slate-900 font-bold">{flow?.closedDueToCustomerDelay ?? 0} / {flow?.closedDueToTechnicalDelay ?? 0}</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-600">Hot Orders Handled Today:</span>
            <strong className="text-rose-600 font-bold">{flow?.hotOrdersHandled ?? 0}</strong>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. MY ORDERS TABLE (PHASE 6)                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">My Orders</h3>
            <p className="text-xs text-slate-500">
              Orders assigned to your queue with live operational status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, customer, phone..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          {(
            [
              { id: "all", label: "All Orders", count: rawOrders.length },
              { id: "needs_action", label: "Needs Action" },
              { id: "hot", label: "Hot Orders" },
              { id: "pending", label: "Pending" },
              { id: "customer_delay", label: "Customer Delay" },
              { id: "technical_delay", label: "Technical Delay" },
              { id: "completed", label: "Completed" },
              { id: "closed", label: "Closed" },
            ] as const
          ).map((tab) => {
            const countVal = "count" in tab ? tab.count : undefined;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setOrderFilter(tab.id as OrderTableFilter)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold transition",
                  orderFilter === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70",
                )}
              >
                {tab.label}
                {countVal !== undefined && <span className="ml-1 opacity-70 font-normal">({countVal})</span>}
              </button>
            );
          })}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Current Stage</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Action</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.slice(0, 15).map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {ord.isHot && <Flame className="h-3.5 w-3.5 text-rose-600 flex-shrink-0" />}
                        <span>#{ord.orderNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{ord.customerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.customerMobile}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {ord.serviceName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                        {ord.stageName}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {ord.currentStatus || "—"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate">
                      {ord.lastActionText}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/orders/${ord.orderId}` as any}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold shadow-2xs transition inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredOrders.length > 15 && (
          <div className="text-center pt-2">
            <Link
              to={"/admin/orders" as any}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              View all {filteredOrders.length} orders in Orders Workspace &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. TODAY'S REAL ACTIVITY TIMELINE (PHASE 8)                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Today's Real Activity Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Chronological operational CRM events performed by you today
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {timeline.length} actions logged
          </span>
        </div>

        <div className="space-y-2.5">
          {timeline.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Activity className="h-8 w-8 text-slate-300 mx-auto mb-2 opacity-50" />
              <span>No CRM operations recorded for today yet.</span>
            </div>
          ) : (
            timeline.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {item.actionLabel}
                      </span>
                      {item.orderCode && item.orderCode !== "—" && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                          #{item.orderCode}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <div className="text-slate-500 text-[11px] truncate max-w-[400px]">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-slate-400 text-[11px] font-medium flex-shrink-0 ml-3">
                  {item.time}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. SESSION & TELEMETRY (PHASE 9 - CLEAN EMPTY STATE)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>
            Active Session &amp; Heartbeat Telemetry: <strong>Connected</strong> (Metrics will populate automatically as shift progresses)
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Phase 3 Telemetry Engine</span>
      </section>
    </div>
  );
}
