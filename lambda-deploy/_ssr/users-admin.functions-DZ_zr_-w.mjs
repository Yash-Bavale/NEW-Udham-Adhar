import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { A as ASSIGNABLE_ROLES } from "./roles-CFhgFhhh.mjs";
import { calculateStaffWorkloads, reassignOrdersFromUnavailableEmployee } from "./assignment-engine.server--SlhbLzd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, n as number, _ as _enum, a as array } from "../_libs/zod.mjs";
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
import "./client.server-3kDCe7R3.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
import "./order-action-logger.server-DJE-NEoc.mjs";
import "./emit.server-OhKEr4hO.mjs";
const ROLE_VALUES = ASSIGNABLE_ROLES;
const EMPLOYMENT_STATUS_VALUES = ["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED", "ARCHIVED"];
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function assertAdmin(userId) {
  const {
    data,
    error
  } = await (await getAdmin()).from("user_roles").select("role").eq("user_id", userId).in("role", ["admin", "super_admin"]);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Forbidden: admin access required.");
}
const listStaffUsers_createServerFn_handler = createServerRpc({
  id: "16b48c19c873a3820188a883fc9714851723be9892c780834083f3dfabad21c4",
  name: "listStaffUsers",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => listStaffUsers.__executeServer(opts));
const listStaffUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listStaffUsers_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  const adminAny = admin;
  const monthStart = /* @__PURE__ */ new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const monthStartIso = monthStart.toISOString();
  const [{
    data: roles,
    error: rErr
  }, {
    data: profiles,
    error: pErr
  }, {
    data: poolRows,
    error: poolErr
  }, {
    data: leavesRows,
    error: lErr
  }, {
    data: leadsAssigned,
    error: laErr
  }, {
    data: appsAssigned,
    error: aaErr
  }, {
    data: appsCompletedMonth,
    error: cmErr
  }, {
    data: appsCompletedAll,
    error: caErr
  }] = await Promise.all([admin.from("user_roles").select("user_id, role"), adminAny.from("profiles").select("*"), admin.from("assignment_pool").select("user_id, is_active, total_assigned, last_assigned_at"), adminAny.from("employee_leaves").select("employee_id, start_time, end_time, status, reason, leave_type").eq("status", "ACTIVE"), admin.from("leads").select("assigned_to, status, created_at, updated_at"), admin.from("applications").select("assigned_to, application_status, fulfillment_status"), admin.from("applications").select("assigned_to, updated_at, application_status").eq("application_status", "completed").gte("updated_at", monthStartIso), admin.from("applications").select("assigned_to, created_at, updated_at, application_status").eq("application_status", "completed")]);
  if (rErr) throw new Error(rErr.message);
  if (pErr) throw new Error(pErr.message);
  const authUserMap = /* @__PURE__ */ new Map();
  try {
    const {
      data: usersRes
    } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 500
    });
    (usersRes?.users ?? []).forEach((u) => authUserMap.set(u.id, u));
  } catch (authErr) {
    console.warn("[listStaffUsers] auth.admin.listUsers failed, falling back to profile records:", authErr);
  }
  const roleMap = /* @__PURE__ */ new Map();
  const staffRoleUserIds = /* @__PURE__ */ new Set();
  (roles ?? []).forEach((r) => {
    const list = roleMap.get(r.user_id) ?? [];
    list.push(r.role);
    roleMap.set(r.user_id, list);
    staffRoleUserIds.add(r.user_id);
  });
  const poolMap = /* @__PURE__ */ new Map();
  (poolRows ?? []).forEach((ap) => poolMap.set(ap.user_id, ap));
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const activeLeavesMap = /* @__PURE__ */ new Map();
  (leavesRows ?? []).forEach((lv) => {
    if (lv.start_time <= nowIso && lv.end_time >= nowIso) {
      activeLeavesMap.set(lv.employee_id, lv);
    }
  });
  const perf = /* @__PURE__ */ new Map();
  const ensure = (id) => {
    let p = perf.get(id);
    if (!p) {
      p = {
        assignedLeads: 0,
        openLeads: 0,
        assignedApps: 0,
        openApps: 0,
        completedThisMonth: 0,
        avgTurnaroundHours: null
      };
      perf.set(id, p);
    }
    return p;
  };
  const OPEN_LEAD = /* @__PURE__ */ new Set(["new", "lead_received", "documents_pending", "under_process", "under_review"]);
  const OPEN_APP = /* @__PURE__ */ new Set(["details_pending", "documents_pending", "under_review", "under_process", "awaiting_payment", "payment_done", "form_submitted"]);
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
  const turnaroundAgg = /* @__PURE__ */ new Map();
  (appsCompletedAll ?? []).forEach((a) => {
    if (!a.assigned_to || !a.created_at || !a.updated_at) return;
    const ms = new Date(a.updated_at).getTime() - new Date(a.created_at).getTime();
    if (!Number.isFinite(ms) || ms < 0) return;
    const cur = turnaroundAgg.get(a.assigned_to) ?? {
      sum: 0,
      n: 0
    };
    cur.sum += ms / 36e5;
    cur.n += 1;
    turnaroundAgg.set(a.assigned_to, cur);
  });
  turnaroundAgg.forEach((v, id) => {
    const p = ensure(id);
    p.avgTurnaroundHours = v.n ? Math.round(v.sum / v.n * 10) / 10 : null;
  });
  const targetProfiles = (profiles ?? []).filter((p) => {
    if (!p.id) return false;
    if (staffRoleUserIds.size > 0 && staffRoleUserIds.has(p.id)) return true;
    if (poolMap.has(p.id)) return true;
    return staffRoleUserIds.size === 0;
  });
  const rows = targetProfiles.map((p) => {
    const uid = p.id;
    const uAuth = authUserMap.get(uid);
    const pool = poolMap.get(uid);
    const leave = activeLeavesMap.get(uid);
    const stats = perf.get(uid) ?? {
      assignedLeads: 0,
      openLeads: 0,
      assignedApps: 0,
      openApps: 0,
      completedThisMonth: 0,
      avgTurnaroundHours: null
    };
    let employmentStatus = p?.employment_status ?? (p?.is_active === false ? "INACTIVE" : "ACTIVE");
    if (p?.is_active === true && (employmentStatus === "ARCHIVED" || employmentStatus === "INACTIVE")) {
      employmentStatus = "ACTIVE";
      adminAny.from("profiles").update({
        employment_status: "ACTIVE",
        archived_at: null
      }).eq("id", uid).then();
    }
    const isActive = p?.is_active !== false && employmentStatus === "ACTIVE";
    const isInPool = pool?.is_active ?? false;
    const autoAssignEnabled = isInPool;
    const maxWorkload = Number(p?.max_workload || 50);
    const resolvedName = p?.full_name?.trim() || p?.display_name?.trim() || null;
    return {
      id: uid,
      email: p?.email || uAuth?.email || "",
      full_name: resolvedName,
      mobile: p?.mobile ?? null,
      smartflo_agent_id: p?.smartflo_agent_id ?? null,
      is_active: isActive,
      employment_status: employmentStatus,
      auto_assign_enabled: autoAssignEnabled,
      is_in_pool: isInPool,
      max_workload: maxWorkload,
      work_schedule: p?.work_schedule || null,
      is_on_leave: !!leave,
      active_leave: leave ? {
        leave_type: leave.leave_type,
        reason: leave.reason,
        start_time: leave.start_time,
        end_time: leave.end_time
      } : null,
      created_at: uAuth?.created_at || p?.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      last_sign_in_at: uAuth?.last_sign_in_at || null,
      archived_at: p?.archived_at ?? null,
      terminated_at: p?.terminated_at ?? null,
      roles: roleMap.get(uid) ?? [],
      employee_code: p?.employee_code ?? null,
      department: p?.department ?? null,
      joining_date: p?.joining_date ?? null,
      perf: stats
    };
  });
  return {
    rows
  };
});
const getWorkforceDashboardMetrics_createServerFn_handler = createServerRpc({
  id: "9086494cebbe0ce49af5ad30994e07139bf1702db7d73aea84fd989a88ffdd95",
  name: "getWorkforceDashboardMetrics",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => getWorkforceDashboardMetrics.__executeServer(opts));
const getWorkforceDashboardMetrics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getWorkforceDashboardMetrics_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const workloads = await calculateStaffWorkloads();
  const admin = await getAdmin();
  const adminAny = admin;
  const todayStart = /* @__PURE__ */ new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();
  const [todayAssignedRes, todayReassignedRes, unassignedRes] = await Promise.all([adminAny.from("order_assignment_history").select("id", {
    count: "exact",
    head: true
  }).gte("created_at", todayIso).in("change_type", ["AUTO_INITIAL_POOL"]), adminAny.from("order_assignment_history").select("id", {
    count: "exact",
    head: true
  }).gte("created_at", todayIso).in("change_type", ["AUTO_LEAVE", "AUTO_UNAVAILABLE", "AUTO_INACTIVITY", "AUTO_OFFLINE", "AUTO_CAPACITY", "AUTO_TERMINATED", "AUTO_DISABLED"]), admin.from("applications").select("id", {
    count: "exact",
    head: true
  }).is("assigned_to", null).eq("is_deleted", false).not("fulfillment_status", "in", '("completed","order_completed","order_closed","cancelled")')]);
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
      inactive: inactiveEmployees
    },
    pool: {
      totalMembers: poolMembers,
      available: poolAvailable,
      unavailable: poolUnavailable,
      totalCapacity,
      usedCapacity,
      remainingCapacity: Math.max(0, totalCapacity - usedCapacity)
    },
    today: {
      autoAssignedToday: todayAssignedRes.count ?? 0,
      autoReassignedToday: todayReassignedRes.count ?? 0,
      unassignedOrders: unassignedRes.count ?? 0
    },
    workloads
  };
});
const InviteInput = object({
  full_name: string().trim().min(1).max(120),
  email: string().trim().email().max(255),
  mobile: string().trim().max(20).optional().nullable(),
  smartflo_agent_id: string().trim().max(100).optional().nullable(),
  role: _enum(ROLE_VALUES),
  department: string().trim().max(120).optional().nullable(),
  max_workload: number().int().min(5).max(200).default(50),
  auto_assign_enabled: boolean().default(false),
  // New employees default to OFF per spec!
  password: string().min(8).max(72).optional()
});
function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + "!9";
}
const inviteEmployee_createServerFn_handler = createServerRpc({
  id: "509d2bd4378ad9d098bd782e350146f68fa8ba764960488fb8e180072ebcc666",
  name: "inviteEmployee",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => inviteEmployee.__executeServer(opts));
const inviteEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => InviteInput.parse(i)).handler(inviteEmployee_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  const tempPassword = data.password ?? generateTempPassword();
  const {
    data: created,
    error: cErr
  } = await admin.auth.admin.createUser({
    email: data.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      display_name: data.full_name
    }
  });
  if (cErr) throw new Error(cErr.message);
  const newUser = created.user;
  if (!newUser) throw new Error("User creation did not return a user.");
  const {
    error: pErr
  } = await admin.from("profiles").upsert({
    id: newUser.id,
    email: data.email,
    display_name: data.full_name,
    full_name: data.full_name,
    mobile: data.mobile ?? null,
    smartflo_agent_id: data.smartflo_agent_id ? data.smartflo_agent_id.trim() : null,
    is_active: true
  }, {
    onConflict: "id"
  });
  if (pErr) throw new Error(pErr.message);
  await admin.from("assignment_pool").upsert({
    user_id: newUser.id,
    is_active: data.auto_assign_enabled ?? false
  }, {
    onConflict: "user_id"
  });
  const {
    error: rErr
  } = await admin.from("user_roles").upsert({
    user_id: newUser.id,
    role: data.role
  }, {
    onConflict: "user_id,role"
  });
  if (rErr) throw new Error(rErr.message);
  return {
    ok: true,
    user_id: newUser.id,
    email: data.email,
    temp_password: tempPassword
  };
});
const UpdateInput = object({
  user_id: string().uuid(),
  full_name: string().trim().min(1).max(120).optional(),
  mobile: string().trim().max(20).optional().nullable(),
  smartflo_agent_id: string().trim().max(100).optional().nullable(),
  role: _enum(ROLE_VALUES).optional(),
  department: string().trim().max(120).optional().nullable(),
  joining_date: string().trim().max(20).optional().nullable(),
  max_workload: number().int().min(5).max(200).optional(),
  auto_assign_enabled: boolean().optional()
});
const updateEmployee_createServerFn_handler = createServerRpc({
  id: "acdc84c5b6654c7e1618a2b180126a2ad9b2910aeb3e10dcd17fd575a48a74b5",
  name: "updateEmployee",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => updateEmployee.__executeServer(opts));
const updateEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpdateInput.parse(i)).handler(updateEmployee_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  const patch = {};
  if (data.full_name !== void 0) {
    patch.full_name = data.full_name;
    patch.display_name = data.full_name;
  }
  if (data.mobile !== void 0) patch.mobile = data.mobile;
  if (data.smartflo_agent_id !== void 0) {
    patch.smartflo_agent_id = data.smartflo_agent_id ? data.smartflo_agent_id.trim() : null;
  }
  if (Object.keys(patch).length) {
    const {
      error
    } = await admin.from("profiles").update(patch).eq("id", data.user_id);
    if (error) console.warn("[updateEmployee] profile update notice:", error.message);
  }
  if (data.auto_assign_enabled !== void 0) {
    const {
      data: existingPool
    } = await admin.from("assignment_pool").select("id").eq("user_id", data.user_id).limit(1);
    if (existingPool && existingPool.length > 0) {
      await admin.from("assignment_pool").update({
        is_active: data.auto_assign_enabled
      }).eq("user_id", data.user_id);
    } else {
      await admin.from("assignment_pool").insert({
        user_id: data.user_id,
        is_active: data.auto_assign_enabled
      });
    }
    await admin.from("profiles").update({
      auto_assign_enabled: data.auto_assign_enabled
    }).eq("id", data.user_id);
  }
  if (data.role) {
    const {
      error: dErr
    } = await admin.from("user_roles").delete().eq("user_id", data.user_id);
    if (dErr) throw new Error(dErr.message);
    const {
      error: iErr
    } = await admin.from("user_roles").insert({
      user_id: data.user_id,
      role: data.role
    });
    if (iErr) throw new Error(iErr.message);
  }
  return {
    ok: true
  };
});
const EmploymentStatusInput = object({
  user_id: string().uuid(),
  status: _enum(EMPLOYMENT_STATUS_VALUES),
  reason: string().optional()
});
const setEmploymentStatus_createServerFn_handler = createServerRpc({
  id: "1447999af53c2f01ede2170946a3a4ec8292344b67bd085b52b27aedeb2d87c5",
  name: "setEmploymentStatus",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => setEmploymentStatus.__executeServer(opts));
const setEmploymentStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => EmploymentStatusInput.parse(i)).handler(setEmploymentStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  const isNowActive = data.status === "ACTIVE";
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const profilePatch = {
    is_active: isNowActive,
    employment_status: data.status
  };
  if (isNowActive) {
    profilePatch.archived_at = null;
    profilePatch.terminated_at = null;
  } else if (data.status === "ARCHIVED") {
    profilePatch.archived_at = nowIso;
  } else if (data.status === "TERMINATED") {
    profilePatch.terminated_at = nowIso;
  }
  try {
    const {
      error: pErr
    } = await admin.from("profiles").update(profilePatch).eq("id", data.user_id);
    if (pErr) {
      console.warn("[setEmploymentStatus] Full profile update warning, falling back to basic:", pErr.message);
      await admin.from("profiles").update({
        is_active: isNowActive,
        employment_status: data.status
      }).eq("id", data.user_id);
    }
  } catch (err) {
    console.warn("[setEmploymentStatus] Profile update exception, falling back:", err);
    await admin.from("profiles").update({
      is_active: isNowActive
    }).eq("id", data.user_id);
  }
  try {
    await admin.auth.admin.updateUserById(data.user_id, {
      ban_duration: isNowActive ? "none" : "876000h"
    });
  } catch (authErr) {
    console.warn("[setEmploymentStatus] Auth updateUserById notice:", authErr);
  }
  if (isNowActive) {
    try {
      const {
        data: existingPool
      } = await admin.from("assignment_pool").select("id").eq("user_id", data.user_id).maybeSingle();
      if (!existingPool) {
        await admin.from("assignment_pool").insert({
          user_id: data.user_id,
          is_active: false
        });
      }
    } catch (poolErr) {
      console.warn("[setEmploymentStatus] assignment_pool ensure notice:", poolErr);
    }
    try {
      const {
        data: userRoles
      } = await admin.from("user_roles").select("role").eq("user_id", data.user_id);
      if (!userRoles || userRoles.length === 0) {
        await admin.from("user_roles").insert({
          user_id: data.user_id,
          role: "executive"
        });
      }
    } catch (rErr) {
      console.warn("[setEmploymentStatus] user_roles ensure notice:", rErr);
    }
  } else {
    try {
      await admin.rpc("admin_force_logout_all_sessions", {
        p_employee_id: data.user_id,
        p_reason: `Employee status changed to ${data.status}`
      });
    } catch (sErr) {
      console.warn("[setEmploymentStatus] session termination notice:", sErr);
    }
    try {
      await admin.from("assignment_pool").delete().eq("user_id", data.user_id);
    } catch (poolErr) {
      console.warn("[setEmploymentStatus] assignment_pool removal notice:", poolErr);
    }
    try {
      await reassignOrdersFromUnavailableEmployee({
        unavailableEmployeeId: data.user_id,
        reason: `Employee status changed to ${data.status} (${data.reason || "Administrative action"})`,
        changeType: data.status === "TERMINATED" ? "AUTO_TERMINATED" : "AUTO_DISABLED",
        actorId: context.userId
      });
    } catch (err) {
      console.warn("[setEmploymentStatus] Auto-reassign warning:", err);
    }
  }
  return {
    ok: true
  };
});
const toggleEmployeeAutoAssign_createServerFn_handler = createServerRpc({
  id: "d9d55c1ca43dacb36fc0449eea5f535b04bc1af8d112c9b1f19574f972c083e1",
  name: "toggleEmployeeAutoAssign",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => toggleEmployeeAutoAssign.__executeServer(opts));
const toggleEmployeeAutoAssign = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  enabled: boolean()
}).parse(i)).handler(toggleEmployeeAutoAssign_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  const {
    data: existingPool
  } = await admin.from("assignment_pool").select("id").eq("user_id", data.user_id).limit(1);
  if (existingPool && existingPool.length > 0) {
    const {
      error: poolErr
    } = await admin.from("assignment_pool").update({
      is_active: data.enabled
    }).eq("user_id", data.user_id);
    if (poolErr) throw new Error(poolErr.message);
  } else {
    const {
      error: poolErr
    } = await admin.from("assignment_pool").insert({
      user_id: data.user_id,
      is_active: data.enabled
    });
    if (poolErr) throw new Error(poolErr.message);
  }
  await admin.from("profiles").update({
    auto_assign_enabled: data.enabled
  }).eq("id", data.user_id);
  return {
    ok: true
  };
});
const archiveEmployee_createServerFn_handler = createServerRpc({
  id: "cd400d41658f23e803b7f6688b2ab0148e33b17225845ce91427c788162419c9",
  name: "archiveEmployee",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => archiveEmployee.__executeServer(opts));
const archiveEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  reason: string().optional()
}).parse(i)).handler(archiveEmployee_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  if (data.user_id === context.userId) {
    throw new Error("You cannot archive your own account.");
  }
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const {
      error: pErr
    } = await admin.from("profiles").update({
      is_active: false,
      employment_status: "ARCHIVED",
      archived_at: nowIso
    }).eq("id", data.user_id);
    if (pErr) {
      await admin.from("profiles").update({
        is_active: false
      }).eq("id", data.user_id);
    }
  } catch {
    await admin.from("profiles").update({
      is_active: false
    }).eq("id", data.user_id);
  }
  try {
    await admin.from("assignment_pool").delete().eq("user_id", data.user_id);
  } catch (e) {
    console.warn("[archiveEmployee] assignment_pool removal warning:", e);
  }
  try {
    await admin.auth.admin.updateUserById(data.user_id, {
      ban_duration: "876000h"
    });
  } catch (e) {
    console.warn("[archiveEmployee] updateUserById warning:", e);
  }
  try {
    await reassignOrdersFromUnavailableEmployee({
      unavailableEmployeeId: data.user_id,
      reason: `Employee archived by administrator (${data.reason || "Staff departure"})`,
      changeType: "AUTO_TERMINATED",
      actorId: context.userId
    });
  } catch (err) {
    console.warn("[archiveEmployee] Auto-reassign warning:", err);
  }
  return {
    ok: true
  };
});
const deleteEmployee_createServerFn_handler = createServerRpc({
  id: "a6d9530ee14b15af1f81b1edf893a9451d0052e52fc04788d6074693bd70857e",
  name: "deleteEmployee",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => deleteEmployee.__executeServer(opts));
const deleteEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid()
}).parse(i)).handler(deleteEmployee_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  if (data.user_id === context.userId) {
    throw new Error("You cannot delete your own account.");
  }
  const [appCount, leadCount, historyCount] = await Promise.all([admin.from("applications").select("id", {
    count: "exact",
    head: true
  }).eq("assigned_to", data.user_id), admin.from("leads").select("id", {
    count: "exact",
    head: true
  }).eq("assigned_to", data.user_id), admin.from("order_assignment_history").select("id", {
    count: "exact",
    head: true
  }).or(`new_employee_id.eq.${data.user_id},previous_employee_id.eq.${data.user_id}`)]);
  const totalRefs = (appCount.count ?? 0) + (leadCount.count ?? 0) + (historyCount.count ?? 0);
  if (totalRefs > 0) {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const {
        error: pErr
      } = await admin.from("profiles").update({
        is_active: false,
        employment_status: "ARCHIVED",
        archived_at: nowIso
      }).eq("id", data.user_id);
      if (pErr) {
        await admin.from("profiles").update({
          is_active: false
        }).eq("id", data.user_id);
      }
    } catch {
      await admin.from("profiles").update({
        is_active: false
      }).eq("id", data.user_id);
    }
    try {
      await admin.from("assignment_pool").delete().eq("user_id", data.user_id);
    } catch (e) {
      console.warn("[deleteEmployee] assignment_pool removal warning:", e);
    }
    try {
      await admin.auth.admin.updateUserById(data.user_id, {
        ban_duration: "876000h"
      });
    } catch (e) {
      console.warn("[deleteEmployee] updateUserById warning:", e);
    }
    try {
      await reassignOrdersFromUnavailableEmployee({
        unavailableEmployeeId: data.user_id,
        reason: "Employee archived to preserve historical order records",
        changeType: "AUTO_TERMINATED",
        actorId: context.userId
      });
    } catch (err) {
      console.warn("[deleteEmployee] Auto-reassign warning:", err);
    }
    return {
      ok: true,
      mode: "archived",
      message: "Employee had historical orders and was securely archived instead of deleted."
    };
  }
  await Promise.all([admin.from("user_permissions").delete().eq("user_id", data.user_id), admin.from("user_permission_scopes").delete().eq("user_id", data.user_id), admin.from("user_roles").delete().eq("user_id", data.user_id), admin.from("assignment_pool").delete().eq("user_id", data.user_id), admin.from("profiles").delete().eq("id", data.user_id)]);
  const {
    error: dErr
  } = await admin.auth.admin.deleteUser(data.user_id);
  if (dErr) throw new Error(dErr.message);
  return {
    ok: true,
    mode: "deleted"
  };
});
const setEmployeeActive_createServerFn_handler = createServerRpc({
  id: "160e215610bb38261254077ccd1b7868655ea22735a5cc5f0c6f552c81e98589",
  name: "setEmployeeActive",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => setEmployeeActive.__executeServer(opts));
const setEmployeeActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  is_active: boolean()
}).parse(i)).handler(setEmployeeActive_createServerFn_handler, async ({
  data,
  context
}) => {
  return setEmploymentStatus({
    data: {
      user_id: data.user_id,
      status: data.is_active ? "ACTIVE" : "INACTIVE",
      reason: data.is_active ? "Account activated" : "Account deactivated"
    }
  });
});
const resetEmployeePassword_createServerFn_handler = createServerRpc({
  id: "5f54c01c40533c5893e3147e411a98b6337aba4a6b82dc6725404c01e116b4e8",
  name: "resetEmployeePassword",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => resetEmployeePassword.__executeServer(opts));
const resetEmployeePassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  new_password: string().min(8).max(72)
}).parse(i)).handler(resetEmployeePassword_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    data: roles,
    error: rErr
  } = await admin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "super_admin");
  if (rErr) throw new Error(rErr.message);
  if (!roles || roles.length === 0) throw new Error("Forbidden: super_admin only.");
  const {
    error: uErr
  } = await admin.auth.admin.updateUserById(data.user_id, {
    password: data.new_password
  });
  if (uErr) throw new Error(uErr.message);
  return {
    ok: true
  };
});
const grantRole_createServerFn_handler = createServerRpc({
  id: "73d3cf99b38a1733357a6235415e0959e91e3ffdecbb230c73f1925718ee9090",
  name: "grantRole",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => grantRole.__executeServer(opts));
const grantRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  role: _enum(ROLE_VALUES)
}).parse(i)).handler(grantRole_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await (await getAdmin()).from("user_roles").upsert({
    user_id: data.user_id,
    role: data.role
  }, {
    onConflict: "user_id,role"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const revokeRole_createServerFn_handler = createServerRpc({
  id: "0bc3099bda84fb4eac018557f525133d2dba8b74cef9bde593056ebf8b39db50",
  name: "revokeRole",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => revokeRole.__executeServer(opts));
const revokeRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  role: _enum(ROLE_VALUES)
}).parse(i)).handler(revokeRole_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await (await getAdmin()).from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const WORK_MODULES = ["work.leads", "work.orders", "work.support", "work.finance"];
const getEmployeeWorkAccess_createServerFn_handler = createServerRpc({
  id: "f44d566350427ee1369a974c32a3d66e3de1be5fb11479cde11092b1faa428fa",
  name: "getEmployeeWorkAccess",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => getEmployeeWorkAccess.__executeServer(opts));
const getEmployeeWorkAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid()
}).parse(i)).handler(getEmployeeWorkAccess_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  const [perms, scopes, ws, svcs] = await Promise.all([admin.from("user_permissions").select("module_key, can_view").eq("user_id", data.user_id).in("module_key", WORK_MODULES), admin.from("user_permission_scopes").select("module_key, website_id, service_id").eq("user_id", data.user_id).in("module_key", WORK_MODULES), admin.from("websites").select("id, name, domain, is_active").order("sort_order", {
    ascending: true
  }), admin.from("services").select("id, service_code, service_name, website_id, is_active").order("sort_order", {
    ascending: true
  })]);
  const permMap = {};
  for (const m of WORK_MODULES) permMap[m] = false;
  (perms.data ?? []).forEach((p) => {
    permMap[p.module_key] = !!p.can_view;
  });
  const websiteScopes = {};
  const serviceScopes = {};
  for (const m of WORK_MODULES) {
    websiteScopes[m] = [];
    serviceScopes[m] = [];
  }
  (scopes.data ?? []).forEach((s) => {
    if (s.website_id) websiteScopes[s.module_key]?.push(s.website_id);
    if (s.service_id) serviceScopes[s.module_key]?.push(s.service_id);
  });
  return {
    permissions: permMap,
    websiteScopes,
    serviceScopes,
    websites: ws.data ?? [],
    services: svcs.data ?? []
  };
});
const setEmployeeWorkAccess_createServerFn_handler = createServerRpc({
  id: "0a2a20e39134d06d5b5766c1ca724ce3765278e9dcd94def11e9276d82f13c18",
  name: "setEmployeeWorkAccess",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => setEmployeeWorkAccess.__executeServer(opts));
const setEmployeeWorkAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  work: object({
    "work.leads": boolean().default(false),
    "work.orders": boolean().default(false),
    "work.support": boolean().default(false),
    "work.finance": boolean().default(false)
  }),
  websites: array(string().uuid()).default([]),
  services: array(string().uuid()).default([])
}).parse(i)).handler(setEmployeeWorkAccess_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const admin = await getAdmin();
  const MODULE_KEY_PAIRS = {
    "work.leads": ["work.leads", "leads"],
    "work.orders": ["work.orders", "orders"],
    "work.support": ["work.support", "support", "tickets", "complaints"],
    "work.finance": ["work.finance", "finance", "payments", "invoices"]
  };
  const allKeysToReset = [];
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
        scope_all: data.websites.length === 0 && data.services.length === 0
      }, {
        onConflict: "user_id,module_key"
      });
    }
  }
  await admin.from("user_permission_scopes").delete().eq("user_id", data.user_id).in("module_key", allKeysToReset);
  const rows = [];
  for (const m of WORK_MODULES) {
    if (!data.work[m]) continue;
    const keysToSync = MODULE_KEY_PAIRS[m] || [m];
    for (const k of keysToSync) {
      for (const w of data.websites) rows.push({
        user_id: data.user_id,
        module_key: k,
        website_id: w
      });
      for (const s of data.services) rows.push({
        user_id: data.user_id,
        module_key: k,
        service_id: s
      });
    }
  }
  if (rows.length) {
    await admin.from("user_permission_scopes").insert(rows);
  }
  return {
    ok: true
  };
});
const getMyStaffRoles_createServerFn_handler = createServerRpc({
  id: "07e98faa67ee2e14380a5485f7dcbfa3db6a48d37fdad1fa8084acd7a60f7bf9",
  name: "getMyStaffRoles",
  filename: "src/lib/crm/users-admin.functions.ts"
}, (opts) => getMyStaffRoles.__executeServer(opts));
const getMyStaffRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyStaffRoles_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const admin = await getAdmin();
  const [{
    data,
    error
  }, {
    data: prof
  }] = await Promise.all([admin.from("user_roles").select("role").eq("user_id", userId), admin.from("profiles").select("display_name, full_name, role").eq("id", userId).maybeSingle()]);
  if (error) throw new Error(error.message);
  const rolesSet = new Set((data ?? []).map((r) => r.role));
  if (prof?.role) {
    rolesSet.add(prof.role);
  }
  return {
    userId,
    roles: Array.from(rolesSet),
    displayName: prof?.display_name || prof?.full_name || null
  };
});
export {
  archiveEmployee_createServerFn_handler,
  deleteEmployee_createServerFn_handler,
  getEmployeeWorkAccess_createServerFn_handler,
  getMyStaffRoles_createServerFn_handler,
  getWorkforceDashboardMetrics_createServerFn_handler,
  grantRole_createServerFn_handler,
  inviteEmployee_createServerFn_handler,
  listStaffUsers_createServerFn_handler,
  resetEmployeePassword_createServerFn_handler,
  revokeRole_createServerFn_handler,
  setEmployeeActive_createServerFn_handler,
  setEmployeeWorkAccess_createServerFn_handler,
  setEmploymentStatus_createServerFn_handler,
  toggleEmployeeAutoAssign_createServerFn_handler,
  updateEmployee_createServerFn_handler
};
