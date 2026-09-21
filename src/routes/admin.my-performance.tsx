import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getMyPerformanceDashboard,
  type DatePeriodFilter,
} from "@/lib/crm/employee-performance.functions";
import {
  ShoppingBag, CheckCircle2, Zap, Flame, Clock, AlertTriangle, ShieldCheck,
  Archive, ArrowRight, ExternalLink, RefreshCw, AlertCircle, Sparkles,
  Layers, CheckSquare, Activity,
} from "lucide-react";
import { formatIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/my-performance")({
  head: () => ({
    meta: [
      { title: "My Performance Dashboard — Business Help CRM" },
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

function MyPerformanceDashboardPage() {
  const [dateFilter, setDateFilter] = useState<DatePeriodFilter>("today");
  const queryClient = useQueryClient();
  const getMyPerfFn = useServerFn(getMyPerformanceDashboard);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["employee.my-performance", dateFilter],
    queryFn: () => getMyPerfFn({ data: { dateFilter } }),
    refetchInterval: 15000,
  });

  // Real-time listener for current user's actions
  useEffect(() => {
    const channel = supabase
      .channel("my_perf_action_sync")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_action_logs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["employee.my-performance"] });
        }
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
  const hotOrders = data?.hotOrders ?? [];
  const orders = data?.orders ?? [];
  const timeline = data?.timeline ?? [];
  const recentActions = data?.recentActions ?? [];

  const dateFilterButtons: { key: DatePeriodFilter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "7d", label: "7 Days" },
    { key: "15d", label: "15 Days" },
    { key: "this_month", label: "This Month" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Greeting */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {getGreeting(emp?.name)}
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              Personal View
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Here's your work summary, queue priority, and operational productivity.
          </p>
        </div>

        {/* Date Selector & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {dateFilterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setDateFilter(btn.key)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition",
                  dateFilter === btn.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
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
            <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", isFetching && "animate-spin")} />
            Sync
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        <MyKpiCard
          label="ASSIGNED"
          value={kpis?.assigned ?? 0}
          icon={<ShoppingBag className="h-4 w-4 text-blue-600" />}
        />
        <MyKpiCard
          label="WORKED"
          value={kpis?.worked ?? 0}
          icon={<Zap className="h-4 w-4 text-indigo-600" />}
        />
        <MyKpiCard
          label="MY ACTIONS"
          value={kpis?.actions ?? 0}
          icon={<Activity className="h-4 w-4 text-slate-800" />}
        />
        <MyKpiCard
          label="COMPLETED"
          value={kpis?.completed ?? 0}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        />
        <MyKpiCard
          label="CLOSED"
          value={kpis?.closed ?? 0}
          icon={<Archive className="h-4 w-4 text-slate-500" />}
        />
        <MyKpiCard
          label="CUST DELAYS"
          value={kpis?.customerDelays ?? 0}
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <MyKpiCard
          label="TECH DELAYS"
          value={kpis?.technicalDelays ?? 0}
          icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
        />
        <MyKpiCard
          label="HOT ORDERS"
          value={kpis?.hotOrders ?? 0}
          icon={<Flame className="h-4 w-4 text-rose-600" />}
        />
        <MyKpiCard
          label="SLA COMPLIANCE"
          value={`${kpis?.slaCompliance ?? 100}%`}
          icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
        />
      </div>

      {/* MY WORKLOAD VISUAL FLOW & SLA SCORECARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Pipeline */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">My Workload Pipeline</h2>
              <p className="text-xs text-slate-500">Live progression of your assigned queue</p>
            </div>
            <div className="text-xs text-slate-500">
              Pending First Action: <span className="font-bold text-amber-600">{flow?.pending ?? 0}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 text-center items-center">
            <div className="rounded-lg bg-blue-50 p-3 border border-blue-100">
              <div className="text-[11px] font-bold text-blue-700 uppercase">ASSIGNED</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{flow?.assigned ?? 0}</div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <ArrowRight className="h-4 w-4 text-slate-400 hidden sm:block" />
              <div className="rounded-lg bg-indigo-50 p-3 border border-indigo-100 w-full mt-1">
                <div className="text-[11px] font-bold text-indigo-700 uppercase">ACTIONED</div>
                <div className="text-2xl font-bold text-indigo-900 mt-1">{flow?.actioned ?? 0}</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <ArrowRight className="h-4 w-4 text-slate-400 hidden sm:block" />
              <div className="rounded-lg bg-amber-50 p-3 border border-amber-100 w-full mt-1">
                <div className="text-[11px] font-bold text-amber-700 uppercase">IN PROGRESS</div>
                <div className="text-2xl font-bold text-amber-900 mt-1">{flow?.inProgress ?? 0}</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <ArrowRight className="h-4 w-4 text-slate-400 hidden sm:block" />
              <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-100 w-full mt-1">
                <div className="text-[11px] font-bold text-emerald-700 uppercase">COMPLETED</div>
                <div className="text-2xl font-bold text-emerald-900 mt-1">{flow?.completed ?? 0}</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <ArrowRight className="h-4 w-4 text-slate-400 hidden sm:block" />
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 w-full mt-1">
                <div className="text-[11px] font-bold text-slate-700 uppercase">CLOSED</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{flow?.closed ?? 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* SLA Health Scorecard */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">My SLA Health & Speed</h2>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold",
                (sla?.compliancePercent ?? 100) >= 95
                  ? "bg-emerald-50 text-emerald-700"
                  : (sla?.compliancePercent ?? 100) >= 80
                  ? "bg-amber-50 text-amber-700"
                  : "bg-rose-50 text-rose-700"
              )}
            >
              {(sla?.compliancePercent ?? 100) >= 95 ? "🟢 Healthy" : (sla?.compliancePercent ?? 100) >= 80 ? "🟡 At Risk" : "🔴 Attention Required"}
            </span>
          </div>

          <div className="mt-3 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">SLA Compliance:</span>
              <span className="font-bold text-slate-900">{sla?.compliancePercent ?? 100}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Orders Approaching SLA:</span>
              <span className="font-bold text-amber-600">{sla?.ordersAtRisk ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">SLA Breaches:</span>
              <span className="font-bold text-rose-600">{sla?.ordersBreached ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Avg First Action Speed:</span>
              <span className="font-bold text-blue-700">~{sla?.avgFirstResponseMins ?? 15}m</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Target response time: &lt; 30 mins for Hot, &lt; 2 hrs standard
          </div>
        </div>
      </div>

      {/* MY HOT ORDERS (High Urgency Priority Queue) */}
      {hotOrders.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-rose-600" />
            <h2 className="text-sm font-bold text-rose-900">
              My Urgent Hot Orders Queue ({hotOrders.length})
            </h2>
            <span className="text-xs text-rose-600 font-medium">Requires immediate operational action</span>
          </div>

          <div className="overflow-x-auto rounded-lg bg-white border border-rose-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-100/60 text-rose-900 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Queue Age</th>
                  <th className="py-2.5 px-3">Last Action</th>
                  <th className="py-2.5 px-3">Next Action</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100 font-medium">
                {hotOrders.map((ord: any) => (
                  <tr key={ord.orderId} className="hover:bg-rose-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-700">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-900">{ord.customerName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{ord.serviceName}</td>
                    <td className="py-2.5 px-3 text-slate-700">{ord.ageHours}h</td>
                    <td className="py-2.5 px-3 text-slate-700 capitalize">{ord.lastAction}</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">{ord.nextAction}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to={`/admin/orders/${ord.orderId}` as any}
                        className="inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-700"
                      >
                        Open Order
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

      {/* MY ASSIGNED ORDERS TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Orders ({orders.length})</h2>
            <p className="text-xs text-slate-500">All orders currently in your assigned workload</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Assigned</th>
                <th className="py-3 px-3">Last Action</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">SLA</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No orders currently assigned to you.
                  </td>
                </tr>
              ) : (
                orders.map((ord: any) => (
                  <tr key={ord.orderId} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {ord.orderNumber}
                      {ord.isHot && (
                        <span className="ml-1.5 inline-block rounded bg-rose-100 px-1 py-0.2 text-[9px] font-bold text-rose-700 uppercase">
                          Hot
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400">{ord.customerMobile}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{ord.serviceName}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {ord.assignedAt ? formatIST(ord.assignedAt) : "—"}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-800">
                      {ord.lastActionText}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {ord.currentStage || "Received"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700">
                        {ord.currentStatus || "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={cn(
                        "inline-block rounded px-1.5 py-0.5 text-[10px] font-bold",
                        ord.slaStatus === 'COMPLIANT' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      )}>
                        {ord.slaStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/orders/${ord.orderId}` as any}
                        className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
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

      {/* MY ACTIVITY TIMELINE & RECENT 20 ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Today's Activity Timeline</h2>
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 max-h-80 overflow-y-auto pr-1">
            {timeline.length === 0 ? (
              <div className="text-xs text-slate-400 py-6">No activity recorded today yet.</div>
            ) : (
              timeline.map((evt: any) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 capitalize">{evt.actionLabel}</span>
                    <span className="text-[10px] font-mono text-slate-400">{evt.time}</span>
                  </div>
                  {evt.notes && <div className="text-xs text-slate-600 mt-0.5">{evt.notes}</div>}
                  {evt.orderId && (
                    <Link
                      to={`/admin/orders/${evt.orderId}` as any}
                      className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:underline"
                    >
                      Order #{evt.orderId.slice(0, 8)}
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest 20 Actions Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3">My Latest Actions (Last 20)</h2>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0">
                <tr>
                  <th className="py-2 px-2">Action</th>
                  <th className="py-2 px-2">Order</th>
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentActions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      No actions performed yet.
                    </td>
                  </tr>
                ) : (
                  recentActions.map((act: any) => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="py-2 px-2 capitalize font-semibold text-slate-900">
                        {act.action}
                      </td>
                      <td className="py-2 px-2 font-mono text-blue-600">
                        {act.orderId ? (
                          <Link to={`/admin/orders/${act.orderId}` as any} className="hover:underline">
                            #{act.orderId.slice(0, 8)}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 px-2 text-slate-400 font-mono text-[10px]">{act.time}</td>
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

function MyKpiCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase truncate">{label}</span>
        <div className="p-1 rounded bg-slate-50">{icon}</div>
      </div>
      <div className="mt-2 text-lg font-bold text-slate-900">{value}</div>
    </div>
  );
}
