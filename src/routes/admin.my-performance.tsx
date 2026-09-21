import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getMyPerformanceDashboard,
  type DatePeriodFilter,
} from "@/lib/crm/employee-performance.functions";
import {
  ShoppingBag,
  CheckCircle2,
  Zap,
  Flame,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Archive,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Activity,
  Circle,
} from "lucide-react";
import { formatIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/my-performance")({
  head: () => ({
    meta: [
      {
        title: "My Performance Dashboard — Business Help CRM",
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
  return `${timeStr}, ${name || "Operator"}`;
}

const ACTION_COLOR_MAP: Record<string, string> = {
  ORDER_COMPLETED: "text-emerald-700",
  ORDER_CLOSED: "text-slate-600",
  CUSTOMER_DELAY_ADDED: "text-amber-700",
  TECHNICAL_DELAY_ADDED: "text-orange-700",
  HOT_ORDER_ADDED: "text-rose-700",
  HOT_ORDER_REMOVED: "text-slate-600",
  CERTIFICATE_GENERATED: "text-purple-700",
  CERTIFICATE_DELIVERED: "text-purple-700",
};

/* ─────────────────────────────────────────────────────────────────── */

function MyPerformanceDashboardPage() {
  const [dateFilter, setDateFilter] = useState<DatePeriodFilter>("today");
  const queryClient = useQueryClient();
  const getMyPerfFn = useServerFn(getMyPerformanceDashboard);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["employee.my-performance", dateFilter],
    queryFn: () => getMyPerfFn({ data: { dateFilter } }),
    refetchInterval: 15_000,
  });

  // Realtime subscription — refresh when my actions are logged
  useEffect(() => {
    const channel = supabase
      .channel("my_perf_action_sync")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_action_logs" },
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
  const sla = data?.slaScorecard;
  const priority = data?.priorityWork;
  const hotOrders = data?.hotOrders ?? [];
  const orders = data?.orders ?? [];
  const timeline = data?.timeline ?? [];
  const recentActions = data?.recentActions ?? [];

  const presenceStatus = emp?.presenceStatus ?? "offline";

  const dateFilterButtons: { key: DatePeriodFilter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "7d", label: "7 Days" },
    { key: "15d", label: "15 Days" },
    { key: "this_month", label: "This Month" },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {getGreeting(emp?.name)}
            </h1>
            {/* Presence badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                presenceStatus === "active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : presenceStatus === "away"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-100 text-slate-500 border-slate-200",
              )}
            >
              <Circle
                className={cn(
                  "h-1.5 w-1.5",
                  presenceStatus === "active"
                    ? "fill-emerald-500 text-emerald-500"
                    : presenceStatus === "away"
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-300 text-slate-300",
                )}
              />
              {presenceStatus === "active"
                ? "Active"
                : presenceStatus === "away"
                  ? "Away"
                  : "Offline"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Here's your work summary for{" "}
            {dateFilter === "today"
              ? "today"
              : dateFilter === "yesterday"
                ? "yesterday"
                : dateFilter === "this_month"
                  ? "this month"
                  : `the last ${dateFilter}`}
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {dateFilterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setDateFilter(btn.key)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                  dateFilter === btn.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5 text-slate-500",
                isFetching && "animate-spin",
              )}
            />
            Sync
          </button>
        </div>
      </div>

      {/* ── TOP KPI STRIP ── */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5">
        {[
          {
            label: "ASSIGNED",
            value: kpis?.assigned ?? 0,
            icon: <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />,
          },
          {
            label: "WORKED",
            value: kpis?.worked ?? 0,
            icon: <Zap className="h-3.5 w-3.5 text-indigo-600" />,
          },
          {
            label: "ACTIONS",
            value: kpis?.actions ?? 0,
            icon: <Activity className="h-3.5 w-3.5 text-slate-800" />,
          },
          {
            label: "COMPLETED",
            value: kpis?.completed ?? 0,
            icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />,
          },
          {
            label: "CLOSED",
            value: kpis?.closed ?? 0,
            icon: <Archive className="h-3.5 w-3.5 text-slate-500" />,
          },
          {
            label: "CUST DELAYS",
            value: kpis?.customerDelays ?? 0,
            icon: <Clock className="h-3.5 w-3.5 text-amber-500" />,
          },
          {
            label: "TECH DELAYS",
            value: kpis?.technicalDelays ?? 0,
            icon: <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />,
          },
          {
            label: "HOT ORDERS",
            value: kpis?.hotOrders ?? 0,
            icon: <Flame className="h-3.5 w-3.5 text-rose-600" />,
          },
          {
            label: "SLA",
            value: `${kpis?.slaCompliance ?? 100}%`,
            icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase truncate">
                {item.label}
              </span>
              <div className="p-0.5 rounded bg-slate-50">{item.icon}</div>
            </div>
            <div className="mt-1.5 text-lg font-bold text-slate-900">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── PRIORITY WORK BANNER ── */}
      {priority &&
        (priority.hotOrders > 0 ||
          priority.slaAtRisk > 0 ||
          priority.pendingAction > 0) && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              My Priority Work
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {priority.hotOrders > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2">
                  <Flame className="h-4 w-4 text-rose-600" />
                  <div>
                    <div className="text-sm font-bold text-rose-900">
                      {priority.hotOrders} Hot{" "}
                      {priority.hotOrders === 1 ? "Order" : "Orders"}
                    </div>
                    <div className="text-[10px] text-rose-700">
                      Requires immediate action
                    </div>
                  </div>
                </div>
              )}
              {priority.slaAtRisk > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="text-sm font-bold text-amber-900">
                      {priority.slaAtRisk} SLA At Risk
                    </div>
                    <div className="text-[10px] text-amber-700">
                      Approaching deadline
                    </div>
                  </div>
                </div>
              )}
              {priority.pendingAction > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2">
                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-blue-900">
                      {priority.pendingAction} Pending Action
                    </div>
                    <div className="text-[10px] text-blue-700">
                      No activity yet
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* ── WORKLOAD PIPELINE + SLA SCORECARD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pipeline */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                My Workload Pipeline
              </h2>
              <p className="text-xs text-slate-500">
                Live progression of your assigned queue
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Pending:{" "}
              <span className="font-bold text-amber-600">
                {flow?.pending ?? 0}
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center items-center">
            {[
              {
                label: "ASSIGNED",
                value: flow?.assigned ?? 0,
                bg: "bg-blue-50 border-blue-100",
                text: "text-blue-900",
                lbl: "text-blue-700",
              },
              null,
              {
                label: "IN PROGRESS",
                value: flow?.inProgress ?? 0,
                bg: "bg-amber-50 border-amber-100",
                text: "text-amber-900",
                lbl: "text-amber-700",
              },
              null,
              {
                label: "COMPLETED",
                value: flow?.completed ?? 0,
                bg: "bg-emerald-50 border-emerald-100",
                text: "text-emerald-900",
                lbl: "text-emerald-700",
              },
            ].map((item, idx) =>
              item === null ? (
                <ArrowRight
                  key={idx}
                  className="h-4 w-4 text-slate-300 hidden sm:block mx-auto"
                />
              ) : (
                <div
                  key={item.label}
                  className={`rounded-lg border p-3 ${item.bg}`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase ${item.lbl}`}
                  >
                    {item.label}
                  </div>
                  <div className={`text-2xl font-bold mt-1 ${item.text}`}>
                    {item.value}
                  </div>
                </div>
              ),
            )}
          </div>
          {/* Closed row */}
          <div className="mt-2 flex justify-end">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-600">
                CLOSED
              </div>
              <div className="text-lg font-bold text-slate-900">
                {flow?.closed ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/* SLA Scorecard */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              My SLA Health
            </h2>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold",
                (sla?.compliancePercent ?? 100) >= 95
                  ? "bg-emerald-50 text-emerald-700"
                  : (sla?.compliancePercent ?? 100) >= 80
                    ? "bg-amber-50 text-amber-700"
                    : "bg-rose-50 text-rose-700",
              )}
            >
              {(sla?.compliancePercent ?? 100) >= 95
                ? "🟢 Healthy"
                : (sla?.compliancePercent ?? 100) >= 80
                  ? "🟡 At Risk"
                  : "🔴 Attention"}
            </span>
          </div>
          <div className="mt-3 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">SLA Compliance:</span>
              <span className="font-bold text-slate-900">
                {sla?.compliancePercent ?? 100}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Orders At Risk:</span>
              <span className="font-bold text-amber-600">
                {sla?.ordersAtRisk ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">SLA Breaches:</span>
              <span className="font-bold text-rose-600">
                {sla?.ordersBreached ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Avg First Action:</span>
              <span className="font-bold text-blue-700">
                {sla?.avgFirstResponseMins != null
                  ? `~${sla.avgFirstResponseMins}m`
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
            Target: &lt; 30 mins hot, &lt; 2 hrs standard
          </div>
        </div>
      </div>

      {/* ── HOT ORDERS QUEUE ── */}
      {hotOrders.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-rose-600 animate-pulse" />
            <h2 className="text-sm font-bold text-rose-900">
              My Urgent Hot Orders ({hotOrders.length})
            </h2>
            <span className="text-xs text-rose-600">
              Requires immediate action
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg bg-white border border-rose-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-100/60 text-rose-900 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">Last Action</th>
                  <th className="py-2.5 px-3 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {hotOrders.map((ord: any) => (
                  <tr key={ord.orderId} className="hover:bg-rose-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-700">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-900">
                      {ord.customerName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {ord.serviceName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {ord.ageHours}h
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 capitalize">
                      {ord.lastAction}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to={`/admin/orders/${ord.orderId}` as any}
                        className="inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-700"
                      >
                        Open
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MY ORDERS TABLE ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              My Orders ({orders.length})
            </h2>
            <p className="text-xs text-slate-500">
              All orders currently in your assigned workload
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[10px] uppercase tracking-wide">
              <tr>
                <th className="py-2.5 px-4">Order #</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Assigned</th>
                <th className="py-2.5 px-3">Last Action</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">SLA</th>
                <th className="py-2.5 px-3 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 text-center text-slate-400 text-sm"
                  >
                    No orders currently assigned to you.
                  </td>
                </tr>
              ) : (
                orders.map((ord: any) => (
                  <tr
                    key={ord.orderId}
                    className={cn(
                      "transition",
                      ord.slaStatus === "BREACHED"
                        ? "hover:bg-rose-50/40 bg-rose-50/20"
                        : ord.slaStatus === "AT_RISK"
                          ? "hover:bg-amber-50/40 bg-amber-50/10"
                          : "hover:bg-blue-50/30",
                    )}
                  >
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-700">
                      {ord.orderNumber}
                      {ord.isHot && (
                        <span className="ml-1.5 inline-block rounded bg-rose-100 px-1 py-0.5 text-[9px] font-bold text-rose-700 uppercase">
                          Hot
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">
                        {ord.customerName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {ord.customerMobile}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[100px] truncate">
                      {ord.serviceName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                      {ord.assignedAt ? formatIST(ord.assignedAt) : "—"}
                    </td>
                    <td className="py-2.5 px-3 capitalize text-slate-800 text-[11px]">
                      {ord.lastActionText}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {ord.currentStage || "Received"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700">
                        {ord.currentStatus || "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={cn(
                          "inline-block rounded px-1.5 py-0.5 text-[10px] font-bold",
                          ord.slaStatus === "BREACHED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : ord.slaStatus === "AT_RISK"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200",
                        )}
                      >
                        {ord.slaStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to={`/admin/orders/${ord.orderId}` as any}
                        className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        Open
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TODAY'S TIMELINE + RECENT ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity Timeline */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            Today's Activity Timeline
          </h2>
          <div className="relative pl-5 space-y-3 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-200 max-h-80 overflow-y-auto pr-1">
            {timeline.length === 0 ? (
              <div className="text-xs text-slate-400 py-6">
                No activity recorded yet.
              </div>
            ) : (
              timeline.map((evt: any) => (
                <div key={evt.id} className="relative">
                  <div
                    className={cn(
                      "absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 border-white",
                      evt.isSlaBreached
                        ? "bg-rose-500"
                        : evt.slaStatus === "at_risk"
                          ? "bg-amber-400"
                          : "bg-blue-500",
                    )}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        "font-semibold capitalize",
                        ACTION_COLOR_MAP[evt.actionType] || "text-slate-900",
                      )}
                    >
                      {evt.actionLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {evt.time}
                    </span>
                  </div>
                  {evt.notes && (
                    <div className="text-xs text-slate-600 mt-0.5">
                      {evt.notes}
                    </div>
                  )}
                  {evt.orderCode && (
                    <Link
                      to={`/admin/orders/${evt.orderId}` as any}
                      className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:underline"
                    >
                      {evt.orderCode}
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest 20 Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3">
            My Latest Actions (Last 20)
          </h2>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 text-[10px] uppercase tracking-wide">
                <tr>
                  <th className="py-2 px-2">Action</th>
                  <th className="py-2 px-2">Order</th>
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentActions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-slate-400"
                    >
                      No actions performed yet.
                    </td>
                  </tr>
                ) : (
                  recentActions.map((act: any) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td
                        className={cn(
                          "py-2 px-2 capitalize font-semibold text-[11px]",
                          ACTION_COLOR_MAP[
                            act.action.toUpperCase().replace(/ /g, "_")
                          ] || "text-slate-900",
                        )}
                      >
                        {act.action}
                      </td>
                      <td className="py-2 px-2 font-mono text-blue-600">
                        {act.orderId ? (
                          <Link
                            to={`/admin/orders/${act.orderId}` as any}
                            className="hover:underline"
                          >
                            {act.orderCode || `#${act.orderId.slice(0, 8)}`}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 px-2 text-slate-400 font-mono text-[10px]">
                        {act.time}
                      </td>
                      <td className="py-2 px-2 text-[10px] text-slate-500">
                        {act.previousState} → {act.newState}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
