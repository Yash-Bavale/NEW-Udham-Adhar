import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { renderTemplate, renderTemplateHtml } from "./smtp.server";
import { resolveMailProvider, sendViaActiveProvider, senderEmailFor, isProviderThrottleError } from "./transport.server";

/**
 * Legacy → canonical template alias.
 * The ONLY email templates that exist in the DB are the 14 approved
 * BHS templates (E001–E010, T001–T003, R001). Any legacy code passed by
 * older call-sites is resolved here. Codes mapped to `null` are silently
 * dropped (no email is sent) — used to kill off admin/internal notices
 * the product owner has explicitly removed.
 */
const LEGACY_TEMPLATE_ALIAS: Record<string, string | null> = {
  // Order lifecycle
  order_confirmation: "E001",
  topup_payment_received: "E013",
  service_changed: "E012",

  welcome_and_form_link: "E002",
  "client-info-request": "E002",
  docs_required_reminder: "E002",
  payment_link: "E002",
  lead_welcome: "E002",
  bhs_e005_manual_reminder: "E002",
  workflow_external_delay_notice: "E003",
  bhs_e004_our_side_delay: "E003",
  bhs_e003_customer_delay: "E004",
  bhs_e012_submitted_to_govt: "E006",
  bhs_order_resumed: "E006",
  workflow_processing_update_3d: "E006",
  order_completed: "E007",
  certificate_delivery: "E007",
  "certificate-delivered": "E007",
  talk_to_expert_completed: "E009",
  consultation_service_converted: "E009",
  talk_to_expert_request_customer: "E009",
  order_closure_confirmation: "E010",
  order_pending_closure: "E010",
  "cancel-action-required": "E010",
  "cancel-closure-confirmation": "E010",
  workflow_closure_notice: "E010",
  // Tickets
  support_ticket_reply: "T002",
  support_ticket_closed: "T001",
  support_ticket_closed_final: "T003",
  ticket_created: "T002",
  // Refunds
  refund_processed_confirmation: "R001",
  // Explicitly dropped — no customer/admin email should fire
  contact_acknowledgement: null,
  admin_new_lead: null,
  admin_onboarding_submitted: null,
  complaint_admin_notification: null,
  complaint_sla_breach: null,
  talk_to_expert_request_admin: null,
  onboarding_complete: null,
  onboarding_reminder: null,
  payment_success: null,
  service_processing_update: null,
};

/** Resolve a caller-supplied template code to a canonical one, or null to skip. */
function resolveTemplateCode(code: string | null | undefined): { code: string | null; drop: boolean } {
  if (!code) return { code: null, drop: false };
  const trimmed = code.trim();
  if (/^(E0(0[1-9]|1[0-2])|T00[1-3]|R001)$/.test(trimmed)) return { code: trimmed, drop: false };
  if (Object.prototype.hasOwnProperty.call(LEGACY_TEMPLATE_ALIAS, trimmed)) {
    const mapped = LEGACY_TEMPLATE_ALIAS[trimmed];
    return { code: mapped, drop: mapped === null };
  }
  // Unknown code — let downstream template lookup fail loudly
  return { code: trimmed, drop: false };
}


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
  allowWithoutTemplate?: boolean;
  /** Set true for genuinely repeatable sends (manual resend, support replies). */
  allowDuplicate?: boolean;
  cc?: string | string[];
  bcc?: string | string[];
}) {
  const resolved = resolveTemplateCode(input.templateCode);
  if (resolved.drop) {
    console.warn(`[emails] dropping legacy template '${input.templateCode}' (no longer sent).`);
    return { queueId: null, scheduled: false, sent: false, skipped: true } as const;
  }
  const templateCode = resolved.code;
  if (!templateCode && !input.allowWithoutTemplate) {
    throw new Error("Email template code is required. Use a saved Email Template for this send.");
  }
  if (templateCode) {
    const { data: tpl, error: tplErr } = await supabaseAdmin
      .from("email_templates")
      .select("code")
      .eq("code", templateCode)
      .maybeSingle();
    if (tplErr) throw new Error(tplErr.message);
    if (!tpl) throw new Error(`Email template '${templateCode}' not found.`);
  }


  const variables: Record<string, unknown> = { ...(input.variables ?? {}) };
  if (input.allowWithoutTemplate) variables.__allow_without_template = true;
  if (input.attachments && input.attachments.length > 0) {
    variables.__attachments = input.attachments;
  }
  if (input.cc) variables.__cc = input.cc;
  if (input.bcc) variables.__bcc = input.bcc;
  const scheduled = input.delaySeconds && input.delaySeconds > 0
    ? new Date(Date.now() + input.delaySeconds * 1000).toISOString()
    : null;

  const row: Record<string, unknown> = {
    template_code: templateCode,
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

  // ── Duplicate guard ──
  // Same template + same recipient + same order must not be queued twice.
  // One-time-per-order templates (order confirmation, completion) are blocked
  // forever; everything else is blocked inside a short window so that a retry,
  // a double webhook, or a double click can't deliver the same mail twice.
  if (!input.allowDuplicate && templateCode) {
    const ONCE_PER_ORDER = new Set(["E001", "E007"]);
    const forever = ONCE_PER_ORDER.has(templateCode);
    let q = supabaseAdmin
      .from("email_queue")
      .select("id")
      .eq("template_code", templateCode)
      .eq("to_email", row.to_email as string)
      .in("status", ["queued", "sending", "sent", "failed"])
      .limit(1);
    q = input.applicationId
      ? q.eq("application_id", input.applicationId)
      : input.leadId
        ? q.eq("lead_id", input.leadId)
        : q.eq("subject", input.subject);
    if (!forever) q = q.gte("created_at", new Date(Date.now() - 10 * 60_000).toISOString());
    const { data: dupe } = await q;
    if (dupe && dupe.length > 0) {
      console.warn(`[emails] duplicate suppressed: ${templateCode} -> ${row.to_email}`);
      return { queueId: null, scheduled: false, sent: false, skipped: true } as const;
    }
  }

  const { data: inserted, error } = await supabaseAdmin
    .from("email_queue")
    .insert(row as never)
    .select("id")
    .single();
  if (error) {
    // Unique index caught a simultaneous duplicate enqueue — treat as skipped.
    if ((error as { code?: string }).code === "23505") {
      console.warn(`[emails] duplicate suppressed (db): ${templateCode} -> ${row.to_email}`);
      return { queueId: null, scheduled: false, sent: false, skipped: true } as const;
    }
    throw new Error(error.message);
  }

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


/**
 * Mirror snake_case ↔ camelCase keys so templates render no matter which
 * convention the caller passed. Existing keys win; we only add aliases when
 * the alias slot is empty/undefined.
 */
function withBothCases(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...input };
  const toCamel = (k: string) => k.replace(/_([a-z0-9])/g, (_m, c) => c.toUpperCase());
  const toSnake = (k: string) => k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null || v === "") continue;
    if (k.includes("_")) {
      const camel = toCamel(k);
      if (out[camel] === undefined || out[camel] === null || out[camel] === "") out[camel] = v;
    } else if (/[A-Z]/.test(k)) {
      const snake = toSnake(k);
      if (out[snake] === undefined || out[snake] === null || out[snake] === "") out[snake] = v;
    }
  }
  return out;
}

async function enforceApplicationOrderNumber(
  input: Record<string, unknown>,
  leadId?: string | null,
  applicationId?: string | null,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = { ...input };
  if (!leadId && !applicationId) return out;

  const { resolveApplicationCode } = await import("@/lib/orders/resolve-order-number.server");
  let effectiveLeadId = leadId ?? null;
  let resolved: string | null = null;
  if (applicationId && !effectiveLeadId) {
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("lead_id, application_code")
      .eq("id", applicationId)
      .maybeSingle();
    resolved = ((app as { application_code?: string | null } | null)?.application_code ?? null) || null;
    effectiveLeadId = ((app as { lead_id?: string | null } | null)?.lead_id ?? null) || null;
  }
  if (!resolved && effectiveLeadId) {
    resolved = await resolveApplicationCode(effectiveLeadId, { applicationId });
  }

  if (!resolved) {
    const orderNumber = String(out.order_number ?? out.orderNumber ?? "").trim();
    const leadCode = String(out.lead_code ?? out.leadCode ?? "").trim();
    if (!orderNumber || (leadCode && orderNumber === leadCode)) {
      throw new Error("Order number not ready yet — email was not sent.");
    }
    return out;
  }

  out.order_number = resolved;
  out.orderNumber = resolved;
  return out;
}

/**
 * Best-effort backfill of common customer/order/executive placeholders used by
 * the standard BHS templates. Only fills in keys the caller hasn't already
 * provided (non-empty). Never throws — any lookup failure is ignored so email
 * sending continues.
 */
async function backfillCommonVariables(
  vars: Record<string, unknown>,
  leadId?: string | null,
  applicationId?: string | null,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = { ...vars };
  const missing = (k: string) => {
    const v = out[k];
    return v === undefined || v === null || v === "";
  };
  // Always provide {{resolved_at}} = current IST timestamp when caller didn't set it.
  if (missing("resolved_at")) {
    out.resolved_at = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  }
  if (!leadId && !applicationId) return out;
  try {
    type LeadRow = { id?: string; lead_code?: string | null; name?: string | null; email?: string | null; mobile?: string | null; service?: string | null; assigned_to?: string | null; created_at?: string | null };
    type AppRow = { id?: string; application_code?: string | null; lead_id?: string | null; customer_id?: string | null; assigned_to?: string | null; created_at?: string | null; updated_at?: string | null; closure_reason_id?: string | null; closure_remarks?: string | null; fulfillment_status?: string | null };
    let lead: LeadRow | null = null;
    let app: AppRow | null = null;

    if (applicationId) {
      const { data } = await supabaseAdmin
        .from("applications")
        .select("id, application_code, lead_id, customer_id, assigned_to, created_at, updated_at, closure_reason_id, closure_remarks, fulfillment_status, fulfilled_at, certificate_uploaded_at")
        .eq("id", applicationId)
        .maybeSingle();
      app = (data as AppRow | null) ?? null;
      if (app?.lead_id && !leadId) leadId = app.lead_id;
    }
    if (leadId) {
      const { data } = await supabaseAdmin
        .from("leads")
        .select("id, lead_code, name, email, mobile, service, assigned_to, created_at")
        .eq("id", leadId)
        .maybeSingle();
      lead = (data as LeadRow | null) ?? null;
    }

    if (app?.customer_id && (missing("customer_name") || missing("customer_email") || missing("customer_mobile"))) {
      const { data: cust } = await supabaseAdmin
        .from("customers")
        .select("name, primary_email, primary_phone")
        .eq("id", app.customer_id)
        .maybeSingle();
      const c = cust as { name?: string; primary_email?: string; primary_phone?: string } | null;
      if (missing("customer_name") && c?.name) out.customer_name = c.name;
      if (missing("customer_email") && c?.primary_email) out.customer_email = c.primary_email;
      if (missing("customer_mobile") && c?.primary_phone) out.customer_mobile = c.primary_phone;
    }

    if (missing("customer_name") && lead?.name) out.customer_name = lead.name;
    if (missing("customer_email") && lead?.email) out.customer_email = lead.email;
    if (missing("customer_mobile") && lead?.mobile) out.customer_mobile = lead.mobile;
    if (missing("service_name") && lead?.service) out.service_name = lead.service;
    if (missing("customer_mobile")) out.customer_mobile = "—";
    // Order number is ALWAYS the application_code — never fall back to the lead_code.
    // Lead code is a pre-order identifier and must never appear as the order number.
    if (missing("order_number")) out.order_number = app?.application_code ?? "";
    if (missing("lead_code") && lead?.lead_code) out.lead_code = lead.lead_code;
    const created = app?.created_at ?? lead?.created_at ?? null;
    if (missing("order_created_at") && created) {
      out.order_created_at = new Date(created).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
    }

    // Executive name via assigned_to → profiles
    const assignedTo = app?.assigned_to ?? lead?.assigned_to ?? null;
    if (missing("executive_name") && assignedTo) {
      const { data: prof } = await supabaseAdmin
        .from("profiles")
        .select("display_name, full_name, email")
        .eq("id", assignedTo)
        .maybeSingle();
      const name = (prof as { display_name?: string; full_name?: string; email?: string } | null);
      out.executive_name = name?.display_name || name?.full_name || name?.email || "Support Team";
    }
    if (missing("executive_name")) out.executive_name = "Support Team";

    // Invoice number (latest invoice for this app/lead)
    if (missing("invoice_number")) {
      type InvRow = { invoice_number?: string | null };
      let inv: InvRow | null = null;
      if (applicationId) {
        const { data } = await supabaseAdmin
          .from("invoices")
          .select("invoice_number, issued_at")
          .eq("application_id", applicationId)
          .order("issued_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        inv = (data as InvRow | null) ?? null;
      }
      if (!inv && leadId) {
        const { data } = await supabaseAdmin
          .from("invoices")
          .select("invoice_number, issued_at")
          .eq("lead_id", leadId)
          .order("issued_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        inv = (data as InvRow | null) ?? null;
      }
      if (inv?.invoice_number) out.invoice_number = inv.invoice_number;
    }

    // Completion date fields for E007 / order_completed templates.
    const completedAtRaw = (app as any)?.fulfilled_at ?? (app as any)?.certificate_uploaded_at ?? new Date().toISOString();
    const formattedCompletedDate = new Date(completedAtRaw).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
    const completionKeys = [
      "order_completion_date_time",
      "order_completion_date",
      "order_completion_time",
      "order_completion_date_and_time",
      "order_completed_date_time",
      "order_completed_date_and_time",
      "order_completed_date",
      "order_completed_time",
      "order_completed_at",
      "completed_date_time",
      "completed_date_and_time",
      "completed_date",
      "completed_time",
      "completed_at",
      "completion_date_time",
      "completion_date_and_time",
      "completion_date",
      "completion_time",
      "completion_at",
      "order_completion_at",
    ];
    for (const key of completionKeys) {
      if (missing(key)) out[key] = formattedCompletedDate;
      if (missing(`${key}_ist`)) out[`${key}_ist`] = `${formattedCompletedDate} IST`;
    }
    // Completed orders: {{closure_date}} is the completion date & time (E007).
    const completedFs = new Set(["completed", "certificate_delivered", "order_completed", "service_completed"]);
    if (app && completedFs.has(String(app.fulfillment_status ?? "")) && missing("closure_date")) {
      out.closure_date = formattedCompletedDate;
    }
    const closedFs = new Set(["order_closed", "cancelled", "application_rejected", "certificate_rejected"]);
    if (app && closedFs.has(String(app.fulfillment_status ?? ""))) {
      if (missing("closure_date") && app.updated_at) {
        out.closure_date = new Date(app.updated_at).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit", hour12: true,
        });
      }
      if (missing("employee_remarks") || missing("additional_remarks") || missing("remarks")) {
        let defaultRemarks = (app.closure_remarks && String(app.closure_remarks).trim()) || "";
        if (!defaultRemarks && app.closure_reason_id) {
          const { data: r } = await supabaseAdmin
            .from("order_close_reasons")
            .select("standard_reply, label")
            .eq("id", app.closure_reason_id)
            .maybeSingle();
          defaultRemarks = (r as any)?.standard_reply || (r as any)?.label || "";
        }
        if (missing("employee_remarks")) out.employee_remarks = defaultRemarks || "—";
        if (missing("additional_remarks")) out.additional_remarks = defaultRemarks || "—";
        if (missing("remarks")) out.remarks = defaultRemarks || "—";
      }
      if (missing("closure_reason")) {
        let label: string | null = null;
        if (app.closure_reason_id) {
          const { data: r } = await supabaseAdmin
            .from("order_close_reasons")
            .select("label")
            .eq("id", app.closure_reason_id)
            .maybeSingle();
          label = ((r as { label?: string } | null)?.label) ?? null;
        }
        out.closure_reason = label || (app.closure_remarks ? String(app.closure_remarks) : "Order closed");
      }
    }
    // Never leave the date row blank in templates that print {{closure_date}}.
    if (app && missing("closure_date")) out.closure_date = formattedCompletedDate;

  } catch (e) {
    console.warn("[emails] backfillCommonVariables failed (non-fatal)", e);
  }
  return out;
}

/** Enqueue using a template code; pulls subject/body from email_templates. */
export async function enqueueFromTemplateInternal(
  code: string,
  toEmail: string,
  rawVariables: Record<string, unknown>,
  opts?: { toName?: string; leadId?: string; applicationId?: string; delaySeconds?: number; attachments?: EmailAttachment[]; requireImmediateSuccess?: boolean; trigger?: "auto" | "manual"; allowDuplicate?: boolean; inReplyTo?: string | null; references?: string | null; threadSubject?: string | null },
) {
  const resolved = resolveTemplateCode(code);
  if (resolved.drop) {
    console.warn(`[emails] dropping legacy template '${code}' (no longer sent).`);
    return;
  }
  const effectiveCode = resolved.code ?? code;
  const enriched = await backfillCommonVariables(rawVariables, opts?.leadId, opts?.applicationId);
  const variables = await enforceApplicationOrderNumber(withBothCases(enriched), opts?.leadId, opts?.applicationId);
  const { data: tpl, error } = await supabaseAdmin
    .from("email_templates")
    .select("subject, body_html, body_text, is_enabled, dispatch_mode")
    .eq("code", effectiveCode)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!tpl) throw new Error(`Email template '${effectiveCode}' not found.`);


  if (!tpl.is_enabled) {
    if (opts?.requireImmediateSuccess) {
      throw new Error(`Email template '${code}' is disabled — email was not sent.`);
    }
    return;
  }
  // Dispatch-mode gate: an "auto" trigger is skipped for manual-mode templates.
  // Manual trigger (from admin UI) always bypasses this gate.
  const trigger = opts?.trigger ?? "auto";
  const mode = (tpl as { dispatch_mode?: string }).dispatch_mode ?? "auto";
  if (trigger === "auto" && mode === "manual") {
    if (opts?.requireImmediateSuccess) {
      throw new Error(`Email template '${code}' is set to manual dispatch — automation skipped.`);
    }
    return;
  }

  let subject = renderTemplate(tpl.subject, variables);
  const finalVars: Record<string, unknown> = { ...variables };

  // Each template is delivered as its own standalone email (no per-order
  // threading). We only set In-Reply-To/References when the caller explicitly
  // asks for a reply (e.g. ticket replies to an inbound message).
  if (opts?.inReplyTo || opts?.references) {
    const baseSubject = opts.threadSubject || subject;
    subject = baseSubject.toLowerCase().startsWith("re:") ? baseSubject : `Re: ${baseSubject}`;
    finalVars.__in_reply_to = opts.inReplyTo ?? opts.references;
    finalVars.__references = opts.references ?? opts.inReplyTo;
  }


  let rawBodyHtml = tpl.body_html ?? "";
  if (effectiveCode === "E001" || effectiveCode === "order_confirmation") {
    rawBodyHtml = rawBodyHtml
      .replace(/You can also access it here\.?/gi, "")
      .replace(/<a[^>]*\{\{invoice_url\}\}[^>]*>.*?<\/a>/gi, "")
      .replace(/<a[^>]*\{\{invoice_download_url\}\}[^>]*>.*?<\/a>/gi, "")
      .replace(/<p[^>]*>\s*\{\{invoice_url\}\}\s*<\/p>/gi, "")
      .replace(/\{\{invoice_url\}\}/gi, "")
      .replace(/\{\{invoice_download_url\}\}/gi, "");
  }

  const allowDuplicate = opts?.allowDuplicate ?? (trigger === "manual");

  return enqueueEmailInternal({
    templateCode: effectiveCode,
    toEmail,
    toName: opts?.toName ?? null,
    subject,
    bodyHtml: renderTemplateHtml(rawBodyHtml, variables),
    bodyText: tpl.body_text ? renderTemplate(tpl.body_text, variables) : null,
    variables: finalVars,
    leadId: opts?.leadId ?? null,
    applicationId: opts?.applicationId ?? null,
    delaySeconds: opts?.delaySeconds,
    attachments: opts?.attachments,
    requireImmediateSuccess: opts?.requireImmediateSuccess,
    allowDuplicate,
  });
}

/** Asynchronously clean up legacy invoice URL links from database email templates. */
async function cleanupE001InvoiceLinkInDB() {
  try {
    const { data: tpls } = await supabaseAdmin
      .from("email_templates")
      .select("id, code, body_html")
      .in("code", ["E001", "order_confirmation"]);

    for (const t of tpls ?? []) {
      if (t.body_html && (t.body_html.includes("invoice_url") || t.body_html.includes("You can also access it here"))) {
        const cleaned = t.body_html
          .replace(/You can also access it here\.?/gi, "")
          .replace(/<a[^>]*\{\{invoice_url\}\}[^>]*>.*?<\/a>/gi, "")
          .replace(/<a[^>]*\{\{invoice_download_url\}\}[^>]*>.*?<\/a>/gi, "")
          .replace(/<p[^>]*>\s*\{\{invoice_url\}\}\s*<\/p>/gi, "")
          .replace(/\{\{invoice_url\}\}/gi, "")
          .replace(/\{\{invoice_download_url\}\}/gi, "");

        await supabaseAdmin
          .from("email_templates")
          .update({ body_html: cleaned } as any)
          .eq("id", t.id);
      }
    }
  } catch (e) {
    console.error("[emails.server] cleanupE001InvoiceLinkInDB error", e);
  }
}
cleanupE001InvoiceLinkInDB();


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
    if (!tpl) {
      const err = `blocked: email template '${row.template_code}' not found`;
      await Promise.all([
        supabaseAdmin
          .from("email_queue")
          .update({ status: "dlq", last_error: err } as never)
          .eq("id", row.id),
        supabaseAdmin.from("email_logs").insert({
          queue_id: row.id,
          template_code: row.template_code,
          to_email: row.to_email,
          subject: row.subject,
          status: "failed",
          error_message: err,
          attempt: (row.attempts ?? 0) + 1,
          lead_id: row.lead_id,
          application_id: row.application_id,
        } as never),
      ]);
      return { ok: false, error: err };
    }
  } else if (!((row.variables ?? {}) as Record<string, unknown>).__allow_without_template) {
    const err = "blocked: email template code is required";
    await Promise.all([
      supabaseAdmin
        .from("email_queue")
        .update({ status: "dlq", last_error: err } as never)
        .eq("id", row.id),
      supabaseAdmin.from("email_logs").insert({
        queue_id: row.id,
        template_code: null,
        to_email: row.to_email,
        subject: row.subject,
        status: "failed",
        error_message: err,
        attempt: (row.attempts ?? 0) + 1,
        lead_id: row.lead_id,
        application_id: row.application_id,
      } as never),
    ]);
    return { ok: false, error: err };
  }

  const { data: settings } = await supabaseAdmin
    .from("smtp_settings")
    .select("from_email, from_name, reply_to, is_enabled")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!settings?.is_enabled) return { ok: false, error: "smtp_disabled" };

  // Atomic claim — only one worker may move a row out of queued/failed into
  // `sending`. Without this, the cron worker and a manual "process now" can both
  // pick the same row and deliver the same email twice.
  const { data: claimed } = await supabaseAdmin
    .from("email_queue")
    .update({ status: "sending" })
    .eq("id", row.id)
    .in("status", ["queued", "failed"])
    .select("id");
  if (!claimed || claimed.length === 0) {
    return { ok: true, skipped: true, error: "already_claimed" };
  }

  const attempt = (row.attempts ?? 0) + 1;
  const fromName = settings.from_name || process.env.ZOHO_FROM_NAME || "Udyam Registration Consultancy & Assistance Services";
  let smtpResponse: string | null = null;
  let lastError: string | null = null;
  let ok = false;
  let sentMessageId: string | null = null;
  let sentInReplyTo: string | null = null;
  let sentReferences: string | null = null;
  let sentCustomerId: string | null = null;
  let sentFromEmail: string | null = null;
  const provider = await resolveMailProvider();

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

    // Resolve customer_id for threading + look up parent thread if this is a reply.
    let customerId: string | null = null;
    if (row.application_id) {
      const { data: app } = await supabaseAdmin
        .from("applications")
        .select("customer_id")
        .eq("id", row.application_id)
        .maybeSingle();
      customerId = (app?.customer_id as string | undefined) ?? null;
    }
    const parentMessageId =
      typeof (variables as { __in_reply_to?: string }).__in_reply_to === "string"
        ? ((variables as { __in_reply_to?: string }).__in_reply_to as string)
        : null;
    const referencesHeader =
      typeof (variables as { __references?: string }).__references === "string"
        ? ((variables as { __references?: string }).__references as string)
        : parentMessageId;
    const forcedMessageId =
      typeof (variables as { __message_id?: string }).__message_id === "string"
        ? ((variables as { __message_id?: string }).__message_id as string)
        : undefined;
    const cc = (variables as { __cc?: string | string[] }).__cc;
    const bcc = (variables as { __bcc?: string | string[] }).__bcc;

    const res = await sendViaActiveProvider({
      to: recipient,
      cc,
      bcc,
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
      messageId: forcedMessageId,
      inReplyTo: parentMessageId,
      references: referencesHeader,
      orderId: row.application_id,
      customerId,
      templateCode: row.template_code,
      queueId: row.id,
      headers: {
        "X-BHS-Attempt": String(attempt),
      },
    });

    if (res.ok) {
      smtpResponse = `[${provider}] ${res.messageId ?? "ok"} :: ${(res.response ?? "").slice(0, 200)}`;
      ok = true;
      sentMessageId = res.messageId ?? null;
      sentInReplyTo = parentMessageId;
      sentReferences = referencesHeader ?? null;
      sentCustomerId = customerId;
      sentFromEmail = senderEmailFor(provider);

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
      lastError = res.error?.startsWith(`[${provider}]`)
        ? res.error
        : `[${provider}] ${res.error ?? "unknown"}`;
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
        customer_id: sentCustomerId,
        direction: "outgoing",
        message_id: sentMessageId,
        in_reply_to: sentInReplyTo,
        references_header: sentReferences,
        from_email: sentFromEmail,
        body_html: row.body_html,
        body_text: row.body_text,
      } as never),
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
  if (isProviderThrottleError(errMsg)) {
    // Provider-side block: defer WITHOUT consuming a retry attempt so the email
    // is never dead-lettered because the mail service was throttling us.
    const next = new Date(Date.now() + 30 * 60_000).toISOString();
    await Promise.all([
      supabaseAdmin
        .from("email_queue")
        .update({ status: "failed", attempts: row.attempts ?? 0, next_attempt_at: next, last_error: errMsg })
        .eq("id", row.id),
      supabaseAdmin.from("email_logs").insert({
        queue_id: row.id,
        template_code: row.template_code,
        to_email: row.to_email,
        subject: row.subject,
        status: "failed",
        smtp_response: `[${provider}] deferred`,
        error_message: errMsg,
        attempt,
        lead_id: row.lead_id,
        application_id: row.application_id,
      }),
    ]);
    return { ok: false, error: errMsg, providerBlocked: true };
  }

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
      smtp_response: `[${provider}] failed`,
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
  // First, rescue any rows stuck in `sending` so they re-enter the rotation.
  await recoverStuckSendingRows(15);

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
    else {
      failed++;
      if ((res as { providerBlocked?: boolean }).providerBlocked) break;
    }
  }
  return { processed: rows.length, sent, failed };
}


