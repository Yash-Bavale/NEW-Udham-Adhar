import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { s as string, o as object, _ as _enum } from "../_libs/zod.mjs";
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
const LeadCode = string().trim().toUpperCase().regex(/^[A-Z]{2}-\d{4}-\d{6}$/);
const Token = string().trim().min(10).max(200);
const PAID = /* @__PURE__ */ new Set(["payment_successful", "under_process", "completed"]);
const exchangeOnboardingAccess_createServerFn_handler = createServerRpc({
  id: "d54ef0f0e4687d54c02c473e13f6542597498ab4d8b31291a14528e244a2f5e2",
  name: "exchangeOnboardingAccess",
  filename: "src/lib/security/customer-access.functions.ts"
}, (opts) => exchangeOnboardingAccess.__executeServer(opts));
const exchangeOnboardingAccess = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: Token
}).parse(i)).handler(exchangeOnboardingAccess_createServerFn_handler, async ({
  data
}) => {
  const sec = await import("./customer-access.server-C_oBiISE.mjs");
  const leadId = await sec.leadIdByCode(data.leadCode);
  await sec.assertCustomerAccess(data.accessToken, leadId, "status", data.leadCode);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const [{
    data: lead
  }, {
    data: paid
  }] = await Promise.all([supabaseAdmin.from("leads").select("status").eq("id", leadId).maybeSingle(), supabaseAdmin.from("payments").select("id").eq("lead_id", leadId).eq("status", "paid").limit(1).maybeSingle()]);
  const isPaid = !!paid || PAID.has(String(lead?.status ?? ""));
  if (!isPaid) return {
    ok: false,
    paid: false
  };
  const token = await sec.issueCustomerToken(leadId, "ob", {
    reason: "post_payment_exchange"
  });
  return {
    ok: true,
    paid: true,
    accessToken: token
  };
});
const requestSecureLink_createServerFn_handler = createServerRpc({
  id: "754f2710651260d2a82cef9ed6f1c31422f8ace7219c9db18a4deabe9123f90f",
  name: "requestSecureLink",
  filename: "src/lib/security/customer-access.functions.ts"
}, (opts) => requestSecureLink.__executeServer(opts));
const requestSecureLink = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode
}).parse(i)).handler(requestSecureLink_createServerFn_handler, async ({
  data
}) => {
  const generic = {
    ok: true
  };
  const sec = await import("./customer-access.server-C_oBiISE.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: lead
  } = await supabaseAdmin.from("leads").select("id, name, email, status, lead_code").eq("lead_code", data.leadCode).maybeSingle();
  await sec.logAccessEvent({
    event: "link_requested",
    leadCode: data.leadCode,
    leadId: lead?.id ?? null
  });
  if (!lead?.email) return generic;
  const since = new Date(Date.now() - 60 * 6e4).toISOString();
  const {
    count
  } = await supabaseAdmin.from("customer_access_events").select("id", {
    count: "exact",
    head: true
  }).eq("event", "link_sent").eq("lead_id", lead.id).gte("created_at", since);
  if ((count ?? 0) >= 3) return generic;
  const {
    data: paid
  } = await supabaseAdmin.from("payments").select("id").eq("lead_id", lead.id).eq("status", "paid").limit(1).maybeSingle();
  const isPaid = !!paid || PAID.has(String(lead.status ?? ""));
  const origin = process.env.APP_BASE_URL || "https://udyamadhar.in";
  const path = isPaid ? `/onboarding/${lead.lead_code}` : `/payment/${lead.lead_code}`;
  const url = await sec.secureCustomerUrl(origin, path, lead.id, isPaid ? "ob" : "co", "customer_requested");
  const label = isPaid ? "Continue your application" : "Complete your payment";
  const name = String(lead.name ?? "").replace(/[<>&"]/g, "");
  const {
    enqueueEmailInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  await enqueueEmailInternal({
    toEmail: lead.email,
    toName: lead.name,
    subject: `Your secure link for ${lead.lead_code}`,
    bodyHtml: `<p>Hello ${name},</p><p>Here is your secure link. It works only for your application.</p><p><a href="${url}">${label}</a></p><p>If you did not ask for this, you can ignore this email.</p>`,
    bodyText: `Hello ${name},

Here is your secure link: ${url}

If you did not ask for this, you can ignore this email.`,
    leadId: lead.id,
    allowWithoutTemplate: true,
    allowDuplicate: true
  }).catch(() => void 0);
  await sec.logAccessEvent({
    event: "link_sent",
    leadCode: lead.lead_code,
    leadId: lead.id
  });
  return generic;
});
const mintCustomerLink_createServerFn_handler = createServerRpc({
  id: "3063b58e23c647fd924a0b6676e3a6fb6bdbdc0551609db8c5956f6d1fea9c4e",
  name: "mintCustomerLink",
  filename: "src/lib/security/customer-access.functions.ts"
}, (opts) => mintCustomerLink.__executeServer(opts));
const mintCustomerLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadCode: LeadCode,
  kind: _enum(["form", "payment"])
}).parse(i)).handler(mintCustomerLink_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: isStaff
  } = await context.supabase.rpc("has_any_staff_role", {
    _user_id: context.userId
  });
  if (!isStaff) throw new Error("Not authorized.");
  const sec = await import("./customer-access.server-C_oBiISE.mjs");
  const leadId = await sec.leadIdByCode(data.leadCode);
  if (!leadId) throw new Error("Order not found.");
  const origin = process.env.APP_BASE_URL || "https://udyamadhar.in";
  const path = data.kind === "form" ? `/onboarding/${data.leadCode}` : `/payment/${data.leadCode}`;
  const token = await sec.issueCustomerToken(leadId, data.kind === "form" ? "ob" : "co", {
    reason: "staff_copied",
    createdBy: context.userId
  });
  return {
    url: `${origin}${path}#t=${token}`
  };
});
const PublicRef = string().trim().regex(/^[a-f0-9]{32}$/);
const resolveCustomerRef_createServerFn_handler = createServerRpc({
  id: "0bd3c60ff2a62bf1963a67ffde69faa8db38b6ab96bfa4863a6e484040278c0a",
  name: "resolveCustomerRef",
  filename: "src/lib/security/customer-access.functions.ts"
}, (opts) => resolveCustomerRef.__executeServer(opts));
const resolveCustomerRef = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  ref: PublicRef
}).parse(i)).handler(resolveCustomerRef_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: lead
  } = await supabaseAdmin.from("leads").select("lead_code").eq("public_ref", data.ref).maybeSingle();
  if (!lead?.lead_code) {
    const sec = await import("./customer-access.server-C_oBiISE.mjs");
    await sec.logAccessEvent({
      event: "denied",
      reason: "bad_ref"
    });
  }
  return {
    leadCode: lead?.lead_code ?? null
  };
});
const customerRefForCode_createServerFn_handler = createServerRpc({
  id: "4aaae77f6d8f19038eea24f6f8dbc0919e4f556dc021105b54d7a4bddcf2b735",
  name: "customerRefForCode",
  filename: "src/lib/security/customer-access.functions.ts"
}, (opts) => customerRefForCode.__executeServer(opts));
const customerRefForCode = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: Token
}).parse(i)).handler(customerRefForCode_createServerFn_handler, async ({
  data
}) => {
  const sec = await import("./customer-access.server-C_oBiISE.mjs");
  const leadId = await sec.leadIdByCode(data.leadCode);
  try {
    await sec.assertCustomerAccess(data.accessToken, leadId, "status", data.leadCode);
  } catch {
    return {
      ref: null
    };
  }
  return {
    ref: leadId ? await sec.publicRefForLeadId(leadId) : null
  };
});
export {
  customerRefForCode_createServerFn_handler,
  exchangeOnboardingAccess_createServerFn_handler,
  mintCustomerLink_createServerFn_handler,
  requestSecureLink_createServerFn_handler,
  resolveCustomerRef_createServerFn_handler
};
