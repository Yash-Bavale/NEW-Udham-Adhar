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
  Users,
  UserCheck,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Archive,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Flame,
  RefreshCw,
  ChevronRight,
  X,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  ShieldAlert,
  Circle,
  Timer,
} from "lucide-react";
import { formatIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/performance")({
  head: () => ({
    meta: [
      {
        title: "Employee Performance Command Center — Business Help CRM",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/admin-login" });
    const { data: rows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role as string);
    if (
      !roles.includes("admin") &&
      !roles.includes("super_admin") &&
      !roles.includes("manager")
    ) {
      throw redirect({ to: "/admin/my-performance" });
    }
  },
  component: PerformanceCommandCenterPage,
});

/* ─────────────────────────────────────────────────────────────────── */

function PerformanceCommandCenterPage() {
  const [dateFilter, setDateFilter] = useState<DatePeriodFilter>("today");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [selectedServiceId] = useState<string | null>(null);
  const [inspectEmployeeId, setInspectEmployeeId] = useState<string | null>(
    null,
  );

  const queryClient = useQueryClient();
  const getCommandCenterFn = useServerFn(getEmployeePerformanceCommandCenter);
  const getLiveFeedFn = useServerFn(getLiveActivityFeed);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [
      "admin.performance.command-center",
      dateFilter,
      customStart,
      customEnd,
      selectedEmployeeId,
      selectedServiceId,
    ],
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
    refetchInterval: 30_000,
  });

  const { data: liveFeed } = useQuery({
    queryKey: ["admin.performance.live-feed", selectedEmployeeId],
    queryFn: () =>
      getLiveFeedFn({
        data: {
          limit: 25,
          employeeId: selectedEmployeeId || undefined,
        },
      }),
    refetchInterval: 8_000,
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("perf_command_center_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_action_logs" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["admin.performance.command-center"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin.performance.live-feed"],
          });
          if (inspectEmployeeId) {
            queryClient.invalidateQueries({
              queryKey: [
                "admin.performance.employee-detail",
                inspectEmployeeId,
              ],
            });
          }
        },
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

  const activeCount = employeeRows.filter((e) => e.status === "active").length;
  const awayCount = employeeRows.filter((e) => e.status === "away").length;
  const offlineCount = employeeRows.filter(
    (e) => e.status === "offline",
  ).length;

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
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Employee Performance Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Monitor workload, productivity, SLA compliance and operational
            activity in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          {dateFilterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setDateFilter(btn.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                dateFilter === btn.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {btn.label}
            </button>
          ))}
          {dateFilter === "custom" && (
            <div className="flex items-center gap-2 ml-2">
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
        </div>
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

      {/* ── LIVE EMPLOYEE STATUS SUMMARY BAR ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span>
              {employeeRows.length} Employees
            </span>
            <span className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
              {activeCount} Active
            </span>
            <span className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-amber-400 text-amber-400" />
              {awayCount} Away
            </span>
            <span className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-slate-300 text-slate-300" />
              {offlineCount} Offline
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            LIVE EMPLOYEE STATUS
          </span>
        </div>

        {/* Employee Status Card Grid */}
        <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-lg bg-slate-100 animate-pulse"
                />
              ))
            : employeeRows.map((emp) => (
                <button
                  key={emp.employeeId}
                  onClick={() => setInspectEmployeeId(emp.employeeId)}
                  className={cn(
                    "rounded-lg border p-2.5 text-left transition hover:shadow-md",
                    emp.status === "active"
                      ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                      : emp.status === "away"
                        ? "border-amber-200 bg-amber-50/30 hover:border-amber-300"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300",
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="relative">
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {emp.employeeName.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white",
                          emp.status === "active"
                            ? "bg-emerald-500"
                            : emp.status === "away"
                              ? "bg-amber-400"
                              : "bg-slate-300",
                        )}
                      />
                    </div>
                    <div
                      className="text-[11px] font-semibold text-slate-900 truncate"
                      title={emp.employeeName}
                    >
                      {emp.employeeName.split(" ")[0]}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-1.5">
                    {emp.status === "active" ? (
                      <span className="text-emerald-700 font-semibold">
                        Active
                      </span>
                    ) : emp.status === "away" ? (
                      <span className="text-amber-700 font-semibold">
                        Away {emp.lastActiveAgo}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        Offline
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div>
                      <div className="text-slate-400">Orders</div>
                      <div className="font-bold text-slate-800">
                        {emp.assigned}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Actions</div>
                      <div className="font-bold text-slate-800">
                        {emp.actions}
                      </div>
                    </div>
                  </div>
                  {emp.sessionLabel !== "—" && (
                    <div className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Timer className="h-2.5 w-2.5" />
                      {emp.sessionLabel}
                    </div>
                  )}
                </button>
              ))}
        </div>
      </div>

      {/* ── 14 KPI CARDS ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <KpiCard
          label="ACTIVE STAFF"
          value={kpis?.totalActiveEmployees?.value ?? 0}
          trend={kpis?.totalActiveEmployees?.trend}
          subtext="Total workforce"
          icon={<Users className="h-4 w-4 text-blue-600" />}
        />
        <KpiCard
          label="OPERATORS TODAY"
          value={kpis?.employeesWorkedToday?.value ?? 0}
          trend={kpis?.employeesWorkedToday?.trend}
          subtext="Actively working"
          icon={<UserCheck className="h-4 w-4 text-emerald-600" />}
        />
        <KpiCard
          label="ORDERS ASSIGNED"
          value={kpis?.ordersAssigned?.value ?? 0}
          trend={kpis?.ordersAssigned?.trend}
          subtext="Assigned in period"
          icon={<ShoppingBag className="h-4 w-4 text-slate-700" />}
        />
        <KpiCard
          label="ORDERS ACTIONED"
          value={kpis?.ordersActioned?.value ?? 0}
          trend={kpis?.ordersActioned?.trend}
          subtext="Orders with activity"
          icon={<Zap className="h-4 w-4 text-amber-600" />}
        />
        <KpiCard
          label="TOTAL ACTIONS"
          value={kpis?.totalActions?.value ?? 0}
          trend={kpis?.totalActions?.trend}
          subtext="Operations performed"
          icon={<Activity className="h-4 w-4 text-indigo-600" />}
        />
        <KpiCard
          label="COMPLETED"
          value={kpis?.ordersCompleted?.value ?? 0}
          trend={kpis?.ordersCompleted?.trend}
          subtext="Certificates delivered"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        />
        <KpiCard
          label="CLOSED"
          value={kpis?.ordersClosed?.value ?? 0}
          trend={kpis?.ordersClosed?.trend}
          subtext="Orders archived"
          icon={<Archive className="h-4 w-4 text-slate-500" />}
        />
        <KpiCard
          label="SLA COMPLIANCE"
          value={`${kpis?.slaCompliantPercent?.value ?? 100}%`}
          trend={kpis?.slaCompliantPercent?.trend}
          subtext="Target: ≥ 95%"
          icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
        />
        <KpiCard
          label="SLA BREACHED"
          value={kpis?.slaBreached?.value ?? 0}
          trend={kpis?.slaBreached?.trend}
          subtext="Threshold exceeded"
          icon={<ShieldAlert className="h-4 w-4 text-rose-600" />}
          dangerIfHigh
        />
        <KpiCard
          label="CUSTOMER DELAYS"
          value={kpis?.customerDelays?.value ?? 0}
          trend={kpis?.customerDelays?.trend}
          subtext="Awaiting client reply"
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <KpiCard
          label="TECHNICAL DELAYS"
          value={kpis?.technicalDelays?.value ?? 0}
          trend={kpis?.technicalDelays?.trend}
          subtext="Portal / system hold"
          icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
        />
        <KpiCard
          label="HOT ORDERS"
          value={kpis?.hotOrdersHandled?.value ?? 0}
          trend={kpis?.hotOrdersHandled?.trend}
          subtext="High urgency handled"
          icon={<Flame className="h-4 w-4 text-rose-600" />}
        />
        <KpiCard
          label="REASSIGNMENTS"
          value={kpis?.reassignedOrders?.value ?? 0}
          trend={kpis?.reassignedOrders?.trend}
          subtext="Reallocated orders"
          icon={<RefreshCw className="h-4 w-4 text-purple-600" />}
        />
        <KpiCard
          label="UNIQUE WORKED"
          value={kpis?.uniqueOrdersWorked?.value ?? 0}
          trend={kpis?.uniqueOrdersWorked?.trend}
          subtext="Distinct orders"
          icon={<BarChart3 className="h-4 w-4 text-cyan-600" />}
        />
      </div>

      {/* ── ASSIGNMENT FUNNEL ── */}
      {funnel && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Workload Assignment & Fulfillment Funnel
              </h2>
              <p className="text-xs text-slate-500">
                Track assigned orders progressing through action and completion
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Untouched:{" "}
              <span
                className={cn(
                  "font-bold",
                  funnel.untouched > 0 ? "text-rose-600" : "text-slate-500",
                )}
              >
                {funnel.untouched}
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5 text-center">
            {[
              {
                label: "Assigned",
                value: funnel.assigned,
                bg: "bg-blue-50/70 border-blue-100",
                text: "text-blue-900",
                sub: "text-blue-600 text-[11px]",
                subtext: "Total in period",
              },
              {
                label: "Actioned",
                value: funnel.actioned,
                bg: "bg-indigo-50/70 border-indigo-100",
                text: "text-indigo-900",
                sub: "text-indigo-600 text-[11px]",
                subtext: `${funnel.assigned > 0 ? Math.round((funnel.actioned / funnel.assigned) * 100) : 0}% of assigned`,
              },
              {
                label: "Completed",
                value: funnel.completed,
                bg: "bg-emerald-50/70 border-emerald-100",
                text: "text-emerald-900",
                sub: "text-emerald-600 text-[11px]",
                subtext: `${funnel.assigned > 0 ? Math.round((funnel.completed / funnel.assigned) * 100) : 0}% completion`,
              },
              {
                label: "Closed",
                value: funnel.closed,
                bg: "bg-slate-50 border-slate-200",
                text: "text-slate-900",
                sub: "text-slate-500 text-[11px]",
                subtext: "Archived orders",
              },
              {
                label: "Untouched",
                value: funnel.untouched,
                bg:
                  funnel.untouched > 0
                    ? "bg-rose-50/70 border-rose-200"
                    : "bg-slate-50 border-slate-100",
                text:
                  funnel.untouched > 0
                    ? "text-rose-900"
                    : "text-slate-700",
                sub:
                  funnel.untouched > 0
                    ? "text-rose-600 text-[11px]"
                    : "text-slate-500 text-[11px]",
                subtext: "Zero actions yet",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-lg p-3 border ${item.bg}`}
              >
                <div className="text-xs font-semibold uppercase text-slate-600">
                  {item.label}
                </div>
                <div className={`text-2xl font-bold mt-1 ${item.text}`}>
                  {item.value}
                </div>
                <div className={item.sub}>{item.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EMPLOYEE PERFORMANCE TABLE ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Employee Operational Performance Table
            </h2>
            <p className="text-xs text-slate-500">
              Click any row to inspect full timeline and order history
            </p>
          </div>
          <div className="text-xs text-slate-400">
            {employeeRows.length} employees
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wide">
                <th className="py-2.5 px-4">Employee</th>
                <th className="py-2.5 px-3 text-center">Assigned</th>
                <th className="py-2.5 px-3 text-center">Worked</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
                <th className="py-2.5 px-3 text-center">Completed</th>
                <th className="py-2.5 px-3 text-center">Closed</th>
                <th className="py-2.5 px-3 text-center">C.Delay</th>
                <th className="py-2.5 px-3 text-center">T.Delay</th>
                <th className="py-2.5 px-3 text-center">Hot</th>
                <th className="py-2.5 px-3 text-center">SLA %</th>
                <th className="py-2.5 px-4">Last Action</th>
                <th className="py-2.5 px-4">Last Active</th>
                <th className="py-2.5 px-3 text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={13} className="py-3 px-4">
                      <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : employeeRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="py-10 text-center text-slate-400 text-sm"
                  >
                    No employee activity recorded for this period.
                    <br />
                    <span className="text-xs">
                      Perform order actions to populate the dashboard.
                    </span>
                  </td>
                </tr>
              ) : (
                employeeRows.map((emp) => (
                  <tr
                    key={emp.employeeId}
                    onClick={() => setInspectEmployeeId(emp.employeeId)}
                    className="hover:bg-blue-50/40 cursor-pointer transition"
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex-shrink-0">
                          <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-[11px]">
                            {emp.employeeName.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white",
                              emp.status === "active"
                                ? "bg-emerald-500"
                                : emp.status === "away"
                                  ? "bg-amber-400"
                                  : "bg-slate-300",
                            )}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-[12px]">
                            {emp.employeeName}
                          </div>
                          <div className="text-[10px] text-slate-400 capitalize">
                            {emp.employeeRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                      {emp.assigned}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-blue-700">
                      {emp.worked}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {emp.actions}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-700">
                      {emp.completed}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">
                      {emp.closed}
                    </td>
                    <td className="py-2.5 px-3 text-center text-amber-700">
                      {emp.customerDelays}
                    </td>
                    <td className="py-2.5 px-3 text-center text-orange-700">
                      {emp.technicalDelays}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-rose-600">
                      {emp.hotOrders}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={cn(
                          "inline-block rounded px-1.5 py-0.5 text-[11px] font-bold",
                          emp.slaPercent >= 95
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : emp.slaPercent >= 80
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200",
                        )}
                      >
                        {emp.slaPercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div
                        className="text-slate-900 capitalize truncate max-w-[130px] text-[11px]"
                        title={emp.lastActionText}
                      >
                        {emp.lastActionText}
                      </div>
                      {emp.lastOrderCode && (
                        <div className="text-[10px] font-mono text-blue-600">
                          {emp.lastOrderCode}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            emp.status === "active"
                              ? "bg-emerald-500"
                              : emp.status === "away"
                                ? "bg-amber-400"
                                : "bg-slate-300",
                          )}
                        />
                        <span className="text-[11px] text-slate-600">
                          {emp.lastActiveAgo}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <ChevronRight className="h-4 w-4 text-slate-400 inline" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── HOURLY CHART + LIVE FEED ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hourly Actions Bar Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Actions by Hour
              </h3>
              <p className="text-xs text-slate-500">
                Distribution of operational events throughout the day
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600">24h</span>
          </div>
          <div className="h-44 flex items-end gap-1 pt-4 border-b border-slate-100">
            {charts?.hourlyActions?.map((pt: any, idx: number) => {
              const maxVal = Math.max(
                ...(charts?.hourlyActions?.map((p: any) => p.actions) || [1]),
                1,
              );
              const heightPct = Math.round((pt.actions / maxVal) * 100);
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      pt.actions > 0
                        ? "bg-blue-500 group-hover:bg-blue-600"
                        : "bg-slate-100",
                    )}
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  />
                  <div className="absolute -top-7 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10">
                    {pt.hour}: {pt.actions}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900">
                Live Activity Feed
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-Sync
            </span>
          </div>
          <div className="mt-2.5 flex-1 overflow-y-auto space-y-2 pr-0.5">
            {!liveFeed || liveFeed.length === 0 ? (
              <div className="text-xs text-slate-400 py-10 text-center">
                No recent actions logged
              </div>
            ) : (
              liveFeed.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 py-1.5 border-b border-slate-50 last:border-0"
                >
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700 flex-shrink-0 mt-0.5">
                    {(item.employeeName || "S").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-900 truncate">
                        {item.employeeName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-1">
                        {item.time}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 capitalize truncate">
                      {item.actionText}
                    </div>
                    {item.orderCode && (
                      <Link
                        to={`/admin/orders/${item.orderId}` as any}
                        className="inline-flex items-center gap-0.5 font-mono text-[10px] text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.orderCode}
                        <ExternalLink className="h-2 w-2" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── EMPLOYEE DETAIL DRAWER ── */}
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

/* ─────────────────────────────────────────────────────────────────── */
/*  KPI CARD                                                           */
/* ─────────────────────────────────────────────────────────────────── */

function KpiCard({
  label,
  value,
  trend,
  subtext,
  icon,
  dangerIfHigh,
}: {
  label: string;
  value: string | number;
  trend?: { percent: number; isUp: boolean };
  subtext: string;
  icon: React.ReactNode;
  dangerIfHigh?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          {label}
        </span>
        <div className="p-1 rounded-lg bg-slate-50">{icon}</div>
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {trend && trend.percent > 0 && (
          <span
            className={cn(
              "inline-flex items-center text-[10px] font-semibold",
              dangerIfHigh
                ? trend.isUp
                  ? "text-rose-600"
                  : "text-emerald-600"
                : trend.isUp
                  ? "text-emerald-600"
                  : "text-rose-600",
            )}
          >
            {trend.isUp ? (
              <TrendingUp className="h-3 w-3 mr-0.5" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-0.5" />
            )}
            {trend.percent}%
          </span>
        )}
      </div>
      <div className="mt-0.5 text-[10px] text-slate-400 truncate">
        {subtext}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  EMPLOYEE DETAIL DRAWER                                            */
/* ─────────────────────────────────────────────────────────────────── */

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
    queryKey: [
      "admin.performance.employee-detail",
      employeeId,
      dateFilter,
      customStart,
      customEnd,
    ],
    queryFn: () =>
      getDetailFn({
        data: { employeeId, dateFilter, customStart, customEnd },
      }),
  });

  const emp = data?.employee;
  const kpis = data?.kpiCards;
  const timeline = data?.timeline ?? [];
  const orderWorkList = data?.orderWorkList ?? [];

  const kpiItems = [
    { label: "Assigned", value: kpis?.assigned, color: "blue" },
    { label: "Worked", value: kpis?.worked, color: "indigo" },
    { label: "Actions", value: kpis?.actions, color: "slate" },
    { label: "Completed", value: kpis?.completed, color: "emerald" },
    { label: "Closed", value: kpis?.closed, color: "slate" },
    { label: "Cust Delays", value: kpis?.customerDelays, color: "amber" },
    { label: "Tech Delays", value: kpis?.technicalDelays, color: "orange" },
    { label: "Hot Orders", value: kpis?.hotOrders, color: "rose" },
    {
      label: "SLA %",
      value: kpis?.slaCompliance != null ? `${kpis.slaCompliance}%` : "—",
      color: (kpis?.slaCompliance ?? 100) >= 95 ? "emerald" : "amber",
    },
    { label: "SLA Breaches", value: kpis?.slaBreaches, color: "rose" },
  ] as const;

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100 text-blue-700 text-blue-900",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700 text-indigo-900",
    emerald:
      "bg-emerald-50 border-emerald-100 text-emerald-700 text-emerald-900",
    amber: "bg-amber-50 border-amber-100 text-amber-700 text-amber-900",
    orange: "bg-orange-50 border-orange-100 text-orange-700 text-orange-900",
    rose: "bg-rose-50 border-rose-100 text-rose-700 text-rose-900",
    slate: "bg-slate-50 border-slate-200 text-slate-600 text-slate-900",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base">
              {emp?.name?.charAt(0)?.toUpperCase() ?? "E"}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {emp?.name ?? "Loading..."}
              </h2>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Loading employee performance data...
            </div>
          ) : (
            <>
              {/* KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {kpiItems.map((item) => {
                  const colors = colorMap[item.color] || colorMap.slate;
                  const [bg, border, labelClr, valClr] = colors.split(" ");
                  return (
                    <div
                      key={item.label}
                      className={`p-3 rounded-xl border text-center ${bg} ${border}`}
                    >
                      <div
                        className={`text-[10px] font-semibold uppercase ${labelClr}`}
                      >
                        {item.label}
                      </div>
                      <div className={`text-2xl font-bold mt-1 ${valClr}`}>
                        {item.value ?? 0}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Avg first response */}
              {kpis?.avgFirstResponseMins != null && (
                <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-2.5 text-xs text-blue-800">
                  <span className="font-semibold">Avg First Response: </span>
                  {kpis.avgFirstResponseMins}m after assignment
                </div>
              )}

              {/* Order Work Breakdown Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-700">
                  Assigned Orders Work Breakdown ({orderWorkList.length})
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Order #</th>
                        <th className="py-2 px-3">Customer</th>
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-2 text-center">Actions</th>
                        <th className="py-2 px-3">Stage</th>
                        <th className="py-2 px-3">SLA</th>
                        <th className="py-2 px-3 text-right" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orderWorkList.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-5 text-center text-slate-400"
                          >
                            No orders assigned in this period.
                          </td>
                        </tr>
                      ) : (
                        orderWorkList.map((ord: any) => (
                          <tr
                            key={ord.orderId}
                            className="hover:bg-slate-50"
                          >
                            <td className="py-2 px-3 font-mono font-semibold text-blue-700">
                              {ord.orderNumber}
                              {ord.isHot && (
                                <span className="ml-1 rounded bg-rose-100 px-1 text-[9px] font-bold text-rose-700">
                                  HOT
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-slate-800">
                              {ord.customerName}
                            </td>
                            <td className="py-2 px-3 text-slate-600 max-w-[100px] truncate">
                              {ord.serviceName}
                            </td>
                            <td className="py-2 px-2 text-center font-bold text-slate-900">
                              {ord.totalActions}
                            </td>
                            <td className="py-2 px-3">
                              <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {ord.currentStage || "Received"}
                              </span>
                            </td>
                            <td className="py-2 px-3">
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
                            <td className="py-2 px-3 text-right">
                              <Link
                                to={`/admin/orders/${ord.orderId}` as any}
                                className="text-blue-600 hover:text-blue-800"
                                onClick={(e) => e.stopPropagation()}
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
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Chronological Activity Timeline
                </h3>
                <div className="relative pl-5 space-y-3.5 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-200 max-h-96 overflow-y-auto pr-1">
                  {timeline.length === 0 ? (
                    <div className="text-xs text-slate-400 py-4">
                      No logged activity in this timeframe.
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
                          <span className="font-semibold text-slate-900 capitalize">
                            {evt.actionLabel}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {evt.time}
                          </span>
                        </div>
                        {evt.notes && (
                          <div className="mt-0.5 text-xs text-slate-600">
                            {evt.notes}
                          </div>
                        )}
                        {(evt.previousStatus || evt.newStatus) && (
                          <div className="mt-0.5 text-[10px] text-slate-500">
                            {evt.previousStatus} → {evt.newStatus}
                          </div>
                        )}
                        {evt.orderCode && (
                          <Link
                            to={`/admin/orders/${evt.orderId}` as any}
                            className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {evt.orderCode}
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
