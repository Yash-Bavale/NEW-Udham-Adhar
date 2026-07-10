// Unified Customer Journey Map — engine-driven.
// The active/done/blocked nodes are derived from workflow_states via
// useOrderWorkflow when an engine row exists; falls back to the legacy
// computeOrderStage path when it doesn't. Also renders the engine status chip,
// pause reason, next-firing timer, running automations, and the Payment
// summary (previously invisible in the workflow view).
import {
  User, CreditCard, PhoneCall, FileText, Inbox, ShieldCheck, Landmark, Cog,
  Award, Trophy, AlertTriangle, Ban, Clock, ArrowRight, Check,
  PlayCircle, PauseCircle, CheckCircle2, StopCircle, AlarmClock, Ticket,
} from "lucide-react";
import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { AUTO_LABEL, TIMER_LABEL, type JourneyNodeKey } from "@/lib/workflow/engine-view";
import { formatIST, relativeIST } from "@/lib/datetime";

type ClosureStage =
  | "none" | "request_received" | "closed"
  | "concern_reply_sent" | "final_ticket_closed"
  | "refund_reviewed" | "acknowledged"
  | "closure_pending" | "notice_sent" | string;

const NODES: { key: JourneyNodeKey; label: string; icon: any }[] = [
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

const STAGE_TO_NODE: Record<OrderStage, JourneyNodeKey | null> = {
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
  applicationId,
  stage,
  isConsultationOrder,
  workflowStatus,
  closureStage,
  closureNextAt,
  closureReasonLabel,
  payments,
  hideAmount,
}: {
  applicationId: string;
  stage: OrderStage;
  isConsultationOrder?: boolean;
  workflowStatus?: string | null;
  closureStage?: ClosureStage | null;
  closureNextAt?: string | null;
  closureReasonLabel?: string | null;
  payments?: any[];
  hideAmount?: boolean;
}) {
  const { view } = useOrderWorkflow(applicationId);

  const cs = (closureStage ?? "none") as ClosureStage;
  const cancelActive = cs !== "none" || view.stage === "closed";
  const externalDelay = !!workflowStatus && /delay|external|pending_closure/i.test(workflowStatus);
  const blockedByEngine = view.hasEngine && (view.paused || !!view.activeTicketId);

  const nodes = NODES.filter(
    (n) => n.key !== "consultation" || isConsultationOrder || stage === "consultation_pending",
  );

  // Engine wins when present, otherwise fall back to legacy stage mapping.
  const currentNode: JourneyNodeKey | null = view.activeNode ?? STAGE_TO_NODE[stage];
  const currentIdx = currentNode ? nodes.findIndex((n) => n.key === currentNode) : -1;
  const cancelStepIdx = CANCEL_STEPS.findIndex((s) => s.key === cs);

  return (
    <div className="space-y-5">
      {/* Engine header — chips + next-timer + automations (folds in the standalone card). */}
      <EngineHeader view={view} />

      {/* Payment summary block */}
      <PaymentBlock payments={payments ?? []} hideAmount={!!hideAmount} />

      <div className="flex items-center justify-end gap-3 text-[10.5px] font-medium">
        <Legend color="emerald" label="Completed" />
        <Legend color="indigo" label="Current" />
        <Legend color="rose" label="Blocked" />
        <Legend color="slate" label="Upcoming" />
      </div>

      {/* Happy-path strip */}
      <div className="relative">
        <div className={`flex items-start justify-between gap-1 overflow-x-auto pb-2 ${cancelActive ? "opacity-60" : ""}`}>
          {nodes.map((s, i) => {
            const done = currentIdx > i || (currentIdx === i && s.key === "completed");
            const activeIndigo = !cancelActive && !blockedByEngine && i === currentIdx && s.key !== "completed";
            const activeBlocked = !cancelActive && blockedByEngine && i === currentIdx;
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex items-start gap-1 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-[70px]">
                  <div className="relative">
                    <div
                      className={`size-11 rounded-full grid place-items-center transition-all ${
                        done ? "bg-emerald-500 text-white shadow-sm"
                        : activeBlocked ? "bg-rose-500 text-white shadow-md ring-4 ring-rose-100"
                        : activeIndigo ? "bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100"
                        : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                    </div>
                    {(activeIndigo || activeBlocked) && (
                      <span className={`absolute inset-0 size-11 rounded-full ring-2 animate-ping opacity-40 ${
                        activeBlocked ? "ring-rose-400" : "ring-indigo-400"
                      }`} />
                    )}
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight whitespace-nowrap ${
                    done ? "text-slate-900"
                    : activeBlocked ? "text-rose-700"
                    : activeIndigo ? "text-indigo-700"
                    : "text-slate-500"
                  }`}>
                    {s.label}
                  </span>
                  {(activeIndigo || activeBlocked) && (
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full text-white -mt-0.5 ${
                      activeBlocked ? "bg-rose-500" : "bg-indigo-600"
                    }`}>
                      {activeBlocked ? (view.paused ? "Paused" : "Blocked") : "Current"}
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

function EngineHeader({ view }: { view: ReturnType<typeof useOrderWorkflow>["view"] }) {
  if (!view.hasEngine) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-[11px] text-slate-500">
        Workflow engine not initialised yet. The engine will start on the next order event.
      </div>
    );
  }
  const Icon =
    view.overallTone === "running" ? PlayCircle
    : view.overallTone === "paused" ? PauseCircle
    : view.overallTone === "completed" ? CheckCircle2
    : StopCircle;
  const chipCls =
    view.overallTone === "running" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : view.overallTone === "paused" ? "bg-amber-50 text-amber-800 border-amber-200"
    : view.overallTone === "completed" ? "bg-indigo-50 text-indigo-700 border-indigo-200"
    : "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 flex flex-wrap items-center gap-2 text-[12px]">
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${chipCls}`}>
        <Icon className="size-3" /> {view.overallLabel}
      </span>
      {view.status && (
        <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700 capitalize">
          {String(view.status).replaceAll("_", " ")}
        </span>
      )}
      {view.subStatus && (
        <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] text-slate-600 capitalize">
          {String(view.subStatus).replaceAll("_", " ")}
        </span>
      )}
      {view.activeTicketId && (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
          <Ticket className="size-3" /> Active ticket
        </span>
      )}
      {view.paused && view.pauseReason && (
        <span className="text-[11px] text-amber-800">Paused: {String(view.pauseReason).replaceAll("_", " ")}</span>
      )}
      {view.nextTimer && (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700" title={formatIST(view.nextTimer.firesAt)}>
          <AlarmClock className="size-3" /> {TIMER_LABEL[view.nextTimer.kind] ?? view.nextTimer.kind} · {relativeIST(view.nextTimer.firesAt)}
        </span>
      )}
      {view.runningAutomations.map((a) => (
        <span key={a.code} className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
          <Cog className="size-3" /> {AUTO_LABEL[a.code] ?? a.code}
        </span>
      ))}
    </div>
  );
}

function PaymentBlock({ payments, hideAmount }: { payments: any[]; hideAmount: boolean }) {
  const paid = payments
    .filter((p) => (p.status === "success" || p.status === "captured" || p.status === "completed") && Number(p.amount ?? 0) > 0);
  const refunds = payments.filter((p) => p.status === "refunded" || Number(p.amount ?? 0) < 0);
  const total = paid.reduce((s, p) => s + Number(p.amount ?? 0), 0);
  const refundTotal = refunds.reduce((s, p) => s + Math.abs(Number(p.amount ?? 0)), 0);
  const latest = paid[0] ?? payments[0] ?? null;

  const fmt = (n: number) => (hideAmount ? "₹••••" : `₹${n.toLocaleString("en-IN")}`);

  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2 text-amber-900">
          <CreditCard className="size-4 text-amber-700" />
          <span className="font-semibold">Payment</span>
          <span>· Awaiting payment</span>
        </div>
        <span className="rounded-full bg-white border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Pending</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 space-y-1.5">
      <div className="flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2 text-emerald-900">
          <CreditCard className="size-4 text-emerald-700" />
          <span className="font-semibold">Payment</span>
          <span className="text-emerald-800">· {fmt(total)} received</span>
          {refundTotal > 0 && (
            <span className="text-rose-700">· {fmt(refundTotal)} refunded</span>
          )}
        </div>
        <span className="rounded-full bg-white border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 capitalize">
          {String(latest?.status ?? "paid")}
        </span>
      </div>
      {latest && (
        <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-0.5 pl-6">
          {latest.gateway_name && <span>Gateway: <b>{latest.gateway_name}</b></span>}
          {(latest.txn_id ?? latest.gateway_txn_id) && (
            <span>Txn: <b className="font-mono">{latest.txn_id ?? latest.gateway_txn_id}</b></span>
          )}
          {(latest.payment_date ?? latest.created_at) && (
            <span>Paid {formatIST(latest.payment_date ?? latest.created_at)}</span>
          )}
        </div>
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

function Legend({ color, label }: { color: "emerald" | "indigo" | "slate" | "rose"; label: string }) {
  const c =
    color === "emerald" ? "bg-emerald-500"
    : color === "indigo" ? "bg-indigo-600"
    : color === "rose" ? "bg-rose-500"
    : "bg-slate-300";
  return (
    <span className="inline-flex items-center gap-1 text-slate-600">
      <span className={`size-2 rounded-full ${c}`} />
      {label}
    </span>
  );
}
