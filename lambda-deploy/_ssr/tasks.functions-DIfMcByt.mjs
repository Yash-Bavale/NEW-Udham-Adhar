import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, _ as _enum, s as string } from "../_libs/zod.mjs";
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
const listTasks_createServerFn_handler = createServerRpc({
  id: "1848a71e04596285318dde3ccacc82e72288aec67f4c203a610ce51262284ac7",
  name: "listTasks",
  filename: "src/lib/crm/tasks.functions.ts"
}, (opts) => listTasks.__executeServer(opts));
const listTasks = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  scope: _enum(["mine", "all"]).default("all"),
  includeCompleted: boolean().default(false)
}).parse(i ?? {})).handler(listTasks_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  let q = admin.from("tasks").select("id, title, description, priority, due_date, is_completed, assigned_to, lead_id, application_id, created_by, created_at, leads(lead_code), applications(application_code)").order("due_date", {
    ascending: true,
    nullsFirst: false
  }).limit(500);
  if (!data.includeCompleted) q = q.eq("is_completed", false);
  if (data.scope === "mine") q = q.eq("assigned_to", context.userId);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const assigneeIds = Array.from(new Set((rows ?? []).map((r) => r.assigned_to).filter((v) => !!v)));
  let nameMap = /* @__PURE__ */ new Map();
  if (assigneeIds.length > 0) {
    const {
      data: profs
    } = await admin.from("profiles").select("id, full_name, display_name, email").in("id", assigneeIds);
    (profs ?? []).forEach((p) => nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff"));
  }
  const tasks = (rows ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    priority: r.priority,
    due_date: r.due_date,
    is_completed: !!r.is_completed,
    assigned_to: r.assigned_to,
    assigned_name: r.assigned_to ? nameMap.get(r.assigned_to) ?? null : null,
    lead_id: r.lead_id,
    lead_code: r.leads?.lead_code ?? null,
    application_id: r.application_id,
    application_code: r.applications?.application_code ?? null,
    created_by: r.created_by,
    created_at: r.created_at
  }));
  return {
    tasks
  };
});
const listStaffForAssignment_createServerFn_handler = createServerRpc({
  id: "a7b4c46095556f0116bb77c34a6e2cf10ea985c5f8485b8b5451a77becb12970",
  name: "listStaffForAssignment",
  filename: "src/lib/crm/tasks.functions.ts"
}, (opts) => listStaffForAssignment.__executeServer(opts));
const listStaffForAssignment = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listStaffForAssignment_createServerFn_handler, async () => {
  const admin = await getAdmin();
  const {
    data: roleRows,
    error
  } = await admin.from("user_roles").select("user_id");
  if (error) throw new Error(error.message);
  const ids = Array.from(new Set((roleRows ?? []).map((r) => r.user_id)));
  if (ids.length === 0) return {
    staff: []
  };
  const {
    data: profs
  } = await admin.from("profiles").select("id, full_name, display_name, email, is_active").in("id", ids);
  const staff = (profs ?? []).filter((p) => p.is_active !== false).map((p) => ({
    id: p.id,
    name: p.full_name ?? p.display_name ?? p.email ?? "Staff"
  })).sort((a, b) => a.name.localeCompare(b.name));
  return {
    staff
  };
});
const searchLeadOptions_createServerFn_handler = createServerRpc({
  id: "dd21c7df0c60d6dbd86d9b9ffca5a8cc14d93af9804b4b08d5c550d88ff01f07",
  name: "searchLeadOptions",
  filename: "src/lib/crm/tasks.functions.ts"
}, (opts) => searchLeadOptions.__executeServer(opts));
const searchLeadOptions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  q: string().default("")
}).parse(i ?? {})).handler(searchLeadOptions_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const q = data.q.trim();
  let query = admin.from("leads").select("id, lead_code, name, mobile, service").order("created_at", {
    ascending: false
  }).limit(15);
  if (q.length >= 1) {
    const like = `%${q}%`;
    query = query.or(`name.ilike.${like},mobile.ilike.${like},email.ilike.${like},lead_code.ilike.${like}`);
  }
  const {
    data: rows,
    error
  } = await query;
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
const searchOrderOptions_createServerFn_handler = createServerRpc({
  id: "7cb3f5133c671bca070b4e49874fb2b6ccbbc6483b0e35deed28ea85af65d8be",
  name: "searchOrderOptions",
  filename: "src/lib/crm/tasks.functions.ts"
}, (opts) => searchOrderOptions.__executeServer(opts));
const searchOrderOptions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  q: string().default(""),
  leadId: string().uuid().optional()
}).parse(i ?? {})).handler(searchOrderOptions_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  let query = admin.from("applications").select("id, application_code, lead_id, service_id, fulfillment_status, services(service_name)").order("created_at", {
    ascending: false
  }).limit(15);
  if (data.leadId) query = query.eq("lead_id", data.leadId);
  const q = data.q.trim();
  if (q.length >= 1) {
    query = query.ilike("application_code", `%${q}%`);
  }
  const {
    data: rows,
    error
  } = await query;
  if (error) throw new Error(error.message);
  return {
    rows: (rows ?? []).map((r) => {
      const service = Array.isArray(r.services) ? r.services[0] : r.services;
      return {
        id: r.id,
        application_code: r.application_code,
        lead_id: r.lead_id,
        service_id: r.service_id,
        fulfillment_status: r.fulfillment_status,
        service_name: service?.service_name ?? null
      };
    })
  };
});
const createTask_createServerFn_handler = createServerRpc({
  id: "7e4b354f22d1c5649b79d4fd3c6b414771cafbdbb47379f19891014b54ac66ff",
  name: "createTask",
  filename: "src/lib/crm/tasks.functions.ts"
}, (opts) => createTask.__executeServer(opts));
const createTask = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  title: string().trim().min(2).max(200),
  description: string().trim().max(2e3).optional(),
  assignedTo: string().uuid().nullable().optional(),
  dueAt: string().min(1),
  // ISO from datetime-local
  priority: _enum(["high", "medium", "low"]).default("medium"),
  leadId: string().uuid().nullable().optional(),
  applicationId: string().uuid().nullable().optional()
}).parse(i)).handler(createTask_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  let customerId = null;
  if (data.leadId) {
    const {
      data: lead
    } = await admin.from("leads").select("customer_id").eq("id", data.leadId).maybeSingle();
    customerId = lead?.customer_id ?? null;
  }
  const {
    data: ins,
    error
  } = await admin.from("tasks").insert({
    title: data.title,
    description: data.description ?? null,
    assigned_to: data.assignedTo ?? null,
    due_date: new Date(data.dueAt).toISOString(),
    priority: data.priority,
    lead_id: data.leadId ?? null,
    application_id: data.applicationId ?? null,
    customer_id: customerId,
    created_by: context.userId,
    is_completed: false
  }).select("id").single();
  if (error) throw new Error(error.message);
  if (data.applicationId) {
    await admin.from("application_events").insert({
      application_id: data.applicationId,
      lead_id: data.leadId ?? null,
      customer_id: customerId,
      event_type: "task_created",
      new_value: data.title,
      created_by: context.userId
    });
  }
  return {
    id: ins.id
  };
});
const completeTask_createServerFn_handler = createServerRpc({
  id: "2e49731f2bbda08b56210775b2ac850640b990e9107b80a623a0d029e7018c85",
  name: "completeTask",
  filename: "src/lib/crm/tasks.functions.ts"
}, (opts) => completeTask.__executeServer(opts));
const completeTask = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  completed: boolean().default(true)
}).parse(i)).handler(completeTask_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const patch = data.completed ? {
    is_completed: true,
    completed_at: (/* @__PURE__ */ new Date()).toISOString(),
    completed_by: context.userId
  } : {
    is_completed: false,
    completed_at: null,
    completed_by: null
  };
  const {
    error
  } = await admin.from("tasks").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  completeTask_createServerFn_handler,
  createTask_createServerFn_handler,
  listStaffForAssignment_createServerFn_handler,
  listTasks_createServerFn_handler,
  searchLeadOptions_createServerFn_handler,
  searchOrderOptions_createServerFn_handler
};
