import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const AUTO_CLOSE_REASON_LABEL = "Customer unresponsive after multiple attempts";
const STAGE_REMARKS = {
  form_pending: "Incomplete/Incorrect information",
  customer_delay: "No response from customer within 8 hours of request"
};
let cachedReasonId = null;
async function getAutoCloseReasonId() {
  if (cachedReasonId) return cachedReasonId;
  const { data } = await supabaseAdmin.from("order_close_reasons").select("id").eq("label", AUTO_CLOSE_REASON_LABEL).eq("is_active", true).maybeSingle();
  cachedReasonId = data?.id ?? null;
  return cachedReasonId;
}
const CLOSED_OR_DONE_FULFILLMENT = [
  "completed",
  "order_completed",
  "order_closed",
  "cancelled"
];
function isResolved(stage, row) {
  const fulfillment = String(row?.fulfillment_status ?? "");
  const orderStatus = String(row?.order_status ?? "");
  if (CLOSED_OR_DONE_FULFILLMENT.includes(fulfillment)) return true;
  if (["CLOSED", "COMPLETED", "REFUND_PROCESSED", "REFUND_APPROVED"].includes(orderStatus)) return true;
  if (stage === "form_pending") {
    if (String(row?.form_status ?? "").toLowerCase() === "submitted") return true;
    return [
      "form_submitted",
      "documents_received",
      "under_processing",
      "verification_pending"
    ].includes(fulfillment) || ["FORM_RECEIVED", "INFO_RECEIVED", "IN_PROCESSING"].includes(orderStatus);
  }
  return !row?.customer_hold_started_at && fulfillment !== "customer_delay";
}
async function autoCloseOverdueOrder(appId, stage, opts) {
  const sendEmail = opts?.sendEmail ?? true;
  const { data: app } = await supabaseAdmin.from("applications").select("order_status, fulfillment_status, form_status, customer_hold_started_at, closure_remarks, workflow_delay_reason, active_reason_text").eq("id", appId).maybeSingle();
  const row = app;
  const { cancelTimers } = await import("./timers.server-BikGPSRc.mjs");
  if (!row) return { ok: false, skipped: "not_found" };
  const alreadyAutoClosed = String(row?.order_status ?? "") === "CLOSED" && (String(row?.closure_remarks ?? "").includes(STAGE_REMARKS[stage]) || String(row?.closure_remarks ?? "").includes("Form not received within 8 hours of payment"));
  if (!alreadyAutoClosed && isResolved(stage, row)) {
    await cancelTimers(appId, ["form_pending_nudge_4h", "form_pending_autoclose_8h", "customer_hold_reminder"]);
    return { ok: false, skipped: "resolved" };
  }
  const reasonId = await getAutoCloseReasonId();
  if (!reasonId) {
    console.error("[auto-close] reason A2 not found in order_close_reasons");
    return { ok: false, skipped: "no_reason" };
  }
  let closureReasonText = STAGE_REMARKS[stage];
  let delayDescriptionText = STAGE_REMARKS[stage];
  if (stage === "form_pending") {
    closureReasonText = "Incomplete/Incorrect information";
    delayDescriptionText = "Incomplete/Incorrect information";
  } else if (stage === "customer_delay") {
    const delayReasonCode = row?.workflow_delay_reason;
    if (delayReasonCode) {
      const { data: reasonRow } = await supabaseAdmin.from("workflow_delay_reasons").select("label, description").eq("code", delayReasonCode).maybeSingle();
      if (reasonRow) {
        closureReasonText = reasonRow.label || STAGE_REMARKS.customer_delay;
        delayDescriptionText = reasonRow.description || reasonRow.label || STAGE_REMARKS.customer_delay;
      } else if (row?.active_reason_text) {
        closureReasonText = row.active_reason_text;
        delayDescriptionText = row.active_reason_text;
      }
    } else if (row?.active_reason_text) {
      closureReasonText = row.active_reason_text;
      delayDescriptionText = row.active_reason_text;
    }
  }
  const remarks = `${opts?.remarkPrefix ?? ""}${delayDescriptionText}`;
  if (!alreadyAutoClosed) {
    const { error } = await supabaseAdmin.from("applications").update({
      order_status: "CLOSED",
      fulfillment_status: "order_closed",
      application_status: "cancelled",
      closure_reason_id: reasonId,
      closure_remarks: remarks,
      customer_hold_started_at: null,
      workflow_status: "closed",
      active_reason_id: null,
      active_reason_text: null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", appId);
    if (error) {
      console.error("[auto-close] update failed", error.message);
      return { ok: false, skipped: "update_failed", message: error.message };
    }
    await supabaseAdmin.from("application_events").insert({
      application_id: appId,
      event_type: "order_status_change",
      old_value: String(row.order_status ?? ""),
      new_value: "CLOSED",
      note: closureReasonText === remarks ? closureReasonText : `${closureReasonText} — ${remarks}`,
      staff_name: opts?.staffName ?? "System",
      staff_role: "system"
    });
  }
  await cancelTimers(appId, [
    "form_pending_nudge_4h",
    "form_pending_autoclose_8h",
    "customer_hold_reminder"
  ]);
  if (!sendEmail) return { ok: true, emailQueued: false };
  const { data: priorEmail } = await supabaseAdmin.from("email_logs").select("id").eq("application_id", appId).eq("template_code", "E010").eq("status", "sent").limit(1).maybeSingle();
  if (priorEmail) return { ok: true, emailQueued: true };
  const { data: ctx } = await supabaseAdmin.from("applications").select("application_code, lead_id, customer_id").eq("id", appId).maybeSingle();
  const c = ctx;
  let email = null;
  let name = null;
  if (c?.lead_id) {
    const { data: lead } = await supabaseAdmin.from("leads").select("email, name").eq("id", c.lead_id).maybeSingle();
    email = lead?.email ?? null;
    name = lead?.name ?? null;
  }
  if (!email && c?.customer_id) {
    const { data: cust } = await supabaseAdmin.from("customers").select("primary_email, name").eq("id", c.customer_id).maybeSingle();
    email = cust?.primary_email ?? null;
    name = name ?? cust?.name ?? null;
  }
  if (!email) return { ok: true, emailQueued: false };
  try {
    const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
      import("./emails.server-BTJhg2a3.mjs"),
      import("./bhs-templates-Gd1TLGXv.mjs")
    ]);
    const fullReasonString = closureReasonText === remarks ? closureReasonText : `${closureReasonText} — ${remarks}`;
    await enqueueFromTemplateInternal(
      BHS_EMAILS.E010_ORDER_CLOSED,
      email,
      {
        customerName: name || "Customer",
        orderNumber: c?.application_code || appId.slice(0, 8),
        closure_reason: closureReasonText,
        employee_remarks: remarks,
        reason: fullReasonString,
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
      },
      { applicationId: appId, leadId: c?.lead_id ?? void 0, trigger: "auto" }
    );
    return { ok: true, emailQueued: true };
  } catch (e) {
    console.error("[auto-close] E010 enqueue failed", e);
    return {
      ok: false,
      skipped: "email_failed",
      message: e instanceof Error ? e.message : String(e)
    };
  }
}
export {
  AUTO_CLOSE_REASON_LABEL,
  STAGE_REMARKS,
  autoCloseOverdueOrder,
  getAutoCloseReasonId
};
