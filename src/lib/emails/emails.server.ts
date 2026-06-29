import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { renderTemplate } from "./smtp.server";
import { sendViaZoho } from "./zoho-smtp.server";

/** Strip HTML → plain-text fallback. Lovable email API rejects empty `text`. */
function htmlToPlainText(html: string | null | undefined): string {
  if (!html) return "";
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/(p|div|li|tr|h[1-6]|br)>/gi, "\n")
    .replace(/<br\s*\/?>(?!\n)/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


// ─────────────────────────── Public-server helpers ───────────────────────────
// Used internally by other server fns (createLead, payu webhook, etc.).
// Lives in a `.server.ts` file so it can never be imported into the client bundle.

export type EmailAttachment = {
  filename: string;
  content_base64: string;
  content_type: string;
};

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
  delaySeconds?: number;
  attachments?: EmailAttachment[];
  requireImmediateSuccess?: boolean;
}) {
  const variables: Record<string, unknown> = { ...(input.variables ?? {}) };
  if (input.attachments && input.attachments.length > 0) {
    variables.__attachments = input.attachments;
  }
  const scheduled = input.delaySeconds && input.delaySeconds > 0
    ? new Date(Date.now() + input.delaySeconds * 1000).toISOString()
    : null;

  const row: Record<string, unknown> = {
    template_code: input.templateCode ?? null,
    to_email: input.toEmail.toLowerCase().trim(),
    to_name: input.toName ?? null,
    subject: input.subject,
    body_html: input.bodyHtml,
    body_text: input.bodyText ?? null,
    variables,
    lead_id: input.leadId ?? null,
    application_id: input.applicationId ?? null,
  };
  if (scheduled) {
    row.scheduled_at = scheduled;
    row.next_attempt_at = scheduled;
  }
  const { data: inserted, error } = await supabaseAdmin
    .from("email_queue")
    .insert(row as never)
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const baseResult = {
    queueId: (inserted?.id as string | undefined) ?? null,
    scheduled: Boolean(scheduled),
    sent: false,
  };

  // Send immediately unless explicitly scheduled for the future.
  if (!scheduled && inserted?.id) {
    try {
      const sendResult = await sendQueueRowById(inserted.id as string);
      const skipped = Boolean((sendResult as { skipped?: boolean })?.skipped);
      const sent = Boolean((sendResult as { ok?: boolean })?.ok && !skipped);
      if (!sent && input.requireImmediateSuccess) {
        const message = skipped
          ? "Email template is disabled — email was not sent."
          : (sendResult as { error?: string })?.error || "Email was queued but not sent.";
        throw new Error(message);
      }
      return { ...baseResult, sent, sendResult };
    } catch (e) {
      if (input.requireImmediateSuccess) throw e;
      // Failures are already recorded on the row by sendQueueRowById; the
      // background processor (if any) will retry per backoff policy.
    }
  }

  return baseResult;
}


/** Enqueue using a template code; pulls subject/body from email_templates. */
export async function enqueueFromTemplateInternal(
  code: string,
  toEmail: string,
  variables: Record<string, unknown>,
  opts?: { toName?: string; leadId?: string; applicationId?: string; delaySeconds?: number; attachments?: EmailAttachment[]; requireImmediateSuccess?: boolean },
) {
  const { data: tpl, error } = await supabaseAdmin
    .from("email_templates")
    .select("subject, body_html, body_text, is_enabled")
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!tpl) throw new Error(`Email template '${code}' not found.`);
  if (!tpl.is_enabled) {
    if (opts?.requireImmediateSuccess) {
      throw new Error(`Email template '${code}' is disabled — email was not sent.`);
    }
    return;
  }

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
    delaySeconds: opts?.delaySeconds,
    attachments: opts?.attachments,
    requireImmediateSuccess: opts?.requireImmediateSuccess,
  });
}

/**
 * Recover rows stranded in `status='sending'` (e.g. transport crashed mid-send,
 * or an old run hit a 4xx that wasn't reclassified). Flips them back to
 * `queued` with cleared `next_attempt_at` so the batch processor picks them up.
 */
export async function recoverStuckSendingRows(olderThanMinutes = 15) {
  const cutoff = new Date(Date.now() - olderThanMinutes * 60_000).toISOString();
  const { data, error } = await supabaseAdmin
    .from("email_queue")
    .update({ status: "queued", next_attempt_at: new Date().toISOString(), last_error: "auto-recovered from stuck sending" } as never)
    .eq("status", "sending")
    .is("sent_at", null)
    .lt("created_at", cutoff)
    .select("id");
  if (error) {
    console.error("[emails] recoverStuckSendingRows failed", error);
    return { recovered: 0 };
  }
  return { recovered: data?.length ?? 0 };
}


// ─────────────────────────── Single-row sender ───────────────────────────

const RETRY_BACKOFF_MIN = [1, 5, 15, 60, 240];

type QueueRow = {
  id: string;
  template_code: string | null;
  to_email: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  variables: Record<string, unknown> | null;
  lead_id: string | null;
  application_id: string | null;
  attempts: number | null;
  max_attempts: number | null;
  status: string;
};

export async function sendQueueRowById(rowId: string) {
  const { data: row, error } = await supabaseAdmin
    .from("email_queue")
    .select("*")
    .eq("id", rowId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) return { ok: false, error: "row_not_found" };
  return sendQueueRow(row as unknown as QueueRow);
}

async function sendQueueRow(row: QueueRow) {
  // Template-level enable check.
  if (row.template_code) {
    const { data: tpl } = await supabaseAdmin
      .from("email_templates")
      .select("is_enabled")
      .eq("code", row.template_code)
      .maybeSingle();
    if (tpl && tpl.is_enabled === false) {
      await Promise.all([
        supabaseAdmin
          .from("email_queue")
          .update({ status: "sent", sent_at: new Date().toISOString(), last_error: "skipped: template disabled" } as never)
          .eq("id", row.id),
        supabaseAdmin.from("email_logs").insert({
          queue_id: row.id,
          template_code: row.template_code,
          to_email: row.to_email,
          subject: row.subject,
          status: "skipped_disabled",
          smtp_response: "[skipped] template disabled",
          attempt: (row.attempts ?? 0) + 1,
          lead_id: row.lead_id,
          application_id: row.application_id,
        } as never),
      ]);
      return { ok: true, skipped: true };
    }
  }

  const { data: settings } = await supabaseAdmin
    .from("smtp_settings")
    .select("from_email, from_name, reply_to, is_enabled")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!settings?.is_enabled) return { ok: false, error: "smtp_disabled" };

  await supabaseAdmin.from("email_queue").update({ status: "sending" }).eq("id", row.id);

  const attempt = (row.attempts ?? 0) + 1;
  const fromName = settings.from_name || process.env.ZOHO_FROM_NAME || "Udyam Registration Consultancy & Assistance Services";
  let smtpResponse: string | null = null;
  let lastError: string | null = null;
  let ok = false;

  try {
    const recipient = row.to_email.toLowerCase().trim();
    const variables = (row.variables ?? {}) as Record<string, unknown>;
    const atts = Array.isArray((variables as { __attachments?: EmailAttachment[] }).__attachments)
      ? ((variables as { __attachments?: EmailAttachment[] }).__attachments as EmailAttachment[])
      : [];

    const plainText =
      (row.body_text && row.body_text.trim()) ||
      htmlToPlainText(row.body_html) ||
      row.subject ||
      " ";

    const res = await sendViaZoho({
      to: recipient,
      subject: row.subject,
      html: row.body_html,
      text: plainText,
      fromName,
      replyTo: settings.reply_to ?? undefined,
      attachments: atts.length ? atts.map((a) => ({
        filename: a.filename,
        content_base64: a.content_base64,
        content_type: a.content_type,
      })) : undefined,
      headers: {
        "X-BHS-Queue-Id": row.id,
        "X-BHS-Template": row.template_code ?? "ad_hoc",
        "X-BHS-Attempt": String(attempt),
      },
    });

    if (res.ok) {
      smtpResponse = `[zoho] ${res.messageId ?? "ok"} :: ${(res.response ?? "").slice(0, 200)}`;
      ok = true;

      // Mirror to email_send_log (canonical dashboard table).
      try {
        await supabaseAdmin.from("email_send_log").insert({
          message_id: res.messageId ?? `bhs-${row.id}-${attempt}`,
          template_name: row.template_code ?? "ad_hoc",
          recipient_email: recipient,
          status: "sent",
          metadata: {
            queue_id: row.id,
            attempt,
            response: (res.response ?? "").slice(0, 500),
            lead_id: row.lead_id,
            application_id: row.application_id,
          },
        } as never);
      } catch { /* non-fatal */ }
    } else {
      lastError = `[zoho] ${res.error ?? "unknown"}`;
      try {
        await supabaseAdmin.from("email_send_log").insert({
          message_id: `bhs-${row.id}-${attempt}`,
          template_name: row.template_code ?? "ad_hoc",
          recipient_email: recipient,
          status: "failed",
          error_message: lastError.slice(0, 1000),
          metadata: { queue_id: row.id, attempt, lead_id: row.lead_id, application_id: row.application_id },
        } as never);
      } catch { /* non-fatal */ }
    }
  } catch (e) {
    lastError = `[setup] ${e instanceof Error ? e.message : "unknown"}`;
  }

  if (ok) {
    const writes: Array<PromiseLike<unknown>> = [
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
        smtp_response: smtpResponse,
        attempt,
        lead_id: row.lead_id,
        application_id: row.application_id,
      }),
    ];
    if (row.application_id) {
      writes.push(
        supabaseAdmin.from("application_events").insert({
          application_id: row.application_id,
          lead_id: row.lead_id,
          event_type: "email_sent",
          new_value: row.template_code ?? row.subject,
          staff_name: "System",
          staff_role: "system",
        }),
      );
    }
    if (row.template_code) {
      const { data: cur } = await supabaseAdmin
        .from("email_templates")
        .select("total_sent")
        .eq("code", row.template_code)
        .maybeSingle();
      writes.push(
        supabaseAdmin
          .from("email_templates")
          .update({
            last_sent_at: new Date().toISOString(),
            total_sent: ((cur?.total_sent as number | undefined) ?? 0) + 1,
          } as never)
          .eq("code", row.template_code),
      );
    }
    await Promise.all(writes);
    return { ok: true };
  }

  const errMsg = (lastError ?? "Unknown error").slice(0, 1000);
  const isDlq = attempt >= (row.max_attempts ?? 5);
  const delayMin = RETRY_BACKOFF_MIN[Math.min(attempt - 1, RETRY_BACKOFF_MIN.length - 1)];
  const next = new Date(Date.now() + delayMin * 60_000).toISOString();
  await Promise.all([
    supabaseAdmin
      .from("email_queue")
      .update({ status: isDlq ? "dlq" : "failed", attempts: attempt, next_attempt_at: next, last_error: errMsg })
      .eq("id", row.id),
    supabaseAdmin.from("email_logs").insert({
      queue_id: row.id,
      template_code: row.template_code,
      to_email: row.to_email,
      subject: row.subject,
      status: "failed",
      smtp_response: `[lovable] failed`,
      error_message: errMsg,
      attempt,
      lead_id: row.lead_id,
      application_id: row.application_id,
    }),
  ]);
  return { ok: false, error: errMsg };
}

// ─────────────────────────── Batch retry processor ───────────────────────────
// Kept for the existing cron endpoint — picks up any failed/scheduled rows
// (immediate-send already covers the happy path).

export async function processQueueInternal(limit = 20) {
  const { data: rows, error } = await supabaseAdmin
    .from("email_queue")
    .select("id")
    .in("status", ["queued", "failed"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  if (!rows || rows.length === 0) return { processed: 0, sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;
  for (const r of rows) {
    const res = await sendQueueRowById((r as { id: string }).id);
    if (res.ok) sent++;
    else failed++;
  }
  return { processed: rows.length, sent, failed };
}


