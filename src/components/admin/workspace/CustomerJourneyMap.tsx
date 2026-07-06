// Unified Customer Journey Map — polished stage strip matching the workspace reference.
// Shows the primary happy-path with icon nodes + connectors, plus optional
// delay & cancellation lanes when active.
import {
  User, CreditCard, PhoneCall, FileText, ShieldCheck, Landmark, Award, Trophy,
  AlertTriangle, Ban, Clock, ArrowRight, Check,
} from "lucide-react";

type ClosureStage =
  | "none" | "request_received" | "closed"
  | "concern_reply_sent" | "final_ticket_closed"
  | "refund_reviewed" | "acknowledged"
  | "closure_pending" | "notice_sent" | string;

const HAPPY_STEPS = [
  { key: "lead_received",           label: "Lead",         icon: User },
  { key: "payment_done",            label: "Payment",      icon: CreditCard },
  { key: "order_received",          label: "Consultation", icon: PhoneCall },
  { key: "form_submitted",          label: "Form",         icon: FileText },
  { key: "verification_pending",    label: "Verification", icon: ShieldCheck },
  { key: "application_submitted",   label: "Govt Portal",  icon: Landmark },
  { key: "under_processing",        label: "Certificate",  icon: Award },
  { key: "completed",               label: "Completed",    icon: Trophy },
] as const;

const CANCEL_STEPS: { key: ClosureStage; label: string; n: number }[] = [
  { key: "request_received",   label: "Step 1 · Request",    n: 1 },
  { key: "closed",             label: "Step 2 · Closed",     n: 2 },
  { key: "concern_reply_sent", label: "Step 3 · Reply",      n: 3 },
  { key: "final_ticket_closed",label: "Step 4 · Ticket",     n: 4 },
  { key: "refund_reviewed",    label: "Step 5 · Refund",     n: 5 },
  { key: "acknowledged",       label: "Step 6 · Ack",        n: 6 },
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

  const ts: Record<string, string | null | undefined> = {
    lead_received: application?.created_at,
    payment_done: paymentSuccessfulAt,
    order_received: stageMeta?.order_received?.at,
    form_submitted: application?.form_submitted_at,
    verification_pending: stageMeta?.verification_pending?.at,
    application_submitted: stageMeta?.application_submitted?.at,
    under_processing: stageMeta?.under_processing?.at ?? application?.certificate_uploaded_at,
    completed: stageMeta?.completed?.at ?? (application as any)?.fulfilled_at,
  };

  const lastCompletedIdx = HAPPY_STEPS.reduce(
    (acc, s, i) => (ts[s.key] ? i : acc),
    -1,
  );
  const currentIdx = Math.min(lastCompletedIdx + 1, HAPPY_STEPS.length - 1);
  const cancelStepIdx = CANCEL_STEPS.findIndex((s) => s.key === cs);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-indigo-700">
          Customer Journey
        </div>
        <div className="flex items-center gap-3 text-[10.5px] font-medium">
          <Legend color="emerald" label="Completed" />
          <Legend color="indigo" label="Current" />
          <Legend color="slate" label="Upcoming" />
        </div>
      </div>

      {/* Happy-path strip */}
      <div className="relative">
        <div className={`flex items-start justify-between gap-1 overflow-x-auto pb-2 ${cancelActive ? "opacity-60" : ""}`}>
          {HAPPY_STEPS.map((s, i) => {
            const done = i <= lastCompletedIdx;
            const active = !cancelActive && i === currentIdx && currentIdx > lastCompletedIdx;
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex items-start gap-1 flex-1 min-w-0">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-[70px]">
                  <div className="relative">
                    <div
                      className={`size-11 rounded-full grid place-items-center transition-all ${
                        done ? "bg-emerald-500 text-white shadow-sm"
                        : active ? "bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100"
                        : "bg-slate-100 text-slate-400"
                      }`}
                      title={ts[s.key] ? new Date(ts[s.key]!).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : ""}
                    >
                      {done ? <Check className="size-5" /> : <Icon className="size-5" />}
                    </div>
                    {active && (
                      <span className="absolute inset-0 size-11 rounded-full ring-2 ring-indigo-400 animate-ping opacity-40" />
                    )}
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight whitespace-nowrap ${
                    done ? "text-slate-900" : active ? "text-indigo-700" : "text-slate-500"
                  }`}>
                    {s.label}
                  </span>
                  {active && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white -mt-0.5">
                      Current
                    </span>
                  )}
                </div>
                {i < HAPPY_STEPS.length - 1 && (
                  <div className="flex items-center h-11 flex-1 min-w-[24px]">
                    <div
                      className={`h-0.5 w-full ${
                        i < lastCompletedIdx ? "bg-emerald-400"
                        : i === lastCompletedIdx ? "bg-gradient-to-r from-emerald-400 to-slate-200"
                        : "bg-slate-200"
                      }`}
                      style={i === lastCompletedIdx ? { backgroundImage: "linear-gradient(to right, rgb(52 211 153), rgb(226 232 240))" } : undefined}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* External delay lane */}
      {externalDelay && (
        <Lane title="External / processing delay" tone="amber">
          <div className="flex items-center gap-2 text-[12px] text-amber-900">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <span>
              Workflow paused — status: <b className="font-mono">{workflowStatus}</b>. Customer
              is receiving Service Processing Update cadence.
            </span>
          </div>
        </Lane>
      )}

      {/* Cancellation lane */}
      {cancelActive && (
        <Lane title="Cancellation & Refund" tone="rose">
          <div className="space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {CANCEL_STEPS.map((s, i) => {
                const active = cancelStepIdx >= 0 && i <= cancelStepIdx;
                return (
                  <div key={`${s.key}-${i}`} className="flex items-center gap-1 flex-shrink-0">
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
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
              {closureReasonLabel && <span>Reason: <b>{closureReasonLabel}</b></span>}
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

function Lane({ title, tone, children }: { title: string; tone: "amber" | "rose"; children: React.ReactNode }) {
  const ring = tone === "amber" ? "border-amber-200 bg-amber-50/50" : "border-rose-200 bg-rose-50/50";
  const pill = tone === "amber" ? "text-amber-700" : "text-rose-700";
  return (
    <div className={`rounded-xl border ${ring} p-3`}>
      <div className={`text-[10px] uppercase tracking-[0.14em] font-semibold mb-2 ${pill}`}>{title}</div>
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: "emerald" | "indigo" | "slate"; label: string }) {
  const c = color === "emerald" ? "bg-emerald-500" : color === "indigo" ? "bg-indigo-600" : "bg-slate-300";
  return (
    <span className="inline-flex items-center gap-1 text-slate-600">
      <span className={`size-2 rounded-full ${c}`} />
      {label}
    </span>
  );
}
