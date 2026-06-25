import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, X } from "lucide-react";
import { createRefundRequest } from "@/lib/crm/workflow-closure.functions";
import { toast } from "sonner";

export function RefundRequestDialog({
  applicationId,
  open,
  onClose,
}: {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const fn = useServerFn(createRefundRequest);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const mut = useMutation({
    mutationFn: async () =>
      fn({
        data: {
          applicationId,
          reason: reason || undefined,
          customerNotes: notes || undefined,
          refundAmount: amount ? Number(amount) : undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Refund request created — moved to Refund Review.");
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      qc.invalidateQueries({ queryKey: ["refund-requests"] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Refund request received</div>
          <button onClick={onClose}><X className="size-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs text-muted-foreground">Reason</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5" placeholder="Short reason from the customer" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Refund amount (₹)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="mt-1 w-full rounded-md border bg-background px-2 py-1.5" placeholder="Optional" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Customer notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5" />
          </div>
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Status moves to <b>Refund Review</b>. Finance can approve / reject from /admin/refunds.
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={() => mut.mutate()} disabled={mut.isPending} className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50">
            {mut.isPending && <Loader2 className="size-3 animate-spin" />} Create request
          </button>
        </div>
      </div>
    </div>
  );
}
