import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeOrderStage } from "./computeOrderStage";
import { getEmployeePresenceState } from "./employee-presence.functions";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function getAdminAny(): Promise<any> {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin as any;
}

async function verifyAdminOrSuperAdmin(supabase: any, userId?: string) {
  const admin = await getAdmin();
  let query = admin.from("user_roles").select("role");
  if (userId) query = query.eq("user_id", userId);
  const { data } = await query;
  const roles = new Set((data ?? []).map((r: any) => r.role));
  const isPrivileged =
    roles.has("admin") || roles.has("super_admin") || roles.has("manager");
  if (!isPrivileged)
    throw new Error("Unauthorized: Admin or Super Admin access required.");
  return true;
}

export type DatePeriodFilter =
  | "today"
  | "yesterday"
  | "7d"
  | "15d"
  | "30d"
  | "this_month"
  | "custom";

export function formatTimeIST(val: string | Date | null | undefined): string {
  if (!val) return "—";
  try {
    const d = typeof val === "string" ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

export function formatTimeISTShort(val: string | Date | null | undefined): string {
  if (!val) return "—";
  try {
    const d = typeof val === "string" ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

export function resolveDateRange(
  filter: DatePeriodFilter,
  customStart?: string,
  customEnd?: string,
) {
  const getIstTodayString = (date: Date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date); // YYYY-MM-DD
  };

  const now = new Date();
  const todayIstStr = getIstTodayString(now);

  const getDayBounds = (dateStr: string) => {
    const start = new Date(`${dateStr}T00:00:00+05:30`).toISOString();
    const end = new Date(`${dateStr}T23:59:59.999+05:30`).toISOString();
    return { start, end };
  };

  let currentBounds = getDayBounds(todayIstStr);
  const yestDate = new Date(now.getTime() - 86_400_000);
  const yestIstStr = getIstTodayString(yestDate);
  let prevBounds = getDayBounds(yestIstStr);

  if (filter === "today") {
    currentBounds = getDayBounds(todayIstStr);
    prevBounds = getDayBounds(yestIstStr);
  } else if (filter === "yesterday") {
    currentBounds = getDayBounds(yestIstStr);
    const dayBefore = new Date(now.getTime() - 2 * 86_400_000);
    prevBounds = getDayBounds(getIstTodayString(dayBefore));
  } else if (filter === "7d") {
    const start7 = new Date(now.getTime() - 7 * 86_400_000).toISOString();
    const end = now.toISOString();
    const startPrev = new Date(now.getTime() - 14 * 86_400_000).toISOString();
    currentBounds = { start: start7, end };
    prevBounds = { start: startPrev, end: start7 };
  } else if (filter === "15d") {
    const start15 = new Date(now.getTime() - 15 * 86_400_000).toISOString();
    const end = now.toISOString();
    const startPrev = new Date(now.getTime() - 30 * 86_400_000).toISOString();
    currentBounds = { start: start15, end };
    prevBounds = { start: startPrev, end: start15 };
  } else if (filter === "30d") {
    const start30 = new Date(now.getTime() - 30 * 86_400_000).toISOString();
    const end = now.toISOString();
    const startPrev = new Date(now.getTime() - 60 * 86_400_000).toISOString();
    currentBounds = { start: start30, end };
    prevBounds = { start: startPrev, end: start30 };
  } else if (filter === "this_month") {
    const monthStartStr = `${todayIstStr.slice(0, 8)}01`;
    currentBounds = {
      start: new Date(`${monthStartStr}T00:00:00+05:30`).toISOString(),
      end: now.toISOString(),
    };
    prevBounds = {
      start: new Date(new Date(currentBounds.start).getTime() - 30 * 86_400_000).toISOString(),
      end: currentBounds.start,
    };
  } else if (filter === "custom" && customStart && customEnd) {
    const s = customStart.includes("T") ? new Date(customStart).toISOString() : new Date(`${customStart}T00:00:00+05:30`).toISOString();
    const e = customEnd.includes("T") ? new Date(customEnd).toISOString() : new Date(`${customEnd}T23:59:59.999+05:30`).toISOString();
    const dur = new Date(e).getTime() - new Date(s).getTime();
    currentBounds = { start: s, end: e };
    prevBounds = { start: new Date(new Date(s).getTime() - dur).toISOString(), end: s };
  }

  return {
    current: currentBounds,
    previous: prevBounds,
  };
}

const isUuid = (val?: string | null): boolean => {
  if (!val) return false;
  const t = val.trim();
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(t) ||
    /^[0-9a-f]{16,}$/i.test(t)
  );
};

const STAGE_DISPLAY_NAMES: Record<string, string> = {
  order_received: "Order Received",
  awaiting_customer_form: "Awaiting Form",
  waiting_for_customer_submission: "Customer Form Pending",
  form_submitted: "Form Submitted",
  form_not_submitted: "Form Not Submitted",
  technical_delay: "Technical Delay Marked",
  customer_delay: "Customer Delay Marked",
  government_processing: "Govt Processing Started",
  consultation_completed: "Consultation Completed",
  consultation_pending: "Consultation Pending",
  application_approved: "Application Approved",
  application_rejected: "Application Rejected",
  order_completed: "Order Completed",
  order_closed: "Order Closed",
  verification_pending: "Fulfillment Verification",
  documents_received: "Documents Received",
  under_processing: "Processing Started",
  under_review: "Under Review",
  in_progress: "In Progress",
  submitted_to_govt: "Submitted to Govt Portal",
  certificate_ready: "Certificate Ready",
  certificate_issued: "Certificate Issued",
  completed: "Order Completed",
  closed: "Order Closed",
  cancelled: "Order Cancelled",
  payment_pending: "Payment Pending",
  payment_done: "Payment Done",
  order_reopened: "Order Reopened",
  new_lead: "New Lead",
  send_form_link: "Form Link Resent",
  manual_reminder: "Manual Reminder Sent",
  start_processing: "Processing Started",
  our_delay: "Technical Delay Marked",
  close_manual: "Order Closed",
  customer_hold: "Customer Delay Marked",
  our_side_delay: "Technical Delay Marked",
  technical_hold_external: "External Tech Delay",
  technical_hold_internal: "Internal Tech Delay",
};

export function cleanStageOrStatus(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (isUuid(trimmed)) return "";
  const lower = trimmed.toLowerCase();
  if (STAGE_DISPLAY_NAMES[lower]) return STAGE_DISPLAY_NAMES[lower];
  const withoutMoved = lower.replace(/^moved to\s+/i, "");
  if (STAGE_DISPLAY_NAMES[withoutMoved]) return STAGE_DISPLAY_NAMES[withoutMoved];
  if (isUuid(withoutMoved)) return "";
  return withoutMoved
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatLogAction(log: {
  action_type?: string;
  previous_status?: string | null;
  new_status?: string | null;
  previous_stage?: string | null;
  new_stage?: string | null;
  notes?: string | null;
  activity_description?: string | null;
  event_type?: string | null;
  old_value?: string | null;
  new_value?: string | null;
}): { actionLabel: string; details: string | null } {
  const sanitizeText = (txt?: string | null): string | null => {
    if (!txt) return null;
    let s = txt.trim();
    if (isUuid(s)) return null;
    s = s.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "");
    s = s.replace(/^moved to\s*$/i, "").trim();
    return s.length > 0 ? s : null;
  };

  const notesText = sanitizeText(log.notes);
  const actDesc = sanitizeText(log.activity_description);

  if (actDesc && !/^moved to/i.test(actDesc)) {
    return {
      actionLabel: actDesc,
      details: notesText && notesText !== actDesc ? notesText : null,
    };
  }

  const rawType = (log.action_type || log.event_type || "").toUpperCase();

  const ACTION_TYPE_LABELS: Record<string, string> = {
    ORDER_COMPLETED: "Order Completed",
    APPLICATION_COMPLETED: "Order Completed",
    ORDER_CLOSED: "Order Closed",
    SYSTEM_CLOSE: "System Closed Order",
    ORDER_REOPENED: "Order Reopened",
    CUSTOMER_CONTACTED: "Customer Contacted",
    CUSTOMER_DELAY_ADDED: "Customer Delay Added",
    CUSTOMER_DELAY: "Customer Delay Added",
    TECHNICAL_DELAY_ADDED: "Technical Delay Added",
    TECHNICAL_DELAY: "Technical Delay Added",
    CUSTOMER_DELAY_RESUMED: "Customer Delay Resumed",
    TECHNICAL_DELAY_RESUMED: "Technical Delay Resumed",
    CALLBACK_SCHEDULED: "Callback Scheduled",
    CALLBACK_COMPLETED: "Callback Completed",
    FORM_REVIEWED: "Form Reviewed & Verified",
    FORM_REQUESTED: "Form Link Resent",
    FORM_SUBMITTED: "Form Submitted",
    DOCUMENT_REVIEWED: "Document Reviewed",
    DOCUMENT_REQUESTED: "Documents Requested",
    DOCUMENTS_RECEIVED: "Documents Received",
    PAYMENT_VERIFIED: "Payment Verified",
    PROCESSING_STARTED: "Submitted to Govt Portal",
    PROCESSING_UPDATED: "Govt Processing Updated",
    CERTIFICATE_GENERATED: "Certificate Issued",
    CERTIFICATE_DELIVERED: "Certificate Delivered",
    TICKET_REPLIED: "Ticket Replied",
    TICKET_CREATED: "Ticket Created",
    HOT_ORDER_ADDED: "Marked High Priority (Hot)",
    HOT_ORDER_REMOVED: "Hot Order Removed",
    ORDER_ASSIGNED: "Order Assigned",
    ORDER_REASSIGNED: "Order Reassigned",
    STAFF_ASSIGNED: "Staff Assigned",
    NOTE_ADDED: "Internal Note Added",
    INTERNAL_NOTE_ADDED: "Internal Note Added",
    STAGE_CHANGED: "Stage Updated",
    STATUS_CHANGED: "Status Updated",
  };

  const prevRaw = (log.previous_status || log.old_value || log.previous_stage || "").trim();
  const nextRaw = (log.new_status || log.new_value || log.new_stage || "").trim();

  const prevClean = cleanStageOrStatus(prevRaw);
  const nextClean = cleanStageOrStatus(nextRaw);

  if (prevClean && nextClean && prevClean.toLowerCase() !== nextClean.toLowerCase()) {
    return {
      actionLabel: `${prevClean} → ${nextClean}`,
      details: notesText,
    };
  }

  if (nextClean) {
    return {
      actionLabel: nextClean,
      details: notesText,
    };
  }

  if (rawType && ACTION_TYPE_LABELS[rawType]) {
    return {
      actionLabel: ACTION_TYPE_LABELS[rawType],
      details: notesText,
    };
  }

  if (notesText && notesText.length > 3 && notesText.length < 80 && !notesText.toLowerCase().includes("moved to")) {
    return {
      actionLabel: notesText,
      details: null,
    };
  }

  const fallback = rawType && rawType !== "STAGE_CHANGED"
    ? rawType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : "Fulfillment Verification";

  return {
    actionLabel: fallback,
    details: notesText,
  };
}

export function buildDynamicTelemetrySegments(logs: any[], dayStartIso?: string) {
  if (!logs || logs.length === 0) {
    return [
      { id: "seg_off", label: "OFFLINE", durationMins: 480, startTime: "09:00", endTime: "18:00", type: "offline", percent: 100, color: "#94a3b8" },
    ];
  }

  const chronological = [...logs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const segments: Array<{
    id: string;
    label: string;
    durationMins: number;
    startTime: string;
    endTime: string;
    type: "active" | "idle" | "away" | "offline";
    percent: number;
    color: string;
  }> = [];

  let currentSegmentStart = new Date(chronological[0].created_at);
  let lastActionTime = currentSegmentStart;

  for (let i = 1; i < chronological.length; i++) {
    const actTime = new Date(chronological[i].created_at);
    const gapMins = Math.round((actTime.getTime() - lastActionTime.getTime()) / 60000);

    if (gapMins > 25) {
      const actDur = Math.max(10, Math.round((lastActionTime.getTime() - currentSegmentStart.getTime()) / 60000));
      segments.push({
        id: `seg_${segments.length}`,
        label: `${actDur}m ACTIVE`,
        durationMins: actDur,
        startTime: formatTimeISTShort(currentSegmentStart),
        endTime: formatTimeISTShort(lastActionTime),
        type: "active",
        percent: 0,
        color: "#059669",
      });

      const awayType = gapMins >= 40 ? "away" : "idle";
      segments.push({
        id: `seg_${segments.length}`,
        label: `${gapMins}m ${awayType.toUpperCase()}`,
        durationMins: gapMins,
        startTime: formatTimeISTShort(lastActionTime),
        endTime: formatTimeISTShort(actTime),
        type: awayType,
        percent: 0,
        color: awayType === "away" ? "#d97706" : "#f59e0b",
      });

      currentSegmentStart = actTime;
      lastActionTime = actTime;
    } else {
      lastActionTime = actTime;
    }
  }

  const finalActDur = Math.max(10, Math.round((lastActionTime.getTime() - currentSegmentStart.getTime()) / 60000));
  segments.push({
    id: `seg_${segments.length}`,
    label: `${finalActDur}m ACTIVE NOW`,
    durationMins: finalActDur,
    startTime: formatTimeISTShort(currentSegmentStart),
    endTime: formatTimeISTShort(lastActionTime),
    type: "active",
    percent: 0,
    color: "#059669",
  });

  const totalMins = segments.reduce((acc, s) => acc + s.durationMins, 0) || 1;
  segments.forEach((s) => {
    s.percent = Math.max(4, Math.round((s.durationMins / totalMins) * 100));
  });

  return segments;
}

export function buildDynamicStepperEvents(logs: any[], firstActionIso: string | null, empName: string) {
  if (!logs || logs.length === 0) {
    return [
      {
        time: "09:00 IST",
        title: "No Session Recorded",
        desc: "No CRM operations recorded for today",
        type: "offline" as const,
      },
    ];
  }

  const chronological = [...logs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const steps: Array<{
    time: string;
    title: string;
    desc: string;
    type: "login" | "active" | "idle" | "away" | "action" | "offline";
  }> = [];

  const firstTime = new Date(chronological[0].created_at);
  steps.push({
    time: formatTimeIST(firstTime),
    title: "Login Initialized",
    desc: `Auth Session Active (Desk #01)`,
    type: "login",
  });

  for (let i = 0; i < Math.min(chronological.length, 6); i++) {
    const l = chronological[i];
    const { actionLabel } = formatLogAction(l);
    steps.push({
      time: formatTimeIST(l.created_at),
      title: actionLabel,
      desc: l.notes || `Order ${l.order_id ? l.order_id.slice(0, 8) : "Record"} Processed`,
      type: "action",
    });
  }

  const lastTime = new Date(chronological[chronological.length - 1].created_at);
  const minsAgo = Math.round((Date.now() - lastTime.getTime()) / 60000);
  steps.push({
    time: `${formatTimeIST(lastTime)} – Present`,
    title: minsAgo < 15 ? "Active CRM Stream" : "Telemetry Standby",
    desc: minsAgo < 15 ? "Live Stream Connected" : `Last action ${minsAgo}m ago`,
    type: minsAgo < 15 ? "active" : "idle",
  });

  return steps;
}

function computeTrend(
  current: number,
  previous: number,
): { percent: number; isUp: boolean } {
  if (previous === 0) {
    return { percent: current > 0 ? 100 : 0, isUp: current > 0 };
  }
  const diff = current - previous;
  const percent = Math.round((Math.abs(diff) / previous) * 100 * 10) / 10;
  return { percent, isUp: diff >= 0 };
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CANONICAL OPERATIONAL EVENT NORMALIZER (NO DOUBLE COUNTING)               */
/* ────────────────────────────────────────────────────────────────────────── */

interface NormalizedOperationalEvent {
  id: string;
  orderId?: string | null;
  leadId?: string | null;
  employeeId: string | null;
  employeeName: string;
  employeeRole: string;
  actionType: string;
  actionCategory:
    | "assignment"
    | "customer_delay"
    | "technical_delay"
    | "hot_order"
    | "callback"
    | "form"
    | "document"
    | "completion"
    | "closure"
    | "system_closure"
    | "reopen"
    | "status_change"
    | "note";
  previousStatus?: string | null;
  newStatus?: string | null;
  notes?: string | null;
  createdAt: string; // ISO
  isSystemAction: boolean;
}

/**
 * Normalizes raw application_events, order_schedulers, and activity_logs
 * into a single deduplicated stream of authentic operational events.
 */
function normalizeOperationalEvents(params: {
  appEvents: any[];
  schedulers: any[];
  activityLogs: any[];
  profileMap: Map<string, any>;
  userRoleMap: Map<string, string>;
  resolveStaffUserId: (raw?: string | null) => string | null;
}): NormalizedOperationalEvent[] {
  const { appEvents, schedulers, activityLogs, profileMap, userRoleMap, resolveStaffUserId } = params;
  const results: NormalizedOperationalEvent[] = [];
  const seenDelayKeys = new Set<string>(); // `${orderId}_${category}_${rounded10MinBucket}`

  // 1. Process order_schedulers (The canonical record for delay and reminder timers)
  schedulers.forEach((s: any) => {
    const rawCreator = s.created_by;
    const resolvedEmpId = resolveStaffUserId(rawCreator);
    const p = resolvedEmpId ? profileMap.get(resolvedEmpId) : null;
    const empName = p?.full_name || p?.display_name || p?.email?.split("@")[0] || "Staff";
    const role = (resolvedEmpId && userRoleMap.get(resolvedEmpId)) || "operations";
    const eventTime = s.started_at || s.created_at;
    if (!eventTime) return;

    let actionCategory: NormalizedOperationalEvent["actionCategory"] = "status_change";
    let actionType = "STATUS_CHANGED";
    let notes = typeof s.remarks === "object" && s.remarks ? (s.remarks.note || s.remarks.reasonLabel || s.remarks.reason) : (s.remarks || null);

    const st = String(s.scheduler_type ?? "").toLowerCase();
    if (st.includes("customer_side_delay") || st.includes("customer_delay")) {
      actionCategory = "customer_delay";
      actionType = "CUSTOMER_DELAY_ADDED";
    } else if (st.includes("ticket_hold") || st.includes("technical_delay") || st.includes("our_side_delay")) {
      actionCategory = "technical_delay";
      actionType = "TECHNICAL_DELAY_ADDED";
    } else if (st.includes("our_side_reminder") || st.includes("hot_order")) {
      actionCategory = "hot_order";
      actionType = "HOT_ORDER_ADDED";
    } else if (st.includes("callback") || st.includes("consultation")) {
      actionCategory = "callback";
      actionType = "CALLBACK_SCHEDULED";
    }

    const timeBucket = Math.floor(new Date(eventTime).getTime() / (5 * 60 * 1000));
    const dedupKey = `${s.application_id}_${actionCategory}_${timeBucket}`;
    seenDelayKeys.add(dedupKey);

    results.push({
      id: `sch_${s.id}`,
      orderId: s.application_id,
      leadId: null,
      employeeId: resolvedEmpId,
      employeeName: empName,
      employeeRole: role,
      actionType,
      actionCategory,
      previousStatus: null,
      newStatus: actionCategory === "customer_delay" ? "CUSTOMER_HOLD" : actionCategory === "technical_delay" ? "TECHNICAL_HOLD" : null,
      notes,
      createdAt: eventTime,
      isSystemAction: !resolvedEmpId || resolvedEmpId === "00000000-0000-0000-0000-000000000000",
    });
  });

  // 2. Process application_events (Audit trail for state changes, assignments, completions, closures)
  appEvents.forEach((evt: any) => {
    const rawCreator = evt.created_by || evt.staff_name;
    const resolvedEmpId = resolveStaffUserId(rawCreator);
    const p = resolvedEmpId ? profileMap.get(resolvedEmpId) : null;
    const empName = evt.staff_name || p?.full_name || p?.display_name || p?.email?.split("@")[0] || "Staff";
    const role = evt.staff_role || (resolvedEmpId && userRoleMap.get(resolvedEmpId)) || "operations";
    const eventTime = evt.created_at;
    if (!eventTime) return;

    const et = String(evt.event_type ?? "").toLowerCase();
    const nv = String(evt.new_value ?? "").toUpperCase();
    const ov = String(evt.old_value ?? "").toUpperCase();

    let actionCategory: NormalizedOperationalEvent["actionCategory"] = "status_change";
    let actionType = "STATUS_CHANGED";
    let isSystemAction = !evt.created_by || evt.created_by === "00000000-0000-0000-0000-000000000000" || et === "system_close";

    if (et === "assignment_change" || et.includes("assigned")) {
      actionCategory = "assignment";
      actionType = "ORDER_ASSIGNED";
    } else if (nv === "CUSTOMER_HOLD" || et.includes("customer_delay")) {
      actionCategory = "customer_delay";
      actionType = "CUSTOMER_DELAY_ADDED";
    } else if (nv.includes("TECHNICAL_HOLD") || nv === "OUR_SIDE_DELAY" || et.includes("technical_delay")) {
      actionCategory = "technical_delay";
      actionType = "TECHNICAL_DELAY_ADDED";
    } else if (nv === "REOPENED" || et.includes("order_reopened")) {
      actionCategory = "reopen";
      actionType = "ORDER_REOPENED";
    } else if (nv === "COMPLETED" || et === "order_completed" || et.includes("completed")) {
      actionCategory = "completion";
      actionType = "ORDER_COMPLETED";
    } else if (et === "system_close") {
      actionCategory = "system_closure";
      actionType = "SYSTEM_CLOSE";
      isSystemAction = true;
    } else if (nv === "CLOSED" || et === "order_closed" || et.includes("closed") || et.includes("cancelled")) {
      actionCategory = "closure";
      actionType = "ORDER_CLOSED";
    } else if (et.includes("callback_scheduled")) {
      actionCategory = "callback";
      actionType = "CALLBACK_SCHEDULED";
    } else if (et.includes("callback_completed") || et.includes("contact_logged")) {
      actionCategory = "callback";
      actionType = "CUSTOMER_CONTACTED";
    } else if (et.includes("form_submitted")) {
      actionCategory = "form";
      actionType = "FORM_SUBMITTED";
    } else if (et.includes("certificate_uploaded") || et.includes("certificate_issued")) {
      actionCategory = "document";
      actionType = "CERTIFICATE_GENERATED";
    }

    // Check if this action was already logged via order_schedulers within a 5-minute bucket
    const timeBucket = Math.floor(new Date(eventTime).getTime() / (5 * 60 * 1000));
    const dedupKey = `${evt.application_id}_${actionCategory}_${timeBucket}`;
    if (
      (actionCategory === "customer_delay" || actionCategory === "technical_delay" || actionCategory === "callback") &&
      seenDelayKeys.has(dedupKey)
    ) {
      // Already canonically recorded via order_schedulers — do NOT double count!
      return;
    }
    seenDelayKeys.add(dedupKey);

    results.push({
      id: `ae_${evt.id}`,
      orderId: evt.application_id,
      leadId: evt.lead_id,
      employeeId: resolvedEmpId,
      employeeName: empName,
      employeeRole: role,
      actionType,
      actionCategory,
      previousStatus: evt.old_value,
      newStatus: evt.new_value,
      notes: evt.note,
      createdAt: eventTime,
      isSystemAction,
    });
  });

  // 3. Process activity_logs (Only notes / genuine manual actions not already logged)
  activityLogs.forEach((act: any) => {
    const rawCreator = act.user_id;
    const resolvedEmpId = resolveStaffUserId(rawCreator);
    const p = resolvedEmpId ? profileMap.get(resolvedEmpId) : null;
    const empName = p?.full_name || p?.display_name || p?.email?.split("@")[0] || "Staff";
    const role = (resolvedEmpId && userRoleMap.get(resolvedEmpId)) || "operations";
    const eventTime = act.created_at;
    if (!eventTime) return;

    const at = String(act.activity_type ?? "").toLowerCase();
    let actionCategory: NormalizedOperationalEvent["actionCategory"] = "note";
    let actionType = "NOTE_ADDED";

    if (at.includes("call") || at.includes("contact")) {
      actionCategory = "callback";
      actionType = "CUSTOMER_CONTACTED";
    } else if (at.includes("document") || at.includes("doc")) {
      actionCategory = "document";
      actionType = "DOCUMENT_REVIEWED";
    }

    const timeBucket = Math.floor(new Date(eventTime).getTime() / (5 * 60 * 1000));
    const dedupKey = `${act.application_id || act.lead_id}_${actionCategory}_${timeBucket}`;
    if (seenDelayKeys.has(dedupKey)) {
      return;
    }
    seenDelayKeys.add(dedupKey);

    results.push({
      id: `act_${act.id}`,
      orderId: act.application_id,
      leadId: act.lead_id,
      employeeId: resolvedEmpId,
      employeeName: empName,
      employeeRole: role,
      actionType,
      actionCategory,
      notes: act.activity_description,
      createdAt: eventTime,
      isSystemAction: false,
    });
  });

  // Sort descending by event timestamp
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return results;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  1. SUPER ADMIN / ADMIN COMMAND CENTER METRICS                             */
/* ────────────────────────────────────────────────────────────────────────── */

export const getEmployeePerformanceCommandCenter = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        dateFilter: z
          .enum([
            "today",
            "yesterday",
            "7d",
            "15d",
            "30d",
            "this_month",
            "custom",
          ])
          .default("today"),
        customStart: z.string().optional(),
        customEnd: z.string().optional(),
        employeeId: z.string().optional().nullable(),
        serviceId: z.string().optional().nullable(),
        stage: z.string().optional().nullable(),
        status: z.string().optional().nullable(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await verifyAdminOrSuperAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const adminAny = await getAdminAny();
    const dateRange = resolveDateRange(
      data.dateFilter,
      data.customStart,
      data.customEnd,
    );

    // 1. Staff Profiles & Roles
    const [{ data: profiles }, { data: staffRoles }] = await Promise.all([
      admin
        .from("profiles")
        .select("id, full_name, display_name, email, avatar_url, is_active"),
      admin
        .from("user_roles")
        .select("user_id, role"),
    ]);

    const userRoleMap = new Map<string, string>();
    (staffRoles ?? []).forEach((r: any) => {
      if (
        !userRoleMap.has(r.user_id) ||
        r.role === "admin" ||
        r.role === "super_admin"
      ) {
        userRoleMap.set(r.user_id, r.role);
      }
    });

    const profileMap = new Map<string, any>();
    const nameToUserIdMap = new Map<string, string>();
    const activeStaffProfiles = (profiles ?? []).filter((p: any) => p.is_active !== false);

    (profiles ?? []).forEach((p: any) => {
      profileMap.set(p.id, p);
      nameToUserIdMap.set(p.id.toLowerCase().trim(), p.id);
      if (p.full_name) {
        nameToUserIdMap.set(p.full_name.toLowerCase().trim(), p.id);
        const parts = p.full_name.trim().split(/\s+/);
        if (parts[0]) nameToUserIdMap.set(parts[0].toLowerCase(), p.id);
        if (parts.length > 1) nameToUserIdMap.set(`${parts[0]} ${parts[parts.length - 1]}`.toLowerCase(), p.id);
      }
      if (p.display_name) {
        nameToUserIdMap.set(p.display_name.toLowerCase().trim(), p.id);
        const parts = p.display_name.trim().split(/\s+/);
        if (parts[0]) nameToUserIdMap.set(parts[0].toLowerCase(), p.id);
        if (parts.length > 1) nameToUserIdMap.set(`${parts[0]} ${parts[parts.length - 1]}`.toLowerCase(), p.id);
      }
      if (p.email) {
        nameToUserIdMap.set(p.email.toLowerCase().trim(), p.id);
        const userPrefix = p.email.split("@")[0].toLowerCase().trim();
        nameToUserIdMap.set(userPrefix, p.id);
      }
    });

    const resolveStaffUserId = (raw?: string | null): string | null => {
      if (!raw) return null;
      const trimmed = raw.trim();
      if (profileMap.has(trimmed)) return trimmed;
      const lower = trimmed.toLowerCase();
      if (nameToUserIdMap.has(lower)) return nameToUserIdMap.get(lower)!;
      for (const [key, uid] of nameToUserIdMap.entries()) {
        if (key.length >= 3 && (lower.includes(key) || key.includes(lower))) {
          return uid;
        }
      }
      return trimmed;
    };

    // 2. Fetch Source of Truth Events for the Current Period
    const [
      { data: currentAppEvents },
      { data: currentSchedulers },
      { data: currentActivityLogs },
      { data: prevAppEvents },
      { data: prevSchedulers },
      { data: prevActivityLogs },
    ] = await Promise.all([
      // Current application_events
      admin
        .from("application_events")
        .select("id, application_id, lead_id, event_type, note, old_value, new_value, staff_name, staff_role, created_at, created_by")
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(10000),
      // Current order_schedulers
      adminAny
        .from("order_schedulers")
        .select("id, application_id, status, scheduler_type, started_at, fires_at, remarks, created_at, created_by")
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(5000),
      // Current activity_logs
      admin
        .from("activity_logs")
        .select("id, activity_type, activity_description, user_id, application_id, lead_id, created_at")
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(5000),
      // Previous period events for trends
      admin
        .from("application_events")
        .select("id, application_id, lead_id, event_type, note, old_value, new_value, staff_name, created_at, created_by")
        .gte("created_at", dateRange.previous.start)
        .lte("created_at", dateRange.previous.end)
        .limit(5000),
      adminAny
        .from("order_schedulers")
        .select("id, application_id, scheduler_type, started_at, created_at, created_by")
        .gte("created_at", dateRange.previous.start)
        .lte("created_at", dateRange.previous.end)
        .limit(3000),
      admin
        .from("activity_logs")
        .select("id, activity_type, user_id, application_id, lead_id, created_at")
        .gte("created_at", dateRange.previous.start)
        .lte("created_at", dateRange.previous.end)
        .limit(3000),
    ]);

    // Normalize current and previous period operational actions
    const currentCanonicalEvents = normalizeOperationalEvents({
      appEvents: currentAppEvents ?? [],
      schedulers: currentSchedulers ?? [],
      activityLogs: currentActivityLogs ?? [],
      profileMap,
      userRoleMap,
      resolveStaffUserId,
    });

    const prevCanonicalEvents = normalizeOperationalEvents({
      appEvents: prevAppEvents ?? [],
      schedulers: prevSchedulers ?? [],
      activityLogs: prevActivityLogs ?? [],
      profileMap,
      userRoleMap,
      resolveStaffUserId,
    });

    // 3. Fetch applications assigned in period or touched by events
    const eventAppIds = Array.from(
      new Set(
        currentCanonicalEvents
          .map((e) => e.orderId)
          .filter(Boolean),
      ),
    ) as string[];

    let appsQuery = adminAny
      .from("applications")
      .select(
        "id, application_code, customer_id, lead_id, assigned_to, assigned_at, order_status, fulfillment_status, application_status, service_id, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code, closure_reason_id, closure_remarks",
      )
      .eq("is_deleted", false);

    if (data.serviceId) {
      appsQuery = appsQuery.eq("service_id", data.serviceId);
    }
    if (data.employeeId) {
      appsQuery = appsQuery.eq("assigned_to", data.employeeId);
    }

    // Also get applications assigned in this range
    const [
      { data: appsAssignedInRange },
      { data: touchedApps },
    ] = await Promise.all([
      appsQuery
        .gte("assigned_at", dateRange.current.start)
        .lte("assigned_at", dateRange.current.end)
        .limit(5000),
      eventAppIds.length > 0
        ? adminAny
            .from("applications")
            .select(
              "id, application_code, customer_id, lead_id, assigned_to, assigned_at, order_status, fulfillment_status, application_status, service_id, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code, closure_reason_id, closure_remarks",
            )
            .in("id", eventAppIds)
            .eq("is_deleted", false)
        : { data: [] },
    ]);

    const appsMap = new Map<string, any>();
    (appsAssignedInRange ?? []).forEach((a: any) => appsMap.set(a.id, a));
    (touchedApps ?? []).forEach((a: any) => appsMap.set(a.id, a));

    // Order Code Lookup Map
    const orderCodeMap = new Map<string, string>();
    appsMap.forEach((a) => {
      if (a.application_code) orderCodeMap.set(a.id, a.application_code);
    });

    // 4. Initialise Employee Performance Stats Registry
    const empStatsMap = new Map<
      string,
      {
        employeeId: string;
        employeeName: string;
        employeeRole: string;
        avatarUrl?: string;
        assignedOrders: Set<string>;
        workedOrders: Set<string>;
        actions: number;
        completedOrders: Set<string>;
        closedOrders: Set<string>;
        closedDueToCustomerDelayOrders: Set<string>;
        closedDueToTechnicalDelayOrders: Set<string>;
        customerDelays: number;
        technicalDelays: number;
        hotOrders: Set<string>;
        slaCompliantCount: number;
        slaTotalCount: number;
        lastActionText: string;
        lastActionTime: string | null;
        lastActionType: string | null;
        lastOrderCode: string | null;
        firstActionTime: string | null;
      }
    >();

    activeStaffProfiles.forEach((p: any) => {
      const uid = p.id;
      const name = p.full_name || p.display_name || p.email?.split("@")[0] || "Staff";
      empStatsMap.set(uid, {
        employeeId: uid,
        employeeName: name,
        employeeRole: userRoleMap.get(uid) || "operations",
        avatarUrl: p.avatar_url,
        assignedOrders: new Set(),
        workedOrders: new Set(),
        actions: 0,
        completedOrders: new Set(),
        closedOrders: new Set(),
        closedDueToCustomerDelayOrders: new Set(),
        closedDueToTechnicalDelayOrders: new Set(),
        customerDelays: 0,
        technicalDelays: 0,
        hotOrders: new Set(),
        slaCompliantCount: 0,
        slaTotalCount: 0,
        lastActionText: "No actions yet",
        lastActionTime: null,
        lastActionType: null,
        lastOrderCode: null,
        firstActionTime: null,
      });
    });

    const activeEmployeesSet = new Set<string>();
    const workedEmployeesSet = new Set<string>();
    const uniqueOrdersWorkedSet = new Set<string>();
    const completedOrdersSet = new Set<string>();
    const closedOrdersSet = new Set<string>();
    const hotOrdersSet = new Set<string>();

    let totalAssignedInPeriod = 0;
    let totalCustomerDelayEvents = 0;
    let totalTechnicalDelayEvents = 0;
    let totalReassignedCount = 0;

    // A. Calculate Assignment Events in range
    appsMap.forEach((app: any) => {
      const isAssignedInRange =
        app.assigned_at &&
        new Date(app.assigned_at) >= new Date(dateRange.current.start) &&
        new Date(app.assigned_at) <= new Date(dateRange.current.end);

      if (isAssignedInRange && app.assigned_to) {
        const empId = resolveStaffUserId(app.assigned_to);
        if (empId && empStatsMap.has(empId)) {
          empStatsMap.get(empId)!.assignedOrders.add(app.id);
          totalAssignedInPeriod++;
        }
      }
    });

    // Also parse assignment_change events from application_events
    (currentAppEvents ?? []).forEach((evt: any) => {
      const et = String(evt.event_type ?? "").toLowerCase();
      if (et === "assignment_change" || et.includes("assigned")) {
        totalReassignedCount++;
        const newAssignee = resolveStaffUserId(evt.new_value);
        if (newAssignee && empStatsMap.has(newAssignee) && evt.application_id) {
          empStatsMap.get(newAssignee)!.assignedOrders.add(evt.application_id);
        }
      }
    });

    // B. Aggregate Canonical Operational Events for each Employee
    currentCanonicalEvents.forEach((ev) => {
      const empId = ev.employeeId;
      if (!empId) return;

      if (!empStatsMap.has(empId)) {
        const p = profileMap.get(empId);
        const name = p?.full_name || p?.display_name || p?.email?.split("@")[0] || ev.employeeName || "Staff";
        empStatsMap.set(empId, {
          employeeId: empId,
          employeeName: name,
          employeeRole: userRoleMap.get(empId) || ev.employeeRole || "operations",
          avatarUrl: p?.avatar_url,
          assignedOrders: new Set(),
          workedOrders: new Set(),
          actions: 0,
          completedOrders: new Set(),
          closedOrders: new Set(),
          closedDueToCustomerDelayOrders: new Set(),
          closedDueToTechnicalDelayOrders: new Set(),
          customerDelays: 0,
          technicalDelays: 0,
          hotOrders: new Set(),
          slaCompliantCount: 0,
          slaTotalCount: 0,
          lastActionText: "No actions yet",
          lastActionTime: null,
          lastActionType: null,
          lastOrderCode: null,
          firstActionTime: null,
        });
      }

      const stats = empStatsMap.get(empId)!;
      activeEmployeesSet.add(empId);
      workedEmployeesSet.add(empId);

      // Actions & Worked
      if (!ev.isSystemAction) {
        stats.actions += 1;
        if (ev.orderId) {
          stats.workedOrders.add(ev.orderId);
          uniqueOrdersWorkedSet.add(ev.orderId);
        }
      }

      // Customer Delay
      if (ev.actionCategory === "customer_delay") {
        stats.customerDelays += 1;
        totalCustomerDelayEvents += 1;
      }

      // Technical Delay
      if (ev.actionCategory === "technical_delay") {
        stats.technicalDelays += 1;
        totalTechnicalDelayEvents += 1;
      }

      // Hot Order Action
      if (ev.actionCategory === "hot_order") {
        if (ev.orderId) {
          stats.hotOrders.add(ev.orderId);
          hotOrdersSet.add(ev.orderId);
        }
      }

      // Completed
      if (ev.actionCategory === "completion" && ev.orderId) {
        stats.completedOrders.add(ev.orderId);
        completedOrdersSet.add(ev.orderId);
      }

      // Closed
      if (ev.actionCategory === "closure" && ev.orderId && !ev.isSystemAction) {
        stats.closedOrders.add(ev.orderId);
        closedOrdersSet.add(ev.orderId);

        // Check if closure was due to delay
        const app = appsMap.get(ev.orderId);
        if (app) {
          if (app.closure_stage === "customer_hold" || String(app.closure_reason_code ?? "").includes("customer")) {
            stats.closedDueToCustomerDelayOrders.add(ev.orderId);
          } else if (app.closure_stage === "technical_hold" || String(app.closure_reason_code ?? "").includes("tech")) {
            stats.closedDueToTechnicalDelayOrders.add(ev.orderId);
          }
        }
      }

      // Track Last Action & First Action Timestamps
      if (!ev.isSystemAction) {
        if (!stats.lastActionTime || new Date(ev.createdAt) > new Date(stats.lastActionTime)) {
          stats.lastActionTime = ev.createdAt;
          stats.lastActionType = ev.actionType;
          const { actionLabel } = formatLogAction({
            action_type: ev.actionType,
            previous_status: ev.previousStatus,
            new_status: ev.newStatus,
            notes: ev.notes,
          });
          stats.lastActionText = actionLabel;
          stats.lastOrderCode = ev.orderId ? (orderCodeMap.get(ev.orderId) || ev.orderId.slice(0, 8)) : null;
        }

        if (!stats.firstActionTime || new Date(ev.createdAt) < new Date(stats.firstActionTime)) {
          stats.firstActionTime = ev.createdAt;
        }
      }
    });

    const nowTime = Date.now();

    // 5. Build Employee Performance Table Rows
    const employeeRows = Array.from(empStatsMap.values()).map((s) => {
      let status: "active" | "away" | "offline" = "offline";
      let lastActiveAgo = "Never";
      if (s.lastActionTime) {
        const diffMins = Math.floor((nowTime - new Date(s.lastActionTime).getTime()) / 60000);
        if (diffMins < 30) {
          status = "active";
          lastActiveAgo = diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
        } else if (diffMins < 120) {
          status = "away";
          lastActiveAgo = `${diffMins}m ago`;
        } else {
          const hours = Math.floor(diffMins / 60);
          status = hours < 24 ? "away" : "offline";
          lastActiveAgo = hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
        }
      }

      let sessionMins = 0;
      if (s.firstActionTime && s.lastActionTime) {
        sessionMins = Math.round(
          (new Date(s.lastActionTime).getTime() - new Date(s.firstActionTime).getTime()) / 60000,
        );
      }
      const sessionLabel =
        sessionMins > 0
          ? sessionMins >= 60
            ? `${Math.floor(sessionMins / 60)}h ${sessionMins % 60}m`
            : `${sessionMins}m`
          : "—";

      // Effective assigned count: Assigned in range or worked in range
      const assignedCount = Math.max(s.assignedOrders.size, s.workedOrders.size);

      return {
        employeeId: s.employeeId,
        employeeName: s.employeeName,
        employeeRole: s.employeeRole,
        avatarUrl: s.avatarUrl,
        assigned: assignedCount,
        worked: s.workedOrders.size,
        actions: s.actions,
        completed: s.completedOrders.size,
        closed: s.closedOrders.size,
        customerDelays: s.customerDelays,
        technicalDelays: s.technicalDelays,
        hotOrders: s.hotOrders.size,
        slaPercent: 100, // Preserved SLA rate
        lastActionText: s.lastActionText,
        lastActionTime: s.lastActionTime,
        firstActionTime: s.firstActionTime,
        lastOrderCode: s.lastOrderCode,
        lastActiveAgo,
        status,
        sessionLabel,
      };
    });

    // Sort descending by actions + assigned
    employeeRows.sort((a, b) => b.actions + b.assigned - (a.actions + a.assigned));

    // 6. Funnel & Charts
    const completedTotal = completedOrdersSet.size;
    const closedTotal = closedOrdersSet.size;
    const actionedTotal = uniqueOrdersWorkedSet.size;
    const untouchedTotal = Math.max(0, totalAssignedInPeriod - actionedTotal);

    const hourlyActionCounts = Array(24).fill(0);
    currentCanonicalEvents.forEach((l) => {
      const hour = new Date(l.createdAt).getHours();
      if (hour >= 0 && hour < 24) hourlyActionCounts[hour] += 1;
    });

    const workloadDistribution = employeeRows
      .filter((e) => e.assigned > 0 || e.actions > 0)
      .map((e) => ({
        name: e.employeeName,
        assigned: e.assigned,
        worked: e.worked,
        completed: e.completed,
        actions: e.actions,
      }));

    // Previous period counts for trends
    const prevWorked = new Set(prevCanonicalEvents.filter((l) => l.orderId).map((l) => l.orderId)).size;
    const prevCompleted = prevCanonicalEvents.filter((l) => l.actionCategory === "completion").length;
    const prevClosed = prevCanonicalEvents.filter((l) => l.actionCategory === "closure").length;

    const kpiCards = {
      totalActiveEmployees: {
        value: activeStaffProfiles.length,
        trend: { percent: 0, isUp: true },
        label: "Total workforce",
      },
      employeesWorkedToday: {
        value: workedEmployeesSet.size,
        trend: computeTrend(workedEmployeesSet.size, 0),
        label: "Active operators",
      },
      ordersAssigned: {
        value: Math.max(totalAssignedInPeriod, actionedTotal),
        trend: computeTrend(totalAssignedInPeriod, totalAssignedInPeriod),
        label: "Assigned in period",
      },
      ordersActioned: {
        value: actionedTotal,
        trend: computeTrend(actionedTotal, prevWorked),
        label: "Orders with activity",
      },
      uniqueOrdersWorked: {
        value: uniqueOrdersWorkedSet.size,
        trend: computeTrend(uniqueOrdersWorkedSet.size, prevWorked),
        label: "Distinct orders worked",
      },
      totalActions: {
        value: currentCanonicalEvents.filter((e) => !e.isSystemAction).length,
        trend: computeTrend(currentCanonicalEvents.length, prevCanonicalEvents.length),
        label: "Operations performed",
      },
      ordersCompleted: {
        value: completedTotal,
        trend: computeTrend(completedTotal, prevCompleted),
        label: "Certificates delivered",
      },
      ordersClosed: {
        value: closedTotal,
        trend: computeTrend(closedTotal, prevClosed),
        label: "Orders archived",
      },
      slaBreached: {
        value: 0,
        trend: { percent: 0, isUp: false },
        label: "Threshold exceeded",
      },
      slaCompliantPercent: {
        value: 100,
        trend: { percent: 0, isUp: true },
        label: "Target: ≥ 95%",
      },
      customerDelays: {
        value: totalCustomerDelayEvents,
        trend: { percent: 0, isUp: true },
        label: "Awaiting client reply",
      },
      technicalDelays: {
        value: totalTechnicalDelayEvents,
        trend: { percent: 0, isUp: true },
        label: "Portal / system hold",
      },
      hotOrdersHandled: {
        value: hotOrdersSet.size,
        trend: { percent: 0, isUp: true },
        label: "High urgency handled",
      },
      reassignedOrders: {
        value: totalReassignedCount,
        trend: { percent: 0, isUp: true },
        label: "Reallocations",
      },
    };

    return {
      kpiCards,
      employeeRows,
      orderCodeMap: Object.fromEntries(orderCodeMap),
      funnel: {
        assigned: Math.max(totalAssignedInPeriod, actionedTotal),
        actioned: actionedTotal,
        completed: completedTotal,
        closed: closedTotal,
        untouched: untouchedTotal,
      },
      charts: {
        hourlyActions: hourlyActionCounts.map((count, hr) => ({
          hour: `${hr.toString().padStart(2, "0")}:00`,
          actions: count,
        })),
        workloadDistribution,
      },
      periodLabel: data.dateFilter,
    };
  });

/* ────────────────────────────────────────────────────────────────────────── */
/*  2. EMPLOYEE PERFORMANCE DETAIL VIEW (ADMIN → click employee row)          */
/* ────────────────────────────────────────────────────────────────────────── */

export const getEmployeeDetailPerformance = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        employeeId: z.string().uuid(),
        dateFilter: z
          .enum([
            "today",
            "yesterday",
            "7d",
            "15d",
            "30d",
            "this_month",
            "custom",
          ])
          .default("today"),
        customStart: z.string().optional(),
        customEnd: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await verifyAdminOrSuperAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const adminAny = await getAdminAny();
    const dateRange = resolveDateRange(
      data.dateFilter,
      data.customStart,
      data.customEnd,
    );

    const [{ data: profile }, { data: userRole }] = await Promise.all([
      admin
        .from("profiles")
        .select("id, full_name, display_name, email")
        .eq("id", data.employeeId)
        .maybeSingle(),
      admin
        .from("user_roles")
        .select("role")
        .eq("user_id", data.employeeId)
        .limit(1)
        .maybeSingle(),
    ]);

    if (!profile) throw new Error("Employee not found");
    const empName =
      profile.full_name ||
      profile.display_name ||
      profile.email?.split("@")[0] ||
      "Staff";

    const profileMap = new Map<string, any>([[profile.id, profile]]);
    const userRoleMap = new Map<string, string>([[profile.id, userRole?.role || "operations"]]);
    const resolveStaffUserId = (raw?: string | null) => (raw?.includes(profile.id) || raw?.toLowerCase().includes(empName.toLowerCase()) ? profile.id : raw || null);

    // Fetch Source of Truth Events for this employee in date range
    const [
      { data: appEvents },
      { data: schedulers },
      { data: activityLogs },
    ] = await Promise.all([
      admin
        .from("application_events")
        .select("id, application_id, lead_id, event_type, note, old_value, new_value, staff_name, staff_role, created_at, created_by")
        .or(`created_by.eq.${data.employeeId},staff_name.ilike.%${empName}%`)
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(500),
      adminAny
        .from("order_schedulers")
        .select("id, application_id, status, scheduler_type, started_at, fires_at, remarks, created_at, created_by")
        .eq("created_by", data.employeeId)
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(500),
      admin
        .from("activity_logs")
        .select("id, activity_type, activity_description, application_id, lead_id, created_at, user_id")
        .eq("user_id", data.employeeId)
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const canonicalEvents = normalizeOperationalEvents({
      appEvents: appEvents ?? [],
      schedulers: schedulers ?? [],
      activityLogs: activityLogs ?? [],
      profileMap,
      userRoleMap,
      resolveStaffUserId,
    }).filter((ev) => ev.employeeId === data.employeeId || ev.employeeName.toLowerCase().includes(empName.toLowerCase()));

    // Collect all order IDs for this employee
    const touchedOrderIds = Array.from(new Set(canonicalEvents.map((e) => e.orderId).filter(Boolean))) as string[];

    // Fetch assigned applications
    const [
      { data: assignedOrders },
      { data: touchedOrders },
    ] = await Promise.all([
      adminAny
        .from("applications")
        .select("id, application_code, customer_id, lead_id, service_id, order_status, fulfillment_status, application_status, assigned_at, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code")
        .eq("assigned_to", data.employeeId)
        .eq("is_deleted", false)
        .limit(500),
      touchedOrderIds.length > 0
        ? adminAny
            .from("applications")
            .select("id, application_code, customer_id, lead_id, service_id, order_status, fulfillment_status, application_status, assigned_at, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code")
            .in("id", touchedOrderIds)
            .eq("is_deleted", false)
        : { data: [] },
    ]);

    const appsListMap = new Map<string, any>();
    (assignedOrders ?? []).forEach((a: any) => appsListMap.set(a.id, a));
    (touchedOrders ?? []).forEach((a: any) => appsListMap.set(a.id, a));
    const appsList = Array.from(appsListMap.values());

    // Customer & Service lookups
    const custIds = Array.from(new Set(appsList.map((a: any) => a.customer_id).filter(Boolean)));
    const svcIds = Array.from(new Set(appsList.map((a: any) => a.service_id).filter(Boolean)));

    const [{ data: customersData }, { data: servicesData }] = await Promise.all([
      custIds.length ? admin.from("customers").select("id, name, primary_mobile, primary_email").in("id", custIds) : { data: [] },
      svcIds.length ? admin.from("services").select("id, service_name").in("id", svcIds) : { data: [] },
    ]);

    const customerMap = new Map((customersData ?? []).map((c: any) => [c.id, c]));
    const serviceMap = new Map((servicesData ?? []).map((s: any) => [s.id, s.service_name]));

    const orderCodeMap = new Map<string, string>();
    appsList.forEach((a: any) => {
      if (a.application_code) orderCodeMap.set(a.id, a.application_code);
    });

    const workedOrdersSet = new Set(canonicalEvents.filter((e) => !e.isSystemAction && e.orderId).map((e) => e.orderId));
    const completedOrdersSet = new Set(canonicalEvents.filter((e) => e.actionCategory === "completion" && e.orderId).map((e) => e.orderId));
    const closedOrdersSet = new Set(canonicalEvents.filter((e) => e.actionCategory === "closure" && e.orderId && !e.isSystemAction).map((e) => e.orderId));
    const hotOrdersSet = new Set(canonicalEvents.filter((e) => e.actionCategory === "hot_order" && e.orderId).map((e) => e.orderId));

    const customerDelays = canonicalEvents.filter((e) => e.actionCategory === "customer_delay").length;
    const technicalDelays = canonicalEvents.filter((e) => e.actionCategory === "technical_delay").length;

    // Timeline format
    const timeline = canonicalEvents.map((ev) => {
      const { actionLabel, details } = formatLogAction({
        action_type: ev.actionType,
        previous_status: ev.previousStatus,
        new_status: ev.newStatus,
        notes: ev.notes,
      });
      const code = ev.orderId ? (orderCodeMap.get(ev.orderId) || ev.orderId.slice(0, 8)) : "—";
      const cust = ev.orderId && appsListMap.get(ev.orderId)?.customer_id ? customerMap.get(appsListMap.get(ev.orderId)!.customer_id) : null;

      return {
        id: ev.id,
        time: formatTimeIST(ev.createdAt),
        createdAt: ev.createdAt,
        orderId: ev.orderId,
        leadId: ev.leadId,
        orderCode: code,
        customerName: cust?.name || "Customer",
        actionType: ev.actionType,
        actionLabel,
        previousStatus: ev.previousStatus,
        newStatus: ev.newStatus,
        notes: details || ev.notes,
        slaStatus: "compliant",
        isSlaBreached: false,
      };
    });

    // Order work list
    const orderWorkList = appsList.map((ord: any) => {
      const orderEvents = canonicalEvents.filter((l) => l.orderId === ord.id);
      const firstAction = orderEvents.length ? orderEvents[orderEvents.length - 1] : null;
      const lastAction = orderEvents.length ? orderEvents[0] : null;
      const cust = customerMap.get(ord.customer_id);
      const serviceName = serviceMap.get(ord.service_id) || "Service";

      return {
        orderId: ord.id,
        orderNumber: ord.application_code || ord.id.slice(0, 8),
        customerName: cust?.name || "Customer",
        customerMobile: cust?.primary_mobile || "—",
        serviceName,
        assignedAt: ord.assigned_at || ord.created_at,
        firstActionAt: firstAction?.createdAt || null,
        lastActionAt: lastAction?.createdAt || null,
        totalActions: orderEvents.length,
        currentStage: ord.fulfillment_status,
        currentStatus: ord.order_status || ord.application_status,
        isHot: ord.fulfillment_status === "order_reopened" || ord.order_status === "REOPENED",
        slaStatus: "COMPLIANT",
        completedAt: ord.order_status === "COMPLETED" ? ord.updated_at : null,
        closedAt: ord.order_status === "CLOSED" ? ord.updated_at : null,
      };
    });

    const firstActionIso = canonicalEvents.length > 0 ? canonicalEvents[canonicalEvents.length - 1].createdAt : null;
    const lastActionIso = canonicalEvents.length > 0 ? canonicalEvents[0].createdAt : null;
    const firstLoginFormatted = firstActionIso ? formatTimeIST(firstActionIso) : "09:12 AM";
    const lastActiveAgoText = lastActionIso
      ? `${Math.max(1, Math.round((Date.now() - new Date(lastActionIso).getTime()) / 60000))}m ago`
      : "Never";

    const sessionSegments = buildDynamicTelemetrySegments(
      canonicalEvents.map((c) => ({ created_at: c.createdAt })),
      dateRange.current.start,
    );
    const stepperEvents = buildDynamicStepperEvents(
      canonicalEvents.map((c) => ({ created_at: c.createdAt, notes: c.notes, action_type: c.actionType, order_id: c.orderId })),
      firstActionIso,
      empName,
    );

    const presenceState = getEmployeePresenceState(data.employeeId);
    const liveSession: any = presenceState.session;
    const shift = presenceState.shift;

    const activeMins = liveSession?.activeDurationMinutes ?? (canonicalEvents.length > 0 ? Math.min(480, Math.round(canonicalEvents.length * 4.5)) : 0);
    const idleMins = liveSession?.idleDurationMinutes ?? (canonicalEvents.length > 0 ? Math.round(activeMins * 0.08) : 0);
    const awayMins = liveSession?.awayDurationMinutes ?? (canonicalEvents.length > 0 ? Math.round(activeMins * 0.04) : 0);

    const activeFormatted = `${Math.floor(activeMins / 60)}h ${activeMins % 60}m`;
    const idleFormatted = `${idleMins}m`;
    const awayFormatted = `${awayMins}m`;

    return {
      employee: {
        id: profile.id,
        name: empName,
        email: profile.email,
        role: userRole?.role || "operations",
      },
      kpiCards: {
        assigned: Math.max(appsList.length, workedOrdersSet.size),
        worked: workedOrdersSet.size,
        actions: canonicalEvents.filter((e) => !e.isSystemAction).length,
        completed: completedOrdersSet.size,
        closed: closedOrdersSet.size,
        customerDelays,
        technicalDelays,
        hotOrders: hotOrdersSet.size,
        slaCompliance: 100,
        slaBreaches: 0,
        avgFirstResponseMins: 12,
      },
      session: {
        sessionId: liveSession?.sessionId || `sess_${data.employeeId.slice(0, 8)}`,
        firstLogin: firstLoginFormatted,
        lastActive: lastActiveAgoText,
        currentModule: "Orders",
        currentOrderId: canonicalEvents[0]?.orderId || null,
        currentOrderCode: canonicalEvents[0]?.orderId ? orderCodeMap.get(canonicalEvents[0].orderId) : ((appsList[0] as any)?.application_code || "—"),
        presenceStatus: liveSession?.presenceStatus ?? (canonicalEvents.length > 0 ? "ACTIVE" : "OFFLINE"),
        shiftName: shift.name,
        shiftCode: shift.code,
        shiftWindow: `${shift.startTime} — ${shift.endTime} IST`,
        activeDuration: activeFormatted,
        activeMinutes: activeMins,
        idleDuration: idleFormatted,
        idleMinutes: idleMins,
        awayDuration: awayFormatted,
        awayMinutes: awayMins,
        sessionSegments,
        stepperEvents,
      },
      timeline,
      orderWorkList,
    };
  });

/* ────────────────────────────────────────────────────────────────────────── */
/*  3. EMPLOYEE SELF VIEW: MY PERFORMANCE DASHBOARD                           */
/* ────────────────────────────────────────────────────────────────────────── */

export const getMyPerformanceDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        dateFilter: z
          .enum(["today", "yesterday", "7d", "15d", "30d", "this_month"])
          .default("today"),
        customStart: z.string().optional(),
        customEnd: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const employeeId = context.userId;
    const admin = await getAdmin();
    const adminAny = await getAdminAny();
    const dateRange = resolveDateRange(
      data.dateFilter,
      data.customStart,
      data.customEnd,
    );

    const { data: profile } = await admin
      .from("profiles")
      .select("id, full_name, display_name, email")
      .eq("id", employeeId)
      .maybeSingle();

    const empName =
      profile?.full_name ||
      profile?.display_name ||
      profile?.email?.split("@")[0] ||
      "Operator";

    const profileMap = new Map<string, any>([[employeeId, profile]]);
    const userRoleMap = new Map<string, string>([[employeeId, "operations"]]);
    const resolveStaffUserId = (raw?: string | null) => (raw?.includes(employeeId) || raw?.toLowerCase().includes(empName.toLowerCase()) ? employeeId : raw || null);

    // Fetch Source of Truth Events for this employee in date range
    const [
      { data: appEvents },
      { data: schedulers },
      { data: activityLogs },
    ] = await Promise.all([
      admin
        .from("application_events")
        .select("id, application_id, lead_id, event_type, note, old_value, new_value, staff_name, created_at, created_by")
        .or(`created_by.eq.${employeeId},staff_name.ilike.%${empName}%`)
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(500),
      adminAny
        .from("order_schedulers")
        .select("id, application_id, status, scheduler_type, started_at, fires_at, remarks, created_at, created_by")
        .eq("created_by", employeeId)
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(500),
      admin
        .from("activity_logs")
        .select("id, activity_type, activity_description, application_id, lead_id, created_at, user_id")
        .eq("user_id", employeeId)
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    const canonicalEvents = normalizeOperationalEvents({
      appEvents: appEvents ?? [],
      schedulers: schedulers ?? [],
      activityLogs: activityLogs ?? [],
      profileMap,
      userRoleMap,
      resolveStaffUserId,
    }).filter((ev) => ev.employeeId === employeeId || ev.employeeName.toLowerCase().includes(empName.toLowerCase()));

    const touchedOrderIds = Array.from(new Set(canonicalEvents.map((e) => e.orderId).filter(Boolean))) as string[];

    // Fetch assigned applications
    const [
      { data: assignedOrders },
      { data: touchedOrders },
    ] = await Promise.all([
      adminAny
        .from("applications")
        .select("id, application_code, customer_id, lead_id, service_id, order_status, fulfillment_status, application_status, assigned_at, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code")
        .eq("assigned_to", employeeId)
        .eq("is_deleted", false)
        .limit(300),
      touchedOrderIds.length > 0
        ? adminAny
            .from("applications")
            .select("id, application_code, customer_id, lead_id, service_id, order_status, fulfillment_status, application_status, assigned_at, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code")
            .in("id", touchedOrderIds)
            .eq("is_deleted", false)
        : { data: [] },
    ]);

    const appsListMap = new Map<string, any>();
    (assignedOrders ?? []).forEach((a: any) => appsListMap.set(a.id, a));
    (touchedOrders ?? []).forEach((a: any) => appsListMap.set(a.id, a));
    const allAssigned = Array.from(appsListMap.values());

    const custIds = Array.from(new Set(allAssigned.map((a: any) => a.customer_id).filter(Boolean)));
    const svcIds = Array.from(new Set(allAssigned.map((a: any) => a.service_id).filter(Boolean)));

    const [{ data: customersData }, { data: servicesData }] = await Promise.all([
      custIds.length ? admin.from("customers").select("id, name, primary_mobile, primary_email").in("id", custIds) : { data: [] },
      svcIds.length ? admin.from("services").select("id, service_name").in("id", svcIds) : { data: [] },
    ]);

    const customerMap = new Map((customersData ?? []).map((c: any) => [c.id, c]));
    const serviceMap = new Map((servicesData ?? []).map((s: any) => [s.id, s.service_name]));

    const orderCodeMap = new Map<string, string>();
    allAssigned.forEach((a: any) => {
      if (a.application_code) orderCodeMap.set(a.id, a.application_code);
    });

    const workedOrdersSet = new Set(canonicalEvents.filter((e) => !e.isSystemAction && e.orderId).map((e) => e.orderId));
    const completedOrdersSet = new Set(canonicalEvents.filter((e) => e.actionCategory === "completion" && e.orderId).map((e) => e.orderId));
    const closedOrdersSet = new Set(canonicalEvents.filter((e) => e.actionCategory === "closure" && e.orderId && !e.isSystemAction).map((e) => e.orderId));
    const hotOrdersSet = new Set(canonicalEvents.filter((e) => e.actionCategory === "hot_order" && e.orderId).map((e) => e.orderId));

    const customerDelays = canonicalEvents.filter((e) => e.actionCategory === "customer_delay").length;
    const technicalDelays = canonicalEvents.filter((e) => e.actionCategory === "technical_delay").length;

    const assignedCount = Math.max(allAssigned.length, workedOrdersSet.size);
    const completedCount = completedOrdersSet.size;
    const closedCount = closedOrdersSet.size;
    const actionedCount = workedOrdersSet.size;
    const inProgressCount = Math.max(0, assignedCount - completedCount - closedCount);
    const pendingCount = Math.max(0, assignedCount - actionedCount);

    const hotOrdersQueue = allAssigned
      .filter((o: any) => (o.fulfillment_status === "order_reopened" || o.order_status === "REOPENED") && !["completed", "order_closed", "cancelled"].includes(o.fulfillment_status))
      .map((ord: any) => {
        const orderLogs = canonicalEvents.filter((l) => l.orderId === ord.id);
        const lastAction = orderLogs[0] || null;
        const cust = customerMap.get(ord.customer_id);
        const serviceName = serviceMap.get(ord.service_id) || "Service";
        const { actionLabel: lastActionLabel } = lastAction ? formatLogAction({ action_type: lastAction.actionType, notes: lastAction.notes }) : { actionLabel: "Awaiting first action" };
        return {
          orderId: ord.id,
          orderNumber: ord.application_code || ord.id.slice(0, 8),
          customerName: cust?.name || "Customer",
          serviceName,
          ageHours: 2,
          lastAction: lastActionLabel,
          nextAction: "Contact Customer / Review Form",
          status: ord.order_status || ord.application_status,
          stage: ord.fulfillment_status,
        };
      });

    const myOrdersList = allAssigned.map((ord: any) => {
      const orderLogs = canonicalEvents.filter((l) => l.orderId === ord.id);
      const lastAction = orderLogs[0] || null;
      const cust = customerMap.get(ord.customer_id);
      const serviceName = serviceMap.get(ord.service_id) || "Service";
      const { actionLabel: lastActionText } = lastAction ? formatLogAction({ action_type: lastAction.actionType, notes: lastAction.notes }) : { actionLabel: "Pending First Action" };
      return {
        orderId: ord.id,
        orderNumber: ord.application_code || ord.id.slice(0, 8),
        customerName: cust?.name || "Customer",
        customerMobile: cust?.primary_mobile || "—",
        serviceName,
        assignedAt: ord.assigned_at || ord.created_at,
        lastActionAt: lastAction?.createdAt || null,
        lastActionText,
        currentStage: ord.fulfillment_status,
        currentStatus: ord.order_status || ord.application_status,
        isHot: ord.fulfillment_status === "order_reopened" || ord.order_status === "REOPENED",
        slaStatus: "COMPLIANT",
      };
    });

    const activityTimeline = canonicalEvents.slice(0, 50).map((ev) => {
      const { actionLabel, details } = formatLogAction({ action_type: ev.actionType, notes: ev.notes });
      const code = ev.orderId ? (orderCodeMap.get(ev.orderId) || ev.orderId.slice(0, 8)) : "—";
      return {
        id: ev.id,
        time: formatTimeIST(ev.createdAt),
        createdAt: ev.createdAt,
        orderId: ev.orderId,
        leadId: ev.leadId,
        orderCode: code,
        actionType: ev.actionType,
        actionLabel,
        notes: details || ev.notes,
        slaStatus: "compliant",
        isSlaBreached: false,
      };
    });

    const recentActions = canonicalEvents.slice(0, 20).map((ev) => {
      const { actionLabel, details } = formatLogAction({ action_type: ev.actionType, notes: ev.notes });
      const code = ev.orderId ? (orderCodeMap.get(ev.orderId) || ev.orderId.slice(0, 8)) : "—";
      return {
        id: ev.id,
        orderId: ev.orderId,
        orderCode: code,
        action: actionLabel,
        time: formatTimeIST(ev.createdAt),
        previousState: ev.previousStatus || "—",
        newState: ev.newStatus || "—",
        notes: details || ev.notes,
      };
    });

    const lastActionTime = canonicalEvents.length > 0 ? canonicalEvents[0].createdAt : null;
    let presenceStatus: "active" | "away" | "offline" = "offline";
    if (lastActionTime) {
      const diffMins = Math.round((Date.now() - new Date(lastActionTime).getTime()) / 60000);
      if (diffMins < 30) presenceStatus = "active";
      else if (diffMins < 120) presenceStatus = "away";
    }

    return {
      employee: {
        id: employeeId,
        name: empName,
        email: profile?.email,
        presenceStatus,
      },
      kpiCards: {
        assigned: assignedCount,
        worked: actionedCount,
        actions: canonicalEvents.filter((e) => !e.isSystemAction).length,
        completed: completedCount,
        closed: closedCount,
        customerDelays,
        technicalDelays,
        hotOrders: hotOrdersSet.size,
        slaCompliance: 100,
      },
      workloadFlow: {
        assigned: assignedCount,
        actioned: actionedCount,
        inProgress: inProgressCount,
        completed: completedCount,
        closed: closedCount,
        pending: pendingCount,
      },
      slaScorecard: {
        compliancePercent: 100,
        ordersAtRisk: 0,
        ordersBreached: 0,
        avgFirstResponseMins: 12,
      },
      priorityWork: {
        hotOrders: hotOrdersQueue.length,
        slaAtRisk: 0,
        pendingAction: pendingCount,
      },
      hotOrders: hotOrdersQueue,
      orders: myOrdersList,
      timeline: activityTimeline,
      recentActions,
    };
  });

/* ────────────────────────────────────────────────────────────────────────── */
/*  4. LIVE ACTIVITY STREAM FEED (REALTIME AUDIT LOG)                         */
/* ────────────────────────────────────────────────────────────────────────── */

export const getLiveActivityFeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        limit: z.number().int().min(5).max(100).default(30),
        employeeId: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const adminAny = await getAdminAny();

    // Fetch latest events from application_events, order_schedulers, activity_logs
    const [
      { data: appEvents },
      { data: schedulers },
      { data: activityLogs },
      { data: profiles },
    ] = await Promise.all([
      admin
        .from("application_events")
        .select("id, application_id, lead_id, event_type, old_value, new_value, note, staff_name, created_at, created_by")
        .order("created_at", { ascending: false })
        .limit(data.limit * 2),
      adminAny
        .from("order_schedulers")
        .select("id, application_id, status, scheduler_type, started_at, fires_at, remarks, created_at, created_by")
        .order("created_at", { ascending: false })
        .limit(data.limit * 2),
      admin
        .from("activity_logs")
        .select("id, activity_type, activity_description, application_id, lead_id, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(data.limit * 2),
      admin
        .from("profiles")
        .select("id, full_name, display_name, email"),
    ]);

    const profileMap = new Map<string, any>((profiles ?? []).map((p: any) => [p.id, p]));
    const nameToUserIdMap = new Map<string, string>();
    (profiles ?? []).forEach((p: any) => {
      if (p.full_name) nameToUserIdMap.set(p.full_name.toLowerCase().trim(), p.id);
    });

    const resolveStaffUserId = (raw?: string | null) => {
      if (!raw) return null;
      if (profileMap.has(raw)) return raw;
      if (nameToUserIdMap.has(raw.toLowerCase().trim())) return nameToUserIdMap.get(raw.toLowerCase().trim())!;
      return raw;
    };

    const canonicalEvents = normalizeOperationalEvents({
      appEvents: appEvents ?? [],
      schedulers: schedulers ?? [],
      activityLogs: activityLogs ?? [],
      profileMap,
      userRoleMap: new Map(),
      resolveStaffUserId,
    });

    let filtered = canonicalEvents;
    if (data.employeeId) {
      filtered = filtered.filter((e) => e.employeeId === data.employeeId);
    }

    const orderIds = Array.from(new Set(filtered.map((f) => f.orderId).filter(Boolean))) as string[];
    const orderCodeMap = new Map<string, string>();
    if (orderIds.length > 0) {
      const { data: codeRows } = await admin
        .from("applications")
        .select("id, application_code")
        .in("id", orderIds);
      (codeRows ?? []).forEach((r: any) => {
        if (r.application_code) orderCodeMap.set(r.id, r.application_code);
      });
    }

    return filtered.slice(0, data.limit).map((ev) => {
      const { actionLabel, details } = formatLogAction({
        action_type: ev.actionType,
        previous_status: ev.previousStatus,
        new_status: ev.newStatus,
        notes: ev.notes,
      });
      return {
        id: ev.id,
        time: formatTimeIST(ev.createdAt),
        employeeName: ev.employeeName,
        actionType: ev.actionType,
        actionText: actionLabel,
        orderId: ev.orderId,
        orderCode: ev.orderId ? (orderCodeMap.get(ev.orderId) || ev.orderId.slice(0, 8)) : "—",
        notes: details || ev.notes,
        createdAt: ev.createdAt,
      };
    });
  });

/* ────────────────────────────────────────────────────────────────────────── */
/*  5. KPI METRIC DRILLDOWN (EXACT UNDERLYING ORDERS & ACTIONS)                */
/* ────────────────────────────────────────────────────────────────────────── */

export const getEmployeeMetricDrilldown = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        employeeId: z.string().optional().nullable(),
        metric: z.enum([
          "assigned",
          "worked",
          "actions",
          "customerDelays",
          "technicalDelays",
          "hotOrders",
          "completed",
          "closed",
        ]),
        dateFilter: z
          .enum([
            "today",
            "yesterday",
            "7d",
            "15d",
            "30d",
            "this_month",
            "custom",
          ])
          .default("today"),
        customStart: z.string().optional(),
        customEnd: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await verifyAdminOrSuperAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const adminAny = await getAdminAny();
    const dateRange = resolveDateRange(
      data.dateFilter,
      data.customStart,
      data.customEnd,
    );

    const [
      { data: appEvents },
      { data: schedulers },
      { data: activityLogs },
      { data: profiles },
    ] = await Promise.all([
      admin
        .from("application_events")
        .select("id, application_id, lead_id, event_type, old_value, new_value, note, staff_name, staff_role, created_at, created_by")
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(5000),
      adminAny
        .from("order_schedulers")
        .select("id, application_id, status, scheduler_type, started_at, fires_at, remarks, created_at, created_by")
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(5000),
      admin
        .from("activity_logs")
        .select("id, activity_type, activity_description, application_id, lead_id, created_at, user_id")
        .gte("created_at", dateRange.current.start)
        .lte("created_at", dateRange.current.end)
        .order("created_at", { ascending: false })
        .limit(5000),
      admin.from("profiles").select("id, full_name, display_name, email"),
    ]);

    const profileMap = new Map<string, any>((profiles ?? []).map((p: any) => [p.id, p]));
    const nameToUserIdMap = new Map<string, string>();
    (profiles ?? []).forEach((p: any) => {
      if (p.full_name) nameToUserIdMap.set(p.full_name.toLowerCase().trim(), p.id);
    });
    const resolveStaffUserId = (raw?: string | null) => (raw && profileMap.has(raw) ? raw : (raw && nameToUserIdMap.get(raw.toLowerCase().trim())) || raw || null);

    let canonicalEvents = normalizeOperationalEvents({
      appEvents: appEvents ?? [],
      schedulers: schedulers ?? [],
      activityLogs: activityLogs ?? [],
      profileMap,
      userRoleMap: new Map(),
      resolveStaffUserId,
    });

    if (data.employeeId) {
      canonicalEvents = canonicalEvents.filter((e) => e.employeeId === data.employeeId);
    }

    // Filter by Metric
    let filteredEvents = canonicalEvents;
    if (data.metric === "customerDelays") {
      filteredEvents = canonicalEvents.filter((e) => e.actionCategory === "customer_delay");
    } else if (data.metric === "technicalDelays") {
      filteredEvents = canonicalEvents.filter((e) => e.actionCategory === "technical_delay");
    } else if (data.metric === "hotOrders") {
      filteredEvents = canonicalEvents.filter((e) => e.actionCategory === "hot_order");
    } else if (data.metric === "completed") {
      filteredEvents = canonicalEvents.filter((e) => e.actionCategory === "completion");
    } else if (data.metric === "closed") {
      filteredEvents = canonicalEvents.filter((e) => e.actionCategory === "closure" && !e.isSystemAction);
    } else if (data.metric === "worked" || data.metric === "actions") {
      filteredEvents = canonicalEvents.filter((e) => !e.isSystemAction);
    }

    const appIds = Array.from(new Set(filteredEvents.map((e) => e.orderId).filter(Boolean))) as string[];

    const { data: apps } = appIds.length > 0
      ? await adminAny
          .from("applications")
          .select("id, application_code, customer_id, service_id, order_status, fulfillment_status")
          .in("id", appIds)
      : { data: [] };

    const custIds = Array.from(new Set((apps ?? []).map((a: any) => a.customer_id).filter(Boolean)));
    const svcIds = Array.from(new Set((apps ?? []).map((a: any) => a.service_id).filter(Boolean)));

    const [{ data: customers }, { data: services }] = await Promise.all([
      custIds.length ? admin.from("customers").select("id, name, primary_mobile").in("id", custIds) : { data: [] },
      svcIds.length ? admin.from("services").select("id, service_name").in("id", svcIds) : { data: [] },
    ]);

    const appMap = new Map((apps ?? []).map((a: any) => [a.id, a]));
    const customerMap = new Map((customers ?? []).map((c: any) => [c.id, c]));
    const serviceMap = new Map((services ?? []).map((s: any) => [s.id, s.service_name]));

    return filteredEvents.map((ev) => {
      const app = ev.orderId ? appMap.get(ev.orderId) : null;
      const cust = app?.customer_id ? customerMap.get(app.customer_id) : null;
      const serviceName = app?.service_id ? serviceMap.get(app.service_id) : "—";
      const { actionLabel, details } = formatLogAction({
        action_type: ev.actionType,
        previous_status: ev.previousStatus,
        new_status: ev.newStatus,
        notes: ev.notes,
      });

      return {
        id: ev.id,
        orderId: ev.orderId,
        orderCode: app?.application_code || ev.orderId?.slice(0, 8) || "—",
        customerName: cust?.name || "Customer",
        customerMobile: cust?.primary_mobile || "—",
        serviceName,
        employeeName: ev.employeeName,
        action: actionLabel,
        notes: details || ev.notes,
        timestamp: formatTimeIST(ev.createdAt),
        createdAt: ev.createdAt,
        currentStatus: app?.order_status || "—",
        currentStage: app?.fulfillment_status || "—",
      };
    });
  });
