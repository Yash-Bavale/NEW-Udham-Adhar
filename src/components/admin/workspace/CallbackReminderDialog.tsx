import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  PhoneCall, PhoneOff, PhoneForwarded, Clock, CheckCircle2,
  XCircle, AlertTriangle, Flame, Calendar, MessageSquare,
  Sparkles, WifiOff, FileClock, X, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIST } from "@/lib/datetime";
import {
  scheduleOrderCallback,
  cancelOrderCallback,
  completeOrderCallback,
  getActiveOrderCallback,
} from "@/lib/orders/actions/callback-reminder.functions";

interface Props {
  orderId: string;
  orderCode?: string;
  customerName?: string;
  customerMobile?: string;
  onClose: () => void;
}

const OUTCOMES = [
  {
    id: "unreachable",
    label: "Customer Unreachable / Not Picking",
    description: "Ringing but no answer, unreachable after multiple attempts",
    icon: PhoneOff,
    tone: "rose",
  },
  {
    id: "call_back_later",
    label: "Customer Asked to Call Back Later",
    description: "Customer requested specific follow-up time",
    icon: PhoneForwarded,
    tone: "indigo",
  },
  {
    id: "network_issue",
    label: "Busy / Network / Switched Off",
    description: "Line busy, call failed, or phone switched off",
    icon: WifiOff,
    tone: "amber",
  },
  {
    id: "docs_pending",
    label: "Requested Info / Docs Pending",
    description: "Waiting for customer to check details or send documents",
    icon: FileClock,
    tone: "emerald",
  },
];

const PRESET_DURATIONS = [
  { label: "15 Mins", minutes: 15 },
  { label: "30 Mins", minutes: 30 },
  { label: "1 Hour", minutes: 60 },
  { label: "2 Hours", minutes: 120 },
  { label: "3 Hours", minutes: 180 },
  { label: "4 Hours", minutes: 240 },
  { label: "1 Day", minutes: 1440 },
  { label: "Custom", minutes: -1 },
];

const QUICK_NOTES = [
  "Will arrange documents on WhatsApp",
  "Busy in meeting, call after 2 hrs",
  "Discuss with partner & confirm",
  "Number was busy, retry soon",
  "OTP verification pending from client",
];

export function CallbackReminderDialog({
  orderId,
  orderCode,
  customerName,
  customerMobile,
  onClose,
}: Props) {
  const qc = useQueryClient();

  const getActiveFn = useServerFn(getActiveOrderCallback);
  const scheduleFn = useServerFn(scheduleOrderCallback);
  const cancelFn = useServerFn(cancelOrderCallback);
  const completeFn = useServerFn(completeOrderCallback);

  const { data: activeCallback, isLoading: loadingActive } = useQuery({
    queryKey: ["active-order-callback", orderId],
    queryFn: () => getActiveFn({ data: { orderId } }),
    staleTime: 5_000,
  });

  const [selectedOutcome, setSelectedOutcome] = useState<string>("call_back_later");
  const [selectedMinutes, setSelectedMinutes] = useState<number>(60);
  const [customDateTime, setCustomDateTime] = useState<string>(() => {
    const d = new Date(Date.now() + 60 * 60_000);
    // Format YYYY-MM-DDTHH:mm for datetime-local
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [note, setNote] = useState<string>("");
  const [completeNote, setCompleteNote] = useState<string>("");

  const targetDate = useMemo(() => {
    if (selectedMinutes > 0) {
      return new Date(Date.now() + selectedMinutes * 60_000);
    }
    if (customDateTime) {
      const d = new Date(customDateTime);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date(Date.now() + 60 * 60_000);
  }, [selectedMinutes, customDateTime]);

  const scheduleMut = useMutation({
    mutationFn: async () => {
      const outcomeObj = OUTCOMES.find((o) => o.id === selectedOutcome) || {
        id: "custom",
        label: "Customer Follow-Up",
      };

      return scheduleFn({
        data: {
          orderId,
          reason: outcomeObj.id,
          reasonLabel: outcomeObj.label,
          durationMinutes: selectedMinutes > 0 ? selectedMinutes : undefined,
          customFiresAt: selectedMinutes <= 0 ? new Date(customDateTime).toISOString() : undefined,
          note: note.trim() || null,
        },
      });
    },
    onSuccess: () => {
      toast.success("Callback & Reminder scheduled successfully! Order will turn Hot when due.");
      qc.invalidateQueries({ queryKey: ["active-order-callback", orderId] });
      qc.invalidateQueries({ queryKey: ["orders-v2"] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", orderId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to schedule callback");
    },
  });

  const cancelMut = useMutation({
    mutationFn: async () => cancelFn({ data: { orderId } }),
    onSuccess: () => {
      toast.success("Callback reminder cancelled");
      qc.invalidateQueries({ queryKey: ["active-order-callback", orderId] });
      qc.invalidateQueries({ queryKey: ["orders-v2"] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to cancel reminder"),
  });

  const completeMut = useMutation({
    mutationFn: async () => completeFn({ data: { orderId, callOutcomeNote: completeNote.trim() || null } }),
    onSuccess: () => {
      toast.success("Callback marked as completed!");
      qc.invalidateQueries({ queryKey: ["active-order-callback", orderId] });
      qc.invalidateQueries({ queryKey: ["orders-v2"] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to complete callback"),
  });

  const isBusy = scheduleMut.isPending || cancelMut.isPending || completeMut.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 shadow-inner">
              <PhoneCall className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Schedule Customer Call Back & Reminder
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                  <Flame className="size-3 text-rose-400" /> HOT ORDER AT END
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {orderCode ? <span className="font-semibold text-slate-300">{orderCode}</span> : null}
                {customerName ? <span> · {customerName}</span> : null}
                {customerMobile ? <span> ({customerMobile})</span> : null}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800">
          {/* Active Reminder Banner if exists */}
          {activeCallback && (
            <div className={cn(
              "rounded-xl border p-4 shadow-xs",
              activeCallback.isDue
                ? "border-rose-300 bg-rose-50 text-rose-950"
                : "border-indigo-200 bg-indigo-50/70 text-indigo-950"
            )}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {activeCallback.isDue ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-black uppercase text-white shadow-xs">
                        <Flame className="size-3" /> Call Due Now (HOT ORDER)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-black uppercase text-white shadow-xs">
                        <Clock className="size-3" /> Scheduled Reminder Active
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-700">
                      Due: {formatIST(activeCallback.fires_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <b>Reason:</b> {activeCallback.parsedRemarks?.reasonLabel || "Follow-up"}
                    {activeCallback.parsedRemarks?.note ? ` — "${activeCallback.parsedRemarks.note}"` : null}
                  </p>
                  {activeCallback.parsedRemarks?.created_by_name && (
                    <p className="text-[11px] text-slate-500">
                      Set by {activeCallback.parsedRemarks.created_by_name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cancelMut.mutate()}
                    disabled={isBusy}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-rose-600 transition cursor-pointer"
                  >
                    Cancel Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => completeMut.mutate()}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                  >
                    <Check className="size-3.5" /> Complete Call
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Call Outcome / Reason */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Select Call Outcome / Reason (Why Call Back?)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {OUTCOMES.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedOutcome === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedOutcome(item.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition cursor-pointer select-none",
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs"
                        : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg shadow-xs",
                      isSelected ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                    )}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className={cn("text-xs font-bold", isSelected ? "text-blue-950" : "text-slate-800")}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Reminder Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Reminder Duration (When to Call?)
              </label>
              <span className="text-[11px] font-medium text-slate-500">
                Order becomes <b className="text-rose-600">Hot Order</b> at timer completion
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {PRESET_DURATIONS.map((preset) => {
                const isSelected = selectedMinutes === preset.minutes;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedMinutes(preset.minutes)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border py-2 px-1 text-center transition cursor-pointer select-none",
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white font-bold shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <span className="text-xs">{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedMinutes === -1 && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Custom Callback Date & Time (IST)
                </label>
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}
          </div>

          {/* Section 3: Target Time Preview Banner */}
          <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 p-3.5 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-blue-600 text-white">
                  <Clock className="size-3.5" />
                </span>
                <div>
                  <div className="text-[11px] font-medium text-slate-600">Target Callback Time:</div>
                  <div className="text-sm font-black text-blue-950">
                    {formatIST(targetDate.toISOString())}
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 shadow-2xs">
                <Flame className="size-3 text-rose-500" /> Hot Order Trigger
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">
              When this reminder ends, the order will float to the top of your order list with a <b className="text-rose-700">🔥 Hot Order</b> badge and a desktop sound alert will notify you.
            </p>
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Call Notes & Specifics (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_NOTES.map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setNote((prev) => (prev ? `${prev} | ${quick}` : quick))}
                  className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer select-none"
                >
                  + {quick}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="E.g., Customer said driving, call back after 3 PM. Need to re-confirm Aadhaar OTP."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => scheduleMut.mutate()}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
          >
            <PhoneCall className="size-4" />
            {scheduleMut.isPending ? "Scheduling Reminder…" : "Set Call Back & Reminder"}
          </button>
        </div>
      </div>
    </div>
  );
}
