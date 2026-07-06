// Unified Customer Journey Map — driven by the same `OrderStage` that
// powers Employee Actions (stageActionMap). This guarantees the highlighted
// step here always matches the primary CTA above.
import {
  User, CreditCard, PhoneCall, FileText, Inbox, ShieldCheck, Landmark, Cog,
  Award, Trophy, AlertTriangle, Ban, Clock, ArrowRight, Check,
} from "lucide-react";
import type { OrderStage } from "@/lib/crm/computeOrderStage";

type ClosureStage =
  | "none" | "request_received" | "closed"
  | "concern_reply_sent" | "final_ticket_closed"
  | "refund_reviewed" | "acknowledged"
  | "closure_pending" | "notice_sent" | string;

/**
 * Canonical journey nodes. Every OrderStage maps to exactly one node so the
 * strip position is deterministic and cannot drift from Employee Actions.
 */
type NodeKey =
  | "lead" | "payment" | "consultation" | "form"
  | "docs" | "verification" | "govt" | "processing" | "completed";

const NODES: { key: NodeKey; label: string; icon: any }[] = [
  { key: "lead",          label: "Lead",         icon: User },
  { key: "payment",       label: "Payment",      icon: CreditCard },
  { key: "consultation",  label: "Consultation", icon: PhoneCall },
  { key: "form",          label: "Form",         icon: FileText },
  { key: "docs",          label: "Docs",         icon: Inbox },
  { key: "verification",  label: "Verification", icon: ShieldCheck },
  { key: "govt",          label: "Govt Portal",  icon: Landmark },
  { key: "processing",    label: "Certificate",  icon: Award },
  { key: "completed",     label: "Completed",    icon: Trophy },
];

const STAGE_TO_NODE: Record<OrderStage, NodeKey | null> = {
  lead_received:        "lead",
  payment_pending:      "lead",
  payment_done:         "payment",
  consultation_pending: "consultation",
  form_submitted:       "form",
  in_progress:          "docs",
  under_review:         "verification",
  submitted_to_govt:    "govt",
  under_processing:     "processing",
  certificate_ready:    "processing",
  completed:            "completed",
  uninterested:         null,
  refund_requested:     null,
  refunded:             null,
};

const CANCEL_STEPS: { key: ClosureStage; label: string; n: number }[] = [
  { key: "request_received",   label: "Step 1 · Request",    n: 1 },
  { key: "closed",             label: "Step 2 · Closed",     n: 2 },
  { key: "concern_reply_sent", label: "Step 3 · Reply",      n: 3 },
  { key: "final_ticket_closed",label: "Step 4 · Ticket",     n: 4 },
  { key: "refund_reviewed",    label: "Step 5 · Refund",     n: 5 },
  { key: "acknowledged",       label: "Step 6 · Ack",        n: 6 },
];

export function CustomerJourneyMap({
  stage,
  isConsultationOrder,
  workflowStatus,
  closureStage,
  closureNextAt,
  closureReasonLabel,
}: {
  stage: OrderStage;
  isConsultationOrder?: boolean;
  workflowStatus?: string | null;
  closureStage?: ClosureStage | null;
  closureNextAt?: string | null;
  closureReasonLabel?: string | null;
}) {
  const cs = (closureStage ?? "none") as ClosureStage;
  const cancelActive = cs !== "none";
  const externalDelay = !!workflowStatus && /delay|external|pending_closure/i.test(workflowStatus);

  // Hide the Consultation node for non-consultation orders unless the current
  // stage IS the consultation stage (defensive fallback).
  const nodes = NODES.filter(
    (n) => n.key !== "consultation" || isConsultationOrder || stage === "consultation_pending",
  );

  const currentNode = STAGE_TO_NODE[stage];
  const currentIdx = currentNode ? nodes.findIndex((n) => n.key === currentNode) : -1;
  const cancelStepIdx = CANCEL_STEPS.findIndex((s) => s.key === cs);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end gap-3 text-[10.5px] font-medium">
        <Legend color="emerald" label="Completed" />
        <Legend color="indigo" label="Current" />
        <Legend color="slate" label="Upcoming" />
      </div>

      {/* Happy-path strip */}
      <div className="relative">
        <div className={`flex items-start justify-between gap-1 overflow-x-auto pb-2 ${cancelActive ? "opacity-60" : ""}`}>
          {nodes.map((s, i) => {
            const done = currentIdx > i || (currentIdx === i && s.key === "completed");
            const active = !cancelActive && i === currentIdx && s.key !== "completed";
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex items-start gap-1 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-[70px]">
                  <div className="relative">
                    <div
                      className={`size-11 rounded-full grid place-items-center transition-all ${
                        done ? "bg-emerald-500 text-white shadow-sm"
                        : active ? "bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100"
                        : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                    </div>
                    {active && (
                      <span className="absolute inset-0 size-11 rounded-full ring-2 ring-indigo-400 animate-ping opacity-40" />
                    )}
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight whitespace-nowrap ${
                    done ? "text-slate-900" : active ? "text-indigo-700" : "text-slate-500"
                  }`}>
                    {s.label}
                  </span>
                  {active && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white -mt-0.5">
                      Current
                    </span>
                  )}
                </div>
                {i < nodes.length - 1 && (
                  <div className="flex items-center h-11 flex-1 min-w-[24px]">
                    <div
                      className={`h-0.5 w-full ${
                        i < currentIdx ? "bg-emerald-400"
                        : i === currentIdx ? "bg-gradient-to-r from-emerald-400 to-slate-200"
                        : "bg-slate-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* External delay lane */}
      {externalDelay && (
        <Lane title="External / processing delay" tone="amber">
          <div className="flex items-center gap-2 text-[12px] text-amber-900">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <span>
              Workflow paused — status: <b className="font-mono">{workflowStatus}</b>. Customer
              is receiving Service Processing Update cadence.
            </span>
          </div>
        </Lane>
      )}

      {/* Cancellation lane */}
      {cancelActive && (
        <Lane title="Cancellation & Refund" tone="rose">
          <div className="space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {CANCEL_STEPS.map((s, i) => {
                const active = cancelStepIdx >= 0 && i <= cancelStepIdx;
                return (
                  <div key={`${s.key}-${i}`} className="flex items-center gap-1 flex-shrink-0">
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        active
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      {s.label}
                    </div>
                    {i < CANCEL_STEPS.length - 1 && (
                      <ArrowRight className={`size-3 ${active ? "text-rose-400" : "text-slate-300"}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-rose-900">
              <span className="inline-flex items-center gap-1">
                <Ban className="size-3" /> Current: <b>{cs}</b>
              </span>
              {closureReasonLabel && <span>Reason: <b>{closureReasonLabel}</b></span>}
              {closureNextAt && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" /> Next auto-step:{" "}
                  <b className="font-mono">
                    {new Date(closureNextAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </b>
                </span>
              )}
            </div>
          </div>
        </Lane>
      )}
    </div>
  );
}

function Lane({ title, tone, children }: { title: string; tone: "amber" | "rose"; children: React.ReactNode }) {
  const ring = tone === "amber" ? "border-amber-200 bg-amber-50/50" : "border-rose-200 bg-rose-50/50";
  const pill = tone === "amber" ? "text-amber-700" : "text-rose-700";
  return (
    <div className={`rounded-xl border ${ring} p-3`}>
      <div className={`text-[10px] uppercase tracking-[0.14em] font-semibold mb-2 ${pill}`}>{title}</div>
      {children}
    </div>
  );
}

// Cog was imported for symmetry with the "processing" step name;
// kept unused-safe by re-exporting via reference.
void Cog;

function Legend({ color, label }: { color: "emerald" | "indigo" | "slate"; label: string }) {
  const c = color === "emerald" ? "bg-emerald-500" : color === "indigo" ? "bg-indigo-600" : "bg-slate-300";
  return (
    <span className="inline-flex items-center gap-1 text-slate-600">
      <span className={`size-2 rounded-full ${c}`} />
      {label}
    </span>
  );
}
