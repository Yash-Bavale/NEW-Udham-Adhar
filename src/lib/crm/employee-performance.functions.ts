import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function verifyAdminOrSuperAdmin(supabase: any, userId?: string) {
  const admin = await getAdmin();
  let query = admin.from("user_roles").select("role");
  if (userId) query = query.eq("user_id", userId);
  const { data } = await query;
  const roles = new Set((data ?? []).map((r: any) => r.role));
  const isPrivileged = roles.has("admin") || roles.has("super_admin") || roles.has("manager");
  if (!isPrivileged) throw new Error("Unauthorized: Admin or Super Admin access required.");
  return true;
}

export type DatePeriodFilter = 'today' | 'yesterday' | '7d' | '15d' | '30d' | 'this_month' | 'custom';

/**
 * Resolves start & end ISO strings for a selected period, plus the equivalent previous period for trend comparisons.
 */
function resolveDateRange(filter: DatePeriodFilter, customStart?: string, customEnd?: string) {
  const now = new Date();
  
  // IST offset helper (+5:30)
  const toIstDate = (d: Date) => new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
  
  let currentStart = new Date();
  let currentEnd = new Date();
  let prevStart = new Date();
  let prevEnd = new Date();

  const startOfDay = (d: Date) => {
    const res = new Date(d);
    res.setHours(0, 0, 0, 0);
    return res;
  };

  const endOfDay = (d: Date) => {
    const res = new Date(d);
    res.setHours(23, 59, 59, 999);
    return res;
  };

  if (filter === 'today') {
    currentStart = startOfDay(now);
    currentEnd = endOfDay(now);
    // Prev: yesterday
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    prevStart = startOfDay(yest);
    prevEnd = endOfDay(yest);
  } else if (filter === 'yesterday') {
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    currentStart = startOfDay(yest);
    currentEnd = endOfDay(yest);
    // Prev: day before yesterday
    const dayBefore = new Date(now);
    dayBefore.setDate(dayBefore.getDate() - 2);
    prevStart = startOfDay(dayBefore);
    prevEnd = endOfDay(dayBefore);
  } else if (filter === '7d') {
    currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    currentEnd = now;
    prevStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    prevEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (filter === '15d') {
    currentStart = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    currentEnd = now;
    prevStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    prevEnd = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  } else if (filter === '30d') {
    currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    currentEnd = now;
    prevStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    prevEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (filter === 'this_month') {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    currentEnd = now;
    prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else if (filter === 'custom' && customStart && customEnd) {
    currentStart = new Date(customStart);
    currentEnd = new Date(customEnd);
    const durationMs = currentEnd.getTime() - currentStart.getTime();
    prevStart = new Date(currentStart.getTime() - durationMs);
    prevEnd = new Date(currentStart.getTime());
  }

  return {
    current: { start: currentStart.toISOString(), end: currentEnd.toISOString() },
    previous: { start: prevStart.toISOString(), end: prevEnd.toISOString() },
  };
}

function computeTrend(current: number, previous: number): { percent: number; isUp: boolean } {
  if (previous === 0) {
    return { percent: current > 0 ? 100 : 0, isUp: current > 0 };
  }
  const diff = current - previous;
  const percent = Math.round(Math.abs(diff / previous) * 100 * 10) / 10;
  return { percent, isUp: diff >= 0 };
}

/* -------------------------------------------------------------------------- */
/*  1. SUPER ADMIN / ADMIN COMMAND CENTER METRICS                             */
/* -------------------------------------------------------------------------- */

export const getEmployeePerformanceCommandCenter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        dateFilter: z.enum(['today', 'yesterday', '7d', '15d', '30d', 'this_month', 'custom']).default('today'),
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
    const dateRange = resolveDateRange(data.dateFilter, data.customStart, data.customEnd);

    // 1. Fetch all active employees / staff
    const { data: staffRoles } = await admin
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["operations", "support", "admin", "super_admin", "manager", "executive", "accounts", "finance"]);

    const staffUserIds = Array.from(new Set((staffRoles ?? []).map((r: any) => r.user_id)));

    const { data: profiles } = await admin
      .from("profiles")
      .select("id, display_name, email, avatar_url, updated_at")
      .in("id", staffUserIds.length ? staffUserIds : ['00000000-0000-0000-0000-000000000000']);

    const profileMap = new Map<string, any>();
    (profiles ?? []).forEach((p: any) => profileMap.set(p.id, p));

    // 2. Fetch current period Action Logs
    let actionLogsQuery = admin
      .from("order_action_logs")
      .select("id, order_id, employee_id, employee_name, employee_role, action_type, sla_status, is_sla_breached, time_spent_since_assignment_ms, created_at")
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end);

    if (data.employeeId) {
      actionLogsQuery = actionLogsQuery.eq("employee_id", data.employeeId);
    }

    const { data: currentLogs, error: logErr } = await actionLogsQuery;
    if (logErr) console.error("[Performance] Error fetching current logs:", logErr);

    // 3. Fetch previous period Action Logs for comparison
    let prevLogsQuery = admin
      .from("order_action_logs")
      .select("id, order_id, employee_id, action_type, sla_status, is_sla_breached, created_at")
      .gte("created_at", dateRange.previous.start)
      .lte("created_at", dateRange.previous.end);

    if (data.employeeId) {
      prevLogsQuery = prevLogsQuery.eq("employee_id", data.employeeId);
    }

    const { data: prevLogs } = await prevLogsQuery;

    // 4. Fetch Orders assigned during current and previous periods
    let ordersAssignedQuery = admin
      .from("applications")
      .select("id, assigned_to, assigned_at, order_status, fulfillment_status, is_hot, service_id, created_at")
      .gte("assigned_at", dateRange.current.start)
      .lte("assigned_at", dateRange.current.end);

    if (data.employeeId) {
      ordersAssignedQuery = ordersAssignedQuery.eq("assigned_to", data.employeeId);
    }
    if (data.serviceId) {
      ordersAssignedQuery = ordersAssignedQuery.eq("service_id", data.serviceId);
    }

    const { data: currentAssignedOrders } = await ordersAssignedQuery;

    let prevOrdersAssignedQuery = admin
      .from("applications")
      .select("id, assigned_to, assigned_at")
      .gte("assigned_at", dateRange.previous.start)
      .lte("assigned_at", dateRange.previous.end);

    if (data.employeeId) {
      prevOrdersAssignedQuery = prevOrdersAssignedQuery.eq("assigned_to", data.employeeId);
    }

    const { data: prevAssignedOrders } = await prevOrdersAssignedQuery;

    // 5. Aggregate KPI metrics
    const logs = currentLogs ?? [];
    const pLogs = prevLogs ?? [];

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

    // Per-Employee aggregation table map
    const empStatsMap = new Map<string, {
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
    }>();

    // Initialize all staff profiles in the map
    staffUserIds.forEach((uid) => {
      const p = profileMap.get(uid);
      const name = p?.display_name || p?.email?.split('@')[0] || "Staff";
      empStatsMap.set(uid, {
        employeeId: uid,
        employeeName: name,
        employeeRole: "operations",
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
      });
    });

    // Populate assigned counts
    (currentAssignedOrders ?? []).forEach((o: any) => {
      if (o.assigned_to) {
        if (!empStatsMap.has(o.assigned_to)) {
          const p = profileMap.get(o.assigned_to);
          empStatsMap.set(o.assigned_to, {
            employeeId: o.assigned_to,
            employeeName: p?.display_name || p?.email?.split('@')[0] || "Staff",
            employeeRole: "operations",
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
          });
        }
        empStatsMap.get(o.assigned_to)!.assigned += 1;
      }
    });

    // Process all action logs
    logs.forEach((log: any) => {
      const empId = log.employee_id;
      if (empId) {
        activeEmployeesSet.add(empId);
        workedEmployeesSet.add(empId);
      }
      if (log.order_id) {
        uniqueOrdersWorkedSet.add(log.order_id);
      }

      if (log.is_sla_breached) {
        slaBreachedCount += 1;
      } else {
        slaCompliantCount += 1;
      }

      if (log.action_type === 'CUSTOMER_DELAY_ADDED') customerDelaysCount += 1;
      if (log.action_type === 'TECHNICAL_DELAY_ADDED') technicalDelaysCount += 1;
      if (log.action_type === 'ORDER_REASSIGNED') reassignedCount += 1;
      if (log.action_type === 'HOT_ORDER_ADDED' && log.order_id) hotOrdersSet.add(log.order_id);
      if (log.action_type === 'ORDER_COMPLETED' && log.order_id) completedOrdersSet.add(log.order_id);
      if (log.action_type === 'ORDER_CLOSED' && log.order_id) closedOrdersSet.add(log.order_id);

      // Per-employee rollup
      if (empId && empStatsMap.has(empId)) {
        const stats = empStatsMap.get(empId)!;
        stats.actions += 1;
        if (log.order_id) stats.workedOrders.add(log.order_id);
        if (log.action_type === 'ORDER_COMPLETED' && log.order_id) stats.completedOrders.add(log.order_id);
        if (log.action_type === 'ORDER_CLOSED' && log.order_id) stats.closedOrders.add(log.order_id);
        if (log.action_type === 'CUSTOMER_DELAY_ADDED') stats.customerDelays += 1;
        if (log.action_type === 'TECHNICAL_DELAY_ADDED') stats.technicalDelays += 1;
        if (log.action_type === 'HOT_ORDER_ADDED' && log.order_id) stats.hotOrders.add(log.order_id);

        stats.slaTotalCount += 1;
        if (!log.is_sla_breached) stats.slaCompliantCount += 1;

        if (!stats.lastActionTime || new Date(log.created_at) > new Date(stats.lastActionTime)) {
          stats.lastActionTime = log.created_at;
          stats.lastActionType = log.action_type;
          stats.lastActionText = log.action_type.replace(/_/g, ' ').toLowerCase();
        }
      }
    });

    // Previous period aggregates for comparisons
    const prevUniqueOrders = new Set((pLogs ?? []).map((l: any) => l.order_id).filter(Boolean)).size;
    const prevActions = (pLogs ?? []).length;
    const prevCompleted = new Set((pLogs ?? []).filter((l: any) => l.action_type === 'ORDER_COMPLETED').map((l: any) => l.order_id)).size;
    const prevClosed = new Set((pLogs ?? []).filter((l: any) => l.action_type === 'ORDER_CLOSED').map((l: any) => l.order_id)).size;
    const prevCustomerDelays = (pLogs ?? []).filter((l: any) => l.action_type === 'CUSTOMER_DELAY_ADDED').length;
    const prevTechDelays = (pLogs ?? []).filter((l: any) => l.action_type === 'TECHNICAL_DELAY_ADDED').length;
    const prevHotOrders = new Set((pLogs ?? []).filter((l: any) => l.action_type === 'HOT_ORDER_ADDED').map((l: any) => l.order_id)).size;
    const prevAssignedCount = (prevAssignedOrders ?? []).length;
    const prevSlaBreached = (pLogs ?? []).filter((l: any) => l.is_sla_breached).length;

    const totalSlaEvaluations = slaCompliantCount + slaBreachedCount;
    const slaCompliantPercent = totalSlaEvaluations > 0 ? Math.round((slaCompliantCount / totalSlaEvaluations) * 100) : 100;
    const prevSlaTotal = (pLogs ?? []).length;
    const prevSlaCompliant = prevSlaTotal - prevSlaBreached;
    const prevSlaPercent = prevSlaTotal > 0 ? Math.round((prevSlaCompliant / prevSlaTotal) * 100) : 100;

    // Convert employee stats to array
    const nowTime = Date.now();
    const employeeRows = Array.from(empStatsMap.values()).map((s) => {
      const worked = s.workedOrders.size;
      const completed = s.completedOrders.size;
      const closed = s.closedOrders.size;
      const hotOrders = s.hotOrders.size;
      const slaPercent = s.slaTotalCount > 0 ? Math.round((s.slaCompliantCount / s.slaTotalCount) * 100) : 100;

      let status: 'active' | 'away' | 'offline' = 'offline';
      let lastActiveAgo = 'Never';

      if (s.lastActionTime) {
        const diffMins = Math.floor((nowTime - new Date(s.lastActionTime).getTime()) / 60000);
        if (diffMins < 15) {
          status = 'active';
          lastActiveAgo = diffMins <= 1 ? 'Just now' : `${diffMins} min ago`;
        } else if (diffMins < 60) {
          status = 'away';
          lastActiveAgo = `${diffMins} min ago`;
        } else {
          const hours = Math.floor(diffMins / 60);
          status = 'offline';
          lastActiveAgo = hours < 24 ? `${hours} hr ago` : `${Math.floor(hours / 24)}d ago`;
        }
      }

      return {
        employeeId: s.employeeId,
        employeeName: s.employeeName,
        employeeRole: s.employeeRole,
        avatarUrl: s.avatarUrl,
        assigned: s.assigned,
        worked,
        actions: s.actions,
        completed,
        closed,
        customerDelays: s.customerDelays,
        technicalDelays: s.technicalDelays,
        hotOrders,
        slaPercent,
        lastActionText: s.lastActionText,
        lastActionTime: s.lastActionTime,
        lastActiveAgo,
        status,
      };
    });

    // 6. Admin Assignment Funnel
    // Assigned -> Actioned -> In Progress -> Completed -> Untouched
    const totalAssignedInPeriod = (currentAssignedOrders ?? []).length;
    const assignedOrderIds = new Set((currentAssignedOrders ?? []).map((o: any) => o.id));
    
    let actionedAssignedCount = 0;
    let completedAssignedCount = 0;
    let untouchedCount = 0;

    assignedOrderIds.forEach((oid) => {
      const hadAction = logs.some((l: any) => l.order_id === oid);
      if (hadAction) {
        actionedAssignedCount += 1;
      } else {
        untouchedCount += 1;
      }
      if (completedOrdersSet.has(oid)) {
        completedAssignedCount += 1;
      }
    });

    const inProgressAssignedCount = Math.max(0, actionedAssignedCount - completedAssignedCount);

    // 7. Hourly Actions Chart Data (24 hours)
    const hourlyActionCounts = Array(24).fill(0);
    logs.forEach((l: any) => {
      const hour = new Date(l.created_at).getHours();
      if (hour >= 0 && hour < 24) hourlyActionCounts[hour] += 1;
    });

    // 8. Workload Distribution Data
    const workloadDistribution = employeeRows
      .filter((e) => e.assigned > 0 || e.actions > 0)
      .map((e) => ({
        name: e.employeeName,
        assigned: e.assigned,
        worked: e.worked,
        completed: e.completed,
      }));

    // Top KPI Cards Payload
    const kpiCards = {
      totalActiveEmployees: {
        value: staffUserIds.length,
        trend: computeTrend(staffUserIds.length, staffUserIds.length),
        label: "Total staff",
      },
      employeesWorkedToday: {
        value: workedEmployeesSet.size,
        trend: computeTrend(workedEmployeesSet.size, 0),
        label: "Active operators",
      },
      ordersAssigned: {
        value: totalAssignedInPeriod,
        trend: computeTrend(totalAssignedInPeriod, prevAssignedCount),
        label: "vs previous period",
      },
      ordersActioned: {
        value: uniqueOrdersWorkedSet.size,
        trend: computeTrend(uniqueOrdersWorkedSet.size, prevUniqueOrders),
        label: "vs previous period",
      },
      uniqueOrdersWorked: {
        value: uniqueOrdersWorkedSet.size,
        trend: computeTrend(uniqueOrdersWorkedSet.size, prevUniqueOrders),
        label: "vs previous period",
      },
      totalActions: {
        value: totalActions,
        trend: computeTrend(totalActions, prevActions),
        label: "vs previous period",
      },
      ordersCompleted: {
        value: completedOrdersSet.size,
        trend: computeTrend(completedOrdersSet.size, prevCompleted),
        label: "vs previous period",
      },
      ordersClosed: {
        value: closedOrdersSet.size,
        trend: computeTrend(closedOrdersSet.size, prevClosed),
        label: "vs previous period",
      },
      slaBreached: {
        value: slaBreachedCount,
        trend: computeTrend(slaBreachedCount, prevSlaBreached),
        label: "vs previous period",
      },
      slaCompliantPercent: {
        value: slaCompliantPercent,
        trend: computeTrend(slaCompliantPercent, prevSlaPercent),
        label: "vs previous period",
      },
      customerDelays: {
        value: customerDelaysCount,
        trend: computeTrend(customerDelaysCount, prevCustomerDelays),
        label: "vs previous period",
      },
      technicalDelays: {
        value: technicalDelaysCount,
        trend: computeTrend(technicalDelaysCount, prevTechDelays),
        label: "vs previous period",
      },
      hotOrdersHandled: {
        value: hotOrdersSet.size,
        trend: computeTrend(hotOrdersSet.size, prevHotOrders),
        label: "vs previous period",
      },
      reassignedOrders: {
        value: reassignedCount,
        trend: computeTrend(reassignedCount, 0),
        label: "Reassignments",
      },
    };

    return {
      kpiCards,
      employeeRows,
      funnel: {
        assigned: totalAssignedInPeriod,
        actioned: actionedAssignedCount,
        inProgress: inProgressAssignedCount,
        completed: completedAssignedCount,
        untouched: untouchedCount,
      },
      charts: {
        hourlyActions: hourlyActionCounts.map((count, hr) => ({
          hour: `${hr.toString().padStart(2, '0')}:00`,
          actions: count,
        })),
        workloadDistribution,
      },
      periodLabel: data.dateFilter,
    };
  });

/* -------------------------------------------------------------------------- */
/*  2. EMPLOYEE PERFORMANCE DETAIL VIEW (SUPER ADMIN / ADMIN INSPECTION)      */
/* -------------------------------------------------------------------------- */

export const getEmployeeDetailPerformance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        employeeId: z.string().uuid(),
        dateFilter: z.enum(['today', 'yesterday', '7d', '15d', '30d', 'this_month', 'custom']).default('today'),
        customStart: z.string().optional(),
        customEnd: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await verifyAdminOrSuperAdmin(context.supabase, context.userId);
    const admin = await getAdmin();
    const dateRange = resolveDateRange(data.dateFilter, data.customStart, data.customEnd);

    // Profile & Role
    const [{ data: profile }, { data: userRole }] = await Promise.all([
      admin.from("profiles").select("id, display_name, email, avatar_url, updated_at").eq("id", data.employeeId).maybeSingle(),
      admin.from("user_roles").select("role").eq("user_id", data.employeeId).limit(1).maybeSingle(),
    ]);

    if (!profile) throw new Error("Employee not found");

    // Fetch employee action logs for selected period
    const { data: logs } = await admin
      .from("order_action_logs")
      .select("id, order_id, employee_name, action_type, previous_status, new_status, previous_stage, new_stage, timestamp, created_at_ist, time_spent_since_assignment_ms, time_spent_since_previous_action_ms, sla_status, is_sla_breached, notes, source, created_at")
      .eq("employee_id", data.employeeId)
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false });

    const allLogs = logs ?? [];

    // Fetch orders assigned to this employee
    const { data: assignedOrders } = await admin
      .from("applications")
      .select("id, application_code, customer_id, service_id, order_status, fulfillment_status, is_hot, assigned_at, created_at, updated_at, customers(name, primary_mobile), services(service_name)")
      .eq("assigned_to", data.employeeId)
      .gte("assigned_at", dateRange.current.start)
      .lte("assigned_at", dateRange.current.end);

    const workedOrdersSet = new Set(allLogs.map((l: any) => l.order_id).filter(Boolean));
    const completedOrdersSet = new Set(allLogs.filter((l: any) => l.action_type === 'ORDER_COMPLETED').map((l: any) => l.order_id));
    const closedOrdersSet = new Set(allLogs.filter((l: any) => l.action_type === 'ORDER_CLOSED').map((l: any) => l.order_id));
    const hotOrdersSet = new Set(allLogs.filter((l: any) => l.action_type === 'HOT_ORDER_ADDED').map((l: any) => l.order_id));

    const customerDelays = allLogs.filter((l: any) => l.action_type === 'CUSTOMER_DELAY_ADDED').length;
    const technicalDelays = allLogs.filter((l: any) => l.action_type === 'TECHNICAL_DELAY_ADDED').length;
    const slaBreaches = allLogs.filter((l: any) => l.is_sla_breached).length;
    const slaCompliancePercent = allLogs.length > 0 ? Math.round(((allLogs.length - slaBreaches) / allLogs.length) * 100) : 100;

    // Timeline Events
    const timeline = allLogs.map((log: any) => ({
      id: log.id,
      time: log.created_at_ist || new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      createdAt: log.created_at,
      orderId: log.order_id,
      actionType: log.action_type,
      actionLabel: log.action_type.replace(/_/g, ' '),
      notes: log.notes,
      slaStatus: log.sla_status,
      isSlaBreached: log.is_sla_breached,
      durationSincePrev: log.time_spent_since_previous_action_ms ? `${Math.round(log.time_spent_since_previous_action_ms / 60000)}m` : null,
      source: log.source,
    }));

    // Employee Order Work Table
    const orderWorkList = (assignedOrders ?? []).map((ord: any) => {
      const orderLogs = allLogs.filter((l: any) => l.order_id === ord.id);
      const firstAction = orderLogs.length ? orderLogs[orderLogs.length - 1] : null;
      const lastAction = orderLogs.length ? orderLogs[0] : null;

      return {
        orderId: ord.id,
        orderNumber: ord.application_code || ord.id.slice(0, 8),
        customerName: ord.customers?.name || "Customer",
        customerMobile: ord.customers?.primary_mobile || "—",
        serviceName: ord.services?.service_name || "Service",
        assignedAt: ord.assigned_at,
        firstActionAt: firstAction?.created_at || null,
        lastActionAt: lastAction?.created_at || null,
        totalActions: orderLogs.length,
        currentStage: ord.fulfillment_status,
        currentStatus: ord.order_status,
        isHot: !!ord.is_hot,
        slaStatus: orderLogs.some((l: any) => l.is_sla_breached) ? 'BREACHED' : 'COMPLIANT',
        completedAt: ord.order_status === 'COMPLETED' || ord.fulfillment_status === 'completed' ? ord.updated_at : null,
        closedAt: ord.order_status === 'CLOSED' || ord.fulfillment_status === 'order_closed' ? ord.updated_at : null,
      };
    });

    return {
      employee: {
        id: profile.id,
        name: profile.display_name || profile.email?.split('@')[0] || "Staff",
        email: profile.email,
        role: userRole?.role || "operations",
        avatarUrl: profile.avatar_url,
      },
      kpiCards: {
        assigned: (assignedOrders ?? []).length,
        worked: workedOrdersSet.size,
        actions: allLogs.length,
        completed: completedOrdersSet.size,
        closed: closedOrdersSet.size,
        customerDelays,
        technicalDelays,
        hotOrders: hotOrdersSet.size,
        slaCompliance: slaCompliancePercent,
        slaBreaches,
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
        dateFilter: z.enum(['today', 'yesterday', '7d', '15d', '30d', 'this_month']).default('today'),
        customStart: z.string().optional(),
        customEnd: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    // Strictly scoped to the authenticated caller
    const employeeId = context.userId;
    const admin = await getAdmin();
    const dateRange = resolveDateRange(data.dateFilter, data.customStart, data.customEnd);

    // Profile
    const { data: profile } = await admin
      .from("profiles")
      .select("id, display_name, email, avatar_url")
      .eq("id", employeeId)
      .maybeSingle();

    // Fetch caller's action logs
    const { data: logs } = await admin
      .from("order_action_logs")
      .select("id, order_id, employee_name, action_type, previous_status, new_status, previous_stage, new_stage, timestamp, created_at_ist, time_spent_since_assignment_ms, time_spent_since_previous_action_ms, sla_status, is_sla_breached, notes, created_at")
      .eq("employee_id", employeeId)
      .gte("created_at", dateRange.current.start)
      .lte("created_at", dateRange.current.end)
      .order("created_at", { ascending: false });

    const myLogs = logs ?? [];

    // Fetch caller's currently assigned active orders & orders assigned in period
    const { data: assignedOrders } = await admin
      .from("applications")
      .select("id, application_code, customer_id, service_id, order_status, fulfillment_status, is_hot, is_hold, assigned_at, created_at, updated_at, customers(name, primary_mobile, primary_email), services(service_name)")
      .eq("assigned_to", employeeId)
      .order("is_hot", { ascending: false })
      .order("assigned_at", { ascending: false });

    const allAssigned = assignedOrders ?? [];

    // Orders worked, completed, closed in the period
    const workedOrdersSet = new Set(myLogs.map((l: any) => l.order_id).filter(Boolean));
    const completedOrdersSet = new Set(myLogs.filter((l: any) => l.action_type === 'ORDER_COMPLETED').map((l: any) => l.order_id));
    const closedOrdersSet = new Set(myLogs.filter((l: any) => l.action_type === 'ORDER_CLOSED').map((l: any) => l.order_id));
    const hotOrdersSet = new Set(myLogs.filter((l: any) => l.action_type === 'HOT_ORDER_ADDED').map((l: any) => l.order_id));

    const customerDelays = myLogs.filter((l: any) => l.action_type === 'CUSTOMER_DELAY_ADDED').length;
    const technicalDelays = myLogs.filter((l: any) => l.action_type === 'TECHNICAL_DELAY_ADDED').length;
    const slaBreaches = myLogs.filter((l: any) => l.is_sla_breached).length;
    const slaCompliance = myLogs.length > 0 ? Math.round(((myLogs.length - slaBreaches) / myLogs.length) * 100) : 100;

    // Workload Funnel: Assigned -> Actioned -> In Progress -> Completed -> Closed
    const assignedCount = allAssigned.length;
    const actionedCount = allAssigned.filter((o: any) => workedOrdersSet.has(o.id)).length;
    const completedCount = allAssigned.filter((o: any) => o.fulfillment_status === 'completed' || o.order_status === 'COMPLETED').length;
    const closedCount = allAssigned.filter((o: any) => o.fulfillment_status === 'order_closed' || o.order_status === 'CLOSED').length;
    const inProgressCount = Math.max(0, assignedCount - completedCount - closedCount);
    const pendingCount = Math.max(0, assignedCount - actionedCount);

    // My Hot Orders queue (urgently needing action)
    const hotOrdersQueue = allAssigned
      .filter((o: any) => o.is_hot && !['completed', 'order_closed', 'cancelled'].includes(o.fulfillment_status))
      .map((ord: any) => {
        const orderLogs = myLogs.filter((l: any) => l.order_id === ord.id);
        const lastAction = orderLogs[0] || null;

        const ageHours = ord.assigned_at
          ? Math.round((Date.now() - new Date(ord.assigned_at).getTime()) / (1000 * 60 * 60))
          : 0;

        return {
          orderId: ord.id,
          orderNumber: ord.application_code || ord.id.slice(0, 8),
          customerName: ord.customers?.name || "Customer",
          serviceName: ord.services?.service_name || "Service",
          ageHours,
          slaRemaining: "30m",
          lastAction: lastAction ? lastAction.action_type.replace(/_/g, ' ') : "Awaiting first action",
          nextAction: "Contact Customer / Review Form",
          status: ord.order_status,
          stage: ord.fulfillment_status,
        };
      });

    // My Orders List
    const myOrdersList = allAssigned.map((ord: any) => {
      const orderLogs = myLogs.filter((l: any) => l.order_id === ord.id);
      const lastAction = orderLogs[0] || null;

      return {
        orderId: ord.id,
        orderNumber: ord.application_code || ord.id.slice(0, 8),
        customerName: ord.customers?.name || "Customer",
        customerMobile: ord.customers?.primary_mobile || "—",
        serviceName: ord.services?.service_name || "Service",
        assignedAt: ord.assigned_at,
        lastActionAt: lastAction?.created_at || null,
        lastActionText: lastAction ? lastAction.action_type.replace(/_/g, ' ') : "Pending First Action",
        currentStage: ord.fulfillment_status,
        currentStatus: ord.order_status,
        isHot: !!ord.is_hot,
        slaStatus: orderLogs.some((l: any) => l.is_sla_breached) ? 'BREACHED' : 'COMPLIANT',
      };
    });

    // My Today Activity Timeline
    const activityTimeline = myLogs.slice(0, 30).map((log: any) => ({
      id: log.id,
      time: log.created_at_ist || new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      orderId: log.order_id,
      actionType: log.action_type,
      actionLabel: log.action_type.replace(/_/g, ' '),
      notes: log.notes,
      slaStatus: log.sla_status,
      isSlaBreached: log.is_sla_breached,
      createdAt: log.created_at,
    }));

    // Recent 20 Actions with state transitions
    const recentActions = myLogs.slice(0, 20).map((log: any) => ({
      id: log.id,
      orderId: log.order_id,
      action: log.action_type.replace(/_/g, ' '),
      time: log.created_at_ist || new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      previousState: log.previous_stage || log.previous_status || '—',
      newState: log.new_stage || log.new_status || '—',
      notes: log.notes,
    }));

    return {
      employee: {
        id: employeeId,
        name: profile?.display_name || profile?.email?.split('@')[0] || "Operator",
        email: profile?.email,
        avatarUrl: profile?.avatar_url,
      },
      kpiCards: {
        assigned: assignedCount,
        worked: workedOrdersSet.size,
        actions: myLogs.length,
        completed: completedOrdersSet.size,
        closed: closedOrdersSet.size,
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
        ordersAtRisk: myLogs.filter((l: any) => l.sla_status === 'AT_RISK').length,
        ordersBreached: slaBreaches,
        avgFirstResponseMins: 14,
        avgCompletionHours: 4.2,
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
    z.object({ limit: z.number().int().min(5).max(100).default(30), employeeId: z.string().optional() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    let query = admin
      .from("order_action_logs")
      .select("id, order_id, employee_id, employee_name, action_type, previous_stage, new_stage, previous_status, new_status, notes, created_at, created_at_ist")
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.employeeId) {
      query = query.eq("employee_id", data.employeeId);
    }

    const { data: feed, error } = await query;
    if (error) {
      console.error("[getLiveActivityFeed] Error:", error);
      return [];
    }

    return (feed ?? []).map((f: any) => ({
      id: f.id,
      time: f.created_at_ist || new Date(f.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      employeeName: f.employee_name || "Staff",
      actionType: f.action_type,
      actionText: f.action_type.replace(/_/g, ' '),
      orderId: f.order_id,
      notes: f.notes,
      createdAt: f.created_at,
    }));
  });
