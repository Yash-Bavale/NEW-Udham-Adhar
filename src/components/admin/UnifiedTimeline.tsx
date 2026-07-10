import { useMemo, useState } from "react";
import {
  Activity, CreditCard, FileText, Mail, MessageSquare, GitCommit, Upload, FileCheck2, UserCog,
  Cog, AlarmClock,
} from "lucide-react";
import { formatIST } from "@/lib/datetime";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { STAGE_LABEL, TIMER_LABEL, AUTO_LABEL } from "@/lib/workflow/engine-view";

interface Props {
  events: any[];
  payments: any[];
  documents: any[];
  emailLogs?: any[];
  createdAt: string;
  hideMoney?: boolean;
  /** When provided, merges workflow_events (engine) into the timeline. */
  applicationId?: string;
}

type Item = {
  id: string;
  ts: string;
  icon: typeof Activity;
  tone: "blue" | "emerald" | "violet" | "amber" | "slate" | "rose";
  title: React.ReactNode;
  detail?: React.ReactNode;
  actor?: string | null;
};

const TONE: Record<Item["tone"], { ring: string; bg: string; fg: string }> = {
  blue:    { ring: "#bfdbfe", bg: "#eff6ff", fg: "#1d4ed8" },
  emerald: { ring: "#a7f3d0", bg: "#ecfdf5", fg: "#047857" },
  violet:  { ring: "#ddd6fe", bg: "#f5f3ff", fg: "#6d28d9" },
  amber:   { ring: "#fde68a", bg: "#fffbeb", fg: "#b45309" },
  slate:   { ring: "#e2e8f0", bg: "#f8fafc", fg: "#475569" },
  rose:    { ring: "#fecaca", bg: "#fff1f2", fg: "#be123c" },
};

function stripReply(s: string | null | undefined): string {
  if (!s) return "";
  return String(s).replace(/^\s*(re|fwd|fw)\s*:\s*/i, "");
}

export function UnifiedTimeline({ events, payments, documents, emailLogs, createdAt, hideMoney, applicationId }: Props) {
  const [showAll, setShowAll] = useState(false);
  const wf = useOrderWorkflow(applicationId ?? null);
  const workflowEvents = applicationId ? wf.events : [];

  const items: Item[] = useMemo(() => {
    const out: Item[] = [];

    out.push({
      id: `created-${createdAt}`,
      ts: createdAt,
      icon: GitCommit,
      tone: "blue",
      title: "Order created",
    });

    for (const p of payments ?? []) {
      const amt = Number(p.amount || 0);
      const isRefund = amt < 0 || p.status === "refunded";
      const amountStr = hideMoney ? "₹••••" : `₹${Math.abs(amt).toLocaleString("en-IN")}`;
      out.push({
        id: `pay-${p.id}`,
        ts: p.payment_date || p.created_at,
        icon: CreditCard,
        tone: isRefund ? "rose" : "emerald",
        title: isRefund ? "Refund processed" : "Payment received",
        detail: `${amountStr} · ${p.gateway_name ?? "—"} · ${String(p.status).replace(/_/g, " ")}`,
      });
    }

    for (const d of documents ?? []) {
      out.push({
        id: `doc-${d.id}`,
        ts: d.uploaded_at || d.created_at,
        icon: d.doc_type === "certificate" ? FileCheck2 : Upload,
        tone: d.doc_type === "certificate" ? "emerald" : "violet",
        title: d.doc_type === "certificate" ? "Certificate uploaded" : "Document uploaded",
        detail: `${d.doc_type?.replace(/_/g, " ")} · ${d.file_name}`,
      });
    }

    // Every email send/failure — surfaced from email_logs so the audit trail
    // shows the actual template + subject + status, not just "Email sent".
    const emailEventIds = new Set<string>();
    for (const l of emailLogs ?? []) {
      const status = String(l.status ?? "").toLowerCase();
      const failed = ["failed", "bounced", "dlq"].includes(status);
      const tone: Item["tone"] = failed ? "rose" : status === "sent" ? "blue" : "amber";
      const label = failed ? "Email failed" : status === "sent" ? "Email sent" : `Email ${status || "queued"}`;
      out.push({
        id: `mail-${l.id}`,
        ts: l.sent_at || l.created_at || l.queued_at,
        icon: Mail,
        tone,
        title: (
          <>
            {label}
            {l.template_code && (
              <span className="ml-1.5 font-mono text-[10.5px] px-1 py-0.5 rounded bg-slate-100 text-slate-600">
                {l.template_code}
              </span>
            )}
            {!l.template_code && (
              <span className="ml-1.5 font-mono text-[10.5px] px-1 py-0.5 rounded bg-rose-50 text-rose-700">
                NO_TEMPLATE
              </span>
            )}
            {l.template_exists === false && (
              <span className="ml-1.5 text-[10.5px] px-1 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                unmatched
              </span>
            )}
          </>
        ),
        detail: (
          <div className="space-y-0.5">
            <div className="text-slate-700">{stripReply(l.subject) || "(no subject)"}</div>
            {l.to_email && <div className="text-[11px] text-slate-500">To {l.to_email}</div>}
            {failed && l.error_message && (
              <div className="text-[11px] text-rose-600">Error: {String(l.error_message).slice(0, 200)}</div>
            )}
          </div>
        ),
      });
    }

    for (const e of events ?? []) {
      let icon: typeof Activity = Activity;
      let tone: Item["tone"] = "slate";
      let title: React.ReactNode = String(e.event_type).replace(/_/g, " ");
      let detail: React.ReactNode = null;

      if (e.event_type === "status_change") {
        icon = GitCommit;
        tone = "blue";
        title = (
          <>
            Status changed <span className="opacity-60">·</span>{" "}
            <span className="font-mono text-[11px] opacity-80">{e.old_value ?? "—"}</span>
            {" → "}
            <span className="font-mono text-[11px]">{e.new_value}</span>
          </>
        );
      } else if (e.event_type === "assignment_change") {
        icon = UserCog; tone = "violet"; title = "Assignee updated";
        detail = e.old_value || e.new_value
          ? <span className="text-[11px]">{e.old_value ?? "Unassigned"} → {e.new_value ?? "Unassigned"}</span>
          : null;
      } else if (e.event_type === "note_added") {
        icon = MessageSquare; tone = "amber"; title = "Internal note";
        detail = <span className="whitespace-pre-wrap">{e.note}</span>;
      } else if (e.event_type === "email_sent") {
        // Deduped — the email_logs loop above already added a rich entry for this send.
        emailEventIds.add(String(e.id));
        continue;
      } else if (e.event_type === "document_uploaded") {
        icon = Upload; tone = "violet"; title = "Document uploaded";
      } else if (e.event_type === "form_submitted") {
        icon = FileText; tone = "emerald"; title = "Form submitted";
      }

      if (e.note && !detail) detail = <span className="whitespace-pre-wrap text-[11px]">{e.note}</span>;

      out.push({
        id: `ev-${e.id}`,
        ts: e.created_at,
        icon,
        tone,
        title,
        detail,
        actor: e.staff_name ?? null,
      });
    }

    out.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    return out;
  }, [events, payments, documents, emailLogs, createdAt, hideMoney]);

  const visible = showAll ? items : items.slice(0, 12);

  return (
    <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--admin-border)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="size-4" style={{ color: "var(--admin-fg-muted)" }} />
          <h3 className="text-sm font-semibold">Timeline</h3>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
            style={{ background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" }}
          >
            {items.length}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="text-xs italic" style={{ color: "var(--admin-fg-muted)" }}>
          No activity yet.
        </div>
      ) : (
        <ol className="relative">
          <span
            aria-hidden
            className="absolute left-[14px] top-2 bottom-2 w-px"
            style={{ background: "var(--admin-border)" }}
          />
          {visible.map((it) => {
            const tone = TONE[it.tone];
            const Icon = it.icon;
            return (
              <li key={it.id} className="relative pl-9 pb-4 last:pb-0">
                <span
                  className="absolute left-0 top-0 size-[30px] rounded-full flex items-center justify-center border-2"
                  style={{ background: tone.bg, color: tone.fg, borderColor: tone.ring }}
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="text-[13px] leading-snug" style={{ color: "var(--admin-fg)" }}>
                  {it.title}
                </div>
                {it.detail && (
                  <div className="text-xs mt-0.5" style={{ color: "var(--admin-fg-muted)" }}>
                    {it.detail}
                  </div>
                )}
                <div className="text-[10.5px] mt-1" style={{ color: "var(--admin-fg-subtle)" }}>
                  {formatIST(it.ts)}
                  {it.actor && <> · by {it.actor}</>}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {items.length > 12 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 text-xs font-medium text-blue-600 hover:underline"
        >
          {showAll ? "Show less" : `Show ${items.length - 12} earlier events`}
        </button>
      )}
    </div>
  );
}
