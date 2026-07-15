// Customer Journey — Live Path (config-driven SVG flowchart).
//
// All geometry, edges, and highlight rules live in `journey-graph.ts`.
// This file only renders. The canvas auto-scales to fit its container.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, Inbox, FileText, FileCheck2, Landmark, Search, Flag,
  Clock, XCircle, CheckCircle2, ClipboardCheck,
  Wrench, UserX, LifeBuoy, Send, UploadCloud, Mail,
  ArrowRight, AlertTriangle, RotateCcw, MailWarning,
  type LucideIcon,
} from "lucide-react";

import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { relativeIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";

import {
  JOURNEY_STAGES, deriveJourneyLiveState, derivePhase,
  PHASE_ENABLED_BUTTONS, type ButtonCode,
} from "@/lib/orders/journey-map";
import {
  NODES, EDGES, nodeById, anchor, pathD, nodeW, nodeH,
  activeBranchesFor, mainDoneEdgesFor, edgeState, nodeState,
  currentMainEdgeFor, currentStageNodeFor,
  CANVAS_W, CANVAS_H,
  type IconKey, type NodeDef, type Tone, type NodeState,
} from "@/lib/orders/journey-graph";
import { listOrderTickets } from "@/lib/tickets/list-order-tickets.functions";

import { ExternalDelayDialog } from "@/components/admin/ExternalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";
import { CountdownChip } from "./CountdownChip";

import {
  sendFormLink, markSubmittedToGovt, sendManualReminder, completeOrder,
} from "@/lib/orders/order-actions.functions";
import { resumeFromHold } from "@/lib/orders/actions/hold-actions.functions";
import { handleGovtRejected } from "@/lib/orders/actions/close-actions.functions";
import { listCloseReasons } from "@/lib/orders/actions/reasons.functions";
import { updateFulfillmentStatus } from "@/lib/crm/orders-v2.functions";

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

/* Icon registry keyed by string keys used in journey-graph */
const ICONS: Record<IconKey, LucideIcon> = {
  inbox: Inbox, fileText: FileText, fileCheck: FileCheck2,
  landmark: Landmark, search: Search, flag: Flag,
  wrench: Wrench, rotate: RotateCcw, mailWarn: MailWarning,
  userX: UserX, send: Send, clock: Clock, clipboard: ClipboardCheck,
  upload: UploadCloud, xCircle: XCircle, lifeBuoy: LifeBuoy,
};

/* ─── Responsive scaling hook ─── */
function useResponsiveScale() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (!w) return;
      setScale(Math.min(1, w / CANVAS_W));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { wrapRef, scale };
}

/* ═════════════════════════ Component ═════════════════════════ */

export function CustomerJourneyMap(p: Props) {
  const qc = useQueryClient();
  const { view, events } = useOrderWorkflow(p.applicationId);

  const live = useMemo(() => deriveJourneyLiveState({
    stage: p.stage,
    workflowStatus: p.workflowStatus,
    closureStage: p.closureStage,
    closureReasonLabel: p.closureReasonLabel,
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel]);

  const currentIdx = live.currentMainIndex;
  const isTalkToExpert = /talk|expert|consult/i.test(p.serviceCode ?? "") || !!p.isConsultationOrder;
  const closed = live.terminal === "closed";
  const completed = live.terminal === "completed";
  const closureArmed = !!p.closureStage && p.closureStage !== "none" && !closed;

  const reminderCount = useMemo(
    () => (events ?? []).filter((e: any) => e?.type === "ReminderScheduled" || e?.type === "ReminderFired").length,
    [events],
  );

  const postWaitKey = `journey.b07Pressed:${p.applicationId}`;
  const [postWaitSubmitted, setPostWaitSubmitted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.localStorage.getItem(postWaitKey) === "1"; } catch { return false; }
  });
  const markPostWaitSubmitted = () => {
    try { window.localStorage.setItem(postWaitKey, "1"); } catch {}
    setPostWaitSubmitted(true);
  };

  const phase = useMemo(() => derivePhase({
    stage: p.stage,
    workflowStatus: p.workflowStatus,
    closureStage: p.closureStage,
    closureReasonLabel: p.closureReasonLabel,
    reminderCount,
    postWaitSubmitted,
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel, reminderCount, postWaitSubmitted]);

  const enabledCodes = PHASE_ENABLED_BUTTONS[phase];
  const gate = (code: ButtonCode) => enabledCodes.includes(code) && !closed && !completed;

  const timers = view.timers ?? [];
  const findTimer = (kindMatch: RegExp) =>
    timers.find((t: any) => kindMatch.test(t?.kind ?? "") && t?.status === "running") ?? null;
  const formAutoCloseTimer  = findTimer(/form_pending_autoclose|form_.*8h/);
  const customerHoldTimer   = findTimer(/customer_hold|customer_side_autoclose/);
  const technicalHoldTimer  = findTimer(/technical_hold|our_side_reminder/);

  const listTickets = useServerFn(listOrderTickets);
  const ticketQ = useQuery({
    queryKey: ["order-tickets", p.applicationId],
    queryFn: () => listTickets({ data: { orderId: p.applicationId } }),
    staleTime: 30_000,
  });
  useRealtimeTable("support_tickets", () => ticketQ.refetch(), {
    filter: `application_id=eq.${p.applicationId}`,
  });
  const openTicket = (ticketQ.data?.tickets ?? []).find((t: any) => {
    const s = String(t.status ?? "").toLowerCase();
    return s !== "closed" && s !== "resolved";
  });
  const hasOpenTicket = !!openTicket;

  const currentStageLabel = useMemo(() => {
    const s = JOURNEY_STAGES[Math.min(Math.max(currentIdx, 0), JOURNEY_STAGES.length - 1)];
    return s?.label ?? "Order Received";
  }, [currentIdx]);

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
  const fnResume   = useServerFn(resumeFromHold);

  const mutResume = useMutation({
    mutationFn: () => fnResume({ data: { orderId: p.applicationId, target: "IN_PROCESSING" } }),
    onSuccess: () => { toast.success("E011 sent — technical delay resolved, order resumed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutSubmitAfterWait = useMutation({
    mutationFn: () => fnSubmit({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E005 sent — consultation completed (after waiting)"); markPostWaitSubmitted(); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutFormLink = useMutation({
    mutationFn: () => fnFormLink({ data: { orderId: p.applicationId, transitionToWaiting: true } }),
    onSuccess: (r: any) => { toast.success(r?.emailQueued ? "E002 — Form link / incomplete-info mail sent" : "Order updated"); invalidate(); },
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

  const promptReminder = () => {
    const note = window.prompt("Optional message to include with reminder:", "");
    if (note !== null) mutReminder.mutate(note);
  };

  const buttonHandlers: Record<string, { onClick: () => void; pending?: boolean }> = {
    B01: { onClick: () => mutFormLink.mutate(),         pending: mutFormLink.isPending },
    B02: { onClick: () => setDialog({ kind: "technical_delay" }) },
    B03: { onClick: () => mutResume.mutate(),           pending: mutResume.isPending },
    B04: { onClick: () => mutSubmit.mutate(),           pending: mutSubmit.isPending },
    B05: { onClick: promptReminder },
    B06: { onClick: promptReminder },
    B07: { onClick: () => mutSubmitAfterWait.mutate(),  pending: mutSubmitAfterWait.isPending },
    B08: { onClick: () => setDialog({ kind: "complete_with_cert" }) },
    B09: { onClick: () => setDialog({ kind: "govt_rejected" }) },
    B10: { onClick: () => setDialog({ kind: "customer_delay" }) },
  };

  /* ─── Highlight state (pure) ─── */
  const activeBranches = useMemo(
    () => activeBranchesFor(phase, live.terminal, live.reasonCode, p.workflowStatus),
    [phase, live.terminal, live.reasonCode, p.workflowStatus],
  );
  const doneMainEdges = useMemo(
    () => mainDoneEdgesFor(currentIdx, phase),
    [currentIdx, phase],
  );
  const currentMainEdge = useMemo(
    () => currentMainEdgeFor(currentIdx, phase, live.terminal),
    [currentIdx, phase, live.terminal],
  );
  const currentStageNode = useMemo(
    () => currentStageNodeFor(currentIdx, phase, live.terminal),
    [currentIdx, phase, live.terminal],
  );

  const visibleEdges = EDGES;
  const { wrapRef, scale } = useResponsiveScale();

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Header */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-slate-100 pb-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">
              Customer Journey — Live Path
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>Current:</span>
              <span className="truncate font-semibold text-indigo-700">{currentStageLabel}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  closed ? "bg-rose-100 text-rose-700"
                  : phase === "technical_delay" ? "bg-sky-100 text-sky-800"
                  : phase === "customer_delay" || phase === "form_not_submitted" ? "bg-amber-100 text-amber-800"
                  : phase === "awaiting_govt" || phase === "status_checked" ? "bg-violet-100 text-violet-800"
                  : completed ? "bg-emerald-100 text-emerald-800"
                  : "bg-indigo-100 text-indigo-800",
                )}
              >
                {closed ? <XCircle className="size-3" /> : <ClipboardCheck className="size-3" />}
                {live.subStateLabel}
              </span>
              {hasOpenTicket && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800">
                  <LifeBuoy className="size-3" /> Ticket open
                </span>
              )}
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-2 text-[10px] font-semibold text-slate-500 sm:flex">
            <Legend cls="bg-emerald-500" label="Done" />
            <Legend cls="bg-indigo-500" label="Active" />
            <Legend cls="bg-amber-400" label="Delay" />
            <Legend cls="bg-rose-500" label="Closed" />
            <Legend cls="bg-slate-300" label="Idle" />
          </div>
        </header>

        {/* Responsive canvas */}
        <div ref={wrapRef} className="mt-3 w-full" data-testid="journey-canvas-wrap">
          <div
            style={{
              width: CANVAS_W * scale,
              height: CANVAS_H * scale,
              position: "relative",
            }}
          >
            <div
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {/* Edge layer */}
              <svg
                className="pointer-events-none absolute inset-0"
                width={CANVAS_W}
                height={CANVAS_H}
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                data-testid="journey-svg"
              >
                <defs>
                  {(["idle", "done", "active", "closed"] as const).map((s) => (
                    <marker
                      key={s}
                      id={`arrow-${s}`}
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M 0 0 L 10 5 L 0 10 z"
                        className={
                          s === "done"   ? "fill-emerald-500"
                        : s === "active" ? "fill-indigo-500"
                        : s === "closed" ? "fill-rose-500"
                        :                  "fill-slate-300"
                        }
                      />
                    </marker>
                  ))}
                  <style>{`
                    @keyframes flowdash { to { stroke-dashoffset: -24; } }
                    .edge-active { animation: flowdash 1.2s linear infinite; }
                  `}</style>
                </defs>

                {visibleEdges.map((e) => {
                  const from = nodeById[e.from];
                  const to   = nodeById[e.to];
                  if (!from || !to) return null;
                  const a = anchor(from, e.fromSide);
                  const b = anchor(to,   e.toSide);
                  const state = edgeState(e, { activeBranches, doneMainEdges, terminal: live.terminal, currentMainEdge });
                  const cls =
                    state === "done"   ? "stroke-emerald-500"
                  : state === "active" ? "stroke-indigo-500 edge-active"
                  : state === "closed" ? "stroke-rose-500 edge-active"
                  :                      "stroke-slate-300";
                  const strokeWidth = state === "idle" ? 1.25 : 2;
                  const dash = state === "active" || state === "closed" ? "8 4"
                             : state === "idle" ? "4 4" : undefined;
                  return (
                    <path
                      key={e.id}
                      d={pathD(a, b, e.mode, e.waypoints)}
                      fill="none"
                      className={cls}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={dash}
                      markerEnd={`url(#arrow-${state})`}
                      data-edge={e.id}
                      data-branch={e.branch}
                      data-state={state}
                    />
                  );
                })}
              </svg>

              {/* Node overlay */}
              {NODES.map((n) => {
                const state = nodeState(n.id, {
                  currentIdx, activeBranches, terminal: live.terminal, phase, currentStageNode,
                });
                const btnCode = n.buttonCode;
                const enabled = btnCode ? gate(btnCode) : false;
                const isSent = btnCode ? !enabled && !closed && !completed && !enabledCodes.includes(btnCode) : false;
                const handler = btnCode ? buttonHandlers[btnCode] : undefined;

                let countdown: React.ReactNode = null;
                if (n.id === "b01_reminder" && activeBranches.has("form-nag") && (formAutoCloseTimer || p.closureNextAt)) {
                  countdown = (
                    <CountdownChip
                      firesAt={formAutoCloseTimer?.fires_at ?? formAutoCloseTimer?.firesAt ?? p.closureNextAt}
                      label="auto-close"
                    />
                  );
                } else if (n.id === "b10_cust" && activeBranches.has("customer-delay") && (customerHoldTimer || p.closureNextAt)) {
                  countdown = (
                    <CountdownChip
                      firesAt={customerHoldTimer?.fires_at ?? customerHoldTimer?.firesAt ?? p.closureNextAt}
                      label="auto-close"
                      paused={hasOpenTicket}
                    />
                  );
                } else if (n.id === "b02_tech" && activeBranches.has("technical") && technicalHoldTimer) {
                  countdown = (
                    <CountdownChip
                      firesAt={technicalHoldTimer.fires_at ?? technicalHoldTimer.firesAt}
                      label="reminder"
                    />
                  );
                }

                return (
                  <FlowNode
                    key={n.id}
                    node={n}
                    state={state}
                    buttonEnabled={enabled}
                    buttonPending={!!handler?.pending}
                    buttonSent={isSent}
                    onButtonClick={handler?.onClick}
                    countdown={countdown}
                    phaseLabel={phase}
                    ticketOpen={n.id === "ticket_lane" && hasOpenTicket}
                    ticketNumber={n.id === "ticket_lane" ? openTicket?.ticket_number ?? (openTicket?.id ? String(openTicket.id).slice(0, 8) : null) : null}
                    ticketHref={n.id === "ticket_lane" && openTicket?.id ? `/admin/tickets/${openTicket.id}` : null}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Talk-to-expert + Force close */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
            {isTalkToExpert && (
              <button
                type="button"
                onClick={() => mutTalkExpert.mutate()}
                disabled={closed || completed || mutTalkExpert.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
              >
                <CheckCircle2 className="size-3.5" />
                Talk-to-Expert Completed (E009)
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-rose-800">
            <Mail className="size-3.5 text-rose-600" />
            <span className="font-bold">Force Close (E010)</span>
            <span className="text-rose-500 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Cancels timers · Cat A reason.</span>
            <button
              type="button"
              onClick={() => setDialog({ kind: "force_close" })}
              disabled={closed}
              className="rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
            >
              Force Close
            </button>
          </div>
        </div>

        {(view.hasEngine && view.nextTimer && !closed) || closureArmed || closed ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
            {view.hasEngine && view.nextTimer && !closed && (
              <span><Clock className="mr-1 inline size-3" />Next auto-step: <b>{view.nextTimer.kind}</b> · {relativeIST(view.nextTimer.firesAt)}</span>
            )}
            {closureArmed && p.closureStage && (
              <span><AlertTriangle className="mr-1 inline size-3 text-amber-600" />Closure armed: <b>{p.closureStage}</b>{p.closureNextAt ? <> · fires {relativeIST(p.closureNextAt)}</> : null}</span>
            )}
            {closed && (
              <span><XCircle className="mr-1 inline size-3 text-rose-600" />Order closed{p.closureReasonLabel ? <> · <b>{p.closureReasonLabel}</b></> : null}</span>
            )}
          </div>
        ) : null}
      </section>

      {/* Dialogs */}
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

/* ═════════════════════════ FlowNode ═════════════════════════ */

const TONE_STYLES: Record<Tone, { border: string; bg: string; text: string; icon: string; btn: string; ring: string; solid: string }> = {
  slate:   { border: "border-slate-300",   bg: "bg-white",       text: "text-slate-700",   icon: "text-slate-500",   btn: "bg-slate-600 hover:bg-slate-700 text-white",     ring: "ring-slate-200",   solid: "bg-slate-600 text-white" },
  amber:   { border: "border-amber-300",   bg: "bg-amber-50",    text: "text-amber-800",   icon: "text-amber-600",   btn: "bg-amber-500 hover:bg-amber-600 text-white",     ring: "ring-amber-200",   solid: "bg-amber-500 text-white" },
  rose:    { border: "border-rose-300",    bg: "bg-rose-50",     text: "text-rose-800",    icon: "text-rose-600",    btn: "bg-rose-600 hover:bg-rose-700 text-white",       ring: "ring-rose-200",    solid: "bg-rose-600 text-white" },
  sky:     { border: "border-sky-300",     bg: "bg-sky-50",      text: "text-sky-800",     icon: "text-sky-600",     btn: "bg-sky-600 hover:bg-sky-700 text-white",         ring: "ring-sky-200",     solid: "bg-sky-600 text-white" },
  violet:  { border: "border-violet-300",  bg: "bg-violet-50",   text: "text-violet-800",  icon: "text-violet-600",  btn: "bg-violet-600 hover:bg-violet-700 text-white",   ring: "ring-violet-200",  solid: "bg-violet-600 text-white" },
  emerald: { border: "border-emerald-300", bg: "bg-emerald-50",  text: "text-emerald-800", icon: "text-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700 text-white", ring: "ring-emerald-200", solid: "bg-emerald-600 text-white" },
  indigo:  { border: "border-indigo-300",  bg: "bg-indigo-50",   text: "text-indigo-800",  icon: "text-indigo-600",  btn: "bg-indigo-600 hover:bg-indigo-700 text-white",   ring: "ring-indigo-200",  solid: "bg-indigo-600 text-white" },
};

function FlowNode({
  node, state,
  buttonEnabled, buttonPending, buttonSent, onButtonClick,
  countdown, phaseLabel, ticketOpen, ticketNumber, ticketHref,
}: {
  node: NodeDef;
  state: NodeState;
  buttonEnabled: boolean;
  buttonPending: boolean;
  buttonSent: boolean;
  onButtonClick?: () => void;
  countdown?: React.ReactNode;
  phaseLabel: string;
  ticketOpen: boolean;
  ticketNumber?: string | null;
  ticketHref?: string | null;
}) {
  const Icon = ICONS[node.icon];
  const isAction = node.kind === "action";
  const isTerminal = node.kind === "terminal";
  const isSub = node.kind === "sub";

  // Effective tone based on state
  let tone: Tone = node.tone;
  if (state === "terminal-ok") tone = "emerald";
  else if (state === "terminal-bad") tone = "rose";
  else if (state === "done" && node.kind === "stage") tone = "emerald";
  else if (state === "idle" && node.kind === "stage") tone = "slate";
  else if (state === "idle" && node.kind === "action" && !buttonEnabled) tone = "slate";

  const t = TONE_STYLES[tone];
  const dim = state === "idle" && !buttonEnabled;
  const active = state === "active" || (node.kind === "action" && buttonEnabled && state !== "done");

  return (
    <div
      className={cn(
        "absolute rounded-lg border shadow-sm transition-all",
        t.border, t.bg,
        active && "ring-2 shadow-md",
        active && t.ring,
        dim && "opacity-70",
        isSub && "border-dashed",
      )}
      style={{
        left: node.x,
        top: node.y,
        width: NODE_W,
        minHeight: isAction ? NODE_H + 28 : NODE_H,
      }}
      data-node={node.id}
      data-state={state}
    >
      {countdown && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {countdown}
        </div>
      )}

      <div className="flex items-center gap-1 px-1.5 pt-1">
        <span className={cn("grid size-5 place-items-center rounded-full border bg-white shrink-0", t.border)}>
          {state === "done" && node.kind === "stage"
            ? <Check className={cn("size-3", t.icon)} />
            : <Icon className={cn("size-3", t.icon)} />}
        </span>
        {node.buttonCode && (
          <span className={cn(
            "rounded px-1 py-px font-mono text-[8px] font-black tracking-wider",
            active ? "bg-white text-slate-700" : "bg-slate-100 text-slate-500",
          )}>
            {node.buttonCode}·{node.emailCode}
          </span>
        )}
        {active && !isTerminal && (
          <span className="ml-auto rounded-full bg-rose-600 px-1 py-px text-[7px] font-black uppercase tracking-wider text-white">
            LIVE
          </span>
        )}
      </div>

      <div className={cn("px-1.5 py-0.5", t.text)}>
        <div className="text-[10px] font-bold leading-tight">{node.label}</div>
        {node.subtitle && (
          <div className="mt-px text-[8px] font-medium leading-tight opacity-70">{node.subtitle}</div>
        )}
      </div>

      {isAction && (
        <div className="px-1.5 pb-1">
          <button
            type="button"
            onClick={onButtonClick}
            disabled={!buttonEnabled || buttonPending}
            title={!buttonEnabled ? `${node.buttonCode} locked in phase "${phaseLabel}"` : node.label}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1 rounded px-1 py-0.5 text-[9px] font-bold shadow-sm transition disabled:cursor-not-allowed",
              buttonEnabled ? t.btn : "bg-slate-100 text-slate-500 border border-slate-200",
            )}
          >
            {buttonSent && <Check className="size-2.5" />}
            {buttonPending ? "…" : buttonEnabled ? "Trigger" : buttonSent ? "Sent" : "Locked"}
          </button>
        </div>
      )}

      {isSub && ticketOpen && (
        <div className="px-1.5 pb-1">
          <a
            href={ticketHref ?? "#"}
            className="inline-flex w-full items-center justify-center gap-1 rounded bg-violet-600 px-1 py-0.5 text-[9px] font-bold text-white shadow-sm hover:bg-violet-700"
          >
            #{ticketNumber} <ArrowRight className="size-2.5" />
          </a>
        </div>
      )}
      {isSub && !ticketOpen && (
        <div className="px-1.5 pb-1 text-[8px] italic text-slate-500">No open ticket</div>
      )}
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("inline-block size-2.5 rounded-full", cls)} />
      {label}
    </span>
  );
}

/* ─── Inline govt-rejected dialog ─── */

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

// silence unused import warning if useEffect isn't referenced directly
void useEffect;
