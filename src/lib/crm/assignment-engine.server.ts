import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { computeOrderStage, type OrderStage } from "./computeOrderStage";
import { logEmployeeOrderAction } from "@/lib/orders/order-action-logger.server";
import { emitToUsers } from "@/lib/notifications/emit.server";

export type AssignmentChangeType =
  | "MANUAL"
  | "MANUAL_BULK"
  | "AUTO_LEAVE"
  | "AUTO_UNAVAILABLE"
  | "AUTO_INACTIVITY"
  | "AUTO_CAPACITY"
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
  expectedPreviousEmployeeId?: string | null; // For concurrency / optimistic lock
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

export interface StaffWorkloadSummary {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  effectiveWorkload: number;
  activeActionOrders: number;
  hotOrders: number;
  isAvailable: boolean;
  unavailabilityReason?: string;
}

const TERMINAL_STAGES: Set<string> = new Set([
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

const ACTION_REQUIRED_STAGES: Set<OrderStage> = new Set([
  "lead_received",
  "payment_done",
  "form_submitted",
  "order_reopened",
  "technical_delay",
  "under_review",
  "in_progress",
  "submitted_to_govt",
]);

/**
 * Self-healing helper to ensure assignment history and leave tables exist in Supabase
 */
let tablesVerified = false;
async function ensureTablesExist() {
  if (tablesVerified) return;
  try {
    const { error: testErr } = await (supabaseAdmin as any)
      .from("order_assignment_history")
      .select("id")
      .limit(1);

    if (testErr && testErr.code === "42P01") {
      // Table doesn't exist yet, create schema
      await (supabaseAdmin as any).rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS public.order_assignment_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID NOT NULL,
            lead_id UUID,
            previous_employee_id UUID,
            new_employee_id UUID,
            change_type TEXT NOT NULL,
            reason TEXT,
            source TEXT NOT NULL DEFAULT 'system',
            changed_by UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            metadata JSONB DEFAULT '{}'::jsonb
          );
          CREATE TABLE IF NOT EXISTS public.employee_leaves (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            employee_id UUID NOT NULL,
            start_time TIMESTAMPTZ NOT NULL,
            end_time TIMESTAMPTZ NOT NULL,
            reason TEXT,
            status TEXT NOT NULL DEFAULT 'ACTIVE',
            auto_reassign BOOLEAN NOT NULL DEFAULT true,
            reassigned_count INT NOT NULL DEFAULT 0,
            created_by UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
          );
        `,
      });
    }
    tablesVerified = true;
  } catch {
    // Ignore RPC not found, assume tables exist or fallback
    tablesVerified = true;
  }
}

/**
 * 1. Record single Assignment History entry
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
  await ensureTablesExist();
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

  // Also log into order_action_logs for comprehensive timeline audit
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
 * 2. Canonical single order assignment function (The single source of truth for all assignment changes)
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

  // Optimistic concurrency check: if caller expected a specific previous assignee and it changed, skip to prevent race condition
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

  // If expectedPreviousEmployeeId was given, bind it in the WHERE clause for strict row-level concurrency lock
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

  // 4. Record permanent assignment history
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

  // 5. Emit in-app notification to new assignee if assigned
  if (newEmployeeId && !skipNotification) {
    try {
      await emitToUsers([newEmployeeId], {
        kind: "order_assigned",
        title: changeType.startsWith("AUTO") ? "🎯 Order Reassigned" : "🎯 Order Assigned",
        body: `Order ${app.application_code || orderId} has been assigned to your queue (${reason || changeType}).`,
        href: `/admin/orders/${orderId}`,
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
 * 3. Calculate dynamic live workloads across all active eligible staff members
 */
export async function calculateStaffWorkloads(): Promise<StaffWorkloadSummary[]> {
  const ORDER_ACCESS_ROLES = ["operations", "executive", "manager", "admin", "super_admin", "support"] as const;

  // 1. Get staff profiles & roles
  const { data: roleRows } = await (supabaseAdmin as any)
    .from("user_roles")
    .select("user_id, role")
    .in("role", ORDER_ACCESS_ROLES);

  const staffUserIds: string[] = Array.from(
    new Set<string>((roleRows ?? []).map((r: any) => String(r.user_id))),
  );
  if (!staffUserIds.length) return [];

  const nowIso = new Date().toISOString();

  // 2. Fetch profiles, active leaves, and open action orders concurrently
  const [profilesRes, leavesRes, appsRes, schedulersRes] = await Promise.all([
    (supabaseAdmin as any)
      .from("profiles")
      .select("id, display_name, full_name, email, is_active")
      .in("id", staffUserIds),
    (supabaseAdmin as any)
      .from("employee_leaves")
      .select("employee_id, start_time, end_time, status, reason")
      .eq("status", "ACTIVE")
      .lte("start_time", nowIso)
      .gte("end_time", nowIso),
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
  (profilesRes.data ?? []).forEach((p: any) => profileMap.set(String(p.id), p));

  const activeLeavesMap = new Map<string, any>();
  (leavesRes.data ?? []).forEach((l: any) => activeLeavesMap.set(String(l.employee_id), l));

  const roleMap = new Map<string, string>();
  (roleRows ?? []).forEach((r: any) => {
    if (!roleMap.has(String(r.user_id))) roleMap.set(String(r.user_id), r.role);
  });

  const activeSchedulersByApp = new Map<string, any>();
  (schedulersRes.data ?? []).forEach((s: any) => {
    if (s.application_id) activeSchedulersByApp.set(String(s.application_id), s);
  });

  const nowMs = Date.now();

  // Map counts per employee
  const workloadByEmp = new Map<string, { activeActionOrders: number; hotOrders: number }>();
  staffUserIds.forEach((uid) => workloadByEmp.set(uid, { activeActionOrders: 0, hotOrders: 0 }));

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

    const counts = workloadByEmp.get(uid)!;
    if (isHot) {
      counts.hotOrders += 1;
    }
    if (ACTION_REQUIRED_STAGES.has(stage) || isHot || !!cb) {
      counts.activeActionOrders += 1;
    }
  }

  // Construct summaries
  const results: StaffWorkloadSummary[] = staffUserIds.map((uid) => {
    const prof = profileMap.get(uid);
    const leave = activeLeavesMap.get(uid);
    const counts = workloadByEmp.get(uid) || { activeActionOrders: 0, hotOrders: 0 };
    const isActiveAcc = prof?.is_active !== false;
    const isOnLeave = !!leave;
    const isAvailable = isActiveAcc && !isOnLeave;

    // Formula: Effective Workload = Active Action Orders + (2 * Hot Orders)
    const effectiveWorkload = counts.activeActionOrders + 2 * counts.hotOrders;

    return {
      employeeId: uid,
      name: prof?.full_name ?? prof?.display_name ?? prof?.email ?? "Staff",
      email: prof?.email ?? "",
      role: roleMap.get(uid) ?? "executive",
      effectiveWorkload,
      activeActionOrders: counts.activeActionOrders,
      hotOrders: counts.hotOrders,
      isAvailable,
      unavailabilityReason: isOnLeave
        ? `On Leave (${leave.reason || "Scheduled Leave"})`
        : !isActiveAcc
          ? "Account Deactivated"
          : undefined,
    };
  });

  return results;
}

/**
 * 4. Automatic Order Redistribution Engine
 * Identifies action-required orders belonging to an unavailable employee and
 * redistributes them to active eligible employees in a balanced, workload-aware manner.
 */
export async function reassignOrdersFromUnavailableEmployee(params: {
  unavailableEmployeeId: string;
  reason: string;
  changeType?: AssignmentChangeType;
  actorId?: string | null;
  maxWorkloadCapacity?: number;
}): Promise<{
  success: boolean;
  reassignedCount: number;
  overflowCount: number;
  skippedCount: number;
  assignments: Array<{ orderId: string; applicationCode: string; newEmployeeId: string | null }>;
  summaryMessage: string;
}> {
  const {
    unavailableEmployeeId,
    reason,
    changeType = "AUTO_UNAVAILABLE",
    actorId = null,
    maxWorkloadCapacity = 50,
  } = params;

  // 1. Fetch all non-terminal orders assigned to the unavailable employee
  const { data: rawApps, error: fetchErr } = await (supabaseAdmin as any)
    .from("applications")
    .select(
      "id, application_code, lead_id, customer_id, fulfillment_status, application_status, workflow_status, closure_stage, form_submitted_at, certificate_uploaded_at, created_at, assigned_to",
    )
    .eq("assigned_to", unavailableEmployeeId)
    .eq("is_deleted", false);

  if (fetchErr) throw new Error(fetchErr.message);

  if (!rawApps || rawApps.length === 0) {
    return {
      success: true,
      reassignedCount: 0,
      overflowCount: 0,
      skippedCount: 0,
      assignments: [],
      summaryMessage: "No orders found currently assigned to this employee.",
    };
  }

  // 2. Fetch schedulers for priority calculation
  const appIds = rawApps.map((a: any) => String(a.id));
  const { data: schedulers } = await (supabaseAdmin as any)
    .from("order_schedulers")
    .select("application_id, status, fires_at")
    .in("application_id", appIds)
    .eq("status", "active");

  const schedulerMap = new Map<string, any>();
  (schedulers ?? []).forEach((s: any) => schedulerMap.set(String(s.application_id), s));

  const nowMs = Date.now();

  // 3. Filter strictly for ACTION-REQUIRED orders and calculate urgency priority
  interface PrioritizedOrder {
    app: any;
    priorityRank: number; // 1 = Highest (Hot/Due), 2 = Action Required, 3 = Tech Delay, 4 = Reminders
    isHot: boolean;
    stage: OrderStage;
  }

  const eligibleOrders: PrioritizedOrder[] = [];

  for (const app of rawApps) {
    const fs = String(app.fulfillment_status ?? "").toLowerCase();
    const as = String(app.application_status ?? "").toLowerCase();

    // Skip terminal orders
    if (TERMINAL_STAGES.has(fs) || TERMINAL_STAGES.has(as)) continue;

    const stage = computeOrderStage(null, app);
    if (TERMINAL_STAGES.has(stage)) continue;

    // Skip pure customer delay without pending employee action
    if (stage === "customer_delay" && !schedulerMap.has(String(app.id))) {
      continue;
    }

    const cb = schedulerMap.get(String(app.id));
    const firesAt = cb?.fires_at ? new Date(cb.fires_at).getTime() : 0;
    const isDue = firesAt > 0 && firesAt <= nowMs;
    const isReopened = stage === "order_reopened" || fs === "order_reopened";
    const isHot = isDue || isReopened;

    let priorityRank = 5;
    if (isHot) {
      priorityRank = 1; // Priority 1: Hot / Due Now / Reopened
    } else if (stage === "payment_done" || stage === "form_submitted" || stage === "lead_received") {
      priorityRank = 2; // Priority 2: New paid intake & submitted forms
    } else if (stage === "technical_delay" || fs === "technical_delay") {
      priorityRank = 3; // Priority 3: NIC/Portal delay requiring follow-up
    } else if (cb) {
      priorityRank = 4; // Priority 4: Scheduled reminders
    } else if (ACTION_REQUIRED_STAGES.has(stage)) {
      priorityRank = 5;
    }

    eligibleOrders.push({ app, priorityRank, isHot, stage });
  }

  // Sort orders by urgency: Rank 1 first, then oldest created_at first
  eligibleOrders.sort((a, b) => {
    if (a.priorityRank !== b.priorityRank) return a.priorityRank - b.priorityRank;
    const tA = new Date(a.app.created_at).getTime();
    const tB = new Date(b.app.created_at).getTime();
    return tA - tB;
  });

  if (eligibleOrders.length === 0) {
    return {
      success: true,
      reassignedCount: 0,
      overflowCount: 0,
      skippedCount: 0,
      assignments: [],
      summaryMessage: "All orders assigned to this employee are already resolved or awaiting customer.",
    };
  }

  // 4. Fetch available staff and their workloads (excluding the unavailable staff)
  const allStaffWorkloads = await calculateStaffWorkloads();
  const availableStaff = allStaffWorkloads.filter(
    (s) => s.isAvailable && s.employeeId !== unavailableEmployeeId,
  );

  // In-memory dynamic workload tracking pool for balanced distribution
  const staffPool = availableStaff.map((s) => ({
    employeeId: s.employeeId,
    name: s.name,
    email: s.email,
    workload: s.effectiveWorkload,
    reassignedCount: 0,
  }));

  const assignments: Array<{ orderId: string; applicationCode: string; newEmployeeId: string | null }> = [];
  let reassignedCount = 0;
  let overflowCount = 0;
  let skippedCount = 0;

  // Track per-recipient batch notifications to avoid notification spam
  const notificationsByStaff = new Map<string, number>();

  // 5. Iteratively assign each priority order to the currently least-loaded staff
  for (const { app, isHot } of eligibleOrders) {
    const orderId = String(app.id);

    // Find the eligible staff member with the lowest effective workload
    let targetStaff = staffPool.length > 0
      ? staffPool.reduce((min, cur) => (cur.workload < min.workload ? cur : min), staffPool[0])
      : null;

    // Capacity check: If even the least loaded staff exceeds maxWorkloadCapacity
    if (targetStaff && targetStaff.workload >= maxWorkloadCapacity) {
      targetStaff = null; // Overflow safety: do not overload staff
    }

    const newEmpId = targetStaff ? targetStaff.employeeId : null;

    // Execute canonical assignment with optimistic locking (prevents duplicate reassignment if worker B intervened)
    const result = await assignOrderCanonical({
      orderId,
      newEmployeeId: newEmpId,
      changeType: newEmpId ? changeType : "AUTO_CAPACITY",
      reason: newEmpId
        ? reason
        : "Unassigned — All active employees reached maximum workload capacity",
      source: "system",
      actorId,
      expectedPreviousEmployeeId: unavailableEmployeeId,
      skipNotification: true, // We emit grouped notifications below
    });

    if (result.skippedDueToConflict) {
      skippedCount += 1;
      continue;
    }

    if (result.success) {
      if (newEmpId && targetStaff) {
        reassignedCount += 1;
        // Dynamically increment workload in pool to balance next iteration
        targetStaff.workload += isHot ? 3 : 1;
        targetStaff.reassignedCount += 1;
        notificationsByStaff.set(newEmpId, (notificationsByStaff.get(newEmpId) || 0) + 1);
      } else {
        overflowCount += 1;
      }

      assignments.push({
        orderId,
        applicationCode: app.application_code || orderId,
        newEmployeeId: newEmpId,
      });
    }
  }

  // 6. Emit single grouped notification per recipient
  for (const [staffId, count] of notificationsByStaff.entries()) {
    try {
      await emitToUsers([staffId], {
        kind: "order_assigned",
        title: "🎯 Orders Reassigned to You",
        body: `${count} order(s) were automatically reassigned to your queue (${reason}).`,
        href: "/admin/orders",
        entityKind: "application",
        entityId: assignments[0]?.orderId || "",
      });
    } catch (e) {
      console.warn("[reassignOrdersFromUnavailableEmployee] Notification emit warning:", e);
    }
  }

  // 7. Update leave table reassigned_count if this was triggered by active leave
  try {
    await (supabaseAdmin as any)
      .from("employee_leaves")
      .update({
        reassigned_count: reassignedCount,
        updated_at: new Date().toISOString(),
      })
      .eq("employee_id", unavailableEmployeeId)
      .eq("status", "ACTIVE");
  } catch {}

  const summary = `Redistributed ${reassignedCount} action-required order(s) across ${availableStaff.length} active employee(s).${
    overflowCount > 0 ? ` ⚠ ${overflowCount} order(s) could not be assigned due to employee capacity limits.` : ""
  }`;

  return {
    success: true,
    reassignedCount,
    overflowCount,
    skippedCount,
    assignments,
    summaryMessage: summary,
  };
}

/**
 * 4b. Canonical Equal Workload Distribution across active eligible staff
 */
export async function distributeOrdersEquallyCanonical(input: {
  applicationIds: string[];
  actorId?: string;
  source?: "super_admin" | "admin" | "system";
  reason?: string;
  targetEmployeeIds?: string[];
}): Promise<{
  success: boolean;
  distributedCount: number;
  overflowCount: number;
  skippedCount: number;
  assignments: Array<{ orderId: string; applicationCode: string; newEmployeeId: string | null }>;
  summaryMessage: string;
}> {
  await ensureTablesExist();
  const { applicationIds, actorId, source = "super_admin", reason = "Equally distributed by Admin", targetEmployeeIds } = input;
  if (!applicationIds || !applicationIds.length) {
    return { success: true, distributedCount: 0, overflowCount: 0, skippedCount: 0, assignments: [], summaryMessage: "No orders selected." };
  }

  // 1. Fetch orders
  const { data: rawApps, error: fetchErr } = await (supabaseAdmin as any)
    .from("applications")
    .select("id, application_code, assigned_to, lead_id, customer_id, fulfillment_status, application_status, created_at")
    .in("id", applicationIds);

  if (fetchErr || !rawApps || rawApps.length === 0) {
    return { success: false, distributedCount: 0, overflowCount: 0, skippedCount: 0, assignments: [], summaryMessage: "Selected orders not found." };
  }

  // 2. Fetch available staff and workloads
  const allStaffWorkloads = await calculateStaffWorkloads();
  let availableStaff = allStaffWorkloads.filter((s) => s.isAvailable);
  if (targetEmployeeIds && targetEmployeeIds.length > 0) {
    availableStaff = availableStaff.filter((s) => targetEmployeeIds.includes(s.employeeId));
  }

  if (availableStaff.length === 0) {
    return {
      success: false,
      distributedCount: 0,
      overflowCount: 0,
      skippedCount: 0,
      assignments: [],
      summaryMessage: "No active eligible staff available to receive orders.",
    };
  }

  // Workload pool for dynamic in-memory balancing
  const staffPool = availableStaff.map((s) => ({
    employeeId: s.employeeId,
    name: s.name,
    email: s.email,
    workload: s.effectiveWorkload,
    assignedCount: 0,
  }));

  const assignments: Array<{ orderId: string; applicationCode: string; newEmployeeId: string | null }> = [];
  let distributedCount = 0;
  let skippedCount = 0;
  const notificationsByStaff = new Map<string, number>();

  for (const app of rawApps) {
    const orderId = String(app.id);
    const prevAssignee = app.assigned_to;

    // Pick staff with lowest effective workload
    const targetStaff = staffPool.reduce((min, cur) => (cur.workload < min.workload ? cur : min), staffPool[0]);

    const assignRes = await assignOrderCanonical({
      orderId,
      newEmployeeId: targetStaff.employeeId,
      changeType: "AUTO_CAPACITY",
      reason,
      source,
      actorId,
      expectedPreviousEmployeeId: prevAssignee,
      skipNotification: true,
      metadata: {
        batchReassignment: true,
        distributionStrategy: "EQUAL_WORKLOAD_BALANCE",
        targetStaffWorkloadBefore: targetStaff.workload,
      },
    });

    if (assignRes.success && !assignRes.skippedDueToConflict) {
      targetStaff.workload += 1;
      targetStaff.assignedCount += 1;
      distributedCount += 1;
      assignments.push({
        orderId,
        applicationCode: assignRes.applicationCode || orderId,
        newEmployeeId: targetStaff.employeeId,
      });

      notificationsByStaff.set(
        targetStaff.employeeId,
        (notificationsByStaff.get(targetStaff.employeeId) || 0) + 1,
      );
    } else {
      skippedCount += 1;
    }
  }

  // Dispatch batched notifications
  for (const [empId, count] of notificationsByStaff.entries()) {
    try {
      await emitToUsers([empId], {
        kind: "order_assigned",
        title: `${count} New Order(s) Assigned (Auto-Balanced)`,
        body: `You received ${count} order(s) via automated workload redistribution.`,
        href: "/admin/orders",
        entityKind: "application",
        entityId: assignments.find((item) => item.newEmployeeId === empId)?.orderId || "",
      });
    } catch (err) {
      console.warn("[distributeOrdersEquallyCanonical] Notification error:", err);
    }
  }

  const summary = `Equally distributed ${distributedCount} order(s) across ${staffPool.filter(s => s.assignedCount > 0).length} active staff members.`;

  return {
    success: true,
    distributedCount,
    overflowCount: 0,
    skippedCount,
    assignments,
    summaryMessage: summary,
  };
}

/**
 * 5. SuperAdmin Operational Dashboard Metrics
 */
export async function getReassignmentOperationalMetrics() {
  await ensureTablesExist();
  const nowIso = new Date().toISOString();
  const todayStartIso = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  const [leavesRes, historyTodayRes, overflowRes, staffWorkloads] = await Promise.all([
    (supabaseAdmin as any)
      .from("employee_leaves")
      .select("id, employee_id, start_time, end_time, status, reason, reassigned_count")
      .eq("status", "ACTIVE")
      .lte("start_time", nowIso)
      .gte("end_time", nowIso),
    (supabaseAdmin as any)
      .from("order_assignment_history")
      .select("id, change_type, created_at")
      .gte("created_at", todayStartIso),
    (supabaseAdmin as any)
      .from("applications")
      .select("id")
      .is("assigned_to", null)
      .eq("is_deleted", false)
      .not("fulfillment_status", "in", "(completed,order_closed,cancelled,refunded)"),
    calculateStaffWorkloads(),
  ]);

  const historyRows = historyTodayRes.data ?? [];
  const autoCount = historyRows.filter((r: any) => String(r.change_type || "").startsWith("AUTO")).length;
  const manualCount = historyRows.filter((r: any) => String(r.change_type || "").startsWith("MANUAL")).length;

  const unavailableStaff = staffWorkloads.filter((s) => !s.isAvailable);

  return {
    employeesUnavailableCount: unavailableStaff.length,
    ordersReassignedToday: historyRows.length,
    autoReassignmentsToday: autoCount,
    manualReassignmentsToday: manualCount,
    ordersNeedingAssignment: overflowRes.data?.length ?? 0,
    unavailableEmployees: unavailableStaff,
    activeLeaves: leavesRes.data ?? [],
  };
}
