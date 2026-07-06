// The ONE place employees click to move an order forward.
// Rendered under the header card, above Customer Journey.
// Reads OrderStage + fulfillment/workflow state, delegates every mutation to
// existing server fns and invalidates the same queries the Timeline reads,
// so Journey + Timeline stay in sync after every click.

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight, AlertTriangle, Pause, Paperclip, X, Ban, Loader2, Check,
  Undo2, RotateCcw, MessageSquare, ExternalLink,
} from "lucide-react";

import { ExternalDelayDialog } from "@/components/admin/ExternalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";

import { updateFulfillmentStatus } from "@/lib/crm/orders-v2.functions";
import {
  resumeOrder, markCustomerReplied, appendWorkflowEvent,
} from "@/lib/crm/workflow.functions";
import { resumeCancelledOrder } from "@/lib/crm/cancellation.functions";
import {
  FULFILLMENT_STAGES, FULFILLMENT_LABEL, getAllowedFulfillmentTransitions,
  type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";

import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { STAGE_META } from "@/lib/crm/computeOrderStage";
import {
  getStageActions, EXCEPTION_META, type ExceptionKind,
} from "@/lib/crm/stageActionMap";
import { useRole } from "@/hooks/useRole";
import { formatIST } from "@/lib/datetime";

type Lane = "happy" | "delay" | "cancellation";
const DELAY_STATUSES = [
  "external_dependency", "government_portal_pending",
  "waiting_for_customer", "waiting_for_documents", "customer_non_responsive",
];

interface Props {
  applicationId: string;
  leadId: string | null;
  stage: OrderStage;
  current: FulfillmentStatus;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  cancellationRequestedAt?: string | null;
  reasonCode?: string | null;
  reasonText?: string | null;
  updatedAt?: string | null;
  onSwitchTab?: (tabId: "workflow" | "form" | "emails" | "activity" | "support") => void;
}

export function OrderActionRail(p: Props) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const role = useRole();
  const isSuperAdmin = role.has("super_admin");

  const cancellationActive =
    (p.closureStage ?? "none") !== "none" || p.current === "cancelled";
  const inDelay = !!p.workflowStatus && DELAY_STATUSES.includes(p.workflowStatus);
  const lane: Lane = cancellationActive ? "cancellation" : inDelay ? "delay" : "happy";

  const spec = getStageActions(p.stage);
  const meta = STAGE_META[p.stage];
  const allowed = getAllowedFulfillmentTransitions(p.current);
  const nextStage = allowed[0] ?? null;

  const curIdx = FULFILLMENT_STAGES.indexOf(p.current);
  const previousStage =
    curIdx > 0 && p.current !== "completed" && p.current !== "cancelled"
      ? FULFILLMENT_STAGES[curIdx - 1] : null;

  const updateFn = useServerFn(updateFulfillmentStatus);
  const fnResume = useServerFn(resumeOrder);
  const fnReplied = useServerFn(markCustomerReplied);
  const fnResumeCancelled = useServerFn(resumeCancelledOrder);
  const fnAppend = useServerFn(appendWorkflowEvent);

  const [busy, setBusy] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const [revertReason, setRevertReason] = useState("");
  const [resumeCancelOpen, setResumeCancelOpen] = useState(false);
  const [resumeTarget, setResumeTarget] = useState<FulfillmentStatus>("order_received");
  const [resumeNote, setResumeNote] = useState("");

  // Every action MUST invalidate every query key the Timeline / Journey /
  // Exception banner reads, so the whole page snaps to server truth on click.
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["admin.order.notes", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["admin.order.recipient", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-detail-v2", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-exception-state", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-events", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-reminders", p.applicationId] });
  };

  const advance = async (extra?: { certificateDocumentId?: string; certificateNumber?: string; completionNotes?: string }) => {
    if (!nextStage) return;
    setBusy(true);
    try {
      const res = await updateFn({ data: { orderId: p.applicationId, toStatus: nextStage, ...extra } });
      if (nextStage === "completed" && (res as any)?.emailQueuedTo) {
        toast.success(`Completed — certificate email sent to ${(res as any).emailQueuedTo}`);
      } else {
        toast.success(`Moved to ${FULFILLMENT_LABEL[nextStage]}`);
      }
      setCertOpen(false);
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
    } finally { setBusy(false); }
  };

  const revert = async () => {
    if (!previousStage) return;
    setBusy(true);
    try {
      await updateFn({
        data: {
          orderId: p.applicationId, toStatus: previousStage, allowBackward: true,
          note: revertReason.trim()
            ? `Reverted to ${FULFILLMENT_LABEL[previousStage]} — ${revertReason.trim()}`
            : `Reverted to ${FULFILLMENT_LABEL[previousStage]}`,
        },
      });
      toast.success(`Reverted to ${FULFILLMENT_LABEL[previousStage]}`);
      setRevertOpen(false); setRevertReason(""); refresh();
    } catch (e: any) { toast.error(e?.message ?? "Revert failed"); }
    finally { setBusy(false); }
  };

  const resumeMut = useMutation({
    mutationFn: async () => fnResume({ data: { applicationId: p.applicationId } }),
    onSuccess: () => { toast.success("Order resumed."); refresh(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const repliedMut = useMutation({
    mutationFn: async () => fnReplied({ data: { applicationId: p.applicationId } }),
    onSuccess: () => { toast.success("Customer reply logged."); refresh(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const resumeCancelMut = useMutation({
    mutationFn: async () => fnResumeCancelled({
      data: { applicationId: p.applicationId, toStatus: resumeTarget as any, note: resumeNote.trim() || undefined },
    }),
    onSuccess: () => {
      toast.success(`Order resumed → ${FULFILLMENT_LABEL[resumeTarget]}`);
      setResumeCancelOpen(false); setResumeNote(""); refresh();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const uninterestedMut = useMutation({
    mutationFn: async () => fnAppend({
      data: {
        applicationId: p.applicationId, eventType: "internal_note",
        title: "Marked Uninterested",
        description: "Employee flagged this lead as uninterested from the Action Rail.",
      },
    }),
    onSuccess: () => { toast.success("Marked uninterested — logged to timeline"); refresh(); },
  });
  const requestDocsMut = useMutation({
    mutationFn: async () => fnAppend({
      data: {
        applicationId: p.applicationId, eventType: "internal_note",
        title: "Documents requested from customer",
        description: "Employee requested additional documents. Upload / share via the Forms & Docs tab.",
      },
    }),
    onSuccess: () => {
      toast.success("Logged — opening Forms & Docs");
      refresh();
      p.onSwitchTab?.("form");
    },
  });

  // Primary click router
  const runPrimary = () => {
    if (!spec.primary) return;
    switch (spec.primaryKind) {
      case "advance_fulfillment":
        if (nextStage) advance();
        else toast.info("Order is not in a fulfilment stage yet.");
        return;
      case "complete_with_cert":
        setCertOpen(true); return;
      case "open_lead":
        if (p.leadId) navigate({ to: "/admin/leads/$leadId", params: { leadId: p.leadId } });
        else toast.error("No lead is linked to this order.");
        return;
      case "open_consultation_tab":
      case "open_form_tab":
        p.onSwitchTab?.(spec.primaryKind === "open_form_tab" ? "form" : "workflow");
        return;
    }
  };

  const runException = (kind: ExceptionKind) => {
    switch (kind) {
      case "our_side_delay":    setDelayOpen(true); return;
      case "customer_hold":     setHoldOpen(true); return;
      case "request_docs":      requestDocsMut.mutate(); return;
      case "cancel_refund":     setCloseOpen(true); return;
      case "mark_uninterested": uninterestedMut.mutate(); return;
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 px-5 py-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-700">
            Employee Actions
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Current Stage:
            </span>
            <span className="text-sm font-bold text-slate-900">{meta.label}</span>
            {p.updatedAt && (
              <span className="text-[11px] text-slate-500">
                · updated {formatIST(p.updatedAt)}
              </span>
            )}
            <LaneBadge lane={lane} />
          </div>
        </div>
        {isSuperAdmin && previousStage && lane === "happy" && (
          <button
            type="button" onClick={() => setRevertOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
            title={`Revert to ${FULFILLMENT_LABEL[previousStage]}`}
          >
            <Undo2 className="size-3" /> Revert (Super-admin)
          </button>
        )}
      </div>

      {/* Body */}
      {lane === "happy" && (
        <div className="px-5 py-4 space-y-3">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Next:</span> {spec.hint}
          </div>

          {spec.primary ? (
            <button
              type="button" disabled={busy} onClick={runPrimary}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" />
                : spec.primaryKind === "open_lead" ? <ExternalLink className="size-4" />
                : <ArrowRight className="size-4" />}
              {spec.primary}
            </button>
          ) : (
            <div className="text-sm text-slate-500 italic flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <Check className="size-4 text-emerald-600" /> {spec.hint}
            </div>
          )}

          {spec.exceptions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mr-1">
                Exceptions:
              </span>
              {spec.exceptions.map((kind) => (
                <ExceptionButton key={kind} kind={kind} onClick={() => runException(kind)} />
              ))}
            </div>
          )}
        </div>
      )}

      {lane === "delay" && (
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            <div>
              Order is paused — waiting on {p.workflowStatus?.replaceAll("_", " ")}.
              {p.reasonText && <div className="mt-1 text-amber-800/80">{p.reasonText}</div>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => repliedMut.mutate()} disabled={repliedMut.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <MessageSquare className="size-4" /> Customer Replied
            </button>
            <button onClick={() => resumeMut.mutate()} disabled={resumeMut.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">
              <RotateCcw className="size-4" /> Resume Order
            </button>
            <button onClick={() => setCloseOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
              <Ban className="size-4" /> Close / Refund
            </button>
          </div>
        </div>
      )}

      {lane === "cancellation" && (
        <div className="px-5 py-4 space-y-3">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            <div className="font-semibold">Order is closed/cancelled</div>
            <div className="mt-1 text-rose-800/80">
              Use Support Ticket actions for customer replies, or Refund actions for refund processing.
            </div>
          </div>
          {isSuperAdmin && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-emerald-900">
                <div className="font-semibold">Super-admin override</div>
                <div className="text-emerald-800/80">
                  Resume this cancelled order. Closure workflow will be cleared and pending reminders cancelled.
                </div>
              </div>
              <button type="button" onClick={() => setResumeCancelOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">
                <RotateCcw className="size-4" /> Resume Cancelled Order
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <ExternalDelayDialog applicationId={p.applicationId} initialSide="internal" open={delayOpen} onClose={() => { setDelayOpen(false); refresh(); }} />
      <ExternalDelayDialog applicationId={p.applicationId} initialSide="customer" open={holdOpen} onClose={() => { setHoldOpen(false); refresh(); }} />
      <CloseOrderDialog applicationId={p.applicationId} open={closeOpen} onClose={() => { setCloseOpen(false); refresh(); }} />
      <CompletionGateDialogStandalone
        open={certOpen} onOpenChange={setCertOpen} orderId={p.applicationId} busy={busy}
        onConfirm={(pl: { certificateDocumentId: string; certificateNumber: string; completionNotes?: string }) => advance(pl)}
      />

      {revertOpen && previousStage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <Undo2 className="size-4 text-slate-600" />
              <div className="font-semibold text-slate-900">Revert order stage</div>
            </div>
            <div className="text-sm text-slate-600 mb-3">
              Move this order back from <b>{FULFILLMENT_LABEL[p.current]}</b> to{" "}
              <b>{FULFILLMENT_LABEL[previousStage]}</b>. A note will be added to the activity log.
            </div>
            <label className="text-xs font-semibold text-slate-600">Reason (optional)</label>
            <textarea value={revertReason} onChange={(e) => setRevertReason(e.target.value)} rows={3}
              placeholder="e.g. Documents need to be re-verified"
              className="mt-1 w-full rounded-md border bg-white px-2 py-1.5 text-sm" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setRevertOpen(false); setRevertReason(""); }} disabled={busy}
                className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={revert} disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60">
                {busy && <Loader2 className="size-3 animate-spin" />} Revert
              </button>
            </div>
          </div>
        </div>
      )}

      {resumeCancelOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <RotateCcw className="size-4 text-emerald-700" />
              <div className="font-semibold text-slate-900">Resume cancelled order</div>
            </div>
            <div className="text-sm text-slate-600 mb-3">
              This will clear the cancellation workflow, cancel pending reminders, and
              restore the order to the stage you choose.
            </div>
            <label className="text-xs font-semibold text-slate-600">Resume to stage</label>
            <select value={resumeTarget} onChange={(e) => setResumeTarget(e.target.value as FulfillmentStatus)}
              className="mt-1 w-full rounded-md border bg-white px-2 py-1.5 text-sm">
              {FULFILLMENT_STAGES.filter((s) => s !== "cancelled" && s !== "completed").map((s) => (
                <option key={s} value={s}>{FULFILLMENT_LABEL[s]}</option>
              ))}
            </select>
            <label className="mt-3 block text-xs font-semibold text-slate-600">Reason (optional)</label>
            <textarea value={resumeNote} onChange={(e) => setResumeNote(e.target.value)} rows={3}
              placeholder="e.g. Customer changed mind, refund withdrawn"
              className="mt-1 w-full rounded-md border bg-white px-2 py-1.5 text-sm" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setResumeCancelOpen(false); setResumeNote(""); }}
                disabled={resumeCancelMut.isPending} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => resumeCancelMut.mutate()} disabled={resumeCancelMut.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
                {resumeCancelMut.isPending && <Loader2 className="size-3 animate-spin" />} Resume Order
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ExceptionButton({ kind, onClick }: { kind: ExceptionKind; onClick: () => void }) {
  const m = EXCEPTION_META[kind];
  const tones: Record<typeof m.tone, string> = {
    amber:  "border-amber-300 bg-amber-50/60 text-amber-800 hover:bg-amber-100",
    slate:  "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100",
    indigo: "border-indigo-300 bg-indigo-50/60 text-indigo-800 hover:bg-indigo-100",
    rose:   "border-rose-300 bg-rose-50/60 text-rose-700 hover:bg-rose-100",
  };
  const Icon =
    m.icon === "warn" ? AlertTriangle :
    m.icon === "pause" ? Pause :
    m.icon === "paperclip" ? Paperclip :
    m.icon === "ban" ? Ban : X;
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${tones[m.tone]}`}>
      <Icon className="size-3.5" /> {m.label}
    </button>
  );
}

function LaneBadge({ lane }: { lane: Lane }) {
  if (lane === "happy") return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" /> Happy Path
    </span>
  );
  if (lane === "delay") return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
      <span className="size-1.5 rounded-full bg-amber-500" /> External Delay
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
      <span className="size-1.5 rounded-full bg-rose-500" /> Cancellation
    </span>
  );
}
