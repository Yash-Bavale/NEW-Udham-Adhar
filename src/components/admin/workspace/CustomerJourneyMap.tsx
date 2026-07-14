// Customer Journey — Live Path (flowchart)
// Fixed-layout tree that mirrors the approved BHS flow chart:
//   Lead → Payment → Order → Form → Govt Portal → Final Status → Completed
//                                                                        │
//                                                                     Order Closed (terminal)
// Sub-branches are ALWAYS visible; the correct one lights up automatically
// based on stage + workflowStatus + closureStage.

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, User, CreditCard, Inbox, FileText, Landmark, Search, Flag,
  Hourglass, Mail, Clock, ThumbsUp, UploadCloud, XCircle, CheckCircle2,
  ArrowRight, ClipboardCheck, AlertTriangle,
} from "lucide-react";

import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { formatIST, relativeIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";

import { JOURNEY_STAGES, deriveJourneyLiveState } from "@/lib/orders/journey-map";

import { ExternalDelayDialog } from "@/components/admin/ExternalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";

import { sendFormLink, markSubmittedToGovt, sendManualReminder, completeOrder } from "@/lib/orders/order-actions.functions";
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

/* ─────────────────── Layout constants (px) ─────────────────── */

const NODE_X = [110, 320, 530, 740, 950, 1160, 1400];
const NODE_Y = 60;
const CIRCLE = 56;
const LABEL_W = 170;
const CARD_W = 190;
const CARD_H = 118;
const ROW_STRIDE = 140;
const ROW_Y = [230, 230 + ROW_STRIDE, 230 + ROW_STRIDE * 2, 230 + ROW_STRIDE * 3];
const CLOSED_NODE_X = NODE_X[6];
const CLOSED_NODE_Y = ROW_Y[3] + CARD_H + 40; // 810
const CANVAS_W = 1560;
const CANVAS_H = CLOSED_NODE_Y + 90;

/* ─────────────────── Component ─────────────────── */

type NodeState = "done" | "current" | "upcoming" | "blocked";

const MAIN_NODES = [
  { key: "lead",      short: "Lead\nReceived",       Icon: User },
  { key: "payment",   short: "Payment\nReceived",    Icon: CreditCard },
  { key: "order",     short: "Order\nReceived",      Icon: Inbox },
  { key: "form",      short: "Form\nSubmitted",      Icon: FileText },
  { key: "govt",      short: "Application\nSubmitted to\nGovt Portal", Icon: Landmark },
  { key: "final",     short: "Check Final\nApplication\nStatus on\nGovt Portal", Icon: Search },
  { key: "completed", short: "Order\nCompleted",     Icon: Flag },
] as const;

export function CustomerJourneyMap(p: Props) {
  const qc = useQueryClient();
  const { view } = useOrderWorkflow(p.applicationId);
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

  const timers = view.timers ?? [];
  const findTimer = (kindMatch: RegExp) =>
    timers.find((t: any) => kindMatch.test(t?.kind ?? "") && t?.status === "running") ?? null;
  const formAutoCloseTimer  = findTimer(/form_pending_autoclose|form_.*8h/);
  const customerHoldTimer   = findTimer(/customer_hold|customer_side_autoclose/);
  const technicalHoldTimer  = findTimer(/technical_hold|our_side_reminder/);

  const currentStageLabel = useMemo(() => {
    const s = JOURNEY_STAGES[Math.min(Math.max(currentIdx, 0), JOURNEY_STAGES.length - 1)];
    return s?.label ?? "Order Received";
  }, [currentIdx]);

  const nodeState = (idx: number): NodeState => {
    if (closed) return idx < currentIdx ? "done" : "upcoming";
    if (idx < currentIdx) return "done";
    if (idx === currentIdx) return "current";
    return "upcoming";
  };
  const completedNodeState: NodeState = completed ? "current" : closed ? "blocked" : nodeState(6);
  const closedNodeState: NodeState = closed ? "current" : "upcoming";

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

  const activeLine = "#6366F1";
  const doneLine   = "#10B981";
  const idleLine   = "#CBD5E1";
  const delayLine  = "#F59E0B";
  const closeLine  = "#F43F5E";

  /* Helper: orthogonal L-connector from (x1,y1) down/right to (x2,y2) */
  const ortho = (x1: number, y1: number, x2: number, y2: number, bend?: number) => {
    const bx = bend ?? x1;
    return `M ${x1} ${y1} L ${bx} ${(y1 + y2) / 2} L ${x2} ${(y1 + y2) / 2} L ${x2} ${y2}`;
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">Customer Journey — Live Path</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>Current Stage:</span>
              <span className="font-semibold text-indigo-700">{currentStageLabel}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  closed ? "bg-rose-100 text-rose-700"
                  : live.activeSubKey?.includes("delay") ? "bg-amber-100 text-amber-800"
                  : live.activeSubKey === "form-not-submitted" ? "bg-amber-100 text-amber-800"
                  : live.activeSubKey === "govt-awaiting" ? "bg-sky-100 text-sky-800"
                  : completed ? "bg-emerald-100 text-emerald-800"
                  : "bg-indigo-100 text-indigo-800",
                )}
              >
                {closed ? <XCircle className="size-3" /> : <ClipboardCheck className="size-3" />}
                {live.subStateLabel}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-600">
            <LegendDot color="bg-emerald-500 text-white"><Check className="size-3" /></LegendDot><span>Completed</span>
            <LegendDot color="bg-white border-2 border-indigo-500 text-indigo-600" /><span>Current</span>
            <LegendDot color="bg-white border-2 border-sky-400 text-sky-500" /><span>Upcoming</span>
            <LegendDot color="bg-white border-2 border-amber-500 text-amber-500" /><span>Delay</span>
            <LegendDot color="bg-white border-2 border-rose-500 text-rose-500" /><span>Closed</span>
          </div>
        </header>

        <div className="overflow-x-auto pb-2 pt-4">
          <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
            <svg width={CANVAS_W} height={CANVAS_H} className="absolute inset-0 pointer-events-none">
              <defs>
                {["done","current","idle","delay","close"].map((k, i) => {
                  const color = [doneLine, activeLine, idleLine, delayLine, closeLine][i];
                  return (
                    <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="8" refY="5"
                      markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill={color} />
                    </marker>
                  );
                })}
              </defs>

              {/* Main horizontal line */}
              {NODE_X.slice(0, -1).map((x, i) => {
                const nextX = NODE_X[i + 1];
                const state = nodeState(i);
                const nextState = nodeState(i + 1);
                const color = closed ? idleLine
                  : state === "done" ? doneLine
                  : (nextState === "current" || state === "current") ? activeLine
                  : idleLine;
                return (
                  <line key={i}
                    x1={x + CIRCLE / 2} y1={NODE_Y}
                    x2={nextX - CIRCLE / 2} y2={NODE_Y}
                    stroke={color} strokeWidth={2.5}
                    markerEnd={`url(#arrow-${state === "done" ? "done" : (nextState === "current" || state === "current") ? "current" : "idle"})`}
                  />
                );
              })}

              {/* ─── Order Received column (index 2): Form Not Submitted → Force Close → Order Closed */}
              <line x1={NODE_X[2]} y1={NODE_Y + CIRCLE / 2}
                    x2={NODE_X[2]} y2={ROW_Y[0] - 4}
                    stroke={live.activeSubKey === "form-not-submitted" ? delayLine : idleLine} strokeWidth={2}
                    markerEnd={`url(#arrow-${live.activeSubKey === "form-not-submitted" ? "delay" : "idle"})`} />
              <line x1={NODE_X[2]} y1={ROW_Y[0] + CARD_H}
                    x2={NODE_X[2]} y2={ROW_Y[1] - 4}
                    stroke={closed && live.reasonCode?.startsWith("A") ? closeLine : idleLine} strokeWidth={2} strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${closed && live.reasonCode?.startsWith("A") ? "close" : "idle"})`} />
              {/* Force Close → Order Closed (bottom-right terminal): horizontal then down */}
              <path d={`M ${NODE_X[2]} ${ROW_Y[1] + CARD_H} L ${NODE_X[2]} ${CLOSED_NODE_Y} L ${CLOSED_NODE_X - CIRCLE / 2} ${CLOSED_NODE_Y}`}
                    stroke={closed && live.reasonCode?.startsWith("A") ? closeLine : idleLine}
                    strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${closed && live.reasonCode?.startsWith("A") ? "close" : "idle"})`} />

              {/* ─── Form Submitted column (index 3): Technical Delay → return; Customer Delay → Order Closed */}
              <line x1={NODE_X[3]} y1={NODE_Y + CIRCLE / 2}
                    x2={NODE_X[3]} y2={ROW_Y[0] - 4}
                    stroke={live.activeSubKey === "technical-delay" ? delayLine : idleLine} strokeWidth={2}
                    markerEnd={`url(#arrow-${live.activeSubKey === "technical-delay" ? "delay" : "idle"})`} />
              {/* Tech Delay resumes → arrow back up to Govt Portal node */}
              <path d={`M ${NODE_X[3] + CARD_W / 2 - 10} ${ROW_Y[0] + CARD_H / 2}
                        L ${(NODE_X[3] + NODE_X[4]) / 2} ${ROW_Y[0] + CARD_H / 2}
                        L ${(NODE_X[3] + NODE_X[4]) / 2} ${NODE_Y + CIRCLE / 2 + 4}
                        L ${NODE_X[4]} ${NODE_Y + CIRCLE / 2 + 4}`}
                    stroke={live.activeSubKey === "technical-delay" ? delayLine : idleLine} strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${live.activeSubKey === "technical-delay" ? "delay" : "idle"})`} />
              <line x1={NODE_X[3]} y1={ROW_Y[0] + CARD_H}
                    x2={NODE_X[3]} y2={ROW_Y[1] - 4}
                    stroke={live.activeSubKey === "customer-delay" ? delayLine : idleLine} strokeWidth={2}
                    markerEnd={`url(#arrow-${live.activeSubKey === "customer-delay" ? "delay" : "idle"})`} />
              <path d={`M ${NODE_X[3]} ${ROW_Y[1] + CARD_H} L ${NODE_X[3]} ${CLOSED_NODE_Y} L ${CLOSED_NODE_X - CIRCLE / 2} ${CLOSED_NODE_Y}`}
                    stroke={closed && live.reasonCode?.startsWith("A") ? closeLine : idleLine}
                    strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${closed && live.reasonCode?.startsWith("A") ? "close" : "idle"})`} />

              {/* ─── Govt Portal column (index 4): Consultation Completed → Completed; Waiting → Final Status */}
              <line x1={NODE_X[4]} y1={NODE_Y + CIRCLE / 2}
                    x2={NODE_X[4]} y2={ROW_Y[0] - 4}
                    stroke={completed ? doneLine : activeLine} strokeWidth={2}
                    markerEnd={`url(#arrow-${completed ? "done" : "current"})`} />
              {/* Consultation Completed card → Completed node (right-up curve) */}
              <path d={`M ${NODE_X[4] + CARD_W / 2} ${ROW_Y[0] + CARD_H / 2}
                        L ${NODE_X[6]} ${ROW_Y[0] + CARD_H / 2}
                        L ${NODE_X[6]} ${NODE_Y + CIRCLE / 2 + 4}`}
                    stroke={completed ? doneLine : idleLine} strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${completed ? "done" : "idle"})`} />
              {/* Waiting for Govt Approval card → Final Status */}
              <line x1={NODE_X[4]} y1={ROW_Y[0] + CARD_H}
                    x2={NODE_X[4]} y2={ROW_Y[1] - 4}
                    stroke={live.activeSubKey === "govt-awaiting" ? activeLine : idleLine} strokeWidth={2}
                    markerEnd={`url(#arrow-${live.activeSubKey === "govt-awaiting" ? "current" : "idle"})`} />
              <path d={`M ${NODE_X[4] + CARD_W / 2} ${ROW_Y[1] + CARD_H / 2}
                        L ${NODE_X[5]} ${ROW_Y[1] + CARD_H / 2}
                        L ${NODE_X[5]} ${NODE_Y + CIRCLE / 2 + 4}`}
                    stroke={idleLine} strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-idle)`} />

              {/* ─── Check Final Status column (index 5): 4 rows */}
              {[0, 1, 2, 3].map((r) => (
                <line key={r}
                  x1={NODE_X[5]} y1={r === 0 ? NODE_Y + CIRCLE / 2 : ROW_Y[r - 1] + CARD_H}
                  x2={NODE_X[5]} y2={ROW_Y[r] - 4}
                  stroke={idleLine} strokeWidth={2} strokeDasharray={r === 0 ? undefined : "5 4"}
                  markerEnd={`url(#arrow-idle)`} />
              ))}
              {/* Awaiting Response (row 0) → returns loop to same node (small arc right) */}
              {/* Consultation Completed (After Waiting) row 1 → Completed */}
              <path d={`M ${NODE_X[5] + CARD_W / 2} ${ROW_Y[1] + CARD_H / 2}
                        L ${NODE_X[6]} ${ROW_Y[1] + CARD_H / 2}
                        L ${NODE_X[6]} ${NODE_Y + CIRCLE / 2 + 4}`}
                    stroke={completed ? doneLine : idleLine} strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${completed ? "done" : "idle"})`} />
              {/* Accepted Upload PDF row 2 → Completed */}
              <path d={`M ${NODE_X[5] + CARD_W / 2} ${ROW_Y[2] + CARD_H / 2}
                        L ${NODE_X[6]} ${ROW_Y[2] + CARD_H / 2}
                        L ${NODE_X[6]} ${NODE_Y + CIRCLE / 2 + 4}`}
                    stroke={completed ? doneLine : idleLine} strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${completed ? "done" : "idle"})`} />
              {/* Rejected row 3 → Order Closed */}
              <path d={`M ${NODE_X[5] + CARD_W / 2} ${ROW_Y[3] + CARD_H / 2}
                        L ${CLOSED_NODE_X - CIRCLE / 2 - 20} ${ROW_Y[3] + CARD_H / 2}
                        L ${CLOSED_NODE_X - CIRCLE / 2 - 20} ${CLOSED_NODE_Y}
                        L ${CLOSED_NODE_X - CIRCLE / 2} ${CLOSED_NODE_Y}`}
                    stroke={closed && live.reasonCode?.startsWith("B") ? closeLine : idleLine}
                    strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${closed && live.reasonCode?.startsWith("B") ? "close" : "idle"})`} />

              {/* Completed → Order Closed (only when closed) */}
              <line x1={NODE_X[6]} y1={NODE_Y + CIRCLE / 2}
                    x2={NODE_X[6]} y2={CLOSED_NODE_Y - CIRCLE / 2}
                    stroke={closed ? closeLine : idleLine} strokeWidth={2} strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${closed ? "close" : "idle"})`} />
            </svg>

            {/* Main nodes */}
            {MAIN_NODES.map((n, i) => (
              <MainStage
                key={n.key}
                x={NODE_X[i]}
                state={i === 6 ? completedNodeState : nodeState(i)}
                Icon={n.Icon}
                label={n.short}
                tooltip={STAGE_TOOLTIPS[i]}
                sublabel={i === currentIdx && !closed ? live.subStateLabel : undefined}
              />
            ))}

            {/* Order Closed terminal */}
            <MainStage
              x={CLOSED_NODE_X}
              y={CLOSED_NODE_Y}
              state={closedNodeState}
              Icon={XCircle}
              label={"Order\nClosed"}
              tone="rose"
              tooltip="Terminal. All closure paths (Force Close E010, Customer Delay auto-close, Govt Rejection E008) land here."
              sublabel={closed && p.closureReasonLabel ? p.closureReasonLabel : undefined}
            />

            {/* ─── Sub-cards ─── */}

            {/* Order column: Form Not Submitted */}
            <SubCard
              x={NODE_X[2] - CARD_W / 2} y={ROW_Y[0]}
              w={CARD_W} h={CARD_H}
              tone="amber"
              active={live.activeSubKey === "form-not-submitted"}
              icon={<Hourglass className="size-4" />}
              chip="E002"
              title="Form Not Submitted"
              subtitle={
                formAutoCloseTimer
                  ? `Auto-closes ${relativeIST(formAutoCloseTimer.fires_at ?? formAutoCloseTimer.firesAt)}`
                  : "Send info-incomplete mail · Auto-close in 8h (A7)"
              }
              tooltip="Send E002 (form link / incomplete-information mail). Arms 8-hour auto-close with reason A7."
              button={{
                label: "Send Information Incomplete Mail (E002)",
                onClick: () => mutFormLink.mutate(),
                variant: "amber",
                disabled: mutFormLink.isPending || closed,
              }}
            />
            {/* Order column: Force Close */}
            <SubCard
              x={NODE_X[2] - CARD_W / 2} y={ROW_Y[1]}
              w={CARD_W} h={CARD_H}
              tone="rose"
              active={closed && live.reasonCode?.startsWith("A") === true}
              icon={<Mail className="size-4" />}
              chip="E010"
              title="Force Close Order"
              subtitle="Pick Category A reason · sends E010 · Order Closed"
              tooltip="Force-close now with a Category A reason. Cancels any pending timers."
              button={{
                label: "Force Close (E010)",
                onClick: () => setDialog({ kind: "force_close" }),
                variant: "rose",
                disabled: closed,
              }}
            />

            {/* Form column: Technical Delay */}
            <SubCard
              x={NODE_X[3] - CARD_W / 2} y={ROW_Y[0]}
              w={CARD_W} h={CARD_H}
              tone="amber"
              active={live.activeSubKey === "technical-delay"}
              icon={<Clock className="size-4" />}
              chip="E003 · B"
              title="Technical Delay"
              subtitle={
                technicalHoldTimer
                  ? `Reminder ${relativeIST(technicalHoldTimer.fires_at ?? technicalHoldTimer.firesAt)}`
                  : "Sends E003 to customer + employee reminder"
              }
              tooltip="Log a technical/external delay. Sends E003 to the customer AND creates a reminder for the assignee to follow up. Resumes to Govt Portal when cleared."
              button={{
                label: "Select Reason + Add Reminder",
                onClick: () => setDialog({ kind: "technical_delay" }),
                variant: "amber",
                disabled: closed,
              }}
            />
            {/* Form column: Customer Side Delay */}
            <SubCard
              x={NODE_X[3] - CARD_W / 2} y={ROW_Y[1]}
              w={CARD_W} h={CARD_H}
              tone="amber"
              active={live.activeSubKey === "customer-delay"}
              icon={<AlertTriangle className="size-4" />}
              chip="E004 · A"
              title="Customer Side Delay"
              subtitle={
                customerHoldTimer
                  ? `Auto-closes ${relativeIST(customerHoldTimer.fires_at ?? customerHoldTimer.firesAt)}`
                  : "Select reason · Auto-close in 8h · Order Closed"
              }
              tooltip="Log a customer-side delay. E004 sends and 8-hour auto-close arms — expires to Order Closed with selected reason."
              button={{
                label: "Select Reason (E004)",
                onClick: () => setDialog({ kind: "customer_delay" }),
                variant: "amber",
                disabled: closed,
              }}
            />

            {/* Govt Portal column: Consultation Completed */}
            <SubCard
              x={NODE_X[4] - CARD_W / 2} y={ROW_Y[0]}
              w={CARD_W} h={CARD_H}
              tone="emerald"
              icon={<CheckCircle2 className="size-4" />}
              chip="E005"
              title="Consultation Completed"
              subtitle="Application Submitted to Govt Portal → Order Completed"
              tooltip="Close the customer loop with E005 and mark this order as completed (submitted-to-govt)."
              button={{
                label: "Order Completed (E005)",
                onClick: () => mutSubmit.mutate(),
                variant: "emerald",
                disabled: mutSubmit.isPending || closed,
              }}
            />
            {/* Govt Portal column: Waiting for Govt Approval */}
            <SubCard
              x={NODE_X[4] - CARD_W / 2} y={ROW_Y[1]}
              w={CARD_W} h={CARD_H}
              tone="indigo"
              icon={<Clock className="size-4" />}
              chip="E006"
              title="Application Submitted, Waiting for Govt. Approval"
              subtitle="Send E006 + add reminder for yourself"
              tooltip="Send E006 to the customer and queue a reminder for you to check final status later."
              button={{
                label: "Add Reminder (E006)",
                onClick: promptReminder,
                variant: "indigo",
                disabled: closed,
              }}
            />

            {/* Check Final Status column: 4 rows */}
            <SubCard
              x={NODE_X[5] - CARD_W / 2} y={ROW_Y[0]}
              w={CARD_W} h={CARD_H}
              tone="sky"
              active={live.activeSubKey === "govt-awaiting"}
              icon={<Search className="size-4" />}
              chip="E006"
              title="Application Status Checked — Awaiting Government Response"
              subtitle="Add reminder"
              tooltip="Portal still hasn't returned a final status — queue a reminder to check again."
              button={{
                label: "Add Reminder",
                onClick: promptReminder,
                variant: "sky",
                disabled: closed,
              }}
            />
            <SubCard
              x={NODE_X[5] - CARD_W / 2} y={ROW_Y[1]}
              w={CARD_W} h={CARD_H}
              tone="emerald"
              icon={<CheckCircle2 className="size-4" />}
              chip="E005"
              title="Consultation Completed — Application Submitted to Govt Portal (After Waiting)"
              subtitle="Add note · Order Completed"
              tooltip="After waiting on govt response, mark consultation/submission complete."
              button={{
                label: "Order Completed (E005)",
                onClick: () => mutSubmit.mutate(),
                variant: "emerald",
                disabled: mutSubmit.isPending || closed,
              }}
            />
            <SubCard
              x={NODE_X[5] - CARD_W / 2} y={ROW_Y[2]}
              w={CARD_W} h={CARD_H}
              tone="emerald"
              active={completed}
              icon={<UploadCloud className="size-4" />}
              chip="E007"
              title="Application Accepted — Upload PDF"
              subtitle="Add note · Order Completed"
              tooltip="Govt portal accepted the application. Upload the certificate PDF and send E007 to complete."
              button={{
                label: "Upload Cert & Complete (E007)",
                onClick: () => setDialog({ kind: "complete_with_cert" }),
                variant: "emerald",
                disabled: closed,
              }}
            />
            <SubCard
              x={NODE_X[5] - CARD_W / 2} y={ROW_Y[3]}
              w={CARD_W} h={CARD_H}
              tone="rose"
              active={closed && live.reasonCode?.startsWith("B") === true}
              icon={<XCircle className="size-4" />}
              chip="E008 · B"
              title="Application Rejected"
              subtitle="Select reason · Add note · Order Closed"
              tooltip="Portal rejected. E008 sends and the order lands at Order Closed with a Category B reason."
              button={{
                label: "Select Reason (E008)",
                onClick: () => setDialog({ kind: "govt_rejected" }),
                variant: "rose",
                disabled: closed,
              }}
            />

            {isTalkToExpert && (
              <SubCard
                x={NODE_X[6] - CARD_W / 2} y={ROW_Y[0]}
                w={CARD_W} h={CARD_H}
                tone="violet"
                icon={<CheckCircle2 className="size-4" />}
                chip="E009"
                title="Talk-to-Expert"
                subtitle="Mark consultation done"
                tooltip="Talk-to-Expert services close with E009 once the consultation is completed."
                button={{
                  label: "Send E009",
                  onClick: () => mutTalkExpert.mutate(),
                  variant: "violet",
                  disabled: mutTalkExpert.isPending || closed,
                }}
              />
            )}
          </div>
        </div>

        {(view.hasEngine && view.nextTimer && !closed) || closureArmed || closed ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
            {view.hasEngine && view.nextTimer && !closed && (
              <span><Clock className="mr-1 inline size-3" />Next auto-step: <b>{view.nextTimer.kind}</b> · {relativeIST(view.nextTimer.firesAt)} · {formatIST(view.nextTimer.firesAt)}</span>
            )}
            {closureArmed && p.closureStage && (
              <span><Hourglass className="mr-1 inline size-3 text-amber-600" />Closure armed: <b>{p.closureStage}</b>{p.closureNextAt ? <> · fires {relativeIST(p.closureNextAt)}</> : null}</span>
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


/* ═════════════════════════ Tooltips ═════════════════════════ */

const STAGE_TOOLTIPS = [
  "Lead captured from the site / call / referral.",
  "Payment successfully received. Order object is now created.",
  "Order received. Waiting for the customer to submit the onboarding form.",
  "Customer submitted the form. Employee verifies details before submitting to the portal.",
  "Application submitted to the government portal. Awaiting portal response.",
  "Checking the final status on the government portal.",
  "Order completed. Certificate delivered to the customer.",
];

const SEGMENT_TOOLTIPS = [
  "Lead → Payment: fires when the customer completes the payment.",
  "Payment → Order: fires automatically once payment is confirmed.",
  "Order → Form: fires when the customer submits the onboarding form.",
  "Form → Govt Portal: employee clicks Send E005 to mark the application as submitted.",
  "Govt Portal → Final Status: employee opens the govt portal to check the outcome.",
  "Final Status → Completed: fires only on acceptance (E007). Rejection routes to Order Closed instead.",
];

/* ═════════════════════════ Pieces ═════════════════════════ */

function MainStage({
  x, y = NODE_Y, state, Icon, label, tooltip, sublabel, tone,
}: {
  x: number; y?: number; state: NodeState; Icon: any; label: string;
  tooltip?: string; sublabel?: string;
  tone?: "rose" | "default";
}) {
  const isRose = tone === "rose";
  const circle =
    state === "done"     ? "bg-emerald-500 border-emerald-500 text-white"
  : state === "current"  ? (isRose
      ? "bg-white border-rose-500 text-rose-600 ring-4 ring-rose-100"
      : "bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-100")
  : state === "blocked"  ? "bg-white border-rose-500 text-rose-600 ring-4 ring-rose-100"
  : isRose               ? "bg-white border-rose-300 text-rose-400"
  :                        "bg-white border-sky-400 text-sky-500";

  return (
    <div className="absolute" style={{ left: x - CIRCLE / 2, top: y - CIRCLE / 2 }} title={tooltip}>
      <div className={cn("grid place-items-center rounded-full border-[3px] shadow-sm", circle)}
           style={{ width: CIRCLE, height: CIRCLE }}>
        {state === "done" ? <Check className="size-6" /> : <Icon className="size-6" />}
      </div>
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 mt-3 rounded-lg border bg-white px-2 py-1.5 text-center shadow-sm",
          state === "current" ? (isRose ? "border-rose-300" : "border-indigo-300") : "border-slate-200",
        )}
        style={{ width: LABEL_W, top: CIRCLE }}
      >
        <div className={cn(
          "text-[11px] font-bold leading-tight whitespace-pre-line",
          state === "current" ? (isRose ? "text-rose-700" : "text-indigo-700") : "text-slate-800",
        )}>
          {label}
        </div>
        {sublabel && (
          <div className={cn(
            "mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
            isRose ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700",
          )}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

type Tone = "amber" | "rose" | "sky" | "teal" | "emerald" | "violet" | "indigo";

const TONE: Record<Tone, { border: string; bg: string; text: string; chip: string; ring: string; btn: string }> = {
  amber:   { border: "border-amber-300",   bg: "bg-amber-50",   text: "text-amber-800",   chip: "bg-amber-100 text-amber-700",   ring: "ring-amber-400",   btn: "bg-amber-500 hover:bg-amber-600 text-white" },
  rose:    { border: "border-rose-300",    bg: "bg-rose-50",    text: "text-rose-800",    chip: "bg-rose-100 text-rose-700",     ring: "ring-rose-400",    btn: "bg-rose-600 hover:bg-rose-700 text-white" },
  sky:     { border: "border-sky-300",     bg: "bg-sky-50",     text: "text-sky-800",     chip: "bg-sky-100 text-sky-700",       ring: "ring-sky-400",     btn: "bg-sky-600 hover:bg-sky-700 text-white" },
  teal:    { border: "border-teal-300",    bg: "bg-teal-50",    text: "text-teal-800",    chip: "bg-teal-100 text-teal-700",     ring: "ring-teal-400",    btn: "bg-teal-600 hover:bg-teal-700 text-white" },
  emerald: { border: "border-emerald-300", bg: "bg-emerald-50", text: "text-emerald-800", chip: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-700 text-white" },
  violet:  { border: "border-violet-300",  bg: "bg-violet-50",  text: "text-violet-800",  chip: "bg-violet-100 text-violet-700", ring: "ring-violet-400",  btn: "bg-violet-600 hover:bg-violet-700 text-white" },
  indigo:  { border: "border-indigo-300",  bg: "bg-indigo-50",  text: "text-indigo-800",  chip: "bg-indigo-100 text-indigo-700", ring: "ring-indigo-400",  btn: "bg-indigo-600 hover:bg-indigo-700 text-white" },
};

function SubCard({
  x, y, w, h, tone, active, icon, title, subtitle, chip, button, secondary, tooltip,
}: {
  x: number; y: number; w: number; h: number;
  tone: Tone; active?: boolean;
  icon: React.ReactNode; title: string; subtitle?: string; chip?: string;
  button?: { label: string; onClick: () => void; variant: Tone; disabled?: boolean };
  secondary?: { label: string; onClick: () => void };
  tooltip?: string;
}) {
  const t = TONE[tone];
  return (
    <div
      title={tooltip}
      className={cn(
        "absolute rounded-xl border-2 shadow-sm transition p-2.5 flex flex-col",
        active ? cn(t.border, t.bg) : "border-slate-200 bg-white",
        active && "ring-2 ring-offset-1 shadow-md", active && t.ring,
        !active && "opacity-80",
      )}
      style={{ left: x, top: y, width: w, minHeight: h }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className={cn("grid size-7 place-items-center rounded-full bg-white border", active ? t.border : "border-slate-300", active ? t.text : "text-slate-500")}>
          {icon}
        </div>
        {chip && (
          <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase font-mono", active ? t.chip : "bg-slate-100 text-slate-600")}>{chip}</span>
        )}
        {active && (
          <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Live</span>
        )}
      </div>
      <div className={cn("mt-1.5 text-[11px] font-bold leading-tight", active ? t.text : "text-slate-700")}>{title}</div>
      {subtitle && <div className="mt-0.5 text-[10px] leading-tight text-slate-600">{subtitle}</div>}

      <div className="mt-auto flex flex-col gap-1 pt-2">
        {button && (
          <button
            type="button"
            onClick={button.onClick}
            disabled={button.disabled}
            title={button.disabled ? "Not available in the current state" : button.label}
            className={cn(
              "rounded-md px-2 py-1 text-[10px] font-bold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed",
              TONE[button.variant].btn,
            )}
          >
            {button.label}
          </button>
        )}
        {secondary && (
          <button
            type="button"
            onClick={secondary.onClick}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            {secondary.label}
          </button>
        )}
      </div>
    </div>
  );
}

function LegendDot({ color, children }: { color: string; children?: React.ReactNode }) {
  return (
    <span className={cn("grid size-4 place-items-center rounded-full", color)}>
      {children}
    </span>
  );
}

function LegendRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5">{icon}</span>
      <div className="leading-tight">
        <div className="font-bold text-slate-800">{title}</div>
        <div className="text-[10px] text-slate-500">{desc}</div>
      </div>
    </div>
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
