// Pure config + helpers for the CustomerJourneyMap flowchart.
// Layout mirrors the operations reference diagram: Form Not Submitted → …
// → Check Final Application Status, with B01…B10 action buttons + E010 close.

import type { ButtonCode, JourneyPhase } from "@/lib/orders/journey-map";

/* ─── Canvas constants ─── */
export const NODE_W = 130; // default; individual nodes may override via .w
export const NODE_H = 54;  // default; individual nodes may override via .h
export const CANVAS_W = 1720;
export const CANVAS_H = 680;

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
  w?: number; h?: number;
  label: string;
  icon: IconKey;
  kind: NodeKind;
  tone: Tone;
  buttonCode?: ButtonCode;
  emailCode?: string;
  subtitle?: string;
  tag?: string; // extra label tag (e.g. "E010")
}

export type Side = "L" | "R" | "T" | "B";
export type EdgeMode = "S" | "HV" | "VH" | "HVH" | "VHV";

export type BranchKey =
  | "main-2" | "main-3" | "main-4"
  | "form-nag" | "customer-delay" | "technical" | "shortcut"
  | "awaiting" | "status" | "accept" | "reject";

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

/* ─── Node dimension helpers ─── */
export const nodeW = (n: NodeDef) => n.w ?? NODE_W;
export const nodeH = (n: NodeDef) => n.h ?? NODE_H;

/* ─── Nodes (layout matches reference diagram) ─── */
export const NODES: NodeDef[] = [
  /* Row 1 — main path (top row) */
  { id: "form_not",     x:  30, y: 140, w: 150, h: 56,  label: "Form Not Submitted",             icon: "fileText",  kind: "stage",    tone: "slate" },
  { id: "form_sub",     x: 240, y: 140, w: 140, h: 56,  label: "Form Submitted",                 icon: "fileCheck", kind: "stage",    tone: "slate" },
  { id: "b02_tech",     x: 430, y:  70, w: 100, h: 150, label: "Technical Delay",                icon: "wrench",    kind: "action",   tone: "slate",   buttonCode: "B02", emailCode: "E003", subtitle: "Select Reason · Add reminder" },
  { id: "b03_fix",      x: 550, y:  70, w: 100, h: 150, label: "Technical Delay",                icon: "rotate",    kind: "action",   tone: "slate",   buttonCode: "B03", emailCode: "E011", subtitle: "Issue Resolved" },
  { id: "govt_portal",  x: 700, y: 120, w: 300, h: 62,  label: "Application Submitted to Govt Portal", icon: "landmark", kind: "stage", tone: "slate" },
  { id: "check_status", x:1050, y: 120, w: 480, h: 62,  label: "Check Final Application Status on Govt Portal", icon: "search", kind: "stage", tone: "slate" },

  /* Row 2 — sub-branches under govt / check */
  { id: "b04_consult",  x: 700, y: 235, w: 140, h: 160, label: "Consultation Completed Application Submitted to Govt Portal", icon: "send",  kind: "action", tone: "emerald", buttonCode: "B04", emailCode: "E005", subtitle: "Order Completed" },
  { id: "b05_wait",     x: 855, y: 235, w: 140, h: 160, label: "Application Submitted Waiting for Govt. Approval", icon: "clock", kind: "action", tone: "slate", buttonCode: "B05", emailCode: "E006", subtitle: "Add reminder" },
  { id: "b06_remind",   x: 1050, y: 235, w: 140, h: 160, label: "Application Status Checked – Awaiting Government Response", icon: "clipboard", kind: "action", tone: "slate", buttonCode: "B06", emailCode: "E006", subtitle: "Add reminder" },
  { id: "b07_after",    x: 1200, y: 235, w: 140, h: 160, label: "Consultation Completed Application Submitted to Govt Portal (After Waiting)", icon: "send", kind: "action", tone: "emerald", buttonCode: "B07", emailCode: "E005", subtitle: "Order Completed" },
  { id: "b08_accept",   x: 1350, y: 235, w: 140, h: 160, label: "Application Accepted Upload PDF Add Note", icon: "upload", kind: "action", tone: "emerald", buttonCode: "B08", emailCode: "E007", subtitle: "Order Completed" },
  { id: "b09_reject",   x: 1500, y: 235, w: 140, h: 160, label: "Application Rejected Select Reason Add Note", icon: "xCircle", kind: "action", tone: "emerald", buttonCode: "B09", emailCode: "E008", subtitle: "Order Closed" },

  /* Row 3 — B01 (form-nag) */
  { id: "b01_reminder", x: 105, y: 410, w: 190, h: 130, label: "Form Not Submitted Send information Incomplete mail", icon: "mailWarn", kind: "action", tone: "amber", buttonCode: "B01", emailCode: "E002", subtitle: "Order Autoclosed in 8 hrs" },

  /* Row 4 — B10 (customer-delay) + E010 terminal */
  { id: "b10_cust",     x: 1180, y: 470, w: 220, h: 90,  label: "Customer Side Delay Select Reason", icon: "userX",  kind: "action",   tone: "slate",   buttonCode: "B10", emailCode: "E004", subtitle: "Order Autoclosed in 8 hrs" },
  { id: "closed_e010",  x: 1450, y: 450, w: 240, h: 130, label: "Order Closed with previous Selected Reason", icon: "xCircle", kind: "terminal", tone: "emerald", tag: "E010" },
];

export const nodeById: Record<string, NodeDef> = Object.fromEntries(NODES.map((n) => [n.id, n]));

/* ─── Edges ─── */
export const EDGES: EdgeDef[] = [
  // Main horizontal path
  { id: "e_fn_fs", from: "form_not",     fromSide: "R", to: "form_sub",     toSide: "L", mode: "S", branch: "main-2" },
  { id: "e_fs_gv", from: "form_sub",     fromSide: "R", to: "govt_portal",  toSide: "L", mode: "S", branch: "main-3" },
  { id: "e_gv_ck", from: "govt_portal",  fromSide: "R", to: "check_status", toSide: "L", mode: "S", branch: "main-4" },

  // Technical loop (top)
  { id: "e_fs_b02",  from: "form_sub",   fromSide: "T", to: "b02_tech",    toSide: "B", mode: "VH", branch: "technical",
    waypoints: [{ x: 305, y: 40 }, { x: 480, y: 40 }] },
  { id: "e_b02_b03", from: "b02_tech",   fromSide: "R", to: "b03_fix",     toSide: "L", mode: "S",  branch: "technical" },
  { id: "e_b03_gv",  from: "b03_fix",    fromSide: "R", to: "govt_portal", toSide: "T", mode: "HV", branch: "technical",
    waypoints: [{ x: 850, y: 40 }] },

  // Form-not / B01 → E010
  { id: "e_fn_b01", from: "form_not",    fromSide: "B", to: "b01_reminder", toSide: "T", mode: "S", branch: "form-nag" },
  { id: "e_b01_cl", from: "b01_reminder", fromSide: "B", to: "closed_e010", toSide: "B", mode: "VHV", branch: "form-nag",
    waypoints: [{ x: 200, y: 640 }, { x: 1570, y: 640 }] },

  // Customer-delay from Form Submitted → B10
  { id: "e_fs_b10", from: "form_sub",    fromSide: "B", to: "b10_cust",    toSide: "B", mode: "VHV", branch: "customer-delay",
    waypoints: [{ x: 310, y: 610 }, { x: 1290, y: 610 }] },

  // Consultation done (B04)
  { id: "e_gv_b04", from: "govt_portal", fromSide: "B", to: "b04_consult", toSide: "T", mode: "VH", branch: "shortcut",
    waypoints: [{ x: 770, y: 210 }] },

  // Awaiting approval (B05) — down then back up to Check Status
  { id: "e_gv_b05", from: "govt_portal", fromSide: "B", to: "b05_wait",    toSide: "T", mode: "VH", branch: "awaiting",
    waypoints: [{ x: 925, y: 210 }] },
  { id: "e_b05_ck", from: "b05_wait",    fromSide: "T", to: "check_status", toSide: "B", mode: "VHV", branch: "awaiting",
    waypoints: [{ x: 925, y: 210 }, { x: 1290, y: 210 }] },

  // Check status branches
  { id: "e_ck_b06", from: "check_status", fromSide: "B", to: "b06_remind",  toSide: "T", mode: "VH", branch: "status",
    waypoints: [{ x: 1120, y: 210 }] },
  { id: "e_ck_b07", from: "check_status", fromSide: "B", to: "b07_after",   toSide: "T", mode: "VH", branch: "status",
    waypoints: [{ x: 1270, y: 210 }] },
  { id: "e_ck_b08", from: "check_status", fromSide: "B", to: "b08_accept",  toSide: "T", mode: "VH", branch: "accept",
    waypoints: [{ x: 1420, y: 210 }] },
  { id: "e_ck_b09", from: "check_status", fromSide: "B", to: "b09_reject",  toSide: "T", mode: "VH", branch: "reject",
    waypoints: [{ x: 1570, y: 210 }] },

  // Check status → B10 (customer side delay after check)
  { id: "e_ck_b10", from: "check_status", fromSide: "B", to: "b10_cust",    toSide: "T", mode: "VH", branch: "customer-delay",
    waypoints: [{ x: 1290, y: 460 }] },

  // Terminal close routes
  { id: "e_b09_cl", from: "b09_reject",  fromSide: "B", to: "closed_e010", toSide: "T", mode: "VH", branch: "reject",
    waypoints: [{ x: 1570, y: 420 }] },
  { id: "e_b10_cl", from: "b10_cust",    fromSide: "R", to: "closed_e010", toSide: "L", mode: "S",  branch: "customer-delay" },
];

/* ─── Geometry helpers ─── */
export function anchor(n: NodeDef, side: Side): { x: number; y: number } {
  const w = nodeW(n), h = nodeH(n);
  switch (side) {
    case "L": return { x: n.x,         y: n.y + h / 2 };
    case "R": return { x: n.x + w,     y: n.y + h / 2 };
    case "T": return { x: n.x + w / 2, y: n.y };
    case "B": return { x: n.x + w / 2, y: n.y + h };
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

export function mainDoneEdgesFor(currentIdx: number, phase: JourneyPhase): Set<string> {
  const s = new Set<string>();
  const holding = phase === "technical_delay" || phase === "customer_delay" || phase === "form_not_submitted";
  const idx = holding && phase === "form_not_submitted" ? 2
            : holding ? 3
            : currentIdx;

  if (idx >= 3) { s.add("e_fn_fs"); }
  if (idx >= 4) s.add("e_fs_gv");
  if (idx >= 5) s.add("e_gv_ck");
  return s;
}

export function currentMainEdgeFor(
  currentIdx: number,
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
): string | null {
  if (terminal) return null;
  if (phase === "form_not_submitted" || phase === "technical_delay" || phase === "customer_delay") return null;
  if (currentIdx <= 2) return "e_fn_fs";
  if (currentIdx === 3) return "e_fs_gv";
  if (currentIdx === 4) return "e_gv_ck";
  return null;
}

export function currentStageNodeFor(
  currentIdx: number,
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
): string | null {
  if (terminal === "completed") return "b08_accept";
  if (terminal === "closed") return "closed_e010";
  if (phase === "form_not_submitted") return "form_not";
  if (currentIdx <= 2) return "form_not";
  if (currentIdx === 3) return "form_sub";
  if (currentIdx === 4) return "govt_portal";
  if (currentIdx >= 5) return "check_status";
  return null;
}

export interface EdgeStateInput {
  activeBranches: Set<BranchKey>;
  doneMainEdges: Set<string>;
  terminal: "completed" | "closed" | null;
  currentMainEdge?: string | null;
  phase?: JourneyPhase;
  currentIdx?: number;
}

/** Edges belonging to a delay loop that returns into the main flow. */
const RESOLVED_DELAY_EDGES: Record<string, BranchKey> = {
  e_fs_b02: "technical",
  e_b02_b03: "technical",
  e_b03_gv: "technical",
};

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
  // A resolved technical delay: once we've moved past form_submitted into the
  // govt flow, show the technical loop as done (green) instead of idle.
  if (
    RESOLVED_DELAY_EDGES[e.id] &&
    i.phase !== "technical_delay" &&
    (i.currentIdx ?? 0) >= 4 &&
    !i.terminal
  ) {
    return "done";
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

const STAGE_IDX: Record<string, number> = {
  form_not:     3,
  form_sub:     3,
  govt_portal:  4,
  check_status: 5,
};

export function nodeState(nodeId: string, i: NodeStateInput): NodeState {
  if (nodeId === "b08_accept" && i.terminal === "completed") return "terminal-ok";
  if (nodeId === "closed_e010" && i.terminal === "closed")  return "terminal-bad";

  if (i.currentStageNode && nodeId === i.currentStageNode && !i.terminal) return "active";

  const incident = EDGES.some(
    (e) => (e.from === nodeId || e.to === nodeId) && i.activeBranches.has(e.branch),
  );
  if (incident) return "active";

  const stageIdx = STAGE_IDX[nodeId];
  if (stageIdx !== undefined && i.currentIdx > stageIdx) return "done";

  return "idle";
}
