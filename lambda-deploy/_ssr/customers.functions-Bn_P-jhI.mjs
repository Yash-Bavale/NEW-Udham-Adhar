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
const listCustomers_createServerFn_handler = createServerRpc({
  id: "0449bfb26b1a47bae455379cd53cf8331b3c15b2dc3b74403b76af38a3de1456",
  name: "listCustomers",
  filename: "src/lib/crm/customers.functions.ts"
}, (opts) => listCustomers.__executeServer(opts));
const listCustomers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(listCustomers_createServerFn_handler, async ({
  data,
  context
}) => {
  const s = context.supabase;
  let q = s.from("customers").select("id, customer_code, name, primary_email, primary_mobile, state, status, lifetime_value, total_applications, completed_applications, pending_applications, last_seen_at, first_seen_at, last_service_id").order("last_seen_at", {
    ascending: false
  }).limit(data.limit ?? 200);
  if (data.status && data.status !== "all") q = q.eq("status", data.status);
  if (data.q && data.q.trim().length >= 2) {
    const raw = data.q.trim();
    const like = `%${raw}%`;
    q = q.or([`name.ilike.${like}`, `primary_email.ilike.${like}`, `primary_mobile.ilike.${like}`, `customer_code.ilike.${like}`, `pan_number.ilike.${like}`, `aadhaar_number.ilike.${like}`, `gst_number.ilike.${like}`, `udyam_number.ilike.${like}`, `business_name.ilike.${like}`].join(","));
  }
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
const getCustomer360_createServerFn_handler = createServerRpc({
  id: "c9fab14567506a7602dfc4ad844cc8e1ba5d4424f30f786b5fccc796c0efb1da",
  name: "getCustomer360",
  filename: "src/lib/crm/customers.functions.ts"
}, (opts) => getCustomer360.__executeServer(opts));
const getCustomer360 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(getCustomer360_createServerFn_handler, async ({
  data,
  context
}) => {
  const s = context.supabase;
  const id = data.customerId;
  const [cust, leads, apps, pays, invs, certs, comps, emails, notes, acts] = await Promise.all([s.from("customers").select("*").eq("id", id).maybeSingle(), s.from("leads").select("id, lead_code, service, status, lead_status_v2, created_at, total_amount").eq("customer_id", id).order("created_at", {
    ascending: false
  }), s.from("applications").select("id, application_code, application_status, fulfillment_status, form_status, document_status, created_at, updated_at, service_id, lead_id, documents_deleted_at, form_submitted_at, certificate_uploaded_at").eq("customer_id", id).order("created_at", {
    ascending: false
  }), s.from("payments").select("id, amount, status, gateway_name, created_at, payment_date, razorpay_payment_id").eq("customer_id", id).order("created_at", {
    ascending: false
  }), s.from("invoices").select("id, invoice_number, total_amount, issued_at, pdf_path, payment_id").eq("customer_id", id).order("issued_at", {
    ascending: false
  }), s.from("certificates").select("id, certificate_number, file_name, file_path, issued_at, delivered_at").eq("customer_id", id).order("created_at", {
    ascending: false
  }), s.from("complaints").select("id, complaint_number, status, severity, category, sla_due_at, created_at").eq("customer_id", id).order("created_at", {
    ascending: false
  }), s.from("email_logs").select("id, to_email, subject, template_code, status, sent_at, lead_id").order("sent_at", {
    ascending: false
  }).limit(50), s.from("customer_notes").select("id, note, created_at, user_id").eq("customer_id", id).order("created_at", {
    ascending: false
  }), s.from("activity_logs").select("id, activity_type, activity_description, created_at, lead_id").order("created_at", {
    ascending: false
  }).limit(80)]);
  if (cust.error || !cust.data) throw new Error(cust.error?.message ?? "Customer not found");
  const leadIds = (leads.data ?? []).map((l) => l.id);
  const leadIdSet = new Set(leadIds);
  const emailsFiltered = (emails.data ?? []).filter((e) => !e.lead_id || leadIdSet.has(e.lead_id));
  const actsFiltered = (acts.data ?? []).filter((a) => !a.lead_id || leadIdSet.has(a.lead_id));
  let docs = [];
  if (leadIds.length > 0) {
    const {
      data: dData
    } = await s.from("documents").select("id, doc_type, file_name, status, uploaded_at, verified_at, lead_id, application_id").in("lead_id", leadIds).order("uploaded_at", {
      ascending: false
    });
    docs = dData ?? [];
  }
  const {
    data: eventsData
  } = await s.from("application_events").select("id, event_type, old_value, new_value, staff_name, staff_role, created_at, application_id, lead_id").eq("customer_id", id).order("created_at", {
    ascending: false
  }).limit(200);
  return {
    customer: cust.data,
    leads: leads.data ?? [],
    applications: apps.data ?? [],
    payments: pays.data ?? [],
    invoices: invs.data ?? [],
    certificates: certs.data ?? [],
    complaints: comps.data ?? [],
    emails: emailsFiltered,
    notes: notes.data ?? [],
    activity: actsFiltered,
    events: eventsData ?? [],
    documents: docs
  };
});
const addCustomerNote_createServerFn_handler = createServerRpc({
  id: "4dbb6757d30f46ffef629a42eb01e0bcafed15825ca07dc9082df129169c4574",
  name: "addCustomerNote",
  filename: "src/lib/crm/customers.functions.ts"
}, (opts) => addCustomerNote.__executeServer(opts));
const addCustomerNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(addCustomerNote_createServerFn_handler, async ({
  data,
  context
}) => {
  const note = data.note.trim();
  if (!note) throw new Error("Note cannot be empty");
  if (note.length > 4e3) throw new Error("Note too long");
  const {
    error
  } = await context.supabase.from("customer_notes").insert({
    customer_id: data.customerId,
    note,
    user_id: context.userId
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const updateCustomer_createServerFn_handler = createServerRpc({
  id: "19a4b5be0f82bd385f2d800a56e99a1945eac997fae13f8c8aac4e6d54847130",
  name: "updateCustomer",
  filename: "src/lib/crm/customers.functions.ts"
}, (opts) => updateCustomer.__executeServer(opts));
const updateCustomer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(updateCustomer_createServerFn_handler, async ({
  data,
  context
}) => {
  const patch = {
    ...data.patch
  };
  for (const k of ["pan_number", "gst_number", "udyam_number"]) {
    if (typeof patch[k] === "string") patch[k] = patch[k].trim().toUpperCase() || null;
  }
  if (typeof patch.aadhaar_number === "string") {
    patch.aadhaar_number = patch.aadhaar_number.replace(/\D/g, "") || null;
  }
  const {
    error
  } = await context.supabase.from("customers").update(patch).eq("id", data.customerId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const uploadCustomerKyc_createServerFn_handler = createServerRpc({
  id: "d933b30de9c7f68233a221e99d85a647716654f80f7b1722eb1c42cb6be7668a",
  name: "uploadCustomerKyc",
  filename: "src/lib/crm/customers.functions.ts"
}, (opts) => uploadCustomerKyc.__executeServer(opts));
const uploadCustomerKyc = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(uploadCustomerKyc_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const ext = (data.fileName.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "bin";
  const ts = Date.now();
  const path = `customers/${data.customerId}/${data.docType}-${ts}.${ext}`;
  const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
  const {
    error: upErr
  } = await supabaseAdmin.storage.from("documents").upload(path, bytes, {
    contentType: data.contentType,
    upsert: true
  });
  if (upErr) throw new Error(upErr.message);
  const col = data.docType === "pan" ? "pan_doc_path" : "aadhaar_doc_path";
  const {
    error: updErr
  } = await context.supabase.from("customers").update({
    [col]: path
  }).eq("id", data.customerId);
  if (updErr) throw new Error(updErr.message);
  return {
    ok: true,
    path
  };
});
const getCustomerKycSignedUrl_createServerFn_handler = createServerRpc({
  id: "1af26807d563a4183803fc1099c32dbae5a1b568f7c20b4b17a573c925abf22f",
  name: "getCustomerKycSignedUrl",
  filename: "src/lib/crm/customers.functions.ts"
}, (opts) => getCustomerKycSignedUrl.__executeServer(opts));
const getCustomerKycSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(getCustomerKycSignedUrl_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: signed,
    error
  } = await supabaseAdmin.storage.from("documents").createSignedUrl(data.path, 60 * 10);
  if (error || !signed?.signedUrl) throw new Error(error?.message ?? "Could not sign URL");
  return {
    url: signed.signedUrl
  };
});
const getRepeatPurchaseMetrics_createServerFn_handler = createServerRpc({
  id: "973d466e32de56f2346284c571c6322fce00b1af7acf9e20a21a2ed0f56e9bc5",
  name: "getRepeatPurchaseMetrics",
  filename: "src/lib/crm/customers.functions.ts"
}, (opts) => getRepeatPurchaseMetrics.__executeServer(opts));
const getRepeatPurchaseMetrics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getRepeatPurchaseMetrics_createServerFn_handler, async ({
  context
}) => {
  const s = context.supabase;
  const {
    data
  } = await s.from("customers").select("total_applications, lifetime_value, completed_applications");
  const rows = data ?? [];
  const total = rows.length;
  const repeat = rows.filter((r) => (r.total_applications ?? 0) >= 2).length;
  const ltv = rows.reduce((s2, r) => s2 + Number(r.lifetime_value ?? 0), 0);
  return {
    totalCustomers: total,
    repeatCustomers: repeat,
    repeatRate: total ? repeat / total : 0,
    lifetimeValue: ltv,
    avgLtv: total ? ltv / total : 0
  };
});
export {
  addCustomerNote_createServerFn_handler,
  getCustomer360_createServerFn_handler,
  getCustomerKycSignedUrl_createServerFn_handler,
  getRepeatPurchaseMetrics_createServerFn_handler,
  listCustomers_createServerFn_handler,
  updateCustomer_createServerFn_handler,
  uploadCustomerKyc_createServerFn_handler
};
