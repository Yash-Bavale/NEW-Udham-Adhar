// ─────────────────────────────────────────────────────────────────────────────
// Config-driven button state machine (B01–B10 + always-visible BX_* buttons).
// Single source of truth for "which buttons are active for the current status".
// The Journey Board reads NEXT_ACTIVE_BUTTONS[status] and ONLY those codes are
// enabled — everything else is hidden. Change per-status transitions here,
// no code changes needed in the UI.
// ─────────────────────────────────────────────────────────────────────────────

import type { OrderStatus } from "@/lib/orders/order-status.functions";

export type ButtonCode =
  | "B01" | "B02" | "B03" | "B04" | "B05"
  | "B06" | "B07" | "B08" | "B09" | "B10"
  | "BX_CLOSE" | "BX_REOPEN";

export type ActionKind =
  | "form_not_submitted"          // B01 → E002 + 8h auto-close
  | "technical_delay_start"       // B02 → E003 + Category B reason + reminder
  | "technical_delay_resolved"    // B03 → E011
  | "submit_to_govt"              // B04 / B07 → E005
  | "awaiting_govt_reminder"      // B05 → E006 + reminder (transitions AWAITING_GOVT_APPROVAL)
  | "status_checked_reminder"     // B06 → E006 + reminder (transitions CHECKING_STATUS)
  | "complete_with_cert"          // B08 → E007 (terminal COMPLETED)
  | "application_rejected"        // B09 → E008 (terminal CLOSED)
  | "customer_side_delay"         // B10 → E004 + Category A reason + 8h auto-close
  | "force_close"                 // BX_CLOSE → E004 manual (Category A picker)
  | "reopen_order";               // BX_REOPEN → state transition (email TBD)

export interface ButtonSpec {
  code: ButtonCode;
  label: string;
  emailCode: string | null;
  action: ActionKind;
  reasonCategory?: "A" | "B" | "C";
  terminal?: boolean;
  variant: "primary" | "outline" | "danger" | "success" | "warn";
  autoCloseHours?: number;
  /** Reminder cadence picker required (technical delay, awaiting govt). */
  requiresReminder?: boolean;
  /** Set when template row may not yet exist — trigger stubbed & flagged. */
  flagged?: string;
}

// ── Button catalog ──────────────────────────────────────────────────────────
export const BUTTON_CATALOG: Record<ButtonCode, ButtonSpec> = {
  B01: {
    code: "B01",
    label: "Form Not Submitted — Send Info Incomplete Mail",
    emailCode: "E002",
    action: "form_not_submitted",
    variant: "warn",
    autoCloseHours: 8,
  },
  B02: {
    code: "B02",
    label: "Technical Delay — Select Reason + Add Reminder",
    emailCode: "E003",
    action: "technical_delay_start",
    reasonCategory: "B",
    variant: "outline",
    requiresReminder: true,
  },
  B03: {
    code: "B03",
    label: "Technical Delay — Issue Resolved",
    emailCode: "E011",
    action: "technical_delay_resolved",
    variant: "success",
    flagged: "E011 template is new — verify the row exists in email_templates.",
  },
  B04: {
    code: "B04",
    label: "Consultation Completed / Application Submitted to Govt Portal",
    emailCode: "E005",
    action: "submit_to_govt",
    variant: "success",
  },
  B05: {
    code: "B05",
    label: "Application Submitted — Waiting for Govt Approval + Reminder",
    emailCode: "E006",
    action: "awaiting_govt_reminder",
    variant: "primary",
    requiresReminder: true,
  },
  B06: {
    code: "B06",
    label: "Application Status Checked — Awaiting Govt Response + Reminder",
    emailCode: "E006",
    action: "status_checked_reminder",
    variant: "primary",
    requiresReminder: true,
  },
  B07: {
    code: "B07",
    label: "Consultation Completed / Application Submitted (After Waiting)",
    emailCode: "E005",
    action: "submit_to_govt",
    variant: "success",
  },
  B08: {
    code: "B08",
    label: "Application Accepted — Upload PDF — Order Completed",
    emailCode: "E007",
    action: "complete_with_cert",
    variant: "success",
    terminal: true,
  },
  B09: {
    code: "B09",
    label: "Application Rejected — Select Reason — Order Closed",
    emailCode: "E008",
    action: "application_rejected",
    reasonCategory: "B",
    variant: "danger",
    terminal: true,
  },
  B10: {
    code: "B10",
    label: "Customer Side Delay — Select Reason + Reminder",
    emailCode: "E004",
    action: "customer_side_delay",
    reasonCategory: "A",
    variant: "warn",
    autoCloseHours: 8,
  },
  BX_CLOSE: {
    code: "BX_CLOSE",
    label: "Order Closed — Select Reason Manually",
    emailCode: "E004",
    action: "force_close",
    reasonCategory: "A",
    variant: "danger",
    terminal: true,
  },
  BX_REOPEN: {
    code: "BX_REOPEN",
    label: "Reopen / Restart Order",
    emailCode: null,
    action: "reopen_order",
    variant: "outline",
    flagged: "Reopen email template TBD — state transition wired now.",
  },
};

// ── Config flag: unresolved B10-resume set (see spec) ───────────────────────
// After B10 the customer replies and we resume — active buttons should be
// B02, B04, B05, B08, and then either B09 OR B10. Product hasn't confirmed
// which. Flip this constant to swap.
export const B10_RESUME_INCLUDES_B09 = false;
const B10_RESUME_SET: ButtonCode[] = [
  "B02", "B04", "B05", "B08",
  B10_RESUME_INCLUDES_B09 ? "B09" : "B10",
];

// The "Form Submitted" active set — reused for every status that logically
// maps to "form received, in processing".
const FORM_SUBMITTED_SET: ButtonCode[] = ["B02", "B04", "B05", "B08", "B10"];

// ── Status → next active buttons table ──────────────────────────────────────
// Any status NOT in this map falls through to an empty set (no active button).
// Two always-visible buttons (BX_CLOSE, BX_REOPEN) are appended by the renderer
// based on `terminal` state — never included here.
export const NEXT_ACTIVE_BUTTONS: Partial<Record<OrderStatus, ButtonCode[]>> = {
  // Pre-form
  NEW_ORDER:                  ["B01"],
  PAYMENT_RECEIVED:           ["B01"],
  ORDER_RECEIVED:             ["B01"],
  FORM_PENDING:               ["B01"],
  WAITING_CUSTOMER_INFO:      ["B01"],

  // Form Submitted family — B02, B04, B05, B08, B10
  FORM_RECEIVED:              FORM_SUBMITTED_SET,
  INFO_RECEIVED:              FORM_SUBMITTED_SET,
  IN_PROCESSING:              FORM_SUBMITTED_SET,
  HIGH_PRIORITY:              FORM_SUBMITTED_SET,
  REOPENED:                   FORM_SUBMITTED_SET,

  // Technical hold → only B03
  TECHNICAL_HOLD_EXTERNAL:    ["B03"],
  TECHNICAL_HOLD_INTERNAL:    ["B03"],
  OUR_SIDE_DELAY:             ["B03"],

  // Post B04 — submitted to govt
  SUBMITTED_TO_GOVT:          ["B08", "B09"],

  // Post B05 — awaiting govt approval
  AWAITING_GOVT_APPROVAL:     ["B06", "B07", "B08", "B09", "B10"],

  // Post B06 — status checked
  CHECKING_STATUS:            ["B07", "B08", "B09", "B10"],

  // Post B10 — customer hold
  CUSTOMER_HOLD:              B10_RESUME_SET,

  // Terminals
  COMPLETED:                  [],
  CLOSED:                     [],
  CERTIFICATE_ISSUED:         ["B08"],
  REFUND_REQUESTED:           [],
  REFUND_APPROVED:            [],
  REFUND_PROCESSED:           [],
};

export function getActiveButtonCodes(status: OrderStatus | null | undefined): ButtonCode[] {
  if (!status) return [];
  return NEXT_ACTIVE_BUTTONS[status] ?? [];
}

export function isTerminalStatus(status: OrderStatus | null | undefined): boolean {
  return status === "COMPLETED" || status === "CLOSED" || status === "REFUND_PROCESSED";
}

/**
 * Compute the final visible button list for a status:
 *   - Active state-driven buttons from NEXT_ACTIVE_BUTTONS
 *   - Always-visible BX_CLOSE (hidden on terminal states)
 *   - Always-visible BX_REOPEN (only on terminal states)
 */
export function getVisibleButtons(status: OrderStatus | null | undefined): ButtonSpec[] {
  const codes = getActiveButtonCodes(status);
  const terminal = isTerminalStatus(status);
  const list: ButtonCode[] = [...codes];
  if (!terminal) list.push("BX_CLOSE");
  if (terminal) list.push("BX_REOPEN");
  return list.map((c) => BUTTON_CATALOG[c]);
}
