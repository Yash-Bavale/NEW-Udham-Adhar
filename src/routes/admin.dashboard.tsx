import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/crm/dashboard.functions";

export const Route = createFileRoute("/admin/dashboard")({ component: DashboardPage });

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value.toLocaleString("en-IN")}</div>
    </div>
  );
}

function DashboardPage() {
  const fn = useServerFn(getDashboardStats);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin.dashboard"], queryFn: () => fn() });

  if (isLoading) return <div className="text-sm text-slate-500">Loading…</div>;
  if (error) return <div className="text-sm text-red-700">{(error as Error).message}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat label="Total Leads" value={data.totals.totalLeads} />
        <Stat label="Today" value={data.totals.todayLeads} />
        <Stat label="This Week" value={data.totals.weekLeads} />
        <Stat label="In Progress" value={data.totals.inProgress} />
        <Stat label="Completed" value={data.totals.completed} />
        <Stat label="Pending" value={data.totals.pending} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-white">
          <div className="px-4 py-3 border-b text-sm font-semibold">Latest Leads</div>
          <table className="w-full text-sm">
            <tbody>
              {data.recentLeads.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-mono text-xs">{l.lead_code}</td>
                  <td className="px-4 py-2">{l.name}</td>
                  <td className="px-4 py-2 text-slate-500 truncate max-w-[180px]">{l.service}</td>
                  <td className="px-4 py-2 text-xs">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border bg-white">
          <div className="px-4 py-3 border-b text-sm font-semibold">Recent Activity</div>
          <ul className="divide-y">
            {data.recentActivity.map((a) => (
              <li key={a.id} className="px-4 py-2 text-sm">
                <div className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString("en-IN")}</div>
                <div>{a.activity_description}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Distribution title="Lead Status" rows={data.statusDistribution} />
        <Distribution title="Services" rows={data.serviceDistribution} />
      </div>
    </div>
  );
}

function Distribution({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm font-semibold mb-3">{title}</div>
      <div className="space-y-2">
        {rows.slice(0, 10).map((r) => (
          <div key={r.label} className="text-xs">
            <div className="flex justify-between mb-0.5">
              <span className="truncate">{r.label}</span>
              <span className="font-medium">{r.value}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded">
              <div className="h-full bg-slate-700 rounded" style={{ width: `${(r.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
