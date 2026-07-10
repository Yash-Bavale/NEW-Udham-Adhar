// Live workflow status for a single order. Reads from workflow_states,
// workflow_timers, workflow_automations via getWorkflowState. Auto-refreshes
// every 15s and on window focus so the UI reflects timers/automations
// firing from the cron tick without manual reloads.
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlarmClock, CheckCircle2, Cog, PauseCircle, PlayCircle, StopCircle, Ticket, Timer } from "lucide-react";
import { getWorkflowState } from "@/lib/workflow/engine.functions";
import { formatIST, relativeIST } from "@/lib/datetime";

const STAGE_LABEL: Record<string, string> = {
  payment_successful: "Payment",
  form: "Form",
  verification: "Verification",
  government_portal: "Government",
  completed: "Completed",
  closed: "Closed",
};

const TIMER_LABEL: Record<string, string> = {
  incomplete_form: "Form nudge",
  closure: "Auto-closure",
  reminder: "Gov reminder",
  custom: "Custom",
};

const AUTO_LABEL: Record<string, string> = {
  incomplete_form_flow: "Incomplete-form flow",
  closure_flow: "Closure flow",
  gov_reminder_flow: "Government reminder",
};

type Tone = "running" | "paused" | "completed" | "stopped";

function statusChip(tone: Tone, label: string) {
  const cls =
    tone === "running"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "paused"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "completed"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-slate-100 text-slate-600 border-slate-200";
  const Icon =
    tone === "running" ? PlayCircle : tone === "paused" ? PauseCircle : tone === "completed" ? CheckCircle2 : StopCircle;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      <Icon className="size-3" /> {label}
    </span>
  );
}

export function OrderWorkflowLiveStatus({ applicationId }: { applicationId: string }) {
  const fn = useServerFn(getWorkflowState);
  const q = useQuery({
    queryKey: ["order-workflow-state", applicationId],
    queryFn: () => fn({ data: { applicationId } }),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

  const state = q.data?.state as any | null | undefined;
  const timers = (q.data?.timers ?? []) as any[];
  const automations = (q.data?.automations ?? []) as any[];

  const overallTone: Tone = !state
    ? "stopped"
    : state.stage === "completed"
    ? "completed"
    : state.stage === "closed"
    ? "stopped"
    : state.paused
    ? "paused"
    : "running";
  const overallLabel = !state
    ? "Not initialised"
    : state.stage === "completed"
    ? "Completed"
    : state.stage === "closed"
    ? "Stopped"
    : state.paused
    ? "Paused"
    : "Running";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-slate-600">
          <Cog className="size-3.5" /> Workflow engine
        </div>
        <div className="flex items-center gap-2">
          {statusChip(overallTone, overallLabel)}
          {state?.active_ticket_id && (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
              <Ticket className="size-3" /> Active ticket
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {q.isLoading ? (
          <div className="text-xs text-slate-500">Loading engine state…</div>
        ) : !state ? (
          <div className="text-xs text-slate-500">
            No workflow row yet. The engine initialises this order automatically on the next event.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Kv label="Stage" value={STAGE_LABEL[state.stage] ?? state.stage} />
              <Kv label="Status" value={String(state.status ?? "—").replaceAll("_", " ")} />
              {state.sub_status && <Kv label="Sub-status" value={String(state.sub_status).replaceAll("_", " ")} />}
              {state.pause_reason && <Kv label="Pause reason" value={String(state.pause_reason).replaceAll("_", " ")} />}
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Timer className="size-3" /> Timers ({timers.length})
              </div>
              {timers.length === 0 ? (
                <div className="text-xs text-slate-500">No active timers.</div>
              ) : (
                <ul className="space-y-1">
                  {timers.map((t) => {
                    const tone: Tone = t.status === "paused" ? "paused" : "running";
                    return (
                      <li key={t.id} className="flex items-center justify-between rounded-md border bg-white px-2 py-1 text-xs">
                        <div className="flex items-center gap-2">
                          <AlarmClock className="size-3 text-slate-500" />
                          <span className="font-medium">{TIMER_LABEL[t.kind] ?? t.kind}</span>
                          {t.due_at && (
                            <span className="text-slate-500" title={formatIST(t.due_at)}>
                              · fires {relativeIST(t.due_at)}
                            </span>
                          )}
                        </div>
                        {statusChip(tone, t.status)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Cog className="size-3" /> Automations ({automations.length})
              </div>
              {automations.length === 0 ? (
                <div className="text-xs text-slate-500">No active automations.</div>
              ) : (
                <ul className="space-y-1">
                  {automations.map((a) => {
                    const tone: Tone = a.status === "paused" ? "paused" : "running";
                    return (
                      <li key={a.id} className="flex items-center justify-between rounded-md border bg-white px-2 py-1 text-xs">
                        <span className="font-medium">{AUTO_LABEL[a.code] ?? a.code}</span>
                        {statusChip(tone, a.status)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/60 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-slate-800 font-medium mt-0.5 capitalize">{value}</div>
    </div>
  );
}
