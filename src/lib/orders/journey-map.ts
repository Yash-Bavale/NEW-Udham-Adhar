// Single source of truth for the 7-stage happy path + sub-branches shown
// in the CustomerJourneyMap. Pure config — no React, no side effects.
//
// Mirrors the flowchart in Business_Help_Services_Order_and_Support_Ticket
// _Flow_Chart_Button.drawio.html supplied by the user.

import type { OrderStage } from "@/lib/crm/computeOrderStage";

export type JourneyStageKey =
  | "lead_received"
  | "payment_received"
  | "order_received"
  | "form_submitted"
  | "app_submitted"
  | "check_status"
  | "completed";

export interface JourneyStageDef {
  key: JourneyStageKey;
  label: string;
  short: string;
}

export const JOURNEY_STAGES: JourneyStageDef[] = [
  { key: "lead_received",     label: "Lead Received",              short: "Lead" },
  { key: "payment_received",  label: "Payment Received",           short: "Payment" },
  { key: "order_received",    label: "Order Received",             short: "Order" },
  { key: "form_submitted",    label: "Form Submitted",             short: "Form" },
  { key: "app_submitted",     label: "Application Submitted to Govt", short: "Govt Portal" },
  { key: "check_status",      label: "Check Final Status on Govt", short: "Final Status" },
  { key: "completed",         label: "Order Completed",            short: "Completed" },
];

/** Map current OrderStage → happy-path stage index for highlighting.
 * Note: once payment is successful the order automatically advances to
 * "Order Received" (index 2). "Payment Received" (index 1) is only ever
 * the live stage while payment is still pending. */
export function stageToJourneyIndex(stage: OrderStage): number {
  switch (stage) {
    case "lead_received":
      return 0;
    case "payment_pending":
      return 1;
    case "payment_done":
    case "consultation_pending":
      return 2;
    case "form_submitted":
    case "in_progress":
    case "under_review":
      return 3;
    case "submitted_to_govt":
      return 4;
    case "under_processing":
    case "certificate_ready":
      return 5;
    case "completed":
      return 6;
    default:
      return 2; // order_received default
  }
}


export type JourneyTrack = "main" | "delay" | "closure" | "ticket";

export interface JourneyBranch {
  key: string;
  parentStage: JourneyStageKey;
  track: JourneyTrack;
  title: string;
  tone: "amber" | "rose" | "sky" | "violet" | "emerald";
  description: string;
  buttons: JourneyBranchButton[];
}


export interface JourneyBranchButton {
  key: string;
  label: string;
  emailCode: string;             // E001…E010, T001…T003, R001
  action: JourneyActionKind;
  reasonCategory?: "A" | "B" | "C";
  variant?: "primary" | "outline" | "danger" | "success";
  serviceOnly?: "talk_to_expert"; // hide unless order's service matches
}

export type JourneyActionKind =
  | "send_form_link"           // E002
  | "customer_delay"           // E004 + Cat A picker
  | "technical_delay"          // E003 + Cat B picker
  | "submit_to_govt"           // E005
  | "reminder_e006"            // E006 + employee reminder
  | "complete_with_cert"       // E007
  | "application_rejected"     // E008 + govt rejected close
  | "talk_to_expert_done"      // E009
  | "force_close"              // E010 + Cat A picker
  | "ticket_normal_close"      // T001 normal
  | "ticket_restart_order"     // T001 restart
  | "ticket_consultation_done" // T001 consultation
  | "ticket_reply_reason";     // T002 → T003 8h auto-close

export const JOURNEY_BRANCHES: JourneyBranch[] = [
  {
    key: "form-not-submitted",
    track: "delay",
    parentStage: "order_received",
    title: "Form Not Submitted",
    tone: "amber",
    description:
      "Send E002 → arms 8-hour auto-close with reason A7 (Required Documents or Communication Not Received).",
    buttons: [
      {
        key: "e002",
        label: "Send Form Link / Reminder",
        emailCode: "E002",
        action: "send_form_link",
        variant: "primary",
      },
    ],
  },
  {
    key: "customer-side-delay",
    track: "delay",
    parentStage: "form_submitted",
    title: "Customer-Side Delay",
    tone: "amber",
    description: "Pick a Category A reason. Sends E004 with the standard reply.",
    buttons: [
      {
        key: "e004",
        label: "Send E004 (Customer Delay)",
        emailCode: "E004",
        action: "customer_delay",
        reasonCategory: "A",
        variant: "outline",
      },
    ],
  },
  {
    key: "technical-delay",
    track: "delay",
    parentStage: "form_submitted",
    title: "Technical / External Delay",
    tone: "sky",
    description: "Pick a Category B reason. Sends E003 with the standard reply.",
    buttons: [
      {
        key: "e003",
        label: "Send E003 (Technical Delay)",
        emailCode: "E003",
        action: "technical_delay",
        reasonCategory: "B",
        variant: "outline",
      },
    ],
  },
  {
    key: "app-submitted-actions",
    track: "main",
    parentStage: "app_submitted",
    title: "After Application Submitted to Govt",
    tone: "violet",
    description:
      "Either close the loop with E005, or send E006 + add a reminder for yourself to check the final status.",
    buttons: [
      {
        key: "e005",
        label: "Send E005 — Complete Submission",
        emailCode: "E005",
        action: "submit_to_govt",
        variant: "success",
      },
      {
        key: "e006",
        label: "Send E006 + Add Reminder",
        emailCode: "E006",
        action: "reminder_e006",
        variant: "outline",
      },
    ],
  },
  {
    key: "final-status-actions",
    track: "main",
    parentStage: "check_status",
    title: "Check Final Application Status",
    tone: "emerald",
    description: "Final outcome from the govt portal.",
    buttons: [
      {
        key: "e007",
        label: "E007 — Accepted + Attach PDF",
        emailCode: "E007",
        action: "complete_with_cert",
        variant: "success",
      },
      {
        key: "e008",
        label: "E008 — Application Rejected",
        emailCode: "E008",
        action: "application_rejected",
        reasonCategory: "B",
        variant: "danger",
      },
      {
        key: "e006-again",
        label: "Add Reminder Again",
        emailCode: "E006",
        action: "reminder_e006",
        variant: "outline",
      },
    ],
  },
  {
    key: "talk-to-expert",
    track: "main",
    parentStage: "completed",
    title: "Talk-to-Expert Service",
    tone: "violet",
    description: "Only shown for orders whose service = Talk to Expert.",
    buttons: [
      {
        key: "e009",
        label: "E009 — Consultation Completed",
        emailCode: "E009",
        action: "talk_to_expert_done",
        variant: "success",
        serviceOnly: "talk_to_expert",
      },
    ],
  },
];

export const FORCE_CLOSE_BUTTON: JourneyBranchButton = {
  key: "force-close",
  label: "Force Close (E010)",
  emailCode: "E010",
  action: "force_close",
  reasonCategory: "A",
  variant: "danger",
};

export const TICKET_BUTTONS: JourneyBranchButton[] = [
  {
    key: "t001-normal",
    label: "T001 — Normal Close / No Action",
    emailCode: "T001",
    action: "ticket_normal_close",
    variant: "outline",
  },
  {
    key: "t001-restart",
    label: "T001 — Restart Order",
    emailCode: "T001",
    action: "ticket_restart_order",
    variant: "outline",
  },
  {
    key: "t001-consult",
    label: "T001 — Consultation / Support Completed",
    emailCode: "T001",
    action: "ticket_consultation_done",
    variant: "success",
  },
  {
    key: "t002-reason",
    label: "T002 — Reply w/ Reason (8h auto-close)",
    emailCode: "T002",
    action: "ticket_reply_reason",
    reasonCategory: "A",
    variant: "danger",
  },
];

/** Closure-track buttons (E008 govt reject, T002 reply-reason). Force-close
 * is exported separately because it's the always-visible red button. */
export const CLOSURE_BUTTONS: JourneyBranchButton[] = [
  {
    key: "e008-closure",
    label: "E008 — Application Rejected (Close)",
    emailCode: "E008",
    action: "application_rejected",
    reasonCategory: "B",
    variant: "danger",
  },
  {
    key: "t002-closure",
    label: "T002 — Reply w/ Reason (8h auto-close)",
    emailCode: "T002",
    action: "ticket_reply_reason",
    reasonCategory: "A",
    variant: "outline",
  },
];

/** Map workflowStatus → live delay branch key (for highlighting). */
export function getActiveDelayBranchKey(workflowStatus?: string | null): string | null {
  if (!workflowStatus) return null;
  if (/customer_hold|customer_side|customer_delay|waiting_for_customer|external_dependency/i.test(workflowStatus)) return "customer-side-delay";
  if (/technical_hold|external_delay|govt_delay|technical_delay|government_portal_pending/i.test(workflowStatus)) return "technical-delay";
  if (/form_pending|awaiting_form|form_not_submitted/i.test(workflowStatus)) return "form-not-submitted";
  return null;
}

/* ─────────────────────── Live-state derivation ─────────────────────── */

export type JourneyLiveSubKey =
  | "form-not-submitted"
  | "technical-delay"
  | "customer-delay"
  | "govt-awaiting"
  | "govt-rejected"
  | "force-closed"
  | null;

export interface JourneyLiveState {
  currentMainIndex: number;
  activeSubKey: JourneyLiveSubKey;
  terminal: "completed" | "closed" | null;
  reasonCode: string | null;
  subStateLabel: string;
}

export function deriveJourneyLiveState(input: {
  stage: OrderStage;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureReasonLabel?: string | null;
}): JourneyLiveState {
  const idx = stageToJourneyIndex(input.stage);
  const closureStageValue = (input.closureStage ?? "").toLowerCase();
  const isClosed = /^(closed|auto_closed|force_closed|order_closed)$/.test(closureStageValue);
  const isCompleted = input.stage === "completed";
  const ws = (input.workflowStatus ?? "").toLowerCase();
  const reasonMatch = (input.closureReasonLabel ?? "").match(/\b([ABC]\d{1,2})\b/i);
  const reasonCode = reasonMatch ? reasonMatch[1].toUpperCase() : null;

  let activeSubKey: JourneyLiveSubKey = null;
  if (/form_pending|awaiting_form|form_not_submitted/.test(ws) || (idx === 2 && !ws && !isClosed)) {
    activeSubKey = "form-not-submitted";
  } else if (/customer_hold|customer_side|customer_delay|waiting_for_customer|external_dependency/.test(ws)) {
    activeSubKey = "customer-delay";
  } else if (/technical_hold|external_delay|govt_delay|technical_delay|government_portal_pending/.test(ws)) {
    activeSubKey = "technical-delay";
  } else if (idx === 4 || idx === 5) {
    activeSubKey = "govt-awaiting";
  }
  if (isClosed) {
    activeSubKey = reasonCode?.startsWith("B") ? "govt-rejected" : "force-closed";
  }

  let subStateLabel = "In progress";
  if (isClosed) subStateLabel = `Closed${reasonCode ? ` · ${reasonCode}` : ""}`;
  else if (activeSubKey === "form-not-submitted") subStateLabel = "Form Not Submitted";
  else if (activeSubKey === "customer-delay") subStateLabel = `Customer Delay${reasonCode ? ` (${reasonCode})` : ""}`;
  else if (activeSubKey === "technical-delay") subStateLabel = `Technical Delay${reasonCode ? ` (${reasonCode})` : ""}`;
  else if (activeSubKey === "govt-awaiting") subStateLabel = "Awaiting Govt Response";
  else if (isCompleted) subStateLabel = "Completed";

  return {
    currentMainIndex: idx,
    activeSubKey,
    terminal: isClosed ? "closed" : isCompleted ? "completed" : null,
    reasonCode,
    subStateLabel,
  };
}


/* ─────────────────── Journey Phase → Button gating ─────────────────── */

export type ButtonCode =
  | "B01" | "B02" | "B03" | "B04" | "B05"
  | "B06" | "B07" | "B08" | "B09" | "B10";

export type JourneyPhase =
  | "form_not_submitted"
  | "form_submitted"
  | "technical_delay"
  | "customer_delay"
  | "consultation_done"
  | "awaiting_govt"
  | "status_checked"
  | "post_wait_submitted"
  | "completed"
  | "closed";

export const POST_B10_ALLOWED: ButtonCode[] = [];

export const PHASE_ENABLED_BUTTONS: Record<JourneyPhase, ButtonCode[]> = {
  form_not_submitted:  ["B01"],
  form_submitted:      ["B02", "B04", "B05", "B08", "B10"],
  technical_delay:     ["B03"],
  customer_delay:      POST_B10_ALLOWED,
  consultation_done:   ["B08", "B09"],
  awaiting_govt:       ["B06", "B07", "B08", "B09", "B10"],
  status_checked:      ["B07", "B08", "B09", "B10"],
  post_wait_submitted: ["B08", "B09"],
  completed:           [],
  closed:              [],
};

export interface DerivePhaseInput {
  stage: OrderStage;
  workflowStatus?: string | null;
  closureStage?: string | null;
  closureReasonLabel?: string | null;
  /** Number of E006 (reminder) emails/events sent for this order. */
  reminderCount?: number;
  /** True once B07 has been pressed (persisted client-side per order). */
  postWaitSubmitted?: boolean;
}

/**
 * Map current order state → single JourneyPhase used to gate buttons.
 * Pure. Client-safe.
 */
export function derivePhase(i: DerivePhaseInput): JourneyPhase {
  const live = deriveJourneyLiveState({
    stage: i.stage,
    workflowStatus: i.workflowStatus,
    closureStage: i.closureStage,
    closureReasonLabel: i.closureReasonLabel,
  });
  if (live.terminal === "closed") return "closed";
  if (live.terminal === "completed") return "completed";
  if (live.activeSubKey === "technical-delay") return "technical_delay";
  if (live.activeSubKey === "customer-delay") return "customer_delay";
  if (live.activeSubKey === "form-not-submitted") return "form_not_submitted";

  const stage = (i.stage ?? "").toLowerCase();
  const inGovtFlow = /submitted_to_govt|processing|certificate|check|final/.test(stage);

  if (inGovtFlow) {
    if (i.postWaitSubmitted) return "post_wait_submitted";
    const r = i.reminderCount ?? 0;
    if (r <= 0) return "consultation_done";
    if (r === 1) return "awaiting_govt";
    return "status_checked";
  }

  return "form_submitted";
}



