import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { renderTemplate } from "./smtp.server";
import { sendLovableEmail } from "@lovable.dev/email-js";

const LOVABLE_SENDER_DOMAIN = "notify.mail.businesshelpservices.com";


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
  if (input.delaySeconds && input.delaySeconds > 0) {
    const when = new Date(Date.now() + input.delaySeconds * 1000).toISOString();
    row.scheduled_at = when;
    row.next_attempt_at = when;
  }
  const { error } = await supabaseAdmin.from("email_queue").insert(row as never);
  if (error) throw new Error(error.message);
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
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!settings?.is_enabled) {
    return { processed: 0, sent: 0, failed: 0, skipped: "smtp_disabled" };
  }

  const lovableApiKey = process.env.LOVABLE_API_KEY;
  if (!lovableApiKey) {
    return { processed: 0, sent: 0, failed: 0, skipped: "lovable_api_key_missing" };
  }
  const fromEmail = settings.from_email;
  const fromName = settings.from_name;

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    // Per-template enable/disable check (skips silently, logs as skipped_disabled)
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
        continue;
      }
    }

    await supabaseAdmin.from("email_queue").update({ status: "sending" }).eq("id", row.id);

    const attempt = (row.attempts ?? 0) + 1;
    let smtpResponse: string | null = null;
    let lastError: string | null = null;
    let ok = false;

    try {
      const recipient = row.to_email.toLowerCase().trim();

      // Ensure a per-recipient unsubscribe token exists (one row per email address).
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
          // Likely a race on the unique(email) constraint — re-select.
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

      // Pull any attachments stashed on the queue row.
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
        text: row.body_text ?? "",
        reply_to: settings.reply_to ?? undefined,
        purpose: "transactional" as const,
        idempotency_key: `bhs-${row.id}-${attempt}`,
        unsubscribe_token: unsubscribeToken!,
      };

      try {
        if (atts.length > 0) {
          // Direct POST so we can pass the (undocumented) `attachments` field.
          const url = "https://api.lovable.dev/v1/messaging/email/send";
          const resp = await fetch(url, {
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
            // Fall back to send without attachments (so the customer still receives the email).
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
      sent++;
    } else {
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
      failed++;
    }
  }
  return { processed: rows.length, sent, failed };
}

