import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { getOpsDashboard, type OpsDashboardData } from "@/lib/crm/ops-dashboard.functions";
import { SectionCard, TableSkeleton } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ReportsPage,
});

type Range = "7d" | "30d" | "90d";
const RANGE_LABEL: Record<Range, string> = { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" };

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}
function fmtN(n: number) {
  return new Intl.NumberFormat("en-IN").format(n || 0);
}

function ReportsPage() {
  const [range, setRange] = useState<Range>("30d");
  const fn = useServerFn(getOpsDashboard);
  const { data, isLoading } = useQuery<OpsDashboardData>({
    queryKey: ["ops-dashboard"],
    queryFn: () => fn(),
    refetchInterval: 60_000,
  });

  const kpis = data?.kpis;
  const winKey = range === "7d" ? "week" : "month";

  const dailyCards = [
    { label: "New Leads", value: fmtN(kpis?.allLeads[winKey] ?? 0) },
    { label: "New Orders", value: fmtN(kpis?.newOrders[winKey] ?? 0) },
    { label: "Revenue", value: fmtINR(kpis?.totalSale[winKey] ?? 0) },
    { label: "Pending Cases", value: fmtN(kpis?.pendingOrders.count ?? 0) },
  ];

  const revenueSeries = useMemo(() => {
    if (!data) return [];
    return range === "7d" ? data.revenue.weekly : data.revenue.monthly;
  }, [data, range]);

  // Lead conversion funnel: total leads → converted (paid) → completed
  const funnel = useMemo(() => {
    const total = kpis?.allLeads.total ?? 0;
    const notConverted = kpis?.notConvertedLeads.total ?? 0;
    const converted = Math.max(0, total - notConverted);
    const completed = kpis?.ordersCompleted.total ?? 0;
    return [
      { stage: "Total Leads", value: total },
      { stage: "Converted", value: converted },
      { stage: "Completed", value: completed },
    ];
  }, [kpis]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>Reports</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>Daily metrics and monthly performance.</p>
        </div>
        <div className="inline-flex rounded-md border p-0.5" style={{ borderColor: "var(--admin-border)" }}>
          {(["7d", "30d", "90d"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1 text-xs rounded"
              style={{
                background: range === r ? "var(--admin-primary)" : "transparent",
                color: range === r ? "#fff" : "var(--admin-fg-muted)",
                fontWeight: range === r ? 500 : 400,
              }}
            >
              {RANGE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Daily KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {dailyCards.map((c) => (
          <div key={c.label} className="rounded-lg border p-4" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <div className="text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--admin-fg-muted)" }}>{c.label}</div>
            {isLoading ? (
              <div className="mt-2 h-7 w-24 animate-pulse rounded" style={{ background: "var(--admin-surface-2)" }} />
            ) : (
              <div className="mt-1 text-2xl font-medium tabular-nums" style={{ color: "var(--admin-fg)" }}>{c.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <SectionCard title={`Revenue — ${RANGE_LABEL[range]}`}>
        <div className="p-4 h-72">
          {isLoading ? <TableSkeleton rows={6} cols={4} /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmtINR(v)} />
                <Bar dataKey="total" fill="var(--admin-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </SectionCard>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Service revenue */}
        <SectionCard title="Service-wise Revenue">
          <div className="p-4 h-64">
            {isLoading ? <TableSkeleton rows={5} cols={2} /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.kpis.totalSale.byService ?? []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="label" type="category" tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} width={120} />
                  <Tooltip formatter={(v: number) => fmtINR(v)} />
                  <Bar dataKey="value" fill="var(--admin-accent)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        {/* Lead conversion funnel */}
        <SectionCard title="Lead Conversion Funnel">
          <div className="p-4 space-y-3">
            {funnel.map((f) => {
              const max = funnel[0].value || 1;
              const pct = Math.round((f.value / max) * 100);
              return (
                <div key={f.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--admin-fg)" }}>{f.stage}</span>
                    <span className="tabular-nums" style={{ color: "var(--admin-fg-muted)" }}>
                      {fmtN(f.value)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full" style={{ background: "var(--admin-surface-2)" }}>
                    <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: "var(--admin-primary)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Employee Performance */}
      <SectionCard title="Employee Performance">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2 text-right">Handled</th>
                <th className="px-4 py-2 text-right">Completed</th>
                <th className="px-4 py-2 text-right">Pending</th>
                <th className="px-4 py-2 text-right">Completion %</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={5} className="px-4 py-6 text-center text-xs" style={{ color: "var(--admin-fg-muted)" }}>Loading…</td></tr>}
              {!isLoading && (data?.staffPerformance.length ?? 0) === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-xs" style={{ color: "var(--admin-fg-muted)" }}>No assigned applications yet.</td></tr>
              )}
              {data?.staffPerformance.map((s, i) => {
                const pct = s.handled > 0 ? Math.round((s.completed / s.handled) * 100) : 0;
                return (
                  <tr key={s.user_id} className="border-t" style={{ borderColor: "var(--admin-border)", background: i % 2 ? "var(--admin-surface-2)" : "transparent" }}>
                    <td className="px-4 py-2" style={{ color: "var(--admin-fg)" }}>{s.name}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{fmtN(s.handled)}</td>
                    <td className="px-4 py-2 text-right tabular-nums" style={{ color: "var(--admin-success)" }}>{fmtN(s.completed)}</td>
                    <td className="px-4 py-2 text-right tabular-nums" style={{ color: "var(--admin-warn)" }}>{fmtN(s.pending)}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
