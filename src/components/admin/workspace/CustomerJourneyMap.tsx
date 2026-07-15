// Customer Journey — Live Path (SVG flowchart).
//
// Renders the full order/support flowchart (drawio parity) as a single SVG
// canvas with orthogonal connector lines. The active path lights up in
// primary + marching-ants animation based on derivePhase(); completed
// segments turn emerald; failed segments turn rose. Idle paths stay grey.
//
// Nodes are absolutely-positioned HTML overlays so buttons keep their
// tooltips + pending states. Edges live in a background SVG.

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Check, Inbox, FileText, FileCheck2, Landmark, Search, Flag,
  Clock, XCircle, CheckCircle2, ClipboardCheck,
  Wrench, UserX, LifeBuoy, Send, UploadCloud, Mail,
  ArrowRight, AlertTriangle, RotateCcw, MailWarning,
  type LucideIcon,
} from "lucide-react";

import type { OrderStage } from "@/lib/crm/computeOrderStage";
import { useOrderWorkflow } from "@/hooks/useOrderWorkflow";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { relativeIST } from "@/lib/datetime";
import { cn } from "@/lib/utils";

import {
  JOURNEY_STAGES, deriveJourneyLiveState, derivePhase,
  PHASE_ENABLED_BUTTONS, type ButtonCode, type JourneyPhase,
} from "@/lib/orders/journey-map";
import { listOrderTickets } from "@/lib/tickets/list-order-tickets.functions";

import { ExternalDelayDialog } from "@/components/admin/ExternalDelayDialog";
import { CloseOrderDialog } from "@/components/admin/CloseOrderDialog";
import { CompletionGateDialogStandalone } from "./CompletionGateDialogStandalone";
import { CountdownChip } from "./CountdownChip";

import {
  sendFormLink, markSubmittedToGovt, sendManualReminder, completeOrder,
} from "@/lib/orders/order-actions.functions";
import { resumeFromHold } from "@/lib/orders/actions/hold-actions.functions";
import { handleGovtRejected } from "@/lib/orders/actions/close-actions.functions";
import { listCloseReasons } from "@/lib/orders/actions/reasons.functions";
import { updateFulfillmentStatus } from "@/lib/crm/orders-v2.functions";

interface Props {
  applicationId: string;
  stage: OrderStage;
  isConsultationOrder?: boolean;
  serviceCode?: string | null;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureNextAt?: string | null;
  closureReasonLabel?: string | null;
  payments?: any[];
  hideAmount?: boolean;
}

/* ═════════════════════════ Graph Config ═════════════════════════ */

const NODE_W = 148;
const NODE_H = 64;
const CANVAS_W = 1720;
const CANVAS_H = 820;

type NodeKind = "stage" | "action" | "terminal" | "sub";
type Tone = "slate" | "amber" | "rose" | "sky" | "violet" | "emerald" | "indigo";

interface NodeDef {
  id: string;
  x: number; y: number;
  label: string;
  icon: LucideIcon;
  kind: NodeKind;
  tone: Tone;
  buttonCode?: ButtonCode;
  emailCode?: string;
  subtitle?: string;
}

const NODES: NodeDef[] = [
  // main happy path (y=280)
  { id: "order_recv",   x:  40, y: 280, label: "Order Received",       icon: Inbox,        kind: "stage",    tone: "indigo" },
  { id: "form_not",     x: 220, y: 280, label: "Form Not Submitted",   icon: FileText,     kind: "stage",    tone: "amber" },
  { id: "form_sub",     x: 400, y: 280, label: "Form Submitted",       icon: FileCheck2,   kind: "stage",    tone: "indigo" },
  { id: "govt_portal",  x: 940, y: 280, label: "App Submitted to Govt", icon: Landmark,    kind: "stage",    tone: "indigo" },
  { id: "check_status", x:1200, y: 280, label: "Check Final Status",   icon: Search,       kind: "stage",    tone: "indigo" },
  { id: "completed",    x:1540, y: 280, label: "Order Completed",      icon: Flag,         kind: "terminal", tone: "emerald" },

  // technical delay loop (y=100)
  { id: "b02_tech",     x: 580, y: 100, label: "Technical Delay",      icon: Wrench,       kind: "action",   tone: "sky",     buttonCode: "B02", emailCode: "E003", subtitle: "Select reason + reminder" },
  { id: "b03_fix",      x: 760, y: 100, label: "Delay Resolved",       icon: RotateCcw,    kind: "action",   tone: "emerald", buttonCode: "B03", emailCode: "E011", subtitle: "Resume order" },

  // form-not-submitted / customer-delay branches (y=460)
  { id: "b01_reminder", x: 220, y: 460, label: "Send Form Reminder",   icon: MailWarning,  kind: "action",   tone: "amber",   buttonCode: "B01", emailCode: "E002", subtitle: "Auto-close in 8h" },
  { id: "b10_cust",     x: 400, y: 460, label: "Customer-Side Delay",  icon: UserX,        kind: "action",   tone: "amber",   buttonCode: "B10", emailCode: "E004", subtitle: "Select Cat A reason" },

  // govt branch (y=460)
  { id: "b04_consult",  x: 940, y: 460, label: "Consultation Done",    icon: Send,         kind: "action",   tone: "emerald", buttonCode: "B04", emailCode: "E005", subtitle: "Shortcut → Completed" },
  { id: "b05_wait",     x:1120, y: 460, label: "Awaiting Approval",    icon: Clock,        kind: "action",   tone: "violet",  buttonCode: "B05", emailCode: "E006", subtitle: "+ reminder" },

  // status branch (y=460)
  { id: "b06_remind",   x:1300, y: 460, label: "Status Checked",       icon: ClipboardCheck, kind: "action", tone: "sky",     buttonCode: "B06", emailCode: "E006", subtitle: "Add reminder" },
  { id: "b07_after",    x:1540, y: 460, label: "Consultation (Wait)",  icon: Send,         kind: "action",   tone: "emerald", buttonCode: "B07", emailCode: "E005", subtitle: "After waiting" },

  // final outcome (y=620)
  { id: "b08_accept",   x:1200, y: 620, label: "Accepted + PDF",       icon: UploadCloud,  kind: "action",   tone: "emerald", buttonCode: "B08", emailCode: "E007", subtitle: "Upload cert" },
  { id: "b09_reject",   x:1380, y: 620, label: "Application Rejected", icon: XCircle,      kind: "action",   tone: "rose",    buttonCode: "B09", emailCode: "E008", subtitle: "Cat B reason" },
  { id: "closed_e010",  x:1540, y: 620, label: "Order Closed",         icon: XCircle,      kind: "terminal", tone: "rose" },

  // ticket sub-lane (y=740)
  { id: "ticket_lane",  x:  40, y: 720, label: "Support Ticket",       icon: LifeBuoy,     kind: "sub",      tone: "violet" },
];

const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, NodeDef>;

type Side = "L" | "R" | "T" | "B";
function anchor(n: NodeDef, side: Side) {
  switch (side) {
    case "L": return { x: n.x,             y: n.y + NODE_H / 2 };
    case "R": return { x: n.x + NODE_W,    y: n.y + NODE_H / 2 };
    case "T": return { x: n.x + NODE_W / 2, y: n.y };
    case "B": return { x: n.x + NODE_W / 2, y: n.y + NODE_H };
  }
}

type EdgeMode = "S" | "HV" | "VH" | "HVH" | "VHV";
type BranchKey = "main-1" | "main-2" | "main-3" | "main-4" | "main-5"
              | "form-nag" | "customer-delay" | "technical" | "shortcut"
              | "awaiting" | "status" | "accept" | "reject" | "ticket";

interface EdgeDef {
  id: string;
  from: string; fromSide: Side;
  to: string;   toSide: Side;
  mode: EdgeMode;
  branch: BranchKey;
  /** Optional forced end-point for edges that terminate at a specific x/y (e.g. joining a shared bus). */
  waypoints?: Array<{ x: number; y: number }>;
}

const EDGES: EdgeDef[] = [
  // Main happy path
  { id: "e_or_fn",  from: "order_recv",   fromSide: "R", to: "form_not",     toSide: "L", mode: "S",  branch: "main-1" },
  { id: "e_fn_fs",  from: "form_not",     fromSide: "R", to: "form_sub",     toSide: "L", mode: "S",  branch: "main-2" },
  { id: "e_fs_gv",  from: "form_sub",     fromSide: "R", to: "govt_portal",  toSide: "L", mode: "S",  branch: "main-3" },
  { id: "e_gv_ck",  from: "govt_portal",  fromSide: "R", to: "check_status", toSide: "L", mode: "S",  branch: "main-4" },
  { id: "e_ck_cp",  from: "check_status", fromSide: "R", to: "completed",    toSide: "L", mode: "S",  branch: "main-5" },

  // Technical delay loop (up + across + down)
  { id: "e_fs_b02", from: "form_sub",     fromSide: "T", to: "b02_tech",     toSide: "L", mode: "VH", branch: "technical" },
  { id: "e_b02_b03",from: "b02_tech",     fromSide: "R", to: "b03_fix",      toSide: "L", mode: "S",  branch: "technical" },
  { id: "e_b03_gv", from: "b03_fix",      fromSide: "R", to: "govt_portal",  toSide: "T", mode: "HV", branch: "technical" },

  // Form-not-submitted → send reminder → auto-close
  { id: "e_fn_b01", from: "form_not",     fromSide: "B", to: "b01_reminder", toSide: "T", mode: "S",  branch: "form-nag" },
  { id: "e_b01_cl", from: "b01_reminder", fromSide: "B", to: "closed_e010",  toSide: "L", mode: "VHV",
    branch: "form-nag", waypoints: [{ x: 294, y: 780 }, { x: 1540, y: 780 }] },

  // Customer-side delay → auto-close
  { id: "e_fs_b10", from: "form_sub",     fromSide: "B", to: "b10_cust",     toSide: "T", mode: "S",  branch: "customer-delay" },
  { id: "e_b10_cl", from: "b10_cust",     fromSide: "B", to: "closed_e010",  toSide: "L", mode: "VHV",
    branch: "customer-delay", waypoints: [{ x: 474, y: 750 }, { x: 1540, y: 750 }] },

  // Consultation-done shortcut → completed
  { id: "e_gv_b04", from: "govt_portal",  fromSide: "B", to: "b04_consult",  toSide: "T", mode: "S",  branch: "shortcut" },
  { id: "e_b04_cp", from: "b04_consult",  fromSide: "R", to: "completed",    toSide: "B", mode: "HV", branch: "shortcut" },

  // Awaiting Govt Approval → B08 Accept
  { id: "e_gv_b05", from: "govt_portal",  fromSide: "B", to: "b05_wait",     toSide: "T", mode: "VH", branch: "awaiting" },
  { id: "e_b05_b8", from: "b05_wait",     fromSide: "B", to: "b08_accept",   toSide: "T", mode: "VH", branch: "awaiting" },

  // Status branch
  { id: "e_ck_b06", from: "check_status", fromSide: "B", to: "b06_remind",   toSide: "T", mode: "S",  branch: "status" },
  { id: "e_ck_b07", from: "check_status", fromSide: "B", to: "b07_after",    toSide: "T", mode: "VH", branch: "status" },
  { id: "e_b07_cp", from: "b07_after",    fromSide: "T", to: "completed",    toSide: "R", mode: "VH", branch: "status",
    waypoints: [{ x: 1614, y: 380 }, { x: 1688, y: 380 }, { x: 1688, y: 312 }] },

  // Accept path
  { id: "e_b06_b8", from: "b06_remind",   fromSide: "B", to: "b08_accept",   toSide: "R", mode: "VH", branch: "accept" },
  { id: "e_b08_cp", from: "b08_accept",   fromSide: "T", to: "completed",    toSide: "B", mode: "S",  branch: "accept" },

  // Reject path
  { id: "e_ck_b09", from: "check_status", fromSide: "B", to: "b09_reject",   toSide: "T", mode: "VH", branch: "reject" },
  { id: "e_b09_cl", from: "b09_reject",   fromSide: "R", to: "closed_e010",  toSide: "T", mode: "HV", branch: "reject" },

  // Ticket sub-lane (only rendered when open ticket exists)
  { id: "e_tk_fs",  from: "ticket_lane",  fromSide: "R", to: "form_sub",     toSide: "B", mode: "HV", branch: "ticket" },
];

function pathD(a: {x:number;y:number}, b: {x:number;y:number}, mode: EdgeMode, waypoints?: Array<{x:number;y:number}>): string {
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

/* ═════════════════════════ Phase → active branches ═════════════════════════ */

function activeBranchesFor(phase: JourneyPhase, terminal: "completed" | "closed" | null, reasonCode: string | null): Set<BranchKey> {
  const s = new Set<BranchKey>();
  switch (phase) {
    case "form_not_submitted": s.add("form-nag"); break;
    case "form_submitted":     /* no sub-branch active */ break;
    case "technical_delay":    s.add("technical"); break;
    case "customer_delay":     s.add("customer-delay"); break;
    case "consultation_done":  s.add("shortcut"); break;
    case "awaiting_govt":      s.add("awaiting"); break;
    case "status_checked":     s.add("status"); break;
    case "post_wait_submitted":s.add("status"); break;
    case "completed":          s.add("accept"); break;
    case "closed":
      if (reasonCode?.startsWith("B")) s.add("reject");
      else s.add("form-nag");
      break;
  }
  if (terminal === "completed") s.add("accept");
  return s;
}

/* Main-path segments considered "done" per stage index (0..6). */
function mainDoneEdgesFor(currentIdx: number): Set<string> {
  const s = new Set<string>();
  // stage index mapping (JOURNEY_STAGES): 0 lead, 1 payment, 2 order, 3 form, 4 govt, 5 check, 6 completed
  if (currentIdx >= 3) s.add("e_or_fn");
  if (currentIdx >= 3) s.add("e_fn_fs");
  if (currentIdx >= 4) s.add("e_fs_gv");
  if (currentIdx >= 5) s.add("e_gv_ck");
  if (currentIdx >= 6) s.add("e_ck_cp");
  return s;
}

/* ═════════════════════════ Component ═════════════════════════ */

export function CustomerJourneyMap(p: Props) {
  const qc = useQueryClient();
  const { view, events } = useOrderWorkflow(p.applicationId);

  const live = useMemo(() => deriveJourneyLiveState({
    stage: p.stage,
    workflowStatus: p.workflowStatus,
    closureStage: p.closureStage,
    closureReasonLabel: p.closureReasonLabel,
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel]);

  const currentIdx = live.currentMainIndex;
  const isTalkToExpert = /talk|expert|consult/i.test(p.serviceCode ?? "") || !!p.isConsultationOrder;
  const closed = live.terminal === "closed";
  const completed = live.terminal === "completed";
  const closureArmed = !!p.closureStage && p.closureStage !== "none" && !closed;

  const reminderCount = useMemo(
    () => (events ?? []).filter((e: any) => e?.type === "ReminderScheduled" || e?.type === "ReminderFired").length,
    [events],
  );

  const postWaitKey = `journey.b07Pressed:${p.applicationId}`;
  const [postWaitSubmitted, setPostWaitSubmitted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.localStorage.getItem(postWaitKey) === "1"; } catch { return false; }
  });
  const markPostWaitSubmitted = () => {
    try { window.localStorage.setItem(postWaitKey, "1"); } catch {}
    setPostWaitSubmitted(true);
  };

  const phase = useMemo(() => derivePhase({
    stage: p.stage,
    workflowStatus: p.workflowStatus,
    closureStage: p.closureStage,
    closureReasonLabel: p.closureReasonLabel,
    reminderCount,
    postWaitSubmitted,
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel, reminderCount, postWaitSubmitted]);

  const enabledCodes = PHASE_ENABLED_BUTTONS[phase];
  const gate = (code: ButtonCode) => enabledCodes.includes(code) && !closed && !completed;

  const timers = view.timers ?? [];
  const findTimer = (kindMatch: RegExp) =>
    timers.find((t: any) => kindMatch.test(t?.kind ?? "") && t?.status === "running") ?? null;
  const formAutoCloseTimer  = findTimer(/form_pending_autoclose|form_.*8h/);
  const customerHoldTimer   = findTimer(/customer_hold|customer_side_autoclose/);
  const technicalHoldTimer  = findTimer(/technical_hold|our_side_reminder/);

  // Open ticket for this order
  const listTickets = useServerFn(listOrderTickets);
  const ticketQ = useQuery({
    queryKey: ["order-tickets", p.applicationId],
    queryFn: () => listTickets({ data: { orderId: p.applicationId } }),
    staleTime: 30_000,
  });
  useRealtimeTable("support_tickets", () => ticketQ.refetch(), {
    filter: `application_id=eq.${p.applicationId}`,
  });
  const openTicket = (ticketQ.data?.tickets ?? []).find((t: any) => {
    const s = String(t.status ?? "").toLowerCase();
    return s !== "closed" && s !== "resolved";
  });
  const hasOpenTicket = !!openTicket;

  const currentStageLabel = useMemo(() => {
    const s = JOURNEY_STAGES[Math.min(Math.max(currentIdx, 0), JOURNEY_STAGES.length - 1)];
    return s?.label ?? "Order Received";
  }, [currentIdx]);

  const [dialog, setDialog] = useState<
    | null
    | { kind: "customer_delay" }
    | { kind: "technical_delay" }
    | { kind: "force_close" }
    | { kind: "govt_rejected" }
    | { kind: "complete_with_cert" }
  >(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-workflow-state", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-tickets", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-timers", p.applicationId] });
  };

  const fnFormLink = useServerFn(sendFormLink);
  const fnSubmit   = useServerFn(markSubmittedToGovt);
  const fnReminder = useServerFn(sendManualReminder);
  const fnComplete = useServerFn(completeOrder);
  const fnUpdateFF = useServerFn(updateFulfillmentStatus);
  const fnResume   = useServerFn(resumeFromHold);

  const mutResume = useMutation({
    mutationFn: () => fnResume({ data: { orderId: p.applicationId, target: "IN_PROCESSING" } }),
    onSuccess: () => { toast.success("E011 sent — technical delay resolved, order resumed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutSubmitAfterWait = useMutation({
    mutationFn: () => fnSubmit({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E005 sent — consultation completed (after waiting)"); markPostWaitSubmitted(); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutFormLink = useMutation({
    mutationFn: () => fnFormLink({ data: { orderId: p.applicationId, transitionToWaiting: true } }),
    onSuccess: (r: any) => { toast.success(r?.emailQueued ? "E002 — Form link / incomplete-info mail sent" : "Order updated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutSubmit = useMutation({
    mutationFn: () => fnSubmit({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E005 sent — application marked submitted to govt"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutReminder = useMutation({
    mutationFn: (note: string) => fnReminder({ data: { orderId: p.applicationId, note } }),
    onSuccess: () => { toast.success("E006 sent + reminder queued"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutTalkExpert = useMutation({
    mutationFn: () => fnComplete({ data: { orderId: p.applicationId } }),
    onSuccess: () => { toast.success("E009 sent — consultation completed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const promptReminder = () => {
    const note = window.prompt("Optional message to include with reminder:", "");
    if (note !== null) mutReminder.mutate(note);
  };

  // Wire buttonCode → handler + optional pending flag
  const buttonHandlers: Record<string, { onClick: () => void; pending?: boolean }> = {
    B01: { onClick: () => mutFormLink.mutate(),         pending: mutFormLink.isPending },
    B02: { onClick: () => setDialog({ kind: "technical_delay" }) },
    B03: { onClick: () => mutResume.mutate(),           pending: mutResume.isPending },
    B04: { onClick: () => mutSubmit.mutate(),           pending: mutSubmit.isPending },
    B05: { onClick: promptReminder },
    B06: { onClick: promptReminder },
    B07: { onClick: () => mutSubmitAfterWait.mutate(),  pending: mutSubmitAfterWait.isPending },
    B08: { onClick: () => setDialog({ kind: "complete_with_cert" }) },
    B09: { onClick: () => setDialog({ kind: "govt_rejected" }) },
    B10: { onClick: () => setDialog({ kind: "customer_delay" }) },
  };

  /* ─── Highlight computation ─── */
  const activeBranches = useMemo(
    () => activeBranchesFor(phase, live.terminal, live.reasonCode),
    [phase, live.terminal, live.reasonCode],
  );
  const doneMainEdges = useMemo(() => mainDoneEdgesFor(currentIdx), [currentIdx]);

  function edgeState(e: EdgeDef): "done" | "active" | "closed" | "idle" {
    // main-path segments already traversed
    if (doneMainEdges.has(e.id)) return "done";
    // if branch is active
    if (activeBranches.has(e.branch)) {
      if (closed && (e.branch === "form-nag" || e.branch === "customer-delay" || e.branch === "reject")) return "closed";
      return "active";
    }
    return "idle";
  }

  function nodeIsActive(id: string): boolean {
    // active if any incident edge is active
    return EDGES.some((e) => (e.from === id || e.to === id) && activeBranches.has(e.branch));
  }
  function nodeIsDone(id: string): boolean {
    const idx = ["order_recv", "form_not", "form_sub", "govt_portal", "check_status", "completed"].indexOf(id);
    if (idx === -1) return false;
    // stage index mapping: order_recv=2, form_not=? treat as 3, form_sub=3, govt=4, check=5, completed=6
    const map: Record<string, number> = { order_recv: 2, form_not: 3, form_sub: 3, govt_portal: 4, check_status: 5, completed: 6 };
    return currentIdx > map[id];
  }

  // Filter ticket edge based on presence of open ticket
  const visibleEdges = EDGES.filter((e) => e.branch !== "ticket" || hasOpenTicket);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">
              Customer Journey — Live Path
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span>Current Stage:</span>
              <span className="font-semibold text-indigo-700">{currentStageLabel}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  closed ? "bg-rose-100 text-rose-700"
                  : phase === "technical_delay" ? "bg-sky-100 text-sky-800"
                  : phase === "customer_delay" ? "bg-amber-100 text-amber-800"
                  : phase === "form_not_submitted" ? "bg-amber-100 text-amber-800"
                  : phase === "awaiting_govt" || phase === "status_checked" ? "bg-violet-100 text-violet-800"
                  : completed ? "bg-emerald-100 text-emerald-800"
                  : "bg-indigo-100 text-indigo-800",
                )}
              >
                {closed ? <XCircle className="size-3" /> : <ClipboardCheck className="size-3" />}
                {live.subStateLabel}
              </span>
              {hasOpenTicket && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800">
                  <LifeBuoy className="size-3" /> Ticket open
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-500">
            <Legend cls="bg-emerald-500" label="Done" />
            <Legend cls="bg-indigo-500" label="Active" />
            <Legend cls="bg-amber-400" label="Delay" />
            <Legend cls="bg-rose-500" label="Closed" />
            <Legend cls="bg-slate-300" label="Idle" />
          </div>
        </header>

        {/* Flowchart canvas */}
        <div className="mt-4 overflow-x-auto pb-3">
          <div
            className="relative"
            style={{ width: CANVAS_W, height: CANVAS_H }}
          >
            {/* Background SVG for edges */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={CANVAS_W}
              height={CANVAS_H}
              viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            >
              <defs>
                {/* arrowheads per state */}
                {(["idle", "done", "active", "closed"] as const).map((s) => (
                  <marker
                    key={s}
                    id={`arrow-${s}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M 0 0 L 10 5 L 0 10 z"
                      className={
                        s === "done"   ? "fill-emerald-500"
                      : s === "active" ? "fill-indigo-500"
                      : s === "closed" ? "fill-rose-500"
                      :                  "fill-slate-300"
                      }
                    />
                  </marker>
                ))}
                <style>{`
                  @keyframes flowdash { to { stroke-dashoffset: -24; } }
                  .edge-active { animation: flowdash 1.2s linear infinite; }
                `}</style>
              </defs>

              {visibleEdges.map((e) => {
                const from = nodeById[e.from];
                const to   = nodeById[e.to];
                if (!from || !to) return null;
                const a = anchor(from, e.fromSide);
                const b = anchor(to,   e.toSide);
                const state = edgeState(e);
                const cls =
                  state === "done"   ? "stroke-emerald-500"
                : state === "active" ? "stroke-indigo-500 edge-active"
                : state === "closed" ? "stroke-rose-500 edge-active"
                :                      "stroke-slate-300";
                const strokeWidth = state === "idle" ? 1.5 : 2.5;
                const dash = state === "active" || state === "closed" ? "8 4"
                           : state === "idle" ? "4 4" : undefined;
                return (
                  <path
                    key={e.id}
                    d={pathD(a, b, e.mode, e.waypoints)}
                    fill="none"
                    className={cls}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={dash}
                    markerEnd={`url(#arrow-${state})`}
                  />
                );
              })}
            </svg>

            {/* Node overlay */}
            {NODES.map((n) => {
              const active = nodeIsActive(n.id);
              const done   = nodeIsDone(n.id);
              const btnCode = n.buttonCode;
              const enabled = btnCode ? gate(btnCode) : false;
              const isSent  = btnCode ? !enabled && !closed && !completed && enabledCodes.length > 0 && !enabledCodes.includes(btnCode) : false;
              const handler = btnCode ? buttonHandlers[btnCode] : undefined;

              // per-node countdown
              let countdown: React.ReactNode = null;
              if (n.id === "b01_reminder" && (activeBranches.has("form-nag")) && (formAutoCloseTimer || p.closureNextAt)) {
                countdown = (
                  <CountdownChip
                    firesAt={formAutoCloseTimer?.fires_at ?? formAutoCloseTimer?.firesAt ?? p.closureNextAt}
                    label="auto-close"
                  />
                );
              } else if (n.id === "b10_cust" && activeBranches.has("customer-delay") && (customerHoldTimer || p.closureNextAt)) {
                countdown = (
                  <CountdownChip
                    firesAt={customerHoldTimer?.fires_at ?? customerHoldTimer?.firesAt ?? p.closureNextAt}
                    label="auto-close"
                    paused={hasOpenTicket}
                  />
                );
              } else if (n.id === "b02_tech" && activeBranches.has("technical") && technicalHoldTimer) {
                countdown = (
                  <CountdownChip
                    firesAt={technicalHoldTimer.fires_at ?? technicalHoldTimer.firesAt}
                    label="reminder"
                  />
                );
              }

              return (
                <FlowNode
                  key={n.id}
                  node={n}
                  active={active}
                  done={done}
                  terminalCompleted={n.id === "completed" && completed}
                  terminalClosed={n.id === "closed_e010" && closed}
                  buttonEnabled={enabled}
                  buttonPending={!!handler?.pending}
                  buttonSent={isSent}
                  onButtonClick={handler?.onClick}
                  countdown={countdown}
                  phaseLabel={phase}
                  ticketOpen={n.id === "ticket_lane" && hasOpenTicket}
                  ticketNumber={n.id === "ticket_lane" ? openTicket?.ticket_number ?? (openTicket?.id ? String(openTicket.id).slice(0, 8) : null) : null}
                  ticketHref={n.id === "ticket_lane" && openTicket?.id ? `/admin/tickets/${openTicket.id}` : null}
                />
              );
            })}
          </div>
        </div>

        {/* Talk-to-expert + Force close bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
            {isTalkToExpert && (
              <button
                type="button"
                onClick={() => mutTalkExpert.mutate()}
                disabled={closed || completed || mutTalkExpert.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
              >
                <CheckCircle2 className="size-3.5" />
                Talk-to-Expert Completed (E009)
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-rose-800">
            <Mail className="size-3.5 text-rose-600" />
            <span className="font-bold">Force Close (E010)</span>
            <span className="text-rose-500">·</span>
            <span>Cancels timers · Requires Cat A reason.</span>
            <button
              type="button"
              onClick={() => setDialog({ kind: "force_close" })}
              disabled={closed}
              className="rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
            >
              Force Close
            </button>
          </div>
        </div>

        {/* Bottom status strip */}
        {(view.hasEngine && view.nextTimer && !closed) || closureArmed || closed ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
            {view.hasEngine && view.nextTimer && !closed && (
              <span><Clock className="mr-1 inline size-3" />Next auto-step: <b>{view.nextTimer.kind}</b> · {relativeIST(view.nextTimer.firesAt)}</span>
            )}
            {closureArmed && p.closureStage && (
              <span><AlertTriangle className="mr-1 inline size-3 text-amber-600" />Closure armed: <b>{p.closureStage}</b>{p.closureNextAt ? <> · fires {relativeIST(p.closureNextAt)}</> : null}</span>
            )}
            {closed && (
              <span><XCircle className="mr-1 inline size-3 text-rose-600" />Order closed{p.closureReasonLabel ? <> · <b>{p.closureReasonLabel}</b></> : null}</span>
            )}
          </div>
        ) : null}
      </section>

      {/* Dialogs */}
      <ExternalDelayDialog
        applicationId={p.applicationId}
        initialSide="customer"
        open={dialog?.kind === "customer_delay"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      <ExternalDelayDialog
        applicationId={p.applicationId}
        initialSide="internal"
        open={dialog?.kind === "technical_delay"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      <CloseOrderDialog
        applicationId={p.applicationId}
        open={dialog?.kind === "force_close"}
        onClose={() => { setDialog(null); invalidate(); }}
      />
      {dialog?.kind === "govt_rejected" && (
        <GovtRejectedInline
          orderId={p.applicationId}
          onClose={() => { setDialog(null); invalidate(); }}
        />
      )}
      <CompletionGateDialogStandalone
        open={dialog?.kind === "complete_with_cert"}
        onOpenChange={(v) => { if (!v) setDialog(null); }}
        orderId={p.applicationId}
        busy={false}
        onConfirm={async (payload) => {
          try {
            await fnUpdateFF({
              data: {
                orderId: p.applicationId,
                toStatus: "completed",
                certificateDocumentId: payload.certificateDocumentId,
                certificateNumber: payload.certificateNumber,
                completionNotes: payload.completionNotes,
              } as any,
            });
            toast.success("E007 sent — order completed with certificate");
            setDialog(null); invalidate();
          } catch (e: any) {
            toast.error(e?.message ?? "Completion failed");
          }
        }}
      />
    </div>
  );
}

/* ═════════════════════════ FlowNode ═════════════════════════ */

const TONE_STYLES: Record<Tone, { border: string; bg: string; text: string; icon: string; btn: string; ring: string }> = {
  slate:   { border: "border-slate-300",  bg: "bg-white",      text: "text-slate-700",  icon: "text-slate-500",  btn: "bg-slate-600 hover:bg-slate-700 text-white",   ring: "ring-slate-200" },
  amber:   { border: "border-amber-300",  bg: "bg-amber-50",   text: "text-amber-800",  icon: "text-amber-600",  btn: "bg-amber-500 hover:bg-amber-600 text-white",   ring: "ring-amber-200" },
  rose:    { border: "border-rose-300",   bg: "bg-rose-50",    text: "text-rose-800",   icon: "text-rose-600",   btn: "bg-rose-600 hover:bg-rose-700 text-white",     ring: "ring-rose-200" },
  sky:     { border: "border-sky-300",    bg: "bg-sky-50",     text: "text-sky-800",    icon: "text-sky-600",    btn: "bg-sky-600 hover:bg-sky-700 text-white",       ring: "ring-sky-200" },
  violet:  { border: "border-violet-300", bg: "bg-violet-50",  text: "text-violet-800", icon: "text-violet-600", btn: "bg-violet-600 hover:bg-violet-700 text-white", ring: "ring-violet-200" },
  emerald: { border: "border-emerald-300",bg: "bg-emerald-50", text: "text-emerald-800",icon: "text-emerald-600",btn: "bg-emerald-600 hover:bg-emerald-700 text-white",ring: "ring-emerald-200" },
  indigo:  { border: "border-indigo-300", bg: "bg-indigo-50",  text: "text-indigo-800", icon: "text-indigo-600", btn: "bg-indigo-600 hover:bg-indigo-700 text-white", ring: "ring-indigo-200" },
};

function FlowNode({
  node, active, done, terminalCompleted, terminalClosed,
  buttonEnabled, buttonPending, buttonSent, onButtonClick,
  countdown, phaseLabel, ticketOpen, ticketNumber, ticketHref,
}: {
  node: NodeDef;
  active: boolean;
  done: boolean;
  terminalCompleted: boolean;
  terminalClosed: boolean;
  buttonEnabled: boolean;
  buttonPending: boolean;
  buttonSent: boolean;
  onButtonClick?: () => void;
  countdown?: React.ReactNode;
  phaseLabel: string;
  ticketOpen: boolean;
  ticketNumber?: string | null;
  ticketHref?: string | null;
}) {
  const Icon = node.icon;
  const isAction = node.kind === "action";
  const isTerminal = node.kind === "terminal";

  // effective tone
  let tone: Tone = node.tone;
  if (terminalCompleted) tone = "emerald";
  else if (terminalClosed) tone = "rose";
  else if (done && node.kind === "stage") tone = "emerald";
  else if (!active && !done && node.kind === "stage") tone = "slate";
  else if (!active && node.kind === "action") tone = "slate";

  const t = TONE_STYLES[tone];
  const inactive = !active && !done && !terminalCompleted && !terminalClosed;

  return (
    <div
      className={cn(
        "absolute rounded-xl border shadow-sm transition-all",
        t.border, t.bg,
        active && "ring-2 shadow-md",
        active && t.ring,
        inactive && "opacity-70",
      )}
      style={{
        left: node.x,
        top: node.y,
        width: NODE_W,
        minHeight: isAction ? NODE_H + 34 : NODE_H,
      }}
    >
      {/* countdown floating above */}
      {countdown && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {countdown}
        </div>
      )}

      {/* header row */}
      <div className="flex items-center gap-1.5 px-2 pt-1.5">
        <span className={cn("grid size-6 place-items-center rounded-full border bg-white", t.border)}>
          {done && node.kind === "stage" ? <Check className={cn("size-3.5", t.icon)} />
          : <Icon className={cn("size-3.5", t.icon)} />}
        </span>
        {node.buttonCode && (
          <span className={cn(
            "rounded px-1 py-0.5 font-mono text-[9px] font-black tracking-wider",
            active ? "bg-white text-slate-700" : "bg-slate-100 text-slate-500",
          )}>
            {node.buttonCode}·{node.emailCode}
          </span>
        )}
        {active && !isTerminal && (
          <span className="ml-auto rounded-full bg-rose-600 px-1 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
            Live
          </span>
        )}
      </div>

      {/* label */}
      <div className={cn("px-2 py-1", t.text)}>
        <div className="text-[11px] font-bold leading-tight">{node.label}</div>
        {node.subtitle && (
          <div className="mt-0.5 text-[9px] font-medium leading-tight opacity-75">{node.subtitle}</div>
        )}
      </div>

      {/* action button */}
      {isAction && (
        <div className="px-2 pb-1.5">
          <button
            type="button"
            onClick={onButtonClick}
            disabled={!buttonEnabled || buttonPending}
            title={!buttonEnabled
              ? `${node.buttonCode} not available in phase "${phaseLabel}"`
              : node.label}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold shadow-sm transition disabled:cursor-not-allowed",
              buttonEnabled ? t.btn : "bg-slate-100 text-slate-500 border border-slate-200",
            )}
          >
            {buttonSent && <Check className="size-3" />}
            {buttonPending ? "Sending…" : buttonEnabled ? "Trigger" : buttonSent ? "Sent" : "Locked"}
          </button>
        </div>
      )}

      {/* ticket sub-lane extras */}
      {node.kind === "sub" && ticketOpen && (
        <div className="px-2 pb-1.5">
          <a
            href={ticketHref ?? "#"}
            className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-violet-600 px-1.5 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-violet-700"
          >
            #{ticketNumber} <ArrowRight className="size-3" />
          </a>
        </div>
      )}
      {node.kind === "sub" && !ticketOpen && (
        <div className="px-2 pb-1.5 text-[9px] italic text-slate-500">No open ticket</div>
      )}
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("inline-block size-2.5 rounded-full", cls)} />
      {label}
    </span>
  );
}

/* ─── Inline govt-rejected dialog ─── */

function GovtRejectedInline({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [reasonText, setReasonText] = useState("");
  const fn = useServerFn(handleGovtRejected);
  const listReasons = useServerFn(listCloseReasons);
  const [busy, setBusy] = useState(false);

  const { data: reasons = [] } = useQuery({
    queryKey: ["close-reasons-all"],
    queryFn: () => listReasons(),
    staleTime: 60_000,
  });
  const catB = (reasons as any[]).filter((r) => r.category === "B");
  const [reasonId, setReasonId] = useState<string | null>(null);

  const submit = async () => {
    if (!reasonId) return toast.error("Pick a Category B reason");
    setBusy(true);
    try {
      await fn({ data: { orderId, reasonId, remarks: reasonText || null } });
      toast.success("E008 sent — order closed (rejected)");
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-white p-5 shadow-xl space-y-3">
        <div className="font-bold text-slate-900">E008 — Application Rejected by Govt</div>
        <div className="text-xs text-slate-600">
          Sends E008 to the customer and force-closes this order (no resubmit loop).
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Reason (Category B)</label>
          <select
            value={reasonId ?? ""}
            onChange={(e) => setReasonId(e.target.value || null)}
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          >
            <option value="">Select a reason…</option>
            {catB.map((r: any) => (
              <option key={r.id} value={r.id}>B{r.number} — {r.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Extra remarks (optional)</label>
          <textarea
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            rows={3}
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} disabled={busy} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={submit} disabled={busy || !reasonId}
            className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
            Send E008 & Close
          </button>
        </div>
      </div>
    </div>
  );
}
