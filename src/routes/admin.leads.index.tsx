import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download, Plus, X, ExternalLink, Calendar, Users as UsersIcon } from "lucide-react";
import { formatIST, istDateKey, istDayLabel } from "@/lib/datetime";
import { toast } from "sonner";
import {
  listLeads, listStaff, addLead, getLeadCounts, getLead, findLeadByCodeOrId,
  getLeadSourceBreakdown, type SourceBreakdown,
} from "@/lib/crm/leads-admin.functions";
import { listServices } from "@/lib/crm/services-admin.functions";
import { listWebsiteTree } from "@/lib/crm/websites-admin.functions";
import { fromBase, fromTotal } from "@/lib/pricing/gst";
import { LEAD_STATUSES } from "@/lib/crm/types";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";
import { LeadsBulkBar } from "@/components/admin/LeadsBulkBar";
import { SavedFiltersMenu } from "@/components/admin/SavedFiltersMenu";
import { ConfirmModal } from "@/components/admin/primitives/ConfirmModal";
import {
  bulkUpdateLeadStatus, bulkAssignLeads, bulkDeleteLeads, exportLeadsCsv,
} from "@/lib/crm/leads-bulk.functions";
import { listSavedFilters, type FilterJson } from "@/lib/crm/saved-filters.functions";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INDIAN_STATES } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
import { formatLeadSource } from "@/lib/crm/format-lead-source";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

function formatAge(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "just now";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}


export const Route = createFileRoute("/admin/leads/")({ component: LeadsPage });

function LeadsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const listFn = useServerFn(listLeads);
  const countsFn = useServerFn(getLeadCounts);
  const exportFn = useServerFn(exportLeadsCsv);
  const statusFn = useServerFn(bulkUpdateLeadStatus);
  const assignFn = useServerFn(bulkAssignLeads);
  const deleteFn = useServerFn(bulkDeleteLeads);
  const savedFn = useServerFn(listSavedFilters);
  const staffFn = useServerFn(listStaff);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [defaultApplied, setDefaultApplied] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const role = useRole();

  // Hydrate filters from URL query params (deep-links from dashboard KPIs).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const st = sp.get("status");
    const flt = sp.get("filter");
    if (st && LEAD_STATUSES.includes(st as never)) { setStatus(st); setDefaultApplied(true); return; }
    if (flt === "not_contacted") { setStatus("new_lead"); setDefaultApplied(true); }
    else if (flt === "converted") { setStatus("payment_successful"); setDefaultApplied(true); }
    else if (flt === "contacted") { setStatus("contacted"); setDefaultApplied(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce the search input → committed `search` (300ms).
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? "";
      setCurrentUserId(uid);
      if (role.hasAny(["super_admin", "admin"])) {
        setAssignee("");
      } else if (uid && !defaultApplied) {
        setAssignee(uid);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role.roles.join(",")]);
  const servicesFn = useServerFn(listServices);
  const { data: servicesData } = useQuery({ queryKey: ["admin.services"], queryFn: () => servicesFn() });

  const sourceBreakdownFn = useServerFn(getLeadSourceBreakdown);
  const { data: sourceData } = useQuery<SourceBreakdown>({
    queryKey: ["admin.leads.sourceBreakdown"],
    queryFn: () => sourceBreakdownFn(),
    staleTime: 60_000,
  });

  const { data: savedData } = useQuery({ queryKey: ["admin.savedFilters"], queryFn: () => savedFn() });
  useEffect(() => {
    if (defaultApplied || !savedData) return;
    const def = savedData.rows.find((r) => r.is_default);
    if (def) {
      const f = def.filter_json as FilterJson;
      setSearchInput(f.search ?? "");
      setSearch(f.search ?? "");
      setStatus(f.status ?? "");
    }
    setDefaultApplied(true);
  }, [savedData, defaultApplied]);

  const { data: countsData } = useQuery({
    queryKey: ["admin.leadCounts"],
    queryFn: () => countsFn(),
  });
  const { data: staffData } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn(),
  });

  const filter: FilterJson = useMemo(() => ({
    search: search || undefined,
    status: status || undefined,
  }), [search, status]);

  // Live ticker to update relative age timing ("lead arrived since") every 15s
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.leads", page, search, status, source, assignee, service, dateFrom, dateTo],
    queryFn: () => listFn({ data: {
      page, pageSize: 25,
      search: search || undefined,
      status: (status || undefined) as never,
      source: source || undefined,
      service: service || undefined,
      assignee: assignee || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    } }),
    refetchInterval: 60_000,
  });

  // All filtering happens server-side now (C3).
  const rows = data?.rows ?? [];

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.leads"] });
    qc.invalidateQueries({ queryKey: ["admin.leadCounts"] });
  };

  // Realtime: auto-refresh the leads list whenever any lead row changes.
  useRealtimeTable("leads", refresh);
  const clearSel = () => setSelected(new Set());

  const allOnPage = rows.map((l: any) => l.id);
  const allSelected = allOnPage.length > 0 && allOnPage.every((id: string) => selected.has(id));

  const counts = countsData?.counts ?? {};

  const handleBulkStatus = async (s: string) => {
    setBusy(true);
    try {
      await statusFn({ data: { ids: Array.from(selected), status: s as never } });
      clearSel(); refresh();
    } finally { setBusy(false); }
  };
  const handleBulkAssign = async (a: string | null) => {
    setBusy(true);
    try {
      await assignFn({ data: { ids: Array.from(selected), assignee: a } });
      clearSel(); refresh();
    } finally { setBusy(false); }
  };
  const handleBulkDelete = () => setConfirmDeleteOpen(true);
  const performBulkDelete = async () => {
    setBusy(true);
    try {
      const res = await deleteFn({ data: { ids: Array.from(selected) } });
      toast.success(`Deleted ${res.deleted} lead(s)${res.blocked ? ` — skipped ${res.blocked} with payments` : ""}.`);
      clearSel(); refresh();
      setConfirmDeleteOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Bulk delete failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5 pb-24">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
          {data?.total ?? 0} total records
        </p>
      </div>

      {/* Status pills with counts */}
      <div className="flex gap-2 flex-wrap">
        <FilterChip active={status === "" && !assignee} onClick={() => { setStatus(""); setAssignee(""); setPage(1); }}>
          All <span className="ml-1 opacity-60">({counts.all ?? 0})</span>
        </FilterChip>
        {currentUserId && role.hasAny(["super_admin", "admin"]) && (
          <FilterChip
            active={assignee === currentUserId}
            onClick={() => { setAssignee(assignee === currentUserId ? "" : currentUserId); setPage(1); }}
          >
            My Leads
          </FilterChip>
        )}
        {LEAD_STATUSES.map((s) => (
          <FilterChip key={s} active={status === s} onClick={() => { setStatus(s); setPage(1); }}>
            {s.replace(/_/g, " ")} <span className="ml-1 opacity-60">({counts[s] ?? 0})</span>
          </FilterChip>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--admin-fg-muted)" }} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search code, name, email, mobile…"
            className="rounded-lg border pl-9 pr-3 py-2 text-sm w-80 outline-none focus:ring-2"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          />
        </div>
        <select
          value={source}
          onChange={(e) => { setSource(e.target.value); setPage(1); expandedChannel && setExpandedChannel(null); }}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
        >
          <option value="">All sources</option>
          {/* Dynamic channels from DB */}
          {(sourceData?.channels ?? []).map((ch) => (
            <option key={ch.key} value={`__channel:${ch.key}`}>
              {ch.icon} {ch.label} ({ch.count})
            </option>
          ))}
          <optgroup label="── Specific sources ──">
            {(sourceData?.items ?? []).map((item) => (
              <option key={item.value} value={item.value}>
                {item.label} ({item.count})
              </option>
            ))}
          </optgroup>
        </select>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm max-w-[220px]"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
        >
          <option value="">All services</option>
          {servicesData?.rows.map((s: any) => (
            <option key={s.id} value={s.service_name}>{s.service_name}</option>
          ))}
        </select>
        {role.hasAny(["super_admin", "admin"]) && (
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          >
            <option value="">All assignees</option>
            <option value="__unassigned">Unassigned</option>
            {staffData?.profiles.map((p: any) => (
              <option key={p.id} value={p.id}>{p.display_name || p.email}</option>
            ))}
          </select>
        )}
        <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
          <Calendar className="size-3.5" style={{ color: "var(--admin-fg-muted)" }} />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-transparent outline-none text-xs"
            style={{ color: "var(--admin-fg)" }}
          />
          <span style={{ color: "var(--admin-fg-muted)" }}>→</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-transparent outline-none text-xs"
            style={{ color: "var(--admin-fg)" }}
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          style={{ background: "var(--admin-primary)" }}
        >
          <Plus className="size-4" /> Add Lead
        </button>
        {(source || service || (role.hasAny(["super_admin", "admin"]) ? assignee : assignee !== currentUserId) || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setSource("");
              setService("");
              setAssignee(role.hasAny(["super_admin", "admin"]) ? "" : currentUserId);
              setDateFrom("");
              setDateTo("");
            }}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded hover:bg-[var(--admin-surface-2)]"
            style={{ color: "var(--admin-fg-muted)" }}
          >
            <X className="size-3" /> Clear
          </button>
        )}
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
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-4 py-2.5 text-left font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium">Mobile</th>
                  {role.hasAny(["super_admin", "admin"]) && <th className="px-4 py-2.5 text-left font-medium">Source</th>}
                  <th className="px-4 py-2.5 text-left font-medium">Service</th>
                  <th className="px-4 py-2.5 text-left font-medium">Current Stage</th>
                  {role.hasAny(["super_admin", "admin"]) && <th className="px-4 py-2.5 text-left font-medium">Assignee</th>}
                </tr>

              </thead>
              <tbody>
                {rows.map((l: any, idx: number) => {
                  const dKey = istDateKey(l.created_at);
                  const prevKey = idx > 0 ? istDateKey((rows as any[])[idx - 1].created_at) : "";
                  const showSep = dKey && dKey !== prevKey;
                  const checked = selected.has(l.id);
                  const ageMs = Date.now() - new Date(l.created_at).getTime();
                  const stale = !l.assigned_to && ageMs > 24 * 60 * 60 * 1000;
                  const rowBg = checked
                    ? "var(--admin-surface-2)"
                    : stale ? "rgba(251, 191, 36, 0.08)" : undefined;
                  return (
                    <Fragment key={l.id}>
                    {showSep && (
                      <tr>
                        <td colSpan={12} className="px-4 py-1.5 bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                          {istDayLabel(l.created_at)}
                        </td>
                      </tr>
                    )}
                    <tr
                      key={l.id}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
                        // Don't hijack text selection / copy
                        const sel = typeof window !== "undefined" ? window.getSelection?.() : null;
                        if (sel && sel.toString().trim().length > 0) return;
                        navigate({ to: "/admin/leads/$leadId", params: { leadId: l.id } });
                      }}
                      className="border-t cursor-pointer hover:bg-[var(--admin-surface-2)] transition-colors"
                      style={{ borderColor: "var(--admin-border)", background: rowBg, borderLeft: stale ? "3px solid #F59E0B" : undefined }}
                      title={stale ? "Unassigned for over 24h" : undefined}
                    >
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
                        <span className="font-medium" style={{ color: "var(--admin-accent)" }}>
                          {l.lead_code}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: "var(--admin-fg-muted)" }}>
                        <div className="flex items-center gap-1.5">
                          <div>
                            <div>{formatIST(l.created_at, { dateOnly: true })}</div>
                            <div className="text-[10px] text-slate-400">{formatIST(l.created_at, { timeOnly: true })} IST</div>
                          </div>
                          {(l.status === "new_lead" || l.status === "lead_created" || !l.status) && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
                              title="Time since lead created"
                            >
                              {formatAge(ageMs)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{l.name}</span>
                          {l.is_duplicate && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
                              title="Same mobile/email submitted again — original lead exists"
                            >
                              REPEAT
                            </span>
                          )}
                          {(l.duplicate_count ?? 0) > 0 && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                              title={`Customer resubmitted ${l.duplicate_count} more time(s) after this lead`}
                            >
                              ×{(l.duplicate_count ?? 0) + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-sm font-semibold text-slate-900 whitespace-nowrap tracking-wide">{l.mobile || "—"}</td>
                      {role.hasAny(["super_admin", "admin"]) && <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }} title={l.lead_source || ""}>{formatLeadSource(l.lead_source)}</td>}
                      <td className="px-4 py-2.5 text-xs min-w-[240px] whitespace-normal break-words" style={{ color: "var(--admin-fg-muted)" }} title={l.service || ""}>{l.service || "—"}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={l.status} /></td>
                      {role.hasAny(["super_admin", "admin"]) && (
                        <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{l.assignee_name || (l.assigned_to ? "—" : <span className="italic">Unassigned</span>)}</td>
                      )}
                    </tr>
                    </Fragment>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center gap-2" style={{ color: "var(--admin-fg-muted)" }}>
                        <UsersIcon className="size-8 opacity-40" />
                        <div className="text-sm font-medium">No leads match your filters</div>
                        <div className="text-xs">Try clearing filters, or use “Add Lead” to create one.</div>
                      </div>
                    </td>
                  </tr>
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
        <div style={{ color: "var(--admin-fg-muted)" }}>
          Page {page} of {Math.max(1, Math.ceil((data?.total ?? 0) / 25))}
        </div>
        <button disabled={!data || page * 25 >= (data.total ?? 0)} onClick={() => setPage(page + 1)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
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

      <LeadDetailSheet leadId={openId} onClose={() => setOpenId(null)} />
      <AddLeadDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        staff={staffData?.profiles ?? []}
        onCreated={refresh}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title={`Delete ${selected.size} lead${selected.size === 1 ? "" : "s"}?`}
        description={
          <div className="space-y-2">
            <p>This permanently removes the selected lead{selected.size === 1 ? "" : "s"} and all associated notes.</p>
            <p className="text-xs text-amber-700">Leads with linked payments will be skipped automatically.</p>
          </div>
        }
        confirmWord="DELETE"
        confirmLabel="Delete leads"
        danger
        loading={busy}
        onConfirm={performBulkDelete}
      />
    </div>
  );
}

function LeadDetailSheet({ leadId, onClose }: { leadId: string | null; onClose: () => void }) {
  const getFn = useServerFn(getLead);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.leadQuick", leadId],
    queryFn: () => getFn({ data: { id: leadId! } }),
    enabled: !!leadId,
  });

  return (
    <Sheet open={!!leadId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
        </SheetHeader>
        {isLoading || !data ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="space-y-4 mt-4 text-sm">
            <div className="space-y-1">
              <div className="font-mono text-xs text-muted-foreground">{data.lead.lead_code}</div>
              <div className="text-lg font-semibold">{data.lead.name}</div>
              <StatusBadge status={data.lead.status} />
            </div>

            <Field label="Email" value={data.lead.email} />
            <Field label="Mobile" value={data.lead.mobile} />
            <Field label="State" value={data.lead.state} />
            <Field label="Language" value={data.lead.language} />
            <Field label="Source" value={formatLeadSource(data.lead.lead_source)} />
            <Field label="Interested Service" value={data.lead.service} />
            <Field label="Total Amount" value={`₹${Number(data.lead.total_amount || 0).toLocaleString("en-IN")}`} />
            <Field label="Assigned To" value={(data.lead as any).assignee_name || (data.lead.assigned_to ? "—" : "Unassigned")} />
            <Field label="Created" value={new Date(data.lead.created_at).toLocaleString("en-IN")} />

            {data.lead.notes && (
              <div className="pt-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Notes</div>
                <div className="text-sm rounded-md border p-2 whitespace-pre-wrap" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
                  {data.lead.notes}
                </div>
              </div>
            )}
            {data.notes.length > 0 && (
              <div className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                {data.notes.length} internal note(s) · {data.applications.length} application(s)
              </div>
            )}

            <div className="pt-3 border-t">
              <Link
                to="/admin/leads/$leadId"
                params={{ leadId: leadId! }}
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                style={{ color: "var(--admin-accent)" }}
              >
                Open full lead page <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-dashed last:border-0" style={{ borderColor: "var(--admin-border)" }}>
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-right">{value || "—"}</span>
    </div>
  );
}

function AddLeadDialog({
  open, onOpenChange, staff, onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  staff: { id: string; display_name: string | null; email: string | null }[];
  onCreated: () => void;
}) {
  const addFn = useServerFn(addLead);
  const findFn = useServerFn(findLeadByCodeOrId);
  const [fetchId, setFetchId] = useState("");
  const [fetching, setFetching] = useState(false);

  const doFetch = async () => {
    const q = fetchId.trim();
    if (!q) return;
    setFetching(true);
    try {
      const { lead } = await findFn({ data: { query: q } });
      setForm((f) => ({
        ...f,
        name: lead.name ?? f.name,
        email: lead.email ?? f.email,
        mobile: lead.mobile ?? f.mobile,
        state: lead.state ?? f.state,
        district: lead.district ?? f.district,
        language: lead.language ?? f.language,
        service: lead.service ?? f.service,
        lead_source: lead.lead_source ?? f.lead_source,
        base_amount: Number(lead.base_amount ?? f.base_amount) || 0,
        gst_amount: Number(lead.gst_amount ?? f.gst_amount) || 0,
        total_amount: Number(lead.total_amount ?? f.total_amount) || 0,
      }));
      toast.success(`Prefilled from ${lead.lead_code ?? lead.id.slice(0, 8)}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Lead not found");
    } finally {
      setFetching(false);
    }
  };
  const websitesFn = useServerFn(listWebsiteTree);
  const { data: websiteTree } = useQuery({
    queryKey: ["admin.websites.tree"],
    queryFn: () => websitesFn(),
    enabled: open,
  });
  const websites = websiteTree?.websites ?? [];

  const servicesFn = useServerFn(listServices);
  const { data: servicesData } = useQuery({
    queryKey: ["admin.services"],
    queryFn: () => servicesFn(),
    enabled: open,
  });

  // Filter services by selected website; show all if no website selected
  const filteredServices = useMemo(() => {
    const rows = (servicesData?.rows ?? []) as any[];
    if (!form.website_id) return rows;
    return rows.filter((s: any) => s.website_id === form.website_id);
  }, [servicesData, form.website_id]);

  const [form, setForm] = useState({
    name: "", email: "", mobile: "", state: "", district: "", language: "en",
    service: "", lead_source: "Website",
    base_amount: 0, gst_amount: 0, total_amount: 0,
    notes: "",
    assigned_to: "" as string,
    website_id: "" as string,
  });
  const [busy, setBusy] = useState(false);

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onServiceChange = (val: string) => {
    setField("service", val);
    const svc = servicesData?.rows.find((s: any) => s.service_name === val);
    if (svc) {
      setField("base_amount", Number(svc.base_amount) || 0);
      setField("gst_amount", Number(svc.gst_amount) || 0);
      setField("total_amount", Number(svc.total_amount) || 0);
    }
  };

  const submit = async () => {
    setBusy(true);
    try {
      const res = await addFn({
        data: {
          ...form,
          district: form.district || undefined,
          notes: form.notes || undefined,
          assigned_to: form.assigned_to || undefined,
          website_id: form.website_id || undefined,
        },
      });
      if (res.isReturningCustomer) {
        toast.success(`Returning customer — lead ${res.lead_code} added to existing profile`);
      } else {
        toast.success(`Lead created: ${res.lead_code ?? res.id.slice(0, 8)}`);
      }
      onCreated();
      onOpenChange(false);
      setForm({
        name: "", email: "", mobile: "", state: "", district: "", language: "en",
        service: "", lead_source: "Website",
        base_amount: 0, gst_amount: 0, total_amount: 0, notes: "", assigned_to: "", website_id: "",
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create lead");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
        </DialogHeader>
        <div className="mb-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2">
          <Label className="text-[11px] uppercase tracking-wider text-slate-500">Prefill from existing lead</Label>
          <div className="mt-1 flex gap-2">
            <Input
              value={fetchId}
              onChange={(e) => setFetchId(e.target.value)}
              placeholder="Lead code (LD-1234), UUID, mobile, or email"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); doFetch(); } }}
            />
            <Button type="button" variant="outline" onClick={doFetch} disabled={fetching || !fetchId.trim()}>
              {fetching ? "Fetching…" : "Fetch"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 py-2">
          <Row label="Full Name" required>
            <Input value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </Row>
          <Row label="Mobile" required>
            <Input value={form.mobile} onChange={(e) => setField("mobile", e.target.value)} />
          </Row>
          <Row label="Email" required full>
            <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
          </Row>
          <Row label="State" required>
            <select
              value={form.state}
              onChange={(e) => setField("state", e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            >
              <option value="">Select state…</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Row>
          <Row label="District">
            <Input value={form.district} onChange={(e) => setField("district", e.target.value)} placeholder="(optional)" />
          </Row>
          <Row label="Source" required>
            <select
              value={form.lead_source}
              onChange={(e) => setField("lead_source", e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            >
              <option value="Website">Website</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
          </Row>
          <Row label="Website" required full>
            <select
              value={form.website_id}
              onChange={(e) => {
                setField("website_id", e.target.value);
                setField("service", ""); // reset service when website changes
                setForm((f) => ({ ...f, base_amount: 0, gst_amount: 0, total_amount: 0 }));
              }}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            >
              <option value="">All websites…</option>
              {websites.map((w: any) => (
                <option key={w.id} value={w.id}>{w.name} — {w.domain}</option>
              ))}
            </select>
          </Row>
          <Row label="Interested Service" required full>
            <select
              value={form.service}
              onChange={(e) => onServiceChange(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            >
              <option value="">Select a service…</option>
              {filteredServices.map((s: any) => (
                <option key={s.id} value={s.service_name}>{s.service_name}</option>
              ))}
            </select>
          </Row>
          <Row label="Total ₹ (inclusive 18% GST)" full>
            <Input
              type="number"
              value={form.total_amount}
              onChange={(e) => {
                const { base, gst, total } = fromTotal(Number(e.target.value));
                setForm((f) => ({ ...f, total_amount: total, base_amount: base, gst_amount: gst }));
              }}
            />
          </Row>
          <Row label="Base ₹ (auto)">
            <Input
              type="number"
              value={form.base_amount}
              onChange={(e) => {
                const { base, gst, total } = fromBase(Number(e.target.value));
                setForm((f) => ({ ...f, base_amount: base, gst_amount: gst, total_amount: total }));
              }}
            />
          </Row>
          <Row label="GST 18% ₹ (auto)">
            <Input type="number" value={form.gst_amount} readOnly />
          </Row>
          <Row label="Assign to" full>
            <select
              value={form.assigned_to}
              onChange={(e) => setField("assigned_to", e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            >
              <option value="">Unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.display_name || s.email}</option>
              ))}
            </select>
          </Row>
          <Row label="Notes" full>
            <Textarea value={form.notes} onChange={(e) => setField("notes", e.target.value)} rows={2} placeholder="Any initial notes about this lead…" />
          </Row>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy || !form.name || !form.email || !form.mobile || !form.state || !form.service}>
            {busy ? "Creating…" : "Create Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <div className={full ? "col-span-2 space-y-1" : "space-y-1"}>
      <Label className="text-xs">
        {label}{required && <span className="text-red-500"> *</span>}
      </Label>
      {children}
    </div>
  );
}

function FormStatusChip({ status }: { status?: string | null }) {
  const s = (status ?? "").toLowerCase();
  let cls = "bg-slate-100 text-slate-600 border-slate-200";
  let label = "Not submitted";
  if (s === "submitted") { cls = "bg-emerald-50 text-emerald-700 border-emerald-200"; label = "Submitted"; }
  else if (s === "resubmitted") { cls = "bg-blue-50 text-blue-700 border-blue-200"; label = "Resubmitted"; }
  else if (s === "draft") { cls = "bg-amber-50 text-amber-700 border-amber-200"; label = "Draft"; }
  else if (s === "approved") { cls = "bg-emerald-50 text-emerald-700 border-emerald-200"; label = "Approved"; }
  else if (s === "needs_changes" || s === "rejected") { cls = "bg-red-50 text-red-700 border-red-200"; label = "Needs fix"; }
  return <span className={`text-[10px] rounded-full px-2 py-0.5 border ${cls}`}>{label}</span>;
}
