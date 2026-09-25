import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { computeOrderStage, type OrderStage } from "./computeOrderStage";
import { logEmployeeOrderAction } from "@/lib/orders/order-action-logger.server";
import { emitToUsers } from "@/lib/notifications/emit.server";

export type EmploymentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED" | "ARCHIVED";

export type PresenceStatus = "AVAILABLE" | "IDLE" | "AWAY" | "OFFLINE" | "UNAVAILABLE" | "ON_LEAVE";

export type AssignmentChangeType =
  | "MANUAL"
  | "MANUAL_BULK"
  | "AUTO_LEAVE"
  | "AUTO_UNAVAILABLE"
  | "AUTO_INACTIVITY"
  | "AUTO_OFFLINE"
  | "AUTO_CAPACITY"
  | "AUTO_TERMINATED"
  | "AUTO_DISABLED"
  | "AUTO_INITIAL_POOL"
  | "SYSTEM";

export type AssignmentSource = "manual" | "system" | "scheduler" | "admin" | "super_admin";

export interface CanonicalAssignInput {
  orderId: string;
  newEmployeeId: string | null;
  changeType: AssignmentChangeType;
  reason?: string | null;
  source?: AssignmentSource;
  actorId?: string | null;
  actorName?: string | null;
  expectedPreviousEmployeeId?: string | null; // Concurrency & optimistic lock protection
  skipNotification?: boolean;
  metadata?: Record<string, any>;
}

export interface CanonicalAssignResult {
  success: boolean;
  orderId: string;
  applicationCode?: string | null;
  previousEmployeeId?: string | null;
  newEmployeeId?: string | null;
  skippedDueToConflict?: boolean;
  error?: string;
}

export interface WorkSchedule {
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  start_time: string; // "09:30"
  end_time: string;   // "18:30"
  timezone: string;   // "Asia/Kolkata"
}

export interface EmployeeWorkforceRecord {
  id: string;
  displayName: string;
  fullName: string;
  email: string;
  mobile?: string | null;
  role: string;
  department?: string | null;
  employmentStatus: EmploymentStatus;
  isActive: boolean;
  autoAssignEnabled: boolean;
  isInAssignmentPool: boolean;
  maxWorkload: number;
  currentWorkload: number;
  remainingCapacity: number;
  workSchedule: WorkSchedule;
  presenceStatus: PresenceStatus;
  isOnLeave: boolean;
  activeLeaveDetails?: {
    leaveType: string;
    startTime: string;
    endTime: string;
    reason?: string | null;
  } | null;
  isWithinSchedule: boolean;
  isEligibleForAutoAssign: boolean;
  ineligibilityReasons: string[];
}

export interface StaffWorkloadSummary {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  employmentStatus: EmploymentStatus;
  effectiveWorkload: number;
  activeActionOrders: number;
  hotOrders: number;
  maxWorkload: number;
  remainingCapacity: number;
  isAvailable: boolean;
  isAutoAssignEligible: boolean;
  ineligibilityReasons: string[];
  unavailabilityReason?: string;
  presenceStatus: PresenceStatus;
}

export const ORDER_ACCESS_ROLES = [
  "operations",
  "executive",
  "manager",
  "admin",
  "super_admin",
  "support",
  "accounts",
  "finance",
  "agent",
  "verifier",
] as const;

export const TERMINAL_STAGES: Set<string> = new Set([
  "completed",
  "closed",
  "order_closed",
  "cancelled",
  "refunded",
  "refund_requested",
  "uninterested",
  "application_rejected",
  "certificate_rejected",
  "consultation_completed",
]);

export const ACTION_REQUIRED_STAGES: Set<OrderStage> = new Set([
  "lead_received",
  "payment_done",
  "form_submitted",
  "form_not_submitted",
  "order_reopened",
  "technical_delay",
  "under_review",
  "in_progress",
  "submitted_to_govt",
]);

export const WORKFORCE_THRESHOLDS = {
  IDLE_THRESHOLD_MINUTES: 5,        // 5 min inactivity -> IDLE (still eligible for new orders, no reassignment)
  AWAY_THRESHOLD_MINUTES: 15,       // 15 min inactivity -> AWAY (blocked from new automatic orders)
  HEARTBEAT_TIMEOUT_MINUTES: 10,    // 10 min without heartbeat -> OFFLINE (resilient to browser background tab throttling)
  PROLONGED_OFFLINE_REASSIGN_MINUTES: 30, // 30 min offline during working hours -> trigger automatic reassignment of action orders
  PROLONGED_AWAY_REASSIGN_MINUTES: 60,    // 60 min away during working hours -> trigger automatic reassignment of action orders
} as const;

/**
 * Check if the given date/time falls within the employee's working hours (IST timezone)
 */
export function isWithinWorkingSchedule(schedule?: Partial<WorkSchedule> | null, checkDate: Date = new Date()): boolean {
  if (!schedule) return true; // Default to available if unconfigured

  try {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: schedule.timezone || "Asia/Kolkata",
      hour12: false,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    const parts = formatter.formatToParts(checkDate);
    const dayName = parts.find((p) => p.type === "weekday")?.value?.toLowerCase() ?? "";
    const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
    const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
    const curTime = `${hour}:${minute}`;

    const dayMap: Record<string, number> = {
      sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
    };
    const curDay = dayMap[dayName.slice(0, 3)] ?? checkDate.getDay();

    if (schedule.days && schedule.days.length > 0) {
      if (!schedule.days.includes(curDay)) return false;
    }

    const start = schedule.start_time || "09:00";
    const end = schedule.end_time || "19:00";

    if (curTime < start || curTime > end) {
      return false;
    }

    return true;
  } catch {
    return true;
  }
}

/**
 * Authoritative Single Source of Truth: Evaluates whether an employee is eligible for auto-assignment.
 * Enforces: Active Lifecycle + Role + Auto Assign ON + Pool ON + No Leave + Within Shift + Under Capacity + Available/Idle Presence
 */
export function isEmployeeEligibleForAutoAssignment(
  emp: {
    employmentStatus?: string | null;
    isActive?: boolean | null;
    autoAssignEnabled?: boolean | null;
    isInAssignmentPool?: boolean | null;
    role?: string | null;
    isOnLeave?: boolean;
    workSchedule?: Partial<WorkSchedule> | null;
    currentWorkload?: number;
    maxWorkload?: number;
    presenceStatus?: PresenceStatus;
  },
  options: { checkSchedule?: boolean; checkCapacity?: boolean; checkPresence?: boolean } = {
    checkSchedule: true,
    checkCapacity: true,
    checkPresence: true,
  },
): { isEligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  const empStatus = (emp.employmentStatus ?? (emp.isActive === false ? "INACTIVE" : "ACTIVE")).toUpperCase();
  if (empStatus !== "ACTIVE") {
    reasons.push(`Employment status is ${empStatus}`);
  }

  if (emp.isActive === false) {
    reasons.push("Account is disabled / deactivated");
  }

  if (emp.autoAssignEnabled === false) {
    reasons.push("Auto-assignment is toggled OFF");
  }

  if (emp.isInAssignmentPool === false) {
    reasons.push("Not an active member of Assignment Pool");
  }

  if (emp.role && !ORDER_ACCESS_ROLES.includes(emp.role as any)) {
    reasons.push(`Role (${emp.role}) is not eligible for order assignments`);
  }

  if (emp.isOnLeave) {
    reasons.push("Employee is currently on approved leave");
  }

  if (options.checkSchedule && emp.workSchedule) {
    if (!isWithinWorkingSchedule(emp.workSchedule)) {
      reasons.push("Outside configured working schedule/hours");
    }
  }

  if (options.checkPresence !== false && emp.presenceStatus) {
    if (emp.presenceStatus === "OFFLINE") {
      reasons.push("Employee is OFFLINE (no active session / heartbeat lost)");
    } else if (emp.presenceStatus === "AWAY") {
      reasons.push("Employee is AWAY (inactive > 15 mins)");
    } else if (emp.presenceStatus === "ON_LEAVE") {
      reasons.push("Employee is ON LEAVE");
    } else if (emp.presenceStatus === "UNAVAILABLE") {
      reasons.push("Employee is UNAVAILABLE");
    }
  }

  if (options.checkCapacity) {
    const cur = Number(emp.currentWorkload ?? 0);
    const max = Number(emp.maxWorkload ?? 50);
    if (cur >= max) {
      reasons.push(`At maximum workload capacity (${cur}/${max})`);
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

/**
 * 1. Record single Assignment History entry (Immutable audit record)
 */
export async function recordAssignmentHistory(entry: {
  orderId: string;
  leadId?: string | null;
  previousEmployeeId?: string | null;
  newEmployeeId?: string | null;
  changeType: AssignmentChangeType;
  reason?: string | null;
  source?: AssignmentSource;
  changedBy?: string | null;
  metadata?: Record<string, any>;
}) {
  const nowIso = new Date().toISOString();

  try {
    await (supabaseAdmin as any).from("order_assignment_history").insert({
      order_id: entry.orderId,
      lead_id: entry.leadId || null,
      previous_employee_id: entry.previousEmployeeId || null,
      new_employee_id: entry.newEmployeeId || null,
      change_type: entry.changeType,
      reason: entry.reason || null,
      source: entry.source || "system",
      changed_by: entry.changedBy || null,
      created_at: nowIso,
      metadata: entry.metadata || {},
    });
  } catch (err) {
    console.warn("[recordAssignmentHistory] Failed to insert history row:", err);
  }

  // Also log into order_action_logs for order-level timeline
  try {
    await logEmployeeOrderAction({
      orderId: entry.orderId,
      leadId: entry.leadId || null,
      employeeId: entry.newEmployeeId || entry.previousEmployeeId || null,
      actionType: "ORDER_REASSIGNED",
      notes: entry.reason || `Assignment changed via ${entry.changeType}`,
      source: entry.source === "super_admin" ? "super_admin" : entry.source === "admin" ? "admin" : "system",
      customMetadata: {
        changeType: entry.changeType,
        previousEmployeeId: entry.previousEmployeeId,
        newEmployeeId: entry.newEmployeeId,
        changedBy: entry.changedBy,
        ...(entry.metadata || {}),
      },
      supabase: supabaseAdmin,
    });
  } catch (logErr) {
    console.warn("[recordAssignmentHistory] Action logger warning:", logErr);
  }
}

/**
 * 2. Canonical single order assignment function (The single authoritative gateway for all order assignment mutations)
 */
export async function assignOrderCanonical(
  input: CanonicalAssignInput,
): Promise<CanonicalAssignResult> {
  const {
    orderId,
    newEmployeeId,
    changeType,
    reason,
    source = "system",
    actorId,
    expectedPreviousEmployeeId,
    skipNotification = false,
    metadata = {},
  } = input;

  // 1. Fetch current order state
  const { data: app, error: fetchErr } = await (supabaseAdmin as any)
    .from("applications")
    .select("id, application_code, assigned_to, lead_id, customer_id, fulfillment_status, application_status")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchErr || !app) {
    return { success: false, orderId, error: fetchErr?.message || "Order not found" };
  }

  const currentAssignee = (app.assigned_to as string | null) ?? null;

  // Concurrency check: if caller expected a specific previous assignee and it changed, skip to prevent race conditions
  if (
    expectedPreviousEmployeeId !== undefined &&
    currentAssignee !== expectedPreviousEmployeeId
  ) {
    return {
      success: false,
      orderId,
      applicationCode: app.application_code,
      previousEmployeeId: currentAssignee,
      newEmployeeId,
      skippedDueToConflict: true,
      error: "Order was already reassigned by another concurrent process",
    };
  }

  // If already assigned to target, skip duplicate write
  if (currentAssignee === newEmployeeId) {
    return {
      success: true,
      orderId,
      applicationCode: app.application_code,
      previousEmployeeId: currentAssignee,
      newEmployeeId,
    };
  }

  const nowIso = new Date().toISOString();

  // 2. Update applications table atomically
  let updateQ = (supabaseAdmin as any)
    .from("applications")
    .update({
      assigned_to: newEmployeeId,
      assigned_at: nowIso,
      updated_at: nowIso,
    })
    .eq("id", orderId);

  if (expectedPreviousEmployeeId !== undefined) {
    if (expectedPreviousEmployeeId === null) {
      updateQ = updateQ.is("assigned_to", null);
    } else {
      updateQ = updateQ.eq("assigned_to", expectedPreviousEmployeeId);
    }
  }

  const { error: updateErr } = await updateQ;
  if (updateErr) {
    return { success: false, orderId, error: updateErr.message };
  }

  // 3. Synchronize leads table if lead_id exists
  if (app.lead_id) {
    await (supabaseAdmin as any)
      .from("leads")
      .update({
        assigned_to: newEmployeeId,
        assigned_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", app.lead_id);
  }

  // 4. Record permanent immutable assignment history
  await recordAssignmentHistory({
    orderId,
    leadId: app.lead_id,
    previousEmployeeId: currentAssignee,
    newEmployeeId,
    changeType,
    reason,
    source,
    changedBy: actorId || null,
    metadata,
  });

  // 5. Emit in-app notification to new assignee
  if (newEmployeeId && !skipNotification) {
    try {
      await emitToUsers([newEmployeeId], {
        kind: "order_assigned",
        title: changeType.startsWith("AUTO") ? "🎯 Order Reassigned" : "🎯 Order Assigned",
        body: `Order ${app.application_code || orderId} has been assigned to your queue (${reason || changeType}).`,
        href: `/admin/orders`,
        entityKind: "application",
        entityId: orderId,
      });
    } catch (notifErr) {
      console.warn("[assignOrderCanonical] Notification emit warning:", notifErr);
    }
  }

  return {
    success: true,
    orderId,
    applicationCode: app.application_code,
    previousEmployeeId: currentAssignee,
    newEmployeeId,
  };
}

/**
 * 3. Calculate dynamic live workloads & eligibility across staff members
 */
export async function calculateStaffWorkloads(): Promise<StaffWorkloadSummary[]> {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const [{ data: roleRows }, { data: activeProfiles }] = await Promise.all([
    (supabaseAdmin as any)
      .from("user_roles")
      .select("user_id, role")
      .in("role", ORDER_ACCESS_ROLES),
    (supabaseAdmin as any)
      .from("profiles")
      .select("*")
      .not("id", "is", null),
  ]);

  const rawUserIds = new Set<string>();
  (roleRows ?? []).forEach((r: any) => {
    if (r.user_id && UUID_REGEX.test(String(r.user_id))) {
      rawUserIds.add(String(r.user_id));
    }
  });
  (activeProfiles ?? []).forEach((p: any) => {
    const status = p.employment_status || (p.is_active === false ? "INACTIVE" : "ACTIVE");
    if (p.id && UUID_REGEX.test(String(p.id)) && status !== "ARCHIVED" && status !== "TERMINATED") {
      rawUserIds.add(String(p.id));
    }
  });

  const staffUserIds: string[] = Array.from(rawUserIds);
  if (!staffUserIds.length) return [];

  const nowIso = new Date().toISOString();

  // Concurrently fetch pool memberships, leaves, sessions, open applications & schedulers
  const [poolRes, leavesRes, sessionsRes, appsRes, schedulersRes] = await Promise.all([
    (supabaseAdmin as any)
      .from("assignment_pool")
      .select("user_id, is_active")
      .in("user_id", staffUserIds),
    (supabaseAdmin as any)
      .from("employee_leaves")
      .select("employee_id, start_time, end_time, status, reason")
      .eq("status", "ACTIVE")
      .lte("start_time", nowIso)
      .gte("end_time", nowIso),
    (supabaseAdmin as any)
      .from("employee_sessions")
      .select("employee_id, is_active, last_heartbeat_at, last_activity_at, status")
      .in("employee_id", staffUserIds)
      .eq("is_active", true)
      .order("last_heartbeat_at", { ascending: false }),
    (supabaseAdmin as any)
      .from("applications")
      .select("id, assigned_to, fulfillment_status, application_status, workflow_status, closure_stage, form_submitted_at, certificate_uploaded_at, created_at")
      .in("assigned_to", staffUserIds)
      .eq("is_deleted", false),
    (supabaseAdmin as any)
      .from("order_schedulers")
      .select("application_id, status, fires_at")
      .eq("status", "active"),
  ]);

  const profileMap = new Map<string, any>();
  (activeProfiles ?? []).forEach((p: any) => profileMap.set(String(p.id), p));

  const poolActiveMap = new Map<string, boolean>();
  (poolRes.data ?? []).forEach((ap: any) => {
    if (ap.is_active) poolActiveMap.set(String(ap.user_id), true);
  });

  const activeLeavesMap = new Map<string, any>();
  (leavesRes.data ?? []).forEach((l: any) => activeLeavesMap.set(String(l.employee_id), l));

  const latestSessionByEmp = new Map<string, any>();
  (sessionsRes.data ?? []).forEach((s: any) => {
    const uid = String(s.employee_id);
    if (!latestSessionByEmp.has(uid)) latestSessionByEmp.set(uid, s);
  });

  const roleMap = new Map<string, string>();
  (roleRows ?? []).forEach((r: any) => {
    if (!roleMap.has(String(r.user_id))) roleMap.set(String(r.user_id), r.role);
  });

  const activeSchedulersByApp = new Map<string, any>();
  (schedulersRes.data ?? []).forEach((s: any) => {
    if (s.application_id) activeSchedulersByApp.set(String(s.application_id), s);
  });

  const nowMs = Date.now();

  // Aggregate weighted workloads
  const workloadByEmp = new Map<
    string,
    { activeActionOrders: number; hotOrders: number; techDelayOrders: number; weightedWorkload: number }
  >();
  staffUserIds.forEach((uid) =>
    workloadByEmp.set(uid, { activeActionOrders: 0, hotOrders: 0, techDelayOrders: 0, weightedWorkload: 0 }),
  );

  for (const app of appsRes.data ?? []) {
    const uid = String(app.assigned_to);
    if (!workloadByEmp.has(uid)) continue;

    const fs = String(app.fulfillment_status ?? "").toLowerCase();
    const as = String(app.application_status ?? "").toLowerCase();
    if (TERMINAL_STAGES.has(fs) || TERMINAL_STAGES.has(as)) continue;

    const stage = computeOrderStage(null, app);
    if (TERMINAL_STAGES.has(stage)) continue;

    const cb = activeSchedulersByApp.get(String(app.id));
    const firesAt = cb?.fires_at ? new Date(cb.fires_at).getTime() : 0;
    const isDue = firesAt > 0 && firesAt <= nowMs;
    const isReopened = stage === "order_reopened" || fs === "order_reopened";
    const isHot = isDue || isReopened;
    const isTechDelay = stage === "technical_delay" || fs === "technical_delay";

    const counts = workloadByEmp.get(uid)!;
    if (isHot) {
      counts.hotOrders += 1;
      counts.weightedWorkload += 2.0;
    } else if (isTechDelay) {
      counts.techDelayOrders += 1;
      counts.weightedWorkload += 1.5;
    } else {
      counts.weightedWorkload += 1.0;
    }

    if (ACTION_REQUIRED_STAGES.has(stage) || isHot || !!cb || isTechDelay) {
      counts.activeActionOrders += 1;
    }
  }

  // Construct StaffWorkloadSummary records
  const summaries: StaffWorkloadSummary[] = staffUserIds.map((uid) => {
    const prof = profileMap.get(uid);
    const leave = activeLeavesMap.get(uid);
    const session = latestSessionByEmp.get(uid);
    const counts = workloadByEmp.get(uid) || { activeActionOrders: 0, hotOrders: 0, techDelayOrders: 0, weightedWorkload: 0 };

    const empStatus: EmploymentStatus = prof?.employment_status ?? (prof?.is_active === false ? "INACTIVE" : "ACTIVE");
    const isActiveAcc = prof?.is_active !== false && empStatus === "ACTIVE";
    const isOnLeave = !!leave;
    const isPoolActive = poolActiveMap.get(uid) ?? false;
    const autoAssignEnabled = isPoolActive;
    const maxWorkload = Number(prof?.max_workload || 50);
    const effectiveWorkload = Math.round(counts.weightedWorkload * 10) / 10;
    const remainingCapacity = Math.max(0, maxWorkload - counts.activeActionOrders);

    // Presence evaluation
    let presence: PresenceStatus = "AVAILABLE";
    if (isOnLeave) presence = "ON_LEAVE";
    else if (!isActiveAcc) presence = "UNAVAILABLE";
    else if (!session) presence = "OFFLINE";
    else {
      const lastAct = session.last_activity_at ? new Date(session.last_activity_at).getTime() : 0;
      const lastHb  = session.last_heartbeat_at ? new Date(session.last_heartbeat_at).getTime() : 0;
      const minsSinceAct = (nowMs - lastAct) / 60000;
      const minsSinceHb  = (nowMs - lastHb) / 60000;
      if (minsSinceHb > WORKFORCE_THRESHOLDS.HEARTBEAT_TIMEOUT_MINUTES || session.status === "logged_out" || session.status === "force_logged_out" || session.status === "expired") {
        presence = "OFFLINE";
      } else if (minsSinceAct > WORKFORCE_THRESHOLDS.AWAY_THRESHOLD_MINUTES || session.status === "away") {
        presence = "AWAY";
      } else if (minsSinceAct > WORKFORCE_THRESHOLDS.IDLE_THRESHOLD_MINUTES || session.status === "idle") {
        presence = "IDLE";
      } else {
        presence = "AVAILABLE";
      }
    }

    const { isEligible, reasons } = isEmployeeEligibleForAutoAssignment({
      employmentStatus: empStatus,
      isActive: isActiveAcc,
      autoAssignEnabled,
      isInAssignmentPool: isPoolActive,
      role: roleMap.get(uid) || "operations",
      isOnLeave,
      workSchedule: prof?.work_schedule,
      currentWorkload: counts.activeActionOrders,
      maxWorkload,
      presenceStatus: presence,
    });

    let unavailReason: string | undefined;
    if (isOnLeave) unavailReason = `On Leave (${leave.reason || "Scheduled Leave"})`;
    else if (empStatus !== "ACTIVE") unavailReason = `Account ${empStatus}`;
    else if (!isPoolActive || !autoAssignEnabled) unavailReason = "Auto-assign OFF";
    else if (presence === "OFFLINE") unavailReason = "Staff Offline";
    else if (presence === "AWAY") unavailReason = "Staff Away (>15m)";
    else if (!isEligible && reasons.length > 0) unavailReason = reasons[0];

    const resolvedName = prof?.full_name?.trim() || prof?.display_name?.trim() || prof?.email?.split("@")[0] || "Unknown Employee";
    if (resolvedName === "Unknown Employee" && !prof) {
      console.warn(`[calculateStaffWorkloads] Missing profile record for staff user: ${uid}`);
    }

    return {
      employeeId: uid,
      name: resolvedName,
      email: prof?.email ?? "",
      role: roleMap.get(uid) ?? "operations",
      employmentStatus: empStatus,
      effectiveWorkload,
      activeActionOrders: counts.activeActionOrders,
      hotOrders: counts.hotOrders,
      maxWorkload,
      remainingCapacity,
      isAvailable: isEligible,
      isAutoAssignEligible: isEligible,
      ineligibilityReasons: reasons,
      unavailabilityReason: unavailReason,
      presenceStatus: presence,
    };
  });

  return summaries;
}

/**
 * 4. Get list of currently active, eligible assignment employees
 */
export async function getEligibleAssignmentEmployees(options?: {
  checkSchedule?: boolean;
  checkCapacity?: boolean;
  checkPresence?: boolean;
}): Promise<StaffWorkloadSummary[]> {
  const workloads = await calculateStaffWorkloads();
  return workloads.filter((w) => w.isAutoAssignEligible);
}

/**
 * 5. Automatic Workload-Aware Order Redistribution
 * Evenly balances orders across eligible active staff according to lowest effective workload.
 */
export async function distributeOrdersEquallyCanonical(
  orderIds: string[],
  actorId?: string | null,
  reason: string = "Equally distributed across eligible staff",
): Promise<{
  success: boolean;
  totalOrders: number;
  distributedCount: number;
  unassignedCount: number;
  distributionMap: Record<string, number>;
  summaryMessage: string;
}> {
  if (!orderIds || orderIds.length === 0) {
    return {
      success: true,
      totalOrders: 0,
      distributedCount: 0,
      unassignedCount: 0,
      distributionMap: {},
      summaryMessage: "No orders to distribute.",
    };
  }

  // 1. Fetch eligible candidates (Strictly active, online, within shift, within capacity)
  const candidates = await getEligibleAssignmentEmployees();
  if (candidates.length === 0) {
    return {
      success: false,
      totalOrders: orderIds.length,
      distributedCount: 0,
      unassignedCount: orderIds.length,
      distributionMap: {},
      summaryMessage: "No active, available employees currently eligible for auto-assignment.",
    };
  }

  // Track dynamic simulated workloads during the distribution batch
  const dynamicWorkloads = candidates.map((c) => ({
    ...c,
    simulatedWorkload: c.effectiveWorkload,
    simulatedActiveCount: c.activeActionOrders,
    assignedInBatch: 0,
  }));

  const distributionMap: Record<string, number> = {};
  let distributedCount = 0;
  let unassignedCount = 0;

  for (const orderId of orderIds) {
    // Filter out candidates who have reached max capacity during this batch
    const availableNow = dynamicWorkloads.filter(
      (c) => c.simulatedActiveCount < c.maxWorkload,
    );

    if (availableNow.length === 0) {
      // All eligible employees reached capacity
      unassignedCount += 1;
      continue;
    }

    // Pick candidate with minimum simulated workload (fair workload balancing)
    availableNow.sort((a, b) => a.simulatedWorkload - b.simulatedWorkload);
    const chosen = availableNow[0];

    const res = await assignOrderCanonical({
      orderId,
      newEmployeeId: chosen.employeeId,
      changeType: "AUTO_INITIAL_POOL",
      reason,
      source: actorId ? "admin" : "system",
      actorId,
    });

    if (res.success) {
      chosen.simulatedWorkload += 1.0;
      chosen.simulatedActiveCount += 1;
      chosen.assignedInBatch += 1;
      distributedCount += 1;
      distributionMap[chosen.name] = (distributionMap[chosen.name] || 0) + 1;
    } else {
      unassignedCount += 1;
    }
  }

  const parts = Object.entries(distributionMap).map(([name, count]) => `${name}: ${count}`);
  const summaryMessage = distributedCount > 0
    ? `Distributed ${distributedCount} order(s) successfully (${parts.join(", ")})`
    : "No orders were distributed.";

  return {
    success: true,
    totalOrders: orderIds.length,
    distributedCount,
    unassignedCount,
    distributionMap,
    summaryMessage,
  };
}

/**
 * 6. Automatic Order Reassignment Engine for Unavailable Employees
 * Finds action-required orders belonging to an unavailable employee and redistributes them.
 */
export async function reassignOrdersFromUnavailableEmployee(params: {
  unavailableEmployeeId: string;
  reason: string;
  changeType?: AssignmentChangeType;
  actorId?: string | null;
}): Promise<{
  success: boolean;
  totalFound: number;
  reassignedCount: number;
  skippedCount: number;
  summaryMessage: string;
}> {
  const {
    unavailableEmployeeId,
    reason,
    changeType = "AUTO_UNAVAILABLE",
    actorId,
  } = params;

  const isPermanentDeparture =
    changeType === "AUTO_TERMINATED" ||
    changeType === "AUTO_DISABLED" ||
    reason.toLowerCase().includes("archived") ||
    reason.toLowerCase().includes("departure") ||
    reason.toLowerCase().includes("terminat");

  // 1. Fetch all non-deleted orders currently assigned to the unavailable employee
  const { data: apps, error: fetchErr } = await (supabaseAdmin as any)
    .from("applications")
    .select("id, application_code, fulfillment_status, application_status, workflow_status, closure_stage, form_submitted_at, certificate_uploaded_at, created_at")
    .eq("assigned_to", unavailableEmployeeId)
    .eq("is_deleted", false);

  if (fetchErr || !apps || apps.length === 0) {
    return {
      success: true,
      totalFound: 0,
      reassignedCount: 0,
      skippedCount: 0,
      summaryMessage: "No orders found assigned to this employee.",
    };
  }

  const appIds = apps.map((a: any) => a.id);

  // Fetch active schedulers to detect due callbacks
  const { data: schedulers } = await (supabaseAdmin as any)
    .from("order_schedulers")
    .select("application_id, status, fires_at")
    .in("application_id", appIds)
    .eq("status", "active");

  const schedulerMap = new Map<string, any>();
  (schedulers ?? []).forEach((s: any) => schedulerMap.set(s.application_id, s));

  const nowMs = Date.now();

  // 2. Filter orders to reassign.
  // Exclude terminal stages (completed, rejected, cancelled).
  // For temporary unavailability (leaves/away), skip customer waiting states.
  // For permanent departures / archiving, DO NOT skip any active orders so none are left orphaned!
  const actionOrders: Array<{ id: string; code: string; priorityScore: number }> = [];

  for (const a of apps) {
    const fs = String(a.fulfillment_status ?? "").toLowerCase();
    const as = String(a.application_status ?? "").toLowerCase();

    // Exclude terminal stages
    if (TERMINAL_STAGES.has(fs) || TERMINAL_STAGES.has(as)) continue;

    const stage = computeOrderStage(null, a);
    if (TERMINAL_STAGES.has(stage)) continue;

    // Only skip customer waiting states if NOT a permanent departure
    if (!isPermanentDeparture) {
      if (stage === "customer_delay" || fs === "customer_delay" || fs === "waiting_for_customer_submission") {
        continue;
      }
    }

    const cb = schedulerMap.get(a.id);
    const firesAt = cb?.fires_at ? new Date(cb.fires_at).getTime() : 0;
    const isDue = firesAt > 0 && firesAt <= nowMs;
    const isReopened = stage === "order_reopened" || fs === "order_reopened";
    const isHot = isDue || isReopened;

    // Priority Score (Higher = Reassigned First)
    let priorityScore = 1;
    if (isHot) priorityScore = 10;
    else if (stage === "technical_delay" || fs === "technical_delay") priorityScore = 5;
    else if (stage === "payment_done" || stage === "form_submitted") priorityScore = 4;
    else if (cb && firesAt > nowMs) priorityScore = 3;

    actionOrders.push({ id: a.id, code: a.application_code, priorityScore });
  }

  if (actionOrders.length === 0) {
    return {
      success: true,
      totalFound: apps.length,
      reassignedCount: 0,
      skippedCount: apps.length,
      summaryMessage: `Found ${apps.length} order(s), but none required active staff intervention.`,
    };
  }

  // Sort urgent orders first
  actionOrders.sort((a, b) => b.priorityScore - a.priorityScore);

  // 3. Redistribute to eligible active employees (excluding the unavailable employee)
  let candidates = (await getEligibleAssignmentEmployees()).filter(
    (c) => c.employeeId !== unavailableEmployeeId,
  );

  // Fallback: If no currently online/pool staff found (e.g. outside shift hours or offline presence),
  // fallback to all active workforce members so orders are never orphaned!
  if (candidates.length === 0) {
    const allWorkloads = await calculateStaffWorkloads();
    candidates = allWorkloads.filter(
      (c) =>
        c.employeeId !== unavailableEmployeeId &&
        c.employmentStatus === "ACTIVE" &&
        c.role !== "support",
    );
  }

  if (candidates.length === 0) {
    return {
      success: false,
      totalFound: actionOrders.length,
      reassignedCount: 0,
      skippedCount: actionOrders.length,
      summaryMessage: "No other active, eligible employees available to take over these orders.",
    };
  }

  const dynamicWorkloads = candidates.map((c) => ({
    ...c,
    simulatedWorkload: c.effectiveWorkload,
    simulatedActiveCount: c.activeActionOrders,
    assignedInBatch: 0,
  }));

  let reassignedCount = 0;
  let skippedCount = 0;
  const distributionMap: Record<string, number> = {};

  for (const ord of actionOrders) {
    let availableNow = dynamicWorkloads.filter(
      (c) => c.simulatedActiveCount < c.maxWorkload,
    );

    // If all candidates reached maxWorkload, distribute across least loaded anyway to avoid leaving orphaned orders
    if (availableNow.length === 0) {
      availableNow = [...dynamicWorkloads];
    }

    availableNow.sort((a, b) => a.simulatedWorkload - b.simulatedWorkload);
    const chosen = availableNow[0];

    const res = await assignOrderCanonical({
      orderId: ord.id,
      newEmployeeId: chosen.employeeId,
      changeType,
      reason,
      source: actorId ? "admin" : "system",
      actorId,
      expectedPreviousEmployeeId: unavailableEmployeeId, // Strict optimistic lock
    });

    if (res.success) {
      chosen.simulatedWorkload += (ord.priorityScore >= 10 ? 2.0 : 1.0);
      chosen.simulatedActiveCount += 1;
      chosen.assignedInBatch += 1;
      reassignedCount += 1;
      distributionMap[chosen.name] = (distributionMap[chosen.name] || 0) + 1;
    } else {
      skippedCount += 1;
    }
  }

  const parts = Object.entries(distributionMap).map(([name, count]) => `${name}: ${count}`);
  const summaryMessage = `Reassigned ${reassignedCount} of ${actionOrders.length} action order(s) successfully (${parts.join(", ") || "none"}).`;

  return {
    success: true,
    totalFound: actionOrders.length,
    reassignedCount,
    skippedCount,
    summaryMessage,
  };
}

/**
 * 7. Background Autonomous Cron Runner for Prolonged Unavailable / Offline Staff
 * Automatically detects staff who have been offline (> 30m) or away (> 60m) during their shift
 * and redistributes their action-required orders to eligible active colleagues.
 */
export async function reassignProlongedUnavailableStaff(): Promise<{
  processedEmployeesCount: number;
  totalOrdersReassigned: number;
  results: Array<{
    employeeId: string;
    employeeName: string;
    reason: string;
    reassignedCount: number;
  }>;
}> {
  const workloads = await calculateStaffWorkloads();
  const now = new Date();
  const nowMs = now.getTime();

  const results: Array<{
    employeeId: string;
    employeeName: string;
    reason: string;
    reassignedCount: number;
  }> = [];

  let totalOrdersReassigned = 0;

  for (const w of workloads) {
    if (w.employmentStatus !== "ACTIVE") {
      if (w.activeActionOrders > 0) {
        const res = await reassignOrdersFromUnavailableEmployee({
          unavailableEmployeeId: w.employeeId,
          reason: `Auto-reassigned from inactive/archived staff (${w.employmentStatus})`,
          changeType: "AUTO_TERMINATED",
        });
        if (res.reassignedCount > 0) {
          totalOrdersReassigned += res.reassignedCount;
          results.push({
            employeeId: w.employeeId,
            employeeName: w.name,
            reason: `INACTIVE_STAFF_${w.employmentStatus}`,
            reassignedCount: res.reassignedCount,
          });
        }
      }
      continue;
    }

    // Check if within working schedule
    const { data: prof } = await (supabaseAdmin as any)
      .from("profiles")
      .select("work_schedule")
      .eq("id", w.employeeId)
      .maybeSingle();

    const isWithinShift = isWithinWorkingSchedule(prof?.work_schedule, now);
    if (!isWithinShift) continue; // Do not reassign outside working shift

    // If employee is on active leave, check for unassigned action orders
    if (w.presenceStatus === "ON_LEAVE" && w.activeActionOrders > 0) {
      const res = await reassignOrdersFromUnavailableEmployee({
        unavailableEmployeeId: w.employeeId,
        reason: "Automatic leave redistribution",
        changeType: "AUTO_LEAVE",
      });
      if (res.reassignedCount > 0) {
        totalOrdersReassigned += res.reassignedCount;
        results.push({
          employeeId: w.employeeId,
          employeeName: w.name,
          reason: "AUTO_LEAVE",
          reassignedCount: res.reassignedCount,
        });
      }
      continue;
    }

    // Check sessions for prolonged offline / away
    const { data: session } = await (supabaseAdmin as any)
      .from("employee_sessions")
      .select("last_heartbeat_at, last_activity_at, is_active, status")
      .eq("employee_id", w.employeeId)
      .eq("is_active", true)
      .order("last_heartbeat_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let isProlongedOffline = false;
    let isProlongedAway = false;

    if (!session) {
      isProlongedOffline = true;
    } else {
      const lastHb = session.last_heartbeat_at ? new Date(session.last_heartbeat_at).getTime() : 0;
      const lastAct = session.last_activity_at ? new Date(session.last_activity_at).getTime() : 0;
      const minsSinceHb = (nowMs - lastHb) / 60000;
      const minsSinceAct = (nowMs - lastAct) / 60000;

      if (minsSinceHb >= WORKFORCE_THRESHOLDS.PROLONGED_OFFLINE_REASSIGN_MINUTES) {
        isProlongedOffline = true;
      } else if (minsSinceAct >= WORKFORCE_THRESHOLDS.PROLONGED_AWAY_REASSIGN_MINUTES) {
        isProlongedAway = true;
      }
    }

    if ((isProlongedOffline || isProlongedAway) && w.activeActionOrders > 0) {
      const changeType: AssignmentChangeType = isProlongedOffline ? "AUTO_OFFLINE" : "AUTO_INACTIVITY";
      const reason = isProlongedOffline
        ? `Employee offline for > ${WORKFORCE_THRESHOLDS.PROLONGED_OFFLINE_REASSIGN_MINUTES} mins during shift`
        : `Employee away for > ${WORKFORCE_THRESHOLDS.PROLONGED_AWAY_REASSIGN_MINUTES} mins during shift`;

      const res = await reassignOrdersFromUnavailableEmployee({
        unavailableEmployeeId: w.employeeId,
        reason,
        changeType,
      });

      if (res.reassignedCount > 0) {
        totalOrdersReassigned += res.reassignedCount;
        results.push({
          employeeId: w.employeeId,
          employeeName: w.name,
          reason: changeType,
          reassignedCount: res.reassignedCount,
        });
      }
    }
  }

  return {
    processedEmployeesCount: results.length,
    totalOrdersReassigned,
    results,
  };
}

/**
 * 8. Aggregate Live Operational Metrics for Assignment & Reassignment Dashboard
 */
export async function getReassignmentOperationalMetrics() {
  const workloads = await calculateStaffWorkloads();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const [autoAssignedRes, autoReassignedRes, manualAssignedRes, unassignedRes] = await Promise.all([
    (supabaseAdmin as any)
      .from("order_assignment_history")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso)
      .in("change_type", ["AUTO_INITIAL_POOL"]),
    (supabaseAdmin as any)
      .from("order_assignment_history")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso)
      .in("change_type", [
        "AUTO_LEAVE",
        "AUTO_UNAVAILABLE",
        "AUTO_INACTIVITY",
        "AUTO_OFFLINE",
        "AUTO_CAPACITY",
        "AUTO_TERMINATED",
        "AUTO_DISABLED",
      ]),
    (supabaseAdmin as any)
      .from("order_assignment_history")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso)
      .in("change_type", ["MANUAL", "MANUAL_BULK"]),
    (supabaseAdmin as any)
      .from("applications")
      .select("id", { count: "exact", head: true })
      .is("assigned_to", null)
      .eq("is_deleted", false)
      .not(
        "fulfillment_status",
        "in",
        '("completed","order_completed","order_closed","cancelled")',
      ),
  ]);

  const unavailableEmployees = workloads.filter((w) => !w.isAvailable);

  return {
    employeesUnavailableCount: unavailableEmployees.length,
    ordersReassignedToday: (autoReassignedRes.count ?? 0) + (manualAssignedRes.count ?? 0),
    autoReassignmentsToday: autoReassignedRes.count ?? 0,
    manualReassignmentsToday: manualAssignedRes.count ?? 0,
    ordersNeedingAssignment: unassignedRes.count ?? 0,
    unavailableEmployees,
  };
}
