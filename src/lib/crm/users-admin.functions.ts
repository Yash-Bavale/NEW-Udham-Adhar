// Admin-only user/workforce management.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ASSIGNABLE_ROLES, type Role } from "@/lib/roles";
import {
  type EmploymentStatus,
  type WorkSchedule,
  calculateStaffWorkloads,
  reassignOrdersFromUnavailableEmployee,
} from "./assignment-engine.server";

const ROLE_VALUES = ASSIGNABLE_ROLES as unknown as [string, ...string[]];

const EMPLOYMENT_STATUS_VALUES = ["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED", "ARCHIVED"] as const;

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function assertAdmin(userId: string) {
  const { data, error } = await (await getAdmin())
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "super_admin"]);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Forbidden: admin access required.");
}

/**
 * Lists all staff users with complete employment lifecycle, workload, capacity, presence, and performance metadata.
 */
export const listStaffUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    const { data: usersRes, error: uErr } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (uErr) throw new Error(uErr.message);

    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const monthStartIso = monthStart.toISOString();

    const [
      { data: roles, error: rErr },
      { data: profiles, error: pErr },
      { data: poolRows, error: poolErr },
      { data: leavesRows, error: lErr },
      { data: leadsAssigned, error: laErr },
      { data: appsAssigned, error: aaErr },
      { data: appsCompletedMonth, error: cmErr },
      { data: appsCompletedAll, error: caErr },
    ] = await Promise.all([
      admin.from("user_roles").select("user_id, role"),
      admin.from("profiles").select("id, full_name, display_name, mobile, is_active, email, employee_code, department, joining_date, employment_status, auto_assign_enabled, max_workload, work_schedule, archived_at, terminated_at"),
      admin.from("assignment_pool").select("user_id, is_active, total_assigned, last_assigned_at"),
      admin.from("employee_leaves").select("employee_id, start_time, end_time, status, reason, leave_type").eq("status", "ACTIVE"),
      admin.from("leads").select("assigned_to, status, created_at, updated_at"),
      admin.from("applications").select("assigned_to, application_status, fulfillment_status"),
      admin
        .from("applications")
        .select("assigned_to, updated_at, application_status")
        .eq("application_status", "completed")
        .gte("updated_at", monthStartIso),
      admin
        .from("applications")
        .select("assigned_to, created_at, updated_at, application_status")
        .eq("application_status", "completed"),
    ]);

    if (rErr) throw new Error(rErr.message);
    if (pErr) throw new Error(pErr.message);

    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const list = roleMap.get(r.user_id) ?? [];
      list.push(r.role as string);
      roleMap.set(r.user_id, list);
    });

    const poolMap = new Map<string, any>();
    (poolRows ?? []).forEach((ap: any) => poolMap.set(ap.user_id, ap));

    const nowIso = new Date().toISOString();
    const activeLeavesMap = new Map<string, any>();
    (leavesRows ?? []).forEach((lv: any) => {
      if (lv.start_time <= nowIso && lv.end_time >= nowIso) {
        activeLeavesMap.set(lv.employee_id, lv);
      }
    });

    const profMap = new Map<string, any>();
    (profiles ?? []).forEach((p: any) => profMap.set(p.id, p));

    // Performance aggregates keyed by user_id
    type Perf = {
      assignedLeads: number;
      openLeads: number;
      assignedApps: number;
      openApps: number;
      completedThisMonth: number;
      avgTurnaroundHours: number | null;
    };
    const perf = new Map<string, Perf>();
    const ensure = (id: string): Perf => {
      let p = perf.get(id);
      if (!p) {
        p = { assignedLeads: 0, openLeads: 0, assignedApps: 0, openApps: 0, completedThisMonth: 0, avgTurnaroundHours: null };
        perf.set(id, p);
      }
      return p;
    };
    const OPEN_LEAD = new Set(["new", "lead_received", "documents_pending", "under_process", "under_review"]);
    const OPEN_APP = new Set(["details_pending", "documents_pending", "under_review", "under_process", "awaiting_payment", "payment_done", "form_submitted"]);

    (leadsAssigned ?? []).forEach((l) => {
      if (!l.assigned_to) return;
      const p = ensure(l.assigned_to);
      p.assignedLeads += 1;
      if (OPEN_LEAD.has(String(l.status ?? ""))) p.openLeads += 1;
    });
    (appsAssigned ?? []).forEach((a) => {
      if (!a.assigned_to) return;
      const p = ensure(a.assigned_to);
      p.assignedApps += 1;
      if (OPEN_APP.has(String(a.application_status ?? "")) || OPEN_APP.has(String(a.fulfillment_status ?? ""))) {
        p.openApps += 1;
      }
    });
    (appsCompletedMonth ?? []).forEach((a) => {
      if (!a.assigned_to) return;
      ensure(a.assigned_to).completedThisMonth += 1;
    });

    const turnaroundAgg = new Map<string, { sum: number; n: number }>();
    (appsCompletedAll ?? []).forEach((a) => {
      if (!a.assigned_to || !a.created_at || !a.updated_at) return;
      const ms = new Date(a.updated_at).getTime() - new Date(a.created_at).getTime();
      if (!Number.isFinite(ms) || ms < 0) return;
      const cur = turnaroundAgg.get(a.assigned_to) ?? { sum: 0, n: 0 };
      cur.sum += ms / 3_600_000;
      cur.n += 1;
      turnaroundAgg.set(a.assigned_to, cur);
    });
    turnaroundAgg.forEach((v, id) => {
      const p = ensure(id);
      p.avgTurnaroundHours = v.n ? Math.round((v.sum / v.n) * 10) / 10 : null;
    });

    const rows = usersRes.users.map((u) => {
      const p = profMap.get(u.id);
      const pool = poolMap.get(u.id);
      const leave = activeLeavesMap.get(u.id);
      const stats = perf.get(u.id) ?? {
        assignedLeads: 0,
        openLeads: 0,
        assignedApps: 0,
        openApps: 0,
        completedThisMonth: 0,
        avgTurnaroundHours: null,
      };

      const employmentStatus: EmploymentStatus =
        p?.employment_status ?? (p?.is_active === false ? "INACTIVE" : "ACTIVE");

      const isActive = p?.is_active !== false && employmentStatus === "ACTIVE";
      const autoAssignEnabled = p?.auto_assign_enabled ?? false;
      const isInPool = pool?.is_active ?? false;
      const maxWorkload = Number(p?.max_workload || 50);

      return {
        id: u.id,
        email: u.email ?? "",
        full_name: p?.full_name ?? p?.display_name ?? null,
        mobile: p?.mobile ?? null,
        is_active: isActive,
        employment_status: employmentStatus,
        auto_assign_enabled: autoAssignEnabled,
        is_in_pool: isInPool,
        max_workload: maxWorkload,
        work_schedule: (p?.work_schedule as WorkSchedule) || null,
        is_on_leave: !!leave,
        active_leave: leave ? { leave_type: leave.leave_type, reason: leave.reason, start_time: leave.start_time, end_time: leave.end_time } : null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        archived_at: p?.archived_at ?? null,
        terminated_at: p?.terminated_at ?? null,
        roles: roleMap.get(u.id) ?? [],
        employee_code: p?.employee_code ?? null,
        department: p?.department ?? null,
        joining_date: p?.joining_date ?? null,
        perf: stats,
      };
    });

    return { rows };
  });

/**
 * SuperAdmin Workforce Management Live Dashboard Metrics
 */
export const getWorkforceDashboardMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const workloads = await calculateStaffWorkloads();
    const admin = await getAdmin();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const [todayAssignedRes, todayReassignedRes, unassignedRes] = await Promise.all([
      admin
        .from("order_assignment_history")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayIso)
        .in("change_type", ["AUTO_INITIAL_POOL"]),
      admin
        .from("order_assignment_history")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayIso)
        .in("change_type", ["AUTO_LEAVE", "AUTO_UNAVAILABLE", "AUTO_INACTIVITY", "AUTO_OFFLINE", "AUTO_CAPACITY", "AUTO_TERMINATED", "AUTO_DISABLED"]),
      admin
        .from("applications")
        .select("id", { count: "exact", head: true })
        .is("assigned_to", null)
        .eq("is_deleted", false)
        .not("fulfillment_status", "in", '("completed","order_completed","order_closed","cancelled")'),
    ]);

    const totalEmployees = workloads.length;
    const activeEmployees = workloads.filter((w) => w.employmentStatus === "ACTIVE").length;
    const onLeaveEmployees = workloads.filter((w) => w.presenceStatus === "ON_LEAVE").length;
    const availableEmployees = workloads.filter((w) => w.presenceStatus === "AVAILABLE").length;
    const idleEmployees = workloads.filter((w) => w.presenceStatus === "IDLE").length;
    const awayEmployees = workloads.filter((w) => w.presenceStatus === "AWAY").length;
    const offlineEmployees = workloads.filter((w) => w.presenceStatus === "OFFLINE").length;
    const inactiveEmployees = workloads.filter((w) => w.employmentStatus !== "ACTIVE").length;

    const poolMembers = workloads.filter((w) => w.isAutoAssignEligible || w.employmentStatus === "ACTIVE").length;
    const poolAvailable = workloads.filter((w) => w.isAutoAssignEligible).length;
    const poolUnavailable = poolMembers - poolAvailable;

    const totalCapacity = workloads.reduce((sum, w) => sum + (w.employmentStatus === "ACTIVE" ? w.maxWorkload : 0), 0);
    const usedCapacity = workloads.reduce((sum, w) => sum + (w.employmentStatus === "ACTIVE" ? w.activeActionOrders : 0), 0);

    return {
      workforce: {
        total: totalEmployees,
        active: activeEmployees,
        onLeave: onLeaveEmployees,
        available: availableEmployees,
        idle: idleEmployees,
        away: awayEmployees,
        offline: offlineEmployees,
        inactive: inactiveEmployees,
      },
      pool: {
        totalMembers: poolMembers,
        available: poolAvailable,
        unavailable: poolUnavailable,
        totalCapacity,
        usedCapacity,
        remainingCapacity: Math.max(0, totalCapacity - usedCapacity),
      },
      today: {
        autoAssignedToday: todayAssignedRes.count ?? 0,
        autoReassignedToday: todayReassignedRes.count ?? 0,
        unassignedOrders: unassignedRes.count ?? 0,
      },
      workloads,
    };
  });

const InviteInput = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  mobile: z.string().trim().max(20).optional().nullable(),
  role: z.enum(ROLE_VALUES),
  department: z.string().trim().max(120).optional().nullable(),
  max_workload: z.number().int().min(5).max(200).default(50),
  auto_assign_enabled: z.boolean().default(false), // New employees default to OFF per spec!
  password: z.string().min(8).max(72).optional(),
});

function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + "!9";
}

/**
 * Creates a new employee with explicit lifecycle fields, defaulting Auto Assignment to OFF.
 */
export const inviteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => InviteInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    const tempPassword = data.password ?? generateTempPassword();
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { display_name: data.full_name },
    });
    if (cErr) throw new Error(cErr.message);
    const newUser = created.user;
    if (!newUser) throw new Error("User creation did not return a user.");

    // Upsert profile with Employment Status ACTIVE, but auto_assign_enabled OFF
    const { error: pErr } = await admin.from("profiles").upsert({
      id: newUser.id,
      email: data.email,
      display_name: data.full_name,
      full_name: data.full_name,
      mobile: data.mobile ?? null,
      is_active: true,
      employment_status: "ACTIVE",
      department: data.department ?? null,
      auto_assign_enabled: data.auto_assign_enabled,
      max_workload: data.max_workload,
    }, { onConflict: "id" });
    if (pErr) throw new Error(pErr.message);

    // Grant role
    const { error: rErr } = await admin.from("user_roles").upsert(
      { user_id: newUser.id, role: data.role as Role },
      { onConflict: "user_id,role" },
    );
    if (rErr) throw new Error(rErr.message);

    return { ok: true, user_id: newUser.id, email: data.email, temp_password: tempPassword };
  });

const UpdateInput = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().trim().min(1).max(120).optional(),
  mobile: z.string().trim().max(20).optional().nullable(),
  role: z.enum(ROLE_VALUES).optional(),
  department: z.string().trim().max(120).optional().nullable(),
  joining_date: z.string().trim().max(20).optional().nullable(),
  max_workload: z.number().int().min(5).max(200).optional(),
  auto_assign_enabled: z.boolean().optional(),
});

export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UpdateInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();
    const patch: any = {};
    if (data.full_name !== undefined) {
      patch.full_name = data.full_name;
      patch.display_name = data.full_name;
    }
    if (data.mobile !== undefined) patch.mobile = data.mobile;
    if (data.department !== undefined) patch.department = data.department;
    if (data.joining_date !== undefined) patch.joining_date = data.joining_date || null;
    if (data.max_workload !== undefined) patch.max_workload = data.max_workload;
    if (data.auto_assign_enabled !== undefined) patch.auto_assign_enabled = data.auto_assign_enabled;

    if (Object.keys(patch).length) {
      const { error } = await admin.from("profiles").update(patch).eq("id", data.user_id);
      if (error) throw new Error(error.message);
    }
    if (data.role) {
      const { error: dErr } = await admin.from("user_roles").delete().eq("user_id", data.user_id);
      if (dErr) throw new Error(dErr.message);
      const { error: iErr } = await admin.from("user_roles").insert({ user_id: data.user_id, role: data.role as Role });
      if (iErr) throw new Error(iErr.message);
    }
    return { ok: true };
  });

/**
 * SuperAdmin Employment Status Lifecycle Controller
 */
const EmploymentStatusInput = z.object({
  user_id: z.string().uuid(),
  status: z.enum(EMPLOYMENT_STATUS_VALUES),
  reason: z.string().optional(),
});

export const setEmploymentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => EmploymentStatusInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    const isNowActive = data.status === "ACTIVE";
    const nowIso = new Date().toISOString();

    const patch: any = {
      employment_status: data.status,
      is_active: isNowActive,
    };

    if (data.status === "ARCHIVED") {
      patch.archived_at = nowIso;
      patch.auto_assign_enabled = false;
    } else if (data.status === "TERMINATED") {
      patch.terminated_at = nowIso;
      patch.auto_assign_enabled = false;
    } else if (data.status === "ACTIVE") {
      patch.archived_at = null;
      patch.terminated_at = null;
    }

    const { error: pErr } = await admin.from("profiles").update(patch).eq("id", data.user_id);
    if (pErr) throw new Error(pErr.message);

    // Sync auth ban
    await admin.auth.admin.updateUserById(data.user_id, {
      ban_duration: isNowActive ? "none" : "876000h",
    } as never);

    // Sync assignment_pool table
    if (!isNowActive) {
      await admin.from("assignment_pool").update({ is_active: false }).eq("user_id", data.user_id);

      // Automatically redistribute open action orders
      try {
        await reassignOrdersFromUnavailableEmployee({
          unavailableEmployeeId: data.user_id,
          reason: `Employee status changed to ${data.status} (${data.reason || "Administrative action"})`,
          changeType: data.status === "TERMINATED" ? "AUTO_TERMINATED" : "AUTO_DISABLED",
          actorId: context.userId,
        });
      } catch (err) {
        console.warn("[setEmploymentStatus] Auto-reassign warning:", err);
      }
    }

    return { ok: true };
  });

/**
 * SuperAdmin Auto-Assignment Toggle for an Employee
 */
export const toggleEmployeeAutoAssign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid(), enabled: z.boolean() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    const { error: pErr } = await admin
      .from("profiles")
      .update({ auto_assign_enabled: data.enabled })
      .eq("id", data.user_id);
    if (pErr) throw new Error(pErr.message);

    // Also update assignment_pool table
    await admin
      .from("assignment_pool")
      .update({ is_active: data.enabled })
      .eq("user_id", data.user_id);

    return { ok: true };
  });

/**
 * Safe Archiving Controller: Replaces destructive deletion with historical archiving.
 */
export const archiveEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid(), reason: z.string().optional() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    if (data.user_id === context.userId) {
      throw new Error("You cannot archive your own account.");
    }

    const nowIso = new Date().toISOString();

    // 1. Mark profile as ARCHIVED
    await admin.from("profiles").update({
      employment_status: "ARCHIVED",
      is_active: false,
      auto_assign_enabled: false,
      archived_at: nowIso,
    }).eq("id", data.user_id);

    // 2. Disable assignment pool membership
    await admin.from("assignment_pool").update({ is_active: false }).eq("user_id", data.user_id);

    // 3. Suspend auth login
    await admin.auth.admin.updateUserById(data.user_id, { ban_duration: "876000h" } as never);

    // 4. Automatically redistribute action-required orders
    try {
      await reassignOrdersFromUnavailableEmployee({
        unavailableEmployeeId: data.user_id,
        reason: `Employee archived by administrator (${data.reason || "Staff departure"})`,
        changeType: "AUTO_TERMINATED",
        actorId: context.userId,
      });
    } catch (err) {
      console.warn("[archiveEmployee] Auto-reassign warning:", err);
    }

    return { ok: true };
  });

/**
 * Safe Delete: If user has ZERO historical data, allow permanent deletion.
 * If user has historical records, gracefully archives them instead to protect historical foreign keys.
 */
export const deleteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();

    if (data.user_id === context.userId) {
      throw new Error("You cannot delete your own account.");
    }

    // Check if user has ANY historical records in applications, leads, or history
    const [appCount, leadCount, historyCount] = await Promise.all([
      admin.from("applications").select("id", { count: "exact", head: true }).eq("assigned_to", data.user_id),
      admin.from("leads").select("id", { count: "exact", head: true }).eq("assigned_to", data.user_id),
      admin.from("order_assignment_history").select("id", { count: "exact", head: true }).or(`new_employee_id.eq.${data.user_id},previous_employee_id.eq.${data.user_id}`),
    ]);

    const totalRefs = (appCount.count ?? 0) + (leadCount.count ?? 0) + (historyCount.count ?? 0);

    if (totalRefs > 0) {
      // User has historical records. Do NOT destructively delete! Safely archive instead.
      await admin.from("profiles").update({
        employment_status: "ARCHIVED",
        is_active: false,
        auto_assign_enabled: false,
        archived_at: new Date().toISOString(),
      }).eq("id", data.user_id);

      await admin.from("assignment_pool").update({ is_active: false }).eq("user_id", data.user_id);
      await admin.auth.admin.updateUserById(data.user_id, { ban_duration: "876000h" } as never);

      await reassignOrdersFromUnavailableEmployee({
        unavailableEmployeeId: data.user_id,
        reason: "Employee archived to preserve historical order records",
        changeType: "AUTO_TERMINATED",
        actorId: context.userId,
      });

      return { ok: true, mode: "archived", message: "Employee had historical orders and was securely archived instead of deleted." };
    }

    // Fresh user with 0 historical associations — safe to hard-delete
    await Promise.all([
      admin.from("user_permissions").delete().eq("user_id", data.user_id),
      admin.from("user_permission_scopes").delete().eq("user_id", data.user_id),
      admin.from("user_roles").delete().eq("user_id", data.user_id),
      admin.from("assignment_pool").delete().eq("user_id", data.user_id),
      admin.from("profiles").delete().eq("id", data.user_id),
    ]);

    const { error: dErr } = await admin.auth.admin.deleteUser(data.user_id);
    if (dErr) throw new Error(dErr.message);

    return { ok: true, mode: "deleted" };
  });

export const setEmployeeActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid(), is_active: z.boolean() }).parse(i))
  .handler(async ({ data, context }) => {
    return setEmploymentStatus({
      data: {
        user_id: data.user_id,
        status: data.is_active ? "ACTIVE" : "INACTIVE",
        reason: data.is_active ? "Account activated" : "Account deactivated",
      },
    });
  });

export const resetEmployeePassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid(), new_password: z.string().min(8).max(72) }).parse(i))
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const { data: roles, error: rErr } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "super_admin");
    if (rErr) throw new Error(rErr.message);
    if (!roles || roles.length === 0) throw new Error("Forbidden: super_admin only.");

    const { error: uErr } = await admin.auth.admin.updateUserById(data.user_id, {
      password: data.new_password,
    });
    if (uErr) throw new Error(uErr.message);

    return { ok: true };
  });

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid(), role: z.enum(ROLE_VALUES) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await (await getAdmin())
      .from("user_roles")
      .upsert({ user_id: data.user_id, role: data.role as Role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const revokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid(), role: z.enum(ROLE_VALUES) }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await (await getAdmin())
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .eq("role", data.role as Role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const WORK_MODULES = ["work.leads", "work.orders", "work.support", "work.finance"] as const;

export const getEmployeeWorkAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ user_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();
    const [perms, scopes, ws, svcs] = await Promise.all([
      admin.from("user_permissions").select("module_key, can_view").eq("user_id", data.user_id).in("module_key", WORK_MODULES as unknown as string[]),
      admin.from("user_permission_scopes").select("module_key, website_id, service_id").eq("user_id", data.user_id).in("module_key", WORK_MODULES as unknown as string[]),
      admin.from("websites").select("id, name, domain, is_active").order("sort_order", { ascending: true }),
      admin.from("services").select("id, service_code, service_name, website_id, is_active").order("sort_order", { ascending: true }),
    ]);
    const permMap: Record<string, boolean> = {};
    for (const m of WORK_MODULES) permMap[m] = false;
    (perms.data ?? []).forEach((p: any) => { permMap[p.module_key] = !!p.can_view; });
    const websiteScopes: Record<string, string[]> = {};
    const serviceScopes: Record<string, string[]> = {};
    for (const m of WORK_MODULES) { websiteScopes[m] = []; serviceScopes[m] = []; }
    (scopes.data ?? []).forEach((s: any) => {
      if (s.website_id) websiteScopes[s.module_key]?.push(s.website_id);
      if (s.service_id) serviceScopes[s.module_key]?.push(s.service_id);
    });
    return {
      permissions: permMap,
      websiteScopes,
      serviceScopes,
      websites: ws.data ?? [],
      services: svcs.data ?? [],
    };
  });

export const setEmployeeWorkAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      user_id: z.string().uuid(),
      work: z.object({
        "work.leads": z.boolean().default(false),
        "work.orders": z.boolean().default(false),
        "work.support": z.boolean().default(false),
        "work.finance": z.boolean().default(false),
      }),
      websites: z.array(z.string().uuid()).default([]),
      services: z.array(z.string().uuid()).default([]),
    }).parse(i)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = await getAdmin();
    const MODULE_KEY_PAIRS: Record<string, string[]> = {
      "work.leads": ["work.leads", "leads"],
      "work.orders": ["work.orders", "orders"],
      "work.support": ["work.support", "support", "tickets", "complaints"],
      "work.finance": ["work.finance", "finance", "payments", "invoices"],
    };

    const allKeysToReset: string[] = [];
    for (const m of WORK_MODULES) {
      const can = !!data.work[m];
      const keysToSync = MODULE_KEY_PAIRS[m] || [m];
      for (const k of keysToSync) {
        allKeysToReset.push(k);
        await admin.from("user_permissions").upsert({
          user_id: data.user_id,
          module_key: k,
          can_view: can,
          can_create: false,
          can_edit: false,
          can_delete: false,
          scope_all: data.websites.length === 0 && data.services.length === 0,
        }, { onConflict: "user_id,module_key" });
      }
    }

    await admin.from("user_permission_scopes")
      .delete()
      .eq("user_id", data.user_id)
      .in("module_key", allKeysToReset as never);

    const rows: Array<{ user_id: string; module_key: string; website_id?: string; service_id?: string }> = [];
    for (const m of WORK_MODULES) {
      if (!data.work[m]) continue;
      const keysToSync = MODULE_KEY_PAIRS[m] || [m];
      for (const k of keysToSync) {
        for (const w of data.websites) rows.push({ user_id: data.user_id, module_key: k, website_id: w });
        for (const s of data.services) rows.push({ user_id: data.user_id, module_key: k, service_id: s });
      }
    }
    if (rows.length) {
      await admin.from("user_permission_scopes").insert(rows as never);
    }
    return { ok: true };
  });

export const getMyStaffRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const admin = await getAdmin();
    const { data, error } = await admin.from("user_roles").select("role").eq("user_id", userId);
    if (error) throw new Error(error.message);
    const { data: prof } = await admin
      .from("profiles")
      .select("display_name, full_name")
      .eq("id", userId)
      .maybeSingle();
    return {
      userId,
      roles: (data ?? []).map((r) => r.role as string),
      displayName: (prof?.display_name || prof?.full_name || null) as string | null,
    };
  });
