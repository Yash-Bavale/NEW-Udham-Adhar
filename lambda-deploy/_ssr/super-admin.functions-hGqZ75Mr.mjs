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
const memoryCache = /* @__PURE__ */ new Map();
function getFromCache(key) {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return item.data;
}
function setToCache(key, data, ttlSeconds) {
  if (memoryCache.size > 200) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (now > v.expiresAt) memoryCache.delete(k);
    }
  }
  memoryCache.set(key, {
    expiresAt: Date.now() + ttlSeconds * 1e3,
    data
  });
}
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function requireAdminOrSuper(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("super_admin") && !roles.includes("admin")) {
    throw new Error("Forbidden — admin only");
  }
}
async function requireSuper(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(data ?? []).some((r) => r.role === "super_admin")) {
    throw new Error("Forbidden — super_admin only");
  }
}
const IST_OFFSET_MS = 5.5 * 3600 * 1e3;
function istDayStartUtc(d) {
  const ist = new Date(d.getTime() + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS);
}
function getIstDateKey(dateInput) {
  if (!dateInput) return "";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(d);
  } catch {
    return "";
  }
}
function getIstHourKey(dateInput) {
  if (!dateInput) return "00:00";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "00:00";
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false
    }).format(d);
    const h = parseInt(fmt, 10) % 24;
    return `${String(h).padStart(2, "0")}:00`;
  } catch {
    return "00:00";
  }
}
function addDays(d, n) {
  return new Date(d.getTime() + n * 864e5);
}
function resolveRange(input) {
  const preset = input?.preset ?? "today";
  const now = /* @__PURE__ */ new Date();
  const todayStart = istDayStartUtc(now);
  let start;
  let end;
  switch (preset) {
    case "today":
      start = todayStart;
      end = now;
      break;
    case "yesterday":
      start = addDays(todayStart, -1);
      end = todayStart;
      break;
    case "7d":
      start = addDays(todayStart, -6);
      end = now;
      break;
    case "15d":
      start = addDays(todayStart, -14);
      end = now;
      break;
    case "30d":
      start = addDays(todayStart, -29);
      end = now;
      break;
    case "mtd": {
      const ist = new Date(now.getTime() + IST_OFFSET_MS);
      const monthStartIst = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1, 0, 0, 0));
      start = new Date(monthStartIst.getTime() - IST_OFFSET_MS);
      end = now;
      break;
    }
    case "custom": {
      const from = input?.fromIso ? new Date(input.fromIso) : todayStart;
      const to = input?.toIso ? new Date(input.toIso) : now;
      start = istDayStartUtc(from);
      end = addDays(istDayStartUtc(to), 1);
      if (end > now) end = now;
      break;
    }
  }
  const span = end.getTime() - start.getTime();
  const prevEnd = start;
  const prevStart = new Date(start.getTime() - span);
  return {
    start,
    end,
    prevStart,
    prevEnd,
    preset
  };
}
function presetLabel(p) {
  switch (p) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "7d":
      return "Last 7 days";
    case "15d":
      return "Last 15 days";
    case "30d":
      return "Last 30 days";
    case "mtd":
      return "Month to date";
    case "custom":
      return "Custom range";
  }
}
const API_PAGE_SIZE = 1e3;
async function fetchRowsPaged(queryBuilder, maxRows = 1e5) {
  const out = [];
  for (let from = 0; from < maxRows; from += API_PAGE_SIZE) {
    try {
      const {
        data,
        error
      } = await queryBuilder(from, from + API_PAGE_SIZE - 1);
      if (error) {
        console.error(`[fetchRowsPaged] Query error at offset ${from}:`, error);
        break;
      }
      if (!data || data.length === 0) break;
      out.push(...data);
      if (data.length < API_PAGE_SIZE) break;
    } catch (err) {
      console.error(`[fetchRowsPaged] Exception at offset ${from}:`, err);
      break;
    }
  }
  return out;
}
async function safeQuery(promise, fallback) {
  try {
    return await promise;
  } catch (err) {
    console.warn("Dashboard KPI subquery fallback triggered:", err);
    return fallback;
  }
}
const getDashboardKpis_createServerFn_handler = createServerRpc({
  id: "020bc091654580d284d6e4b547596976d7ba10c1d2943a465532548eab44aa1b",
  name: "getDashboardKpis",
  filename: "src/lib/crm/super-admin.functions.ts"
}, (opts) => getDashboardKpis.__executeServer(opts));
const getDashboardKpis = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(getDashboardKpis_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdminOrSuper(context.supabase, context.userId);
  const cacheKey = `dash_kpis_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  const admin = await getAdmin();
  const {
    start,
    end,
    prevStart,
    prevEnd,
    preset
  } = resolveRange(data);
  const startIso = start.toISOString();
  const endIso = end.toISOString();
  const prevStartIso = prevStart.toISOString();
  const prevEndIso = prevEnd.toISOString();
  const dayAgoIso = new Date(Date.now() - 864e5).toISOString();
  const now = /* @__PURE__ */ new Date();
  const threeHoursAgoIso = new Date(now.getTime() - 3 * 3600 * 1e3).toISOString();
  const fiveHoursAgoIso = new Date(now.getTime() - 5 * 3600 * 1e3).toISOString();
  const threeDaysAgoIso = new Date(now.getTime() - 3 * 864e5).toISOString();
  const sevenDaysAgoIso = new Date(now.getTime() - 7 * 864e5).toISOString();
  const todayStartIso = istDayStartUtc(now).toISOString();
  const emptyCountRes = {
    count: 0,
    data: null,
    error: null
  };
  const emptyDataRes = {
    data: [],
    count: 0,
    error: null
  };
  const [
    // 1. Leads
    leadsCurRes,
    leadsPrevRes,
    uniqueLeadsRes,
    uniqueLeadsPrevRes,
    repeatedLeadsRes,
    leadsNotContactedRes,
    leadsContactedRes,
    leadsConvertedRes,
    // 2. Orders (Applications) in Range
    ordersTotalRes,
    ordersClosedRes,
    prevOrdersTotalRes,
    // 3. Operational queues / Delays (Point-in-time)
    technicalDelayRes,
    customerDelayRes,
    formNotSubmittedRes,
    ordersDelayed3dRes,
    ordersDelayed7dRes,
    // 4. Support Tickets
    ticketsRaisedRes,
    ticketsRaisedPrevRes,
    ticketsActiveRes,
    ticketsClosedRes,
    ticketsPending3dRes,
    // 5. Refunds
    refundAcceptedRes,
    refundRejectedRes,
    // 6. Emails
    emailSentRes,
    emailQueuedRes,
    emailFailedRes,
    emailQueueCountsRes,
    // 7. Staff & Misc
    staffRolesRes,
    openAppsRes,
    docsPendingRes,
    certsInRangeRes,
    totalCustomersRes,
    // 8. Gateways config
    gatewaysRes,
    // 9. Webhook errors (24h)
    webhookErrsRes,
    // 10. Payments in range (aggregated via RPC with paged fallback)
    revAggData,
    // 11. Open uncontacted applications (point-in-time backlog)
    uncontactedAppsRes
  ] = await Promise.all([
    // Leads counts (direct exact DB counts)
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).gte("created_at", prevStartIso).lt("created_at", prevEndIso), emptyCountRes),
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).eq("is_duplicate", false).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).eq("is_duplicate", false).gte("created_at", prevStartIso).lt("created_at", prevEndIso), emptyCountRes),
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).eq("is_duplicate", true).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).eq("is_duplicate", false).in("status", ["new_lead", "lead_created", "payment_pending"]).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).eq("is_duplicate", false).eq("status", "contacted").gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("leads").select("id", {
      count: "exact",
      head: true
    }).eq("is_duplicate", false).in("status", ["payment_successful", "details_pending", "documents_pending", "under_review", "under_process", "completed"]).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    // Orders (Applications in selected date range)
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).or("order_status.in.(COMPLETED,CLOSED,REFUND_PROCESSED),fulfillment_status.in.(completed,order_completed,order_closed,cancelled)").gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).gte("created_at", prevStartIso).lt("created_at", prevEndIso), emptyCountRes),
    // Point-in-time Delays & Alerts
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).eq("fulfillment_status", "technical_delay"), emptyCountRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).eq("fulfillment_status", "customer_delay"), emptyCountRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).in("fulfillment_status", ["awaiting_customer_form", "waiting_for_customer_submission"]), emptyCountRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)").lt("created_at", threeDaysAgoIso), emptyCountRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("is_deleted", false).not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)").lt("created_at", sevenDaysAgoIso), emptyCountRes),
    // Support tickets (raised in range vs open point-in-time)
    safeQuery(admin.from("support_tickets").select("id", {
      count: "exact",
      head: true
    }).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("support_tickets").select("id", {
      count: "exact",
      head: true
    }).gte("created_at", prevStartIso).lt("created_at", prevEndIso), emptyCountRes),
    safeQuery(admin.from("support_tickets").select("id", {
      count: "exact",
      head: true
    }).not("status", "in", "(closed,resolved)"), emptyCountRes),
    safeQuery(admin.from("support_tickets").select("id", {
      count: "exact",
      head: true
    }).in("status", ["closed", "resolved"]).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("support_tickets").select("id", {
      count: "exact",
      head: true
    }).not("status", "in", "(closed,resolved)").lt("created_at", threeDaysAgoIso), emptyCountRes),
    // Refunds in range
    safeQuery(admin.from("refund_requests").select("id", {
      count: "exact",
      head: true
    }).eq("status", "approved").gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("refund_requests").select("id", {
      count: "exact",
      head: true
    }).eq("status", "rejected").gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    // Email delivery in range
    safeQuery(admin.from("email_send_log").select("id", {
      count: "exact",
      head: true
    }).eq("status", "sent").gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("email_send_log").select("id", {
      count: "exact",
      head: true
    }).in("status", ["queued", "pending", "processing"]).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("email_send_log").select("id", {
      count: "exact",
      head: true
    }).in("status", ["failed", "dlq", "bounced"]).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("email_queue").select("status"), emptyDataRes),
    // Staff & misc
    safeQuery(admin.from("user_roles").select("user_id"), emptyDataRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).in("application_status", ["under_process", "under_review", "details_pending", "documents_pending"]), emptyCountRes),
    safeQuery(admin.from("applications").select("id", {
      count: "exact",
      head: true
    }).eq("application_status", "documents_pending"), emptyCountRes),
    safeQuery(admin.from("certificates").select("id", {
      count: "exact",
      head: true
    }).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
    safeQuery(admin.from("customers").select("id", {
      count: "exact",
      head: true
    }), emptyCountRes),
    // Payment gateways
    safeQuery(admin.from("payment_gateways").select("id, gateway_name, display_name, is_enabled"), emptyDataRes),
    // Webhook errors (24h)
    safeQuery(admin.from("webhook_error_log").select("id", {
      count: "exact",
      head: true
    }).gte("created_at", dayAgoIso), emptyCountRes),
    // Direct Database Aggregations for Revenue & Gateways (via RPC with fallback)
    (async () => {
      try {
        const {
          data: aggData,
          error: aggErr
        } = await admin.rpc("get_dashboard_revenue_aggregates", {
          p_start: startIso,
          p_end: endIso,
          p_prev_start: prevStartIso,
          p_prev_end: prevEndIso
        });
        if (!aggErr && aggData) {
          return {
            isRpc: true,
            revenueInclTax: Number(aggData.revenue_incl_tax ?? 0),
            revenueExclTax: Number(aggData.revenue_excl_tax ?? 0),
            taxCollected: Number(aggData.tax_collected ?? 0),
            paidPaymentsCount: Number(aggData.paid_payments_count ?? 0),
            revenuePrev: Number(aggData.revenue_prev ?? 0),
            paidPaymentsPrevCount: Number(aggData.paid_payments_prev_count ?? 0),
            payuRevenue: Number(aggData.payu_revenue ?? 0),
            gateways: aggData.gateways ?? []
          };
        }
      } catch {
      }
      const [paidRows, prevPaidRows] = await Promise.all([fetchRowsPaged((from, to) => admin.from("payments").select("amount, base_amount, gst_amount, gateway_name").eq("status", "paid").or(`and(payment_date.gte.${startIso},payment_date.lt.${endIso}),and(payment_date.is.null,created_at.gte.${startIso},created_at.lt.${endIso})`).range(from, to)), fetchRowsPaged((from, to) => admin.from("payments").select("amount").eq("status", "paid").or(`and(payment_date.gte.${prevStartIso},payment_date.lt.${prevEndIso}),and(payment_date.is.null,created_at.gte.${prevStartIso},created_at.lt.${prevEndIso})`).range(from, to))]);
      const prevTotal = prevPaidRows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
      let revIncl = 0;
      let revExcl = 0;
      let tax = 0;
      let payuRev = 0;
      const gwMap2 = /* @__PURE__ */ new Map();
      for (const p of paidRows) {
        const amt = Number(p.amount ?? 0);
        revIncl += amt;
        if (p.base_amount != null && p.gst_amount != null) {
          revExcl += Number(p.base_amount);
          tax += Number(p.gst_amount);
        } else {
          const excl = amt / 1.18;
          revExcl += excl;
          tax += amt - excl;
        }
        const code = String(p.gateway_name ?? "payu").toLowerCase();
        if (code === "payu") payuRev += amt;
        const cur = gwMap2.get(code) ?? {
          code,
          revenue: 0,
          count: 0
        };
        cur.revenue += amt;
        cur.count += 1;
        gwMap2.set(code, cur);
      }
      return {
        isRpc: false,
        revenueInclTax: revIncl,
        revenueExclTax: revExcl,
        taxCollected: tax,
        paidPaymentsCount: paidRows.length,
        revenuePrev: prevTotal,
        paidPaymentsPrevCount: prevPaidRows.length,
        payuRevenue: payuRev,
        gateways: Array.from(gwMap2.values())
      };
    })(),
    // Open uncontacted applications backlog
    safeQuery(admin.from("applications").select("id, created_at, lead_id").eq("is_deleted", false).not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)").lt("created_at", threeHoursAgoIso).limit(2e3), emptyDataRes)
  ]);
  const leadsCurrent = leadsCurRes.count ?? 0;
  const leadsPrev = leadsPrevRes.count ?? 0;
  const uniqueLeads = uniqueLeadsRes.count ?? 0;
  const uniqueLeadsPrev = uniqueLeadsPrevRes.count ?? 0;
  const repeatedLeads = repeatedLeadsRes.count ?? 0;
  const leadsNotContacted = leadsNotContactedRes.count ?? 0;
  const leadsContacted = leadsContactedRes.count ?? 0;
  const leadsConverted = leadsConvertedRes.count ?? 0;
  const paidOrders = ordersTotalRes.count ?? 0;
  const paidOrdersClosed = ordersClosedRes.count ?? 0;
  const paidOrdersPending = Math.max(0, paidOrders - paidOrdersClosed);
  const paidOrdersPrev = prevOrdersTotalRes.count ?? revAggData.paidPaymentsPrevCount;
  const gwMap = /* @__PURE__ */ new Map();
  (gatewaysRes.data ?? []).forEach((gw) => {
    const code = String(gw.gateway_name ?? "").toLowerCase();
    const name = gw.display_name || (code === "payu" ? "PayU" : code === "ccavenue" ? "CCAvenue" : code === "cashfree" ? "Cashfree" : code === "razorpay" ? "Razorpay" : code.toUpperCase());
    gwMap.set(code, {
      code,
      name,
      revenue: 0,
      count: 0,
      isEnabled: Boolean(gw.is_enabled)
    });
  });
  for (const g of revAggData.gateways) {
    const code = g.code.toLowerCase();
    let item = gwMap.get(code);
    if (!item) {
      const name = code === "payu" ? "PayU" : code === "ccavenue" ? "CCAvenue" : code === "cashfree" ? "Cashfree" : code === "razorpay" ? "Razorpay" : code.toUpperCase();
      item = {
        code,
        name,
        revenue: 0,
        count: 0,
        isEnabled: true
      };
      gwMap.set(code, item);
    }
    item.revenue += g.revenue;
    item.count += g.count;
  }
  const gatewaysCollected = Array.from(gwMap.values()).sort((a, b) => b.revenue - a.revenue);
  const revenueInclTax = revAggData.revenueInclTax;
  const revenueExclTax = revAggData.revenueExclTax;
  const taxCollected = revAggData.taxCollected;
  const payuRevenue = revAggData.payuRevenue;
  const revenuePrev = revAggData.revenuePrev;
  const emailSent = emailSentRes.count ?? 0;
  const emailQueued = emailQueuedRes.count ?? 0;
  const emailFailed = emailFailedRes.count ?? 0;
  const staffTotal = new Set((staffRolesRes.data ?? []).map((r) => r.user_id)).size;
  const staffRoleIds = new Set((staffRolesRes.data ?? []).map((r) => r.user_id));
  let authRows = [];
  try {
    const {
      data: userData
    } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 100
    });
    authRows = (userData?.users ?? []).map((u) => ({
      id: u.id,
      last_sign_in_at: u.last_sign_in_at ?? null
    }));
  } catch {
  }
  const staffActiveToday = authRows.filter((u) => staffRoleIds.has(u.id) && u.last_sign_in_at && u.last_sign_in_at >= todayStartIso).length;
  const staffInactive = Math.max(0, staffTotal - staffActiveToday);
  const uncontactedApps = uncontactedAppsRes.data ?? [];
  const leadIdsToCheck = uncontactedApps.map((a) => a.lead_id).filter((id) => !!id);
  let contactedLeadSet = /* @__PURE__ */ new Set();
  if (leadIdsToCheck.length > 0) {
    try {
      const {
        data: contactedEvents
      } = await admin.from("lead_contact_events").select("lead_id").in("lead_id", leadIdsToCheck.slice(0, 1e3));
      contactedLeadSet = new Set((contactedEvents ?? []).map((e) => e.lead_id));
    } catch {
    }
  }
  const realUncontacted = uncontactedApps.filter((a) => !a.lead_id || !contactedLeadSet.has(a.lead_id));
  const ordersNotContacted3h = realUncontacted.length;
  const ordersNotContacted5h = realUncontacted.filter((a) => a.created_at < fiveHoursAgoIso).length;
  const conversionRate = leadsCurrent > 0 ? Math.round(paidOrders / leadsCurrent * 1e3) / 10 : 0;
  const conversionRateV2 = uniqueLeads > 0 ? Math.round(paidOrders / uniqueLeads * 1e3) / 10 : 0;
  const conversionRatePrev = uniqueLeadsPrev > 0 ? Math.round(paidOrdersPrev / uniqueLeadsPrev * 1e3) / 10 : 0;
  const avgOrderValue = paidOrders > 0 ? Math.round(revenueInclTax / paidOrders) : 0;
  const payuMode = process.env.PAYU_MODE ?? "test";
  const payuLive = payuRevenue > 0;
  const queueRows = emailQueueCountsRes.data ?? [];
  const queueDepth = queueRows.filter((r) => r.status === "queued" || r.status === "failed").length;
  const result = {
    range: {
      preset,
      startIso,
      endIso,
      label: presetLabel(preset)
    },
    kpis: {
      leadsCurrent,
      leadsPrev,
      revenueCurrent: revenueInclTax,
      revenuePrev,
      paidPayments: revAggData.paidPaymentsCount,
      openApplications: openAppsRes.count ?? 0,
      documentsPending: docsPendingRes.count ?? 0,
      certificatesInRange: certsInRangeRes.count ?? 0,
      emailQueueDepth: queueDepth,
      totalCustomers: totalCustomersRes.count ?? 0,
      activeStaff: staffTotal,
      conversionRate,
      repeatedLeads,
      avgOrderValue
    },
    metrics: {
      uniqueLeads,
      uniqueLeadsPrev,
      repeatedLeads,
      leadsNotContacted,
      leadsContacted,
      leadsConverted,
      leadsConvertedAfterContact: leadsConverted,
      paidOrders,
      paidOrdersPrev,
      paidOrdersPending,
      paidOrdersClosed,
      technicalDelay: technicalDelayRes.count ?? 0,
      customerDelay: customerDelayRes.count ?? 0,
      formNotSubmitted: formNotSubmittedRes.count ?? 0,
      ordersDelayed3d: ordersDelayed3dRes.count ?? 0,
      ordersDelayed7d: ordersDelayed7dRes.count ?? 0,
      ticketsRaised: ticketsRaisedRes.count ?? 0,
      ticketsRaisedPrev: ticketsRaisedPrevRes.count ?? 0,
      ticketsActive: ticketsActiveRes.count ?? 0,
      ticketsClosed: ticketsClosedRes.count ?? 0,
      ticketsPending3d: ticketsPending3dRes.count ?? 0,
      refundAccepted: refundAcceptedRes.count ?? 0,
      refundRejected: refundRejectedRes.count ?? 0,
      emailSent,
      emailQueued,
      emailFailed,
      staffTotal,
      staffActiveToday,
      staffInactive,
      ordersNotContacted3h,
      ordersNotContacted5h,
      revenueInclTax,
      revenueExclTax,
      taxCollected,
      revenueInclTaxPrev: revenuePrev,
      conversionRate: conversionRateV2,
      conversionRatePrev,
      webhookErrors24h: webhookErrsRes.count ?? 0,
      payuLive,
      payuRevenue
    },
    gatewaysCollected,
    payu: {
      mode: payuMode,
      isProduction: payuMode === "production"
    }
  };
  setToCache(cacheKey, result, 30);
  return result;
});
const getDashboardCharts_createServerFn_handler = createServerRpc({
  id: "f9335ee0512e2040f1278ffbfbca707cf7f62c095040043ebf802308a0d21d58",
  name: "getDashboardCharts",
  filename: "src/lib/crm/super-admin.functions.ts"
}, (opts) => getDashboardCharts.__executeServer(opts));
const getDashboardCharts = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(getDashboardCharts_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdminOrSuper(context.supabase, context.userId);
  const cacheKey = `dash_charts_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  const admin = await getAdmin();
  const {
    start,
    end
  } = resolveRange(data);
  const startIso = start.toISOString();
  const endIso = end.toISOString();
  let dailyLeads = {};
  let dailyOrders = {};
  let dailyRev = {};
  let hourlyLeads = {};
  let hourlyOrders = {};
  let hourlyRev = {};
  let rpcSuccess = false;
  try {
    const {
      data: chartAgg,
      error: chartErr
    } = await admin.rpc("get_dashboard_chart_aggregates", {
      p_start: startIso,
      p_end: endIso
    });
    if (!chartErr && chartAgg) {
      dailyLeads = chartAgg.daily_leads ?? {};
      dailyOrders = chartAgg.daily_orders ?? {};
      dailyRev = chartAgg.daily_rev ?? {};
      hourlyLeads = chartAgg.hourly_leads ?? {};
      hourlyOrders = chartAgg.hourly_orders ?? {};
      hourlyRev = chartAgg.hourly_rev ?? {};
      rpcSuccess = true;
    }
  } catch {
  }
  if (!rpcSuccess) {
    const [payRows, leadRows, orderRows] = await Promise.all([fetchRowsPaged((from, to) => admin.from("payments").select("amount, created_at, payment_date").eq("status", "paid").or(`and(payment_date.gte.${startIso},payment_date.lt.${endIso}),and(payment_date.is.null,created_at.gte.${startIso},created_at.lt.${endIso})`).range(from, to)), fetchRowsPaged((from, to) => admin.from("leads").select("id, created_at").gte("created_at", startIso).lt("created_at", endIso).range(from, to)), fetchRowsPaged((from, to) => admin.from("applications").select("id, created_at").eq("is_deleted", false).gte("created_at", startIso).lt("created_at", endIso).range(from, to))]);
    for (const r of leadRows) {
      const dk = getIstDateKey(r.created_at);
      if (dk) dailyLeads[dk] = (dailyLeads[dk] ?? 0) + 1;
      const hk = getIstHourKey(r.created_at);
      if (hk) hourlyLeads[hk] = (hourlyLeads[hk] ?? 0) + 1;
    }
    for (const r of orderRows) {
      const dk = getIstDateKey(r.created_at);
      if (dk) dailyOrders[dk] = (dailyOrders[dk] ?? 0) + 1;
      const hk = getIstHourKey(r.created_at);
      if (hk) hourlyOrders[hk] = (hourlyOrders[hk] ?? 0) + 1;
    }
    for (const r of payRows) {
      const dateVal = r.payment_date || r.created_at;
      const dk = getIstDateKey(dateVal);
      if (dk) dailyRev[dk] = (dailyRev[dk] ?? 0) + Number(r.amount ?? 0);
      const hk = getIstHourKey(dateVal);
      if (hk) hourlyRev[hk] = (hourlyRev[hk] ?? 0) + Number(r.amount ?? 0);
    }
  }
  const days = [];
  {
    const firstDay = istDayStartUtc(start);
    const lastDay = istDayStartUtc(end);
    for (let cur = firstDay; cur.getTime() <= lastDay.getTime(); cur = addDays(cur, 1)) {
      const key = getIstDateKey(cur);
      if (key && !days.includes(key)) {
        days.push(key);
      }
    }
    if (days.length > 366) days.length = 366;
  }
  const hours = Array.from({
    length: 24
  }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  const result = {
    days,
    leads: days.map((k) => Number(dailyLeads[k] ?? 0)),
    orders: days.map((k) => Number(dailyOrders[k] ?? 0)),
    revenueInr: days.map((k) => Number(dailyRev[k] ?? 0)),
    hourly: {
      hours,
      leads: hours.map((hk) => Number(hourlyLeads[hk] ?? 0)),
      orders: hours.map((hk) => Number(hourlyOrders[hk] ?? 0)),
      revenueInr: hours.map((hk) => Number(hourlyRev[hk] ?? 0))
    }
  };
  setToCache(cacheKey, result, 60);
  return result;
});
const getDashboardTopServices_createServerFn_handler = createServerRpc({
  id: "bdaed249103b005012ed7d34cfef7ba34eb0153b3495781d2cfb1198a3a96d1a",
  name: "getDashboardTopServices",
  filename: "src/lib/crm/super-admin.functions.ts"
}, (opts) => getDashboardTopServices.__executeServer(opts));
const getDashboardTopServices = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(getDashboardTopServices_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdminOrSuper(context.supabase, context.userId);
  const cacheKey = `dash_top_svc_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  const admin = await getAdmin();
  const {
    start,
    end
  } = resolveRange(data);
  const startIso = start.toISOString();
  const endIso = end.toISOString();
  try {
    const {
      data: topSvcData,
      error: topSvcErr
    } = await admin.rpc("get_dashboard_top_services", {
      p_start: startIso,
      p_end: endIso
    });
    if (!topSvcErr && topSvcData) {
      const result2 = topSvcData.map((s) => ({
        name: s.name,
        orders: Number(s.orders ?? 0),
        revenueInr: Number(s.revenueInr ?? 0)
      }));
      setToCache(cacheKey, result2, 60);
      return result2;
    }
  } catch {
  }
  const topServicesRows = await fetchRowsPaged((from, to) => admin.from("applications").select("service_id, leads!fk_applications_lead(total_amount), services(service_name)").eq("is_deleted", false).gte("created_at", startIso).lt("created_at", endIso).range(from, to));
  const topMap = /* @__PURE__ */ new Map();
  for (const r of topServicesRows) {
    const svc = Array.isArray(r.services) ? r.services[0] : r.services;
    const lead = Array.isArray(r.leads) ? r.leads[0] : r.leads;
    const name = svc?.service_name || "Unknown";
    const cur = topMap.get(name) ?? {
      name,
      orders: 0,
      revenueInr: 0
    };
    cur.orders += 1;
    cur.revenueInr += Number(lead?.total_amount ?? 0);
    topMap.set(name, cur);
  }
  const result = Array.from(topMap.values()).sort((a, b) => b.revenueInr - a.revenueInr).slice(0, 6);
  setToCache(cacheKey, result, 60);
  return result;
});
const getDashboardSecondary_createServerFn_handler = createServerRpc({
  id: "c05623c763ae910a4af76c3fd6df3625512dcaa1e542a58253897255d67e2aa0",
  name: "getDashboardSecondary",
  filename: "src/lib/crm/super-admin.functions.ts"
}, (opts) => getDashboardSecondary.__executeServer(opts));
const getDashboardSecondary = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(getDashboardSecondary_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdminOrSuper(context.supabase, context.userId);
  const cacheKey = `dash_secondary_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  const admin = await getAdmin();
  const {
    start,
    end
  } = resolveRange(data);
  const startIso = start.toISOString();
  const endIso = end.toISOString();
  const dayAgoIso = new Date(Date.now() - 864e5).toISOString();
  const [wfExternalDelay, wfOnHold, wfRefundPending, wfRemindersDue, wfClosedInRange, emailCounts, activity, webhookErrs] = await Promise.all([admin.from("applications").select("id", {
    count: "exact",
    head: true
  }).in("workflow_status", ["external_dependency", "government_portal_pending"]), admin.from("applications").select("id", {
    count: "exact",
    head: true
  }).in("workflow_status", ["waiting_for_customer", "waiting_for_documents", "customer_non_responsive"]), admin.from("refund_requests").select("id", {
    count: "exact",
    head: true
  }).eq("status", "pending"), admin.from("workflow_reminders").select("id", {
    count: "exact",
    head: true
  }).eq("status", "pending").lte("due_at", (/* @__PURE__ */ new Date()).toISOString()), admin.from("applications").select("id", {
    count: "exact",
    head: true
  }).in("workflow_status", ["closed", "cancelled", "refund_closed"]).gte("updated_at", startIso).lt("updated_at", endIso), admin.from("email_queue").select("status"), admin.from("activity_logs").select("id, activity_description, created_at").order("created_at", {
    ascending: false
  }).limit(30), admin.from("webhook_error_log").select("id", {
    count: "exact",
    head: true
  }).gte("created_at", dayAgoIso)]);
  const queueRows = emailCounts.data ?? [];
  const queue = {
    queued: queueRows.filter((r) => r.status === "queued").length,
    processing: queueRows.filter((r) => r.status === "processing").length,
    failed: queueRows.filter((r) => r.status === "failed").length,
    sent: queueRows.filter((r) => r.status === "sent").length
  };
  const payuMode = process.env.PAYU_MODE ?? "test";
  const alerts = [];
  if (payuMode !== "production") {
    alerts.push({
      id: "payu-mode",
      severity: "high",
      message: `PayU running in '${payuMode}' mode — switch to 'production' before launch.`
    });
  }
  if (queue.failed > 0) {
    alerts.push({
      id: "email-failed",
      severity: "med",
      message: `${queue.failed} email(s) in failed state — investigate or replay.`
    });
  }
  if ((webhookErrs.count ?? 0) > 0) {
    alerts.push({
      id: "webhook-fail",
      severity: "med",
      message: `${webhookErrs.count} webhook failures in last 24h.`
    });
  }
  const result = {
    emailQueue: queue,
    alerts,
    activity: (activity.data ?? []).map((r) => ({
      id: r.id,
      description: r.activity_description ?? "(no description)",
      created_at: r.created_at
    })),
    webhookFailures24h: webhookErrs.count ?? 0,
    workflow: {
      externalDelay: wfExternalDelay.count ?? 0,
      onHold: wfOnHold.count ?? 0,
      refundPending: wfRefundPending.count ?? 0,
      remindersDue: wfRemindersDue.count ?? 0,
      closedInRange: wfClosedInRange.count ?? 0
    }
  };
  setToCache(cacheKey, result, 60);
  return result;
});
const getSuperAdminOverview_createServerFn_handler = createServerRpc({
  id: "955f3d0f1d75646335826c5e99af658baebab9f38a2231baf0ecdd5b4405ff94",
  name: "getSuperAdminOverview",
  filename: "src/lib/crm/super-admin.functions.ts"
}, (opts) => getSuperAdminOverview.__executeServer(opts));
const getSuperAdminOverview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {
  preset: "today"
}).handler(getSuperAdminOverview_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdminOrSuper(context.supabase, context.userId);
  const [kpisRes, chartRes, topSvcRes, secondaryRes] = await Promise.all([getDashboardKpis({
    data
  }), getDashboardCharts({
    data
  }), getDashboardTopServices({
    data
  }), getDashboardSecondary({
    data
  })]);
  return {
    range: kpisRes.range,
    kpis: kpisRes.kpis,
    metrics: kpisRes.metrics,
    gatewaysCollected: kpisRes.gatewaysCollected,
    trend: chartRes,
    topServices: topSvcRes,
    emailQueue: secondaryRes.emailQueue,
    payu: kpisRes.payu,
    alerts: secondaryRes.alerts,
    activity: secondaryRes.activity,
    webhookFailures24h: secondaryRes.webhookFailures24h,
    workflow: secondaryRes.workflow
  };
});
const processEmailQueueNow_createServerFn_handler = createServerRpc({
  id: "624e2203c3ff26f8a5838a9c68aac9cf7a9b7638a95506f34c62101a15a48a8d",
  name: "processEmailQueueNow",
  filename: "src/lib/crm/super-admin.functions.ts"
}, (opts) => processEmailQueueNow.__executeServer(opts));
const processEmailQueueNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(processEmailQueueNow_createServerFn_handler, async ({
  context
}) => {
  await requireSuper(context.supabase, context.userId);
  const {
    processQueueInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  return await processQueueInternal(100);
});
const seedMissingEmailTemplates_createServerFn_handler = createServerRpc({
  id: "5bed9aac48aaba6b4ffaa620ccdb3f7be37412157c85ee73443c642675dbdcfb",
  name: "seedMissingEmailTemplates",
  filename: "src/lib/crm/super-admin.functions.ts"
}, (opts) => seedMissingEmailTemplates.__executeServer(opts));
const seedMissingEmailTemplates = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(seedMissingEmailTemplates_createServerFn_handler, async ({
  context
}) => {
  await requireSuper(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    BUILTIN_TEMPLATES
  } = await import("./emails.server-BTJhg2a3.mjs");
  const seeds = [{
    code: "R001",
    name: "R001 – Refund Request Approved",
    subject: BUILTIN_TEMPLATES.R001?.subject ?? "Refund Request Approved – Order No. {{order_number}}",
    body_html: BUILTIN_TEMPLATES.R001?.body_html ?? "",
    category: "Refunds",
    flow_id: "R001",
    sr_no: 1,
    dispatch_mode: "manual",
    variables: ["order_number", "customer_name", "service_name", "refund_status", "refund_amount", "refund_amount_formatted", "refund_approval_date_and_time", "refund_reference_no", "payment_reference", "customer_email", "customer_mobile", "executive_name"]
  }, {
    code: "R002",
    name: "R002 – Refund Request Not Approved / Rejected",
    subject: BUILTIN_TEMPLATES.R002?.subject ?? "Refund Request Update – Order No. {{order_number}}",
    body_html: BUILTIN_TEMPLATES.R002?.body_html ?? "",
    category: "Refunds",
    flow_id: "R002",
    sr_no: 2,
    dispatch_mode: "manual",
    variables: ["order_number", "customer_name", "invoice_number", "service_name", "order_created_at", "closure_date", "customer_email", "customer_mobile", "employee_remarks", "executive_name"]
  }, {
    code: "E011",
    name: "E011 – Technical Delay Resolved",
    subject: BUILTIN_TEMPLATES.E011?.subject ?? "Update on Your Order – Technical Issue Resolved (Order No. {{order_number}})",
    body_html: BUILTIN_TEMPLATES.E011?.body_html ?? "",
    category: "Delay & Hold",
    flow_id: "E011",
    sr_no: 11,
    dispatch_mode: "manual",
    variables: ["order_number", "customer_name", "service_name", "resolved_at", "customer_email", "customer_mobile", "executive_name"]
  }, {
    code: "document_submission_approved",
    name: "Documents Approved",
    subject: "Your documents have been verified — {{service_name}}",
    body_html: "<p>Dear {{customer_name}},</p><p>We have verified your documents for <strong>{{service_name}}</strong>. Our team will now proceed with processing your application.</p>",
    variables: ["customer_name", "service_name", "order_number"]
  }, {
    code: "document_submission_needs_changes",
    name: "Documents Need Changes",
    subject: "Action required: Update your documents for {{service_name}}",
    body_html: "<p>Dear {{customer_name}},</p><p>Your submission for <strong>{{service_name}}</strong> requires some changes:<br>{{change_notes}}</p><p>Please re-upload the corrected documents.</p>",
    variables: ["customer_name", "service_name", "change_notes", "form_link"]
  }, {
    code: "complaint_resolution",
    name: "Complaint Resolved",
    subject: "Your complaint {{complaint_number}} has been resolved",
    body_html: "<p>Dear {{customer_name}},</p><p>Your complaint ({{complaint_number}}) has been resolved. Resolution: {{resolution_notes}}</p>",
    variables: ["customer_name", "complaint_number", "resolution_notes"]
  }];
  let inserted = 0;
  for (const s of seeds) {
    const {
      error
    } = await admin.from("email_templates").upsert({
      ...s,
      is_enabled: true,
      is_system: true
    }, {
      onConflict: "code"
    });
    if (!error) inserted += 1;
  }
  return {
    ok: true,
    inserted,
    total: seeds.length
  };
});
export {
  getDashboardCharts_createServerFn_handler,
  getDashboardKpis_createServerFn_handler,
  getDashboardSecondary_createServerFn_handler,
  getDashboardTopServices_createServerFn_handler,
  getSuperAdminOverview_createServerFn_handler,
  processEmailQueueNow_createServerFn_handler,
  seedMissingEmailTemplates_createServerFn_handler
};
