import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, _ as _enum, s as string } from "../_libs/zod.mjs";
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
const STATUS_VALUES = ["pending", "approved", "rejected", "re_upload_requested"];
const listReviewDocuments_createServerFn_handler = createServerRpc({
  id: "aa6aa250901ef03955b14659602fe5d7e436559550243cf8c0b0119642229fbd",
  name: "listReviewDocuments",
  filename: "src/lib/crm/document-review.functions.ts"
}, (opts) => listReviewDocuments.__executeServer(opts));
const listReviewDocuments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  status: _enum(STATUS_VALUES).optional(),
  limit: number().int().min(1).max(200).optional()
}).optional().parse(data ?? {})).handler(listReviewDocuments_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "operations", "support"]);
  let q = (await getAdmin()).from("documents").select("*").order("uploaded_at", {
    ascending: true
  }).limit(data?.limit ?? 100);
  if (data?.status) q = q.eq("status", data.status);
  else q = q.eq("status", "pending");
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const leadIds = Array.from(new Set((rows ?? []).map((r) => r.lead_id).filter(Boolean)));
  const {
    data: leads
  } = leadIds.length ? await (await getAdmin()).from("leads").select("id,name,email,lead_code,service").in("id", leadIds) : {
    data: []
  };
  const leadMap = new Map((leads ?? []).map((l) => [l.id, l]));
  const enriched = (rows ?? []).map((r) => ({
    ...r,
    lead: leadMap.get(r.lead_id) ?? null
  }));
  return {
    rows: enriched
  };
});
const getDocumentSignedUrl_createServerFn_handler = createServerRpc({
  id: "c903b98c46cee4bd96d81d71f246de4a4d6d2d10e3c1ae5d1673bbb0ed546efa",
  name: "getDocumentSignedUrl",
  filename: "src/lib/crm/document-review.functions.ts"
}, (opts) => getDocumentSignedUrl.__executeServer(opts));
const getDocumentSignedUrl = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  documentId: string().uuid()
}).parse(data)).handler(getDocumentSignedUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "operations", "support"]);
  const {
    data: doc
  } = await (await getAdmin()).from("documents").select("file_path,mime_type,file_name").eq("id", data.documentId).single();
  if (!doc) throw new Error("Document not found");
  const {
    data: signed,
    error
  } = await (await getAdmin()).storage.from("documents").createSignedUrl(doc.file_path, 60 * 10);
  if (error) throw new Error(error.message);
  return {
    url: signed.signedUrl,
    mimeType: doc.mime_type,
    fileName: doc.file_name
  };
});
const approveDocument_createServerFn_handler = createServerRpc({
  id: "fceb9da64309818a1d212ce197388584695884910b65324c14ea2f9d8918003b",
  name: "approveDocument",
  filename: "src/lib/crm/document-review.functions.ts"
}, (opts) => approveDocument.__executeServer(opts));
const approveDocument = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  documentId: string().uuid(),
  comment: string().max(2e3).optional()
}).parse(data)).handler(approveDocument_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const {
    data: prev
  } = await (await getAdmin()).from("documents").select("status, application_id, doc_type").eq("id", data.documentId).single();
  const {
    error
  } = await (await getAdmin()).from("documents").update({
    status: "approved",
    verified_by: user.id,
    verified_at: (/* @__PURE__ */ new Date()).toISOString(),
    verification_comment: data.comment ?? null
  }).eq("id", data.documentId);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "document",
    entityId: data.documentId,
    action: "document_approved",
    oldValue: {
      status: prev?.status
    },
    newValue: {
      status: "approved",
      comment: data.comment
    },
    actorId: user.id
  });
  if (prev?.application_id) {
    try {
      const {
        logEmployeeOrderAction
      } = await import("./order-action-logger.server-DJE-NEoc.mjs");
      await logEmployeeOrderAction({
        orderId: prev.application_id,
        employeeId: user.id,
        actionType: "DOCUMENT_REVIEWED",
        notes: `Document approved: ${prev.doc_type || "document"}`,
        source: "employee",
        supabase: await getAdmin()
      });
    } catch (auditErr) {
      console.warn("[approveDocument] audit log error:", auditErr);
    }
  }
  return {
    ok: true
  };
});
const rejectDocument_createServerFn_handler = createServerRpc({
  id: "006ca1a79a570bc72bd81c598005c1894e1ca6e8d3cad1341a68b673d4c0c889",
  name: "rejectDocument",
  filename: "src/lib/crm/document-review.functions.ts"
}, (opts) => rejectDocument.__executeServer(opts));
const rejectDocument = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  documentId: string().uuid(),
  reason: string().min(2).max(2e3)
}).parse(data)).handler(rejectDocument_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const {
    data: prev
  } = await (await getAdmin()).from("documents").select("status, application_id, doc_type").eq("id", data.documentId).single();
  const {
    error
  } = await (await getAdmin()).from("documents").update({
    status: "rejected",
    verified_by: user.id,
    verified_at: (/* @__PURE__ */ new Date()).toISOString(),
    verification_comment: data.reason
  }).eq("id", data.documentId);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "document",
    entityId: data.documentId,
    action: "document_rejected",
    newValue: {
      reason: data.reason
    },
    actorId: user.id
  });
  if (prev?.application_id) {
    try {
      const {
        logEmployeeOrderAction
      } = await import("./order-action-logger.server-DJE-NEoc.mjs");
      await logEmployeeOrderAction({
        orderId: prev.application_id,
        employeeId: user.id,
        actionType: "DOCUMENT_REQUESTED",
        notes: `Document rejected (${prev.doc_type || "document"}): ${data.reason}`,
        source: "employee",
        supabase: await getAdmin()
      });
    } catch (auditErr) {
      console.warn("[rejectDocument] audit log error:", auditErr);
    }
  }
  return {
    ok: true
  };
});
const getApplicationDocChecklist_createServerFn_handler = createServerRpc({
  id: "5b02e9b200a10df79f3b2eb56e7dc03f781959696691e24bb0b4620b28b10931",
  name: "getApplicationDocChecklist",
  filename: "src/lib/crm/document-review.functions.ts"
}, (opts) => getApplicationDocChecklist.__executeServer(opts));
const getApplicationDocChecklist = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  applicationId: string().uuid()
}).parse(data)).handler(getApplicationDocChecklist_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "operations", "support"]);
  const {
    data: app
  } = await (await getAdmin()).from("applications").select("id, lead_id").eq("id", data.applicationId).single();
  const {
    data: leadRow
  } = app?.lead_id ? await (await getAdmin()).from("leads").select("service").eq("id", app.lead_id).maybeSingle() : {
    data: null
  };
  const serviceCode = leadRow?.service ?? null;
  const {
    data: schema
  } = serviceCode ? await (await getAdmin()).from("service_form_schemas").select("documents").eq("service_code", serviceCode).eq("is_active", true).maybeSingle() : {
    data: null
  };
  const required = Array.isArray(schema?.documents) ? schema.documents.map((d) => ({
    key: String(d.key ?? d.doc_type ?? d.id ?? d.label),
    label: String(d.label ?? d.title ?? d.key ?? d.doc_type)
  })) : [];
  const {
    data: docs
  } = await (await getAdmin()).from("documents").select("id, doc_type, status, uploaded_at, verified_at").eq("application_id", data.applicationId).order("uploaded_at", {
    ascending: false
  });
  const byType = /* @__PURE__ */ new Map();
  for (const d of docs ?? []) {
    if (!byType.has(d.doc_type)) byType.set(d.doc_type, d);
  }
  const items = required.length > 0 ? required.map((r) => ({
    ...r,
    doc: byType.get(r.key) ?? null
  })) : Array.from(byType.entries()).map(([k, d]) => ({
    key: k,
    label: k,
    doc: d
  }));
  const total = items.length || 1;
  const approved = items.filter((i) => i.doc?.status === "approved").length;
  const uploaded = items.filter((i) => i.doc).length;
  return {
    items,
    stats: {
      total,
      uploaded,
      approved,
      completionPct: Math.round(approved / total * 100),
      uploadedPct: Math.round(uploaded / total * 100)
    }
  };
});
export {
  approveDocument_createServerFn_handler,
  getApplicationDocChecklist_createServerFn_handler,
  getDocumentSignedUrl_createServerFn_handler,
  listReviewDocuments_createServerFn_handler,
  rejectDocument_createServerFn_handler
};
