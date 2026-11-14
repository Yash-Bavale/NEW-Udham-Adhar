import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import { i as isTransitionAllowed } from "./status-engine-CYuvnAME.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, _ as _enum } from "../_libs/zod.mjs";
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
async function getRoles(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r) => r.role);
}
const transitionLead_createServerFn_handler = createServerRpc({
  id: "5a1abb33bc2a8e5ca7940b7d92cb9c732c9056f7468e7c14f476543635d182f2",
  name: "transitionLead",
  filename: "src/lib/crm/status-engine.functions.ts"
}, (opts) => transitionLead.__executeServer(opts));
const transitionLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  id: string().uuid(),
  to: string(),
  note: string().optional()
})).handler(transitionLead_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const roles = await getRoles(context.supabase, user.id);
  const {
    data: prev
  } = await (await getAdmin()).from("leads").select("*").eq("id", data.id).single();
  if (!prev) throw new Error("Lead not found");
  if (!isTransitionAllowed("lead", prev.status, data.to, roles)) {
    throw new Error(`Transition ${prev.status} → ${data.to} not allowed for your role`);
  }
  const {
    error
  } = await (await getAdmin()).from("leads").update({
    status: data.to
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "lead",
    entityId: data.id,
    action: "status_transition",
    oldValue: {
      status: prev.status
    },
    newValue: {
      status: data.to,
      note: data.note
    },
    actorId: user.id
  });
  return {
    ok: true
  };
});
const transitionApplication_createServerFn_handler = createServerRpc({
  id: "65469e4203b2260eb7440da0cb6e6fe9a6ced0325a486d5077e8f33437ea2822",
  name: "transitionApplication",
  filename: "src/lib/crm/status-engine.functions.ts"
}, (opts) => transitionApplication.__executeServer(opts));
const transitionApplication = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  id: string().uuid(),
  to: string(),
  note: string().optional()
})).handler(transitionApplication_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const roles = await getRoles(context.supabase, user.id);
  const {
    data: prev
  } = await (await getAdmin()).from("applications").select("*").eq("id", data.id).single();
  if (!prev) throw new Error("Application not found");
  if (!isTransitionAllowed("application", prev.application_status, data.to, roles)) {
    throw new Error(`Transition ${prev.application_status} → ${data.to} not allowed for your role`);
  }
  const {
    error
  } = await (await getAdmin()).from("applications").update({
    application_status: data.to
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "application",
    entityId: data.id,
    action: "status_transition",
    oldValue: {
      application_status: prev.application_status
    },
    newValue: {
      application_status: data.to,
      note: data.note
    },
    actorId: user.id
  });
  return {
    ok: true
  };
});
const transitionComplaint_createServerFn_handler = createServerRpc({
  id: "95d44d906ae59330134cb408bccccc6477dd4f3fe235d64e3b15579aa4d81734",
  name: "transitionComplaint",
  filename: "src/lib/crm/status-engine.functions.ts"
}, (opts) => transitionComplaint.__executeServer(opts));
const transitionComplaint = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  id: string().uuid(),
  to: _enum(["pending", "in_progress", "resolved", "closed"]),
  note: string().optional()
})).handler(transitionComplaint_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const roles = await getRoles(context.supabase, user.id);
  const {
    data: prev
  } = await (await getAdmin()).from("complaints").select("*").eq("id", data.id).single();
  if (!prev) throw new Error("Complaint not found");
  if (!isTransitionAllowed("complaint", prev.status, data.to, roles)) {
    throw new Error(`Transition ${prev.status} → ${data.to} not allowed for your role`);
  }
  const patch = {
    status: data.to
  };
  if (data.to === "resolved" || data.to === "closed") patch.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
  const {
    error
  } = await (await getAdmin()).from("complaints").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "complaint",
    entityId: data.id,
    action: "status_transition",
    oldValue: {
      status: prev.status
    },
    newValue: {
      status: data.to,
      note: data.note
    },
    actorId: user.id
  });
  return {
    ok: true
  };
});
const getMyRoles_createServerFn_handler = createServerRpc({
  id: "31408bd52348e5c8b9115280051f1416b2194f62e214dbffea630bcca2904707",
  name: "getMyRoles",
  filename: "src/lib/crm/status-engine.functions.ts"
}, (opts) => getMyRoles.__executeServer(opts));
const getMyRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyRoles_createServerFn_handler, async ({
  context
}) => {
  const {
    data
  } = await context.supabase.from("user_roles").select("role");
  return {
    roles: (data ?? []).map((r) => r.role)
  };
});
export {
  getMyRoles_createServerFn_handler,
  transitionApplication_createServerFn_handler,
  transitionComplaint_createServerFn_handler,
  transitionLead_createServerFn_handler
};
