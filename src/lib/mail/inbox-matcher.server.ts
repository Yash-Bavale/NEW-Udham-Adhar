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
  const subject = decodeEntities(headers.Subject || msg.subject || "(no subject)");
  const receivedAt = msg.receivedTime
    ? new Date(Number(msg.receivedTime)).toISOString()
    : new Date().toISOString();
  const bodyText = body.text || stripHtml(body.html) || "";

  // ── Step 1: Try to match to an existing ticket (v2 flow) ───────────────
  const ticketMatch = await matchTicket({
    subject,
    inReplyTo,
    references,
  });

  if (ticketMatch) {
    const senderOk =
      !!fromEmail &&
      (!ticketMatch.ticketEmail ||
        fromEmail.trim().toLowerCase() === ticketMatch.ticketEmail.trim().toLowerCase());

    if (!senderOk) {
      await supabaseAdmin.from("inbound_email_quarantine").insert({
        zoho_mail_uid: msg.messageId,
        message_id: messageId,
        in_reply_to: inReplyTo,
        from_email: fromEmail,
        to_email: toEmail,
        subject,
        body_text: bodyText.slice(0, 8000),
        body_html: body.html,
        reason: "sender_mismatch",
        matched_ticket_id: ticketMatch.ticketId,
        matched_ticket_email: ticketMatch.ticketEmail,
        received_at: receivedAt,
      } as never);
      result.unmatched += 1;
      return;
    }

    await appendReplyToTicket({
      ticketId: ticketMatch.ticketId,
      applicationId: ticketMatch.applicationId,
      customerId: ticketMatch.customerId,
      leadId: ticketMatch.leadId,
      subject,
      bodyText,
      bodyHtml: body.html,
      fromEmail,
      toEmail,
      messageId,
      inReplyTo,
      references,
      zohoUid: msg.messageId,
      receivedAt,
    });

    const { cancelTicketAutocloseByTicket: cancelByTicket } = await import("@/lib/scheduling/schedulers.server");
    await cancelByTicket(ticketMatch.ticketId, "customer_replied").catch(() => {});
    if (ticketMatch.applicationId) {
      await cancelTicketAutocloseForOrder(ticketMatch.applicationId, "customer_replied").catch(() => {});
      await pauseActiveCustomerScheduler(ticketMatch.applicationId, ticketMatch.ticketId).catch(() => {});
      // Workflow engine: pause timers/automations on customer reply.
      try {
        const { dispatchEvent } = await import("@/lib/workflow/engine.server");
        await dispatchEvent({
          type: "CustomerEmailReceived",
          applicationId: ticketMatch.applicationId,
          ticketId: ticketMatch.ticketId,
          messageId: messageId ?? msg.messageId,
        });
      } catch (e) {
        console.error("[workflow] dispatch CustomerEmailReceived failed", e);
      }
    }
    result.matched += 1;
    return;
  }

  // ── Step 2: Fall back to order-level match (legacy path) ───────────────
  const matched = await matchOrder({
    subject,
    inReplyTo,
    references,
    xBhsOrder: headers["X-BHS-Order"] || null,
    xBhsCustomer: headers["X-BHS-Customer"] || null,
    fromEmail,
  });

  if (matched?.applicationId || matched?.customerId) result.matched += 1;
  else result.unmatched += 1;

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
      sent_at: receivedAt,
    } as never)
    .select("id")
    .single();

  if (logErr) throw new Error(logErr.message);

  if (matched?.applicationId || matched?.customerId) {
    if (matched.applicationId) {
      await cancelTicketAutocloseForOrder(matched.applicationId, "customer_replied").catch(() => {});
    }
    const openedTicketId = await openOrAppendTicket({
      applicationId: matched.applicationId,
      customerId: matched.customerId,
      leadId: matched.leadId,
      subject,
      body: bodyText,
      fromEmail,
      messageId,
      inReplyTo,
    });
    if (matched.applicationId) {
      // Pause delay-path timers using the ticket id when available so resume-
      // on-close can find them via paused_by_ticket_id.
      await pauseActiveCustomerScheduler(matched.applicationId, openedTicketId ?? logRow?.id ?? null).catch(() => {});
    }
    if (matched.applicationId && openedTicketId) {
      try {
        const { dispatchEvent } = await import("@/lib/workflow/engine.server");
        await dispatchEvent({
          type: "CustomerEmailReceived",
          applicationId: matched.applicationId,
          ticketId: openedTicketId,
          messageId: messageId ?? msg.messageId,
        });
      } catch (e) {
        console.error("[workflow] dispatch CustomerEmailReceived failed", e);
      }
    }
  } else if (fromEmail) {
    // No order/customer match — but we still want staff visibility.
    // Skip obvious system/self senders; everything else becomes a standalone
    // ticket so nothing lands only in quarantine and gets missed.
    const lower = fromEmail.toLowerCase();
    const isSystem =
      /(^|[.@])(noreply|no-reply|mailer-daemon|postmaster|welcome|notifications?)@/i.test(lower) ||
      lower.endsWith("@zohoaccounts.in") ||
      lower.endsWith("@zoho.in") ||
      lower.endsWith("@zoho.com") ||
      lower.endsWith("@businesshelpservices.com") ||
      lower.endsWith("@udyamadhar.in");

    if (isSystem) {
      await supabaseAdmin.from("inbound_email_quarantine").insert({
        zoho_mail_uid: msg.messageId,
        message_id: messageId,
        in_reply_to: inReplyTo,
        from_email: fromEmail,
        to_email: toEmail,
        subject,
        body_text: bodyText.slice(0, 8000),
        body_html: body.html,
        reason: "system_sender",
        received_at: receivedAt,
      } as never);
    } else {
      await openOrAppendTicket({
        applicationId: null,
        customerId: null,
        leadId: null,
        subject,
        body: bodyText,
        fromEmail,
        messageId,
        inReplyTo,
      });
      await supabaseAdmin.from("inbound_email_quarantine").insert({
        zoho_mail_uid: msg.messageId,
        message_id: messageId,
        in_reply_to: inReplyTo,
        from_email: fromEmail,
        to_email: toEmail,
        subject,
        body_text: bodyText.slice(0, 8000),
        body_html: body.html,
        reason: "converted_to_ticket",
        received_at: receivedAt,
      } as never);
    }
  }
}

// ─────────────────────────── Ticket Matching (v2) ───────────────────────

type TicketMatch = {
  ticketId: string;
  ticketEmail: string | null;
  applicationId: string | null;
  customerId: string | null;
  leadId: string | null;
};

async function matchTicket(input: {
  subject: string;
  inReplyTo: string | null;
  references: string[];
}): Promise<TicketMatch | null> {
  const tokenMatch = input.subject.match(/\[#\s*(TKT-\d{8}-\d{3,6})\s*\]/i);
  if (tokenMatch) {
    const ticketNumber = tokenMatch[1].toUpperCase();
    const { data } = await supabaseAdmin
      .from("support_tickets")
      .select("id, ticket_email, application_id, customer_id")
      .eq("ticket_number", ticketNumber)
      .maybeSingle();
    if (data) {
      const r = data as { id: string; ticket_email: string | null; application_id: string | null; customer_id: string | null };
      return {
        ticketId: r.id,
        ticketEmail: r.ticket_email,
        applicationId: r.application_id,
        customerId: r.customer_id,
        leadId: null,
      };
    }
  }

  // Subject contains AP-YYYY-######/UA-YYYY-###### → find the latest open ticket
  // on that application. Zoho customer replies frequently drop In-Reply-To.
  const codeMatch = await matchBySubjectCode(input.subject);
  if (codeMatch?.applicationId) {
    const { data } = await supabaseAdmin
      .from("support_tickets")
      .select("id, ticket_email, application_id, customer_id")
      .eq("application_id", codeMatch.applicationId)
      .in("status", ["open", "in_progress", "waiting_customer"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      const r = data as { id: string; ticket_email: string | null; application_id: string | null; customer_id: string | null };
      return {
        ticketId: r.id,
        ticketEmail: r.ticket_email,
        applicationId: r.application_id,
        customerId: r.customer_id,
        leadId: null,
      };
    }
  }


  const ids = [input.inReplyTo, ...input.references].filter(Boolean) as string[];
  if (ids.length > 0) {
    const { data } = await supabaseAdmin
      .from("ticket_replies")
      .select("ticket_id")
      .in("email_message_id", ids)
      .not("ticket_id", "is", null)
      .limit(1);
    const row = (data ?? [])[0] as { ticket_id: string } | undefined;
    if (row?.ticket_id) {
      const { data: t } = await supabaseAdmin
        .from("support_tickets")
        .select("id, ticket_email, application_id, customer_id")
        .eq("id", row.ticket_id)
        .maybeSingle();
      if (t) {
        const r = t as { id: string; ticket_email: string | null; application_id: string | null; customer_id: string | null };
        return {
          ticketId: r.id,
          ticketEmail: r.ticket_email,
          applicationId: r.application_id,
          customerId: r.customer_id,
          leadId: null,
        };
      }
    }
  }

  return null;
}

async function appendReplyToTicket(input: {
  ticketId: string;
  applicationId: string | null;
  customerId: string | null;
  leadId: string | null;
  subject: string;
  bodyText: string;
  bodyHtml: string | null;
  fromEmail: string | null;
  toEmail: string;
  messageId: string | null;
  inReplyTo: string | null;
  references: string[];
  zohoUid: string;
  receivedAt: string;
}) {
  await supabaseAdmin
    .from("email_logs")
    .insert({
      direction: "incoming",
      status: "sent",
      to_email: input.toEmail,
      from_email: input.fromEmail,
      subject: input.subject,
      body_html: input.bodyHtml,
      body_text: input.bodyText,
      message_id: input.messageId,
      in_reply_to: input.inReplyTo,
      references_header: input.references.join(" ") || null,
      zoho_mail_uid: input.zohoUid,
      application_id: input.applicationId,
      lead_id: input.leadId,
      customer_id: input.customerId,
      sent_at: input.receivedAt,
    } as never);

  await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: input.ticketId,
    reply_text: input.bodyText.slice(0, 8000),
    is_internal: false,
    direction: "inbound",
    email_message_id: input.messageId,
    email_in_reply_to: input.inReplyTo,
  } as never);

  await supabaseAdmin
    .from("support_tickets")
    .update({
      status: "open",
      last_customer_message_at: input.receivedAt,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", input.ticketId);
}

// ─────────────────────────── Matching ───────────────────────────

type MatchResult = {
  applicationId: string | null;
  leadId: string | null;
  customerId: string | null;
} | null;

async function matchOrder(input: {
  subject: string | null;
  inReplyTo: string | null;
  references: string[];
  xBhsOrder: string | null;
  xBhsCustomer: string | null;
  fromEmail: string | null;
}): Promise<MatchResult> {
  // 0) Subject-embedded order code (AP-YYYY-######) or lead code (UA-YYYY-######).
  //    Highest priority — most reliable signal from Zoho replies that drop headers.
  const bySubject = await matchBySubjectCode(input.subject);
  if (bySubject) return bySubject;

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

    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, customer_id")
      .ilike("email", input.fromEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const leadRow = lead as { id: string; customer_id: string | null } | null;
    if (leadRow?.id) {
      const { data: app } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id, order_status, created_at")
        .eq("lead_id", leadRow.id)
        .not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (app) {
        const r = app as { id: string; lead_id: string | null; customer_id: string | null };
        return { applicationId: r.id, leadId: r.lead_id, customerId: r.customer_id ?? leadRow.customer_id };
      }
      return { applicationId: null, leadId: leadRow.id, customerId: leadRow.customer_id };
    }
  }

  return null;
}

// ─────────────────────────── Side effects ───────────────────────────

async function pauseActiveCustomerScheduler(applicationId: string, ticketOrLogId: string | null) {
  // Pause EVERY active delay-path scheduler for this order so remaining
  // business-seconds are preserved and can resume when the ticket closes.
  // Never touch the ticket's own autoclose scheduler.
  const { data: active } = await supabaseAdmin
    .from("order_schedulers")
    .select("id, scheduler_type")
    .eq("application_id", applicationId)
    .eq("status", "active")
    .neq("scheduler_type", "ticket_autoclose_24h");
  const rows = (active ?? []) as Array<{ id: string; scheduler_type: string }>;
  if (!rows.length) return;
  for (const row of rows) {
    await pauseScheduler(row.id, ticketOrLogId).catch((e) => {
      console.error("[inbox] pause scheduler failed", row.id, e);
    });
  }
}

async function openOrAppendTicket(input: {
  applicationId: string | null;
  customerId: string | null;
  leadId?: string | null;
  subject: string;
  body: string;
  fromEmail: string | null;
  messageId?: string | null;
  inReplyTo?: string | null;
}): Promise<string | null> {
  // Find any open ticket for this order in the last 30 days.
  const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  let existingQuery = supabaseAdmin
    .from("support_tickets")
    .select("id")
    .in("status", ["open", "in_progress", "waiting_customer"])
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(1);
  existingQuery = input.applicationId
    ? existingQuery.eq("application_id", input.applicationId)
    : input.customerId
      ? existingQuery.eq("customer_id", input.customerId).is("application_id", null)
      : existingQuery.eq("ticket_email", input.fromEmail ?? "").is("application_id", null);
  const { data: existing } = await existingQuery.maybeSingle();

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
        priority: "medium",
        source: "email_inbound",
        ticket_email: input.fromEmail ? input.fromEmail.trim().toLowerCase() : null,
      } as never)
      .select("id")
      .single();
    if (error) {
      console.error("[zoho-inbox] ticket insert failed", error.message);
      return null;
    }
    ticketId = (created as { id: string }).id;
  }

  await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: ticketId,
    reply_text: `From: ${input.fromEmail || "unknown"}\n\n${input.body.slice(0, 4000)}`,
    is_internal: false,
    direction: "inbound",
    email_message_id: input.messageId ?? null,
    email_in_reply_to: input.inReplyTo ?? null,
  } as never);

  // Update ticket state: customer replied → move to open + timestamp
  await supabaseAdmin
    .from("support_tickets")
    .update({
      status: "open",
      last_customer_message_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", ticketId);

  return ticketId;
}

function stripHtml(html: string | null): string {
  if (!html) return "";
  const withoutTags = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return decodeEntities(withoutTags);
}

/** Decode the common HTML entities that leak into inbound Zoho subjects and text bodies. */
export function decodeEntities(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => {
      try { return String.fromCodePoint(parseInt(h, 16)); } catch { return _; }
    })
    .replace(/&#(\d+);/g, (_, d) => {
      try { return String.fromCodePoint(parseInt(d, 10)); } catch { return _; }
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"');
}

/**
 * Extract an application (AP-YYYY-######) or lead (UA-YYYY-######) code from a subject line
 * and resolve it to an application_id / lead_id / customer_id triple. Runs before other
 * matching strategies because Zoho web/mobile replies frequently drop In-Reply-To headers.
 */
async function matchBySubjectCode(subject: string | null | undefined): Promise<
  { applicationId: string; leadId: string | null; customerId: string | null } | null
> {
  if (!subject) return null;
  const decoded = decodeEntities(subject).toUpperCase();

  const apMatch = decoded.match(/\bAP-\d{4}-\d{6}\b/);
  if (apMatch) {
    const { data } = await supabaseAdmin
      .from("applications")
      .select("id, lead_id, customer_id")
      .eq("application_code", apMatch[0])
      .maybeSingle();
    if (data) {
      const r = data as { id: string; lead_id: string | null; customer_id: string | null };
      return { applicationId: r.id, leadId: r.lead_id, customerId: r.customer_id };
    }
  }

  const uaMatch = decoded.match(/\bUA-\d{4}-\d{6}\b/);
  if (uaMatch) {
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, customer_id")
      .eq("lead_code", uaMatch[0])
      .maybeSingle();
    const leadRow = lead as { id: string; customer_id: string | null } | null;
    if (leadRow?.id) {
      const { data: app } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id, created_at")
        .eq("lead_id", leadRow.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (app) {
        const r = app as { id: string; lead_id: string | null; customer_id: string | null };
        return { applicationId: r.id, leadId: r.lead_id, customerId: r.customer_id ?? leadRow.customer_id };
      }
    }
  }

  return null;
}

