import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
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
const getComplaintDetail_createServerFn_handler = createServerRpc({
  id: "dc37c1aac912d572f98679801c0ba85526d37f4024d42745970f0b055a22c598",
  name: "getComplaintDetail",
  filename: "src/lib/crm/complaints-detail.functions.ts"
}, (opts) => getComplaintDetail.__executeServer(opts));
const getComplaintDetail = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  id: string().uuid()
})).handler(getComplaintDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "operations", "support", "accounts"]);
  const {
    data: complaint,
    error
  } = await (await getAdmin()).from("complaints").select("*").eq("id", data.id).single();
  if (error || !complaint) throw new Error("Complaint not found");
  const admin = await getAdmin();
  const [{
    data: lead
  }, {
    data: app
  }, {
    data: cust
  }, {
    data: assignee
  }, {
    data: audits
  }] = await Promise.all([complaint.lead_id ? admin.from("leads").select("*").eq("id", complaint.lead_id).maybeSingle() : Promise.resolve({
    data: null
  }), complaint.application_id ? admin.from("applications").select("id, application_code, application_status, service_id, services(service_name)").eq("id", complaint.application_id).maybeSingle() : Promise.resolve({
    data: null
  }), complaint.customer_id || complaint.lead_id ? complaint.customer_id ? admin.from("customers").select("*").eq("id", complaint.customer_id).maybeSingle() : Promise.resolve({
    data: null
  }) : Promise.resolve({
    data: null
  }), complaint.assigned_to ? admin.from("profiles").select("id, full_name, display_name, email").eq("id", complaint.assigned_to).maybeSingle() : Promise.resolve({
    data: null
  }), admin.from("audit_logs").select("*").eq("entity_type", "complaint").eq("entity_id", data.id).order("created_at", {
    ascending: false
  })]);
  const customerObj = cust || (lead?.customer_id ? (await admin.from("customers").select("*").eq("id", lead.customer_id).maybeSingle()).data : null);
  return {
    complaint: {
      ...complaint,
      lead,
      application: app ? {
        ...app,
        service_name: app.services?.service_name ?? null
      } : null,
      customer: customerObj,
      assigned_name: assignee ? assignee.full_name || assignee.display_name || assignee.email : null
    },
    audits: audits ?? []
  };
});
const updateComplaintNotes_createServerFn_handler = createServerRpc({
  id: "21e27b2e90d31aef224fb9e244e23ab422a0896bd8443ab5f481b2a5a5aa5c7a",
  name: "updateComplaintNotes",
  filename: "src/lib/crm/complaints-detail.functions.ts"
}, (opts) => updateComplaintNotes.__executeServer(opts));
const updateComplaintNotes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  id: string().uuid(),
  notes: string()
})).handler(updateComplaintNotes_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, ["super_admin", "admin", "operations"]);
  const {
    data: prev
  } = await (await getAdmin()).from("complaints").select("notes").eq("id", data.id).single();
  const {
    error
  } = await (await getAdmin()).from("complaints").update({
    notes: data.notes
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "complaint",
    entityId: data.id,
    action: "notes_updated",
    oldValue: {
      notes: prev?.notes
    },
    newValue: {
      notes: data.notes
    },
    actorId: user.id
  });
  return {
    ok: true
  };
});
export {
  getComplaintDetail_createServerFn_handler,
  updateComplaintNotes_createServerFn_handler
};
