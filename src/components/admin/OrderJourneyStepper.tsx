import { Check } from "lucide-react";
import {
  FULFILLMENT_LABEL, FULFILLMENT_STAGES,
  stageIndex, type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";

type StageMeta = Record<string, { at: string; staff_name: string | null }>;

export function OrderJourneyStepper({
  current, stages, stageMeta,
}: {
  current: FulfillmentStatus;
  stages?: string[];
  stageMeta: StageMeta;
}) {
  const list = (stages && stages.length ? stages : FULFILLMENT_STAGES) as string[];
  const currentIdx = list.includes(current) ? list.indexOf(current) : stageIndex(current);

  return (
    <div className="rounded-lg border bg-white p-5" style={{ borderColor: "var(--admin-border)" }}>
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Order Journey</h3>
      <ol className="flex items-start gap-2 overflow-x-auto pb-2">
        {list.map((s, i) => {
          const completed = i < currentIdx || (i === currentIdx && current === "completed");
          const isCurrent = i === currentIdx && current !== "completed" && current !== "cancelled";
          const pending = i > currentIdx;
          const meta = stageMeta[s];
          const label = (FULFILLMENT_LABEL as any)[s] ?? s.replace(/_/g, " ");

          return (
            <li key={s} className="flex-1 min-w-[140px] flex flex-col items-center text-center relative">
              {i > 0 && (
                <div
                  className={`absolute top-4 right-1/2 w-full h-0.5 ${
                    completed || isCurrent ? "bg-[#1e3a5f]" : "bg-slate-200"
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                    completed && "bg-[#1e3a5f] border-[#1e3a5f] text-white",
                    isCurrent && "bg-amber-500 border-amber-500 text-white animate-pulse",
                    pending && "bg-white border-slate-300 text-slate-400",
                  ].filter(Boolean).join(" ")}
                >
                  {completed ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
              </div>
              <div className="mt-2 px-1">
                <div className={`text-xs font-medium ${pending ? "text-slate-400" : "text-slate-800"}`}>{label}</div>
                {meta?.at && (
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(meta.at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true })}
                  </div>
                )}
                {meta?.staff_name && (
                  <div className="text-[10px] text-slate-500 italic">by {meta.staff_name}</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
