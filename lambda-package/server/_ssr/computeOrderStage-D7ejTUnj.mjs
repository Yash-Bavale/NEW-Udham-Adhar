import { i as isUnconvertedConsultationLead } from "./consultation-asWR5IET.mjs";
function computeOrderStage(lead, application) {
  const leadStatus = lead?.lead_status_v2 ?? lead?.status ?? null;
  if (leadStatus === "refunded" || leadStatus === "closed_refunded" || leadStatus === "refund_approved" || application?.fulfillment_status === "refunded" || Boolean(application?.refund_processed_at) || application?.closure_stage === "refund_approved" || Boolean(application?.refund_approved_at) || application?.workflow_status === "refund_closed" || application?.refund_status === "approved" || application?.refund_status === "processed") {
    return "refunded";
  }
  if (leadStatus === "refund_requested" || application?.workflow_status === "refund_review" || application?.closure_stage === "refund_requested" || application?.refund_status === "pending" || application?.refund_status === "info_needed" || application?.refund_status === "escalated") {
    return "refund_requested";
  }
  if (leadStatus === "uninterested") return "uninterested";
  if (!lead?.payment_successful_at && leadStatus !== "payment_successful" && leadStatus !== "welcome_mail_sent") {
    if (leadStatus === "payment_pending" || leadStatus === "payment_failed") return "payment_pending";
    if (!application) return "lead_received";
  }
  if (!application) return "payment_done";
  const fs = application.fulfillment_status ?? "order_received";
  const ws = application.workflow_status ?? "";
  const os = application.order_status ?? "";
  if (fs === "completed" || fs === "order_completed" || fs === "certificate_delivered" || fs === "service_completed" || application?.application_status === "completed" || os === "COMPLETED" || ws === "completed" || ws === "order_completed") return "completed";
  if (fs === "order_closed" || fs === "cancelled" || ws === "closed" || application?.application_status === "closed" || application?.closure_stage === "closed" || application?.closure_stage === "final_ticket_closed" || os === "CLOSED") return "closed";
  if (fs === "order_reopened" || ws === "order_reopened" || application.application_status === "order_reopened" || os === "REOPENED") {
    return "order_reopened";
  }
  if (fs === "application_approved") return "certificate_ready";
  if (fs === "application_rejected" || fs === "certificate_rejected") return "submitted_to_govt";
  if (fs === "certificate_ready" || fs === "certificate_uploaded") return "certificate_ready";
  if (fs === "government_processing" || fs === "application_submitted" || fs === "under_processing" || fs === "awaiting_govt") return "submitted_to_govt";
  if (fs === "verification_pending") return "under_review";
  if (fs === "documents_received") return "in_progress";
  if (fs === "customer_delay" || fs === "customer_hold" || ws === "customer_delay" || ws === "waiting_for_customer" || ws === "waiting_for_documents" || ws === "customer_non_responsive" || ws === "external_dependency" || os === "CUSTOMER_HOLD" || Boolean(application?.customer_hold_started_at)) {
    return "customer_delay";
  }
  if (fs === "technical_delay" || fs === "technical_hold" || ws === "technical_delay" || ws === "government_portal_pending" || ws === "technical_hold" || os.includes("TECHNICAL_HOLD") || Boolean(application?.technical_hold_started_at) && !Boolean(application?.customer_hold_started_at)) {
    return "technical_delay";
  }
  if (fs === "consultation_completed") return "consultation_completed";
  if (application.application_status === "consultation_pending" || application.application_status === "consultation_scheduled" || isUnconvertedConsultationLead(lead)) {
    return "consultation_pending";
  }
  if (fs === "form_submitted") return "form_submitted";
  if (["waiting_for_customer_submission", "awaiting_customer_form", "form_not_submitted", "form_pending", "waiting_customer", "customer_form_pending"].includes(fs)) return "form_not_submitted";
  if (!application.form_submitted_at) return "payment_done";
  return "form_submitted";
}
const STAGE_META = {
  lead_received: { label: "Lead Received", short: "Lead", order: 0, tone: "blue", side: "customer" },
  payment_pending: { label: "Payment Pending", short: "Payment", order: 1, tone: "amber", side: "customer" },
  payment_done: { label: "Incomplete Form", short: "Incomplete", order: 2, tone: "emerald", side: "customer" },
  form_not_submitted: { label: "Form Not Submitted Delay", short: "Form Pending", order: 3, tone: "amber", side: "customer" },
  order_reopened: { label: "Order Reopened", short: "Reopened", order: 4, tone: "violet", side: "employee" },
  customer_delay: { label: "Customer Delay", short: "Delay", order: 4, tone: "amber", side: "customer" },
  technical_delay: { label: "Technical Delay", short: "Tech Delay", order: 4, tone: "sky", side: "employee" },
  consultation_pending: { label: "Consultation Pending", short: "Consult", order: 3, tone: "amber", side: "employee" },
  consultation_completed: { label: "Consultation Completed", short: "Consult Done", order: 3, tone: "emerald", side: "employee" },
  form_submitted: { label: "Form Submitted", short: "Form", order: 4, tone: "indigo", side: "customer" },
  under_review: { label: "Under Review", short: "Review", order: 5, tone: "violet", side: "employee" },
  in_progress: { label: "In Progress", short: "Progress", order: 6, tone: "violet", side: "employee" },
  submitted_to_govt: { label: "Submitted to Govt", short: "Govt", order: 7, tone: "indigo", side: "employee" },
  under_processing: { label: "Under Processing", short: "Processing", order: 8, tone: "violet", side: "employee" },
  certificate_ready: { label: "Certificate Ready", short: "Cert", order: 9, tone: "emerald", side: "employee" },
  completed: { label: "Completed", short: "Done", order: 10, tone: "emerald", side: "employee" },
  uninterested: { label: "Uninterested", short: "Uninterested", order: -1, tone: "rose", side: "exception" },
  refund_requested: { label: "Refund Requested", short: "Refund Req", order: -1, tone: "rose", side: "exception" },
  refunded: { label: "Refunded", short: "Refunded", order: -1, tone: "slate", side: "exception" },
  closed: { label: "Order Closed", short: "Closed", order: -1, tone: "rose", side: "exception" }
};
const STAGE_BADGE_CLASS = {
  lead_received: "bg-blue-100 text-blue-800 border-blue-200",
  payment_pending: "bg-amber-100 text-amber-900 border-amber-200",
  payment_done: "bg-emerald-100 text-emerald-800 border-emerald-200",
  form_not_submitted: "bg-amber-100 text-amber-900 border-amber-200",
  order_reopened: "bg-violet-100 text-violet-800 border-violet-200",
  customer_delay: "bg-amber-100 text-amber-900 border-amber-200",
  technical_delay: "bg-sky-100 text-sky-800 border-sky-200",
  consultation_pending: "bg-amber-100 text-amber-900 border-amber-200",
  consultation_completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  form_submitted: "bg-indigo-100 text-indigo-800 border-indigo-200",
  under_review: "bg-violet-100 text-violet-800 border-violet-200",
  in_progress: "bg-violet-100 text-violet-800 border-violet-200",
  submitted_to_govt: "bg-indigo-100 text-indigo-800 border-indigo-200",
  under_processing: "bg-violet-100 text-violet-800 border-violet-200",
  certificate_ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  uninterested: "bg-rose-100 text-rose-800 border-rose-200",
  refund_requested: "bg-rose-100 text-rose-800 border-rose-200",
  refunded: "bg-slate-200 text-slate-800 border-slate-300",
  closed: "bg-rose-100 text-rose-800 border-rose-200"
};
export {
  STAGE_META as S,
  STAGE_BADGE_CLASS as a,
  computeOrderStage as c
};
