import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import { a as isTalkToExpertLead, i as isUnconvertedConsultationLead } from "./consultation-asWR5IET.mjs";
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
const STAFF_ROLES = ["super_admin", "admin", "manager", "executive", "support", "accounts", "finance", "operations"];
const SelectInput = object({
  leadId: string().uuid(),
  serviceId: string().uuid()
});
const LeadOnlyInput = object({
  leadId: string().uuid()
});
function appOrigin() {
  return process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
}
function newTrackingToken(leadCode) {
  return `LNK-${leadCode}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}
const selectConsultationService_createServerFn_handler = createServerRpc({
  id: "0bb0e419c89be14323e6b6e3c8f36bf2c134fec5be88beb9c37f6ef9919e0029",
  name: "selectConsultationService",
  filename: "src/lib/crm/talk-to-expert.functions.ts"
}, (opts) => selectConsultationService.__executeServer(opts));
const selectConsultationService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SelectInput.parse(i)).handler(selectConsultationService_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF_ROLES]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: lead,
    error: leadErr
  } = await supabaseAdmin.from("leads").select("id, lead_code, name, email, mobile, service, lead_source").eq("id", data.leadId).maybeSingle();
  if (leadErr) throw new Error(leadErr.message);
  if (!lead) throw new Error("Lead not found");
  if (!isTalkToExpertLead(lead)) {
    throw new Error("This lead is not a Talk-to-Expert consultation.");
  }
  if (!isUnconvertedConsultationLead(lead)) {
    throw new Error("Lead has already been converted to a service.");
  }
  const {
    data: svc,
    error: svcErr
  } = await supabaseAdmin.from("services").select("id, service_name, base_amount, gst_amount, total_amount, is_active").eq("id", data.serviceId).maybeSingle();
  if (svcErr) throw new Error(svcErr.message);
  if (!svc || !svc.is_active) throw new Error("Service unavailable.");
  const base = Number(svc.base_amount ?? 0);
  const gst = Number(svc.gst_amount ?? 0);
  const total = Number(svc.total_amount ?? base + gst);
  const leadCode = lead.lead_code ?? lead.id;
  const txnid = newTrackingToken(leadCode);
  const paymentUrl = `${appOrigin()}/payment/${encodeURIComponent(leadCode)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString();
  const originalSource = lead.lead_source ?? null;
  const {
    error: updErr
  } = await supabaseAdmin.from("leads").update({
    service: svc.service_name,
    service_id: svc.id,
    base_amount: base,
    gst_amount: gst,
    total_amount: total,
    status: "payment_pending",
    lead_status_v2: "payment_pending",
    lead_source: "talk_to_expert_converted"
  }).eq("id", lead.id);
  if (updErr) throw new Error(updErr.message);
  const {
    data: app
  } = await supabaseAdmin.from("applications").select("id").eq("lead_id", lead.id).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (app?.id) {
    await supabaseAdmin.from("applications").update({
      service_id: svc.id,
      application_status: "awaiting_payment",
      workflow_status: "waiting_for_customer",
      workflow_priority: "high",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", app.id);
    await supabaseAdmin.from("workflow_events").insert({
      application_id: app.id,
      lead_id: lead.id,
      event_type: "consultation_service_selected",
      title: "Consultation service selected",
      description: `Staff selected service: ${svc.service_name}. Awaiting customer payment.`,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: "Staff",
      is_system: false,
      metadata: {
        service_id: svc.id,
        service_name: svc.service_name,
        payment_url: paymentUrl,
        original_lead_source: originalSource
      }
    });
  }
  await supabaseAdmin.from("activity_logs").insert({
    lead_id: lead.id,
    user_id: context.userId,
    activity_type: "service_selected",
    activity_description: `Service selected after consultation: ${svc.service_name}`,
    metadata: {
      service_id: svc.id,
      service_name: svc.service_name
    }
  });
  await supabaseAdmin.from("payment_links").update({
    status: "expired"
  }).eq("lead_id", lead.id).eq("status", "pending");
  const {
    error: linkErr
  } = await supabaseAdmin.from("payment_links").insert({
    lead_id: lead.id,
    txnid,
    payment_url: paymentUrl,
    amount: total,
    status: "pending",
    expires_at: expiresAt,
    created_by: context.userId
  });
  if (linkErr) throw new Error(linkErr.message);
  const {
    withCheckoutToken
  } = await import("./customer-access.server-C_oBiISE.mjs");
  const securePaymentUrl = await withCheckoutToken(paymentUrl, lead.id, context.userId) ?? paymentUrl;
  return {
    ok: true,
    paymentUrl: securePaymentUrl,
    txnid,
    amount: total
  };
});
const sendConsultationPaymentLink_createServerFn_handler = createServerRpc({
  id: "2fa82cc37dda12c84554a97d188c2c7f6f9eb19a6b5bfb16b46a7ff3832dc8ff",
  name: "sendConsultationPaymentLink",
  filename: "src/lib/crm/talk-to-expert.functions.ts"
}, (opts) => sendConsultationPaymentLink.__executeServer(opts));
const sendConsultationPaymentLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadOnlyInput.parse(i)).handler(sendConsultationPaymentLink_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF_ROLES]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: lead,
    error: leadErr
  } = await supabaseAdmin.from("leads").select("id, lead_code, name, email, service, total_amount").eq("id", data.leadId).maybeSingle();
  if (leadErr) throw new Error(leadErr.message);
  if (!lead) throw new Error("Lead not found");
  if (!lead.email) throw new Error("Customer has no email on file.");
  const {
    data: link
  } = await supabaseAdmin.from("payment_links").select("payment_url, amount, status, expires_at").eq("lead_id", lead.id).eq("status", "pending").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (!link) throw new Error("No active payment link. Please select the service again.");
  const leadCode = lead.lead_code ?? lead.id;
  const total = Number(link.amount ?? lead.total_amount ?? 0);
  const paymentUrl = link.payment_url;
  const {
    data: appRow
  } = await supabaseAdmin.from("applications").select("id, application_code").eq("lead_id", lead.id).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    resolveApplicationCode
  } = await import("./resolve-order-number.server-BMud2UpT.mjs");
  const orderNumber = appRow?.application_code ?? await resolveApplicationCode(lead.id, {
    applicationId: appRow?.id ?? null
  });
  if (!orderNumber) throw new Error("Order number not ready yet — please retry in a moment.");
  const {
    enqueueFromTemplateInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  await enqueueFromTemplateInternal("payment_link", lead.email, {
    customer_name: lead.name ?? "Customer",
    name: lead.name ?? "Customer",
    service_name: lead.service ?? "your consultation",
    service: lead.service ?? "your consultation",
    order_number: orderNumber,
    lead_code: leadCode,
    payment_url: paymentUrl,
    total_amount: total.toFixed(2)
  }, {
    toName: lead.name ?? void 0,
    leadId: lead.id
  });
  await supabaseAdmin.from("activity_logs").insert({
    lead_id: lead.id,
    user_id: context.userId,
    activity_type: "payment_link_sent",
    activity_description: `Payment link emailed to ${lead.email}`,
    metadata: {
      payment_url: paymentUrl
    }
  });
  return {
    ok: true
  };
});
const resetConsultationSelection_createServerFn_handler = createServerRpc({
  id: "f4ecd300564fbbcf870139dd7ad6854828be6d370f5c200c552c0ae77248d813",
  name: "resetConsultationSelection",
  filename: "src/lib/crm/talk-to-expert.functions.ts"
}, (opts) => resetConsultationSelection.__executeServer(opts));
const resetConsultationSelection = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadOnlyInput.parse(i)).handler(resetConsultationSelection_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF_ROLES]);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: lead
  } = await supabaseAdmin.from("leads").select("id, lead_source").eq("id", data.leadId).maybeSingle();
  if (!lead) throw new Error("Lead not found");
  await supabaseAdmin.from("payment_links").update({
    status: "expired"
  }).eq("lead_id", lead.id).eq("status", "pending");
  await supabaseAdmin.from("leads").update({
    service: "Talk To Expert – Suitable Service Selection",
    service_id: null,
    status: "new_lead",
    lead_status_v2: "new_lead"
  }).eq("id", lead.id);
  await supabaseAdmin.from("activity_logs").insert({
    lead_id: lead.id,
    user_id: context.userId,
    activity_type: "service_selection_reset",
    activity_description: "Staff reverted consultation selection to pick a different service."
  });
  return {
    ok: true
  };
});
const convertConsultationLead_createServerFn_handler = createServerRpc({
  id: "6b3b6c642601f5d318ccda6d2fa4f4ac2a0db5fd6c3c5842e28f2a3c19667862",
  name: "convertConsultationLead",
  filename: "src/lib/crm/talk-to-expert.functions.ts"
}, (opts) => convertConsultationLead.__executeServer(opts));
const convertConsultationLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SelectInput.parse(i)).handler(convertConsultationLead_createServerFn_handler, async ({
  data
}) => {
  await selectConsultationService({
    data
  });
  await sendConsultationPaymentLink({
    data: {
      leadId: data.leadId
    }
  });
  return {
    ok: true
  };
});
export {
  convertConsultationLead_createServerFn_handler,
  resetConsultationSelection_createServerFn_handler,
  selectConsultationService_createServerFn_handler,
  sendConsultationPaymentLink_createServerFn_handler
};
