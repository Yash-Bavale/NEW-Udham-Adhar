import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, b as boolean, l as literal, a as array, u as union, n as number, _ as _enum } from "../_libs/zod.mjs";
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
const getBuilderSchema = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_code: string().min(1).max(80)
}).parse(i)).handler(createSsrRpc("8059c77c58fe42f888bfa541b28392e6846f0b613ad05453abf37fc0e4944aeb"));
const getBuilderSchemaVersion = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("f4fa710c0f6297d160ab7ea1d5dfe3689f438deaf1de913464b2119e22aa4f14"));
const saveBuilderSchema = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SaveInput.parse(i)).handler(createSsrRpc("ebc56e3a532d1959880185d3b8fd4c1b349fe938464d21691bfd8f00c5369904"));
const listCopyableForms = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  exclude_service_code: string().min(1).max(80)
}).parse(i)).handler(createSsrRpc("e92d13874486b286a8efa9ced8a7abd62df39c3b65b52b66a0d8222452fbfd81"));
export {
  getBuilderSchemaVersion as a,
  getBuilderSchema as g,
  listCopyableForms as l,
  saveBuilderSchema as s
};
