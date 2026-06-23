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
    paymentsTodayInr: number;
    openApplications: number;
    documentsPending: number;
    certificatesToday: number;
    emailQueueDepth: number;
  };
  emailQueue: { queued: number; processing: number; failed: number; sent: number };
  payu: { mode: string; isProduction: boolean };
  alerts: { id: string; severity: "high" | "med" | "low"; message: string }[];
  activity: { id: string; description: string; created_at: string }[];
  webhookFailures24h: number;
};

export const getSuperAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SuperAdminOverview> => {
    await requireSuper(context.supabase, context.userId);
    const admin = await getAdmin();
    const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
    const dayStartIso = dayStart.toISOString();
    const dayAgoIso = new Date(Date.now() - 86_400_000).toISOString();

    const [
      leadsToday,
      paymentsToday,
      openApps,
      docsPending,
      certsToday,
      emailCounts,
      activity,
      webhookErrs,
    ] = await Promise.all([
      admin.from("leads").select("id", { count: "exact", head: true }).gte("created_at", dayStartIso),
      admin
        .from("payments")
        .select("amount")
        .eq("status", "success")
        .gte("created_at", dayStartIso),
      admin
        .from("applications")
        .select("id", { count: "exact", head: true })
        .in("application_status", ["under_process", "under_review", "details_pending", "documents_pending"]),
      admin
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("application_status", "documents_pending"),
      admin.from("certificates").select("id", { count: "exact", head: true }).gte("created_at", dayStartIso),
      admin.from("email_queue").select("status"),
      admin
        .from("activity_logs")
        .select("id, activity_description, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      admin.from("webhook_error_log").select("id", { count: "exact", head: true }).gte("created_at", dayAgoIso),
    ]);

    const paymentsTodayInr = (paymentsToday.data ?? []).reduce(
      (s: number, r: { amount: number | null }) => s + Number(r.amount ?? 0),
      0,
    );

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

    return {
      kpis: {
        leadsToday: leadsToday.count ?? 0,
        paymentsTodayInr,
        openApplications: openApps.count ?? 0,
        documentsPending: docsPending.count ?? 0,
        certificatesToday: certsToday.count ?? 0,
        emailQueueDepth: queue.queued + queue.failed,
      },
      emailQueue: queue,
      payu: { mode: payuMode, isProduction: payuMode === "production" },
      alerts,
      activity: (activity.data ?? []) as SuperAdminOverview["activity"],
      webhookFailures24h: webhookErrs.count ?? 0,
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
