/**
 * Employee Workflow diagram — a single command surface that shows:
 *   • the past path the order has traveled (green ticks + timestamps)
 *   • the current stage (pulsing accent)
 *   • the next possible actions (clickable buttons that open the matching dialog)
 *
 * Data model lives in `src/lib/orders/employee-workflow-map.ts`.
 */
import { ArrowRight, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONSULTATION_NODE,
  FINAL_NODES,
  LANE_BODIES,
  LANE_HEADS,
  LANE_TONE,
  resolveDiagram,
  type LaneKey,
  type NodeState,
  type WorkflowNode,
} from "@/lib/orders/employee-workflow-map";
import type { StatusActionKey } from "@/lib/orders/order-actions-map";
import type { OrderStatus } from "@/lib/orders/order-status.functions";
import { formatIST } from "@/lib/datetime";

export interface EmployeeWorkflowMapProps {
  orderStatus: OrderStatus | null;
  history: OrderStatus[];
  closureReasonCode?: string | null;
  timestamps: Record<string, string | null | undefined>;
  onAction: (key: StatusActionKey) => void;
}

export function EmployeeWorkflowMap({
  orderStatus, history, closureReasonCode, timestamps, onAction,
}: EmployeeWorkflowMapProps) {
  const { activeLane, nodeState } = resolveDiagram({
    status: orderStatus, history, closureReasonCode, timestamps,
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.24em] font-bold text-indigo-700">Employee Workflow</div>
        <div className="text-[11px] text-slate-500 mt-0.5">Past · Current · Next — one click to advance</div>
      </div>

      {/* Tier 1 — Consultation */}
      <TierRow index={1} title="Consultation" subtitle="Initial customer interaction">
        <div className="flex-1 flex justify-start">
          <NodeCard
            node={CONSULTATION_NODE}
            state={nodeState[CONSULTATION_NODE.id]}
            timestamp={timestamps[CONSULTATION_NODE.tsKey ?? ""]}
            onAction={onAction}
          />
        </div>
      </TierRow>

      {/* Tier 2 — After Consultation lane heads */}
      <TierRow index={2} title="After Consultation" subtitle="Choose the next appropriate action">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
          {LANE_HEADS.map((h) => (
            <NodeCard
              key={h.id}
              node={h}
              state={nodeState[h.id]}
              timestamp={timestamps[h.tsKey ?? ""]}
              onAction={onAction}
            />
          ))}
        </div>
      </TierRow>

      {/* Tier 2 body — lane columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {(["A", "B", "C", "D"] as const).map((laneKey) => {
          const tone = LANE_TONE[laneKey];
          const nodes = LANE_BODIES[laneKey];
          const isActive = activeLane === laneKey;
          return (
            <div
              key={laneKey}
              className={`rounded-xl border ${tone.ring} ${tone.bg} p-3 space-y-2 transition ${isActive ? "shadow-sm" : "opacity-60"}`}
            >
              <div className={`text-[10px] uppercase tracking-[0.14em] font-bold ${tone.text} text-center pb-1 border-b border-current/10`}>
                {String.fromCharCode(64 + "ABCD".indexOf(laneKey) + 1)}. {tone.title.replace(/^Service Delay — /, "Delay — ")}
              </div>
              <div className="space-y-1.5">
                {nodes.map((n, i) => (
                  <div key={n.id}>
                    <NodeCard
                      node={n}
                      state={nodeState[n.id]}
                      timestamp={timestamps[n.tsKey ?? ""]}
                      onAction={onAction}
                      compact
                    />
                    {i < nodes.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <div className={`w-px h-3 ${nodeState[n.id] === "past" ? "bg-emerald-400" : "bg-slate-300"}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier 3 — Final Status */}
      <TierRow index={3} title="Final Status" subtitle="Complete or close the order">
        <div className="flex-1 grid grid-cols-3 gap-3">
          {FINAL_NODES.map((n) => (
            <NodeCard
              key={n.id}
              node={n}
              state={nodeState[n.id]}
              timestamp={timestamps[n.tsKey ?? ""]}
              onAction={onAction}
            />
          ))}
        </div>
      </TierRow>
    </div>
  );
}

// ─────────────────────────── Sub-components ───────────────────────────

function TierRow({
  index, title, subtitle, children,
}: {
  index: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-4 items-start">
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <div className="text-[10px] font-bold text-indigo-600">{index}. STAGE</div>
        <div className="text-sm font-bold text-slate-800 mt-0.5">{title}</div>
        <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{subtitle}</div>
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}

function NodeCard({
  node, state, timestamp, onAction, compact = false,
}: {
  node: WorkflowNode;
  state: NodeState | undefined;
  timestamp: string | null | undefined;
  onAction: (key: StatusActionKey) => void;
  compact?: boolean;
}) {
  const tone = LANE_TONE[node.lane as LaneKey];
  const s = state ?? "future";
  const clickable = s === "future" && !!node.action;

  const base = "rounded-lg border transition text-left w-full flex items-start gap-2";
  const size = compact ? "px-2.5 py-1.5" : "px-3 py-2";

  const stateCls =
    s === "past"    ? `${tone.ring} ${tone.bg} ${tone.text}` :
    s === "current" ? `border-indigo-400 bg-indigo-50 text-indigo-900 shadow-md ring-2 ring-indigo-200 relative` :
    s === "skipped" ? "border-dashed border-slate-200 bg-slate-50/40 text-slate-400" :
    /* future */      clickable
      ? "border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/40 cursor-pointer"
      : "border-dashed border-slate-200 bg-white text-slate-400";

  const Icon =
    s === "past"    ? Check :
    s === "current" ? Circle :
    ArrowRight;

  const iconCls =
    s === "past"    ? "text-emerald-600" :
    s === "current" ? "text-indigo-600 animate-pulse fill-indigo-600" :
    s === "skipped" ? "text-slate-300" :
                      "text-slate-400";

  const content = (
    <>
      <Icon className={`size-3.5 mt-0.5 shrink-0 ${iconCls}`} strokeWidth={s === "past" ? 3 : 2} />
      <div className="min-w-0 flex-1">
        <div className={`text-[12px] leading-tight font-semibold`}>{node.label}</div>
        {node.sub && !compact && (
          <div className="text-[10px] text-slate-500 mt-0.5">{node.sub}</div>
        )}
        {s === "past" && timestamp && (
          <div className="text-[9px] text-slate-500 mt-0.5 font-mono">{formatIST(timestamp)}</div>
        )}
        {s === "current" && (
          <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700">
            Current
          </span>
        )}
        {s === "future" && clickable && (
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5 inline-flex items-center gap-0.5">
            Take action <ArrowRight className="size-2.5" />
          </div>
        )}
      </div>
    </>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={() => onAction(node.action!)}
        className={`${base} ${size} ${stateCls}`}
      >
        {content}
      </button>
    );
  }
  return <div className={`${base} ${size} ${stateCls}`}>{content}</div>;
}

// Re-export the trigger button pattern so consumers can reuse it if needed.
export { Button as WorkflowActionButton };
