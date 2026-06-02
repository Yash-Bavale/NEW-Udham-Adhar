import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, CheckCircle2, Clock, Activity as ActivityIcon, Wallet, UserCheck, AlertTriangle } from "lucide-react";
import { getDashboardStats } from "@/lib/crm/dashboard.functions";
import { getFunnelStats } from "@/lib/analytics/funnel.functions";
import { StatCard, SectionCard, TableSkeleton, StatusBadge, Timeline } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/dashboard")({ component: DashboardPage });

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

function DashboardPage() {
  const fn = useServerFn(getDashboardStats);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin.dashboard"], queryFn: () => fn() });
  const funnelFn = useServerFn(getFunnelStats);
  const { data: funnel, isLoading: funnelLoading } = useQuery({ queryKey: ["admin.funnel"], queryFn: () => funnelFn() });

  if (error) return <div className="text-sm text-red-700">{(error as Error).message}</div>;

  const totals = data?.totals;
  const trend = data?.trend ?? [];
  const currentUser = data?.currentUser;
  const repeatCount = (totals?.totalLeads ?? 0) - (totals?.uniqueCustomers ?? 0);
  const showRoleBanner = !isLoading && data && currentUser && !currentUser.hasStaffRole;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>Overview of leads, applications and revenue activity.</p>
      </div>

      {showRoleBanner && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold">No staff role assigned to your account.</div>
            <div className="text-xs mt-1">
              You're signed in, but you don't have any of <code>admin / super_admin / operations / support / accounts / finance</code>.
              Row-Level Security will hide leads, payments, and applications from you. Ask an existing admin to add a role in <strong>Admin → Users</strong>, or run a database insert into <code>public.user_roles</code>.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard index={0} label="Total Leads" value={totals?.totalLeads ?? 0} icon={<Users className="size-4" />} gradient="primary" loading={isLoading} />
        <StatCard
          index={1}
          label="Unique Customers"
          value={totals?.uniqueCustomers ?? 0}
          icon={<UserCheck className="size-4" />}
          gradient="primary"
          loading={isLoading}
          hint={repeatCount > 0 ? `${repeatCount} repeat lead${repeatCount === 1 ? "" : "s"}` : "no repeats"}
        />
        <StatCard index={2} label="Today" value={totals?.todayLeads ?? 0} icon={<TrendingUp className="size-4" />} gradient="success" loading={isLoading} />
        <StatCard index={3} label="This Week" value={totals?.weekLeads ?? 0} icon={<ActivityIcon className="size-4" />} gradient="primary" loading={isLoading} />
        <StatCard index={4} label="In Progress" value={totals?.inProgress ?? 0} icon={<Clock className="size-4" />} gradient="warn" loading={isLoading} />
        <StatCard index={5} label="Completed" value={totals?.completed ?? 0} icon={<CheckCircle2 className="size-4" />} gradient="success" loading={isLoading} />
        <StatCard index={6} label="Pending" value={totals?.pending ?? 0} icon={<Wallet className="size-4" />} gradient="danger" loading={isLoading} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <SectionCard title="Lead Trend (30d)" className="lg:col-span-2">
          <div className="h-64 px-2 pt-2 pb-3">
            {isLoading || trend.length === 0 ? (
              <div className="h-full w-full animate-pulse rounded" style={{ background: "var(--admin-surface-2)" }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#leadFill)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Lead Status">
          <div className="h-64 flex items-center justify-center p-2">
            {isLoading || !data ? (
              <div className="h-full w-full animate-pulse rounded" style={{ background: "var(--admin-surface-2)" }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.statusDistribution.slice(0, 6)} dataKey="value" nameKey="label" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {data.statusDistribution.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="Latest Leads" action={<Link to="/admin/leads" className="text-xs font-medium hover:underline" style={{ color: "var(--admin-accent)" }}>View all →</Link>}>
          {isLoading ? <TableSkeleton rows={5} cols={4} /> : (
            <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {data?.recentLeads.map((l) => (
                <li key={l.id} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--admin-surface-2)] transition-colors">
                  <span className="font-mono text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>{l.lead_code}</span>
                  <span className="flex-1 truncate font-medium">{l.name}</span>
                  <span className="hidden md:block text-xs truncate max-w-[160px]" style={{ color: "var(--admin-fg-muted)" }}>{l.service}</span>
                  <StatusBadge status={l.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent Activity" action={<Link to="/admin/activity" className="text-xs font-medium hover:underline" style={{ color: "var(--admin-accent)" }}>View all →</Link>}>
          <div className="p-4">
            {isLoading ? <TableSkeleton rows={5} cols={2} /> : (
              <Timeline items={(data?.recentActivity ?? []).slice(0, 6).map((a) => ({
                id: a.id, time: a.created_at, type: a.activity_type, description: a.activity_description,
              }))} />
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title={`Conversion Funnel (last ${funnel?.windowDays ?? 30}d, unique sessions)`}>
        <div className="p-4 space-y-3">
          {funnelLoading || !funnel ? (
            <TableSkeleton rows={6} cols={1} />
          ) : (
            funnel.steps.map((s, i) => {
              const prev = i > 0 ? funnel.steps[i - 1].count : s.count;
              const dropoff = prev > 0 ? Math.max(0, Math.round(((prev - s.count) / prev) * 100)) : 0;
              return (
                <div key={s.key} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold" style={{ background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}>{i + 1}</span>
                      {s.label}
                    </span>
                    <span className="tabular-nums" style={{ color: "var(--admin-fg-muted)" }}>
                      {s.count} {i > 0 && <span className="text-red-500 ml-2">−{dropoff}%</span>}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--admin-surface-2)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: "var(--gradient-admin)" }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SectionCard>

      <SectionCard title="Top Services">
        <div className="p-4 space-y-2">
          {isLoading ? <TableSkeleton rows={4} cols={1} /> : (() => {
            const rows = data?.serviceDistribution ?? [];
            const max = Math.max(1, ...rows.map((r) => r.value));
            return rows.slice(0, 8).map((r) => (
              <div key={r.label} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className="truncate font-medium">{r.label}</span>
                  <span className="tabular-nums" style={{ color: "var(--admin-fg-muted)" }}>{r.value}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--admin-surface-2)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(r.value / max) * 100}%`, background: "var(--gradient-admin)" }} />
                </div>
              </div>
            ));
          })()}
        </div>
      </SectionCard>
    </div>
  );
}
