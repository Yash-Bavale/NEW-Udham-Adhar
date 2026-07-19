// Pure config + helpers for the CustomerJourneyMap flowchart.
// Layout EXACTLY mirrors the operations reference diagram (Image 4).
//
// Layout structure:
//   ROW 0 (y=50–155): B02/B03 Technical Delay boxes sit above main row inside top rectangle loop
//   ROW 1 (y=160–230): Main horizontal path — Order Received → Form Not Submitted → Form Submitted
//                       → Application Submitted Govt Portal → Application Accepted or Closed
//   ROW 2 (y=265–390): Sub-cards hanging straight down: B05, B06 under Govt Portal; B07, B08 under Accepted
//   ROW 3 (y=415–520): Bottom exceptions — B01 (below Form Not Sub), B04 (Customer Delay), Order Closed

import type { ButtonCode, JourneyPhase } from "@/lib/orders/journey-map";

/* ─── Canvas constants ─── */
export const NODE_W = 130;
export const NODE_H = 60;
export const CANVAS_W = 1720;
export const CANVAS_H = 570;

/* ─── Types ─── */
export type NodeKind = "stage" | "action" | "terminal" | "sub";
export type Tone = "slate" | "amber" | "rose" | "sky" | "violet" | "emerald" | "indigo" | "maroon";
export type IconKey =
  | "inbox" | "fileText" | "fileCheck" | "landmark" | "search" | "flag"
  | "wrench" | "rotate" | "mailWarn" | "userX" | "send" | "clock"
  | "clipboard" | "upload" | "xCircle" | "lifeBuoy" | "shoppingBag";

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
  highlightText?: string;
  badgeTop?: string;    // Yellow pill on top border
  badgeBottom?: string; // Blue pill on bottom border
  tag?: string;
}

export type Side = "L" | "R" | "T" | "B";
export type EdgeMode = "S" | "HV" | "VH" | "HVH" | "VHV";

export type BranchKey =
  | "main-1" | "main-2" | "main-3" | "main-4"
  | "form-nag" | "customer-delay" | "technical"
  | "submit" | "consult" | "accept" | "reject";

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

/* ─── Dimension helpers ─── */
export const nodeW = (n: NodeDef) => n.w ?? NODE_W;
export const nodeH = (n: NodeDef) => n.h ?? NODE_H;

/*
 * ─── COORDINATE SYSTEM (matches reference Image 4 exactly) ───
 *
 * ROW 1 — Main path nodes, all centered at y=160..220 (h=60 → top at y=165)
 *   order_rec    x=20,   w=110
 *   form_not     x=165,  w=130
 *   form_sub     x=330,  w=130
 *   govt_portal  x=760,  w=290  [large box, spans B05+B06 width]
 *   consult_stg  x=1105, w=290  [large box, spans B07+B08 width]
 *
 * MAIN PATH connects: order_rec → form_not → form_sub ──── govt_portal → consult_stage
 * (form_sub to govt_portal is a direct horizontal line, B02/B03 are a SEPARATE branch ABOVE)
 *
 * ROW 0 — B02 & B03 float above main row (the technical delay loop)
 *   b02_tech     x=480,  y=55,  w=125, h=105
 *   b03_fix      x=620,  y=55,  w=125, h=105
 *
 * The top rectangular loop path:
 *   form_sub TOP → up to y=18 → right → B02 TOP → B02/B03 straight → B03 TOP → right → govt_portal TOP
 *   (the rectangle sits above B02 and B03, connecting form_sub back to govt_portal)
 *
 * ROW 2 — Sub-cards hanging straight down from parent stage cards
 *   b05_submit   x=760,  y=270, w=140, h=120  [under govt_portal left]
 *   b06_consult  x=912,  y=270, w=140, h=120  [under govt_portal right]
 *   b07_accept   x=1105, y=270, w=140, h=120  [under consult_stage left]
 *   b08_reject   x=1257, y=270, w=140, h=120  [under consult_stage right]
 *
 * ROW 3 — Bottom exception row
 *   b01_reminder x=100,  y=415, w=195, h=110  [below form_not]
 *   b04_cust     x=640,  y=415, w=205, h=110  [below form_sub area, left of closed]
 *   closed_e010  x=1105, y=415, w=290, h=110  [far right, aligns with consult_stage]
 */

export const NODES: NodeDef[] = [

  /* ── ROW 1: Main horizontal path ── */
  {
    id: "order_rec", x: 20, y: 165, w: 110, h: 60,
    label: "Order Received",
    icon: "shoppingBag", kind: "stage", tone: "maroon",
    badgeBottom: "E001",
  },
  {
    id: "form_not", x: 165, y: 165, w: 130, h: 60,
    label: "Form Not Submitted",
    icon: "fileText", kind: "stage", tone: "slate",
  },
  {
    id: "form_sub", x: 330, y: 165, w: 130, h: 60,
    label: "Form Submitted",
    icon: "fileCheck", kind: "stage", tone: "slate",
  },
  {
    id: "b02_tech", x: 485, y: 141, w: 125, h: 108,
    label: "Technical Delay",
    subtitle: "Select Reason",
    highlightText: "Add Reminder",
    icon: "wrench", kind: "action", tone: "slate",
    buttonCode: "B02", emailCode: "E003",
    badgeTop: "B02", badgeBottom: "E003",
  },
  {
    id: "b03_fix", x: 630, y: 141, w: 126, h: 108,
    label: "Technical Delay",
    subtitle: "Issue Resolved",
    icon: "rotate", kind: "action", tone: "slate",
    buttonCode: "B03", emailCode: "E011",
    badgeTop: "B03", badgeBottom: "E011",
  },
  {
    id: "govt_portal", x: 780, y: 155, w: 292, h: 80,
    label: "Application Submitted",
    subtitle: "Govt Portal",
    icon: "landmark", kind: "stage", tone: "slate",
  },
  {
    id: "consult_stage", x: 1125, y: 155, w: 292, h: 80,
    label: "Application Accepted",
    subtitle: "or Closed",
    icon: "clipboard", kind: "stage", tone: "slate",
  },

  /* ── ROW 2: Sub-cards under Govt Portal ── */
  {
    id: "b05_submit", x: 780, y: 268, w: 140, h: 125,
    label: "Application Submitted",
    subtitle: "Waiting for Govt. Approval",
    highlightText: "Add Reminder & Button Press Counter",
    icon: "send", kind: "action", tone: "slate",
    buttonCode: "B05", emailCode: "E006",
    badgeTop: "B05", badgeBottom: "E006",
  },
  {
    id: "b06_consult", x: 932, y: 268, w: 140, h: 125,
    label: "Consultation Completed",
    subtitle: "Application Submitted to Govt Portal",
    highlightText: "Order Completed",
    icon: "clipboard", kind: "action", tone: "emerald",
    buttonCode: "B06", emailCode: "E005",
    badgeTop: "B06", badgeBottom: "E005",
  },

  /* ── ROW 2: Sub-cards under Application Accepted or Closed ── */
  {
    id: "b07_accept", x: 1125, y: 268, w: 140, h: 125,
    label: "Application Accepted",
    subtitle: "Upload PDF",
    highlightText: "Add Note- Order Completed",
    icon: "upload", kind: "action", tone: "emerald",
    buttonCode: "B07", emailCode: "E007",
    badgeTop: "B07", badgeBottom: "E007",
  },
  {
    id: "b08_reject", x: 1277, y: 268, w: 140, h: 125,
    label: "Application Rejected",
    subtitle: "Select Reason",
    highlightText: "Add Note- Order Closed",
    icon: "xCircle", kind: "action", tone: "emerald",
    buttonCode: "B08", emailCode: "E008",
    badgeTop: "B08", badgeBottom: "E008",
  },

  /* ── ROW 3: Bottom exception row ── */
  {
    id: "b01_reminder", x: 132, y: 415, w: 196, h: 110,
    label: "Form Not Submitted",
    subtitle: "Send information Incomplete mail",
    highlightText: "Order Autoclosed in 8 hrs",
    icon: "mailWarn", kind: "action", tone: "amber",
    buttonCode: "B01", emailCode: "E002",
    badgeTop: "B01", badgeBottom: "E002",
  },
  {
    id: "b04_cust", x: 870, y: 415, w: 200, h: 110,
    label: "Customer Side Delay",
    subtitle: "Select Reason",
    highlightText: "Order Autoclosed in 8 hrs",
    icon: "userX", kind: "action", tone: "slate",
    buttonCode: "B04", emailCode: "E004",
    badgeTop: "B04", badgeBottom: "E004",
  },
  {
    id: "closed_e010", x: 1125, y: 415, w: 180, h: 110,
    label: "Order Closed with previous Selected Reason",
    icon: "xCircle", kind: "terminal", tone: "emerald",
    badgeBottom: "E010",
  },
];

export const nodeById: Record<string, NodeDef> = Object.fromEntries(NODES.map((n) => [n.id, n]));

/*
 * ─── EDGE ROUTING RULES (all orthogonal, zero diagonals, zero overlaps) ───
 *
 * MAIN PATH (straight horizontal lines, all at ~y=195):
 *   order_rec R → form_not L          [main-1]
 *   form_not R  → form_sub L          [main-2]
 *   form_sub R  → govt_portal L       [main-3]  ← direct, SKIP the B02/B03 area
 *   govt_portal R → consult_stage L   [main-4]
 *
 * TOP RECTANGLE LOOP for B02/B03 (technical delay):
 *   form_sub TOP → up(y=18) → right → B02 TOP        [technical]
 *   B02 R → B03 L  (straight horizontal)              [technical]
 *   B03 TOP → up(y=18) → right → govt_portal TOP      [technical]
 *
 * VERTICAL DROP from stages to sub-cards:
 *   govt_portal B → straight down → b05_submit T      [submit]
 *   govt_portal B → straight down → b06_consult T     [consult]
 *   consult_stage B → straight down → b07_accept T    [accept]
 *   consult_stage B → straight down → b08_reject T    [reject]
 */

export const EDGES: EdgeDef[] = [

  /* ── Main horizontal path ── */
  { id: "e_or_fn",  from: "order_rec",    fromSide: "R", to: "form_not",      toSide: "L", mode: "S", branch: "main-1" },
  { id: "e_fn_fs",  from: "form_not",     fromSide: "R", to: "form_sub",      toSide: "L", mode: "S", branch: "main-2" },
  { id: "e_fs_b02", from: "form_sub",     fromSide: "R", to: "b02_tech",      toSide: "L", mode: "S", branch: "technical" },
  { id: "e_b02_b03", from: "b02_tech",    fromSide: "R", to: "b03_fix",       toSide: "L", mode: "S", branch: "technical" },
  { id: "e_b03_gv",  from: "b03_fix",     fromSide: "R", to: "govt_portal",   toSide: "L", mode: "S", branch: "technical" },
  { id: "e_gv_cs",  from: "govt_portal",  fromSide: "R", to: "consult_stage", toSide: "L", mode: "S", branch: "main-4" },

  /* ── Top rectangular loop: starts between form_sub and B02 → govt_portal & consult_stage ── */
  { id: "e_top_gv", from: "form_sub", fromSide: "R", to: "govt_portal", toSide: "T", mode: "S", branch: "technical",
    waypoints: [{ x: 468, y: 195 }, { x: 468, y: 36 }, { x: 926, y: 36 }] },
  { id: "e_top_cs", from: "form_sub", fromSide: "R", to: "consult_stage", toSide: "T", mode: "S", branch: "technical",
    waypoints: [{ x: 468, y: 195 }, { x: 468, y: 18 }, { x: 1271, y: 18 }] },

  /* ── Bottom loop: starts between form_sub and B02 → B05 bottom & B04 left ── */
  { id: "e_bot_b04", from: "form_sub", fromSide: "R", to: "b04_cust", toSide: "L", mode: "S", branch: "customer-delay",
    waypoints: [{ x: 468, y: 195 }, { x: 468, y: 405 }, { x: 830, y: 405 }, { x: 830, y: 470 }] },
  { id: "e_b03_b04", from: "b03_fix", fromSide: "B", to: "b04_cust", toSide: "L", mode: "S", branch: "customer-delay",
    waypoints: [{ x: 693, y: 405 }, { x: 830, y: 405 }, { x: 830, y: 470 }] },
  { id: "e_b05_b04", from: "b05_submit", fromSide: "B", to: "b04_cust", toSide: "L", mode: "S", branch: "customer-delay",
    waypoints: [{ x: 850, y: 405 }, { x: 830, y: 405 }, { x: 830, y: 470 }] },

  /* ── Vertical drops from govt_portal to sub-cards ── */
  { id: "e_gv_b05", from: "govt_portal", fromSide: "B", to: "b05_submit",  toSide: "T", mode: "VH", branch: "submit",
    waypoints: [{ x: 926, y: 248 }, { x: 850, y: 248 }] },
  { id: "e_gv_b06", from: "govt_portal", fromSide: "B", to: "b06_consult", toSide: "T", mode: "VH", branch: "consult",
    waypoints: [{ x: 926, y: 248 }, { x: 1002, y: 248 }] },

  /* ── Vertical drops from consult_stage to sub-cards ── */
  { id: "e_cs_b07", from: "consult_stage", fromSide: "B", to: "b07_accept",  toSide: "T", mode: "VH", branch: "accept",
    waypoints: [{ x: 1271, y: 248 }, { x: 1195, y: 248 }] },
  { id: "e_cs_b08", from: "consult_stage", fromSide: "B", to: "b08_reject",  toSide: "T", mode: "VH", branch: "reject",
    waypoints: [{ x: 1271, y: 248 }, { x: 1347, y: 248 }] },

  /* ── B01 form-nag path ── */
  { id: "e_fn_b01", from: "form_not",     fromSide: "B", to: "b01_reminder", toSide: "T", mode: "S", branch: "form-nag" },
  { id: "e_b01_cl", from: "b01_reminder", fromSide: "B", to: "closed_e010",  toSide: "B", mode: "S", branch: "form-nag",
    waypoints: [{ x: 230, y: 553 }, { x: 1215, y: 553 }] },

  /* ── B04 customer-delay path to Order Closed ── */
  { id: "e_b04_cl", from: "b04_cust", fromSide: "R", to: "closed_e010", toSide: "L", mode: "S", branch: "customer-delay" },

  /* ── B08 reject → Order Closed right side ── */
  { id: "e_b08_cl", from: "b08_reject", fromSide: "B", to: "closed_e010", toSide: "R", mode: "S", branch: "reject",
    waypoints: [{ x: 1347, y: 470 }] },
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
    case "govt_processing":    s.add("submit"); break;
    case "consultation_done":  s.add("consult"); break;
    case "application_approved": s.add("accept"); break;
    case "application_rejected": s.add("reject"); break;
    case "post_b03_resume":    break;
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

  if (idx >= 2) s.add("e_or_fn");
  if (idx >= 3) s.add("e_fn_fs");
  if (idx >= 4) {
    s.add("e_fs_b02");
    s.add("e_b02_b03");
    s.add("e_b03_gv");
  }
  if (idx >= 5) s.add("e_gv_cs");
  return s;
}

export function currentMainEdgesFor(
  currentIdx: number,
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
): Set<string> {
  const s = new Set<string>();
  if (terminal) return s;
  if (phase === "form_not_submitted" || phase === "technical_delay" || phase === "customer_delay") return s;
  if (currentIdx <= 2) s.add("e_or_fn");
  if (currentIdx === 3) {
    s.add("e_fs_b02");
    s.add("e_b02_b03");
    s.add("e_b03_gv");
  }
  if (currentIdx === 4) s.add("e_gv_cs");
  return s;
}



export function currentStageNodeFor(
  currentIdx: number,
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
): string | null {
  if (terminal === "completed") return "b07_accept";
  if (terminal === "closed") return "closed_e010";
  if (phase === "form_not_submitted") return "form_not";
  if (currentIdx <= 1) return "order_rec";
  if (currentIdx === 2) return "form_not";
  if (currentIdx === 3) return "form_sub";
  if (currentIdx === 4) return "govt_portal";
  if (currentIdx >= 5) return "consult_stage";
  return null;
}

export interface EdgeStateInput {
  activeBranches: Set<BranchKey>;
  doneMainEdges: Set<string>;
  terminal: "completed" | "closed" | null;
  currentMainEdges?: Set<string> | null;
  phase?: JourneyPhase;
  currentIdx?: number;
}

/** Technical loop edges — shown as done once order moves past form_submitted. */
const RESOLVED_TECH_EDGES = new Set(["e_fs_b02", "e_b02_b03", "e_b03_gv"]);

export function edgeState(e: EdgeDef, i: EdgeStateInput): EdgeState {
  // 1. Already-completed main path edges
  if (i.doneMainEdges.has(e.id)) return "done";
  // 2. Currently traversing this edge
  if (i.currentMainEdges && i.currentMainEdges.has(e.id)) return "active";
  // 3. Branch is currently active
  if (i.activeBranches.has(e.branch)) {
    if (i.terminal === "closed" &&
        (e.branch === "form-nag" || e.branch === "customer-delay" || e.branch === "reject")) {
      return "closed";
    }
    if (i.terminal === "completed" &&
        (e.branch === "accept" || e.branch === "consult" || e.branch === "submit")) {
      return "done";
    }
    return "active";
  }
  // 4. Technical loop edges go green once order is past form_submitted into govt flow
  if (RESOLVED_TECH_EDGES.has(e.id) &&
      i.phase !== "technical_delay" &&
      (i.currentIdx ?? 0) >= 4 &&
      !i.terminal) {
    return "done";
  }
  // 5. Submit/Consult vertical drops go green/done once order is past govt_portal stage
  if ((e.branch === "submit" || e.branch === "consult") &&
      (i.currentIdx ?? 0) >= 5 &&
      !i.terminal) {
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
  order_rec:     2,
  form_not:      2,
  form_sub:      3,
  govt_portal:   4,
  consult_stage: 5,
};

export function nodeState(nodeId: string, i: NodeStateInput): NodeState {
  if (nodeId === "b07_accept"  && i.terminal === "completed") return "terminal-ok";
  if (nodeId === "closed_e010" && i.terminal === "closed")    return "terminal-bad";

  if (i.currentStageNode && nodeId === i.currentStageNode && !i.terminal) return "active";

  const incident = EDGES.some(
    (e) => (e.from === nodeId || e.to === nodeId) && i.activeBranches.has(e.branch),
  );
  if (incident) return "active";

  const stageIdx = STAGE_IDX[nodeId];
  if (stageIdx !== undefined && i.currentIdx > stageIdx) return "done";

  return "idle";
}
