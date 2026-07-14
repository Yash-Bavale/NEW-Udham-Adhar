// Unified Customer Journey Map — 4 independent tracks:
//   🟢 Main Journey · 🟡 Delay Flow · 🔴 Closure Flow · 🔵 Support Ticket Flow
// Each track is self-contained so pausing / delaying / closing never hides
// the accumulated progress on the main path.

import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, Ticket, AlertTriangle, ShieldAlert, CreditCard,
  User, FileText, Landmark, Trophy, ClipboardCheck, Inbox, PauseCircle,
  Clock, XCircle,
} from "lucide-react";

import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { formatIST, relativeIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";

import {
  JOURNEY_STAGES, JOURNEY_BRANCHES, TICKET_BUTTONS, CLOSURE_BUTTONS, FORCE_CLOSE_BUTTON,
  stageToJourneyIndex, getActiveDelayBranchKey,
  type JourneyBranch, type JourneyActionKind, type JourneyStageKey,
} from "@/lib/orders/journey-map";

import { JourneyActionButton } from "./JourneyActionButton";
import { ExternalDelayDialog } from "@/components/admin/ExternalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";

import { sendFormLink, markSubmittedToGovt, sendManualReminder, completeOrder } from "@/lib/orders/order-actions.functions";
import { handleGovtRejected } from "@/lib/orders/actions/close-actions.functions";
import { listCloseReasons } from "@/lib/orders/actions/reasons.functions";
import { updateFulfillmentStatus } from "@/lib/crm/orders-v2.functions";

const STAGE_ICON = {
  lead_received:    User,
  payment_received: CreditCard,
  order_received:   Inbox,
  form_submitted:   FileText,
  app_submitted:    Landmark,
  check_status:     ClipboardCheck,
  completed:        Trophy,
} as const;

interface Props {
  applicationId: string;
  stage: OrderStage;
  isConsultationOrder?: boolean;
  serviceCode?: string | null;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  closureReasonLabel?: string | null;
  payments?: any[];
  hideAmount?: boolean;
}

const TONE_MAP = {
  amber:   { border: "border-amber-300",   bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-400"   },
  rose:    { border: "border-rose-300",    bg: "bg-rose-50",    text: "text-rose-700",    ring: "ring-rose-400"    },
  sky:     { border: "border-sky-300",     bg: "bg-sky-50",     text: "text-sky-700",     ring: "ring-sky-400"     },
  violet:  { border: "border-violet-300",  bg: "bg-violet-50",  text: "text-violet-700",  ring: "ring-violet-400"  },
  emerald: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-400" },
};

type FlowItem = JourneyBranch & {
  lineLabel?: "Main" | "Delay" | "Closure" | "Ticket";
  note?: ReactNode;
};

export function CustomerJourneyMap(p: Props) {
  const qc = useQueryClient();
  const { view } = useOrderWorkflow(p.applicationId);
  const currentIdx = stageToJourneyIndex(p.stage);
  const isTalkToExpert = /talk|expert|consult/i.test(p.serviceCode ?? "") || !!p.isConsultationOrder;
  const ticketActive = !!view.activeTicketId;
  const closureStageValue = (p.closureStage ?? "").toLowerCase();
  const closed = view.stage === "closed" || /^(closed|auto_closed|force_closed|order_closed)$/.test(closureStageValue);
  const closureArmed = !!p.closureStage && p.closureStage !== "none" && !closed;

  const activeDelayKey = useMemo(
    () => getActiveDelayBranchKey(p.workflowStatus),
    [p.workflowStatus],
  );
  const currentStageKey = JOURNEY_STAGES[Math.min(Math.max(currentIdx, 0), JOURNEY_STAGES.length - 1)]?.key ?? "order_received";

  const flowByStage = useMemo(() => {
    const byKey = new Map(JOURNEY_BRANCHES.map((b) => [b.key, b]));
    const stageMap: Record<JourneyStageKey, FlowItem[]> = {
      lead_received: [],
      payment_received: [],
      order_received: [],
      form_submitted: [],
      app_submitted: [],
      check_status: [],
      completed: [],
    };

    const timerNote = closureArmed && (p.closureNextAt || p.closureReasonLabel) ? (
      <>
        {p.closureNextAt && <span>Auto-close {relativeIST(p.closureNextAt)} · {formatIST(p.closureNextAt)}</span>}
        {p.closureReasonLabel && <span>Reason: <b>{p.closureReasonLabel}</b></span>}
      </>
    ) : null;

    const push = (stage: JourneyStageKey, item: FlowItem | undefined | null) => {
      if (item) stageMap[stage].push(item);
    };

    const formPending = byKey.get("form-not-submitted");
    if (formPending) {
      push("order_received", {
        ...formPending,
        lineLabel: "Delay",
        note: activeDelayKey === formPending.key ? timerNote : null,
      });
    }

    const customerDelay = byKey.get("customer-side-delay");
    if (customerDelay) {
      push("form_submitted", {
        ...customerDelay,
        lineLabel: "Delay",
        note: activeDelayKey === customerDelay.key ? timerNote : null,
      });
    }

    const technicalDelay = byKey.get("technical-delay");
    if (technicalDelay) {
      push("form_submitted", {
        ...technicalDelay,
        lineLabel: "Delay",
        note: activeDelayKey === technicalDelay.key ? timerNote : null,
      });
    }

    const appSubmitted = byKey.get("app-submitted-actions");
    if (appSubmitted) push("app_submitted", { ...appSubmitted, lineLabel: "Main" });

    const finalStatus = byKey.get("final-status-actions");
    if (finalStatus) {
      push("check_status", {
        ...finalStatus,
        lineLabel: "Main",
        buttons: finalStatus.buttons.filter((button) => button.action !== "application_rejected"),
      });
    }

    const govtRejectButton = CLOSURE_BUTTONS.find((button) => button.action === "application_rejected");
    if (govtRejectButton) {
      push("check_status", {
        key: "govt-rejection-closure",
        parentStage: "check_status",
        track: "closure",
        lineLabel: "Closure",
        title: "Government Rejection Closure",
        tone: "rose",
        description: "If the govt rejects the application, select Category B reason. Sends E008 and closes the order.",
        buttons: [govtRejectButton],
        note: closed && p.closureReasonLabel ? <>Closed reason: <b>{p.closureReasonLabel}</b></> : null,
      });
    }

    push("completed", {
      key: "force-close-terminal",
      parentStage: "completed",
      track: "closure",
      lineLabel: "Closure",
      title: closed ? "Order Closed" : "Manual Closure",
      tone: closed ? "emerald" : "rose",
      description: closed
        ? "Terminal closure path reached with the selected reason."
        : "Use only when the order must be closed manually. Sends E010 and cancels pending timers.",
      buttons: closed ? [] : [FORCE_CLOSE_BUTTON],
      note: closed && p.closureReasonLabel ? <>Selected reason: <b>{p.closureReasonLabel}</b></> : null,
    });

    const talkToExpert = byKey.get("talk-to-expert");
    if (isTalkToExpert && talkToExpert) push("completed", { ...talkToExpert, lineLabel: "Main" });

    if (ticketActive) {
      push(currentStageKey, {
        key: "active-support-ticket",
        parentStage: currentStageKey,
        track: "ticket",
        lineLabel: "Ticket",
        title: "Support Ticket Open",
        tone: "sky",
        description: "Customer replied or ticket opened. Workflow is paused until support resolves it.",
        buttons: TICKET_BUTTONS,
        note: view.activeTicketId ? <>Ticket: <b>{String(view.activeTicketId).slice(0, 8)}</b></> : null,
      });
    }

    return stageMap;
  }, [activeDelayKey, closed, closureArmed, currentStageKey, isTalkToExpert, p.closureNextAt, p.closureReasonLabel, ticketActive, view.activeTicketId]);

  const [dialog, setDialog] = useState<
    | null
    | { kind: "customer_delay" }
    | { kind: "technical_delay" }
    | { kind: "force_close" }
    | { kind: "govt_rejected" }
    | { kind: "complete_with_cert" }
  >(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-workflow-state", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-tickets", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-timers", p.applicationId] });
  };

  const fnFormLink = useServerFn(sendFormLink);
  const fnSubmit   = useServerFn(markSubmittedToGovt);
  const fnReminder = useServerFn(sendManualReminder);
  const fnComplete = useServerFn(completeOrder);
  const fnUpdateFF = useServerFn(updateFulfillmentStatus);

  const mutFormLink = useMutation({
    mutationFn: () => fnFormLink({ data: { orderId: p.applicationId, transitionToWaiting: true } }),
    onSuccess: (r: any) => { toast.success(r?.emailQueued ? "E002 form link sent" : "Order updated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutSubmit = useMutation({
    mutationFn: () => fnSubmit({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E005 sent — application marked submitted to govt"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutReminder = useMutation({
    mutationFn: (note: string) => fnReminder({ data: { orderId: p.applicationId, note } }),
    onSuccess: () => { toast.success("E006 sent + reminder queued"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutTalkExpert = useMutation({
    mutationFn: () => fnComplete({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E009 sent — consultation completed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const runAction = (action: JourneyActionKind) => {
    switch (action) {
      case "send_form_link":       return mutFormLink.mutate();
      case "customer_delay":       return setDialog({ kind: "customer_delay" });
      case "technical_delay":      return setDialog({ kind: "technical_delay" });
      case "submit_to_govt":       return mutSubmit.mutate();
      case "reminder_e006": {
        const note = window.prompt("Optional message to include with E006 reminder:", "");
        if (note !== null) mutReminder.mutate(note);
        return;
      }
      case "complete_with_cert":   return setDialog({ kind: "complete_with_cert" });
      case "application_rejected": return setDialog({ kind: "govt_rejected" });
      case "talk_to_expert_done":  return mutTalkExpert.mutate();
      case "force_close":          return setDialog({ kind: "force_close" });
      case "ticket_reply_reason":  return setDialog({ kind: "technical_delay" });
      case "ticket_normal_close":
      case "ticket_restart_order":
      case "ticket_consultation_done":
        toast.info("Open the Support tab to close/reply on the active ticket.");
        return;
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-slate-100 pb-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700">Customer Journey & Employee Actions</span>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                closed ? "bg-slate-600 text-white" : ticketActive ? "bg-sky-600 text-white" : activeDelayKey ? "bg-amber-500 text-white" : "bg-emerald-600 text-white",
              )}>
                {closed ? "Closed" : ticketActive ? "Ticket Paused" : activeDelayKey ? "Delay Live" : "Live"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Main path is straight. Delay, closure, and ticket subpaths are connected directly below the stage where they can happen.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-1.5 text-[9px] font-bold uppercase tracking-wider">
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Main</span>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">Delay</span>
            <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700">Closure</span>
            <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700">Ticket</span>
          </div>
        </header>

        <div className="overflow-x-auto pb-2 pt-4">
          <div
            className="grid min-w-[1280px] gap-3"
            style={{ gridTemplateColumns: `repeat(${JOURNEY_STAGES.length}, minmax(160px, 1fr))` }}
          >
            {JOURNEY_STAGES.map((s, i) => {
              const done = i < currentIdx || (i === currentIdx && s.key === "completed" && p.stage === "completed");
              const active = i === currentIdx && !done && !closed;
              const blocked = active && (ticketActive || !!activeDelayKey || closureArmed);
              return (
                <StageColumn
                  key={s.key}
                  stage={s}
                  index={i}
                  total={JOURNEY_STAGES.length}
                  currentIdx={currentIdx}
                  done={done}
                  active={active}
                  blocked={blocked}
                  flows={flowByStage[s.key] ?? []}
                  activeDelayKey={activeDelayKey}
                  ticketActive={ticketActive}
                  closureActive={closureArmed || closed}
                  onAction={runAction}
                />
              );
            })}
          </div>
        </div>

        {(view.hasEngine && view.nextTimer && !closed) || closureArmed || closed ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
            {view.hasEngine && view.nextTimer && !closed && (
              <span><Clock className="mr-1 inline size-3" />Next auto-step: <b>{view.nextTimer.kind}</b> · {relativeIST(view.nextTimer.firesAt)} · {formatIST(view.nextTimer.firesAt)}</span>
            )}
            {closureArmed && p.closureStage && (
              <span><AlertTriangle className="mr-1 inline size-3 text-rose-600" />Closure armed: <b>{p.closureStage}</b></span>
            )}
            {closed && (
              <span><ShieldAlert className="mr-1 inline size-3 text-slate-600" />Order closed{p.closureReasonLabel ? <> · <b>{p.closureReasonLabel}</b></> : null}</span>
            )}
          </div>
        ) : null}
      </section>

      {/* ─────────── Dialogs ─────────── */}
      <ExternalDelayDialog
        applicationId={p.applicationId}
        initialSide="customer"
        open={dialog?.kind === "customer_delay"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      <ExternalDelayDialog
        applicationId={p.applicationId}
        initialSide="internal"
        open={dialog?.kind === "technical_delay"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      <CloseOrderDialog
        applicationId={p.applicationId}
        open={dialog?.kind === "force_close"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      {dialog?.kind === "govt_rejected" && (
        <GovtRejectedInline
          orderId={p.applicationId}
          onClose={() => { setDialog(null); invalidate(); }}
        />
      )}
      <CompletionGateDialogStandalone
        open={dialog?.kind === "complete_with_cert"}
        onOpenChange={(v) => { if (!v) setDialog(null); }}
        orderId={p.applicationId}
        busy={false}
        onConfirm={async (payload) => {
          try {
            await fnUpdateFF({
              data: {
                orderId: p.applicationId,
                toStatus: "completed",
                certificateDocumentId: payload.certificateDocumentId,
                certificateNumber: payload.certificateNumber,
                completionNotes: payload.completionNotes,
              } as any,
            });
            toast.success("E007 sent — order completed with certificate");
            setDialog(null); invalidate();
          } catch (e: any) {
            toast.error(e?.message ?? "Completion failed");
          }
        }}
      />
    </div>
  );
}

/* ═══════════════════════ Helpers ═══════════════════════ */

const TRACK_COLOR = {
  emerald: { dot: "bg-emerald-500", header: "text-emerald-700", border: "border-emerald-200", bg: "from-emerald-50/40" },
  amber:   { dot: "bg-amber-500",   header: "text-amber-700",   border: "border-amber-200",   bg: "from-amber-50/40"   },
  rose:    { dot: "bg-rose-500",    header: "text-rose-700",    border: "border-rose-200",    bg: "from-rose-50/40"    },
  sky:     { dot: "bg-sky-500",     header: "text-sky-700",     border: "border-sky-200",     bg: "from-sky-50/40"     },
} as const;

const STATUS_CHIP: Record<string, string> = {
  Live:   "bg-emerald-600 text-white",
  Idle:   "bg-slate-200 text-slate-700",
  Paused: "bg-rose-600 text-white",
  Armed:  "bg-amber-500 text-white",
  Closed: "bg-slate-500 text-white",
};

function TrackCard({
  color, label, status, icon, subtitle, children,
}: {
  color: keyof typeof TRACK_COLOR;
  label: string;
  status: string;
  icon: ReactNode;
  subtitle: string;
  children: ReactNode;
}) {
  const c = TRACK_COLOR[color];
  return (
    <section className={cn("rounded-2xl border bg-gradient-to-b to-white p-5 shadow-sm", c.border, c.bg)}>
      <header className="flex items-center gap-2 mb-1">
        <span className={cn("size-2.5 rounded-full", c.dot)} />
        <span className={cn("text-[11px] uppercase tracking-[0.14em] font-bold flex items-center gap-1.5", c.header)}>
          {icon}
          {label}
        </span>
        <span className={cn("ml-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", STATUS_CHIP[status] ?? STATUS_CHIP.Idle)}>
          {status}
        </span>
      </header>
      <p className="text-[11px] text-slate-600 mb-3">{subtitle}</p>
      {children}
    </section>
  );
}

function BranchCard({
  branch, active, muted, onAction,
}: {
  branch: JourneyBranch;
  active: boolean;
  muted?: boolean;
  onAction: (a: JourneyActionKind) => void;
}) {
  const tone = TONE_MAP[branch.tone];
  return (
    <div className={cn(
      "rounded-lg border p-2.5 space-y-2 transition text-left",
      tone.border, tone.bg,
      active && "ring-2 ring-offset-1 shadow-md",
      active && tone.ring,
      muted && "opacity-60",
    )}>
      <div className="flex items-start justify-between gap-1">
        <div className={cn("text-[9px] uppercase tracking-wider font-bold leading-tight", tone.text)}>
          {branch.title}
          {active && (
            <span className="ml-1 rounded-full bg-rose-600 px-1 py-0.5 text-[8px] font-bold text-white uppercase">
              Live
            </span>
          )}
        </div>
      </div>
      <div className="text-[10px] text-slate-600 leading-snug">{branch.description}</div>
      <div className="flex flex-col gap-1.5">
        {branch.buttons.map((b) => (
          <JourneyActionButton
            key={b.key}
            button={b}
            active={active}
            onClick={() => onAction(b.action)}
          />
        ))}
      </div>
    </div>
  );
}

function GovtRejectedInline({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [reasonText, setReasonText] = useState("");
  const fn = useServerFn(handleGovtRejected);
  const listReasons = useServerFn(listCloseReasons);
  const [busy, setBusy] = useState(false);

  const { data: reasons = [] } = useQuery({
    queryKey: ["close-reasons-all"],
    queryFn: () => listReasons(),
    staleTime: 60_000,
  });
  const catB = (reasons as any[]).filter((r) => r.category === "B");
  const [reasonId, setReasonId] = useState<string | null>(null);

  const submit = async () => {
    if (!reasonId) return toast.error("Pick a Category B reason");
    setBusy(true);
    try {
      await fn({ data: { orderId, reasonId, remarks: reasonText || null } });
      toast.success("E008 sent — order closed (rejected)");
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-white p-5 shadow-xl space-y-3">
        <div className="font-bold text-slate-900">E008 — Application Rejected by Govt</div>
        <div className="text-xs text-slate-600">
          Sends E008 to the customer and force-closes this order (no resubmit loop).
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Reason (Category B)</label>
          <select
            value={reasonId ?? ""}
            onChange={(e) => setReasonId(e.target.value || null)}
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          >
            <option value="">Select a reason…</option>
            {catB.map((r: any) => (
              <option key={r.id} value={r.id}>B{r.number} — {r.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Extra remarks (optional)</label>
          <textarea
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            rows={3}
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} disabled={busy} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={submit} disabled={busy || !reasonId}
            className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
            Send E008 & Close
          </button>
        </div>
      </div>
    </div>
  );
}
