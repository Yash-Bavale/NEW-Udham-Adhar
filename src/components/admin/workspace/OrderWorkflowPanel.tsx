// Employee Workflow tab body: internal notes + timeline & reminders only.
// The primary/exception action buttons live in <OrderActionRail /> — the single
// source of truth rendered above the Customer Journey.

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Bell, Clock, X, Plus, History, ChevronDown, ChevronRight } from "lucide-react";

import {
  listWorkflowEvents, listWorkflowReminders,
  appendWorkflowEvent, cancelWorkflowReminder,
} from "@/lib/crm/workflow.functions";
import { formatIST } from "@/lib/datetime";
import type { FulfillmentStatus } from "@/lib/crm/fulfillment-transitions";

export function OrderWorkflowPanel({
  applicationId,
}: {
  applicationId: string;
  // The remaining props are accepted for backwards compatibility but ignored;
  // ActionRail owns the primary/exception surface now.
  current?: FulfillmentStatus;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  cancellationRequestedAt?: string | null;
  reasonCode?: string | null;
  reasonText?: string | null;
}) {
  const qc = useQueryClient();
  const [historyOpen, setHistoryOpen] = useState(true);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-reminders", applicationId] });
  };

  return (
    <div className="space-y-4">
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
    </div>
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
