import { Check } from "lucide-react";
import {
  JOURNEY_STAGES,
  STAGE_META,
  STAGE_BADGE_CLASS,
  type OrderStage,
} from "@/lib/crm/computeOrderStage";

interface Props {
  stage: OrderStage;
}

/**
 * Horizontal journey strip showing the 8 canonical stages.
 * Exception stages (refund/uninterested) render as a single full-width pill.
 */
export function StageJourneyStrip({ stage }: Props) {
  const meta = STAGE_META[stage];

  if (meta.side === "exception") {
    return (
      <div
        className="rounded-lg border bg-white px-5 py-4 flex items-center justify-between"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Current Stage</div>
          <div className="text-base font-semibold text-slate-900">{meta.label}</div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${STAGE_BADGE_CLASS[stage]}`}
        >
          {meta.label}
        </span>
      </div>
    );
  }

  const currentIdx = JOURNEY_STAGES.indexOf(stage);
  const effectiveIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div
      className="rounded-lg border bg-white px-5 py-4"
      style={{ borderColor: "var(--admin-border)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Current Stage</div>
          <div className="text-base font-semibold text-slate-900">{meta.label}</div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${STAGE_BADGE_CLASS[stage]}`}
        >
          Step {effectiveIdx + 1} of {JOURNEY_STAGES.length}
        </span>
      </div>

      <ol className="flex items-center gap-1 overflow-x-auto pb-1">
        {JOURNEY_STAGES.map((s, i) => {
          const m = STAGE_META[s];
          const done = i < effectiveIdx;
          const current = i === effectiveIdx;
          return (
            <li key={s} className="flex items-center gap-1 shrink-0">
              <div className="flex flex-col items-center gap-1 min-w-[68px]">
                <div
                  className={
                    "size-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold " +
                    (done
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : current
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-300 text-slate-400")
                  }
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span
                  className={
                    "text-[10px] leading-tight text-center max-w-[80px] " +
                    (current
                      ? "text-blue-700 font-semibold"
                      : done
                        ? "text-emerald-700"
                        : "text-slate-500")
                  }
                >
                  {m.short}
                </span>
              </div>
              {i < JOURNEY_STAGES.length - 1 && (
                <div
                  className={
                    "h-0.5 w-6 sm:w-10 rounded " +
                    (i < effectiveIdx ? "bg-emerald-500" : "bg-slate-200")
                  }
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
