import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ClipboardList,
  IndianRupee,
  Award,
  Activity,
  Copy,
  User2,
  Phone,
  Mail,
  MapPin,
  Hash,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { getApplicationDetail } from "@/lib/crm/applications.functions";
import { getOrderDetail } from "@/lib/crm/orders.functions";
import { getApplicationDocChecklist } from "@/lib/crm/document-review.functions";
import { StatusTransition } from "@/components/admin/StatusTransition";
import { AdminOnboardingPanel } from "@/components/admin/AdminOnboardingPanel";
import { LeadFinanceTab } from "@/components/admin/LeadFinanceTab";
import { LeadTimeline } from "@/components/admin/LeadTimeline";
import { OrderJourney } from "@/components/admin/OrderJourney";
import { InternalNotesTimeline } from "@/components/admin/InternalNotesTimeline";
import { CancellationPanel } from "@/components/admin/CancellationPanel";

export const Route = createFileRoute("/admin/applications/$applicationId")({
  head: () => ({ meta: [{ title: "Application — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ApplicationCommandCenter,
});

type Tab = "onboarding" | "finance" | "certificates" | "timeline";

function DocChecklistPanel({ applicationId }: { applicationId: string }) {
  const fetchFn = useServerFn(getApplicationDocChecklist);
  const { data } = useQuery({
    queryKey: ["admin.application.doc-checklist", applicationId],
    queryFn: () => fetchFn({ data: { applicationId } }),
  });
  const items = data?.items ?? [];
  const stats = data?.stats;
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
          Documents
        </div>
        {stats && (
          <span className="text-[10px] font-mono" style={{ color: "var(--admin-fg-muted)" }}>
            {stats.approved}/{stats.total} approved
          </span>
        )}
      </div>
      {stats && (
        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "var(--admin-surface-2)" }}>
          <div
            className="h-full transition-all"
            style={{ width: `${stats.completionPct}%`, background: "var(--admin-success)" }}
          />
        </div>
      )}
      <ul className="mt-2 space-y-1">
        {items.length === 0 && (
          <li className="text-[11px] italic" style={{ color: "var(--admin-fg-muted)" }}>
            No documents required.
          </li>
        )}
        {items.map((i: any) => {
          const status = i.doc?.status ?? "missing";
          const tone =
            status === "approved"
              ? "var(--admin-success)"
              : status === "rejected"
              ? "var(--admin-danger)"
              : status === "re_upload_requested"
              ? "var(--admin-warn)"
              : "var(--admin-fg-subtle)";
          return (
            <li key={i.key} className="flex items-center gap-2 text-xs">
              <span className="size-1.5 rounded-full" style={{ background: tone }} />
              <span className="flex-1 truncate" style={{ color: "var(--admin-fg)" }}>{i.label}</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
                {status.replace(/_/g, " ")}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


function ApplicationCommandCenter() {
  const { applicationId } = Route.useParams();
  const fetchFn = useServerFn(getApplicationDetail);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin.application", applicationId],
    queryFn: () => fetchFn({ data: { applicationId } }),
  });

  const [tab, setTab] = useState<Tab>("onboarding");

  if (isLoading) {
    return (
      <div className="p-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>
        Loading application…
      </div>
    );
  }
  if (!data) return null;
  const { application, lead, certificates } = data as any;

  return (
    <div className="space-y-4">
      {/* Breadcrumb + status header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          to="/admin/applications"
          className="inline-flex items-center gap-1 text-xs hover:underline"
          style={{ color: "var(--admin-fg-muted)" }}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Applications
        </Link>
        <StatusTransition
          kind="application"
          entityId={applicationId}
          current={application.application_status}
          onChanged={refetch}
        />
      </div>

      {/* Journey stepper */}
      <JourneyTimeline current={application.application_status} />

      {/* 3-column command center */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4">
        {/* LEFT RAIL */}
        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <Panel>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
                  Application
                </div>
                <div className="font-mono text-sm font-semibold mt-0.5" style={{ color: "var(--admin-fg)" }}>
                  {application.application_code ?? application.id.slice(0, 8)}
                </div>
              </div>
              <CopyBtn value={application.application_code ?? application.id} />
            </div>
            <Divider />
            <Row icon={Calendar} label="Created" value={fmt(application.created_at)} />
            <Row icon={Clock} label="Updated" value={fmt(application.updated_at)} />
            <Row icon={Hash} label="Service" value={(lead?.service ?? "—").toUpperCase()} mono />
          </Panel>

          {lead && (
            <Panel>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
                Customer
              </div>
              <Link
                to="/admin/leads/$leadId"
                params={{ leadId: lead.id }}
                className="block mt-1 font-semibold text-sm hover:underline"
                style={{ color: "var(--admin-fg)" }}
              >
                {lead.name}
              </Link>
              <div className="text-[11px] font-mono mt-0.5" style={{ color: "var(--admin-fg-muted)" }}>
                {lead.lead_code}
              </div>
              <Divider />
              <Row icon={Mail} label="Email" value={lead.email} small />
              <Row icon={Phone} label="Mobile" value={lead.mobile} small />
              <Row icon={MapPin} label="State" value={lead.state} small />
              <Row icon={User2} label="Language" value={lead.language?.toUpperCase()} small />
            </Panel>
          )}

          <Panel>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
              Progress
            </div>
            <div className="mt-2 space-y-1.5">
              <ProgressRow
                label="Form"
                done={["submitted", "completed", "approved"].includes(String(application.form_status))}
                value={application.form_status}
              />
              <ProgressRow
                label="Documents"
                done={["submitted", "verified", "approved"].includes(String(application.document_status))}
                value={application.document_status}
              />
              <ProgressRow
                label="Certificate"
                done={certificates.length > 0}
                value={certificates.length > 0 ? "uploaded" : "pending"}
              />
            </div>
          </Panel>

          <DocChecklistPanel applicationId={applicationId} />

          <CancellationPanel
            applicationId={applicationId}
            closureStage={application.closure_stage}
            closureNextAt={application.closure_next_at}
            cancellationRequestedAt={application.cancellation_requested_at}
          />
        </aside>


        {/* MAIN PANEL */}
        <main className="space-y-3 min-w-0">
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
          >
            <nav
              className="flex items-center gap-0.5 px-2 py-2 border-b overflow-x-auto"
              style={{ borderColor: "var(--admin-border)" }}
            >
              <TabBtn active={tab === "onboarding"} onClick={() => setTab("onboarding")} icon={ClipboardList} label="Onboarding" />
              <TabBtn active={tab === "finance"} onClick={() => setTab("finance")} icon={IndianRupee} label="Finance" />
              <TabBtn active={tab === "certificates"} onClick={() => setTab("certificates")} icon={Award} label={`Certificates (${certificates.length})`} />
              <TabBtn active={tab === "timeline"} onClick={() => setTab("timeline")} icon={Activity} label="Activity" />
            </nav>

            <div className="p-4">
              {tab === "onboarding" && lead && <AdminOnboardingPanel leadId={lead.id} />}
              {tab === "finance" && lead && <LeadFinanceTab leadId={lead.id} />}
              {tab === "certificates" && <CertificatesTable certificates={certificates} />}
              {tab === "timeline" && lead && <LeadTimeline leadId={lead.id} />}
            </div>
          </div>
        </main>

        {/* RIGHT ACTIVITY RAIL */}
        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <Panel>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
              Quick actions
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {lead && (
                <QuickLink to="/admin/leads/$leadId" params={{ leadId: lead.id }} label="Open Lead" />
              )}
              <QuickLink to="/admin/review" label="Document review queue" />
              <QuickLink to="/admin/applications" label="All applications" />
            </div>
          </Panel>

          {lead && (
            <Panel className="max-h-[60vh] overflow-y-auto">
              <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--admin-fg-muted)" }}>
                Recent activity
              </div>
              <LeadTimeline leadId={lead.id} />
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------- bits ---------- */

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border p-3 ${className ?? ""}`}
      style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-2 h-px" style={{ background: "var(--admin-border)" }} />;
}

function Row({
  icon: Icon, label, value, mono, small,
}: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value?: string | null; mono?: boolean; small?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <Icon className="w-3 h-3 shrink-0" style={{ color: "var(--admin-fg-subtle)" }} />
      <span className="text-[10px] uppercase tracking-wider w-16 shrink-0" style={{ color: "var(--admin-fg-muted)" }}>
        {label}
      </span>
      <span
        className={`text-xs truncate ${mono ? "font-mono" : ""} ${small ? "text-[11px]" : ""}`}
        style={{ color: "var(--admin-fg)" }}
        title={value ?? ""}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function ProgressRow({ label, done, value }: { label: string; done: boolean; value?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {done ? (
        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--admin-success)" }} />
      ) : (
        <FileCheck2 className="w-3.5 h-3.5" style={{ color: "var(--admin-fg-subtle)" }} />
      )}
      <span className="flex-1" style={{ color: "var(--admin-fg)" }}>{label}</span>
      <span
        className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
        style={{ background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}
      >
        {(value ?? "—").replace(/_/g, " ")}
      </span>
    </div>
  );
}

function TabBtn({
  active, onClick, icon: Icon, label,
}: { active: boolean; onClick: () => void; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors"
      style={{
        background: active ? "var(--admin-surface-2)" : "transparent",
        color: active ? "var(--admin-fg)" : "var(--admin-fg-muted)",
      }}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function CopyBtn({ value }: { value: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success("Copied");
      }}
      className="p-1 rounded hover:bg-[var(--admin-surface-2)]"
      title="Copy"
    >
      <Copy className="w-3 h-3" style={{ color: "var(--admin-fg-muted)" }} />
    </button>
  );
}

function QuickLink({ to, params, label }: { to: any; params?: any; label: string }) {
  return (
    <Link
      to={to}
      params={params}
      className="text-xs px-2.5 py-1.5 rounded-md hover:bg-[var(--admin-surface-2)] transition-colors"
      style={{ color: "var(--admin-fg)" }}
    >
      {label}
    </Link>
  );
}

function CertificatesTable({ certificates }: { certificates: any[] }) {
  if (certificates.length === 0) {
    return (
      <div className="p-8 text-sm text-center italic" style={{ color: "var(--admin-fg-muted)" }}>
        No certificates uploaded yet.
      </div>
    );
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
          <th className="text-left py-2">Number</th>
          <th className="text-left">File</th>
          <th className="text-left">Issued</th>
          <th className="text-left">Delivered</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {certificates.map((c: any) => (
          <tr key={c.id}>
            <td className="py-2 font-mono text-xs" style={{ color: "var(--admin-fg)" }}>{c.certificate_number || "—"}</td>
            <td className="text-xs" style={{ color: "var(--admin-fg)" }}>{c.file_name}</td>
            <td className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>{fmt(c.issued_at)}</td>
            <td className="text-xs">
              <span
                className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--admin-surface-2)",
                  color: c.delivered_at ? "var(--admin-success)" : "var(--admin-fg-muted)",
                }}
              >
                {c.delivered_at ? "Delivered" : "Pending"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function fmt(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

