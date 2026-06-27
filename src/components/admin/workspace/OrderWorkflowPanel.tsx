import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  ChevronDown, ChevronRight, AlertTriangle, Ban, ArrowRight, Check,
  RotateCcw, MessageSquare, History, Bell, Clock, X, Plus, Loader2,
} from "lucide-react";

import { CancellationPanel } from "@/components/admin/CancellationPanel";
import { ExternalDelayDialog } from "@/components/admin/ExternalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import {
  listWorkflowEvents, listWorkflowReminders, resumeOrder,
  markCustomerReplied, appendWorkflowEvent, cancelWorkflowReminder,
} from "@/lib/crm/workflow.functions";
import { updateFulfillmentStatus } from "@/lib/crm/orders-v2.functions";
import {
  FULFILLMENT_STAGES, FULFILLMENT_LABEL, FULFILLMENT_BADGE,
  getAllowedFulfillmentTransitions, stageIndex, type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";
import { formatIST } from "@/lib/datetime";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";

type Lane = "happy" | "delay" | "cancellation";

const DELAY_STATUSES = [
  "external_dependency", "government_portal_pending",
  "waiting_for_customer", "waiting_for_documents", "customer_non_responsive",
];

export function OrderWorkflowPanel({
  applicationId,
  current,
  workflowStatus,
  closureStage,
  closureNextAt,
  cancellationRequestedAt,
  reasonCode,
  reasonText,
}: {
  applicationId: string;
  current: FulfillmentStatus;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  cancellationRequestedAt?: string | null;
  reasonCode?: string | null;
  reasonText?: string | null;
}) {
  const qc = useQueryClient();
  const cancellationActive = (closureStage ?? "none") !== "none";
  const inDelay = !!workflowStatus && DELAY_STATUSES.includes(workflowStatus);
  const lane: Lane = cancellationActive ? "cancellation" : inDelay ? "delay" : "happy";

  const updateFn = useServerFn(updateFulfillmentStatus);
  const fnResume = useServerFn(resumeOrder);
  const fnReplied = useServerFn(markCustomerReplied);

  const [busy, setBusy] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", applicationId] });
    qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-reminders", applicationId] });
  };

  const allowed = getAllowedFulfillmentTransitions(current);
  const nextStage = allowed[0] ?? null; // canonical forward step

  const advance = async (extra?: { certificateDocumentId?: string; certificateNumber?: string; completionNotes?: string }) => {
    if (!nextStage) return;
    setBusy(true);
    try {
      await updateFn({ data: { orderId: applicationId, toStatus: nextStage, ...extra } });
      toast.success(`Status → ${FULFILLMENT_LABEL[nextStage]}`);
      setCertOpen(false);
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const resumeMut = useMutation({
    mutationFn: async () => fnResume({ data: { applicationId } }),
    onSuccess: () => { toast.success("Order resumed."); refresh(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
  const repliedMut = useMutation({
    mutationFn: async () => fnReplied({ data: { applicationId } }),
    onSuccess: () => { toast.success("Customer reply logged."); refresh(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="space-y-4">
      {/* CARD 1 — ORDER STATUS (lane-aware primary action) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 via-white to-rose-50/30 px-5 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-700">Order Status</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-md border text-sm font-semibold ${FULFILLMENT_BADGE[current]}`}>
                {FULFILLMENT_LABEL[current]}
              </span>
              <LaneBadge lane={lane} />
            </div>
          </div>
        </div>

        {lane === "happy" && (
          <div className="px-5 py-4">
            {!nextStage ? (
              <div className="text-sm text-slate-500 italic flex items-center gap-2">
                <Check className="size-4 text-emerald-600" /> Terminal status — no further transitions.
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (nextStage === "completed") setCertOpen(true);
                    else advance();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition disabled:opacity-60"
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                  Advance to {FULFILLMENT_LABEL[nextStage]}
                </button>
                <div className="text-xs text-slate-500">
                  Next step in the order flow. Use the buttons below to pause or cancel.
                </div>
              </div>
            )}
          </div>
        )}

        {lane === "delay" && (
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <div>
                Order is paused — waiting on an external dependency or customer.
                Use the actions below to move it forward.
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
                <Ban className="size-4" /> Close Order
              </button>
            </div>
          </div>
        )}

        {lane === "cancellation" && (
          <div className="px-5 py-4">
            <CancellationPanel
              applicationId={applicationId}
              closureStage={closureStage}
              closureNextAt={closureNextAt}
              cancellationRequestedAt={cancellationRequestedAt}
              reasonCode={reasonCode}
              reasonText={reasonText}
            />
          </div>
        )}
      </div>

      {/* CARD 2 — STAGE MAP */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-700 mb-3">Stage Map</div>
        <StageMap current={current} />
      </div>

      {/* CARD 3 — PAUSE / CANCEL ESCAPE HATCHES (only in happy path) */}
      {lane === "happy" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-600 mb-3">Need to pause or cancel?</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setDelayOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50/60 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100">
              <AlertTriangle className="size-4" /> Mark External Delay
            </button>
            <button onClick={() => setCloseOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50/60 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">
              <Ban className="size-4" /> Start Cancellation
            </button>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            These are the only two actions that move the order off the Happy Path.
          </div>
        </div>
      )}

      {/* CARD 4 — HISTORY (collapsed) */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button type="button" onClick={() => setHistoryOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-slate-50">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-slate-600">
            <History className="size-3.5" /> Timeline & reminders
          </div>
          {historyOpen ? <ChevronDown className="size-4 text-slate-500" /> : <ChevronRight className="size-4 text-slate-500" />}
        </button>
        {historyOpen && <HistorySection applicationId={applicationId} onRefresh={refresh} />}
      </div>

      {/* Dialogs */}
      <ExternalDelayDialog applicationId={applicationId} open={delayOpen} onClose={() => setDelayOpen(false)} />
      <CloseOrderDialog applicationId={applicationId} open={closeOpen} onClose={() => setCloseOpen(false)} />
      <CompletionGateDialogStandalone
        open={certOpen}
        onOpenChange={setCertOpen}
        orderId={applicationId}
        busy={busy}
        onConfirm={(p) => advance(p)}
      />
    </div>
  );
}

function LaneBadge({ lane }: { lane: Lane }) {
  if (lane === "happy") return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" /> Happy Path
    </span>
  );
  if (lane === "delay") return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
      <span className="size-1.5 rounded-full bg-amber-500" /> External Delay
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
      <span className="size-1.5 rounded-full bg-rose-500" /> Cancellation
    </span>
  );
}

function StageMap({ current }: { current: FulfillmentStatus }) {
  const idx = stageIndex(current);
  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {FULFILLMENT_STAGES.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold border-2 ${
                done ? "bg-emerald-500 border-emerald-500 text-white" :
                active ? "bg-indigo-600 border-indigo-600 text-white shadow-md" :
                "bg-white border-slate-300 text-slate-400"
              }`}>
                {done ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={`text-xs font-medium ${
                done ? "text-emerald-700" : active ? "text-indigo-700 font-bold" : "text-slate-500"
              }`}>{FULFILLMENT_LABEL[s]}</span>
            </div>
            {i < FULFILLMENT_STAGES.length - 1 && (
              <div className={`mx-2 h-0.5 w-6 ${i < idx ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function HistorySection({ applicationId, onRefresh }: { applicationId: string; onRefresh: () => void }) {
  const fnEvents = useServerFn(listWorkflowEvents);
  const fnReminders = useServerFn(listWorkflowReminders);
  const fnAppend = useServerFn(appendWorkflowEvent);
  const fnCancel = useServerFn(cancelWorkflowReminder);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const events = useQuery({ queryKey: ["workflow-events", applicationId], queryFn: () => fnEvents({ data: { applicationId } }) });
  const reminders = useQuery({ queryKey: ["workflow-reminders", applicationId], queryFn: () => fnReminders({ data: { applicationId } }) });

  const noteMut = useMutation({
    mutationFn: async () => fnAppend({ data: { applicationId, eventType: "internal_note", title: "Internal note", description: noteText } }),
    onSuccess: () => { toast.success("Note saved"); setNoteOpen(false); setNoteText(""); onRefresh(); },
  });
  const cancelMut = useMutation({
    mutationFn: async (id: string) => fnCancel({ data: { id } }),
    onSuccess: () => { toast.success("Reminder cancelled"); onRefresh(); },
  });

  const pending = (reminders.data?.reminders ?? []).filter((r: any) => r.status === "pending");

  return (
    <div className="border-t border-slate-100 px-5 py-4 space-y-4 bg-slate-50/30">
      <div className="flex justify-end">
        <button onClick={() => setNoteOpen(true)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Plus className="size-3" /> Add internal note
        </button>
      </div>

      {pending.length > 0 && (
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
            <Bell className="size-3" /> Scheduled reminders ({pending.length})
          </div>
          <div className="space-y-1">
            {pending.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between rounded-md border bg-white px-2 py-1 text-xs">
                <div>
                  <span className="font-medium">{r.kind}</span>
                  {r.template_code && <span className="text-slate-500"> · {r.template_code}</span>}
                  <span className="ml-2 text-slate-500">Due {formatIST(r.due_at)}</span>
                </div>
                <button onClick={() => cancelMut.mutate(r.id)} className="text-slate-400 hover:text-slate-700"><X className="size-3" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Activity</div>
        {events.isLoading ? (
          <div className="py-6 text-center text-sm text-slate-500">Loading…</div>
        ) : (events.data?.events ?? []).length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">No workflow events yet.</div>
        ) : (
          <ol className="relative space-y-3 border-l-2 border-slate-200 pl-4 max-h-[400px] overflow-y-auto">
            {(events.data?.events ?? []).map((e: any) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[21px] top-1 size-3 rounded-full border-2 border-white bg-indigo-500" />
                <div className="text-sm font-medium">{e.title}</div>
                {e.description && <div className="text-xs text-slate-600 mt-0.5 whitespace-pre-wrap">{e.description}</div>}
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <Clock className="size-3" /> {formatIST(e.created_at)} · {e.is_system ? "System" : e.actor_name ?? "Staff"}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {noteOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-lg border bg-white p-5 shadow-xl">
            <div className="font-semibold mb-2">Add internal note</div>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4}
              className="w-full rounded-md border bg-white px-2 py-1.5 text-sm" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setNoteOpen(false)} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => noteMut.mutate()} disabled={!noteText.trim() || noteMut.isPending}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
