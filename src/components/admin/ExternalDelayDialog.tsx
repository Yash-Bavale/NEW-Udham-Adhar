import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, AlertTriangle, Calendar, MessageCircle, X } from "lucide-react";
import { setExternalDelay, listDelayReasons } from "@/lib/crm/workflow.functions";
import { toast } from "sonner";

export function ExternalDelayDialog({
  applicationId,
  open,
  onClose,
}: {
  applicationId: string;
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const fnReasons = useServerFn(listDelayReasons);
  const fnSubmit = useServerFn(setExternalDelay);

  const { data: reasons } = useQuery({
    queryKey: ["workflow-delay-reasons"],
    queryFn: () => fnReasons({ data: {} as never }),
    enabled: open,
  });

  const [side, setSide] = useState<"customer" | "internal">("customer");
  const [reasonCode, setReasonCode] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [expected, setExpected] = useState(() => {
    const d = new Date(Date.now() + 3 * 86400 * 1000);
    return d.toISOString().slice(0, 10);
  });
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");

  const filteredReasons = (reasons?.reasons ?? []).filter((r: any) => (r.side ?? "customer") === side);

  useEffect(() => {
    if (open && filteredReasons.length && !filteredReasons.find((r) => r.code === reasonCode)) {
      setReasonCode(filteredReasons[0].code);
    }
  }, [open, reasons, side, reasonCode, filteredReasons]);

  const mut = useMutation({
    mutationFn: async () => {
      const reason = reasons?.reasons.find((r) => r.code === reasonCode);
      if (!reason) throw new Error("Pick a reason");
      await fnSubmit({
        data: {
          applicationId,
          reasonCode,
          reasonLabel: reason.label,
          internalNote: internalNote || undefined,
          customerNote: customerNote || undefined,
          expectedReviewAt: expected,
          priority,
          kind: side === "internal" ? "government_portal_pending" : "external_dependency",
        },
      });
    },
    onSuccess: () => {
      toast.success("External delay logged — customer notified, follow-ups scheduled.");
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-reminders", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-lg border bg-card p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500" />
            <div className="font-semibold">Mark Delay</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs text-muted-foreground">Delay type</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSide("customer")}
                className={`rounded-md border px-2 py-2 text-left ${side === "customer" ? "border-primary bg-primary/5" : "bg-background"}`}
              >
                <div className="font-medium">Customer-side</div>
                <div className="text-[11px] text-muted-foreground">Sends notice + auto-closes after 8 business hours</div>
              </button>
              <button
                type="button"
                onClick={() => setSide("internal")}
                className={`rounded-md border px-2 py-2 text-left ${side === "internal" ? "border-primary bg-primary/5" : "bg-background"}`}
              >
                <div className="font-medium">Our-side (internal)</div>
                <div className="text-[11px] text-muted-foreground">Notifies assignee. No customer email, no auto-closure</div>
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Reason</label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5"
            >
              {filteredReasons.map((r) => (
                <option key={r.code} value={r.code}>{r.label}</option>
              ))}
              {filteredReasons.length === 0 && <option value="">No reasons configured for this side</option>}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> Expected review</label>
              <input
                type="date"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-2 py-1.5"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as never)}
                className="mt-1 w-full rounded-md border bg-background px-2 py-1.5"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Internal note</label>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5"
              placeholder="Visible to the team only"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageCircle className="size-3" /> Customer-visible note (optional — sent in the email)
            </label>
            <textarea
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1.5"
              placeholder="Will be included in the email to the customer"
            />
          </div>
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            On save: order status updates, customer gets a delay notice email, a 24-hour review reminder is created,
            and 3 / 5 / 7-day follow-up emails are scheduled automatically.
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending || !reasonCode}
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50"
          >
            {mut.isPending && <Loader2 className="size-3 animate-spin" />}
            Save & notify customer
          </button>
        </div>
      </div>
    </div>
  );
}
