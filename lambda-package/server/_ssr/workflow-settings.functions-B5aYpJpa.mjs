import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { _ as _enum, o as object, p as preprocess, n as number, b as boolean, s as string } from "../_libs/zod.mjs";
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
const STAFF = ["super_admin", "admin", "manager", "operations", "executive", "support", "finance", "accounts"];
const ADMIN = ["super_admin", "admin"];
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
const TableEnum = _enum(["workflow_delay_reasons", "workflow_closure_reasons"]);
const listReasons_createServerFn_handler = createServerRpc({
  id: "e9f1f0226d382bcdece75b519f9c4aafc4924c4b13cb57e55922ef46603e5abc",
  name: "listReasons",
  filename: "src/lib/crm/workflow-settings.functions.ts"
}, (opts) => listReasons.__executeServer(opts));
const listReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  table: TableEnum
}).parse(d)).handler(listReasons_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const select = data.table === "workflow_delay_reasons" ? "id,code,label,description,is_active,sort_order,updated_at,side,email_template_code" : "id,code,label,description,is_active,sort_order,updated_at";
  const {
    data: rows,
    error
  } = await admin.from(data.table).select(select).order("sort_order").order("label");
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
const sanitizeCode = (codeStr) => {
  return codeStr.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
};
const ReasonInput = preprocess((raw) => {
  if (raw && typeof raw === "object" && raw !== null) {
    const obj = {
      ...raw
    };
    let codeVal = typeof obj.code === "string" ? obj.code : "";
    if (!codeVal.trim() && typeof obj.label === "string") {
      codeVal = obj.label;
    }
    obj.code = sanitizeCode(codeVal);
    return obj;
  }
  return raw;
}, object({
  table: TableEnum,
  id: string().uuid().optional(),
  code: string().min(1, "Code is required").max(64, "Code must be 64 characters or fewer").regex(/^[a-z0-9_]+$/, "lowercase letters / digits / underscore"),
  label: string().trim().min(1, "Label is required").max(160),
  description: string().max(2e3).optional().nullable(),
  side: _enum(["customer", "internal"]).optional(),
  emailTemplateCode: string().max(160).optional().nullable(),
  isActive: boolean().default(true),
  sortOrder: number().int().min(0).max(9999).default(100)
}));
const upsertReason_createServerFn_handler = createServerRpc({
  id: "e4abd237eae812270bb0f90bfb594a9449f902721909a36ce3788bdc8802879c",
  name: "upsertReason",
  filename: "src/lib/crm/workflow-settings.functions.ts"
}, (opts) => upsertReason.__executeServer(opts));
const upsertReason = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => ReasonInput.parse(d)).handler(upsertReason_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...ADMIN]);
  const admin = await getAdmin();
  const payload = {
    code: data.code,
    label: data.label,
    description: data.description ?? null,
    is_active: data.isActive,
    sort_order: data.sortOrder
  };
  if (data.table === "workflow_delay_reasons") {
    payload.side = data.side ?? "customer";
    payload.email_template_code = payload.side === "customer" ? data.emailTemplateCode || "bhs_e003_customer_delay" : data.emailTemplateCode || "bhs_e004_our_side_delay";
  }
  if (data.id) {
    const {
      error
    } = await admin.from(data.table).update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await admin.from(data.table).insert(payload);
    if (error) throw new Error(error.message);
  }
  await writeAudit({
    supabase: context.supabase,
    entityType: data.table,
    entityId: data.id ?? data.code,
    action: data.id ? "update" : "create",
    newValue: payload,
    actorId: context.userId
  });
  return {
    ok: true
  };
});
const deleteReason_createServerFn_handler = createServerRpc({
  id: "58913168768a16ec2e36cc44239d8e725310f4f70d5061e7572da5e669802934",
  name: "deleteReason",
  filename: "src/lib/crm/workflow-settings.functions.ts"
}, (opts) => deleteReason.__executeServer(opts));
const deleteReason = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  table: TableEnum,
  id: string().uuid()
}).parse(d)).handler(deleteReason_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...ADMIN]);
  const admin = await getAdmin();
  const {
    error
  } = await admin.from(data.table).update({
    is_active: false
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: data.table,
    entityId: data.id,
    action: "deactivate",
    actorId: context.userId
  });
  return {
    ok: true
  };
});
const listAutomationRules_createServerFn_handler = createServerRpc({
  id: "74bc5c339b9356b9246c172598a75ed5369c4c24a27b5b57f5ed85d20fae4ac6",
  name: "listAutomationRules",
  filename: "src/lib/crm/workflow-settings.functions.ts"
}, (opts) => listAutomationRules.__executeServer(opts));
const listAutomationRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAutomationRules_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const {
    data,
    error
  } = await admin.from("workflow_automation_rules").select("*").order("trigger_status").order("wait_days");
  if (error) throw new Error(error.message);
  return {
    rules: data ?? []
  };
});
const RuleInput = object({
  id: string().uuid().optional(),
  name: string().min(1).max(160),
  triggerStatus: string().min(1).max(64),
  waitDays: number().int().min(0).max(365),
  actionType: _enum(["send_template", "create_reminder", "notify_executive", "close_order"]),
  templateCode: string().max(160).optional().nullable(),
  repeatCount: number().int().min(1).max(50).default(1),
  isActive: boolean().default(true)
});
const upsertAutomationRule_createServerFn_handler = createServerRpc({
  id: "bad46058b61ba9640fc451ed9b10c448c81cfd7af68f4de09b8ef28da79aa164",
  name: "upsertAutomationRule",
  filename: "src/lib/crm/workflow-settings.functions.ts"
}, (opts) => upsertAutomationRule.__executeServer(opts));
const upsertAutomationRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => RuleInput.parse(d)).handler(upsertAutomationRule_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...ADMIN]);
  const admin = await getAdmin();
  const payload = {
    name: data.name,
    trigger_status: data.triggerStatus,
    wait_days: data.waitDays,
    action_type: data.actionType,
    template_code: data.templateCode || null,
    repeat_count: data.repeatCount,
    is_active: data.isActive,
    config: {}
  };
  if (data.id) {
    const {
      error
    } = await admin.from("workflow_automation_rules").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await admin.from("workflow_automation_rules").insert(payload);
    if (error) throw new Error(error.message);
  }
  await writeAudit({
    supabase: context.supabase,
    entityType: "workflow_automation_rules",
    entityId: data.id ?? data.name,
    action: data.id ? "update" : "create",
    newValue: payload,
    actorId: context.userId
  });
  return {
    ok: true
  };
});
const deleteAutomationRule_createServerFn_handler = createServerRpc({
  id: "43787bb4921a8af5061cd4e2fc99d9b6a00a3fbc845fc9701a1728739449a535",
  name: "deleteAutomationRule",
  filename: "src/lib/crm/workflow-settings.functions.ts"
}, (opts) => deleteAutomationRule.__executeServer(opts));
const deleteAutomationRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  id: string().uuid()
}).parse(d)).handler(deleteAutomationRule_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...ADMIN]);
  const admin = await getAdmin();
  const {
    error
  } = await admin.from("workflow_automation_rules").update({
    is_active: false
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "workflow_automation_rules",
    entityId: data.id,
    action: "deactivate",
    actorId: context.userId
  });
  return {
    ok: true
  };
});
export {
  deleteAutomationRule_createServerFn_handler,
  deleteReason_createServerFn_handler,
  listAutomationRules_createServerFn_handler,
  listReasons_createServerFn_handler,
  upsertAutomationRule_createServerFn_handler,
  upsertReason_createServerFn_handler
};
