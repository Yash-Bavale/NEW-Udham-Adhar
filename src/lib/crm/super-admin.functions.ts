// Executive / SuperAdmin dashboard data source.
// - Range-aware: today / yesterday / 7d / 30d / mtd / custom (all in IST).
// - Day boundary = 00:00 Asia/Kolkata.
// - Read open to admin + super_admin. Mutations stay super_admin only.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}
function istDayKey(d: Date): string {
  const ist = new Date(d.getTime() + IST_OFFSET_MS);
  return ist.toISOString().slice(0, 10);
}

export type RangePreset = "today" | "yesterday" | "7d" | "30d" | "mtd" | "custom";

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

/* -------------------- Output type -------------------- */

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
  /** v2 executive metrics — used by the modern KPI grid. */
  metrics: {
    uniqueLeads: number;
    uniqueLeadsPrev: number;
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
  trend: {
    days: string[];
    leads: number[];
    revenueInr: number[];
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

function presetLabel(p: RangePreset): string {
  switch (p) {
    case "today": return "Today";
    case "yesterday": return "Yesterday";
    case "7d": return "Last 7 days";
    case "30d": return "Last 30 days";
    case "mtd": return "Month to date";
    case "custom": return "Custom range";
  }
}

/* -------------------- Main query -------------------- */

export const getSuperAdminOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RangeInput | undefined) => input ?? { preset: "today" as RangePreset })
  .handler(async ({ data, context }): Promise<SuperAdminOverview> => {
    await requireAdminOrSuper(context.supabase, context.userId);
    const admin = await getAdmin();

    const { start, end, prevStart, prevEnd, preset } = resolveRange(data);
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const prevStartIso = prevStart.toISOString();
    const prevEndIso = prevEnd.toISOString();
    const dayAgoIso = new Date(Date.now() - 86_400_000).toISOString();

    const [
      leadsCur, leadsPrevRes,
      payCur, payPrev,
      payTrend, leadsTrend,
      openApps, docsPending, certsInRange, emailCounts, activity, webhookErrs,
      totalCustomers, staffRoles,
      paidLeadsInRange,
      topServicesRes,
      wfExternalDelay, wfOnHold, wfRefundPending, wfRemindersDue, wfClosedInRange,
    ] = await Promise.all([
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso),
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", prevStartIso).lt("created_at", prevEndIso),
      admin.from("payments").select("amount").eq("status", "paid").gte("created_at", startIso).lt("created_at", endIso),
      admin.from("payments").select("amount").eq("status", "paid").gte("created_at", prevStartIso).lt("created_at", prevEndIso),
      admin.from("payments").select("amount, created_at").eq("status", "paid").gte("created_at", startIso).lt("created_at", endIso),
      admin.from("leads").select("id, created_at").gte("created_at", startIso).lt("created_at", endIso),
      admin.from("applications").select("id", { count: "exact", head: true })
        .in("application_status", ["under_process", "under_review", "details_pending", "documents_pending"]),
      admin.from("applications").select("id", { count: "exact", head: true }).eq("application_status", "documents_pending"),
      admin.from("certificates").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso),
      admin.from("email_queue").select("status"),
      admin.from("activity_logs").select("id, activity_description, created_at").order("created_at", { ascending: false }).limit(60),
      admin.from("webhook_error_log").select("id", { count: "exact", head: true }).gte("created_at", dayAgoIso),
      admin.from("customers").select("id", { count: "exact", head: true }),
      admin.from("user_roles").select("user_id"),
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso).eq("status", "payment_successful"),
      admin.from("applications").select("service_id, leads!fk_applications_lead(total_amount), services(service_name)").eq("is_deleted", false).gte("created_at", startIso).lt("created_at", endIso).limit(2000),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["external_dependency", "government_portal_pending"]),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["waiting_for_customer", "waiting_for_documents", "customer_non_responsive"]),
      admin.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("workflow_reminders").select("id", { count: "exact", head: true }).eq("status", "pending").lte("due_at", new Date().toISOString()),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["closed", "cancelled", "refund_closed"]).gte("updated_at", startIso).lt("updated_at", endIso),
    ]);

    const sumPaid = (rows: any[] | null | undefined) =>
      (rows ?? []).reduce((s: number, r: any) => s + Number(r.amount ?? 0), 0);
    const revenueCurrent = sumPaid(payCur.data);
    const revenuePrev = sumPaid(payPrev.data);
    const paidPayments = (payCur.data ?? []).length;

    // ---- Build daily trend buckets between start and end (IST days) ----
    const days: string[] = [];
    const leadsByDay: Record<string, number> = {};
    const revByDay: Record<string, number> = {};
    {
      const firstDay = istDayStartUtc(start);
      const lastDay = istDayStartUtc(end);
      for (let cur = firstDay; cur.getTime() <= lastDay.getTime(); cur = addDays(cur, 1)) {
        const key = istDayKey(cur);
        days.push(key);
        leadsByDay[key] = 0;
        revByDay[key] = 0;
      }
      // safety cap
      if (days.length > 366) days.length = 366;
    }
    for (const r of (leadsTrend.data ?? []) as Array<{ created_at: string }>) {
      const k = istDayKey(new Date(r.created_at));
      if (k in leadsByDay) leadsByDay[k]! += 1;
    }
    for (const r of (payTrend.data ?? []) as Array<{ amount: number; created_at: string }>) {
      const k = istDayKey(new Date(r.created_at));
      if (k in revByDay) revByDay[k]! += Number(r.amount ?? 0);
    }

    // ---- Top services ----
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
    const topServicesArr = Array.from(topMap.values())
      .sort((a, b) => b.revenueInr - a.revenueInr)
      .slice(0, 6);

    // ---- Email queue snapshot ----
    const queueRows = (emailCounts.data ?? []) as { status: string }[];
    const queue = {
      queued: queueRows.filter((r) => r.status === "queued").length,
      processing: queueRows.filter((r) => r.status === "processing").length,
      failed: queueRows.filter((r) => r.status === "failed").length,
      sent: queueRows.filter((r) => r.status === "sent").length,
    };

    // ---- Alerts ----
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

    const leadsCurrent = leadsCur.count ?? 0;
    const leadsPrev = leadsPrevRes.count ?? 0;
    const paidLeads = paidLeadsInRange.count ?? 0;
    const conversionRate = leadsCurrent > 0 ? Math.round((paidLeads / leadsCurrent) * 1000) / 10 : 0;
    const uniqueStaff = new Set(((staffRoles.data ?? []) as Array<{ user_id: string }>).map((r) => r.user_id)).size;
    const avgOrderValue = paidPayments > 0 ? Math.round(revenueCurrent / paidPayments) : 0;

    // ---- Repeated leads (same customer, filled the form more than once
    // inside the selected range). We rely on the `is_duplicate` flag already
    // maintained by src/lib/leads.functions.ts (dedupes by mobile OR email
    // within 30 days) so the count reflects "same customer, multiple
    // submissions" — not distinct rows in the leads table.
    let repeatedLeads = 0;
    {
      const { count } = await admin
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("is_duplicate", true)
        .gte("created_at", startIso)
        .lt("created_at", endIso);
      repeatedLeads = count ?? 0;
    }

    // ---------- v2 executive metrics ----------
    const now = new Date();
    const nowIso = now.toISOString();
    const threeHoursAgoIso = new Date(now.getTime() - 3 * 3600 * 1000).toISOString();
    const fiveHoursAgoIso = new Date(now.getTime() - 5 * 3600 * 1000).toISOString();
    const threeDaysAgoIso = new Date(now.getTime() - 3 * 86_400_000).toISOString();
    const sevenDaysAgoIso = new Date(now.getTime() - 7 * 86_400_000).toISOString();
    const todayStartIso = istDayStartUtc(now).toISOString();

    const [
      uniqueLeadsRes, uniqueLeadsPrevRes,
      leadStatusRowsRes,
      leadAttrInRange,
      paidPaymentsRes, paidPaymentsPrevRes,
      technicalDelayRes, customerDelayRes, formNotSubmittedRes,
      ticketsRaisedRes, ticketsRaisedPrevRes, ticketsActiveRes, ticketsClosedRes, ticketsPending3dRes,
      refundAcceptedRes, refundRejectedRes,
      emailLogRes,
      staffAuthRes,
      allPaidAppIdsRes,
      payuRevRes,
      contactedLeadIdsRes,
    ] = await Promise.all([
      admin.from("leads").select("id", { count: "exact", head: true }).eq("is_duplicate", false).gte("created_at", startIso).lt("created_at", endIso),
      admin.from("leads").select("id", { count: "exact", head: true }).eq("is_duplicate", false).gte("created_at", prevStartIso).lt("created_at", prevEndIso),
      admin.from("leads").select("status").eq("is_duplicate", false).gte("created_at", startIso).lt("created_at", endIso).limit(10000),
      admin.from("lead_attribution").select("lead_id, first_contact_at, converted_at, leads!inner(created_at)").gte("leads.created_at", startIso).lt("leads.created_at", endIso).limit(5000),
      admin.from("payments").select("application_id, amount, base_amount, gst_amount, gateway_name, applications(order_status, fulfillment_status)").eq("status", "paid").gte("created_at", startIso).lt("created_at", endIso).limit(5000),
      admin.from("payments").select("application_id", { count: "exact", head: true }).eq("status", "paid").gte("created_at", prevStartIso).lt("created_at", prevEndIso),
      admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).eq("fulfillment_status", "technical_delay"),
      admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).eq("fulfillment_status", "customer_delay"),
      admin.from("applications").select("id", { count: "exact", head: true }).eq("is_deleted", false).in("fulfillment_status", ["awaiting_customer_form", "waiting_for_customer_submission"]),
      admin.from("support_tickets").select("id", { count: "exact", head: true }).gte("created_at", startIso).lt("created_at", endIso),
      admin.from("support_tickets").select("id", { count: "exact", head: true }).gte("created_at", prevStartIso).lt("created_at", prevEndIso),
      admin.from("support_tickets").select("id", { count: "exact", head: true }).not("status", "in", "(closed,resolved)"),
      admin.from("support_tickets").select("id", { count: "exact", head: true }).in("status", ["closed", "resolved"]).gte("created_at", startIso).lt("created_at", endIso),
      admin.from("support_tickets").select("id", { count: "exact", head: true }).not("status", "in", "(closed,resolved)").lt("created_at", threeDaysAgoIso),
      admin.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "approved").gte("created_at", startIso).lt("created_at", endIso),
      admin.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "rejected").gte("created_at", startIso).lt("created_at", endIso),
      admin.from("email_send_log").select("message_id, status, created_at").gte("created_at", startIso).lt("created_at", endIso).limit(10000),
      admin.schema("auth" as never).from("users" as never).select("id, last_sign_in_at").limit(5000),
      admin.from("payments").select("application_id").eq("status", "paid").not("application_id", "is", null).limit(20000),
      admin.from("payments").select("amount").eq("status", "paid").eq("gateway_name", "payu").gte("created_at", startIso).lt("created_at", endIso).limit(10000),
      admin.from("lead_contact_events").select("lead_id").gte("created_at", startIso).lt("created_at", nowIso).limit(20000),
    ]);

    // Unique leads
    const uniqueLeads = uniqueLeadsRes.count ?? 0;
    const uniqueLeadsPrev = uniqueLeadsPrevRes.count ?? 0;

    // Leads breakdown by current status (not by lead_attribution — status is
    // what employees actually change and what the CRM shows).
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
    // Preserve the older "converted after first contact" attribution metric
    // for compatibility with the conversion-rate KPI.
    const attrRows = (leadAttrInRange.data ?? []) as Array<{ lead_id: string; first_contact_at: string | null; converted_at: string | null }>;
    let leadsConvertedAfterContact = 0;
    for (const r of attrRows) {
      if (r.first_contact_at && r.converted_at) leadsConvertedAfterContact += 1;
    }

    // Paid orders
    const paidRows = (paidPaymentsRes.data ?? []) as Array<{ application_id: string | null; amount: number; base_amount: number | null; gst_amount: number | null; gateway_name: string | null; applications: any }>;
    const paidAppIds = new Set<string>();
    let paidOrdersPending = 0;
    let paidOrdersClosed = 0;
    let revenueInclTax = 0;
    let revenueExclTax = 0;
    let taxCollected = 0;
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
        // Assume 18% GST inclusive
        const excl = amt / 1.18;
        revenueExclTax += excl;
        taxCollected += amt - excl;
      }
    }
    const paidOrders = paidAppIds.size;
    const paidOrdersPrev = paidPaymentsPrevRes.count ?? 0;

    // Universe of all paid application ids (across all time) — used to scope
    // "order" alerts and "orders not contacted" to real payment-successful orders.
    const allPaidAppIds = new Set<string>(
      ((allPaidAppIdsRes.data ?? []) as Array<{ application_id: string | null }>)
        .map((r) => r.application_id)
        .filter((id): id is string => !!id),
    );

    // Order alerts (payment-successful only, older than 3d/7d, not terminal).
    async function countAgingPaid(cutoffIso: string): Promise<number> {
      if (allPaidAppIds.size === 0) return 0;
      const ids = Array.from(allPaidAppIds);
      // Supabase caps `.in()` size; chunk into batches of 500.
      let total = 0;
      for (let i = 0; i < ids.length; i += 500) {
        const chunk = ids.slice(i, i + 500);
        const { count } = await admin
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("is_deleted", false)
          .in("id", chunk)
          .not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)")
          .lt("created_at", cutoffIso);
        total += count ?? 0;
      }
      return total;
    }
    const [ordersDelayed3d, ordersDelayed7d] = await Promise.all([
      countAgingPaid(threeDaysAgoIso),
      countAgingPaid(sevenDaysAgoIso),
    ]);

    // Email delivery (dedupe by message_id → latest status)
    const latestByMsg = new Map<string, string>();
    for (const r of (emailLogRes.data ?? []) as Array<{ message_id: string | null; status: string; created_at: string }>) {
      if (!r.message_id) continue;
      latestByMsg.set(r.message_id, r.status);
    }
    let emailSent = 0, emailQueued = 0, emailFailed = 0;
    for (const s of latestByMsg.values()) {
      if (s === "sent") emailSent += 1;
      else if (s === "queued" || s === "pending" || s === "processing") emailQueued += 1;
      else if (s === "failed" || s === "dlq" || s === "bounced") emailFailed += 1;
    }

    // Staff activity — first try auth schema, fall back to auth admin API
    // (Lovable Cloud service_role often doesn't expose auth.users via schema()).
    const staffTotal = new Set(((staffRoles.data ?? []) as Array<{ user_id: string }>).map((r) => r.user_id)).size;
    const staffRoleIds = new Set(((staffRoles.data ?? []) as Array<{ user_id: string }>).map((r) => r.user_id));
    let authRows = (staffAuthRes.data ?? []) as Array<{ id: string; last_sign_in_at: string | null }>;
    if (!authRows.length) {
      try {
        const collected: Array<{ id: string; last_sign_in_at: string | null }> = [];
        for (let page = 1; page <= 20; page += 1) {
          const { data, error } = await (admin as any).auth.admin.listUsers({ page, perPage: 200 });
          if (error) break;
          const users = (data?.users ?? []) as Array<{ id: string; last_sign_in_at: string | null }>;
          collected.push(...users.map((u) => ({ id: u.id, last_sign_in_at: u.last_sign_in_at ?? null })));
          if (users.length < 200) break;
        }
        authRows = collected;
      } catch {
        // ignore
      }
    }
    const staffActiveToday = authRows.filter((u) => staffRoleIds.has(u.id) && u.last_sign_in_at && u.last_sign_in_at >= todayStartIso).length;
    const staffInactive = Math.max(0, staffTotal - staffActiveToday);

    // Orders not contacted — payment-successful applications older than 3h
    // whose linked lead has never had a contact event.
    let uncontactedApps: Array<{ id: string; created_at: string; lead_id: string | null }> = [];
    if (allPaidAppIds.size > 0) {
      const ids = Array.from(allPaidAppIds);
      const acc: typeof uncontactedApps = [];
      for (let i = 0; i < ids.length; i += 500) {
        const chunk = ids.slice(i, i + 500);
        const { data } = await admin
          .from("applications")
          .select("id, created_at, lead_id")
          .eq("is_deleted", false)
          .in("id", chunk)
          .lt("created_at", threeHoursAgoIso)
          .limit(5000);
        acc.push(...((data ?? []) as typeof uncontactedApps));
      }
      const contactedLeadIds = new Set(((contactedLeadIdsRes.data ?? []) as Array<{ lead_id: string }>).map((r) => r.lead_id));
      uncontactedApps = acc.filter((a) => !a.lead_id || !contactedLeadIds.has(a.lead_id));
    }
    const ordersNotContacted3h = uncontactedApps.length;
    const ordersNotContacted5h = uncontactedApps.filter((a) => a.created_at < fiveHoursAgoIso).length;

    // PayU
    const payuRevenue = ((payuRevRes.data ?? []) as Array<{ amount: number }>).reduce((s, r) => s + Number(r.amount ?? 0), 0);
    const payuLive = payuRevenue > 0 || paidRows.some((p) => p.gateway_name === "payu");

    // Conversion rate v2 (paid orders / unique leads)
    const conversionRateV2 = uniqueLeads > 0 ? Math.round((paidOrders / uniqueLeads) * 1000) / 10 : 0;
    const conversionRatePrev = uniqueLeadsPrev > 0 ? Math.round(((paidOrdersPrev) / uniqueLeadsPrev) * 1000) / 10 : 0;


    return {
      range: { preset, startIso, endIso, label: presetLabel(preset) },
      kpis: {
        leadsCurrent,
        leadsPrev,
        revenueCurrent,
        revenuePrev,
        paidPayments,
        openApplications: openApps.count ?? 0,
        documentsPending: docsPending.count ?? 0,
        certificatesInRange: certsInRange.count ?? 0,
        emailQueueDepth: queue.queued + queue.failed,
        totalCustomers: totalCustomers.count ?? 0,
        activeStaff: uniqueStaff,
        conversionRate,
        repeatedLeads,
        avgOrderValue,
      },
      metrics: {
        uniqueLeads,
        uniqueLeadsPrev,
        leadsNotContacted,
        leadsContacted,
        leadsConverted,
        leadsConvertedAfterContact,
        paidOrders,
        paidOrdersPrev,
        paidOrdersPending,
        paidOrdersClosed,
        technicalDelay: technicalDelayRes.count ?? 0,
        customerDelay: customerDelayRes.count ?? 0,
        formNotSubmitted: formNotSubmittedRes.count ?? 0,
        ordersDelayed3d,
        ordersDelayed7d,
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
        webhookErrors24h: webhookErrs.count ?? 0,
        payuLive,
        payuRevenue,
      },
      trend: {
        days,
        leads: days.map((k) => leadsByDay[k] ?? 0),
        revenueInr: days.map((k) => revByDay[k] ?? 0),
      },
      topServices: topServicesArr,
      emailQueue: queue,
      payu: { mode: payuMode, isProduction: payuMode === "production" },
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
