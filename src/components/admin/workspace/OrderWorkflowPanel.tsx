import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Settings2, Ban } from "lucide-react";

import { FulfillmentStatusUpdater } from "@/components/admin/FulfillmentStatusUpdater";
import { CancellationPanel } from "@/components/admin/CancellationPanel";
import { WorkflowTimelinePanel } from "@/components/admin/WorkflowTimelinePanel";
import {
  FULFILLMENT_BADGE, FULFILLMENT_LABEL, type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";

/**
 * Unified Order Workflow panel.
 *
 * Replaces three separate stacked panels (Fulfillment Status updater,
 * Cancellation & Refund card, Workflow Timeline) with one cohesive view:
 *
 *   1. Stage header — fulfillment chip + sub-stage chip (delay / closure)
 *   2. Cancellation lifecycle — only visible once a closure workflow has
 *      actually started; the redundant "Start cancellation" CTA at rest
 *      is gone, because "Close Order" already lives in the timeline
 *      action bar.
 *   3. Workflow Timeline — primary action bar (Note, External Delay,
 *      Customer Replied, Resume, Refund, Close), scheduled reminders,
 *      and the event log.
 *   4. Manual status override — collapsed by default; opens the legacy
 *      fulfillment dropdown only when an operator explicitly needs it.
 */
export function OrderWorkflowPanel({
  applicationId,
  current,
  workflowStatus,
  closureStage,
  closureNextAt,
  cancellationRequestedAt,
  reasonCode,
  reasonText,
}: {
  applicationId: string;
  current: FulfillmentStatus;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  cancellationRequestedAt?: string | null;
  reasonCode?: string | null;
  reasonText?: string | null;
}) {
  const [showOverride, setShowOverride] = useState(false);

  const stage = (closureStage ?? "none") as string;
  const cancellationActive = stage !== "none";

  const subStageChip = useMemo(() => {
    if (cancellationActive) {
      return {
        label: "Cancellation workflow active",
        tone: "bg-rose-50 text-rose-700 border-rose-200",
      };
    }
    if (workflowStatus && workflowStatus !== "processing" && workflowStatus !== "new") {
      return {
        label: prettyStatus(workflowStatus),
        tone: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    return null;
  }, [cancellationActive, workflowStatus]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Stage header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 via-white to-rose-50/40 px-5 py-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-700">
            Order Workflow
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-semibold ${FULFILLMENT_BADGE[current]}`}>
              {FULFILLMENT_LABEL[current]}
            </span>
            {subStageChip && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${subStageChip.tone}`}>
                {subStageChip.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation lifecycle (auto-hidden when nothing in progress) */}
      {cancellationActive && (
        <div className="px-5 pt-4">
          <CancellationPanel
            applicationId={applicationId}
            closureStage={closureStage}
            closureNextAt={closureNextAt}
            cancellationRequestedAt={cancellationRequestedAt}
            reasonCode={reasonCode}
            reasonText={reasonText}
          />
        </div>
      )}

      {/* Primary action bar + reminders + timeline */}
      <div className="px-5 py-4">
        <WorkflowTimelinePanel
          applicationId={applicationId}
          workflowStatus={workflowStatus}
        />
      </div>

      {/* Manual status override (collapsed) */}
      <div className="border-t border-slate-100 bg-slate-50/60">
        <button
          type="button"
          onClick={() => setShowOverride((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3 text-left"
        >
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-slate-600">
            <Settings2 className="size-3.5" />
            Manual status override
            <span className="ml-1 normal-case tracking-normal text-slate-400 font-normal">
              (use only when the buttons above don't fit)
            </span>
          </div>
          {showOverride
            ? <ChevronDown className="size-4 text-slate-500" />
            : <ChevronRight className="size-4 text-slate-500" />}
        </button>
        {showOverride && (
          <div className="px-5 pb-5">
            <FulfillmentStatusUpdater orderId={applicationId} current={current} />
            {!cancellationActive && (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50/60 p-3 text-[11px] text-rose-800">
                <Ban className="size-3.5 mt-0.5 shrink-0" />
                <div>
                  To cancel this order, use <b>Close Order</b> in the action bar above.
                  That starts the proper 7-step refund &amp; closure workflow with
                  customer emails, instead of flipping the status directly.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function prettyStatus(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
