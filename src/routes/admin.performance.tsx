import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getEmployeePerformanceCommandCenter,
  getEmployeeDetailPerformance,
  getLiveActivityFeed,
  type DatePeriodFilter,
} from "@/lib/crm/employee-performance.functions";
import {
  Users, UserCheck, ShoppingBag, Zap, CheckCircle2, Archive, AlertTriangle, ShieldCheck,
  Clock, Flame, RefreshCw, ChevronRight, X, ExternalLink, Filter, TrendingUp, TrendingDown,
  Activity, BarChart3, AlertCircle, ArrowRight, ShieldAlert,
} from "lucide-react";
import { formatIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/performance")({
  head: () => ({
    meta: [
      { title: "Employee Performance Command Center — Business Help CRM" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/admin-login" });
    const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role as string);
    if (!roles.includes("admin") && !roles.includes("super_admin") && !roles.includes("manager")) {
      throw redirect({ to: "/admin/my-performance" });
    }
  },
  component: PerformanceCommandCenterPage,
});

function PerformanceCommandCenterPage() {
  const [dateFilter, setDateFilter] = useState<DatePeriodFilter>("today");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [inspectEmployeeId, setInspectEmployeeId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const getCommandCenterFn = useServerFn(getEmployeePerformanceCommandCenter);
  const getLiveFeedFn = useServerFn(getLiveActivityFeed);

  // Command center query
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin.performance.command-center", dateFilter, customStart, customEnd, selectedEmployeeId, selectedServiceId],
    queryFn: () =>
      getCommandCenterFn({
        data: {
          dateFilter,
          customStart: customStart || undefined,
          customEnd: customEnd || undefined,
          employeeId: selectedEmployeeId,
          serviceId: selectedServiceId,
        },
      }),
    refetchInterval: 30000, // Background refresh every 30s
  });

  // Live activity feed query
  const { data: liveFeed } = useQuery({
    queryKey: ["admin.performance.live-feed", selectedEmployeeId],
    queryFn: () => getLiveFeedFn({ data: { limit: 20, employeeId: selectedEmployeeId || undefined } }),
    refetchInterval: 10000,
  });

  // Supabase realtime listener on order_action_logs
  useEffect(() => {
    const channel = supabase
      .channel("perf_command_center_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_action_logs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["admin.performance.command-center"] });
          queryClient.invalidateQueries({ queryKey: ["admin.performance.live-feed"] });
          if (inspectEmployeeId) {
            queryClient.invalidateQueries({ queryKey: ["admin.performance.employee-detail", inspectEmployeeId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, inspectEmployeeId]);

  const kpis = data?.kpiCards;
  const employeeRows = data?.employeeRows ?? [];
  const funnel = data?.funnel;
  const charts = data?.charts;

  const dateFilterButtons: { key: DatePeriodFilter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "7d", label: "7 Days" },
    { key: "15d", label: "15 Days" },
    { key: "30d", label: "30 Days" },
    { key: "this_month", label: "This Month" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Employee Performance Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Realtime
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Monitor workload, productivity, SLA compliance and operational activity in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {/* Period Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {dateFilterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setDateFilter(btn.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                dateFilter === btn.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Custom Range Picker */}
        {dateFilter === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
            />
          </div>
        )}

        {/* Employee Dropdown Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedEmployeeId || ""}
            onChange={(e) => setSelectedEmployeeId(e.target.value || null)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Employees ({employeeRows.length})</option>
            {employeeRows.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 14 TOP KPI CARDS (Dense 7-column grid on XL screens) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <KpiCard
          label="ACTIVE STAFF"
          value={kpis?.totalActiveEmployees?.value ?? 0}
          trend={kpis?.totalActiveEmployees?.trend}
          subtext="Total workforce"
          icon={<Users className="h-4 w-4 text-blue-600" />}
          accentColor="blue"
        />
        <KpiCard
          label="OPERATORS TODAY"
          value={kpis?.employeesWorkedToday?.value ?? 0}
          trend={kpis?.employeesWorkedToday?.trend}
          subtext="Actively working"
          icon={<UserCheck className="h-4 w-4 text-emerald-600" />}
          accentColor="emerald"
        />
        <KpiCard
          label="ORDERS ASSIGNED"
          value={kpis?.ordersAssigned?.value ?? 0}
          trend={kpis?.ordersAssigned?.trend}
          subtext="Assigned in period"
          icon={<ShoppingBag className="h-4 w-4 text-slate-700" />}
          accentColor="slate"
        />
        <KpiCard
          label="ORDERS ACTIONED"
          value={kpis?.ordersActioned?.value ?? 0}
          trend={kpis?.ordersActioned?.trend}
          subtext="Orders with activity"
          icon={<Zap className="h-4 w-4 text-amber-600" />}
          accentColor="amber"
        />
        <KpiCard
          label="TOTAL ACTIONS"
          value={kpis?.totalActions?.value ?? 0}
          trend={kpis?.totalActions?.trend}
          subtext="Operations performed"
          icon={<Activity className="h-4 w-4 text-indigo-600" />}
          accentColor="indigo"
        />
        <KpiCard
          label="COMPLETED"
          value={kpis?.ordersCompleted?.value ?? 0}
          trend={kpis?.ordersCompleted?.trend}
          subtext="Certificates delivered"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          accentColor="emerald"
        />
        <KpiCard
          label="CLOSED"
          value={kpis?.ordersClosed?.value ?? 0}
          trend={kpis?.ordersClosed?.trend}
          subtext="Orders archived"
          icon={<Archive className="h-4 w-4 text-slate-500" />}
          accentColor="slate"
        />
        <KpiCard
          label="SLA COMPLIANCE"
          value={`${kpis?.slaCompliantPercent?.value ?? 100}%`}
          trend={kpis?.slaCompliantPercent?.trend}
          subtext="Target: ≥ 95%"
          icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
          accentColor="emerald"
        />
        <KpiCard
          label="SLA BREACHED"
          value={kpis?.slaBreached?.value ?? 0}
          trend={kpis?.slaBreached?.trend}
          subtext="Threshold exceeded"
          icon={<ShieldAlert className="h-4 w-4 text-rose-600" />}
          accentColor="rose"
        />
        <KpiCard
          label="CUSTOMER DELAYS"
          value={kpis?.customerDelays?.value ?? 0}
          trend={kpis?.customerDelays?.trend}
          subtext="Awaiting client reply"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          accentColor="amber"
        />
        <KpiCard
          label="TECHNICAL DELAYS"
          value={kpis?.technicalDelays?.value ?? 0}
          trend={kpis?.technicalDelays?.trend}
          subtext="Portal / system hold"
          icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
          accentColor="orange"
        />
        <KpiCard
          label="HOT ORDERS"
          value={kpis?.hotOrdersHandled?.value ?? 0}
          trend={kpis?.hotOrdersHandled?.trend}
          subtext="High urgency handled"
          icon={<Flame className="h-4 w-4 text-rose-600" />}
          accentColor="rose"
        />
        <KpiCard
          label="REASSIGNMENTS"
          value={kpis?.reassignedOrders?.value ?? 0}
          trend={kpis?.reassignedOrders?.trend}
          subtext="Reallocated orders"
          icon={<RefreshCw className="h-4 w-4 text-purple-600" />}
          accentColor="purple"
        />
        <KpiCard
          label="UNIQUE WORKED"
          value={kpis?.uniqueOrdersWorked?.value ?? 0}
          trend={kpis?.uniqueOrdersWorked?.trend}
          subtext="Distinct orders"
          icon={<BarChart3 className="h-4 w-4 text-cyan-600" />}
          accentColor="cyan"
        />
      </div>

      {/* ADMIN ASSIGNMENT FUNNEL */}
      {funnel && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Workload Assignment & Fulfillment Funnel</h2>
              <p className="text-xs text-slate-500">Track assigned orders progressing through action and completion</p>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Untouched: <span className="font-bold text-rose-600">{funnel.untouched}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5 text-center">
            <div className="rounded-lg bg-blue-50/70 p-3 border border-blue-100">
              <div className="text-xs font-semibold uppercase text-blue-700">Assigned</div>
              <div className="text-2xl font-bold text-blue-900">{funnel.assigned}</div>
              <div className="text-[11px] text-blue-600">Total in period</div>
            </div>

            <div className="rounded-lg bg-indigo-50/70 p-3 border border-indigo-100">
              <div className="text-xs font-semibold uppercase text-indigo-700">Actioned</div>
              <div className="text-2xl font-bold text-indigo-900">{funnel.actioned}</div>
              <div className="text-[11px] text-indigo-600">
                {funnel.assigned > 0 ? Math.round((funnel.actioned / funnel.assigned) * 100) : 0}% of assigned
              </div>
            </div>

            <div className="rounded-lg bg-amber-50/70 p-3 border border-amber-100">
              <div className="text-xs font-semibold uppercase text-amber-700">In Progress</div>
              <div className="text-2xl font-bold text-amber-900">{funnel.inProgress}</div>
              <div className="text-[11px] text-amber-600">Active operations</div>
            </div>

            <div className="rounded-lg bg-emerald-50/70 p-3 border border-emerald-100">
              <div className="text-xs font-semibold uppercase text-emerald-700">Completed</div>
              <div className="text-2xl font-bold text-emerald-900">{funnel.completed}</div>
              <div className="text-[11px] text-emerald-600">
                {funnel.assigned > 0 ? Math.round((funnel.completed / funnel.assigned) * 100) : 0}% completion rate
              </div>
            </div>

            <div className={cn(
              "rounded-lg p-3 border",
              funnel.untouched > 0 ? "bg-rose-50/70 border-rose-200" : "bg-slate-50 border-slate-100"
            )}>
              <div className={cn("text-xs font-semibold uppercase", funnel.untouched > 0 ? "text-rose-700" : "text-slate-600")}>Untouched</div>
              <div className={cn("text-2xl font-bold", funnel.untouched > 0 ? "text-rose-900" : "text-slate-700")}>{funnel.untouched}</div>
              <div className={cn("text-[11px]", funnel.untouched > 0 ? "text-rose-600" : "text-slate-500")}>Zero actions yet</div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN EMPLOYEE PERFORMANCE TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Employee Operational Performance Table</h2>
            <p className="text-xs text-slate-500">Click any row to view complete timeline, order history, and granular SLA stats</p>
          </div>
          <div className="text-xs text-slate-400">
            Showing {employeeRows.length} employees
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3 text-center">Assigned</th>
                <th className="py-3 px-3 text-center">Worked</th>
                <th className="py-3 px-3 text-center">Actions</th>
                <th className="py-3 px-3 text-center">Completed</th>
                <th className="py-3 px-3 text-center">Closed</th>
                <th className="py-3 px-3 text-center">Customer Delay</th>
                <th className="py-3 px-3 text-center">Tech Delay</th>
                <th className="py-3 px-3 text-center">Hot Orders</th>
                <th className="py-3 px-3 text-center">SLA %</th>
                <th className="py-3 px-4">Last Action</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {employeeRows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-400">
                    No employee activity recorded for this period.
                  </td>
                </tr>
              ) : (
                employeeRows.map((emp) => (
                  <tr
                    key={emp.employeeId}
                    onClick={() => setInspectEmployeeId(emp.employeeId)}
                    className="hover:bg-blue-50/50 cursor-pointer transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[11px]">
                            {emp.employeeName.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white",
                              emp.status === "active" ? "bg-emerald-500" : emp.status === "away" ? "bg-amber-400" : "bg-slate-300"
                            )}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{emp.employeeName}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{emp.employeeRole}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-semibold text-slate-800">{emp.assigned}</td>
                    <td className="py-3 px-3 text-center font-semibold text-blue-700">{emp.worked}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{emp.actions}</td>
                    <td className="py-3 px-3 text-center font-semibold text-emerald-700">{emp.completed}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{emp.closed}</td>
                    <td className="py-3 px-3 text-center text-amber-700">{emp.customerDelays}</td>
                    <td className="py-3 px-3 text-center text-orange-700">{emp.technicalDelays}</td>
                    <td className="py-3 px-3 text-center font-semibold text-rose-600">{emp.hotOrders}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={cn(
                          "inline-block rounded px-1.5 py-0.5 text-[11px] font-bold",
                          emp.slaPercent >= 95
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : emp.slaPercent >= 80
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        )}
                      >
                        {emp.slaPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 capitalize truncate max-w-[140px]" title={emp.lastActionText}>
                        {emp.lastActionText}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {emp.lastActionTime ? formatIST(emp.lastActionTime) : "—"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            emp.status === "active" ? "bg-emerald-500" : emp.status === "away" ? "bg-amber-400" : "bg-slate-300"
                          )}
                        />
                        <span className="text-xs text-slate-600">{emp.lastActiveAgo}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <ChevronRight className="h-4 w-4 text-slate-400 inline" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM SECTION: CHARTS & REAL-TIME ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Productivity Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Operational Actions by Hour (Today)</h3>
              <p className="text-xs text-slate-500">Distribution of operational events throughout the working day</p>
            </div>
            <span className="text-xs font-semibold text-blue-600">24h Spectrum</span>
          </div>

          <div className="h-44 flex items-end gap-1.5 pt-4 border-b border-slate-100">
            {charts?.hourlyActions?.map((pt: any, idx: number) => {
              const maxVal = Math.max(...(charts?.hourlyActions?.map((p: any) => p.actions) || [1]), 1);
              const heightPct = Math.round((pt.actions / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      pt.actions > 0 ? "bg-blue-600 group-hover:bg-blue-700" : "bg-slate-100"
                    )}
                    style={{ height: `${Math.max(heightPct, 6)}%` }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10">
                    {pt.hour}: {pt.actions} actions
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Live Database Activity Stream */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Auto-Sync</span>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-2.5 pr-1">
            {(!liveFeed || liveFeed.length === 0) ? (
              <div className="text-xs text-slate-400 py-10 text-center">No recent actions logged</div>
            ) : (
              liveFeed.map((item: any) => (
                <div key={item.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-900">{item.employeeName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{item.time}</span>
                  </div>
                  <div className="mt-1 text-slate-700 font-medium capitalize">
                    {item.actionText}
                  </div>
                  {item.orderId && (
                    <Link
                      to={`/admin/orders/${item.orderId}` as any}
                      className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:underline"
                    >
                      Order #{item.orderId.slice(0, 8)}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* EMPLOYEE DETAIL DRAWER */}
      {inspectEmployeeId && (
        <EmployeeDetailDrawer
          employeeId={inspectEmployeeId}
          dateFilter={dateFilter}
          customStart={customStart}
          customEnd={customEnd}
          onClose={() => setInspectEmployeeId(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  KPI CARD COMPONENT                                                        */
/* -------------------------------------------------------------------------- */

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: { percent: number; isUp: boolean };
  subtext: string;
  icon: React.ReactNode;
  accentColor: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'slate' | 'orange' | 'purple' | 'cyan';
}

function KpiCard({ label, value, trend, subtext, icon }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{label}</span>
        <div className="p-1.5 rounded-lg bg-slate-50">{icon}</div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && trend.percent > 0 && (
          <span
            className={cn(
              "inline-flex items-center text-[10px] font-semibold",
              trend.isUp ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.isUp ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
            {trend.percent}%
          </span>
        )}
      </div>

      <div className="mt-1 text-[10px] text-slate-400 truncate">{subtext}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  EMPLOYEE DETAIL DRAWER MODAL                                              */
/* -------------------------------------------------------------------------- */

function EmployeeDetailDrawer({
  employeeId,
  dateFilter,
  customStart,
  customEnd,
  onClose,
}: {
  employeeId: string;
  dateFilter: DatePeriodFilter;
  customStart?: string;
  customEnd?: string;
  onClose: () => void;
}) {
  const getDetailFn = useServerFn(getEmployeeDetailPerformance);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.performance.employee-detail", employeeId, dateFilter, customStart, customEnd],
    queryFn: () => getDetailFn({ data: { employeeId, dateFilter, customStart, customEnd } }),
  });

  const emp = data?.employee;
  const kpis = data?.kpiCards;
  const timeline = data?.timeline ?? [];
  const orderWorkList = data?.orderWorkList ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base">
              {emp?.name.charAt(0).toUpperCase() ?? "E"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{emp?.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="capitalize">{emp?.role}</span>
                <span>•</span>
                <span>{emp?.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400">Loading detailed employee profile...</div>
          ) : (
            <>
              {/* Employee KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                  <div className="text-xs text-blue-700 font-semibold uppercase">Assigned</div>
                  <div className="text-2xl font-bold text-blue-900">{kpis?.assigned}</div>
                </div>
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                  <div className="text-xs text-indigo-700 font-semibold uppercase">Worked</div>
                  <div className="text-2xl font-bold text-indigo-900">{kpis?.worked}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs text-slate-600 font-semibold uppercase">Actions</div>
                  <div className="text-2xl font-bold text-slate-900">{kpis?.actions}</div>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                  <div className="text-xs text-emerald-700 font-semibold uppercase">Completed</div>
                  <div className="text-2xl font-bold text-emerald-900">{kpis?.completed}</div>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                  <div className="text-xs text-amber-700 font-semibold uppercase">SLA Compliance</div>
                  <div className="text-2xl font-bold text-amber-900">{kpis?.slaCompliance}%</div>
                </div>
              </div>

              {/* Order Work Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-xs text-slate-700">
                  Assigned Orders Work Breakdown ({orderWorkList.length})
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Order #</th>
                        <th className="py-2 px-3">Customer</th>
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-2 text-center">Actions</th>
                        <th className="py-2 px-3">Current Stage</th>
                        <th className="py-2 px-3">SLA</th>
                        <th className="py-2 px-3 text-right">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orderWorkList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-slate-400">
                            No orders assigned in this period.
                          </td>
                        </tr>
                      ) : (
                        orderWorkList.map((ord: any) => (
                          <tr key={ord.orderId} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-semibold text-blue-700">
                              {ord.orderNumber}
                            </td>
                            <td className="py-2 px-3 text-slate-800">{ord.customerName}</td>
                            <td className="py-2 px-3 text-slate-600">{ord.serviceName}</td>
                            <td className="py-2 px-2 text-center font-bold text-slate-900">{ord.totalActions}</td>
                            <td className="py-2 px-3">
                              <span className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {ord.currentStage || "Received"}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className={cn(
                                "inline-block rounded px-1.5 py-0.5 text-[10px] font-bold",
                                ord.slaStatus === 'COMPLIANT' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                              )}>
                                {ord.slaStatus}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <Link
                                to={`/admin/orders/${ord.orderId}` as any}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3.5 w-3.5 inline" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="rounded-xl border border-slate-200 p-4 shadow-sm bg-white">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Chronological Activity Timeline</h3>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timeline.length === 0 ? (
                    <div className="text-xs text-slate-400 py-4">No logged activity in this timeframe.</div>
                  ) : (
                    timeline.map((evt: any) => (
                      <div key={evt.id} className="relative group">
                        <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900 capitalize">{evt.actionLabel}</span>
                          <span className="text-[11px] font-mono text-slate-400">{evt.time}</span>
                        </div>
                        {evt.notes && <div className="mt-1 text-xs text-slate-600">{evt.notes}</div>}
                        {evt.orderId && (
                          <Link
                            to={`/admin/orders/${evt.orderId}` as any}
                            className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:underline"
                          >
                            Order #{evt.orderId.slice(0, 8)}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
