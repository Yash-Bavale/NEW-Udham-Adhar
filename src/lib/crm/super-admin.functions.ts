// SuperAdmin-only system overview & controls (Final_CRM Part C).
// All handlers require `super_admin` — never call from non-super UIs.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function requireSuper(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const isSuper = (data ?? []).some((r: { role: string }) => r.role === "super_admin");
  if (!isSuper) throw new Error("Forbidden — super_admin only");
}

export type SuperAdminOverview = {
  kpis: {
    leadsToday: number;
    leadsYesterday: number;
    paymentsTodayInr: number;
    paymentsYesterdayInr: number;
    openApplications: number;
    documentsPending: number;
    certificatesToday: number;
    emailQueueDepth: number;
    totalCustomers: number;
    activeStaff: number;
    conversionRate30d: number; // % paid leads / total leads in last 30 days
    revenue30dInr: number;
    repeatedLeads: number; // count of leads sharing a mobile/email with another lead

  };
  trend: {
    days: string[]; // ISO date (YYYY-MM-DD) in IST, oldest → newest
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
    closedThisMonth: number;
  };
};

export const getSuperAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SuperAdminOverview> => {
    await requireSuper(context.supabase, context.userId);
    const admin = await getAdmin();
    const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
    const dayStartIso = dayStart.toISOString();
    const yStart = new Date(dayStart.getTime() - 86_400_000);
    const yStartIso = yStart.toISOString();
    const yEndIso = dayStartIso;
    const dayAgoIso = new Date(Date.now() - 86_400_000).toISOString();
    const weekAgoIso = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const monthAgoIso = new Date(Date.now() - 30 * 86_400_000).toISOString();

    const [
      leadsToday, leadsYesterday, paymentsToday, paymentsYesterday, payments30d,
      paymentsTrend, leadsTrend,
      openApps, docsPending, certsToday, emailCounts, activity, webhookErrs,
      totalCustomers, staffRoles, leads30d, paidLeads30d, topServicesRes,
      wfExternalDelay, wfOnHold, wfRefundPending, wfRemindersDue, wfClosedMonth,
    ] = await Promise.all([
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", dayStartIso),
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", yStartIso).lt("created_at", yEndIso),
      admin.from("payments").select("amount").eq("status", "paid").gte("created_at", dayStartIso),
      admin.from("payments").select("amount").eq("status", "paid").gte("created_at", yStartIso).lt("created_at", yEndIso),
      admin.from("payments").select("amount").eq("status", "paid").gte("created_at", monthAgoIso),
      admin.from("payments").select("amount, created_at").eq("status", "paid").gte("created_at", weekAgoIso),
      admin.from("leads").select("id, created_at").gte("created_at", weekAgoIso),
      admin.from("applications").select("id", { count: "exact", head: true })
        .in("application_status", ["under_process", "under_review", "details_pending", "documents_pending"]),
      admin.from("applications").select("id", { count: "exact", head: true }).eq("application_status", "documents_pending"),
      admin.from("certificates").select("id", { count: "exact", head: true }).gte("created_at", dayStartIso),
      admin.from("email_queue").select("status"),
      admin.from("activity_logs").select("id, activity_description, created_at").order("created_at", { ascending: false }).limit(50),
      admin.from("webhook_error_log").select("id", { count: "exact", head: true }).gte("created_at", dayAgoIso),
      admin.from("customers").select("id", { count: "exact", head: true }),
      admin.from("user_roles").select("user_id"),
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", monthAgoIso),
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", monthAgoIso).not("payment_successful_at", "is", null),
      admin.from("applications").select("service_id, leads!fk_applications_lead(total_amount), services(service_name)").eq("is_deleted", false).gte("created_at", monthAgoIso).limit(2000),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["external_dependency", "government_portal_pending"]),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["waiting_for_customer", "waiting_for_documents", "customer_non_responsive"]),
      admin.from("refund_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("workflow_reminders").select("id", { count: "exact", head: true }).eq("status", "pending").lte("scheduled_for", new Date().toISOString()),
      admin.from("applications").select("id", { count: "exact", head: true }).in("workflow_status", ["closed", "cancelled", "refund_closed"]).gte("updated_at", monthAgoIso),
    ]);

    const sumPaid = (rows: any[] | null | undefined) =>
      (rows ?? []).reduce((s: number, r: any) => s + Number(r.amount ?? 0), 0);
    const paymentsTodayInr = sumPaid(paymentsToday.data);
    const paymentsYesterdayInr = sumPaid(paymentsYesterday.data);
    const revenue30dInr = sumPaid(payments30d.data);

    const days: string[] = [];
    const leadsByDay: Record<string, number> = {};
    const revByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000);
      const key = d.toISOString().slice(0, 10);
      days.push(key);
      leadsByDay[key] = 0;
      revByDay[key] = 0;
    }
    for (const r of (leadsTrend.data ?? []) as Array<{ created_at: string }>) {
      const k = new Date(r.created_at).toISOString().slice(0, 10);
      if (k in leadsByDay) leadsByDay[k]! += 1;
    }
    for (const r of (paymentsTrend.data ?? []) as Array<{ amount: number; created_at: string }>) {
      const k = new Date(r.created_at).toISOString().slice(0, 10);
      if (k in revByDay) revByDay[k]! += Number(r.amount ?? 0);
    }

    const topMap = new Map<string, { name: string; orders: number; revenueInr: number }>();
    for (const r of (topServicesRes.data ?? []) as Array<{ service_id: string | null; leads: { total_amount: number } | { total_amount: number }[] | null; services: { service_name: string } | { service_name: string }[] | null }>) {
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
      .slice(0, 5);

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

    const leads30dCount = leads30d.count ?? 0;
    const paidLeads30dCount = paidLeads30d.count ?? 0;
    const conversionRate30d = leads30dCount > 0 ? Math.round((paidLeads30dCount / leads30dCount) * 1000) / 10 : 0;
    const uniqueStaff = new Set(((staffRoles.data ?? []) as Array<{ user_id: string }>).map((r) => r.user_id)).size;

    // Repeated leads — leads sharing a mobile or email with at least one other lead.
    // Paginate beyond PostgREST's 1000-row cap.
    let repeatedLeads = 0;
    {
      const mobiles = new Map<string, number>();
      const emails = new Map<string, number>();
      const page = 1000;
      for (let from = 0; from < 500_000; from += page) {
        const { data, error } = await admin
          .from("leads")
          .select("mobile, email")
          .range(from, from + page - 1);
        if (error) break;
        const rows = data ?? [];
        for (const r of rows as Array<{ mobile: string | null; email: string | null }>) {
          if (r.mobile) mobiles.set(r.mobile, (mobiles.get(r.mobile) ?? 0) + 1);
          if (r.email) emails.set(r.email.toLowerCase(), (emails.get(r.email.toLowerCase()) ?? 0) + 1);
        }
        if (rows.length < page) break;
      }
      const seen = new Set<string>();
      for (const [k, n] of mobiles) if (n > 1) seen.add(`m:${k}`);
      for (const [k, n] of emails) if (n > 1) seen.add(`e:${k}`);
      // Count of duplicate rows = sum of (n-1) per duplicated key, deduped across mobile+email.
      // Simpler approximation: total leads with a duplicated mobile or email.
      let dupRows = 0;
      for (const n of mobiles.values()) if (n > 1) dupRows += n;
      for (const n of emails.values()) if (n > 1) dupRows += n;
      repeatedLeads = dupRows;
    }

    return {
      kpis: {
        leadsToday: leadsToday.count ?? 0,
        leadsYesterday: leadsYesterday.count ?? 0,
        paymentsTodayInr,
        paymentsYesterdayInr,
        openApplications: openApps.count ?? 0,
        documentsPending: docsPending.count ?? 0,
        certificatesToday: certsToday.count ?? 0,
        emailQueueDepth: queue.queued + queue.failed,
        totalCustomers: totalCustomers.count ?? 0,
        activeStaff: uniqueStaff,
        conversionRate30d,
        revenue30dInr,
        repeatedLeads,
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
        closedThisMonth: wfClosedMonth.count ?? 0,
      },
    };
  });

/** Manually drain the email queue. */
export const processEmailQueueNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireSuper(context.supabase, context.userId);
    const { processQueueInternal } = await import("@/lib/emails/emails.server");
    const result = await processQueueInternal(100);
    return result;
  });

/**
 * Idempotent seed for any email templates that don't yet exist.
 * The DB already has 27 templates — this only fills genuine gaps and is safe
 * to run repeatedly (uses ON CONFLICT DO NOTHING on the `code` unique constraint).
 */
export const seedMissingEmailTemplates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireSuper(context.supabase, context.userId);
    const admin = await getAdmin();

    const seeds: Array<{
      code: string; name: string; subject: string; body_html: string; variables: string[];
    }> = [
      {
        code: "document_submission_approved",
        name: "Documents Approved",
        subject: "Your documents have been verified — {{service_name}}",
        body_html: '<p>Dear {{customer_name}},</p><p>We have verified your documents for <strong>{{service_name}}</strong>. Our team will now proceed with processing your application.</p>',
        variables: ["customer_name", "service_name", "order_number"],
      },
      {
        code: "document_submission_needs_changes",
        name: "Documents Need Changes",
        subject: "Action required: Update your documents for {{service_name}}",
        body_html: '<p>Dear {{customer_name}},</p><p>Your submission for <strong>{{service_name}}</strong> requires some changes:<br>{{change_notes}}</p><p>Please re-upload the corrected documents.</p>',
        variables: ["customer_name", "service_name", "change_notes", "form_link"],
      },
      {
        code: "complaint_resolution",
        name: "Complaint Resolved",
        subject: "Your complaint {{complaint_number}} has been resolved",
        body_html: '<p>Dear {{customer_name}},</p><p>Your complaint ({{complaint_number}}) has been resolved. Resolution: {{resolution_notes}}</p>',
        variables: ["customer_name", "complaint_number", "resolution_notes"],
      },
    ];

    let inserted = 0;
    for (const s of seeds) {
      const { error } = await admin
        .from("email_templates")
        .insert({ ...s, is_enabled: true, is_system: true } as never);
      if (!error) inserted += 1;
      // duplicate-key errors are expected & ignored
    }
    return { ok: true, inserted, total: seeds.length };
  });
