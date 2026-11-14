import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, _ as _enum, a as array, b as boolean } from "../_libs/zod.mjs";
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
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function verifyAdminOrSuperAdmin(supabase, userId) {
  const admin = await getAdmin();
  let query = admin.from("user_roles").select("role");
  if (userId) query = query.eq("user_id", userId);
  const {
    data
  } = await query;
  const roles = new Set((data ?? []).map((r) => r.role));
  const isPrivileged = roles.has("admin") || roles.has("super_admin") || roles.has("manager");
  if (!isPrivileged) throw new Error("Unauthorized: Admin or Super Admin access required.");
  return true;
}
let defaultShiftsConfig = [{
  id: "shift_alpha",
  name: "Shift Alpha (Morning)",
  code: "ALPHA",
  startTime: "09:00",
  endTime: "18:00",
  lunchStart: "13:00",
  lunchEnd: "14:00",
  graceMins: 15,
  isDefault: true,
  assignedUsers: []
}, {
  id: "shift_beta",
  name: "Shift Beta (Afternoon)",
  code: "BETA",
  startTime: "13:00",
  endTime: "22:00",
  lunchStart: "17:00",
  lunchEnd: "18:00",
  graceMins: 15,
  isDefault: false,
  assignedUsers: []
}, {
  id: "shift_general",
  name: "General Shift",
  code: "GEN",
  startTime: "10:00",
  endTime: "19:00",
  lunchStart: "13:30",
  lunchEnd: "14:30",
  graceMins: 15,
  isDefault: false,
  assignedUsers: []
}];
let presenceThresholdsConfig = {
  idleThresholdMins: 5,
  awayThresholdMins: 15,
  heartbeatIntervalSeconds: 30,
  sessionTimeoutHours: 9
};
const recordEmployeeHeartbeat_createServerFn_handler = createServerRpc({
  id: "da95e61acc686cd20bd84b5eed2adf2f95b79fdfa5f78a3a041f273ac2808343",
  name: "recordEmployeeHeartbeat",
  filename: "src/lib/crm/employee-presence.functions.ts"
}, (opts) => recordEmployeeHeartbeat.__executeServer(opts));
const recordEmployeeHeartbeat = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  presenceStatus: _enum(["ACTIVE", "IDLE", "AWAY", "OFFLINE"]),
  currentPage: string().default("/admin"),
  currentModule: string().default("General"),
  currentOrderId: string().uuid().nullable().optional(),
  currentOrderCode: string().nullable().optional(),
  lastActionText: string().nullable().optional(),
  activeSecondsDelta: number().int().nonnegative().default(0),
  idleSecondsDelta: number().int().nonnegative().default(0),
  awaySecondsDelta: number().int().nonnegative().default(0),
  browser: string().default("Chrome"),
  os: string().default("Windows"),
  deviceType: string().default("Desktop"),
  ipAddress: string().default("103.21.58.92")
}).parse(i)).handler(recordEmployeeHeartbeat_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    data: res
  } = await admin.rpc("record_employee_heartbeat_v2", {
    p_session_id: data.sessionId,
    p_presence_status: data.presenceStatus,
    p_current_page: data.currentPage,
    p_current_module: data.currentModule,
    p_current_order_id: data.currentOrderId ?? null,
    p_current_order_code: data.currentOrderCode ?? null,
    p_last_action_text: data.lastActionText ?? null,
    p_active_seconds_delta: data.activeSecondsDelta,
    p_idle_seconds_delta: data.idleSecondsDelta,
    p_away_seconds_delta: data.awaySecondsDelta,
    p_browser: data.browser,
    p_os: data.os,
    p_device_type: data.deviceType,
    p_ip_address: data.ipAddress
  });
  const typedRes = res;
  return {
    ok: typedRes?.ok ?? true,
    terminated: typedRes?.terminated ?? false,
    activeMinutes: Math.round((typedRes?.active_seconds || 0) / 60),
    idleMinutes: Math.round((typedRes?.idle_seconds || 0) / 60),
    awayMinutes: Math.round((typedRes?.away_seconds || 0) / 60),
    presenceStatus: typedRes?.status?.toUpperCase() || data.presenceStatus
  };
});
const getActiveEmployeeSessions_createServerFn_handler = createServerRpc({
  id: "c303d2dceac601ba4f32a3631e352bde9e7e435dd80df41662ccbb8887c5c7d2",
  name: "getActiveEmployeeSessions",
  filename: "src/lib/crm/employee-presence.functions.ts"
}, (opts) => getActiveEmployeeSessions.__executeServer(opts));
const getActiveEmployeeSessions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getActiveEmployeeSessions_createServerFn_handler, async ({
  context
}) => {
  await verifyAdminOrSuperAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const nowTime = Date.now();
  const {
    data: staffRoles
  } = await admin.from("user_roles").select("user_id, role").in("role", ["operations", "support", "admin", "super_admin", "manager", "executive", "accounts"]);
  const staffUserIds = Array.from(new Set((staffRoles ?? []).map((r) => String(r.user_id))));
  const [{
    data: profiles
  }, {
    data: dbSessions
  }] = await Promise.all([admin.from("profiles").select("id, full_name, display_name, email, is_active").in("id", staffUserIds.length ? staffUserIds : ["00000000-0000-0000-0000-000000000000"]), admin.from("employee_sessions").select("*").order("last_heartbeat_at", {
    ascending: false
  }).limit(200)]);
  const profileMap = /* @__PURE__ */ new Map();
  (profiles ?? []).forEach((p) => profileMap.set(String(p.id), p));
  const roleMap = /* @__PURE__ */ new Map();
  (staffRoles ?? []).forEach((r) => roleMap.set(String(r.user_id), r.role));
  const latestSessionByEmp = /* @__PURE__ */ new Map();
  (dbSessions ?? []).forEach((s) => {
    if (!latestSessionByEmp.has(String(s.employee_id))) {
      latestSessionByEmp.set(String(s.employee_id), s);
    }
  });
  const sessionsList = staffUserIds.map((uid) => {
    const p = profileMap.get(uid);
    const s = latestSessionByEmp.get(uid);
    const name = p?.full_name || p?.display_name || p?.email?.split("@")[0] || "Staff";
    const assignedShift = defaultShiftsConfig.find((sh) => sh.assignedUsers.includes(uid) || sh.isDefault);
    let status = "OFFLINE";
    if (s && s.is_active && s.status !== "force_logged_out" && s.status !== "logged_out") {
      const lastHb = s.last_heartbeat_at || s.last_activity_at || s.login_at;
      const diffMs = nowTime - new Date(lastHb).getTime();
      if (diffMs > 10 * 60 * 1e3) {
        status = "OFFLINE";
      } else if (diffMs > 8 * 60 * 1e3 || s.status === "away") {
        status = "AWAY";
      } else if (diffMs > 5 * 60 * 1e3 || s.status === "idle") {
        status = "IDLE";
      } else {
        status = "ACTIVE";
      }
    }
    return {
      sessionId: s?.session_id ? String(s.session_id) : `sess_${uid.slice(0, 8)}`,
      employeeId: uid,
      employeeName: name,
      employeeRole: roleMap.get(uid) || "operations",
      avatarUrl: null,
      loginTime: s?.login_at ? String(s.login_at) : (/* @__PURE__ */ new Date()).toISOString(),
      lastHeartbeat: s?.last_heartbeat_at ? String(s.last_heartbeat_at) : (/* @__PURE__ */ new Date()).toISOString(),
      lastActivityAt: s?.last_activity_at ? String(s.last_activity_at) : (/* @__PURE__ */ new Date()).toISOString(),
      activeDurationMinutes: Math.round((s?.active_seconds || 0) / 60),
      idleDurationMinutes: Math.round((s?.idle_seconds || 0) / 60),
      awayDurationMinutes: Math.round((s?.away_seconds || 0) / 60),
      presenceStatus: status,
      currentPage: s?.current_page ? String(s.current_page) : "/admin",
      currentModule: s?.current_module ? String(s.current_module) : "General",
      currentOrderId: s?.current_order_id ? String(s.current_order_id) : null,
      currentOrderCode: s?.current_order_code ? String(s.current_order_code) : null,
      lastActionText: s?.last_action_text ? String(s.last_action_text) : status === "ACTIVE" ? "Connected to CRM" : "No active session",
      browser: s?.browser ? String(s.browser) : "Chrome",
      os: s?.operating_system ? String(s.operating_system) : "Windows",
      deviceType: s?.device_type ? String(s.device_type) : "Desktop",
      ipAddress: s?.ip_address ? String(s.ip_address) : "103.21.58.92",
      shiftId: assignedShift?.id || "shift_alpha",
      terminated: s?.status === "force_logged_out" || s?.is_active === false
    };
  });
  return {
    sessions: sessionsList,
    totalCount: sessionsList.length,
    activeCount: sessionsList.filter((s) => s.presenceStatus === "ACTIVE").length,
    idleCount: sessionsList.filter((s) => s.presenceStatus === "IDLE").length,
    awayCount: sessionsList.filter((s) => s.presenceStatus === "AWAY").length,
    offlineCount: sessionsList.filter((s) => s.presenceStatus === "OFFLINE").length
  };
});
const terminateEmployeeSession_createServerFn_handler = createServerRpc({
  id: "f654f70eb23067e21a19e470fa33b8c580e53aa9dfda6c57455582801bbde8d6",
  name: "terminateEmployeeSession",
  filename: "src/lib/crm/employee-presence.functions.ts"
}, (opts) => terminateEmployeeSession.__executeServer(opts));
const terminateEmployeeSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  employeeId: string().optional()
}).parse(i)).handler(terminateEmployeeSession_createServerFn_handler, async ({
  data,
  context
}) => {
  await verifyAdminOrSuperAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  if (data.employeeId) {
    try {
      const {
        error
      } = await admin.rpc("admin_force_logout_all_sessions", {
        p_employee_id: data.employeeId,
        p_reason: "Terminated by administrator"
      });
      if (error) throw error;
    } catch (e) {
      await admin.from("employee_sessions").update({
        is_active: false,
        status: "force_logged_out",
        logout_at: (/* @__PURE__ */ new Date()).toISOString(),
        logout_reason: "Terminated by administrator"
      }).eq("employee_id", data.employeeId).eq("is_active", true);
    }
  } else {
    try {
      const {
        error
      } = await admin.rpc("admin_force_logout_session", {
        p_session_id: data.sessionId,
        p_reason: "Terminated by administrator"
      });
      if (error) throw error;
    } catch (e) {
      await admin.from("employee_sessions").update({
        is_active: false,
        status: "force_logged_out",
        logout_at: (/* @__PURE__ */ new Date()).toISOString(),
        logout_reason: "Terminated by administrator"
      }).eq("session_id", data.sessionId);
    }
  }
  return {
    ok: true,
    terminatedSessionId: data.sessionId
  };
});
const getShiftSettings_createServerFn_handler = createServerRpc({
  id: "522a414446fd9cca7c23dc89eaf4407087ae52b4f33356a2ef72467e7135c624",
  name: "getShiftSettings",
  filename: "src/lib/crm/employee-presence.functions.ts"
}, (opts) => getShiftSettings.__executeServer(opts));
const getShiftSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getShiftSettings_createServerFn_handler, async ({
  context
}) => {
  await verifyAdminOrSuperAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: staffRoles
  } = await admin.from("user_roles").select("user_id, role").in("role", ["operations", "support", "admin", "super_admin", "manager", "executive"]);
  const staffUserIds = Array.from(new Set((staffRoles ?? []).map((r) => String(r.user_id))));
  const {
    data: profiles
  } = await admin.from("profiles").select("id, full_name, display_name, email").in("id", staffUserIds.length ? staffUserIds : ["00000000-0000-0000-0000-000000000000"]);
  const staffList = (profiles ?? []).map((p) => ({
    id: p.id,
    name: p.full_name || p.display_name || p.email?.split("@")[0] || "Staff",
    email: p.email
  }));
  return {
    shifts: defaultShiftsConfig,
    thresholds: presenceThresholdsConfig,
    staffList
  };
});
const saveShiftSettings_createServerFn_handler = createServerRpc({
  id: "cba23f4c161ec765ece2bfad3d69c8d9a2aa009e6022c785e07b42bb5d3c2664",
  name: "saveShiftSettings",
  filename: "src/lib/crm/employee-presence.functions.ts"
}, (opts) => saveShiftSettings.__executeServer(opts));
const saveShiftSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  shifts: array(object({
    id: string(),
    name: string().min(1),
    code: string().min(1),
    startTime: string().min(1),
    endTime: string().min(1),
    lunchStart: string().min(1),
    lunchEnd: string().min(1),
    graceMins: number().int().min(0).max(60).default(15),
    isDefault: boolean().default(false),
    assignedUsers: array(string()).default([])
  })),
  thresholds: object({
    idleThresholdMins: number().int().min(1).max(60).default(5),
    awayThresholdMins: number().int().min(2).max(120).default(15),
    heartbeatIntervalSeconds: number().int().min(10).max(120).default(30),
    sessionTimeoutHours: number().int().min(1).max(24).default(9)
  })
}).parse(i)).handler(saveShiftSettings_createServerFn_handler, async ({
  data,
  context
}) => {
  await verifyAdminOrSuperAdmin(context.supabase, context.userId);
  defaultShiftsConfig = data.shifts;
  presenceThresholdsConfig = data.thresholds;
  return {
    ok: true,
    shifts: defaultShiftsConfig,
    thresholds: presenceThresholdsConfig
  };
});
export {
  getActiveEmployeeSessions_createServerFn_handler,
  getShiftSettings_createServerFn_handler,
  recordEmployeeHeartbeat_createServerFn_handler,
  saveShiftSettings_createServerFn_handler,
  terminateEmployeeSession_createServerFn_handler
};
