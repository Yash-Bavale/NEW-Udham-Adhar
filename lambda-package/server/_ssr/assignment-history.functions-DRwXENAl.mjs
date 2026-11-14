import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import { getReassignmentOperationalMetrics, reassignOrdersFromUnavailableEmployee, distributeOrdersEquallyCanonical } from "./assignment-engine.server--SlhbLzd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, b as boolean, _ as _enum, a as array } from "../_libs/zod.mjs";
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
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
import "./order-action-logger.server-DJE-NEoc.mjs";
import "./emit.server-OhKEr4hO.mjs";
async function assertAdminOrStaff(supabase, userId) {
  const [{
    data: isAdmin
  }, {
    data: isSuper
  }] = await Promise.all([supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin"
  }), supabase.rpc("has_role", {
    _user_id: userId,
    _role: "super_admin"
  })]);
  return {
    isAdmin: !!isAdmin,
    isSuper: !!isSuper
  };
}
const getOrderAssignmentHistory_createServerFn_handler = createServerRpc({
  id: "f89ae9f1db3c5ef0f51b2c9e0578f8de83470985d7547a7ab3a2818f75ce9621",
  name: "getOrderAssignmentHistory",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => getOrderAssignmentHistory.__executeServer(opts));
const getOrderAssignmentHistory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(getOrderAssignmentHistory_createServerFn_handler, async ({
  data
}) => {
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("order_assignment_history").select("*").eq("order_id", data.orderId).order("created_at", {
    ascending: false
  });
  if (error) {
    console.warn("[getOrderAssignmentHistory] fetch notice:", error.message);
    return {
      rows: []
    };
  }
  const userIds = Array.from(new Set((rows ?? []).flatMap((r) => [r.previous_employee_id, r.new_employee_id, r.changed_by]).filter(Boolean)));
  const {
    data: profiles
  } = userIds.length ? await supabaseAdmin.from("profiles").select("id, full_name, display_name, email").in("id", userIds) : {
    data: []
  };
  const nameMap = /* @__PURE__ */ new Map();
  (profiles ?? []).forEach((p) => nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff"));
  return {
    rows: (rows ?? []).map((r) => ({
      id: r.id,
      orderId: r.order_id,
      leadId: r.lead_id,
      previousEmployeeId: r.previous_employee_id,
      previousEmployeeName: r.previous_employee_id ? nameMap.get(r.previous_employee_id) || "Unassigned" : "Unassigned",
      newEmployeeId: r.new_employee_id,
      newEmployeeName: r.new_employee_id ? nameMap.get(r.new_employee_id) || "Unassigned" : "Unassigned",
      changeType: r.change_type,
      reason: r.reason || null,
      source: r.source || "system",
      changedBy: r.changed_by,
      changedByName: r.changed_by ? nameMap.get(r.changed_by) || "System" : "System",
      createdAt: r.created_at,
      metadata: r.metadata || {}
    }))
  };
});
const listAssignmentHistoryAdmin_createServerFn_handler = createServerRpc({
  id: "7f2244ed856e42b971ee04c118cf8233bc171fc09764a3e88d588f3e23ffd9d5",
  name: "listAssignmentHistoryAdmin",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => listAssignmentHistoryAdmin.__executeServer(opts));
const listAssignmentHistoryAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(30),
  search: string().optional(),
  employeeId: string().optional(),
  previousEmployeeId: string().optional(),
  newEmployeeId: string().optional(),
  changeType: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
}).parse(i ?? {})).handler(listAssignmentHistoryAdmin_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdminOrStaff(context.supabase, context.userId);
  let query = supabaseAdmin.from("order_assignment_history").select("*", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  });
  if (data.employeeId && data.employeeId !== "all") {
    query = query.or(`previous_employee_id.eq.${data.employeeId},new_employee_id.eq.${data.employeeId}`);
  }
  if (data.previousEmployeeId && data.previousEmployeeId !== "all") {
    query = query.eq("previous_employee_id", data.previousEmployeeId);
  }
  if (data.newEmployeeId && data.newEmployeeId !== "all") {
    query = query.eq("new_employee_id", data.newEmployeeId);
  }
  if (data.changeType && data.changeType !== "all") {
    if (data.changeType === "auto") {
      query = query.ilike("change_type", "AUTO%");
    } else if (data.changeType === "manual") {
      query = query.ilike("change_type", "MANUAL%");
    } else {
      query = query.eq("change_type", data.changeType);
    }
  }
  if (data.dateFrom) {
    query = query.gte("created_at", `${data.dateFrom}T00:00:00+05:30`);
  }
  if (data.dateTo) {
    query = query.lte("created_at", `${data.dateTo}T23:59:59+05:30`);
  }
  const start = (data.page - 1) * data.pageSize;
  query = query.range(start, start + data.pageSize - 1);
  const {
    data: rows,
    count,
    error
  } = await query;
  if (error) {
    console.warn("[listAssignmentHistoryAdmin] query notice:", error.message);
    return {
      rows: [],
      total: 0,
      page: data.page,
      pageSize: data.pageSize
    };
  }
  const orderIds = Array.from(new Set((rows ?? []).map((r) => r.order_id).filter(Boolean)));
  const userIds = Array.from(new Set((rows ?? []).flatMap((r) => [r.previous_employee_id, r.new_employee_id, r.changed_by]).filter(Boolean)));
  const [{
    data: apps
  }, {
    data: profiles
  }] = await Promise.all([orderIds.length ? supabaseAdmin.from("applications").select("id, application_code, customer_id, customers(name, primary_mobile)").in("id", orderIds) : {
    data: []
  }, userIds.length ? supabaseAdmin.from("profiles").select("id, full_name, display_name, email").in("id", userIds) : {
    data: []
  }]);
  const appMap = /* @__PURE__ */ new Map();
  (apps ?? []).forEach((a) => appMap.set(a.id, a));
  const nameMap = /* @__PURE__ */ new Map();
  (profiles ?? []).forEach((p) => nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff"));
  let mappedRows = (rows ?? []).map((r) => {
    const app = appMap.get(r.order_id);
    return {
      id: r.id,
      orderId: r.order_id,
      applicationCode: app?.application_code || r.order_id.slice(0, 8),
      customerName: app?.customers?.name || "Customer",
      customerMobile: app?.customers?.primary_mobile || null,
      previousEmployeeId: r.previous_employee_id,
      previousEmployeeName: r.previous_employee_id ? nameMap.get(r.previous_employee_id) || "Unassigned" : "Unassigned",
      newEmployeeId: r.new_employee_id,
      newEmployeeName: r.new_employee_id ? nameMap.get(r.new_employee_id) || "Unassigned" : "Unassigned",
      changeType: r.change_type,
      reason: r.reason || null,
      source: r.source || "system",
      changedBy: r.changed_by,
      changedByName: r.changed_by ? nameMap.get(r.changed_by) || "System" : "System",
      createdAt: r.created_at,
      metadata: r.metadata || {}
    };
  });
  if (data.search && data.search.trim()) {
    const q = data.search.trim().toLowerCase();
    mappedRows = mappedRows.filter((r) => r.applicationCode.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.previousEmployeeName.toLowerCase().includes(q) || r.newEmployeeName.toLowerCase().includes(q) || (r.reason || "").toLowerCase().includes(q));
  }
  return {
    rows: mappedRows,
    total: count ?? mappedRows.length,
    page: data.page,
    pageSize: data.pageSize
  };
});
const getAssignmentOperationalMetrics_createServerFn_handler = createServerRpc({
  id: "426dc8982165cb56585502cfa8624b1abfbf84bb14875001b82612faca3f7119",
  name: "getAssignmentOperationalMetrics",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => getAssignmentOperationalMetrics.__executeServer(opts));
const getAssignmentOperationalMetrics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAssignmentOperationalMetrics_createServerFn_handler, async ({
  context
}) => {
  await assertAdminOrStaff(context.supabase, context.userId);
  return await getReassignmentOperationalMetrics();
});
const createEmployeeLeave_createServerFn_handler = createServerRpc({
  id: "44a247c443a8eff6f2a9767e8dc03f66b30578339a63f95b57919120b951f5a4",
  name: "createEmployeeLeave",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => createEmployeeLeave.__executeServer(opts));
const createEmployeeLeave = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  startTime: string(),
  endTime: string(),
  reason: string().optional().default("Staff on scheduled leave"),
  autoReassign: boolean().default(true)
}).parse(i)).handler(createEmployeeLeave_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdminOrStaff(context.supabase, context.userId);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: leave,
    error
  } = await supabaseAdmin.from("employee_leaves").insert({
    employee_id: data.employeeId,
    start_time: new Date(data.startTime).toISOString(),
    end_time: new Date(data.endTime).toISOString(),
    reason: data.reason,
    status: "ACTIVE",
    auto_reassign: data.autoReassign,
    created_by: context.userId,
    created_at: nowIso,
    updated_at: nowIso
  }).select("*").maybeSingle();
  if (error) throw new Error(error.message);
  let redistributionSummary = null;
  const startsNow = new Date(data.startTime).getTime() <= Date.now() + 6e4;
  if (startsNow && data.autoReassign) {
    redistributionSummary = await reassignOrdersFromUnavailableEmployee({
      unavailableEmployeeId: data.employeeId,
      reason: `Employee on leave: ${data.reason}`,
      changeType: "AUTO_LEAVE",
      actorId: context.userId
    });
  }
  return {
    success: true,
    leave,
    redistributionSummary
  };
});
const cancelEmployeeLeave_createServerFn_handler = createServerRpc({
  id: "5988fb6c503a67ea25dccc8a4628ecf3a9e30600c19e3155e4836ab212bc61e6",
  name: "cancelEmployeeLeave",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => cancelEmployeeLeave.__executeServer(opts));
const cancelEmployeeLeave = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leaveId: string().uuid()
}).parse(i)).handler(cancelEmployeeLeave_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdminOrStaff(context.supabase, context.userId);
  const {
    error
  } = await supabaseAdmin.from("employee_leaves").update({
    status: "CANCELLED",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.leaveId);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const listEmployeeLeaves_createServerFn_handler = createServerRpc({
  id: "7546255aaf3b239be1bd0df753c380337fb8555a475ea5ad788a76e44a2b3cff",
  name: "listEmployeeLeaves",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => listEmployeeLeaves.__executeServer(opts));
const listEmployeeLeaves = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listEmployeeLeaves_createServerFn_handler, async ({
  context
}) => {
  await assertAdminOrStaff(context.supabase, context.userId);
  const {
    data: leaves,
    error
  } = await supabaseAdmin.from("employee_leaves").select("*").order("start_time", {
    ascending: false
  }).limit(100);
  if (error) return {
    rows: []
  };
  const employeeIds = Array.from(new Set((leaves ?? []).map((l) => l.employee_id)));
  const {
    data: profiles
  } = employeeIds.length ? await supabaseAdmin.from("profiles").select("id, full_name, display_name, email").in("id", employeeIds) : {
    data: []
  };
  const nameMap = /* @__PURE__ */ new Map();
  (profiles ?? []).forEach((p) => nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff"));
  return {
    rows: (leaves ?? []).map((l) => ({
      id: l.id,
      employeeId: l.employee_id,
      employeeName: nameMap.get(l.employee_id) || "Staff",
      startTime: l.start_time,
      endTime: l.end_time,
      reason: l.reason,
      status: l.status,
      autoReassign: l.auto_reassign,
      reassignedCount: l.reassigned_count,
      createdAt: l.created_at
    }))
  };
});
const triggerEmployeeReassignment_createServerFn_handler = createServerRpc({
  id: "6cc2097d0c981c4eababa1c6615b3e3558cf8cab084772c94c8408e7475ec53a",
  name: "triggerEmployeeReassignment",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => triggerEmployeeReassignment.__executeServer(opts));
const triggerEmployeeReassignment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  reason: string().min(1),
  changeType: _enum(["AUTO_UNAVAILABLE", "AUTO_LEAVE", "AUTO_INACTIVITY"]).default("AUTO_UNAVAILABLE")
}).parse(i)).handler(triggerEmployeeReassignment_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdminOrStaff(context.supabase, context.userId);
  return await reassignOrdersFromUnavailableEmployee({
    unavailableEmployeeId: data.employeeId,
    reason: data.reason,
    changeType: data.changeType,
    actorId: context.userId
  });
});
const autoDistributeSelectedOrders_createServerFn_handler = createServerRpc({
  id: "f52e1267030f91f5a09e1f66ae38caf9bdd9a6e4210d17cc03b77e191b4da030",
  name: "autoDistributeSelectedOrders",
  filename: "src/lib/crm/assignment-history.functions.ts"
}, (opts) => autoDistributeSelectedOrders.__executeServer(opts));
const autoDistributeSelectedOrders = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationIds: array(string().uuid()).min(1),
  reason: string().optional(),
  targetEmployeeIds: array(string().uuid()).optional()
}).parse(i)).handler(autoDistributeSelectedOrders_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdminOrStaff(context.supabase, context.userId);
  return await distributeOrdersEquallyCanonical(data.applicationIds, context.userId, data.reason || "Equally distributed by SuperAdmin across active staff", data.targetEmployeeIds);
});
export {
  autoDistributeSelectedOrders_createServerFn_handler,
  cancelEmployeeLeave_createServerFn_handler,
  createEmployeeLeave_createServerFn_handler,
  getAssignmentOperationalMetrics_createServerFn_handler,
  getOrderAssignmentHistory_createServerFn_handler,
  listAssignmentHistoryAdmin_createServerFn_handler,
  listEmployeeLeaves_createServerFn_handler,
  triggerEmployeeReassignment_createServerFn_handler
};
