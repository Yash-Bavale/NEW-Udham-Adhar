// Unified Customer Journey Map — one straight main journey with connected
// stage-level subpaths for delay, closure, and support-ticket handling.

import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, Ticket, AlertTriangle, ShieldAlert, CreditCard,
  User, FileText, Landmark, Trophy, ClipboardCheck, Inbox, Clock,
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

const FLOW_LINE = {
  main: "border-emerald-300 bg-emerald-50 text-emerald-700",
  delay: "border-amber-300 bg-amber-50 text-amber-700",
  closure: "border-rose-300 bg-rose-50 text-rose-700",
  ticket: "border-sky-300 bg-sky-50 text-sky-700",
} as const;

type FlowItem = JourneyBranch & {
  lineLabel?: "Main" | "Delay" | "Closure" | "Ticket" | "Closed";
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
      push("order_received", {
        key: "form-missing-auto-close",
        parentStage: "order_received",
        track: "closure",
        lineLabel: "Closure",
        title: "Form Missing → Auto Close",
        tone: "rose",
        description: "If the customer still does not submit the form after E002, the 8-hour timer closes with reason A7.",
        buttons: [],
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
      push("form_submitted", {
        key: "customer-delay-auto-close",
        parentStage: "form_submitted",
        track: "closure",
        lineLabel: "Closure",
        title: "Customer Delay → Close",
        tone: "rose",
        description: "If the selected customer-side reason is not resolved, close/auto-close using the same Category A reason.",
        buttons: [FORCE_CLOSE_BUTTON],
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
      title: "Manual Close Action",
      tone: closed ? "emerald" : "rose",
      description: closed
        ? "This order has already reached the closure endpoint."
        : "Use only when the order must be closed manually. Sends E010 and cancels pending timers.",
      buttons: closed ? [] : [FORCE_CLOSE_BUTTON],
      note: closed && p.closureReasonLabel ? <>Selected reason: <b>{p.closureReasonLabel}</b></> : null,
    });

    push("completed", {
      key: "order-closed-terminal",
      parentStage: "completed",
      track: "closure",
      lineLabel: "Closed",
      title: "Order Closed",
      tone: closed ? "emerald" : "rose",
      description: "Final endpoint for force-close, auto-close, government rejection, or ticket reason closure.",
      buttons: [],
      note: closed && p.closureReasonLabel ? <>Closed with reason: <b>{p.closureReasonLabel}</b></> : <>Reached after a closure path completes.</>,
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
            <span className="rounded-full bg-slate-800 px-2 py-1 text-white">Order Closed</span>
          </div>
        </header>

        <div className="overflow-x-auto pb-2 pt-4">
          <div
            className="grid min-w-[900px] gap-2"
            style={{ gridTemplateColumns: `repeat(${JOURNEY_STAGES.length}, minmax(120px, 1fr))` }}
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

function StageColumn({
  stage,
  index,
  total,
  currentIdx,
  done,
  active,
  blocked,
  flows,
  activeDelayKey,
  ticketActive,
  closureActive,
  onAction,
}: {
  stage: (typeof JOURNEY_STAGES)[number];
  index: number;
  total: number;
  currentIdx: number;
  done: boolean;
  active: boolean;
  blocked: boolean;
  flows: FlowItem[];
  activeDelayKey: string | null;
  ticketActive: boolean;
  closureActive: boolean;
  onAction: (a: JourneyActionKind) => void;
}) {
  const Icon = STAGE_ICON[stage.key];
  const isLast = index === total - 1;
  const hasFlows = flows.length > 0;

  return (
    <div className="relative flex min-h-[420px] flex-col items-center">
      {!isLast && (
        <div className="absolute left-1/2 top-6 h-0.5 w-[calc(100%+0.5rem)] z-0">
          <div className={cn(
            "h-full",
            index < currentIdx ? "bg-emerald-400"
            : index === currentIdx ? "bg-gradient-to-r from-emerald-400 to-slate-200"
            : "bg-slate-200",
          )} />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <div className={cn(
          "grid size-12 place-items-center rounded-full transition-all",
          done ? "bg-emerald-500 text-white shadow"
          : blocked ? "bg-rose-500 text-white shadow ring-4 ring-rose-100"
          : active ? "bg-indigo-600 text-white shadow ring-4 ring-indigo-100"
          : "bg-slate-100 text-slate-400",
        )}>
          {done ? <Check className="size-5" /> : <Icon className="size-5" />}
        </div>
        {(active || blocked) && (
          <span className={cn(
            "absolute top-0 size-12 rounded-full ring-2 opacity-40 animate-ping",
            blocked ? "ring-rose-400" : "ring-indigo-400",
          )} />
        )}
        <span className={cn(
          "text-center text-[11px] font-semibold leading-tight",
          done ? "text-slate-900"
          : blocked ? "text-rose-700"
          : active ? "text-indigo-700"
          : "text-slate-500",
        )}>
          {stage.short}
        </span>
        <span className="max-w-[112px] text-center text-[9px] leading-tight text-slate-400">{stage.label}</span>
      </div>

      <div className="relative mt-3 flex w-full flex-1 flex-col items-stretch">
        {hasFlows && <div className="mx-auto h-8 w-px bg-slate-300" />}
        <div className="flex flex-col gap-2">
          {flows.map((flow) => {
            const flowActive =
              flow.key === activeDelayKey ||
              (flow.track === "ticket" && ticketActive) ||
              (flow.track === "closure" && closureActive) ||
              (flow.track === "main" && index === currentIdx);
            const muted = !!activeDelayKey && flow.track === "delay" && flow.key !== activeDelayKey;

            return (
              <div key={flow.key} className="relative">
                <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 flex-col items-center text-slate-400">
                  <span className="h-3 w-px bg-slate-300" />
                  <span className="-mt-1 text-[10px] leading-none">↓</span>
                </div>
                <BranchCard branch={flow} active={flowActive} muted={muted} onAction={onAction} />
              </div>
            );
          })}
        </div>
        {!hasFlows && <div className="min-h-[120px]" />}
      </div>
    </div>
  );
}

function BranchCard({
  branch, active, muted, onAction,
}: {
  branch: FlowItem;
  active: boolean;
  muted?: boolean;
  onAction: (a: JourneyActionKind) => void;
}) {
  const tone = TONE_MAP[branch.tone];
  const line = FLOW_LINE[branch.track];
  return (
    <div className={cn(
      "rounded-lg border p-2.5 space-y-2 transition text-left shadow-sm",
      tone.border, tone.bg,
      active && "ring-2 ring-offset-1 shadow-md",
      active && tone.ring,
      muted && "opacity-60",
    )}>
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1">
            <span className={cn("rounded-full border px-1 py-0.5 text-[8px] font-bold uppercase", line)}>
              {branch.lineLabel ?? branch.track}
            </span>
            {active && (
              <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                Active
              </span>
            )}
            {branch.track === "ticket" && <Ticket className="size-3 text-sky-600" />}
          </div>
          <div className={cn("mt-1 text-[8px] uppercase tracking-wider font-bold leading-tight", tone.text)}>
            {branch.title}
          </div>
        </div>
      </div>
      <div className="text-[9px] text-slate-600 leading-snug">{branch.description}</div>
      {branch.note && (
        <div className={cn("flex flex-col gap-0.5 rounded-md border px-2 py-1 text-[9px] leading-snug", line)}>
          {branch.note}
        </div>
      )}
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
