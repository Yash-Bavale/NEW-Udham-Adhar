const CLOSED = /^(closed|auto_closed|force_closed|order_closed)$/i;
class TransitionGuardError extends Error {
  status = 409;
  constructor(msg) {
    super(msg);
    this.name = "TransitionGuardError";
  }
}
function isClosed(closureStage) {
  return !!closureStage && CLOSED.test(closureStage);
}
function assertTransitionAllowed(i) {
  const stage = (i.stage ?? "").toLowerCase();
  const ws = (i.workflowStatus ?? "").toLowerCase();
  const hasCustomerHold = /customer_hold|customer_side|customer_delay/.test(ws);
  const hasTechHold = /technical_hold|external_delay|govt_delay|technical_delay|government_portal_pending/.test(ws);
  if (isClosed(i.closureStage) && i.action !== "reminder") {
    throw new TransitionGuardError("Order is already closed. Reopen it before running new actions.");
  }
  const S04_PLUS = /* @__PURE__ */ new Set([
    "form_submitted",
    "technical_delay",
    "customer_delay",
    "government_processing",
    "application_submitted",
    "under_processing",
    "awaiting_govt",
    "consultation_completed",
    "application_approved",
    "application_rejected",
    "certificate_rejected",
    "order_completed",
    "order_closed",
    "completed",
    "cancelled"
  ]);
  const S02_S03 = /* @__PURE__ */ new Set([
    "order_received",
    "awaiting_customer_form",
    "waiting_for_customer_submission",
    "form_not_submitted"
    // legacy
  ]);
  switch (i.action) {
    case "send_form_link": {
      if (S04_PLUS.has(ws)) {
        throw new TransitionGuardError("Form link only sends while the customer form is still pending (S02/S03).");
      }
      if (ws && !S02_S03.has(ws) && !/lead_received|payment|order|consult|awaiting|form_pending|form_not_submitted|waiting_customer|info_received|new_order/i.test(stage)) {
        throw new TransitionGuardError("Form link only sends before the form is submitted.");
      }
      return;
    }
    case "customer_delay":
    case "technical_delay": {
      if (!/form|verif|review|progress|submitted_to_govt|processing/i.test(stage)) {
        throw new TransitionGuardError("Delay can only be logged after the form is submitted.");
      }
      if (i.reasonCategory && i.action === "customer_delay" && i.reasonCategory !== "A") {
        throw new TransitionGuardError("Customer delay requires a Category A reason.");
      }
      if (i.reasonCategory && i.action === "technical_delay" && i.reasonCategory !== "B") {
        throw new TransitionGuardError("Technical delay requires a Category B reason.");
      }
      return;
    }
    case "submit_to_govt": {
      if (hasCustomerHold || hasTechHold) {
        throw new TransitionGuardError("Resolve the active hold before submitting to the portal.");
      }
      if (!/form|verif|review|progress/i.test(stage)) {
        throw new TransitionGuardError("Submit-to-Govt is only valid after the form is submitted.");
      }
      return;
    }
    case "complete_with_cert":
    case "application_rejected": {
      if (!/submitted_to_govt|processing|certificate|check|final|review/i.test(stage)) {
        throw new TransitionGuardError("Final outcome can only be marked after submission to the portal.");
      }
      if (i.action === "application_rejected" && i.reasonCategory && i.reasonCategory !== "B") {
        throw new TransitionGuardError("Rejection requires a Category B reason.");
      }
      return;
    }
    case "force_close": {
      if (i.reasonCategory && i.reasonCategory !== "A") {
        throw new TransitionGuardError("Force close requires a Category A reason.");
      }
      return;
    }
    case "talk_to_expert_done":
      return;
    case "reminder":
      return;
  }
}
export {
  TransitionGuardError,
  assertTransitionAllowed
};
