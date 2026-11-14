import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as ALL_MODULES, b as bestAccess } from "./roles-CFhgFhhh.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const getMyPermissions_createServerFn_handler = createServerRpc({
  id: "e371ba470b5e8545bddb7a15efe6ed5c42577be071c1104ef102f9c38c302ac3",
  name: "getMyPermissions",
  filename: "src/lib/crm/permissions.functions.ts"
}, (opts) => getMyPermissions.__executeServer(opts));
const getMyPermissions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyPermissions_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const admin = await getAdmin();
  const {
    data: roles
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const roleList = (roles ?? []).map((r) => r.role);
  const isAdmin = roleList.some((r) => r === "admin" || r === "super_admin");
  if (isAdmin) return {
    isAdmin: true,
    modules: {}
  };
  const [permsRes, scopesRes] = await Promise.all([admin.from("user_permissions").select("module_key, can_view, can_create, can_edit, can_delete, scope_all").eq("user_id", userId), admin.from("user_permission_scopes").select("module_key, website_id, category_id, service_id").eq("user_id", userId)]);
  if (permsRes.error) throw new Error(permsRes.error.message);
  if (scopesRes.error) throw new Error(scopesRes.error.message);
  const modules = {};
  const customPerms = permsRes.data ?? [];
  for (const m of ALL_MODULES) {
    const acc = bestAccess(roleList, m);
    const canView = acc !== "none";
    const canEdit = acc === "full";
    const permObj = {
      view: canView,
      create: canEdit,
      edit: canEdit,
      delete: false,
      scopeAll: true,
      scopes: []
    };
    for (const alias of getModuleAliases(m)) {
      modules[alias] = {
        ...permObj,
        scopes: []
      };
    }
  }
  for (const p of customPerms) {
    const effectiveView = !!p.can_view || !!p.can_create || !!p.can_edit;
    const permObj = {
      view: effectiveView,
      create: !!p.can_create,
      edit: !!p.can_edit,
      delete: !!p.can_delete,
      scopeAll: !!p.scope_all,
      scopes: []
    };
    for (const alias of getModuleAliases(p.module_key)) {
      modules[alias] = {
        ...permObj,
        scopes: []
      };
    }
  }
  for (const s of scopesRes.data ?? []) {
    for (const alias of getModuleAliases(s.module_key)) {
      const m = modules[alias];
      if (!m) continue;
      m.scopes.push({
        websiteId: s.website_id ?? null,
        categoryId: s.category_id ?? null,
        serviceId: s.service_id ?? null
      });
    }
  }
  return {
    isAdmin: false,
    modules
  };
});
export {
  getMyPermissions_createServerFn_handler
};
