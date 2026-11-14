import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, _ as _enum } from "../_libs/zod.mjs";
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
const STATUSES = ["draft", "submitted", "under_review", "awaiting_response", "resolved", "closed"];
const SEVERITIES = ["low", "normal", "high", "critical"];
const listComplaints_createServerFn_handler = createServerRpc({
  id: "ee0b99f0cd6aee6c8acafd75e2f0b846e20b65ffe89565fae23a4c00b4e0a2ad",
  name: "listComplaints",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => listComplaints.__executeServer(opts));
const listComplaints = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: string().optional(),
  severity: string().optional(),
  q: string().optional()
}).parse(i ?? {})).handler(listComplaints_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  let q = supabase.from("complaints").select("id, complaint_number, status, severity, category, notes, description, authority_name, authority_ref_number, expected_update_at, submitted_at, created_at, updated_at, sla_due_at, lead_id, application_id, customer_id, assigned_to, reminder_count").order("created_at", {
    ascending: false
  }).limit(500);
  if (data.status) q = q.eq("status", data.status);
  if (data.severity) q = q.eq("severity", data.severity);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  const leadIds = Array.from(new Set((rows ?? []).map((r) => r.lead_id).filter(Boolean)));
  const appIds = Array.from(new Set((rows ?? []).map((r) => r.application_id).filter(Boolean)));
  const custIds = Array.from(new Set((rows ?? []).map((r) => r.customer_id).filter(Boolean)));
  const assigneeIds = Array.from(new Set((rows ?? []).map((r) => r.assigned_to).filter(Boolean)));
  const [leadsRes, appsRes, custsRes, profilesRes] = await Promise.all([leadIds.length ? supabase.from("leads").select("id, name, email, mobile, service").in("id", leadIds) : Promise.resolve({
    data: []
  }), appIds.length ? supabase.from("applications").select("id, application_code, application_status, service_id, services(service_name)").in("id", appIds) : Promise.resolve({
    data: []
  }), custIds.length ? supabase.from("customers").select("id, name, primary_email, primary_mobile").in("id", custIds) : Promise.resolve({
    data: []
  }), assigneeIds.length ? supabase.from("profiles").select("id, full_name, display_name, email").in("id", assigneeIds) : Promise.resolve({
    data: []
  })]);
  const leadMap = new Map((leadsRes.data ?? []).map((l) => [l.id, l]));
  const appMap = new Map((appsRes.data ?? []).map((a) => [a.id, a]));
  const custMap = new Map((custsRes.data ?? []).map((c) => [c.id, c]));
  const profMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p.full_name ?? p.display_name ?? p.email]));
  const enriched = (rows ?? []).map((r) => {
    const lead = leadMap.get(r.lead_id);
    const app = r.application_id ? appMap.get(r.application_id) : null;
    const customer = r.customer_id ? custMap.get(r.customer_id) : null;
    const created = new Date(r.created_at).getTime();
    const daysOpen = Math.max(0, Math.floor((Date.now() - created) / 864e5));
    return {
      ...r,
      lead: lead ? {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        service: lead.service
      } : null,
      customer: customer ? {
        id: customer.id,
        name: customer.name,
        email: customer.primary_email,
        mobile: customer.primary_mobile
      } : null,
      application: app ? {
        id: app.id,
        application_code: app.application_code,
        application_status: app.application_status,
        service_name: app.services?.service_name ?? null
      } : null,
      assigned_name: r.assigned_to ? profMap.get(r.assigned_to) ?? null : null,
      days_open: daysOpen
    };
  });
  const text = (data.q || "").trim().toLowerCase();
  const filtered = text ? enriched.filter((r) => (r.complaint_number || "").toLowerCase().includes(text) || (r.lead?.name || "").toLowerCase().includes(text) || (r.lead?.email || "").toLowerCase().includes(text) || (r.lead?.mobile || "").includes(text) || (r.application?.application_code || "").toLowerCase().includes(text)) : enriched;
  const {
    data: allRaw
  } = await supabase.from("complaints").select("status, severity").limit(5e3);
  const counts = {
    all: (allRaw ?? []).length
  };
  STATUSES.forEach((s) => counts[s] = (allRaw ?? []).filter((x) => x.status === s).length);
  return {
    rows: filtered,
    counts
  };
});
const updateComplaintStatus_createServerFn_handler = createServerRpc({
  id: "c8faf6de0d26f6e932e5f45a07d8b3405b13d396c42989ccd704ad9d7d26b8e3",
  name: "updateComplaintStatus",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => updateComplaintStatus.__executeServer(opts));
const updateComplaintStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  id: string().uuid(),
  status: _enum(STATUSES)
}).parse(input)).handler(updateComplaintStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const patch = {
    status: data.status
  };
  if (data.status === "resolved" || data.status === "closed") {
    patch.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
  }
  const {
    error
  } = await supabase.from("complaints").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const searchLeadsForComplaint_createServerFn_handler = createServerRpc({
  id: "eb088c0811f59cb537b36938bdfe15b96f4d0b1786172c6df167dd012b85d8fe",
  name: "searchLeadsForComplaint",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => searchLeadsForComplaint.__executeServer(opts));
const searchLeadsForComplaint = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  q: string().min(1)
}).parse(i)).handler(searchLeadsForComplaint_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const term = `%${data.q}%`;
  const {
    data: leads,
    error
  } = await supabase.from("leads").select("id, lead_code, name, email, mobile, service").or(`name.ilike.${term},email.ilike.${term},mobile.ilike.${term},lead_code.ilike.${term}`).order("created_at", {
    ascending: false
  }).limit(20);
  if (error) throw new Error(error.message);
  return {
    leads: leads ?? []
  };
});
const createComplaint_createServerFn_handler = createServerRpc({
  id: "642929bea5d8ba7673681487984eb825443eade0519e34411c565d5c367c12b2",
  name: "createComplaint",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => createComplaint.__executeServer(opts));
const createComplaint = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  lead_id: string().uuid(),
  application_id: string().uuid().nullish(),
  category: string().max(120).optional(),
  severity: _enum(SEVERITIES).optional(),
  notes: string().max(4e3).optional(),
  description: string().max(5e3).optional(),
  authority_name: string().trim().min(1).max(200),
  authority_ref_number: string().trim().max(200).optional(),
  expected_update_at: string().optional(),
  // ISO from datetime-local
  assigned_to: string().uuid().nullish()
}).parse(i)).handler(createComplaint_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: lead
  } = await supabase.from("leads").select("customer_id, name").eq("id", data.lead_id).maybeSingle();
  const {
    data: inserted,
    error
  } = await supabase.from("complaints").insert({
    lead_id: data.lead_id,
    application_id: data.application_id ?? null,
    customer_id: lead?.customer_id ?? null,
    category: data.category ?? null,
    severity: data.severity ?? "normal",
    notes: data.notes ?? null,
    description: data.description ?? null,
    authority_name: data.authority_name,
    authority_ref_number: data.authority_ref_number ?? null,
    expected_update_at: data.expected_update_at ? new Date(data.expected_update_at).toISOString() : null,
    assigned_to: data.assigned_to ?? null,
    status: "submitted",
    submitted_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select("id, complaint_number").single();
  if (error) throw new Error(error.message);
  if (data.application_id) {
    await supabase.from("application_events").insert({
      application_id: data.application_id,
      lead_id: data.lead_id,
      customer_id: lead?.customer_id ?? null,
      event_type: "complaint_raised",
      new_value: inserted.complaint_number,
      note: `Authority: ${data.authority_name}`,
      created_by: context.userId
    });
  }
  return inserted;
});
const updateComplaint_createServerFn_handler = createServerRpc({
  id: "b6fbaa242855e30e2931b57777521c23efc1a8ed0bc94660d6897fa79e12b029",
  name: "updateComplaint",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => updateComplaint.__executeServer(opts));
const updateComplaint = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  patch: object({
    authority_name: string().trim().min(1).max(200).optional(),
    authority_ref_number: string().trim().max(200).nullable().optional(),
    description: string().max(5e3).nullable().optional(),
    expected_update_at: string().nullable().optional(),
    category: string().max(120).nullable().optional(),
    severity: _enum(SEVERITIES).optional(),
    assigned_to: string().uuid().nullable().optional()
  }).partial()
}).parse(i)).handler(updateComplaint_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const p = {
    ...data.patch
  };
  if (p.expected_update_at && typeof p.expected_update_at === "string") {
    p.expected_update_at = new Date(p.expected_update_at).toISOString();
  }
  const {
    error
  } = await supabase.from("complaints").update(p).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const CONTACT_STATUSES = ["lead_created", "under_process", "contacted", "completed", "closed"];
const listContactSubmissions_createServerFn_handler = createServerRpc({
  id: "e49d6cccb59b6129f16ebe939760c546674b34fbbf8964e9dd65c5e54fff7348",
  name: "listContactSubmissions",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => listContactSubmissions.__executeServer(opts));
const listContactSubmissions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: string().optional(),
  q: string().optional()
}).parse(i ?? {})).handler(listContactSubmissions_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  let query = supabase.from("leads").select("id, name, email, mobile, state, language, service, lead_source, status, notes, lead_code, assigned_to, created_at, updated_at").or("lead_source.eq.contact_form,service.eq.Contact Enquiry").order("created_at", {
    ascending: false
  }).limit(500);
  if (data.status) {
    query = query.eq("status", data.status);
  }
  const {
    data: rows,
    error
  } = await query;
  if (error) throw new Error(error.message);
  const assigneeIds = Array.from(new Set((rows ?? []).map((r) => r.assigned_to).filter(Boolean)));
  const {
    data: profiles
  } = assigneeIds.length ? await supabase.from("profiles").select("id, full_name, display_name, email").in("id", assigneeIds) : {
    data: []
  };
  const profMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name ?? p.display_name ?? p.email]));
  const enriched = (rows ?? []).map((r) => ({
    ...r,
    assigned_name: r.assigned_to ? profMap.get(r.assigned_to) ?? null : null
  }));
  const text = (data.q || "").trim().toLowerCase();
  const filtered = text ? enriched.filter((r) => (r.name || "").toLowerCase().includes(text) || (r.email || "").toLowerCase().includes(text) || (r.mobile || "").includes(text) || (r.state || "").toLowerCase().includes(text) || (r.notes || "").toLowerCase().includes(text) || (r.lead_code || "").toLowerCase().includes(text)) : enriched;
  const {
    data: allRaw
  } = await supabase.from("leads").select("status").or("lead_source.eq.contact_form,service.eq.Contact Enquiry").limit(5e3);
  const counts = {
    all: (allRaw ?? []).length
  };
  CONTACT_STATUSES.forEach((s) => counts[s] = (allRaw ?? []).filter((x) => x.status === s).length);
  return {
    rows: filtered,
    counts
  };
});
const updateContactSubmissionStatus_createServerFn_handler = createServerRpc({
  id: "4fd78f88e53af2297ce8fb3b5753a1052aee8ba8e773b3c44bb52f69de95df92",
  name: "updateContactSubmissionStatus",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => updateContactSubmissionStatus.__executeServer(opts));
const updateContactSubmissionStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  status: _enum(CONTACT_STATUSES)
}).parse(i)).handler(updateContactSubmissionStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    error
  } = await supabase.from("leads").update({
    status: data.status,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabase.from("activity_logs").insert({
    lead_id: data.id,
    activity_type: "status_changed",
    activity_description: `Contact enquiry status changed to ${data.status}`,
    created_by: context.userId
  });
  return {
    ok: true
  };
});
const updateContactSubmissionNotes_createServerFn_handler = createServerRpc({
  id: "24e99414bd1f2312cffb4366cbe46f15efc024ed23ab187eb4a49be95dcaad50",
  name: "updateContactSubmissionNotes",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => updateContactSubmissionNotes.__executeServer(opts));
const updateContactSubmissionNotes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  notes: string().max(4e3)
}).parse(i)).handler(updateContactSubmissionNotes_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    error
  } = await supabase.from("leads").update({
    notes: data.notes,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const assignContactSubmission_createServerFn_handler = createServerRpc({
  id: "703983634b55ac4878c583ee22531b2b05a62029ad23f1e08a6523e8316c27bb",
  name: "assignContactSubmission",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => assignContactSubmission.__executeServer(opts));
const assignContactSubmission = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  assigned_to: string().uuid().nullable()
}).parse(i)).handler(assignContactSubmission_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    error
  } = await supabase.from("leads").update({
    assigned_to: data.assigned_to,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const convertContactToComplaint_createServerFn_handler = createServerRpc({
  id: "29226e0ca201fc8c535f8edfb3c0258d7feb439dce88746471c1a6de172dfde4",
  name: "convertContactToComplaint",
  filename: "src/lib/crm/complaints.functions.ts"
}, (opts) => convertContactToComplaint.__executeServer(opts));
const convertContactToComplaint = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  lead_id: string().uuid(),
  authority_name: string().trim().min(1).max(200),
  authority_ref_number: string().trim().max(200).optional(),
  description: string().max(5e3).optional(),
  severity: _enum(SEVERITIES).optional(),
  expected_update_at: string().optional(),
  assigned_to: string().uuid().nullish()
}).parse(i)).handler(convertContactToComplaint_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: lead,
    error: leadErr
  } = await supabase.from("leads").select("customer_id, name, notes").eq("id", data.lead_id).single();
  if (leadErr || !lead) throw new Error("Lead not found");
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  const complaintNumber = `CMP-${y}${m}-${rand}`;
  const {
    data: inserted,
    error: cErr
  } = await supabase.from("complaints").insert({
    lead_id: data.lead_id,
    customer_id: lead.customer_id ?? null,
    complaint_number: complaintNumber,
    authority_name: data.authority_name,
    authority_ref_number: data.authority_ref_number ?? null,
    description: data.description || lead.notes || null,
    notes: `Converted from contact form enquiry.`,
    severity: data.severity ?? "normal",
    expected_update_at: data.expected_update_at ? new Date(data.expected_update_at).toISOString() : null,
    assigned_to: data.assigned_to ?? null,
    status: "submitted",
    submitted_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select("id, complaint_number").single();
  if (cErr || !inserted) throw new Error(cErr?.message || "Failed to create complaint");
  await supabase.from("leads").update({
    service: "Complaint",
    status: "under_process",
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.lead_id);
  await supabase.from("activity_logs").insert({
    lead_id: data.lead_id,
    activity_type: "complaint_raised",
    activity_description: `Converted contact form enquiry to Complaint ${inserted.complaint_number}`,
    created_by: context.userId
  });
  return inserted;
});
export {
  assignContactSubmission_createServerFn_handler,
  convertContactToComplaint_createServerFn_handler,
  createComplaint_createServerFn_handler,
  listComplaints_createServerFn_handler,
  listContactSubmissions_createServerFn_handler,
  searchLeadsForComplaint_createServerFn_handler,
  updateComplaintStatus_createServerFn_handler,
  updateComplaint_createServerFn_handler,
  updateContactSubmissionNotes_createServerFn_handler,
  updateContactSubmissionStatus_createServerFn_handler
};
