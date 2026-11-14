import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { b as bestAccess } from "./roles-CFhgFhhh.mjs";
function getModuleAliases(key) {
  if (key === "leads" || key === "work.leads") return ["leads", "work.leads"];
  if (key === "orders" || key === "work.orders") return ["orders", "work.orders"];
  if (key === "support" || key === "work.support" || key === "tickets" || key === "complaints") {
    return ["support", "work.support", "tickets", "complaints"];
  }
  if (key === "finance" || key === "work.finance" || key === "payments" || key === "invoices") {
    return ["finance", "work.finance", "payments", "invoices"];
  }
  return [key];
}
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
const getMyPermissions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("e371ba470b5e8545bddb7a15efe6ed5c42577be071c1104ef102f9c38c302ac3"));
async function getUserModulePermission(_supabase, userId, moduleKey) {
  const admin = await getAdmin();
  const {
    data: roles
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const roleList = (roles ?? []).map((r) => r.role);
  const isAdmin = roleList.some((r) => r === "admin" || r === "super_admin");
  if (isAdmin) {
    return {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      scopeAll: true,
      scopes: []
    };
  }
  const aliases = getModuleAliases(moduleKey);
  const [permRes, scopesRes] = await Promise.all([admin.from("user_permissions").select("can_view, can_create, can_edit, can_delete, scope_all").eq("user_id", userId).in("module_key", aliases).limit(1).maybeSingle(), admin.from("user_permission_scopes").select("website_id, category_id, service_id").eq("user_id", userId).in("module_key", aliases)]);
  const perm = permRes.data;
  if (!perm) {
    const acc = bestAccess(roleList, moduleKey);
    const canView = acc !== "none";
    const canEdit = acc === "full";
    return {
      canView,
      canCreate: canEdit,
      canEdit,
      canDelete: false,
      scopeAll: true,
      scopes: []
    };
  }
  const scopes = (scopesRes.data ?? []).map((s) => ({
    websiteId: s.website_id ?? null,
    categoryId: s.category_id ?? null,
    serviceId: s.service_id ?? null
  }));
  const effectiveView = !!perm.can_view || !!perm.can_create || !!perm.can_edit;
  return {
    canView: effectiveView,
    canCreate: !!perm.can_create,
    canEdit: !!perm.can_edit,
    canDelete: !!perm.can_delete,
    scopeAll: !!perm.scope_all,
    scopes
  };
}
export {
  getMyPermissions as a,
  getUserModulePermission as g
};
