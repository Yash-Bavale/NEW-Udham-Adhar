const LEAD_STATUSES_V2 = [
  "new_lead",
  "contacted",
  "follow_up_required",
  "payment_pending",
  "payment_failed",
  "payment_successful",
  "welcome_mail_sent",
  "documents_pending",
  "under_process",
  "uninterested",
  "refund_requested",
  "refund_approved",
  "refunded",
  "closed",
  "closed_refunded"
];
const LEAD_TRANSITIONS_V2 = {
  new_lead: ["contacted", "follow_up_required", "payment_pending"],
  contacted: ["new_lead", "follow_up_required", "payment_pending", "payment_successful", "uninterested"],
  follow_up_required: ["contacted", "payment_pending", "uninterested"],
  payment_pending: ["payment_successful", "payment_failed", "uninterested"],
  payment_failed: ["payment_pending", "uninterested", "closed"],
  payment_successful: ["welcome_mail_sent", "documents_pending", "under_process"],
  welcome_mail_sent: ["documents_pending"],
  documents_pending: ["under_process", "uninterested"],
  under_process: ["closed"],
  // gated server-side by fulfillment_status='completed'
  uninterested: ["refund_requested"],
  refund_requested: ["refund_approved", "closed"],
  refund_approved: ["refunded"],
  refunded: ["closed_refunded"],
  closed: [],
  closed_refunded: []
};
const LEAD_STATUS_EMAIL = {
  payment_successful: "order_confirmation",
  refunded: "refund_processed_confirmation",
  closed_refunded: "refund_processed_confirmation"
};
const LEAD_AUTO_CHAIN = {
  refunded: "closed_refunded"
};
export {
  LEAD_STATUSES_V2 as L,
  LEAD_TRANSITIONS_V2 as a,
  LEAD_AUTO_CHAIN as b,
  LEAD_STATUS_EMAIL as c
};
