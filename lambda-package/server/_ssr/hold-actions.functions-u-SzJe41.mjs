import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { s as string, n as number, o as object, b as boolean, _ as _enum } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const OrderId = string().uuid();
const ReminderMinutes = number().int().min(15).max(60 * 24 * 30);
const markFormPending_createServerFn_handler = createServerRpc({
  id: "3288c9e1299b019af439e0463777f8b816b26134df4450f4250d6876bb37e11f",
  name: "markFormPending",
  filename: "src/lib/orders/actions/hold-actions.functions.ts"
}, (opts) => markFormPending.__executeServer(opts));
const markFormPending = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  transitionOnly: boolean().default(false)
}).parse(raw)).handler(markFormPending_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: updated,
    error
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: "FORM_PENDING"
  });
  if (error) throw new Error(error.message);
  const {
    armTimer
  } = await import("./timers.server-BikGPSRc.mjs");
  await armTimer({
    applicationId: data.orderId,
    kind: "form_pending_nudge_4h",
    firesInMinutes: 4 * 60
  });
  await armTimer({
    applicationId: data.orderId,
    kind: "form_pending_autoclose_8h",
    firesInMinutes: 8 * 60
  });
  return {
    ok: true,
    order: updated
  };
});
const markFormReceived_createServerFn_handler = createServerRpc({
  id: "de765927a918f23f14a73bfe49caf9beb4e2576eca3b91277479cb7af7012513",
  name: "markFormReceived",
  filename: "src/lib/orders/actions/hold-actions.functions.ts"
}, (opts) => markFormReceived.__executeServer(opts));
const markFormReceived = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId
}).parse(raw)).handler(markFormReceived_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: updated,
    error
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: "FORM_RECEIVED"
  });
  if (error) throw new Error(error.message);
  const {
    cancelTimers
  } = await import("./timers.server-BikGPSRc.mjs");
  await cancelTimers(data.orderId, ["form_pending_nudge_4h", "form_pending_autoclose_8h"]);
  return {
    ok: true,
    order: updated
  };
});
const startTechnicalHold_createServerFn_handler = createServerRpc({
  id: "6008aaa579fe8e46dc831e636d555d1e3714c97ea61711a3597552302fd16fcf",
  name: "startTechnicalHold",
  filename: "src/lib/orders/actions/hold-actions.functions.ts"
}, (opts) => startTechnicalHold.__executeServer(opts));
const startTechnicalHold = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  kind: _enum(["external", "internal"]),
  reasonId: string().uuid(),
  reminderMinutes: ReminderMinutes,
  remarks: string().max(2e3).optional().nullable()
}).parse(raw)).handler(startTechnicalHold_createServerFn_handler, async ({
  data,
  context
}) => {
  const targetStatus = data.kind === "external" ? "TECHNICAL_HOLD_EXTERNAL" : "TECHNICAL_HOLD_INTERNAL";
  const {
    data: updated,
    error
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: targetStatus,
    _reason_id: data.reasonId,
    _remarks: data.remarks ?? void 0
  });
  if (error) throw new Error(error.message);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  await supabaseAdmin.from("applications").update({
    technical_hold_started_at: (/* @__PURE__ */ new Date()).toISOString(),
    technical_hold_kind: data.kind,
    active_reason_id: data.reasonId,
    fulfillment_status: "technical_delay"
  }).eq("id", data.orderId);
  const {
    armTimer
  } = await import("./timers.server-BikGPSRc.mjs");
  await armTimer({
    applicationId: data.orderId,
    kind: "technical_hold_reminder",
    firesInMinutes: data.reminderMinutes,
    recurring: true,
    intervalMinutes: data.reminderMinutes,
    payload: {
      kind: data.kind,
      reasonId: data.reasonId
    }
  });
  if (data.kind === "external") {
    const [{
      enqueueFromTemplateInternal
    }, {
      BHS_EMAILS
    }] = await Promise.all([import("./emails.server-BTJhg2a3.mjs"), import("./bhs-templates-Gd1TLGXv.mjs")]);
    const {
      data: cust
    } = await supabaseAdmin.from("applications").select("customers(primary_email, name), leads:lead_id(email, name), application_code, lead_id").eq("id", data.orderId).maybeSingle();
    const custRow = cust;
    const email = custRow?.customers?.primary_email || custRow?.leads?.email;
    const custName = custRow?.customers?.name || custRow?.leads?.name || "Customer";
    if (email) {
      try {
        await enqueueFromTemplateInternal(BHS_EMAILS.E005_OUR_SIDE_DELAY, email, {
          customerName: custName,
          orderNumber: custRow?.application_code || data.orderId.slice(0, 8),
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
        }, {
          applicationId: data.orderId,
          leadId: custRow?.lead_id ?? void 0,
          trigger: "manual"
        });
      } catch (e) {
        console.error("[startTechnicalHold] E005 enqueue failed", e);
      }
    }
  }
  return {
    ok: true,
    order: updated
  };
});
const markAwaitingGovt_createServerFn_handler = createServerRpc({
  id: "ef1afa92e37d48b452fc3de4565b242ec0d19a9206ae450472845b4805100d64",
  name: "markAwaitingGovt",
  filename: "src/lib/orders/actions/hold-actions.functions.ts"
}, (opts) => markAwaitingGovt.__executeServer(opts));
const markAwaitingGovt = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  reminderMinutes: ReminderMinutes
}).parse(raw)).handler(markAwaitingGovt_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: updated,
    error
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: "AWAITING_GOVT_APPROVAL"
  });
  if (error) throw new Error(error.message);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  await supabaseAdmin.from("applications").update({
    awaiting_govt_started_at: (/* @__PURE__ */ new Date()).toISOString(),
    fulfillment_status: "government_processing"
  }).eq("id", data.orderId);
  const {
    armTimer
  } = await import("./timers.server-BikGPSRc.mjs");
  await armTimer({
    applicationId: data.orderId,
    kind: "awaiting_govt_internal_reminder",
    firesInMinutes: data.reminderMinutes,
    recurring: true,
    intervalMinutes: data.reminderMinutes,
    payload: {
      internal_only: true
    }
  });
  return {
    ok: true,
    order: updated
  };
});
const resumeFromHold_createServerFn_handler = createServerRpc({
  id: "ac650ed9879a6610188e82023f4b6d93df44a6571fec15a067ce14e62a24b980",
  name: "resumeFromHold",
  filename: "src/lib/orders/actions/hold-actions.functions.ts"
}, (opts) => resumeFromHold.__executeServer(opts));
const resumeFromHold = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  target: _enum(["IN_PROCESSING", "FORM_RECEIVED", "INFO_RECEIVED"]).default("IN_PROCESSING")
}).parse(raw)).handler(resumeFromHold_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: preRow,
    error: preRowError
  } = await supabaseAdmin.from("applications").select("technical_hold_kind, workflow_status, fulfillment_status, lead_id, customer_id, application_code, form_submitted_at").eq("id", data.orderId).maybeSingle();
  if (preRowError) throw new Error(`Unable to read the technical-delay state: ${preRowError.message}`);
  if (!preRow) throw new Error("Order not found.");
  const [{
    data: lead,
    error: leadError
  }, {
    data: customer,
    error: customerError
  }] = await Promise.all([preRow.lead_id ? supabaseAdmin.from("leads").select("email, name, mobile, service, assigned_to").eq("id", preRow.lead_id).maybeSingle() : Promise.resolve({
    data: null,
    error: null
  }), preRow.customer_id ? supabaseAdmin.from("customers").select("primary_email, primary_mobile, name").eq("id", preRow.customer_id).maybeSingle() : Promise.resolve({
    data: null,
    error: null
  })]);
  if (leadError) throw new Error(`Unable to read the order recipient: ${leadError.message}`);
  if (customerError) throw new Error(`Unable to read the customer recipient: ${customerError.message}`);
  const wasExternalTechHold = preRow.technical_hold_kind === "external" || preRow.workflow_status === "government_portal_pending" || preRow.fulfillment_status === "technical_delay";
  if (!wasExternalTechHold) {
    throw new Error("This order is not currently in Technical Delay, so E011 was not sent.");
  }
  const {
    data: updated,
    error
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: data.target
  });
  if (error) throw new Error(error.message);
  const {
    cancelTimers
  } = await import("./timers.server-BikGPSRc.mjs");
  await cancelTimers(data.orderId, ["customer_hold_reminder", "technical_hold_reminder", "awaiting_govt_internal_reminder"]);
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
    stop_reason: "technical_delay_resolved",
    stop_triggered_by: context.userId
  }).eq("application_id", data.orderId).in("status", ["active", "paused"]);
  await supabaseAdmin.from("order_reminders").update({
    is_active: false,
    stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
    stop_reason: "technical_delay_resolved"
  }).eq("application_id", data.orderId);
  await supabaseAdmin.from("workflow_reminders").update({
    status: "cancelled"
  }).eq("application_id", data.orderId).eq("status", "pending");
  await supabaseAdmin.from("applications").update({
    technical_hold_started_at: null,
    technical_hold_kind: null,
    customer_hold_started_at: null,
    awaiting_govt_started_at: null,
    active_reason_id: null,
    active_reason_text: null,
    workflow_status: "processing",
    workflow_delay_reason: null,
    workflow_expected_review_at: null,
    // Delay resolved → Form Submitted only if the customer really submitted the form
    ...preRow.form_submitted_at ? {
      fulfillment_status: "form_submitted"
    } : {
      fulfillment_status: "form_not_submitted",
      order_status: "FORM_PENDING"
    }
  }).eq("id", data.orderId);
  const email = lead?.email || customer?.primary_email;
  const recipientName = lead?.name || customer?.name || "Customer";
  if (!email) throw new Error("This order has no recipient email, so E011 could not be sent.");
  let executiveName = "Customer Care Team";
  const staffId = preRow.assigned_to || lead?.assigned_to || context.userId;
  if (staffId) {
    const {
      data: prof
    } = await supabaseAdmin.from("profiles").select("display_name, full_name, email").eq("id", staffId).maybeSingle();
    const p = prof;
    if (p?.display_name || p?.full_name || p?.email) {
      executiveName = p.display_name || p.full_name || p.email || "Customer Care Team";
    }
  }
  try {
    const [{
      enqueueFromTemplateInternal
    }, {
      BHS_EMAILS
    }] = await Promise.all([import("./emails.server-BTJhg2a3.mjs"), import("./bhs-templates-Gd1TLGXv.mjs")]);
    const resolvedAt = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const sendResult = await enqueueFromTemplateInternal(BHS_EMAILS.E011_TECHNICAL_DELAY_RESOLVED, email, {
      order_number: preRow.application_code || data.orderId.slice(0, 8),
      orderNumber: preRow.application_code || data.orderId.slice(0, 8),
      customer_name: recipientName,
      customerName: recipientName,
      service_name: lead?.service || "Business Registration & Filing",
      serviceName: lead?.service || "Business Registration & Filing",
      resolved_at: resolvedAt,
      resolvedAt,
      customer_email: email,
      customerEmail: email,
      customer_mobile: lead?.mobile || customer?.primary_mobile || "—",
      customerMobile: lead?.mobile || customer?.primary_mobile || "—",
      executive_name: executiveName,
      executiveName,
      fromName: process.env.ZOHO_FROM_NAME || "Care | Business Help Services"
    }, {
      applicationId: data.orderId,
      leadId: preRow.lead_id ?? void 0,
      trigger: "manual",
      requireImmediateSuccess: true
    });
    if (!sendResult?.sent) throw new Error("E011 was not accepted by the email service.");
  } catch (e) {
    console.error("[resumeFromHold] E011 enqueue failed", e);
    throw e instanceof Error ? e : new Error(String(e));
  }
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actorName: executiveName,
      actionName: "Technical Delay Resolved",
      actionReason: "Technical issue resolved (E011 sent) & order resumed",
      supabase: supabaseAdmin
    });
  } catch (hotErr) {
    console.warn("[resumeFromHold] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    order: updated,
    emailSent: true
  };
});
const resumeFromCustomerDelay_createServerFn_handler = createServerRpc({
  id: "8e98c7980bb07bc1254ec584186b1b881e9ad925ec0a9c7ebbafa104f23f9fc5",
  name: "resumeFromCustomerDelay",
  filename: "src/lib/orders/actions/hold-actions.functions.ts"
}, (opts) => resumeFromCustomerDelay.__executeServer(opts));
const resumeFromCustomerDelay = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId
}).parse(raw)).handler(resumeFromCustomerDelay_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: preRow,
    error: preErr
  } = await supabaseAdmin.from("applications").select("order_status, fulfillment_status, form_submitted_at").eq("id", data.orderId).maybeSingle();
  if (preErr) throw new Error(preErr.message);
  if (!preRow) throw new Error("Order not found.");
  const formSubmitted = Boolean(preRow.form_submitted_at);
  const resumeStage = formSubmitted ? "form_submitted" : "form_not_submitted";
  const {
    error: rpcError
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: formSubmitted ? "FORM_RECEIVED" : "FORM_PENDING"
  });
  if (rpcError) console.warn("[resumeFromCustomerDelay] transition skipped:", rpcError.message);
  const {
    cancelTimers
  } = await import("./timers.server-BikGPSRc.mjs");
  await cancelTimers(data.orderId, ["customer_hold_reminder"]);
  await supabaseAdmin.from("workflow_reminders").update({
    status: "cancelled"
  }).eq("application_id", data.orderId).eq("kind", "pending_closure_followup").in("status", ["pending", "failed"]);
  const {
    cancelAllForOrder
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await cancelAllForOrder(data.orderId, "customer_delay_resumed");
  const {
    error
  } = await supabaseAdmin.from("applications").update({
    fulfillment_status: resumeStage,
    ...formSubmitted ? {} : {
      order_status: "FORM_PENDING"
    },
    customer_hold_started_at: null,
    active_reason_id: null,
    active_reason_text: null,
    workflow_status: "processing",
    workflow_delay_reason: null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.orderId);
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("application_events").insert({
    application_id: data.orderId,
    event_type: "fulfillment_status_change",
    old_value: String(preRow.fulfillment_status ?? ""),
    new_value: resumeStage,
    note: "Customer side delay resolved — order resumed",
    staff_name: "Admin",
    staff_role: "admin"
  });
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actionName: "Customer Delay Resumed",
      actionReason: "Customer side delay resolved — order resumed to Form Submitted",
      supabase: supabaseAdmin
    });
  } catch (hotErr) {
    console.warn("[resumeFromCustomerDelay] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true
  };
});
const resumeReopenedOrder_createServerFn_handler = createServerRpc({
  id: "7a8b51df43aa8522e5dd44e6a245c3e23ad7a0482fcbc5c4c04993ffce956935",
  name: "resumeReopenedOrder",
  filename: "src/lib/orders/actions/hold-actions.functions.ts"
}, (opts) => resumeReopenedOrder.__executeServer(opts));
const resumeReopenedOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  note: string().max(2e3).optional()
}).parse(raw)).handler(resumeReopenedOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: preRow,
    error: preErr
  } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, order_status, fulfillment_status, form_submitted_at, application_code").eq("id", data.orderId).maybeSingle();
  if (preErr) throw new Error(preErr.message);
  if (!preRow) throw new Error("Order not found.");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nextFulfillmentStatus = preRow.form_submitted_at ? "form_submitted" : "form_not_submitted";
  const nextOrderStatus = "IN_PROCESSING";
  const {
    error: rpcError
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: preRow.form_submitted_at ? "FORM_RECEIVED" : "FORM_PENDING"
  });
  if (rpcError) console.warn("[resumeReopenedOrder] transition skipped:", rpcError.message);
  const {
    cancelAllForOrder
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await cancelAllForOrder(data.orderId, "order_reopened_resumed");
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now,
    stop_reason: "order_reopened_resumed",
    stop_triggered_by: context.userId
  }).eq("application_id", data.orderId).in("status", ["active", "paused"]);
  await supabaseAdmin.from("workflow_reminders").update({
    status: "cancelled"
  }).eq("application_id", data.orderId).in("status", ["pending", "failed"]);
  const {
    error
  } = await supabaseAdmin.from("applications").update({
    order_status: nextOrderStatus,
    fulfillment_status: nextFulfillmentStatus,
    application_status: "under_process",
    workflow_status: "processing",
    workflow_delay_reason: null,
    updated_at: now
  }).eq("id", data.orderId);
  if (error) throw new Error(error.message);
  const {
    data: staffProf
  } = await supabaseAdmin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle();
  const staffName = staffProf?.display_name || staffProf?.email || "Staff";
  await supabaseAdmin.from("application_events").insert({
    application_id: data.orderId,
    lead_id: preRow.lead_id,
    customer_id: preRow.customer_id,
    event_type: "fulfillment_status_change",
    old_value: "order_reopened",
    new_value: nextFulfillmentStatus,
    note: data.note || "Order resumed from reopened state",
    staff_name: staffName,
    staff_role: "staff",
    created_by: context.userId
  });
  await supabaseAdmin.from("workflow_events").insert({
    application_id: data.orderId,
    lead_id: preRow.lead_id,
    event_type: "order_resumed",
    title: "Order Resumed from Reopened State",
    description: data.note ?? "Order resumed into active processing",
    customer_visible: false,
    actor_id: context.userId,
    actor_name: staffName,
    is_system: false,
    metadata: {
      previousStage: "order_reopened",
      nextStage: nextFulfillmentStatus,
      notes: data.note ?? null
    }
  });
  try {
    const {
      logEmployeeOrderAction
    } = await import("./order-action-logger.server-DJE-NEoc.mjs");
    await logEmployeeOrderAction({
      orderId: data.orderId,
      leadId: preRow.lead_id,
      customerId: preRow.customer_id,
      employeeId: context.userId,
      employeeName: staffName,
      actionType: "PROCESSING_STARTED",
      previousStatus: "REOPENED",
      newStatus: nextOrderStatus,
      previousStage: "Order Reopened",
      newStage: nextFulfillmentStatus === "form_submitted" ? "Form Submitted" : "Form Not Submitted Delay",
      notes: data.note || "Order resumed from reopened state",
      source: "employee",
      supabase: supabaseAdmin
    });
  } catch (auditErr) {
    console.warn("[resumeReopenedOrder] audit log error:", auditErr);
  }
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actorName: staffName,
      actionName: "Order Resumed",
      actionReason: data.note || `Order resumed from reopened state into ${nextFulfillmentStatus === "form_submitted" ? "Form Submitted" : "Form Not Submitted Delay"}`,
      supabase: supabaseAdmin
    });
  } catch (hotErr) {
    console.warn("[resumeReopenedOrder] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    nextStage: nextFulfillmentStatus
  };
});
export {
  markAwaitingGovt_createServerFn_handler,
  markFormPending_createServerFn_handler,
  markFormReceived_createServerFn_handler,
  resumeFromCustomerDelay_createServerFn_handler,
  resumeFromHold_createServerFn_handler,
  resumeReopenedOrder_createServerFn_handler,
  startTechnicalHold_createServerFn_handler
};
