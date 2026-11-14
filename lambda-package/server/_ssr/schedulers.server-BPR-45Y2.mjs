import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import { D as DEFAULT_BUSINESS_HOURS, a as addBusinessSeconds } from "./business-hours-B-Ly-oQa.mjs";
import { enqueueFromTemplateInternal } from "./emails.server-BTJhg2a3.mjs";
import { BHS_EMAILS } from "./bhs-templates-Gd1TLGXv.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./smtp.server-D7qNu26j.mjs";
import "./transport.server-COs9qGOQ.mjs";
import "./zeptomail.server-FqoGmUCt.mjs";
const SCHEDULER_CUSTOMER_CLOSURE = "customer_closure_24h";
const SCHEDULER_OUR_SIDE_REMINDER = "our_side_reminder";
const SCHEDULER_TICKET_AUTOCLOSE = "ticket_autoclose_24h";
const SCHEDULER_FEEDBACK_FOLLOWUP = "feedback_followup";
const DEFAULT_CLOSURE_SECONDS = 8 * 3600;
const DEFAULT_REMINDER_INTERVAL_SECONDS = 2 * 3600;
const REMINDER_ESCALATION_THRESHOLD = 3;
const DEFAULT_TICKET_AUTOCLOSE_SECONDS = 24 * 3600;
const DEFAULT_FEEDBACK_FOLLOWUP_SECONDS = 24 * 3600;
const TICKET_TAG_PREFIX = "ticket:";
function encodeTicketRemarks(ticketId, note) {
  return note ? `${TICKET_TAG_PREFIX}${ticketId}|${note}` : `${TICKET_TAG_PREFIX}${ticketId}`;
}
function decodeTicketId(remarks) {
  if (!remarks || !remarks.startsWith(TICKET_TAG_PREFIX)) return null;
  const rest = remarks.slice(TICKET_TAG_PREFIX.length);
  const pipe = rest.indexOf("|");
  return pipe >= 0 ? rest.slice(0, pipe) : rest;
}
async function readBusinessHoursConfig() {
  const { data } = await supabaseAdmin.from("business_hours_config").select("*").eq("id", 1).maybeSingle();
  const row = data;
  if (!row) return DEFAULT_BUSINESS_HOURS;
  return {
    timezone: row.timezone ?? "Asia/Kolkata",
    openTime: String(row.open_time ?? "10:00:00").slice(0, 5),
    closeTime: String(row.close_time ?? "18:00:00").slice(0, 5),
    workingDays: Array.isArray(row.working_days) ? row.working_days : [1, 2, 3, 4, 5, 6],
    holidays: Array.isArray(row.holidays) ? row.holidays : []
  };
}
async function readCustomerDelayAutocloseSeconds() {
  try {
    const { data } = await supabaseAdmin.from("app_settings").select("customer_delay_autoclose_minutes").eq("id", 1).maybeSingle();
    const mins = data?.customer_delay_autoclose_minutes;
    if (typeof mins === "number" && mins >= 1) return mins * 60;
  } catch {
  }
  return DEFAULT_CLOSURE_SECONDS;
}
async function startCustomerClosureScheduler(input) {
  const total = input.totalSeconds ?? await readCustomerDelayAutocloseSeconds();
  const now = /* @__PURE__ */ new Date();
  const firesAt = new Date(now.getTime() + total * 1e3);
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: "superseded",
    stop_triggered_by: "system",
    updated_at: now.toISOString()
  }).eq("application_id", input.applicationId).eq("scheduler_type", SCHEDULER_CUSTOMER_CLOSURE).in("status", ["active", "paused"]);
  const { data, error } = await supabaseAdmin.from("order_schedulers").insert({
    application_id: input.applicationId,
    scheduler_type: SCHEDULER_CUSTOMER_CLOSURE,
    status: "active",
    started_at: now.toISOString(),
    fires_at: firesAt.toISOString(),
    business_seconds_total: total,
    business_seconds_remaining: total,
    reason_id: input.reasonId ?? null,
    remarks: input.remarks ?? null,
    created_by: input.createdBy ?? null
  }).select("id, fires_at").single();
  if (error) throw new Error(error.message);
  return data;
}
async function pauseScheduler(schedulerId, ticketId) {
  const { data: row, error } = await supabaseAdmin.from("order_schedulers").select("id, status, fires_at, business_seconds_remaining").eq("id", schedulerId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || row.status !== "active") return { ok: false, reason: "not_active" };
  const now = /* @__PURE__ */ new Date();
  const remaining = row.fires_at ? Math.max(0, Math.floor((new Date(row.fires_at).getTime() - now.getTime()) / 1e3)) : row.business_seconds_remaining;
  const { error: uErr } = await supabaseAdmin.from("order_schedulers").update({
    status: "paused",
    paused_at: now.toISOString(),
    paused_by_ticket_id: ticketId ?? null,
    business_seconds_remaining: remaining,
    fires_at: null,
    updated_at: now.toISOString()
  }).eq("id", schedulerId);
  if (uErr) throw new Error(uErr.message);
  return { ok: true, remaining };
}
async function resumeScheduler(schedulerId) {
  const { data: row, error } = await supabaseAdmin.from("order_schedulers").select("id, status, business_seconds_remaining").eq("id", schedulerId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || row.status !== "paused") return { ok: false, reason: "not_paused" };
  const now = /* @__PURE__ */ new Date();
  const remaining = Math.max(60, row.business_seconds_remaining ?? DEFAULT_CLOSURE_SECONDS);
  const firesAt = new Date(now.getTime() + remaining * 1e3);
  const { error: uErr } = await supabaseAdmin.from("order_schedulers").update({
    status: "active",
    resumed_at: now.toISOString(),
    paused_by_ticket_id: null,
    fires_at: firesAt.toISOString(),
    updated_at: now.toISOString()
  }).eq("id", schedulerId);
  if (uErr) throw new Error(uErr.message);
  return { ok: true, firesAt };
}
async function cancelScheduler(schedulerId, reason, triggeredBy = "user") {
  const now = /* @__PURE__ */ new Date();
  const { error } = await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: reason,
    stop_triggered_by: triggeredBy,
    updated_at: now.toISOString()
  }).eq("id", schedulerId).in("status", ["active", "paused"]);
  if (error) throw new Error(error.message);
  return { ok: true };
}
async function cancelAllForOrder(applicationId, reason = "order_status_change") {
  const now = /* @__PURE__ */ new Date();
  const { error } = await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: reason,
    stop_triggered_by: "system",
    updated_at: now.toISOString()
  }).eq("application_id", applicationId).in("status", ["active", "paused"]);
  if (error) throw new Error(error.message);
}
async function resolveCustomerDelay(applicationId, reason = "customer_replied") {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const { data: cancelled } = await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now,
    stop_reason: reason,
    stop_triggered_by: "system",
    updated_at: now
  }).eq("application_id", applicationId).in("status", ["active", "paused"]).eq("scheduler_type", SCHEDULER_CUSTOMER_CLOSURE).select("id");
  const { data: app } = await supabaseAdmin.from("applications").select("fulfillment_status").eq("id", applicationId).maybeSingle();
  const fs = app?.fulfillment_status ?? null;
  let reverted = false;
  if (fs === "customer_delay") {
    await supabaseAdmin.from("applications").update({
      fulfillment_status: "form_submitted",
      customer_hold_started_at: null,
      active_reason_id: null,
      updated_at: now
    }).eq("id", applicationId);
    reverted = true;
  }
  return { cancelled: (cancelled ?? []).length, reverted };
}
async function fireDueSchedulers(now = /* @__PURE__ */ new Date()) {
  const { data: due, error } = await supabaseAdmin.from("order_schedulers").select("id, application_id, ticket_id, scheduler_type, reason_id, remarks").eq("status", "active").lte("fires_at", now.toISOString()).limit(50);
  if (error) throw new Error(error.message);
  if (!due || due.length === 0) return { fired: 0 };
  let fired = 0;
  for (const s of due) {
    try {
      if (s.scheduler_type === SCHEDULER_CUSTOMER_CLOSURE && s.application_id) {
        await fireCustomerClosure({ id: s.id, application_id: s.application_id, reason_id: s.reason_id, remarks: s.remarks });
        fired++;
      } else if (s.scheduler_type === SCHEDULER_OUR_SIDE_REMINDER && s.application_id) {
        await fireOurSideReminder(s.id, s.application_id, s.remarks);
        fired++;
      } else if (s.scheduler_type === SCHEDULER_TICKET_AUTOCLOSE) {
        await fireTicketAutoclose({ id: s.id, ticket_id: s.ticket_id, application_id: s.application_id, reason_id: s.reason_id, remarks: s.remarks });
        fired++;
      } else if (s.scheduler_type === SCHEDULER_FEEDBACK_FOLLOWUP && s.application_id) {
        await fireFeedbackFollowup({ id: s.id, application_id: s.application_id, reason_id: s.reason_id, remarks: s.remarks });
        fired++;
        await supabaseAdmin.from("order_schedulers").update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "unknown_type_or_missing_app" }).eq("id", s.id);
      }
    } catch (e) {
      console.error("[schedulers] fire failed", s.id, e);
    }
  }
  try {
    const { reassignProlongedUnavailableStaff } = await import("./assignment-engine.server--SlhbLzd.mjs");
    await reassignProlongedUnavailableStaff();
  } catch (reassignErr) {
    console.warn("[schedulers] workforce reassignment tick warning:", reassignErr);
  }
  return { fired };
}
async function startOurSideReminder(input) {
  const cfg = await readBusinessHoursConfig();
  const now = /* @__PURE__ */ new Date();
  const interval = input.intervalSeconds ?? (input.mode === "grace" ? 30 * 60 : DEFAULT_REMINDER_INTERVAL_SECONDS);
  const firesAt = input.mode === "manual" && input.remindAt ? input.remindAt : addBusinessSeconds(now, interval, cfg);
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: "superseded",
    stop_triggered_by: "system",
    updated_at: now.toISOString()
  }).eq("application_id", input.applicationId).eq("scheduler_type", SCHEDULER_OUR_SIDE_REMINDER).in("status", ["active", "paused"]);
  const { data, error } = await supabaseAdmin.from("order_schedulers").insert({
    application_id: input.applicationId,
    scheduler_type: SCHEDULER_OUR_SIDE_REMINDER,
    status: "active",
    started_at: now.toISOString(),
    fires_at: firesAt.toISOString(),
    business_seconds_total: interval,
    business_seconds_remaining: interval,
    reason_id: input.reasonId ?? null,
    remarks: input.remarks ?? `mode:${input.mode}`,
    created_by: input.createdBy ?? null
  }).select("id, fires_at").single();
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("order_reminders").insert({
    application_id: input.applicationId,
    scheduler_id: data.id,
    reminder_type: input.mode,
    remind_at: firesAt.toISOString(),
    interval_business_seconds: interval,
    times_fired: 0,
    is_active: true,
    created_by: input.createdBy ?? null
  });
  return data;
}
async function fireOurSideReminder(schedulerId, applicationId, remarksInput) {
  const now = /* @__PURE__ */ new Date();
  const cfg = await readBusinessHoursConfig();
  const { data: order } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, order_status, application_code, assigned_to").eq("id", applicationId).maybeSingle();
  if (!order) {
    await supabaseAdmin.from("order_schedulers").update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "order_missing" }).eq("id", schedulerId);
    return;
  }
  let isCallbackReminder = false;
  if (remarksInput) {
    try {
      const parsed = typeof remarksInput === "string" ? JSON.parse(remarksInput) : remarksInput;
      if (parsed?.reason || parsed?.reasonLabel || parsed?.created_by_name || parsed?.durationMinutes) {
        isCallbackReminder = true;
      }
    } catch {
    }
  }
  if (!isCallbackReminder && order.order_status !== "OUR_SIDE_DELAY" && order.order_status !== "HIGH_PRIORITY") {
    await supabaseAdmin.from("order_schedulers").update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "order_moved_on" }).eq("id", schedulerId);
    await supabaseAdmin.from("order_reminders").update({ is_active: false, stopped_at: now.toISOString(), stop_reason: "order_moved_on" }).eq("scheduler_id", schedulerId);
    return;
  }
  const { data: reminderRow } = await supabaseAdmin.from("order_reminders").select("id, times_fired, interval_business_seconds, reminder_type").eq("scheduler_id", schedulerId).maybeSingle();
  const timesFired = (reminderRow?.times_fired ?? 0) + 1;
  if (reminderRow) {
    await supabaseAdmin.from("order_reminders").update({ times_fired: timesFired, last_fired_at: now.toISOString() }).eq("scheduler_id", schedulerId);
  }
  const assignee = order.assigned_to;
  const code = order.application_code || order.id.slice(0, 8);
  if (assignee) {
    await supabaseAdmin.from("notifications").insert({
      user_id: assignee,
      kind: isCallbackReminder ? "hot_order_callback" : "order_reminder",
      title: isCallbackReminder ? `🔥 Hot Order: Callback due for ${code}` : `Reminder: order ${code} pending on our side`,
      body: isCallbackReminder ? `Customer callback reminder is due now. Please call customer.` : `Reminder #${timesFired} — please take the next action.`,
      href: `/admin/orders/${order.id}`,
      entity_kind: "application",
      entity_id: order.id
    });
  }
  if (isCallbackReminder) {
    return;
  }
  if (timesFired >= REMINDER_ESCALATION_THRESHOLD && order.order_status === "OUR_SIDE_DELAY") {
    await supabaseAdmin.from("applications").update({ order_status: "HIGH_PRIORITY", updated_at: now.toISOString() }).eq("id", order.id);
    await supabaseAdmin.from("application_events").insert({
      application_id: order.id,
      lead_id: order.lead_id,
      customer_id: order.customer_id,
      event_type: "order_status_change",
      old_value: "OUR_SIDE_DELAY",
      new_value: "HIGH_PRIORITY",
      notes: `Auto-escalated after ${timesFired} unattended reminders`,
      staff_name: "System",
      staff_role: "system"
    });
  }
  if (reminderRow?.reminder_type === "grace") {
    await supabaseAdmin.from("order_schedulers").update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "grace_expired" }).eq("id", schedulerId);
    await supabaseAdmin.from("order_reminders").update({ is_active: false, stopped_at: now.toISOString(), stop_reason: "grace_expired" }).eq("scheduler_id", schedulerId);
    await startOurSideReminder({
      applicationId: order.id,
      mode: "auto",
      intervalSeconds: DEFAULT_REMINDER_INTERVAL_SECONDS
    });
    return;
  }
  if (reminderRow?.reminder_type === "manual") {
    await supabaseAdmin.from("order_schedulers").update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "fired_once" }).eq("id", schedulerId);
    await supabaseAdmin.from("order_reminders").update({ is_active: false, stopped_at: now.toISOString(), stop_reason: "fired_once" }).eq("scheduler_id", schedulerId);
    return;
  }
  const interval = reminderRow?.interval_business_seconds ?? DEFAULT_REMINDER_INTERVAL_SECONDS;
  const next = addBusinessSeconds(now, interval, cfg);
  await supabaseAdmin.from("order_schedulers").update({
    fires_at: next.toISOString(),
    business_seconds_remaining: interval,
    updated_at: now.toISOString()
  }).eq("id", schedulerId);
  await supabaseAdmin.from("order_reminders").update({ remind_at: next.toISOString() }).eq("scheduler_id", schedulerId);
}
async function fireCustomerClosure(s) {
  const { data: order, error: oErr } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, order_status, fulfillment_status, application_code").eq("id", s.application_id).maybeSingle();
  if (oErr) throw new Error(oErr.message);
  if (!order) return;
  const activeOrderStatus = ["CUSTOMER_HOLD", "WAITING_CUSTOMER_INFO", "NEW_ORDER"];
  const activeFulfillment = ["customer_delay", "waiting_for_customer_submission", "awaiting_customer_form"];
  const stillWaiting = activeOrderStatus.includes(order.order_status) || activeFulfillment.includes(order.fulfillment_status);
  if (!stillWaiting) {
    await supabaseAdmin.from("order_schedulers").update({ status: "stopped", stopped_at: (/* @__PURE__ */ new Date()).toISOString(), stop_reason: "order_moved_on" }).eq("id", s.id);
    return;
  }
  await supabaseAdmin.from("applications").update({
    order_status: "CLOSED",
    fulfillment_status: "order_closed",
    application_status: "cancelled",
    closure_reason_id: s.reason_id,
    closure_remarks: s.remarks ?? "Auto-closed after 8 hours of no reply",
    customer_hold_started_at: null,
    active_reason_id: null,
    active_reason_text: null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", s.application_id);
  await supabaseAdmin.from("application_events").insert({
    application_id: s.application_id,
    lead_id: order.lead_id,
    customer_id: order.customer_id,
    event_type: "order_status_change",
    old_value: order.order_status,
    new_value: "CLOSED",
    notes: "Scheduler 2 auto-close (configured wall-clock timer)",
    staff_name: "System",
    staff_role: "system"
  });
  const { data: cust } = await supabaseAdmin.from("customers").select("primary_email, name").eq("id", order.customer_id).maybeSingle();
  if (cust?.primary_email) {
    try {
      await enqueueFromTemplateInternal(
        BHS_EMAILS.E006_ORDER_CLOSED,
        cust.primary_email,
        {
          customerName: cust.name || "Customer",
          orderNumber: order.application_code || order.id.slice(0, 8),
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
        },
        { applicationId: s.application_id, leadId: order.lead_id }
      );
    } catch (e) {
      console.error("[schedulers] E004 enqueue failed", e);
    }
  }
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
    stop_reason: "auto_fired",
    stop_triggered_by: "cron",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", s.id);
}
async function startTicketAutocloseScheduler(input) {
  const total = input.totalSeconds ?? DEFAULT_TICKET_AUTOCLOSE_SECONDS;
  const now = /* @__PURE__ */ new Date();
  const firesAt = new Date(now.getTime() + total * 1e3);
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: "superseded",
    stop_triggered_by: "system",
    updated_at: now.toISOString()
  }).eq("scheduler_type", SCHEDULER_TICKET_AUTOCLOSE).eq("ticket_id", input.ticketId).in("status", ["active", "paused"]);
  let applicationId = input.applicationId ?? null;
  if (applicationId) {
    const { data: openOnOrder } = await supabaseAdmin.from("order_schedulers").select("id").eq("application_id", applicationId).in("status", ["active", "paused"]).limit(1);
    if ((openOnOrder ?? []).length > 0) applicationId = null;
  }
  const { data, error } = await supabaseAdmin.from("order_schedulers").insert({
    application_id: applicationId,
    ticket_id: input.ticketId,
    scheduler_type: SCHEDULER_TICKET_AUTOCLOSE,
    status: "active",
    started_at: now.toISOString(),
    fires_at: firesAt.toISOString(),
    business_seconds_total: total,
    business_seconds_remaining: total,
    remarks: encodeTicketRemarks(input.ticketId, input.note ?? null),
    created_by: input.createdBy ?? null
  }).select("id, fires_at").single();
  if (error) throw new Error(error.message);
  return data;
}
async function cancelTicketAutocloseByTicket(ticketId, reason = "customer_replied") {
  const now = /* @__PURE__ */ new Date();
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: reason,
    stop_triggered_by: "system",
    updated_at: now.toISOString()
  }).eq("scheduler_type", SCHEDULER_TICKET_AUTOCLOSE).eq("ticket_id", ticketId).in("status", ["active", "paused"]);
}
async function cancelTicketAutocloseForOrder(applicationId, reason = "customer_replied") {
  const now = /* @__PURE__ */ new Date();
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: reason,
    stop_triggered_by: "system",
    updated_at: now.toISOString()
  }).eq("application_id", applicationId).eq("scheduler_type", SCHEDULER_TICKET_AUTOCLOSE).in("status", ["active", "paused"]);
}
async function fireTicketAutoclose(s) {
  const ticketId = s.ticket_id ?? decodeTicketId(s.remarks);
  const now = /* @__PURE__ */ new Date();
  const markStopped = async (reason) => {
    await supabaseAdmin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: now.toISOString(),
      stop_reason: reason,
      stop_triggered_by: "cron",
      updated_at: now.toISOString()
    }).eq("id", s.id);
  };
  if (!ticketId) {
    await markStopped("ticket_id_missing");
    return;
  }
  const { data: ticket } = await supabaseAdmin.from("support_tickets").select("id, status, subject, customer_id, application_id").eq("id", ticketId).maybeSingle();
  const t = ticket;
  if (!t || t.status === "closed" || t.status === "resolved") {
    await markStopped("ticket_moved_on");
    return;
  }
  await supabaseAdmin.from("support_tickets").update({
    status: "closed",
    resolved_at: now.toISOString(),
    updated_at: now.toISOString()
  }).eq("id", ticketId);
  await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: ticketId,
    reply_text: "Auto-closed by system after 24 hours of no customer reply.",
    is_internal: true
  });
  if (t.customer_id) {
    const { data: cust } = await supabaseAdmin.from("customers").select("primary_email, name").eq("id", t.customer_id).maybeSingle();
    const c = cust;
    if (c?.primary_email) {
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E010_TICKET_CLOSED_FINAL,
          c.primary_email,
          {
            customerName: c.name || "Customer",
            ticketSubject: t.subject,
            fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
          },
          { applicationId: t.application_id ?? void 0 }
        );
      } catch (e) {
        console.error("[schedulers] ticket auto-close email enqueue failed", e);
      }
    }
  }
  await markStopped("auto_fired");
}
async function startFeedbackFollowupScheduler(input) {
  const cfg = await readBusinessHoursConfig();
  const total = input.totalSeconds ?? DEFAULT_FEEDBACK_FOLLOWUP_SECONDS;
  const now = /* @__PURE__ */ new Date();
  const firesAt = addBusinessSeconds(now, total, cfg);
  await supabaseAdmin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now.toISOString(),
    stop_reason: "superseded",
    stop_triggered_by: "system",
    updated_at: now.toISOString()
  }).eq("application_id", input.applicationId).eq("scheduler_type", SCHEDULER_FEEDBACK_FOLLOWUP).in("status", ["active", "paused"]);
  const { data, error } = await supabaseAdmin.from("order_schedulers").insert({
    application_id: input.applicationId,
    scheduler_type: SCHEDULER_FEEDBACK_FOLLOWUP,
    status: "active",
    started_at: now.toISOString(),
    fires_at: firesAt.toISOString(),
    business_seconds_total: total,
    business_seconds_remaining: total,
    created_by: input.createdBy ?? null
  }).select("id, fires_at").single();
  if (error) throw new Error(error.message);
  return data;
}
async function fireFeedbackFollowup(s) {
  const now = /* @__PURE__ */ new Date();
  const markStopped = async (reason) => {
    await supabaseAdmin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: now.toISOString(),
      stop_reason: reason,
      stop_triggered_by: "cron",
      updated_at: now.toISOString()
    }).eq("id", s.id);
  };
  const { data: order } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, order_status, application_code").eq("id", s.application_id).maybeSingle();
  const o = order;
  if (!o) {
    await markStopped("order_missing");
    return;
  }
  const validStates = ["COMPLETED", "CERTIFICATE_ISSUED"];
  if (!validStates.includes(o.order_status || "")) {
    await markStopped("order_moved_on");
    return;
  }
  void o.customer_id;
  await markStopped("auto_fired");
}
export {
  SCHEDULER_CUSTOMER_CLOSURE,
  SCHEDULER_FEEDBACK_FOLLOWUP,
  SCHEDULER_OUR_SIDE_REMINDER,
  SCHEDULER_TICKET_AUTOCLOSE,
  cancelAllForOrder,
  cancelScheduler,
  cancelTicketAutocloseByTicket,
  cancelTicketAutocloseForOrder,
  fireDueSchedulers,
  pauseScheduler,
  readBusinessHoursConfig,
  readCustomerDelayAutocloseSeconds,
  resolveCustomerDelay,
  resumeScheduler,
  startCustomerClosureScheduler,
  startFeedbackFollowupScheduler,
  startOurSideReminder,
  startTicketAutocloseScheduler
};
