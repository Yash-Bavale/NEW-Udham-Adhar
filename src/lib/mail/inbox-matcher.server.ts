// Production Incoming Zoho Mail Matcher & Deterministic Pipeline.
// Ingestion Flow:
// 1. Multi-folder discovery (Inbox, Spam/Junk, Archive, custom folders).
// 2. Incremental checkpointing per folder with paginated fetching.
// 3. Central email normalization (From, Reply-To, Subject, Message-ID, References).
// 4. Global idempotency & deduplication.
// 5. Deterministic Matching:
//    - Ticket Match (subject token [# TKT-...], threading headers, subject AP-code).
//    - Alternate Sender: appends to ticket with notice, reopens if closed, NEVER quarantines.
//    - Order Match: explicit AP/UA code -> single active order -> ambiguous active orders ('needs_review').
//    - Unmatched / Unknown Senders: creates support ticket ('unlinked'), NEVER disappears.
// 6. Inbound attachments saved to Supabase Storage and linked to ticket replies.
// 7. Immutable audit trail on email_ingestion_audit_logs.
// 8. Isolated error handling into email_processing_errors without failing the batch.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  discoverZohoFolders,
  fetchFolderMessagesPage,
  getMessageHeaders,
  getMessageContent,
  type ZohoHeaders,
  type ZohoMessageListItem,
  type ZohoFolderInfo,
} from "@/lib/mail/zoho-inbox.server";
import {
  parseSender,
  normalizeMessageId,
  normalizeReferences,
  normalizeSubject,
  stripHtmlToPlainText,
  extractTicketNumber,
  extractOrderCodes,
} from "@/lib/mail/email-normalizer";
import {
  getFolderCheckpoint,
  updateFolderCheckpoint,
  acquireMailboxLock,
  releaseMailboxLock,
} from "@/lib/mail/checkpoint.server";
import {
  filterUnseenUids,
  isMessageAlreadyIngested,
} from "@/lib/mail/deduplication.server";
import {
  recordIngestionAudit,
  recordProcessingError,
} from "@/lib/mail/audit-logger.server";
import { processInboundAttachments } from "@/lib/mail/attachment-processor.server";
import { cancelTicketAutocloseForOrder } from "@/lib/scheduling/schedulers.server";

export type PollResult = {
  fetched: number;
  new: number;
  matched: number;
  unmatched: number;
  duplicates: number;
  errors: number;
  foldersScanned: string[];
  details?: Record<string, string | number | boolean | null>;
};

const MAILBOX_DEFAULT = (process.env.ZOHO_FROM_EMAIL || "help@businesshelpservices.com").trim().toLowerCase();

/**
 * Main entry point: Poll all relevant Zoho folders, ingest new messages, and return pipeline counters.
 */
export async function pollZohoInbox(options?: {
  limit?: number;
  mailbox?: string;
  folderIds?: string[];
  maxPagesPerFolder?: number;
}): Promise<PollResult> {
  const mailbox = (options?.mailbox || MAILBOX_DEFAULT).toLowerCase();
  const workerId = `worker_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const limitPerPage = Math.min(options?.limit || 50, 100);
  const maxPages = options?.maxPagesPerFolder || 5;

  const result: PollResult = {
    fetched: 0,
    new: 0,
    matched: 0,
    unmatched: 0,
    duplicates: 0,
    errors: 0,
    foldersScanned: [],
  };

  // Acquire distributed lock to prevent concurrent overlapping runs
  const lockAcquired = await acquireMailboxLock(mailbox, workerId, 180);
  if (!lockAcquired) {
    console.info(`[zoho-inbox] Another poll is currently active for ${mailbox}. Skipping run.`);
    return { ...result, details: { skipped: true, reason: "concurrent_lock_active" } };
  }

  try {
    const allFolders = await discoverZohoFolders();
    const relevantFolders = allFolders.filter((f) => f.isRelevantInbound);

    if (relevantFolders.length === 0) {
      console.warn(`[zoho-inbox] No inbound folders discovered for ${mailbox}`);
      return result;
    }

    const targetFolders = options?.folderIds?.length
      ? relevantFolders.filter((f) => options.folderIds!.includes(f.folderId))
      : relevantFolders;

    for (const folder of targetFolders) {
      result.foldersScanned.push(`${folder.folderName} (${folder.folderId})`);
      await pollSingleFolder(folder, mailbox, limitPerPage, maxPages, result);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[zoho-inbox] Main polling cycle failed:", msg);
    result.errors += 1;
  } finally {
    await releaseMailboxLock(mailbox, workerId);
  }

  return result;
}

/**
 * Poll a single Zoho folder with pagination and checkpoint advancement.
 */
async function pollSingleFolder(
  folder: ZohoFolderInfo,
  mailbox: string,
  limitPerPage: number,
  maxPages: number,
  result: PollResult,
): Promise<void> {
  let highestReceivedTimeMs = 0;
  let latestUid: string | null = null;
  let pageErrors = 0;
  let totalInFolder = 0;

  try {
    const checkpoint = await getFolderCheckpoint(mailbox, folder.folderId);
    const checkpointTimeMs = checkpoint?.last_received_time_ms || 0;

    for (let page = 1; page <= maxPages; page++) {
      const start = (page - 1) * limitPerPage + 1;
      let messages: ZohoMessageListItem[] = [];

      try {
        messages = await fetchFolderMessagesPage(folder.folderId, start, limitPerPage);
      } catch (e) {
        console.error(`[zoho-inbox] fetchFolderMessagesPage failed for ${folder.folderName} page ${page}:`, e);
        pageErrors++;
        break;
      }

      if (!messages || messages.length === 0) {
        break; // No more messages in this folder
      }

      totalInFolder += messages.length;
      result.fetched += messages.length;

      // Filter out UIDs we have already successfully completed
      const uids = messages.map((m) => m.messageId);
      const seenUids = await filterUnseenUids(uids);

      let hitCheckpoint = false;

      for (const msg of messages) {
        const msgTimeMs = Number(msg.receivedTime || 0);
        if (msgTimeMs > highestReceivedTimeMs) {
          highestReceivedTimeMs = msgTimeMs;
          latestUid = msg.messageId;
        }

        // If message is older than last confirmed checkpoint, stop paginating this folder
        if (checkpointTimeMs > 0 && msgTimeMs > 0 && msgTimeMs < checkpointTimeMs - 60_000) {
          hitCheckpoint = true;
        }

        if (seenUids.has(msg.messageId)) {
          result.duplicates += 1;
          continue;
        }

        // Ingest individual message with isolated error boundary
        try {
          const outcome = await ingestOneMessage(msg, folder, mailbox);
          if (outcome.status === "duplicate") {
            result.duplicates += 1;
          } else if (outcome.status === "matched") {
            result.matched += 1;
            result.new += 1;
          } else {
            result.unmatched += 1;
            result.new += 1;
          }
        } catch (msgErr) {
          result.errors += 1;
          pageErrors++;
          const errText = msgErr instanceof Error ? msgErr.message : String(msgErr);
          console.error(`[zoho-inbox] ingestOneMessage error on UID ${msg.messageId}:`, errText);

          await recordProcessingError({
            zohoMailUid: msg.messageId,
            zohoFolderId: folder.folderId,
            zohoFolderName: folder.folderName,
            errorStage: "PERSIST",
            errorMessage: errText,
            errorStack: msgErr instanceof Error ? msgErr.stack : null,
          });

          await recordIngestionAudit({
            zohoMailUid: msg.messageId,
            zohoFolderId: folder.folderId,
            zohoFolderName: folder.folderName,
            stage: "PROCESSING_ERROR",
            errorDetails: { error: errText },
          });
        }
      }

      // If we received fewer messages than limit, or hit known checkpoint, stop paginating
      if (messages.length < limitPerPage || hitCheckpoint) {
        break;
      }
    }

    // Advance checkpoint if we processed messages without catastrophic folder failure
    if (highestReceivedTimeMs > 0) {
      await updateFolderCheckpoint({
        mailboxAddress: mailbox,
        accountId: folder.folderId,
        folderId: folder.folderId,
        folderName: folder.folderName,
        folderType: folder.folderType,
        lastReceivedTimeMs: highestReceivedTimeMs,
        lastProcessedUid: latestUid,
        status: pageErrors === 0 ? "active" : "partial_error",
        errorMessage: pageErrors > 0 ? `${pageErrors} errors encountered in folder batch` : null,
        resetFailures: pageErrors === 0,
      });
    }
  } catch (folderErr) {
    const msg = folderErr instanceof Error ? folderErr.message : String(folderErr);
    console.error(`[zoho-inbox] Folder processing error on ${folder.folderName}:`, msg);
    result.errors += 1;

    await updateFolderCheckpoint({
      mailboxAddress: mailbox,
      accountId: folder.folderId,
      folderId: folder.folderId,
      folderName: folder.folderName,
      folderType: folder.folderType,
      lastReceivedTimeMs: highestReceivedTimeMs,
      status: "error",
      errorMessage: msg,
    });
  }
}

type IngestOutcome = {
  status: "matched" | "unmatched" | "duplicate";
  ticketId?: string;
  isReply?: boolean;
};

/**
 * Process a single inbound message from header extraction to ticket resolution.
 */
async function ingestOneMessage(
  msg: ZohoMessageListItem,
  folder: ZohoFolderInfo,
  mailboxAddress: string,
): Promise<IngestOutcome> {
  const zohoUid = msg.messageId;

  // 1. Audit discovery
  await recordIngestionAudit({
    zohoMailUid: zohoUid,
    zohoFolderId: folder.folderId,
    zohoFolderName: folder.folderName,
    stage: "DISCOVERED",
  });

  // 2. Fetch raw RFC-822 headers and body content
  let headers: ZohoHeaders = {};
  let body: { html: string | null; text: string | null } = { html: null, text: null };

  try {
    headers = await getMessageHeaders(zohoUid, folder.folderId);
  } catch (hErr) {
    console.warn(`[zoho-inbox] getMessageHeaders fallback on UID ${zohoUid}:`, hErr);
  }

  try {
    body = await getMessageContent(zohoUid, folder.folderId);
  } catch (bErr) {
    console.warn(`[zoho-inbox] getMessageContent fallback on UID ${zohoUid}:`, bErr);
  }

  // 3. Normalization
  const messageId = normalizeMessageId(headers["Message-ID"]);
  const inReplyTo = normalizeMessageId(headers["In-Reply-To"]);
  const references = normalizeReferences(headers["References"]);
  const senderInfo = parseSender(headers.From || msg.fromAddress, headers["Reply-To"]);
  const toEmail = parseSender(headers.To || msg.toAddress).effectiveEmail || mailboxAddress;
  const rawSubject = headers.Subject || msg.subject || "(no subject)";
  const subject = normalizeSubject(rawSubject);
  const receivedAt = msg.receivedTime
    ? new Date(Number(msg.receivedTime)).toISOString()
    : new Date().toISOString();
  const bodyText = body.text || stripHtmlToPlainText(body.html) || "";

  await recordIngestionAudit({
    zohoMailUid: zohoUid,
    zohoFolderId: folder.folderId,
    zohoFolderName: folder.folderName,
    messageId,
    inReplyTo,
    senderRaw: senderInfo.rawFrom,
    senderNormalized: senderInfo.effectiveEmail,
    replyToEmail: senderInfo.replyToEmail,
    toEmail,
    subject,
    stage: "PARSED",
  });

  // 4. Global Deduplication Check
  const dedup = await isMessageAlreadyIngested(zohoUid, messageId);
  if (dedup.isDuplicate) {
    await recordIngestionAudit({
      zohoMailUid: zohoUid,
      zohoFolderId: folder.folderId,
      zohoFolderName: folder.folderName,
      messageId,
      senderNormalized: senderInfo.effectiveEmail,
      subject,
      stage: "DEDUP_SKIPPED",
      isDuplicate: true,
      matchedTicketId: dedup.matchedTicketId,
    });
    return { status: "duplicate", ticketId: dedup.matchedTicketId ?? undefined };
  }

  // 5. Deterministic Matching Engine
  // ── Step 5A: Match Existing Ticket (Active or Closed) ─────────────────
  const ticketMatch = await matchExistingTicket({
    subject,
    inReplyTo,
    references,
    bodySnippet: bodyText.slice(0, 1000),
  });

  if (ticketMatch) {
    const isAlternateSender =
      !!senderInfo.effectiveEmail &&
      !!ticketMatch.ticketEmail &&
      senderInfo.effectiveEmail.toLowerCase() !== ticketMatch.ticketEmail.toLowerCase();

    // =========================================================================
    // CLOSED / RESOLVED TICKET REPLY RULE:
    // If the customer replies to a CLOSED/RESOLVED ticket:
    // - DO NOT reopen the old ticket.
    // - DO NOT append the new customer reply to the closed ticket.
    // - DO NOT change the old ticket status or increment reopen_count.
    // - INSTEAD: CREATE A COMPLETELY NEW SUPPORT TICKET linked to parent_ticket_id.
    // =========================================================================
    if (isClosedTicket(ticketMatch.status)) {
      return await createNewTicketFromClosedTicketReply({
        ticketMatch,
        senderInfo,
        toEmail,
        subject,
        bodyText,
        bodyHtml: body.html,
        bodyRawText: body.text,
        messageId,
        inReplyTo,
        references,
        zohoUid,
        folder,
        receivedAt,
        isAlternateSender,
      });
    }

    // ACTIVE TICKET: Append customer reply to existing open/active ticket
    let replyContent = bodyText.slice(0, 8000);
    if (isAlternateSender) {
      replyContent = `[Inbound message from alternate sender: ${senderInfo.effectiveEmail}]\n\n${replyContent}`;
    }

    // Insert inbound reply on ticket
    const { data: repCreated, error: repErr } = await supabaseAdmin
      .from("ticket_replies")
      .insert({
        ticket_id: ticketMatch.ticketId,
        reply_text: replyContent,
        is_internal: false,
        direction: "inbound",
        email_message_id: messageId,
        email_in_reply_to: inReplyTo,
      } as never)
      .select("id")
      .single();

    if (repErr) throw new Error(`Failed to append reply to ticket: ${repErr.message}`);
    const replyId = (repCreated as { id: string }).id;

    // Update ticket status to open and refresh last customer timestamp
    const ticketPatch: Record<string, unknown> = {
      status: "open",
      last_customer_message_at: receivedAt,
      updated_at: receivedAt,
    };
    if (isAlternateSender) {
      ticketPatch.alternate_sender_email = senderInfo.effectiveEmail;
    }

    await supabaseAdmin
      .from("support_tickets")
      .update(ticketPatch as never)
      .eq("id", ticketMatch.ticketId);

    // Persist email log
    await supabaseAdmin.from("email_logs").insert({
      direction: "incoming",
      status: "sent",
      to_email: toEmail,
      from_email: senderInfo.effectiveEmail,
      subject,
      body_html: body.html,
      body_text: body.text || bodyText,
      message_id: messageId,
      in_reply_to: inReplyTo,
      references_header: references.join(" ") || null,
      zoho_mail_uid: zohoUid,
      application_id: ticketMatch.applicationId,
      lead_id: ticketMatch.leadId,
      customer_id: ticketMatch.customerId,
      sent_at: receivedAt,
      received_at: receivedAt,
    } as never);

    // Process inbound attachments if present
    await processInboundAttachments({
      accountId: folder.folderId,
      folderId: folder.folderId,
      folderName: folder.folderName,
      zohoUid,
      ticketId: ticketMatch.ticketId,
      ticketReplyId: replyId,
    });

    // Cancel auto-close schedulers
    try {
      const { cancelTicketAutocloseByTicket } = await import("@/lib/scheduling/schedulers.server");
      await cancelTicketAutocloseByTicket(ticketMatch.ticketId, "customer_replied").catch(() => {});
      if (ticketMatch.applicationId) {
        await cancelTicketAutocloseForOrder(ticketMatch.applicationId, "customer_replied").catch(() => {});
      }
    } catch { /* non-fatal */ }

    // Dispatch workflow event if linked to order
    if (ticketMatch.applicationId) {
      try {
        const { dispatchEvent } = await import("@/lib/workflow/engine.server");
        await dispatchEvent({
          type: "TicketOpened",
          applicationId: ticketMatch.applicationId,
          ticketId: ticketMatch.ticketId,
        });
      } catch (e) {
        console.error("[workflow] dispatch TicketOpened failed:", e);
      }
    }

    await recordIngestionAudit({
      zohoMailUid: zohoUid,
      zohoFolderId: folder.folderId,
      zohoFolderName: folder.folderName,
      messageId,
      senderNormalized: senderInfo.effectiveEmail,
      subject,
      stage: "COMPLETED",
      matchedTicketId: ticketMatch.ticketId,
      matchedApplicationId: ticketMatch.applicationId,
      matchedCustomerId: ticketMatch.customerId,
      metadata: { isAlternateSender, isReply: true },
    });

    return { status: "matched", ticketId: ticketMatch.ticketId, isReply: true };
  }

  // ── Step 5B: Fall Back to Order / Customer Matching ─────────────────────
  const matchedOrder = await matchOrderByContext({
    subject,
    inReplyTo,
    references,
    fromEmail: senderInfo.effectiveEmail,
    xBhsOrder: headers["X-BHS-Order"] || null,
    xBhsCustomer: headers["X-BHS-Customer"] || null,
    bodySnippet: bodyText.slice(0, 1000),
  });

  // Check if an existing open ticket is already active for this specific order
  if (matchedOrder?.applicationId) {
    const { data: existingActiveTicket } = await supabaseAdmin
      .from("support_tickets")
      .select("id, ticket_email, application_id, customer_id, status")
      .eq("application_id", matchedOrder.applicationId)
      .in("status", ["open", "in_progress", "waiting_customer"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingActiveTicket) {
      const activeT = existingActiveTicket as { id: string; ticket_email: string | null; application_id: string | null; customer_id: string | null };

      const { data: repCreated } = await supabaseAdmin
        .from("ticket_replies")
        .insert({
          ticket_id: activeT.id,
          reply_text: bodyText.slice(0, 8000),
          is_internal: false,
          direction: "inbound",
          email_message_id: messageId,
          email_in_reply_to: inReplyTo,
        } as never)
        .select("id")
        .single();

      const replyId = (repCreated as { id: string }).id;

      await supabaseAdmin
        .from("support_tickets")
        .update({
          status: "open",
          last_customer_message_at: receivedAt,
          updated_at: receivedAt,
        } as never)
        .eq("id", activeT.id);

      await supabaseAdmin.from("email_logs").insert({
        direction: "incoming",
        status: "sent",
        to_email: toEmail,
        from_email: senderInfo.effectiveEmail,
        subject,
        body_html: body.html,
        body_text: body.text || bodyText,
        message_id: messageId,
        in_reply_to: inReplyTo,
        references_header: references.join(" ") || null,
        zoho_mail_uid: zohoUid,
        application_id: activeT.application_id,
        lead_id: matchedOrder.leadId,
        customer_id: activeT.customer_id,
        sent_at: receivedAt,
        received_at: receivedAt,
      } as never);

      await processInboundAttachments({
        accountId: folder.folderId,
        folderId: folder.folderId,
        folderName: folder.folderName,
        zohoUid,
        ticketId: activeT.id,
        ticketReplyId: replyId,
      });

      await recordIngestionAudit({
        zohoMailUid: zohoUid,
        zohoFolderId: folder.folderId,
        zohoFolderName: folder.folderName,
        messageId,
        senderNormalized: senderInfo.effectiveEmail,
        subject,
        stage: "COMPLETED",
        matchedTicketId: activeT.id,
        matchedApplicationId: activeT.application_id,
        matchedCustomerId: activeT.customer_id,
      });

      return { status: "matched", ticketId: activeT.id, isReply: true };
    }
  }

  // ── Step 5C: Create Support Ticket (Linked or Unlinked) ─────────────────
  // Every legitimate incoming email that is not an existing reply becomes a support ticket.
  // NO email is ever dropped into a silent quarantine black hole.
  const isUnlinked = !matchedOrder?.customerId || !matchedOrder?.applicationId;
  const orderLinkStatus = matchedOrder?.orderLinkStatus || (matchedOrder?.applicationId ? "linked" : "unlinked");

  const { data: createdTicket, error: tErr } = await supabaseAdmin
    .from("support_tickets")
    .insert({
      application_id: matchedOrder?.applicationId ?? null,
      customer_id: matchedOrder?.customerId ?? null,
      subject: subject.slice(0, 250),
      description: bodyText.slice(0, 4000),
      status: "open",
      priority: "medium",
      source: "email_inbound",
      ticket_email: senderInfo.effectiveEmail,
      is_unlinked: isUnlinked,
      order_link_status: orderLinkStatus,
      last_customer_message_at: receivedAt,
      first_response_at: null,
      created_at: receivedAt,
      updated_at: receivedAt,
    } as never)
    .select("id, ticket_number")
    .single();

  if (tErr) throw new Error(`Failed to create support ticket: ${tErr.message}`);
  const newTicket = createdTicket as { id: string; ticket_number: string };

  // Create initial reply record containing the full message body
  const { data: initialReply } = await supabaseAdmin
    .from("ticket_replies")
    .insert({
      ticket_id: newTicket.id,
      reply_text: bodyText.slice(0, 8000),
      is_internal: false,
      direction: "inbound",
      email_message_id: messageId,
      email_in_reply_to: inReplyTo,
      created_at: receivedAt,
    } as never)
    .select("id")
    .single();

  const replyId = (initialReply as { id: string }).id;

  // Insert into email logs
  await supabaseAdmin.from("email_logs").insert({
    direction: "incoming",
    status: "sent",
    to_email: toEmail,
    from_email: senderInfo.effectiveEmail,
    subject,
    body_html: body.html,
    body_text: body.text || bodyText,
    message_id: messageId,
    in_reply_to: inReplyTo,
    references_header: references.join(" ") || null,
    zoho_mail_uid: zohoUid,
    application_id: matchedOrder?.applicationId ?? null,
    lead_id: matchedOrder?.leadId ?? null,
    customer_id: matchedOrder?.customerId ?? null,
    sent_at: receivedAt,
    received_at: receivedAt,
  } as never);

  // Process attachments
  await processInboundAttachments({
    accountId: folder.folderId,
    folderId: folder.folderId,
    folderName: folder.folderName,
    zohoUid,
    ticketId: newTicket.id,
    ticketReplyId: replyId,
  });

  // Cancel order delay autoclose if linked to order
  if (matchedOrder?.applicationId) {
    await cancelTicketAutocloseForOrder(matchedOrder.applicationId, "customer_replied").catch(() => {});
    try {
      const { dispatchEvent } = await import("@/lib/workflow/engine.server");
      await dispatchEvent({
        type: "TicketOpened",
        applicationId: matchedOrder.applicationId,
        ticketId: newTicket.id,
      });
    } catch { /* non-fatal */ }
  }

  await recordIngestionAudit({
    zohoMailUid: zohoUid,
    zohoFolderId: folder.folderId,
    zohoFolderName: folder.folderName,
    messageId,
    senderNormalized: senderInfo.effectiveEmail,
    subject,
    stage: "COMPLETED",
    matchedTicketId: newTicket.id,
    matchedApplicationId: matchedOrder?.applicationId ?? null,
    matchedCustomerId: matchedOrder?.customerId ?? null,
    metadata: { isUnlinked, orderLinkStatus, isSystemSender: senderInfo.isSystemSender, resolutionMethod: matchedOrder?.resolutionMethod ?? null },
  });

  return {
    status: matchedOrder?.customerId ? "matched" : "unmatched",
    ticketId: newTicket.id,
    isReply: false,
  };
}

/**
 * Helper to determine if a ticket is in a closed/resolved state.
 */
export function isClosedTicket(status: string | null | undefined): boolean {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s === "closed" || s === "resolved";
}

/**
 * Business Rule: When customer replies to a closed ticket thread:
 * 1. Do NOT reopen the old ticket.
 * 2. Do NOT change the old ticket status or increment reopen_count.
 * 3. Do NOT append the new reply to the closed ticket.
 * 4. Create a completely new ticket with parent_ticket_id set to the closed ticket.
 * 5. Inherit customer_id, application_id, and order_link_status.
 * 6. Set the inbound message as the first reply of the new ticket.
 * 7. Route any attachments to the new ticket.
 * 8. Log explicit audit stage CLOSED_TICKET_REPLY_NEW_TICKET.
 */
export async function createNewTicketFromClosedTicketReply(input: {
  ticketMatch: TicketMatchResult;
  senderInfo: ReturnType<typeof parseSender>;
  toEmail: string;
  subject: string;
  bodyText: string;
  bodyHtml: string | null;
  bodyRawText: string | null;
  messageId: string | null;
  inReplyTo: string | null;
  references: string[];
  zohoUid: string;
  folder: ZohoFolderInfo;
  receivedAt: string;
  isAlternateSender: boolean;
}): Promise<IngestOutcome> {
  const {
    ticketMatch,
    senderInfo,
    toEmail,
    subject,
    bodyText,
    bodyHtml,
    bodyRawText,
    messageId,
    inReplyTo,
    references,
    zohoUid,
    folder,
    receivedAt,
    isAlternateSender,
  } = input;

  let resolvedApplicationId = ticketMatch.applicationId;
  let resolvedCustomerId = ticketMatch.customerId;
  let resolvedLeadId = ticketMatch.leadId;

  // If parent ticket had no order linked or incoming subject/body has explicit order code, resolve order
  if (!resolvedApplicationId) {
    try {
      const matchedOrder = await matchOrderByContext({
        subject,
        inReplyTo,
        references,
        fromEmail: senderInfo.effectiveEmail,
        xBhsOrder: null,
        xBhsCustomer: null,
        bodySnippet: bodyText.slice(0, 1000),
      });

      if (matchedOrder?.applicationId) {
        resolvedApplicationId = matchedOrder.applicationId;
        if (matchedOrder.customerId) resolvedCustomerId = matchedOrder.customerId;
        if (matchedOrder.leadId) resolvedLeadId = matchedOrder.leadId;
      }
    } catch (e) {
      console.warn("[inbox-matcher] matchOrderByContext in closed reply warning:", e);
    }
  }

  const isUnlinked = !resolvedCustomerId && !resolvedApplicationId;
  const orderLinkStatus = resolvedApplicationId ? "linked" : "unlinked";

  // 1. Create the new support ticket linked to parent_ticket_id
  const { data: createdTicket, error: tErr } = await supabaseAdmin
    .from("support_tickets")
    .insert({
      parent_ticket_id: ticketMatch.ticketId,
      application_id: resolvedApplicationId ?? null,
      customer_id: resolvedCustomerId ?? null,
      subject: subject.slice(0, 250),
      description: bodyText.slice(0, 4000),
      status: "open",
      priority: "medium",
      source: "email_inbound",
      ticket_email: senderInfo.effectiveEmail,
      alternate_sender_email: isAlternateSender ? senderInfo.effectiveEmail : null,
      is_unlinked: isUnlinked,
      order_link_status: orderLinkStatus,
      last_customer_message_at: receivedAt,
      first_response_at: null,
      created_at: receivedAt,
      updated_at: receivedAt,
    } as never)
    .select("id, ticket_number")
    .single();

  if (tErr) throw new Error(`Failed to create support ticket from closed reply: ${tErr.message}`);
  const newTicket = createdTicket as { id: string; ticket_number: string };

  // 2. Format inbound reply content (with notice if alternate sender)
  let replyContent = bodyText.slice(0, 8000);
  if (isAlternateSender) {
    replyContent = `[Inbound message from alternate sender: ${senderInfo.effectiveEmail}]\n\n${replyContent}`;
  }

  // 3. Create initial reply on NEW ticket
  const { data: initialReply, error: repErr } = await supabaseAdmin
    .from("ticket_replies")
    .insert({
      ticket_id: newTicket.id,
      reply_text: replyContent,
      is_internal: false,
      direction: "inbound",
      email_message_id: messageId,
      email_in_reply_to: inReplyTo,
      created_at: receivedAt,
    } as never)
    .select("id")
    .single();

  if (repErr) throw new Error(`Failed to create initial reply on new ticket: ${repErr.message}`);
  const replyId = (initialReply as { id: string }).id;

  // 4. Record email log
  await supabaseAdmin.from("email_logs").insert({
    direction: "incoming",
    status: "sent",
    to_email: toEmail,
    from_email: senderInfo.effectiveEmail,
    subject,
    body_html: bodyHtml,
    body_text: bodyRawText || bodyText,
    message_id: messageId,
    in_reply_to: inReplyTo,
    references_header: references.join(" ") || null,
    zoho_mail_uid: zohoUid,
    application_id: resolvedApplicationId,
    lead_id: resolvedLeadId,
    customer_id: resolvedCustomerId,
    sent_at: receivedAt,
    received_at: receivedAt,
  } as never);

  // 5. Route inbound attachments to NEW ticket
  await processInboundAttachments({
    accountId: folder.folderId,
    folderId: folder.folderId,
    folderName: folder.folderName,
    zohoUid,
    ticketId: newTicket.id,
    ticketReplyId: replyId,
  });

  // 6. Workflow event if linked to order
  if (resolvedApplicationId) {
    try {
      const { dispatchEvent } = await import("@/lib/workflow/engine.server");
      await dispatchEvent({
        type: "TicketOpened",
        applicationId: resolvedApplicationId,
        ticketId: newTicket.id,
      });
    } catch (e) {
      console.error("[workflow] dispatch TicketOpened failed for new ticket from closed reply:", e);
    }
  }

  // 7. Record explicit audit log event: CLOSED_TICKET_REPLY_NEW_TICKET
  await recordIngestionAudit({
    zohoMailUid: zohoUid,
    zohoFolderId: folder.folderId,
    zohoFolderName: folder.folderName,
    messageId,
    senderNormalized: senderInfo.effectiveEmail,
    subject,
    stage: "CLOSED_TICKET_REPLY_NEW_TICKET",
    matchedTicketId: newTicket.id,
    matchedApplicationId: resolvedApplicationId,
    matchedCustomerId: resolvedCustomerId,
    metadata: {
      action: "created_new_ticket_from_closed_parent",
      parentTicketId: ticketMatch.ticketId,
      parentTicketNumber: ticketMatch.ticketNumber,
      parentTicketStatus: ticketMatch.status,
      isAlternateSender,
      newTicketId: newTicket.id,
      newTicketNumber: newTicket.ticket_number,
    },
  });

  await recordIngestionAudit({
    zohoMailUid: zohoUid,
    zohoFolderId: folder.folderId,
    zohoFolderName: folder.folderName,
    messageId,
    senderNormalized: senderInfo.effectiveEmail,
    subject,
    stage: "COMPLETED",
    matchedTicketId: newTicket.id,
    matchedApplicationId: resolvedApplicationId,
    matchedCustomerId: resolvedCustomerId,
    metadata: {
      isReplyToClosedTicket: true,
      parentTicketId: ticketMatch.ticketId,
      isAlternateSender,
    },
  });

  return {
    status: "matched",
    ticketId: newTicket.id,
    isReply: false,
  };
}

// ─────────────────────────── Matching Helpers ───────────────────────────

export type TicketMatchResult = {
  ticketId: string;
  ticketNumber: string | null;
  ticketEmail: string | null;
  applicationId: string | null;
  customerId: string | null;
  leadId: string | null;
  status: string;
  reopenCount?: number;
};

/** Match existing ticket by subject token, In-Reply-To, or explicit order code. */
async function matchExistingTicket(input: {
  subject: string;
  inReplyTo: string | null;
  references: string[];
  bodySnippet?: string | null;
}): Promise<TicketMatchResult | null> {
  // 1) Subject token [# TKT-YYYYMMDD-XXXX] or bare TKT-YYYYMMDD-XXXX
  const ticketNumber = extractTicketNumber(input.subject);
  if (ticketNumber) {
    const { data } = await supabaseAdmin
      .from("support_tickets")
      .select("id, ticket_number, ticket_email, application_id, customer_id, status, reopen_count")
      .eq("ticket_number", ticketNumber)
      .maybeSingle();

    if (data) {
      const r = data as any;
      let appId = r.application_id;
      let custId = r.customer_id;
      if (!appId) {
        const { applicationCode } = extractOrderCodes(input.subject, input.bodySnippet);
        if (applicationCode) {
          const { data: app } = await supabaseAdmin
            .from("applications")
            .select("id, customer_id")
            .eq("application_code", applicationCode)
            .maybeSingle();
          if (app) {
            appId = (app as any).id;
            if (!custId) custId = (app as any).customer_id;
            await supabaseAdmin
              .from("support_tickets")
              .update({ application_id: appId, customer_id: custId, is_unlinked: false, order_link_status: "linked" } as never)
              .eq("id", r.id);
          }
        }
      }
      return {
        ticketId: r.id,
        ticketNumber: r.ticket_number,
        ticketEmail: r.ticket_email,
        applicationId: appId,
        customerId: custId,
        leadId: null,
        status: r.status,
        reopenCount: r.reopen_count,
      };
    }
  }

  // 2) Threading headers (In-Reply-To / References) against ticket_replies
  const ids = [input.inReplyTo, ...input.references].filter(Boolean) as string[];
  if (ids.length > 0) {
    const { data: replies } = await supabaseAdmin
      .from("ticket_replies")
      .select("ticket_id")
      .in("email_message_id", ids)
      .not("ticket_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(5);

    for (const rep of (replies ?? []) as Array<{ ticket_id: string }>) {
      if (rep.ticket_id) {
        const { data: t } = await supabaseAdmin
          .from("support_tickets")
          .select("id, ticket_number, ticket_email, application_id, customer_id, status, reopen_count")
          .eq("id", rep.ticket_id)
          .maybeSingle();

        if (t) {
          const r = t as any;
          let appId = r.application_id;
          let custId = r.customer_id;
          if (!appId) {
            const { applicationCode } = extractOrderCodes(input.subject, input.bodySnippet);
            if (applicationCode) {
              const { data: app } = await supabaseAdmin
                .from("applications")
                .select("id, customer_id")
                .eq("application_code", applicationCode)
                .maybeSingle();
              if (app) {
                appId = (app as any).id;
                if (!custId) custId = (app as any).customer_id;
                await supabaseAdmin
                  .from("support_tickets")
                  .update({ application_id: appId, customer_id: custId, is_unlinked: false, order_link_status: "linked" } as never)
                  .eq("id", r.id);
              }
            }
          }
          return {
            ticketId: r.id,
            ticketNumber: r.ticket_number,
            ticketEmail: r.ticket_email,
            applicationId: appId,
            customerId: custId,
            leadId: null,
            status: r.status,
            reopenCount: r.reopen_count,
          };
        }
      }
    }
  }

  // 3) Explicit AP-code in subject -> check latest open ticket for that application
  const { applicationCode } = extractOrderCodes(input.subject, input.bodySnippet);
  if (applicationCode) {
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id, customer_id, lead_id")
      .eq("application_code", applicationCode)
      .maybeSingle();

    if (app) {
      const appId = (app as { id: string }).id;
      const { data: t } = await supabaseAdmin
        .from("support_tickets")
        .select("id, ticket_number, ticket_email, application_id, customer_id, status, reopen_count")
        .eq("application_id", appId)
        .in("status", ["open", "in_progress", "waiting_customer"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (t) {
        const r = t as any;
        return {
          ticketId: r.id,
          ticketNumber: r.ticket_number,
          ticketEmail: r.ticket_email,
          applicationId: r.application_id,
          customerId: r.customer_id,
          leadId: (app as any).lead_id ?? null,
          status: r.status,
          reopenCount: r.reopen_count,
        };
      }
    }
  }

  return null;
}

type OrderMatchResult = {
  applicationId: string | null;
  leadId: string | null;
  customerId: string | null;
  orderLinkStatus: "linked" | "needs_review" | "unlinked";
  /** Identifies which matching strategy produced this result — for audit/observability only. */
  resolutionMethod: "ap_code" | "ua_lead_code" | "thread_headers" | "x_bhs_order" | "customer_email" | "lead_email";
};

/** Match order and customer deterministically using exact priorities. */
async function matchOrderByContext(input: {
  subject: string;
  inReplyTo: string | null;
  references: string[];
  fromEmail: string | null;
  xBhsOrder: string | null;
  xBhsCustomer: string | null;
  bodySnippet?: string | null;
}): Promise<OrderMatchResult | null> {
  // 1) Explicit AP-YYYY-XXXXXX or UA-YYYY-XXXXXX code in subject or body
  const { applicationCode, leadCode } = extractOrderCodes(input.subject, input.bodySnippet);

  if (applicationCode) {
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id, lead_id, customer_id")
      .eq("application_code", applicationCode)
      .maybeSingle();

    if (app) {
      const r = app as any;
      return {
        applicationId: r.id,
        leadId: r.lead_id,
        customerId: r.customer_id,
        orderLinkStatus: "linked",
        resolutionMethod: "ap_code",
      };
    }
  }

  if (leadCode) {
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, customer_id")
      .eq("lead_code", leadCode)
      .maybeSingle();

    if (lead) {
      const l = lead as any;
      const { data: app } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id")
        .eq("lead_id", l.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (app) {
        return {
          applicationId: (app as any).id,
          leadId: l.id,
          customerId: (app as any).customer_id ?? l.customer_id,
          orderLinkStatus: "linked",
          resolutionMethod: "ua_lead_code",
        };
      }
      return {
        applicationId: null,
        leadId: l.id,
        customerId: l.customer_id,
        orderLinkStatus: "unlinked",
        resolutionMethod: "ua_lead_code",
      };
    }
  }

  // 2) Threading headers against email_logs
  const ids = [input.inReplyTo, ...input.references].filter(Boolean) as string[];
  if (ids.length > 0) {
    const { data: logs } = await supabaseAdmin
      .from("email_logs")
      .select("application_id, lead_id, customer_id")
      .in("message_id", ids)
      .not("application_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (logs && logs.length > 0) {
      const r = logs[0] as any;
      if (r.application_id) {
        return {
          applicationId: r.application_id,
          leadId: r.lead_id,
          customerId: r.customer_id,
          orderLinkStatus: "linked",
          resolutionMethod: "thread_headers",
        };
      }
    }
  }

  // 3) X-BHS-Order header
  if (input.xBhsOrder) {
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id, lead_id, customer_id")
      .eq("id", input.xBhsOrder)
      .maybeSingle();

    if (app) {
      const r = app as any;
      return {
        applicationId: r.id,
        leadId: r.lead_id,
        customerId: r.customer_id,
        orderLinkStatus: "linked",
        resolutionMethod: "x_bhs_order",
      };
    }
  }

  // 4) Customer exact email fallback
  // Email addresses are stored normalized (lowercase) but we use ilike as a safety net.
  // IMPORTANT: both customer and lead lookups use ilike for consistent case-insensitive matching.
  if (input.fromEmail) {
    const email = input.fromEmail.trim().toLowerCase();

    const { data: cust } = await supabaseAdmin
      .from("customers")
      .select("id")
      .ilike("primary_email", email)
      .maybeSingle();

    const customerId = (cust as { id: string } | null)?.id ?? null;

    if (customerId) {
      const { data: activeApps } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id")
        .eq("customer_id", customerId)
        // REFUND_APPROVED is also terminal — include it alongside COMPLETED/CLOSED/REFUND_PROCESSED
        .not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED,REFUND_APPROVED)");

      const apps = (activeApps ?? []) as Array<{ id: string; lead_id: string | null; customer_id: string | null }>;

      if (apps.length === 1) {
        return {
          applicationId: apps[0].id,
          leadId: apps[0].lead_id,
          customerId,
          orderLinkStatus: "linked",
          resolutionMethod: "customer_email",
        };
      }

      // Multiple active orders — do not guess; flag for review
      if (apps.length > 1) {
        return {
          applicationId: null,
          leadId: null,
          customerId,
          orderLinkStatus: "needs_review",
          resolutionMethod: "customer_email",
        };
      }

      // Customer has 0 active orders (all completed or closed)
      return {
        applicationId: null,
        leadId: null,
        customerId,
        orderLinkStatus: "unlinked",
        resolutionMethod: "customer_email",
      };
    }

    // 5) Lead email fallback — use ilike (consistent with customer lookup above)
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, customer_id")
      .ilike("email", email)  // was .eq() — fixed to ilike for case-insensitive consistency
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const leadRow = lead as { id: string; customer_id: string | null } | null;
    if (leadRow?.id) {
      const { data: activeApps } = await supabaseAdmin
        .from("applications")
        .select("id, lead_id, customer_id")
        .eq("lead_id", leadRow.id)
        .not("order_status", "in", "(COMPLETED,CLOSED,REFUND_PROCESSED,REFUND_APPROVED)");

      const apps = (activeApps ?? []) as Array<{ id: string; lead_id: string | null; customer_id: string | null }>;
      if (apps.length === 1) {
        return {
          applicationId: apps[0].id,
          leadId: apps[0].lead_id,
          customerId: apps[0].customer_id ?? leadRow.customer_id,
          orderLinkStatus: "linked",
          resolutionMethod: "lead_email",
        };
      }
      return {
        applicationId: null,
        leadId: leadRow.id,
        customerId: leadRow.customer_id,
        orderLinkStatus: apps.length > 1 ? "needs_review" : "unlinked",
        resolutionMethod: "lead_email",
      };
    }
  }

  return null;
}
