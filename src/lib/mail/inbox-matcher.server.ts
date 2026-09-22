// Incoming Zoho mail matcher (server-only).
// Dedupe by zoho_mail_uid and Message-ID.
// Inbound routing:
// 1. Matches active open tickets (token, AP-code, In-Reply-To/References) -> Appends to existing ticket & marks open.
// 2. Closed tickets remain untouched -> Creates new ticket linked to order.
// 3. Exact AP/UA code matching in subject.
// 4. Multi-order customer fallback leaves application_id NULL if customer has > 1 active order.

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
  const rawSubject = headers.Subject || msg.subject || "(no subject)";
  const subject = normalizeSubject(rawSubject);
  const receivedAt = msg.receivedTime
    ? new Date(Number(msg.receivedTime)).toISOString()
    : new Date().toISOString();
  const bodyText = body.text || stripHtml(body.html) || "";

  // ── Deduplication: Check if message has already been ingested ─────────
  if (messageId) {
    const { data: dupLog } = await supabaseAdmin
      .from("email_logs")
      .select("id")
      .eq("message_id", messageId)
      .eq("direction", "incoming")
      .limit(1)
      .maybeSingle();
    if (dupLog) {
      return;
    }
    const { data: dupReply } = await supabaseAdmin
      .from("ticket_replies")
      .select("id")
      .eq("email_message_id", messageId)
      .limit(1)
      .maybeSingle();
    if (dupReply) {
      return;
    }
  }

  // ── Step 1: Try to match to an ACTIVE ticket ──────────────────────────
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

    // PART 1 & 2: Active ticket exists -> Append message to existing ticket!
    await supabaseAdmin.from("ticket_replies").insert({
      ticket_id: ticketMatch.ticketId,
      reply_text: bodyText.slice(0, 8000),
      is_internal: false,
      direction: "inbound",
      email_message_id: messageId,
      email_in_reply_to: inReplyTo,
    } as never);

    await supabaseAdmin
      .from("support_tickets")
      .update({
        last_customer_message_at: receivedAt,
        updated_at: receivedAt,
        status: "open", // Transition waiting_customer / in_progress -> open (Action Required)
      } as never)
      .eq("id", ticketMatch.ticketId);

    await supabaseAdmin.from("email_logs").insert({
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
      application_id: ticketMatch.applicationId,
      lead_id: ticketMatch.leadId,
      customer_id: ticketMatch.customerId,
      sent_at: receivedAt,
    } as never);

    const { cancelTicketAutocloseByTicket: cancelByTicket } = await import("@/lib/scheduling/schedulers.server");
    await cancelByTicket(ticketMatch.ticketId, "customer_replied").catch(() => {});
    if (ticketMatch.applicationId) {
      await cancelTicketAutocloseForOrder(ticketMatch.applicationId, "customer_replied").catch(() => {});
      try {
        const { dispatchEvent } = await import("@/lib/workflow/engine.server");
        await dispatchEvent({
          type: "TicketOpened",
          applicationId: ticketMatch.applicationId,
          ticketId: ticketMatch.ticketId,
        });
      } catch (e) {
        console.error("[workflow] dispatch TicketOpened failed", e);
      }
    }

    result.matched += 1;
    return;
  }

  // ── Step 2: Fall back to order-level match ─────────────────────────────
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

  // Check if an active ticket exists for this application
  if (matched?.applicationId) {
    const { data: existingActive } = await supabaseAdmin
      .from("support_tickets")
      .select("id, ticket_email, application_id, customer_id")
      .eq("application_id", matched.applicationId)
      .in("status", ["open", "in_progress", "waiting_customer"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingActive) {
      const activeTicket = existingActive as {
        id: string;
        ticket_email: string | null;
        application_id: string | null;
        customer_id: string | null;
      };

      await supabaseAdmin.from("ticket_replies").insert({
        ticket_id: activeTicket.id,
        reply_text: bodyText.slice(0, 8000),
        is_internal: false,
        direction: "inbound",
        email_message_id: messageId,
        email_in_reply_to: inReplyTo,
      } as never);

      await supabaseAdmin
        .from("support_tickets")
        .update({
          last_customer_message_at: receivedAt,
          updated_at: receivedAt,
          status: "open",
        } as never)
        .eq("id", activeTicket.id);

      await supabaseAdmin.from("email_logs").insert({
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
        application_id: activeTicket.application_id,
        lead_id: matched.leadId,
        customer_id: activeTicket.customer_id,
        sent_at: receivedAt,
      } as never);

      const { cancelTicketAutocloseByTicket: cancelByTicket } = await import("@/lib/scheduling/schedulers.server");
      await cancelByTicket(activeTicket.id, "customer_replied").catch(() => {});
      if (activeTicket.application_id) {
        await cancelTicketAutocloseForOrder(activeTicket.application_id, "customer_replied").catch(() => {});
      }
      return;
    }
  }

  // PART 3: No active ticket exists (or previous tickets are closed) -> Create NEW ticket
  if (matched?.applicationId || matched?.customerId) {
    if (matched.applicationId) {
      await cancelTicketAutocloseForOrder(matched.applicationId, "customer_replied").catch(() => {});
    }

    const newTicketId = await createTicketForIncoming({
      applicationId: matched.applicationId,
      customerId: matched.customerId,
      leadId: matched.leadId,
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

    if (matched.applicationId && newTicketId) {
      try {
        const { dispatchEvent } = await import("@/lib/workflow/engine.server");
        await dispatchEvent({
          type: "TicketOpened",
          applicationId: matched.applicationId,
          ticketId: newTicketId,
        });
      } catch (e) {
        console.error("[workflow] dispatch TicketOpened failed", e);
      }
    }
  } else if (fromEmail) {
    // No order/customer match — check system senders vs standalone ticket
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
      await createTicketForIncoming({
        applicationId: null,
        customerId: null,
        leadId: null,
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

// ─────────────────────────── Ticket Matching ───────────────────────────

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
  const norm = normalizeSubject(input.subject);

  // 1) [# TKT-...] token in subject — must only match ACTIVE tickets
  const tokenMatch = norm.match(/\[#\s*(TKT-\d{8}-\d{3,6})\s*\]/i);
  if (tokenMatch) {
    const ticketNumber = tokenMatch[1].toUpperCase();
    const { data } = await supabaseAdmin
      .from("support_tickets")
      .select("id, ticket_email, application_id, customer_id, status")
      .eq("ticket_number", ticketNumber)
      .maybeSingle();
    if (data && ["open", "in_progress", "waiting_customer"].includes((data as any).status)) {
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

  // 2) Subject contains AP-YYYY-######/UA-YYYY-###### -> find latest ACTIVE ticket
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

  // 3) In-Reply-To / References -> find matching ACTIVE ticket
  const ids = [input.inReplyTo, ...input.references].filter(Boolean) as string[];
  if (ids.length > 0) {
    const { data } = await supabaseAdmin
      .from("ticket_replies")
      .select("ticket_id")
      .in("email_message_id", ids)
      .not("ticket_id", "is", null)
      .limit(5);
    for (const row of (data ?? []) as Array<{ ticket_id: string }>) {
      if (row?.ticket_id) {
        const { data: t } = await supabaseAdmin
          .from("support_tickets")
          .select("id, ticket_email, application_id, customer_id, status")
          .eq("id", row.ticket_id)
          .maybeSingle();
        if (t && ["open", "in_progress", "waiting_customer"].includes((t as any).status)) {
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
  }

  return null;
}

async function createTicketForIncoming(input: {
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
}): Promise<string | null> {
  const { data: created, error: tErr } = await supabaseAdmin
    .from("support_tickets")
    .insert({
      application_id: input.applicationId,
      customer_id: input.customerId,
      subject: input.subject.slice(0, 250),
      description: input.bodyText.slice(0, 2000),
      status: "open",
      priority: "medium",
      source: "email_inbound",
      ticket_email: input.fromEmail ? input.fromEmail.trim().toLowerCase() : null,
      last_customer_message_at: input.receivedAt,
      first_response_at: null,
    } as never)
    .select("id")
    .single();

  if (tErr) {
    console.error("[zoho-inbox] ticket creation failed", tErr.message);
    return null;
  }
  const ticketId = (created as { id: string }).id;

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
    ticket_id: ticketId,
    reply_text: input.bodyText.slice(0, 8000),
    is_internal: false,
    direction: "inbound",
    email_message_id: input.messageId,
    email_in_reply_to: input.inReplyTo,
  } as never);

  return ticketId;
}

// ─────────────────────────── Order Matching ───────────────────────────

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
  //    Highest priority — exact regex match.
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

  // 3) PART 5: From email fallback — ONLY link if customer has EXACTLY ONE active order!
  if (input.fromEmail) {
    const { data: cust } = await supabaseAdmin
      .from("customers")
      .select("id")
      .ilike("primary_email", input.fromEmail.trim())
      .maybeSingle();
    const customerId = (cust as { id: string } | null)?.id ?? null;
    if (customerId) {
      const { data: activeApps } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id")
        .eq("customer_id", customerId)
        .not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)");
      const apps = (activeApps ?? []) as Array<{ id: string; lead_id: string | null; customer_id: string | null }>;
      if (apps.length === 1) {
        return { applicationId: apps[0].id, leadId: apps[0].lead_id, customerId };
      }
      // 0 or 2+ active orders -> DO NOT guess! Keep unlinked for manual staff review.
      return { applicationId: null, leadId: null, customerId };
    }

    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, customer_id")
      .ilike("email", input.fromEmail.trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const leadRow = lead as { id: string; customer_id: string | null } | null;
    if (leadRow?.id) {
      const { data: activeApps } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id")
        .eq("lead_id", leadRow.id)
        .not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED)");
      const apps = (activeApps ?? []) as Array<{ id: string; lead_id: string | null; customer_id: string | null }>;
      if (apps.length === 1) {
        return { applicationId: apps[0].id, leadId: apps[0].lead_id, customerId: apps[0].customer_id ?? leadRow.customer_id };
      }
      return { applicationId: null, leadId: leadRow.id, customerId: leadRow.customer_id };
    }
  }

  return null;
}

function stripHtml(html: string | null): string {
  if (!html) return "";
  const withBreaks = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n\s+\n/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return decodeEntities(withBreaks);
}

/** Decode HTML entities, strip zero-width chars, and normalize whitespace. */
export function normalizeSubject(subject: string | null | undefined): string {
  if (!subject) return "";
  return decodeEntities(subject)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
 * and resolve it to an application_id / lead_id / customer_id triple.
 */
async function matchBySubjectCode(subject: string | null | undefined): Promise<
  { applicationId: string | null; leadId: string | null; customerId: string | null } | null
> {
  if (!subject) return null;
  const normalized = normalizeSubject(subject);

  // Match AP-YYYY-NNNNNN or UA-YYYY-NNNNNN (case-insensitive)
  const match = normalized.match(/\b(AP|UA)-\d{4}-\d{6}\b/i);
  if (!match) return null;

  const code = match[0].toUpperCase();

  if (code.startsWith("AP-")) {
    const { data } = await supabaseAdmin
      .from("applications")
      .select("id, lead_id, customer_id")
      .eq("application_code", code)
      .maybeSingle();
    if (data) {
      const r = data as { id: string; lead_id: string | null; customer_id: string | null };
      return { applicationId: r.id, leadId: r.lead_id, customerId: r.customer_id };
    }
  } else if (code.startsWith("UA-")) {
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, customer_id")
      .eq("lead_code", code)
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
      return { applicationId: null, leadId: leadRow.id, customerId: leadRow.customer_id };
    }
  }

  return null;
}


