import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { listApplications, getApplicationCounts } from "@/lib/crm/applications.functions";
import { APPLICATION_STATUSES } from "@/lib/crm/types";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/applications")({ component: OrdersPage });

function OrdersPage() {
  const navigate = useNavigate();
  const listFn = useServerFn(listApplications);
  const countsFn = useServerFn(getApplicationCounts);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin.applications", page, status],
    queryFn: () => listFn({ data: { page, pageSize: 25, status: (status || undefined) as never } }),
  });

  const { data: countsData } = useQuery({
    queryKey: ["admin.applicationCounts"],
    queryFn: () => countsFn(),
  });
  const counts = countsData?.counts ?? {};

  const rows = useMemo(() => {
    const all = data?.rows ?? [];
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter((r: any) => {
      const lead = r.leads as any;
      return (
        r.application_code?.toLowerCase().includes(q) ||
        lead?.lead_code?.toLowerCase().includes(q) ||
        lead?.name?.toLowerCase().includes(q) ||
        lead?.email?.toLowerCase().includes(q) ||
        lead?.mobile?.toLowerCase().includes(q)
      );
    });
  }, [data, search]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
          {data?.total ?? 0} total orders
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <FilterChip active={status === ""} onClick={() => { setStatus(""); setPage(1); }}>
          All <span className="ml-1 opacity-60">({counts.all ?? 0})</span>
        </FilterChip>
        {APPLICATION_STATUSES.map((s) => (
          <FilterChip key={s} active={status === s} onClick={() => { setStatus(s); setPage(1); }}>
            {s.replace(/_/g, " ")} <span className="ml-1 opacity-60">({counts[s] ?? 0})</span>
          </FilterChip>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--admin-fg-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order/lead code, name, email, mobile…"
            className="rounded-lg border pl-9 pr-3 py-2 text-sm w-96 outline-none focus:ring-2"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          />
        </div>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          {isLoading ? <TableSkeleton rows={8} cols={6} /> : (
            <table className="w-full text-sm">
              <thead style={{ background: "var(--admin-surface-2)" }}>
                <tr className="text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="px-4 py-2.5 text-left font-medium">Order ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Lead</th>
                  <th className="px-4 py-2.5 text-left font-medium">Customer</th>
                  <th className="px-4 py-2.5 text-left font-medium">Service</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => {
                  const lead = r.leads as { lead_code?: string; name?: string; email?: string; service?: string } | null;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => navigate({ to: "/admin/applications/$applicationId", params: { applicationId: r.id } })}
                      className="border-t cursor-pointer hover:bg-[var(--admin-surface-2)]"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs font-medium" style={{ color: "var(--admin-accent)" }}>
                        {r.application_code}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs" onClick={(e) => e.stopPropagation()}>
                        <Link to="/admin/leads/$leadId" params={{ leadId: r.lead_id }} className="hover:underline" style={{ color: "var(--admin-accent)" }}>
                          {lead?.lead_code ?? r.lead_id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-medium">{lead?.name}</td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{lead?.service}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={r.application_status} /></td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{new Date(r.created_at).toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>No orders found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-between items-center text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
          <ChevronLeft className="size-4" /> Prev
        </button>
        <div style={{ color: "var(--admin-fg-muted)" }}>Page {page}</div>
        <button disabled={!data || data.rows.length < 25} onClick={() => setPage(page + 1)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
