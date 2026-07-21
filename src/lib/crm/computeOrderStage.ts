// Single source of truth for the unified Order Workspace stage.
// Pure, client-safe. Derived from real DB columns — no new status field added.

import { isUnconvertedConsultationLead } from "./consultation";

export type OrderStage =
  | "lead_received"
  | "payment_pending"
  | "payment_done"
  | "consultation_pending"
  | "consultation_completed"
  | "form_submitted"
  | "under_review"
  | "in_progress"
  | "submitted_to_govt"
  | "under_processing"
  | "certificate_ready"
  | "completed"
  | "closed"
  | "uninterested"
  | "refund_requested"
  | "refunded";


export interface ComputeStageLead {
  lead_status_v2?: string | null;
  payment_successful_at?: string | null;
  status?: string | null;
  lead_source?: string | null;
  source?: string | null;
  service?: string | null;
  service_name?: string | null;
}

export interface ComputeStageApplication {
  form_submitted_at?: string | null;
  certificate_uploaded_at?: string | null;
  fulfillment_status?: string | null;
  application_status?: string | null;
}

export function computeOrderStage(
  lead: ComputeStageLead | null | undefined,
  application: ComputeStageApplication | null | undefined
): OrderStage {
  const leadStatus = lead?.lead_status_v2 ?? lead?.status ?? null;

  // Exception stages take precedence
  if (leadStatus === "refunded" || leadStatus === "closed_refunded") return "refunded";
  if (leadStatus === "refund_requested" || leadStatus === "refund_approved") return "refund_requested";
  if (leadStatus === "uninterested") return "uninterested";

  // Customer-side
  if (!lead?.payment_successful_at && leadStatus !== "payment_successful" && leadStatus !== "welcome_mail_sent") {
    if (leadStatus === "payment_pending" || leadStatus === "payment_failed") return "payment_pending";
    if (!application) return "lead_received";
  }

  if (!application) return "payment_done";

  // Employee-side, driven by fulfillment_status — terminal/late stages take
  // precedence over the form-submitted gate so the journey doesn't stall on
  // "Payment Done" if an order is force-completed without a customer form.
  const fs = application.fulfillment_status ?? "order_received";

  // Terminals
  if (fs === "completed" || fs === "order_completed" || application.application_status === "completed") return "completed";
  if (fs === "order_closed" || fs === "cancelled") return "closed";

  // S09/S10 near-terminals
  if (fs === "application_approved") return "certificate_ready";
  if (fs === "application_rejected" || fs === "certificate_rejected") return "submitted_to_govt";
  if (application.certificate_uploaded_at) return "certificate_ready";

  // S07 Government Processing (and legacy govt-side stages)
  if (fs === "government_processing" || fs === "application_submitted" || fs === "under_processing" || fs === "awaiting_govt") return "submitted_to_govt";

  // Legacy interim stages
  if (fs === "verification_pending") return "under_review";
  if (fs === "documents_received") return "in_progress";

  // S05/S06 delay stages keep the operator on form_submitted (main working stage)
  if (fs === "technical_delay" || fs === "customer_delay") return "form_submitted";
  if (fs === "consultation_completed") return "consultation_completed";

  if (application.application_status === "consultation_pending" || application.application_status === "consultation_scheduled" || isUnconvertedConsultationLead(lead)) {
    return "consultation_pending";
  }
  if (fs === "form_submitted") return "form_submitted";
  if (!application.form_submitted_at) return "payment_done";

  return "form_submitted";
}

// Display metadata. order: position on the journey strip (exception stages get -1).
export const STAGE_META: Record<
  OrderStage,
  { label: string; short: string; order: number; tone: "blue" | "amber" | "violet" | "indigo" | "emerald" | "rose" | "slate"; side: "customer" | "employee" | "exception" }
> = {
  lead_received:     { label: "Lead Received",      short: "Lead",       order: 0, tone: "blue",    side: "customer" },
  payment_pending:   { label: "Payment Pending",    short: "Payment",    order: 1, tone: "amber",   side: "customer" },
  payment_done:      { label: "Payment Done",       short: "Paid",       order: 2, tone: "emerald", side: "customer" },
  consultation_pending: { label: "Consultation Pending", short: "Consult", order: 3, tone: "amber", side: "employee" },
  consultation_completed: { label: "Consultation Completed", short: "Consult Done", order: 3, tone: "emerald", side: "employee" },
  form_submitted:    { label: "Form Submitted",     short: "Form",       order: 4, tone: "indigo",  side: "customer" },
  under_review:      { label: "Under Review",       short: "Review",     order: 5, tone: "violet",  side: "employee" },
  in_progress:       { label: "In Progress",        short: "Progress",   order: 6, tone: "violet",  side: "employee" },
  submitted_to_govt: { label: "Submitted to Govt",  short: "Govt",       order: 7, tone: "indigo",  side: "employee" },
  under_processing:  { label: "Under Processing",   short: "Processing", order: 8, tone: "violet",  side: "employee" },
  certificate_ready: { label: "Certificate Ready",  short: "Cert",       order: 9, tone: "emerald", side: "employee" },
  completed:         { label: "Completed",          short: "Done",       order: 10, tone: "emerald", side: "employee" },
  uninterested:      { label: "Uninterested",       short: "Uninterested", order: -1, tone: "rose", side: "exception" },
  refund_requested:  { label: "Refund Requested",   short: "Refund Req", order: -1, tone: "rose",   side: "exception" },
  refunded:          { label: "Refunded",           short: "Refunded",   order: -1, tone: "slate",  side: "exception" },
  closed:            { label: "Order Closed",       short: "Closed",     order: -1, tone: "rose",   side: "exception" },
};


// Stages shown on the horizontal journey strip, in order.
export const JOURNEY_STAGES: OrderStage[] = [
  "lead_received",
  "payment_done",
  "consultation_pending",
  "form_submitted",
  "under_review",
  "in_progress",
  "submitted_to_govt",
  "certificate_ready",
  "completed",
];

export const STAGE_BADGE_CLASS: Record<OrderStage, string> = {
  lead_received:     "bg-blue-100 text-blue-800 border-blue-200",
  payment_pending:   "bg-amber-100 text-amber-900 border-amber-200",
  payment_done:      "bg-emerald-100 text-emerald-800 border-emerald-200",
  consultation_pending: "bg-amber-100 text-amber-900 border-amber-200",
  form_submitted:    "bg-indigo-100 text-indigo-800 border-indigo-200",
  under_review:      "bg-violet-100 text-violet-800 border-violet-200",
  in_progress:       "bg-violet-100 text-violet-800 border-violet-200",
  submitted_to_govt: "bg-indigo-100 text-indigo-800 border-indigo-200",
  under_processing:  "bg-violet-100 text-violet-800 border-violet-200",
  certificate_ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed:         "bg-emerald-100 text-emerald-800 border-emerald-200",
  uninterested:      "bg-rose-100 text-rose-800 border-rose-200",
  refund_requested:  "bg-rose-100 text-rose-800 border-rose-200",
  refunded:          "bg-slate-200 text-slate-800 border-slate-300",
  closed:            "bg-rose-100 text-rose-800 border-rose-200",
};

