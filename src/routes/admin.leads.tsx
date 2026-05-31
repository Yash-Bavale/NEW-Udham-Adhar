import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { listLeads } from "@/lib/crm/leads-admin.functions";
import { LEAD_STATUSES } from "@/lib/crm/types";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

function LeadsPage() {
  const fn = useServerFn(listLeads);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin.leads", page, search, status],
    queryFn: () => fn({ data: { page, pageSize: 25, search: search || undefined, status: (status || undefined) as never } }),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>{data?.total ?? 0} total records</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--admin-fg-muted)" }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search code, name, email, mobile…"
            className="rounded-lg border pl-9 pr-3 py-2 text-sm w-80 outline-none focus:ring-2 transition-all"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <FilterChip active={status === ""} onClick={() => { setStatus(""); setPage(1); }}>All</FilterChip>
        {LEAD_STATUSES.map((s) => (
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
                  <th className="px-4 py-2.5 text-left font-medium">Lead ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium">Email / Mobile</th>
                  <th className="px-4 py-2.5 text-left font-medium">Service</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {data?.rows.map((l) => (
                  <tr key={l.id} className="border-t hover:bg-[var(--admin-surface-2)] transition-colors" style={{ borderColor: "var(--admin-border)" }}>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      <Link to="/admin/leads/$leadId" params={{ leadId: l.id }} className="font-medium hover:underline" style={{ color: "var(--admin-accent)" }}>
                        {l.lead_code}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 font-medium">{l.name}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <div>{l.email}</div>
                      <div style={{ color: "var(--admin-fg-muted)" }}>{l.mobile}</div>
                    </td>
                    <td className="px-4 py-2.5 text-xs max-w-[220px] truncate" style={{ color: "var(--admin-fg-muted)" }}>{l.service}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{new Date(l.created_at).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
                {data && data.rows.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>No leads found.</td></tr>
                )}
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
