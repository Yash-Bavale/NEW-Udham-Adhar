// Pure config + helpers for the CustomerJourneyMap flowchart.
// No React, no side effects — safe to import from unit tests.
//
// Coordinate system uses a fixed 1240×620 viewBox. Consumers scale the
// whole canvas via CSS transform to fit their container.

import type { ButtonCode, JourneyPhase } from "@/lib/orders/journey-map";

/* ─── Canvas constants ─── */

export const NODE_W = 120;
export const NODE_H = 52;
export const CANVAS_W = 1240;
export const CANVAS_H = 620;

/* ─── Types ─── */

export type NodeKind = "stage" | "action" | "terminal" | "sub";
export type Tone = "slate" | "amber" | "rose" | "sky" | "violet" | "emerald" | "indigo";
export type IconKey =
  | "inbox" | "fileText" | "fileCheck" | "landmark" | "search" | "flag"
  | "wrench" | "rotate" | "mailWarn" | "userX" | "send" | "clock"
  | "clipboard" | "upload" | "xCircle" | "lifeBuoy";

export interface NodeDef {
  id: string;
  x: number; y: number;
  label: string;
  icon: IconKey;
  kind: NodeKind;
  tone: Tone;
  buttonCode?: ButtonCode;
  emailCode?: string;
  subtitle?: string;
}

export type Side = "L" | "R" | "T" | "B";
export type EdgeMode = "S" | "HV" | "VH" | "HVH" | "VHV";

export type BranchKey =
  | "main-1" | "main-2" | "main-3" | "main-4" | "main-5"
  | "form-nag" | "customer-delay" | "technical" | "shortcut"
  | "awaiting" | "status" | "accept" | "reject" | "ticket";

export interface EdgeDef {
  id: string;
  from: string; fromSide: Side;
  to: string;   toSide: Side;
  mode: EdgeMode;
  branch: BranchKey;
  waypoints?: Array<{ x: number; y: number }>;
}

export type EdgeState = "done" | "active" | "closed" | "idle";
export type NodeState = "done" | "active" | "terminal-ok" | "terminal-bad" | "idle";

/* ─── Nodes (compact 1240×620 grid) ─── */

export const NODES: NodeDef[] = [
  // Main happy path (y=200)
  { id: "order_recv",   x:  20, y: 200, label: "Order Received",     icon: "inbox",     kind: "stage",    tone: "indigo" },
  { id: "form_not",     x: 160, y: 200, label: "Form Not Submitted", icon: "fileText",  kind: "stage",    tone: "amber" },
  { id: "form_sub",     x: 300, y: 200, label: "Form Submitted",     icon: "fileCheck", kind: "stage",    tone: "indigo" },
  { id: "govt_portal",  x: 680, y: 200, label: "App Submitted Govt", icon: "landmark",  kind: "stage",    tone: "indigo" },
  { id: "check_status", x: 870, y: 200, label: "Check Final Status", icon: "search",    kind: "stage",    tone: "indigo" },
  { id: "completed",    x:1100, y: 200, label: "Order Completed",    icon: "flag",      kind: "terminal", tone: "emerald" },

  // Technical loop (y=70)
  { id: "b02_tech",     x: 420, y:  70, label: "Technical Delay",    icon: "wrench",    kind: "action", tone: "sky",     buttonCode: "B02", emailCode: "E003", subtitle: "Select reason" },
  { id: "b03_fix",      x: 560, y:  70, label: "Delay Resolved",     icon: "rotate",    kind: "action", tone: "emerald", buttonCode: "B03", emailCode: "E011", subtitle: "Resume order" },

  // Form-not / customer-delay branches (y=340)
  { id: "b01_reminder", x: 160, y: 340, label: "Send Form Reminder", icon: "mailWarn",  kind: "action", tone: "amber", buttonCode: "B01", emailCode: "E002", subtitle: "Auto-close 8h" },
  { id: "b10_cust",     x: 300, y: 340, label: "Customer Delay",     icon: "userX",     kind: "action", tone: "amber", buttonCode: "B10", emailCode: "E004", subtitle: "Cat A reason" },

  // Govt branch (y=340)
  { id: "b04_consult",  x: 680, y: 340, label: "Consultation Done",  icon: "send",      kind: "action", tone: "emerald", buttonCode: "B04", emailCode: "E005", subtitle: "→ Completed" },
  { id: "b05_wait",     x: 820, y: 340, label: "Awaiting Approval",  icon: "clock",     kind: "action", tone: "violet",  buttonCode: "B05", emailCode: "E006", subtitle: "+ reminder" },

  // Status branch (y=340)
  { id: "b06_remind",   x: 960, y: 340, label: "Status Checked",     icon: "clipboard", kind: "action", tone: "sky",     buttonCode: "B06", emailCode: "E006", subtitle: "Add reminder" },
  { id: "b07_after",    x:1100, y: 340, label: "Done (After Wait)",  icon: "send",      kind: "action", tone: "emerald", buttonCode: "B07", emailCode: "E005", subtitle: "Post-wait submit" },

  // Final outcome (y=470)
  { id: "b08_accept",   x: 830, y: 470, label: "Accepted + PDF",     icon: "upload",    kind: "action",   tone: "emerald", buttonCode: "B08", emailCode: "E007", subtitle: "Upload cert" },
  { id: "b09_reject",   x: 970, y: 470, label: "Rejected",           icon: "xCircle",   kind: "action",   tone: "rose",    buttonCode: "B09", emailCode: "E008", subtitle: "Cat B reason" },
  { id: "closed_e010",  x:1110, y: 470, label: "Order Closed",       icon: "xCircle",   kind: "terminal", tone: "rose" },

  // Ticket sub-lane (y=540)
  { id: "ticket_lane",  x:  20, y: 540, label: "Support Ticket",     icon: "lifeBuoy",  kind: "sub",      tone: "violet" },
];

export const nodeById: Record<string, NodeDef> = Object.fromEntries(NODES.map((n) => [n.id, n]));

/* ─── Edges ─── */

export const EDGES: EdgeDef[] = [
  // Main happy path
  { id: "e_or_fn",  from: "order_recv",   fromSide: "R", to: "form_not",     toSide: "L", mode: "S",  branch: "main-1" },
  { id: "e_fn_fs",  from: "form_not",     fromSide: "R", to: "form_sub",     toSide: "L", mode: "S",  branch: "main-2" },
  { id: "e_fs_gv",  from: "form_sub",     fromSide: "R", to: "govt_portal",  toSide: "L", mode: "S",  branch: "main-3" },
  { id: "e_gv_ck",  from: "govt_portal",  fromSide: "R", to: "check_status", toSide: "L", mode: "S",  branch: "main-4" },
  { id: "e_ck_cp",  from: "check_status", fromSide: "R", to: "completed",    toSide: "L", mode: "S",  branch: "main-5" },

  // Technical loop
  { id: "e_fs_b02", from: "form_sub",     fromSide: "T", to: "b02_tech",     toSide: "L", mode: "VH", branch: "technical" },
  { id: "e_b02_b03",from: "b02_tech",     fromSide: "R", to: "b03_fix",      toSide: "L", mode: "S",  branch: "technical" },
  { id: "e_b03_gv", from: "b03_fix",      fromSide: "R", to: "govt_portal",  toSide: "T", mode: "HV", branch: "technical" },

  // Form-not-submitted branch
  { id: "e_fn_b01", from: "form_not",     fromSide: "B", to: "b01_reminder", toSide: "T", mode: "S",  branch: "form-nag" },
  { id: "e_b01_cl", from: "b01_reminder", fromSide: "B", to: "closed_e010",  toSide: "L", mode: "VHV",
    branch: "form-nag", waypoints: [{ x: 220, y: 580 }, { x: 1110, y: 580 }] },

  // Customer-delay branch
  { id: "e_fs_b10", from: "form_sub",     fromSide: "B", to: "b10_cust",     toSide: "T", mode: "S",  branch: "customer-delay" },
  { id: "e_b10_cl", from: "b10_cust",     fromSide: "B", to: "closed_e010",  toSide: "L", mode: "VHV",
    branch: "customer-delay", waypoints: [{ x: 360, y: 560 }, { x: 1110, y: 560 }] },

  // Consultation-done shortcut
  { id: "e_gv_b04", from: "govt_portal",  fromSide: "B", to: "b04_consult",  toSide: "T", mode: "S",  branch: "shortcut" },
  { id: "e_b04_cp", from: "b04_consult",  fromSide: "R", to: "completed",    toSide: "B", mode: "HV", branch: "shortcut" },

  // Awaiting → Accept
  { id: "e_gv_b05", from: "govt_portal",  fromSide: "R", to: "b05_wait",     toSide: "T", mode: "HV", branch: "awaiting" },
  { id: "e_b05_b8", from: "b05_wait",     fromSide: "B", to: "b08_accept",   toSide: "T", mode: "VH", branch: "awaiting" },

  // Status branch
  { id: "e_ck_b06", from: "check_status", fromSide: "B", to: "b06_remind",   toSide: "T", mode: "HV", branch: "status" },
  { id: "e_ck_b07", from: "check_status", fromSide: "B", to: "b07_after",    toSide: "T", mode: "HV", branch: "status" },
  { id: "e_b07_cp", from: "b07_after",    fromSide: "T", to: "completed",    toSide: "B", mode: "S",  branch: "status" },

  // Accept path
  { id: "e_b06_b8", from: "b06_remind",   fromSide: "B", to: "b08_accept",   toSide: "T", mode: "VH", branch: "accept" },
  { id: "e_b08_cp", from: "b08_accept",   fromSide: "T", to: "completed",    toSide: "B", mode: "VHV",
    branch: "accept", waypoints: [{ x: 890, y: 445 }, { x: 1160, y: 445 }] },

  // Reject
  { id: "e_ck_b09", from: "check_status", fromSide: "B", to: "b09_reject",   toSide: "T", mode: "VHV",
    branch: "reject", waypoints: [{ x: 930, y: 420 }, { x: 1030, y: 420 }] },
  { id: "e_b09_cl", from: "b09_reject",   fromSide: "R", to: "closed_e010",  toSide: "L", mode: "S",  branch: "reject" },

  // Ticket sub-lane
  { id: "e_tk_fs",  from: "ticket_lane",  fromSide: "R", to: "form_sub",     toSide: "B", mode: "HV", branch: "ticket" },
];

/* ─── Geometry helpers ─── */

export function anchor(n: NodeDef, side: Side): { x: number; y: number } {
  switch (side) {
    case "L": return { x: n.x,              y: n.y + NODE_H / 2 };
    case "R": return { x: n.x + NODE_W,     y: n.y + NODE_H / 2 };
    case "T": return { x: n.x + NODE_W / 2, y: n.y };
    case "B": return { x: n.x + NODE_W / 2, y: n.y + NODE_H };
  }
}

export function pathD(
  a: { x: number; y: number },
  b: { x: number; y: number },
  mode: EdgeMode,
  waypoints?: Array<{ x: number; y: number }>,
): string {
  if (waypoints && waypoints.length) {
    const pts = [a, ...waypoints, b];
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }
  switch (mode) {
    case "S":   return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    case "HV":  return `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`;
    case "VH":  return `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`;
    case "HVH": { const mx = (a.x + b.x) / 2; return `M ${a.x} ${a.y} L ${mx} ${a.y} L ${mx} ${b.y} L ${b.x} ${b.y}`; }
    case "VHV": { const my = (a.y + b.y) / 2; return `M ${a.x} ${a.y} L ${a.x} ${my} L ${b.x} ${my} L ${b.x} ${b.y}`; }
  }
}

/* ─── Highlight rules ─── */

/**
 * Exactly which sub-branches are "live" for the given phase + terminal.
 * Deterministic — pure function over inputs.
 */
export function activeBranchesFor(
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
  reasonCode: string | null,
  workflowStatus?: string | null,
): Set<BranchKey> {
  const s = new Set<BranchKey>();
  switch (phase) {
    case "form_not_submitted": s.add("form-nag"); break;
    case "form_submitted":     break;
    case "technical_delay":    s.add("technical"); break;
    case "customer_delay":     s.add("customer-delay"); break;
    case "consultation_done":  s.add("shortcut"); break;
    case "awaiting_govt":      s.add("awaiting"); break;
    case "status_checked":     s.add("status"); break;
    case "post_wait_submitted":s.add("status"); s.add("accept"); break;
    case "completed":          s.add("accept"); break;
    case "closed":
      if (reasonCode?.toUpperCase().startsWith("B")) s.add("reject");
      else if (/customer|external_dependency/i.test(workflowStatus ?? "")) s.add("customer-delay");
      else s.add("form-nag");
      break;
  }
  if (terminal === "completed") s.add("accept");
  return s;
}

/**
 * Set of main-path edges considered "done" (already traversed) given the
 * current stage index. Stage indices: 0 lead, 1 payment, 2 order,
 * 3 form_submitted, 4 govt_portal, 5 check_status, 6 completed.
 */
export function mainDoneEdgesFor(currentIdx: number, phase: JourneyPhase): Set<string> {
  const s = new Set<string>();
  // Freeze main progression when the order is holding on a sub-branch.
  const holding = phase === "technical_delay" || phase === "customer_delay" || phase === "form_not_submitted";
  const idx = holding && phase === "form_not_submitted" ? 2  // stop at form_not
            : holding ? 3                                     // stop at form_sub
            : currentIdx;

  if (idx >= 3) { s.add("e_or_fn"); s.add("e_fn_fs"); }
  else if (idx >= 2) { s.add("e_or_fn"); }
  if (idx >= 4) s.add("e_fs_gv");
  if (idx >= 5) s.add("e_gv_ck");
  if (idx >= 6) s.add("e_ck_cp");
  return s;
}

/**
 * The main-path edge that the customer is currently traversing (the "in
 * progress" arrow from the current stage to the next). Returns null when
 * terminal or when a sub-branch is holding progress — in those cases the
 * branch itself or the terminal node carries the highlight.
 */
export function currentMainEdgeFor(
  currentIdx: number,
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
): string | null {
  if (terminal) return null;
  if (phase === "form_not_submitted" || phase === "technical_delay" || phase === "customer_delay") return null;
  if (currentIdx <= 2) return "e_or_fn";
  if (currentIdx === 3) return "e_fs_gv";
  if (currentIdx === 4) return "e_gv_ck";
  if (currentIdx === 5) return "e_ck_cp";
  return null;
}

/**
 * The stage node that represents "where the customer is right now" so the
 * operator can see it at a glance even when no sub-branch is active.
 */
export function currentStageNodeFor(
  currentIdx: number,
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
): string | null {
  if (terminal === "completed") return "completed";
  if (terminal === "closed") return "closed_e010";
  if (phase === "form_not_submitted") return "form_not";
  if (currentIdx <= 2) return "order_recv";
  if (currentIdx === 3) return "form_sub";
  if (currentIdx === 4) return "govt_portal";
  if (currentIdx === 5) return "check_status";
  if (currentIdx >= 6) return "completed";
  return null;
}

export interface EdgeStateInput {
  activeBranches: Set<BranchKey>;
  doneMainEdges: Set<string>;
  terminal: "completed" | "closed" | null;
  currentMainEdge?: string | null;
}

export function edgeState(e: EdgeDef, i: EdgeStateInput): EdgeState {
  if (i.doneMainEdges.has(e.id)) return "done";
  if (i.currentMainEdge && e.id === i.currentMainEdge) return "active";
  if (i.activeBranches.has(e.branch)) {
    if (i.terminal === "closed" &&
        (e.branch === "form-nag" || e.branch === "customer-delay" || e.branch === "reject")) {
      return "closed";
    }
    if (i.terminal === "completed" && (e.branch === "accept" || e.branch === "shortcut" || e.branch === "status")) {
      return "done";
    }
    return "active";
  }
  return "idle";
}

export interface NodeStateInput {
  currentIdx: number;
  activeBranches: Set<BranchKey>;
  terminal: "completed" | "closed" | null;
  phase: JourneyPhase;
  currentStageNode?: string | null;
}

/** Stage nodes map to a JOURNEY_STAGES index for done detection. */
const STAGE_IDX: Record<string, number> = {
  order_recv:   2,
  form_not:     3,
  form_sub:     3,
  govt_portal:  4,
  check_status: 5,
  completed:    6,
};

export function nodeState(nodeId: string, i: NodeStateInput): NodeState {
  if (nodeId === "completed" && i.terminal === "completed") return "terminal-ok";
  if (nodeId === "closed_e010" && i.terminal === "closed")  return "terminal-bad";

  // Current stage node — operator's "you are here"
  if (i.currentStageNode && nodeId === i.currentStageNode && !i.terminal) return "active";

  // Any node incident to an active branch is "active"
  const incident = EDGES.some(
    (e) => (e.from === nodeId || e.to === nodeId) && i.activeBranches.has(e.branch),
  );
  if (incident) return "active";

  // Stage progression
  const stageIdx = STAGE_IDX[nodeId];
  if (stageIdx !== undefined && i.currentIdx > stageIdx) return "done";

  return "idle";
}
