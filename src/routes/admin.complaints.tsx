import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, X, Loader2 } from "lucide-react";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";
import {
  listComplaints,
  createComplaint,
  searchLeadsForComplaint,
} from "@/lib/crm/complaints.functions";
import { listStaffForAssignment } from "@/lib/crm/tasks.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Udyam Ops OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ComplaintsPage,
});

const STATUS_PILLS = [
  { key: "draft", label: "Draft" },
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "awaiting_response", label: "Awaiting Response" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
] as const;

const SEVERITY_PILLS = ["low", "normal", "high", "critical"] as const;

function ComplaintsPage() {
  const listFn = useServerFn(listComplaints);
  const [status, setStatus] = useState<string | undefined>();
  const [severity, setSeverity] = useState<string | undefined>();
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.complaints", { status, severity, q }],
    queryFn: () => listFn({ data: { status, severity, q } }),
    refetchInterval: 60_000,
  });

  const rows = data?.rows ?? [];
  const counts = data?.counts ?? ({ all: 0 } as Record<string, number>);
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>
            Complaints
          </h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            Grievances and escalations across services and authorities.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium"
          style={{ background: "var(--admin-primary)", color: "#fff" }}
        >
          <Plus className="size-3.5" /> Add Complaint
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={!status} onClick={() => setStatus(undefined)}>
          All ({counts.all ?? 0})
        </FilterChip>
        {STATUS_PILLS.map((s) => (
          <FilterChip key={s.key} active={status === s.key} onClick={() => setStatus(s.key)}>
            {s.label} ({counts[s.key] ?? 0})
          </FilterChip>
        ))}
      </div>

      <SectionCard>
        <div
          className="p-4 flex flex-wrap items-center gap-3 border-b"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <div
            className="flex items-center gap-2 rounded-md border px-3 h-9 flex-1 min-w-[240px] max-w-md"
            style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
          >
            <Search className="size-4" style={{ color: "var(--admin-fg-muted)" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search complaint #, customer, mobile, order…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <select
            value={severity ?? ""}
            onChange={(e) => setSeverity(e.target.value || undefined)}
            className="h-9 rounded-md border bg-transparent px-2 text-sm"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <option value="">All severities</option>
            {SEVERITY_PILLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            No complaints match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0" style={{ background: "var(--admin-surface-2)" }}>
                <tr className="text-left" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Complaint No</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Customer</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Order</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Service</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Authority</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Auth Ref #</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Status</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide text-right">Days Open</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Expected Update</th>
                  <th className="py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c: any, i: number) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate({ to: "/admin/complaints/$complaintId", params: { complaintId: c.id } })}
                    className="border-t cursor-pointer hover:bg-[var(--admin-accent-soft)] transition-colors"
                    style={{
                      borderColor: "var(--admin-border)",
                      background: i % 2 ? "var(--admin-surface-2)" : "transparent",
                    }}
                  >
                    <td className="py-2.5 px-4 font-mono text-xs">{c.complaint_number ?? c.id.slice(0, 8)}</td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium" style={{ color: "var(--admin-fg)" }}>
                        {c.customer?.name ?? c.lead?.name ?? "—"}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                        {c.customer?.mobile ?? c.lead?.mobile ?? ""}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs">{c.application?.application_code ?? "—"}</td>
                    <td className="py-2.5 px-4 text-xs">{c.application?.service_name ?? c.lead?.service ?? "—"}</td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: "var(--admin-fg)" }}>{c.authority_name ?? "—"}</td>
                    <td className="py-2.5 px-4 font-mono text-xs">{c.authority_ref_number ?? "—"}</td>
                    <td className="py-2.5 px-4"><StatusBadge status={c.status} /></td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{c.days_open}</td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                      {c.expected_update_at ? formatIST(c.expected_update_at) : "—"}
                    </td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{c.assigned_name ?? "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {addOpen && <AddComplaintModal onClose={() => setAddOpen(false)} />}
    </div>
  );
}

function formatIST(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}


function AddComplaintModal({
  onClose,
  defaultLeadId,
  defaultLeadLabel,
  defaultApplicationId,
}: {
  onClose: () => void;
  defaultLeadId?: string | null;
  defaultLeadLabel?: string | null;
  defaultApplicationId?: string | null;
}) {
  const qc = useQueryClient();
  const createFn = useServerFn(createComplaint);
  const searchFn = useServerFn(searchLeadsForComplaint);

  const [leadQuery, setLeadQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<{ id: string; name: string; lead_code?: string; service?: string } | null>(
    defaultLeadId && defaultLeadLabel ? { id: defaultLeadId, name: defaultLeadLabel } : null,
  );
  const [authority, setAuthority] = useState("");
  const [authorityRef, setAuthorityRef] = useState("");
  const [description, setDescription] = useState("");
  const [expected, setExpected] = useState("");
  const [severity, setSeverity] = useState<(typeof SEVERITY_PILLS)[number]>("normal");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: searchData, isFetching } = useQuery({
    queryKey: ["complaint-lead-search", leadQuery],
    queryFn: () => searchFn({ data: { q: leadQuery } }),
    enabled: leadQuery.length >= 2 && !selectedLead,
  });

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!selectedLead) e.lead = "Customer / lead is required.";
    if (authority.trim().length < 1) e.authority = "Authority name is required.";
    if (description.trim().length < 1) e.description = "Complaint description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setBusy(true);
    try {
      const out = await createFn({
        data: {
          lead_id: selectedLead!.id,
          application_id: defaultApplicationId ?? null,
          severity,
          description,
          authority_name: authority.trim(),
          authority_ref_number: authorityRef.trim() || undefined,
          expected_update_at: expected || undefined,
          assigned_to: assignedTo || null,
        },
      });
      toast.success(`Complaint ${out.complaint_number ?? "created"} added`);
      qc.invalidateQueries({ queryKey: ["admin.complaints"] });
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create complaint");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-lg"
        style={{ background: "var(--admin-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--admin-border)" }}>
          <h2 className="text-base font-medium" style={{ color: "var(--admin-fg)" }}>Add Complaint</h2>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-[var(--admin-surface-2)]" aria-label="Close">
            <X className="size-4" />
          </button>
        </header>

        <div className="p-5 space-y-4">
          <Field label="Customer / Lead" required error={errors.lead}>
            {selectedLead ? (
              <div className="flex items-center justify-between rounded-md border p-2.5" style={{ borderColor: "var(--admin-border)" }}>
                <div>
                  <div className="text-sm font-medium">{selectedLead.name}</div>
                  {(selectedLead.lead_code || selectedLead.service) && (
                    <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                      {[selectedLead.lead_code, selectedLead.service].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { setSelectedLead(null); setLeadQuery(""); }}
                  className="text-xs"
                  style={{ color: "var(--admin-accent)" }}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  autoFocus
                  value={leadQuery}
                  onChange={(e) => setLeadQuery(e.target.value)}
                  placeholder="Search by name, email, mobile, or lead code"
                  className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                  style={{ borderColor: "var(--admin-border)" }}
                />
                {leadQuery.length >= 2 && (
                  <div
                    className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-md border z-10"
                    style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
                  >
                    {isFetching ? (
                      <div className="p-3 text-xs flex items-center gap-2" style={{ color: "var(--admin-fg-muted)" }}>
                        <Loader2 className="size-3 animate-spin" /> Searching…
                      </div>
                    ) : (searchData?.leads ?? []).length === 0 ? (
                      <div className="p-3 text-xs" style={{ color: "var(--admin-fg-muted)" }}>No matches.</div>
                    ) : (
                      <ul>
                        {searchData!.leads.map((l: any) => (
                          <li key={l.id}>
                            <button
                              onClick={() => setSelectedLead({ id: l.id, name: l.name, lead_code: l.lead_code, service: l.service })}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--admin-surface-2)]"
                            >
                              <div className="font-medium">{l.name}</div>
                              <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                                {l.lead_code} · {l.email ?? ""} {l.mobile ? `· +91 ${l.mobile}` : ""}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Authority Name" required error={errors.authority}>
              <input
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                placeholder="e.g. Ministry of MSME"
                className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: "var(--admin-border)" }}
              />
            </Field>
            <Field label="Authority Reference #">
              <input
                value={authorityRef}
                onChange={(e) => setAuthorityRef(e.target.value)}
                placeholder="Ticket/Diary No."
                className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: "var(--admin-border)" }}
              />
            </Field>
          </div>

          <Field label="Complaint Description" required error={errors.description}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What went wrong, dates, supporting facts"
              className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: "var(--admin-border)" }}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Expected Update">
              <input
                type="date"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: "var(--admin-border)" }}
              />
            </Field>
            <Field label="Severity">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: "var(--admin-border)" }}
              >
                {SEVERITY_PILLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Assign To (optional)">
            <AssigneeSelect value={assignedTo} onChange={setAssignedTo} />
          </Field>
        </div>

        <footer className="flex items-center justify-end gap-2 px-5 py-3 border-t" style={{ borderColor: "var(--admin-border)" }}>
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--admin-primary)", color: "#fff" }}
          >
            {busy && <Loader2 className="size-3.5 animate-spin" />}
            Create complaint
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide font-medium mb-1" style={{ color: "var(--admin-fg-muted)" }}>
        {label}
        {required && <span style={{ color: "var(--admin-danger)" }}> *</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-[11px]" style={{ color: "var(--admin-danger)" }}>
          {error}
        </span>
      )}
    </label>
  );
}

function AssigneeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fn = useServerFn(listStaffForAssignment);
  const { data } = useQuery({
    queryKey: ["staff-assign"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border px-3 py-2 text-sm bg-transparent"
      style={{ borderColor: "var(--admin-border)" }}
    >
      <option value="">Unassigned</option>
      {(data?.staff ?? []).map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
