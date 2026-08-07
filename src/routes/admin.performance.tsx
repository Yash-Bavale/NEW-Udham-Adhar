import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPerformanceOverview } from "@/lib/crm/performance.functions";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { SectionCard, TableSkeleton } from "@/components/admin/ui";
import { formatIST } from "@/lib/datetime";

export const Route = createFileRoute("/admin/performance")({
  head: () => ({
    meta: [
      { title: "Employee Performance — Udyam Ops OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    // Lazy import keeps the auth SDK out of the bundle public visitors download.
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/admin-login" });
    const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role as string);
    if (!roles.includes("admin") && !roles.includes("super_admin")) {
      throw redirect({ to: "/admin/my-performance" });
    }
  },
  component: PerformancePage,
});

function PerformancePage() {
  const now = new Date();
  const [from, setFrom] = useState<Date | undefined>(new Date(now.getTime() - 30 * 24 * 3600 * 1000));
  const [to, setTo] = useState<Date | undefined>(now);
  const fn = useServerFn(getPerformanceOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["perf.overview", from?.toISOString(), to?.toISOString()],
    queryFn: () => fn({ data: { from: from?.toISOString(), to: to?.toISOString() } }),
  });

  const rows = data?.rows ?? [];
  const totals = data?.totals;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employee Performance</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            Contact activity, conversions and attribution per staff member.
          </p>
        </div>
        <DateRangePicker from={from} to={to} onChange={(r) => { setFrom(r.from); setTo(r.to); }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Leads (window)" value={totals?.leads ?? 0} />
        <Stat label="Contact events" value={totals?.contacts ?? 0} />
        <Stat label="Employee-handled" value={totals?.employeeHandled ?? 0} accent="var(--admin-success)" />
        <Stat label="System-paid" value={totals?.systemPaid ?? 0} accent="var(--admin-accent)" />
      </div>

      <SectionCard>
        <div className="p-5">
          {isLoading ? (
            <TableSkeleton rows={6} cols={8} />
          ) : rows.length === 0 ? (
            <div className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
              No staff activity in this window yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
                    <th className="py-2 pr-3">Employee</th>
                    <th className="py-2 pr-3 text-right">Leads</th>
                    <th className="py-2 pr-3 text-right">Contacted</th>
                    <th className="py-2 pr-3 text-right">Contacts</th>
                    <th className="py-2 pr-3 text-right">Avg response</th>
                    <th className="py-2 pr-3 text-right">Emp-handled</th>
                    <th className="py-2 pr-3 text-right">System</th>
                    <th className="py-2 pr-3 text-right">Conv rate</th>
                    <th className="py-2 pr-3 text-right">Unique/Repeat</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.userId} className="border-t" style={{ borderColor: "var(--admin-border)" }}>
                      <td className="py-2 pr-3">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                          {r.email} {r.role ? `• ${r.role}` : ""}
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-right">{r.leadsAssigned}</td>
                      <td className="py-2 pr-3 text-right">{r.leadsContacted}</td>
                      <td className="py-2 pr-3 text-right">{r.contactEvents}</td>
                      <td className="py-2 pr-3 text-right">
                        {r.avgResponseMinutes == null ? "—" : formatMinutes(r.avgResponseMinutes)}
                      </td>
                      <td className="py-2 pr-3 text-right">{r.conversionsEmployee}</td>
                      <td className="py-2 pr-3 text-right">{r.conversionsSystem}</td>
                      <td className="py-2 pr-3 text-right font-medium">{r.conversionRate}%</td>
                      <td className="py-2 pr-3 text-right">
                        {r.uniqueLeads}/{r.repeatLeads}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data && (
            <div className="mt-3 text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
              Window: {formatIST(data.fromIso, { dateOnly: true })} – {formatIST(data.toIso, { dateOnly: true })}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
    >
      <div className="text-xs uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold" style={{ color: accent ?? "var(--admin-fg)" }}>
        {value}
      </div>
    </div>
  );
}

function formatMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h < 24) return rem ? `${h}h ${rem}m` : `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}
