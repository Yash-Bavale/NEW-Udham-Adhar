import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, d as any, s as string } from "../_libs/zod.mjs";
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
const adminUpdateOnboardingField_createServerFn_handler = createServerRpc({
  id: "2d4f9c39697474538e4632647ad3441fe75cd3ea2de23dc9e4580b5a9c861695",
  name: "adminUpdateOnboardingField",
  filename: "src/lib/crm/onboarding-admin.functions.ts"
}, (opts) => adminUpdateOnboardingField.__executeServer(opts));
const adminUpdateOnboardingField = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  submissionId: string().uuid(),
  fieldKey: string().min(1),
  value: any()
})).handler(adminUpdateOnboardingField_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const {
    data: sub
  } = await (await getAdmin()).from("onboarding_submissions").select("*").eq("id", data.submissionId).single();
  if (!sub) throw new Error("Submission not found");
  const newFormData = {
    ...sub.form_data,
    [data.fieldKey]: data.value
  };
  const {
    error
  } = await (await getAdmin()).from("onboarding_submissions").update({
    form_data: newFormData
  }).eq("id", data.submissionId);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "onboarding",
    entityId: data.submissionId,
    action: "field_edited",
    oldValue: {
      [data.fieldKey]: sub.form_data?.[data.fieldKey]
    },
    newValue: {
      [data.fieldKey]: data.value
    },
    actorId: user.id
  });
  return {
    ok: true
  };
});
const requestDocumentReupload_createServerFn_handler = createServerRpc({
  id: "ca0efa78a2921709400effdd574a61007c89e89f77ad52074b659ed03f82e423",
  name: "requestDocumentReupload",
  filename: "src/lib/crm/onboarding-admin.functions.ts"
}, (opts) => requestDocumentReupload.__executeServer(opts));
const requestDocumentReupload = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  documentId: string().uuid(),
  reason: string().optional()
})).handler(requestDocumentReupload_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const {
    data: doc
  } = await (await getAdmin()).from("documents").select("*").eq("id", data.documentId).single();
  if (!doc) throw new Error("Document not found");
  const {
    data: lead
  } = doc.lead_id ? await (await getAdmin()).from("leads").select("id, name, email").eq("id", doc.lead_id).single() : {
    data: null
  };
  await (await getAdmin()).from("documents").update({
    status: "re_upload_requested",
    remarks: data.reason ?? null
  }).eq("id", data.documentId);
  if (lead?.email) {
    await (await getAdmin()).from("email_queue").insert({
      to_email: lead.email,
      to_name: lead.name,
      subject: `Action Needed: Please re-upload your ${doc.doc_type}`,
      body_html: `<div style="font-family:Arial,sans-serif;padding:20px"><p>Dear ${lead.name},</p><p>We need you to re-upload your <b>${doc.doc_type}</b>.</p>${data.reason ? `<p><b>Reason:</b> ${data.reason}</p>` : ""}<p>Please log in to your application and upload the new document.</p></div>`,
      template_code: "document-reupload-request",
      lead_id: doc.lead_id,
      application_id: doc.application_id,
      created_by: user.id,
      variables: {
        documentId: doc.id
      }
    });
  }
  await writeAudit({
    supabase: context.supabase,
    entityType: "document",
    entityId: doc.id,
    action: "reupload_requested",
    newValue: {
      reason: data.reason
    },
    actorId: user.id
  });
  return {
    ok: true
  };
});
export {
  adminUpdateOnboardingField_createServerFn_handler,
  requestDocumentReupload_createServerFn_handler
};
