// Unified Customer Journey Map — one-screen view of where the order is across
// the three lanes: happy path, external delay, cancellation/refund. Designed
// for the Overview tab so employees never have to hunt across panels.
import {
  CheckCircle2, Circle, AlertTriangle, Ban, Clock, ArrowRight,
} from "lucide-react";

type ClosureStage =
  | "none" | "request_received" | "closed"
  | "concern_reply_sent" | "final_ticket_closed"
  | "refund_reviewed" | "acknowledged"
  | "closure_pending" | "notice_sent" | string;

const HAPPY_STEPS: { key: string; label: string }[] = [
  { key: "lead_received",     label: "Lead" },
  { key: "payment_done",      label: "Payment" },
  { key: "order_received",    label: "Order Received" },
  { key: "form_submitted",    label: "Form Submitted" },
  { key: "documents_received",label: "Docs Received" },
  { key: "verification_pending",label: "Verification" },
  { key: "application_submitted",label: "Submitted to Govt" },
  { key: "under_processing",  label: "Processing" },
  { key: "completed",         label: "Completed" },
];

const CANCEL_STEPS: { key: ClosureStage; label: string; n: number }[] = [
  { key: "request_received",   label: "Step 1 · Request",    n: 1 },
  { key: "closed",             label: "Step 2 · Closed",     n: 2 },
  { key: "concern_reply_sent", label: "Step 3 · Reply",      n: 3 },
  { key: "final_ticket_closed",label: "Step 4 · Ticket",     n: 4 },
  { key: "refund_reviewed",    label: "Step 5 · Refund",     n: 5 },
  { key: "refund_reviewed",    label: "Step 6 · Final",      n: 6 },
  { key: "acknowledged",       label: "Step 7 · Ack",        n: 7 },
];

export function CustomerJourneyMap({
  application,
  paymentSuccessfulAt,
  stageMeta,
  workflowStatus,
  closureStage,
  closureNextAt,
  closureReasonLabel,
}: {
  application: any;
  paymentSuccessfulAt?: string | null;
  stageMeta?: Record<string, { at?: string | null }> | null;
  workflowStatus?: string | null;
  closureStage?: ClosureStage | null;
  closureNextAt?: string | null;
  closureReasonLabel?: string | null;
}) {
  const cs = (closureStage ?? "none") as ClosureStage;
  const cancelActive = cs !== "none";
  const externalDelay = !!workflowStatus && /delay|external|pending_closure/i.test(workflowStatus);

  // Build a quick lookup of completed happy-path steps from the data we already have.
  const ts: Record<string, string | null | undefined> = {
    lead_received: application?.created_at,
    payment_done: paymentSuccessfulAt,
    order_received: stageMeta?.order_received?.at,
    form_submitted: application?.form_submitted_at,
    documents_received: stageMeta?.documents_received?.at,
    verification_pending: stageMeta?.verification_pending?.at,
    application_submitted: stageMeta?.application_submitted?.at,
    under_processing: stageMeta?.under_processing?.at,
    completed: stageMeta?.completed?.at ?? application?.certificate_uploaded_at ?? (application as any)?.fulfilled_at,
  };

  const lastCompletedIdx = HAPPY_STEPS.reduce(
    (acc, s, i) => (ts[s.key] ? i : acc),
    -1,
  );

  const cancelStepIdx = CANCEL_STEPS.findIndex((s) => s.key === cs);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-cyan-50/30 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-600">
            Customer Journey Map
          </div>
          <div className="text-[12px] text-slate-600">
            One view of where this order is across all three lanes.
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10.5px] font-semibold">
          <Legend color="emerald" label="Happy path" />
          {externalDelay && <Legend color="amber" label="External delay" />}
          {cancelActive && <Legend color="rose" label="Cancellation" />}
        </div>
      </div>

      {/* Lane 1 — Happy path */}
      <Lane title="Service delivery" tone="emerald">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {HAPPY_STEPS.map((s, i) => {
            const done = i <= lastCompletedIdx;
            const active = i === lastCompletedIdx;
            return (
              <div key={s.key} className="flex items-center gap-1.5 flex-shrink-0">
                <div
                  className={`flex flex-col items-center gap-1 ${cancelActive ? "opacity-60" : ""}`}
                  title={ts[s.key] ? new Date(ts[s.key]!).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : ""}
                >
                  {done ? (
                    <CheckCircle2 className={`size-5 ${active ? "text-emerald-600" : "text-emerald-500"}`} />
                  ) : (
                    <Circle className="size-5 text-slate-300" />
                  )}
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${done ? "text-slate-800" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < HAPPY_STEPS.length - 1 && (
                  <ArrowRight className={`size-3 ${i < lastCompletedIdx ? "text-emerald-400" : "text-slate-300"}`} />
                )}
              </div>
            );
          })}
        </div>
      </Lane>

      {/* Lane 2 — External delay (only shown when active) */}
      {externalDelay && (
        <Lane title="External / processing delay" tone="amber">
          <div className="flex items-center gap-2 text-[12px] text-amber-900">
            <AlertTriangle className="size-4 text-amber-600" />
            <span>
              Workflow paused — status: <b className="font-mono">{workflowStatus}</b>. Customer
              is receiving the standard Service Processing Update cadence.
            </span>
          </div>
        </Lane>
      )}

      {/* Lane 3 — Cancellation / refund (only shown when active) */}
      {cancelActive && (
        <Lane title="Cancellation & Refund" tone="rose">
          <div className="space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {CANCEL_STEPS.map((s, i) => {
                const active = cancelStepIdx >= 0 && i <= cancelStepIdx;
                return (
                  <div key={`${s.key}-${i}`} className="flex items-center gap-1 flex-shrink-0">
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        active
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      {s.label}
                    </div>
                    {i < CANCEL_STEPS.length - 1 && (
                      <ArrowRight className={`size-3 ${active ? "text-rose-400" : "text-slate-300"}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-rose-900">
              <span className="inline-flex items-center gap-1">
                <Ban className="size-3" /> Current: <b>{cs}</b>
              </span>
              {closureReasonLabel && (
                <span>Reason: <b>{closureReasonLabel}</b></span>
              )}
              {closureNextAt && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" /> Next auto-step:{" "}
                  <b className="font-mono">
                    {new Date(closureNextAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </b>
                </span>
              )}
            </div>
          </div>
        </Lane>
      )}
    </div>
  );
}

function Lane({
  title, tone, children,
}: { title: string; tone: "emerald" | "amber" | "rose"; children: React.ReactNode }) {
  const ring =
    tone === "emerald" ? "border-emerald-200 bg-emerald-50/40" :
    tone === "amber" ? "border-amber-200 bg-amber-50/40" :
    "border-rose-200 bg-rose-50/40";
  const pill =
    tone === "emerald" ? "text-emerald-700" :
    tone === "amber" ? "text-amber-700" : "text-rose-700";
  return (
    <div className={`rounded-xl border ${ring} p-3`}>
      <div className={`text-[10px] uppercase tracking-[0.14em] font-bold mb-2 ${pill}`}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: "emerald" | "amber" | "rose"; label: string }) {
  const c =
    color === "emerald" ? "bg-emerald-500" :
    color === "amber" ? "bg-amber-500" : "bg-rose-500";
  return (
    <span className="inline-flex items-center gap-1 text-slate-600">
      <span className={`size-2 rounded-full ${c}`} />
      {label}
    </span>
  );
}
