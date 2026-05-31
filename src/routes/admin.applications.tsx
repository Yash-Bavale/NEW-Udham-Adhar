import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listApplications, updateApplication } from "@/lib/crm/applications.functions";
import { APPLICATION_STATUSES } from "@/lib/crm/types";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/applications")({ component: ApplicationsPage });

function ApplicationsPage() {
  const listFn = useServerFn(listApplications);
  const updateFn = useServerFn(updateApplication);
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin.applications", page, status],
    queryFn: () => listFn({ data: { page, pageSize: 25, status: (status || undefined) as never } }),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>Track and update application progress.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <FilterChip active={status === ""} onClick={() => { setStatus(""); setPage(1); }}>All</FilterChip>
        {APPLICATION_STATUSES.map((s) => (
          <FilterChip key={s} active={status === s} onClick={() => { setStatus(s); setPage(1); }}>
            {s.replace(/_/g, " ")}
          </FilterChip>
        ))}
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          {isLoading ? <TableSkeleton rows={8} cols={6} /> : (
            <table className="w-full text-sm">
              <thead style={{ background: "var(--admin-surface-2)" }}>
                <tr className="text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="px-4 py-2.5 text-left font-medium">App ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Lead</th>
                  <th className="px-4 py-2.5 text-left font-medium">Customer</th>
                  <th className="px-4 py-2.5 text-left font-medium">Service</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {data?.rows.map((r) => {
                  const lead = r.leads as { lead_code?: string; name?: string; email?: string; service?: string } | null;
                  return (
                    <tr key={r.id} className="border-t hover:bg-[var(--admin-surface-2)] transition-colors" style={{ borderColor: "var(--admin-border)" }}>
                      <td className="px-4 py-2.5 font-mono text-xs font-medium">{r.application_code}</td>
                      <td className="px-4 py-2.5 font-mono text-xs">
                        <Link to="/admin/leads/$leadId" params={{ leadId: r.lead_id }} className="hover:underline" style={{ color: "var(--admin-accent)" }}>
                          {lead?.lead_code ?? r.lead_id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-medium">{lead?.name}</td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{lead?.service}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={r.application_status} />
                          <select
                            value={r.application_status}
                            onChange={async (e) => {
                              await updateFn({ data: { id: r.id, application_status: e.target.value as never } });
                              await qc.invalidateQueries({ queryKey: ["admin.applications"] });
                            }}
                            className="rounded border px-1.5 py-0.5 text-[11px]"
                            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
                          >
                            {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{new Date(r.created_at).toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-between items-center text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)] transition-colors" style={{ borderColor: "var(--admin-border)" }}>
          <ChevronLeft className="size-4" /> Prev
        </button>
        <div style={{ color: "var(--admin-fg-muted)" }}>Page {page}</div>
        <button disabled={!data || data.rows.length < 25} onClick={() => setPage(page + 1)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)] transition-colors" style={{ borderColor: "var(--admin-border)" }}>
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
