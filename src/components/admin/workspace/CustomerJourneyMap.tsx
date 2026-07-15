// Customer Journey — Live Path (lane-based layout).
//
// Top row: linear 7-node happy path (Lead → … → Completed) plus an
// "Order Closed" terminal node.
// Below the main path: one clearly-labeled horizontal LANE per branch,
// each anchored to its parent stage. Lanes never overlap; the live lane
// lights up based on derivePhase() + workflowStatus + closureStage.
//
// Lanes:
//   A — Form Not Submitted           (parent: Order Received)      → Order Closed
//   B — Technical Delay              (parent: Form Submitted)      → back to Govt Portal
//   C — Customer-Side Delay          (parent: Form Submitted)      → Order Closed
//     └─ Ticket paused (sub-lane)    (parent: Lane C)              → resume via T001/T002
//   D — Consultation Completed       (parent: Govt Portal / Form)  → Completed
//   E — Final Status (Wait / Accept / Reject / Reminder)           → Completed / Closed
//
// Button gating flows through PHASE_ENABLED_BUTTONS[phase] — every disabled
// button shows a tooltip explaining why. When a button's phase already fired,
// gate() naturally reports false so the button renders as "Sent ✓".

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, User, CreditCard, Inbox, FileText, Landmark, Search, Flag,
  Clock, XCircle, CheckCircle2, ClipboardCheck,
  FileWarning, Wrench, UserX, LifeBuoy, Send, UploadCloud, Mail,
  ArrowRight,
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

const MAIN_NODES = [
  { key: "lead",      label: "Lead\nReceived",           Icon: User },
  { key: "payment",   label: "Payment\nReceived",        Icon: CreditCard },
  { key: "order",     label: "Order\nReceived",          Icon: Inbox },
  { key: "form",      label: "Form\nSubmitted",          Icon: FileText },
  { key: "govt",      label: "Application\nSubmitted",   Icon: Landmark },
  { key: "final",     label: "Check Final\nStatus",      Icon: Search },
  { key: "completed", label: "Order\nCompleted",         Icon: Flag },
] as const;

/* Tone system --------------------------------------------------------- */

type Tone = "amber" | "rose" | "sky" | "violet" | "emerald" | "indigo";
const TONE: Record<Tone, { rail: string; text: string; bg: string; ring: string; btn: string; chip: string }> = {
  amber:   { rail: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",   ring: "ring-amber-300",   btn: "bg-amber-500 hover:bg-amber-600 text-white",     chip: "bg-amber-100 text-amber-800" },
  rose:    { rail: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50",    ring: "ring-rose-300",    btn: "bg-rose-600 hover:bg-rose-700 text-white",       chip: "bg-rose-100 text-rose-800" },
  sky:     { rail: "bg-sky-400",     text: "text-sky-700",     bg: "bg-sky-50",     ring: "ring-sky-300",     btn: "bg-sky-600 hover:bg-sky-700 text-white",         chip: "bg-sky-100 text-sky-800" },
  violet:  { rail: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50",  ring: "ring-violet-300",  btn: "bg-violet-600 hover:bg-violet-700 text-white",   chip: "bg-violet-100 text-violet-800" },
  emerald: { rail: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-300", btn: "bg-emerald-600 hover:bg-emerald-700 text-white", chip: "bg-emerald-100 text-emerald-800" },
  indigo:  { rail: "bg-indigo-500",  text: "text-indigo-700",  bg: "bg-indigo-50",  ring: "ring-indigo-300",  btn: "bg-indigo-600 hover:bg-indigo-700 text-white",   chip: "bg-indigo-100 text-indigo-800" },
};

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

  // Open ticket for this order (pauses Lane C)
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

  /* ───── Lane liveness flags ───── */
  const laneALive = live.activeSubKey === "form-not-submitted";
  const laneBLive = live.activeSubKey === "technical-delay";
  const laneCLive = live.activeSubKey === "customer-delay";
  const laneDLive = phase === "consultation_done";
  const laneELive = phase === "awaiting_govt" || phase === "status_checked" || phase === "post_wait_submitted";

  const closedByA = closed && !!live.reasonCode?.startsWith("A");
  const closedByB = closed && !!live.reasonCode?.startsWith("B");

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">
              Customer Journey — Live Path
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>Current Stage:</span>
              <span className="font-semibold text-indigo-700">{currentStageLabel}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  closed ? "bg-rose-100 text-rose-700"
                  : laneBLive ? "bg-sky-100 text-sky-800"
                  : laneCLive ? "bg-amber-100 text-amber-800"
                  : laneALive ? "bg-amber-100 text-amber-800"
                  : laneELive ? "bg-violet-100 text-violet-800"
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
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-500">
            <LegendDot cls="bg-emerald-500" /> Done
            <LegendDot cls="bg-indigo-500" /> Current
            <LegendDot cls="bg-amber-400" /> Delay
            <LegendDot cls="bg-rose-500" /> Closed
            <LegendDot cls="bg-slate-300" /> Idle
          </div>
        </header>

        {/* ═══════════ Main path row ═══════════ */}
        <div className="overflow-x-auto pb-2 pt-5">
          <div className="min-w-[900px]">
            <div className="flex items-start">
              {MAIN_NODES.map((n, i) => (
                <div key={n.key} className="flex flex-1 items-start">
                  <MainStage
                    Icon={n.Icon}
                    label={n.label}
                    state={
                      closed ? (i < currentIdx ? "done" : "upcoming")
                      : i < currentIdx ? "done"
                      : i === currentIdx ? "current"
                      : "upcoming"
                    }
                    highlight={i === currentIdx && !closed ? live.subStateLabel : undefined}
                  />
                  {i < MAIN_NODES.length - 1 && (
                    <div className="mt-6 flex-1 px-1">
                      <div
                        className={cn(
                          "h-0.5 w-full",
                          i < currentIdx ? "bg-emerald-500"
                          : i === currentIdx ? "bg-indigo-400"
                          : "bg-slate-200",
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════ Lane strips ═══════════ */}
        <div className="mt-4 space-y-2.5">
          {/* Lane A — Form Not Submitted */}
          <LaneRow
            id="A"
            tone="amber"
            parent="Order Received"
            title="Form Not Submitted"
            Icon={FileWarning}
            live={laneALive}
            terminal={closedByA ? "Order Closed (E010)" : undefined}
            terminalTone="rose"
            countdown={
              (laneALive || closureArmed) && (formAutoCloseTimer || p.closureNextAt) ? (
                <CountdownChip
                  firesAt={formAutoCloseTimer?.fires_at ?? formAutoCloseTimer?.firesAt ?? p.closureNextAt}
                  label="auto-close"
                />
              ) : null
            }
            buttons={[
              {
                code: "B01",
                emailCode: "E002",
                label: "Send Form Link",
                onClick: () => mutFormLink.mutate(),
                enabled: gate("B01"),
                pending: mutFormLink.isPending,
                tone: "amber",
              },
            ]}
            phase={phase}
          />

          {/* Lane B — Technical Delay */}
          <LaneRow
            id="B"
            tone="sky"
            parent="Form Submitted"
            title="Technical / External Delay"
            Icon={Wrench}
            live={laneBLive}
            terminal={phase === "technical_delay" ? undefined : undefined}
            countdown={
              laneBLive && technicalHoldTimer ? (
                <CountdownChip
                  firesAt={technicalHoldTimer.fires_at ?? technicalHoldTimer.firesAt}
                  label="reminder"
                />
              ) : null
            }
            buttons={[
              {
                code: "B02",
                emailCode: "E003",
                label: "Log Technical Delay",
                onClick: () => setDialog({ kind: "technical_delay" }),
                enabled: gate("B02"),
                tone: "sky",
              },
              {
                code: "B03",
                emailCode: "E011",
                label: "Issue Resolved — Resume",
                onClick: () => mutResume.mutate(),
                enabled: gate("B03"),
                pending: mutResume.isPending,
                tone: "emerald",
              },
            ]}
            phase={phase}
          />

          {/* Lane C — Customer-Side Delay */}
          <LaneRow
            id="C"
            tone={hasOpenTicket && laneCLive ? "violet" : "amber"}
            parent="Form Submitted"
            title={hasOpenTicket && laneCLive ? "Customer Delay — Ticket open (paused)" : "Customer-Side Delay"}
            Icon={hasOpenTicket && laneCLive ? LifeBuoy : UserX}
            live={laneCLive}
            terminal={closedByA ? "Order Closed" : undefined}
            terminalTone="rose"
            countdown={
              laneCLive && (customerHoldTimer || p.closureNextAt) ? (
                <CountdownChip
                  firesAt={customerHoldTimer?.fires_at ?? customerHoldTimer?.firesAt ?? p.closureNextAt}
                  label="auto-close"
                  paused={hasOpenTicket}
                />
              ) : null
            }
            buttons={[
              {
                code: "B10",
                emailCode: "E004",
                label: "Log Customer Delay",
                onClick: () => setDialog({ kind: "customer_delay" }),
                enabled: gate("B10"),
                tone: "amber",
              },
            ]}
            phase={phase}
          />

          {/* Sub-lane: ticket paused (only when open ticket exists on this order) */}
          {hasOpenTicket && openTicket?.id && (
            <div className="ml-8 rounded-lg border border-violet-200 bg-violet-50/40 p-2.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-violet-900">
                <LifeBuoy className="size-3.5 text-violet-600" />
                <span className="font-bold">Ticket #{openTicket.ticket_number ?? String(openTicket.id).slice(0, 8)}</span>
                <span className="text-violet-500">·</span>
                <span className="truncate max-w-[280px]">{openTicket.subject ?? "Customer inquiry"}</span>
                <span className="text-violet-500">·</span>
                <a
                  href={`/admin/tickets/${openTicket.id}`}
                  className="inline-flex items-center gap-0.5 rounded-md border border-violet-300 bg-white px-1.5 py-0.5 font-semibold text-violet-700 hover:bg-violet-100"
                >
                  Open thread <ArrowRight className="size-3" />
                </a>
              </div>
              <div className="mt-1.5 text-[10px] text-violet-700">
                Close the ticket from the ticket page to resume Lane C (or restart / complete the order).
              </div>
            </div>
          )}

          {/* Lane D — Consultation Completed / Submit shortcut */}
          <LaneRow
            id="D"
            tone="emerald"
            parent="Form / Govt Portal"
            title="Consultation Completed → Submit to Govt"
            Icon={Send}
            live={laneDLive}
            terminal={completed ? "Order Completed" : undefined}
            terminalTone="emerald"
            buttons={[
              {
                code: "B04",
                emailCode: "E005",
                label: "Consultation Done · Submit (E005)",
                onClick: () => mutSubmit.mutate(),
                enabled: gate("B04"),
                pending: mutSubmit.isPending,
                tone: "emerald",
              },
            ]}
            phase={phase}
          />

          {/* Lane E — Awaiting Govt Approval / Final Status flow */}
          <LaneRow
            id="E"
            tone="violet"
            parent="Govt Portal → Final Status"
            title="Awaiting Govt · Check Status · Final Outcome"
            Icon={ClipboardCheck}
            live={laneELive}
            terminal={
              completed ? "Order Completed"
              : closedByB ? "Order Closed (E008)"
              : undefined
            }
            terminalTone={closedByB ? "rose" : "emerald"}
            buttons={[
              {
                code: "B05",
                emailCode: "E006",
                label: "Submitted · Waiting (+reminder)",
                onClick: promptReminder,
                enabled: gate("B05"),
                tone: "violet",
              },
              {
                code: "B06",
                emailCode: "E006",
                label: "Status Checked · Add Reminder",
                onClick: promptReminder,
                enabled: gate("B06"),
                tone: "sky",
              },
              {
                code: "B07",
                emailCode: "E005",
                label: "Consultation Done (After Wait)",
                onClick: () => mutSubmitAfterWait.mutate(),
                enabled: gate("B07"),
                pending: mutSubmitAfterWait.isPending,
                tone: "emerald",
              },
              {
                code: "B08",
                emailCode: "E007",
                label: "Accepted · Upload PDF",
                onClick: () => setDialog({ kind: "complete_with_cert" }),
                enabled: gate("B08"),
                tone: "emerald",
              },
              {
                code: "B09",
                emailCode: "E008",
                label: "Rejected · Close",
                onClick: () => setDialog({ kind: "govt_rejected" }),
                enabled: gate("B09"),
                tone: "rose",
              },
              {
                code: "B10",
                emailCode: "E004",
                label: "Customer Delay (again)",
                onClick: () => setDialog({ kind: "customer_delay" }),
                enabled: gate("B10"),
                tone: "amber",
              },
            ]}
            phase={phase}
          />

          {/* Talk-to-Expert lane (only for consultation orders) */}
          {isTalkToExpert && (
            <LaneRow
              id="TX"
              tone="violet"
              parent="Order Completed"
              title="Talk-to-Expert Consultation"
              Icon={CheckCircle2}
              live={false}
              buttons={[
                {
                  code: "B08",
                  emailCode: "E009",
                  label: "Consultation Completed (E009)",
                  onClick: () => mutTalkExpert.mutate(),
                  enabled: !closed && !completed,
                  pending: mutTalkExpert.isPending,
                  tone: "violet",
                },
              ]}
              phase={phase}
            />
          )}

          {/* Always-visible Force Close row (Cat A → E010) */}
          <div className="flex items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2">
            <div className="flex items-center gap-2 text-[11px] text-rose-800">
              <Mail className="size-3.5 text-rose-600" />
              <span className="font-bold">Force Close (E010)</span>
              <span className="text-rose-500">·</span>
              <span>Cancels all timers. Requires a Category A reason.</span>
            </div>
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

        {/* Bottom status strip */}
        {(view.hasEngine && view.nextTimer && !closed) || closureArmed || closed ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
            {view.hasEngine && view.nextTimer && !closed && (
              <span><Clock className="mr-1 inline size-3" />Next auto-step: <b>{view.nextTimer.kind}</b> · {relativeIST(view.nextTimer.firesAt)}</span>
            )}
            {closureArmed && p.closureStage && (
              <span><Clock className="mr-1 inline size-3 text-amber-600" />Closure armed: <b>{p.closureStage}</b>{p.closureNextAt ? <> · fires {relativeIST(p.closureNextAt)}</> : null}</span>
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

/* ═════════════════════════ Pieces ═════════════════════════ */

type MainState = "done" | "current" | "upcoming";

function MainStage({
  Icon, label, state, highlight,
}: {
  Icon: any; label: string; state: MainState; highlight?: string;
}) {
  const circle =
    state === "done"    ? "bg-emerald-500 border-emerald-500 text-white"
  : state === "current" ? "bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-100"
  :                       "bg-white border-slate-300 text-slate-400";
  return (
    <div className="flex w-24 flex-col items-center gap-1.5">
      <div className={cn("grid place-items-center rounded-full border-2 shadow-sm size-12", circle)}>
        {state === "done" ? <Check className="size-5" /> : <Icon className="size-5" />}
      </div>
      <div className={cn(
        "text-center text-[10px] font-bold leading-tight whitespace-pre-line",
        state === "current" ? "text-indigo-700" : state === "done" ? "text-emerald-700" : "text-slate-500",
      )}>
        {label}
      </div>
      {highlight && state === "current" && (
        <div className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-700">
          {highlight}
        </div>
      )}
    </div>
  );
}

interface LaneButton {
  code: ButtonCode;
  emailCode: string;
  label: string;
  onClick: () => void;
  enabled: boolean;
  pending?: boolean;
  tone: Tone;
}

function LaneRow({
  id, tone, parent, title, Icon, live, buttons, countdown, terminal, terminalTone, phase,
}: {
  id: string;
  tone: Tone;
  parent: string;
  title: string;
  Icon: any;
  live: boolean;
  buttons: LaneButton[];
  countdown?: React.ReactNode;
  terminal?: string;
  terminalTone?: Tone;
  phase: string;
}) {
  const t = TONE[tone];
  return (
    <div
      className={cn(
        "relative flex items-stretch gap-3 rounded-xl border-2 p-2.5 transition-all",
        live ? cn(t.bg, "border-transparent ring-2", t.ring, "shadow-sm")
             : "border-slate-200 bg-white/60",
      )}
    >
      {/* left rail */}
      <div className={cn("w-1 rounded-full", live ? t.rail : "bg-slate-200")} />

      {/* label column */}
      <div className="flex w-52 shrink-0 flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "grid size-6 place-items-center rounded-full border",
            live ? cn(t.text, "border-current bg-white") : "border-slate-300 text-slate-500 bg-white",
          )}>
            <Icon className="size-3.5" />
          </span>
          <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider", live ? t.chip : "bg-slate-100 text-slate-500")}>
            Lane {id}
          </span>
          {live && <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Live</span>}
        </div>
        <div className={cn("mt-1 text-[12px] font-bold leading-tight", live ? t.text : "text-slate-700")}>
          {title}
        </div>
        <div className="mt-0.5 text-[10px] text-slate-500">from {parent}</div>
      </div>

      {/* countdown + buttons */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        {countdown && <div className="flex items-center gap-2">{countdown}</div>}
        <div className="flex flex-wrap items-center gap-1.5">
          {buttons.map((b) => (
            <LaneButton key={b.code + b.emailCode} b={b} phase={phase} />
          ))}
        </div>
      </div>

      {/* terminal chip */}
      {terminal && (
        <div className="flex items-center gap-1 self-center shrink-0">
          <ArrowRight className={cn("size-3.5", live ? t.text : "text-slate-400")} />
          <span
            className={cn(
              "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
              terminalTone ? TONE[terminalTone].chip : "bg-slate-100 text-slate-600",
            )}
          >
            {terminal}
          </span>
        </div>
      )}
    </div>
  );
}

function LaneButton({ b, phase }: { b: LaneButton; phase: string }) {
  const t = TONE[b.tone];
  const disabled = !b.enabled || b.pending;
  const isSent = !b.enabled; // gate() returned false → phase moved past it
  const title = !b.enabled
    ? `${b.code} not available in current phase (${phase})`
    : b.label;
  return (
    <button
      type="button"
      onClick={b.onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold shadow-sm transition disabled:cursor-not-allowed",
        b.enabled
          ? t.btn
          : "bg-slate-100 text-slate-500 border border-slate-200",
      )}
    >
      <span className={cn(
        "font-mono text-[8.5px] rounded px-1 py-0.5 shrink-0",
        b.enabled ? "bg-white/25 text-white" : "bg-white text-slate-500",
      )}>
        {b.code}·{b.emailCode}
      </span>
      <span className="truncate max-w-[200px]">{b.label}</span>
      {isSent && <Check className="size-3 shrink-0 opacity-70" />}
    </button>
  );
}

function LegendDot({ cls }: { cls: string }) {
  return <span className={cn("inline-block size-2.5 rounded-full", cls)} />;
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
