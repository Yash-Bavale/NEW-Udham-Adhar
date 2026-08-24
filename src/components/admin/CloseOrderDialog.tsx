import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, X } from "lucide-react";
import { closeOrder } from "@/lib/crm/workflow-closure.functions";
import { listClosureReasons } from "@/lib/crm/workflow.functions";
import { toast } from "sonner";

export function CloseOrderDialog({
  applicationId,
  open,
  onClose,
}: {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const fnReasons = useServerFn(listClosureReasons);
  const fnClose = useServerFn(closeOrder);
  const { data } = useQuery({
    queryKey: ["workflow-closure-reasons"],
    queryFn: () => fnReasons({ data: {} as never }),
    enabled: open,
  });
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      if (data?.reasons?.length) {
        setCode((prev) => (prev && data.reasons.some(r => r.code === prev) ? prev : data.reasons[0].code));
      } else if (!code) {
        setCode("E010");
      }
    }
  }, [open, data]);

  const mut = useMutation({
    mutationFn: async () => {
      const r = data?.reasons.find((x) => x.code === code);
      if (!r) throw new Error("Pick a reason");
      await fnClose({ data: { applicationId, reasonCode: code, reasonLabel: r.label, notes: notes || undefined } });
    },
    onSuccess: () => {
      toast.success("Order closed — closure notice sent.");
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Close order</div>
          <button onClick={onClose}><X className="size-4 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs text-muted-foreground">Reason</label>
            <select value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5">
              {data?.reasons.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5" />
          </div>
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            All pending reminders will be cancelled and a closure notice email will be sent to the customer.
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={() => mut.mutate()} disabled={mut.isPending || !code} className="rounded-md bg-rose-600 px-3 py-1.5 text-sm text-white inline-flex items-center gap-2 disabled:opacity-50">
            {mut.isPending && <Loader2 className="size-3 animate-spin" />} Close order
          </button>
        </div>
      </div>
    </div>
  );
}
