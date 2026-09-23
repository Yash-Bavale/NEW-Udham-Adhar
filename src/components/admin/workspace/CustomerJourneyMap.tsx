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
  ArrowRight, AlertTriangle, RotateCcw, MailWarning, ShoppingBag, ShieldAlert,
  PhoneCall, Flame, VolumeX, Loader2, Server,
  type LucideIcon,
} from "lucide-react";

import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { useRole } from "@/hooks/useRole";
import { formatIST, relativeIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";

import {
  JOURNEY_STAGES, deriveJourneyLiveState, derivePhase,
  PHASE_ENABLED_BUTTONS, type ButtonCode,
} from "@/lib/orders/journey-map";
import {
  NODES, EDGES, nodeById, anchor, pathD, nodeW, nodeH,
  activeBranchesFor, mainDoneEdgesFor, edgeState, nodeState,
  currentMainEdgesFor, currentStageNodeFor,
  CANVAS_W, CANVAS_H,
  type IconKey, type NodeDef, type Tone, type NodeState,
} from "@/lib/orders/journey-graph";
import { listOrderTickets } from "@/lib/tickets/list-order-tickets.functions";

import { CustomerDelayDialog } from "@/components/admin/workspace/CustomerDelayDialog";
import { TechnicalDelayDialog } from "@/components/admin/workspace/TechnicalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import { CallbackReminderDialog } from "@/components/admin/workspace/CallbackReminderDialog";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";
import { CountdownChip } from "./CountdownChip";

import {
  sendFormLink, markSubmittedToGovt, sendManualReminder, completeOrder, reopenOrder,
} from "@/lib/orders/order-actions.functions";
import { resumeFromHold, resumeFromCustomerDelay } from "@/lib/orders/actions/hold-actions.functions";
import { handleGovtRejected } from "@/lib/orders/actions/close-actions.functions";
import { listCloseReasons } from "@/lib/orders/actions/reasons.functions";
import { updateFulfillmentStatus } from "@/lib/crm/orders-v2.functions";
import { markConsultationCompleted } from "@/lib/orders/actions/consultation.functions";
import { getActiveOrderCallback } from "@/lib/orders/actions/callback-reminder.functions";
import { silentCloseOrder } from "@/lib/crm/workflow-closure.functions";

interface Props {
  applicationId: string;
  stage: OrderStage;
  isConsultationOrder?: boolean;
  serviceCode?: string | null;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  closureReasonLabel?: string | null;
  formSubmittedAt?: string | null;
  fulfillmentStatus?: string | null;
  payments?: any[];
  hideAmount?: boolean;
  /** Admin override state — controlled by parent (WorkspaceShell). */
  adminOverride?: boolean;
  onAdminOverrideChange?: (v: boolean) => void;
}

/* Icon registry keyed by string keys used in journey-graph */
const ICONS: Record<IconKey, LucideIcon> = {
  inbox: Inbox, fileText: FileText, fileCheck: FileCheck2,
  landmark: Landmark, search: Search, flag: Flag,
  wrench: Wrench, rotate: RotateCcw, mailWarn: MailWarning,
  userX: UserX, send: Send, clock: Clock, clipboard: ClipboardCheck,
  upload: UploadCloud, xCircle: XCircle, lifeBuoy: LifeBuoy,
  shoppingBag: ShoppingBag,
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
    formSubmittedAt: p.formSubmittedAt,
    fulfillmentStatus: p.fulfillmentStatus,
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel, p.formSubmittedAt, p.fulfillmentStatus]);

  const currentIdx = live.currentMainIndex;
  const isTalkToExpert = /talk|expert|consult/i.test(p.serviceCode ?? "") || !!p.isConsultationOrder;
  const closed = live.terminal === "closed";
  const completed = live.terminal === "completed";
  const closureArmed = !!p.closureStage && p.closureStage !== "none" && !closed;

  const reminderCount = useMemo(
    () => (events ?? []).filter((e: any) => e?.type === "ReminderScheduled" || e?.type === "ReminderFired").length,
    [events],
  );

  const formLinkKey = `journey.b01Sent:${p.applicationId}`;
  const [formLinkSent, setFormLinkSent] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.localStorage.getItem(formLinkKey) === "1"; } catch { return false; }
  });
  const markFormLinkSent = () => {
    try { window.localStorage.setItem(formLinkKey, "1"); } catch { }
    setFormLinkSent(true);
  };
  const clearFormLinkSent = () => {
    try { window.localStorage.removeItem(formLinkKey); } catch { }
    setFormLinkSent(false);
  };

  const techResumeKey = `journey.b03Resumed:${p.applicationId}`;
  const [techDelayResolved, setTechDelayResolved] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.localStorage.getItem(techResumeKey) === "1"; } catch { return false; }
  });
  const markTechDelayResolved = () => {
    try { window.localStorage.setItem(techResumeKey, "1"); } catch { }
    setTechDelayResolved(true);
  };
  const clearTechDelayResolved = () => {
    try { window.localStorage.removeItem(techResumeKey) } catch { }
    setTechDelayResolved(false);
  };

  // Auto-clear the B01/B03 client flags when the underlying order state moves past them.
  useEffect(() => {
    if (formLinkSent && live.activeSubKey !== "form-not-submitted") clearFormLinkSent();
    if (techDelayResolved && (live.activeSubKey === "technical-delay" || currentIdx >= 4)) clearTechDelayResolved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live.activeSubKey, currentIdx]);

  const isFormLinkSent = useMemo(() => {
    if (formLinkSent) return true;
    const ws = (p.workflowStatus ?? "").toLowerCase();
    if (ws === "waiting_for_customer_submission" || ws === "form_link_sent" || ws === "form_pending") return true;
    if (events && events.some((e: any) =>
      e?.type === "FormLinkSent" ||
      e?.event_type === "form_link_sent" ||
      e?.event_type === "email_queued" ||
      e?.template_code === "E002" ||
      e?.type === "EmailSent" ||
      e?.type === "WelcomeMailSent"
    )) return true;
    return false;
  }, [formLinkSent, p.workflowStatus, events]);

  const phase = useMemo(() => derivePhase({
    stage: p.stage,
    workflowStatus: p.workflowStatus,
    closureStage: p.closureStage,
    closureReasonLabel: p.closureReasonLabel,
    formSubmittedAt: p.formSubmittedAt,
    fulfillmentStatus: p.fulfillmentStatus,
    reminderCount,
    formLinkSent: isFormLinkSent,
    techDelayResolved,
    adminOverride: p.adminOverride,
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel, p.formSubmittedAt, p.fulfillmentStatus, reminderCount, isFormLinkSent, techDelayResolved, p.adminOverride]);

  const enabledCodes = PHASE_ENABLED_BUTTONS[phase];
  const gate = (code: ButtonCode) => {
    if (code === "B07" || code === "B08") {
      return enabledCodes.includes(code);
    }
    return enabledCodes.includes(code) && !closed && !completed;
  };

  const timers = view.timers ?? [];
  const findTimer = (kindMatch: RegExp) =>
    timers.find((t: any) => kindMatch.test(t?.kind ?? "") && t?.status === "running") ?? null;
  const formAutoCloseTimer = findTimer(/form_pending_autoclose|form_.*8h/);
  const customerHoldTimer = findTimer(/customer_hold|customer_side_autoclose/);
  const technicalHoldTimer = findTimer(/technical_hold|our_side_reminder/);

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

  // Single source of truth for the "Current" label — derived stage from computeOrderStage.
  const currentStageLabel = useMemo(() => STAGE_META[p.stage].label, [p.stage]);

  const getActiveCallbackFn = useServerFn(getActiveOrderCallback);
  const activeCallbackQ = useQuery({
    queryKey: ["active-order-callback", p.applicationId],
    queryFn: () => getActiveCallbackFn({ data: { orderId: p.applicationId } }),
    staleTime: 10_000,
  });
  const activeCallback = activeCallbackQ.data;
  const role = useRole();
  const isAdmin = role.hasAny(["super_admin", "admin"]);

  const [dialog, setDialog] = useState<
    | null
    | { kind: "customer_delay" }
    | { kind: "technical_delay" }
    | { kind: "force_close" }
    | { kind: "silent_close" }
    | { kind: "govt_rejected" }
    | { kind: "complete_with_cert" }
    | { kind: "consultation_completed" }
    | { kind: "callback_reminder" }
  >(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
    qc.invalidateQueries({ queryKey: ["order-workflow-state", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-tickets", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-timers", p.applicationId] });
  };

  const fnFormLink = useServerFn(sendFormLink);
  const fnSubmit = useServerFn(markSubmittedToGovt);
  const fnReminder = useServerFn(sendManualReminder);
  const fnComplete = useServerFn(completeOrder);
  const fnUpdateFF = useServerFn(updateFulfillmentStatus);
  const fnResume = useServerFn(resumeFromHold);
  const fnConsultation = useServerFn(markConsultationCompleted);

  const mutResume = useMutation({
    mutationFn: () => fnResume({ data: { orderId: p.applicationId, target: "IN_PROCESSING" } }),
    onSuccess: () => { toast.success("E011 sent — technical delay resolved, order resumed"); markTechDelayResolved(); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const fnResumeCustomer = useServerFn(resumeFromCustomerDelay);
  const mutResumeCustomer = useMutation({
    mutationFn: () => fnResumeCustomer({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("Order resumed — moved to Form Submitted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const fnReopen = useServerFn(reopenOrder);
  const mutReopen = useMutation({
    mutationFn: () => fnReopen({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E09 sent — order reopened successfully"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutFormLink = useMutation({
    mutationFn: () => fnFormLink({ data: { orderId: p.applicationId, transitionToWaiting: true } }),
    onSuccess: (r: any) => { toast.success(r?.emailQueued ? "E002 — Form link / incomplete-info mail sent" : "Order updated"); markFormLinkSent(); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutSubmit = useMutation({
    mutationFn: () => fnSubmit({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E005 sent — application marked submitted to govt"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutConsultation = useMutation({
    // B06 → S08 Consultation Completed. Stamps fulfillment stage AND enqueues
    // the E005 email with an operator-entered Note ({{employee_remarks}}).
    mutationFn: (remarks: string) =>
      fnConsultation({ data: { orderId: p.applicationId, remarks: remarks || null } }),
    onSuccess: (r: any) => {
      toast.success(
        r?.emailQueued
          ? "S08 · Consultation Completed — E005 sent"
          : "S08 · Consultation Completed (no customer email on file)",
      );
      setDialog(null);
      invalidate();
    },
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

  const inCustomerDelay = phase === "customer_delay";
  const canResume = !closed && !completed && (inCustomerDelay || phase === "technical_delay" || phase === "form_not_submitted" || phase === "form_link_sent" || Boolean(p.adminOverride));

  const buttonHandlers: Record<string, { onClick: () => void; pending?: boolean; label?: string }> = {
    B01: { onClick: () => mutFormLink.mutate(), pending: mutFormLink.isPending },
    B02: { onClick: () => setDialog({ kind: "technical_delay" }) },
    B03: { onClick: () => mutResume.mutate(), pending: mutResume.isPending },
    B04: inCustomerDelay
      ? { onClick: () => mutResumeCustomer.mutate(), pending: mutResumeCustomer.isPending, label: "Resume Order" }
      : { onClick: () => setDialog({ kind: "customer_delay" }) },
    B05: { onClick: () => mutSubmit.mutate(), pending: mutSubmit.isPending },
    B06: { onClick: () => setDialog({ kind: "consultation_completed" }), pending: mutConsultation.isPending },
    B07: { onClick: () => setDialog({ kind: "complete_with_cert" }) },
    B08: { onClick: () => setDialog({ kind: "govt_rejected" }) },
  };


  /* ─── Highlight state (pure) ─── */
  const activeBranches = useMemo(
    () => activeBranchesFor(phase, live.terminal, live.reasonCode, p.workflowStatus, currentIdx, techDelayResolved),
    [phase, live.terminal, live.reasonCode, p.workflowStatus, currentIdx, techDelayResolved],
  );
  const doneMainEdges = useMemo(
    () => mainDoneEdgesFor(currentIdx, phase, techDelayResolved),
    [currentIdx, phase, techDelayResolved],
  );
  const currentMainEdges = useMemo(
    () => currentMainEdgesFor(currentIdx, phase, live.terminal, techDelayResolved),
    [currentIdx, phase, live.terminal, techDelayResolved],
  );
  const currentStageNode = useMemo(
    () => currentStageNodeFor(currentIdx, phase, live.terminal),
    [currentIdx, phase, live.terminal],
  );

  const visibleEdges = EDGES;
  const { wrapRef, scale } = useResponsiveScale();

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
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
                    : phase === "consultation_done" ? "bg-emerald-100 text-emerald-800"
                      : phase === "technical_delay" ? "bg-sky-100 text-sky-800"
                        : phase === "customer_delay" || phase === "form_not_submitted" || phase === "form_link_sent" ? "bg-amber-100 text-amber-800"
                          : phase === "govt_processing" ? "bg-violet-100 text-violet-800"
                            : completed ? "bg-emerald-100 text-emerald-800"
                              : p.adminOverride ? "bg-orange-100 text-orange-800"
                                : "bg-indigo-100 text-indigo-800",
                )}
              >
                {closed ? <XCircle className="size-3" /> : <ClipboardCheck className="size-3" />}
                {p.adminOverride ? "ADMIN OVERRIDE" : live.subStateLabel}
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
                  {(["idle", "done", "active", "warning", "closed"] as const).map((s) => (
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
                          s === "done" ? "fill-emerald-500"
                            : s === "active" ? "fill-indigo-500"
                              : s === "warning" ? "fill-amber-500"
                                : s === "closed" ? "fill-rose-500"
                                  : "fill-slate-300"
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
                  const to = nodeById[e.to];
                  if (!from || !to) return null;
                  const a = anchor(from, e.fromSide);
                  const b = anchor(to, e.toSide);
                  const state = edgeState(e, { activeBranches, doneMainEdges, terminal: live.terminal, currentMainEdges, phase, currentIdx });
                  const cls =
                    state === "done" ? "stroke-emerald-500"
                      : state === "active" ? "stroke-indigo-500 edge-active"
                        : state === "warning" ? "stroke-amber-500 edge-active"
                          : state === "closed" ? "stroke-rose-500 edge-active"
                            : "stroke-slate-300";
                  const strokeWidth = state === "idle" ? 1.5 : 2.5;
                  const dash = state === "active" || state === "warning" || state === "closed" ? "8 4" : undefined;
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
                } else if (n.id === "b04_cust" && activeBranches.has("customer-delay") && (customerHoldTimer || p.closureNextAt)) {
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
                    buttonLabel={handler?.label}
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

        {/* 3-Button Control Bar: Resume/Reopen Order, Admin Override, Force Close */}
        <div className="mt-3 flex flex-wrap items-center justify-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
          {isTalkToExpert && (
            <button
              type="button"
              onClick={() => mutTalkExpert.mutate()}
              disabled={closed || completed || mutTalkExpert.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-violet-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none"
            >
              <CheckCircle2 className="size-3.5" />
              Talk-to-Expert Completed (E009)
            </button>
          )}

          {/* Resume / Reopen Order */}
          {closed || (completed && p.adminOverride) ? (
            <button
              type="button"
              onClick={() => mutReopen.mutate()}
              disabled={mutReopen.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 cursor-pointer transition select-none"
              title="Reopen closed order back to Form Submitted (E09 / B09)"
            >
              <RotateCcw className="size-3.5" />
              {mutReopen.isPending ? "Reopening…" : "Reopen Order (B09)"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (phase === "technical_delay") {
                  mutResume.mutate();
                } else {
                  mutResumeCustomer.mutate();
                }
              }}
              disabled={!canResume || mutResumeCustomer.isPending || mutResume.isPending}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold shadow-xs transition select-none",
                canResume
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60"
              )}
              title={
                canResume
                  ? "Resume order to active workflow processing"
                  : "Resume Order is active when an order is in Customer Delay, Technical Delay, or On Hold (or when Admin Override is ON)"
              }
            >
              <RotateCcw className="size-3.5" />
              {(mutResumeCustomer.isPending || mutResume.isPending) ? "Resuming…" : "Resume Order"}
            </button>
          )}

          {/* Admin Override */}
          {p.onAdminOverrideChange && (
            <button
              type="button"
              onClick={() => p.onAdminOverrideChange?.(!p.adminOverride)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer transition select-none",
                p.adminOverride
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300"
              )}
              title="Toggle Admin Override to unlock all stage actions B01–B08"
            >
              <ShieldAlert className="size-3.5" />
              Admin Override: {p.adminOverride ? "ON" : "OFF"}
            </button>
          )}

          {/* Force Close */}
          <button
            type="button"
            onClick={() => setDialog({ kind: "force_close" })}
            disabled={closed}
            className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none"
            title="Force close order with closure reason and send E010 notification"
          >
            <XCircle className="size-3.5" />
            Force Close (B10)
          </button>

          {/* Silent Close (Admin Override Only — No Customer Email) */}
          {p.adminOverride && isAdmin && (
            <button
              type="button"
              onClick={() => setDialog({ kind: "silent_close" })}
              disabled={closed}
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none border border-slate-700 transition"
              title="Close order silently with NO customer email notification (Admin Override Only)"
            >
              <VolumeX className="size-3.5 text-amber-400" />
              Silent Close (No Email)
            </button>
          )}

          {/* Call Back / Reminder */}
          <button
            type="button"
            onClick={() => setDialog({ kind: "callback_reminder" })}
            disabled={closed || completed}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none",
              activeCallback?.isDue && !closed && !completed
                ? "bg-rose-600 hover:bg-rose-700 animate-pulse ring-2 ring-rose-400"
                : activeCallback && !closed && !completed
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-blue-600 hover:bg-blue-700"
            )}
            title={
              closed || completed
                ? "Callback reminder is inactive on completed/closed orders"
                : "Set customer callback reminder (order becomes Hot Order when reminder ends)"
            }
          >
            {activeCallback?.isDue && !closed && !completed ? <Flame className="size-3.5" /> : <PhoneCall className="size-3.5" />}
            {activeCallback?.isDue && !closed && !completed
              ? (activeCallback.parsedRemarks?.channel === "technical_delay" ? "Tech Delay Due (HOT ORDER)" : "Call Due Now (HOT ORDER)")
              : activeCallback && !closed && !completed
                ? (activeCallback.parsedRemarks?.channel === "technical_delay" ? "Tech Delay Scheduled" : "Callback Scheduled")
                : "Call Back / Reminder"}
          </button>
        </div>

        {activeCallback && !closed && !completed && (
          <div className={cn(
            "mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-2.5 shadow-xs",
            activeCallback.isDue
              ? "border-rose-300 bg-rose-50 text-rose-950"
              : "border-indigo-200 bg-indigo-50/80 text-indigo-950"
          )}>
            <div className="flex flex-wrap items-center gap-2.5">
              {activeCallback.isDue ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs tracking-wider">
                  <Flame className="size-3" /> HOT ORDER NOW
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs tracking-wider">
                  <Clock className="size-3" /> {activeCallback.parsedRemarks?.channel === "technical_delay" ? "Tech Delay Reminder" : "Scheduled Callback"}
                </span>
              )}
              <span className="text-sm font-bold text-slate-900">
                Due: {formatIST(activeCallback.fires_at)}
              </span>
              <span className="text-sm text-slate-800">
                · <strong className="font-bold text-slate-900">Reason:</strong> {activeCallback.parsedRemarks?.reasonLabel || "Follow-up"}
                {activeCallback.parsedRemarks?.note ? (
                  <span className="text-slate-600"> ({activeCallback.parsedRemarks.note})</span>
                ) : null}
              </span>

              {/* Channel Indicator Badge */}
              {activeCallback.parsedRemarks?.channel === "technical_delay" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-300 text-xs font-bold shadow-2xs">
                  <Server className="size-3.5 text-sky-700" /> Technical Delay
                </span>
              ) : activeCallback.parsedRemarks?.channel === "email" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold shadow-2xs">
                  <Mail className="size-3.5 text-purple-700" /> Check Email
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs">
                  <PhoneCall className="size-3.5 text-amber-700" /> Check Call
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDialog({ kind: "callback_reminder" })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer shadow-2xs ml-auto"
            >
              Manage Reminder
            </button>
          </div>
        )}


      </section>

      {/* Dialogs */}
      {dialog?.kind === "callback_reminder" && (
        <CallbackReminderDialog
          orderId={p.applicationId}
          onClose={() => { setDialog(null); invalidate(); }}
        />
      )}
      <CustomerDelayDialog
        applicationId={p.applicationId}
        open={dialog?.kind === "customer_delay"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      <TechnicalDelayDialog
        applicationId={p.applicationId}
        open={dialog?.kind === "technical_delay"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      <CloseOrderDialog
        applicationId={p.applicationId}
        open={dialog?.kind === "force_close"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      {dialog?.kind === "silent_close" && (
        <SilentCloseInline
          applicationId={p.applicationId}
          onClose={() => { setDialog(null); invalidate(); }}
        />
      )}
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
                adminOverride: p.adminOverride || undefined,
              } as any,
            });
            toast.success("E007 sent — order completed with certificate");
            setDialog(null); invalidate();
          } catch (e: any) {
            toast.error(e?.message ?? "Completion failed");
          }
        }}
      />
      {dialog?.kind === "consultation_completed" && (
        <ConsultationCompletedInline
          orderId={p.applicationId}
          pending={mutConsultation.isPending}
          onSubmit={(remarks) => mutConsultation.mutate(remarks)}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

function ConsultationCompletedInline({
  orderId, pending, onSubmit, onClose,
}: {
  orderId: string;
  pending: boolean;
  onSubmit: (remarks: string) => void;
  onClose: () => void;
}) {
  const [remarks, setRemarks] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-700">B06 · S08</div>
        <div className="mb-1 text-lg font-bold text-slate-900">Consultation Completed — send E005</div>
        <div className="mb-4 text-sm text-slate-600">
          Marks order <b>{orderId.slice(0, 8)}</b> as <b>Consultation Completed</b> and emails the customer.
          Anything you type below appears in the email as the <b>Note</b> row.
        </div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Note to customer (optional)
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value.slice(0, 1000))}
          rows={5}
          placeholder="e.g. Application filed on the Udyam portal on 21 Jul 2026. Kindly monitor your registered mobile/email for OTP or govt communication."
          className="w-full resize-y rounded-lg border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <div className="mt-1 text-right text-[11px] text-slate-400">{remarks.length}/1000</div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(remarks.trim())}
            disabled={pending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {pending ? "Sending…" : "Send E005 & mark completed"}
          </button>
        </div>
      </div>
    </div>
  );
}


function getButtonLabel(code?: string): string {
  switch (code) {
    case "B01": return "Send E002";
    case "B02": return "Send E003";
    case "B03": return "Send E011";
    case "B04": return "Send E004";
    case "B05": return "Send E005";
    case "B06": return "Send E005";
    case "B07": return "Upload PDF";
    case "B08": return "Send E008";
    default: return "Trigger";
  }
}

/* ═════════════════════════ FlowNode ═════════════════════════ */

const TONE_STYLES: Record<Tone, { border: string; bg: string; text: string; icon: string; btn: string; ring: string; solid: string }> = {
  maroon: { border: "border-rose-900", bg: "bg-rose-950", text: "text-white", icon: "text-white", btn: "bg-rose-800 hover:bg-rose-700 text-white cursor-pointer", ring: "ring-rose-400", solid: "bg-rose-900 text-white" },
  slate: { border: "border-slate-400", bg: "bg-white", text: "text-slate-800", icon: "text-slate-600", btn: "bg-slate-700 hover:bg-slate-800 text-white cursor-pointer", ring: "ring-slate-300", solid: "bg-slate-700 text-white" },
  amber: { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-900", icon: "text-amber-700", btn: "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer", ring: "ring-amber-300", solid: "bg-amber-600 text-white" },
  rose: { border: "border-rose-400", bg: "bg-rose-50", text: "text-rose-900", icon: "text-rose-700", btn: "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer", ring: "ring-rose-300", solid: "bg-rose-600 text-white" },
  sky: { border: "border-sky-400", bg: "bg-sky-50", text: "text-sky-900", icon: "text-sky-700", btn: "bg-sky-600 hover:bg-sky-700 text-white cursor-pointer", ring: "ring-sky-300", solid: "bg-sky-600 text-white" },
  violet: { border: "border-violet-400", bg: "bg-violet-50", text: "text-violet-900", icon: "text-violet-700", btn: "bg-violet-600 hover:bg-violet-700 text-white cursor-pointer", ring: "ring-violet-300", solid: "bg-violet-600 text-white" },
  emerald: { border: "border-emerald-500", bg: "bg-emerald-600", text: "text-white", icon: "text-white", btn: "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer", ring: "ring-emerald-300", solid: "bg-emerald-600 text-white" },
  indigo: { border: "border-indigo-400", bg: "bg-indigo-50", text: "text-indigo-900", icon: "text-indigo-700", btn: "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer", ring: "ring-indigo-300", solid: "bg-indigo-600 text-white" },
};

function FlowNode({
  node, state,
  buttonEnabled, buttonPending, buttonSent, buttonLabel, onButtonClick,
  countdown, phaseLabel, ticketOpen, ticketNumber, ticketHref,
}: {
  node: NodeDef;
  state: NodeState;
  buttonEnabled: boolean;
  buttonPending: boolean;
  buttonSent: boolean;
  buttonLabel?: string;
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
  else if (state === "active" && node.id === "form_not") tone = "amber";
  else if (state === "active" && node.kind === "stage") tone = "indigo";
  else if (state === "done" && node.kind === "stage") tone = "emerald";
  else if (state === "idle" && node.kind === "stage" && node.tone !== "maroon") tone = "slate";
  else if (state === "idle" && node.kind === "action" && !buttonEnabled) tone = "slate";
  // Success-path action nodes go green once their branch is done / completed.
  if ((node.id === "b06_consult" || node.id === "b07_accept") && (state === "done")) tone = "emerald";


  const t = TONE_STYLES[tone];
  const dim = state === "idle" && !buttonEnabled;
  const active = state === "active" || state === "terminal-ok" || state === "terminal-bad" || (node.kind === "action" && buttonEnabled && state !== "done");

  let badgeTopClass = "absolute -top-3 left-1/2 -translate-x-1/2";
  if (node.id === "b05_submit") {
    badgeTopClass = "absolute top-1/2 -translate-y-1/2 -left-6";
  } else if (node.id === "b06_consult" || node.id === "b07_accept") {
    badgeTopClass = "absolute top-1/2 -translate-y-1/2 -right-8";
  } else if (node.id === "b08_reject") {
    badgeTopClass = "absolute top-[35%] -translate-y-1/2 -right-8";
  } else if (node.id === "b04_cust") {
    badgeTopClass = "absolute -top-3 left-[35%] -translate-x-1/2";
  }

  let badgeBottomClass = "absolute -bottom-3 left-1/2 -translate-x-1/2";
  if (node.id === "b08_reject") {
    badgeBottomClass = "absolute top-[65%] -translate-y-1/2 -right-8";
  } else if (node.id === "b04_cust") {
    badgeBottomClass = "absolute -top-3 left-[65%] -translate-x-1/2";
  } else if (node.id === "closed_e010") {
    badgeBottomClass = "absolute top-1/2 -translate-y-1/2 -right-8";
  }

  return (
    <div
      className={cn(
        "absolute flex flex-col justify-between rounded-lg border-2 shadow-sm transition-all text-center p-1.5",
        t.border, t.bg,
        active && "ring-2 shadow-md",
        active && t.ring,
        dim && "opacity-80",
        isSub && "border-dashed",
      )}
      style={{
        left: node.x,
        top: node.y,
        width: nodeW(node),
        minHeight: nodeH(node),
        height: nodeH(node),
      }}
      data-node={node.id}
      data-state={state}
    >
      {/* Top B-Badge (Yellow pill on top edge) */}
      {node.badgeTop && (
        <span className={cn("rounded bg-yellow-300 border border-yellow-400 px-1.5 py-px text-[9px] font-black text-slate-900 shadow-xs z-10 font-mono", badgeTopClass)}>
          {node.badgeTop}
        </span>
      )}

      {/* Bottom E-Badge (Blue pill on bottom edge) */}
      {node.badgeBottom && (
        <span className={cn("rounded bg-blue-600 border border-blue-700 px-1.5 py-px text-[9px] font-black text-white shadow-xs z-10 font-mono", badgeBottomClass)}>
          {node.badgeBottom}
        </span>
      )}

      {node.tag && !node.badgeBottom && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white shadow">
          {node.tag}
        </span>
      )}
      {countdown && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
          {countdown}
        </div>
      )}

      <div className="flex items-center justify-center gap-1">
        <span className={cn("grid size-4.5 place-items-center rounded-full border bg-white shrink-0", t.border)}>
          {state === "done" && node.kind === "stage"
            ? <Check className="size-3 text-emerald-600" />
            : <Icon className={cn("size-3", node.tone === "maroon" || node.tone === "emerald" ? "text-slate-900" : t.icon)} />}
        </span>
        {active && !isTerminal && (
          <span className="rounded-full bg-rose-600 px-1 py-px text-[7px] font-black uppercase tracking-wider text-white">
            LIVE
          </span>
        )}
      </div>

      <div className={cn("px-0.5 my-auto", t.text)}>
        <div className="text-[11px] font-bold leading-tight tracking-tight">{node.label}</div>
        {node.subtitle && (
          <div className="mt-0.5 text-[9px] font-medium leading-tight opacity-90">{node.subtitle}</div>
        )}
        {node.highlightText && (
          <div className={cn(
            "mt-0.5 text-[8.5px] font-extrabold leading-tight",
            node.tone === "emerald" || tone === "emerald" ? "text-amber-200" : "text-rose-600"
          )}>
            {node.highlightText}
          </div>
        )}
      </div>

      {isAction && (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={onButtonClick}
            disabled={!buttonEnabled || buttonPending}
            title={!buttonEnabled ? `${node.buttonCode} locked in phase "${phaseLabel}"` : node.label}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1 rounded px-1 py-0.5 text-[9px] font-bold shadow-xs transition disabled:cursor-not-allowed",
              buttonEnabled ? cn(t.btn, "cursor-pointer") : "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed",
            )}
          >
            {buttonSent && <Check className="size-2.5" />}
            {buttonPending ? "…" : buttonEnabled ? (buttonLabel ?? getButtonLabel(node.buttonCode)) : buttonSent ? "Sent" : "Locked"}
          </button>
        </div>
      )}

      {isSub && ticketOpen && (
        <div className="pt-0.5">
          <a
            href={ticketHref ?? "#"}
            className="inline-flex w-full items-center justify-center gap-1 rounded bg-violet-600 px-1 py-0.5 text-[9px] font-bold text-white shadow-sm hover:bg-violet-700 cursor-pointer"
          >
            #{ticketNumber} <ArrowRight className="size-2.5" />
          </a>
        </div>
      )}
      {isSub && !ticketOpen && (
        <div className="pt-0.5 text-[8px] italic opacity-60">No open ticket</div>
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

/* ─── Inline Silent Close (Admin Override) dialog ─── */

function SilentCloseInline({ applicationId, onClose }: { applicationId: string; onClose: () => void }) {
  const [reasonText, setReasonText] = useState("");
  const fnSilent = useServerFn(silentCloseOrder);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await fnSilent({
        data: {
          applicationId,
          reasonCode: "ADMIN_SILENT_CLOSE",
          reasonLabel: "Silent Close (Admin Override)",
          notes: reasonText.trim() || undefined,
        },
      });
      toast.success("Order closed silently — no customer email sent");
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Silent close failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 text-white p-5 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <VolumeX className="size-4.5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">Silent Close Order (Admin Override)</div>
            <div className="text-xs text-slate-400">Close immediately without sending any customer email</div>
          </div>
        </div>

        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
          ⚠️ <b>No Customer Email:</b> This will transition the order to Closed, cancel all active reminders and hot order alerts, and update the status without sending any emails or notifications to the customer.
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Internal Remarks / Reason (Optional)</label>
          <textarea
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="e.g. Offline resolved / test order / client requested silent closure"
            rows={3}
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-md border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition disabled:opacity-50 shadow-md cursor-pointer"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <VolumeX className="size-3.5" />}
            Confirm Silent Close
          </button>
        </div>
      </div>
    </div>
  );
}

// silence unused import warning if useEffect isn't referenced directly
void useEffect;
