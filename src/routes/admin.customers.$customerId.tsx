import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Mail, Phone, MapPin, Copy, FileText, Award, Receipt, Wallet,
  MessageSquareWarning, MessageCircle, StickyNote, Activity as ActivityIcon,
  Calendar, CheckCircle2, ExternalLink, User, ShoppingBag, IndianRupee, FolderOpen, Send,
} from "lucide-react";
import { toast } from "sonner";
import { getCustomer360, addCustomerNote } from "@/lib/crm/customers.functions";
import { SectionCard, StatCard, StatusBadge, Timeline, TableSkeleton } from "@/components/admin/ui";
import { maskAadhaar } from "@/lib/crm/mask";

export const Route = createFileRoute("/admin/customers/$customerId")({
  head: () => ({ meta: [{ title: "Customer Profile — CRM" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: CustomerProfilePage,
});

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);
const fmtDT = (s?: string | null) =>
  s ? new Date(s).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const fmtD = (s?: string | null) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

type TabKey = "overview" | "orders" | "complaints" | "payments" | "documents" | "communication";

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: User },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "complaints", label: "Complaints", icon: MessageSquareWarning },
  { key: "payments", label: "Payments", icon: IndianRupee },
  { key: "documents", label: "Documents", icon: FolderOpen },
  { key: "communication", label: "Communication", icon: Send },
];

function CustomerProfilePage() {
  const { customerId } = Route.useParams();
  const navigate = useNavigate();
  const fn = useServerFn(getCustomer360);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin.customer360", customerId],
    queryFn: () => fn({ data: { customerId } }),
  });

  const [tab, setTab] = useState<TabKey>("overview");

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

  if (isLoading || !data) return <TableSkeleton rows={8} cols={4} />;

  const c = data.customer;

  return (
    <div className="space-y-5">
      <Link to="/admin/customers" className="text-sm inline-flex items-center gap-1 hover:underline" style={{ color: "var(--admin-fg-muted)" }}>
        <ArrowLeft className="size-3.5" /> All customers
      </Link>

      {/* Identity header */}
      <SectionCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight truncate">{c.name}</h1>
              <span className="rounded-md border px-2 py-0.5 text-[11px] font-mono" style={{ borderColor: "var(--admin-border)" }}>
                {c.customer_code ?? "—"}
              </span>
              <StatusBadge status={c.status} />
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
              {c.state && <span className="inline-flex items-center gap-1.5"><MapPin className="size-3" /> {c.state}</span>}
              <span className="inline-flex items-center gap-1.5"><Calendar className="size-3" /> Since {fmtD(c.first_seen_at)}</span>
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

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard index={0} label="Lifetime Value" value={fmtINR(Number(c.lifetime_value))} icon={<Wallet className="size-4" />} gradient="primary" />
        <StatCard index={1} label="Orders" value={c.total_applications} icon={<FileText className="size-4" />} gradient="primary" hint={`${c.completed_applications} completed · ${c.pending_applications} open`} />
        <StatCard index={2} label="Certificates" value={data.certificates.length} icon={<Award className="size-4" />} gradient="success" />
        <StatCard index={3} label="Invoices" value={data.invoices.length} icon={<Receipt className="size-4" />} gradient="warn" />
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 border-b overflow-x-auto"
        style={{ borderColor: "var(--admin-border)" }}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 -mb-px whitespace-nowrap"
              style={{
                borderColor: active ? "var(--admin-primary)" : "transparent",
                color: active ? "var(--admin-fg)" : "var(--admin-fg-muted)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon className="size-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && <OverviewTab data={data} customerId={customerId} />}
      {tab === "orders" && <OrdersTab data={data} />}
      {tab === "complaints" && <ComplaintsTab data={data} />}
      {tab === "payments" && <PaymentsTab data={data} />}
      {tab === "documents" && <DocumentsTab data={data} />}
      {tab === "communication" && <CommunicationTab data={data} />}
    </div>
  );
}

/* ---------- Tabs ---------- */

function OverviewTab({ data, customerId }: { data: any; customerId: string }) {
  const qc = useQueryClient();
  const noteFn = useServerFn(addCustomerNote);
  const [noteDraft, setNoteDraft] = useState("");
  const noteMut = useMutation({
    mutationFn: () => noteFn({ data: { customerId, note: noteDraft } }),
    onSuccess: () => {
      setNoteDraft("");
      qc.invalidateQueries({ queryKey: ["admin.customer360", customerId] });
      toast.success("Note saved");
    },
  });

  const timeline = useMemo(() => {
    const items: Array<{ id: string; time: string; type: string; description: string }> = [];
    data.applications.forEach((a: any) =>
      items.push({ id: `app-${a.id}`, time: a.created_at, type: "application", description: `Order ${a.application_code ?? a.id.slice(0, 8)} (${a.application_status})` })
    );
    data.payments.forEach((p: any) =>
      items.push({ id: `pay-${p.id}`, time: p.created_at, type: "payment", description: `Payment ${fmtINR(Number(p.amount))} · ${p.gateway_name} · ${p.status}` })
    );
    data.complaints.forEach((c: any) =>
      items.push({ id: `comp-${c.id}`, time: c.created_at, type: "complaint", description: `Complaint ${c.complaint_number ?? ""} · ${c.severity}` })
    );
    return items.sort((a, b) => +new Date(b.time) - +new Date(a.time)).slice(0, 30).map((i) => ({ ...i, time: fmtDT(i.time) }));
  }, [data]);

  const c = data.customer;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-4">
        <SectionCard title="Profile">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <Field label="Name" value={c.name} />
            <Field label="Status" value={c.status} />
            <Field label="Email" value={c.primary_email} />
            <Field label="Mobile" value={c.primary_mobile} />
            <Field label="State" value={c.state} />
            <Field label="Language" value={c.language?.toUpperCase()} />
            <Field label="First seen" value={fmtD(c.first_seen_at)} />
            <Field label="Last seen" value={fmtD(c.last_seen_at)} />
          </dl>
          {c.notes && (
            <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--admin-border)" }}>
              <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--admin-fg-muted)" }}>Profile notes</div>
              <div className="text-sm whitespace-pre-wrap">{maskAadhaar(c.notes)}</div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Linked leads">
          {data.leads.length === 0 ? (
            <Empty label="No leads linked" />
          ) : (
            <div className="space-y-1.5">
              {data.leads.map((l: any) => (
                <Link
                  key={l.id}
                  to="/admin/leads/$leadId"
                  params={{ leadId: l.id }}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-[var(--admin-surface-2)]"
                  style={{ borderColor: "var(--admin-border)" }}
                >
                  <div>
                    <div className="font-medium text-sm font-mono">{l.lead_code ?? l.id.slice(0, 8)}</div>
                    <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                      {l.service} · {fmtD(l.created_at)} · {fmtINR(Number(l.total_amount))}
                    </div>
                  </div>
                  <StatusBadge status={l.status} />
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard title="Internal notes">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Add a private staff note…"
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent resize-none"
            style={{ borderColor: "var(--admin-border)" }}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>Staff-only · audited</div>
            <button
              disabled={!noteDraft.trim() || noteMut.isPending}
              onClick={() => noteMut.mutate()}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              style={{ background: "var(--admin-primary)" }}
            >
              {noteMut.isPending ? "Saving…" : "Save note"}
            </button>
          </div>
          <div className="space-y-2 pt-3">
            {data.notes.length === 0 ? (
              <Empty label="No notes yet" />
            ) : (
              data.notes.map((n: any) => (
                <div key={n.id} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--admin-border)" }}>
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                    <StickyNote className="size-3" /> {fmtDT(n.created_at)}
                  </div>
                  <div className="mt-1 text-sm whitespace-pre-wrap">{maskAadhaar(n.note)}</div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" action={<ActivityIcon className="size-3.5 opacity-60" />}>
          {timeline.length === 0 ? <Empty label="No activity yet" /> : <Timeline items={timeline} />}
        </SectionCard>
      </div>
    </div>
  );
}

function OrdersTab({ data }: { data: any }) {
  return (
    <SectionCard title={`Orders (${data.applications.length})`}>
      {data.applications.length === 0 ? (
        <Empty label="No orders yet" />
      ) : (
        <div className="space-y-1.5">
          {data.applications.map((a: any) => (
            <Link
              key={a.id}
              to="/admin/applications/$applicationId"
              params={{ applicationId: a.id }}
              className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 hover:bg-[var(--admin-surface-2)]"
              style={{ borderColor: "var(--admin-border)" }}
            >
              <div className="min-w-0">
                <div className="font-medium text-sm font-mono">{a.application_code ?? a.id.slice(0, 8)}</div>
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
  );
}

function ComplaintsTab({ data }: { data: any }) {
  return (
    <SectionCard title={`Complaints (${data.complaints.length})`}>
      {data.complaints.length === 0 ? (
        <Empty label="No complaints raised" />
      ) : (
        <div className="space-y-1.5">
          {data.complaints.map((c: any) => (
            <Link
              key={c.id}
              to="/admin/complaints/$complaintId"
              params={{ complaintId: c.id }}
              className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-[var(--admin-surface-2)]"
              style={{ borderColor: "var(--admin-border)" }}
            >
              <div>
                <div className="font-medium text-sm flex items-center gap-1.5">
                  <MessageSquareWarning className="size-3.5" />
                  {c.complaint_number ?? c.id.slice(0, 8)}
                </div>
                <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                  {c.category ?? "—"} · severity {c.severity} · {fmtD(c.created_at)}
                </div>
              </div>
              <StatusBadge status={c.status} />
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function PaymentsTab({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <SectionCard title={`Payments (${data.payments.length})`}>
        {data.payments.length === 0 ? (
          <Empty label="No payments captured" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="py-2 pr-3">When</th>
                  <th className="py-2 pr-3">Gateway</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p: any) => (
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

      <SectionCard title={`Invoices (${data.invoices.length})`}>
        {data.invoices.length === 0 ? (
          <Empty label="No invoices yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="py-2 pr-3">Invoice</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3 text-right">Amount</th>
                  <th className="py-2 pr-3">PDF</th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.map((i: any) => (
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
    </div>
  );
}

function DocumentsTab({ data }: { data: any }) {
  return (
    <SectionCard title={`Documents (${data.documents.length})`}>
      {data.documents.length === 0 ? (
        <Empty label="No documents uploaded" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">File</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Uploaded</th>
                <th className="py-2 pr-3">Verified</th>
              </tr>
            </thead>
            <tbody>
              {data.documents.map((d: any) => (
                <tr key={d.id} className="border-t" style={{ borderColor: "var(--admin-border)" }}>
                  <td className="py-2 pr-3 text-xs font-medium uppercase">{maskAadhaar(d.doc_type)}</td>
                  <td className="py-2 pr-3 text-xs">{maskAadhaar(d.file_name)}</td>
                  <td className="py-2 pr-3"><StatusBadge status={d.status} /></td>
                  <td className="py-2 pr-3 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{fmtDT(d.uploaded_at)}</td>
                  <td className="py-2 pr-3 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{fmtDT(d.verified_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function CommunicationTab({ data }: { data: any }) {
  return (
    <SectionCard title={`Emails (${data.emails.length})`}>
      {data.emails.length === 0 ? (
        <Empty label="No emails sent" />
      ) : (
        <div className="space-y-1.5">
          {data.emails.map((e: any) => (
            <div key={e.id} className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2" style={{ borderColor: "var(--admin-border)" }}>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{e.subject}</div>
                <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                  to {e.to_email} · {e.template_code ?? "ad-hoc"} · {fmtDT(e.sent_at)}
                </div>
              </div>
              <StatusBadge status={e.status} />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

/* ---------- bits ---------- */

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>{label}</dt>
      <dd className="mt-0.5 text-sm">{value || "—"}</dd>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="p-6 text-sm text-center italic" style={{ color: "var(--admin-fg-muted)" }}>{label}</div>;
}

function CopyBtn({ value }: { value: string }) {
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied"); }}
      className="p-0.5 rounded hover:bg-[var(--admin-surface-2)]"
      title="Copy"
    >
      <Copy className="size-3" style={{ color: "var(--admin-fg-muted)" }} />
    </button>
  );
}
