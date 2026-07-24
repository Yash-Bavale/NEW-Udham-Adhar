import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Repeat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { changeOrderService } from "@/lib/crm/orders-v2.functions";
import { listServices } from "@/lib/crm/services-admin.functions";

const ALLOWED = new Set(["order_received", "awaiting_customer_form", "waiting_for_customer_submission", "waiting_customer_submission", "S01", "S02", "S03"]);

interface Props {
  orderId: string;
  currentServiceId: string | null;
  currentServiceName: string;
  fulfillmentStatus: string;
  formSubmittedAt: string | null;
}

export function ChangeServiceButton(p: Props) {
  const [open, setOpen] = useState(false);
  const canChange = !p.formSubmittedAt && ALLOWED.has(p.fulfillmentStatus);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled={!canChange}
            onClick={() => setOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border ${
              canChange
                ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" /> Change Service
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {canChange
            ? "Switch this order to a different service (allowed until the form is submitted)."
            : "Service can only be changed before the customer submits the form."}
        </TooltipContent>
      </Tooltip>
      {open && (
        <ChangeServiceDialog
          orderId={p.orderId}
          currentServiceId={p.currentServiceId}
          currentServiceName={p.currentServiceName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function ChangeServiceDialog({
  orderId, currentServiceId, currentServiceName, onClose,
}: { orderId: string; currentServiceId: string | null; currentServiceName: string; onClose: () => void }) {
  const qc = useQueryClient();
  const listFn = useServerFn(listServices);
  const changeFn = useServerFn(changeOrderService);
  const { data } = useQuery({ queryKey: ["admin.services"], queryFn: () => listFn() });
  const [newId, setNewId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const options = (data?.rows ?? []).filter((s: any) => s.id !== currentServiceId && s.is_active);
  const currentSvc = (data?.rows ?? []).find((s: any) => s.id === currentServiceId);
  const selected = options.find((s: any) => s.id === newId);

  const currentTotal = Number(currentSvc?.total_amount ?? 0);
  const newTotal = Number(selected?.total_amount ?? 0);
  const delta = selected ? Math.round((newTotal - currentTotal) * 100) / 100 : 0;
  const mode: "same" | "downgrade" | "upgrade" | null = !selected
    ? null
    : delta > 0.01 ? "upgrade" : delta < -0.01 ? "downgrade" : "same";

  const modeStyles: Record<string, string> = {
    same: "border-emerald-200 bg-emerald-50 text-emerald-900",
    downgrade: "border-slate-200 bg-slate-50 text-slate-800",
    upgrade: "border-amber-200 bg-amber-50 text-amber-900",
  };
  const modeLabel: Record<string, string> = {
    same: "Same price",
    downgrade: "Downgrade",
    upgrade: "Top-up required",
  };
  const submitLabel = busy
    ? "Applying…"
    : mode === "upgrade" ? "Change & send balance link"
    : mode === "downgrade" ? "Change (no refund)"
    : mode === "same" ? "Change service"
    : "Apply Change";

  const submit = async () => {
    if (!newId) return;
    setBusy(true);
    try {
      const r = await changeFn({ data: { orderId, newServiceId: newId } });
      const priceMsg =
        r.mode === "upgrade" ? `Top-up of ₹${r.delta.toFixed(2)} — balance payment link sent.`
        : r.mode === "downgrade" ? `Customer overpaid by ₹${Math.abs(r.delta).toFixed(2)} (no refund per policy).`
        : `Amount unchanged.`;
      const emailMsg = r.emailSent
        ? " Update emailed to customer."
        : r.emailError
          ? ` Email not sent: ${r.emailError}`
          : "";
      toast.success(`Service changed. ${priceMsg}${emailMsg}`);
      qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
      qc.invalidateQueries({ queryKey: ["admin.lead-emails"] });
      qc.invalidateQueries({ queryKey: ["admin.invoices"] });
      qc.invalidateQueries({ queryKey: ["payment-link-status", orderId] });
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to change service");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Change Service</DialogTitle></DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Current</div>
            <div className="font-semibold text-slate-900">{currentServiceName}</div>
            {currentSvc && (
              <div className="text-xs text-slate-600 mt-0.5">₹{currentTotal.toFixed(2)}</div>
            )}
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-slate-500">New service</label>
            <select
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select a service…</option>
              {options.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.service_name} — ₹{Number(s.total_amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          {selected && mode && (
            <div className={`rounded-md border p-3 text-xs space-y-2 ${modeStyles[mode]}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Adjustment</span>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold">
                  {modeLabel[mode]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-1">
                <span>Currently paid</span><span className="text-right font-semibold">₹{currentTotal.toFixed(2)}</span>
                <span>New total</span><span className="text-right font-semibold">₹{newTotal.toFixed(2)}</span>
                <span className="border-t pt-1 mt-1">
                  {mode === "upgrade" ? "Balance due" : mode === "downgrade" ? "Overpayment (retained)" : "Difference"}
                </span>
                <span className="text-right font-bold border-t pt-1 mt-1">
                  ₹{Math.abs(delta).toFixed(2)}
                </span>
              </div>
              <p className="pt-1 leading-relaxed">
                {mode === "upgrade" && "A balance payment link will be created and emailed. The onboarding form for the new service unlocks after payment."}
                {mode === "downgrade" && "The service will be switched immediately. No refund is issued for the difference (per policy). Onboarding form link for the new service will be emailed."}
                {mode === "same" && "The service will be switched immediately. No extra payment needed — onboarding form link for the new service will be emailed."}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={!newId || busy}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
