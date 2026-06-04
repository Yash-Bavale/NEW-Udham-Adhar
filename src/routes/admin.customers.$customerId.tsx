import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Mail, Phone, MapPin, Copy, FileText, Award, Receipt, Wallet,
  MessageSquareWarning, MessageCircle, StickyNote, Activity as ActivityIcon, Calendar,
  CheckCircle2, ExternalLink,
} from "lucide-react";
import { getCustomer360, addCustomerNote } from "@/lib/crm/customers.functions";
import { SectionCard, StatCard, StatusBadge, Timeline, TableSkeleton } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/customers/$customerId")({
  head: () => ({ meta: [{ title: "Customer 360 — CRM" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Customer360Page,
});

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);
const fmtDT = (s?: string | null) =>
  s ? new Date(s).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const fmtD = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function Customer360Page() {
  const { customerId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fn = useServerFn(getCustomer360);
  const noteFn = useServerFn(addCustomerNote);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin.customer360", customerId],
    queryFn: () => fn({ data: { customerId } }),
  });

  const [noteDraft, setNoteDraft] = useState("");
  const noteMut = useMutation({
    mutationFn: () => noteFn({ data: { customerId, note: noteDraft } }),
    onSuccess: () => {
      setNoteDraft("");
      qc.invalidateQueries({ queryKey: ["admin.customer360", customerId] });
    },
  });

  const timeline = useMemo(() => {
    if (!data) return [];
    const items: Array<{ id: string; time: string; type: string; description: string }> = [];
    data.applications.forEach((a) =>
      items.push({ id: `app-${a.id}`, time: a.created_at, type: "application", description: `Application ${a.application_code ?? a.id.slice(0, 8)} created (${a.application_status})` })
    );
    data.payments.forEach((p) =>
      items.push({ id: `pay-${p.id}`, time: p.created_at, type: "payment", description: `Payment ${fmtINR(Number(p.amount))} · ${p.gateway_name} · ${p.status}` })
    );
    data.invoices.forEach((i) =>
      items.push({ id: `inv-${i.id}`, time: i.issued_at, type: "invoice", description: `Invoice ${i.invoice_number ?? "—"} issued · ${fmtINR(Number(i.total_amount))}` })
    );
    data.certificates.forEach((c) =>
      items.push({ id: `cert-${c.id}`, time: c.issued_at ?? c.delivered_at ?? new Date().toISOString(), type: "certificate", description: `Certificate ${c.certificate_number ?? c.file_name ?? "issued"}` })
    );
    data.complaints.forEach((c) =>
      items.push({ id: `comp-${c.id}`, time: c.created_at, type: "complaint", description: `Complaint ${c.complaint_number ?? ""} · ${c.severity} · ${c.status}` })
    );
    data.emails.forEach((e) =>
      items.push({ id: `em-${e.id}`, time: e.sent_at, type: "email", description: `Email "${e.subject}" → ${e.to_email} · ${e.status}` })
    );
    data.activity.forEach((a) =>
      items.push({ id: `act-${a.id}`, time: a.created_at, type: a.activity_type, description: a.activity_description })
    );
    return items.sort((a, b) => +new Date(b.time) - +new Date(a.time)).slice(0, 80).map((i) => ({ ...i, time: fmtDT(i.time) }));
  }, [data]);

  if (error) {
    return (
      <div className="space-y-3">
        <button onClick={() => navigate({ to: "/admin/customers" })} className="text-sm hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="size-3.5" /> Back to customers
        </button>
        <div className="text-sm text-red-700">{(error as Error).message}</div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <TableSkeleton rows={8} cols={4} />;
  }

  const c = data.customer;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/customers" className="text-sm hover:underline inline-flex items-center gap-1" style={{ color: "var(--admin-fg-muted)" }}>
          <ArrowLeft className="size-3.5" /> All customers
        </Link>
      </div>

      {/* Identity header */}
      <SectionCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight truncate">{c.name}</h1>
              <span className="rounded-md border px-2 py-0.5 text-[11px] font-mono" style={{ borderColor: "var(--admin-border)" }}>
                {c.customer_code ?? "—"}
              </span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] capitalize"
                style={{ background: c.status === "active" ? "color-mix(in oklab, var(--admin-accent) 18%, transparent)" : "var(--admin-surface-2)" }}
              >
                {c.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
              {c.primary_email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3" /> {c.primary_email}
                  <CopyBtn value={c.primary_email} />
                </span>
              )}
              {c.primary_mobile && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3" /> {c.primary_mobile}
                  <CopyBtn value={c.primary_mobile} />
                </span>
              )}
              {c.state && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3" /> {c.state}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" /> Since {fmtD(c.first_seen_at)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {c.primary_mobile && (
              <a href={`tel:${c.primary_mobile}`} className="rounded-lg border px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
                <Phone className="size-3.5" /> Call
              </a>
            )}
            {c.primary_mobile && (
              <a href={`https://wa.me/${c.primary_mobile.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
                <MessageCircle className="size-3.5" /> WhatsApp
              </a>
            )}
            {c.primary_email && (
              <a href={`mailto:${c.primary_email}`} className="rounded-lg border px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
                <Mail className="size-3.5" /> Email
              </a>
            )}
          </div>
        </div>
      </SectionCard>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard index={0} label="Lifetime Value" value={fmtINR(Number(c.lifetime_value))} icon={<Wallet className="size-4" />} gradient="primary" />
        <StatCard index={1} label="Applications" value={c.total_applications} icon={<FileText className="size-4" />} gradient="primary" hint={`${c.completed_applications} completed · ${c.pending_applications} open`} />
        <StatCard index={2} label="Certificates" value={data.certificates.length} icon={<Award className="size-4" />} gradient="success" />
        <StatCard index={3} label="Invoices" value={data.invoices.length} icon={<Receipt className="size-4" />} gradient="warn" />
      </div>

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <SectionCard title="Applications" action={<span className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>{data.applications.length} total</span>}>
            {data.applications.length === 0 ? (
              <Empty label="No applications yet" />
            ) : (
              <div className="space-y-1.5">
                {data.applications.map((a) => (
                  <Link
                    key={a.id}
                    to="/admin/applications/$applicationId"
                    params={{ applicationId: a.id }}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 hover:bg-[var(--admin-surface-2)] transition-colors"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{a.application_code ?? a.id.slice(0, 8)}</div>
                      <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                        Form {a.form_status} · Docs {a.document_status} · Updated {fmtD(a.updated_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={a.application_status} />
                      <ExternalLink className="size-3.5 opacity-60" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Certificates">
            {data.certificates.length === 0 ? (
              <Empty label="No certificates issued" />
            ) : (
              <div className="space-y-1.5">
                {data.certificates.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: "var(--admin-border)" }}>
                    <div className="min-w-0">
                      <div className="font-medium text-sm flex items-center gap-1.5"><Award className="size-3.5" />{c.certificate_number ?? c.file_name ?? "Certificate"}</div>
                      <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>Issued {fmtD(c.issued_at)} · Delivered {fmtD(c.delivered_at)}</div>
                    </div>
                    {c.file_path && (
                      <span className="text-[11px] inline-flex items-center gap-1" style={{ color: "var(--admin-fg-muted)" }}>
                        <CheckCircle2 className="size-3" /> File stored
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Invoices">
            {data.invoices.length === 0 ? (
              <Empty label="No invoices yet" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                      <th className="py-1.5 pr-3">Invoice</th>
                      <th className="py-1.5 pr-3">Date</th>
                      <th className="py-1.5 pr-3 text-right">Amount</th>
                      <th className="py-1.5 pr-3">PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map((i) => (
                      <tr key={i.id} className="border-t" style={{ borderColor: "var(--admin-border)" }}>
                        <td className="py-2 pr-3 font-mono text-xs">{i.invoice_number ?? "—"}</td>
                        <td className="py-2 pr-3 text-xs">{fmtD(i.issued_at)}</td>
                        <td className="py-2 pr-3 text-right font-medium">{fmtINR(Number(i.total_amount))}</td>
                        <td className="py-2 pr-3 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{i.pdf_path ? "Generated" : "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Payment ledger">
            {data.payments.length === 0 ? (
              <Empty label="No payments captured" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                      <th className="py-1.5 pr-3">When</th>
                      <th className="py-1.5 pr-3">Gateway</th>
                      <th className="py-1.5 pr-3">Status</th>
                      <th className="py-1.5 pr-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map((p) => (
                      <tr key={p.id} className="border-t" style={{ borderColor: "var(--admin-border)" }}>
                        <td className="py-2 pr-3 text-xs">{fmtDT(p.payment_date ?? p.created_at)}</td>
                        <td className="py-2 pr-3 text-xs capitalize">{p.gateway_name}</td>
                        <td className="py-2 pr-3"><StatusBadge status={p.status} /></td>
                        <td className="py-2 pr-3 text-right font-medium">{fmtINR(Number(p.amount))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Complaints & tickets">
            {data.complaints.length === 0 ? (
              <Empty label="No complaints raised" />
            ) : (
              <div className="space-y-1.5">
                {data.complaints.map((c) => (
                  <Link
                    key={c.id}
                    to="/admin/complaints/$complaintId"
                    params={{ complaintId: c.id }}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-[var(--admin-surface-2)] transition-colors"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <div>
                      <div className="font-medium text-sm flex items-center gap-1.5"><MessageSquareWarning className="size-3.5" />{c.complaint_number ?? c.id.slice(0, 8)}</div>
                      <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>{c.category ?? "—"} · severity {c.severity}</div>
                    </div>
                    <StatusBadge status={c.status} />
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right column: notes + timeline */}
        <div className="space-y-4">
          <SectionCard title="Internal notes">
            <div className="space-y-2">
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a private note about this customer…"
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent resize-none"
                style={{ borderColor: "var(--admin-border)" }}
              />
              <div className="flex items-center justify-between">
                <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>Staff-only · audited</div>
                <button
                  disabled={!noteDraft.trim() || noteMut.isPending}
                  onClick={() => noteMut.mutate()}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  style={{ background: "var(--gradient-admin)" }}
                >
                  {noteMut.isPending ? "Saving…" : "Save note"}
                </button>
              </div>
              {noteMut.error && <div className="text-xs text-red-700">{(noteMut.error as Error).message}</div>}

              <div className="space-y-2 pt-2">
                {data.notes.length === 0 ? (
                  <Empty label="No notes yet" />
                ) : (
                  data.notes.map((n) => (
                    <div key={n.id} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--admin-border)" }}>
                      <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                        <StickyNote className="size-3" />
                        {fmtDT(n.created_at)}
                      </div>
                      <div className="mt-1 text-sm whitespace-pre-wrap">{n.note}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Timeline" action={<ActivityIcon className="size-3.5 opacity-60" />}>
            {timeline.length === 0 ? (
              <Empty label="No activity recorded" />
            ) : (
              <Timeline items={timeline} />
            )}
          </SectionCard>

          <SectionCard title="Linked leads">
            {data.leads.length === 0 ? (
              <Empty label="No leads linked" />
            ) : (
              <div className="space-y-1">
                {data.leads.map((l) => (
                  <Link
                    key={l.id}
                    to="/admin/leads/$leadId"
                    params={{ leadId: l.id }}
                    className="flex items-center justify-between rounded-lg border px-3 py-1.5 hover:bg-[var(--admin-surface-2)] transition-colors text-sm"
                    style={{ borderColor: "var(--admin-border)" }}
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-[11px]">{l.lead_code ?? l.id.slice(0, 8)}</div>
                      <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>{l.service} · {fmtD(l.created_at)}</div>
                    </div>
                    <StatusBadge status={l.status} />
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-xs py-6 text-center" style={{ color: "var(--admin-fg-muted)" }}>{label}</div>;
}

function CopyBtn({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard.writeText(value).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        });
      }}
      className="opacity-50 hover:opacity-100 transition-opacity"
      aria-label="Copy"
    >
      {done ? <CheckCircle2 className="size-3 text-green-600" /> : <Copy className="size-3" />}
    </button>
  );
}
