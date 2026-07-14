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


/**
 * Sub-branch definitions attached under a specific happy-path stage.
 * Every branch is always visible; buttons are always clickable regardless
 * of the current stage (per user spec).
 */
export interface JourneyBranch {
  key: string;
  parentStage: JourneyStageKey;
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
