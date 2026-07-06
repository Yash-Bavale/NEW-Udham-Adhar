// Single source of truth mapping every OrderStage → the ONE primary action
// the employee should take next, plus the exception actions available.
// Pure/client-safe. Consumed by <OrderActionRail />.

import type { OrderStage } from "./computeOrderStage";
import type { FulfillmentStatus } from "./fulfillment-transitions";

export type ExceptionKind =
  | "our_side_delay"
  | "customer_hold"
  | "request_docs"
  | "cancel_refund"
  | "mark_uninterested";

export interface StageActionSpec {
  /** Short instruction under CURRENT STAGE header */
  hint: string;
  /** Label for the single primary CTA. `null` = read-only stage. */
  primary: string | null;
  /** How the primary CTA is fulfilled by the ActionRail. */
  primaryKind:
    | "advance_fulfillment"       // uses updateFulfillmentStatus → next allowed
    | "complete_with_cert"         // opens CompletionGateDialog
    | "open_lead"                  // navigates to /admin/leads/:leadId
    | "open_consultation_tab"      // switches to Employee Workflow tab (consultation panel)
    | "open_form_tab"              // switches to Forms & Docs tab
    | "none";
  exceptions: ExceptionKind[];
}

/**
 * Every OrderStage MUST have an entry here — no empty states.
 * Aligned with the All Mail Auto Flow doc.
 */
export const STAGE_ACTIONS: Record<OrderStage, StageActionSpec> = {
  lead_received: {
    hint: "Lead has not paid yet. Send or resend the payment link from the lead page.",
    primary: "Open Lead — Send Payment Link",
    primaryKind: "open_lead",
    exceptions: ["mark_uninterested"],
  },
  payment_pending: {
    hint: "Payment link sent — waiting for customer. Resend from the lead page if needed.",
    primary: "Open Lead — Resend Payment",
    primaryKind: "open_lead",
    exceptions: ["mark_uninterested", "cancel_refund"],
  },
  payment_done: {
    hint: "Payment received. Move to documents once the customer submits the form.",
    primary: "Mark Documents Received",
    primaryKind: "advance_fulfillment",
    exceptions: ["our_side_delay", "customer_hold", "request_docs", "cancel_refund"],
  },
  consultation_pending: {
    hint: "Consultation lead — convert to a paid order once the customer picks a service.",
    primary: "Convert Consultation",
    primaryKind: "open_consultation_tab",
    exceptions: ["mark_uninterested", "cancel_refund"],
  },
  form_submitted: {
    hint: "Customer form submitted. Verify documents and move forward.",
    primary: "Mark Documents Received",
    primaryKind: "advance_fulfillment",
    exceptions: ["our_side_delay", "customer_hold", "request_docs", "cancel_refund"],
  },
  in_progress: {
    hint: "Documents received. Send for verification.",
    primary: "Move to Verification",
    primaryKind: "advance_fulfillment",
    exceptions: ["our_side_delay", "customer_hold", "request_docs", "cancel_refund"],
  },
  under_review: {
    hint: "Verify all fields and documents, then submit to the government portal.",
    primary: "Submit to Govt Portal",
    primaryKind: "advance_fulfillment",
    exceptions: ["our_side_delay", "customer_hold", "request_docs", "cancel_refund"],
  },
  submitted_to_govt: {
    hint: "Submitted to Govt. Move to processing once the portal acknowledges.",
    primary: "Move to Under Processing",
    primaryKind: "advance_fulfillment",
    exceptions: ["our_side_delay", "customer_hold", "cancel_refund"],
  },
  under_processing: {
    hint: "Portal is processing. Upload the certificate when it arrives.",
    primary: "Mark Certificate Issued",
    primaryKind: "complete_with_cert",
    exceptions: ["our_side_delay", "customer_hold", "cancel_refund"],
  },
  certificate_ready: {
    hint: "Certificate uploaded. Complete the order to email it to the customer.",
    primary: "Complete & Send Certificate",
    primaryKind: "advance_fulfillment",
    exceptions: ["our_side_delay", "cancel_refund"],
  },
  completed: {
    hint: "Order completed. Certificate delivered.",
    primary: null,
    primaryKind: "none",
    exceptions: [],
  },
  uninterested: {
    hint: "Lead marked uninterested. Re-engage from the lead page if needed.",
    primary: null,
    primaryKind: "none",
    exceptions: [],
  },
  refund_requested: {
    hint: "Refund is in the cancellation workflow. Manage below.",
    primary: null,
    primaryKind: "none",
    exceptions: [],
  },
  refunded: {
    hint: "Order refunded and closed.",
    primary: null,
    primaryKind: "none",
    exceptions: [],
  },
};

export const EXCEPTION_META: Record<
  ExceptionKind,
  { label: string; tone: "amber" | "slate" | "indigo" | "rose"; icon: "warn" | "pause" | "paperclip" | "x" | "ban" }
> = {
  our_side_delay:    { label: "Our-Side Delay",    tone: "amber",  icon: "warn" },
  customer_hold:     { label: "Customer Hold",     tone: "slate",  icon: "pause" },
  request_docs:      { label: "Request Docs",      tone: "indigo", icon: "paperclip" },
  cancel_refund:     { label: "Cancel / Refund",   tone: "rose",   icon: "x" },
  mark_uninterested: { label: "Mark Uninterested", tone: "rose",   icon: "ban" },
};

export function getStageActions(stage: OrderStage): StageActionSpec {
  return STAGE_ACTIONS[stage];
}

/**
 * Human "Next: ..." nudge — kept in sync with the automation doc.
 * Falls back to the stage hint when no fulfillment mapping applies.
 */
export function nextStepText(stage: OrderStage, current: FulfillmentStatus | null): string {
  return STAGE_ACTIONS[stage].hint;
}
