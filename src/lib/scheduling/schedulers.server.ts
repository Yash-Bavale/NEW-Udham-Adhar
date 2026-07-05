// Scheduler engine (server-only). Powers Scheduler 2 (24h business-time closure)
// and later Scheduler 3 (reminders). Uses office-hours math from
// `src/lib/scheduling/business-hours.ts` and the `order_schedulers` table.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  DEFAULT_BUSINESS_HOURS,
  addBusinessSeconds,
  businessSecondsBetween,
  type BusinessHoursConfig,
} from "@/lib/scheduling/business-hours";
import { enqueueFromTemplateInternal } from "@/lib/emails/emails.server";
import { BHS_EMAILS } from "@/lib/emails/bhs-templates";

export const SCHEDULER_CUSTOMER_CLOSURE = "customer_closure_24h" as const;
export const SCHEDULER_OUR_SIDE_REMINDER = "our_side_reminder" as const;
export const SCHEDULER_TICKET_AUTOCLOSE = "ticket_autoclose_24h" as const;
export const SCHEDULER_FEEDBACK_FOLLOWUP = "feedback_followup" as const;
const DEFAULT_CLOSURE_SECONDS = 24 * 3600;
const DEFAULT_REMINDER_INTERVAL_SECONDS = 2 * 3600; // 2 business hours
const REMINDER_ESCALATION_THRESHOLD = 3;
const DEFAULT_TICKET_AUTOCLOSE_SECONDS = 24 * 3600;
const DEFAULT_FEEDBACK_FOLLOWUP_SECONDS = 24 * 3600; // 24 business hours post-completion

/** Encode/decode ticket_id inside order_schedulers.remarks for ticket schedulers. */
const TICKET_TAG_PREFIX = "ticket:";
function encodeTicketRemarks(ticketId: string, note?: string | null) {
  return note ? `${TICKET_TAG_PREFIX}${ticketId}|${note}` : `${TICKET_TAG_PREFIX}${ticketId}`;
}
function decodeTicketId(remarks: string | null): string | null {
  if (!remarks || !remarks.startsWith(TICKET_TAG_PREFIX)) return null;
  const rest = remarks.slice(TICKET_TAG_PREFIX.length);
  const pipe = rest.indexOf("|");
  return pipe >= 0 ? rest.slice(0, pipe) : rest;
}

/** Read the single-row business hours config; fall back to defaults. */
export async function readBusinessHoursConfig(): Promise<BusinessHoursConfig> {
  const { data } = await supabaseAdmin
    .from("business_hours_config")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  const row = data as Record<string, unknown> | null;
  if (!row) return DEFAULT_BUSINESS_HOURS;
  return {
    timezone: (row.timezone as string) ?? "Asia/Kolkata",
    openTime: String(row.open_time ?? "10:00:00").slice(0, 5),
    closeTime: String(row.close_time ?? "18:00:00").slice(0, 5),
    workingDays: Array.isArray(row.working_days) ? (row.working_days as number[]) : [1, 2, 3, 4, 5, 6],
    holidays: Array.isArray(row.holidays) ? (row.holidays as string[]) : [],
  };
}

/**
 * Start Scheduler 2 (Customer-Side Delay → auto-close in 24 business hours).
 * Cancels any existing active `customer_closure_24h` scheduler for the order first.
 */
export async function startCustomerClosureScheduler(input: {
  applicationId: string;
  reasonId?: string | null;
  remarks?: string | null;
  createdBy?: string | null;
  totalSeconds?: number;
}) {
  const cfg = await readBusinessHoursConfig();
  const total = input.totalSeconds ?? DEFAULT_CLOSURE_SECONDS;
  const now = new Date();
  const firesAt = addBusinessSeconds(now, total, cfg);

  // Cancel any existing active row for this order/type
  await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "cancelled",
      stopped_at: now.toISOString(),
      stop_reason: "superseded",
      stop_triggered_by: "system",
      updated_at: now.toISOString(),
    } as never)
    .eq("application_id", input.applicationId)
    .eq("scheduler_type", SCHEDULER_CUSTOMER_CLOSURE)
    .in("status", ["active", "paused"]);

  const { data, error } = await supabaseAdmin
    .from("order_schedulers")
    .insert({
      application_id: input.applicationId,
      scheduler_type: SCHEDULER_CUSTOMER_CLOSURE,
      status: "active",
      started_at: now.toISOString(),
      fires_at: firesAt.toISOString(),
      business_seconds_total: total,
      business_seconds_remaining: total,
      reason_id: input.reasonId ?? null,
      remarks: input.remarks ?? null,
      created_by: input.createdBy ?? null,
    } as never)
    .select("id, fires_at")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Pause a scheduler (e.g. incoming ticket). Preserves remaining business-seconds. */
export async function pauseScheduler(schedulerId: string, ticketId?: string | null) {
  const cfg = await readBusinessHoursConfig();
  const { data: row, error } = await supabaseAdmin
    .from("order_schedulers")
    .select("id, status, fires_at, business_seconds_remaining")
    .eq("id", schedulerId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || row.status !== "active") return { ok: false, reason: "not_active" };

  const now = new Date();
  const remaining =
    row.fires_at ? businessSecondsBetween(now, new Date(row.fires_at as string), cfg) : (row.business_seconds_remaining as number);

  const { error: uErr } = await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "paused",
      paused_at: now.toISOString(),
      paused_by_ticket_id: ticketId ?? null,
      business_seconds_remaining: remaining,
      fires_at: null,
      updated_at: now.toISOString(),
    } as never)
    .eq("id", schedulerId);
  if (uErr) throw new Error(uErr.message);
  return { ok: true, remaining };
}

/** Resume a paused scheduler; recomputes fires_at from remaining business-seconds. */
export async function resumeScheduler(schedulerId: string) {
  const cfg = await readBusinessHoursConfig();
  const { data: row, error } = await supabaseAdmin
    .from("order_schedulers")
    .select("id, status, business_seconds_remaining")
    .eq("id", schedulerId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row || row.status !== "paused") return { ok: false, reason: "not_paused" };

  const now = new Date();
  const remaining = Math.max(60, (row.business_seconds_remaining as number) ?? DEFAULT_CLOSURE_SECONDS);
  const firesAt = addBusinessSeconds(now, remaining, cfg);

  const { error: uErr } = await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "active",
      resumed_at: now.toISOString(),
      paused_by_ticket_id: null,
      fires_at: firesAt.toISOString(),
      updated_at: now.toISOString(),
    } as never)
    .eq("id", schedulerId);
  if (uErr) throw new Error(uErr.message);
  return { ok: true, firesAt };
}

/** Cancel a scheduler outright. */
export async function cancelScheduler(schedulerId: string, reason: string, triggeredBy = "user") {
  const now = new Date();
  const { error } = await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "cancelled",
      stopped_at: now.toISOString(),
      stop_reason: reason,
      stop_triggered_by: triggeredBy,
      updated_at: now.toISOString(),
    } as never)
    .eq("id", schedulerId)
    .in("status", ["active", "paused"]);
  if (error) throw new Error(error.message);
  return { ok: true };
}

/** Cancel every active/paused scheduler for an order (used when order re-enters processing). */
export async function cancelAllForOrder(applicationId: string, reason = "order_status_change") {
  const now = new Date();
  const { error } = await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "cancelled",
      stopped_at: now.toISOString(),
      stop_reason: reason,
      stop_triggered_by: "system",
      updated_at: now.toISOString(),
    } as never)
    .eq("application_id", applicationId)
    .in("status", ["active", "paused"]);
  if (error) throw new Error(error.message);
}

// ─────────────────────────── Fire due schedulers ───────────────────────────

/** Fire every active scheduler whose fires_at has passed. Called by cron. */
export async function fireDueSchedulers(now = new Date()) {
  const { data: due, error } = await supabaseAdmin
    .from("order_schedulers")
    .select("id, application_id, scheduler_type, reason_id, remarks")
    .eq("status", "active")
    .lte("fires_at", now.toISOString())
    .limit(50);
  if (error) throw new Error(error.message);
  if (!due || due.length === 0) return { fired: 0 };

  let fired = 0;
  for (const s of due as Array<{ id: string; application_id: string; scheduler_type: string; reason_id: string | null; remarks: string | null }>) {
    try {
      if (s.scheduler_type === SCHEDULER_CUSTOMER_CLOSURE) {
        await fireCustomerClosure(s);
        fired++;
      } else if (s.scheduler_type === SCHEDULER_OUR_SIDE_REMINDER) {
        await fireOurSideReminder(s.id, s.application_id);
        fired++;
      } else if (s.scheduler_type === SCHEDULER_TICKET_AUTOCLOSE) {
        await fireTicketAutoclose(s);
        fired++;
      } else {
        await supabaseAdmin
          .from("order_schedulers")
          .update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "unknown_type" } as never)
          .eq("id", s.id);
      }
    } catch (e) {
      console.error("[schedulers] fire failed", s.id, e);
    }
  }
  return { fired };
}

// ─────────────────────── Scheduler 3 — Our-Side Reminder ───────────────────────

/**
 * Start a repeating Our-Side Delay reminder loop.
 * Mode 'auto'   → fires every `intervalSeconds` business seconds.
 * Mode 'manual' → one-shot at explicit wall-clock `remindAt`.
 * Mode 'grace'  → 30-minute business-time grace before switching to auto (handled by caller).
 */
export async function startOurSideReminder(input: {
  applicationId: string;
  mode: "auto" | "manual" | "grace";
  intervalSeconds?: number;
  remindAt?: Date;
  reasonId?: string | null;
  remarks?: string | null;
  createdBy?: string | null;
}) {
  const cfg = await readBusinessHoursConfig();
  const now = new Date();
  const interval = input.intervalSeconds ?? (input.mode === "grace" ? 30 * 60 : DEFAULT_REMINDER_INTERVAL_SECONDS);
  const firesAt =
    input.mode === "manual" && input.remindAt
      ? input.remindAt
      : addBusinessSeconds(now, interval, cfg);

  // Cancel any active reminder scheduler on this order first.
  await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "cancelled",
      stopped_at: now.toISOString(),
      stop_reason: "superseded",
      stop_triggered_by: "system",
      updated_at: now.toISOString(),
    } as never)
    .eq("application_id", input.applicationId)
    .eq("scheduler_type", SCHEDULER_OUR_SIDE_REMINDER)
    .in("status", ["active", "paused"]);

  const { data, error } = await supabaseAdmin
    .from("order_schedulers")
    .insert({
      application_id: input.applicationId,
      scheduler_type: SCHEDULER_OUR_SIDE_REMINDER,
      status: "active",
      started_at: now.toISOString(),
      fires_at: firesAt.toISOString(),
      business_seconds_total: interval,
      business_seconds_remaining: interval,
      reason_id: input.reasonId ?? null,
      remarks: input.remarks ?? `mode:${input.mode}`,
      created_by: input.createdBy ?? null,
    } as never)
    .select("id, fires_at")
    .single();
  if (error) throw new Error(error.message);

  // Also log a row in order_reminders for audit / counter.
  await supabaseAdmin.from("order_reminders").insert({
    application_id: input.applicationId,
    scheduler_id: (data as { id: string }).id,
    reminder_type: input.mode,
    remind_at: firesAt.toISOString(),
    interval_business_seconds: interval,
    times_fired: 0,
    is_active: true,
    created_by: input.createdBy ?? null,
  } as never);

  return data;
}

async function fireOurSideReminder(schedulerId: string, applicationId: string) {
  const now = new Date();
  const cfg = await readBusinessHoursConfig();

  // Look up order + assignees.
  const { data: order } = await supabaseAdmin
    .from("applications")
    .select("id, lead_id, customer_id, order_status, application_code, assigned_to")
    .eq("id", applicationId)
    .maybeSingle();
  if (!order) {
    await supabaseAdmin
      .from("order_schedulers")
      .update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "order_missing" } as never)
      .eq("id", schedulerId);
    return;
  }

  // If order no longer in OUR_SIDE_DELAY, stop the loop.
  if (order.order_status !== "OUR_SIDE_DELAY" && order.order_status !== "HIGH_PRIORITY") {
    await supabaseAdmin
      .from("order_schedulers")
      .update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "order_moved_on" } as never)
      .eq("id", schedulerId);
    await supabaseAdmin
      .from("order_reminders")
      .update({ is_active: false, stopped_at: now.toISOString(), stop_reason: "order_moved_on" } as never)
      .eq("scheduler_id", schedulerId);
    return;
  }

  // Increment fire counter.
  const { data: reminderRow } = await supabaseAdmin
    .from("order_reminders")
    .select("id, times_fired, interval_business_seconds, reminder_type")
    .eq("scheduler_id", schedulerId)
    .maybeSingle();

  const timesFired = ((reminderRow?.times_fired as number) ?? 0) + 1;
  await supabaseAdmin
    .from("order_reminders")
    .update({ times_fired: timesFired, last_fired_at: now.toISOString() } as never)
    .eq("scheduler_id", schedulerId);

  // Notify assigned staff.
  const assignee = order.assigned_to as string | null;
  const code = order.application_code || order.id.slice(0, 8);
  if (assignee) {
    await supabaseAdmin.from("notifications").insert({
      user_id: assignee,
      kind: "order_reminder",
      title: `Reminder: order ${code} pending on our side`,
      body: `Reminder #${timesFired} — please take the next action.`,
      href: `/admin/orders/${order.id}`,
      entity_kind: "application",
      entity_id: order.id,
    } as never);
  }

  // Escalate to HIGH_PRIORITY after N unattended reminders.
  if (timesFired >= REMINDER_ESCALATION_THRESHOLD && order.order_status === "OUR_SIDE_DELAY") {
    await supabaseAdmin
      .from("applications")
      .update({ order_status: "HIGH_PRIORITY", updated_at: now.toISOString() } as never)
      .eq("id", order.id);
    await supabaseAdmin.from("application_events").insert({
      application_id: order.id,
      lead_id: order.lead_id,
      customer_id: order.customer_id,
      event_type: "order_status_change",
      old_value: "OUR_SIDE_DELAY",
      new_value: "HIGH_PRIORITY",
      notes: `Auto-escalated after ${timesFired} unattended reminders`,
      staff_name: "System",
      staff_role: "system",
    } as never);
  }

  // Grace one-shot → convert to recurring auto reminder.
  if (reminderRow?.reminder_type === "grace") {
    await supabaseAdmin
      .from("order_schedulers")
      .update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "grace_expired" } as never)
      .eq("id", schedulerId);
    await supabaseAdmin
      .from("order_reminders")
      .update({ is_active: false, stopped_at: now.toISOString(), stop_reason: "grace_expired" } as never)
      .eq("scheduler_id", schedulerId);
    await startOurSideReminder({
      applicationId: order.id,
      mode: "auto",
      intervalSeconds: DEFAULT_REMINDER_INTERVAL_SECONDS,
    });
    return;
  }

  // Manual → one-shot, stop after firing.
  if (reminderRow?.reminder_type === "manual") {
    await supabaseAdmin
      .from("order_schedulers")
      .update({ status: "stopped", stopped_at: now.toISOString(), stop_reason: "fired_once" } as never)
      .eq("id", schedulerId);
    await supabaseAdmin
      .from("order_reminders")
      .update({ is_active: false, stopped_at: now.toISOString(), stop_reason: "fired_once" } as never)
      .eq("scheduler_id", schedulerId);
    return;
  }

  // Auto → reschedule next fire.
  const interval = (reminderRow?.interval_business_seconds as number) ?? DEFAULT_REMINDER_INTERVAL_SECONDS;
  const next = addBusinessSeconds(now, interval, cfg);
  await supabaseAdmin
    .from("order_schedulers")
    .update({
      fires_at: next.toISOString(),
      business_seconds_remaining: interval,
      updated_at: now.toISOString(),
    } as never)
    .eq("id", schedulerId);
  await supabaseAdmin
    .from("order_reminders")
    .update({ remind_at: next.toISOString() } as never)
    .eq("scheduler_id", schedulerId);
}

async function fireCustomerClosure(s: {
  id: string;
  application_id: string;
  reason_id: string | null;
  remarks: string | null;
}) {
  // 1. Transition order → CLOSED
  const { data: order, error: oErr } = await supabaseAdmin
    .from("applications")
    .select("id, lead_id, customer_id, order_status, application_code")
    .eq("id", s.application_id)
    .maybeSingle();
  if (oErr) throw new Error(oErr.message);
  if (!order) return;

  // Only close if still in a "waiting" state; otherwise leave alone.
  const active = ["CUSTOMER_HOLD", "WAITING_CUSTOMER_INFO", "NEW_ORDER"];
  if (!active.includes(order.order_status as string)) {
    await supabaseAdmin
      .from("order_schedulers")
      .update({ status: "stopped", stopped_at: new Date().toISOString(), stop_reason: "order_moved_on" } as never)
      .eq("id", s.id);
    return;
  }

  await supabaseAdmin
    .from("applications")
    .update({
      order_status: "CLOSED",
      closure_reason_id: s.reason_id,
      closure_remarks: s.remarks ?? "Auto-closed after 24 business hours of no reply",
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", s.application_id);

  await supabaseAdmin.from("application_events").insert({
    application_id: s.application_id,
    lead_id: order.lead_id,
    customer_id: order.customer_id,
    event_type: "order_status_change",
    old_value: order.order_status as string,
    new_value: "CLOSED",
    notes: "Scheduler 2 auto-close (24h business time)",
    staff_name: "System",
    staff_role: "system",
  } as never);

  // 2. Fetch customer email + queue E004
  const { data: cust } = await supabaseAdmin
    .from("customers")
    .select("primary_email, name")
    .eq("id", order.customer_id as string)
    .maybeSingle();

  if (cust?.primary_email) {
    try {
      await enqueueFromTemplateInternal(
        BHS_EMAILS.E004_ORDER_AUTO_CLOSED,
        cust.primary_email as string,
        {
          customerName: (cust.name as string) || "Customer",
          orderNumber: order.application_code || order.id.slice(0, 8),
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
        },
        { applicationId: s.application_id, leadId: order.lead_id },
      );
    } catch (e) {
      console.error("[schedulers] E004 enqueue failed", e);
    }
  }

  // 3. Mark scheduler stopped
  await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "stopped",
      stopped_at: new Date().toISOString(),
      stop_reason: "auto_fired",
      stop_triggered_by: "cron",
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", s.id);
}

// ─────────────────────── Scheduler 6 — Ticket Auto-Close ───────────────────────
// Armed when support staff sends a public reply on a ticket. Fires 24 business
// hours later → sends E010 auto-close notice and closes the ticket. Cancelled
// automatically when the customer replies (inbox matcher calls
// `cancelTicketAutocloseForOrder`).

/** Arm the 24-business-hour ticket auto-close timer. Cancels any prior active one. */
export async function startTicketAutocloseScheduler(input: {
  ticketId: string;
  applicationId: string;
  totalSeconds?: number;
  createdBy?: string | null;
  note?: string | null;
}) {
  const cfg = await readBusinessHoursConfig();
  const total = input.totalSeconds ?? DEFAULT_TICKET_AUTOCLOSE_SECONDS;
  const now = new Date();
  const firesAt = addBusinessSeconds(now, total, cfg);

  // Cancel any prior autoclose for this exact ticket.
  await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "cancelled",
      stopped_at: now.toISOString(),
      stop_reason: "superseded",
      stop_triggered_by: "system",
      updated_at: now.toISOString(),
    } as never)
    .eq("application_id", input.applicationId)
    .eq("scheduler_type", SCHEDULER_TICKET_AUTOCLOSE)
    .like("remarks", `${TICKET_TAG_PREFIX}${input.ticketId}%`)
    .in("status", ["active", "paused"]);

  const { data, error } = await supabaseAdmin
    .from("order_schedulers")
    .insert({
      application_id: input.applicationId,
      scheduler_type: SCHEDULER_TICKET_AUTOCLOSE,
      status: "active",
      started_at: now.toISOString(),
      fires_at: firesAt.toISOString(),
      business_seconds_total: total,
      business_seconds_remaining: total,
      remarks: encodeTicketRemarks(input.ticketId, input.note ?? null),
      created_by: input.createdBy ?? null,
    } as never)
    .select("id, fires_at")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Cancel ticket auto-close timers for a specific ticket (customer replied / closed manually). */
export async function cancelTicketAutocloseByTicket(ticketId: string, reason = "customer_replied") {
  const now = new Date();
  await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "cancelled",
      stopped_at: now.toISOString(),
      stop_reason: reason,
      stop_triggered_by: "system",
      updated_at: now.toISOString(),
    } as never)
    .eq("scheduler_type", SCHEDULER_TICKET_AUTOCLOSE)
    .like("remarks", `${TICKET_TAG_PREFIX}${ticketId}%`)
    .in("status", ["active", "paused"]);
}

/** Cancel every active ticket auto-close on an order (customer replied inbound). */
export async function cancelTicketAutocloseForOrder(applicationId: string, reason = "customer_replied") {
  const now = new Date();
  await supabaseAdmin
    .from("order_schedulers")
    .update({
      status: "cancelled",
      stopped_at: now.toISOString(),
      stop_reason: reason,
      stop_triggered_by: "system",
      updated_at: now.toISOString(),
    } as never)
    .eq("application_id", applicationId)
    .eq("scheduler_type", SCHEDULER_TICKET_AUTOCLOSE)
    .in("status", ["active", "paused"]);
}

async function fireTicketAutoclose(s: {
  id: string;
  application_id: string;
  reason_id: string | null;
  remarks: string | null;
}) {
  const ticketId = decodeTicketId(s.remarks);
  const now = new Date();

  const markStopped = async (reason: string) => {
    await supabaseAdmin
      .from("order_schedulers")
      .update({
        status: "stopped",
        stopped_at: now.toISOString(),
        stop_reason: reason,
        stop_triggered_by: "cron",
        updated_at: now.toISOString(),
      } as never)
      .eq("id", s.id);
  };

  if (!ticketId) {
    await markStopped("ticket_id_missing");
    return;
  }

  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("id, status, subject, customer_id, application_id")
    .eq("id", ticketId)
    .maybeSingle();
  const t = ticket as {
    id: string;
    status: string | null;
    subject: string;
    customer_id: string | null;
    application_id: string | null;
  } | null;

  // If ticket already closed or customer replied → skip.
  if (!t || t.status === "closed" || t.status === "resolved") {
    await markStopped("ticket_moved_on");
    return;
  }

  // Close the ticket.
  await supabaseAdmin
    .from("support_tickets")
    .update({
      status: "closed",
      resolved_at: now.toISOString(),
      updated_at: now.toISOString(),
    } as never)
    .eq("id", ticketId);

  await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: ticketId,
    reply_text: "Auto-closed by system after 24 business hours of no customer reply.",
    is_internal: true,
  } as never);

  // Send E010 auto-close notice to customer.
  if (t.customer_id) {
    const { data: cust } = await supabaseAdmin
      .from("customers")
      .select("primary_email, name")
      .eq("id", t.customer_id)
      .maybeSingle();
    const c = cust as { primary_email: string | null; name: string | null } | null;
    if (c?.primary_email) {
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E010_TICKET_AUTOCLOSE,
          c.primary_email,
          {
            customerName: c.name || "Customer",
            ticketSubject: t.subject,
            fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
          },
          { applicationId: t.application_id ?? undefined },
        );
      } catch (e) {
        console.error("[schedulers] E010 enqueue failed", e);
      }
    }
  }

  await markStopped("auto_fired");
}

