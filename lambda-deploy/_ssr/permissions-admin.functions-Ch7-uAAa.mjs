import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, a as array } from "../_libs/zod.mjs";
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
const listPermissionModules_createServerFn_handler = createServerRpc({
  id: "c29f5abce8f2a9cb7ee57f729379634a8bd561e2b67985444ff482ae458f6843",
  name: "listPermissionModules",
  filename: "src/lib/crm/permissions-admin.functions.ts"
}, (opts) => listPermissionModules.__executeServer(opts));
const listPermissionModules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listPermissionModules_createServerFn_handler, async ({
  context
}) => {
  const admin = await getAdmin();
  const {
    data,
    error
  } = await admin.from("permission_modules").select("*").order("sort_order", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const listUserPermissions_createServerFn_handler = createServerRpc({
  id: "8a403c3ce936ae0eb8897b725fc850af5ac7f520462b211a30858458f63d6907",
  name: "listUserPermissions",
  filename: "src/lib/crm/permissions-admin.functions.ts"
}, (opts) => listUserPermissions.__executeServer(opts));
const listUserPermissions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid()
}).parse(i)).handler(listUserPermissions_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const admin = await getAdmin();
  const [perms, scopes] = await Promise.all([admin.from("user_permissions").select("*").eq("user_id", data.userId), admin.from("user_permission_scopes").select("*").eq("user_id", data.userId)]);
  if (perms.error) throw new Error(perms.error.message);
  if (scopes.error) throw new Error(scopes.error.message);
  return {
    permissions: perms.data ?? [],
    scopes: scopes.data ?? []
  };
});
const UpsertPermInput = object({
  userId: string().uuid(),
  moduleKey: string().min(1),
  canView: boolean(),
  canCreate: boolean(),
  canEdit: boolean(),
  canDelete: boolean(),
  scopeAll: boolean()
});
const upsertUserPermission_createServerFn_handler = createServerRpc({
  id: "2a3092ab1cf8736be4399e2cada97c33d646b58aec7abf0a1c445e6d9fadf422",
  name: "upsertUserPermission",
  filename: "src/lib/crm/permissions-admin.functions.ts"
}, (opts) => upsertUserPermission.__executeServer(opts));
const upsertUserPermission = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpsertPermInput.parse(i)).handler(upsertUserPermission_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const admin = await getAdmin();
  const effectiveCanView = data.canView || data.canCreate || data.canEdit;
  const {
    error
  } = await admin.from("user_permissions").upsert({
    user_id: data.userId,
    module_key: data.moduleKey,
    can_view: effectiveCanView,
    can_create: data.canCreate,
    can_edit: data.canEdit,
    can_delete: data.canDelete,
    scope_all: data.scopeAll
  }, {
    onConflict: "user_id,module_key"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const SetScopesInput = object({
  userId: string().uuid(),
  moduleKey: string().min(1),
  scopes: array(object({
    websiteId: string().uuid().nullable().optional(),
    categoryId: string().uuid().nullable().optional(),
    serviceId: string().uuid().nullable().optional()
  }))
});
const setUserPermissionScopes_createServerFn_handler = createServerRpc({
  id: "707953d2d06d17bb45d798506ce509ddb8729000e6ff89a38888a4a02101e905",
  name: "setUserPermissionScopes",
  filename: "src/lib/crm/permissions-admin.functions.ts"
}, (opts) => setUserPermissionScopes.__executeServer(opts));
const setUserPermissionScopes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SetScopesInput.parse(i)).handler(setUserPermissionScopes_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const admin = await getAdmin();
  const {
    error: dErr
  } = await admin.from("user_permission_scopes").delete().eq("user_id", data.userId).eq("module_key", data.moduleKey);
  if (dErr) throw new Error(dErr.message);
  if (data.scopes.length > 0) {
    const rows = data.scopes.map((s) => ({
      user_id: data.userId,
      module_key: data.moduleKey,
      website_id: s.websiteId ?? null,
      category_id: s.categoryId ?? null,
      service_id: s.serviceId ?? null
    }));
    const {
      error
    } = await admin.from("user_permission_scopes").insert(rows);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const bulkResetUserPermissions_createServerFn_handler = createServerRpc({
  id: "f0dbedb5ec593c70f8c791dc2d475f702ed7a73c86c64fe807681bf6377e6d84",
  name: "bulkResetUserPermissions",
  filename: "src/lib/crm/permissions-admin.functions.ts"
}, (opts) => bulkResetUserPermissions.__executeServer(opts));
const bulkResetUserPermissions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid(),
  grantAll: boolean().default(false)
}).parse(i)).handler(bulkResetUserPermissions_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const admin = await getAdmin();
  const {
    data: modules,
    error: mErr
  } = await admin.from("permission_modules").select("key");
  if (mErr) throw new Error(mErr.message);
  const rows = (modules ?? []).map((m) => ({
    user_id: data.userId,
    module_key: m.key,
    can_view: data.grantAll,
    can_create: data.grantAll,
    can_edit: data.grantAll,
    can_delete: false,
    scope_all: true
  }));
  const {
    error
  } = await admin.from("user_permissions").upsert(rows, {
    onConflict: "user_id,module_key"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteUserPermissions_createServerFn_handler = createServerRpc({
  id: "792ee45aa2a1d4bed897cb8ac4e2e2dd9c95391e9cd29143c26854a49c16095f",
  name: "deleteUserPermissions",
  filename: "src/lib/crm/permissions-admin.functions.ts"
}, (opts) => deleteUserPermissions.__executeServer(opts));
const deleteUserPermissions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid()
}).parse(i)).handler(deleteUserPermissions_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const admin = await getAdmin();
  await Promise.all([admin.from("user_permissions").delete().eq("user_id", data.userId), admin.from("user_permission_scopes").delete().eq("user_id", data.userId)]);
  return {
    ok: true
  };
});
export {
  bulkResetUserPermissions_createServerFn_handler,
  deleteUserPermissions_createServerFn_handler,
  listPermissionModules_createServerFn_handler,
  listUserPermissions_createServerFn_handler,
  setUserPermissionScopes_createServerFn_handler,
  upsertUserPermission_createServerFn_handler
};
