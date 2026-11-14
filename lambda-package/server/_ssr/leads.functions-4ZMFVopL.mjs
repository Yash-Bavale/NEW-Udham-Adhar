import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { L as LANGUAGES, I as INDIAN_STATES, S as SERVICES } from "./constants-CKRzJJF_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, l as literal, _ as _enum } from "../_libs/zod.mjs";
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
function parseLeadSource(sourcePage) {
  if (!sourcePage) return "Website";
  try {
    const url = new URL(sourcePage, "https://placeholder.invalid");
    const params = url.searchParams;
    const isGoogleAds = params.has("Gad_source") || params.has("gad_source") || params.has("gclid") || params.has("Gclid") || params.has("gbraid") || params.has("Gbraid") || params.has("wbraid") || params.has("Wbraid");
    if (isGoogleAds) {
      const campaignId = params.get("Gad_campaignid") || params.get("gad_campaignid") || params.get("utm_campaign") || null;
      const keyword = params.get("utm_term") || params.get("keyword") || null;
      const adGroup = params.get("utm_content") || null;
      let label = "Google Ads";
      if (campaignId) label += ` | Campaign: ${campaignId}`;
      if (keyword) label += ` | kw: ${keyword}`;
      if (adGroup) label += ` | adg: ${adGroup}`;
      const landingPath = url.pathname.replace(/^\/+/, "") || "/";
      label += ` | Page: /${landingPath}`;
      return label;
    }
    const cleanPath = url.pathname || "/";
    return `Website | ${cleanPath}`;
  } catch {
    return `Website | ${sourcePage.split("?")[0].slice(0, 120)}`;
  }
}
const LeadInput = object({
  name: string().trim().min(2).max(120),
  email: string().trim().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: _enum(INDIAN_STATES),
  language: _enum(LANGUAGES),
  service: string().trim().min(1).max(200),
  consent: literal(true, {
    message: "You must accept the terms to proceed"
  }),
  source_page: string().trim().max(300).optional()
});
const createLead_createServerFn_handler = createServerRpc({
  id: "d09b5def561c97d9af2d33d19dea3fb9e628ab88e1cbc611eb88b776cde547d4",
  name: "createLead",
  filename: "src/lib/leads.functions.ts"
}, (opts) => createLead.__executeServer(opts));
const createLead = createServerFn({
  method: "POST"
}).inputValidator((input) => LeadInput.parse(input)).handler(createLead_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    getDefaultWebsiteId
  } = await import("./default-website.server-BIcPmBN6.mjs");
  const websiteId = await getDefaultWebsiteId();
  const raw = data.service;
  const slugFromStatic = SERVICES.find((s) => s.label === raw)?.slug;
  const candidate = slugFromStatic ?? raw;
  const {
    data: service,
    error: svcErr
  } = await supabaseAdmin.from("services").select("id, service_code, service_name, base_amount, gst_amount, total_amount, is_active").or(`service_code.eq.${candidate},service_name.eq.${raw}`).maybeSingle();
  if (svcErr) throw new Error(svcErr.message);
  if (!service || !service.is_active) {
    throw new Error("Selected service is not currently available.");
  }
  data.service = service.service_name;
  const baseAmount = Number(service.base_amount);
  const gstAmount = Number(service.gst_amount);
  const totalAmount = Number(service.total_amount);
  const normalizedEmail = data.email.toLowerCase();
  const {
    data: existing
  } = await supabaseAdmin.from("leads").select("id").or(`mobile.eq.${data.mobile},email.eq.${normalizedEmail}`).order("created_at", {
    ascending: true
  }).limit(1).maybeSingle();
  const isDuplicate = !!existing?.id;
  const duplicateOf = existing?.id ?? null;
  let customerId = null;
  {
    const {
      data: cid,
      error: custErr
    } = await supabaseAdmin.rpc("find_or_create_customer", {
      p_name: data.name,
      p_email: normalizedEmail,
      p_mobile: data.mobile,
      p_state: data.state,
      p_language: data.language
    });
    if (custErr) {
      console.error("find_or_create_customer failed:", custErr.message);
    } else {
      customerId = cid ?? null;
    }
  }
  let leadId;
  let leadCode;
  {
    const {
      data: row,
      error
    } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: normalizedEmail,
      mobile: data.mobile,
      state: data.state,
      language: data.language,
      service: data.service,
      service_id: service.id,
      base_amount: baseAmount,
      gst_amount: gstAmount,
      total_amount: totalAmount,
      status: "new_lead",
      lead_source: parseLeadSource(data.source_page),
      is_duplicate: isDuplicate,
      duplicate_of: duplicateOf,
      customer_id: customerId,
      website_id: websiteId
    }).select("id, lead_code").single();
    if (error || !row) {
      throw new Error(error?.message ?? "Could not save your details. Please try again.");
    }
    leadId = row.id;
    leadCode = row.lead_code;
  }
  try {
    const {
      autoAssignLeadOrOrder
    } = await import("./auto-assign.server-D-MYRWKz.mjs");
    await autoAssignLeadOrOrder({
      leadId,
      serviceId: service.id
    });
  } catch (assignErr) {
    console.error("[createLead] Auto-assignment failed:", assignErr);
  }
  if (duplicateOf) {
    const {
      data: orig
    } = await supabaseAdmin.from("leads").select("duplicate_count").eq("id", duplicateOf).maybeSingle();
    await supabaseAdmin.from("leads").update({
      duplicate_count: (orig?.duplicate_count ?? 0) + 1
    }).eq("id", duplicateOf);
  }
  const {
    issueCustomerToken
  } = await import("./customer-access.server-C_oBiISE.mjs");
  const accessToken = await issueCustomerToken(leadId, "co", {
    reason: "lead_created"
  });
  return {
    leadId,
    leadCode,
    accessToken,
    baseAmount,
    gstAmount,
    totalAmount
  };
});
export {
  createLead_createServerFn_handler
};
