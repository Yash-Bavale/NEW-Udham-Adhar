import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, u as union, l as literal, a as array, n as number, b as boolean, _ as _enum } from "../_libs/zod.mjs";
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
const FIELD_TYPES = ["text", "email", "tel", "number", "date", "select", "textarea", "nic", "plants", "section", "state", "district", "note", "checkbox"];
const FieldSchema = object({
  key: string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_]+$/, "key must be alphanumeric/underscore"),
  label: string().trim().min(1).max(300),
  type: _enum(FIELD_TYPES),
  required: boolean().optional(),
  placeholder: string().max(200).optional(),
  help: string().max(500).optional(),
  pattern: string().max(300).optional(),
  maxLength: number().int().positive().max(1e4).optional(),
  options: array(string().max(200)).max(200).optional(),
  nicDigits: union([literal(2), literal(4), literal(5)]).optional(),
  activityFrom: string().max(80).optional(),
  default: string().max(500).optional(),
  visibleIf: object({
    key: string().max(80),
    equals: string().max(200)
  }).optional()
});
const SectionSchema = object({
  key: string().trim().min(1).max(80),
  label: string().trim().min(1).max(200),
  description: string().max(1e3).optional(),
  fields: array(FieldSchema).max(200)
});
const DocSchema = object({
  key: string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_]+$/),
  label: string().trim().min(1).max(200),
  required: boolean().optional(),
  help: string().max(500).optional(),
  sample_url: string().trim().max(2e3).refine((s) => s === "" || s.startsWith("/") || /^https?:\/\//i.test(s), "Invalid URL").optional().or(literal("").transform(() => void 0)),
  sample_label: string().max(200).optional()
});
const SaveInput = object({
  service_code: string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: string().trim().min(2).max(200),
  description: string().max(2e3).optional().nullable(),
  sections: array(SectionSchema).min(1).max(30),
  documents: array(DocSchema).max(40).default([]),
  sample_form_url: string().trim().max(2e3).refine((s) => s === "" || s.startsWith("/") || /^https?:\/\//i.test(s), "Invalid URL").optional().or(literal("").transform(() => void 0)),
  sample_form_label: string().max(200).optional(),
  enable_document_merge: boolean().optional()
});
const getBuilderSchema_createServerFn_handler = createServerRpc({
  id: "8059c77c58fe42f888bfa541b28392e6846f0b613ad05453abf37fc0e4944aeb",
  name: "getBuilderSchema",
  filename: "src/lib/crm/form-builder.functions.ts"
}, (opts) => getBuilderSchema.__executeServer(opts));
const getBuilderSchema = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_code: string().min(1).max(80)
}).parse(i)).handler(getBuilderSchema_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const [{
    data: svc
  }, {
    data: schema
  }, {
    data: versions
  }] = await Promise.all([context.supabase.from("services").select("service_code, service_name").eq("service_code", data.service_code).maybeSingle(), context.supabase.from("service_form_schemas").select("id, version, title, description, schema, documents, is_active, updated_at").eq("service_code", data.service_code).eq("is_active", true).order("version", {
    ascending: false
  }).limit(1).maybeSingle(), context.supabase.from("service_form_schemas").select("id, version, is_active, updated_at, title").eq("service_code", data.service_code).order("version", {
    ascending: false
  }).limit(30)]);
  return {
    service: svc ?? null,
    active: schema ?? null,
    versions: versions ?? []
  };
});
const getBuilderSchemaVersion_createServerFn_handler = createServerRpc({
  id: "f4fa710c0f6297d160ab7ea1d5dfe3689f438deaf1de913464b2119e22aa4f14",
  name: "getBuilderSchemaVersion",
  filename: "src/lib/crm/form-builder.functions.ts"
}, (opts) => getBuilderSchemaVersion.__executeServer(opts));
const getBuilderSchemaVersion = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(getBuilderSchemaVersion_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const {
    data: row,
    error
  } = await context.supabase.from("service_form_schemas").select("id, service_code, version, title, description, schema, documents, is_active, updated_at").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    row
  };
});
const saveBuilderSchema_createServerFn_handler = createServerRpc({
  id: "ebc56e3a532d1959880185d3b8fd4c1b349fe938464d21691bfd8f00c5369904",
  name: "saveBuilderSchema",
  filename: "src/lib/crm/form-builder.functions.ts"
}, (opts) => saveBuilderSchema.__executeServer(opts));
const saveBuilderSchema = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SaveInput.parse(i)).handler(saveBuilderSchema_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const seen = /* @__PURE__ */ new Set();
  for (const sec of data.sections) {
    for (const f of sec.fields) {
      if (seen.has(f.key)) throw new Error(`Duplicate field key: ${f.key}`);
      seen.add(f.key);
    }
  }
  for (const sec of data.sections) {
    for (const f of sec.fields) {
      if (f.pattern) {
        try {
          new RegExp(f.pattern);
        } catch {
          throw new Error(`Invalid regex in field "${f.key}": ${f.pattern}`);
        }
      }
    }
  }
  const schemaJson = {
    sections: data.sections,
    meta: {
      sample_form_url: data.sample_form_url ?? null,
      sample_form_label: data.sample_form_label ?? null,
      enable_document_merge: data.enable_document_merge ?? false
    }
  };
  const {
    data: result,
    error
  } = await context.supabase.rpc("upsert_service_form_schema", {
    _service_code: data.service_code,
    _title: data.title,
    _description: data.description ?? "",
    _schema: schemaJson,
    _documents: data.documents
  });
  if (error) throw new Error(error.message);
  return result;
});
const listCopyableForms_createServerFn_handler = createServerRpc({
  id: "e92d13874486b286a8efa9ced8a7abd62df39c3b65b52b66a0d8222452fbfd81",
  name: "listCopyableForms",
  filename: "src/lib/crm/form-builder.functions.ts"
}, (opts) => listCopyableForms.__executeServer(opts));
const listCopyableForms = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  exclude_service_code: string().min(1).max(80)
}).parse(i)).handler(listCopyableForms_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  const {
    data: rows,
    error
  } = await context.supabase.from("service_form_schemas").select("service_code, title, schema, documents").eq("is_active", true).neq("service_code", data.exclude_service_code).order("service_code", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    rows: (rows ?? []).map((r) => {
      const schema = r.schema ?? {};
      const sections = schema.sections?.length ? schema.sections : schema.fields?.length ? [{
        key: "default",
        label: "Details",
        fields: schema.fields
      }] : [];
      return {
        service_code: r.service_code,
        title: r.title || r.service_code,
        sections: sections.map((s) => ({
          key: s.key,
          label: s.label,
          description: s.description ?? "",
          fieldCount: Array.isArray(s.fields) ? s.fields.length : 0
        })),
        documents: Array.isArray(r.documents) ? r.documents : [],
        rawSections: sections
      };
    })
  };
});
export {
  getBuilderSchemaVersion_createServerFn_handler,
  getBuilderSchema_createServerFn_handler,
  listCopyableForms_createServerFn_handler,
  saveBuilderSchema_createServerFn_handler
};
