import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, a as array, b as boolean, _ as _enum } from "../_libs/zod.mjs";
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
const FieldSchema = object({
  key: string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_]+$/),
  label: string().trim().min(1).max(200),
  type: _enum(["text", "textarea", "number", "email", "tel", "date", "select", "radio", "checkbox", "file"]),
  required: boolean().default(false),
  placeholder: string().max(200).optional().nullable(),
  help: string().max(500).optional().nullable(),
  options: array(object({
    value: string().max(120),
    label: string().max(200)
  })).max(50).optional(),
  validation: object({
    min: number().optional(),
    max: number().optional(),
    pattern: string().max(200).optional()
  }).optional(),
  group: string().max(80).optional().nullable()
});
const DocumentSchema = object({
  key: string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_]+$/),
  label: string().trim().min(1).max(200),
  required: boolean().default(false),
  accept: string().max(120).default("image/*,application/pdf"),
  max_size_mb: number().min(1).max(25).default(5),
  help: string().max(500).optional().nullable()
});
const FormSchemaInput = object({
  id: string().uuid().optional(),
  service_code: string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: string().trim().min(2).max(200),
  description: string().max(2e3).nullable().optional(),
  is_active: boolean().default(true),
  schema: object({
    fields: array(FieldSchema).max(120)
  }),
  documents: array(DocumentSchema).max(40)
});
const StatusStep = object({
  key: string().trim().min(1).max(80).regex(/^[a-z0-9_]+$/),
  label: string().trim().min(1).max(120),
  description: string().max(500).optional().nullable(),
  color: string().max(40).optional().nullable(),
  is_terminal: boolean().default(false),
  sla_hours: number().int().min(0).max(1e4).optional().nullable()
});
const WorkflowInput = object({
  id: string().uuid().optional(),
  service_code: string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  display_name: string().trim().min(2).max(160),
  default_assignee_role: string().max(40).nullable().optional(),
  is_active: boolean().default(true),
  application_statuses: array(StatusStep).min(1).max(40)
});
const getServiceConfig_createServerFn_handler = createServerRpc({
  id: "8e754c3cf31d97400ffb9aef78976823e9d72bc96ed695a8aa6dd04528879078",
  name: "getServiceConfig",
  filename: "src/lib/crm/service-forms.functions.ts"
}, (opts) => getServiceConfig.__executeServer(opts));
const getServiceConfig = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_code: string().min(1).max(80)
}).parse(i)).handler(getServiceConfig_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const [service, formSchema, workflow] = await Promise.all([supabase.from("services").select("*").eq("service_code", data.service_code).maybeSingle(), supabase.from("service_form_schemas").select("*").eq("service_code", data.service_code).eq("is_active", true).order("version", {
    ascending: false
  }).limit(1).maybeSingle(), supabase.from("service_workflows").select("*").eq("service_code", data.service_code).eq("is_active", true).maybeSingle()]);
  return {
    service: service.data ?? null,
    formSchema: formSchema.data ?? null,
    workflow: workflow.data ?? null
  };
});
const saveFormSchema_createServerFn_handler = createServerRpc({
  id: "ea362e5d4ecad5f10c7442bec5a9cfb3a003b07e978efa45b1f7a96f1710e728",
  name: "saveFormSchema",
  filename: "src/lib/crm/service-forms.functions.ts"
}, (opts) => saveFormSchema.__executeServer(opts));
const saveFormSchema = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => FormSchemaInput.parse(i)).handler(saveFormSchema_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    data: existing
  } = await supabase.from("service_form_schemas").select("version").eq("service_code", data.service_code).order("version", {
    ascending: false
  }).limit(1).maybeSingle();
  const nextVersion = (existing?.version ?? 0) + 1;
  await supabase.from("service_form_schemas").update({
    is_active: false
  }).eq("service_code", data.service_code);
  const {
    error
  } = await supabase.from("service_form_schemas").insert({
    service_code: data.service_code,
    title: data.title,
    description: data.description ?? null,
    is_active: data.is_active,
    schema: data.schema,
    documents: data.documents,
    version: nextVersion
  });
  if (error) throw new Error(error.message);
  return {
    ok: true,
    version: nextVersion
  };
});
const listFormSchemaVersions_createServerFn_handler = createServerRpc({
  id: "3631af097aa13afc2311d9e01dbab1705e423c2c8a616799195236876da4b667",
  name: "listFormSchemaVersions",
  filename: "src/lib/crm/service-forms.functions.ts"
}, (opts) => listFormSchemaVersions.__executeServer(opts));
const listFormSchemaVersions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_code: string().min(1).max(80)
}).parse(i)).handler(listFormSchemaVersions_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    data: rows,
    error
  } = await context.supabase.from("service_form_schemas").select("id, version, title, is_active, created_at, updated_at").eq("service_code", data.service_code).order("version", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
const saveWorkflow_createServerFn_handler = createServerRpc({
  id: "28ed152f44893ab0695188e3cddaa5c57cb165cd4da635ef96dada136daeada8",
  name: "saveWorkflow",
  filename: "src/lib/crm/service-forms.functions.ts"
}, (opts) => saveWorkflow.__executeServer(opts));
const saveWorkflow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WorkflowInput.parse(i)).handler(saveWorkflow_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, ["super_admin", "admin"]);
  const {
    data: existing
  } = await supabase.from("service_workflows").select("id").eq("service_code", data.service_code).maybeSingle();
  const payload = {
    service_code: data.service_code,
    display_name: data.display_name,
    default_assignee_role: data.default_assignee_role ?? null,
    is_active: data.is_active,
    application_statuses: data.application_statuses,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (existing?.id) {
    const {
      error
    } = await supabase.from("service_workflows").update(payload).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabase.from("service_workflows").insert(payload);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
export {
  getServiceConfig_createServerFn_handler,
  listFormSchemaVersions_createServerFn_handler,
  saveFormSchema_createServerFn_handler,
  saveWorkflow_createServerFn_handler
};
