import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSmtpTransport, renderTemplate } from "./smtp.server";

// ─────────────────────────── Public-server helpers ───────────────────────────
// Used internally by other server fns (createLead, payu webhook, etc.).
// Lives in a `.server.ts` file so it can never be imported into the client bundle.

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
  if (!tpl.is_enabled) return;

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

const RETRY_BACKOFF_MIN = [1, 5, 15, 60, 240];

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
