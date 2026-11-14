import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, _ as _enum, n as number } from "../_libs/zod.mjs";
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
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function getStaff(userId) {
  const admin = await getAdmin();
  const [{
    data: p
  }, {
    data: rr
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle()]);
  return {
    staff_name: p?.display_name || p?.email || "Staff",
    staff_role: rr?.role || "staff"
  };
}
const scheduleOrderCallback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  reason: string().min(1),
  reasonLabel: string().min(1),
  durationMinutes: number().min(1).optional(),
  customFiresAt: string().optional(),
  note: string().optional().nullable(),
  channel: _enum(["call", "email"]).optional().default("call"),
  idempotencyKey: string().optional(),
  sessionId: string().optional()
}).parse(i)).handler(createSsrRpc("25670f8db79f2897dd4e72cdf89c9c54da59ffcab9f14d776141b39625fad9e3"));
const cancelOrderCallback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  schedulerId: string().uuid().optional(),
  reason: string().optional().nullable()
}).parse(i)).handler(createSsrRpc("8a3bb9359a2be76e216599f64b8c23a31c29a05a5567c18a30becfdbbc4d9797"));
const completeOrderCallback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  schedulerId: string().uuid().optional(),
  callOutcomeNote: string().optional().nullable()
}).parse(i)).handler(createSsrRpc("9bda9d91530f581142f950e4afc1f1466417da335f64953fb15a66d7ba2ee5de"));
async function completeHotOrderOnQualifyingAction(params) {
  const admin = params.supabase || await getAdmin();
  const now = /* @__PURE__ */ new Date();
  const nowIso = now.toISOString();
  let actorName = params.actorName;
  let actorRole = params.actorRole;
  if (!actorName && params.actorId) {
    const staff = await getStaff(params.actorId);
    actorName = staff.staff_name;
    actorRole = staff.staff_role;
  }
  actorName = actorName || "Staff";
  actorRole = actorRole || "staff";
  const {
    data: activeSchedulers
  } = await admin.from("order_schedulers").select("id, application_id, status, fires_at, remarks, created_at, created_by").eq("application_id", params.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).eq("status", "active").order("created_at", {
    ascending: false
  });
  const {
    data: appRow
  } = await admin.from("applications").select("id, lead_id, customer_id, fulfillment_status, order_status, application_status, workflow_status, form_submitted_at").eq("id", params.orderId).maybeSingle();
  const fs = String(appRow?.fulfillment_status ?? "").toLowerCase();
  const os = String(appRow?.order_status ?? "").toUpperCase();
  const ws = String(appRow?.workflow_status ?? "").toLowerCase();
  const isReopenedHot = fs === "order_reopened" || os === "REOPENED" || ws === "order_reopened" || ws === "processing_resumed";
  const hasSchedulers = activeSchedulers && activeSchedulers.length > 0;
  if (!hasSchedulers && !isReopenedHot) {
    return {
      completed: false
    };
  }
  if (hasSchedulers) {
    await admin.from("order_schedulers").update({
      status: "completed",
      stopped_at: nowIso,
      stop_reason: `Qualifying action: ${params.actionName}`,
      stop_triggered_by: params.actorId
    }).eq("application_id", params.orderId).in("status", ["active", "paused"]);
  }
  if (isReopenedHot) {
    const nextFulfillment = appRow?.form_submitted_at ? "form_submitted" : "form_not_submitted";
    const nextOrderStatus = appRow?.form_submitted_at ? "IN_PROCESSING" : "FORM_PENDING";
    const {
      error: appUpErr
    } = await admin.from("applications").update({
      fulfillment_status: nextFulfillment,
      order_status: nextOrderStatus,
      application_status: "under_process",
      workflow_status: "processing",
      updated_at: nowIso
    }).eq("id", params.orderId);
    if (appUpErr) {
      console.warn("[completeHotOrderOnQualifyingAction] applications update warning:", appUpErr);
    }
  }
  const primaryScheduler = hasSchedulers ? activeSchedulers[0] : null;
  let prevReason = null;
  let prevReasonLabel = null;
  let prevNote = null;
  let prevChannel = "call";
  if (primaryScheduler?.remarks) {
    try {
      const parsed = typeof primaryScheduler.remarks === "string" ? JSON.parse(primaryScheduler.remarks) : primaryScheduler.remarks;
      prevReason = parsed?.reason || null;
      prevReasonLabel = parsed?.reasonLabel || null;
      prevNote = parsed?.note || null;
      prevChannel = parsed?.channel || "call";
    } catch {
      prevReason = "custom";
      prevReasonLabel = String(primaryScheduler.remarks);
    }
  }
  const completedReason = params.actionReason || `${params.actionName} action performed`;
  const completedReasonLabel = `${params.actionName} action performed`;
  try {
    await admin.from("order_callback_history").insert({
      order_id: params.orderId,
      actor_id: params.actorId,
      actor_name: actorName,
      actor_role: actorRole,
      action_type: "CALLBACK_COMPLETED",
      previous_fires_at: primaryScheduler?.fires_at || null,
      new_fires_at: null,
      reason: completedReason,
      reason_label: completedReasonLabel,
      previous_reason: prevReason,
      previous_reason_label: prevReasonLabel,
      note: params.actionReason || null,
      previous_note: prevNote,
      channel: prevChannel,
      source: "employee"
    });
  } catch (hErr) {
    console.warn("[completeHotOrderOnQualifyingAction] history insert warning:", hErr);
  }
  const formattedScheduled = primaryScheduler?.fires_at ? new Date(primaryScheduler.fires_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }) : null;
  now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  try {
    await admin.from("application_events").insert({
      created_by: params.actorId ?? null,
      application_id: params.orderId,
      event_type: "callback_completed",
      note: `Call completed: ${params.actionName} action performed by ${actorName}${params.actionReason ? ` (${params.actionReason})` : ""}`,
      staff_name: actorName,
      staff_role: actorRole
    });
  } catch (e1) {
    console.warn("[completeHotOrderOnQualifyingAction] application_events warning:", e1);
  }
  try {
    await admin.from("workflow_events").insert({
      application_id: params.orderId,
      lead_id: appRow?.lead_id ?? null,
      event_type: "callback_completed",
      title: `Call Completed: ${actorName}`,
      description: `${params.actionName} action performed · Call Completed by ${actorName}${formattedScheduled ? ` (Scheduled: ${formattedScheduled})` : ""}${params.actionReason ? ` · Note: ${params.actionReason}` : ""}`,
      customer_visible: false,
      actor_id: params.actorId,
      actor_name: actorName,
      actor_role: actorRole,
      is_system: false,
      metadata: {
        action: params.actionName,
        reason: completedReason,
        scheduled_fires_at: primaryScheduler?.fires_at || null,
        completed_at: nowIso
      }
    });
    if (appRow?.lead_id) {
      await admin.from("activity_logs").insert({
        lead_id: appRow.lead_id,
        user_id: params.actorId,
        activity_type: "callback_completed",
        activity_description: `Call Completed (${params.actionName}): ${actorName}`
      });
    }
  } catch (e2) {
    console.warn("[completeHotOrderOnQualifyingAction] workflow_events warning:", e2);
  }
  try {
    const {
      logEmployeeOrderAction
    } = await import("./order-action-logger.server-DJE-NEoc.mjs");
    await logEmployeeOrderAction({
      orderId: params.orderId,
      employeeId: params.actorId,
      employeeName: actorName,
      employeeRole: actorRole,
      actionType: "CUSTOMER_CONTACTED",
      notes: `Call Completed via ${params.actionName} action by ${actorName}${params.actionReason ? ` · Note: ${params.actionReason}` : ""}`,
      source: "employee",
      supabase: admin
    });
  } catch (e3) {
    console.warn("[completeHotOrderOnQualifyingAction] order_action_logs warning:", e3);
  }
  return {
    completed: true
  };
}
const getActiveOrderCallback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(createSsrRpc("f426295b42c2bf51fdda901383002069a52b92aad539fb6bafccf4753f990f43"));
const getOrderCallbackHistory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(createSsrRpc("edde8b335979e78bb77341824d287de67497b8db1b0f5f5033eb06506eb51698"));
const getOrderCallbackHistoryCount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(createSsrRpc("ec2a2915f1335882f896f05269d03c351f59b66ffacffe24530c11a59fe03058"));
const getDueRemindersSummary = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({}).optional()).handler(createSsrRpc("a6f9794ff59810cecbc6972eabeabcad4e07624fe54a7cd8455a06d358a9a633"));
export {
  cancelOrderCallback,
  completeHotOrderOnQualifyingAction,
  completeOrderCallback,
  getActiveOrderCallback,
  getDueRemindersSummary,
  getOrderCallbackHistory,
  getOrderCallbackHistoryCount,
  scheduleOrderCallback
};
