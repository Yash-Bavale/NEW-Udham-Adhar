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

  // Send immediately unless explicitly scheduled for the future.
  if (!scheduled && inserted?.id) {
    try {
      await sendQueueRowById(inserted.id as string);
    } catch {
      // Failures are already recorded on the row by sendQueueRowById; the
      // background processor (if any) will retry per backoff policy.
    }
  }
}


/** Enqueue using a template code; pulls subject/body from email_templates. */
export async function enqueueFromTemplateInternal(
  code: string,
  toEmail: string,
  variables: Record<string, unknown>,
  opts?: { toName?: string; leadId?: string; applicationId?: string; delaySeconds?: number; attachments?: EmailAttachment[] },
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
    delaySeconds: opts?.delaySeconds,
    attachments: opts?.attachments,
  });
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

  const lovableApiKey = process.env.LOVABLE_API_KEY;
  if (!lovableApiKey) return { ok: false, error: "lovable_api_key_missing" };

  await supabaseAdmin.from("email_queue").update({ status: "sending" }).eq("id", row.id);

  const attempt = (row.attempts ?? 0) + 1;
  const fromEmail = settings.from_email;
  const fromName = settings.from_name;
  let smtpResponse: string | null = null;
  let lastError: string | null = null;
  let ok = false;

  try {
    const recipient = row.to_email.toLowerCase().trim();

    // Per-recipient unsubscribe token.
    let unsubscribeToken: string | null = null;
    const { data: existing } = await supabaseAdmin
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", recipient)
      .maybeSingle();
    if (existing?.token) {
      unsubscribeToken = existing.token;
    } else {
      const newToken = crypto.randomUUID();
      const { error: insErr } = await supabaseAdmin
        .from("email_unsubscribe_tokens")
        .insert({ email: recipient, token: newToken });
      if (insErr) {
        const { data: again } = await supabaseAdmin
          .from("email_unsubscribe_tokens")
          .select("token")
          .eq("email", recipient)
          .maybeSingle();
        unsubscribeToken = again?.token ?? null;
        if (!unsubscribeToken) throw new Error(insErr.message);
      } else {
        unsubscribeToken = newToken;
      }
    }

    const variables = (row.variables ?? {}) as Record<string, unknown>;
    const atts = Array.isArray((variables as any).__attachments)
      ? ((variables as any).__attachments as EmailAttachment[])
      : [];

    const basePayload = {
      to: recipient,
      from: `${fromName} <${fromEmail}>`,
      sender_domain: LOVABLE_SENDER_DOMAIN,
      subject: row.subject,
      html: row.body_html,
      text: (row.body_text && row.body_text.trim()) || htmlToPlainText(row.body_html) || row.subject || " ",
      reply_to: settings.reply_to ?? undefined,
      purpose: "transactional" as const,
      idempotency_key: `bhs-${row.id}-${attempt}`,
      unsubscribe_token: unsubscribeToken!,
    };

    try {
      if (atts.length > 0) {
        const resp = await fetch("https://api.lovable.dev/v1/messaging/email/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": basePayload.idempotency_key,
          },
          body: JSON.stringify({ ...basePayload, attachments: atts }),
        });
        if (resp.ok) {
          const j: any = await resp.json().catch(() => ({}));
          smtpResponse = `[lovable+att] ${j.message_id ?? j.status ?? "ok"}`;
          ok = true;
        } else {
          const errTxt = (await resp.text()).slice(0, 300);
          const res = await sendLovableEmail(basePayload, { apiKey: lovableApiKey });
          smtpResponse = `[lovable·no-att fallback ${resp.status}] ${res.message_id ?? res.status ?? "ok"} :: ${errTxt}`;
          ok = true;
        }
      } else {
        const res = await sendLovableEmail(basePayload, { apiKey: lovableApiKey });
        smtpResponse = `[lovable] ${res.message_id ?? res.status ?? "ok"}`;
        ok = true;
      }
    } catch (e) {
      lastError = `[lovable] ${e instanceof Error ? e.message : "unknown"}`;
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


