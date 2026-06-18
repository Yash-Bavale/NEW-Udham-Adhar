import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { UserCog, Shield } from "lucide-react";
import { listStaffUsers } from "@/lib/crm/users-admin.functions";
import { getOpsDashboard, type OpsDashboardData } from "@/lib/crm/ops-dashboard.functions";
import { SectionCard } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Employees — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: EmployeesPage,
});

const ROLE_COLORS: Record<string, string> = {
  super_admin: "var(--admin-danger)",
  admin: "var(--admin-primary)",
  manager: "var(--admin-accent)",
  operations: "var(--admin-info)",
  support: "var(--admin-warn)",
  accounts: "var(--admin-success)",
};

function EmployeesPage() {
  const listFn = useServerFn(listStaffUsers);
  const dashFn = useServerFn(getOpsDashboard);
  const { data: users, isLoading } = useQuery({ queryKey: ["admin.users"], queryFn: () => listFn() });
  const { data: dash } = useQuery<OpsDashboardData>({ queryKey: ["ops-dashboard"], queryFn: () => dashFn() });

  const perfMap = useMemo(() => {
    const m = new Map<string, { handled: number; completed: number; pending: number }>();
    dash?.staffPerformance.forEach((s) => m.set(s.user_id, { handled: s.handled, completed: s.completed, pending: s.pending }));
    return m;
  }, [dash]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>Employees</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>Staff directory with role badges and performance summary.</p>
        </div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs rounded-md border px-3 py-1.5"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
        >
          <Shield className="size-3.5" /> Manage roles
        </Link>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="px-4 py-2">Name / Email</th>
                <th className="px-4 py-2">Roles</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Handled</th>
                <th className="px-4 py-2 text-right">Completed</th>
                <th className="px-4 py-2 text-right">Pending</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-center text-xs" style={{ color: "var(--admin-fg-muted)" }}>Loading…</td></tr>}
              {users?.rows.map((u, i) => {
                const perf = perfMap.get(u.id) ?? { handled: 0, completed: 0, pending: 0 };
                const active = u.roles.length > 0;
                return (
                  <tr key={u.id} className="border-t" style={{ borderColor: "var(--admin-border)", background: i % 2 ? "var(--admin-surface-2)" : "transparent" }}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: "var(--admin-primary)", color: "#fff" }}>
                          {(u.email || "U").slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm" style={{ color: "var(--admin-fg)" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 && <span className="text-xs" style={{ color: "var(--admin-fg-subtle)" }}>— no role —</span>}
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium"
                            style={{ background: "var(--admin-surface-2)", color: ROLE_COLORS[r] ?? "var(--admin-fg)" }}
                          >
                            <span className="size-1.5 rounded-full" style={{ background: ROLE_COLORS[r] ?? "var(--admin-fg-muted)" }} />
                            {r.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: active ? "var(--admin-success)" : "var(--admin-fg-muted)" }}>
                        <span className="size-1.5 rounded-full" style={{ background: active ? "var(--admin-success)" : "var(--admin-fg-subtle)" }} />
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{perf.handled}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums" style={{ color: "var(--admin-success)" }}>{perf.completed}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums" style={{ color: "var(--admin-warn)" }}>{perf.pending}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="rounded-md border-l-4 p-3 text-xs" style={{ borderLeftColor: "var(--admin-info)", background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}>
        <UserCog className="inline size-3.5 mr-1.5 align-text-bottom" />
        Performance counts are derived from <code>applications.assigned_to</code>. Use Manage roles to grant or revoke access.
      </div>
    </div>
  );
}
