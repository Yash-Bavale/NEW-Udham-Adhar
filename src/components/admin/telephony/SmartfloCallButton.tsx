import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { initiateClickToCall } from "@/lib/telephony/outbound.functions";

type Props = {
  mobile?: string | null;
  customerId?: string | null;
  leadId?: string | null;
  applicationId?: string | null;
  className?: string;
  label?: string;
  compact?: boolean;
};

/** "Call via Smartflo" — rings the logged-in employee's Smartflo phone, then the customer. */
export function SmartfloCallButton({ mobile, customerId, leadId, applicationId, className, label = "Call via Smartflo", compact }: Props) {
  const call = useServerFn(initiateClickToCall);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  if (!mobile) return null;

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      const r: any = await call({
        data: {
          destination: String(mobile),
          customerId: customerId ?? null,
          leadId: leadId ?? null,
          applicationId: applicationId ?? null,
        },
      });
      toast.success(r?.alreadyInProgress ? "This call is already in progress" : "Calling customer… answer your Smartflo phone first");
      qc.invalidateQueries({ queryKey: ["my-call-state"] });
    } catch (e: any) {
      toast.error(e?.message || "Could not start the call");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      title="Rings your Smartflo phone, then connects the customer"
      className={
        className ??
        `inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 ${compact ? "py-1" : "py-1.5"} text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition`
      }
    >
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <PhoneCall className="size-3.5" />}
      {busy ? "Calling…" : label}
    </button>
  );
}
