import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit, i as isUserAdmin } from "./audit-DZHwwAr_.mjs";
import { g as getUserModulePermission } from "./permissions.functions-DO0h7DgB.mjs";
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
import "./createSsrRpc-BO-AEXHh.mjs";
import "./roles-CFhgFhhh.mjs";
const STAFF_READ_ROLES = ["super_admin", "operations", "admin", "support", "executive", "manager", "accounts", "finance"];
const LEAD_WRITE_ROLES = ["super_admin", "operations", "admin", "manager", "executive"];
const LEAD_FINANCE_WRITE_ROLES = ["super_admin", "admin", "finance"];
const STAFF_MANAGEMENT_ROLES = ["super_admin", "operations", "admin", "manager", "executive", "support", "accounts", "finance"];
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
const LEAD_STATUS_ENUM = ["new_lead", "contacted", "payment_pending", "payment_successful", "under_process", "completed", "closed", "refund_requested", "lead_created", "details_pending", "documents_pending", "under_review"];
const LeadUpdateSchema = object({
  id: string().uuid(),
  status: _enum(LEAD_STATUS_ENUM).optional(),
  name: string().optional(),
  email: string().email().optional(),
  mobile: string().optional(),
  state: string().optional(),
  language: string().optional(),
  lead_source: string().optional(),
  notes: string().optional(),
  assigned_to: string().uuid().nullable().optional(),
  remarks: string().optional(),
  service: string().optional(),
  base_amount: number().optional(),
  gst_amount: number().optional(),
  total_amount: number().optional()
});
const updateLead_createServerFn_handler = createServerRpc({
  id: "4b001e5e7dbd41692f9695e2f6f1eda68a486b5e3a85f6b46d4c928fd6aa6795",
  name: "updateLead",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => updateLead.__executeServer(opts));
const updateLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadUpdateSchema.parse(i)).handler(updateLead_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    id: leadId,
    ...patch
  } = data;
  const supabase = context.supabase;
  const financeFields = ["service", "base_amount", "gst_amount", "total_amount"];
  const patchKeys = Object.keys(patch);
  const hasFinanceField = patchKeys.some((k) => financeFields.includes(k));
  const hasNonFinanceField = patchKeys.some((k) => !financeFields.includes(k));
  if (hasNonFinanceField) {
    await assertRole(supabase, LEAD_WRITE_ROLES);
  }
  if (hasFinanceField) {
    await assertRole(supabase, LEAD_FINANCE_WRITE_ROLES);
  }
  const admin = await getAdmin();
  if (patch.status === "completed") {
    const {
      data: cur
    } = await admin.from("leads").select("status").eq("id", leadId).maybeSingle();
    if (cur?.status !== "completed") {
      throw new Error("Cannot mark lead completed manually. Complete the application via the Completion Gate (certificate upload).");
    }
  }
  const {
    data: prev,
    error: fetchErr
  } = await admin.from("leads").select("*").eq("id", leadId).single();
  if (fetchErr || !prev) throw new Error("Lead not found");
  const {
    error: updateErr
  } = await admin.from("leads").update(patch).eq("id", leadId);
  if (updateErr) throw new Error(updateErr.message);
  const needStaff = patch.status && patch.status !== prev.status || patch.assigned_to !== void 0 && patch.assigned_to !== prev.assigned_to;
  if (needStaff) {
    const [{
      data: profile
    }, {
      data: roleRows
    }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", context.userId)]);
    const staff_name = profile?.display_name || profile?.email || "Staff";
    const staff_role = roleRows?.[0]?.role ?? "staff";
    if (patch.status && patch.status !== prev.status) {
      await admin.from("application_events").insert({
        lead_id: leadId,
        customer_id: prev.customer_id ?? null,
        event_type: "lead_status_change",
        old_value: prev.status,
        new_value: patch.status,
        created_by: context.userId,
        staff_name,
        staff_role
      });
    }
    if (patch.assigned_to !== void 0 && patch.assigned_to !== prev.assigned_to) {
      await admin.from("application_events").insert({
        lead_id: leadId,
        customer_id: prev.customer_id ?? null,
        event_type: "assignment_change",
        old_value: prev.assigned_to ?? null,
        new_value: patch.assigned_to ?? null,
        created_by: context.userId,
        staff_name,
        staff_role
      });
      if (patch.assigned_to) {
        const {
          emitToUsers
        } = await import("./emit.server-OhKEr4hO.mjs");
        await emitToUsers([patch.assigned_to], {
          kind: "order_assigned",
          title: "New Lead Assigned",
          body: `Lead ${prev.name || prev.lead_code || "New Lead"} has been assigned to your queue.`,
          href: `/admin/leads/${leadId}`,
          entityKind: "lead",
          entityId: leadId
        });
      }
    }
  }
  await writeAudit({
    supabase,
    entityType: "lead",
    entityId: leadId,
    action: "update_lead",
    oldValue: prev,
    newValue: {
      ...prev,
      ...patch
    },
    actorId: context.userId
  });
  return {
    ok: true
  };
});
const changeLeadService_createServerFn_handler = createServerRpc({
  id: "45c7f1f3bbc294efd23f478be9f714fd5f1e4339c0f9634d8ffb2370e7a36c2d",
  name: "changeLeadService",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => changeLeadService.__executeServer(opts));
const changeLeadService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  leadId: string().uuid(),
  serviceId: string().uuid().optional(),
  serviceCode: string().optional()
})).handler(changeLeadService_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  await assertRole(supabase, LEAD_WRITE_ROLES);
  const admin = await getAdmin();
  const {
    data: lead,
    error: leadErr
  } = await admin.from("leads").select("id, lead_code, name, service, service_id, customer_id, base_amount, gst_amount, total_amount, status").eq("id", data.leadId).single();
  if (leadErr || !lead) throw new Error("Lead not found");
  let svcQuery = admin.from("services").select("id, service_code, service_name, base_amount, gst_amount, total_amount");
  if (data.serviceId) {
    svcQuery = svcQuery.eq("id", data.serviceId);
  } else if (data.serviceCode) {
    svcQuery = svcQuery.eq("service_code", data.serviceCode);
  } else {
    throw new Error("Must provide serviceId or serviceCode");
  }
  const {
    data: targetSvc,
    error: svcErr
  } = await svcQuery.maybeSingle();
  if (svcErr || !targetSvc) throw new Error("Target service not found");
  const oldService = lead.service;
  const newService = targetSvc.service_name;
  const baseAmount = Number(targetSvc.base_amount);
  const gstAmount = Number(targetSvc.gst_amount);
  const totalAmount = Number(targetSvc.total_amount);
  const {
    data: paidPayments
  } = await admin.from("payments").select("amount").eq("lead_id", data.leadId).in("status", ["paid"]);
  const paidSum = (paidPayments ?? []).reduce((s, p) => s + Number(p.amount || 0), 0);
  const isAlreadyPaid = paidSum > 0 || lead.status === "payment_successful";
  const leadUpdate = {
    service: newService,
    service_id: targetSvc.id,
    ...isAlreadyPaid ? {} : {
      base_amount: baseAmount,
      gst_amount: gstAmount,
      total_amount: totalAmount
    }
  };
  const {
    error: updLeadErr
  } = await admin.from("leads").update(leadUpdate).eq("id", data.leadId);
  if (updLeadErr) throw new Error(updLeadErr.message);
  const {
    SERVICE_CHANGE_STAGE_RESET
  } = await import("./submission-sync.server-DxEiXZ3U.mjs");
  await admin.from("applications").update({
    service_id: targetSvc.id,
    ...SERVICE_CHANGE_STAGE_RESET
  }).not("fulfillment_status", "in", "(completed,order_completed,order_closed,cancelled)").eq("lead_id", data.leadId);
  try {
    const {
      syncSubmissionForOrder
    } = await import("./submission-sync.server-DxEiXZ3U.mjs");
    await syncSubmissionForOrder({
      admin,
      leadId: data.leadId,
      targetServiceId: targetSvc.id,
      targetServiceCode: targetSvc.service_code,
      resetToDraft: true
    });
  } catch (syncErr) {
    console.warn("Failed to synchronize submission on lead service change:", syncErr);
  }
  await admin.from("payment_links").update({
    status: "expired"
  }).eq("lead_id", data.leadId).eq("status", "pending");
  let newPaymentLink = null;
  const remainingAmount = isAlreadyPaid ? Math.max(0, totalAmount - paidSum) : totalAmount;
  if (remainingAmount > 0) {
    const txnid = `LNK-${lead.lead_code}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
    const appOrigin = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
    const paymentUrl = `${appOrigin}/payment/${encodeURIComponent(lead.lead_code ?? "")}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString();
    const {
      data: linkData
    } = await admin.from("payment_links").insert({
      lead_id: data.leadId,
      txnid,
      payment_url: paymentUrl,
      amount: remainingAmount,
      status: "pending",
      expires_at: expiresAt,
      created_by: context.userId
    }).select("id, txnid, payment_url, amount, status").maybeSingle();
    newPaymentLink = linkData;
    if (newPaymentLink?.payment_url) {
      const {
        withCheckoutToken
      } = await import("./customer-access.server-C_oBiISE.mjs");
      newPaymentLink = {
        ...newPaymentLink,
        payment_url: await withCheckoutToken(newPaymentLink.payment_url, data.leadId, context.userId)
      };
    }
  }
  const [{
    data: profile
  }, {
    data: roleRows
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", context.userId)]);
  const staff_name = profile?.display_name || profile?.email || "Staff";
  const staff_role = roleRows?.[0]?.role ?? "staff";
  const displayAmountLog = isAlreadyPaid ? `Paid: ₹${paidSum}` : `₹${totalAmount}`;
  await admin.from("application_events").insert({
    lead_id: data.leadId,
    customer_id: lead.customer_id ?? null,
    event_type: "service_changed",
    old_value: oldService ?? "Unknown",
    new_value: `${newService} (${displayAmountLog})`,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  await admin.from("activity_logs").insert({
    lead_id: data.leadId,
    user_id: context.userId,
    activity_type: "service_changed",
    activity_description: `Service changed from ${oldService ?? "Unknown"} to ${newService} (${displayAmountLog})`
  });
  await writeAudit({
    supabase,
    entityType: "lead",
    entityId: data.leadId,
    action: "change_service",
    oldValue: lead,
    newValue: {
      ...lead,
      service: newService,
      service_id: targetSvc.id
    },
    actorId: context.userId
  });
  return {
    ok: true,
    serviceName: newService,
    totalAmount: isAlreadyPaid ? paidSum : totalAmount,
    paymentLink: newPaymentLink
  };
});
const getLeadSourceBreakdown_createServerFn_handler = createServerRpc({
  id: "611e4af203d52cd6595714fc80edd7570de11f68a88fd6fde9abebd848099257",
  name: "getLeadSourceBreakdown",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => getLeadSourceBreakdown.__executeServer(opts));
const getLeadSourceBreakdown = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getLeadSourceBreakdown_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, STAFF_READ_ROLES);
  const admin = await getAdmin();
  const {
    data: rows,
    error
  } = await admin.from("leads").select("lead_source").not("lead_source", "is", null);
  if (error) throw new Error(error.message);
  const rawCounts = {};
  for (const r of rows ?? []) {
    const s = r.lead_source;
    if (s) rawCounts[s] = (rawCounts[s] ?? 0) + 1;
  }
  const CHANNEL_LABELS = {
    ads: {
      label: "Google Ads",
      icon: "📢"
    },
    website: {
      label: "Website",
      icon: "🌐"
    },
    whatsapp: {
      label: "WhatsApp",
      icon: "💬"
    },
    referral: {
      label: "Referral",
      icon: "👥"
    },
    manual: {
      label: "Manual / CRM",
      icon: "✍️"
    },
    instagram: {
      label: "Instagram",
      icon: "📸"
    },
    facebook: {
      label: "Facebook",
      icon: "📘"
    },
    other: {
      label: "Other",
      icon: "📋"
    }
  };
  const channelCounts = {};
  const items = Object.entries(rawCounts).sort((a, b) => b[1] - a[1]).map(([src, count]) => {
    const lower = src.toLowerCase();
    let channel = "other";
    let label = src;
    if (lower.startsWith("google ads") || lower.includes("gclid") || lower.includes("utm_source=google")) {
      channel = "ads";
      const parts = src.split("|").map((p) => p.trim());
      label = parts.join(" · ");
    } else if (lower.startsWith("website")) {
      channel = "website";
      const parts = src.split("|").map((p) => p.trim());
      label = parts.join(" · ");
    } else if (lower.includes("whatsapp")) {
      channel = "whatsapp";
    } else if (lower.includes("instagram")) {
      channel = "instagram";
    } else if (lower.includes("facebook")) {
      channel = "facebook";
    } else if (lower.includes("referral")) {
      channel = "referral";
    } else if (["manual", "crm", "website", "other"].includes(lower)) {
      channel = "manual";
      label = lower === "manual" ? "Manual / CRM" : src;
    }
    channelCounts[channel] = (channelCounts[channel] ?? 0) + count;
    return {
      value: src,
      label,
      channel,
      count
    };
  });
  const channels = Object.entries(channelCounts).sort((a, b) => b[1] - a[1]).map(([key, count]) => ({
    key,
    label: CHANNEL_LABELS[key]?.label ?? key,
    icon: CHANNEL_LABELS[key]?.icon ?? "📋",
    count
  }));
  return {
    channels,
    items
  };
});
const listLeads_createServerFn_handler = createServerRpc({
  id: "20feec4db495a4bb5829af8534c5b4c6b0ea27b979eb2c2834f9fc68da1ddcdb",
  name: "listLeads",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => listLeads.__executeServer(opts));
const listLeads = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  page: number().default(1),
  pageSize: number().default(25),
  search: string().optional(),
  status: _enum(LEAD_STATUS_ENUM).optional(),
  source: string().optional(),
  service: string().optional(),
  assignee: string().optional(),
  // uuid | "__unassigned" | "__me"
  websiteId: string().uuid().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
})).handler(listLeads_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, STAFF_READ_ROLES);
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  const perm = await getUserModulePermission(context.supabase, context.userId, "leads");
  if (!perm.canView) {
    return {
      rows: [],
      count: 0
    };
  }
  let query = admin.from("leads").select("*", {
    count: "exact"
  });
  if (data.status) query = query.eq("status", data.status);
  if (data.websiteId) query = query.eq("website_id", data.websiteId);
  if (data.source) {
    if (data.source.startsWith("__channel:")) {
      const ch = data.source.slice("__channel:".length);
      const prefixMap = {
        ads: "Google Ads",
        website: "Website",
        whatsapp: "WhatsApp",
        referral: "Referral",
        manual: "Manual",
        instagram: "Instagram",
        facebook: "Facebook"
      };
      const prefix = prefixMap[ch];
      if (prefix) {
        query = query.ilike("lead_source", `${prefix}%`);
      }
    } else {
      query = query.eq("lead_source", data.source);
    }
  }
  if (data.service) query = query.eq("service", data.service);
  if (!isAdmin) {
    if (!perm.scopeAll) {
      const allowedWebsites = perm.scopes.map((s) => s.websiteId).filter(Boolean);
      const allowedServices = perm.scopes.map((s) => s.serviceId).filter(Boolean);
      if (allowedWebsites.length > 0) {
        query = query.in("website_id", allowedWebsites);
      } else if (allowedServices.length > 0) {
        query = query.in("service", allowedServices);
      } else {
        query = query.eq("assigned_to", context.userId);
      }
    }
  } else {
    if (data.assignee === "__unassigned") query = query.is("assigned_to", null);
    else if (data.assignee === "__me") query = query.eq("assigned_to", context.userId);
    else if (data.assignee) query = query.eq("assigned_to", data.assignee);
  }
  if (data.dateFrom) query = query.gte("created_at", new Date(data.dateFrom).toISOString());
  if (data.dateTo) {
    const to = new Date(data.dateTo);
    to.setDate(to.getDate() + 1);
    query = query.lt("created_at", to.toISOString());
  }
  if (data.search) {
    query = query.or(`name.ilike.%${data.search}%,email.ilike.%${data.search}%,mobile.ilike.%${data.search}%,lead_code.ilike.%${data.search}%`);
  }
  const {
    data: rows,
    count,
    error
  } = await query.order("created_at", {
    ascending: false
  }).range((data.page - 1) * data.pageSize, data.page * data.pageSize - 1);
  if (error) throw new Error(error.message);
  const {
    data: websites
  } = await admin.from("websites").select("id, name, domain");
  const websitesById = Object.fromEntries((websites ?? []).map((w) => [w.id, {
    name: w.name,
    domain: w.domain
  }]));
  const assigneeIds = Array.from(new Set((rows ?? []).map((r) => r.assigned_to).filter(Boolean)));
  let profilesById = {};
  if (assigneeIds.length) {
    const {
      data: profs
    } = await admin.from("profiles").select("id, display_name, email").in("id", assigneeIds);
    profilesById = Object.fromEntries((profs ?? []).map((p) => [p.id, p]));
  }
  const leadIdsRaw = (rows ?? []).map((r) => r.id).filter(Boolean);
  let appsByLead = {};
  if (leadIdsRaw.length) {
    const {
      data: apps
    } = await admin.from("applications").select("lead_id, form_status, created_at").in("lead_id", leadIdsRaw).order("created_at", {
      ascending: false
    });
    for (const a of apps ?? []) {
      const lid = a.lead_id;
      if (!appsByLead[lid]) appsByLead[lid] = {
        form_status: a.form_status ?? null
      };
    }
  }
  const enriched = (rows ?? []).map((r) => {
    const wsMeta = r.website_id ? websitesById[r.website_id] : null;
    let website_name = wsMeta?.name ?? null;
    if (!website_name) {
      if (/registration|registration/i.test(r.service ?? "") || /udyamregistration/i.test(r.lead_source ?? "")) {
        website_name = "Udyam Registrations";
      } else {
        website_name = "Udyam Aadhar";
      }
    }
    return {
      ...r,
      website_name,
      website_domain: wsMeta?.domain ?? null,
      assignee_name: r.assigned_to ? profilesById[r.assigned_to]?.display_name || profilesById[r.assigned_to]?.email || null : null,
      form_status: appsByLead[r.id]?.form_status ?? null
    };
  });
  return {
    rows: enriched,
    total: count || 0
  };
});
const getLead_createServerFn_handler = createServerRpc({
  id: "624ea81e2a4e7330514cfa25ce58d1944815b8d2f90fcf6d333d7374ac8128f0",
  name: "getLead",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => getLead.__executeServer(opts));
const getLead = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  id: string().uuid()
})).handler(getLead_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, STAFF_READ_ROLES);
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  let query = admin.from("leads").select("*, applications!fk_applications_lead(*), lead_notes(*)").eq("id", data.id);
  if (!isAdmin) {
    query = query.eq("assigned_to", context.userId);
  }
  const {
    data: lead,
    error
  } = await query.single();
  if (error || !lead) throw new Error("Lead not found");
  let assignee_name = null;
  if (lead.assigned_to) {
    const {
      data: p
    } = await admin.from("profiles").select("display_name, email").eq("id", lead.assigned_to).maybeSingle();
    assignee_name = p?.display_name || p?.email || null;
  }
  return {
    lead: {
      ...lead,
      assignee_name
    },
    applications: lead.applications ?? [],
    notes: lead.lead_notes ?? []
  };
});
const findLeadByCodeOrId_createServerFn_handler = createServerRpc({
  id: "4f168db81722574bd917a9a8b9e1cdba1291319190a80a5eeddff0316ae3b635",
  name: "findLeadByCodeOrId",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => findLeadByCodeOrId.__executeServer(opts));
const findLeadByCodeOrId = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  query: string().min(2).max(64)
})).handler(findLeadByCodeOrId_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, STAFF_READ_ROLES);
  const admin = await getAdmin();
  const q = data.query.trim();
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let row = null;
  if (uuidRe.test(q)) {
    const {
      data: r
    } = await admin.from("leads").select("*").eq("id", q).maybeSingle();
    row = r;
  }
  if (!row) {
    const {
      data: r
    } = await admin.from("leads").select("*").ilike("lead_code", q).maybeSingle();
    row = r;
  }
  if (!row) {
    const {
      data: rs
    } = await admin.from("leads").select("*").or(`mobile.eq.${q},email.ilike.${q}`).order("created_at", {
      ascending: false
    }).limit(1);
    row = rs?.[0] ?? null;
  }
  if (!row) throw new Error("No lead found for that ID / code / mobile / email");
  return {
    lead: row
  };
});
const addLeadNote_createServerFn_handler = createServerRpc({
  id: "3552731b48e30d18773c88684b1e29bde958f33f1e44a004bc7bdc5622c7742c",
  name: "addLeadNote",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => addLeadNote.__executeServer(opts));
const addLeadNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  lead_id: string().uuid(),
  note: string().min(1)
})).handler(addLeadNote_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, STAFF_READ_ROLES);
  const admin = await getAdmin();
  const {
    error
  } = await admin.from("lead_notes").insert({
    lead_id: data.lead_id,
    note: data.note,
    user_id: context.userId
  });
  if (error) throw new Error(error.message);
  const {
    data: lead
  } = await admin.from("leads").select("customer_id").eq("id", data.lead_id).maybeSingle();
  const [{
    data: profile
  }, {
    data: roleRows
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", context.userId)]);
  await admin.from("application_events").insert({
    lead_id: data.lead_id,
    customer_id: lead?.customer_id ?? null,
    event_type: "note_added",
    note: data.note,
    created_by: context.userId,
    staff_name: profile?.display_name || profile?.email || "Staff",
    staff_role: roleRows?.[0]?.role ?? "staff"
  });
  return {
    ok: true
  };
});
const listStaff_createServerFn_handler = createServerRpc({
  id: "e6ef5c4dabe8c6f5fea11a7ae1bc18460ce831300a1e241fea9b11d92196a99b",
  name: "listStaff",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => listStaff.__executeServer(opts));
const listStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listStaff_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, STAFF_MANAGEMENT_ROLES);
  const admin = await getAdmin();
  const adminAny = admin;
  const [{
    data: profiles,
    error: profilesErr
  }, {
    data: superAdminRoles
  }] = await Promise.all([adminAny.from("profiles").select("*"), admin.from("user_roles").select("user_id").eq("role", "super_admin")]);
  if (profilesErr) throw new Error(profilesErr.message);
  const superAdminIds = new Set((superAdminRoles ?? []).map((r) => String(r.user_id)));
  const activeStaff = (profiles ?? []).filter((p) => !superAdminIds.has(String(p.id)) && p.is_active !== false && p.employment_status !== "ARCHIVED" && p.employment_status !== "TERMINATED" && p.employment_status !== "INACTIVE").map((p) => ({
    ...p,
    display_name: p.full_name || p.display_name || p.email?.split("@")[0] || "Unknown Employee",
    name: p.full_name || p.display_name || p.email?.split("@")[0] || "Unknown Employee",
    employment_status: p.employment_status || "ACTIVE"
  }));
  activeStaff.sort((a, b) => (a.display_name || "").localeCompare(b.display_name || ""));
  return {
    profiles: activeStaff
  };
});
const listAssignmentStaff_createServerFn_handler = createServerRpc({
  id: "5ad03f3cade89ac9422743d46e470efa32b5665b6e3a16024389d1d7b70c5eab",
  name: "listAssignmentStaff",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => listAssignmentStaff.__executeServer(opts));
const listAssignmentStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAssignmentStaff_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, STAFF_MANAGEMENT_ROLES);
  const admin = await getAdmin();
  const adminAny = admin;
  const [{
    data: profiles,
    error: profErr
  }, {
    data: superAdminRoles
  }, {
    data: poolRows
  }] = await Promise.all([adminAny.from("profiles").select("*"), admin.from("user_roles").select("user_id").eq("role", "super_admin"), adminAny.from("assignment_pool").select("user_id, service_id, is_active")]);
  if (profErr) console.error("[listAssignmentStaff] profiles error:", profErr);
  const superAdminIds = new Set((superAdminRoles ?? []).map((r) => String(r.user_id)));
  const poolUserMap = /* @__PURE__ */ new Map();
  (poolRows ?? []).forEach((r) => {
    if (r.user_id && !superAdminIds.has(String(r.user_id))) {
      poolUserMap.set(String(r.user_id), Boolean(r.is_active));
    }
  });
  const {
    calculateStaffWorkloads
  } = await import("./assignment-engine.server--SlhbLzd.mjs");
  const workloads = await calculateStaffWorkloads();
  const workloadMap = new Map(workloads.map((w) => [String(w.employeeId), w]));
  const result = (profiles ?? []).filter((p) => {
    if (!p.id || superAdminIds.has(String(p.id))) return false;
    if (p.is_active === false) return false;
    if (p.employment_status === "ARCHIVED" || p.employment_status === "TERMINATED" || p.employment_status === "INACTIVE") return false;
    return true;
  }).map((p) => {
    const w = workloadMap.get(String(p.id));
    const displayName = p.full_name || p.display_name || p.email?.split("@")[0] || "Staff";
    const isPoolActive = poolUserMap.has(String(p.id)) ? poolUserMap.get(String(p.id)) === true : true;
    const isOnLeave = w?.presenceStatus === "ON_LEAVE";
    const isEligible = isPoolActive && !isOnLeave && (w?.isAutoAssignEligible ?? true);
    let unavailReason = w?.unavailabilityReason;
    if (!isPoolActive) {
      unavailReason = "Auto-assign OFF";
    } else if (w?.presenceStatus === "OFFLINE") {
      unavailReason = "Staff Offline";
    } else if (w?.presenceStatus === "AWAY") {
      unavailReason = "Staff Away";
    } else if (isOnLeave) {
      unavailReason = "On Leave";
    }
    return {
      id: p.id,
      display_name: displayName,
      name: displayName,
      full_name: p.full_name,
      email: p.email,
      role: w?.role || p.role || "operations",
      employment_status: p.employment_status || "ACTIVE",
      is_active: true,
      is_in_pool: true,
      is_pool_active: isPoolActive,
      is_eligible: isEligible,
      is_on_leave: isOnLeave,
      presence_status: w?.presenceStatus || "OFFLINE",
      effective_workload: w?.effectiveWorkload ?? 0,
      unavailability_reason: unavailReason
    };
  });
  result.sort((a, b) => (a.display_name || "").localeCompare(b.display_name || ""));
  return {
    profiles: result
  };
});
const listAllHistoricalStaff_createServerFn_handler = createServerRpc({
  id: "2b937f8919d0a16dac3ca86da131dc8df532bfad6a82d6fe51c24c3cf2b55d61",
  name: "listAllHistoricalStaff",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => listAllHistoricalStaff.__executeServer(opts));
const listAllHistoricalStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAllHistoricalStaff_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, STAFF_READ_ROLES);
  const admin = await getAdmin();
  const adminAny = admin;
  const [profilesRes, superAdminRoles] = await Promise.all([adminAny.from("profiles").select("*"), admin.from("user_roles").select("user_id").eq("role", "super_admin")]);
  const superAdminIds = new Set((superAdminRoles.data ?? []).map((r) => String(r.user_id)));
  const allProfiles = (profilesRes.data ?? []).filter((p) => !superAdminIds.has(String(p.id)));
  return {
    profiles: allProfiles.map((p) => ({
      id: p.id,
      display_name: p.full_name || p.display_name || p.email?.split("@")[0] || "Unknown Employee",
      name: p.full_name || p.display_name || p.email?.split("@")[0] || "Unknown Employee",
      full_name: p.full_name || p.display_name || p.email?.split("@")[0] || "Unknown Employee",
      email: p.email,
      is_active: p.is_active !== false && p.employment_status !== "ARCHIVED" && p.employment_status !== "TERMINATED" && p.employment_status !== "INACTIVE",
      employment_status: p.employment_status || (p.is_active === false ? "INACTIVE" : "ACTIVE")
    }))
  };
});
const getLeadCounts_createServerFn_handler = createServerRpc({
  id: "961f27d6ee17bbb447cce182ae91e3206b3bb364961e06ec23c085c50b896dd9",
  name: "getLeadCounts",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => getLeadCounts.__executeServer(opts));
const getLeadCounts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getLeadCounts_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, STAFF_READ_ROLES);
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  const statuses = LEAD_STATUS_ENUM;
  const scope = (q) => isAdmin ? q : q.eq("assigned_to", context.userId);
  const [allRes, ...perStatus] = await Promise.all([scope(admin.from("leads").select("id", {
    count: "exact",
    head: true
  })), ...statuses.map((s) => scope(admin.from("leads").select("id", {
    count: "exact",
    head: true
  })).eq("status", s))]);
  const counts = {
    all: allRes.count ?? 0
  };
  statuses.forEach((s, i) => {
    counts[s] = perStatus[i]?.count ?? 0;
  });
  return {
    counts
  };
});
const AddLeadSchema = object({
  name: string().trim().min(2),
  email: string().trim().email(),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Mobile must be a 10-digit Indian number"),
  state: string().trim().min(2),
  district: string().trim().optional(),
  language: string().trim().min(2).default("en"),
  service: string().trim().min(2),
  lead_source: string().trim().default("manual"),
  base_amount: number().nonnegative().default(0),
  gst_amount: number().nonnegative().default(0),
  total_amount: number().nonnegative().default(0),
  notes: string().optional(),
  assigned_to: string().uuid().nullable().optional(),
  website_id: string().uuid().optional()
});
const addLead_createServerFn_handler = createServerRpc({
  id: "dd7725c6ee45b6eb20e71b48e9095a6feef3b9b04429dba5308a67bd37a667bb",
  name: "addLead",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => addLead.__executeServer(opts));
const addLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => AddLeadSchema.parse(i)).handler(addLead_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, LEAD_WRITE_ROLES);
  const admin = await getAdmin();
  const {
    data: existing
  } = await admin.from("customers").select("id").or(`primary_mobile.eq.${data.mobile},primary_email.eq.${data.email.toLowerCase()}`).maybeSingle();
  const isReturningCustomer = !!existing?.id;
  const {
    data: customerId,
    error: rpcErr
  } = await admin.rpc("find_or_create_customer", {
    p_name: data.name,
    p_email: data.email,
    p_mobile: data.mobile,
    p_state: data.state,
    p_language: data.language
  });
  if (rpcErr) throw new Error(rpcErr.message);
  const {
    notes,
    district,
    ...rest
  } = data;
  const composedNotes = [notes, district ? `District: ${district}` : null].filter(Boolean).join("\n") || null;
  let serviceId = null;
  let websiteId = data.website_id ?? null;
  if (rest.service) {
    let {
      data: svc
    } = await admin.from("services").select("id, website_id").eq("service_name", rest.service).maybeSingle();
    if (!svc) {
      const {
        data: svci
      } = await admin.from("services").select("id, website_id").ilike("service_name", rest.service.trim()).maybeSingle();
      svc = svci;
    }
    if (!svc) {
      const {
        data: svcc
      } = await admin.from("services").select("id, website_id").ilike("service_code", rest.service.trim()).maybeSingle();
      svc = svcc;
    }
    serviceId = svc?.id ?? null;
    if (!websiteId) websiteId = svc?.website_id ?? null;
  }
  if (!websiteId) {
    const {
      getDefaultWebsiteId
    } = await import("./default-website.server-BIcPmBN6.mjs");
    websiteId = await getDefaultWebsiteId().catch(() => null);
  }
  const {
    data: inserted,
    error
  } = await admin.from("leads").insert({
    ...rest,
    service_id: serviceId,
    website_id: websiteId,
    customer_id: customerId,
    notes: composedNotes,
    status: "new_lead",
    lead_status_v2: "new_lead"
  }).select("id, lead_code").single();
  if (error) throw new Error(error.message);
  if (!rest.assigned_to) {
    try {
      const {
        autoAssignLeadOrOrder
      } = await import("./auto-assign.server-D-MYRWKz.mjs");
      await autoAssignLeadOrOrder({
        leadId: inserted.id,
        serviceId
      });
    } catch (assignErr) {
      console.error("[addLead] Auto-assignment failed:", assignErr);
    }
  }
  const [{
    data: profile
  }, {
    data: roleRows
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", context.userId)]);
  const staff_name = profile?.display_name || profile?.email || "Staff";
  const staff_role = roleRows?.[0]?.role ?? "staff";
  await admin.from("application_events").insert({
    lead_id: inserted.id,
    customer_id: customerId,
    event_type: "lead_created",
    note: notes ?? null,
    new_value: "new_lead",
    created_by: context.userId,
    staff_name,
    staff_role
  });
  await writeAudit({
    supabase: context.supabase,
    entityType: "lead",
    entityId: inserted.id,
    action: "create_lead",
    oldValue: null,
    newValue: data,
    actorId: context.userId
  });
  return {
    id: inserted.id,
    lead_code: inserted.lead_code,
    isReturningCustomer
  };
});
const UpdateAssigneeSchema = object({
  leadId: string().uuid(),
  assignedTo: string().uuid().nullable()
});
const updateLeadAssignee_createServerFn_handler = createServerRpc({
  id: "9846c6ab10efb3dc263bff2994c13dd6c80f0613da6b7d2ebdbf5cb70b95ec11",
  name: "updateLeadAssignee",
  filename: "src/lib/crm/leads-admin.functions.ts"
}, (opts) => updateLeadAssignee.__executeServer(opts));
const updateLeadAssignee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpdateAssigneeSchema.parse(i)).handler(updateLeadAssignee_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "operations", "admin", "manager"]);
  const admin = await getAdmin();
  const {
    data: prev
  } = await admin.from("leads").select("assigned_to, customer_id, name, lead_code").eq("id", data.leadId).single();
  if (!prev) throw new Error("Lead not found");
  const {
    error
  } = await admin.from("leads").update({
    assigned_to: data.assignedTo
  }).eq("id", data.leadId);
  if (error) throw new Error(error.message);
  const [{
    data: profile
  }, {
    data: roleRows
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", context.userId)]);
  await admin.from("application_events").insert({
    lead_id: data.leadId,
    customer_id: prev.customer_id ?? null,
    event_type: "assignment_change",
    old_value: prev.assigned_to ?? null,
    new_value: data.assignedTo ?? null,
    created_by: context.userId,
    staff_name: profile?.display_name || profile?.email || "Staff",
    staff_role: roleRows?.[0]?.role ?? "staff"
  });
  if (data.assignedTo) {
    const {
      emitToUsers
    } = await import("./emit.server-OhKEr4hO.mjs");
    await emitToUsers([data.assignedTo], {
      kind: "order_assigned",
      title: "New Lead Assigned",
      body: `Lead ${prev.name || prev.lead_code || "New Lead"} has been assigned to your queue.`,
      href: `/admin/leads/${data.leadId}`,
      entityKind: "lead",
      entityId: data.leadId
    });
  }
  return {
    ok: true
  };
});
export {
  addLeadNote_createServerFn_handler,
  addLead_createServerFn_handler,
  changeLeadService_createServerFn_handler,
  findLeadByCodeOrId_createServerFn_handler,
  getLeadCounts_createServerFn_handler,
  getLeadSourceBreakdown_createServerFn_handler,
  getLead_createServerFn_handler,
  listAllHistoricalStaff_createServerFn_handler,
  listAssignmentStaff_createServerFn_handler,
  listLeads_createServerFn_handler,
  listStaff_createServerFn_handler,
  updateLeadAssignee_createServerFn_handler,
  updateLead_createServerFn_handler
};
