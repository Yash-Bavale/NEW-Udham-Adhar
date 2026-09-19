// Executive / SuperAdmin dashboard data source.
// - Range-aware: today / yesterday / 7d / 30d / mtd / custom (all in IST).
// - Day boundary = 00:00 Asia/Kolkata.
// - Read open to admin + super_admin. Mutations stay super_admin only.
// - High-performance modular architecture with in-memory TTL caching and parallel sub-queries.

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* -------------------- In-Memory Short-Lived TTL Cache -------------------- */

type CacheEntry<T> = {
  expiresAt: number;
  data: T;
};

const memoryCache = new Map<string, CacheEntry<any>>();

function getFromCache<T>(key: string): T | null {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return item.data as T;
}

function setToCache<T>(key: string, data: T, ttlSeconds: number): void {
  if (memoryCache.size > 200) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (now > v.expiresAt) memoryCache.delete(k);
    }
  }
  memoryCache.set(key, {
    expiresAt: Date.now() + ttlSeconds * 1000,
    data,
  });
}

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function requireAdminOrSuper(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("super_admin") && !roles.includes("admin")) {
    throw new Error("Forbidden — admin only");
  }
}

async function requireSuper(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(data ?? []).some((r: { role: string }) => r.role === "super_admin")) {
    throw new Error("Forbidden — super_admin only");
  }
}

/* -------------------- IST helpers -------------------- */

const IST_OFFSET_MS = 5.5 * 3600 * 1000;

/** Floor any instant to the start of its IST calendar day, returned as a UTC Date. */
function istDayStartUtc(d: Date): Date {
  const ist = new Date(d.getTime() + IST_OFFSET_MS);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - IST_OFFSET_MS);
}

function getIstDateKey(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}

function getIstHourKey(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "00:00";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "00:00";
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }).format(d);
    const h = parseInt(fmt, 10) % 24;
    return `${String(h).padStart(2, "0")}:00`;
  } catch {
    return "00:00";
  }
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}

export type RangePreset = "today" | "yesterday" | "7d" | "15d" | "30d" | "mtd" | "custom";

export type RangeInput = {
  preset: RangePreset;
  fromIso?: string;
  toIso?: string;
};

function resolveRange(input?: RangeInput): { start: Date; end: Date; prevStart: Date; prevEnd: Date; preset: RangePreset } {
  const preset = input?.preset ?? "today";
  const now = new Date();
  const todayStart = istDayStartUtc(now);
  let start: Date;
  let end: Date;

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
      // inclusive of "to" day: end-of-day IST
      end = addDays(istDayStartUtc(to), 1);
      if (end > now) end = now;
      break;
    }
  }

  // Previous equal-length window for delta comparison.
  const span = end.getTime() - start.getTime();
  const prevEnd = start;
  const prevStart = new Date(start.getTime() - span);
  return { start, end, prevStart, prevEnd, preset };
}

function presetLabel(p: RangePreset): string {
  switch (p) {
    case "today": return "Today";
    case "yesterday": return "Yesterday";
    case "7d": return "Last 7 days";
    case "15d": return "Last 15 days";
    case "30d": return "Last 30 days";
    case "mtd": return "Month to date";
    case "custom": return "Custom range";
  }
}

/* -------------------- Output types -------------------- */

export type GatewayCollectItem = {
  code: string;
  name: string;
  revenue: number;
  count: number;
  isEnabled: boolean;
};

export type SuperAdminOverview = {
  range: { preset: RangePreset; startIso: string; endIso: string; label: string };
  kpis: {
    leadsCurrent: number;
    leadsPrev: number;
    revenueCurrent: number;
    revenuePrev: number;
    paidPayments: number;
    openApplications: number;
    documentsPending: number;
    certificatesInRange: number;
    emailQueueDepth: number;
    totalCustomers: number;
    activeStaff: number;
    conversionRate: number;
    repeatedLeads: number;
    avgOrderValue: number;
  };
  metrics: {
    uniqueLeads: number;
    uniqueLeadsPrev: number;
    repeatedLeads: number;
    leadsNotContacted: number;
    leadsContacted: number;
    leadsConverted: number;
    leadsConvertedAfterContact: number;
    paidOrders: number;
    paidOrdersPrev: number;
    paidOrdersPending: number;
    paidOrdersClosed: number;
    technicalDelay: number;
    customerDelay: number;
    formNotSubmitted: number;
    ordersDelayed3d: number;
    ordersDelayed7d: number;
    ticketsRaised: number;
    ticketsRaisedPrev: number;
    ticketsActive: number;
    ticketsClosed: number;
    ticketsPending3d: number;
    refundAccepted: number;
    refundRejected: number;
    emailSent: number;
    emailQueued: number;
    emailFailed: number;
    staffTotal: number;
    staffActiveToday: number;
    staffInactive: number;
    ordersNotContacted3h: number;
    ordersNotContacted5h: number;
    revenueInclTax: number;
    revenueExclTax: number;
    taxCollected: number;
    revenueInclTaxPrev: number;
    conversionRate: number;
    conversionRatePrev: number;
    webhookErrors24h: number;
    payuLive: boolean;
    payuRevenue: number;
  };
  gatewaysCollected: GatewayCollectItem[];
  trend: {
    days: string[];
    leads: number[];
    orders: number[];
    revenueInr: number[];
    hourly: {
      hours: string[];
      leads: number[];
      orders: number[];
      revenueInr: number[];
    };
  };
  topServices: { name: string; orders: number; revenueInr: number }[];
  emailQueue: { queued: number; processing: number; failed: number; sent: number };
  payu: { mode: string; isProduction: boolean };
  alerts: { id: string; severity: "high" | "med" | "low"; message: string }[];
  activity: { id: string; description: string; created_at: string }[];
  webhookFailures24h: number;
  workflow: {
    externalDelay: number;
    onHold: number;
    refundPending: number;
    remindersDue: number;
    closedInRange: number;
  };
};

export type DashboardKpisResult = {
  range: SuperAdminOverview["range"];
  kpis: SuperAdminOverview["kpis"];
  metrics: SuperAdminOverview["metrics"];
  gatewaysCollected: GatewayCollectItem[];
  payu: SuperAdminOverview["payu"];
};

export type DashboardChartsResult = SuperAdminOverview["trend"];
export type DashboardTopServicesResult = SuperAdminOverview["topServices"];
export type DashboardSecondaryResult = {
  emailQueue: SuperAdminOverview["emailQueue"];
  alerts: SuperAdminOverview["alerts"];
  activity: SuperAdminOverview["activity"];
  webhookFailures24h: number;
  workflow: SuperAdminOverview["workflow"];
};

/* -------------------- 1. Fast KPI Sub-Query (30s cache) -------------------- */

async function safeQuery<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    console.warn("Dashboard KPI subquery fallback triggered:", err);
    return fallback;
  }
}

export const getDashboardKpis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput | undefined) => input ?? { preset: "today" as RangePreset })
  .handler(async ({ data, context }): Promise<DashboardKpisResult> => {
    await requireAdminOrSuper(context.supabase, context.userId);
    const cacheKey = `dash_kpis_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
    const cached = getFromCache<DashboardKpisResult>(cacheKey);
    if (cached) return cached;

    const admin = await getAdmin();
    const { start, end, prevStart, prevEnd, preset } = resolveRange(data);
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const prevStartIso = prevStart.toISOString();
    const prevEndIso = prevEnd.toISOString();
    const dayAgoIso = new Date(Date.now() - 86_400_000).toISOString();
    const now = new Date();
    const nowIso = now.toISOString();
    const threeHoursAgoIso = new Date(now.getTime() - 3 * 3600 * 1000).toISOString();
    const fiveHoursAgoIso = new Date(now.getTime() - 5 * 3600 * 1000).toISOString();
    const threeDaysAgoIso = new Date(now.getTime() - 3 * 86_400_000).toISOString();
    const sevenDaysAgoIso = new Date(now.getTime() - 7 * 86_400_000).toISOString();
    const todayStartIso = istDayStartUtc(now).toISOString();

    const emptyCountRes = { count: 0, data: null, error: null } as any;
    const emptyDataRes = { data: [], count: 0, error: null } as any;

    const [
      leadsCur, leadsPrevRes,
      uniqueLeadsRes, uniqueLeadsPrevRes, repeatedLeadsRes,
      leadStatusRowsRes,
      paidPaymentsRes, paidPaymentsPrevRes,
      technicalDelayRes, customerDelayRes, formNotSubmittedRes,
      ordersDelayed3dRes, ordersDelayed7dRes,
      ticketsRaisedRes, ticketsRaisedPrevRes, ticketsActiveRes, ticketsClosedRes, ticketsPending3dRes,
      refundAcceptedRes, refundRejectedRes,
      emailLogRes, emailQueueCountsRes,
      staffRolesRes,
      openAppsRes, docsPendingRes, certsInRangeRes, totalCustomersRes, paidLeadsInRangeRes,
      uncontactedAppsRes,
      gatewaysRes,
      webhookErrsRes,
    ] = await Promise.all([
      // Leads counts
      safeQuery(admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
      safeQuery(admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", prevStartIso).lt("created_at", prevEndIso), emptyCountRes),
      safeQuery(admin.from("leads").select("id", { count: "exact", head: true }).eq("is_duplicate", false).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
      safeQuery(admin.from("leads").select("id", { count: "exact", head: true }).eq("is_duplicate", false).gte("created_at", prevStartIso).lt("created_at", prevEndIso), emptyCountRes),
      safeQuery(admin.from("leads").select("id", { count: "exact", head: true }).eq("is_duplicate", true).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
      safeQuery(admin.from("leads").select("status").eq("is_duplicate", false).gte("created_at", startIso).lt("created_at", endIso).limit(5000), emptyDataRes),

      // Payments & revenue
      safeQuery(admin.from("payments").select("application_id, amount, base_amount, gst_amount, gateway_name, applications(order_status, fulfillment_status)").eq("status", "paid").gte("created_at", startIso).lt("created_at", endIso).limit(5000), emptyDataRes),
      safeQuery(admin.from("payments").select("amount").eq("status", "paid").gte("created_at", prevStartIso).lt("created_at", prevEndIso).limit(5000), emptyDataRes),

      // Delays & alerts
      safeQuery(admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).eq("fulfillment_status", "technical_delay"), emptyCountRes),
      safeQuery(admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).eq("fulfillment_status", "customer_delay"), emptyCountRes),
      safeQuery(admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).in("fulfillment_status", ["awaiting_customer_form", "waiting_for_customer_submission"]), emptyCountRes),
      safeQuery(admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)").lt("created_at", threeDaysAgoIso), emptyCountRes),
      safeQuery(admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)").lt("created_at", sevenDaysAgoIso), emptyCountRes),

      // Support tickets
      safeQuery(admin.from("support_tickets").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
      safeQuery(admin.from("support_tickets").select("id", { count: "exact", head: true }).gte("created_at", prevStartIso).lt("created_at", prevEndIso), emptyCountRes),
      safeQuery(admin.from("support_tickets").select("id", { count: "exact", head: true }).not("status", "in", "(closed,resolved)"), emptyCountRes),
      safeQuery(admin.from("support_tickets").select("id", { count: "exact", head: true }).in("status", ["closed", "resolved"]).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
      safeQuery(admin.from("support_tickets").select("id", { count: "exact", head: true }).not("status", "in", "(closed,resolved)").lt("created_at", threeDaysAgoIso), emptyCountRes),

      // Refunds
      safeQuery(admin.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "approved").gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
      safeQuery(admin.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "rejected").gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),

      // Email delivery
      safeQuery(admin.from("email_send_log").select("message_id, status").gte("created_at", startIso).lt("created_at", endIso).limit(5000), emptyDataRes),
      safeQuery(admin.from("email_queue").select("status"), emptyDataRes),

      // Staff
      safeQuery(admin.from("user_roles").select("user_id"), emptyDataRes),

      // Misc KPIs
      safeQuery(admin.from("applications").select("id", { count: "exact", head: true }).in("application_status", ["under_process", "under_review", "details_pending", "documents_pending"]), emptyCountRes),
      safeQuery(admin.from("applications").select("id", { count: "exact", head: true }).eq("application_status", "documents_pending"), emptyCountRes),
      safeQuery(admin.from("certificates").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso), emptyCountRes),
      safeQuery(admin.from("customers").select("id", { count: "exact", head: true }), emptyCountRes),
      safeQuery(admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso).eq("status", "payment_successful"), emptyCountRes),

      // Uncontacted applications
      safeQuery(admin.from("applications").select("id, created_at, lead_id").eq("is_deleted", false).not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)").lt("created_at", threeHoursAgoIso).limit(500), emptyDataRes),

      // Gateways
      safeQuery(admin.from("payment_gateways").select("id, gateway_name, display_name, is_enabled"), emptyDataRes),

      // Webhook errors
      safeQuery(admin.from("webhook_error_log").select("id", { count: "exact", head: true }).gte("created_at", dayAgoIso), emptyCountRes),
    ]);

    // Lead status breakdown
    const NOT_CONTACTED_STATUSES = new Set(["new_lead", "lead_created", "payment_pending"]);
    const CONTACTED_STATUSES = new Set(["contacted"]);
    const CONVERTED_STATUSES = new Set([
      "payment_successful",
      "details_pending",
      "documents_pending",
      "under_review",
      "under_process",
      "completed",
    ]);
    let leadsNotContacted = 0;
    let leadsContacted = 0;
    let leadsConverted = 0;
    for (const r of (leadStatusRowsRes.data ?? []) as Array<{ status: string | null }>) {
      const s = String(r.status ?? "");
      if (NOT_CONTACTED_STATUSES.has(s)) leadsNotContacted += 1;
      else if (CONTACTED_STATUSES.has(s)) leadsContacted += 1;
      else if (CONVERTED_STATUSES.has(s)) leadsConverted += 1;
    }

    // Payments & Gateway breakdown
    const gwMap = new Map<string, GatewayCollectItem>();
    (gatewaysRes.data ?? []).forEach((gw: any) => {
      const code = String(gw.gateway_name ?? "").toLowerCase();
      const name = gw.display_name || (code === "payu" ? "PayU" : code === "ccavenue" ? "CCAvenue" : code === "cashfree" ? "Cashfree" : code === "razorpay" ? "Razorpay" : code.toUpperCase());
      gwMap.set(code, {
        code,
        name,
        revenue: 0,
        count: 0,
        isEnabled: Boolean(gw.is_enabled),
      });
    });

    const paidRows = (paidPaymentsRes.data ?? []) as Array<{
      application_id: string | null;
      amount: number;
      base_amount: number | null;
      gst_amount: number | null;
      gateway_name: string | null;
      applications: any;
    }>;
    const paidAppIds = new Set<string>();
    let paidOrdersPending = 0;
    let paidOrdersClosed = 0;
    let revenueInclTax = 0;
    let revenueExclTax = 0;
    let taxCollected = 0;
    let payuRevenue = 0;

    for (const p of paidRows) {
      if (p.application_id && !paidAppIds.has(p.application_id)) {
        paidAppIds.add(p.application_id);
        const app = Array.isArray(p.applications) ? p.applications[0] : p.applications;
        const os = String(app?.order_status ?? "");
        const fs = String(app?.fulfillment_status ?? "");
        if (["COMPLETED", "CLOSED", "REFUND_PROCESSED"].includes(os) || ["completed", "order_completed", "order_closed", "cancelled"].includes(fs)) {
          paidOrdersClosed += 1;
        } else {
          paidOrdersPending += 1;
        }
      }
      const amt = Number(p.amount ?? 0);
      revenueInclTax += amt;
      if (p.base_amount != null && p.gst_amount != null) {
        revenueExclTax += Number(p.base_amount);
        taxCollected += Number(p.gst_amount);
      } else {
        const excl = amt / 1.18;
        revenueExclTax += excl;
        taxCollected += amt - excl;
      }

      const code = String(p.gateway_name ?? "payu").toLowerCase();
      if (code === "payu") payuRevenue += amt;
      let item = gwMap.get(code);
      if (!item) {
        const name = code === "payu" ? "PayU" : code === "ccavenue" ? "CCAvenue" : code === "cashfree" ? "Cashfree" : code === "razorpay" ? "Razorpay" : code.toUpperCase();
        item = { code, name, revenue: 0, count: 0, isEnabled: true };
        gwMap.set(code, item);
      }
      item.revenue += amt;
      item.count += 1;
    }
    const gatewaysCollected = Array.from(gwMap.values()).sort((a, b) => b.revenue - a.revenue);
    const paidOrders = paidAppIds.size;

    // Email delivery deduplicated by message_id
    const latestByMsg = new Map<string, string>();
    for (const r of (emailLogRes.data ?? []) as Array<{ message_id: string | null; status: string }>) {
      if (!r.message_id) continue;
      latestByMsg.set(r.message_id, r.status);
    }
    let emailSent = 0, emailQueued = 0, emailFailed = 0;
    for (const s of latestByMsg.values()) {
      if (s === "sent") emailSent += 1;
      else if (s === "queued" || s === "pending" || s === "processing") emailQueued += 1;
      else if (s === "failed" || s === "dlq" || s === "bounced") emailFailed += 1;
    }

    // Staff activity
    const staffTotal = new Set(((staffRolesRes.data ?? []) as Array<{ user_id: string }>).map((r) => r.user_id)).size;
    const staffRoleIds = new Set(((staffRolesRes.data ?? []) as Array<{ user_id: string }>).map((r) => r.user_id));
    let authRows: Array<{ id: string; last_sign_in_at: string | null }> = [];
    try {
      const { data: userData } = await (admin as any).auth.admin.listUsers({ page: 1, perPage: 100 });
      authRows = ((userData?.users ?? []) as Array<{ id: string; last_sign_in_at: string | null }>).map((u) => ({
        id: u.id,
        last_sign_in_at: u.last_sign_in_at ?? null,
      }));
    } catch {
      // ignore
    }
    const staffActiveToday = authRows.filter((u) => staffRoleIds.has(u.id) && u.last_sign_in_at && u.last_sign_in_at >= todayStartIso).length;
    const staffInactive = Math.max(0, staffTotal - staffActiveToday);

    // Orders not contacted
    const uncontactedApps = (uncontactedAppsRes.data ?? []) as Array<{ id: string; created_at: string; lead_id: string | null }>;
    const leadIdsToCheck = uncontactedApps.map((a) => a.lead_id).filter((id): id is string => !!id);
    let contactedLeadSet = new Set<string>();
    if (leadIdsToCheck.length > 0) {
      try {
        const { data: contactedEvents } = await admin
          .from("lead_contact_events")
          .select("lead_id")
          .in("lead_id", leadIdsToCheck.slice(0, 500));
        contactedLeadSet = new Set(((contactedEvents ?? []) as Array<{ lead_id: string }>).map((e) => e.lead_id));
      } catch {
        // ignore
      }
    }
    const realUncontacted = uncontactedApps.filter((a) => !a.lead_id || !contactedLeadSet.has(a.lead_id));
    const ordersNotContacted3h = realUncontacted.length;
    const ordersNotContacted5h = realUncontacted.filter((a) => a.created_at < fiveHoursAgoIso).length;

    // Numbers & rates
    const leadsCurrent = leadsCur.count ?? 0;
    const leadsPrev = leadsPrevRes.count ?? 0;
    const uniqueLeads = uniqueLeadsRes.count ?? 0;
    const uniqueLeadsPrev = uniqueLeadsPrevRes.count ?? 0;
    const prevPaidRows = (paidPaymentsPrevRes.data ?? []) as Array<{ amount: number }>;
    const revenuePrev = prevPaidRows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
    const paidOrdersPrev = prevPaidRows.length;
    const paidLeads = paidLeadsInRangeRes.count ?? 0;
    const conversionRate = leadsCurrent > 0 ? Math.round((paidLeads / leadsCurrent) * 1000) / 10 : 0;
    const conversionRateV2 = uniqueLeads > 0 ? Math.round((paidOrders / uniqueLeads) * 1000) / 10 : 0;
    const conversionRatePrev = uniqueLeadsPrev > 0 ? Math.round((paidOrdersPrev / uniqueLeadsPrev) * 1000) / 10 : 0;
    const avgOrderValue = paidOrders > 0 ? Math.round(revenueInclTax / paidOrders) : 0;
    const repeatedLeads = repeatedLeadsRes.count ?? 0;

    const payuMode = process.env.PAYU_MODE ?? "test";
    const payuLive = payuRevenue > 0 || paidRows.some((p) => p.gateway_name === "payu");

    const queueRows = (emailQueueCountsRes.data ?? []) as { status: string }[];
    const queueDepth = queueRows.filter((r) => r.status === "queued" || r.status === "failed").length;

    const result: DashboardKpisResult = {
      range: { preset, startIso, endIso, label: presetLabel(preset) },
      kpis: {
        leadsCurrent,
        leadsPrev,
        revenueCurrent: revenueInclTax,
        revenuePrev,
        paidPayments: paidRows.length,
        openApplications: openAppsRes.count ?? 0,
        documentsPending: docsPendingRes.count ?? 0,
        certificatesInRange: certsInRangeRes.count ?? 0,
        emailQueueDepth: queueDepth,
        totalCustomers: totalCustomersRes.count ?? 0,
        activeStaff: staffTotal,
        conversionRate,
        repeatedLeads,
        avgOrderValue,
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
        payuRevenue,
      },
      gatewaysCollected,
      payu: { mode: payuMode, isProduction: payuMode === "production" },
    };

    setToCache(cacheKey, result, 30);
    return result;
  });

/* -------------------- 2. Chart & Trend Sub-Query (60s cache) -------------------- */

export const getDashboardCharts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput | undefined) => input ?? { preset: "today" as RangePreset })
  .handler(async ({ data, context }): Promise<DashboardChartsResult> => {
    await requireAdminOrSuper(context.supabase, context.userId);
    const cacheKey = `dash_charts_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
    const cached = getFromCache<DashboardChartsResult>(cacheKey);
    if (cached) return cached;

    const admin = await getAdmin();
    const { start, end } = resolveRange(data);
    const startIso = start.toISOString();
    const endIso = end.toISOString();

    const [payTrend, leadsTrend, ordersTrend] = await Promise.all([
      admin.from("payments").select("amount, created_at, payment_date").eq("status", "paid").gte("created_at", startIso).lt("created_at", endIso).limit(10000),
      admin.from("leads").select("id, created_at").gte("created_at", startIso).lt("created_at", endIso).limit(10000),
      admin.from("applications").select("id, created_at").eq("is_deleted", false).gte("created_at", startIso).lt("created_at", endIso).limit(10000),
    ]);

    const days: string[] = [];
    const leadsByDay: Record<string, number> = {};
    const ordersByDay: Record<string, number> = {};
    const revByDay: Record<string, number> = {};
    {
      const firstDay = istDayStartUtc(start);
      const lastDay = istDayStartUtc(end);
      for (let cur = firstDay; cur.getTime() <= lastDay.getTime(); cur = addDays(cur, 1)) {
        const key = getIstDateKey(cur);
        if (key && !days.includes(key)) {
          days.push(key);
          leadsByDay[key] = 0;
          ordersByDay[key] = 0;
          revByDay[key] = 0;
        }
      }
      if (days.length > 366) days.length = 366;
    }

    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
    const leadsByHour: Record<string, number> = {};
    const ordersByHour: Record<string, number> = {};
    const revByHour: Record<string, number> = {};
    hours.forEach((h) => {
      leadsByHour[h] = 0;
      ordersByHour[h] = 0;
      revByHour[h] = 0;
    });

    for (const r of (leadsTrend.data ?? []) as Array<{ created_at: string }>) {
      const dk = getIstDateKey(r.created_at);
      if (dk in leadsByDay) leadsByDay[dk]! += 1;
      const hk = getIstHourKey(r.created_at);
      if (hk in leadsByHour) leadsByHour[hk]! += 1;
    }

    for (const r of (ordersTrend.data ?? []) as Array<{ created_at: string }>) {
      const dk = getIstDateKey(r.created_at);
      if (dk in ordersByDay) ordersByDay[dk]! += 1;
      const hk = getIstHourKey(r.created_at);
      if (hk in ordersByHour) ordersByHour[hk]! += 1;
    }

    for (const r of (payTrend.data ?? []) as Array<{ amount: number; created_at: string; payment_date?: string | null }>) {
      const dateVal = r.payment_date || r.created_at;
      const dk = getIstDateKey(dateVal);
      if (dk in revByDay) revByDay[dk]! += Number(r.amount ?? 0);
      const hk = getIstHourKey(dateVal);
      if (hk in revByHour) revByHour[hk]! += Number(r.amount ?? 0);
    }

    const result: DashboardChartsResult = {
      days,
      leads: days.map((k) => leadsByDay[k] ?? 0),
      orders: days.map((k) => ordersByDay[k] ?? 0),
      revenueInr: days.map((k) => revByDay[k] ?? 0),
      hourly: {
        hours,
        leads: hours.map((hk) => leadsByHour[hk] ?? 0),
        orders: hours.map((hk) => ordersByHour[hk] ?? 0),
        revenueInr: hours.map((hk) => revByHour[hk] ?? 0),
      },
    };

    setToCache(cacheKey, result, 60);
    return result;
  });

/* -------------------- 3. Top Services Sub-Query (60s cache) -------------------- */

export const getDashboardTopServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput | undefined) => input ?? { preset: "today" as RangePreset })
  .handler(async ({ data, context }): Promise<DashboardTopServicesResult> => {
    await requireAdminOrSuper(context.supabase, context.userId);
    const cacheKey = `dash_top_svc_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
    const cached = getFromCache<DashboardTopServicesResult>(cacheKey);
    if (cached) return cached;

    const admin = await getAdmin();
    const { start, end } = resolveRange(data);
    const startIso = start.toISOString();
    const endIso = end.toISOString();

    const topServicesRes = await admin
      .from("applications")
      .select("service_id, leads!fk_applications_lead(total_amount), services(service_name)")
      .eq("is_deleted", false)
      .gte("created_at", startIso)
      .lt("created_at", endIso)
      .limit(2000);

    const topMap = new Map<string, { name: string; orders: number; revenueInr: number }>();
    for (const r of (topServicesRes.data ?? []) as Array<{ leads: any; services: any }>) {
      const svc = Array.isArray(r.services) ? r.services[0] : r.services;
      const lead = Array.isArray(r.leads) ? r.leads[0] : r.leads;
      const name = svc?.service_name || "Unknown";
      const cur = topMap.get(name) ?? { name, orders: 0, revenueInr: 0 };
      cur.orders += 1;
      cur.revenueInr += Number(lead?.total_amount ?? 0);
      topMap.set(name, cur);
    }
    const result = Array.from(topMap.values())
      .sort((a, b) => b.revenueInr - a.revenueInr)
      .slice(0, 6);

    setToCache(cacheKey, result, 60);
    return result;
  });

/* -------------------- 4. Secondary Features Sub-Query (60s cache) -------------------- */

export const getDashboardSecondary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput | undefined) => input ?? { preset: "today" as RangePreset })
  .handler(async ({ data, context }): Promise<DashboardSecondaryResult> => {
    await requireAdminOrSuper(context.supabase, context.userId);
    const cacheKey = `dash_secondary_${data?.preset ?? "today"}_${data?.fromIso ?? ""}_${data?.toIso ?? ""}`;
    const cached = getFromCache<DashboardSecondaryResult>(cacheKey);
    if (cached) return cached;

    const admin = await getAdmin();
    const { start, end } = resolveRange(data);
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const dayAgoIso = new Date(Date.now() - 86_400_000).toISOString();

    const [
      wfExternalDelay, wfOnHold, wfRefundPending, wfRemindersDue, wfClosedInRange,
      emailCounts, activity, webhookErrs,
    ] = await Promise.all([
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["external_dependency", "government_portal_pending"]),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["waiting_for_customer", "waiting_for_documents", "customer_non_responsive"]),
      admin.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("workflow_reminders").select("id", { count: "exact", head: true }).eq("status", "pending").lte("due_at", new Date().toISOString()),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["closed", "cancelled", "refund_closed"]).gte("updated_at", startIso).lt("updated_at", endIso),
      admin.from("email_queue").select("status"),
      admin.from("activity_logs").select("id, activity_description, created_at").order("created_at", { ascending: false }).limit(30),
      admin.from("webhook_error_log").select("id", { count: "exact", head: true }).gte("created_at", dayAgoIso),
    ]);

    const queueRows = (emailCounts.data ?? []) as { status: string }[];
    const queue = {
      queued: queueRows.filter((r) => r.status === "queued").length,
      processing: queueRows.filter((r) => r.status === "processing").length,
      failed: queueRows.filter((r) => r.status === "failed").length,
      sent: queueRows.filter((r) => r.status === "sent").length,
    };

    const payuMode = process.env.PAYU_MODE ?? "test";
    const alerts: SuperAdminOverview["alerts"] = [];
    if (payuMode !== "production") {
      alerts.push({ id: "payu-mode", severity: "high", message: `PayU running in '${payuMode}' mode — switch to 'production' before launch.` });
    }
    if (queue.failed > 0) {
      alerts.push({ id: "email-failed", severity: "med", message: `${queue.failed} email(s) in failed state — investigate or replay.` });
    }
    if ((webhookErrs.count ?? 0) > 0) {
      alerts.push({ id: "webhook-fail", severity: "med", message: `${webhookErrs.count} webhook failures in last 24h.` });
    }

    const result: DashboardSecondaryResult = {
      emailQueue: queue,
      alerts,
      activity: ((activity.data ?? []) as Array<{ id: string; activity_description: string | null; created_at: string }>)
        .map((r) => ({ id: r.id, description: r.activity_description ?? "(no description)", created_at: r.created_at })),
      webhookFailures24h: webhookErrs.count ?? 0,
      workflow: {
        externalDelay: wfExternalDelay.count ?? 0,
        onHold: wfOnHold.count ?? 0,
        refundPending: wfRefundPending.count ?? 0,
        remindersDue: wfRemindersDue.count ?? 0,
        closedInRange: wfClosedInRange.count ?? 0,
      },
    };

    setToCache(cacheKey, result, 60);
    return result;
  });

/* -------------------- 5. Combined Overview for Backwards-Compatibility -------------------- */

export const getSuperAdminOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput | undefined) => input ?? { preset: "today" as RangePreset })
  .handler(async ({ data, context }): Promise<SuperAdminOverview> => {
    await requireAdminOrSuper(context.supabase, context.userId);
    const [kpisRes, chartRes, topSvcRes, secondaryRes] = await Promise.all([
      getDashboardKpis({ data }),
      getDashboardCharts({ data }),
      getDashboardTopServices({ data }),
      getDashboardSecondary({ data }),
    ]);

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
      workflow: secondaryRes.workflow,
    };
  });

/* -------------------- Super-admin only mutations -------------------- */

export const processEmailQueueNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireSuper(context.supabase, context.userId);
    const { processQueueInternal } = await import("@/lib/emails/emails.server");
    return await processQueueInternal(100);
  });

export const seedMissingEmailTemplates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireSuper(context.supabase, context.userId);
    const admin = await getAdmin();
    const seeds: Array<{ code: string; name: string; subject: string; body_html: string; variables: string[] }> = [
      {
        code: "document_submission_approved",
        name: "Documents Approved",
        subject: "Your documents have been verified — {{service_name}}",
        body_html: "<p>Dear {{customer_name}},</p><p>We have verified your documents for <strong>{{service_name}}</strong>. Our team will now proceed with processing your application.</p>",
        variables: ["customer_name", "service_name", "order_number"],
      },
      {
        code: "document_submission_needs_changes",
        name: "Documents Need Changes",
        subject: "Action required: Update your documents for {{service_name}}",
        body_html: "<p>Dear {{customer_name}},</p><p>Your submission for <strong>{{service_name}}</strong> requires some changes:<br>{{change_notes}}</p><p>Please re-upload the corrected documents.</p>",
        variables: ["customer_name", "service_name", "change_notes", "form_link"],
      },
      {
        code: "complaint_resolution",
        name: "Complaint Resolved",
        subject: "Your complaint {{complaint_number}} has been resolved",
        body_html: "<p>Dear {{customer_name}},</p><p>Your complaint ({{complaint_number}}) has been resolved. Resolution: {{resolution_notes}}</p>",
        variables: ["customer_name", "complaint_number", "resolution_notes"],
      },
    ];
    let inserted = 0;
    for (const s of seeds) {
      const { error } = await admin.from("email_templates").insert({ ...s, is_enabled: true, is_system: true } as never);
      if (!error) inserted += 1;
    }
    return { ok: true, inserted, total: seeds.length };
  });
