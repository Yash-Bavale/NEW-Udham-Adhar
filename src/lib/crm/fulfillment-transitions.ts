// Pure shared map for the Order/Fulfillment workflow.
// Stages mirror the `fulfillment_status_enum` DB type exactly.

export type FulfillmentStatus =
  | "order_received"
  | "documents_received"
  | "verification_pending"
  | "application_submitted"
  | "under_processing"
  | "completed"
  | "cancelled";

export const FULFILLMENT_STAGES: FulfillmentStatus[] = [
  "order_received",
  "documents_received",
  "verification_pending",
  "application_submitted",
  "under_processing",
  "completed",
];

export const FULFILLMENT_LABEL: Record<FulfillmentStatus, string> = {
  order_received:        "Order Received",
  documents_received:    "Documents Received",
  verification_pending:  "Verification Pending",
  application_submitted: "Application Submitted",
  under_processing:      "Under Processing",
  completed:             "Completed",
  cancelled:             "Cancelled",
};

export const FULFILLMENT_BADGE: Record<FulfillmentStatus, string> = {
  order_received:        "bg-slate-100 text-slate-700 border-slate-200",
  documents_received:    "bg-blue-50 text-blue-700 border-blue-200",
  verification_pending:  "bg-amber-50 text-amber-800 border-amber-200",
  application_submitted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  under_processing:      "bg-violet-50 text-violet-700 border-violet-200",
  completed:             "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:             "bg-rose-50 text-rose-700 border-rose-200",
};

// Allowed forward transitions. Backward moves require an admin override
// (server-side check by role). `completed` is gated by certificate upload.
// `cancelled` is NEVER a direct dropdown choice — it is reached only through
// the multi-stage Cancellation & Refund workflow (see CancellationPanel).
export const FULFILLMENT_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  order_received:        ["documents_received"],
  documents_received:    ["verification_pending"],
  verification_pending:  ["application_submitted", "documents_received"],
  application_submitted: ["under_processing"],
  under_processing:      ["completed"],
  completed:             [],
  cancelled:             [],
};

export function getAllowedFulfillmentTransitions(current: FulfillmentStatus): FulfillmentStatus[] {
  return FULFILLMENT_TRANSITIONS[current] ?? [];
}

export function stageIndex(s: FulfillmentStatus): number {
  return FULFILLMENT_STAGES.indexOf(s);
}
