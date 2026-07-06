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
    conversionRate: number; // paid leads / total leads inside the range
    repeatedLeads: number;
    avgOrderValue: number;
  };
  trend: {
    days: string[]; // IST YYYY-MM-DD oldest → newest
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
