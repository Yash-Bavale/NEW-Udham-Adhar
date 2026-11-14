const ALLOWED_STAFF_ROLES = [
  "admin",
  "super_admin",
  "manager",
  "executive",
  "operations",
  "support",
  "accounts",
  "finance"
];
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function getStaffRoleInfo(admin, userId) {
  const { data } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r) => String(r.role));
  const isAdmin = roles.some((r) => r === "admin" || r === "super_admin");
  const isManager = roles.includes("manager");
  const isStaff = roles.some((r) => ALLOWED_STAFF_ROLES.includes(r));
  return { roles, isAdmin, isManager, isStaff };
}
async function assertStaffUser(admin, userId) {
  const roleInfo = await getStaffRoleInfo(admin, userId);
  if (!roleInfo.isStaff) {
    throw new Error("Forbidden: Staff access required");
  }
  return roleInfo;
}
async function assertCanAccessOrder(params) {
  const admin = params.admin || await getAdmin();
  const roleInfo = await assertStaffUser(admin, params.userId);
  const { data: app, error } = await admin.from("applications").select("id, application_code, assigned_to").eq("id", params.orderId).eq("is_deleted", false).maybeSingle();
  if (error || !app) {
    throw new Error("Order not found");
  }
  if (roleInfo.isAdmin || roleInfo.isManager) {
    return { allowed: true, roleInfo, application: app };
  }
  if (app.assigned_to !== params.userId) {
    throw new Error("Forbidden: You do not have permission to access this order. It is not assigned to you.");
  }
  return { allowed: true, roleInfo, application: app };
}
export {
  assertCanAccessOrder,
  assertStaffUser,
  getStaffRoleInfo
};
