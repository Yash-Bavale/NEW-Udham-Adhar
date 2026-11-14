import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const SLA_HOURS = 48;
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
const getMyWorkSummary_createServerFn_handler = createServerRpc({
  id: "3a5efc86063dd66664308eb1b4250b747d1d01d5b94c6732444a760364f0ee12",
  name: "getMyWorkSummary",
  filename: "src/lib/crm/my-work.functions.ts"
}, (opts) => getMyWorkSummary.__executeServer(opts));
const getMyWorkSummary = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyWorkSummary_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const admin = await getAdmin();
  const {
    data: roles
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const roleList = (roles ?? []).map((r) => r.role);
  const isAdmin = roleList.some((r) => r === "admin" || r === "super_admin");
  const CLOSED_FULFILLMENT = ["completed", "order_closed", "certificate_issued"];
  const {
    data: assignedAppRows,
    error: assignedErr
  } = await admin.from("applications").select("id, application_code, application_status, fulfillment_status, form_status, document_status, created_at, updated_at, lead:leads!fk_applications_lead(id, name, email, mobile, service)").eq("assigned_to", userId).order("updated_at", {
    ascending: true
  }).limit(200);
  if (assignedErr) throw new Error(assignedErr.message);
  const assignedAppIds = (assignedAppRows ?? []).map((a) => a.id);
  let paidAppIdSet = /* @__PURE__ */ new Set();
  if (assignedAppIds.length > 0) {
    const {
      data: paidRows,
      error: paidErr
    } = await admin.from("payments").select("application_id, status").in("application_id", assignedAppIds).in("status", ["paid"]);
    if (paidErr) throw new Error(paidErr.message);
    paidAppIdSet = new Set((paidRows ?? []).map((p) => p.application_id).filter(Boolean));
  }
  const paidOpenApps = (assignedAppRows ?? []).filter((a) => paidAppIdSet.has(a.id) && !CLOSED_FULFILLMENT.includes(a.fulfillment_status ?? "") && a.application_status !== "completed");
  const [docsRes, leadsRes, totalLeadsRes, notifRes] = await Promise.all([isAdmin ? admin.from("documents").select("id, doc_type, file_name, uploaded_at, lead_id, application_id").eq("status", "pending").order("uploaded_at", {
    ascending: true
  }).limit(50) : Promise.resolve({
    data: [],
    error: null
  }), admin.from("leads").select("id, lead_code, name, email, mobile, service, status, created_at").eq("assigned_to", userId).in("status", ["lead_created", "new_lead"]).order("created_at", {
    ascending: true
  }).limit(50), admin.from("leads").select("id", {
    count: "exact",
    head: true
  }).eq("assigned_to", userId), admin.from("notifications").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId).is("read_at", null)]);
  if (docsRes.error) throw new Error(docsRes.error.message);
  if (leadsRes.error) throw new Error(leadsRes.error.message);
  if (notifRes.error) throw new Error(notifRes.error.message);
  const docs = docsRes.data ?? [];
  const leads = leadsRes.data ?? [];
  const slaThreshold = Date.now() - SLA_HOURS * 3600 * 1e3;
  const slaRisk = paidOpenApps.filter((a) => new Date(a.updated_at).getTime() < slaThreshold).length;
  return {
    counters: {
      assignedApps: paidOpenApps.length,
      orderReceived: paidOpenApps.length,
      pendingDocs: docs.length,
      assignedLeads: leads.length,
      totalLeads: totalLeadsRes.count ?? 0,
      unreadNotifications: notifRes.count ?? 0,
      slaRisk
    },
    assignedApplications: paidOpenApps,
    pendingDocuments: docs,
    assignedLeads: leads
  };
});
export {
  getMyWorkSummary_createServerFn_handler
};
