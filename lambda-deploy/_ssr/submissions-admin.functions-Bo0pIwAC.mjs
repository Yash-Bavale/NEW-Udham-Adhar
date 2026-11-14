import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, s as string, _ as _enum } from "../_libs/zod.mjs";
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
const listSubmissions_createServerFn_handler = createServerRpc({
  id: "9b8bd700c57751d04c989cb03c005aea4af7f1d9edddc32ee9b8f2097ff5f7d1",
  name: "listSubmissions",
  filename: "src/lib/crm/submissions-admin.functions.ts"
}, (opts) => listSubmissions.__executeServer(opts));
const listSubmissions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: string().max(40).optional(),
  service_code: string().max(80).optional(),
  search: string().max(120).optional(),
  limit: number().int().min(1).max(200).default(100)
}).parse(i ?? {})).handler(listSubmissions_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  let q = supabase.from("onboarding_submissions").select("id, service_code, status, submitted_at, created_at, updated_at, application_id, lead_id").order("submitted_at", {
    ascending: false,
    nullsFirst: false
  }).order("created_at", {
    ascending: false
  }).limit(data.limit);
  if (data.status) q = q.eq("status", data.status);
  if (data.service_code) q = q.eq("service_code", data.service_code);
  const {
    data: subs,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const leadIds = Array.from(new Set((subs ?? []).map((s) => s.lead_id).filter(Boolean)));
  const appIds = Array.from(new Set((subs ?? []).map((s) => s.application_id).filter(Boolean)));
  const [{
    data: leads
  }, {
    data: apps
  }] = await Promise.all([leadIds.length ? supabase.from("leads").select("id, name, email, mobile, lead_code, status, customer_id, service").in("id", leadIds) : Promise.resolve({
    data: []
  }), appIds.length ? supabase.from("applications").select("id, application_code, application_status, form_status, document_status").in("id", appIds) : Promise.resolve({
    data: []
  })]);
  const leadMap = new Map((leads ?? []).map((l) => [l.id, l]));
  const appMap = new Map((apps ?? []).map((a) => [a.id, a]));
  let rows = (subs ?? []).map((s) => ({
    ...s,
    lead: leadMap.get(s.lead_id) ?? null,
    application: s.application_id ? appMap.get(s.application_id) ?? null : null
  }));
  if (data.search) {
    const q2 = data.search.toLowerCase();
    rows = rows.filter((r) => {
      const l = r.lead;
      return l?.name?.toLowerCase().includes(q2) || l?.email?.toLowerCase().includes(q2) || l?.mobile?.includes(q2) || l?.lead_code?.toLowerCase().includes(q2) || r.application?.application_code?.toLowerCase().includes(q2);
    });
  }
  return {
    rows
  };
});
const getSubmission_createServerFn_handler = createServerRpc({
  id: "f0b8bb7969191da953cca0c54fd3d7059ede7bd771b7663867bb3c46f168afd3",
  name: "getSubmission",
  filename: "src/lib/crm/submissions-admin.functions.ts"
}, (opts) => getSubmission.__executeServer(opts));
const getSubmission = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(getSubmission_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: sub,
    error
  } = await supabase.from("onboarding_submissions").select("*").eq("id", data.id).single();
  if (error) throw new Error(error.message);
  const [{
    data: lead
  }, {
    data: app
  }, {
    data: schema
  }, {
    data: workflow
  }, {
    data: docs
  }] = await Promise.all([supabase.from("leads").select("*").eq("id", sub.lead_id).maybeSingle(), sub.application_id ? supabase.from("applications").select("*").eq("id", sub.application_id).maybeSingle() : Promise.resolve({
    data: null
  }), supabase.from("service_form_schemas").select("*").eq("service_code", sub.service_code).eq("is_active", true).order("version", {
    ascending: false
  }).limit(1).maybeSingle(), supabase.from("service_workflows").select("*").eq("service_code", sub.service_code).eq("is_active", true).maybeSingle(), sub.application_id ? supabase.from("documents").select("*").eq("application_id", sub.application_id).order("uploaded_at", {
    ascending: false
  }) : supabase.from("documents").select("*").eq("lead_id", sub.lead_id).order("uploaded_at", {
    ascending: false
  })]);
  const customer = lead?.customer_id ? (await supabase.from("customers").select("*").eq("id", lead.customer_id).maybeSingle()).data : null;
  return {
    submission: sub,
    lead: lead ?? null,
    customer,
    application: app ?? null,
    formSchema: schema ?? null,
    workflow: workflow ?? null,
    documents: docs ?? []
  };
});
const updateSubmissionStatus_createServerFn_handler = createServerRpc({
  id: "7f703a537117361002261c33441590d2150b449abfa8ae2f1906aae23d4ed18a",
  name: "updateSubmissionStatus",
  filename: "src/lib/crm/submissions-admin.functions.ts"
}, (opts) => updateSubmissionStatus.__executeServer(opts));
const updateSubmissionStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  status: _enum(["draft", "submitted", "approved", "rejected", "needs_changes"]),
  notes: string().max(2e3).optional()
}).parse(i)).handler(updateSubmissionStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const patch = {
    status: data.status,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (data.status === "submitted") patch.submitted_at = (/* @__PURE__ */ new Date()).toISOString();
  const {
    error
  } = await supabase.from("onboarding_submissions").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  if (data.notes) {
    const {
      data: sub
    } = await supabase.from("onboarding_submissions").select("lead_id").eq("id", data.id).maybeSingle();
    if (sub?.lead_id) {
      await supabase.from("activity_logs").insert({
        lead_id: sub.lead_id,
        activity_type: "submission_reviewed",
        activity_description: `Submission ${data.status}: ${data.notes}`
      });
    }
  }
  return {
    ok: true
  };
});
const getFormSubmissionForApplication_createServerFn_handler = createServerRpc({
  id: "6d7d13cbe721fc08caba335a5171fce85df5d53a68cee07f3f18ea3a41b62ec6",
  name: "getFormSubmissionForApplication",
  filename: "src/lib/crm/submissions-admin.functions.ts"
}, (opts) => getFormSubmissionForApplication.__executeServer(opts));
const getFormSubmissionForApplication = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(getFormSubmissionForApplication_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if (!roles || roles.length === 0) throw new Error("Forbidden");
  const supabase = supabaseAdmin;
  const {
    data: app,
    error: appErr
  } = await supabase.from("applications").select("id, application_code, lead_id, customer_id, service_id, form_status, fulfillment_status, application_status, created_at").eq("id", data.applicationId).maybeSingle();
  if (appErr) throw new Error(appErr.message);
  if (!app) return null;
  const [{
    data: lead
  }, {
    data: submission
  }, {
    data: docs
  }, {
    data: service
  }] = await Promise.all([supabase.from("leads").select("id, lead_code, name, email, mobile, service, state").eq("id", app.lead_id).maybeSingle(), supabase.from("onboarding_submissions").select("id, service_code, form_data, status, submitted_at, updated_at").eq("application_id", app.id).order("updated_at", {
    ascending: false
  }).limit(1).maybeSingle(), supabase.from("documents").select("id, doc_type, file_name, file_path, mime_type, size_bytes, status, remarks, uploaded_at").eq("application_id", app.id).order("uploaded_at", {
    ascending: false
  }), app.service_id ? supabase.from("services").select("id, service_code, service_name, govt_portal_url").eq("id", app.service_id).maybeSingle() : Promise.resolve({
    data: null
  })]);
  let sub = submission;
  if (!sub && app.lead_id) {
    const {
      data: bylead
    } = await supabase.from("onboarding_submissions").select("id, service_code, form_data, status, submitted_at, updated_at").eq("lead_id", app.lead_id).order("updated_at", {
      ascending: false
    }).limit(1).maybeSingle();
    sub = bylead;
  }
  const targetServiceCode = service?.service_code ?? sub?.service_code ?? null;
  let serviceCode = targetServiceCode;
  try {
    const {
      syncSubmissionForOrder
    } = await import("./submission-sync.server-DxEiXZ3U.mjs");
    const syncRes = await syncSubmissionForOrder({
      admin: supabaseAdmin,
      applicationId: app.id,
      leadId: app.lead_id,
      targetServiceId: app.service_id,
      targetServiceCode
    });
    if (syncRes.submission) {
      sub = syncRes.submission;
      if (syncRes.serviceCode) serviceCode = syncRes.serviceCode;
    }
  } catch (syncErr) {
    console.warn("Failed to auto-sync submission for order:", syncErr);
  }
  let requiredDocs = [];
  let activeSchema = null;
  if (serviceCode) {
    const {
      data: schema
    } = await supabase.from("service_form_schemas").select("schema, documents").eq("service_code", serviceCode).eq("is_active", true).order("version", {
      ascending: false
    }).limit(1).maybeSingle();
    if (schema?.schema) activeSchema = schema.schema;
    const docList = schema?.documents ?? [];
    requiredDocs = docList.map((d) => ({
      key: String(d.key ?? d.type ?? ""),
      label: String(d.label ?? d.name ?? d.key ?? ""),
      required: d.required !== false
    }));
    if (!activeSchema) {
      const {
        getSchema
      } = await import("./schemas-DClqju6h.mjs");
      const tsSchema = getSchema(serviceCode);
      if (tsSchema) {
        activeSchema = {
          fields: tsSchema.fields,
          sections: []
        };
        if (!requiredDocs.length && tsSchema.documents?.length) {
          requiredDocs = tsSchema.documents.map((d) => ({
            key: String(d.key ?? d.type ?? ""),
            label: String(d.label ?? d.name ?? d.key ?? ""),
            required: d.required !== false
          }));
        }
      }
    }
  }
  const roleList = (roles ?? []).map((r) => r.role);
  const isSuperAdmin = roleList.includes("super_admin") || roleList.includes("admin");
  return {
    application: app,
    lead: lead ?? null,
    service: service ?? null,
    submission: sub ?? null,
    documents: docs ?? [],
    requiredDocs,
    serviceCode,
    activeSchema,
    isSuperAdmin
  };
});
const getFormSubmissionForLead_createServerFn_handler = createServerRpc({
  id: "2e8ae0fe00588510f9813504109fd48e2234cfbfb13c8a784e04499332903297",
  name: "getFormSubmissionForLead",
  filename: "src/lib/crm/submissions-admin.functions.ts"
}, (opts) => getFormSubmissionForLead.__executeServer(opts));
const getFormSubmissionForLead = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(getFormSubmissionForLead_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if (!roles || roles.length === 0) throw new Error("Forbidden");
  const supabase = supabaseAdmin;
  const {
    data: lead,
    error: leadErr
  } = await supabase.from("leads").select("id, lead_code, name, email, mobile, service, service_id, created_at").eq("id", data.leadId).maybeSingle();
  if (leadErr) throw new Error(leadErr.message);
  if (!lead) return null;
  const [{
    data: submission
  }, {
    data: docs
  }, {
    data: service
  }] = await Promise.all([supabase.from("onboarding_submissions").select("id, service_code, form_data, status, submitted_at, updated_at").eq("lead_id", lead.id).order("updated_at", {
    ascending: false
  }).limit(1).maybeSingle(), supabase.from("documents").select("id, doc_type, file_name, file_path, mime_type, size_bytes, status, remarks, uploaded_at").eq("lead_id", lead.id).order("uploaded_at", {
    ascending: false
  }), lead.service_id ? supabase.from("services").select("id, service_code, service_name").eq("id", lead.service_id).maybeSingle() : Promise.resolve({
    data: null
  })]);
  const serviceCode = submission?.service_code ?? service?.service_code ?? null;
  let requiredDocs = [];
  if (serviceCode) {
    const {
      data: schema
    } = await supabase.from("service_form_schemas").select("documents").eq("service_code", serviceCode).eq("is_active", true).order("version", {
      ascending: false
    }).limit(1).maybeSingle();
    const docList = schema?.documents ?? [];
    requiredDocs = docList.map((d) => ({
      key: String(d.key ?? d.type ?? ""),
      label: String(d.label ?? d.name ?? d.key ?? ""),
      required: d.required !== false
    }));
  }
  const roleList = (roles ?? []).map((r) => r.role);
  const isSuperAdmin = roleList.includes("super_admin") || roleList.includes("admin");
  return {
    lead,
    service: service ?? null,
    submission: submission ?? null,
    documents: docs ?? [],
    requiredDocs,
    serviceCode,
    isSuperAdmin
  };
});
const resendFormLink_createServerFn_handler = createServerRpc({
  id: "4ec1a89ebe00abe521f11103e8b3ac8d29872581b44dfae40f2d065556a537f4",
  name: "resendFormLink",
  filename: "src/lib/crm/submissions-admin.functions.ts"
}, (opts) => resendFormLink.__executeServer(opts));
const resendFormLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(resendFormLink_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    enqueueFromTemplateInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  const {
    supabase,
    userId
  } = context;
  const {
    data: lead,
    error
  } = await supabase.from("leads").select("id, lead_code, name, email, mobile, service").eq("id", data.leadId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!lead?.email) throw new Error("Lead has no email on file");
  const origin = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
  const formLink = `${origin}/onboarding/${encodeURIComponent(lead.lead_code ?? "")}`;
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
  await enqueueFromTemplateInternal("welcome_and_form_link", lead.email, {
    // snake_case keys match the welcome_and_form_link template placeholders
    customer_name: lead.name ?? "Customer",
    service_name: lead.service ?? "your service",
    form_link: formLink,
    order_number: orderNumber,
    // legacy camelCase aliases kept for older templates
    name: lead.name ?? "Customer",
    leadCode: lead.lead_code ?? "",
    service: lead.service ?? "your service",
    formLink,
    mobile: lead.mobile ?? ""
  }, {
    toName: lead.name ?? void 0,
    leadId: lead.id,
    trigger: "manual"
  });
  await supabaseAdmin.from("activity_logs").insert({
    lead_id: lead.id,
    user_id: userId,
    activity_type: "form_link_resent",
    activity_description: `Form link resent to ${lead.email}`
  });
  return {
    ok: true,
    email: lead.email,
    formLink
  };
});
export {
  getFormSubmissionForApplication_createServerFn_handler,
  getFormSubmissionForLead_createServerFn_handler,
  getSubmission_createServerFn_handler,
  listSubmissions_createServerFn_handler,
  resendFormLink_createServerFn_handler,
  updateSubmissionStatus_createServerFn_handler
};
