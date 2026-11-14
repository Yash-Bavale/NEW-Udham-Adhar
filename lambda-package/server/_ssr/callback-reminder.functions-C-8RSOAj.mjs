import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
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
async function assertStaff(_supabase, userId) {
  const admin = await getAdmin();
  let query = admin.from("user_roles").select("role");
  const {
    data
  } = await query;
  const roles = new Set((data ?? []).map((r) => r.role));
  const allowed = ["admin", "super_admin", "operations", "support", "accounts", "finance", "executive", "manager"];
  if (!allowed.some((r) => roles.has(r))) throw new Error("Forbidden");
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
const scheduleOrderCallback_createServerFn_handler = createServerRpc({
  id: "25670f8db79f2897dd4e72cdf89c9c54da59ffcab9f14d776141b39625fad9e3",
  name: "scheduleOrderCallback",
  filename: "src/lib/orders/actions/callback-reminder.functions.ts"
}, (opts) => scheduleOrderCallback.__executeServer(opts));
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
}).parse(i)).handler(scheduleOrderCallback_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const staff = await getStaff(context.userId);
  if (data.idempotencyKey) {
    try {
      const {
        data: existingHistory
      } = await admin.from("order_callback_history").select("id, new_fires_at, reason_label").eq("idempotency_key", data.idempotencyKey).maybeSingle();
      if (existingHistory) {
        return {
          success: true,
          schedulerId: existingHistory.id,
          firesAt: existingHistory.new_fires_at,
          reasonLabel: existingHistory.reason_label
        };
      }
    } catch {
    }
  }
  const now = /* @__PURE__ */ new Date();
  let firesAtDate;
  if (data.customFiresAt) {
    firesAtDate = new Date(data.customFiresAt);
    if (isNaN(firesAtDate.getTime())) {
      throw new Error("Invalid custom date/time provided");
    }
  } else if (data.durationMinutes && data.durationMinutes > 0) {
    firesAtDate = new Date(now.getTime() + data.durationMinutes * 6e4);
  } else {
    throw new Error("Either durationMinutes or customFiresAt must be provided");
  }
  const firesAtIso = firesAtDate.toISOString();
  const remarksObj = {
    reason: data.reason,
    reasonLabel: data.reasonLabel,
    note: data.note?.trim() || null,
    durationMinutes: data.durationMinutes ?? null,
    channel: data.channel ?? "call",
    created_by_name: staff.staff_name,
    created_at: now.toISOString()
  };
  const {
    data: existingActive
  } = await admin.from("order_schedulers").select("id, status, fires_at, remarks, created_by, created_at").eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).eq("status", "active").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  let isReschedule = false;
  let previousFiresAt = null;
  let previousReason = null;
  let previousReasonLabel = null;
  let previousNote = null;
  if (existingActive) {
    isReschedule = true;
    previousFiresAt = existingActive.fires_at;
    if (existingActive.remarks) {
      try {
        const parsed = typeof existingActive.remarks === "string" ? JSON.parse(existingActive.remarks) : existingActive.remarks;
        previousReason = parsed?.reason || null;
        previousReasonLabel = parsed?.reasonLabel || null;
        previousNote = parsed?.note || null;
      } catch {
        previousReason = "custom";
        previousReasonLabel = existingActive.remarks;
      }
    }
  }
  const actionType = isReschedule ? "CALLBACK_RESCHEDULED" : "CALLBACK_SCHEDULED";
  await admin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: isReschedule ? "rescheduled_new_callback" : "new_callback_scheduled",
    stop_triggered_by: context.userId
  }).eq("application_id", data.orderId).in("status", ["active", "paused"]);
  const {
    data: created,
    error
  } = await admin.from("order_schedulers").insert({
    application_id: data.orderId,
    scheduler_type: "our_side_reminder",
    status: "active",
    started_at: now.toISOString(),
    fires_at: firesAtIso,
    remarks: JSON.stringify(remarksObj),
    created_by: context.userId
  }).select("id, application_id, status, fires_at, remarks, created_at").single();
  if (error) {
    console.error("[scheduleOrderCallback] insert error:", error);
    throw new Error(`Failed to schedule callback: ${error.message}`);
  }
  try {
    await admin.from("order_callback_history").insert({
      order_id: data.orderId,
      actor_id: context.userId,
      actor_name: staff.staff_name,
      actor_role: staff.staff_role,
      action_type: actionType,
      previous_fires_at: previousFiresAt,
      new_fires_at: firesAtIso,
      reason: data.reason,
      reason_label: data.reasonLabel,
      previous_reason: previousReason,
      previous_reason_label: previousReasonLabel,
      note: data.note?.trim() || null,
      previous_note: previousNote,
      channel: data.channel ?? "call",
      source: "employee",
      session_id: data.sessionId ?? null,
      idempotency_key: data.idempotencyKey ?? null
    });
  } catch (histErr) {
    console.warn("[scheduleOrderCallback] order_callback_history insert warning:", histErr);
  }
  const istFormattedTime = firesAtDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }) + " IST";
  const actionLabel = isReschedule ? "Callback Rescheduled" : "Callback Scheduled";
  const noteText = `${actionLabel} for ${istFormattedTime} · Reason: ${data.reasonLabel}${data.note ? ` (${data.note})` : ""}`;
  try {
    await admin.from("application_events").insert({
      created_by: context.userId,
      application_id: data.orderId,
      event_type: isReschedule ? "callback_rescheduled" : "callback_scheduled",
      note: noteText,
      staff_name: staff.staff_name,
      staff_role: staff.staff_role || "staff"
    });
  } catch (e1) {
    console.warn("[scheduleOrderCallback] application_events insert warning:", e1);
  }
  try {
    const {
      data: appRow
    } = await admin.from("applications").select("lead_id").eq("id", data.orderId).maybeSingle();
    await admin.from("workflow_events").insert({
      application_id: data.orderId,
      lead_id: appRow?.lead_id ?? null,
      event_type: isReschedule ? "callback_rescheduled" : "callback_scheduled",
      title: `${actionLabel}: ${data.reasonLabel}`,
      description: `Scheduled for ${istFormattedTime}.${previousFiresAt ? ` (Previous: ${new Date(previousFiresAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })})` : ""} ${data.note ? `Note: ${data.note}` : ""}`,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: staff.staff_name,
      actor_role: staff.staff_role,
      is_system: false,
      metadata: {
        scheduler_id: created.id,
        action_type: actionType,
        previous_fires_at: previousFiresAt,
        reason: data.reason,
        reasonLabel: data.reasonLabel,
        fires_at: firesAtIso,
        note: data.note
      }
    });
    if (appRow?.lead_id) {
      await admin.from("activity_logs").insert({
        lead_id: appRow.lead_id,
        user_id: context.userId,
        activity_type: isReschedule ? "callback_rescheduled" : "callback_scheduled",
        activity_description: `${actionLabel} for ${istFormattedTime}: ${data.reasonLabel}`
      });
    }
  } catch (e2) {
    console.warn("[scheduleOrderCallback] workflow_events insert warning:", e2);
  }
  try {
    const {
      logEmployeeOrderAction
    } = await import("./order-action-logger.server-DJE-NEoc.mjs");
    await logEmployeeOrderAction({
      orderId: data.orderId,
      employeeId: context.userId,
      employeeName: staff.staff_name,
      employeeRole: staff.staff_role,
      actionType,
      notes: `${actionLabel} for ${istFormattedTime} · Reason: ${data.reasonLabel}${data.note ? ` (${data.note})` : ""}`,
      source: "employee",
      supabase: admin
    });
  } catch (auditErr) {
    console.warn("[scheduleOrderCallback] order_action_logs warning:", auditErr);
  }
  return {
    success: true,
    schedulerId: created.id,
    firesAt: firesAtDate.toISOString(),
    reasonLabel: data.reasonLabel,
    actionType
  };
});
const cancelOrderCallback_createServerFn_handler = createServerRpc({
  id: "8a3bb9359a2be76e216599f64b8c23a31c29a05a5567c18a30becfdbbc4d9797",
  name: "cancelOrderCallback",
  filename: "src/lib/orders/actions/callback-reminder.functions.ts"
}, (opts) => cancelOrderCallback.__executeServer(opts));
const cancelOrderCallback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  schedulerId: string().uuid().optional(),
  reason: string().optional().nullable()
}).parse(i)).handler(cancelOrderCallback_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const staff = await getStaff(context.userId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: existingActive
  } = await admin.from("order_schedulers").select("id, fires_at, remarks").eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).eq("status", "active").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  let query = admin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now,
    stop_reason: data.reason || "cancelled_by_staff",
    stop_triggered_by: context.userId
  }).eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).in("status", ["active", "paused"]);
  if (data.schedulerId) {
    query = query.eq("id", data.schedulerId);
  }
  const {
    error
  } = await query;
  if (error) throw new Error(error.message);
  try {
    let prevReason = null;
    let prevLabel = null;
    if (existingActive?.remarks) {
      try {
        const p = typeof existingActive.remarks === "string" ? JSON.parse(existingActive.remarks) : existingActive.remarks;
        prevReason = p.reason;
        prevLabel = p.reasonLabel;
      } catch {
        prevLabel = existingActive.remarks;
      }
    }
    await admin.from("order_callback_history").insert({
      order_id: data.orderId,
      actor_id: context.userId,
      actor_name: staff.staff_name,
      actor_role: staff.staff_role,
      action_type: "CALLBACK_CANCELLED",
      previous_fires_at: existingActive?.fires_at || null,
      new_fires_at: null,
      reason: data.reason || "cancelled_by_staff",
      reason_label: data.reason || "Cancelled by staff",
      previous_reason: prevReason,
      previous_reason_label: prevLabel,
      channel: "call",
      source: "employee"
    });
  } catch (hErr) {
    console.warn("[cancelOrderCallback] history log warning:", hErr);
  }
  try {
    await admin.from("application_events").insert({
      created_by: context.userId,
      application_id: data.orderId,
      event_type: "callback_cancelled",
      note: `Callback cancelled by ${staff.staff_name}`,
      staff_name: staff.staff_name,
      staff_role: staff.staff_role || "staff"
    });
  } catch (evtErr) {
    console.warn("[cancelOrderCallback] event log warning:", evtErr);
  }
  return {
    success: true
  };
});
const completeOrderCallback_createServerFn_handler = createServerRpc({
  id: "9bda9d91530f581142f950e4afc1f1466417da335f64953fb15a66d7ba2ee5de",
  name: "completeOrderCallback",
  filename: "src/lib/orders/actions/callback-reminder.functions.ts"
}, (opts) => completeOrderCallback.__executeServer(opts));
const completeOrderCallback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  schedulerId: string().uuid().optional(),
  callOutcomeNote: string().optional().nullable()
}).parse(i)).handler(completeOrderCallback_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const staff = await getStaff(context.userId);
  const now = /* @__PURE__ */ new Date();
  const nowIso = now.toISOString();
  const {
    data: existingActive
  } = await admin.from("order_schedulers").select("id, fires_at, remarks, created_at").eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).eq("status", "active").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  let query = admin.from("order_schedulers").update({
    status: "completed",
    stopped_at: nowIso,
    stop_reason: data.callOutcomeNote ? `Call completed: ${data.callOutcomeNote}` : "completed_by_staff",
    stop_triggered_by: context.userId
  }).eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).eq("status", "active");
  if (data.schedulerId) {
    query = query.eq("id", data.schedulerId);
  }
  const {
    error
  } = await query;
  if (error) throw new Error(error.message);
  const {
    data: appRow
  } = await admin.from("applications").select("id, lead_id, fulfillment_status, order_status, workflow_status, application_status, form_submitted_at").eq("id", data.orderId).maybeSingle();
  const fsCur = String(appRow?.fulfillment_status ?? "").toLowerCase();
  const osCur = String(appRow?.order_status ?? "").toUpperCase();
  const wsCur = String(appRow?.workflow_status ?? "").toLowerCase();
  const isReopenedOrder = fsCur === "order_reopened" || osCur === "REOPENED" || wsCur === "order_reopened" || wsCur === "processing_resumed";
  if (isReopenedOrder) {
    const nextFulfillment = appRow?.form_submitted_at ? "form_submitted" : "form_not_submitted";
    const nextOrderStatus = appRow?.form_submitted_at ? "IN_PROCESSING" : "FORM_PENDING";
    const {
      error: appUpErr
    } = await admin.from("applications").update({
      fulfillment_status: nextFulfillment,
      order_status: nextOrderStatus,
      application_status: "under_process",
      workflow_status: "processing",
      is_hot: false,
      updated_at: nowIso
    }).eq("id", data.orderId);
    if (appUpErr) {
      console.error("[completeOrderCallback] applications update error, trying fallback:", appUpErr);
      await admin.from("applications").update({
        fulfillment_status: nextFulfillment,
        order_status: nextOrderStatus,
        workflow_status: "processing",
        updated_at: nowIso
      }).eq("id", data.orderId);
    }
  } else {
    await admin.from("applications").update({
      is_hot: false,
      updated_at: nowIso
    }).eq("id", data.orderId).then(() => {
    });
  }
  let prevReason = null;
  let prevLabel = null;
  let prevNote = null;
  let prevChannel = "call";
  if (existingActive?.remarks) {
    try {
      const p = typeof existingActive.remarks === "string" ? JSON.parse(existingActive.remarks) : existingActive.remarks;
      prevReason = p.reason;
      prevLabel = p.reasonLabel;
      prevNote = p.note;
      prevChannel = p.channel || "call";
    } catch {
      prevLabel = existingActive.remarks;
    }
  }
  const reasonText = data.callOutcomeNote || prevNote || "Customer contacted successfully";
  const reasonLabelText = prevLabel || "Customer Contacted";
  try {
    await admin.from("order_callback_history").insert({
      order_id: data.orderId,
      actor_id: context.userId,
      actor_name: staff.staff_name,
      actor_role: staff.staff_role,
      action_type: "CALLBACK_COMPLETED",
      previous_fires_at: existingActive?.fires_at || null,
      new_fires_at: null,
      reason: reasonText,
      reason_label: reasonLabelText,
      previous_reason: prevReason,
      previous_reason_label: prevLabel,
      note: data.callOutcomeNote?.trim() || null,
      previous_note: prevNote,
      channel: prevChannel,
      source: "employee"
    });
  } catch (hErr) {
    console.warn("[completeOrderCallback] history log warning:", hErr);
  }
  const formattedScheduled = existingActive?.fires_at ? new Date(existingActive.fires_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }) : null;
  const formattedCompleted = now.toLocaleString("en-IN", {
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
      created_by: context.userId,
      application_id: data.orderId,
      event_type: "callback_completed",
      note: `Customer callback marked completed by ${staff.staff_name}.${formattedScheduled ? ` (Scheduled: ${formattedScheduled})` : ""}${data.callOutcomeNote ? ` Note: ${data.callOutcomeNote}` : ""}`,
      staff_name: staff.staff_name,
      staff_role: staff.staff_role || "staff"
    });
  } catch (evtErr) {
    console.warn("[completeOrderCallback] event log warning:", evtErr);
  }
  try {
    await admin.from("workflow_events").insert({
      application_id: data.orderId,
      lead_id: appRow?.lead_id ?? null,
      event_type: "callback_completed",
      title: `Call Completed: ${staff.staff_name}`,
      description: `Customer contacted successfully by ${staff.staff_name}. Completed: ${formattedCompleted}.${formattedScheduled ? ` Scheduled Call: ${formattedScheduled}.` : ""}${data.callOutcomeNote ? ` Note: ${data.callOutcomeNote}` : ""}`,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: staff.staff_name,
      actor_role: staff.staff_role,
      is_system: false,
      metadata: {
        scheduler_id: existingActive?.id || null,
        scheduled_fires_at: existingActive?.fires_at || null,
        completed_at: nowIso,
        actor_name: staff.staff_name,
        reason: reasonText
      }
    });
    if (appRow?.lead_id) {
      await admin.from("activity_logs").insert({
        lead_id: appRow.lead_id,
        user_id: context.userId,
        activity_type: "callback_completed",
        activity_description: `Call Completed: ${staff.staff_name}`
      });
    }
  } catch (wErr) {
    console.warn("[completeOrderCallback] workflow_events log warning:", wErr);
  }
  try {
    const {
      logEmployeeOrderAction
    } = await import("./order-action-logger.server-DJE-NEoc.mjs");
    await logEmployeeOrderAction({
      orderId: data.orderId,
      employeeId: context.userId,
      employeeName: staff.staff_name,
      employeeRole: staff.staff_role,
      actionType: "CUSTOMER_CONTACTED",
      notes: `Callback completed by ${staff.staff_name}.${formattedScheduled ? ` Scheduled: ${formattedScheduled}.` : ""}${data.callOutcomeNote ? ` Outcome: ${data.callOutcomeNote}` : ""}`,
      source: "employee",
      supabase: admin
    });
  } catch (auditErr) {
    console.warn("[completeOrderCallback] order_action_logs warning:", auditErr);
  }
  return {
    success: true
  };
});
const getActiveOrderCallback_createServerFn_handler = createServerRpc({
  id: "f426295b42c2bf51fdda901383002069a52b92aad539fb6bafccf4753f990f43",
  name: "getActiveOrderCallback",
  filename: "src/lib/orders/actions/callback-reminder.functions.ts"
}, (opts) => getActiveOrderCallback.__executeServer(opts));
const getActiveOrderCallback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(getActiveOrderCallback_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const [{
    data: row,
    error
  }, {
    data: app
  }] = await Promise.all([admin.from("order_schedulers").select("id, application_id, status, fires_at, remarks, created_at, created_by").eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).eq("status", "active").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle(), admin.from("applications").select("fulfillment_status, application_status, order_status, workflow_status").eq("id", data.orderId).maybeSingle()]);
  let historyCount = 0;
  try {
    const {
      count
    } = await admin.from("order_callback_history").select("id", {
      count: "exact",
      head: true
    }).eq("order_id", data.orderId);
    historyCount = count ?? 0;
    if (historyCount === 0) {
      const {
        count: sCount
      } = await admin.from("order_schedulers").select("id", {
        count: "exact",
        head: true
      }).eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]);
      historyCount = sCount ?? 0;
    }
  } catch {
    historyCount = 0;
  }
  if (error) {
    console.error("[getActiveOrderCallback] error:", error);
    return null;
  }
  if (!row) return null;
  const fs = String(app?.fulfillment_status ?? "").toLowerCase();
  const os = String(app?.order_status ?? "").toLowerCase();
  const as = String(app?.application_status ?? "").toLowerCase();
  const ws = String(app?.workflow_status ?? "").toLowerCase();
  const isTerminal = ["completed", "order_completed", "consultation_completed", "order_closed", "cancelled", "application_rejected"].includes(fs) || ["completed", "closed", "cancelled"].includes(os) || ["completed", "closed", "cancelled"].includes(as) || ["completed", "closed", "cancelled"].includes(ws);
  if (isTerminal) {
    await admin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
      stop_reason: fs.includes("complete") ? "order_completed" : "order_closed"
    }).eq("application_id", data.orderId).eq("status", "active");
    return null;
  }
  let parsedRemarks = null;
  if (row.remarks) {
    try {
      parsedRemarks = typeof row.remarks === "string" ? JSON.parse(row.remarks) : row.remarks;
    } catch {
      parsedRemarks = {
        reason: "custom",
        reasonLabel: row.remarks
      };
    }
  }
  const firesAtTime = row.fires_at ? new Date(row.fires_at).getTime() : 0;
  const isDue = firesAtTime > 0 && firesAtTime <= Date.now();
  return {
    ...row,
    parsedRemarks,
    isDue,
    historyCount
  };
});
const getOrderCallbackHistory_createServerFn_handler = createServerRpc({
  id: "edde8b335979e78bb77341824d287de67497b8db1b0f5f5033eb06506eb51698",
  name: "getOrderCallbackHistory",
  filename: "src/lib/orders/actions/callback-reminder.functions.ts"
}, (opts) => getOrderCallbackHistory.__executeServer(opts));
const getOrderCallbackHistory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(getOrderCallbackHistory_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  try {
    const [{
      data: historyRows
    }, {
      data: appEvents
    }, {
      data: schedulers
    }] = await Promise.all([admin.from("order_callback_history").select("id, order_id, actor_id, actor_name, actor_role, action_type, previous_fires_at, new_fires_at, reason, reason_label, previous_reason, previous_reason_label, note, previous_note, channel, source, created_at").eq("order_id", data.orderId).order("created_at", {
      ascending: false
    }), admin.from("application_events").select("id, application_id, event_type, note, staff_name, staff_role, created_by, created_at").eq("application_id", data.orderId).or("event_type.ilike.%callback%,note.ilike.%callback%,note.ilike.%call completed%").order("created_at", {
      ascending: false
    }), admin.from("order_schedulers").select("id, application_id, scheduler_type, status, fires_at, remarks, created_at, created_by, stopped_at, stop_reason, stop_triggered_by").eq("application_id", data.orderId).in("scheduler_type", ["our_side_reminder", "callback_reminder"]).order("created_at", {
      ascending: false
    })]);
    const items = [];
    const seenTimeKeys = /* @__PURE__ */ new Set();
    for (const r of historyRows ?? []) {
      const timeKey = `${r.action_type}_${new Date(r.created_at).getTime()}`;
      seenTimeKeys.add(timeKey);
      items.push({
        ...r,
        action_type: r.action_type
      });
    }
    for (const ev of appEvents ?? []) {
      const et = String(ev.event_type || "").toLowerCase();
      const noteStr = String(ev.note || "");
      const isCompleted = et.includes("completed") || noteStr.toLowerCase().includes("call completed") || noteStr.toLowerCase().includes("callback marked completed");
      const isCancelled = et.includes("cancelled") || noteStr.toLowerCase().includes("callback cancelled");
      const actionType = isCompleted ? "CALLBACK_COMPLETED" : isCancelled ? "CALLBACK_CANCELLED" : noteStr.toLowerCase().includes("rescheduled") ? "CALLBACK_RESCHEDULED" : "CALLBACK_SCHEDULED";
      const evTime = ev.created_at ? new Date(ev.created_at).getTime() : Date.now();
      const alreadyCovered = Array.from(seenTimeKeys).some((k) => {
        const [aType, tStr] = k.split("_");
        return aType === actionType && Math.abs(Number(tStr) - evTime) < 5e3;
      });
      if (!alreadyCovered) {
        seenTimeKeys.add(`${actionType}_${evTime}`);
        const schedMatch = noteStr.match(/\(Scheduled:\s*([^)]+)\)/i);
        items.push({
          id: ev.id,
          order_id: ev.application_id || data.orderId,
          actor_id: ev.created_by || null,
          actor_name: ev.staff_name || "Staff",
          actor_role: ev.staff_role || "staff",
          action_type: actionType,
          previous_fires_at: null,
          new_fires_at: schedMatch ? schedMatch[1] : null,
          reason: noteStr || (isCompleted ? "Customer Contacted" : "Callback Event"),
          reason_label: noteStr || (isCompleted ? "Customer Contacted" : "Callback Event"),
          previous_reason: null,
          previous_reason_label: null,
          note: noteStr,
          previous_note: null,
          channel: "call",
          source: "employee",
          created_at: ev.created_at || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    for (const s of schedulers ?? []) {
      let remarksObj = null;
      if (s.remarks) {
        try {
          remarksObj = typeof s.remarks === "string" ? JSON.parse(s.remarks) : s.remarks;
        } catch {
          remarksObj = {
            reasonLabel: String(s.remarks)
          };
        }
      }
      const sTime = s.created_at ? new Date(s.created_at).getTime() : Date.now();
      const schedCovered = Array.from(seenTimeKeys).some((k) => {
        const [aType, tStr] = k.split("_");
        return (aType === "CALLBACK_SCHEDULED" || aType === "CALLBACK_RESCHEDULED") && Math.abs(Number(tStr) - sTime) < 5e3;
      });
      if (!schedCovered) {
        seenTimeKeys.add(`CALLBACK_SCHEDULED_${sTime}`);
        items.push({
          id: s.id,
          order_id: s.application_id || data.orderId,
          actor_id: s.created_by || null,
          actor_name: remarksObj?.created_by_name || "Staff",
          actor_role: "staff",
          action_type: "CALLBACK_SCHEDULED",
          previous_fires_at: null,
          new_fires_at: s.fires_at,
          reason: remarksObj?.reason || "follow_up",
          reason_label: remarksObj?.reasonLabel || "Scheduled Callback",
          previous_reason: null,
          previous_reason_label: null,
          note: remarksObj?.note || null,
          previous_note: null,
          channel: remarksObj?.channel || "call",
          source: "employee",
          created_at: s.created_at || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const actorIds = Array.from(new Set(items.map((r) => r.actor_id).filter(Boolean)));
    let profMap = /* @__PURE__ */ new Map();
    if (actorIds.length > 0) {
      const {
        data: profs
      } = await admin.from("profiles").select("id, display_name, email").in("id", actorIds);
      profMap = new Map((profs ?? []).map((p) => [p.id, p.display_name || p.email]));
    }
    return items.map((r) => ({
      ...r,
      actor_name: r.actor_id && profMap.get(r.actor_id) || r.actor_name || "Staff"
    }));
  } catch (e) {
    console.warn("[getOrderCallbackHistory] warning:", e);
    return [];
  }
});
const getOrderCallbackHistoryCount_createServerFn_handler = createServerRpc({
  id: "ec2a2915f1335882f896f05269d03c351f59b66ffacffe24530c11a59fe03058",
  name: "getOrderCallbackHistoryCount",
  filename: "src/lib/orders/actions/callback-reminder.functions.ts"
}, (opts) => getOrderCallbackHistoryCount.__executeServer(opts));
const getOrderCallbackHistoryCount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(getOrderCallbackHistoryCount_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertStaff(context.supabase);
  await getAdmin();
  try {
    const items = await getOrderCallbackHistory({
      data,
      context
    });
    const count = Array.isArray(items) ? items.filter((item) => item.action_type === "CALLBACK_SCHEDULED" || item.action_type === "CALLBACK_RESCHEDULED").length : 0;
    return {
      count
    };
  } catch {
    return {
      count: 0
    };
  }
});
const getDueRemindersSummary_createServerFn_handler = createServerRpc({
  id: "a6f9794ff59810cecbc6972eabeabcad4e07624fe54a7cd8455a06d358a9a633",
  name: "getDueRemindersSummary",
  filename: "src/lib/orders/actions/callback-reminder.functions.ts"
}, (opts) => getDueRemindersSummary.__executeServer(opts));
const getDueRemindersSummary = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({}).optional()).handler(getDueRemindersSummary_createServerFn_handler, async ({
  context
}) => {
  await assertStaff(context.supabase);
  const admin = await getAdmin();
  const nowMs = Date.now();
  const {
    data: isSuper
  } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin"
  });
  const {
    data: isAdminRole
  } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin"
  });
  const isAdmin = !!(isSuper || isAdminRole);
  const {
    data: schedulers,
    error
  } = await admin.from("order_schedulers").select("id, application_id, status, fires_at, remarks, created_at, created_by").in("scheduler_type", ["our_side_reminder", "callback_reminder"]).eq("status", "active").order("fires_at", {
    ascending: true
  }).limit(100);
  if (error || !schedulers || schedulers.length === 0) {
    return {
      dueReminders: [],
      upcomingReminders: []
    };
  }
  const appIds = Array.from(new Set(schedulers.map((s) => s.application_id).filter(Boolean)));
  const {
    data: apps
  } = await admin.from("applications").select("id, application_code, lead_id, customer_id, assigned_to, fulfillment_status, order_status, application_status, workflow_status").in("id", appIds);
  const leadIds = Array.from(new Set((apps ?? []).map((a) => a.lead_id).filter(Boolean)));
  const {
    data: leads
  } = await admin.from("leads").select("id, name, mobile, email, service").in("id", leadIds);
  const appMap = new Map((apps ?? []).map((a) => [a.id, a]));
  const leadMap = new Map((leads ?? []).map((l) => [l.id, l]));
  const nonTerminalSchedulers = [];
  const lingeringTerminalAppIds = [];
  for (const s of schedulers) {
    const app = s.application_id ? appMap.get(s.application_id) : null;
    if (!app) continue;
    const fs = String(app.fulfillment_status ?? "").toLowerCase();
    const os = String(app.order_status ?? "").toLowerCase();
    const as = String(app.application_status ?? "").toLowerCase();
    const ws = String(app.workflow_status ?? "").toLowerCase();
    const isTerminal = ["completed", "order_completed", "consultation_completed", "order_closed", "cancelled", "application_rejected"].includes(fs) || ["completed", "closed", "cancelled"].includes(os) || ["completed", "closed", "cancelled"].includes(as) || ["completed", "closed", "cancelled"].includes(ws);
    if (isTerminal) {
      if (s.application_id) lingeringTerminalAppIds.push(s.application_id);
    } else {
      nonTerminalSchedulers.push(s);
    }
  }
  if (lingeringTerminalAppIds.length > 0) {
    await admin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
      stop_reason: "order_completed_or_closed"
    }).in("application_id", lingeringTerminalAppIds).eq("status", "active");
  }
  const mapped = nonTerminalSchedulers.map((s) => {
    const app = s.application_id ? appMap.get(s.application_id) : null;
    const lead = app?.lead_id ? leadMap.get(app.lead_id) : null;
    let parsedRemarks = null;
    if (s.remarks) {
      try {
        parsedRemarks = typeof s.remarks === "string" ? JSON.parse(s.remarks) : s.remarks;
      } catch {
        parsedRemarks = {
          reason: "custom",
          reasonLabel: row_remarks_fallback(s.remarks)
        };
      }
    }
    const firesAtTime = s.fires_at ? new Date(s.fires_at).getTime() : 0;
    const isDue = firesAtTime > 0 && firesAtTime <= nowMs;
    return {
      id: s.id,
      application_id: s.application_id,
      application_code: app?.application_code || "Order",
      assigned_to: app?.assigned_to || null,
      created_by: s.created_by || null,
      customer_name: lead?.name || "Customer",
      customer_mobile: lead?.mobile || "",
      service_name: lead?.service || "Service",
      fires_at: s.fires_at,
      isDue,
      remarks: parsedRemarks,
      created_at: s.created_at
    };
  });
  const {
    filterRemindersForEmployee
  } = await import("./typesafe.server-CvMnlmDt.mjs");
  const userScopedReminders = await filterRemindersForEmployee(context.userId, isAdmin, mapped);
  const dueReminders = userScopedReminders.filter((m) => m.isDue);
  const upcomingReminders = userScopedReminders.filter((m) => !m.isDue);
  return {
    dueReminders,
    upcomingReminders
  };
});
function row_remarks_fallback(r) {
  if (!r) return "Follow-up";
  return typeof r === "string" ? r : "Follow-up";
}
export {
  cancelOrderCallback_createServerFn_handler,
  completeOrderCallback_createServerFn_handler,
  getActiveOrderCallback_createServerFn_handler,
  getDueRemindersSummary_createServerFn_handler,
  getOrderCallbackHistoryCount_createServerFn_handler,
  getOrderCallbackHistory_createServerFn_handler,
  scheduleOrderCallback_createServerFn_handler
};
