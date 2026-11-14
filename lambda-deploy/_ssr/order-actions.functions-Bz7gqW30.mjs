import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, _ as _enum, b as boolean } from "../_libs/zod.mjs";
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
const CustomerSideDelayInput = object({
  orderId: string().uuid(),
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable()
});
const customerSideDelay_createServerFn_handler = createServerRpc({
  id: "07800048615b4c2dc10f3fe3036dc9d1578b6dbd4c118c4545416566ee253bcd",
  name: "customerSideDelay",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => customerSideDelay.__executeServer(opts));
const customerSideDelay = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => CustomerSideDelayInput.parse(raw)).handler(customerSideDelay_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId
  });
  const {
    data: updated,
    error: tErr
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: "CUSTOMER_HOLD",
    _reason_id: data.reasonId,
    _remarks: data.remarks ?? void 0,
    _force: false
  });
  if (tErr) throw new Error(tErr.message);
  const [{
    enqueueFromTemplateInternal
  }, {
    startCustomerClosureScheduler
  }, {
    supabaseAdmin
  }] = await Promise.all([import("./emails.server-BTJhg2a3.mjs"), import("./schedulers.server-BPR-45Y2.mjs"), import("./client.server-3kDCe7R3.mjs")]);
  const {
    BHS_EMAILS
  } = await import("./bhs-templates-Gd1TLGXv.mjs");
  await supabaseAdmin.from("applications").update({
    customer_hold_started_at: (/* @__PURE__ */ new Date()).toISOString(),
    active_reason_id: data.reasonId,
    fulfillment_status: "customer_delay"
  }).eq("id", data.orderId);
  const {
    data: reason
  } = await supabaseAdmin.from("delay_reasons").select("label").eq("id", data.reasonId).maybeSingle();
  const app = updated;
  const customerId = app?.customer_id ?? null;
  const orderCode = app?.application_code ?? data.orderId.slice(0, 8);
  const leadId = app?.lead_id ?? null;
  let emailQueued = false;
  if (customerId) {
    const {
      data: cust
    } = await supabaseAdmin.from("customers").select("primary_email, name").eq("id", customerId).maybeSingle();
    if (cust?.primary_email) {
      try {
        await enqueueFromTemplateInternal(BHS_EMAILS.E004_CUSTOMER_DELAY, cust.primary_email, {
          customerName: cust.name || "Customer",
          orderNumber: orderCode,
          delayReason: reason?.label || "Awaiting information from your side",
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
        }, {
          applicationId: data.orderId,
          leadId: leadId ?? void 0
        });
        emailQueued = true;
      } catch (e) {
        console.error("[customerSideDelay] E003 enqueue failed", e);
      }
    }
  }
  const scheduler = await startCustomerClosureScheduler({
    applicationId: data.orderId,
    reasonId: data.reasonId,
    remarks: data.remarks ?? null,
    createdBy: context.userId
  });
  await notifyOrderEvent({
    order: {
      id: data.orderId,
      application_code: orderCode,
      assigned_to: app?.assigned_to ?? null
    },
    kind: "customer_hold_started",
    title: `${orderCode} moved to Customer Hold`,
    body: `24h auto-close timer started. Reason: ${reason?.label ?? "Awaiting customer information"}.`
  });
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actionName: "Customer Delay",
      actionReason: `Customer Delay action performed: ${reason?.label || "Customer hold started"}`,
      supabase: supabaseAdmin
    });
  } catch (hotErr) {
    console.warn("[customerSideDelay] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    order: updated,
    emailQueued,
    scheduler: {
      id: scheduler?.id,
      firesAt: scheduler?.fires_at
    }
  };
});
const OurSideDelayInput = object({
  orderId: string().uuid(),
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable(),
  /** grace = 30-min business-time hold before auto reminders kick in.
   *  auto  = start recurring 2h business-time reminders immediately.
   *  manual = one-shot reminder at explicit remindAt.
   *  stop  = transition without arming any reminder (reason is enough). */
  mode: _enum(["grace", "auto", "manual", "stop"]),
  intervalSeconds: number().int().min(300).max(24 * 3600).optional(),
  remindAt: string().datetime().optional()
});
const ourSideDelay_createServerFn_handler = createServerRpc({
  id: "6856102e0cdebdaf7c6d82d3c0c7ef3db14d91f9aeabfc566a9ed0c9fcf09a36",
  name: "ourSideDelay",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => ourSideDelay.__executeServer(opts));
const ourSideDelay = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => OurSideDelayInput.parse(raw)).handler(ourSideDelay_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId
  });
  const {
    data: updated,
    error: tErr
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: "OUR_SIDE_DELAY",
    _reason_id: data.reasonId,
    _remarks: data.remarks ?? void 0,
    _force: false
  });
  if (tErr) throw new Error(tErr.message);
  if (data.mode === "stop") {
    return {
      ok: true,
      order: updated,
      scheduler: null
    };
  }
  const {
    startOurSideReminder
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  const scheduler = await startOurSideReminder({
    applicationId: data.orderId,
    mode: data.mode,
    intervalSeconds: data.intervalSeconds,
    remindAt: data.remindAt ? new Date(data.remindAt) : void 0,
    reasonId: data.reasonId,
    remarks: data.remarks ?? null,
    createdBy: context.userId
  });
  const app = updated;
  await notifyOrderEvent({
    order: {
      id: data.orderId,
      application_code: app?.application_code ?? null,
      assigned_to: app?.assigned_to ?? null
    },
    kind: "our_side_delay_start",
    title: `${app?.application_code ?? data.orderId.slice(0, 8)} — Our Side Delay armed`,
    body: data.mode === "auto" ? "Recurring 2h business-time reminders started." : data.mode === "manual" ? `Manual reminder scheduled${data.remindAt ? ` for ${new Date(data.remindAt).toLocaleString("en-IN")}` : ""}.` : "30-min grace period before auto-reminders kick in."
  });
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actionName: "Technical Delay",
      actionReason: "Technical Delay hold armed",
      supabase: context.supabase
    });
  } catch (hotErr) {
    console.warn("[ourSideDelay] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    order: updated,
    scheduler: {
      id: scheduler?.id,
      firesAt: scheduler?.fires_at
    }
  };
});
async function loadOrderContext(supabase, orderId, opts = {}) {
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  if (user && !opts.financeVerified) {
    const {
      assertCanAccessOrder
    } = await import("./order-auth.server-Bv4mY1MC.mjs");
    await assertCanAccessOrder({
      orderId,
      userId: user.id
    });
  }
  const {
    data: order,
    error
  } = await supabase.from("applications").select("id, lead_id, customer_id, order_status, application_code, service_id, assigned_to, workflow_status, closure_stage, refund_approved_at, refund_approved_by, refund_gateway_ref, refund_processed_at, services(service_name)").eq("id", orderId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) throw new Error("Order not found");
  let customer = null;
  if (order.customer_id) {
    const {
      data: c
    } = await supabase.from("customers").select("primary_email, name").eq("id", order.customer_id).maybeSingle();
    customer = c;
  }
  let lead = null;
  if (order.lead_id) {
    const {
      data: l
    } = await supabase.from("leads").select("email, name, service, service_id").eq("id", order.lead_id).maybeSingle();
    lead = l;
  }
  const recipientEmail = (customer?.primary_email ?? "").trim() || (lead?.email ?? "").trim() || null;
  const recipientName = customer?.name || lead?.name || "Customer";
  let serviceName = order?.services?.service_name || lead?.service || null;
  if (!serviceName && (order.service_id || lead?.service_id)) {
    const svcId = order.service_id || lead?.service_id;
    const {
      data: svc
    } = await supabase.from("services").select("service_name").eq("id", svcId).maybeSingle();
    if (svc?.service_name) serviceName = svc.service_name;
  }
  return {
    order: {
      ...order,
      service_name: serviceName
    },
    customer,
    lead,
    recipientEmail,
    recipientName,
    serviceName
  };
}
async function notifyOrderEvent(input) {
  try {
    const {
      emitToUsers,
      emitToRole
    } = await import("./emit.server-OhKEr4hO.mjs");
    const href = `/admin/orders/${input.order.id}`;
    const base = {
      kind: input.kind,
      title: input.title,
      body: input.body,
      href,
      entityKind: "order",
      entityId: input.order.id
    };
    const targets = [];
    if (input.order.assigned_to) targets.push(input.order.assigned_to);
    if (targets.length > 0) await emitToUsers(targets, base);
    for (const role of input.alsoRoles ?? []) {
      await emitToRole(role, base);
    }
  } catch (e) {
    console.warn("[notifyOrderEvent] failed:", e);
  }
}
async function queueTemplateEmail(templateCode, to, vars, refs) {
  const {
    enqueueFromTemplateInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  try {
    await enqueueFromTemplateInternal(templateCode, to, vars, {
      applicationId: refs.applicationId,
      leadId: refs.leadId ?? void 0,
      // Button-initiated sends are always manual triggers — bypasses the
      // dispatch_mode='manual' gate that silently drops "auto" attempts.
      trigger: "manual"
    });
    return true;
  } catch (e) {
    console.error(`[order-actions] enqueue ${templateCode} failed`, e);
    return false;
  }
}
async function transition(supabase, orderId, newStatus, extras = {}) {
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  if (user && !extras.financeVerified) {
    const {
      assertCanAccessOrder
    } = await import("./order-auth.server-Bv4mY1MC.mjs");
    await assertCanAccessOrder({
      orderId,
      userId: user.id
    });
  }
  const {
    data,
    error
  } = await supabase.rpc("transition_order_status", {
    _order_id: orderId,
    _new_status: newStatus,
    _reason_id: extras.reasonId ?? void 0,
    _remarks: extras.remarks ?? void 0,
    _force: extras.force ?? false
  });
  if (error) throw new Error(error.message);
  try {
    const {
      logEmployeeOrderAction
    } = await import("./order-action-logger.server-DJE-NEoc.mjs");
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    let actionType = extras.actionType || "STATUS_CHANGED";
    if (!extras.actionType) {
      if (newStatus === "CUSTOMER_HOLD") actionType = "CUSTOMER_DELAY_ADDED";
      else if (newStatus === "OUR_SIDE_DELAY" || newStatus === "TECHNICAL_HOLD_EXTERNAL" || newStatus === "TECHNICAL_HOLD_INTERNAL") actionType = "TECHNICAL_DELAY_ADDED";
      else if (newStatus === "IN_PROCESSING") actionType = "PROCESSING_STARTED";
      else if (newStatus === "SUBMITTED_TO_GOVT") actionType = "PROCESSING_STARTED";
      else if (newStatus === "CERTIFICATE_ISSUED") actionType = "CERTIFICATE_GENERATED";
      else if (newStatus === "COMPLETED") actionType = "ORDER_COMPLETED";
      else if (newStatus === "CLOSED") actionType = "ORDER_CLOSED";
      else if (newStatus === "WAITING_FOR_CLIENT_RESPONSE" || newStatus === "FORM_PENDING") actionType = "FORM_REQUESTED";
      else if (newStatus === "FORM_RECEIVED" || newStatus === "INFO_RECEIVED") actionType = "FORM_REVIEWED";
    }
    await logEmployeeOrderAction({
      orderId,
      // Credit the signed-in staff member, not the assignee/"Admin / System" fallback.
      employeeId: extras.employeeId ?? user?.id,
      actionType,
      newStatus,
      notes: extras.remarks ?? null,
      source: "employee",
      supabase: supabaseAdmin
    });
  } catch (err) {
    console.warn("[transition] audit log skipped:", err);
  }
  return data;
}
const sendFormLink_createServerFn_handler = createServerRpc({
  id: "adeb0e75e2ef29d9fd0c6ea3392660738a76f4c62f1c33743613ae2a4c56f88e",
  name: "sendFormLink",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => sendFormLink.__executeServer(opts));
const sendFormLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  transitionToWaiting: boolean().default(true)
}).parse(raw)).handler(sendFormLink_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    order,
    recipientEmail: to,
    recipientName: name
  } = await loadOrderContext(context.supabase, data.orderId);
  const {
    assertTransitionAllowed
  } = await import("./transition-guard.server-C4--NRV4.mjs");
  assertTransitionAllowed({
    stage: order.order_status,
    workflowStatus: order.workflow_status ?? null,
    closureStage: order.closure_stage ?? null,
    action: "send_form_link"
  });
  if (!to) {
    throw new Error("No email on file for this customer or lead — cannot send form link.");
  }
  const fromName = process.env.ZOHO_FROM_NAME || "Udyam Support";
  const link = `${process.env.APP_BASE_URL || ""}/resume/${order.id}`;
  const emailQueued = await queueTemplateEmail("welcome_and_form_link", to, {
    customerName: name,
    orderNumber: order.application_code || order.id.slice(0, 8),
    formLink: link,
    fromName
  }, {
    applicationId: order.id,
    leadId: order.lead_id
  });
  let updated = order;
  if (data.transitionToWaiting && order.order_status === "NEW_ORDER") {
    updated = await transition(context.supabase, order.id, "WAITING_CUSTOMER_INFO");
  }
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await supabaseAdmin.from("applications").update({
      order_status: "FORM_PENDING",
      fulfillment_status: emailQueued ? "waiting_for_customer_submission" : "awaiting_customer_form",
      form_link_sent_at: emailQueued ? now : null
    }).eq("id", order.id);
    if (emailQueued) {
      const {
        armTimer
      } = await import("./timers.server-BikGPSRc.mjs");
      await armTimer({
        applicationId: order.id,
        kind: "form_pending_nudge_4h",
        firesInMinutes: 4 * 60
      });
      await armTimer({
        applicationId: order.id,
        kind: "form_pending_autoclose_8h",
        firesInMinutes: 8 * 60
      });
    }
  } catch (e) {
    console.error("[sendFormLink] stage/timer setup failed", e);
    throw e;
  }
  if (emailQueued) {
    await notifyOrderEvent({
      order: {
        id: order.id,
        application_code: order.application_code,
        assigned_to: order.assigned_to ?? null
      },
      kind: "form_link_sent",
      title: `Form link sent for ${order.application_code || order.id.slice(0, 8)}`,
      body: `Delivered to ${to}.`
    });
  }
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: order.id,
      actorId: context.userId,
      actionName: "Form Not Submitted Delay",
      actionReason: "Form link / reminder email sent"
    });
  } catch (hotErr) {
    console.warn("[sendFormLink] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    order: updated,
    emailQueued
  };
});
const startProcessing_createServerFn_handler = createServerRpc({
  id: "e814f27c2f587f64a006887db25e32b44faf994b1cb78c96e73fb0bdd5aadcd3",
  name: "startProcessing",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => startProcessing.__executeServer(opts));
const startProcessing = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(startProcessing_createServerFn_handler, async ({
  data,
  context
}) => {
  const updated = await transition(context.supabase, data.orderId, "IN_PROCESSING");
  const {
    cancelAllForOrder
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await cancelAllForOrder(data.orderId, "started_processing");
  return {
    ok: true,
    order: updated
  };
});
const markSubmittedToGovt_createServerFn_handler = createServerRpc({
  id: "3c55940c2d822478489139398ea01d186066bb1577cae00aeb562c8769b4ec09",
  name: "markSubmittedToGovt",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => markSubmittedToGovt.__executeServer(opts));
const markSubmittedToGovt = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  referenceNumber: string().max(200).optional()
}).parse(raw)).handler(markSubmittedToGovt_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    order,
    recipientEmail: to,
    recipientName: name
  } = await loadOrderContext(context.supabase, data.orderId);
  const updated = await transition(context.supabase, data.orderId, "SUBMITTED_TO_GOVT", {
    remarks: data.referenceNumber ? `Ref: ${data.referenceNumber}` : null
  });
  let emailQueued = false;
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    await supabaseAdmin.from("applications").update({
      fulfillment_status: "government_processing"
    }).eq("id", data.orderId);
  } catch (e) {
    console.error("[markSubmittedToGovt] stamp fulfillment_status failed", e);
  }
  if (to) {
    emailQueued = await queueTemplateEmail("bhs_e012_submitted_to_govt", to, {
      customerName: name,
      orderNumber: order.application_code || order.id.slice(0, 8),
      referenceNumber: data.referenceNumber || "",
      fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
    }, {
      applicationId: order.id,
      leadId: order.lead_id
    });
  }
  await notifyOrderEvent({
    order: {
      id: order.id,
      application_code: order.application_code,
      assigned_to: order.assigned_to ?? null
    },
    kind: "order_status_change",
    title: `${order.application_code || order.id.slice(0, 8)} submitted to authority`,
    body: data.referenceNumber ? `Ref: ${data.referenceNumber}` : void 0
  });
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actionName: "Application Submitted",
      actionReason: data.referenceNumber ? `Submitted to govt portal (Ref: ${data.referenceNumber})` : "Submitted to govt portal"
    });
  } catch (hotErr) {
    console.warn("[markSubmittedToGovt] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    order: updated,
    emailQueued
  };
});
const markCertificateIssued_createServerFn_handler = createServerRpc({
  id: "256ec20717c47cce284f7bea750973905a22d938ccd893a54ebab751e4c8b31a",
  name: "markCertificateIssued",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => markCertificateIssued.__executeServer(opts));
const markCertificateIssued = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(markCertificateIssued_createServerFn_handler, async ({
  data,
  context
}) => {
  const updated = await transition(context.supabase, data.orderId, "CERTIFICATE_ISSUED");
  return {
    ok: true,
    order: updated
  };
});
const completeOrder_createServerFn_handler = createServerRpc({
  id: "11a4cf2d7dd09379fc3c4cf0418cebbffa4d1e434a7d87c6f59cb6f171798f87",
  name: "completeOrder",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => completeOrder.__executeServer(opts));
const completeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(completeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    order,
    recipientEmail: to,
    recipientName: name
  } = await loadOrderContext(context.supabase, data.orderId);
  const updated = await transition(context.supabase, data.orderId, "COMPLETED");
  const {
    cancelAllForOrder,
    startFeedbackFollowupScheduler
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await cancelAllForOrder(data.orderId, "completed");
  let emailQueued = false;
  if (to) {
    emailQueued = await queueTemplateEmail("order_completed", to, {
      customerName: name,
      orderNumber: order.application_code || order.id.slice(0, 8),
      fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
    }, {
      applicationId: order.id,
      leadId: order.lead_id
    });
  }
  try {
    await startFeedbackFollowupScheduler({
      applicationId: data.orderId,
      createdBy: context.userId
    });
  } catch (e) {
    console.error("[completeOrder] feedback follow-up scheduler failed", e);
  }
  await notifyOrderEvent({
    order: {
      id: order.id,
      application_code: order.application_code,
      assigned_to: order.assigned_to ?? null
    },
    kind: "order_completed",
    title: `${order.application_code || order.id.slice(0, 8)} completed`,
    body: "Delivery email sent to customer."
  });
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actionName: "Application Accepted",
      actionReason: "Order completed with certificate delivery"
    });
  } catch (hotErr) {
    console.warn("[completeOrder] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    order: updated,
    emailQueued
  };
});
async function writeRefundEvent(applicationId, action, userId, extras = {}) {
  try {
    const {
      supabaseAdmin
    } = await import("./client.server-3kDCe7R3.mjs");
    const {
      data: req
    } = await supabaseAdmin.from("refund_requests").select("id").eq("application_id", applicationId).order("created_at", {
      ascending: false
    }).limit(1).maybeSingle();
    if (!req) return;
    const [{
      data: profile
    }, {
      data: roleRow
    }] = await Promise.all([supabaseAdmin.from("profiles").select("display_name, email").eq("id", userId).maybeSingle(), supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle()]);
    await supabaseAdmin.from("refund_request_events").insert({
      request_id: req.id,
      actor_id: userId,
      actor_name: profile?.display_name || profile?.email || "Staff",
      actor_role: roleRow?.role ?? "staff",
      action,
      note: extras.note ?? null,
      meta: extras.meta ?? {}
    });
  } catch (e) {
    console.warn("[writeRefundEvent] failed", e);
  }
}
const requestRefund_createServerFn_handler = createServerRpc({
  id: "df1ae59a7f5f018a0d24113ba519afd977688e1adc326b5e857389147a0659b4",
  name: "requestRefund",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => requestRefund.__executeServer(opts));
const requestRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  reason: string().min(3).max(2e3),
  amount: number().positive().optional(),
  mode: _enum(["full", "partial"]).optional(),
  customerNotes: string().max(2e3).optional()
}).parse(raw)).handler(requestRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  const updated = await transition(context.supabase, data.orderId, "REFUND_REQUESTED", {
    remarks: data.reason
  });
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const app = updated;
  const {
    data: inserted
  } = await supabaseAdmin.from("refund_requests").insert({
    application_id: data.orderId,
    lead_id: app.lead_id ?? null,
    reason: data.reason,
    status: "pending",
    refund_amount: data.amount ?? null,
    refund_mode: data.mode ?? "full",
    customer_notes: data.customerNotes ?? null,
    created_by: context.userId
  }).select("id").single();
  if (inserted?.id) {
    await writeRefundEvent(data.orderId, "raised", context.userId, {
      note: data.reason,
      meta: {
        amount: data.amount ?? null,
        mode: data.mode ?? "full"
      }
    });
  }
  await notifyOrderEvent({
    order: {
      id: data.orderId,
      application_code: app.application_code ?? null,
      assigned_to: app.assigned_to ?? null
    },
    kind: "refund_requested",
    title: `Refund requested on ${app.application_code || data.orderId.slice(0, 8)}`,
    body: `Reason: ${data.reason.slice(0, 200)}${data.amount ? ` · Amount: ₹${data.amount}` : ""}`,
    alsoRoles: ["super_admin", "finance", "admin"]
  });
  return {
    ok: true,
    order: updated
  };
});
async function assertFinanceOrAdmin(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const ok = (data ?? []).some((r) => ["admin", "super_admin", "finance"].includes(r.role));
  if (!ok) throw new Error("Forbidden: admin or finance required");
}
const approveRefund_createServerFn_handler = createServerRpc({
  id: "126d554582061618a151b6471904d5d4a0e1ed0e3984301ded150dfdf9d60839",
  name: "approveRefund",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => approveRefund.__executeServer(opts));
const approveRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  amount: number().positive(),
  adminNotes: string().max(2e3).optional(),
  mode: _enum(["full", "partial"]).optional(),
  deductionAmount: number().min(0).optional(),
  deductionReason: string().max(500).optional()
}).parse(raw)).handler(approveRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.supabase, context.userId);
  const updated = await transition(context.supabase, data.orderId, "REFUND_APPROVED", {
    remarks: data.adminNotes ?? null,
    financeVerified: true
  });
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  await supabaseAdmin.from("applications").update({
    fulfillment_status: "order_closed",
    workflow_status: "refund_closed",
    closure_stage: "refund_approved",
    refund_approved_at: (/* @__PURE__ */ new Date()).toISOString(),
    refund_approved_by: context.userId
  }).eq("id", data.orderId);
  await supabaseAdmin.from("refund_requests").update({
    status: "approved",
    refund_amount: data.amount,
    refund_mode: data.mode ?? "full",
    deduction_amount: data.deductionAmount ?? null,
    deduction_reason: data.deductionReason ?? null,
    admin_notes: data.adminNotes ?? null,
    reviewer_id: context.userId,
    decided_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("application_id", data.orderId).in("status", ["pending", "info_needed", "escalated"]);
  const app2 = updated;
  const leadId = app2?.lead_id ?? null;
  if (leadId) {
    try {
      const {
        transitionLeadStatus
      } = await import("./lead-status.functions-rIiSyzbQ.mjs");
      await transitionLeadStatus({
        data: {
          leadId,
          toStatus: "refund_approved"
        }
      });
    } catch (err) {
      console.error("[approveRefund] lead transition to refund_approved failed:", err);
    }
  }
  await writeRefundEvent(data.orderId, "approved", context.userId, {
    note: data.adminNotes ?? null,
    meta: {
      amount: data.amount,
      mode: data.mode ?? "full",
      deduction_amount: data.deductionAmount ?? 0,
      deduction_reason: data.deductionReason ?? null
    }
  });
  await notifyOrderEvent({
    order: {
      id: data.orderId,
      application_code: app2?.application_code ?? null,
      assigned_to: app2?.assigned_to ?? null
    },
    kind: "refund_approved",
    title: `Refund approved on ${app2?.application_code || data.orderId.slice(0, 8)}`,
    body: `₹${data.amount} approved. Awaiting payout.`,
    alsoRoles: ["finance"]
  });
  return {
    ok: true,
    order: updated
  };
});
const rejectRefund_createServerFn_handler = createServerRpc({
  id: "16d4fe804ed5561f8208f71be62439795719e825860cb75ffb9b264fe9e3adf9",
  name: "rejectRefund",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => rejectRefund.__executeServer(opts));
const rejectRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  reason: string().min(3).max(2e3)
}).parse(raw)).handler(rejectRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.supabase, context.userId);
  const updated = await transition(context.supabase, data.orderId, "IN_PROCESSING", {
    remarks: `Refund rejected: ${data.reason}`,
    force: true,
    financeVerified: true
  });
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  await supabaseAdmin.from("refund_requests").update({
    status: "rejected",
    admin_notes: data.reason,
    reviewer_id: context.userId,
    decided_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("application_id", data.orderId).in("status", ["pending", "info_needed", "escalated"]);
  await writeRefundEvent(data.orderId, "rejected", context.userId, {
    note: data.reason
  });
  return {
    ok: true,
    order: updated
  };
});
const requestRefundInfo_createServerFn_handler = createServerRpc({
  id: "0ea4d2f5d1847b7c19d9f613329eefc7b1d8f365f011e56d59ec16a1b6864bf2",
  name: "requestRefundInfo",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => requestRefundInfo.__executeServer(opts));
const requestRefundInfo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().min(3).max(2e3)
}).parse(raw)).handler(requestRefundInfo_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  await supabaseAdmin.from("refund_requests").update({
    status: "info_needed",
    info_needed_note: data.note
  }).eq("application_id", data.orderId).in("status", ["pending", "info_needed"]);
  await writeRefundEvent(data.orderId, "info_needed", context.userId, {
    note: data.note
  });
  return {
    ok: true
  };
});
const escalateRefund_createServerFn_handler = createServerRpc({
  id: "69ba3d5a14057fbaf9a778837d2272b001100ec37cfca9382e6510939e6560e6",
  name: "escalateRefund",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => escalateRefund.__executeServer(opts));
const escalateRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().min(3).max(2e3)
}).parse(raw)).handler(escalateRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  await supabaseAdmin.from("refund_requests").update({
    status: "escalated",
    escalation_note: data.note
  }).eq("application_id", data.orderId).in("status", ["pending", "info_needed", "escalated"]);
  await writeRefundEvent(data.orderId, "escalated", context.userId, {
    note: data.note
  });
  await (async () => {
    try {
      const {
        emitToRole
      } = await import("./emit.server-OhKEr4hO.mjs");
      await emitToRole("super_admin", {
        kind: "refund_escalated",
        title: "Refund escalated",
        body: data.note.slice(0, 200),
        href: `/admin/refunds`,
        entityKind: "order",
        entityId: data.orderId
      });
    } catch (e) {
      console.warn("[escalateRefund] notify failed", e);
    }
  })();
  return {
    ok: true
  };
});
const addRefundNote_createServerFn_handler = createServerRpc({
  id: "ee90d54753a68e9dab9aec7563aaa41c56a07b11ddee544ba0d078cf03647f3b",
  name: "addRefundNote",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => addRefundNote.__executeServer(opts));
const addRefundNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().min(1).max(2e3)
}).parse(raw)).handler(addRefundNote_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.supabase, context.userId);
  await writeRefundEvent(data.orderId, "note", context.userId, {
    note: data.note
  });
  return {
    ok: true
  };
});
const markRefundProcessed_createServerFn_handler = createServerRpc({
  id: "bfaf7c929d50cc138682db317bd483e72b3fbc215672095cd58346801bba44ea",
  name: "markRefundProcessed",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => markRefundProcessed.__executeServer(opts));
const markRefundProcessed = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  amount: number().positive(),
  paymentReference: string().min(1).max(200),
  gatewayName: string().max(60).optional(),
  processedOn: string().datetime().optional()
}).parse(raw)).handler(markRefundProcessed_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.supabase, context.userId);
  const {
    order,
    lead,
    recipientEmail: to,
    recipientName: name
  } = await loadOrderContext(context.supabase, data.orderId, {
    financeVerified: true
  });
  const updated = await transition(context.supabase, data.orderId, "REFUND_PROCESSED", {
    remarks: `Refund of ₹${data.amount} processed. Ref: ${data.paymentReference}`,
    financeVerified: true
  });
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const processedAt = data.processedOn ?? (/* @__PURE__ */ new Date()).toISOString();
  const [{
    data: existingReq
  }, {
    data: existingRefundPayments
  }] = await Promise.all([supabaseAdmin.from("refund_requests").select("id, status, processed_at, refund_amount").eq("application_id", data.orderId).maybeSingle(), supabaseAdmin.from("payments").select("id, amount, status, gateway_name, transaction_id, created_at").eq("application_id", data.orderId).lt("amount", 0).order("created_at", {
    ascending: true
  })]);
  const alreadyProcessed = Boolean(order.refund_processed_at || existingReq?.processed_at || existingRefundPayments && existingRefundPayments.length > 0);
  if (existingRefundPayments && existingRefundPayments.length > 1) {
    const excessIds = existingRefundPayments.slice(1).map((p) => p.id);
    await supabaseAdmin.from("payments").delete().in("id", excessIds);
  }
  const {
    data: origPayment
  } = await supabaseAdmin.from("payments").select("id, amount, currency, gateway_name, customer_id, lead_id").or(`application_id.eq.${data.orderId},lead_id.eq.${order.lead_id ?? "00000000-0000-0000-0000-000000000000"}`).eq("status", "paid").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const resolvedGateway = data.gatewayName || origPayment?.gateway_name || "manual";
  const refundAmountNeg = -Math.abs(Number(data.amount));
  if (!existingRefundPayments || existingRefundPayments.length === 0) {
    await supabaseAdmin.from("payments").insert({
      lead_id: order.lead_id ?? origPayment?.lead_id ?? null,
      application_id: data.orderId,
      customer_id: origPayment?.customer_id ?? order.customer_id ?? null,
      parent_payment_id: origPayment?.id ?? null,
      amount: refundAmountNeg,
      base_amount: refundAmountNeg,
      gst_amount: 0,
      currency: origPayment?.currency ?? "INR",
      status: "refunded",
      gateway_name: resolvedGateway,
      transaction_id: data.paymentReference,
      refund_reason: "refund_processed",
      payment_date: processedAt
    });
  }
  if (origPayment?.id) {
    await supabaseAdmin.from("payments").update({
      status: "refunded"
    }).eq("id", origPayment.id);
  }
  const rrPayload = {
    status: "processed",
    admin_notes: `PROCESSED @ ${processedAt} | Ref: ${data.paymentReference} | Amount: ₹${data.amount}`,
    refund_amount: data.amount,
    gateway_ref: data.paymentReference,
    gateway_name: resolvedGateway,
    processed_at: processedAt,
    processed_by: context.userId
  };
  let {
    error: rrError
  } = await supabaseAdmin.from("refund_requests").update(rrPayload).eq("application_id", data.orderId);
  if (rrError && rrError.message?.toLowerCase().includes("enum")) {
    delete rrPayload.status;
    const retryRes = await supabaseAdmin.from("refund_requests").update(rrPayload).eq("application_id", data.orderId);
    rrError = retryRes.error;
  }
  if (rrError) {
    console.error("[markRefundProcessed] refund_requests update warning:", rrError);
  }
  if (order.lead_id) {
    const {
      data: matchedApp
    } = await supabaseAdmin.from("refund_requests").select("id").eq("application_id", data.orderId).limit(1);
    if (!matchedApp || matchedApp.length === 0) {
      await supabaseAdmin.from("refund_requests").update({
        ...rrPayload,
        application_id: data.orderId
      }).eq("lead_id", order.lead_id);
    }
  }
  await supabaseAdmin.from("applications").update({
    refund_processed_at: processedAt,
    refund_gateway_ref: data.paymentReference
  }).eq("id", data.orderId);
  if (!alreadyProcessed) {
    await writeRefundEvent(data.orderId, "processed", context.userId, {
      note: `Ref ${data.paymentReference}`,
      meta: {
        amount: data.amount,
        gateway_ref: data.paymentReference,
        gateway_name: resolvedGateway
      }
    });
  }
  if (order.lead_id) {
    try {
      const {
        transitionLeadStatus
      } = await import("./lead-status.functions-rIiSyzbQ.mjs");
      await transitionLeadStatus({
        data: {
          leadId: order.lead_id,
          toStatus: "refunded"
        }
      });
    } catch (err) {
      console.error("[markRefundProcessed] lead transition to refunded failed:", err);
    }
  }
  try {
    const {
      invalidateRevenueCache
    } = await import("./revenue-admin.functions-CCSJJWJX.mjs");
    invalidateRevenueCache();
  } catch (err) {
    console.error("[markRefundProcessed] invalidateRevenueCache failed:", err);
  }
  let emailQueued = false;
  if (to && !alreadyProcessed) {
    const approvalDateIso = order.refund_approved_at || processedAt;
    const approvalDateFormatted = new Date(approvalDateIso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const cleanRefundNum = Number(data.amount).toFixed(2);
    const formattedRefundRupees = `₹${Number(data.amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    const finalServiceName = order.service_name || lead?.service || "UDYAM Registration Service";
    emailQueued = await queueTemplateEmail("refund_processed_confirmation", to, {
      customerName: name,
      customer_name: name,
      orderNumber: order.application_code || order.id.slice(0, 8),
      order_number: order.application_code || order.id.slice(0, 8),
      serviceName: finalServiceName,
      service_name: finalServiceName,
      refundStatus: "Approved",
      refund_status: "Approved",
      refundAmount: cleanRefundNum,
      refund_amount: cleanRefundNum,
      refundAmountFormatted: formattedRefundRupees,
      refund_amount_formatted: formattedRefundRupees,
      paymentReference: data.paymentReference,
      payment_reference: data.paymentReference,
      refundReferenceNo: data.paymentReference,
      refund_reference_no: data.paymentReference,
      refundGatewayRef: data.paymentReference,
      refund_gateway_ref: data.paymentReference,
      refundApprovalDate: approvalDateFormatted,
      refund_approval_date: approvalDateFormatted,
      refundApprovalDateTime: approvalDateFormatted,
      refund_approval_date_time: approvalDateFormatted,
      refundApprovalDateAndTime: approvalDateFormatted,
      refund_approval_date_and_time: approvalDateFormatted,
      refundApprovedAt: approvalDateFormatted,
      refund_approved_at: approvalDateFormatted,
      gatewayName: resolvedGateway,
      gateway_name: resolvedGateway,
      processedOn: processedAt.slice(0, 10),
      fromName: process.env.ZOHO_FROM_NAME || "Business Help Services"
    }, {
      applicationId: order.id,
      leadId: order.lead_id
    });
  }
  try {
    await transition(context.supabase, data.orderId, "CLOSED", {
      remarks: "Auto-closed after refund processed"
    });
    const {
      cancelAllForOrder
    } = await import("./schedulers.server-BPR-45Y2.mjs");
    await cancelAllForOrder(data.orderId, "refund_processed");
  } catch (e) {
    console.error("[markRefundProcessed] auto-close failed", e);
  }
  return {
    ok: true,
    order: updated,
    emailQueued
  };
});
const reopenOrder_createServerFn_handler = createServerRpc({
  id: "139cfe50af2c54ecfb9839c55ae9ccf4c83c6228ef78b8acd6e2f1027946564a",
  name: "reopenOrder",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => reopenOrder.__executeServer(opts));
const reopenOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  remarks: string().max(2e3).optional()
}).parse(raw)).handler(reopenOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: preApp
  } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, application_code, order_status, fulfillment_status, workflow_status, application_status, form_submitted_at, assigned_to").eq("id", data.orderId).maybeSingle();
  if (!preApp) {
    throw new Error("Order not found");
  }
  const previousStage = preApp?.fulfillment_status || preApp?.workflow_status || preApp?.order_status || "closed";
  const previousStatus = preApp?.order_status || "CLOSED";
  const {
    data: staffProf
  } = await supabaseAdmin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle();
  const staffName = staffProf?.display_name || staffProf?.email || "Staff";
  const {
    error: upErr
  } = await supabaseAdmin.from("applications").update({
    order_status: "REOPENED",
    fulfillment_status: "form_submitted",
    workflow_status: "processing_resumed",
    closure_stage: "none",
    application_status: "form_submitted",
    closure_reason_id: null,
    closure_reason_code: null,
    closure_reason_text: null,
    closure_remarks: null,
    closure_next_at: null,
    cancellation_requested_at: null,
    customer_hold_started_at: null,
    technical_hold_started_at: null,
    technical_hold_kind: null,
    active_reason_id: null,
    active_reason_text: null,
    workflow_delay_reason: null,
    workflow_expected_review_at: null,
    reopened_at: now,
    reopened_by: context.userId,
    updated_at: now
  }).eq("id", data.orderId);
  if (upErr) throw new Error(`Failed to update application status: ${upErr.message}`);
  try {
    await supabaseAdmin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: now,
      stop_reason: "order_reopened",
      stop_triggered_by: context.userId,
      updated_at: now
    }).eq("application_id", data.orderId).in("status", ["active", "paused"]);
    await supabaseAdmin.from("order_schedulers").insert({
      application_id: data.orderId,
      scheduler_type: "our_side_reminder",
      status: "active",
      started_at: now,
      fires_at: now,
      remarks: JSON.stringify({
        reason: "order_reopened",
        reasonLabel: "Order Reopened - Urgent Action Required",
        note: data.remarks || "Order reopened for processing",
        durationMinutes: 0,
        created_by_name: staffName,
        created_at: now
      }),
      created_by: context.userId
    });
  } catch (schedErr) {
    console.warn("[reopenOrder] hot order scheduler insert warning:", schedErr);
  }
  try {
    const {
      ensureActiveAssigneeForReopenedOrder
    } = await import("./assignment-engine.server--SlhbLzd.mjs");
    await ensureActiveAssigneeForReopenedOrder({
      orderId: data.orderId,
      actorId: context.userId,
      origin: "order_reopen",
      currentAssigneeId: preApp.assigned_to
    });
  } catch (assignErr) {
    console.warn("[reopenOrder] auto-reassign warning:", assignErr);
  }
  try {
    await supabaseAdmin.from("workflow_events").insert({
      application_id: data.orderId,
      lead_id: preApp.lead_id ?? null,
      event_type: "order_reopened",
      title: "Order Reopened",
      description: data.remarks ?? "Order reopened by staff",
      customer_visible: false,
      actor_id: context.userId,
      actor_name: staffName,
      is_system: false,
      metadata: {
        event: "ORDER_REOPENED",
        previousStage,
        previousStatus,
        newStage: "Order Reopened",
        reopenedBy: context.userId,
        reopenedAt: now,
        notes: data.remarks ?? null
      }
    });
  } catch (wfErr) {
    console.warn("[reopenOrder] workflow_events insert warning:", wfErr);
  }
  try {
    await supabaseAdmin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: preApp.lead_id ?? null,
      customer_id: preApp.customer_id ?? null,
      event_type: "order_status_change",
      old_value: String(previousStatus),
      new_value: "REOPENED",
      note: data.remarks ?? "Order reopened — entered Order Reopened stage",
      created_by: context.userId,
      staff_name: staffName,
      staff_role: "staff"
    });
  } catch (appEvtErr) {
    console.warn("[reopenOrder] application_events insert warning:", appEvtErr);
  }
  try {
    const {
      logEmployeeOrderAction
    } = await import("./order-action-logger.server-DJE-NEoc.mjs");
    await logEmployeeOrderAction({
      orderId: data.orderId,
      leadId: preApp.lead_id,
      customerId: preApp.customer_id,
      employeeId: context.userId,
      employeeName: staffName,
      actionType: "ORDER_REOPENED",
      previousStatus,
      newStatus: "REOPENED",
      previousStage,
      newStage: "Order Reopened",
      notes: data.remarks || "Order reopened by staff",
      source: "employee",
      customMetadata: {
        previousStage,
        previousStatus,
        reopenedAt: now,
        reopenedBy: context.userId
      },
      supabase: supabaseAdmin
    });
  } catch (auditErr) {
    console.warn("[reopenOrder] audit log warning:", auditErr);
  }
  if (preApp.lead_id) {
    try {
      const [{
        data: lead
      }, {
        data: paidPayment
      }] = await Promise.all([supabaseAdmin.from("leads").select("id, lead_status_v2, status").eq("id", preApp.lead_id).maybeSingle(), supabaseAdmin.from("payments").select("id").eq("lead_id", preApp.lead_id).eq("status", "paid").limit(1).maybeSingle()]);
      if (lead) {
        const isClosedLead = ["closed", "closed_refunded", "uninterested"].includes(String(lead.lead_status_v2 ?? "")) || ["closed", "uninterested"].includes(String(lead.status ?? ""));
        if (isClosedLead) {
          const nextLeadStatus = paidPayment ? "payment_successful" : "contacted";
          await supabaseAdmin.from("leads").update({
            lead_status_v2: nextLeadStatus,
            status: nextLeadStatus,
            updated_at: now
          }).eq("id", lead.id);
        }
      }
    } catch (leadErr) {
      console.warn("[reopenOrder] lead status update warning:", leadErr);
    }
  }
  return {
    ok: true,
    order: {
      ...preApp,
      order_status: "REOPENED",
      fulfillment_status: "order_reopened",
      workflow_status: "order_reopened",
      application_status: "order_reopened",
      updated_at: now
    }
  };
});
const closeOrderManual_createServerFn_handler = createServerRpc({
  id: "689fb74e74add6e8405035f16e80a0ec153925c679935db680207f704a42a466",
  name: "closeOrderManual",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => closeOrderManual.__executeServer(opts));
const closeOrderManual = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  reasonId: string().uuid().optional(),
  remarks: string().max(2e3).optional()
}).parse(raw)).handler(closeOrderManual_createServerFn_handler, async ({
  data,
  context
}) => {
  const updated = await transition(context.supabase, data.orderId, "CLOSED", {
    reasonId: data.reasonId ?? null,
    remarks: data.remarks ?? null
  });
  const {
    cancelAllForOrder
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await cancelAllForOrder(data.orderId, "manually_closed");
  return {
    ok: true,
    order: updated
  };
});
const sendManualReminder_createServerFn_handler = createServerRpc({
  id: "0a0717370d67ad8f065badb00209f693544d7eb79c1282b2a800d01bc0a0c8b1",
  name: "sendManualReminder",
  filename: "src/lib/orders/order-actions.functions.ts"
}, (opts) => sendManualReminder.__executeServer(opts));
const sendManualReminder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().max(1e3).optional()
}).parse(raw)).handler(sendManualReminder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    order,
    recipientEmail: to,
    recipientName: name
  } = await loadOrderContext(context.supabase, data.orderId);
  if (!to) return {
    ok: false,
    reason: "no_email"
  };
  const emailQueued = await queueTemplateEmail("bhs_e005_manual_reminder", to, {
    customerName: name,
    orderNumber: order.application_code || order.id.slice(0, 8),
    message: data.note || "",
    fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
  }, {
    applicationId: order.id,
    leadId: order.lead_id
  });
  return {
    ok: emailQueued
  };
});
export {
  addRefundNote_createServerFn_handler,
  approveRefund_createServerFn_handler,
  closeOrderManual_createServerFn_handler,
  completeOrder_createServerFn_handler,
  customerSideDelay_createServerFn_handler,
  escalateRefund_createServerFn_handler,
  markCertificateIssued_createServerFn_handler,
  markRefundProcessed_createServerFn_handler,
  markSubmittedToGovt_createServerFn_handler,
  ourSideDelay_createServerFn_handler,
  rejectRefund_createServerFn_handler,
  reopenOrder_createServerFn_handler,
  requestRefundInfo_createServerFn_handler,
  requestRefund_createServerFn_handler,
  sendFormLink_createServerFn_handler,
  sendManualReminder_createServerFn_handler,
  startProcessing_createServerFn_handler
};
