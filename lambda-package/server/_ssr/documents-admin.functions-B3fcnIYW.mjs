import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { i as isUserAdmin } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, s as string } from "../_libs/zod.mjs";
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
const FilterSchema = object({
  q: string().optional(),
  docType: string().optional(),
  status: string().optional(),
  limit: number().int().min(1).max(500).optional()
});
const listAllDocuments_createServerFn_handler = createServerRpc({
  id: "fca32a96b48069d020f83144113a38487b271af9a04ccc4bc08ec77924394c18",
  name: "listAllDocuments",
  filename: "src/lib/crm/documents-admin.functions.ts"
}, (opts) => listAllDocuments.__executeServer(opts));
const listAllDocuments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => FilterSchema.parse(i ?? {})).handler(listAllDocuments_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const isAdmin = await isUserAdmin(supabase, context.userId);
  if (!isAdmin) throw new Error("Forbidden: Admin access required.");
  let q = supabase.from("documents").select("id, doc_type, file_name, file_path, mime_type, status, version, parent_document_id, uploaded_at, verified_at, remarks, lead_id, application_id").order("uploaded_at", {
    ascending: false
  }).limit(data.limit ?? 200);
  if (data.docType) q = q.eq("doc_type", data.docType);
  if (data.status) q = q.eq("status", data.status);
  const {
    data: docs,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const leadIds = Array.from(new Set((docs ?? []).map((d) => d.lead_id).filter(Boolean)));
  const appIds = Array.from(new Set((docs ?? []).map((d) => d.application_id).filter(Boolean)));
  const [leadsRes, appsRes] = await Promise.all([leadIds.length ? supabase.from("leads").select("id, name, customer_id").in("id", leadIds) : Promise.resolve({
    data: []
  }), appIds.length ? supabase.from("applications").select("id, application_code").in("id", appIds) : Promise.resolve({
    data: []
  })]);
  const leadMap = new Map((leadsRes.data ?? []).map((l) => [l.id, l]));
  const appMap = new Map((appsRes.data ?? []).map((a) => [a.id, a]));
  const customerIds = Array.from(new Set((leadsRes.data ?? []).map((l) => l.customer_id).filter(Boolean)));
  const custRes = customerIds.length ? await supabase.from("customers").select("id, name").in("id", customerIds) : {
    data: []
  };
  const custMap = new Map((custRes.data ?? []).map((c) => [c.id, c.name]));
  const rows = (docs ?? []).map((d) => {
    const lead = leadMap.get(d.lead_id);
    const app = d.application_id ? appMap.get(d.application_id) : null;
    return {
      id: d.id,
      doc_type: d.doc_type,
      file_name: d.file_name,
      file_path: d.file_path,
      mime_type: d.mime_type,
      status: d.status,
      version: d.version,
      parent_document_id: d.parent_document_id,
      uploaded_at: d.uploaded_at,
      verified_at: d.verified_at,
      remarks: d.remarks,
      lead_id: d.lead_id,
      application_id: d.application_id,
      application_code: app?.application_code ?? null,
      customer_id: lead?.customer_id ?? null,
      customer_name: lead?.customer_id ? custMap.get(lead.customer_id) ?? null : null,
      lead_name: lead?.name ?? null
    };
  });
  const text = (data.q || "").trim().toLowerCase();
  const filtered = text ? rows.filter((r) => r.file_name.toLowerCase().includes(text) || (r.customer_name ?? "").toLowerCase().includes(text) || (r.lead_name ?? "").toLowerCase().includes(text) || (r.application_code ?? "").toLowerCase().includes(text)) : rows;
  const docTypes = Array.from(new Set(rows.map((r) => r.doc_type))).sort();
  return {
    rows: filtered,
    docTypes
  };
});
const getDocumentSignedUrl_createServerFn_handler = createServerRpc({
  id: "d05b611db77fb7cdd3c2dfecce657c3a154cfb520b2b66def6f7ebbcd8a1e086",
  name: "getDocumentSignedUrl",
  filename: "src/lib/crm/documents-admin.functions.ts"
}, (opts) => getDocumentSignedUrl.__executeServer(opts));
const getDocumentSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  path: string().min(1)
}).parse(i)).handler(getDocumentSignedUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: signed,
    error
  } = await supabase.storage.from("documents").createSignedUrl(data.path, 600);
  if (error) throw new Error(error.message);
  return {
    url: signed.signedUrl
  };
});
const getDocumentVersions_createServerFn_handler = createServerRpc({
  id: "dbb3a693497cad78d5e6db0526d3841c660eea21e060983617138bd55fa1e199",
  name: "getDocumentVersions",
  filename: "src/lib/crm/documents-admin.functions.ts"
}, (opts) => getDocumentVersions.__executeServer(opts));
const getDocumentVersions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  docType: string(),
  leadId: string().uuid()
}).parse(i)).handler(getDocumentVersions_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: rows,
    error
  } = await supabase.from("documents").select("id, version, file_name, file_path, status, uploaded_at, remarks, verified_at").eq("doc_type", data.docType).eq("lead_id", data.leadId).order("version", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    versions: rows ?? []
  };
});
export {
  getDocumentSignedUrl_createServerFn_handler,
  getDocumentVersions_createServerFn_handler,
  listAllDocuments_createServerFn_handler
};
