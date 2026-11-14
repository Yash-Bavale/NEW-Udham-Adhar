import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number } from "../_libs/zod.mjs";
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
async function assertFinance(admin, userId) {
  const {
    data: roles
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const ok = (roles ?? []).some((r) => ["super_admin", "admin", "finance", "accounts", "manager"].includes(r.role));
  if (!ok) throw new Error("Forbidden");
}
async function assertAdmin(admin, userId) {
  const {
    data: roles
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const ok = (roles ?? []).some((r) => ["super_admin", "admin"].includes(r.role));
  if (!ok) throw new Error("Forbidden");
}
function dayBounds(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const fromUtc = new Date(Date.UTC(y, m - 1, d, -5, -30));
  const toUtc = new Date(Date.UTC(y, m - 1, d + 1, -5, -30));
  return {
    from: fromUtc.toISOString(),
    to: toUtc.toISOString()
  };
}
function monthBounds(monthStr) {
  const [y, m] = monthStr.split("-").map(Number);
  const fromUtc = new Date(Date.UTC(y, m - 1, 1, -5, -30));
  const toUtc = new Date(Date.UTC(y, m, 1, -5, -30));
  return {
    from: fromUtc.toISOString(),
    to: toUtc.toISOString()
  };
}
const getDailyReport_createServerFn_handler = createServerRpc({
  id: "6f604ae370005824cf7df12f962d0123c2ef10434d597db0e6341ff48570a720",
  name: "getDailyReport",
  filename: "src/lib/crm/reports.functions.ts"
}, (opts) => getDailyReport.__executeServer(opts));
const getDailyReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  date: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(i)).handler(getDailyReport_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    from,
    to
  } = dayBounds(data.date);
  const [leadsRes, ordersRes, paymentsRes, pendingRes] = await Promise.all([admin.from("leads").select("id, lead_code, name, mobile, service, lead_status_v2, created_at").gte("created_at", from).lt("created_at", to).order("created_at", {
    ascending: false
  }), admin.from("applications").select("id, application_code, service_name, fulfillment_status, created_at, customer_id, customers(name)").gte("created_at", from).lt("created_at", to).order("created_at", {
    ascending: false
  }), admin.from("payments").select("id, amount, status, created_at, lead_id, leads(name, lead_code)").eq("status", "paid").gte("created_at", from).lt("created_at", to).order("created_at", {
    ascending: false
  }), admin.from("applications").select("id, application_code, service_name, fulfillment_status, created_at, customers(name)").not("fulfillment_status", "in", "(completed,cancelled,refunded)").order("created_at", {
    ascending: false
  }).limit(100)]);
  const revenue = (paymentsRes.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0);
  return {
    counts: {
      leads: (leadsRes.data ?? []).length,
      orders: (ordersRes.data ?? []).length,
      revenue,
      pending: (pendingRes.data ?? []).length
    },
    leads: leadsRes.data ?? [],
    orders: ordersRes.data ?? [],
    payments: paymentsRes.data ?? [],
    pending: pendingRes.data ?? []
  };
});
const getMonthlyReport_createServerFn_handler = createServerRpc({
  id: "0f0aede5fde78ba31eb70dc9a300dd72476ee819f62ff6349f9eceabc59c03b2",
  name: "getMonthlyReport",
  filename: "src/lib/crm/reports.functions.ts"
}, (opts) => getMonthlyReport.__executeServer(opts));
const getMonthlyReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  month: string().regex(/^\d{4}-\d{2}$/)
}).parse(i)).handler(getMonthlyReport_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    from,
    to
  } = monthBounds(data.month);
  const [paymentsRes, leadsRes, ordersRes, profilesRes] = await Promise.all([admin.from("payments").select("amount, status, created_at, lead_id, leads(service)").eq("status", "paid").gte("created_at", from).lt("created_at", to), admin.from("leads").select("id, lead_status_v2, created_at").gte("created_at", from).lt("created_at", to), admin.from("applications").select("id, fulfillment_status, assigned_to, service_name, created_at").gte("created_at", from).lt("created_at", to), admin.from("profiles").select("id, full_name, display_name, email")]);
  const byService = /* @__PURE__ */ new Map();
  (paymentsRes.data ?? []).forEach((p) => {
    const svc = p.leads?.service ?? "Unknown";
    const cur = byService.get(svc) ?? {
      revenue: 0,
      count: 0
    };
    cur.revenue += Number(p.amount ?? 0);
    cur.count += 1;
    byService.set(svc, cur);
  });
  const totalLeads = (leadsRes.data ?? []).length;
  const convertedLeads = (leadsRes.data ?? []).filter((l) => ["payment_successful", "details_pending", "documents_pending", "under_review", "under_process", "completed"].includes(l.lead_status_v2 ?? "")).length;
  const conversionRate = totalLeads > 0 ? Math.round(convertedLeads / totalLeads * 1e3) / 10 : 0;
  const profileMap = /* @__PURE__ */ new Map();
  (profilesRes.data ?? []).forEach((p) => profileMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff"));
  const staffMap = /* @__PURE__ */ new Map();
  (ordersRes.data ?? []).forEach((o) => {
    if (!o.assigned_to) return;
    const cur = staffMap.get(o.assigned_to) ?? {
      assigned: 0,
      completed: 0,
      pending: 0
    };
    cur.assigned += 1;
    if (o.fulfillment_status === "completed") cur.completed += 1;
    else cur.pending += 1;
    staffMap.set(o.assigned_to, cur);
  });
  return {
    serviceRevenue: [...byService.entries()].map(([service, v]) => ({
      service,
      ...v
    })).sort((a, b) => b.revenue - a.revenue),
    conversion: {
      totalLeads,
      convertedLeads,
      conversionRate
    },
    totalRevenue: (paymentsRes.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0),
    staffPerformance: [...staffMap.entries()].map(([userId, v]) => ({
      user_id: userId,
      name: profileMap.get(userId) ?? "Unknown",
      ...v
    })).sort((a, b) => b.assigned - a.assigned)
  };
});
const getFinanceReport_createServerFn_handler = createServerRpc({
  id: "9bb41a1d650a9b2d7e3d6f466b34e28587533984bbc075a247e50cedf6a73acb",
  name: "getFinanceReport",
  filename: "src/lib/crm/reports.functions.ts"
}, (opts) => getFinanceReport.__executeServer(opts));
const getFinanceReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  from: string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(i)).handler(getFinanceReport_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  await assertFinance(admin, context.userId);
  const {
    from
  } = dayBounds(data.from);
  const {
    to
  } = dayBounds(data.to);
  const [paymentsRes, invoicesRes, refundsRes, pendingRes] = await Promise.all([admin.from("payments").select("id, amount, status, created_at, lead_id").eq("status", "paid").gte("created_at", from).lt("created_at", to), admin.from("invoices").select("id, invoice_number, base_amount, gst_amount, cgst_amount, sgst_amount, igst_amount, total_amount, issued_at").gte("issued_at", from).lt("issued_at", to), admin.from("payments").select("id, amount, status, created_at, lead_id, leads(name, lead_code)").eq("status", "refunded").gte("created_at", from).lt("created_at", to).order("created_at", {
    ascending: false
  }), admin.from("payments").select("id, amount, status, created_at, lead_id, leads(name, lead_code)").in("status", ["created", "attempted"]).gte("created_at", from).lt("created_at", to).order("created_at", {
    ascending: false
  })]);
  const revenue = (paymentsRes.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0);
  let cgst = 0, sgst = 0, igst = 0, base = 0;
  (invoicesRes.data ?? []).forEach((i) => {
    base += Number(i.base_amount ?? 0);
    let c = Number(i.cgst_amount ?? 0);
    let s = Number(i.sgst_amount ?? 0);
    let ig = Number(i.igst_amount ?? 0);
    if (c === 0 && s === 0 && ig === 0) {
      const g = Number(i.gst_amount ?? 0);
      c = g / 2;
      s = g / 2;
    }
    cgst += c;
    sgst += s;
    igst += ig;
  });
  const refundTotal = (refundsRes.data ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const pendingTotal = (pendingRes.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0);
  return {
    revenue,
    gst: {
      base,
      cgst,
      sgst,
      igst,
      total: cgst + sgst + igst
    },
    refunds: {
      total: refundTotal,
      count: (refundsRes.data ?? []).length,
      rows: refundsRes.data ?? []
    },
    pending: {
      total: pendingTotal,
      count: (pendingRes.data ?? []).length,
      rows: pendingRes.data ?? []
    }
  };
});
const listAuditLog_createServerFn_handler = createServerRpc({
  id: "ab44d51e25f84e10cd4513a24068b08803d793165397a24448b0ef62ed9ac300",
  name: "listAuditLog",
  filename: "src/lib/crm/reports.functions.ts"
}, (opts) => listAuditLog.__executeServer(opts));
const listAuditLog = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(25),
  staffId: string().uuid().optional(),
  tableName: string().max(80).optional(),
  from: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
}).parse(i ?? {})).handler(listAuditLog_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  await assertAdmin(admin, context.userId);
  const fromIdx = (data.page - 1) * data.pageSize;
  const toIdx = fromIdx + data.pageSize - 1;
  let q = admin.from("audit_log").select("id, table_name, record_id, action, changed_by, changed_by_name, changed_by_role, changed_fields, old_data, new_data, created_at", {
    count: "exact"
  }).order("created_at", {
    ascending: false
  }).range(fromIdx, toIdx);
  if (data.staffId) q = q.eq("changed_by", data.staffId);
  if (data.tableName) q = q.eq("table_name", data.tableName);
  if (data.from) q = q.gte("created_at", dayBounds(data.from).from);
  if (data.to) q = q.lt("created_at", dayBounds(data.to).to);
  const {
    data: rows,
    error,
    count
  } = await q;
  if (error) throw new Error(error.message);
  const {
    data: tables
  } = await admin.from("audit_log").select("table_name").order("table_name", {
    ascending: true
  }).limit(1e3);
  const tableNames = Array.from(new Set((tables ?? []).map((t) => t.table_name))).sort();
  return {
    rows: rows ?? [],
    total: count ?? 0,
    page: data.page,
    pageSize: data.pageSize,
    tableNames
  };
});
export {
  getDailyReport_createServerFn_handler,
  getFinanceReport_createServerFn_handler,
  getMonthlyReport_createServerFn_handler,
  listAuditLog_createServerFn_handler
};
