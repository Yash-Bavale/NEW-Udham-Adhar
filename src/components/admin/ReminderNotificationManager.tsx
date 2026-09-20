import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Flame, PhoneCall, ArrowRight, X } from "lucide-react";
import { getDueRemindersSummary } from "@/lib/orders/actions/callback-reminder.functions";
import { playReminderSound, showDesktopNotification } from "@/lib/audio/reminder-sounds";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

export function ReminderNotificationManager() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const getSummaryFn = useServerFn(getDueRemindersSummary);

  // Set of notified scheduler IDs in session
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  // Listen for realtime changes to order_schedulers table
  useRealtimeTable("order_schedulers", () => {
    qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
    qc.invalidateQueries({ queryKey: ["orders-v2"] });
    qc.invalidateQueries({ queryKey: ["active-order-callback"] });
  });

  const { data } = useQuery({
    queryKey: ["due-reminders-summary"],
    queryFn: () => getSummaryFn({ data: {} }),
    refetchInterval: 25_000, // Poll every 25 seconds
    staleTime: 10_000,
  });

  useEffect(() => {
    const dueList = data?.dueReminders ?? [];
    if (!dueList.length) return;

    for (const reminder of dueList) {
      if (!reminder.id || notifiedIdsRef.current.has(reminder.id)) continue;

      // Mark as notified so we don't spam audio repeatedly for the same due reminder
      notifiedIdsRef.current.add(reminder.id);

      // Play alert sound
      playReminderSound();

      const reasonText = reminder.remarks?.reasonLabel || "Customer Follow-Up";
      const customerInfo = `${reminder.customer_name} ${reminder.customer_mobile ? `(${reminder.customer_mobile})` : ""}`.trim();
      const orderCode = reminder.application_code || "Order";

      // Native browser notification
      showDesktopNotification(`🔥 Hot Order: Callback Due Now!`, {
        body: `${orderCode} · ${customerInfo} · Reason: ${reasonText}`,
      }, `/admin/orders/${reminder.application_id}`);

      // Rich Sonner Toast Notification on screen
      toast.custom(
        (t) => (
          <div className="flex w-full max-w-md items-start justify-between gap-3 rounded-2xl border-2 border-rose-500 bg-gradient-to-br from-rose-900 to-slate-900 p-4 text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-400 shadow-inner">
              <Flame className="size-6 animate-pulse text-rose-400" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white shadow-xs">
                  HOT ORDER NOW
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {orderCode}
                </span>
              </div>

              <div className="text-sm font-bold text-white">
                {customerInfo}
              </div>

              <div className="text-xs text-rose-200/90 font-medium">
                Reason: {reasonText}
              </div>

              {reminder.remarks?.note && (
                <div className="text-[11px] text-slate-300 italic">
                  "{reminder.remarks.note}"
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t);
                    if (reminder.application_id) {
                      navigate({ to: `/admin/orders/${reminder.application_id}` as any });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow hover:bg-slate-100 transition cursor-pointer"
                >
                  <PhoneCall className="size-3.5 text-rose-600" /> Open & Call Customer <ArrowRight className="size-3" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="grid size-6 place-items-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        ),
        {
          duration: 30_000, // Stay visible for 30s
          id: `due-reminder-${reminder.id}`,
        }
      );
    }
  }, [data, navigate]);

  return null;
}
