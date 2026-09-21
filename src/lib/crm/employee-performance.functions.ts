import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

function resolveDateRange(
  filter: DatePeriodFilter,
  customStart?: string,
  customEnd?: string,
) {
  // IST is UTC + 5 hours 30 mins
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowUtc = new Date();
  const nowIst = new Date(nowUtc.getTime() + IST_OFFSET_MS);

  const getIstMidnightAsUtc = (dIst: Date) => {
    return new Date(
      Date.UTC(dIst.getUTCFullYear(), dIst.getUTCMonth(), dIst.getUTCDate(), 0, 0, 0, 0) -
        IST_OFFSET_MS,
    );
  };
  const getIstEndOfDayAsUtc = (dIst: Date) => {
    return new Date(
      Date.UTC(dIst.getUTCFullYear(), dIst.getUTCMonth(), dIst.getUTCDate(), 23, 59, 59, 999) -
        IST_OFFSET_MS,
    );
  };

  let currentStart = getIstMidnightAsUtc(nowIst);
  let currentEnd = getIstEndOfDayAsUtc(nowIst);
  let prevStart = new Date(currentStart.getTime() - 86_400_000);
  let prevEnd = new Date(currentEnd.getTime() - 86_400_000);

  if (filter === "today") {
    currentStart = getIstMidnightAsUtc(nowIst);
    currentEnd = getIstEndOfDayAsUtc(nowIst);
    const yestIst = new Date(nowIst.getTime() - 86_400_000);
    prevStart = getIstMidnightAsUtc(yestIst);
    prevEnd = getIstEndOfDayAsUtc(yestIst);
  } else if (filter === "yesterday") {
    const yestIst = new Date(nowIst.getTime() - 86_400_000);
    currentStart = getIstMidnightAsUtc(yestIst);
    currentEnd = getIstEndOfDayAsUtc(yestIst);
    const dayBeforeIst = new Date(nowIst.getTime() - 2 * 86_400_000);
    prevStart = getIstMidnightAsUtc(dayBeforeIst);
    prevEnd = getIstEndOfDayAsUtc(dayBeforeIst);
  } else if (filter === "7d") {
    currentStart = new Date(nowUtc.getTime() - 7 * 86_400_000);
    currentEnd = nowUtc;
    prevStart = new Date(nowUtc.getTime() - 14 * 86_400_000);
    prevEnd = new Date(nowUtc.getTime() - 7 * 86_400_000);
  } else if (filter === "15d") {
    currentStart = new Date(nowUtc.getTime() - 15 * 86_400_000);
    currentEnd = nowUtc;
    prevStart = new Date(nowUtc.getTime() - 30 * 86_400_000);
    prevEnd = new Date(nowUtc.getTime() - 15 * 86_400_000);
  } else if (filter === "30d") {
    currentStart = new Date(nowUtc.getTime() - 30 * 86_400_000);
    currentEnd = nowUtc;
    prevStart = new Date(nowUtc.getTime() - 60 * 86_400_000);
    prevEnd = new Date(nowUtc.getTime() - 30 * 86_400_000);
  } else if (filter === "this_month") {
    const monthStartIst = new Date(
      Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), 1, 0, 0, 0, 0) - IST_OFFSET_MS,
    );
    currentStart = monthStartIst;
    currentEnd = nowUtc;
    const prevMonthStartIst = new Date(
      Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth() - 1, 1, 0, 0, 0, 0) - IST_OFFSET_MS,
    );
    const prevMonthEndIst = new Date(
      Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), 0, 23, 59, 59, 999) - IST_OFFSET_MS,
    );
    prevStart = prevMonthStartIst;
    prevEnd = prevMonthEndIst;
  } else if (filter === "custom" && customStart && customEnd) {
    currentStart = new Date(customStart);
    currentEnd = new Date(customEnd);
    const durationMs = currentEnd.getTime() - currentStart.getTime();
    prevStart = new Date(currentStart.getTime() - durationMs);
    prevEnd = new Date(currentStart.getTime());
  }

  return {
    current: {
      start: currentStart.toISOString(),
      end: currentEnd.toISOString(),
    },
    previous: {
      start: prevStart.toISOString(),
      end: prevEnd.toISOString(),
    },
  };
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

    // 1. All staff profiles + roles
    const { data: staffRoles } = await admin
      .from("user_roles")
      .select("user_id, role")
      .in("role", [
        "operations",
        "support",
        "admin",
        "super_admin",
        "manager",
        "executive",
        "accounts",
        "finance",
      ]);

    const staffUserIds = Array.from(
      new Set((staffRoles ?? []).map((r: any) => r.user_id)),
    );
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

    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name, display_name, email")
      .in(
        "id",
        staffUserIds.length
          ? staffUserIds
          : ["00000000-0000-0000-0000-000000000000"],
      );

    const profileMap = new Map<string, any>();
    const nameToUserIdMap = new Map<string, string>();
    (profiles ?? []).forEach((p: any) => {
      profileMap.set(p.id, p);
      const displayName =
        p.full_name || p.display_name || p.email?.split("@")[0] || "";
      if (displayName)
        nameToUserIdMap.set(displayName.toLowerCase().trim(), p.id);
      if (p.email) nameToUserIdMap.set(p.email.toLowerCase().trim(), p.id);
    });

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
          matchedEmpId =
            nameToUserIdMap.get(evt.staff_name.toLowerCase().trim()) || null;
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
        const p = act.user_id ? profileMap.get(act.user_id) : null;
        const name =
          p?.full_name ||
          p?.display_name ||
          p?.email?.split("@")[0] ||
          "Staff";
        logs.push({
          id: `act_${act.id}`,
          order_id: act.application_id,
          lead_id: act.lead_id,
          employee_id: act.user_id,
          employee_name: name,
          employee_role:
            (act.user_id && userRoleMap.get(act.user_id)) || "operations",
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
          nameToUserIdMap.get(evt.staff_name?.toLowerCase()?.trim()) ||
          null,
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
        employee_id: act.user_id,
        action_type: mapEventTypeToAction(act.activity_type),
        is_sla_breached: false,
        created_at: act.created_at,
      });
    });

    // 4. Fetch applications with period filter
    let applicationsQuery = admin
      .from("applications")
      .select(
        "id, application_code, customer_id, lead_id, assigned_to, assigned_at, order_status, fulfillment_status, application_status, is_hot, service_id, created_at, updated_at",
      )
      .or("is_deleted.is.null,is_deleted.eq.false")
      .limit(5000);

    if (data.serviceId)
      applicationsQuery = applicationsQuery.eq("service_id", data.serviceId);
    if (data.employeeId)
      applicationsQuery = applicationsQuery.eq(
        "assigned_to",
        data.employeeId,
      );

    const [{ data: allApplications }, { data: leadsAssigned }] = await Promise.all([
      applicationsQuery,
      admin
        .from("leads")
        .select("id, assigned_to, created_at, updated_at")
        .not("assigned_to", "is", null)
        .limit(5000),
    ]);
    const apps = allApplications ?? [];
    const leadAssignedMap = new Map<string, any>();
    (leadsAssigned ?? []).forEach((l: any) => {
      leadAssignedMap.set(l.id, l);
    });

    const startMs = new Date(dateRange.current.start).getTime();
    const endMs = new Date(dateRange.current.end).getTime();

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
      const { data: extraApps } = await admin
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
      const [{ data: leadApps }, { data: leadsData }] = await Promise.all([
        admin
          .from("applications")
          .select("id, application_code, lead_id")
          .in("lead_id", missingLeadIds),
        admin.from("leads").select("id, lead_code").in("id", missingLeadIds),
      ]);
      (leadApps ?? []).forEach((a: any) => {
        if (a.lead_id && a.application_code)
          leadToAppMap.set(a.lead_id, a);
      });
      (leadsData ?? []).forEach((l: any) => {
        if (l.lead_code) leadCodeMap.set(l.id, l.lead_code);
      });
    }

    // Track assigned orders per staff member
    const assignedOrdersPerStaff = new Map<string, Set<string>>();
    const ensureAssignedSet = (uid: string) => {
      if (!assignedOrdersPerStaff.has(uid)) assignedOrdersPerStaff.set(uid, new Set());
      return assignedOrdersPerStaff.get(uid)!;
    };

    const currentAssignedOrders = apps.filter((app: any) => {
      const effectiveAssignee =
        app.assigned_to ||
        (app.lead_id && leadAssignedMap.get(app.lead_id)?.assigned_to) ||
        null;
      if (!effectiveAssignee) return false;

      const assignedTime = app.assigned_at
        ? new Date(app.assigned_at).getTime()
        : null;
      const createdTime = app.created_at
        ? new Date(app.created_at).getTime()
        : null;
      const updatedTime = app.updated_at
        ? new Date(app.updated_at).getTime()
        : null;
      const leadRow = app.lead_id ? leadAssignedMap.get(app.lead_id) : null;
      const leadUpdatedTime = leadRow?.updated_at
        ? new Date(leadRow.updated_at).getTime()
        : null;

      const isTodayAssigned =
        (assignedTime && assignedTime >= startMs && assignedTime <= endMs) ||
        (createdTime && createdTime >= startMs && createdTime <= endMs) ||
        (updatedTime && updatedTime >= startMs && updatedTime <= endMs) ||
        (leadUpdatedTime && leadUpdatedTime >= startMs && leadUpdatedTime <= endMs);

      const isActive = !["completed", "order_closed", "cancelled"].includes(
        app.fulfillment_status,
      );

      if (isTodayAssigned || isActive) {
        ensureAssignedSet(effectiveAssignee).add(app.id);
        return true;
      }
      return false;
    });

    // 5. Aggregate KPI metrics
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

    // Per-Employee aggregation map
    const empStatsMap = new Map<
      string,
      {
        employeeId: string;
        employeeName: string;
        employeeRole: string;
        avatarUrl?: string;
        assigned: number;
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

    // Initialise all known staff
    staffUserIds.forEach((uid) => {
      const p = profileMap.get(uid);
      const name =
        p?.full_name || p?.display_name || p?.email?.split("@")[0] || "Staff";
      empStatsMap.set(uid, {
        employeeId: uid,
        employeeName: name,
        employeeRole: userRoleMap.get(uid) || "operations",
        avatarUrl: p?.avatar_url,
        assigned: 0,
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

    // Tally assigned orders from application data
    currentAssignedOrders.forEach((o: any) => {
      const assignee =
        o.assigned_to ||
        (o.lead_id && leadAssignedMap.get(o.lead_id)?.assigned_to);
      if (!assignee) return;
      if (!empStatsMap.has(assignee)) {
        const p = profileMap.get(assignee);
        const name =
          p?.full_name ||
          p?.display_name ||
          p?.email?.split("@")[0] ||
          "Staff";
        empStatsMap.set(assignee, {
          employeeId: assignee,
          employeeName: name,
          employeeRole: userRoleMap.get(assignee) || "operations",
          avatarUrl: p?.avatar_url,
          assigned: 0,
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

      const stats = empStatsMap.get(assignee)!;
      if (o.is_hot) {
        stats.hotOrders.add(o.id);
        hotOrdersSet.add(o.id);
      }
      const isCompleted =
        o.order_status === "COMPLETED" ||
        o.fulfillment_status === "completed" ||
        o.application_status === "completed";
      const isClosed =
        o.order_status === "CLOSED" ||
        o.fulfillment_status === "order_closed" ||
        o.application_status === "cancelled";
      if (isCompleted) {
        stats.completedOrders.add(o.id);
        completedOrdersSet.add(o.id);
      }
      if (isClosed) {
        stats.closedOrders.add(o.id);
        closedOrdersSet.add(o.id);
      }
      // Count current delays from application state
      if (
        o.fulfillment_status === "customer_delay" ||
        o.order_status === "CUSTOMER_HOLD"
      ) {
        stats.customerDelays += 1;
        customerDelaysCount += 1;
      }
      if (
        o.fulfillment_status === "technical_delay" ||
        o.order_status === "OUR_SIDE_DELAY"
      ) {
        stats.technicalDelays += 1;
        technicalDelaysCount += 1;
      }
    });

    // Process all action logs — real counts only
    logs.forEach((log: any) => {
      const empId = log.employee_id;
      if (empId) {
        activeEmployeesSet.add(empId);
        workedEmployeesSet.add(empId);
      }
      if (log.order_id) uniqueOrdersWorkedSet.add(log.order_id);

      const slaLower = (log.sla_status || "").toLowerCase();
      if (log.is_sla_breached || slaLower === "breached") slaBreachedCount++;
      else slaCompliantCount++;

      const actionType = log.action_type || "";
      const isCompleted =
        actionType === "ORDER_COMPLETED" ||
        log.new_status === "completed" ||
        /complete/i.test(log.notes || "");
      const isClosed =
        actionType === "ORDER_CLOSED" ||
        log.new_status === "closed" ||
        log.new_status === "order_closed" ||
        /close/i.test(log.notes || "");
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
      const isAssignment =
        actionType === "ORDER_ASSIGNED" ||
        actionType === "STAFF_ASSIGNED" ||
        /assign/i.test(log.notes || "");

      if (isCustDelay) customerDelaysCount++;
      if (isTechDelay) technicalDelaysCount++;
      if (actionType === "ORDER_REASSIGNED") reassignedCount++;
      if (isHot && log.order_id) hotOrdersSet.add(log.order_id);
      if (isCompleted && log.order_id) completedOrdersSet.add(log.order_id);
      if (isClosed && log.order_id) closedOrdersSet.add(log.order_id);
      if (isAssignment && empId && log.order_id) {
        ensureAssignedSet(empId).add(log.order_id);
      }

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
        if (!log.is_sla_breached && slaLow !== "breached")
          stats.slaCompliantCount += 1;

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

    // Ensure every employee's assigned count reflects orders assigned today / active queue (never 0 if they worked on orders)
    empStatsMap.forEach((stats, uid) => {
      const assignedSet = assignedOrdersPerStaff.get(uid);
      const assignedCount = assignedSet ? assignedSet.size : 0;
      stats.assigned = Math.max(assignedCount, stats.workedOrders.size);
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
    const nowTime = Date.now();
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

      return {
        employeeId: s.employeeId,
        employeeName: s.employeeName,
        employeeRole: s.employeeRole,
        avatarUrl: s.avatarUrl,
        assigned: s.assigned,
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
    const totalAssignedInPeriod = currentAssignedOrders.length;
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
    const prevTotalAssigned = apps.filter((app: any) => {
      if (!app.assigned_to) return false;
      const assignedTime = app.assigned_at
        ? new Date(app.assigned_at).getTime()
        : null;
      const createdTime = app.created_at
        ? new Date(app.created_at).getTime()
        : null;
      const prevStartMs = new Date(dateRange.previous.start).getTime();
      const prevEndMs = new Date(dateRange.previous.end).getTime();
      return (
        (assignedTime && assignedTime >= prevStartMs && assignedTime <= prevEndMs) ||
        (createdTime && createdTime >= prevStartMs && createdTime <= prevEndMs)
      );
    }).length;

    const prevWorked = new Set(
      pLogs.filter((l: any) => l.order_id).map((l: any) => l.order_id),
    ).size;

    const kpiCards = {
      totalActiveEmployees: {
        value: staffUserIds.length,
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
    const { data: assignedOrders } = await admin
      .from("applications")
      .select(
        "id, application_code, customer_id, service_id, order_status, fulfillment_status, application_status, is_hot, assigned_at, created_at, updated_at",
      )
      .eq("assigned_to", data.employeeId)
      .or("is_deleted.is.null,is_deleted.eq.false")
      .order("created_at", { ascending: false })
      .limit(500);

    const assignedApps = assignedOrders ?? [];
    const appsList = [...assignedApps];

    // Also include any orders worked by this employee in the period
    const workedOrderIds = Array.from(
      new Set(allLogs.map((l: any) => l.order_id).filter(Boolean)),
    );
    const missingWorkedIds = workedOrderIds.filter(
      (id) => !appsList.some((a: any) => a.id === id),
    );
    if (missingWorkedIds.length > 0) {
      const { data: extraWorkedApps } = await admin
        .from("applications")
        .select(
          "id, application_code, customer_id, service_id, order_status, fulfillment_status, application_status, is_hot, assigned_at, created_at, updated_at",
        )
        .in("id", missingWorkedIds);
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
    const { data: assignedOrders } = await admin
      .from("applications")
      .select(
        "id, application_code, customer_id, service_id, order_status, fulfillment_status, application_status, is_hot, is_hold, assigned_at, created_at, updated_at",
      )
      .eq("assigned_to", employeeId)
      .or("is_deleted.is.null,is_deleted.eq.false")
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
