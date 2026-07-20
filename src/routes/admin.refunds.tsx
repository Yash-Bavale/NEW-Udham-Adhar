import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { Loader2, RefreshCw, CheckCircle2, XCircle, Send } from "lucide-react";
import { listRefundRequests } from "@/lib/crm/workflow-closure.functions";
import {
  approveRefund,
  rejectRefund,
  markRefundProcessed,
} from "@/lib/orders/order-actions.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/refunds")({
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/admin-login" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "super_admin", "finance", "accounts"]);
    if (!data || data.length === 0) throw redirect({ to: "/admin/my-work" });
  },
  component: RefundsPage,
});

const STATUSES = ["pending", "approved", "rejected", "info_needed", "escalated"] as const;
type S = (typeof STATUSES)[number];

const TONE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  info_needed: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  escalated: "bg-purple-500/15 text-purple-600 border-purple-500/30",
};

function RefundsPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<S>("pending");
  const fnList = useServerFn(listRefundRequests);
  const fnApprove = useServerFn(approveRefund);
  const fnReject = useServerFn(rejectRefund);
  const fnProcess = useServerFn(markRefundProcessed);

  const q = useQuery({
    queryKey: ["refund-requests", status],
    queryFn: () => fnList({ data: { status } }),
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [paymentRef, setPaymentRef] = useState<string>("");

  const active = useMemo(
    () => q.data?.rows.find((r: any) => r.id === activeId) ?? null,
    [q.data, activeId],
  );

  useEffect(() => {
    if (active) {
      setAmount(active.refund_amount ? String(active.refund_amount) : "");
      setNotes(active.admin_notes ?? "");
      setPaymentRef("");
    }
  }, [active]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["refund-requests"] });
    setActiveId(null);
  };

  const approve = useMutation({
    mutationFn: async () => {
      if (!active) throw new Error("No refund selected");
      return fnApprove({
        data: {
          orderId: active.application_id,
          amount: Number(amount),
          adminNotes: notes || undefined,
        },
      });
    },
    onSuccess: () => { toast.success("Refund approved"); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const reject = useMutation({
    mutationFn: async () => {
      if (!active) throw new Error("No refund selected");
      return fnReject({
        data: {
          orderId: active.application_id,
          reason: notes || "Rejected by admin",
        },
      });
    },
    onSuccess: () => { toast.success("Refund rejected"); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const process = useMutation({
    mutationFn: async () => {
      if (!active) throw new Error("No refund selected");
      return fnProcess({
        data: {
          orderId: active.application_id,
          amount: Number(amount),
          paymentReference: paymentRef,
        },
      });
    },
    onSuccess: () => { toast.success("Refund processed & customer notified"); invalidate(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const busy = approve.isPending || reject.isPending || process.isPending;
  const activeStatus = (active?.status ?? "pending") as S;

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Refund Review</h1>
          <p className="text-sm text-muted-foreground">
            Approve, reject, or mark refunds as processed (sends E011 to customer).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-md border bg-card p-0.5 flex">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded px-3 py-1 text-xs capitalize ${status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
          <button onClick={() => q.refetch()} className="rounded-md border px-2 py-1 text-xs inline-flex items-center gap-1">
            <RefreshCw className="size-3" /> Refresh
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="grid grid-cols-12 gap-2 border-b px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-2">Order</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-3">Reason</div>
          <div className="col-span-2">Created</div>
        </div>
        {q.isLoading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Loading…</div>
        ) : (q.data?.rows ?? []).length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No refund requests.</div>
        ) : (
          (q.data?.rows ?? []).map((r: any) => (
            <button
              key={r.id}
              onClick={() => setActiveId(r.id)}
              className="grid w-full grid-cols-12 gap-2 border-b px-3 py-2 text-sm text-left hover:bg-muted/40"
            >
              <div className="col-span-2 font-mono text-xs">{r.application?.application_code ?? "—"}</div>
              <div className="col-span-3">
                <div className="font-medium">{r.lead?.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{r.lead?.email ?? ""}</div>
              </div>
              <div className="col-span-2">{r.refund_amount ? `₹${r.refund_amount}` : "—"}</div>
              <div className="col-span-3 truncate">{r.reason ?? "—"}</div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {format(new Date(r.created_at), "dd MMM, hh:mm a")}
              </div>
            </button>
          ))
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-lg border bg-card p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">
                  Refund · {active.application?.application_code}
                </div>
                <div className="text-lg font-semibold">{active.lead?.name}</div>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${TONE[activeStatus]}`}>
                {activeStatus.replace("_", " ")}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Service:</span> {active.lead?.service ?? "—"}</div>
              <div><span className="text-muted-foreground">Reason:</span> {active.reason ?? "—"}</div>
              <div><span className="text-muted-foreground">Customer notes:</span> {active.customer_notes ?? "—"}</div>

              <div>
                <label className="text-xs text-muted-foreground">Refund amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                  placeholder="0.00"
                />
              </div>

              {activeStatus === "pending" && (
                <div>
                  <label className="text-xs text-muted-foreground">Admin notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                    placeholder="Reason for approval / rejection…"
                  />
                </div>
              )}

              {activeStatus === "approved" && (
                <div>
                  <label className="text-xs text-muted-foreground">Payment / UTR reference</label>
                  <input
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
                    placeholder="e.g. UTR123456 / txn_abc"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Marking processed sends E011 to the customer and auto-closes the order.
                  </p>
                </div>
              )}

              {activeStatus === "approved" && active.admin_notes && (
                <div className="rounded border bg-muted/40 p-2 text-xs">
                  <div className="text-muted-foreground">Approved with note:</div>
                  <div>{active.admin_notes}</div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setActiveId(null)}
                className="rounded-md border px-3 py-1.5 text-sm"
                disabled={busy}
              >
                Close
              </button>

              {activeStatus === "pending" && (
                <>
                  <button
                    onClick={() => reject.mutate()}
                    disabled={busy || !notes.trim()}
                    className="inline-flex items-center gap-1 rounded-md border border-rose-500/40 px-3 py-1.5 text-sm text-rose-600 disabled:opacity-50"
                  >
                    {reject.isPending ? <Loader2 className="size-3 animate-spin" /> : <XCircle className="size-3" />}
                    Reject
                  </button>
                  <button
                    onClick={() => approve.mutate()}
                    disabled={busy || !amount || Number(amount) <= 0}
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                  >
                    {approve.isPending ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
                    Approve
                  </button>
                </>
              )}

              {activeStatus === "approved" && (
                <button
                  onClick={() => process.mutate()}
                  disabled={busy || !paymentRef.trim() || !amount || Number(amount) <= 0}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
                >
                  {process.isPending ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
                  Mark Processed & Notify
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
