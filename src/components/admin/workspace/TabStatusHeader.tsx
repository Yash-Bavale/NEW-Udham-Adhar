/**
 * Compact "current status + next step" strip rendered inside every workspace tab
 * so employees always know where the order stands, even after jumping tabs.
 *
 * Reads status/hint copy from `order-actions-map.ts` (single source of truth).
 */
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";
import { relativeIST } from "@/lib/datetime";
import {
  NEXT_STEP_HINT,
  STATUS_ACTION_META,
  type StatusActionKey,
} from "@/lib/orders/order-actions-map";
import type { OrderStatus } from "@/lib/orders/order-status.functions";

export function TabStatusHeader({
  applicationCode,
  orderStatus,
  stage,
  updatedAt,
  onPrimaryAction,
}: {
  applicationCode: string;
  orderStatus: OrderStatus | null;
  stage: OrderStage;
  updatedAt: string | null | undefined;
  /** Called with the recommended next-step action key. If omitted, no CTA is rendered. */
  onPrimaryAction?: (key: StatusActionKey) => void;
}) {
  const meta = STAGE_META[stage];
  const hint = orderStatus ? NEXT_STEP_HINT[orderStatus] : null;
  const primary = hint?.primary ? STATUS_ACTION_META[hint.primary] : null;

  const pillCls =
    meta.side === "exception"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : meta.tone === "emerald"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : meta.tone === "violet"
          ? "bg-violet-50 text-violet-700 ring-violet-200"
          : meta.tone === "amber"
            ? "bg-amber-50 text-amber-800 ring-amber-200"
            : "bg-sky-50 text-sky-700 ring-sky-200";

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${pillCls}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {meta.label}
      </span>

      <span className="font-mono text-xs font-bold text-slate-700">{applicationCode}</span>

      {hint && (
        <span className="text-xs text-slate-600 min-w-0 flex-1">
          <span className="text-slate-500">Next:</span>{" "}
          <span className="font-medium text-slate-800">{hint.hint}</span>
        </span>
      )}

      {updatedAt && (
        <span className="text-[11px] text-slate-400 whitespace-nowrap">
          updated {relativeIST(updatedAt)}
        </span>
      )}

      {primary && hint?.primary && onPrimaryAction && (
        <Button
          size="sm"
          onClick={() => onPrimaryAction(hint.primary!)}
          className="h-7 px-3 text-xs bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90"
        >
          {primary.label}
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </div>
  );
}
