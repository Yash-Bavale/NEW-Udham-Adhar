import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
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
const Input = object({
  orderId: string().uuid(),
  remarks: string().max(2e3).optional().nullable()
});
const markConsultationCompleted_createServerFn_handler = createServerRpc({
  id: "f7fa7f855667dfa7d272f6e9d06ac465d5fa5d25b291788a3de36d3953d5e0cd",
  name: "markConsultationCompleted",
  filename: "src/lib/orders/actions/consultation.functions.ts"
}, (opts) => markConsultationCompleted.__executeServer(opts));
const markConsultationCompleted = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => Input.parse(raw)).handler(markConsultationCompleted_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: roleRows
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  const roles = new Set((roleRows ?? []).map((r) => r.role));
  const allowed = ["super_admin", "admin", "operations", "support", "accounts", "finance", "executive", "manager"];
  if (!allowed.some((r) => roles.has(r))) {
    throw new Error("Forbidden");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: app,
    error: appErr
  } = await supabaseAdmin.from("applications").select("id, application_code, lead_id, customer_id, service_id, fulfillment_status").eq("id", data.orderId).maybeSingle();
  if (appErr) throw new Error(appErr.message);
  if (!app) throw new Error("Order not found");
  if (app.fulfillment_status !== "consultation_completed") {
    const {
      error: upErr
    } = await supabaseAdmin.from("applications").update({
      fulfillment_status: "consultation_completed"
    }).eq("id", data.orderId);
    if (upErr) throw new Error(upErr.message);
    await supabaseAdmin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
      stop_reason: "consultation_completed",
      stop_triggered_by: context.userId
    }).eq("application_id", data.orderId).in("status", ["active", "paused"]);
  }
  const [{
    data: cust
  }, {
    data: svc
  }, {
    data: prof
  }, {
    data: lead
  }] = await Promise.all([app.customer_id ? supabaseAdmin.from("customers").select("name, primary_email, primary_mobile").eq("id", app.customer_id).maybeSingle() : Promise.resolve({
    data: null
  }), app.service_id ? supabaseAdmin.from("services").select("service_name").eq("id", app.service_id).maybeSingle() : Promise.resolve({
    data: null
  }), supabaseAdmin.from("profiles").select("display_name, full_name, email").eq("id", context.userId).maybeSingle(), app.lead_id ? supabaseAdmin.from("leads").select("name, email, mobile").eq("id", app.lead_id).maybeSingle() : Promise.resolve({
    data: null
  })]);
  const customerEmail = cust?.primary_email || lead?.email;
  if (!customerEmail) {
    return {
      ok: true,
      emailQueued: false,
      reason: "no_email"
    };
  }
  const customerName = cust?.name || lead?.name || "Customer";
  const customerMobile = cust?.primary_mobile || lead?.mobile || "—";
  try {
    await supabaseAdmin.from("application_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      customer_id: app.customer_id,
      event_type: "consultation_completed",
      note: data.remarks || null,
      created_by: context.userId,
      staff_name: prof?.display_name || prof?.full_name || prof?.email || "Staff",
      staff_role: "staff"
    });
  } catch (e) {
    console.warn("[markConsultationCompleted] event log failed (non-fatal)", e);
  }
  const istDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(/* @__PURE__ */ new Date());
  const svcName = svc?.service_name || lead?.service || "—";
  const vars = {
    customerName,
    customer_name: customerName,
    orderNumber: app.application_code || app.id.slice(0, 8),
    order_number: app.application_code || app.id.slice(0, 8),
    serviceName: svcName,
    service_name: svcName,
    customerEmail,
    customer_email: customerEmail,
    customerMobile,
    customer_mobile: customerMobile,
    closureDate: istDate,
    closure_date: istDate,
    employeeRemarks: data.remarks && data.remarks.trim() || "—",
    employee_remarks: data.remarks && data.remarks.trim() || "—",
    executiveName: prof?.display_name || prof?.full_name || process.env.ZOHO_FROM_NAME || "Care | Business Help Services",
    executive_name: prof?.display_name || prof?.full_name || process.env.ZOHO_FROM_NAME || "Care | Business Help Services",
    fromName: process.env.ZOHO_FROM_NAME || "Care | Business Help Services"
  };
  const [{
    enqueueFromTemplateInternal
  }, {
    BHS_EMAILS
  }] = await Promise.all([import("./emails.server-BTJhg2a3.mjs"), import("./bhs-templates-Gd1TLGXv.mjs")]);
  try {
    await enqueueFromTemplateInternal(BHS_EMAILS.E005_CONSULTATION_SUBMITTED, customerEmail, vars, {
      applicationId: app.id,
      leadId: app.lead_id ?? void 0,
      trigger: "manual",
      requireImmediateSuccess: true
    });
  } catch (e) {
    console.error("[markConsultationCompleted] E005 enqueue failed", e);
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`E005 email could not be sent: ${msg}`);
  }
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    const staffName = prof?.display_name || prof?.full_name || prof?.email || "Staff";
    await completeHotOrderOnQualifyingAction({
      orderId: app.id,
      actorId: context.userId,
      actorName: staffName,
      actionName: "Consultation Completed",
      actionReason: data.remarks || "Consultation completed & customer email sent",
      supabase: supabaseAdmin
    });
  } catch (hotErr) {
    console.warn("[markConsultationCompleted] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    emailQueued: true
  };
});
export {
  markConsultationCompleted_createServerFn_handler
};
