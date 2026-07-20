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

const ALLOWED = new Set(["order_received", "awaiting_customer_form", "waiting_customer_submission", "S01", "S02", "S03"]);

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
  const selected = options.find((s: any) => s.id === newId);

  const submit = async () => {
    if (!newId) return;
    setBusy(true);
    try {
      const r = await changeFn({ data: { orderId, newServiceId: newId } });
      const msg = r.delta > 0.01
        ? `Service changed. Top-up of ₹${r.delta.toFixed(2)} required — supplementary link created.`
        : r.delta < -0.01
          ? `Service changed. Customer overpaid by ₹${Math.abs(r.delta).toFixed(2)} (no refund per policy).`
          : `Service changed. Amount unchanged.`;
      toast.success(msg);
      qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
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
          {selected && (
            <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3 text-xs text-indigo-900">
              New total: <b>₹{Number(selected.total_amount).toFixed(2)}</b> (Base ₹{Number(selected.base_amount).toFixed(2)} + GST ₹{Number(selected.gst_amount).toFixed(2)}).
              If the customer already paid more, no refund is issued. If they paid less, a supplementary top-up link is created for the difference.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={!newId || busy}>{busy ? "Applying…" : "Apply Change"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
