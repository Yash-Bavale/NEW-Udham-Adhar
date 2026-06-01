import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getSmtpTransport, renderTemplate } from "./smtp.server";

// ─────────────────────────── Public-server helpers ───────────────────────────
// Used internally by other server fns (createLead, payu webhook, etc.).
// NOT exposed as callable RPCs to the browser (they have no validation chain
// the client would use).

export async function enqueueEmailInternal(input: {
  templateCode?: string | null;
  toEmail: string;
  toName?: string | null;
  subject: string;
  bodyHtml: string;
  bodyText?: string | null;
  variables?: Record<string, unknown>;
  leadId?: string | null;
  applicationId?: string | null;
}) {
  const { error } = await supabaseAdmin.from("email_queue").insert({
    template_code: input.templateCode ?? null,
    to_email: input.toEmail.toLowerCase().trim(),
    to_name: input.toName ?? null,
    subject: input.subject,
    body_html: input.bodyHtml,
    body_text: input.bodyText ?? null,
    variables: (input.variables ?? {}) as never,
    lead_id: input.leadId ?? null,
    application_id: input.applicationId ?? null,
  });
  if (error) throw new Error(error.message);
}

/** Enqueue using a template code; pulls subject/body from email_templates. */
export async function enqueueFromTemplateInternal(
  code: string,
  toEmail: string,
  variables: Record<string, unknown>,
  opts?: { toName?: string; leadId?: string; applicationId?: string },
) {
  const { data: tpl, error } = await supabaseAdmin
    .from("email_templates")
    .select("subject, body_html, body_text, is_enabled")
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!tpl) throw new Error(`Email template '${code}' not found.`);
  if (!tpl.is_enabled) return; // silently skip disabled templates

  return enqueueEmailInternal({
    templateCode: code,
    toEmail,
    toName: opts?.toName ?? null,
    subject: renderTemplate(tpl.subject, variables),
    bodyHtml: renderTemplate(tpl.body_html, variables),
    bodyText: tpl.body_text ? renderTemplate(tpl.body_text, variables) : null,
    variables,
    leadId: opts?.leadId ?? null,
    applicationId: opts?.applicationId ?? null,
  });
}

// ─────────────────────────── Queue processor ───────────────────────────

const RETRY_BACKOFF_MIN = [1, 5, 15, 60, 240]; // minutes per attempt

/** Pull up to N due rows and send. Called by cron + on-demand by admin. */
export async function processQueueInternal(limit = 20) {
  const { data: rows, error } = await supabaseAdmin
    .from("email_queue")
    .select("*")
    .in("status", ["queued", "failed"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);

  if (!rows || rows.length === 0) return { processed: 0, sent: 0, failed: 0 };

  // Verify SMTP settings + transport once per batch.
  const { data: settings } = await supabaseAdmin
    .from("smtp_settings")
    .select("from_email, from_name, reply_to, is_enabled")
    .maybeSingle();
  if (!settings?.is_enabled) {
    return { processed: 0, sent: 0, failed: 0, skipped: "smtp_disabled" };
  }

  let transport;
  try {
    transport = getSmtpTransport();
  } catch (e) {
    return { processed: 0, sent: 0, failed: 0, skipped: (e as Error).message };
  }

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    // mark sending
    await supabaseAdmin.from("email_queue").update({ status: "sending" }).eq("id", row.id);

    const attempt = (row.attempts ?? 0) + 1;
    try {
      const info = await transport.sendMail({
        from: `${settings.from_name} <${settings.from_email}>`,
        to: row.to_name ? `${row.to_name} <${row.to_email}>` : row.to_email,
        replyTo: settings.reply_to ?? undefined,
        subject: row.subject,
        html: row.body_html,
        text: row.body_text ?? undefined,
      });

      await Promise.all([
        supabaseAdmin
          .from("email_queue")
          .update({ status: "sent", attempts: attempt, sent_at: new Date().toISOString(), last_error: null })
          .eq("id", row.id),
        supabaseAdmin.from("email_logs").insert({
          queue_id: row.id,
          template_code: row.template_code,
          to_email: row.to_email,
          subject: row.subject,
          status: "sent",
          smtp_response: info.response ?? null,
          attempt,
          lead_id: row.lead_id,
          application_id: row.application_id,
        }),
      ]);
      sent++;
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Unknown error";
      const isDlq = attempt >= (row.max_attempts ?? 5);
      const delayMin = RETRY_BACKOFF_MIN[Math.min(attempt - 1, RETRY_BACKOFF_MIN.length - 1)];
      const next = new Date(Date.now() + delayMin * 60_000).toISOString();
      await Promise.all([
        supabaseAdmin
          .from("email_queue")
          .update({
            status: isDlq ? "dlq" : "failed",
            attempts: attempt,
            next_attempt_at: next,
            last_error: errMsg.slice(0, 1000),
          })
          .eq("id", row.id),
        supabaseAdmin.from("email_logs").insert({
          queue_id: row.id,
          template_code: row.template_code,
          to_email: row.to_email,
          subject: row.subject,
          status: "failed",
          error_message: errMsg.slice(0, 1000),
          attempt,
          lead_id: row.lead_id,
          application_id: row.application_id,
        }),
      ]);
      failed++;
    }
  }
  return { processed: rows.length, sent, failed };
}

// ─────────────────────────── Admin server fns ───────────────────────────

export const getEmailDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    type QStatus = "queued" | "sending" | "sent" | "failed" | "dlq";
    const counts = async (status: QStatus) => {
      const { count } = await supabase
        .from("email_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", status);
      return count ?? 0;
    };

    const [queued, sending, dlq, sent24h, sent7d, recentLogs, topErrors] = await Promise.all([
      counts("queued"),
      counts("sending"),
      counts("dlq"),
      supabase.from("email_logs").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", since24h).then((r) => r.count ?? 0),
      supabase.from("email_logs").select("*", { count: "exact", head: true }).eq("status", "sent").gte("sent_at", since7d).then((r) => r.count ?? 0),
      supabase.from("email_logs").select("id, to_email, subject, status, error_message, sent_at, template_code").order("sent_at", { ascending: false }).limit(20),
      supabase.from("email_queue").select("id, to_email, subject, last_error, attempts").eq("status", "dlq").order("updated_at", { ascending: false }).limit(10),
    ]);

    return {
      counts: { queued, sending, dlq, sent24h, sent7d },
      recentLogs: recentLogs.data ?? [],
      dlqRows: topErrors.data ?? [],
    };
  });

export const getSmtpSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("smtp_settings")
      .select("id, from_email, from_name, reply_to, daily_quota, is_enabled, notes, updated_at")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      settings: data,
      hasSmtpHost: Boolean(process.env.SMTP_HOST),
      hasSmtpUser: Boolean(process.env.SMTP_USER),
      hasSmtpPass: Boolean(process.env.SMTP_PASS),
    };
  });

const SmtpInput = z.object({
  from_email: z.string().email().max(160),
  from_name: z.string().trim().min(1).max(120),
  reply_to: z.string().email().max(160).nullable().optional(),
  daily_quota: z.number().int().min(0).max(100_000),
  is_enabled: z.boolean(),
  notes: z.string().max(1000).nullable().optional(),
});

export const saveSmtpSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SmtpInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase.from("smtp_settings").select("id").maybeSingle();
    const payload = { ...data, updated_by: userId };
    if (existing) {
      const { error } = await supabase.from("smtp_settings").update(payload).eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("smtp_settings").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ toEmail: z.string().email(), subject: z.string().min(1).max(200).optional() }).parse(i),
  )
  .handler(async ({ data }) => {
    await enqueueEmailInternal({
      toEmail: data.toEmail,
      subject: data.subject ?? "SMTP test from Business Help Services",
      bodyHtml:
        "<p>This is a test email sent from the admin email console.</p><p>If you received this, SMTP is configured correctly.</p>",
      bodyText: "This is a test email. If you received this, SMTP is configured correctly.",
    });
    // Process immediately so admin sees feedback fast
    const result = await processQueueInternal(5);
    return { queued: true, ...result };
  });

export const processEmailQueueNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    return await processQueueInternal(50);
  });

// ── Template management ──
export const listEmailTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("email_templates")
      .select("id, code, name, subject, body_html, body_text, description, variables, is_enabled, is_system, updated_at")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

const TemplateInput = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(2).max(80).regex(/^[a-z0-9_]+$/, "code must be lowercase a-z, 0-9, _"),
  name: z.string().trim().min(2).max(120),
  subject: z.string().trim().min(2).max(200),
  body_html: z.string().min(2).max(50_000),
  body_text: z.string().max(50_000).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  variables: z.array(z.string().max(60)).max(50).default([]),
  is_enabled: z.boolean().default(true),
});

export const saveEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => TemplateInput.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.id) {
      const { id, ...patch } = data;
      const { error } = await supabase.from("email_templates").update(patch).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { data: row, error } = await supabase
      .from("email_templates")
      .insert({ ...data, created_by: userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const duplicateEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: src, error } = await supabase.from("email_templates").select("*").eq("id", data.id).single();
    if (error || !src) throw new Error(error?.message ?? "Template not found");
    const newCode = `${src.code}_copy_${Date.now().toString(36)}`.slice(0, 80);
    const { data: row, error: insErr } = await supabase
      .from("email_templates")
      .insert({
        code: newCode,
        name: `${src.name} (copy)`,
        subject: src.subject,
        body_html: src.body_html,
        body_text: src.body_text,
        description: src.description,
        variables: src.variables,
        is_enabled: false,
        is_system: false,
        created_by: userId,
      })
      .select("id")
      .single();
    if (insErr) throw new Error(insErr.message);
    return { ok: true, id: row.id };
  });

export const deleteEmailTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: src } = await supabase.from("email_templates").select("is_system").eq("id", data.id).maybeSingle();
    if (src?.is_system) throw new Error("System templates cannot be deleted. Disable instead.");
    const { error } = await supabase.from("email_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ── Logs ──
const LogsInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(50),
  search: z.string().trim().max(200).optional(),
  status: z.enum(["sent", "failed", "bounced"]).optional(),
});

export const listEmailLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LogsInput.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = supabase
      .from("email_logs")
      .select("id, to_email, subject, status, error_message, smtp_response, attempt, template_code, sent_at", { count: "exact" })
      .order("sent_at", { ascending: false })
      .range(from, to);
    if (data.status) q = q.eq("status", data.status);
    if (data.search) {
      const s = data.search.replace(/[,()]/g, " ").trim();
      q = q.or(`to_email.ilike.%${s}%,subject.ilike.%${s}%`);
    }
    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });
