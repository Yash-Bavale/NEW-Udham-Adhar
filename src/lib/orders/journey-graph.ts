// Pure config + helpers for the CustomerJourneyMap flowchart.
// Layout mirrors the operations reference diagram with B01…B08 action buttons
// + E010 close. Updated for v2 button mapping (B04=Customer Delay, B05=Submit
// to Govt, B06=Consultation, B07=Accept, B08=Reject).

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

/* ─── Node dimension helpers ─── */
export const nodeW = (n: NodeDef) => n.w ?? NODE_W;
export const nodeH = (n: NodeDef) => n.h ?? NODE_H;

/* ─── Nodes (layout matches reference diagram) ─── */
export const NODES: NodeDef[] = [
  /* Row 1 — main path (top row) — S02 → S04 → S07 → S08 */
  { id: "form_not",      x:  30, y: 140, w: 150, h: 56,  label: "S02 · Awaiting Customer Form",           icon: "fileText",  kind: "stage",    tone: "slate", tag: "S02" },
  { id: "form_sub",      x: 240, y: 140, w: 140, h: 56,  label: "S04 · Form Submitted",                   icon: "fileCheck", kind: "stage",    tone: "slate", tag: "S04" },
  { id: "b02_tech",      x: 430, y:  70, w: 100, h: 150, label: "S05 · Technical Delay",                  icon: "wrench",    kind: "action",   tone: "slate",   buttonCode: "B02", emailCode: "E003", subtitle: "Select Reason · Add reminder" },
  { id: "b03_fix",       x: 550, y:  70, w: 100, h: 150, label: "S05 · Technical Delay",                  icon: "rotate",    kind: "action",   tone: "slate",   buttonCode: "B03", emailCode: "E011", subtitle: "Issue Resolved" },
  { id: "govt_portal",   x: 700, y: 120, w: 300, h: 62,  label: "S07 · Government Processing",            icon: "landmark",  kind: "stage",    tone: "slate", tag: "S07" },
  { id: "consult_stage", x:1050, y: 120, w: 280, h: 62,  label: "S08 · Consultation Completed",           icon: "clipboard", kind: "stage",    tone: "slate", tag: "S08" },

  /* Row 2 — action nodes under govt / consult */
  { id: "b05_submit",    x: 700,  y: 235, w: 140, h: 160, label: "S07 · Application Submitted to Govt",   icon: "send",      kind: "action", tone: "emerald", buttonCode: "B05", emailCode: "E005", subtitle: "Government Processing" },
  { id: "b06_consult",   x: 870,  y: 235, w: 140, h: 160, label: "S08 · Consultation Completed",          icon: "clipboard", kind: "action", tone: "emerald", buttonCode: "B06", emailCode: "E005", subtitle: "Final Submission" },
  { id: "b07_accept",    x: 1050, y: 235, w: 140, h: 160, label: "S09 · Application Approved",            icon: "upload",    kind: "action", tone: "emerald", buttonCode: "B07", emailCode: "E007", subtitle: "Upload PDF + Note → S11" },
  { id: "b08_reject",    x: 1220, y: 235, w: 140, h: 160, label: "S10 · Application Rejected",            icon: "xCircle",   kind: "action", tone: "rose",    buttonCode: "B08", emailCode: "E008", subtitle: "Select Reason → S12" },

  /* Row 3 — B01 (form-nag) */
  { id: "b01_reminder",  x: 105, y: 410, w: 190, h: 130, label: "S03 · Waiting for Customer Submission",  icon: "mailWarn",  kind: "action", tone: "amber", buttonCode: "B01", emailCode: "E002", subtitle: "Order Autoclosed in 8 hrs" },

  /* Row 4 — B04 (customer-delay) + E010 terminal */
  { id: "b04_cust",      x: 700,  y: 470, w: 220, h: 90,  label: "S06 · Customer Side Delay",             icon: "userX",     kind: "action",   tone: "slate",   buttonCode: "B04", emailCode: "E004", subtitle: "Waiting State" },
  { id: "closed_e010",   x: 1050, y: 450, w: 240, h: 130, label: "S12 · Order Closed",                    icon: "xCircle",   kind: "terminal", tone: "emerald", tag: "E010" },
];

export const nodeById: Record<string, NodeDef> = Object.fromEntries(NODES.map((n) => [n.id, n]));

/* ─── Edges ─── */
export const EDGES: EdgeDef[] = [
  // Main horizontal path
  { id: "e_fn_fs", from: "form_not",      fromSide: "R", to: "form_sub",      toSide: "L", mode: "S", branch: "main-2" },
  { id: "e_fs_gv", from: "form_sub",      fromSide: "R", to: "govt_portal",   toSide: "L", mode: "S", branch: "main-3" },
  { id: "e_gv_cs", from: "govt_portal",   fromSide: "R", to: "consult_stage", toSide: "L", mode: "S", branch: "main-4" },

  // Technical loop (top)
  { id: "e_fs_b02",  from: "form_sub",   fromSide: "T", to: "b02_tech",     toSide: "B", mode: "VH", branch: "technical",
    waypoints: [{ x: 305, y: 40 }, { x: 480, y: 40 }] },
  { id: "e_b02_b03", from: "b02_tech",   fromSide: "R", to: "b03_fix",      toSide: "L", mode: "S",  branch: "technical" },
  { id: "e_b03_gv",  from: "b03_fix",    fromSide: "R", to: "govt_portal",  toSide: "T", mode: "HV", branch: "technical",
    waypoints: [{ x: 850, y: 40 }] },

  // Form-not / B01 → E010
  { id: "e_fn_b01", from: "form_not",     fromSide: "B", to: "b01_reminder",  toSide: "T", mode: "S", branch: "form-nag" },
  { id: "e_b01_cl", from: "b01_reminder", fromSide: "B", to: "closed_e010",   toSide: "B", mode: "VHV", branch: "form-nag",
    waypoints: [{ x: 200, y: 640 }, { x: 1170, y: 640 }] },

  // Customer-delay from Form Submitted → B04
  { id: "e_fs_b04", from: "form_sub",     fromSide: "B", to: "b04_cust",      toSide: "B", mode: "VHV", branch: "customer-delay",
    waypoints: [{ x: 310, y: 610 }, { x: 810, y: 610 }] },

  // B05 — Application Submitted to Govt (under govt_portal)
  { id: "e_gv_b05", from: "govt_portal",  fromSide: "B", to: "b05_submit",    toSide: "T", mode: "VH", branch: "submit",
    waypoints: [{ x: 770, y: 210 }] },

  // B06 — Consultation Completed (under govt_portal, leads to consult_stage)
  { id: "e_gv_b06", from: "govt_portal",  fromSide: "B", to: "b06_consult",   toSide: "T", mode: "VH", branch: "consult",
    waypoints: [{ x: 940, y: 210 }] },

  // B07 — Application Approved (under consult_stage)
  { id: "e_cs_b07", from: "consult_stage", fromSide: "B", to: "b07_accept",   toSide: "T", mode: "VH", branch: "accept",
    waypoints: [{ x: 1120, y: 210 }] },

  // B08 — Application Rejected (under consult_stage)
  { id: "e_cs_b08", from: "consult_stage", fromSide: "B", to: "b08_reject",   toSide: "T", mode: "VH", branch: "reject",
    waypoints: [{ x: 1290, y: 210 }] },

  // Terminal close routes
  { id: "e_b08_cl", from: "b08_reject",   fromSide: "B", to: "closed_e010",   toSide: "T", mode: "VH", branch: "reject",
    waypoints: [{ x: 1290, y: 420 }] },
  { id: "e_b04_cl", from: "b04_cust",     fromSide: "R", to: "closed_e010",   toSide: "L", mode: "S",  branch: "customer-delay" },
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
    case "post_b03_resume":    break; // back to form_submitted, no branch
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
  if (idx >= 5) s.add("e_gv_cs");
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
  if (currentIdx === 4) return "e_gv_cs";
  return null;
}

export function currentStageNodeFor(
  currentIdx: number,
  phase: JourneyPhase,
  terminal: "completed" | "closed" | null,
): string | null {
  if (terminal === "completed") return "b07_accept";
  if (terminal === "closed") return "closed_e010";
  if (phase === "form_not_submitted") return "form_not";
  if (currentIdx <= 2) return "form_not";
  if (currentIdx === 3) return "form_sub";
  if (currentIdx === 4) return "govt_portal";
  if (currentIdx >= 5) return "consult_stage";
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
    if (i.terminal === "completed" && (e.branch === "accept" || e.branch === "shortcut" || e.branch === "consult" || e.branch === "submit")) {
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
  form_not:      3,
  form_sub:      3,
  govt_portal:   4,
  consult_stage: 5,
};

export function nodeState(nodeId: string, i: NodeStateInput): NodeState {
  if (nodeId === "b07_accept" && i.terminal === "completed") return "terminal-ok";
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
