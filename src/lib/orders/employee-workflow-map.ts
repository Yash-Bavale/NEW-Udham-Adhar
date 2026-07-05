/**
 * Employee Workflow diagram — declarative node table.
 *
 * The diagram is a 3-tier flowchart:
 *   Tier 1: Consultation
 *   Tier 2: After Consultation — 4 lanes (Application / InfoIncomplete / OurDelay / CustomerDelay)
 *   Tier 3: Final Status
 *
 * Each node resolves to one of: past | current | future | skipped.
 * "Next" (future) nodes are click-to-advance and call the matching StatusActionKey
 * from `order-actions-map.ts`.
 */
import type { OrderStatus } from "@/lib/orders/order-status.functions";
import type { StatusActionKey } from "@/lib/orders/order-actions-map";

export type LaneKey = "root" | "A" | "B" | "C" | "D" | "final";
export type NodeState = "past" | "current" | "future" | "skipped";

export interface WorkflowNode {
  id: string;
  lane: LaneKey;
  label: string;
  sub?: string;
  /** Status action to trigger when this node is Next and clicked. */
  action?: StatusActionKey;
  /** Where the timestamp for this node lives (ts map key). */
  tsKey?: string;
}

export const LANE_TONE: Record<LaneKey, { title: string; ring: string; bg: string; text: string; accent: string }> = {
  root:  { title: "Consultation",           ring: "border-slate-200",   bg: "bg-white",      text: "text-slate-700",   accent: "bg-slate-600" },
  A:     { title: "Application Process",    ring: "border-emerald-200", bg: "bg-emerald-50/60", text: "text-emerald-800", accent: "bg-emerald-600" },
  B:     { title: "Information Incomplete", ring: "border-amber-200",   bg: "bg-amber-50/60",   text: "text-amber-800",   accent: "bg-amber-600" },
  C:     { title: "Service Delay — Our Side",      ring: "border-sky-200",     bg: "bg-sky-50/60",     text: "text-sky-800",     accent: "bg-sky-600" },
  D:     { title: "Service Delay — Customer Side", ring: "border-violet-200",  bg: "bg-violet-50/60",  text: "text-violet-800",  accent: "bg-violet-600" },
  final: { title: "Final Status",           ring: "border-slate-200",   bg: "bg-slate-50",      text: "text-slate-700",   accent: "bg-slate-600" },
};

// Tier 1 — Consultation
export const CONSULTATION_NODE: WorkflowNode = {
  id: "consultation",
  lane: "root",
  label: "Initial Customer Interaction",
  sub: "Consultation call · Service selection",
  action: "send_form_link",
  tsKey: "consultation_done",
};

// Tier 2 — Lane heads (After Consultation branch selectors)
export const LANE_HEADS: WorkflowNode[] = [
  { id: "head_A", lane: "A", label: "Application Submitted",      action: "start_processing",  tsKey: "start_processing" },
  { id: "head_B", lane: "B", label: "Information Incomplete",     action: "send_form_link",    tsKey: "waiting_customer_info" },
  { id: "head_C", lane: "C", label: "Service Delay — Our Side",   action: "our_delay",         tsKey: "our_side_delay" },
  { id: "head_D", lane: "D", label: "Service Delay — Customer Side", action: "customer_delay", tsKey: "customer_hold" },
];

// Tier 2 — Lane bodies (rendered in vertical columns under each lane head)
export const LANE_BODIES: Record<Exclude<LaneKey, "root" | "final">, WorkflowNode[]> = {
  A: [
    { id: "A.pending",       lane: "A", label: "Pending Government Portal", action: "submitted_to_govt", tsKey: "in_processing" },
    { id: "A.followup",      lane: "A", label: "Schedule Follow-up",         action: "manual_reminder" },
    { id: "A.govt_response", lane: "A", label: "Government Response Received", action: "certificate_issued", tsKey: "submitted_to_govt" },
  ],
  B: [
    { id: "B.reminder",  lane: "B", label: "Reminder Sent",              sub: "Email · WhatsApp", action: "manual_reminder" },
    { id: "B.submitted", lane: "B", label: "Customer Submitted Info",    action: "start_processing", tsKey: "info_received" },
    { id: "B.app_subm",  lane: "B", label: "Application Submitted",      action: "submitted_to_govt", tsKey: "in_processing" },
  ],
  C: [
    { id: "C.delay",     lane: "C", label: "Delay Logged",               action: "our_delay",       tsKey: "our_side_delay" },
    { id: "C.followup",  lane: "C", label: "Schedule Follow-up",         action: "manual_reminder" },
    { id: "C.continue",  lane: "C", label: "Continue Processing",        action: "start_processing" },
    { id: "C.app_subm",  lane: "C", label: "Application Submitted",      action: "submitted_to_govt", tsKey: "in_processing" },
  ],
  D: [
    { id: "D.delay",     lane: "D", label: "Reminder Sent",              action: "manual_reminder",  tsKey: "customer_hold" },
    { id: "D.responded", lane: "D", label: "Customer Responded",         action: "start_processing" },
    { id: "D.continue",  lane: "D", label: "Continue Processing",        action: "start_processing" },
    { id: "D.app_subm",  lane: "D", label: "Application Submitted",      action: "submitted_to_govt", tsKey: "in_processing" },
  ],
};

// Tier 3 — Final Status
export const FINAL_NODES: WorkflowNode[] = [
  { id: "final.completed",   lane: "final", label: "Order Completed", tsKey: "completed" },
  { id: "final.rejected",    lane: "final", label: "Rejected" },
  { id: "final.auto_closed", lane: "final", label: "Auto Closed" },
];

// ─────────────────────────── State resolution ───────────────────────────

/** Which lane the order is currently traveling through. */
export function resolveActiveLane(
  status: OrderStatus | null,
  history: OrderStatus[],
): LaneKey {
  // Prefer explicit lane-defining statuses in recent history.
  const recent = [status, ...history.slice().reverse()].filter(Boolean) as OrderStatus[];
  for (const s of recent) {
    if (s === "WAITING_CUSTOMER_INFO") return "B";
    if (s === "OUR_SIDE_DELAY") return "C";
    if (s === "CUSTOMER_HOLD") return "D";
    if (
      s === "INFO_RECEIVED" || s === "IN_PROCESSING" ||
      s === "SUBMITTED_TO_GOVT" || s === "CERTIFICATE_ISSUED"
    ) return "A";
  }
  return "A"; // default happy path
}

/** Status → progress index within a lane (0 = head, higher = deeper). */
function laneProgress(lane: LaneKey, status: OrderStatus | null): number {
  if (!status) return -1;
  if (status === "COMPLETED" || status === "CLOSED" || status === "REFUND_PROCESSED") return 99;
  const lookup: Partial<Record<OrderStatus, number>> = (() => {
    switch (lane) {
      case "A":
        return {
          INFO_RECEIVED: 0, IN_PROCESSING: 1,
          SUBMITTED_TO_GOVT: 3, CERTIFICATE_ISSUED: 4,
          HIGH_PRIORITY: 1, OUR_SIDE_DELAY: 1,
        };
      case "B":
        return {
          WAITING_CUSTOMER_INFO: 0, CUSTOMER_HOLD: 0,
          INFO_RECEIVED: 1, IN_PROCESSING: 2,
          SUBMITTED_TO_GOVT: 3, CERTIFICATE_ISSUED: 4,
        };
      case "C":
        return {
          OUR_SIDE_DELAY: 0,
          IN_PROCESSING: 2, SUBMITTED_TO_GOVT: 3, CERTIFICATE_ISSUED: 4,
        };
      case "D":
        return {
          CUSTOMER_HOLD: 0,
          INFO_RECEIVED: 1, IN_PROCESSING: 2,
          SUBMITTED_TO_GOVT: 3, CERTIFICATE_ISSUED: 4,
        };
      default:
        return {};
    }
  })();
  return lookup[status] ?? -1;
}

export interface ResolvedDiagram {
  activeLane: LaneKey;
  nodeState: Record<string, NodeState>;
  finalState: "completed" | "rejected" | "auto_closed" | null;
}

export function resolveDiagram({
  status,
  history,
  closureReasonCode,
  timestamps,
}: {
  status: OrderStatus | null;
  history: OrderStatus[];
  closureReasonCode?: string | null;
  timestamps: Record<string, string | null | undefined>;
}): ResolvedDiagram {
  const activeLane = resolveActiveLane(status, history);
  const state: Record<string, NodeState> = {};

  // Consultation node
  state[CONSULTATION_NODE.id] = status ? "past" : "current";

  // Lane heads
  for (const h of LANE_HEADS) {
    if (h.lane === activeLane) {
      state[h.id] = laneProgress(activeLane, status) >= 0 ? "past" : "current";
    } else {
      // Non-active lane heads: past if we ever passed through, else future/skipped
      state[h.id] = history.some((s) => resolveActiveLane(s, []) === h.lane) ? "past" : "future";
    }
  }

  // Lane body — active lane gets progress-based state; others muted (skipped)
  for (const laneKey of ["A", "B", "C", "D"] as const) {
    const body = LANE_BODIES[laneKey];
    if (laneKey !== activeLane) {
      body.forEach((n) => (state[n.id] = "skipped"));
      continue;
    }
    const progress = laneProgress(laneKey, status);
    body.forEach((n, i) => {
      if (progress < 0) state[n.id] = "future";
      else if (i < progress) state[n.id] = "past";
      else if (i === progress) state[n.id] = "current";
      else state[n.id] = "future";
    });
  }

  // Final row
  let finalState: ResolvedDiagram["finalState"] = null;
  if (status === "COMPLETED") finalState = "completed";
  else if (status === "CLOSED") {
    const code = (closureReasonCode ?? "").toLowerCase();
    finalState = /no[_ ]?response|auto/.test(code) ? "auto_closed" : "rejected";
  }
  for (const n of FINAL_NODES) {
    const key = n.id.split(".")[1] as "completed" | "rejected" | "auto_closed";
    state[n.id] = finalState === key ? "current" : "future";
  }

  return { activeLane, nodeState: state, finalState };
}
