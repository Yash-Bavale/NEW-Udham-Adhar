import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { g as getUserModulePermission } from "./permissions.functions-DO0h7DgB.mjs";
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
import "./createSsrRpc-BO-AEXHh.mjs";
import "./roles-CFhgFhhh.mjs";
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
const globalSearch_createServerFn_handler = createServerRpc({
  id: "2d26bf8c5f184ba93641072c9b44eb0595bbfbc2205945769a060fa190880939",
  name: "globalSearch",
  filename: "src/lib/crm/global-search.functions.ts"
}, (opts) => globalSearch.__executeServer(opts));
const globalSearch = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(globalSearch_createServerFn_handler, async ({
  data,
  context
}) => {
  const q = (data.q || "").trim();
  if (q.length < 2) return {
    hits: []
  };
  const admin = await getAdmin();
  const userId = context.userId;
  const like = `%${q}%`;
  const tokens = q.split(/\s+/).map((t) => t.trim()).filter((t) => t.length >= 2);
  const {
    getStaffRoleInfo
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  const [leadsPerm, ordersPerm, invoicesPerm, complaintsPerm, supportPerm, staffInfo] = await Promise.all([getUserModulePermission(admin, userId, "leads"), getUserModulePermission(admin, userId, "orders"), getUserModulePermission(admin, userId, "invoices"), getUserModulePermission(admin, userId, "complaints"), getUserModulePermission(admin, userId, "support"), getStaffRoleInfo(admin, userId)]);
  const {
    isAdmin,
    isManager
  } = staffInfo;
  const canSearchAllOrders = isAdmin || isManager;
  const canSearchAllLeads = isAdmin || isManager || Boolean(leadsPerm.scopeAll);
  const leadFilter = tokens.length > 1 ? tokens.map((tok) => `name.ilike.%${tok}%,email.ilike.%${tok}%,mobile.ilike.%${tok}%,lead_code.ilike.%${tok}%,service.ilike.%${tok}%`).join(",") : `name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like},service.ilike.${like}`;
  const custFilter = tokens.length > 1 ? tokens.map((tok) => `name.ilike.%${tok}%,primary_email.ilike.%${tok}%,primary_mobile.ilike.%${tok}%,customer_code.ilike.%${tok}%`).join(",") : `name.ilike.${like},primary_email.ilike.${like},primary_mobile.ilike.${like},customer_code.ilike.${like}`;
  let leadQuery = admin.from("leads").select("id, lead_code, name, email, mobile, service, status, lead_status_v2, notes, created_at, customer_id, assigned_to").or(leadFilter).limit(30);
  if (!canSearchAllLeads) {
    leadQuery = leadQuery.eq("assigned_to", userId);
  }
  let appByCodeQuery = admin.from("applications").select("id, application_code, application_status, fulfillment_status, lead_id, customer_id, created_at, assigned_to, services(service_name)").ilike("application_code", like).eq("is_deleted", false).limit(30);
  if (!canSearchAllOrders) {
    appByCodeQuery = appByCodeQuery.eq("assigned_to", userId);
  }
  const canSearchLeads = leadsPerm.canView || canSearchAllLeads || ordersPerm.canView;
  const [l, custData, aByCode, inv, cert, comp, tickets] = await Promise.all([canSearchLeads ? leadQuery : Promise.resolve({
    data: []
  }), admin.from("customers").select("id, customer_code, name, primary_email, primary_mobile, created_at").or(custFilter).limit(30), ordersPerm.canView ? appByCodeQuery : Promise.resolve({
    data: []
  }), invoicesPerm.canView ? admin.from("invoices").select("id, invoice_number, total_amount, status, created_at").ilike("invoice_number", like).limit(5) : Promise.resolve({
    data: []
  }), admin.from("certificates").select("id, application_id, certificate_number, file_name, created_at").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(10), complaintsPerm.canView ? admin.from("complaints").select("id, complaint_number, status, severity, category, description, created_at").or(`complaint_number.ilike.${like},description.ilike.${like},notes.ilike.${like}`).limit(8) : Promise.resolve({
    data: []
  }), supportPerm.canView ? admin.from("support_tickets").select("id, ticket_number, subject, status, priority, ticket_email, description, created_at").or(`ticket_number.ilike.${like},subject.ilike.${like},ticket_email.ilike.${like},description.ilike.${like}`).limit(8) : Promise.resolve({
    data: []
  })]);
  const leadIds = (l.data || []).map((r) => r.id).filter(Boolean);
  const customerIds = (custData.data || []).map((r) => r.id).filter(Boolean);
  let linkedAppsByLead = [];
  let linkedAppsByCust = [];
  if (ordersPerm.canView) {
    let qLead = admin.from("applications").select("id, application_code, application_status, fulfillment_status, lead_id, customer_id, created_at, assigned_to, services(service_name)").in("lead_id", leadIds).eq("is_deleted", false).order("created_at", {
      ascending: false
    }).limit(30);
    let qCust = admin.from("applications").select("id, application_code, application_status, fulfillment_status, lead_id, customer_id, created_at, assigned_to, services(service_name)").in("customer_id", customerIds).eq("is_deleted", false).order("created_at", {
      ascending: false
    }).limit(30);
    if (!canSearchAllOrders) {
      qLead = qLead.eq("assigned_to", userId);
      qCust = qCust.eq("assigned_to", userId);
    }
    const [byLeadRes, byCustRes] = await Promise.all([leadIds.length ? qLead : Promise.resolve({
      data: []
    }), customerIds.length ? qCust : Promise.resolve({
      data: []
    })]);
    linkedAppsByLead = byLeadRes.data ?? [];
    linkedAppsByCust = byCustRes.data ?? [];
  }
  const seenApp = /* @__PURE__ */ new Set();
  const allApps = [...aByCode.data || [], ...linkedAppsByLead, ...linkedAppsByCust].filter((r) => {
    if (seenApp.has(r.id)) return false;
    seenApp.add(r.id);
    return true;
  });
  const allLeadIds = Array.from(/* @__PURE__ */ new Set([...leadIds, ...allApps.map((r) => r.lead_id).filter(Boolean)]));
  const allCustomerIds = Array.from(/* @__PURE__ */ new Set([...customerIds, ...allApps.map((r) => r.customer_id).filter(Boolean)]));
  let fullLeads = l.data || [];
  const missingLeadIds = allLeadIds.filter((id) => !fullLeads.some((fl) => fl.id === id));
  if (missingLeadIds.length) {
    const {
      data: mLeads
    } = await admin.from("leads").select("id, lead_code, name, email, mobile, service, status, lead_status_v2, notes, created_at, customer_id").in("id", missingLeadIds);
    if (mLeads) fullLeads = [...fullLeads, ...mLeads];
  }
  let fullCusts = custData.data || [];
  const missingCustIds = allCustomerIds.filter((id) => !fullCusts.some((fc) => fc.id === id));
  if (missingCustIds.length) {
    const {
      data: mCusts
    } = await admin.from("customers").select("id, customer_code, name, primary_email, primary_mobile, created_at").in("id", missingCustIds);
    if (mCusts) fullCusts = [...fullCusts, ...mCusts];
  }
  const leadMap = new Map(fullLeads.map((r) => [r.id, r]));
  const custMap = new Map(fullCusts.map((r) => [r.id, r]));
  const staffIds = Array.from(new Set([...allApps.map((a) => a.assigned_to), ...(l.data || []).map((ld) => ld.assigned_to)].filter(Boolean)));
  const staffMap = /* @__PURE__ */ new Map();
  if (staffIds.length > 0) {
    const {
      data: profs
    } = await admin.from("profiles").select("id, full_name, display_name").in("id", staffIds);
    (profs ?? []).forEach((p) => {
      staffMap.set(p.id, p.full_name || p.display_name || "Staff");
    });
  }
  const candidateHits = [];
  allApps.forEach((r) => {
    if (!canSearchAllOrders && r.assigned_to !== userId) {
      return;
    }
    const lead = r.lead_id ? leadMap.get(r.lead_id) : null;
    const cust = r.customer_id ? custMap.get(r.customer_id) : lead?.customer_id ? custMap.get(lead.customer_id) : null;
    const customerName = lead?.name || cust?.name || "Order";
    const customerEmail = lead?.email || cust?.primary_email || null;
    const customerMobile = lead?.mobile || cust?.primary_mobile || null;
    const serviceName = r.services?.service_name || lead?.service || null;
    const assigneeName = r.assigned_to ? staffMap.get(r.assigned_to) || "Unassigned" : "Unassigned";
    candidateHits.push({
      kind: "application",
      id: r.id,
      name: customerName,
      code: r.application_code,
      created_at: r.created_at,
      mobile: customerMobile,
      email: customerEmail,
      service: serviceName,
      stage: r.application_status || r.fulfillment_status,
      assignee: assigneeName,
      title: r.application_code,
      subtitle: [assigneeName, serviceName, customerName, customerEmail, customerMobile].filter(Boolean).join(" · "),
      details: `Order Code: ${r.application_code}, Customer: ${customerName}, Email: ${customerEmail ?? ""}, Mobile: ${customerMobile ?? ""}, Service: ${serviceName ?? "General"}, Assignee: ${assigneeName}, Status: ${r.application_status ?? ""}`,
      href: `/admin/orders/${r.id}`
    });
  });
  if (leadsPerm.canView) {
    (l.data || []).forEach((r) => candidateHits.push({
      kind: "lead",
      id: r.id,
      name: r.name || "Lead",
      code: r.lead_code,
      created_at: r.created_at,
      mobile: r.mobile || null,
      email: r.email || null,
      service: r.service || null,
      stage: r.lead_status_v2 || r.status,
      assignee: r.assigned_to ? staffMap.get(r.assigned_to) || null : null,
      title: r.name || r.lead_code,
      subtitle: [r.lead_code, r.service, r.lead_status_v2 || r.status, r.email, r.mobile].filter(Boolean).join(" · "),
      details: `Lead Name: ${r.name ?? ""}, Code: ${r.lead_code ?? ""}, Email: ${r.email ?? ""}, Mobile: ${r.mobile ?? ""}, Service: ${r.service ?? ""}, Status: ${r.lead_status_v2 ?? r.status ?? ""}, Notes: ${r.notes ?? ""}`,
      href: `/admin/leads/${r.id}`
    }));
  }
  (tickets.data || []).forEach((r) => candidateHits.push({
    kind: "ticket",
    id: r.id,
    code: r.ticket_number,
    name: r.subject || "Support Ticket",
    created_at: r.created_at,
    email: r.ticket_email || null,
    title: r.ticket_number ? `${r.ticket_number} · ${r.subject || "Support Ticket"}` : r.subject || "Support Ticket",
    subtitle: [r.status, r.priority ? `Priority: ${r.priority}` : null, r.ticket_email].filter(Boolean).join(" · "),
    stage: r.status,
    details: `Ticket Number: ${r.ticket_number}, Subject: ${r.subject}, Priority: ${r.priority}, Status: ${r.status}, Email: ${r.ticket_email}, Description: ${r.description ?? ""}`,
    href: `/admin/support/tickets/${r.id}`
  }));
  (comp.data || []).forEach((r) => candidateHits.push({
    kind: "complaint",
    id: r.id,
    title: r.complaint_number || r.id,
    subtitle: [r.status, r.severity ? `Severity: ${r.severity}` : null, r.category].filter(Boolean).join(" · "),
    stage: r.status,
    details: `Complaint Number: ${r.complaint_number}, Category: ${r.category ?? ""}, Severity: ${r.severity ?? ""}, Status: ${r.status}, Description: ${r.description ?? ""}`,
    href: `/admin/complaints/${r.id}`
  }));
  (inv.data || []).forEach((r) => candidateHits.push({
    kind: "invoice",
    id: r.id,
    title: r.invoice_number,
    subtitle: `₹${r.total_amount}${r.status ? ` · ${r.status}` : ""}`,
    details: `Invoice Number: ${r.invoice_number}, Amount: ₹${r.total_amount}, Status: ${r.status ?? ""}`,
    href: `/admin/finance/gst`
  }));
  (cert.data || []).forEach((r) => candidateHits.push({
    kind: "certificate",
    id: r.id,
    title: r.certificate_number || r.file_name,
    subtitle: r.certificate_number ? `Certificate: ${r.certificate_number}` : "Document",
    details: `Certificate Number: ${r.certificate_number ?? ""}, File: ${r.file_name ?? ""}`,
    href: `/admin/certificates`
  }));
  if (candidateHits.length === 0) {
    return {
      hits: []
    };
  }
  let reranked = candidateHits;
  try {
    const {
      rerankWithSystemOne
    } = await import("./typesafe.server-CvMnlmDt.mjs");
    reranked = await rerankWithSystemOne(q, candidateHits, {
      timeoutMs: 2500,
      maxCandidates: 25
    });
  } catch (err) {
    console.warn("[globalSearch] rerank warning:", err);
  }
  const normalizedQ = q.toLowerCase().trim();
  const finalHits = reranked.map((h) => {
    let score = h.relevanceScore ?? 0.5;
    const titleLower = (h.title || "").toLowerCase();
    const codeLower = (h.code || "").toLowerCase();
    const emailLower = (h.email || "").toLowerCase();
    const mobileLower = (h.mobile || "").toLowerCase();
    const nameLower = (h.name || "").toLowerCase();
    if (emailLower === normalizedQ || codeLower === normalizedQ || titleLower === normalizedQ || mobileLower === normalizedQ) {
      score += 2;
    } else if (emailLower.includes(normalizedQ) || codeLower.includes(normalizedQ) || titleLower.includes(normalizedQ) || mobileLower.includes(normalizedQ) || nameLower.includes(normalizedQ)) {
      score += 0.8;
    }
    return {
      ...h,
      finalScore: score
    };
  });
  finalHits.sort((a, b) => b.finalScore - a.finalScore);
  return {
    hits: finalHits.map(({
      details,
      finalScore,
      ...rest
    }) => rest)
  };
});
export {
  globalSearch_createServerFn_handler
};
