import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn, g as getRequest } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, _ as _enum, r as record, d as any } from "../_libs/zod.mjs";
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
function getClientIpFromRequest() {
  try {
    const req = getRequest();
    if (!req?.headers) return null;
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    const cfIp = req.headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();
    return null;
  } catch {
    return null;
  }
}
async function verifyAdminOrSuperAdmin(userId) {
  const admin = await getAdmin();
  const {
    data
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const roles = new Set((data ?? []).map((r) => r.role));
  const isPrivileged = roles.has("admin") || roles.has("super_admin") || roles.has("manager");
  if (!isPrivileged) throw new Error("Unauthorized: Admin or Super Admin access required.");
  return true;
}
const recordHeartbeat_createServerFn_handler = createServerRpc({
  id: "8c50e4b184a9242cfa93c769a651c3c143078de3153178a016cf1c8a2a872e92",
  name: "recordHeartbeat",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => recordHeartbeat.__executeServer(opts));
const recordHeartbeat = createServerFn({
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
  browserVersion: string().nullable().optional(),
  os: string().default("Windows"),
  deviceType: string().default("Desktop")
}).parse(i)).handler(recordHeartbeat_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const userId = context.userId;
  const clientIp = getClientIpFromRequest();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const {
      data: res,
      error
    } = await admin.rpc("record_employee_heartbeat_v2", {
      p_employee_id: userId,
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
      p_browser_version: data.browserVersion ?? null,
      p_os: data.os,
      p_device_type: data.deviceType,
      p_ip_address: clientIp
    });
    if (!error && res && res.ok !== false) {
      return res;
    }
    if (error) {
      console.warn("[recordHeartbeat] RPC notice, falling back to direct table update:", error.message);
    }
  } catch (rpcErr) {
    console.warn("[recordHeartbeat] RPC exception, using direct table update:", rpcErr);
  }
  const {
    data: existingSess
  } = await admin.from("employee_sessions").select("*").eq("session_id", data.sessionId).maybeSingle();
  if (existingSess) {
    if (existingSess.is_active === false || existingSess.status === "force_logged_out") {
      return {
        ok: false,
        terminated: true,
        logout_reason: existingSess.logout_reason || "Terminated by administrator",
        status: existingSess.status
      };
    }
    const activeSec = (existingSess.active_seconds || 0) + (data.activeSecondsDelta || 0);
    const idleSec = (existingSess.idle_seconds || 0) + (data.idleSecondsDelta || 0);
    const awaySec = (existingSess.away_seconds || 0) + (data.awaySecondsDelta || 0);
    await admin.from("employee_sessions").update({
      last_heartbeat_at: nowIso,
      last_activity_at: data.presenceStatus === "ACTIVE" ? nowIso : existingSess.last_activity_at || nowIso,
      status: data.presenceStatus.toLowerCase(),
      is_active: true,
      active_seconds: activeSec,
      idle_seconds: idleSec,
      away_seconds: awaySec,
      current_page: data.currentPage,
      current_module: data.currentModule,
      current_order_id: data.currentOrderId ?? existingSess.current_order_id ?? null,
      current_order_code: data.currentOrderCode ?? existingSess.current_order_code ?? null,
      last_action_text: data.lastActionText ?? existingSess.last_action_text ?? null,
      browser: data.browser || existingSess.browser,
      browser_version: data.browserVersion || existingSess.browser_version,
      operating_system: data.os || existingSess.operating_system,
      device_type: data.deviceType || existingSess.device_type,
      ip_address: clientIp || existingSess.ip_address,
      updated_at: nowIso
    }).eq("session_id", data.sessionId);
    return {
      ok: true,
      terminated: false,
      active_seconds: activeSec,
      idle_seconds: idleSec,
      away_seconds: awaySec,
      status: data.presenceStatus.toLowerCase()
    };
  } else {
    await admin.from("employee_sessions").insert({
      employee_id: userId,
      auth_user_id: userId,
      session_id: data.sessionId,
      login_method: "password",
      login_at: nowIso,
      last_activity_at: nowIso,
      last_heartbeat_at: nowIso,
      active_seconds: data.activeSecondsDelta || 0,
      idle_seconds: data.idleSecondsDelta || 0,
      away_seconds: data.awaySecondsDelta || 0,
      is_active: true,
      status: data.presenceStatus.toLowerCase(),
      current_page: data.currentPage,
      current_module: data.currentModule,
      current_order_id: data.currentOrderId ?? null,
      current_order_code: data.currentOrderCode ?? null,
      last_action_text: data.lastActionText ?? null,
      browser: data.browser,
      browser_version: data.browserVersion || null,
      operating_system: data.os,
      device_type: data.deviceType,
      ip_address: clientIp,
      created_at: nowIso,
      updated_at: nowIso
    });
    return {
      ok: true,
      terminated: false,
      active_seconds: data.activeSecondsDelta || 0,
      idle_seconds: data.idleSecondsDelta || 0,
      away_seconds: data.awaySecondsDelta || 0,
      status: data.presenceStatus.toLowerCase()
    };
  }
});
const logLoginAttempt_createServerFn_handler = createServerRpc({
  id: "00c97d8be02d8b1fc19f0a6d3a703142cafd52f92e2c47730b5fcc43a526750e",
  name: "logLoginAttempt",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => logLoginAttempt.__executeServer(opts));
const logLoginAttempt = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  loginMethod: _enum(["password", "google"]).default("password"),
  browser: string().default("Chrome"),
  browserVersion: string().nullable().optional(),
  os: string().default("Windows"),
  deviceType: string().default("Desktop")
}).parse(i)).handler(logLoginAttempt_createServerFn_handler, async ({
  data,
  context
}) => {
  const userId = context.userId;
  const admin = await getAdmin();
  const clientIp = getClientIpFromRequest();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: profile
  } = await admin.from("profiles").select("id, email, full_name, display_name, is_active").eq("id", userId).maybeSingle();
  const userEmail = profile?.email || context.claims.email || "staff@crm";
  await admin.from("employee_login_history").insert({
    employee_id: userId,
    auth_user_id: userId,
    email: userEmail,
    login_method: data.loginMethod,
    login_at: nowIso,
    success: true,
    failure_reason: null,
    ip_address: clientIp,
    browser: data.browser,
    browser_version: data.browserVersion || null,
    operating_system: data.os,
    device_type: data.deviceType
  });
  await admin.from("employee_security_events").insert({
    employee_id: userId,
    auth_user_id: userId,
    actor_id: userId,
    session_id: data.sessionId,
    event_type: "LOGIN_SUCCESS",
    metadata: {
      method: data.loginMethod,
      browser: data.browser,
      os: data.os,
      deviceType: data.deviceType
    },
    ip_address: clientIp
  });
  await admin.from("employee_sessions").upsert({
    employee_id: userId,
    auth_user_id: userId,
    session_id: data.sessionId,
    login_method: data.loginMethod,
    login_at: nowIso,
    last_activity_at: nowIso,
    last_heartbeat_at: nowIso,
    is_active: true,
    status: "active",
    browser: data.browser,
    browser_version: data.browserVersion || null,
    operating_system: data.os,
    device_type: data.deviceType,
    ip_address: clientIp
  }, {
    onConflict: "session_id"
  });
  return {
    ok: true
  };
});
const verifyGoogleStaffAccess_createServerFn_handler = createServerRpc({
  id: "4239650687724d39355ca31c904d3d50b8f52f2aab7656030e4ad420d2d85bf3",
  name: "verifyGoogleStaffAccess",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => verifyGoogleStaffAccess.__executeServer(opts));
const verifyGoogleStaffAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(verifyGoogleStaffAccess_createServerFn_handler, async ({
  context
}) => {
  const userId = context.userId;
  const admin = await getAdmin();
  const clientIp = getClientIpFromRequest();
  const [{
    data: profile
  }, {
    data: userRoles
  }] = await Promise.all([admin.from("profiles").select("id, email, is_active").eq("id", userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", userId)]);
  const isStaff = (userRoles ?? []).length > 0;
  const isActive = profile?.is_active !== false;
  if (!isStaff || !isActive) {
    await admin.from("employee_login_history").insert({
      employee_id: profile?.id || null,
      auth_user_id: userId,
      email: profile?.email || context.claims.email || "unknown@google",
      login_method: "google",
      success: false,
      failure_reason: !isStaff ? "NO_STAFF_ROLE_ASSIGNED" : "ACCOUNT_SUSPENDED",
      ip_address: clientIp
    });
    await admin.from("employee_security_events").insert({
      employee_id: profile?.id || null,
      auth_user_id: userId,
      event_type: "UNAUTHORIZED_ACCESS",
      metadata: {
        reason: !isStaff ? "Google login without CRM staff role" : "Suspended account login attempt",
        email: profile?.email || context.claims.email
      },
      ip_address: clientIp
    });
    return {
      authorized: false,
      reason: !isStaff ? "NO_STAFF_ROLE" : "ACCOUNT_SUSPENDED"
    };
  }
  return {
    authorized: true,
    email: profile.email
  };
});
const logEmployeeLogout_createServerFn_handler = createServerRpc({
  id: "e32ba0e0b922ed15816a88dc599cbb4cb3ebd86f92c5c7497ba65be3f3abb840",
  name: "logEmployeeLogout",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => logEmployeeLogout.__executeServer(opts));
const logEmployeeLogout = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1)
}).parse(i)).handler(logEmployeeLogout_createServerFn_handler, async ({
  data,
  context
}) => {
  const userId = context.userId;
  const admin = await getAdmin();
  const clientIp = getClientIpFromRequest();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  await admin.from("employee_sessions").update({
    is_active: false,
    status: "logged_out",
    logout_at: nowIso,
    logout_reason: "User signed out",
    updated_at: nowIso
  }).eq("session_id", data.sessionId);
  await admin.from("employee_security_events").insert({
    employee_id: userId,
    auth_user_id: userId,
    actor_id: userId,
    session_id: data.sessionId,
    event_type: "LOGOUT",
    metadata: {
      reason: "User initiated sign out"
    },
    ip_address: clientIp
  });
  return {
    ok: true
  };
});
const listEmployeeSessionsAdmin_createServerFn_handler = createServerRpc({
  id: "dfc8827427f508213ef859dcf3ff5322fbb0315ce988f62b9a4d225f8b5f00a4",
  name: "listEmployeeSessionsAdmin",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => listEmployeeSessionsAdmin.__executeServer(opts));
const listEmployeeSessionsAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  statusFilter: _enum(["all", "active", "idle", "away", "offline"]).default("all"),
  searchQuery: string().optional().default(""),
  limit: number().int().min(1).max(200).default(50)
}).parse(i)).handler(listEmployeeSessionsAdmin_createServerFn_handler, async ({
  data,
  context
}) => {
  await verifyAdminOrSuperAdmin(context.userId);
  const admin = await getAdmin();
  const nowTime = Date.now();
  const {
    data: staffRoles
  } = await admin.from("user_roles").select("user_id, role");
  const staffUserIds = Array.from(new Set((staffRoles ?? []).map((r) => String(r.user_id))));
  const [{
    data: profiles
  }, {
    data: sessions
  }] = await Promise.all([admin.from("profiles").select("id, display_name, full_name, email, is_active, employee_code, mobile").in("id", staffUserIds.length ? staffUserIds : ["00000000-0000-0000-0000-000000000000"]), admin.from("employee_sessions").select("*").order("last_heartbeat_at", {
    ascending: false
  }).limit(200)]);
  const profileMap = /* @__PURE__ */ new Map();
  (profiles ?? []).forEach((p) => profileMap.set(String(p.id), p));
  const roleMap = /* @__PURE__ */ new Map();
  (staffRoles ?? []).forEach((r) => {
    const list = roleMap.get(String(r.user_id)) || [];
    list.push(r.role);
    roleMap.set(String(r.user_id), list);
  });
  const latestSessionByEmp = /* @__PURE__ */ new Map();
  (sessions ?? []).forEach((s) => {
    if (!latestSessionByEmp.has(String(s.employee_id))) {
      latestSessionByEmp.set(String(s.employee_id), s);
    }
  });
  const operatorRows = staffUserIds.map((uid) => {
    const prof = profileMap.get(uid);
    const sess = latestSessionByEmp.get(uid);
    const roles = roleMap.get(uid) || ["staff"];
    let presence = "offline";
    if (sess && sess.is_active && sess.status !== "force_logged_out" && sess.status !== "logged_out") {
      const lastHbMs = new Date(sess.last_heartbeat_at || sess.last_activity_at || sess.login_at).getTime();
      const diffMs = nowTime - lastHbMs;
      if (diffMs > 10 * 60 * 1e3) {
        presence = "offline";
      } else if (sess.status === "away" || diffMs > 8 * 60 * 1e3) {
        presence = "away";
      } else if (sess.status === "idle" || diffMs > 5 * 60 * 1e3) {
        presence = "idle";
      } else {
        presence = "active";
      }
    }
    const name = prof?.full_name || prof?.display_name || prof?.email?.split("@")[0] || "Operator";
    const totalSec = (sess?.active_seconds || 0) + (sess?.idle_seconds || 0) + (sess?.away_seconds || 0);
    return {
      employeeId: uid,
      employeeCode: prof?.employee_code || null,
      name,
      email: prof?.email || "—",
      mobile: prof?.mobile || null,
      roles,
      primaryRole: roles[0] || "operations",
      isActiveAccount: prof?.is_active !== false,
      presenceStatus: presence,
      sessionId: sess?.session_id ? String(sess.session_id) : null,
      loginMethod: sess?.login_method ? String(sess.login_method) : null,
      loginAt: sess?.login_at ? String(sess.login_at) : null,
      lastHeartbeatAt: sess?.last_heartbeat_at ? String(sess.last_heartbeat_at) : null,
      lastActivityAt: sess?.last_activity_at ? String(sess.last_activity_at) : null,
      totalSessionMinutes: Math.round(totalSec / 60),
      activeMinutes: Math.round((sess?.active_seconds || 0) / 60),
      idleMinutes: Math.round(((sess?.idle_seconds || 0) + (sess?.away_seconds || 0)) / 60),
      browser: sess?.browser ? `${sess.browser} ${sess.browser_version || ""}`.trim() : null,
      os: sess?.operating_system ? String(sess.operating_system) : null,
      deviceType: sess?.device_type ? String(sess.device_type) : null,
      ipAddress: sess?.ip_address ? String(sess.ip_address) : null,
      currentPage: sess?.current_page ? String(sess.current_page) : null,
      currentModule: sess?.current_module ? String(sess.current_module) : null,
      currentOrderCode: sess?.current_order_code ? String(sess.current_order_code) : null,
      lastActionText: sess?.last_action_text ? String(sess.last_action_text) : null
    };
  });
  let filtered = operatorRows;
  if (data.statusFilter !== "all") {
    filtered = filtered.filter((r) => r.presenceStatus === data.statusFilter);
  }
  if (data.searchQuery.trim()) {
    const q = data.searchQuery.toLowerCase().trim();
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.employeeCode && r.employeeCode.toLowerCase().includes(q) || r.roles.some((role) => role.toLowerCase().includes(q)));
  }
  return {
    rows: filtered.slice(0, data.limit),
    totalStaffCount: operatorRows.length,
    activeCount: operatorRows.filter((r) => r.presenceStatus === "active").length,
    idleCount: operatorRows.filter((r) => r.presenceStatus === "idle").length,
    awayCount: operatorRows.filter((r) => r.presenceStatus === "away").length,
    offlineCount: operatorRows.filter((r) => r.presenceStatus === "offline").length
  };
});
const forceLogoutSessionAdmin_createServerFn_handler = createServerRpc({
  id: "a1710990f8c46ca07241f6449d89b9872f8207edabe560fd0fd03015131b3a67",
  name: "forceLogoutSessionAdmin",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => forceLogoutSessionAdmin.__executeServer(opts));
const forceLogoutSessionAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  reason: string().default("Force logged out by administrator")
}).parse(i)).handler(forceLogoutSessionAdmin_createServerFn_handler, async ({
  data,
  context
}) => {
  await verifyAdminOrSuperAdmin(context.userId);
  const admin = await getAdmin();
  const actorId = context.userId;
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const {
      data: res,
      error
    } = await admin.rpc("admin_force_logout_session", {
      p_session_id: data.sessionId,
      p_reason: data.reason
    });
    if (!error && res) {
      return res;
    }
    if (error) {
      console.warn("[forceLogoutSessionAdmin] RPC returned error, using direct table update:", error.message);
    }
  } catch (rpcErr) {
    console.warn("[forceLogoutSessionAdmin] RPC exception, using direct table update:", rpcErr);
  }
  const {
    data: sessionData
  } = await admin.from("employee_sessions").select("employee_id, auth_user_id, ip_address").eq("session_id", data.sessionId).maybeSingle();
  await admin.from("employee_sessions").update({
    is_active: false,
    status: "force_logged_out",
    logout_at: nowIso,
    logout_reason: data.reason,
    updated_at: nowIso
  }).eq("session_id", data.sessionId);
  if (sessionData?.employee_id) {
    await admin.from("employee_security_events").insert({
      employee_id: sessionData.employee_id,
      auth_user_id: sessionData.auth_user_id,
      actor_employee_id: actorId,
      target_employee_id: sessionData.employee_id,
      session_id: data.sessionId,
      event_type: "FORCE_LOGOUT",
      metadata: {
        reason: data.reason,
        timestamp: nowIso
      },
      ip_address: sessionData.ip_address || null
    });
  }
  return {
    ok: true,
    session_id: data.sessionId
  };
});
const forceLogoutAllSessionsAdmin_createServerFn_handler = createServerRpc({
  id: "0bab5649c0dce6e11c70bbe53573667f8649ef75ff6566b7acbebd24f0762b94",
  name: "forceLogoutAllSessionsAdmin",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => forceLogoutAllSessionsAdmin.__executeServer(opts));
const forceLogoutAllSessionsAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  reason: string().default("Force logged out of all devices by administrator")
}).parse(i)).handler(forceLogoutAllSessionsAdmin_createServerFn_handler, async ({
  data,
  context
}) => {
  await verifyAdminOrSuperAdmin(context.userId);
  const admin = await getAdmin();
  const actorId = context.userId;
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const {
      data: res,
      error
    } = await admin.rpc("admin_force_logout_all_sessions", {
      p_employee_id: data.employeeId,
      p_reason: data.reason
    });
    if (!error && res) {
      return res;
    }
    if (error) {
      console.warn("[forceLogoutAllSessionsAdmin] RPC returned error, using direct table update:", error.message);
    }
  } catch (rpcErr) {
    console.warn("[forceLogoutAllSessionsAdmin] RPC exception, using direct table update:", rpcErr);
  }
  const {
    data: sessions
  } = await admin.from("employee_sessions").select("session_id, auth_user_id, ip_address").eq("employee_id", data.employeeId).eq("is_active", true);
  const count = sessions?.length || 0;
  await admin.from("employee_sessions").update({
    is_active: false,
    status: "force_logged_out",
    logout_at: nowIso,
    logout_reason: data.reason,
    updated_at: nowIso
  }).eq("employee_id", data.employeeId).eq("is_active", true);
  await admin.from("employee_security_events").insert({
    employee_id: data.employeeId,
    actor_employee_id: actorId,
    target_employee_id: data.employeeId,
    event_type: "FORCE_LOGOUT_ALL",
    metadata: {
      reason: data.reason,
      sessions_terminated: count,
      timestamp: nowIso
    }
  });
  return {
    ok: true,
    terminated_count: count
  };
});
const getEmployeeSecurityDetailAdmin_createServerFn_handler = createServerRpc({
  id: "f238b499d9b67901c07679f4b77a6fab3088b18854776eb76b1205e72407e1df",
  name: "getEmployeeSecurityDetailAdmin",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => getEmployeeSecurityDetailAdmin.__executeServer(opts));
const getEmployeeSecurityDetailAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid()
}).parse(i)).handler(getEmployeeSecurityDetailAdmin_createServerFn_handler, async ({
  data,
  context
}) => {
  await verifyAdminOrSuperAdmin(context.userId);
  const admin = await getAdmin();
  const [{
    data: profile
  }, {
    data: activeSessions
  }, {
    data: loginHistory
  }, {
    data: securityEvents
  }, {
    data: recentActivity
  }] = await Promise.all([admin.from("profiles").select("*").eq("id", data.employeeId).maybeSingle(), admin.from("employee_sessions").select("*").eq("employee_id", data.employeeId).order("login_at", {
    ascending: false
  }).limit(10), admin.from("employee_login_history").select("*").eq("employee_id", data.employeeId).order("login_at", {
    ascending: false
  }).limit(20), admin.from("employee_security_events").select("*").eq("employee_id", data.employeeId).order("created_at", {
    ascending: false
  }).limit(20), admin.from("employee_activity_log").select("*").eq("employee_id", data.employeeId).order("created_at", {
    ascending: false
  }).limit(25)]);
  return {
    profile: profile || null,
    activeSessions: activeSessions ?? [],
    loginHistory: loginHistory ?? [],
    securityEvents: securityEvents ?? [],
    recentActivity: recentActivity ?? []
  };
});
const logEmployeeCrmActivity_createServerFn_handler = createServerRpc({
  id: "2797683dbec91af8c1fe604362b9345b671544f8480685016f0b41b5b4ccc971",
  name: "logEmployeeCrmActivity",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => logEmployeeCrmActivity.__executeServer(opts));
const logEmployeeCrmActivity = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().optional().nullable(),
  actionType: string().min(1),
  orderId: string().uuid().optional().nullable(),
  ticketId: string().uuid().optional().nullable(),
  previousStatus: string().optional().nullable(),
  newStatus: string().optional().nullable(),
  previousStage: string().optional().nullable(),
  newStage: string().optional().nullable(),
  metadata: record(string(), any()).default({})
}).parse(i)).handler(logEmployeeCrmActivity_createServerFn_handler, async ({
  data,
  context
}) => {
  const userId = context.userId;
  const admin = await getAdmin();
  await admin.from("employee_activity_log").insert({
    employee_id: userId,
    auth_user_id: userId,
    session_id: data.sessionId || null,
    action_type: data.actionType,
    order_id: data.orderId || null,
    ticket_id: data.ticketId || null,
    previous_status: data.previousStatus || null,
    new_status: data.newStatus || null,
    previous_stage: data.previousStage || null,
    new_stage: data.newStage || null,
    metadata: data.metadata
  });
  return {
    ok: true
  };
});
const getMySessionInfo_createServerFn_handler = createServerRpc({
  id: "fb4a0b8d71dcf2c85d64454ce89c6338feaca0ce0e6dc5af787d571444e3c27e",
  name: "getMySessionInfo",
  filename: "src/lib/crm/employee-sessions.functions.ts"
}, (opts) => getMySessionInfo.__executeServer(opts));
const getMySessionInfo = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMySessionInfo_createServerFn_handler, async ({
  context
}) => {
  const userId = context.userId;
  const admin = await getAdmin();
  const [{
    data: latestSession
  }, {
    data: recentLogs
  }] = await Promise.all([admin.from("employee_sessions").select("*").eq("employee_id", userId).eq("is_active", true).order("login_at", {
    ascending: false
  }).limit(1).maybeSingle(), admin.from("employee_activity_log").select("*").eq("employee_id", userId).order("created_at", {
    ascending: false
  }).limit(10)]);
  const activeSec = latestSession?.active_seconds || 0;
  const idleSec = (latestSession?.idle_seconds || 0) + (latestSession?.away_seconds || 0);
  return {
    session: latestSession || null,
    activeDurationMinutes: Math.round(activeSec / 60),
    idleDurationMinutes: Math.round(idleSec / 60),
    recentActivity: recentLogs ?? []
  };
});
export {
  forceLogoutAllSessionsAdmin_createServerFn_handler,
  forceLogoutSessionAdmin_createServerFn_handler,
  getEmployeeSecurityDetailAdmin_createServerFn_handler,
  getMySessionInfo_createServerFn_handler,
  listEmployeeSessionsAdmin_createServerFn_handler,
  logEmployeeCrmActivity_createServerFn_handler,
  logEmployeeLogout_createServerFn_handler,
  logLoginAttempt_createServerFn_handler,
  recordHeartbeat_createServerFn_handler,
  verifyGoogleStaffAccess_createServerFn_handler
};
