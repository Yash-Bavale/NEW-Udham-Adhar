import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Ban, Clock } from "lucide-react";
import {
  requestCancellation,
  cancelClosureWorkflow,
} from "@/lib/crm/cancellation.functions";

const STAGE_LABEL: Record<string, string> = {
  none: "Active",
  request_received: "Step 1 — Request Received",
  closure_pending: "Step 2 — Closure Approval Pending",
  notice_sent: "Step 3 — Closure Notice Sent",
  closed: "Closed",
};

const STAGE_COLOR: Record<string, string> = {
  none: "var(--admin-fg-muted)",
  request_received: "#D97706",
  closure_pending: "#DC2626",
  notice_sent: "#991B1B",
  closed: "#475569",
};

export function CancellationPanel({
  applicationId,
  closureStage,
  closureNextAt,
  cancellationRequestedAt,
}: {
  applicationId: string;
  closureStage?: string | null;
  closureNextAt?: string | null;
  cancellationRequestedAt?: string | null;
}) {
  const stage = closureStage ?? "none";
  const qc = useQueryClient();
  const [reason, setReason] = useState("");
  const [showForm, setShowForm] = useState(false);

  const requestFn = useServerFn(requestCancellation);
  const revertFn = useServerFn(cancelClosureWorkflow);

  const requestMut = useMutation({
    mutationFn: () => requestFn({ data: { applicationId, reason: reason || undefined } }),
    onSuccess: () => {
      toast.success("Cancellation request recorded. Step 1 email sent.");
      setShowForm(false);
      setReason("");
      qc.invalidateQueries({ queryKey: ["admin.application", applicationId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to record"),
  });

  const revertMut = useMutation({
    mutationFn: () => revertFn({ data: { applicationId } }),
    onSuccess: () => {
      toast.success("Cancellation workflow reverted");
      qc.invalidateQueries({ queryKey: ["admin.application", applicationId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to revert"),
  });

  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
          Cancellation
        </div>
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
          style={{ background: `${STAGE_COLOR[stage]}1a`, color: STAGE_COLOR[stage] }}
        >
          {STAGE_LABEL[stage] ?? stage}
        </span>
      </div>

      {stage === "none" || stage === "closed" ? (
        <>
          {stage === "closed" ? (
            <div className="mt-2 text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
              This order has been closed per the cancellation workflow.
            </div>
          ) : (
            <>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 text-[12px] font-medium px-2 py-1.5 rounded border"
                  style={{ borderColor: "var(--admin-border)", color: "#DC2626" }}
                >
                  <Ban className="w-3.5 h-3.5" /> Record cancellation request
                </button>
              ) : (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Optional reason / notes…"
                    rows={3}
                    className="w-full text-[12px] p-2 rounded border bg-transparent"
                    style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
                  />
                  <div className="flex items-start gap-1.5 text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>
                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>Step 1 email sends now. Step 2 in 7 days, closure in 14 days unless reverted.</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      disabled={requestMut.isPending}
                      onClick={() => requestMut.mutate()}
                      className="flex-1 text-[12px] font-medium px-2 py-1.5 rounded text-white"
                      style={{ background: "#DC2626" }}
                    >
                      {requestMut.isPending ? "Recording…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => { setShowForm(false); setReason(""); }}
                      className="text-[12px] px-2 py-1.5 rounded border"
                      style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="mt-2 space-y-2">
          {cancellationRequestedAt && (
            <div className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
              Requested {new Date(cancellationRequestedAt).toLocaleDateString()}
            </div>
          )}
          {closureNextAt && (
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--admin-fg)" }}>
              <Clock className="w-3 h-3" />
              Next step: {new Date(closureNextAt).toLocaleDateString()}
            </div>
          )}
          <button
            disabled={revertMut.isPending}
            onClick={() => revertMut.mutate()}
            className="w-full text-[12px] font-medium px-2 py-1.5 rounded border"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          >
            {revertMut.isPending ? "Reverting…" : "Revert workflow"}
          </button>
        </div>
      )}
    </div>
  );
}
