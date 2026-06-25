import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { Loader2, RefreshCw } from "lucide-react";
import { listRefundRequests, decideRefundRequest } from "@/lib/crm/workflow-closure.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/refunds")({
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
  const fnDecide = useServerFn(decideRefundRequest);

  const q = useQuery({
    queryKey: ["refund-requests", status],
    queryFn: () => fnList({ data: { status } }),
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const active = useMemo(() => q.data?.rows.find((r: any) => r.id === activeId) ?? null, [q.data, activeId]);

  const decide = useMutation({
    mutationFn: async (decision: "approved" | "rejected" | "info_needed" | "escalated") =>
      fnDecide({ data: { id: activeId!, decision, adminNotes: notes || undefined } }),
    onSuccess: () => {
      toast.success("Decision recorded");
      qc.invalidateQueries({ queryKey: ["refund-requests"] });
      setActiveId(null); setNotes("");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Refund Review</h1>
          <p className="text-sm text-muted-foreground">Approve, reject, or escalate customer refund requests.</p>
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
          <button onClick={() => q.refetch()} className="rounded-md border px-2 py-1 text-xs inline-flex items-center gap-1"><RefreshCw className="size-3" /> Refresh</button>
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
              onClick={() => { setActiveId(r.id); setNotes(r.admin_notes ?? ""); }}
              className="grid w-full grid-cols-12 gap-2 border-b px-3 py-2 text-sm text-left hover:bg-muted/40"
            >
              <div className="col-span-2 font-mono text-xs">{r.application?.application_code ?? "—"}</div>
              <div className="col-span-3">
                <div className="font-medium">{r.lead?.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{r.lead?.email ?? ""}</div>
              </div>
              <div className="col-span-2">{r.refund_amount ? `₹${r.refund_amount}` : "—"}</div>
              <div className="col-span-3 truncate">{r.reason ?? "—"}</div>
              <div className="col-span-2 text-xs text-muted-foreground">{format(new Date(r.created_at), "dd MMM, hh:mm a")}</div>
            </button>
          ))
        )}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-lg border bg-card p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Refund · {active.application?.application_code}</div>
                <div className="text-lg font-semibold">{active.lead?.name}</div>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[11px] capitalize ${TONE[active.status]}`}>{active.status.replace("_", " ")}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Service:</span> {active.lead?.service ?? "—"}</div>
              <div><span className="text-muted-foreground">Amount:</span> {active.refund_amount ? `₹${active.refund_amount}` : "—"}</div>
              <div><span className="text-muted-foreground">Reason:</span> {active.reason ?? "—"}</div>
              <div><span className="text-muted-foreground">Customer notes:</span> {active.customer_notes ?? "—"}</div>
              <div>
                <label className="text-xs text-muted-foreground">Admin notes (sent in email)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button onClick={() => { setActiveId(null); setNotes(""); }} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
              <button onClick={() => decide.mutate("info_needed")} disabled={decide.isPending} className="rounded-md border border-blue-500/40 px-3 py-1.5 text-sm text-blue-600">Need More Info</button>
              <button onClick={() => decide.mutate("escalated")} disabled={decide.isPending} className="rounded-md border border-purple-500/40 px-3 py-1.5 text-sm text-purple-600">Escalate</button>
              <button onClick={() => decide.mutate("rejected")} disabled={decide.isPending} className="rounded-md border border-rose-500/40 px-3 py-1.5 text-sm text-rose-600">Reject</button>
              <button onClick={() => decide.mutate("approved")} disabled={decide.isPending} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white inline-flex items-center gap-2">
                {decide.isPending && <Loader2 className="size-3 animate-spin" />} Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
