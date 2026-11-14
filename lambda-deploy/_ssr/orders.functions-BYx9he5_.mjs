import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, i as isUserAdmin, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, a as array } from "../_libs/zod.mjs";
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
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
function rollupPaymentStatus(payments, total) {
  if (!payments.length) return "Pending";
  const refunded = payments.filter((p) => p.status === "refunded");
  if (refunded.length && payments.every((p) => p.status === "refunded")) return "Refunded";
  const paid = payments.filter((p) => p.status === "paid" || p.status === "success" || p.status === "successful");
  const paidSum = paid.reduce((s, p) => s + Number(p.amount || 0), 0);
  if (paidSum <= 0) {
    if (payments.some((p) => p.status === "cancelled" || p.status === "failed")) return "Cancelled";
    return "Pending";
  }
  if (total > 0 && paidSum < total - 0.01) return "Partially Paid";
  return "Paid";
}
const listOrders_createServerFn_handler = createServerRpc({
  id: "da04f7605b8d75776e008917b637993f670a179601f8bb45bbbb2a61b081fa31",
  name: "listOrders",
  filename: "src/lib/crm/orders.functions.ts"
}, (opts) => listOrders.__executeServer(opts));
const listOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(25),
  status: string().optional(),
  paymentStatus: string().optional(),
  search: string().max(120).optional(),
  assignedTo: string().uuid().optional()
}).parse(i ?? {})).handler(listOrders_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "operations", "admin", "support", "accounts"]);
  const admin = await getAdmin();
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  let q = admin.from("applications").select("id, application_code, application_status, created_at, assigned_to, lead_id", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  });
  if (data.status) q = q.eq("application_status", data.status);
  if (!isAdmin) {
    q = q.eq("assigned_to", context.userId);
  } else if (data.assignedTo) {
    q = q.eq("assigned_to", data.assignedTo);
  }
  const {
    data: apps,
    count,
    error
  } = await q.range((data.page - 1) * data.pageSize, data.page * data.pageSize - 1);
  if (error) throw new Error(error.message);
  const appList = apps ?? [];
  const leadIds = Array.from(new Set(appList.map((a) => a.lead_id).filter(Boolean)));
  const appIds = appList.map((a) => a.id);
  const staffIds = Array.from(new Set(appList.map((a) => a.assigned_to).filter(Boolean)));
  const [leadsRes, paymentsRes, staffRes] = await Promise.all([leadIds.length ? admin.from("leads").select("id, name, email, mobile, service, total_amount, lead_code").in("id", leadIds) : Promise.resolve({
    data: []
  }), appIds.length ? admin.from("payments").select("application_id, status, amount").in("application_id", appIds) : Promise.resolve({
    data: []
  }), staffIds.length ? admin.from("profiles").select("id, display_name, email").in("id", staffIds) : Promise.resolve({
    data: []
  })]);
  const leadMap = new Map((leadsRes.data ?? []).map((l) => [l.id, l]));
  const staffMap = new Map((staffRes.data ?? []).map((s) => [s.id, s]));
  const payByApp = /* @__PURE__ */ new Map();
  for (const p of paymentsRes.data ?? []) {
    const arr = payByApp.get(p.application_id) ?? [];
    arr.push({
      status: p.status,
      amount: Number(p.amount || 0)
    });
    payByApp.set(p.application_id, arr);
  }
  let rows = appList.map((a) => {
    const lead = leadMap.get(a.lead_id);
    const payments = payByApp.get(a.id) ?? [];
    const paidSum = payments.filter((p) => ["paid", "success", "successful"].includes(String(p.status))).reduce((s, p) => s + Number(p.amount || 0), 0);
    const total = paidSum > 0 ? paidSum : Number(lead?.total_amount || 0);
    const staff = a.assigned_to ? staffMap.get(a.assigned_to) : null;
    return {
      id: a.id,
      application_code: a.application_code,
      application_status: a.application_status,
      created_at: a.created_at,
      lead_id: a.lead_id,
      customer_name: lead?.name ?? "—",
      customer_email: lead?.email ?? null,
      customer_mobile: lead?.mobile ?? null,
      service: lead?.service ?? null,
      total,
      payment_status: rollupPaymentStatus(payments, total),
      assigned_to: a.assigned_to,
      assigned_name: staff?.display_name ?? staff?.email ?? null
    };
  });
  if (data.paymentStatus) rows = rows.filter((r) => r.payment_status === data.paymentStatus);
  if (data.search) {
    const s = data.search.toLowerCase();
    rows = rows.filter((r) => r.application_code?.toLowerCase().includes(s) || r.customer_name?.toLowerCase().includes(s) || r.customer_email?.toLowerCase().includes(s) || r.customer_mobile?.includes(s));
  }
  return {
    rows,
    total: count ?? 0
  };
});
const getOrderDetail_createServerFn_handler = createServerRpc({
  id: "64ae407a1e5233c74d20c6bdaf32e0824eaf0f950b6414e7d8a6d718fe3245be",
  name: "getOrderDetail",
  filename: "src/lib/crm/orders.functions.ts"
}, (opts) => getOrderDetail.__executeServer(opts));
const getOrderDetail = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(getOrderDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "operations", "admin", "support", "accounts"]);
  const admin = await getAdmin();
  const {
    data: app,
    error
  } = await admin.from("applications").select("*, lead:leads(*), certificates(*)").eq("id", data.applicationId).single();
  if (error || !app) throw new Error("Order not found");
  const [paymentsRes, complaintsRes, emailsRes, staffRes] = await Promise.all([admin.from("payments").select("id, status, amount, base_amount, gst_amount, gateway_name, transaction_id, payment_date, created_at").eq("application_id", data.applicationId).order("created_at", {
    ascending: false
  }), admin.from("complaints").select("id, complaint_number, status, severity, category, created_at, sla_due_at").eq("application_id", data.applicationId).order("created_at", {
    ascending: false
  }), admin.from("email_logs").select("id, template_code, subject, status, created_at").eq("lead_id", app.lead_id).ilike("template_code", "%welcome%").order("created_at", {
    ascending: false
  }).limit(1), app.assigned_to ? admin.from("profiles").select("id, display_name, email").eq("id", app.assigned_to).maybeSingle() : Promise.resolve({
    data: null
  })]);
  const payments = paymentsRes.data ?? [];
  const lead = app.lead;
  const total = Number(lead?.total_amount || 0);
  const paymentStatus = rollupPaymentStatus(payments.map((p) => ({
    status: p.status,
    amount: Number(p.amount)
  })), total);
  const firstPaid = [...payments].reverse().find((p) => ["paid", "success", "successful"].includes(String(p.status)));
  const journey = {
    created_at: app.created_at,
    payment_received_at: firstPaid?.payment_date ?? firstPaid?.created_at ?? null,
    info_submitted_at: ["submitted", "completed", "approved"].includes(String(app.form_status)) ? app.updated_at : null,
    welcome_mail_at: emailsRes.data?.[0]?.created_at ?? null,
    expert_allocated_at: app.assigned_to ? app.updated_at : null,
    completed_at: app.application_status === "completed" ? app.updated_at : null
  };
  return {
    application: app,
    lead,
    certificates: app.certificates ?? [],
    payments,
    paymentStatus,
    total,
    complaints: complaintsRes.data ?? [],
    assignedStaff: staffRes.data ?? null,
    journey
  };
});
const getOrderNotes_createServerFn_handler = createServerRpc({
  id: "398e0d96e203242f9cabb83e9eac3c7532f0d2eea7a160c86b4de72db491ecd3",
  name: "getOrderNotes",
  filename: "src/lib/crm/orders.functions.ts"
}, (opts) => getOrderNotes.__executeServer(opts));
const getOrderNotes = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(getOrderNotes_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "operations", "admin", "support", "accounts"]);
  const admin = await getAdmin();
  const {
    data: app
  } = await admin.from("applications").select("lead_id").eq("id", data.applicationId).single();
  if (!app) return {
    items: []
  };
  const [actsRes, notesRes] = await Promise.all([admin.from("activity_logs").select("id, activity_type, activity_description, user_id, created_at").eq("application_id", data.applicationId).order("created_at", {
    ascending: false
  }).limit(200), admin.from("lead_notes").select("id, note, user_id, created_at").eq("lead_id", app.lead_id).order("created_at", {
    ascending: false
  }).limit(200)]);
  const userIds = Array.from(/* @__PURE__ */ new Set([...(actsRes.data ?? []).map((a) => a.user_id).filter(Boolean), ...(notesRes.data ?? []).map((n) => n.user_id).filter(Boolean)]));
  const {
    data: profiles
  } = userIds.length ? await admin.from("profiles").select("id, display_name, email").in("id", userIds) : {
    data: []
  };
  const pmap = new Map((profiles ?? []).map((p) => [p.id, p.display_name ?? p.email ?? "Staff"]));
  const items = [...(actsRes.data ?? []).map((a) => ({
    id: `a-${a.id}`,
    kind: "auto",
    at: a.created_at,
    author: a.user_id ? pmap.get(a.user_id) ?? "System" : "System",
    text: a.activity_description,
    type: a.activity_type
  })), ...(notesRes.data ?? []).map((n) => ({
    id: `n-${n.id}`,
    kind: "manual",
    at: n.created_at,
    author: n.user_id ? pmap.get(n.user_id) ?? "Staff" : "Staff",
    text: n.note,
    type: "note"
  }))].sort((a, b) => a.at < b.at ? 1 : -1);
  return {
    items
  };
});
const addOrderNote_createServerFn_handler = createServerRpc({
  id: "70599394c8c56d39dde4c378981899313a160cfe44b83594118b1e148e43290b",
  name: "addOrderNote",
  filename: "src/lib/crm/orders.functions.ts"
}, (opts) => addOrderNote.__executeServer(opts));
const addOrderNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid(),
  note: string().trim().min(1).max(2e3)
}).parse(i)).handler(addOrderNote_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "operations", "admin", "support", "accounts"]);
  const admin = await getAdmin();
  const {
    data: app,
    error: appErr
  } = await admin.from("applications").select("lead_id").eq("id", data.applicationId).single();
  if (appErr || !app) throw new Error("Order not found");
  const {
    error
  } = await admin.from("lead_notes").insert({
    lead_id: app.lead_id,
    user_id: context.userId,
    note: data.note
  });
  if (error) throw new Error(error.message);
  await writeAudit({
    supabase: context.supabase,
    entityType: "application",
    entityId: data.applicationId,
    action: "note_added",
    newValue: {
      note: data.note
    },
    actorId: context.userId
  });
  return {
    ok: true
  };
});
const BulkAssignInput = object({
  applicationIds: array(string().uuid()).min(1),
  assignedTo: string().uuid().nullable()
});
const bulkAssignOrders_createServerFn_handler = createServerRpc({
  id: "33fa09ec64b82a5b2724c5ab6baf7bd8de0c4e0ca64d10803f3aea8437be610e",
  name: "bulkAssignOrders",
  filename: "src/lib/crm/orders.functions.ts"
}, (opts) => bulkAssignOrders.__executeServer(opts));
const bulkAssignOrders = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => BulkAssignInput.parse(i)).handler(bulkAssignOrders_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "manager"]);
  const {
    assignOrderCanonical
  } = await import("./assignment-engine.server--SlhbLzd.mjs");
  for (const orderId of data.applicationIds) {
    await assignOrderCanonical({
      orderId,
      newEmployeeId: data.assignedTo,
      changeType: "MANUAL_BULK",
      reason: `Bulk reassigned by operator (${data.applicationIds.length} orders in batch)`,
      source: "admin",
      actorId: context.userId,
      skipNotification: true
      // We emit one batch notification below
    });
  }
  if (data.assignedTo) {
    try {
      const {
        emitToUsers
      } = await import("./emit.server-OhKEr4hO.mjs");
      await emitToUsers([data.assignedTo], {
        kind: "order_assigned",
        title: "🎯 Orders Assigned to You",
        body: `${data.applicationIds.length} order(s) have been assigned to your queue.`,
        href: "/admin/orders",
        entityKind: "application",
        entityId: data.applicationIds[0]
      });
    } catch (notifErr) {
      console.warn("[bulkAssignOrders] Failed to emit notification:", notifErr);
    }
  }
  return {
    ok: true,
    count: data.applicationIds.length
  };
});
export {
  addOrderNote_createServerFn_handler,
  bulkAssignOrders_createServerFn_handler,
  getOrderDetail_createServerFn_handler,
  getOrderNotes_createServerFn_handler,
  listOrders_createServerFn_handler
};
