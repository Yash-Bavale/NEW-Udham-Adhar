// Incoming Zoho mail matcher (server-only).
// For each fetched message: dedupe by zoho_mail_uid, match to an application
// via In-Reply-To/References → email_logs.message_id, then X-BHS-Order header,
// then latest active order by from_email. Persists to email_logs, opens or
// appends to a support_ticket, and pauses any active Scheduler 2 for the order.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  listInboxMessages,
  getMessageHeaders,
  getMessageContent,
  normalizeMessageId,
  extractEmail,
  type ZohoHeaders,
  type ZohoMessageListItem,
} from "@/lib/mail/zoho-inbox.server";
import {
  pauseScheduler,
  cancelTicketAutocloseForOrder,
  SCHEDULER_CUSTOMER_CLOSURE,
} from "@/lib/scheduling/schedulers.server";

export type PollResult = {
  fetched: number;
  new: number;
  matched: number;
  unmatched: number;
  errors: number;
};

/** Poll Zoho Inbox, ingest new messages, return counters. */
export async function pollZohoInbox(limit = 50): Promise<PollResult> {
  const result: PollResult = { fetched: 0, new: 0, matched: 0, unmatched: 0, errors: 0 };

  let messages: ZohoMessageListItem[];
  try {
    messages = await listInboxMessages(limit);
  } catch (e) {
    console.error("[zoho-inbox] list failed", e);
    return { ...result, errors: 1 };
  }
  result.fetched = messages.length;
  if (messages.length === 0) return result;

  // Dedupe: existing UIDs already ingested.
  const uids = messages.map((m) => m.messageId);
  const { data: existing } = await supabaseAdmin
    .from("email_logs")
    .select("zoho_mail_uid")
    .in("zoho_mail_uid", uids);
  const seen = new Set(((existing ?? []) as Array<{ zoho_mail_uid: string | null }>)
    .map((r) => r.zoho_mail_uid)
    .filter(Boolean) as string[]);

  for (const msg of messages) {
    if (seen.has(msg.messageId)) continue;
    try {
      await ingestOne(msg, result);
      result.new += 1;
    } catch (e) {
      result.errors += 1;
      console.error("[zoho-inbox] ingest failed", msg.messageId, e);
    }
  }

  return result;
}

async function ingestOne(msg: ZohoMessageListItem, result: PollResult) {
  const headers = await getMessageHeaders(msg.messageId, msg.folderId).catch(() => ({} as ZohoHeaders));
  const body = await getMessageContent(msg.messageId, msg.folderId).catch(() => ({
    html: null,
    text: null,
  }));

  const messageId = normalizeMessageId(headers["Message-ID"]);
  const inReplyTo = normalizeMessageId(headers["In-Reply-To"]);
  const references = (headers["References"] || "")
    .split(/\s+/)
    .map((s) => normalizeMessageId(s))
    .filter(Boolean) as string[];
  const fromEmail = extractEmail(headers.From) || extractEmail(msg.fromAddress);
  const toEmail = extractEmail(headers.To) || extractEmail(msg.toAddress) || "inbox@udyamadhar.in";
  const subject = headers.Subject || msg.subject || "(no subject)";

  // ── Match order ────────────────────────────────────────────────────────
  const matched = await matchOrder({
    inReplyTo,
    references,
    xBhsOrder: headers["X-BHS-Order"] || null,
    xBhsCustomer: headers["X-BHS-Customer"] || null,
    fromEmail,
  });

  if (matched?.applicationId) result.matched += 1;
  else result.unmatched += 1;

  // ── Insert email_logs row ──────────────────────────────────────────────
  const { data: logRow, error: logErr } = await supabaseAdmin
    .from("email_logs")
    .insert({
      direction: "incoming",
      status: "sent",
      to_email: toEmail,
      from_email: fromEmail,
      subject,
      body_html: body.html,
      body_text: body.text,
      message_id: messageId,
      in_reply_to: inReplyTo,
      references_header: references.join(" ") || null,
      zoho_mail_uid: msg.messageId,
      application_id: matched?.applicationId ?? null,
      lead_id: matched?.leadId ?? null,
      customer_id: matched?.customerId ?? null,
      sent_at: msg.receivedTime
        ? new Date(Number(msg.receivedTime)).toISOString()
        : new Date().toISOString(),
    } as never)
    .select("id")
    .single();

  if (logErr) throw new Error(logErr.message);

  // ── Side-effects on match ──────────────────────────────────────────────
  if (matched?.applicationId) {
    await pauseActiveCustomerScheduler(matched.applicationId, logRow?.id ?? null);
    await cancelTicketAutocloseForOrder(matched.applicationId, "customer_replied").catch(() => {});
    await openOrAppendTicket({
      applicationId: matched.applicationId,
      customerId: matched.customerId,
      subject,
      body: body.text || stripHtml(body.html) || "",
      fromEmail,
    });
  }
}

// ─────────────────────────── Matching ───────────────────────────

type MatchResult = {
  applicationId: string | null;
  leadId: string | null;
  customerId: string | null;
} | null;

async function matchOrder(input: {
  inReplyTo: string | null;
  references: string[];
  xBhsOrder: string | null;
  xBhsCustomer: string | null;
  fromEmail: string | null;
}): Promise<MatchResult> {
  // 1) In-Reply-To / References → email_logs.message_id
  const idsToMatch = [input.inReplyTo, ...input.references].filter(Boolean) as string[];
  if (idsToMatch.length > 0) {
    const { data } = await supabaseAdmin
      .from("email_logs")
      .select("application_id, lead_id, customer_id")
      .in("message_id", idsToMatch)
      .not("application_id", "is", null)
      .order("sent_at", { ascending: false })
      .limit(1);
    if (data && data.length > 0) {
      const r = data[0] as { application_id: string | null; lead_id: string | null; customer_id: string | null };
      if (r.application_id) return { applicationId: r.application_id, leadId: r.lead_id, customerId: r.customer_id };
    }
  }

  // 2) X-BHS-Order header
  if (input.xBhsOrder) {
    const { data } = await supabaseAdmin
      .from("applications")
      .select("id, lead_id, customer_id")
      .eq("id", input.xBhsOrder)
      .maybeSingle();
    if (data) {
      const r = data as { id: string; lead_id: string | null; customer_id: string | null };
      return { applicationId: r.id, leadId: r.lead_id, customerId: r.customer_id };
    }
  }

  // 3) From email → most recent open order for that customer
  if (input.fromEmail) {
    const { data: cust } = await supabaseAdmin
      .from("customers")
      .select("id")
      .ilike("primary_email", input.fromEmail)
      .maybeSingle();
    const customerId = (cust as { id: string } | null)?.id ?? null;
    if (customerId) {
      const { data: app } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id, order_status, created_at")
        .eq("customer_id", customerId)
        .not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (app) {
        const r = app as { id: string; lead_id: string | null; customer_id: string | null };
        return { applicationId: r.id, leadId: r.lead_id, customerId: r.customer_id };
      }
      // Customer known but no open order — still tag customer.
      return { applicationId: null, leadId: null, customerId };
    }
  }

  return null;
}

// ─────────────────────────── Side effects ───────────────────────────

async function pauseActiveCustomerScheduler(applicationId: string, ticketOrLogId: string | null) {
  const { data: active } = await supabaseAdmin
    .from("order_schedulers")
    .select("id")
    .eq("application_id", applicationId)
    .eq("scheduler_type", SCHEDULER_CUSTOMER_CLOSURE)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  const row = active as { id: string } | null;
  if (!row) return;
  await pauseScheduler(row.id, ticketOrLogId);
}

async function openOrAppendTicket(input: {
  applicationId: string;
  customerId: string | null;
  subject: string;
  body: string;
  fromEmail: string | null;
}) {
  // Find any open ticket for this order in the last 30 days.
  const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  const { data: existing } = await supabaseAdmin
    .from("support_tickets")
    .select("id")
    .eq("application_id", input.applicationId)
    .in("status", ["open", "in_progress", "waiting_customer"])
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const ticket = existing as { id: string } | null;
  let ticketId = ticket?.id ?? null;

  if (!ticketId) {
    const { data: created, error } = await supabaseAdmin
      .from("support_tickets")
      .insert({
        application_id: input.applicationId,
        customer_id: input.customerId,
        subject: input.subject.slice(0, 250),
        description: input.body.slice(0, 2000),
        status: "open",
        priority: "normal",
      } as never)
      .select("id")
      .single();
    if (error) {
      console.error("[zoho-inbox] ticket insert failed", error.message);
      return;
    }
    ticketId = (created as { id: string }).id;
  }

  await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: ticketId,
    reply_text: `From: ${input.fromEmail || "unknown"}\n\n${input.body.slice(0, 4000)}`,
    is_internal: false,
  } as never);
}

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
