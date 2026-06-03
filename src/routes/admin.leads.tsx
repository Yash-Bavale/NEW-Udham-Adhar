import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { listLeads } from "@/lib/crm/leads-admin.functions";
import { LEAD_STATUSES } from "@/lib/crm/types";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";
import { LeadsBulkBar } from "@/components/admin/LeadsBulkBar";
import { SavedFiltersMenu } from "@/components/admin/SavedFiltersMenu";
import {
  bulkUpdateLeadStatus, bulkAssignLeads, bulkDeleteLeads, exportLeadsCsv,
} from "@/lib/crm/leads-bulk.functions";
import { listSavedFilters, type FilterJson } from "@/lib/crm/saved-filters.functions";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

function LeadsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listLeads);
  const exportFn = useServerFn(exportLeadsCsv);
  const statusFn = useServerFn(bulkUpdateLeadStatus);
  const assignFn = useServerFn(bulkAssignLeads);
  const deleteFn = useServerFn(bulkDeleteLeads);
  const savedFn = useServerFn(listSavedFilters);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [defaultApplied, setDefaultApplied] = useState(false);

  // Apply default saved filter on first load.
  const { data: savedData } = useQuery({ queryKey: ["admin.savedFilters"], queryFn: () => savedFn() });
  useEffect(() => {
    if (defaultApplied || !savedData) return;
    const def = savedData.rows.find((r) => r.is_default);
    if (def) {
      const f = def.filter_json as FilterJson;
      setSearch(f.search ?? "");
      setStatus(f.status ?? "");
    }
    setDefaultApplied(true);
  }, [savedData, defaultApplied]);

  const filter: FilterJson = useMemo(() => ({
    search: search || undefined,
    status: status || undefined,
  }), [search, status]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.leads", page, search, status],
    queryFn: () => listFn({ data: { page, pageSize: 25, search: search || undefined, status: (status || undefined) as never } }),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin.leads"] });
  const clearSel = () => setSelected(new Set());

  const allOnPage = (data?.rows ?? []).map((l: any) => l.id);
  const allSelected = allOnPage.length > 0 && allOnPage.every((id: string) => selected.has(id));

  const handleExport = async () => {
    setBusy(true);
    try {
      const res = await exportFn({ data: filter });
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "");
      a.href = url; a.download = `leads_${stamp}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally { setBusy(false); }
  };

  const handleBulkStatus = async (s: string) => {
    setBusy(true);
    try {
      await statusFn({ data: { ids: Array.from(selected), status: s as never } });
      clearSel(); refresh();
    } finally { setBusy(false); }
  };
  const handleBulkAssign = async (assignee: string | null) => {
    setBusy(true);
    try {
      await assignFn({ data: { ids: Array.from(selected), assignee } });
      clearSel(); refresh();
    } finally { setBusy(false); }
  };
  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    const typed = prompt(`Type DELETE to confirm permanent deletion of ${ids.length} lead(s).\nLeads with payments will be skipped.`);
    if (typed !== "DELETE") return;
    setBusy(true);
    try {
      const res = await deleteFn({ data: { ids } });
      alert(`Deleted ${res.deleted}, skipped ${res.blocked} (have payments).`);
      clearSel(); refresh();
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>{data?.total ?? 0} total records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-[var(--admin-surface-2)] disabled:opacity-50"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          >
            <Download className="size-4" /> Export CSV
          </button>
          <SavedFiltersMenu
            currentFilter={filter}
            onApply={(f) => {
              setSearch(f.search ?? "");
              setStatus(f.status ?? "");
              setPage(1);
            }}
          />
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
          {isLoading ? <TableSkeleton rows={8} cols={7} /> : (
            <table className="w-full text-sm">
              <thead style={{ background: "var(--admin-surface-2)" }}>
                <tr className="text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="px-3 py-2.5 w-8">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => {
                        const next = new Set(selected);
                        if (allSelected) allOnPage.forEach((id: string) => next.delete(id));
                        else allOnPage.forEach((id: string) => next.add(id));
                        setSelected(next);
                      }}
                    />
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium">Lead ID</th>
                  <th className="px-4 py-2.5 text-left font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium">Email / Mobile</th>
                  <th className="px-4 py-2.5 text-left font-medium">Service</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {data?.rows.map((l) => {
                  const checked = selected.has(l.id);
                  return (
                    <tr key={l.id} className={`border-t hover:bg-[var(--admin-surface-2)] transition-colors ${checked ? "bg-[var(--admin-surface-2)]" : ""}`} style={{ borderColor: "var(--admin-border)" }}>
                      <td className="px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = new Set(selected);
                            if (checked) next.delete(l.id); else next.add(l.id);
                            setSelected(next);
                          }}
                        />
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">
                        <Link to="/admin/leads/$leadId" params={{ leadId: l.id }} className="font-medium hover:underline" style={{ color: "var(--admin-accent)" }}>
                          {l.lead_code}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{l.name}</span>
                          {(l as { is_repeat?: boolean }).is_repeat && (
                            <span
                              className="text-[10px] font-semibold uppercase rounded px-1.5 py-0.5"
                              style={{ background: "var(--admin-surface-2)", color: "var(--admin-accent)" }}
                              title="This email has multiple leads"
                            >
                              Repeat
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        <div>{l.email}</div>
                        <div style={{ color: "var(--admin-fg-muted)" }}>{l.mobile}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs max-w-[220px] truncate" style={{ color: "var(--admin-fg-muted)" }}>{l.service}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={l.status} /></td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{new Date(l.created_at).toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
                {data && data.rows.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>No leads found.</td></tr>
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

      <LeadsBulkBar
        selectedIds={Array.from(selected)}
        onClear={clearSel}
        onStatus={handleBulkStatus}
        onAssign={handleBulkAssign}
        onDelete={handleBulkDelete}
        busy={busy}
      />
    </div>
  );
}
