// Customer Journey — Live Path (flowchart)
// Fixed-layout tree that mirrors the approved flow chart:
//   Lead → Payment → Order → Form → Govt Portal → Final Status → Completed
// Sub-branches are ALWAYS visible and get highlighted automatically based on
// the current stage + workflow status.

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, User, CreditCard, Inbox, FileText, Landmark, Search, Flag,
  Hourglass, Mail, Clock, ThumbsUp, UploadCloud, XCircle, CheckCircle2,
  ArrowRight, ClipboardCheck,
} from "lucide-react";

import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { formatIST, relativeIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";

import { stageToJourneyIndex, JOURNEY_STAGES } from "@/lib/orders/journey-map";

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

const NODE_X = [80, 260, 440, 620, 820, 1020, 1240];        // 7 main nodes
const NODE_Y = 60;                                          // circle centre y
const CIRCLE = 56;
const LABEL_W = 150;
const CARD_W = 170;
const CARD_H_SMALL = 96;
const CARD_H_MED = 110;
const SUB1_Y = 250;   // first sub-row (Form Not Submitted / Technical Delay)
const SUB2_Y = 410;   // second sub-row (Force Close / Customer Side Delay / Closed w/ reason)
const OUTCOME_X = 1420;
const OUTCOME_Y = [200, 340, 490];
const CANVAS_W = 1640;
const CANVAS_H = 620;

/* ─────────────────── Component ─────────────────── */

type NodeState = "done" | "current" | "upcoming" | "blocked";

const MAIN_NODES = [
  { key: "lead",      short: "Lead Received",       Icon: User },
  { key: "payment",   short: "Payment Received",    Icon: CreditCard },
  { key: "order",     short: "Order Received",      Icon: Inbox },
  { key: "form",      short: "Form Submitted",      Icon: FileText },
  { key: "govt",      short: "Application\nSubmitted to\nGovt Portal", Icon: Landmark },
  { key: "final",     short: "Check Final\nApplication\nStatus on\nGovt Portal", Icon: Search },
  { key: "completed", short: "Completed",           Icon: Flag },
] as const;

export function CustomerJourneyMap(p: Props) {
  const qc = useQueryClient();
  const { view } = useOrderWorkflow(p.applicationId);
  const currentIdx = stageToJourneyIndex(p.stage);
  const isTalkToExpert = /talk|expert|consult/i.test(p.serviceCode ?? "") || !!p.isConsultationOrder;

  const closureStageValue = (p.closureStage ?? "").toLowerCase();
  const closed = view.stage === "closed" || /^(closed|auto_closed|force_closed|order_closed)$/.test(closureStageValue);
  const closureArmed = !!p.closureStage && p.closureStage !== "none" && !closed;

  // Detect which sub-path is live
  const ws = (p.workflowStatus ?? "").toLowerCase();
  const formPendingLive = /form_pending|awaiting_form|form_not_submitted/.test(ws) || (currentIdx === 2 && !ws);
  const customerDelayLive = /customer_hold|customer_side|customer_delay/.test(ws);
  const technicalDelayLive = /technical_hold|external_delay|govt_delay|technical_delay/.test(ws);

  const currentStageLabel = useMemo(() => {
    const s = JOURNEY_STAGES[Math.min(Math.max(currentIdx, 0), JOURNEY_STAGES.length - 1)];
    return s?.label ?? "Order Received";
  }, [currentIdx]);

  const nodeState = (idx: number): NodeState => {
    if (closed && idx === 6) return "blocked";
    if (idx < currentIdx) return "done";
    if (idx === currentIdx) return "current";
    return "upcoming";
  };

  /* ─── dialogs & actions ─── */
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

  const promptReminder = () => {
    const note = window.prompt("Optional message to include with E006 reminder:", "");
    if (note !== null) mutReminder.mutate(note);
  };

  /* ─── SVG connector path helpers ─── */
  const activeLine = "#6366F1"; // indigo-500
  const doneLine   = "#10B981"; // emerald-500
  const idleLine   = "#CBD5E1"; // slate-300
  const delayLine  = "#F59E0B"; // amber-500
  const closeLine  = "#F43F5E"; // rose-500

  const strokeFor = (state: NodeState) =>
    state === "done" ? doneLine : state === "current" ? activeLine : idleLine;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">Customer Journey — Live Path</div>
            <div className="mt-1 text-xs text-slate-600">
              Current Stage: <span className="font-semibold text-indigo-700">{currentStageLabel}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-600">
            <LegendDot color="bg-emerald-500 text-white"><Check className="size-3" /></LegendDot><span>Completed</span>
            <LegendDot color="bg-white border-2 border-indigo-500 text-indigo-600" /><span>Current Stage</span>
            <LegendDot color="bg-white border-2 border-sky-400 text-sky-500" /><span>Upcoming</span>
            <LegendDot color="bg-white border-2 border-rose-500 text-rose-500" /><span>Blocked / Closed</span>
          </div>
        </header>

        <div className="overflow-x-auto pb-2 pt-4">
          <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
            {/* ─── SVG connectors layer ─── */}
            <svg
              width={CANVAS_W}
              height={CANVAS_H}
              className="absolute inset-0 pointer-events-none"
            >
              <defs>
                {["done", "current", "idle", "delay", "close"].map((k, i) => {
                  const color = [doneLine, activeLine, idleLine, delayLine, closeLine][i];
                  return (
                    <marker
                      key={k}
                      id={`arrow-${k}`}
                      viewBox="0 0 10 10"
                      refX="8" refY="5"
                      markerWidth="6" markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill={color} />
                    </marker>
                  );
                })}
              </defs>

              {/* Horizontal main line segments */}
              {NODE_X.slice(0, -1).map((x, i) => {
                const nextX = NODE_X[i + 1];
                const state = nodeState(i);
                const nextState = nodeState(i + 1);
                const color = state === "done" ? doneLine
                  : (nextState === "current" || state === "current") ? activeLine
                  : idleLine;
                const dashed = i === 5; // final → completed is dashed like reference
                return (
                  <line
                    key={i}
                    x1={x + CIRCLE / 2} y1={NODE_Y}
                    x2={nextX - CIRCLE / 2} y2={NODE_Y}
                    stroke={color} strokeWidth={2}
                    strokeDasharray={dashed ? "6 5" : undefined}
                    markerEnd={`url(#arrow-${state === "done" ? "done" : (nextState === "current" || state === "current") ? "current" : "idle"})`}
                  />
                );
              })}

              {/* Order Received → Form Not Submitted (vertical) */}
              <path
                d={`M ${NODE_X[2]} ${NODE_Y + CIRCLE / 2}
                    L ${NODE_X[2]} ${SUB1_Y - 6}`}
                stroke={formPendingLive ? delayLine : idleLine}
                strokeWidth={2} fill="none"
                markerEnd={`url(#arrow-${formPendingLive ? "delay" : "idle"})`}
              />
              {/* Form Not Submitted → Force Close */}
              <path
                d={`M ${NODE_X[2]} ${SUB1_Y + CARD_H_MED}
                    L ${NODE_X[2]} ${SUB2_Y - 6}`}
                stroke={formPendingLive ? closeLine : idleLine}
                strokeWidth={2} fill="none"
                strokeDasharray="5 4"
                markerEnd={`url(#arrow-${formPendingLive ? "close" : "idle"})`}
              />

              {/* Form Submitted → Technical Delay */}
              <path
                d={`M ${NODE_X[3]} ${NODE_Y + CIRCLE / 2}
                    L ${NODE_X[3]} ${SUB1_Y - 6}`}
                stroke={technicalDelayLive ? delayLine : idleLine}
                strokeWidth={2} fill="none"
                strokeDasharray={technicalDelayLive ? undefined : "5 4"}
                markerEnd={`url(#arrow-${technicalDelayLive ? "delay" : "idle"})`}
              />
              {/* Technical Delay → Application Submitted (dashed, curves right & up) */}
              <path
                d={`M ${NODE_X[3] + CARD_W / 2 - 10} ${SUB1_Y + CARD_H_SMALL / 2}
                    C ${(NODE_X[3] + NODE_X[4]) / 2} ${SUB1_Y + CARD_H_SMALL / 2},
                      ${NODE_X[4]} ${SUB1_Y},
                      ${NODE_X[4]} ${NODE_Y + CIRCLE / 2 + 4}`}
                stroke={technicalDelayLive ? delayLine : idleLine}
                strokeWidth={2} fill="none" strokeDasharray="5 4"
                markerEnd={`url(#arrow-${technicalDelayLive ? "delay" : "idle"})`}
              />

              {/* Form Submitted → Customer Side Delay (down to SUB2 area) */}
              <path
                d={`M ${NODE_X[3] + 30} ${NODE_Y + CIRCLE / 2}
                    C ${NODE_X[3] + 30} ${SUB2_Y - 60},
                      ${NODE_X[4] - 40} ${SUB2_Y - 60},
                      ${NODE_X[4] - 40} ${SUB2_Y - 6}`}
                stroke={customerDelayLive ? delayLine : idleLine}
                strokeWidth={2} fill="none"
                strokeDasharray={customerDelayLive ? undefined : "5 4"}
                markerEnd={`url(#arrow-${customerDelayLive ? "delay" : "idle"})`}
              />
              {/* Customer Side Delay → Order Closed with reason */}
              <line
                x1={NODE_X[4] - 40 + CARD_W / 2} y1={SUB2_Y + CARD_H_MED / 2}
                x2={NODE_X[5] - 40 - CARD_W / 2} y2={SUB2_Y + CARD_H_MED / 2}
                stroke={customerDelayLive || closed ? closeLine : idleLine}
                strokeWidth={2} strokeDasharray="5 4"
                markerEnd={`url(#arrow-${customerDelayLive || closed ? "close" : "idle"})`}
              />

              {/* Check Final Status → 3 outcome cards */}
              {[0, 1, 2].map((i) => {
                const active = i === 2 ? closed : nodeState(6) === "done";
                const color = i === 2 ? closeLine : doneLine;
                return (
                  <path
                    key={i}
                    d={`M ${NODE_X[5] + CIRCLE / 2} ${NODE_Y}
                        C ${(NODE_X[5] + OUTCOME_X) / 2} ${NODE_Y},
                          ${(NODE_X[5] + OUTCOME_X) / 2} ${OUTCOME_Y[i] + 40},
                          ${OUTCOME_X - 6} ${OUTCOME_Y[i] + 40}`}
                    stroke={active ? color : idleLine}
                    strokeWidth={2} fill="none" strokeDasharray="5 4"
                    markerEnd={`url(#arrow-${active ? (i === 2 ? "close" : "done") : "idle"})`}
                  />
                );
              })}
            </svg>

            {/* ─── Main nodes ─── */}
            {MAIN_NODES.map((n, i) => (
              <MainStage
                key={n.key}
                x={NODE_X[i]}
                state={nodeState(i)}
                Icon={n.Icon}
                label={n.short}
              />
            ))}

            {/* ─── Sub-cards ─── */}

            {/* Form Not Submitted */}
            <SubCard
              x={NODE_X[2] - CARD_W / 2} y={SUB1_Y}
              w={CARD_W} h={CARD_H_MED}
              tone="amber"
              active={formPendingLive}
              icon={<Hourglass className="size-4" />}
              title="Form Not Submitted"
              subtitle="Auto-closed in 8 hrs"
              button={{
                label: "Send Link (E002)",
                onClick: () => mutFormLink.mutate(),
                variant: "amber",
                disabled: mutFormLink.isPending,
              }}
            />

            {/* Force Close Order (E010) */}
            <SubCard
              x={NODE_X[2] - CARD_W / 2} y={SUB2_Y}
              w={CARD_W} h={CARD_H_MED}
              tone="rose"
              active={closed && /A\d/.test(p.closureReasonLabel ?? "")}
              icon={<Mail className="size-4" />}
              title="Force Close Order (E010)"
              subtitle="Send email & cancel pending timer"
              button={{
                label: "Force Close",
                onClick: () => setDialog({ kind: "force_close" }),
                variant: "rose",
                disabled: closed,
              }}
            />

            {/* Technical / External Delay */}
            <SubCard
              x={NODE_X[3] - CARD_W / 2} y={SUB1_Y}
              w={CARD_W} h={CARD_H_SMALL}
              tone="sky"
              active={technicalDelayLive}
              icon={<Clock className="size-4" />}
              title="Technical / External Delay"
              subtitle="Add reminder"
              button={{
                label: "Log Delay (E003)",
                onClick: () => setDialog({ kind: "technical_delay" }),
                variant: "sky",
              }}
            />

            {/* Customer Side Delay */}
            <SubCard
              x={NODE_X[4] - 40 - CARD_W / 2} y={SUB2_Y}
              w={CARD_W} h={CARD_H_MED}
              tone="teal"
              active={customerDelayLive}
              icon={<Clock className="size-4" />}
              title="Customer Side Delay"
              subtitle="Select Reason · Auto-closed in 8 hrs"
              button={{
                label: "Log Delay (E004)",
                onClick: () => setDialog({ kind: "customer_delay" }),
                variant: "teal",
              }}
            />

            {/* Order Closed with Selected Reason */}
            <SubCard
              x={NODE_X[5] - 40 - CARD_W / 2} y={SUB2_Y}
              w={CARD_W} h={CARD_H_MED}
              tone="emerald"
              active={closed}
              icon={<CheckCircle2 className="size-4" />}
              title="Order Closed with Selected Reason"
              subtitle={closed && p.closureReasonLabel ? p.closureReasonLabel : "Endpoint · E010 / A-reason"}
              chip="E010"
            />

            {/* Outcomes on the right */}
            <SubCard
              x={OUTCOME_X} y={OUTCOME_Y[0]}
              w={CARD_W} h={CARD_H_MED}
              tone="emerald"
              active={nodeState(6) === "done" && !closed}
              icon={<ThumbsUp className="size-4" />}
              title="Application Accepted"
              subtitle="Order Completed"
              button={{
                label: "Mark Accepted (E007)",
                onClick: () => setDialog({ kind: "complete_with_cert" }),
                variant: "emerald",
              }}
            />
            <SubCard
              x={OUTCOME_X} y={OUTCOME_Y[1]}
              w={CARD_W} h={CARD_H_MED}
              tone="emerald"
              icon={<UploadCloud className="size-4" />}
              title="Accepted · Upload PDF"
              subtitle="Send E007 with certificate"
              button={{
                label: "Upload Cert (E007)",
                onClick: () => setDialog({ kind: "complete_with_cert" }),
                variant: "emerald",
              }}
            />
            <SubCard
              x={OUTCOME_X} y={OUTCOME_Y[2]}
              w={CARD_W} h={CARD_H_MED}
              tone="rose"
              active={closed && /B\d/.test(p.closureReasonLabel ?? "")}
              icon={<XCircle className="size-4" />}
              title="Application Rejected"
              subtitle="Select Reason · Order Closed"
              button={{
                label: "Mark Rejected (E008)",
                onClick: () => setDialog({ kind: "govt_rejected" }),
                variant: "rose",
                disabled: closed,
              }}
            />

            {/* Reminder + Talk-to-Expert secondary actions, tucked beside completed */}
            <SubCard
              x={NODE_X[4] + 20} y={SUB2_Y - 140}
              w={CARD_W - 20} h={CARD_H_SMALL}
              tone="indigo"
              icon={<ClipboardCheck className="size-4" />}
              title="Submitted to Govt"
              subtitle="Notify customer / add reminder"
              button={{
                label: "Send E005",
                onClick: () => mutSubmit.mutate(),
                variant: "indigo",
                disabled: mutSubmit.isPending,
              }}
              secondary={{
                label: "Reminder (E006)",
                onClick: promptReminder,
              }}
            />

            {isTalkToExpert && (
              <SubCard
                x={NODE_X[6] - CARD_W / 2 - 10} y={SUB1_Y}
                w={CARD_W} h={CARD_H_SMALL}
                tone="violet"
                icon={<CheckCircle2 className="size-4" />}
                title="Talk-to-Expert"
                subtitle="Mark consultation done"
                button={{
                  label: "Send E009",
                  onClick: () => mutTalkExpert.mutate(),
                  variant: "violet",
                  disabled: mutTalkExpert.isPending,
                }}
              />
            )}
          </div>
        </div>

        {/* ─── Bottom legend ─── */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700 md:grid-cols-6">
          <LegendRow icon={<ClipboardCheck className="size-3.5 text-indigo-600" />} title="Current Stage" desc="You are here" />
          <LegendRow icon={<ArrowRight className="size-3.5 text-slate-600" />} title="Next Steps" desc="Where the process can go" />
          <LegendRow icon={<Clock className="size-3.5 text-amber-600" />} title="Delays" desc="Yellow / sky sub-paths" />
          <LegendRow icon={<Check className="size-3.5 text-emerald-600" />} title="Completed" desc="Green steps" />
          <LegendRow icon={<XCircle className="size-3.5 text-rose-600" />} title="Closed / Blocked" desc="Red endpoints" />
          <LegendRow icon={<Flag className="size-3.5 text-slate-500" />} title="End State" desc="Order completed" />
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

      {/* ─── Dialogs ─── */}
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

function MainStage({
  x, state, Icon, label,
}: {
  x: number; state: NodeState; Icon: any; label: string;
}) {
  const circle =
    state === "done"     ? "bg-emerald-500 border-emerald-500 text-white"
  : state === "current"  ? "bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-100"
  : state === "blocked"  ? "bg-white border-rose-500 text-rose-600 ring-4 ring-rose-100"
  :                        "bg-white border-sky-400 text-sky-500";

  return (
    <div className="absolute" style={{ left: x - CIRCLE / 2, top: NODE_Y - CIRCLE / 2 }}>
      <div className={cn("grid place-items-center rounded-full border-[3px] shadow-sm", circle)}
           style={{ width: CIRCLE, height: CIRCLE }}>
        {state === "done" ? <Check className="size-6" /> : <Icon className="size-6" />}
      </div>
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 mt-3 rounded-lg border bg-white px-2 py-1.5 text-center shadow-sm",
          state === "current" ? "border-indigo-300" : "border-slate-200",
        )}
        style={{ width: LABEL_W, top: CIRCLE }}
      >
        <div className={cn(
          "text-[11px] font-bold leading-tight whitespace-pre-line",
          state === "current" ? "text-indigo-700" : "text-slate-800",
        )}>
          {label}
        </div>
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
  x, y, w, h, tone, active, icon, title, subtitle, chip, button, secondary,
}: {
  x: number; y: number; w: number; h: number;
  tone: Tone; active?: boolean;
  icon: React.ReactNode; title: string; subtitle?: string; chip?: string;
  button?: { label: string; onClick: () => void; variant: Tone; disabled?: boolean };
  secondary?: { label: string; onClick: () => void };
}) {
  const t = TONE[tone];
  return (
    <div
      className={cn(
        "absolute rounded-xl border-2 shadow-sm transition p-2.5 flex flex-col",
        t.border, t.bg,
        active && "ring-2 ring-offset-1 shadow-md", active && t.ring,
        !active && "opacity-90",
      )}
      style={{ left: x, top: y, width: w, minHeight: h }}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className={cn("grid size-7 place-items-center rounded-full bg-white border", t.border, t.text)}>
          {icon}
        </div>
        {chip && (
          <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase", t.chip)}>{chip}</span>
        )}
        {active && !chip && (
          <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Live</span>
        )}
      </div>
      <div className={cn("mt-1.5 text-[11px] font-bold leading-tight", t.text)}>{title}</div>
      {subtitle && <div className="mt-0.5 text-[10px] leading-tight text-slate-600">{subtitle}</div>}

      <div className="mt-auto flex flex-col gap-1 pt-2">
        {button && (
          <button
            type="button"
            onClick={button.onClick}
            disabled={button.disabled}
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
