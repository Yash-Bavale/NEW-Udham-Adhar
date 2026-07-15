// ─────────────────────────────────────────────────────────────────────────────
// OrderJourneyBoardV2 — NEW component (does NOT replace CustomerJourneyMap.tsx
// in-place). Reads the button state machine and only renders buttons that are
// ACTIVE for the current order status. Shows the full happy path + delay
// branches on one canvas, with the live stage highlighted.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, CheckCircle2, Clock, XCircle, AlertTriangle, RefreshCw,
  FileText, Landmark, Search, Flag, Hourglass, Info, Loader2,
} from "lucide-react";

import type { OrderStatus } from "@/lib/orders/order-status.functions";
import { ORDER_STATUS_LABELS } from "@/lib/orders/order-status.functions";
import {
  BUTTON_CATALOG, getVisibleButtons, isTerminalStatus,
  type ButtonCode, type ButtonSpec,
} from "@/lib/orders/button-state-machine";

import { ReasonPicker } from "./ReasonPicker";
import { ReminderCadencePicker } from "./ReminderCadencePicker";

import { listCloseReasons, type OrderCloseReason } from "@/lib/orders/actions/reasons.functions";
import {
  markFormPending, startTechnicalHold, resumeFromHold,
  markAwaitingGovt, handleGovtRejected,
} from "@/lib/orders/actions";
import {
  customerSideDelay, markSubmittedToGovt, completeOrder,
  closeOrderManual, reopenOrder,
} from "@/lib/orders/order-actions.functions";

interface Props {
  applicationId: string;
  orderStatus: OrderStatus | null;
  applicationCode: string;
  workflowStatus?: string | null;
  closureReasonLabel?: string | null;
}

// ── Happy-path spine ────────────────────────────────────────────────────────
const HAPPY_PATH: { key: string; label: string; icon: any; matches: (s: OrderStatus | null) => boolean }[] = [
  { key: "form_pending", label: "Form Not\nSubmitted", icon: FileText,
    matches: (s) => s === "FORM_PENDING" || s === "NEW_ORDER" || s === "PAYMENT_RECEIVED" || s === "ORDER_RECEIVED" || s === "WAITING_CUSTOMER_INFO" },
  { key: "form_submitted", label: "Form\nSubmitted", icon: Check,
    matches: (s) => s === "FORM_RECEIVED" || s === "INFO_RECEIVED" || s === "IN_PROCESSING" || s === "HIGH_PRIORITY" || s === "REOPENED" },
  { key: "submitted_govt", label: "Submitted to\nGovt Portal", icon: Landmark,
    matches: (s) => s === "SUBMITTED_TO_GOVT" || s === "CERTIFICATE_ISSUED" },
  { key: "awaiting_govt", label: "Awaiting Govt\nApproval", icon: Hourglass,
    matches: (s) => s === "AWAITING_GOVT_APPROVAL" },
  { key: "checking_status", label: "Check Final\nStatus", icon: Search,
    matches: (s) => s === "CHECKING_STATUS" },
  { key: "completed", label: "Order\nCompleted", icon: Flag,
    matches: (s) => s === "COMPLETED" },
];

const HOLD_BRANCHES: { key: string; label: string; matches: (s: OrderStatus | null) => boolean; tone: string }[] = [
  { key: "tech", label: "Technical Delay", matches: (s) => s === "TECHNICAL_HOLD_EXTERNAL" || s === "TECHNICAL_HOLD_INTERNAL" || s === "OUR_SIDE_DELAY", tone: "sky" },
  { key: "customer", label: "Customer-Side Delay", matches: (s) => s === "CUSTOMER_HOLD", tone: "amber" },
  { key: "closed", label: "Order Closed", matches: (s) => s === "CLOSED", tone: "rose" },
];

type DialogState =
  | null
  | { kind: "reason_reminder"; button: ButtonSpec }
  | { kind: "reason_only"; button: ButtonSpec }
  | { kind: "reminder_only"; button: ButtonSpec }
  | { kind: "confirm"; button: ButtonSpec };

export function OrderJourneyBoardV2(p: Props) {
  const qc = useQueryClient();
  const status = p.orderStatus;
  const buttons = getVisibleButtons(status);
  const terminal = isTerminalStatus(status);

  const activeSpineIdx = HAPPY_PATH.findIndex((n) => n.matches(status));
  const activeHold = HOLD_BRANCHES.find((b) => b.matches(status));

  const [dialog, setDialog] = useState<DialogState>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-workflow-state", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-detail-v2", p.applicationId] });
  };

  // Server-fn callers
  const fns = {
    B01: useServerFn(markFormPending),
    B02: useServerFn(startTechnicalHold),
    B03: useServerFn(resumeFromHold),
    B04: useServerFn(markSubmittedToGovt),
    B05: useServerFn(markAwaitingGovt),
    B06: useServerFn(markAwaitingGovt), // same server fn, different semantic step
    B07: useServerFn(markSubmittedToGovt),
    B08: useServerFn(completeOrder),
    B09: useServerFn(handleGovtRejected),
    B10: useServerFn(customerSideDelay),
    BX_CLOSE: useServerFn(closeOrderManual),
    BX_REOPEN: useServerFn(reopenOrder),
  };

  const run = useMutation({
    mutationFn: async (args: { code: ButtonCode; reasonId?: string; reminderMinutes?: number }) => {
      const oid = p.applicationId;
      switch (args.code) {
        case "B01": return fns.B01({ data: { orderId: oid, transitionOnly: false } });
        case "B02": return fns.B02({ data: { orderId: oid, kind: "external", reasonId: args.reasonId!, reminderMinutes: args.reminderMinutes ?? 240 } });
        case "B03": return fns.B03({ data: { orderId: oid, target: "IN_PROCESSING" } });
        case "B04": return fns.B04({ data: { orderId: oid } });
        case "B05": return fns.B05({ data: { orderId: oid, reminderMinutes: args.reminderMinutes ?? 60 * 24 } });
        case "B06": return fns.B06({ data: { orderId: oid, reminderMinutes: args.reminderMinutes ?? 60 * 24 } });
        case "B07": return fns.B07({ data: { orderId: oid } });
        case "B08": return fns.B08({ data: { orderId: oid } });
        case "B09": return fns.B09({ data: { orderId: oid, reasonId: args.reasonId! } });
        case "B10": return fns.B10({ data: { orderId: oid, reasonId: args.reasonId! } });
        case "BX_CLOSE": return fns.BX_CLOSE({ data: { orderId: oid, reasonId: args.reasonId } });
        case "BX_REOPEN": return fns.BX_REOPEN({ data: { orderId: oid } });
      }
    },
    onSuccess: (_, args) => {
      const spec = BUTTON_CATALOG[args.code];
      toast.success(`${spec.code} — ${spec.emailCode ? `${spec.emailCode} triggered` : "state updated"}`);
      setDialog(null);
      refresh();
    },
    onError: (e: any) => toast.error(e?.message || "Action failed"),
  });

  const handleClick = (b: ButtonSpec) => {
    const needsReason = !!b.reasonCategory;
    const needsReminder = !!b.requiresReminder;
    if (needsReason && needsReminder) return setDialog({ kind: "reason_reminder", button: b });
    if (needsReason) return setDialog({ kind: "reason_only", button: b });
    if (needsReminder) return setDialog({ kind: "reminder_only", button: b });
    setDialog({ kind: "confirm", button: b });
  };

  return (
    <div className="space-y-5">
      {/* Status banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-700">Current Status</div>
          <span className="inline-flex items-center rounded-full bg-white ring-1 ring-indigo-200 px-3 py-1 text-sm font-semibold text-indigo-800">
            {status ? ORDER_STATUS_LABELS[status] : "—"}
          </span>
          {activeHold && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
              activeHold.tone === "sky" ? "bg-sky-50 text-sky-800 ring-sky-200"
              : activeHold.tone === "amber" ? "bg-amber-50 text-amber-800 ring-amber-200"
              : "bg-rose-50 text-rose-800 ring-rose-200"}`}>
              <AlertTriangle className="w-3 h-3" /> On {activeHold.label} branch
              {p.closureReasonLabel && <span className="opacity-70">· {p.closureReasonLabel}</span>}
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 font-mono">{p.applicationCode}</div>
      </div>

      {/* Happy-path spine */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-3">Order Journey</div>
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
          {HAPPY_PATH.map((n, idx) => {
            const done = idx < activeSpineIdx;
            const current = idx === activeSpineIdx && !activeHold;
            const Icon = n.icon;
            return (
              <div key={n.key} className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex flex-col items-center gap-1 w-[110px] rounded-lg border px-2 py-2 text-center ${
                  current ? "border-indigo-400 bg-indigo-50 shadow"
                  : done ? "border-emerald-200 bg-emerald-50/40"
                  : "border-slate-200 bg-white"}`}>
                  <div className={`w-9 h-9 rounded-full grid place-items-center ${
                    current ? "bg-indigo-600 text-white"
                    : done ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"}`}>
                    {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="text-[11px] font-semibold leading-tight text-slate-700 whitespace-pre-line">
                    {n.label}
                  </div>
                </div>
                {idx < HAPPY_PATH.length - 1 && (
                  <div className={`w-6 h-0.5 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Divergence hint */}
        {activeHold && (
          <div className={`mt-3 rounded-md border px-3 py-2 text-xs ${
            activeHold.tone === "sky" ? "border-sky-200 bg-sky-50 text-sky-900"
            : activeHold.tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-rose-200 bg-rose-50 text-rose-900"}`}>
            Diverged to <b>{activeHold.label}</b> branch from the main path.
            {p.closureReasonLabel && <> Reason: <b>{p.closureReasonLabel}</b>.</>}
          </div>
        )}
      </div>

      {/* Active buttons */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500">
            Next Active Actions <span className="ml-1 text-slate-400 normal-case tracking-normal">({buttons.length})</span>
          </div>
          {buttons.length === 0 && (
            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> No active button — order is in a terminal state.
            </span>
          )}
        </div>
        {run.isPending && (
          <div className="mb-2 inline-flex items-center gap-1 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" /> Running…
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {buttons.map((b) => (
            <ButtonTile key={b.code} spec={b} onClick={() => handleClick(b)} />
          ))}
        </div>
      </div>

      {/* Dialogs */}
      {dialog && (
        <ActionDialog
          state={dialog}
          onCancel={() => setDialog(null)}
          onConfirm={(args) => run.mutate({ code: dialog.button.code, ...args })}
          submitting={run.isPending}
        />
      )}
    </div>
  );
}

// ── Button tile ─────────────────────────────────────────────────────────────
function ButtonTile({ spec, onClick }: { spec: ButtonSpec; onClick: () => void }) {
  const toneCls =
    spec.variant === "success" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
    : spec.variant === "danger" ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
    : spec.variant === "warn" ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
    : spec.variant === "primary" ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-lg border px-3 py-2.5 shadow-sm transition ${toneCls}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 uppercase tracking-wider">
          {spec.code}
        </span>
        {spec.emailCode && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 uppercase tracking-wider">
            {spec.emailCode}
          </span>
        )}
        {spec.terminal && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">TERMINAL</span>
        )}
      </div>
      <div className="mt-1 text-[13px] font-semibold leading-snug">{spec.label}</div>
      {spec.flagged && (
        <div className="mt-1 text-[11px] italic opacity-80">⚑ {spec.flagged}</div>
      )}
    </button>
  );
}

// ── Action Dialog (reason + reminder pickers as needed) ─────────────────────
function ActionDialog({
  state, onCancel, onConfirm, submitting,
}: {
  state: Exclude<DialogState, null>;
  onCancel: () => void;
  onConfirm: (args: { reasonId?: string; reminderMinutes?: number }) => void;
  submitting: boolean;
}) {
  const b = state.button;
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [reasonObj, setReasonObj] = useState<OrderCloseReason | null>(null);
  const [reply, setReply] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState<number>(60 * 24);

  const needsReason = state.kind === "reason_reminder" || state.kind === "reason_only";
  const needsReminder = state.kind === "reason_reminder" || state.kind === "reminder_only";

  const canSubmit = (!needsReason || !!reasonId) && !submitting;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onCancel}>
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{b.code}</span>
            {b.emailCode && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">{b.emailCode}</span>}
          </div>
          <h3 className="text-base font-bold text-slate-900">{b.label}</h3>
          {b.autoCloseHours && (
            <p className="text-xs text-amber-700 mt-1">This action starts an {b.autoCloseHours}h auto-close timer.</p>
          )}
          {b.flagged && (
            <p className="text-xs italic text-slate-500 mt-1">⚑ {b.flagged}</p>
          )}
        </div>

        {needsReason && (
          <ReasonPicker
            value={reasonId}
            onChange={(id, r) => { setReasonId(id); setReasonObj(r); }}
            reply={reply}
            onReplyChange={setReply}
          />
        )}

        {needsReminder && (
          <ReminderCadencePicker value={reminderMinutes} onChange={setReminderMinutes} />
        )}

        {state.kind === "confirm" && (
          <p className="text-sm text-slate-600">
            Click confirm to run this action{b.emailCode ? ` and send ${b.emailCode} to the customer` : ""}.
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button type="button" onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onConfirm({
              reasonId: reasonId ?? undefined,
              reminderMinutes: needsReminder ? reminderMinutes : undefined,
            })}
            className="px-4 py-1.5 rounded-md text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "Running…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
