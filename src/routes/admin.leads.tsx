import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download, Plus, X, ExternalLink, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  listLeads, listStaff, addLead, getLeadCounts, getLead,
} from "@/lib/crm/leads-admin.functions";
import { listServices } from "@/lib/crm/services-admin.functions";
import { LEAD_STATUSES } from "@/lib/crm/types";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";
import { LeadsBulkBar } from "@/components/admin/LeadsBulkBar";
import { SavedFiltersMenu } from "@/components/admin/SavedFiltersMenu";
import {
  bulkUpdateLeadStatus, bulkAssignLeads, bulkDeleteLeads, exportLeadsCsv,
} from "@/lib/crm/leads-bulk.functions";
import { listSavedFilters, type FilterJson } from "@/lib/crm/saved-filters.functions";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

function LeadsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listLeads);
  const countsFn = useServerFn(getLeadCounts);
  const exportFn = useServerFn(exportLeadsCsv);
  const statusFn = useServerFn(bulkUpdateLeadStatus);
  const assignFn = useServerFn(bulkAssignLeads);
  const deleteFn = useServerFn(bulkDeleteLeads);
  const savedFn = useServerFn(listSavedFilters);
  const staffFn = useServerFn(listStaff);

  const [page, setPage] = useState(1);
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
  const servicesFn = useServerFn(listServices);
  const { data: servicesData } = useQuery({ queryKey: ["admin.services"], queryFn: () => servicesFn() });

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

  const { data, isLoading } = useQuery({
    queryKey: ["admin.leads", page, search, status, source, assignee],
    queryFn: () => listFn({ data: { page, pageSize: 25, search: search || undefined, status: (status || undefined) as never } }),
  });

  // Client-side filters layered on paginated rows
  const rows = useMemo(() => {
    let r = data?.rows ?? [];
    if (source) r = r.filter((l: any) => (l.lead_source || "").toLowerCase() === source.toLowerCase());
    if (service) r = r.filter((l: any) => (l.service || "") === service);
    if (assignee) {
      r = assignee === "__unassigned"
        ? r.filter((l: any) => !l.assigned_to)
        : r.filter((l: any) => l.assigned_to === assignee);
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      r = r.filter((l: any) => new Date(l.created_at).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000;
      r = r.filter((l: any) => new Date(l.created_at).getTime() < to);
    }
    return r;
  }, [data, source, service, assignee, dateFrom, dateTo]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.leads"] });
    qc.invalidateQueries({ queryKey: ["admin.leadCounts"] });
  };
  const clearSel = () => setSelected(new Set());

  const allOnPage = rows.map((l: any) => l.id);
  const allSelected = allOnPage.length > 0 && allOnPage.every((id: string) => selected.has(id));

  const counts = countsData?.counts ?? {};

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
  const handleBulkAssign = async (a: string | null) => {
    setBusy(true);
    try {
      await assignFn({ data: { ids: Array.from(selected), assignee: a } });
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
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            {data?.total ?? 0} total records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            style={{ background: "var(--admin-primary)" }}
          >
            <Plus className="size-4" /> Add Lead
          </button>
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

      {/* Status pills with counts */}
      <div className="flex gap-2 flex-wrap">
        <FilterChip active={status === ""} onClick={() => { setStatus(""); setPage(1); }}>
          All <span className="ml-1 opacity-60">({counts.all ?? 0})</span>
        </FilterChip>
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
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search code, name, email, mobile…"
            className="rounded-lg border pl-9 pr-3 py-2 text-sm w-80 outline-none focus:ring-2"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          />
        </div>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
        >
          <option value="">All sources</option>
          <option value="manual">Manual</option>
          <option value="website">Website</option>
          <option value="campaign">Campaign</option>
          <option value="referral">Referral</option>
          <option value="whatsapp">WhatsApp</option>
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
        {(source || service || assignee || dateFrom || dateTo) && (
          <button
            onClick={() => { setSource(""); setService(""); setAssignee(""); setDateFrom(""); setDateTo(""); }}
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
                  <th className="px-4 py-2.5 text-left font-medium">Name</th>
                  <th className="px-4 py-2.5 text-left font-medium">Mobile</th>
                  <th className="px-4 py-2.5 text-left font-medium">Email</th>
                  <th className="px-4 py-2.5 text-left font-medium">Source</th>
                  <th className="px-4 py-2.5 text-left font-medium">Service</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-4 py-2.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l: any) => {
                  const checked = selected.has(l.id);
                  return (
                    <tr
                      key={l.id}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest("input,a,button")) return;
                        setOpenId(l.id);
                      }}
                      className={`border-t cursor-pointer hover:bg-[var(--admin-surface-2)] ${checked ? "bg-[var(--admin-surface-2)]" : ""}`}
                      style={{ borderColor: "var(--admin-border)" }}
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
                      <td className="px-4 py-2.5 font-medium">{l.name}</td>
                      <td className="px-4 py-2.5 text-xs">{l.mobile || "—"}</td>
                      <td className="px-4 py-2.5 text-xs truncate max-w-[200px]" style={{ color: "var(--admin-fg-muted)" }}>{l.email || "—"}</td>
                      <td className="px-4 py-2.5 text-xs capitalize" style={{ color: "var(--admin-fg-muted)" }}>{l.lead_source || "—"}</td>
                      <td className="px-4 py-2.5 text-xs max-w-[200px] truncate" style={{ color: "var(--admin-fg-muted)" }}>{l.service || "—"}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={l.status} /></td>
                      <td className="px-4 py-2.5 text-xs whitespace-nowrap" style={{ color: "var(--admin-fg-muted)" }}>{new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenId(l.id); }}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-[var(--admin-surface)] border"
                          style={{ borderColor: "var(--admin-border)", color: "var(--admin-accent)" }}
                          title="View details"
                        >
                          <Eye className="size-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr><td colSpan={10} className="px-3 py-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>No leads found.</td></tr>
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
            <Field label="Service" value={data.lead.service} />
            <Field label="Source" value={data.lead.lead_source} />
            <Field label="Total Amount" value={`₹${Number(data.lead.total_amount || 0).toLocaleString("en-IN")}`} />
            <Field label="Applications" value={String(data.applications.length)} />
            <Field label="Notes" value={String(data.notes.length)} />
            <Field label="Created" value={new Date(data.lead.created_at).toLocaleString("en-IN")} />

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
  const servicesFn = useServerFn(listServices);
  const { data: servicesData } = useQuery({
    queryKey: ["admin.services"],
    queryFn: () => servicesFn(),
    enabled: open,
  });

  const [form, setForm] = useState({
    name: "", email: "", mobile: "", state: "", language: "en",
    service: "", lead_source: "manual",
    base_amount: 0, gst_amount: 0, total_amount: 0,
    assigned_to: "" as string,
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
          assigned_to: form.assigned_to || undefined,
        },
      });
      toast.success(`Lead created: ${res.lead_code ?? res.id.slice(0, 8)}`);
      onCreated();
      onOpenChange(false);
      setForm({
        name: "", email: "", mobile: "", state: "", language: "en",
        service: "", lead_source: "manual",
        base_amount: 0, gst_amount: 0, total_amount: 0, assigned_to: "",
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
            <Input value={form.state} onChange={(e) => setField("state", e.target.value)} />
          </Row>
          <Row label="Language">
            <Input value={form.language} onChange={(e) => setField("language", e.target.value)} />
          </Row>
          <Row label="Service" required full>
            <select
              value={form.service}
              onChange={(e) => onServiceChange(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            >
              <option value="">Select a service…</option>
              {servicesData?.rows.map((s: any) => (
                <option key={s.id} value={s.service_name}>{s.service_name}</option>
              ))}
            </select>
          </Row>
          <Row label="Base ₹">
            <Input type="number" value={form.base_amount} onChange={(e) => setField("base_amount", Number(e.target.value))} />
          </Row>
          <Row label="GST ₹">
            <Input type="number" value={form.gst_amount} onChange={(e) => setField("gst_amount", Number(e.target.value))} />
          </Row>
          <Row label="Total ₹" full>
            <Input type="number" value={form.total_amount} onChange={(e) => setField("total_amount", Number(e.target.value))} />
          </Row>
          <Row label="Source">
            <select
              value={form.lead_source}
              onChange={(e) => setField("lead_source", e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            >
              <option value="manual">Manual</option>
              <option value="website">Website</option>
              <option value="campaign">Campaign</option>
              <option value="referral">Referral</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </Row>
          <Row label="Assign to">
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
