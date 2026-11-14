import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, s as string } from "../_libs/zod.mjs";
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
async function assertAdmin(supabase, userId) {
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
  if (!isAdmin && !isSuper) throw new Error("Forbidden");
}
const getAssignmentConfig_createServerFn_handler = createServerRpc({
  id: "7a5491f1b686526821af7e0777f253b9c18a7199be5912f80bd070c010ae126f",
  name: "getAssignmentConfig",
  filename: "src/lib/crm/assignment.functions.ts"
}, (opts) => getAssignmentConfig.__executeServer(opts));
const getAssignmentConfig = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAssignmentConfig_createServerFn_handler, async () => {
  const admin = await getAdmin();
  const {
    data,
    error
  } = await admin.from("lead_assignment_config").select("*").is("service_id", null).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    config: data
  };
});
const setAutoAssignEnabled_createServerFn_handler = createServerRpc({
  id: "2173c3ce7fa35b79e135fcfc01d86bff963a11da268e97ce97eac7377a71d81c",
  name: "setAutoAssignEnabled",
  filename: "src/lib/crm/assignment.functions.ts"
}, (opts) => setAutoAssignEnabled.__executeServer(opts));
const setAutoAssignEnabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  enabled: boolean()
}).parse(i)).handler(setAutoAssignEnabled_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    error
  } = await admin.from("lead_assignment_config").update({
    is_active: data.enabled,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).is("service_id", null);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listAssignmentPool_createServerFn_handler = createServerRpc({
  id: "91eaffc162c08d41abe3c48b3f2a8f7b55f78a6f96b03bd9f89300ab54506141",
  name: "listAssignmentPool",
  filename: "src/lib/crm/assignment.functions.ts"
}, (opts) => listAssignmentPool.__executeServer(opts));
const listAssignmentPool = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAssignmentPool_createServerFn_handler, async () => {
  const admin = await getAdmin();
  const {
    data: rows,
    error
  } = await admin.from("assignment_pool").select("id, user_id, service_id, is_active, last_assigned_at, total_assigned, created_at").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  const userIds = Array.from(new Set((rows ?? []).map((r) => r.user_id)));
  const svcIds = Array.from(new Set((rows ?? []).map((r) => r.service_id).filter(Boolean)));
  const [{
    data: profs
  }, {
    data: roleRows
  }, {
    data: svcs
  }] = await Promise.all([userIds.length ? admin.from("profiles").select("id, full_name, display_name, email, is_active, employment_status").in("id", userIds) : Promise.resolve({
    data: []
  }), userIds.length ? admin.from("user_roles").select("user_id, role").in("user_id", userIds) : Promise.resolve({
    data: []
  }), svcIds.length ? admin.from("services").select("id, service_name").in("id", svcIds) : Promise.resolve({
    data: []
  })]);
  const profMap = /* @__PURE__ */ new Map();
  (profs ?? []).forEach((p) => profMap.set(p.id, p));
  const staleUserIds = userIds.filter((uid) => {
    const p = profMap.get(uid);
    if (!p) return true;
    const status = String(p.employment_status || "").toUpperCase();
    return status === "ARCHIVED" || status === "TERMINATED" || p.is_active === false;
  });
  if (staleUserIds.length > 0) {
    try {
      await admin.from("assignment_pool").delete().in("user_id", staleUserIds);
    } catch (cleanupErr) {
      console.warn("[listAssignmentPool] stale pool cleanup notice:", cleanupErr);
    }
  }
  const nameMap = /* @__PURE__ */ new Map();
  (profs ?? []).forEach((p) => nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff"));
  const roleMap = /* @__PURE__ */ new Map();
  (roleRows ?? []).forEach((r) => {
    const arr = roleMap.get(r.user_id) ?? [];
    arr.push(r.role);
    roleMap.set(r.user_id, arr);
  });
  const svcMap = /* @__PURE__ */ new Map();
  (svcs ?? []).forEach((s) => svcMap.set(s.id, s.service_name));
  const staleSet = new Set(staleUserIds);
  const validRows = (rows ?? []).filter((r) => !staleSet.has(r.user_id));
  return {
    rows: validRows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      user_name: nameMap.get(r.user_id) ?? "Staff",
      user_roles: roleMap.get(r.user_id) ?? [],
      service_id: r.service_id,
      service_name: r.service_id ? svcMap.get(r.service_id) ?? "—" : "All Services",
      is_active: r.is_active,
      last_assigned_at: r.last_assigned_at,
      total_assigned: r.total_assigned
    }))
  };
});
const listEligibleEmployees_createServerFn_handler = createServerRpc({
  id: "b7ba6a8b7c43e0c7654c19787799e796b414196d1fb8e28d5d4caf2fbfa34200",
  name: "listEligibleEmployees",
  filename: "src/lib/crm/assignment.functions.ts"
}, (opts) => listEligibleEmployees.__executeServer(opts));
const listEligibleEmployees = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listEligibleEmployees_createServerFn_handler, async () => {
  const admin = await getAdmin();
  const ORDER_ACCESS_ROLES = ["operations", "executive", "manager", "admin", "super_admin", "support"];
  const {
    data: roleRows,
    error
  } = await admin.from("user_roles").select("user_id, role").in("role", ORDER_ACCESS_ROLES);
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((roleRows ?? []).map((r) => r.user_id)));
  if (!ids.length) return {
    rows: []
  };
  const {
    data: profs
  } = await admin.from("profiles").select("id, full_name, display_name, email, is_active").in("id", ids);
  const byId = /* @__PURE__ */ new Map();
  (profs ?? []).forEach((p) => byId.set(p.id, p));
  const roleById = /* @__PURE__ */ new Map();
  (roleRows ?? []).forEach((r) => {
    if (!roleById.has(r.user_id)) roleById.set(r.user_id, r.role);
  });
  return {
    rows: ids.map((id) => {
      const p = byId.get(id);
      if (!p || p.is_active === false) return null;
      return {
        id,
        name: p.full_name ?? p.display_name ?? p.email ?? "Staff",
        role: roleById.get(id) ?? "executive"
      };
    }).filter(Boolean)
  };
});
const addToPool_createServerFn_handler = createServerRpc({
  id: "f77ca8591a43e62b5a1411d9c32b2c9ec2e6fc1360924690709f6e7dec4ed4a8",
  name: "addToPool",
  filename: "src/lib/crm/assignment.functions.ts"
}, (opts) => addToPool.__executeServer(opts));
const addToPool = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid(),
  serviceId: string().uuid().nullable().optional()
}).parse(i)).handler(addToPool_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: roles
  } = await admin.from("user_roles").select("role").eq("user_id", data.userId);
  const ORDER_ACCESS_ROLES = ["operations", "executive", "manager", "admin", "super_admin", "support"];
  const okRoles = (roles ?? []).some((r) => ORDER_ACCESS_ROLES.includes(r.role));
  if (!okRoles) throw new Error("Only employees with order access roles can be added to the pool.");
  const {
    error
  } = await admin.from("assignment_pool").insert({
    user_id: data.userId,
    service_id: data.serviceId ?? null,
    is_active: true
  });
  if (error) {
    if (error.code === "23505") throw new Error("This employee is already in the pool for this service.");
    throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const togglePoolActive_createServerFn_handler = createServerRpc({
  id: "dc19c53b368fe6f95d5a4d961beeafd20a738cf08324386310c95a2cd5635b72",
  name: "togglePoolActive",
  filename: "src/lib/crm/assignment.functions.ts"
}, (opts) => togglePoolActive.__executeServer(opts));
const togglePoolActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  isActive: boolean()
}).parse(i)).handler(togglePoolActive_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: poolRow
  } = await admin.from("assignment_pool").select("id, user_id").eq("id", data.id).maybeSingle();
  const {
    error
  } = await admin.from("assignment_pool").update({
    is_active: data.isActive
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  if (poolRow?.user_id) {
    if (!data.isActive) {
      const {
        data: otherActive
      } = await admin.from("assignment_pool").select("id").eq("user_id", poolRow.user_id).eq("is_active", true).neq("id", data.id).limit(1);
      if (!otherActive || otherActive.length === 0) {
        await admin.from("profiles").update({
          auto_assign_enabled: false
        }).eq("id", poolRow.user_id);
      }
    } else {
      await admin.from("profiles").update({
        auto_assign_enabled: true
      }).eq("id", poolRow.user_id);
    }
  }
  return {
    ok: true
  };
});
const removeFromPool_createServerFn_handler = createServerRpc({
  id: "2274070860800f84c07cd686dab3cdd7ea6c8ecf219cb304973b8f6125073bf8",
  name: "removeFromPool",
  filename: "src/lib/crm/assignment.functions.ts"
}, (opts) => removeFromPool.__executeServer(opts));
const removeFromPool = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(removeFromPool_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: poolRow
  } = await admin.from("assignment_pool").select("id, user_id").eq("id", data.id).maybeSingle();
  const {
    error
  } = await admin.from("assignment_pool").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  if (poolRow?.user_id) {
    const {
      data: remaining
    } = await admin.from("assignment_pool").select("id").eq("user_id", poolRow.user_id).eq("is_active", true).limit(1);
    if (!remaining || remaining.length === 0) {
      await admin.from("profiles").update({
        auto_assign_enabled: false
      }).eq("id", poolRow.user_id);
    }
  }
  return {
    ok: true
  };
});
export {
  addToPool_createServerFn_handler,
  getAssignmentConfig_createServerFn_handler,
  listAssignmentPool_createServerFn_handler,
  listEligibleEmployees_createServerFn_handler,
  removeFromPool_createServerFn_handler,
  setAutoAssignEnabled_createServerFn_handler,
  togglePoolActive_createServerFn_handler
};
