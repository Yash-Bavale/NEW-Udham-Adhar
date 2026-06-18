import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ListChecks, AlertCircle, Calendar } from "lucide-react";
import { getOpsDashboard, type OpsDashboardData } from "@/lib/crm/ops-dashboard.functions";
import { SectionCard, FilterChip, TableSkeleton } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: TasksPage,
});

type TaskRow = {
  id: string;
  task: string;
  service: string | null;
  ref: string | null;
  priority: "high" | "medium" | "low";
  status: "overdue" | "today" | "upcoming";
  due: string;
  href: string;
};

type Filter = "all" | "overdue" | "today" | "upcoming";

function TasksPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const fn = useServerFn(getOpsDashboard);
  const { data, isLoading } = useQuery<OpsDashboardData>({
    queryKey: ["ops-dashboard"],
    queryFn: () => fn(),
    refetchInterval: 60_000,
  });

  const tasks = useMemo<TaskRow[]>(() => {
    if (!data) return [];
    const out: TaskRow[] = [];
    data.documentsPending.forEach((d) => {
      out.push({
        id: `doc-${d.id}`,
        task: `Collect missing documents (${d.missing_docs.length || "review"})`,
        service: d.service,
        ref: d.application_code,
        priority: d.missing_docs.length >= 3 ? "high" : "medium",
        status: "today",
        due: "Today",
        href: `/admin/applications/${d.id}`,
      });
    });
    data.complaintTracker.rows.forEach((c) => {
      const overdue = c.days_open >= 3;
      out.push({
        id: `cmp-${c.id}`,
        task: `Follow up on complaint (${c.days_open}d open)`,
        service: c.service,
        ref: c.complaint_number,
        priority: c.days_open >= 5 ? "high" : c.days_open >= 2 ? "medium" : "low",
        status: overdue ? "overdue" : "today",
        due: overdue ? `${c.days_open}d overdue` : "Today",
        href: `/admin/complaints/${c.id}`,
      });
    });
    return out;
  }, [data]);

  const filtered = tasks.filter((t) => filter === "all" || t.status === filter);

  const counts = {
    all: tasks.length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    today: tasks.filter((t) => t.status === "today").length,
    upcoming: tasks.filter((t) => t.status === "upcoming").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>Tasks</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>Auto-derived from open complaints and pending documents.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All ({counts.all})</FilterChip>
        <FilterChip active={filter === "overdue"} onClick={() => setFilter("overdue")}>Overdue ({counts.overdue})</FilterChip>
        <FilterChip active={filter === "today"} onClick={() => setFilter("today")}>Due Today ({counts.today})</FilterChip>
        <FilterChip active={filter === "upcoming"} onClick={() => setFilter("upcoming")}>Upcoming ({counts.upcoming})</FilterChip>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="px-4 py-2">Task</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Reference</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Due</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6}><TableSkeleton rows={5} cols={6} /></td></tr>}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-xs" style={{ color: "var(--admin-fg-muted)" }}>No tasks match this filter.</td></tr>
              )}
              {filtered.map((t, i) => {
                const rowBg = t.status === "overdue" ? "rgba(220, 38, 38, 0.06)" : t.status === "today" ? "rgba(217, 119, 6, 0.06)" : i % 2 ? "var(--admin-surface-2)" : "transparent";
                const pColor = t.priority === "high" ? "var(--admin-danger)" : t.priority === "medium" ? "var(--admin-warn)" : "var(--admin-fg-muted)";
                return (
                  <tr key={t.id} className="border-t" style={{ borderColor: "var(--admin-border)", background: rowBg }}>
                    <td className="px-4 py-2.5 flex items-center gap-2" style={{ color: "var(--admin-fg)" }}>
                      {t.status === "overdue" ? <AlertCircle className="size-3.5" style={{ color: "var(--admin-danger)" }} /> : <ListChecks className="size-3.5" style={{ color: "var(--admin-fg-muted)" }} />}
                      {t.task}
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{t.service ?? "—"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{t.ref ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: pColor }}>
                        <span className="size-1.5 rounded-full" style={{ background: pColor }} />
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: t.status === "overdue" ? "var(--admin-danger)" : "var(--admin-fg)" }}>
                      <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{t.due}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Link to={t.href} className="text-xs" style={{ color: "var(--admin-accent)" }}>Open →</Link>
                    </td>
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
