import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import { f as formatIST } from "./datetime-DvkGwlJs.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, s as string, n as number, _ as _enum, a as array } from "../_libs/zod.mjs";
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
const API_PAGE_SIZE = 1e3;
async function fetchAllPaged(build, maxRows = 2e5) {
  const out = [];
  for (let from = 0; from < maxRows; from += API_PAGE_SIZE) {
    const {
      data,
      error
    } = await build().range(from, from + API_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    out.push(...rows);
    if (rows.length < API_PAGE_SIZE) break;
  }
  return out;
}
const FINANCE_ROLES = ["super_admin", "admin", "finance", "accounts"];
const IST_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function istWeekday(d) {
  const s = d.toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short"
  });
  const i = IST_WEEKDAYS.indexOf(s);
  return i < 0 ? d.getUTCDay() : i;
}
function resolveRangeDates(preset, fromIso, toIso) {
  const now = /* @__PURE__ */ new Date();
  const istStartOfDay = (d) => {
    const s = new Date(d);
    const istStr = s.toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata"
    });
    const parts = istStr.split("/");
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month, day, 0, 0, 0) - 5.5 * 3600 * 1e3);
  };
  const todayStart = istStartOfDay(now);
  const msDay = 86400 * 1e3;
  let start;
  let end = now;
  let label = "Today";
  switch (preset) {
    case "today":
      start = todayStart;
      end = new Date(todayStart.getTime() + msDay - 1);
      label = "Today";
      break;
    case "yesterday":
      start = new Date(todayStart.getTime() - msDay);
      end = new Date(todayStart.getTime() - 1);
      label = "Yesterday";
      break;
    case "7d":
      start = new Date(todayStart.getTime() - 6 * msDay);
      label = "Last 7 Days";
      break;
    case "30d":
      start = new Date(todayStart.getTime() - 29 * msDay);
      label = "Last 30 Days";
      break;
    case "this_week": {
      const distanceToMon = (istWeekday(now) + 6) % 7;
      start = new Date(todayStart.getTime() - distanceToMon * msDay);
      label = "This Week";
      break;
    }
    case "last_week": {
      const distanceToMon = (istWeekday(now) + 6) % 7;
      const thisMon = new Date(todayStart.getTime() - distanceToMon * msDay);
      start = new Date(thisMon.getTime() - 7 * msDay);
      end = new Date(thisMon.getTime() - 1);
      label = "Last Week";
      break;
    }
    case "this_month": {
      const istMonthStr = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });
      const parts = istMonthStr.split("/");
      const month = parseInt(parts[0], 10) - 1;
      const year = parseInt(parts[2], 10);
      start = new Date(Date.UTC(year, month, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      label = "This Month";
      break;
    }
    case "last_month": {
      const istMonthStr = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });
      const parts = istMonthStr.split("/");
      let month = parseInt(parts[0], 10) - 1 - 1;
      let year = parseInt(parts[2], 10);
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      start = new Date(Date.UTC(year, month, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      const nextMonth = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      end = new Date(nextMonth.getTime() - 1);
      label = "Last Month";
      break;
    }
    case "this_fy": {
      const istStr = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });
      const parts = istStr.split("/");
      const month = parseInt(parts[0], 10) - 1;
      const year = parseInt(parts[2], 10);
      const fyStartYear = month >= 3 ? year : year - 1;
      start = new Date(Date.UTC(fyStartYear, 3, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      label = `FY ${fyStartYear}-${(fyStartYear + 1).toString().slice(-2)}`;
      break;
    }
    case "custom":
      start = fromIso ? new Date(fromIso) : todayStart;
      end = toIso ? new Date(toIso) : now;
      label = "Custom Range";
      break;
    default:
      start = todayStart;
  }
  const durationMs = end.getTime() - start.getTime() + 1;
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs + 1);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    prevStartIso: prevStart.toISOString(),
    prevEndIso: prevEnd.toISOString(),
    label,
    durationMs
  };
}
const REVENUE_CACHE = /* @__PURE__ */ new Map();
const REVENUE_CACHE_TTL_MS = 6e4;
const FilterSchema = object({
  preset: _enum(["today", "yesterday", "7d", "30d", "this_week", "last_week", "this_month", "last_month", "this_fy", "custom"]).default("today"),
  fromIso: string().optional(),
  toIso: string().optional(),
  gateway: string().optional(),
  service: string().optional(),
  status: string().optional(),
  paymentMethod: string().optional(),
  minAmount: number().optional(),
  maxAmount: number().optional(),
  search: string().optional(),
  forceRefresh: boolean().optional()
});
const getRevenueOverview_createServerFn_handler = createServerRpc({
  id: "1dd01761d6106c37dc7defe795e7b9cddf327446eefff3c888ab4075f32b9021",
  name: "getRevenueOverview",
  filename: "src/lib/crm/revenue-admin.functions.ts"
}, (opts) => getRevenueOverview.__executeServer(opts));
const getRevenueOverview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => FilterSchema.parse(i ?? {})).handler(getRevenueOverview_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, FINANCE_ROLES);
  const cacheKey = JSON.stringify({
    preset: data.preset,
    fromIso: data.fromIso,
    toIso: data.toIso,
    gateway: data.gateway,
    service: data.service,
    status: data.status,
    paymentMethod: data.paymentMethod
  });
  if (!data.forceRefresh && REVENUE_CACHE.has(cacheKey)) {
    const cached = REVENUE_CACHE.get(cacheKey);
    if (Date.now() - cached.cachedAt < REVENUE_CACHE_TTL_MS) {
      return {
        ...cached.data,
        isCached: true,
        cachedAt: new Date(cached.cachedAt).toISOString()
      };
    }
  }
  const admin = await getAdmin();
  const r = resolveRangeDates(data.preset, data.fromIso, data.toIso);
  const applyPaymentFilters = (q) => {
    if (data.gateway) q = q.ilike("gateway_name", `%${data.gateway}%`);
    if (data.status) q = q.eq("status", data.status);
    if (data.paymentMethod) q = q.ilike("payu_mode", `%${data.paymentMethod}%`);
    return q;
  };
  const activePayments = await fetchAllPaged(() => applyPaymentFilters(admin.from("payments").select("id, lead_id, application_id, amount, base_amount, gst_amount, gateway_name, payu_mode, status, payment_date, created_at, leads:lead_id (service)").or(`and(payment_date.gte.${r.startIso},payment_date.lte.${r.endIso}),and(payment_date.is.null,created_at.gte.${r.startIso},created_at.lte.${r.endIso})`).order("created_at", {
    ascending: true
  })));
  const prevPayments = await fetchAllPaged(() => applyPaymentFilters(admin.from("payments").select("id, amount, status, created_at").or(`and(payment_date.gte.${r.prevStartIso},payment_date.lte.${r.prevEndIso}),and(payment_date.is.null,created_at.gte.${r.prevStartIso},created_at.lte.${r.prevEndIso})`).order("created_at", {
    ascending: true
  })));
  const activeRefunds = await fetchAllPaged(() => admin.from("refund_requests").select("id, refund_amount, status, created_at").eq("status", "approved").gte("created_at", r.startIso).lte("created_at", r.endIso).order("created_at", {
    ascending: true
  }));
  const prevRefunds = await fetchAllPaged(() => admin.from("refund_requests").select("id, refund_amount, status, created_at").eq("status", "approved").gte("created_at", r.prevStartIso).lte("created_at", r.prevEndIso).order("created_at", {
    ascending: true
  }));
  const paidRows = (activePayments ?? []).filter((p) => p.status === "paid");
  const failedRows = (activePayments ?? []).filter((p) => p.status === "failed" || p.status === "attempted");
  const pendingRows = (activePayments ?? []).filter((p) => p.status === "created");
  const grossRevenue = paidRows.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const grossBase = paidRows.reduce((sum, p) => sum + Number(p.base_amount ?? 0), 0);
  const grossGst = paidRows.reduce((sum, p) => sum + Number(p.gst_amount ?? 0), 0);
  const refundedAmount = (activeRefunds ?? []).reduce((sum, rf) => sum + Number(rf.refund_amount ?? 0), 0);
  const refundsCount = activeRefunds?.length ?? 0;
  const netRevenue = Math.max(0, grossRevenue - refundedAmount);
  const successfulPaymentsCount = paidRows.length;
  const failedPaymentsCount = failedRows.length;
  const failedPaymentsAmount = failedRows.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const pendingPaymentsCount = pendingRows.length;
  const pendingPaymentsAmount = pendingRows.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const totalAttempts = (activePayments ?? []).length;
  const paymentSuccessRate = totalAttempts > 0 ? successfulPaymentsCount / totalAttempts * 100 : 0;
  const averageOrderValue = successfulPaymentsCount > 0 ? Math.round(grossRevenue / successfulPaymentsCount) : 0;
  const prevPaidRows = (prevPayments ?? []).filter((p) => p.status === "paid");
  const grossRevenuePrev = prevPaidRows.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const refundedAmountPrev = (prevRefunds ?? []).reduce((sum, rf) => sum + Number(rf.refund_amount ?? 0), 0);
  const netRevenuePrev = Math.max(0, grossRevenuePrev - refundedAmountPrev);
  const successfulPaymentsCountPrev = prevPaidRows.length;
  const averageOrderValuePrev = successfulPaymentsCountPrev > 0 ? Math.round(grossRevenuePrev / successfulPaymentsCountPrev) : 0;
  const totalAttemptsPrev = (prevPayments ?? []).length;
  const paymentSuccessRatePrev = totalAttemptsPrev > 0 ? successfulPaymentsCountPrev / totalAttemptsPrev * 100 : 0;
  const gatewayMap = /* @__PURE__ */ new Map();
  for (const p of activePayments ?? []) {
    const gw = (p.gateway_name || "payu").toLowerCase().trim();
    const cur = gatewayMap.get(gw) ?? {
      name: gw.toUpperCase(),
      totalAttempts: 0,
      successfulCount: 0,
      failedCount: 0,
      pendingCount: 0,
      grossRevenue: 0,
      refundedAmount: 0,
      netRevenue: 0
    };
    cur.totalAttempts += 1;
    if (p.status === "paid") {
      cur.successfulCount += 1;
      cur.grossRevenue += Number(p.amount ?? 0);
    } else if (p.status === "failed" || p.status === "attempted") {
      cur.failedCount += 1;
    } else if (p.status === "created") {
      cur.pendingCount += 1;
    }
    cur.netRevenue = cur.grossRevenue;
    gatewayMap.set(gw, cur);
  }
  const gateways = Array.from(gatewayMap.values()).map((g) => ({
    ...g,
    successRate: g.totalAttempts > 0 ? Math.round(g.successfulCount / g.totalAttempts * 1e3) / 10 : 0,
    avgTransactionValue: g.successfulCount > 0 ? Math.round(g.grossRevenue / g.successfulCount) : 0
  })).sort((a, b) => b.grossRevenue - a.grossRevenue);
  const serviceMap = /* @__PURE__ */ new Map();
  for (const p of paidRows) {
    const svc = p.leads?.service || "Other Consultancy";
    const cur = serviceMap.get(svc) ?? {
      serviceName: svc,
      paidOrders: 0,
      grossRevenue: 0
    };
    cur.paidOrders += 1;
    cur.grossRevenue += Number(p.amount ?? 0);
    serviceMap.set(svc, cur);
  }
  const services = Array.from(serviceMap.values()).map((s) => ({
    ...s,
    refunds: 0,
    netRevenue: s.grossRevenue,
    avgOrderValue: s.paidOrders > 0 ? Math.round(s.grossRevenue / s.paidOrders) : 0,
    pctTotal: grossRevenue > 0 ? Math.round(s.grossRevenue / grossRevenue * 1e3) / 10 : 0
  })).sort((a, b) => b.grossRevenue - a.grossRevenue);
  const trendPoints = [];
  const isShortRange = r.durationMs <= 2 * 86400 * 1e3;
  const getISTKey = (dt) => dt.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata"
  });
  const getISTLabel = (dt) => dt.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short"
  });
  if (isShortRange) {
    const hourBuckets = /* @__PURE__ */ new Map();
    for (let h = 0; h < 24; h++) {
      const d = new Date(2026, 0, 1, h, 0, 0);
      const label = d.toLocaleString("en-IN", {
        hour: "numeric",
        hour12: true
      });
      hourBuckets.set(h, {
        label,
        gross: 0,
        count: 0
      });
    }
    for (const p of paidRows) {
      const dt = new Date(p.payment_date ?? p.created_at);
      const hrStr = dt.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false
      });
      const hr = parseInt(hrStr, 10) % 24;
      const b = hourBuckets.get(hr);
      if (b) {
        b.gross += Number(p.amount ?? 0);
        b.count += 1;
      }
    }
    for (let h = 0; h < 24; h++) {
      const b = hourBuckets.get(h);
      trendPoints.push({
        label: b.label,
        timestamp: `${h}:00`,
        grossRevenue: b.gross,
        netRevenue: b.gross,
        count: b.count
      });
    }
  } else {
    const dayBuckets = /* @__PURE__ */ new Map();
    const startMs = new Date(r.startIso).getTime();
    const endMs = new Date(r.endIso).getTime();
    const msDay = 86400 * 1e3;
    for (let currMs = startMs; currMs <= endMs + msDay / 2; currMs += msDay) {
      const d = new Date(currMs);
      const key = getISTKey(d);
      if (!dayBuckets.has(key)) {
        dayBuckets.set(key, {
          label: getISTLabel(d),
          timestamp: key,
          gross: 0,
          count: 0
        });
      }
    }
    for (const p of paidRows) {
      const dt = new Date(p.payment_date ?? p.created_at);
      const key = getISTKey(dt);
      const b = dayBuckets.get(key);
      if (b) {
        b.gross += Number(p.amount ?? 0);
        b.count += 1;
      }
    }
    dayBuckets.forEach((b) => {
      trendPoints.push({
        label: b.label,
        timestamp: b.timestamp,
        grossRevenue: b.gross,
        netRevenue: b.gross,
        count: b.count
      });
    });
  }
  const output = {
    range: {
      preset: data.preset,
      label: r.label,
      startIso: r.startIso,
      endIso: r.endIso
    },
    metrics: {
      grossRevenue,
      grossBase,
      grossGst,
      refundedAmount,
      refundsCount,
      netRevenue,
      successfulPaymentsCount,
      failedPaymentsCount,
      failedPaymentsAmount,
      pendingPaymentsCount,
      pendingPaymentsAmount,
      totalAttempts,
      averageOrderValue,
      paymentSuccessRate: Math.round(paymentSuccessRate * 10) / 10,
      // Comparative previous period metrics
      grossRevenuePrev,
      netRevenuePrev,
      successfulPaymentsCountPrev,
      averageOrderValuePrev,
      paymentSuccessRatePrev: Math.round(paymentSuccessRatePrev * 10) / 10
    },
    gateways,
    services,
    trends: trendPoints,
    isCached: false,
    cachedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  REVENUE_CACHE.set(cacheKey, {
    data: output,
    cachedAt: Date.now()
  });
  return output;
});
const LedgerSchema = object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(10).max(100).default(50),
  tab: _enum(["all", "successful", "pending", "failed", "refunded"]).default("all"),
  search: string().optional(),
  gateway: string().optional(),
  status: string().optional(),
  service: string().optional(),
  paymentMethod: string().optional(),
  minAmount: number().optional(),
  maxAmount: number().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
});
function paidDayFilter(from, to) {
  if (!from && !to) return null;
  const pd = [from && `payment_date.gte.${from}`, to && `payment_date.lte.${to}`].filter(Boolean);
  const cd = ["payment_date.is.null", from && `created_at.gte.${from}`, to && `created_at.lte.${to}`].filter(Boolean);
  return `and(${pd.join(",")}),and(${cd.join(",")})`;
}
const listPaymentLedger_createServerFn_handler = createServerRpc({
  id: "24ec6c1c5edfcedc81472bc9bc54c71af0b0731d2f3ad1e1eb0cd979e81cab47",
  name: "listPaymentLedger",
  filename: "src/lib/crm/revenue-admin.functions.ts"
}, (opts) => listPaymentLedger.__executeServer(opts));
const listPaymentLedger = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LedgerSchema.parse(i ?? {})).handler(listPaymentLedger_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, FINANCE_ROLES);
  const admin = await getAdmin();
  const fromIdx = (data.page - 1) * data.pageSize;
  const toIdx = fromIdx + data.pageSize - 1;
  let q = admin.from("payments").select(`
        id, lead_id, application_id, amount, base_amount, gst_amount, gateway_name, payu_mode, status, transaction_id, razorpay_order_id, razorpay_payment_id, payment_date, created_at,
        leads:lead_id (id, lead_code, name, email, mobile, service, state),
        applications:application_id (id, application_code, fulfillment_status),
        invoices!fk_invoices_payment (id, invoice_number, pdf_path)
      `, {
    count: "exact"
  }).order("created_at", {
    ascending: false
  });
  if (data.tab === "successful") q = q.eq("status", "paid");
  else if (data.tab === "pending") q = q.eq("status", "created");
  else if (data.tab === "failed") q = q.in("status", ["failed", "attempted"]);
  else if (data.tab === "refunded") q = q.eq("status", "refunded");
  else if (data.status) q = q.eq("status", data.status);
  if (data.gateway) q = q.ilike("gateway_name", `%${data.gateway}%`);
  if (data.paymentMethod) q = q.ilike("payu_mode", `%${data.paymentMethod}%`);
  if (data.minAmount !== void 0) q = q.gte("amount", data.minAmount);
  if (data.maxAmount !== void 0) q = q.lte("amount", data.maxAmount);
  const ledgerDay = paidDayFilter(data.dateFrom, data.dateTo);
  if (ledgerDay) q = q.or(ledgerDay);
  if (data.search) {
    const s = data.search.replace(/[,()]/g, " ").trim();
    q = q.or(`transaction_id.ilike.%${s}%,razorpay_order_id.ilike.%${s}%,razorpay_payment_id.ilike.%${s}%`);
  }
  q = q.range(fromIdx, toIdx);
  const {
    data: rows,
    count,
    error
  } = await q;
  if (error) throw new Error(error.message);
  let baseCountQ = admin.from("payments").select("id", {
    count: "exact",
    head: true
  });
  let qSuccess = admin.from("payments").select("id", {
    count: "exact",
    head: true
  }).eq("status", "paid");
  let qPending = admin.from("payments").select("id", {
    count: "exact",
    head: true
  }).eq("status", "created");
  let qFailed = admin.from("payments").select("id", {
    count: "exact",
    head: true
  }).in("status", ["failed", "attempted"]);
  let qRefunded = admin.from("payments").select("id", {
    count: "exact",
    head: true
  }).eq("status", "refunded");
  if (ledgerDay) {
    baseCountQ = baseCountQ.or(ledgerDay);
    qSuccess = qSuccess.or(ledgerDay);
    qPending = qPending.or(ledgerDay);
    qFailed = qFailed.or(ledgerDay);
    qRefunded = qRefunded.or(ledgerDay);
  }
  if (data.gateway) {
    baseCountQ = baseCountQ.ilike("gateway_name", `%${data.gateway}%`);
    qSuccess = qSuccess.ilike("gateway_name", `%${data.gateway}%`);
    qPending = qPending.ilike("gateway_name", `%${data.gateway}%`);
    qFailed = qFailed.ilike("gateway_name", `%${data.gateway}%`);
    qRefunded = qRefunded.ilike("gateway_name", `%${data.gateway}%`);
  }
  const [{
    count: countAll
  }, {
    count: countSuccess
  }, {
    count: countPending
  }, {
    count: countFailed
  }, {
    count: countRefunded
  }] = await Promise.all([baseCountQ, qSuccess, qPending, qFailed, qRefunded]);
  return {
    rows: rows ?? [],
    total: count ?? 0,
    page: data.page,
    pageSize: data.pageSize,
    tabCounts: {
      all: countAll ?? 0,
      successful: countSuccess ?? 0,
      pending: countPending ?? 0,
      failed: countFailed ?? 0,
      refunded: countRefunded ?? 0
    }
  };
});
const getTransactionDetail_createServerFn_handler = createServerRpc({
  id: "99ca93a2951d4255b26eae2e59eebc39fc70a61b461a703b5e8d3315e96cf01d",
  name: "getTransactionDetail",
  filename: "src/lib/crm/revenue-admin.functions.ts"
}, (opts) => getTransactionDetail.__executeServer(opts));
const getTransactionDetail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  paymentId: string().uuid()
}).parse(i)).handler(getTransactionDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, FINANCE_ROLES);
  const admin = await getAdmin();
  const {
    data: payment,
    error
  } = await admin.from("payments").select(`
        id, lead_id, application_id, amount, base_amount, gst_amount, gateway_name, payu_mode, status, transaction_id, razorpay_order_id, razorpay_payment_id, payment_date, created_at, raw_response, parent_payment_id,
        leads:lead_id (id, lead_code, name, email, mobile, state, service, assigned_to),
        applications:application_id (id, application_code, fulfillment_status, application_status, created_at),
        invoices!fk_invoices_payment (id, invoice_number, pdf_path, issued_at, last_emailed_at)
      `).eq("id", data.paymentId).single();
  if (error || !payment) throw new Error(error?.message ?? "Transaction not found");
  const {
    data: attempts
  } = await admin.from("payments").select("id, amount, gateway_name, status, transaction_id, created_at, payment_date").eq("lead_id", payment.lead_id).order("created_at", {
    ascending: true
  });
  const {
    data: refunds
  } = await admin.from("refund_requests").select("id, refund_amount, status, created_at, reason, decision_notes").eq("application_id", payment.application_id ?? "");
  return {
    payment,
    attempts: attempts ?? [],
    refunds: refunds ?? []
  };
});
const ExportSchema = object({
  format: _enum(["csv", "excel"]).default("csv"),
  scope: _enum(["filtered", "range", "all"]).default("filtered"),
  tab: _enum(["all", "successful", "pending", "failed", "refunded"]).default("all"),
  gateway: string().optional(),
  paymentMethod: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional(),
  minAmount: number().optional(),
  maxAmount: number().optional(),
  search: string().optional(),
  columns: array(string()).optional()
});
const exportRevenueTransactions_createServerFn_handler = createServerRpc({
  id: "5aebe7431208fb9825a6244bb07831f951b04a087118f7f7e6cd2d9a0987db79",
  name: "exportRevenueTransactions",
  filename: "src/lib/crm/revenue-admin.functions.ts"
}, (opts) => exportRevenueTransactions.__executeServer(opts));
const exportRevenueTransactions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ExportSchema.parse(i ?? {})).handler(exportRevenueTransactions_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, FINANCE_ROLES);
  const admin = await getAdmin();
  const buildExportQuery = () => {
    let q = admin.from("payments").select(`
          id, amount, base_amount, gst_amount, gateway_name, payu_mode, status, transaction_id, razorpay_payment_id, payment_date, created_at,
          leads:lead_id (lead_code, name, email, mobile, service, state),
          applications:application_id (application_code),
          invoices!fk_invoices_payment (invoice_number)
        `).order("created_at", {
      ascending: false
    });
    if (data.scope !== "all") {
      if (data.tab === "successful") q = q.eq("status", "paid");
      else if (data.tab === "pending") q = q.eq("status", "created");
      else if (data.tab === "failed") q = q.in("status", ["failed", "attempted"]);
      else if (data.tab === "refunded") q = q.eq("status", "refunded");
      if (data.gateway) q = q.ilike("gateway_name", `%${data.gateway}%`);
      if (data.paymentMethod) q = q.ilike("payu_mode", `%${data.paymentMethod}%`);
      const exportDay = paidDayFilter(data.dateFrom, data.dateTo);
      if (exportDay) q = q.or(exportDay);
      if (data.minAmount !== void 0) q = q.gte("amount", data.minAmount);
      if (data.maxAmount !== void 0) q = q.lte("amount", data.maxAmount);
      if (data.search) {
        const s = data.search.replace(/[,()]/g, " ").trim();
        q = q.or(`transaction_id.ilike.%${s}%,razorpay_payment_id.ilike.%${s}%`);
      }
    }
    return q;
  };
  const rows = await fetchAllPaged(buildExportQuery, 5e4);
  const ALL_COLS = {
    srNo: {
      label: "Sr. No.",
      val: (_, idx) => idx + 1
    },
    date: {
      label: "Date & Time (IST)",
      val: (r) => formatIST(r.payment_date || r.created_at)
    },
    txnId: {
      label: "Transaction ID",
      val: (r) => r.transaction_id || ""
    },
    orderCode: {
      label: "Order Code",
      val: (r) => r.applications?.application_code || r.leads?.lead_code || ""
    },
    customerName: {
      label: "Customer Name",
      val: (r) => r.leads?.name || ""
    },
    mobile: {
      label: "Mobile Number",
      val: (r) => r.leads?.mobile || ""
    },
    email: {
      label: "Email Address",
      val: (r) => r.leads?.email || ""
    },
    state: {
      label: "Customer State",
      val: (r) => r.leads?.state || ""
    },
    service: {
      label: "Service Name",
      val: (r) => r.leads?.service || ""
    },
    baseAmount: {
      label: "Base Amount (₹)",
      val: (r) => Number(r.base_amount ?? (r.amount * 0.8475).toFixed(2))
    },
    gstAmount: {
      label: "GST Amount 18% (₹)",
      val: (r) => Number(r.gst_amount ?? (r.amount * 0.1525).toFixed(2))
    },
    totalAmount: {
      label: "Total Amount (₹)",
      val: (r) => Number(r.amount ?? 0)
    },
    gateway: {
      label: "Payment Gateway",
      val: (r) => (r.gateway_name || "").toUpperCase()
    },
    method: {
      label: "Payment Method",
      val: (r) => r.payu_mode || r.payment_method || "Online"
    },
    status: {
      label: "Payment Status",
      val: (r) => r.status || ""
    },
    invoiceNo: {
      label: "Tax Invoice Number",
      val: (r) => r.invoices?.[0]?.invoice_number || ""
    },
    gatewayRef: {
      label: "Gateway Reference ID",
      val: (r) => r.razorpay_payment_id || ""
    }
  };
  const selectedColKeys = data.columns && data.columns.length > 0 ? data.columns.filter((k) => ALL_COLS[k]) : Object.keys(ALL_COLS);
  const headers = selectedColKeys.map((k) => ALL_COLS[k].label);
  const formattedRows = (rows ?? []).map((r, idx) => selectedColKeys.map((k) => ALL_COLS[k].val(r, idx)));
  const csvEscape = (v) => {
    if (v == null) return "";
    const s = String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csvContent = "\uFEFF" + [headers.map(csvEscape).join(","), ...formattedRows.map((r) => r.map(csvEscape).join(","))].join("\n");
  const escapeXml = (v) => {
    if (v == null) return "";
    return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  };
  const xmlHeader = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0F172A" ss:Pattern="Solid"/></Style>
  <Style ss:ID="Num"><NumberFormat ss:Format="#,##0.00"/></Style>
 </Styles>
 <Worksheet ss:Name="Revenue Transactions">
  <Table>`;
  const headerXml = `<Row ss:Height="24">${headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join("")}</Row>`;
  const bodyXml = formattedRows.map((r) => `<Row>${r.map((val) => typeof val === "number" ? `<Cell ss:StyleID="Num"><Data ss:Type="Number">${val}</Data></Cell>` : `<Cell><Data ss:Type="String">${escapeXml(val)}</Data></Cell>`).join("")}</Row>`).join("\n");
  const excelXmlContent = `${xmlHeader}
${headerXml}
${bodyXml}
</Table></Worksheet></Workbook>`;
  await writeAudit({
    supabase: context.supabase,
    entityType: "payment",
    entityId: `${(rows ?? []).length} payments`,
    action: "revenue.export",
    newValue: {
      count: rows?.length ?? 0,
      filter: data,
      ids: (rows ?? []).map((r) => r.id).slice(0, 50)
    },
    actorId: context.userId
  });
  return {
    csv: csvContent,
    excelXml: excelXmlContent,
    count: rows?.length ?? 0
  };
});
const DayWiseSchema = object({
  preset: _enum(["today", "yesterday", "7d", "30d", "this_week", "last_week", "this_month", "last_month", "this_fy", "custom"]).default("today"),
  fromIso: string().optional(),
  toIso: string().optional()
});
const exportDayWiseRevenue_createServerFn_handler = createServerRpc({
  id: "918d8aae65ebe20712bed437989b3f302e0625664bfa9df72ef042771c08d4bc",
  name: "exportDayWiseRevenue",
  filename: "src/lib/crm/revenue-admin.functions.ts"
}, (opts) => exportDayWiseRevenue.__executeServer(opts));
const exportDayWiseRevenue = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => DayWiseSchema.parse(i ?? {})).handler(exportDayWiseRevenue_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, FINANCE_ROLES);
  const admin = await getAdmin();
  const r = resolveRangeDates(data.preset, data.fromIso, data.toIso);
  const payments = await fetchAllPaged(() => admin.from("payments").select("id, amount, base_amount, gst_amount, gateway_name, status, payment_date, created_at").or(`and(payment_date.gte.${r.startIso},payment_date.lte.${r.endIso}),and(payment_date.is.null,created_at.gte.${r.startIso},created_at.lte.${r.endIso})`).order("created_at", {
    ascending: true
  }));
  const refunds = await fetchAllPaged(() => admin.from("refund_requests").select("id, refund_amount, status, created_at").eq("status", "approved").gte("created_at", r.startIso).lte("created_at", r.endIso).order("created_at", {
    ascending: true
  }));
  const key = (d) => d.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata"
  });
  const GWS = ["PAYU", "CASHFREE", "CCAVENUE", "RAZORPAY", "PHONEPE"];
  const days = /* @__PURE__ */ new Map();
  const blank = (k) => ({
    date: k,
    paid: 0,
    gross: 0,
    base: 0,
    gst: 0,
    refundCount: 0,
    refunded: 0,
    attempts: 0,
    failed: 0,
    gw: Object.fromEntries([...GWS, "OTHER"].map((g) => [g, 0]))
  });
  const msDay = 864e5;
  for (let t = new Date(r.startIso).getTime(); t <= new Date(r.endIso).getTime(); t += msDay) {
    const k = key(new Date(t));
    if (!days.has(k)) days.set(k, blank(k));
  }
  const endK = key(new Date(r.endIso));
  if (!days.has(endK)) days.set(endK, blank(endK));
  const get = (k) => {
    let d = days.get(k);
    if (!d) {
      d = blank(k);
      days.set(k, d);
    }
    return d;
  };
  for (const p of payments) {
    const d = get(key(new Date(p.payment_date ?? p.created_at)));
    d.attempts += 1;
    if (p.status === "failed" || p.status === "attempted") d.failed += 1;
    if (p.status === "paid") {
      const amt = Number(p.amount ?? 0);
      d.paid += 1;
      d.gross += amt;
      d.base += Number(p.base_amount ?? 0);
      d.gst += Number(p.gst_amount ?? 0);
      const g = (p.gateway_name ?? "").toUpperCase();
      d.gw[GWS.includes(g) ? g : "OTHER"] += amt;
    }
  }
  for (const rf of refunds) {
    const d = get(key(new Date(rf.created_at)));
    d.refundCount += 1;
    d.refunded += Number(rf.refund_amount ?? 0);
  }
  const sorted = Array.from(days.values()).sort((a, b) => a.date.localeCompare(b.date));
  const r2 = (n) => Math.round(n * 100) / 100;
  const fmtDate = (k) => {
    const [y, m, dd] = k.split("-");
    return `${dd}-${m}-${y}`;
  };
  const dow = (k) => (/* @__PURE__ */ new Date(`${k}T12:00:00Z`)).toLocaleDateString("en-IN", {
    weekday: "short",
    timeZone: "UTC"
  });
  const headers = ["Date", "Day", "Paid Orders", "Gross Revenue (₹)", "Base Revenue Excl. Tax (₹)", "GST (₹)", "Refunds", "Refunded Amount (₹)", "Net Revenue (₹)", "Avg Order Value (₹)", ...GWS.map((g) => `${g} (₹)`), "Other Gateway (₹)", "Payment Attempts", "Failed Attempts", "Success Rate (%)"];
  const toRow = (d, label, dayName) => [label, dayName, d.paid, r2(d.gross), r2(d.base), r2(d.gst), d.refundCount, r2(d.refunded), r2(Math.max(0, d.gross - d.refunded)), d.paid ? r2(d.gross / d.paid) : 0, ...GWS.map((g) => r2(d.gw[g])), r2(d.gw.OTHER), d.attempts, d.failed, d.attempts ? r2(d.paid / d.attempts * 100) : 0];
  const total = blank("TOTAL");
  for (const d of sorted) {
    total.paid += d.paid;
    total.gross += d.gross;
    total.base += d.base;
    total.gst += d.gst;
    total.refundCount += d.refundCount;
    total.refunded += d.refunded;
    total.attempts += d.attempts;
    total.failed += d.failed;
    for (const g of Object.keys(total.gw)) total.gw[g] += d.gw[g];
  }
  const rows = [...sorted.map((d) => toRow(d, fmtDate(d.date), dow(d.date))), toRow(total, "TOTAL", "")];
  const csvEscape = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "\uFEFF" + [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const cell = (v, bold = false) => typeof v === "number" ? `<Cell ss:StyleID="${bold ? "TotNum" : "Num"}"><Data ss:Type="Number">${v}</Data></Cell>` : `<Cell${bold ? ' ss:StyleID="Tot"' : ""}><Data ss:Type="String">${esc(v)}</Data></Cell>`;
  const excelXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#0F172A" ss:Pattern="Solid"/></Style>
  <Style ss:ID="Num"><NumberFormat ss:Format="#,##0.00"/></Style>
  <Style ss:ID="Tot"><Font ss:Bold="1"/></Style>
  <Style ss:ID="TotNum"><Font ss:Bold="1"/><NumberFormat ss:Format="#,##0.00"/></Style>
 </Styles>
 <Worksheet ss:Name="Day-wise Revenue"><Table>
<Row>${headers.map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${esc(h)}</Data></Cell>`).join("")}</Row>
${rows.map((row, i) => `<Row>${row.map((v) => cell(v, i === rows.length - 1)).join("")}</Row>`).join("\n")}
</Table></Worksheet></Workbook>`;
  await writeAudit({
    supabase: context.supabase,
    entityType: "payment",
    entityId: `${sorted.length} days`,
    action: "revenue.export_daywise",
    newValue: {
      preset: data.preset,
      from: r.startIso,
      to: r.endIso,
      days: sorted.length
    },
    actorId: context.userId
  });
  return {
    csv,
    excelXml,
    days: sorted.length
  };
});
export {
  exportDayWiseRevenue_createServerFn_handler,
  exportRevenueTransactions_createServerFn_handler,
  getRevenueOverview_createServerFn_handler,
  getTransactionDetail_createServerFn_handler,
  listPaymentLedger_createServerFn_handler
};
