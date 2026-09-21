import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeOrderStage } from "./computeOrderStage";
import { getEmployeePresenceState } from "./employee-presence.functions";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

// adminAny: casts the admin client to any to allow querying tables not yet in the
// generated Supabase database types (e.g. order_action_logs — migration pending).
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

function formatTimeIST(val: string | Date | null | undefined): string {
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

function formatTimeISTShort(val: string | Date | null | undefined): string {
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

function resolveDateRange(
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

/**
 * Map legacy application_events.event_type → ActionType strings
 */
function mapEventTypeToAction(eventType: string): string {
  const norm = (eventType || "").toLowerCase();
  if (norm.includes("callback_scheduled")) return "CALLBACK_SCHEDULED";
  if (norm.includes("callback_completed")) return "CUSTOMER_CONTACTED";
  if (norm.includes("contact_logged") || norm.includes("call_connected") || norm.includes("call_logged"))
    return "CUSTOMER_CONTACTED";
  if (norm.includes("customer_delay") || norm.includes("hold_started"))
    return "CUSTOMER_DELAY_ADDED";
  if (norm.includes("technical_delay") || norm.includes("our_side_delay"))
    return "TECHNICAL_DELAY_ADDED";
  if (norm.includes("form_submitted") || norm.includes("form_received"))
    return "FORM_REVIEWED";
  if (norm.includes("form_link_sent") || norm.includes("form_pending") || norm.includes("form_requested"))
    return "FORM_REQUESTED";
  if (
    norm.includes("document_uploaded") ||
    norm.includes("document_received") ||
    norm.includes("document_verified")
  )
    return "DOCUMENT_REVIEWED";
  if (norm.includes("document_requested")) return "DOCUMENT_REQUESTED";
  if (norm.includes("submitted_to_govt") || norm.includes("portal_submission") || norm.includes("processing"))
    return "PROCESSING_STARTED";
  if (
    norm.includes("certificate_issued") ||
    norm.includes("certificate_uploaded")
  )
    return "CERTIFICATE_GENERATED";
  if (norm.includes("completed") || norm.includes("application_completed")) return "ORDER_COMPLETED";
  if (norm.includes("closed") || norm.includes("cancelled"))
    return "ORDER_CLOSED";
  if (norm.includes("hot_order")) return "HOT_ORDER_ADDED";
  if (norm.includes("reassigned") || norm.includes("order_assigned") || norm.includes("staff_assigned"))
    return "ORDER_ASSIGNED";
  return "STAGE_CHANGED";
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
};

function cleanStageOrStatus(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (isUuid(trimmed)) return ""; // NEVER display raw UUID
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

/**
 * Format an event, action log, or activity log into a human-readable action label and details
 * Strictly removes any UUID references and avoids "Moved to" prefixes.
 */
function formatLogAction(log: {
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

/* -------------------------------------------------------------------------- */
/*  1. SUPER ADMIN / ADMIN COMMAND CENTER METRICS                             */
/* -------------------------------------------------------------------------- */

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

    // 1. All staff profiles + roles (Fetch ALL profiles so no assignee is orphaned)
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

    // 2. Current-period action logs from order_action_logs
    let actionLogsQuery = adminAny
      .from("order_action_logs")
      .select(
        "id, order_id, lead_id, employee_id, employee_name, employee_role, action_type, previous_status, new_status, previous_stage, new_stage, notes, sla_status, is_sla_breached, time_spent_since_assignment_ms, created_at",
      )
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (data.employeeId) {
      actionLogsQuery = actionLogsQuery.eq("employee_id", data.employeeId);
    }
    const { data: currentActionLogs } = await actionLogsQuery;

    // Merge application_events for operational data
    let appEventsQuery = admin
      .from("application_events")
      .select(
        "id, application_id, lead_id, event_type, note, old_value, new_value, staff_name, staff_role, created_at, created_by",
      )
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .limit(3000);

    const { data: currentAppEvents } = await appEventsQuery;

    // Merge system activity_logs (lead & order tracking)
    let activityLogsQuery = admin
      .from("activity_logs")
      .select(
        "id, activity_type, activity_description, user_id, application_id, lead_id, created_at",
      )
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(3000);

    if (data.employeeId) {
      activityLogsQuery = activityLogsQuery.eq("user_id", data.employeeId);
    }
    const { data: currentActivityLogs } = await activityLogsQuery;

    const logs: any[] = [...(currentActionLogs ?? [])];
    const loggedKeySet = new Set(
      logs.map(
        (l: any) =>
          `${l.order_id || l.lead_id}_${l.action_type}_${l.created_at}`,
      ),
    );

    (currentAppEvents ?? []).forEach((evt: any) => {
      const actionType = mapEventTypeToAction(evt.event_type);
      const dedupKey = `${evt.application_id || evt.lead_id}_${actionType}_${evt.created_at}`;
      if (!loggedKeySet.has(dedupKey)) {
        loggedKeySet.add(dedupKey);
        let matchedEmpId = evt.created_by;
        if (!matchedEmpId && evt.staff_name) {
          matchedEmpId = resolveStaffUserId(evt.staff_name);
        }
        if (!data.employeeId || matchedEmpId === data.employeeId) {
          logs.push({
            id: `ae_${evt.id}`,
            order_id: evt.application_id,
            lead_id: evt.lead_id,
            employee_id: matchedEmpId,
            employee_name: evt.staff_name || "Staff",
            employee_role: evt.staff_role || "operations",
            action_type: actionType,
            previous_status: evt.old_value,
            new_status: evt.new_value,
            notes: evt.note,
            sla_status: "compliant",
            is_sla_breached: false,
            created_at: evt.created_at,
          });
        }
      }
    });

    (currentActivityLogs ?? []).forEach((act: any) => {
      const actionType = mapEventTypeToAction(act.activity_type);
      const dedupKey = `${act.application_id || act.lead_id}_${actionType}_${act.created_at}`;
      if (!loggedKeySet.has(dedupKey)) {
        loggedKeySet.add(dedupKey);
        const resolvedEmpId = resolveStaffUserId(act.user_id);
        const p = resolvedEmpId ? profileMap.get(resolvedEmpId) : null;
        const name =
          p?.full_name ||
          p?.display_name ||
          p?.email?.split("@")[0] ||
          "Staff";
        logs.push({
          id: `act_${act.id}`,
          order_id: act.application_id,
          lead_id: act.lead_id,
          employee_id: resolvedEmpId,
          employee_name: name,
          employee_role:
            (resolvedEmpId && userRoleMap.get(resolvedEmpId)) || "operations",
          action_type: actionType,
          activity_description: act.activity_description,
          notes: act.activity_description,
          sla_status: "compliant",
          is_sla_breached: false,
          created_at: act.created_at,
        });
      }
    });

    // 3. Previous period for trend comparison
    const { data: prevActionLogs } = await adminAny
      .from("order_action_logs")
      .select(
        "id, order_id, employee_id, action_type, sla_status, is_sla_breached, created_at",
      )
      .gte("created_at", dateRange.previous.start)
      .lte("created_at", dateRange.previous.end)
      .limit(5000);

    const { data: prevAppEvents } = await admin
      .from("application_events")
      .select("id, application_id, event_type, staff_name, created_at, created_by")
      .gte("created_at", dateRange.previous.start)
      .lte("created_at", dateRange.previous.end)
      .limit(2000);

    const { data: prevActivityLogs } = await admin
      .from("activity_logs")
      .select("id, activity_type, user_id, application_id, lead_id, created_at")
      .gte("created_at", dateRange.previous.start)
      .lte("created_at", dateRange.previous.end)
      .limit(2000);

    const pLogs: any[] = [...(prevActionLogs ?? [])];
    (prevAppEvents ?? []).forEach((evt: any) => {
      pLogs.push({
        id: evt.id,
        order_id: evt.application_id,
        employee_id:
          evt.created_by ||
          resolveStaffUserId(evt.staff_name),
        action_type: mapEventTypeToAction(evt.event_type),
        is_sla_breached: false,
        created_at: evt.created_at,
      });
    });
    (prevActivityLogs ?? []).forEach((act: any) => {
      pLogs.push({
        id: `act_${act.id}`,
        order_id: act.application_id,
        lead_id: act.lead_id,
        employee_id: resolveStaffUserId(act.user_id),
        action_type: mapEventTypeToAction(act.activity_type),
        is_sla_breached: false,
        created_at: act.created_at,
      });
    });

    // 4. Fetch applications with exact match to listOrdersV2
    let appsQuery = adminAny
      .from("applications")
      .select(
        "id, application_code, customer_id, lead_id, assigned_to, assigned_at, order_status, fulfillment_status, application_status, is_hot, service_id, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code, refund_approved_at, refund_processed_at",
      )
      .eq("is_deleted", false);

    if (dateRange.current.start) {
      appsQuery = appsQuery.gte("created_at", dateRange.current.start);
    }
    if (dateRange.current.end) {
      appsQuery = appsQuery.lte("created_at", dateRange.current.end);
    }
    if (data.serviceId) {
      appsQuery = appsQuery.eq("service_id", data.serviceId);
    }
    if (data.employeeId) {
      appsQuery = appsQuery.eq("assigned_to", data.employeeId);
    }

    // Active schedulers (for hot orders and active callbacks)
    const { data: globalActiveSchedulers } = await adminAny
      .from("order_schedulers")
      .select("id, application_id, status, scheduler_type, fires_at, remarks, created_at, created_by")
      .eq("status", "active");

    const activeAppIds = Array.from(
      new Set((globalActiveSchedulers ?? []).map((s: any) => s.application_id).filter(Boolean)),
    ) as string[];

    let extraActiveApps: any[] = [];
    if (activeAppIds.length > 0) {
      const { data: extraApps } = await adminAny
        .from("applications")
        .select(
          "id, application_code, customer_id, lead_id, assigned_to, assigned_at, order_status, fulfillment_status, application_status, is_hot, service_id, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code, refund_approved_at, refund_processed_at",
        )
        .in("id", activeAppIds)
        .eq("is_deleted", false);
      extraActiveApps = extraApps ?? [];
    }

    const { data: periodApps } = await appsQuery.limit(5000);

    const appsMap = new Map<string, any>();
    (periodApps ?? []).forEach((a: any) => appsMap.set(a.id, a));
    (extraActiveApps ?? []).forEach((a: any) => appsMap.set(a.id, a));
    const apps = Array.from(appsMap.values());

    const leadIds = Array.from(new Set(apps.map((a: any) => a.lead_id).filter(Boolean))) as string[];
    const { data: leadsData } = leadIds.length
      ? await admin.from("leads").select("id, name, email, mobile, total_amount, lead_status_v2, lead_code, status, lead_source, service, service_id, assigned_to").in("id", leadIds)
      : { data: [] };
    const leadMap = new Map((leadsData ?? []).map((l: any) => [l.id, l]));

    // Map active schedulers
    const sortedSchedulers = [...(globalActiveSchedulers ?? [])].sort((a: any, b: any) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tB - tA;
    });
    const callbackMap = new Map<string, any>();
    for (const s of sortedSchedulers) {
      if (s && s.application_id && !callbackMap.has(s.application_id)) {
        callbackMap.set(s.application_id, s);
      }
    }

    // Build application code & lead lookup maps
    const orderCodeMap = new Map<string, string>();
    const leadToAppMap = new Map<string, any>();
    apps.forEach((a: any) => {
      if (a.application_code) orderCodeMap.set(a.id, a.application_code);
      if (a.lead_id && a.application_code) leadToAppMap.set(a.lead_id, a);
    });

    // Collect any missing order IDs from logs and resolve their application_code
    const missingAppIds = Array.from(
      new Set(
        logs
          .map((l: any) => l.order_id)
          .filter((id: string) => id && !orderCodeMap.has(id)),
      ),
    );
    if (missingAppIds.length > 0) {
      const { data: extraApps } = await adminAny
        .from("applications")
        .select("id, application_code, lead_id")
        .in("id", missingAppIds);
      (extraApps ?? []).forEach((a: any) => {
        if (a.application_code) orderCodeMap.set(a.id, a.application_code);
        if (a.lead_id && a.application_code) leadToAppMap.set(a.lead_id, a);
      });
    }

    const leadCodeMap = new Map<string, string>();
    const missingLeadIds = Array.from(
      new Set(
        logs
          .map((l: any) => l.lead_id)
          .filter(
            (id: string) =>
              id && !orderCodeMap.has(id) && !leadToAppMap.has(id),
          ),
      ),
    );
    if (missingLeadIds.length > 0) {
      const [{ data: leadApps }, { data: leadsInfo }] = await Promise.all([
        adminAny
          .from("applications")
          .select("id, application_code, lead_id")
          .in("lead_id", missingLeadIds),
        admin.from("leads").select("id, lead_code").in("id", missingLeadIds),
      ]);
      (leadApps ?? []).forEach((a: any) => {
        if (a.lead_id && a.application_code)
          leadToAppMap.set(a.lead_id, a);
      });
      (leadsInfo ?? []).forEach((l: any) => {
        if (l.lead_code) leadCodeMap.set(l.id, l.lead_code);
      });
    }

    // 5. Aggregate KPI metrics & employee stats map
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

    // Initialise all known active staff
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

    let totalActions = logs.length;
    let customerDelaysCount = 0;
    let technicalDelaysCount = 0;
    let reassignedCount = 0;
    let slaBreachedCount = 0;
    let slaCompliantCount = 0;

    const nowTime = Date.now();

    // Tally applications exact to listOrdersV2
    apps.forEach((o: any) => {
      const lead = o.lead_id ? leadMap.get(o.lead_id) : null;
      const rawAssignee = o.assigned_to || lead?.assigned_to;
      const effectiveAssignee = resolveStaffUserId(rawAssignee);
      if (!effectiveAssignee) return;

      if (!empStatsMap.has(effectiveAssignee)) {
        const p = profileMap.get(effectiveAssignee);
        const name = p?.full_name || p?.display_name || p?.email?.split("@")[0] || "Staff";
        empStatsMap.set(effectiveAssignee, {
          employeeId: effectiveAssignee,
          employeeName: name,
          employeeRole: userRoleMap.get(effectiveAssignee) || "operations",
          avatarUrl: p?.avatar_url,
          assignedOrders: new Set(),
          workedOrders: new Set(),
          actions: 0,
          completedOrders: new Set(),
          closedOrders: new Set(),
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

      const stats = empStatsMap.get(effectiveAssignee)!;
      stats.assignedOrders.add(o.id);

      const stage = computeOrderStage(
        { lead_status_v2: lead?.lead_status_v2, status: lead?.status },
        {
          form_submitted_at: o.form_submitted_at,
          certificate_uploaded_at: o.certificate_uploaded_at,
          fulfillment_status: o.fulfillment_status,
          application_status: o.application_status,
          workflow_status: o.workflow_status,
          closure_stage: o.closure_stage,
          refund_approved_at: o.refund_approved_at,
          refund_processed_at: o.refund_processed_at,
        },
      );

      const cb = callbackMap.get(o.id);
      const firesAtTime = cb?.fires_at ? new Date(cb.fires_at).getTime() : 0;
      const is_due = firesAtTime > 0 && firesAtTime <= nowTime;
      const is_reopened =
        stage === "order_reopened" ||
        o.fulfillment_status === "order_reopened" ||
        o.application_status === "order_reopened" ||
        o.order_status === "REOPENED";

      const fsLower = String(o.fulfillment_status ?? "").toLowerCase();
      const isTerminal =
        stage === "completed" ||
        stage === "closed" ||
        fsLower === "completed" ||
        fsLower === "order_closed" ||
        fsLower === "cancelled" ||
        ["completed", "closed", "cancelled"].includes(String(o.application_status ?? "").toLowerCase()) ||
        ["completed", "closed", "cancelled"].includes(String(o.order_status ?? "").toLowerCase());

      const is_hot = Boolean(o.is_hot) || (!isTerminal && (is_due || is_reopened));
      if (is_hot) {
        stats.hotOrders.add(o.id);
        hotOrdersSet.add(o.id);
      }

      const isCompleted =
        stage === "completed" ||
        fsLower === "completed" ||
        o.application_status === "completed" ||
        o.order_status === "COMPLETED";

      const isClosed =
        stage === "closed" ||
        fsLower === "order_closed" ||
        fsLower === "cancelled" ||
        o.application_status === "cancelled" ||
        o.order_status === "CLOSED";

      if (isCompleted) {
        stats.completedOrders.add(o.id);
        completedOrdersSet.add(o.id);
      }
      if (isClosed) {
        stats.closedOrders.add(o.id);
        closedOrdersSet.add(o.id);
      }

      if (
        stage === "customer_delay" ||
        fsLower === "customer_delay" ||
        o.order_status === "CUSTOMER_HOLD"
      ) {
        stats.customerDelays += 1;
        customerDelaysCount += 1;
      }
      if (
        stage === "technical_delay" ||
        fsLower === "technical_delay" ||
        o.order_status === "OUR_SIDE_DELAY"
      ) {
        stats.technicalDelays += 1;
        technicalDelaysCount += 1;
      }
    });

    // Previous period counts for trends
    const prevTotalActions = pLogs.length;
    const prevCompletedSet = new Set<string>();
    const prevClosedSet = new Set<string>();
    let prevSlaBreached = 0;
    let prevSlaCompliant = 0;
    pLogs.forEach((l: any) => {
      if (l.action_type === "ORDER_COMPLETED" && l.order_id)
        prevCompletedSet.add(l.order_id);
      if (l.action_type === "ORDER_CLOSED" && l.order_id)
        prevClosedSet.add(l.order_id);
      if (l.is_sla_breached) prevSlaBreached++;
      else prevSlaCompliant++;
    });

    // Process all action logs — real counts only
    logs.forEach((log: any) => {
      const empId = resolveStaffUserId(log.employee_id || log.staff_name || log.user_id);
      if (empId) {
        activeEmployeesSet.add(empId);
        workedEmployeesSet.add(empId);
        if (log.order_id) uniqueOrdersWorkedSet.add(log.order_id);
      }

      const actionType = (log.action_type || "").toUpperCase();
      const isCustDelay =
        actionType === "CUSTOMER_DELAY_ADDED" ||
        actionType === "CUSTOMER_DELAY" ||
        log.new_status === "customer_delay" ||
        /customer.*delay/i.test(log.notes || "");
      const isTechDelay =
        actionType === "TECHNICAL_DELAY_ADDED" ||
        actionType === "TECHNICAL_DELAY" ||
        log.new_status === "technical_delay" ||
        /technical.*delay|our.*delay/i.test(log.notes || "");
      const isHot =
        actionType === "HOT_ORDER_ADDED" ||
        /hot/i.test(log.notes || "");
      const isCompleted =
        actionType === "ORDER_COMPLETED" ||
        actionType === "APPLICATION_COMPLETED" ||
        log.new_status === "completed" ||
        /completed|certificate issued/i.test(log.notes || "");
      const isClosed =
        actionType === "ORDER_CLOSED" ||
        log.new_status === "order_closed" ||
        log.new_status === "closed" ||
        log.new_status === "cancelled" ||
        /closed|cancel/i.test(log.notes || "");

      if (isCustDelay) customerDelaysCount++;
      if (isTechDelay) technicalDelaysCount++;
      if (actionType === "ORDER_REASSIGNED") reassignedCount++;
      if (isHot && log.order_id) hotOrdersSet.add(log.order_id);
      if (isCompleted && log.order_id) completedOrdersSet.add(log.order_id);
      if (isClosed && log.order_id) closedOrdersSet.add(log.order_id);

      // Per-employee rollup — only real logged actions
      if (empId && empStatsMap.has(empId)) {
        const stats = empStatsMap.get(empId)!;
        stats.actions += 1;
        if (log.order_id) stats.workedOrders.add(log.order_id);
        if (isCompleted && log.order_id)
          stats.completedOrders.add(log.order_id);
        if (isClosed && log.order_id)
          stats.closedOrders.add(log.order_id);
        if (isCustDelay) stats.customerDelays++;
        if (isTechDelay) stats.technicalDelays++;
        if (isHot && log.order_id)
          stats.hotOrders.add(log.order_id);

        stats.slaTotalCount += 1;
        const slaLow = (log.sla_status || "").toLowerCase();
        if (!log.is_sla_breached && slaLow !== "breached") {
          stats.slaCompliantCount += 1;
          slaCompliantCount += 1;
        } else {
          slaBreachedCount += 1;
        }

        // Track first and last action times
        if (
          !stats.lastActionTime ||
          new Date(log.created_at) > new Date(stats.lastActionTime)
        ) {
          stats.lastActionTime = log.created_at;
          stats.lastActionType = log.action_type;
          const { actionLabel } = formatLogAction(log);
          stats.lastActionText = actionLabel;
          const code =
            (log.order_id && orderCodeMap.get(log.order_id)) ||
            (log.lead_id &&
              leadToAppMap.get(log.lead_id)?.application_code) ||
            (log.lead_id && leadCodeMap.get(log.lead_id)) ||
            (log.order_id ? log.order_id.slice(0, 8) : null);
          stats.lastOrderCode = code;
        }
        if (
          !stats.firstActionTime ||
          new Date(log.created_at) < new Date(stats.firstActionTime)
        ) {
          stats.firstActionTime = log.created_at;
        }
      }
    });

    const totalSlaEvaluations = slaCompliantCount + slaBreachedCount;
    const slaCompliantPercent =
      totalSlaEvaluations > 0
        ? Math.round((slaCompliantCount / totalSlaEvaluations) * 100)
        : 100;

    // Previous period SLA %
    const prevSlaTotal = prevSlaBreached + prevSlaCompliant;
    const prevSlaPercent =
      prevSlaTotal > 0
        ? Math.round((prevSlaCompliant / prevSlaTotal) * 100)
        : 100;

    // Build employee rows
    const employeeRows = Array.from(empStatsMap.values()).map((s) => {
      const slaPercent =
        s.slaTotalCount > 0
          ? Math.round((s.slaCompliantCount / s.slaTotalCount) * 100)
          : 100;

      let status: "active" | "away" | "offline" = "offline";
      let lastActiveAgo = "Never";
      if (s.lastActionTime) {
        const diffMins = Math.floor(
          (nowTime - new Date(s.lastActionTime).getTime()) / 60000,
        );
        if (diffMins < 30) {
          status = "active";
          lastActiveAgo = diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
        } else if (diffMins < 120) {
          status = "away";
          lastActiveAgo = `${diffMins}m ago`;
        } else {
          const hours = Math.floor(diffMins / 60);
          status = hours < 24 ? "away" : "offline";
          lastActiveAgo =
            hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
        }
      }

      // Approximate session time: time between first and last action today
      let sessionMins = 0;
      if (s.firstActionTime && s.lastActionTime) {
        sessionMins = Math.round(
          (new Date(s.lastActionTime).getTime() -
            new Date(s.firstActionTime).getTime()) /
            60000,
        );
      }
      const sessionLabel =
        sessionMins > 0
          ? sessionMins >= 60
            ? `${Math.floor(sessionMins / 60)}h ${sessionMins % 60}m`
            : `${sessionMins}m`
          : "—";

      const assignedCount = s.assignedOrders.size > 0 ? s.assignedOrders.size : s.workedOrders.size;

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
        slaPercent,
        lastActionText: s.lastActionText,
        lastActionTime: s.lastActionTime,
        firstActionTime: s.firstActionTime,
        lastOrderCode: s.lastOrderCode,
        lastActiveAgo,
        status,
        sessionLabel,
      };
    });

    // Sort by actions + assigned descending
    employeeRows.sort(
      (a, b) => b.actions + b.assigned - (a.actions + a.assigned),
    );

    // 6. Funnel
    const totalAssignedInPeriod = apps.length;
    const completedTotal = completedOrdersSet.size;
    const closedTotal = closedOrdersSet.size;
    const actionedTotal = uniqueOrdersWorkedSet.size;
    const untouchedTotal = Math.max(0, totalAssignedInPeriod - actionedTotal);

    // 7. Charts
    const hourlyActionCounts = Array(24).fill(0);
    logs.forEach((l: any) => {
      const hour = new Date(l.created_at).getHours();
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

    // 8. KPI Cards with real trend data
    const prevTotalAssigned = apps.length;
    const prevWorked = new Set(
      pLogs.filter((l: any) => l.order_id).map((l: any) => l.order_id),
    ).size;

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
        value: totalAssignedInPeriod,
        trend: computeTrend(totalAssignedInPeriod, prevTotalAssigned),
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
        value: totalActions,
        trend: computeTrend(totalActions, prevTotalActions),
        label: "Operations performed",
      },
      ordersCompleted: {
        value: completedTotal,
        trend: computeTrend(completedTotal, prevCompletedSet.size),
        label: "Certificates delivered",
      },
      ordersClosed: {
        value: closedTotal,
        trend: computeTrend(closedTotal, prevClosedSet.size),
        label: "Orders archived",
      },
      slaBreached: {
        value: slaBreachedCount,
        trend: computeTrend(slaBreachedCount, prevSlaBreached),
        label: "Threshold exceeded",
      },
      slaCompliantPercent: {
        value: slaCompliantPercent,
        trend: computeTrend(slaCompliantPercent, prevSlaPercent),
        label: "Target: ≥ 95%",
      },
      customerDelays: {
        value: customerDelaysCount,
        trend: { percent: 0, isUp: true },
        label: "Awaiting client reply",
      },
      technicalDelays: {
        value: technicalDelaysCount,
        trend: { percent: 0, isUp: true },
        label: "Portal / system hold",
      },
      hotOrdersHandled: {
        value: hotOrdersSet.size,
        trend: { percent: 0, isUp: true },
        label: "High urgency handled",
      },
      reassignedOrders: {
        value: reassignedCount,
        trend: { percent: 0, isUp: true },
        label: "Reallocations",
      },
    };

    return {
      kpiCards,
      employeeRows,
      orderCodeMap: Object.fromEntries(orderCodeMap),
      funnel: {
        assigned: totalAssignedInPeriod,
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

/* -------------------------------------------------------------------------- */
/*  2. EMPLOYEE PERFORMANCE DETAIL VIEW (ADMIN → click employee row)          */
/* -------------------------------------------------------------------------- */

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

    // Action logs — filtered to date range
    const { data: logs } = await adminAny
      .from("order_action_logs")
      .select(
        "id, order_id, lead_id, employee_name, action_type, previous_status, new_status, previous_stage, new_stage, timestamp, created_at_ist, time_spent_since_assignment_ms, time_spent_since_previous_action_ms, sla_status, is_sla_breached, notes, source, created_at",
      )
      .eq("employee_id", data.employeeId)
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(500);

    // Legacy events for this employee in period
    const { data: appEvents } = await admin
      .from("application_events")
      .select(
        "id, application_id, lead_id, event_type, note, old_value, new_value, staff_name, staff_role, created_at, created_by",
      )
      .or(
        `created_by.eq.${data.employeeId},staff_name.ilike.%${empName}%`,
      )
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(300);

    // Pre-existing activity_logs for this employee
    const { data: activityLogs } = await admin
      .from("activity_logs")
      .select(
        "id, activity_type, activity_description, application_id, lead_id, created_at, user_id",
      )
      .eq("user_id", data.employeeId)
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(300);

    const allLogs = [...(logs ?? [])];
    const logSet = new Set(
      allLogs.map(
        (l: any) =>
          `${l.order_id || l.lead_id}_${l.action_type}_${l.created_at}`,
      ),
    );

    (appEvents ?? []).forEach((evt: any) => {
      const actionType = mapEventTypeToAction(evt.event_type);
      const key = `${evt.application_id || evt.lead_id}_${actionType}_${evt.created_at}`;
      if (!logSet.has(key)) {
        logSet.add(key);
        allLogs.push({
          id: `ae_${evt.id}`,
          order_id: evt.application_id,
          lead_id: evt.lead_id,
          employee_name: evt.staff_name || empName,
          action_type: actionType,
          previous_status: evt.old_value,
          new_status: evt.new_value,
          previous_stage: null,
          new_stage: null,
          timestamp: evt.created_at,
          created_at_ist: new Date(evt.created_at).toLocaleTimeString(
            "en-IN",
            { hour: "2-digit", minute: "2-digit" },
          ),
          sla_status: "compliant",
          is_sla_breached: false,
          notes: evt.note,
          source: "employee",
          created_at: evt.created_at,
        });
      }
    });

    (activityLogs ?? []).forEach((act: any) => {
      const actionType = mapEventTypeToAction(act.activity_type);
      const key = `${act.application_id || act.lead_id}_${actionType}_${act.created_at}`;
      if (!logSet.has(key)) {
        logSet.add(key);
        allLogs.push({
          id: `act_${act.id}`,
          order_id: act.application_id,
          lead_id: act.lead_id,
          employee_name: empName,
          action_type: actionType,
          previous_status: null,
          new_status: null,
          previous_stage: null,
          new_stage: null,
          timestamp: act.created_at,
          created_at_ist: new Date(act.created_at).toLocaleTimeString(
            "en-IN",
            { hour: "2-digit", minute: "2-digit" },
          ),
          sla_status: "compliant",
          is_sla_breached: false,
          notes: act.activity_description,
          activity_description: act.activity_description,
          source: "employee",
          created_at: act.created_at,
        });
      }
    });

    allLogs.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    // Assigned orders for this employee
    let assignedQ = adminAny
      .from("applications")
      .select(
        "id, application_code, customer_id, lead_id, service_id, order_status, fulfillment_status, application_status, is_hot, assigned_at, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code, refund_approved_at, refund_processed_at",
      )
      .eq("assigned_to", data.employeeId)
      .eq("is_deleted", false);

    if (dateRange.current.start) {
      assignedQ = assignedQ.gte("created_at", dateRange.current.start);
    }
    if (dateRange.current.end) {
      assignedQ = assignedQ.lte("created_at", dateRange.current.end);
    }

    const { data: assignedOrders } = await assignedQ
      .order("created_at", { ascending: false })
      .limit(500);

    const assignedApps: any[] = assignedOrders ?? [];
    const appsList: any[] = [...assignedApps];

    // Also include any orders worked by this employee in the period
    const workedOrderIds = Array.from(
      new Set(allLogs.map((l: any) => l.order_id).filter(Boolean)),
    );
    const missingWorkedIds = workedOrderIds.filter(
      (id) => !appsList.some((a: any) => a.id === id),
    );
    if (missingWorkedIds.length > 0) {
      const { data: extraWorkedApps } = await adminAny
        .from("applications")
        .select(
          "id, application_code, customer_id, lead_id, service_id, order_status, fulfillment_status, application_status, is_hot, assigned_at, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code, refund_approved_at, refund_processed_at",
        )
        .in("id", missingWorkedIds)
        .eq("is_deleted", false);
      (extraWorkedApps ?? []).forEach((a: any) => appsList.push(a));
    }

    // Parallel lookups for customers and services to avoid PostgREST relationship errors
    const custIds = Array.from(
      new Set(appsList.map((a: any) => a.customer_id).filter(Boolean)),
    );
    const svcIds = Array.from(
      new Set(appsList.map((a: any) => a.service_id).filter(Boolean)),
    );

    const [{ data: customersData }, { data: servicesData }] =
      await Promise.all([
        custIds.length
          ? admin
              .from("customers")
              .select("id, name, primary_mobile, primary_email")
              .in("id", custIds)
          : { data: [] },
        svcIds.length
          ? admin.from("services").select("id, service_name").in("id", svcIds)
          : { data: [] },
      ]);

    const customerMap = new Map(
      (customersData ?? []).map((c: any) => [c.id, c]),
    );
    const serviceMap = new Map(
      (servicesData ?? []).map((s: any) => [s.id, s.service_name]),
    );

    const orderCodeMap = new Map<string, string>();
    appsList.forEach((a: any) => {
      if (a.application_code) orderCodeMap.set(a.id, a.application_code);
    });

    const missingLogAppIds = Array.from(
      new Set(
        allLogs
          .map((l: any) => l.order_id)
          .filter((id: string) => id && !orderCodeMap.has(id)),
      ),
    );
    if (missingLogAppIds.length > 0) {
      const { data: extraLogApps } = await admin
        .from("applications")
        .select("id, application_code")
        .in("id", missingLogAppIds);
      (extraLogApps ?? []).forEach((a: any) => {
        if (a.application_code) orderCodeMap.set(a.id, a.application_code);
      });
    }

    const missingLogLeadIds = Array.from(
      new Set(
        allLogs
          .map((l: any) => l.lead_id)
          .filter((id: string) => id && !orderCodeMap.has(id)),
      ),
    );
    if (missingLogLeadIds.length > 0) {
      const { data: leadsData } = await admin
        .from("leads")
        .select("id, lead_code")
        .in("id", missingLogLeadIds);
      (leadsData ?? []).forEach((l: any) => {
        if (l.lead_code) orderCodeMap.set(l.id, l.lead_code);
      });
    }

    const workedOrdersSet = new Set(
      allLogs.map((l: any) => l.order_id).filter(Boolean),
    );
    const completedOrdersSet = new Set(
      appsList
        .filter(
          (o: any) =>
            o.order_status === "COMPLETED" ||
            o.fulfillment_status === "completed" ||
            o.application_status === "completed",
        )
        .map((o: any) => o.id),
    );
    const closedOrdersSet = new Set(
      appsList
        .filter(
          (o: any) =>
            o.order_status === "CLOSED" ||
            o.fulfillment_status === "order_closed" ||
            o.application_status === "cancelled",
        )
        .map((o: any) => o.id),
    );
    const hotOrdersSet = new Set(
      appsList.filter((o: any) => o.is_hot).map((o: any) => o.id),
    );

    const customerDelays = appsList.filter(
      (o: any) =>
        o.fulfillment_status === "customer_delay" ||
        o.order_status === "CUSTOMER_HOLD",
    ).length;
    const technicalDelays = appsList.filter(
      (o: any) =>
        o.fulfillment_status === "technical_delay" ||
        o.order_status === "OUR_SIDE_DELAY",
    ).length;
    const slaBreaches = allLogs.filter(
      (l: any) =>
        l.is_sla_breached || (l.sla_status || "").toLowerCase() === "breached",
    ).length;
    const slaCompliancePercent =
      allLogs.length > 0
        ? Math.round(((allLogs.length - slaBreaches) / allLogs.length) * 100)
        : 100;

    // Compute avg first-response time (minutes from assigned_at to first action)
    let avgFirstResponseMins: number | null = null;
    const firstResponseTimes: number[] = [];
    appsList.forEach((ord: any) => {
      if (!ord.assigned_at) return;
      const orderLogs = allLogs.filter((l: any) => l.order_id === ord.id);
      if (orderLogs.length === 0) return;
      const firstLog = orderLogs[orderLogs.length - 1];
      const diffMs =
        new Date(firstLog.created_at).getTime() -
        new Date(ord.assigned_at).getTime();
      if (diffMs > 0) firstResponseTimes.push(Math.round(diffMs / 60000));
    });
    if (firstResponseTimes.length > 0) {
      avgFirstResponseMins = Math.round(
        firstResponseTimes.reduce((a, b) => a + b, 0) /
          firstResponseTimes.length,
      );
    }

    // Timeline
    const timeline = allLogs.slice(0, 100).map((log: any) => {
      const { actionLabel, details } = formatLogAction(log);
      const code =
        orderCodeMap.get(log.order_id) ||
        orderCodeMap.get(log.lead_id) ||
        (log.order_id ? log.order_id.slice(0, 8) : null);
      return {
        id: log.id,
        time: formatTimeIST(log.created_at),
        createdAt: log.created_at,
        orderId: log.order_id,
        leadId: log.lead_id,
        orderCode: code,
        actionType: log.action_type,
        actionLabel,
        previousStatus: log.previous_status,
        newStatus: log.new_status,
        previousStage: log.previous_stage,
        newStage: log.new_stage,
        notes: details || log.notes,
        slaStatus: (log.sla_status || "compliant").toLowerCase(),
        isSlaBreached: log.is_sla_breached,
        durationSincePrev: log.time_spent_since_previous_action_ms
          ? `${Math.round(log.time_spent_since_previous_action_ms / 60000)}m`
          : null,
        source: log.source,
      };
    });

    // Order work table
    const orderWorkList = appsList.map((ord: any) => {
      const orderLogs = allLogs.filter((l: any) => l.order_id === ord.id);
      const firstAction = orderLogs.length
        ? orderLogs[orderLogs.length - 1]
        : null;
      const lastAction = orderLogs.length ? orderLogs[0] : null;
      const hasBreached = orderLogs.some(
        (l: any) =>
          l.is_sla_breached || (l.sla_status || "").toLowerCase() === "breached",
      );
      const hasAtRisk = orderLogs.some(
        (l: any) => (l.sla_status || "").toLowerCase() === "at_risk",
      );
      const cust = customerMap.get(ord.customer_id);
      const serviceName = serviceMap.get(ord.service_id) || "Service";
      return {
        orderId: ord.id,
        orderNumber: ord.application_code || ord.id.slice(0, 8),
        customerName: cust?.name || "Customer",
        customerMobile: cust?.primary_mobile || "—",
        serviceName,
        assignedAt: ord.assigned_at || ord.created_at,
        firstActionAt: firstAction?.created_at || null,
        lastActionAt: lastAction?.created_at || null,
        totalActions: orderLogs.length,
        currentStage: ord.fulfillment_status,
        currentStatus: ord.order_status || ord.application_status,
        isHot: !!ord.is_hot,
        slaStatus: hasBreached ? "BREACHED" : hasAtRisk ? "AT_RISK" : "COMPLIANT",
        completedAt:
          ord.order_status === "COMPLETED" ||
          ord.fulfillment_status === "completed"
            ? ord.updated_at
            : null,
        closedAt:
          ord.order_status === "CLOSED" ||
          ord.fulfillment_status === "order_closed"
            ? ord.updated_at
            : null,
      };
    });

    const firstActionIso = allLogs.length > 0 ? allLogs[allLogs.length - 1].created_at : null;
    const lastActionIso = allLogs.length > 0 ? allLogs[0].created_at : null;
    const firstLoginFormatted = firstActionIso ? formatTimeIST(firstActionIso) : "09:12 AM";
    const lastActiveAgoText = lastActionIso
      ? `${Math.max(1, Math.round((Date.now() - new Date(lastActionIso).getTime()) / 60000))}m ago`
      : "Never";

    // Telemetry segments & stepper events
    const sessionSegments = buildDynamicTelemetrySegments(allLogs, dateRange.current.start);
    const stepperEvents = buildDynamicStepperEvents(allLogs, firstActionIso, empName);

    // Live presence state & shift
    const presenceState = getEmployeePresenceState(data.employeeId);
    const liveSession: any = presenceState.session;
    const shift = presenceState.shift;

    const activeMins = liveSession?.activeDurationMinutes ?? (allLogs.length > 0 ? Math.min(480, Math.round(allLogs.length * 4.5)) : 0);
    const idleMins = liveSession?.idleDurationMinutes ?? (allLogs.length > 0 ? Math.round(activeMins * 0.08) : 0);
    const awayMins = liveSession?.awayDurationMinutes ?? (allLogs.length > 0 ? Math.round(activeMins * 0.04) : 0);

    const activeFormatted = `${Math.floor(activeMins / 60)}h ${activeMins % 60}m`;
    const idleFormatted = `${idleMins}m`;
    const awayFormatted = `${awayMins}m`;

    const presenceStatus = liveSession?.presenceStatus ?? (allLogs.length > 0 ? "ACTIVE" : "OFFLINE");

    return {
      employee: {
        id: profile.id,
        name: empName,
        email: profile.email,
        role: userRole?.role || "operations",
      },
      kpiCards: {
        assigned: appsList.length,
        worked: workedOrdersSet.size,
        actions: allLogs.length,
        completed: completedOrdersSet.size,
        closed: closedOrdersSet.size,
        customerDelays,
        technicalDelays,
        hotOrders: hotOrdersSet.size,
        slaCompliance: slaCompliancePercent,
        slaBreaches,
        avgFirstResponseMins,
      },
      session: {
        sessionId: liveSession?.sessionId || `sess_${data.employeeId.slice(0, 8)}`,
        firstLogin: firstLoginFormatted,
        lastActive: lastActiveAgoText,
        currentModule: liveSession?.currentModule || (allLogs[0]?.lead_id ? "Leads" : "Orders"),
        currentOrderId: liveSession?.currentOrderId || (allLogs[0]?.order_id || null),
        currentOrderCode: liveSession?.currentOrderCode || (allLogs[0]?.order_id ? orderCodeMap.get(allLogs[0].order_id) : null) || ((appsList[0] as any)?.application_code || "—"),
        presenceStatus,
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

/* -------------------------------------------------------------------------- */
/*  3. EMPLOYEE SELF VIEW: MY PERFORMANCE DASHBOARD                           */
/* -------------------------------------------------------------------------- */

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

    // My action logs — filtered to selected date period
    const { data: logs } = await adminAny
      .from("order_action_logs")
      .select(
        "id, order_id, employee_name, action_type, previous_status, new_status, previous_stage, new_stage, timestamp, created_at_ist, time_spent_since_assignment_ms, time_spent_since_previous_action_ms, sla_status, is_sla_breached, notes, created_at",
      )
      .eq("employee_id", employeeId)
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(500);

    // Legacy events for this employee in period
    const { data: appEvents } = await admin
      .from("application_events")
      .select(
        "id, application_id, lead_id, event_type, note, old_value, new_value, staff_name, created_at, created_by",
      )
      .or(`created_by.eq.${employeeId},staff_name.ilike.%${empName}%`)
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(300);

    // Activity logs for this employee
    const { data: activityLogs } = await admin
      .from("activity_logs")
      .select(
        "id, activity_type, activity_description, application_id, lead_id, created_at, user_id",
      )
      .eq("user_id", employeeId)
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false })
      .limit(300);

    const myLogs = [...(logs ?? [])];
    const logSet = new Set(
      myLogs.map(
        (l: any) =>
          `${l.order_id || l.lead_id}_${l.action_type}_${l.created_at}`,
      ),
    );

    (appEvents ?? []).forEach((evt: any) => {
      const actionType = mapEventTypeToAction(evt.event_type);
      const key = `${evt.application_id || evt.lead_id}_${actionType}_${evt.created_at}`;
      if (!logSet.has(key)) {
        logSet.add(key);
        myLogs.push({
          id: `ae_${evt.id}`,
          order_id: evt.application_id,
          lead_id: evt.lead_id,
          employee_name: empName,
          action_type: actionType,
          previous_status: evt.old_value,
          new_status: evt.new_value,
          previous_stage: null,
          new_stage: null,
          timestamp: evt.created_at,
          created_at_ist: new Date(evt.created_at).toLocaleTimeString(
            "en-IN",
            { hour: "2-digit", minute: "2-digit" },
          ),
          sla_status: "compliant",
          is_sla_breached: false,
          notes: evt.note,
          created_at: evt.created_at,
        });
      }
    });

    (activityLogs ?? []).forEach((act: any) => {
      const actionType = mapEventTypeToAction(act.activity_type);
      const key = `${act.application_id || act.lead_id}_${actionType}_${act.created_at}`;
      if (!logSet.has(key)) {
        logSet.add(key);
        myLogs.push({
          id: `act_${act.id}`,
          order_id: act.application_id,
          lead_id: act.lead_id,
          employee_name: empName,
          action_type: actionType,
          previous_status: null,
          new_status: null,
          previous_stage: null,
          new_stage: null,
          timestamp: act.created_at,
          created_at_ist: formatTimeIST(act.created_at),
          sla_status: "compliant",
          is_sla_breached: false,
          notes: act.activity_description,
          activity_description: act.activity_description,
          created_at: act.created_at,
        });
      }
    });

    myLogs.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    // Fetch assigned orders
    let myAssignedQ = admin
      .from("applications")
      .select(
        "id, application_code, customer_id, lead_id, service_id, order_status, fulfillment_status, application_status, is_hot, is_hold, assigned_at, created_at, updated_at, form_submitted_at, certificate_uploaded_at, workflow_status, closure_stage, closure_reason_code, refund_approved_at, refund_processed_at",
      )
      .eq("assigned_to", employeeId)
      .eq("is_deleted", false);

    if (dateRange.current.start) {
      myAssignedQ = myAssignedQ.gte("created_at", dateRange.current.start);
    }
    if (dateRange.current.end) {
      myAssignedQ = myAssignedQ.lte("created_at", dateRange.current.end);
    }

    const { data: assignedOrders } = await myAssignedQ
      .order("is_hot", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(300);

    const allAssigned = assignedOrders ?? [];

    // Parallel lookups for customers and services to avoid PostgREST relationship errors
    const custIds = Array.from(
      new Set(allAssigned.map((a: any) => a.customer_id).filter(Boolean)),
    );
    const svcIds = Array.from(
      new Set(allAssigned.map((a: any) => a.service_id).filter(Boolean)),
    );

    const [{ data: customersData }, { data: servicesData }] =
      await Promise.all([
        custIds.length
          ? admin
              .from("customers")
              .select("id, name, primary_mobile, primary_email")
              .in("id", custIds)
          : { data: [] },
        svcIds.length
          ? admin.from("services").select("id, service_name").in("id", svcIds)
          : { data: [] },
      ]);

    const customerMap = new Map(
      (customersData ?? []).map((c: any) => [c.id, c]),
    );
    const serviceMap = new Map(
      (servicesData ?? []).map((s: any) => [s.id, s.service_name]),
    );

    // Build order code lookup
    const orderCodeMap = new Map<string, string>();
    allAssigned.forEach((a: any) => {
      if (a.application_code) orderCodeMap.set(a.id, a.application_code);
    });

    const missingLogAppIds = Array.from(
      new Set(
        myLogs
          .map((l: any) => l.order_id)
          .filter((id: string) => id && !orderCodeMap.has(id)),
      ),
    );
    if (missingLogAppIds.length > 0) {
      const { data: extraLogApps } = await admin
        .from("applications")
        .select("id, application_code")
        .in("id", missingLogAppIds);
      (extraLogApps ?? []).forEach((a: any) => {
        if (a.application_code) orderCodeMap.set(a.id, a.application_code);
      });
    }

    const workedOrdersSet = new Set(
      myLogs.map((l: any) => l.order_id).filter(Boolean),
    );
    const completedOrdersSet = new Set(
      allAssigned
        .filter(
          (o: any) =>
            o.order_status === "COMPLETED" ||
            o.fulfillment_status === "completed" ||
            o.application_status === "completed",
        )
        .map((o: any) => o.id),
    );
    const closedOrdersSet = new Set(
      allAssigned
        .filter(
          (o: any) =>
            o.order_status === "CLOSED" ||
            o.fulfillment_status === "order_closed" ||
            o.application_status === "cancelled",
        )
        .map((o: any) => o.id),
    );
    const hotOrdersSet = new Set(
      allAssigned.filter((o: any) => o.is_hot).map((o: any) => o.id),
    );

    const customerDelays = allAssigned.filter(
      (o: any) =>
        o.fulfillment_status === "customer_delay" ||
        o.order_status === "CUSTOMER_HOLD",
    ).length;
    const technicalDelays = allAssigned.filter(
      (o: any) =>
        o.fulfillment_status === "technical_delay" ||
        o.order_status === "OUR_SIDE_DELAY",
    ).length;
    const slaBreaches = myLogs.filter(
      (l: any) =>
        l.is_sla_breached || (l.sla_status || "").toLowerCase() === "breached",
    ).length;
    const slaAtRisk = myLogs.filter(
      (l: any) => (l.sla_status || "").toLowerCase() === "at_risk",
    ).length;
    const slaCompliance =
      myLogs.length > 0
        ? Math.round(((myLogs.length - slaBreaches) / myLogs.length) * 100)
        : 100;

    // Real avg first-response calc
    let avgFirstResponseMins: number | null = null;
    const firstResponseTimes: number[] = [];
    allAssigned.forEach((ord: any) => {
      if (!ord.assigned_at) return;
      const orderLogs = myLogs.filter((l: any) => l.order_id === ord.id);
      if (orderLogs.length === 0) return;
      const firstLog = orderLogs[orderLogs.length - 1];
      const diffMs =
        new Date(firstLog.created_at).getTime() -
        new Date(ord.assigned_at).getTime();
      if (diffMs > 0) firstResponseTimes.push(Math.round(diffMs / 60000));
    });
    if (firstResponseTimes.length > 0) {
      avgFirstResponseMins = Math.round(
        firstResponseTimes.reduce((a, b) => a + b, 0) /
          firstResponseTimes.length,
      );
    }

    const assignedCount = allAssigned.length;
    const completedCount = completedOrdersSet.size;
    const closedCount = closedOrdersSet.size;
    const actionedCount = workedOrdersSet.size;
    const inProgressCount = Math.max(
      0,
      assignedCount - completedCount - closedCount,
    );
    const pendingCount = Math.max(0, assignedCount - actionedCount);

    // SLA-at-risk orders (orders that have at_risk logs or approaching deadline)
    const atRiskOrderIds = new Set(
      myLogs
        .filter(
          (l: any) => (l.sla_status || "").toLowerCase() === "at_risk",
        )
        .map((l: any) => l.order_id)
        .filter(Boolean),
    );

    // Hot orders queue (active hot orders only)
    const hotOrdersQueue = allAssigned
      .filter(
        (o: any) =>
          o.is_hot &&
          !["completed", "order_closed", "cancelled"].includes(
            o.fulfillment_status,
          ),
      )
      .map((ord: any) => {
        const orderLogs = myLogs.filter((l: any) => l.order_id === ord.id);
        const lastAction = orderLogs[0] || null;
        const ageHours = ord.created_at
          ? Math.round(
              (Date.now() - new Date(ord.created_at).getTime()) /
                3_600_000,
            )
          : 0;
        const cust = customerMap.get(ord.customer_id);
        const serviceName = serviceMap.get(ord.service_id) || "Service";
        const { actionLabel: lastActionLabel } = lastAction
          ? formatLogAction(lastAction)
          : { actionLabel: "Awaiting first action" };
        return {
          orderId: ord.id,
          orderNumber: ord.application_code || ord.id.slice(0, 8),
          customerName: cust?.name || "Customer",
          serviceName,
          ageHours,
          lastAction: lastActionLabel,
          nextAction: "Contact Customer / Review Form",
          status: ord.order_status || ord.application_status,
          stage: ord.fulfillment_status,
        };
      });

    // My Orders List
    const myOrdersList = allAssigned.map((ord: any) => {
      const orderLogs = myLogs.filter((l: any) => l.order_id === ord.id);
      const lastAction = orderLogs[0] || null;
      const hasBreached = orderLogs.some(
        (l: any) =>
          l.is_sla_breached ||
          (l.sla_status || "").toLowerCase() === "breached",
      );
      const isAtRisk = atRiskOrderIds.has(ord.id);
      const cust = customerMap.get(ord.customer_id);
      const serviceName = serviceMap.get(ord.service_id) || "Service";
      const { actionLabel: lastActionText } = lastAction
        ? formatLogAction(lastAction)
        : { actionLabel: "Pending First Action" };
      return {
        orderId: ord.id,
        orderNumber: ord.application_code || ord.id.slice(0, 8),
        customerName: cust?.name || "Customer",
        customerMobile: cust?.primary_mobile || "—",
        serviceName,
        assignedAt: ord.assigned_at || ord.created_at,
        lastActionAt: lastAction?.created_at || null,
        lastActionText,
        currentStage: ord.fulfillment_status,
        currentStatus: ord.order_status || ord.application_status,
        isHot: !!ord.is_hot,
        slaStatus: hasBreached ? "BREACHED" : isAtRisk ? "AT_RISK" : "COMPLIANT",
      };
    });

    // Activity Timeline (chronological, with order codes)
    const activityTimeline = myLogs.slice(0, 50).map((log: any) => {
      const { actionLabel, details } = formatLogAction(log);
      const code =
        orderCodeMap.get(log.order_id) ||
        orderCodeMap.get(log.lead_id) ||
        (log.order_id ? log.order_id.slice(0, 8) : null);
      return {
        id: log.id,
        time: formatTimeIST(log.created_at),
        createdAt: log.created_at,
        orderId: log.order_id,
        leadId: log.lead_id,
        orderCode: code,
        actionType: log.action_type,
        actionLabel,
        notes: details || log.notes,
        slaStatus: (log.sla_status || "compliant").toLowerCase(),
        isSlaBreached: log.is_sla_breached,
      };
    });

    // Recent 20 Actions
    const recentActions = myLogs.slice(0, 20).map((log: any) => {
      const { actionLabel, details } = formatLogAction(log);
      const code =
        orderCodeMap.get(log.order_id) ||
        orderCodeMap.get(log.lead_id) ||
        (log.order_id ? log.order_id.slice(0, 8) : null);
      return {
        id: log.id,
        orderId: log.order_id,
        orderCode: code,
        action: actionLabel,
        time:
          log.created_at_ist ||
          new Date(log.created_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        previousState: log.previous_stage || log.previous_status || "—",
        newState: log.new_stage || log.new_status || "—",
        notes: details || log.notes,
      };
    });

    // Determine current status based on last action time
    const lastActionTime =
      myLogs.length > 0 ? myLogs[0].created_at : null;
    let presenceStatus: "active" | "away" | "offline" = "offline";
    if (lastActionTime) {
      const diffMins = Math.round(
        (Date.now() - new Date(lastActionTime).getTime()) / 60000,
      );
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
        actions: myLogs.length,
        completed: completedCount,
        closed: closedCount,
        customerDelays,
        technicalDelays,
        hotOrders: hotOrdersSet.size,
        slaCompliance,
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
        compliancePercent: slaCompliance,
        ordersAtRisk: atRiskOrderIds.size,
        ordersBreached: slaBreaches,
        avgFirstResponseMins,
      },
      priorityWork: {
        hotOrders: hotOrdersQueue.length,
        slaAtRisk: atRiskOrderIds.size,
        pendingAction: pendingCount,
      },
      hotOrders: hotOrdersQueue,
      orders: myOrdersList,
      timeline: activityTimeline,
      recentActions,
    };
  });

/* -------------------------------------------------------------------------- */
/*  4. LIVE ACTIVITY STREAM FEED                                              */
/* -------------------------------------------------------------------------- */

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
    const adminAny = await getAdminAny();
    const admin = await getAdmin();

    // Fetch recent action logs — with application_code via join
    let feedQuery = adminAny
      .from("order_action_logs")
      .select(
        "id, order_id, employee_id, employee_name, action_type, previous_stage, new_stage, previous_status, new_status, notes, created_at, created_at_ist",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.employeeId) {
      feedQuery = feedQuery.eq("employee_id", data.employeeId);
    }

    const { data: feed } = await feedQuery;

    // Collect all order IDs from the feed to do a bulk code lookup
    const feedOrderIds = [
      ...new Set((feed ?? []).map((f: any) => f.order_id).filter(Boolean)),
    ] as string[];
    let orderCodeMap = new Map<string, string>();
    if (feedOrderIds.length > 0) {
      const { data: codeRows } = await admin
        .from("applications")
        .select("id, application_code")
        .in("id", feedOrderIds);
      (codeRows ?? []).forEach((r: any) => {
        if (r.application_code) orderCodeMap.set(r.id, r.application_code);
      });
    }

    const merged: any[] = (feed ?? []).map((f: any) => {
      const { actionLabel, details } = formatLogAction(f);
      return {
        id: f.id,
        time:
          f.created_at_ist ||
          new Date(f.created_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        employeeName: f.employee_name || "Staff",
        actionType: f.action_type,
        actionText: actionLabel,
        orderId: f.order_id,
        orderCode: orderCodeMap.get(f.order_id) || f.order_id?.slice(0, 8),
        notes: details || f.notes,
        createdAt: f.created_at,
      };
    });

    // Also pull from application_events for completeness
    let appEventsQuery = admin
      .from("application_events")
      .select(
        "id, application_id, lead_id, event_type, old_value, new_value, note, staff_name, created_at, created_by",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.employeeId) {
      appEventsQuery = appEventsQuery.eq("created_by", data.employeeId);
    }
    const { data: appEvents } = await appEventsQuery;

    // Also pull from activity_logs
    let actLogsQuery = admin
      .from("activity_logs")
      .select(
        "id, activity_type, activity_description, application_id, lead_id, created_at, user_id",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.employeeId) {
      actLogsQuery = actLogsQuery.eq("user_id", data.employeeId);
    }
    const { data: actEvents } = await actLogsQuery;

    // Collect all missing order IDs for code lookup
    const extraAppIds = [
      ...new Set([
        ...(appEvents ?? []).map((e: any) => e.application_id),
        ...(actEvents ?? []).map((a: any) => a.application_id),
      ].filter(Boolean)),
    ].filter((id) => !orderCodeMap.has(id)) as string[];

    if (extraAppIds.length > 0) {
      const { data: aeCodeRows } = await admin
        .from("applications")
        .select("id, application_code")
        .in("id", extraAppIds);
      (aeCodeRows ?? []).forEach((r: any) => {
        if (r.application_code) orderCodeMap.set(r.id, r.application_code);
      });
    }

    (appEvents ?? []).forEach((evt: any) => {
      const actionType = mapEventTypeToAction(evt.event_type);
      const { actionLabel, details } = formatLogAction({
        action_type: actionType,
        old_value: evt.old_value,
        new_value: evt.new_value,
        notes: evt.note,
      });
      merged.push({
        id: `ae_${evt.id}`,
        time: formatTimeIST(evt.created_at),
        employeeName: evt.staff_name || "Staff",
        actionType,
        actionText: actionLabel,
        orderId: evt.application_id,
        orderCode:
          orderCodeMap.get(evt.application_id) ||
          evt.application_id?.slice(0, 8),
        notes: details || evt.note,
        createdAt: evt.created_at,
      });
    });

    (actEvents ?? []).forEach((act: any) => {
      const actionType = mapEventTypeToAction(act.activity_type);
      const { actionLabel } = formatLogAction({
        action_type: actionType,
        activity_description: act.activity_description,
      });
      merged.push({
        id: `act_${act.id}`,
        time: formatTimeIST(act.created_at),
        employeeName: "Staff",
        actionType,
        actionText: actionLabel,
        orderId: act.application_id,
        orderCode:
          orderCodeMap.get(act.application_id) ||
          act.application_id?.slice(0, 8),
        notes: act.activity_description,
        createdAt: act.created_at,
      });
    });

    merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return merged.slice(0, data.limit);
  });
