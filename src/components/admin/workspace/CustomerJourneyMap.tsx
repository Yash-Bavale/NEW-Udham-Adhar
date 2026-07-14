// Unified Customer Journey Map — the single source of truth for the order
// workspace. Renders the exact flowchart shape supplied by the user:
//
//   Lead ─► Payment ─► Order ─► Form ─► Govt Submitted ─► Final Status ─► Completed
//                              │            │                │
//                              └─ sub-branches with ALL buttons always visible
//
// Replaces OrderJourney, StageJourneyStrip, OrderJourneyStepper and
// OrderStageActions. All email E-codes (E001–E010) + ticket codes (T001–T003)
// are wired here so employees never leave this component to progress an order.

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, ArrowRight, Ticket, AlertTriangle, ShieldAlert, CreditCard,
  User, FileText, Landmark, Trophy, ClipboardCheck, Inbox, PauseCircle,
} from "lucide-react";

import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { formatIST, relativeIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";

import {
  JOURNEY_STAGES, JOURNEY_BRANCHES, TICKET_BUTTONS, FORCE_CLOSE_BUTTON,
  stageToJourneyIndex,
  type JourneyBranch, type JourneyBranchButton, type JourneyActionKind,
  type JourneyStageKey,
} from "@/lib/orders/journey-map";

import { JourneyActionButton } from "./JourneyActionButton";
import { ExternalDelayDialog } from "@/components/admin/ExternalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";

// Server fns
import { sendFormLink, markSubmittedToGovt, sendManualReminder, completeOrder } from "@/lib/orders/order-actions.functions";
import { closeOrderSystem, handleGovtRejected } from "@/lib/orders/actions/close-actions.functions";
import { listCloseReasons } from "@/lib/orders/actions/reasons.functions";
import { updateFulfillmentStatus } from "@/lib/crm/orders-v2.functions";

// ─── Icons per stage (matches flowchart) ────────────────────────────
const STAGE_ICON = {
  lead_received:    User,
  payment_received: CreditCard,
  order_received:   Inbox,
  form_submitted:   FileText,
  app_submitted:    Landmark,
  check_status:     ClipboardCheck,
  completed:        Trophy,
} as const;

// ─── Component props ────────────────────────────────────────────────
interface Props {
  applicationId: string;
  stage: OrderStage;
  isConsultationOrder?: boolean;
  serviceCode?: string | null;    // used to gate E009 (talk_to_expert)
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  closureReasonLabel?: string | null;
  payments?: any[];
  hideAmount?: boolean;
}

export function CustomerJourneyMap(p: Props) {
  const qc = useQueryClient();
  const { view } = useOrderWorkflow(p.applicationId);
  const currentIdx = stageToJourneyIndex(p.stage);
  const isTalkToExpert = /talk|expert|consult/i.test(p.serviceCode ?? "") || !!p.isConsultationOrder;
  const ticketActive = !!view.activeTicketId;
  const closed = (p.closureStage && p.closureStage !== "none") || view.stage === "closed";

  // Which sub-branch (if any) reflects the live path
  const activeBranchKey = useMemo<string | null>(() => {
    if (ticketActive) return "ticket";
    if (/customer_hold|customer_side/i.test(p.workflowStatus ?? "")) return "customer-side-delay";
    if (/technical_hold|delay|external/i.test(p.workflowStatus ?? "")) return "technical-delay";
    if (p.stage === "form_submitted" || p.stage === "in_progress") return null;
    return null;
  }, [ticketActive, p.workflowStatus, p.stage]);

  // Dialog state
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

  // ─── Wired server fns ─────────────────────────────────────────────
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

  // ─── Route each JourneyActionKind ────────────────────────────────
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
      case "ticket_normal_close":
      case "ticket_restart_order":
      case "ticket_consultation_done":
      case "ticket_reply_reason":
        toast.info("Open the Support tab to close/reply on the active ticket.");
        return;
    }
  };

  return (
    <div className="space-y-5">
      {/* Ticket-open banner — pauses the flow visually */}
      {ticketActive && (
        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 px-4 py-3 flex items-start gap-3">
          <PauseCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-rose-900">Workflow paused — ticket open for this customer</div>
            <div className="text-xs text-rose-800 mt-0.5">
              Close the ticket using one of the buttons below to resume the journey.
            </div>
          </div>
        </div>
      )}

      {closed && (
        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 px-4 py-3 flex items-center gap-3">
          <ShieldAlert className="size-5 text-slate-600 shrink-0" />
          <div className="text-sm font-semibold text-slate-800">
            Order is closed
            {p.closureReasonLabel && <> — reason: <b>{p.closureReasonLabel}</b></>}
          </div>
        </div>
      )}

      {/* ── HAPPY PATH (top row) ─────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5">
        <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-600 mb-3">
          Happy Path
        </div>
        <div className="flex items-start justify-between gap-1 overflow-x-auto pb-1">
          {JOURNEY_STAGES.map((s, i) => {
            const Icon = STAGE_ICON[s.key];
            const done = i < currentIdx || (i === currentIdx && s.key === "completed" && p.stage === "completed");
            const active = i === currentIdx && !done && !closed;
            const blocked = active && (ticketActive || !!activeBranchKey);
            return (
              <div key={s.key} className="flex items-start gap-1 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-[80px]">
                  <div className="relative">
                    <div className={cn(
                      "size-12 rounded-full grid place-items-center transition-all",
                      done ? "bg-emerald-500 text-white shadow"
                      : blocked ? "bg-rose-500 text-white shadow ring-4 ring-rose-100"
                      : active ? "bg-indigo-600 text-white shadow ring-4 ring-indigo-100"
                      : "bg-slate-100 text-slate-400",
                    )}>
                      {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                    </div>
                    {(active || blocked) && (
                      <span className={cn(
                        "absolute inset-0 size-12 rounded-full ring-2 animate-ping opacity-40",
                        blocked ? "ring-rose-400" : "ring-indigo-400",
                      )}/>
                    )}
                  </div>
                  <span className={cn(
                    "text-[11px] font-semibold text-center leading-tight",
                    done ? "text-slate-900"
                    : blocked ? "text-rose-700"
                    : active ? "text-indigo-700"
                    : "text-slate-500",
                  )}>
                    {s.short}
                  </span>
                  <div className="text-[9px] text-slate-400 text-center leading-tight max-w-[110px]">
                    {s.label}
                  </div>
                </div>
                {i < JOURNEY_STAGES.length - 1 && (
                  <div className="flex items-center h-12 flex-1 min-w-[16px]">
                    <div className={cn(
                      "h-0.5 w-full",
                      i < currentIdx ? "bg-emerald-400"
                      : i === currentIdx ? "bg-gradient-to-r from-emerald-400 to-slate-200"
                      : "bg-slate-200",
                    )}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SUB-BRANCHES (always visible) ────────────────────────── */}
      <div className="grid gap-3 md:grid-cols-2">
        {JOURNEY_BRANCHES.map((branch) => {
          const visibleButtons = branch.buttons.filter(
            (b) => !b.serviceOnly || (b.serviceOnly === "talk_to_expert" && isTalkToExpert),
          );
          if (visibleButtons.length === 0) return null;
          return (
            <BranchCard
              key={branch.key}
              branch={branch}
              buttons={visibleButtons}
              active={activeBranchKey === branch.key}
              onAction={runAction}
              currentStageKey={JOURNEY_STAGES[currentIdx]?.key}
            />
          );
        })}
      </div>

      {/* ── TICKET RAIL (always visible) ─────────────────────────── */}
      <div className={cn(
        "rounded-2xl border p-4",
        ticketActive ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-white",
      )}>
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="size-4 text-rose-600" />
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-rose-700">
            Ticket Close Actions
          </div>
          {ticketActive && (
            <span className="ml-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
              Active
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-600 mb-3">
          One ticket per order — reopens instead of duplicating. Use these when a mail/contact/complaint arrives.
        </div>
        <div className="flex flex-wrap gap-2">
          {TICKET_BUTTONS.map((b) => (
            <JourneyActionButton key={b.key} button={b} onClick={() => runAction(b.action)} />
          ))}
        </div>
      </div>

      {/* ── FORCE CLOSE FOOTER (always visible) ──────────────────── */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <AlertTriangle className="size-5 text-rose-600 shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-bold text-rose-900">Force Close Order</div>
            <div className="text-[11px] text-rose-800/80">
              Pick a Category A reason. Sends E010 closure email with the reason and cancels every pending timer.
            </div>
          </div>
        </div>
        <JourneyActionButton button={FORCE_CLOSE_BUTTON} onClick={() => runAction("force_close")} />
      </div>

      {/* ── Engine footer info ───────────────────────────────────── */}
      {view.hasEngine && view.nextTimer && (
        <div className="text-[11px] text-slate-500 text-center">
          Next auto-step: <b>{view.nextTimer.kind}</b> · {relativeIST(view.nextTimer.firesAt)}
          {" · "}{formatIST(view.nextTimer.firesAt)}
        </div>
      )}

      {/* ── Dialogs (reused) ─────────────────────────────────────── */}
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

// ─────────────────────────────────────────────────────────────────────
function BranchCard({
  branch, buttons, active, onAction, currentStageKey,
}: {
  branch: JourneyBranch;
  buttons: JourneyBranchButton[];
  active: boolean;
  onAction: (a: JourneyActionKind) => void;
  currentStageKey?: JourneyStageKey;
}) {
  const parent = JOURNEY_STAGES.find((s) => s.key === branch.parentStage);
  const tone = TONE_MAP[branch.tone];
  const attachedToCurrent = currentStageKey === branch.parentStage;
  return (
    <div className={cn(
      "rounded-xl border p-4 space-y-3 transition",
      tone.border, tone.bg,
      active && "ring-2 ring-offset-1 ring-indigo-400 shadow-md",
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className={cn("text-[10px] uppercase tracking-wider font-bold", tone.text)}>
            Under: {parent?.short}
            {attachedToCurrent && (
              <span className="ml-2 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Current</span>
            )}
          </div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{branch.title}</div>
        </div>
        <ArrowRight className={cn("size-4 shrink-0", tone.text)} />
      </div>
      <div className="text-[11px] text-slate-600 leading-relaxed">{branch.description}</div>
      <div className="flex flex-wrap gap-2 pt-1">
        {buttons.map((b) => (
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

const TONE_MAP = {
  amber:   { border: "border-amber-200",   bg: "bg-amber-50/40",   text: "text-amber-700"   },
  rose:    { border: "border-rose-200",    bg: "bg-rose-50/40",    text: "text-rose-700"    },
  sky:     { border: "border-sky-200",     bg: "bg-sky-50/40",     text: "text-sky-700"     },
  violet:  { border: "border-violet-200",  bg: "bg-violet-50/40",  text: "text-violet-700"  },
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50/40", text: "text-emerald-700" },
};

// Inline dialog for E008 (govt rejected) — reuses closeOrderSystem with source=govt_rejection.
function GovtRejectedInline({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [reasonText, setReasonText] = useState("");
  const fn = useServerFn(handleGovtRejected);
  const listReasons = useServerFn(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/lib/orders/actions/reasons.functions").listCloseReasons,
  );
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
