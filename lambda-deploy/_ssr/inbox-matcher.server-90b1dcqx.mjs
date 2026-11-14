import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import { a as discoverZohoFolders, e as extractOrderCodes, f as fetchMessageAttachmentsList, d as downloadZohoAttachment, b as fetchFolderMessagesPage, g as getMessageHeaders, c as getMessageContent, n as normalizeMessageId$1, h as normalizeReferences, p as parseSender, i as normalizeSubject, s as stripHtmlToPlainText, j as extractTicketNumber } from "./zoho-inbox.server-LDkoyP34.mjs";
import { acquireMailboxLock, releaseMailboxLock, getFolderCheckpoint, updateFolderCheckpoint } from "./checkpoint.server-MYsV3SGk.mjs";
import { cancelTicketAutocloseForOrder } from "./schedulers.server-BPR-45Y2.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./business-hours-B-Ly-oQa.mjs";
import "./emails.server-BTJhg2a3.mjs";
import "./smtp.server-D7qNu26j.mjs";
import "./transport.server-COs9qGOQ.mjs";
import "./zeptomail.server-FqoGmUCt.mjs";
import "./bhs-templates-Gd1TLGXv.mjs";
async function filterUnseenUids(uids) {
  if (uids.length === 0) return /* @__PURE__ */ new Set();
  const [logsRes, auditRes] = await Promise.all([
    supabaseAdmin.from("email_logs").select("zoho_mail_uid").in("zoho_mail_uid", uids),
    supabaseAdmin.from("email_ingestion_audit_logs").select("zoho_mail_uid").in("zoho_mail_uid", uids).eq("stage", "COMPLETED")
  ]);
  const seen = /* @__PURE__ */ new Set();
  (logsRes.data ?? []).forEach((r) => {
    if (r.zoho_mail_uid) seen.add(r.zoho_mail_uid);
  });
  (auditRes.data ?? []).forEach((r) => {
    if (r.zoho_mail_uid) seen.add(r.zoho_mail_uid);
  });
  return seen;
}
async function isMessageAlreadyIngested(zohoUid, normalizedMessageId) {
  if (zohoUid) {
    const { data: logByUid } = await supabaseAdmin.from("email_logs").select("id, application_id").eq("zoho_mail_uid", zohoUid).limit(1).maybeSingle();
    if (logByUid) return { isDuplicate: true };
  }
  if (normalizedMessageId) {
    const { data: logByMsgId } = await supabaseAdmin.from("email_logs").select("id").eq("message_id", normalizedMessageId).eq("direction", "incoming").limit(1).maybeSingle();
    if (logByMsgId) return { isDuplicate: true };
    const { data: repByMsgId } = await supabaseAdmin.from("ticket_replies").select("ticket_id").eq("email_message_id", normalizedMessageId).limit(1).maybeSingle();
    if (repByMsgId) {
      return { isDuplicate: true, matchedTicketId: repByMsgId.ticket_id };
    }
  }
  return { isDuplicate: false };
}
async function recordIngestionAudit(event) {
  const { error } = await supabaseAdmin.from("email_ingestion_audit_logs").insert({
    zoho_mail_uid: event.zohoMailUid,
    zoho_folder_id: event.zohoFolderId ?? null,
    zoho_folder_name: event.zohoFolderName ?? null,
    message_id: event.messageId ?? null,
    in_reply_to: event.inReplyTo ?? null,
    sender_raw: event.senderRaw ?? null,
    sender_normalized: event.senderNormalized ?? null,
    reply_to_email: event.replyToEmail ?? null,
    to_email: event.toEmail ?? null,
    subject: event.subject ?? null,
    stage: event.stage,
    matched_ticket_id: event.matchedTicketId ?? null,
    matched_application_id: event.matchedApplicationId ?? null,
    matched_customer_id: event.matchedCustomerId ?? null,
    is_duplicate: event.isDuplicate ?? false,
    metadata: event.metadata ?? null,
    error_details: event.errorDetails ?? null
  });
  if (error) {
    throw new Error(`[audit] recordIngestionAudit failed for UID ${event.zohoMailUid}: ${error.message}`);
  }
}
async function recordProcessingError(input) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const { data, error } = await supabaseAdmin.from("email_processing_errors").upsert(
    {
      zoho_mail_uid: input.zohoMailUid,
      zoho_folder_id: input.zohoFolderId ?? null,
      zoho_folder_name: input.zohoFolderName ?? null,
      message_id: input.messageId ?? null,
      from_email: input.fromEmail ?? null,
      reply_to_email: input.replyToEmail ?? null,
      subject: input.subject ?? null,
      body_snippet: (input.bodySnippet || "").slice(0, 1e3),
      raw_headers: input.rawHeaders ?? null,
      error_stage: input.errorStage,
      error_message: input.errorMessage.slice(0, 1e3),
      error_stack: input.errorStack?.slice(0, 2e3) ?? null,
      status: "new",
      updated_at: now
    },
    { onConflict: "zoho_mail_uid" }
  ).select("id").maybeSingle();
  if (error) {
    throw new Error(`[audit] recordProcessingError failed for UID ${input.zohoMailUid}: ${error.message}`);
  }
  return data?.id ?? null;
}
async function processInboundAttachments(input) {
  const results = [];
  let attachmentList = [];
  try {
    attachmentList = await fetchMessageAttachmentsList(input.zohoUid, input.folderId);
  } catch (e) {
    console.warn(`[attachments] Failed to list attachments for UID ${input.zohoUid}:`, e);
    return [];
  }
  if (attachmentList.length === 0) return [];
  for (const meta of attachmentList) {
    try {
      const downloaded = await downloadZohoAttachment(
        input.zohoUid,
        input.folderId,
        meta.attachmentId,
        meta.attachmentName,
        meta.isInline,
        meta.cid
      );
      if (!downloaded || !downloaded.buffer) {
        throw new Error(`Empty attachment buffer for ${meta.attachmentName}`);
      }
      const safeFilename = meta.attachmentName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `support-tickets/${input.ticketId}/${input.ticketReplyId}/${Date.now()}_${safeFilename}`;
      const bucket = "documents";
      const { error: uploadErr } = await supabaseAdmin.storage.from(bucket).upload(storagePath, downloaded.buffer, {
        contentType: downloaded.contentType || meta.contentType || "application/octet-stream",
        upsert: true
      });
      if (uploadErr) {
        throw new Error(`Storage upload error: ${uploadErr.message}`);
      }
      const identifier = meta.cid || meta.attachmentId;
      await supabaseAdmin.from("ticket_reply_attachments").insert({
        ticket_id: input.ticketId,
        ticket_reply_id: input.ticketReplyId,
        file_name: meta.attachmentName,
        file_size: Number(meta.attachmentSize || downloaded.buffer.length),
        mime_type: downloaded.contentType || meta.contentType || "application/octet-stream",
        storage_bucket: bucket,
        storage_path: storagePath,
        zoho_attachment_id: identifier
      });
      results.push({
        fileName: meta.attachmentName,
        fileSize: Number(meta.attachmentSize || downloaded.buffer.length),
        mimeType: downloaded.contentType || meta.contentType || "application/octet-stream",
        storagePath,
        zohoAttachmentId: identifier,
        cid: meta.cid,
        isInline: meta.isInline
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Attachment upload failed";
      console.error(`[attachments] Error processing ${meta.attachmentName} for UID ${input.zohoUid}:`, msg);
      await recordProcessingError({
        zohoMailUid: input.zohoUid,
        zohoFolderId: input.folderId,
        zohoFolderName: input.folderName,
        errorStage: "ATTACHMENT",
        errorMessage: `Failed attachment '${meta.attachmentName}': ${msg}`,
        errorStack: err instanceof Error ? err.stack : null
      });
    }
  }
  return results;
}
const MAILBOX_DEFAULT = (process.env.ZOHO_FROM_EMAIL || "help@businesshelpservices.com").trim().toLowerCase();
async function pollZohoInbox(options) {
  const mailbox = (options?.mailbox || MAILBOX_DEFAULT).toLowerCase();
  const workerId = `worker_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const limitPerPage = Math.min(options?.limit || 50, 100);
  const maxPages = options?.maxPagesPerFolder || 5;
  const result = {
    fetched: 0,
    new: 0,
    matched: 0,
    unmatched: 0,
    duplicates: 0,
    errors: 0,
    foldersScanned: []
  };
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
    const targetFolders = options?.folderIds?.length ? relevantFolders.filter((f) => options.folderIds.includes(f.folderId)) : relevantFolders;
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
async function pollSingleFolder(folder, mailbox, limitPerPage, maxPages, result) {
  let highestReceivedTimeMs = 0;
  let latestUid = null;
  let pageErrors = 0;
  let totalInFolder = 0;
  try {
    const checkpoint = await getFolderCheckpoint(mailbox, folder.folderId);
    const checkpointTimeMs = checkpoint?.last_received_time_ms || 0;
    for (let page = 1; page <= maxPages; page++) {
      const start = (page - 1) * limitPerPage + 1;
      let messages = [];
      try {
        messages = await fetchFolderMessagesPage(folder.folderId, start, limitPerPage);
      } catch (e) {
        console.error(`[zoho-inbox] fetchFolderMessagesPage failed for ${folder.folderName} page ${page}:`, e);
        pageErrors++;
        break;
      }
      if (!messages || messages.length === 0) {
        break;
      }
      totalInFolder += messages.length;
      result.fetched += messages.length;
      const uids = messages.map((m) => m.messageId);
      const seenUids = await filterUnseenUids(uids);
      let hitCheckpoint = false;
      for (const msg of messages) {
        const msgTimeMs = Number(msg.receivedTime || 0);
        if (msgTimeMs > highestReceivedTimeMs) {
          highestReceivedTimeMs = msgTimeMs;
          latestUid = msg.messageId;
        }
        if (checkpointTimeMs > 0 && msgTimeMs > 0 && msgTimeMs < checkpointTimeMs - 6e4) {
          hitCheckpoint = true;
        }
        if (seenUids.has(msg.messageId)) {
          result.duplicates += 1;
          continue;
        }
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
            errorStack: msgErr instanceof Error ? msgErr.stack : null
          });
          await recordIngestionAudit({
            zohoMailUid: msg.messageId,
            zohoFolderId: folder.folderId,
            zohoFolderName: folder.folderName,
            stage: "PROCESSING_ERROR",
            errorDetails: { error: errText }
          });
        }
      }
      if (messages.length < limitPerPage || hitCheckpoint) {
        break;
      }
    }
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
        resetFailures: pageErrors === 0
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
      errorMessage: msg
    });
  }
}
async function ingestOneMessage(msg, folder, mailboxAddress) {
  const zohoUid = msg.messageId;
  await recordIngestionAudit({
    zohoMailUid: zohoUid,
    zohoFolderId: folder.folderId,
    zohoFolderName: folder.folderName,
    stage: "DISCOVERED"
  });
  let headers = {};
  let body = { html: null, text: null };
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
  const messageId = normalizeMessageId$1(headers["Message-ID"]);
  const inReplyTo = normalizeMessageId$1(headers["In-Reply-To"]);
  const references = normalizeReferences(headers["References"]);
  const senderInfo = parseSender(headers.From || msg.fromAddress, headers["Reply-To"]);
  const toEmail = parseSender(headers.To || msg.toAddress).effectiveEmail || mailboxAddress;
  const rawSubject = headers.Subject || msg.subject || "(no subject)";
  const subject = normalizeSubject(rawSubject);
  const receivedAt = msg.receivedTime ? new Date(Number(msg.receivedTime)).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
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
    stage: "PARSED"
  });
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
      matchedTicketId: dedup.matchedTicketId
    });
    return { status: "duplicate", ticketId: dedup.matchedTicketId ?? void 0 };
  }
  const ticketMatch = await matchExistingTicket({
    subject,
    inReplyTo,
    references,
    bodySnippet: bodyText.slice(0, 1e3)
  });
  if (ticketMatch) {
    const isAlternateSender = !!senderInfo.effectiveEmail && !!ticketMatch.ticketEmail && senderInfo.effectiveEmail.toLowerCase() !== ticketMatch.ticketEmail.toLowerCase();
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
        isAlternateSender
      });
    }
    let replyContent = bodyText.slice(0, 8e3);
    if (isAlternateSender) {
      replyContent = `[Inbound message from alternate sender: ${senderInfo.effectiveEmail}]

${replyContent}`;
    }
    const { data: repCreated, error: repErr } = await supabaseAdmin.from("ticket_replies").insert({
      ticket_id: ticketMatch.ticketId,
      reply_text: replyContent,
      is_internal: false,
      direction: "inbound",
      email_message_id: messageId,
      email_in_reply_to: inReplyTo
    }).select("id").single();
    if (repErr) throw new Error(`Failed to append reply to ticket: ${repErr.message}`);
    const replyId2 = repCreated.id;
    const ticketPatch = {
      status: "open",
      last_customer_message_at: receivedAt,
      updated_at: receivedAt
    };
    if (isAlternateSender) {
      ticketPatch.alternate_sender_email = senderInfo.effectiveEmail;
    }
    await supabaseAdmin.from("support_tickets").update(ticketPatch).eq("id", ticketMatch.ticketId);
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
      received_at: receivedAt
    });
    await processInboundAttachments({
      accountId: folder.folderId,
      folderId: folder.folderId,
      folderName: folder.folderName,
      zohoUid,
      ticketId: ticketMatch.ticketId,
      ticketReplyId: replyId2
    });
    try {
      const { cancelTicketAutocloseByTicket } = await import("./schedulers.server-BPR-45Y2.mjs");
      await cancelTicketAutocloseByTicket(ticketMatch.ticketId, "customer_replied").catch(() => {
      });
      if (ticketMatch.applicationId) {
        await cancelTicketAutocloseForOrder(ticketMatch.applicationId, "customer_replied").catch(() => {
        });
      }
    } catch {
    }
    if (ticketMatch.applicationId) {
      try {
        const { dispatchEvent } = await import("./engine.server-Clp4bFRY.mjs");
        await dispatchEvent({
          type: "TicketOpened",
          applicationId: ticketMatch.applicationId,
          ticketId: ticketMatch.ticketId
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
      metadata: { isAlternateSender, isReply: true }
    });
    return { status: "matched", ticketId: ticketMatch.ticketId, isReply: true };
  }
  const matchedOrder = await matchOrderByContext({
    subject,
    inReplyTo,
    references,
    fromEmail: senderInfo.effectiveEmail,
    xBhsOrder: headers["X-BHS-Order"] || null,
    xBhsCustomer: headers["X-BHS-Customer"] || null,
    bodySnippet: bodyText.slice(0, 1e3)
  });
  if (matchedOrder?.applicationId) {
    const { data: existingActiveTicket } = await supabaseAdmin.from("support_tickets").select("id, ticket_email, application_id, customer_id, status").eq("application_id", matchedOrder.applicationId).in("status", ["open", "in_progress", "waiting_customer"]).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (existingActiveTicket) {
      const activeT = existingActiveTicket;
      const { data: repCreated } = await supabaseAdmin.from("ticket_replies").insert({
        ticket_id: activeT.id,
        reply_text: bodyText.slice(0, 8e3),
        is_internal: false,
        direction: "inbound",
        email_message_id: messageId,
        email_in_reply_to: inReplyTo
      }).select("id").single();
      const replyId2 = repCreated.id;
      await supabaseAdmin.from("support_tickets").update({
        status: "open",
        last_customer_message_at: receivedAt,
        updated_at: receivedAt
      }).eq("id", activeT.id);
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
        received_at: receivedAt
      });
      await processInboundAttachments({
        accountId: folder.folderId,
        folderId: folder.folderId,
        folderName: folder.folderName,
        zohoUid,
        ticketId: activeT.id,
        ticketReplyId: replyId2
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
        matchedCustomerId: activeT.customer_id
      });
      return { status: "matched", ticketId: activeT.id, isReply: true };
    }
  }
  const isUnlinked = !matchedOrder?.customerId || !matchedOrder?.applicationId;
  const orderLinkStatus = matchedOrder?.orderLinkStatus || (matchedOrder?.applicationId ? "linked" : "unlinked");
  const { data: createdTicket, error: tErr } = await supabaseAdmin.from("support_tickets").insert({
    application_id: matchedOrder?.applicationId ?? null,
    customer_id: matchedOrder?.customerId ?? null,
    subject: subject.slice(0, 250),
    description: bodyText.slice(0, 4e3),
    status: "open",
    priority: "medium",
    source: "email_inbound",
    ticket_email: senderInfo.effectiveEmail,
    is_unlinked: isUnlinked,
    order_link_status: orderLinkStatus,
    last_customer_message_at: receivedAt,
    first_response_at: null,
    created_at: receivedAt,
    updated_at: receivedAt
  }).select("id, ticket_number").single();
  if (tErr) throw new Error(`Failed to create support ticket: ${tErr.message}`);
  const newTicket = createdTicket;
  const { data: initialReply } = await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: newTicket.id,
    reply_text: bodyText.slice(0, 8e3),
    is_internal: false,
    direction: "inbound",
    email_message_id: messageId,
    email_in_reply_to: inReplyTo,
    created_at: receivedAt
  }).select("id").single();
  const replyId = initialReply.id;
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
    received_at: receivedAt
  });
  await processInboundAttachments({
    accountId: folder.folderId,
    folderId: folder.folderId,
    folderName: folder.folderName,
    zohoUid,
    ticketId: newTicket.id,
    ticketReplyId: replyId
  });
  if (matchedOrder?.applicationId) {
    await cancelTicketAutocloseForOrder(matchedOrder.applicationId, "customer_replied").catch(() => {
    });
    try {
      const { dispatchEvent } = await import("./engine.server-Clp4bFRY.mjs");
      await dispatchEvent({
        type: "TicketOpened",
        applicationId: matchedOrder.applicationId,
        ticketId: newTicket.id
      });
    } catch {
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
    matchedTicketId: newTicket.id,
    matchedApplicationId: matchedOrder?.applicationId ?? null,
    matchedCustomerId: matchedOrder?.customerId ?? null,
    metadata: { isUnlinked, orderLinkStatus, isSystemSender: senderInfo.isSystemSender, resolutionMethod: matchedOrder?.resolutionMethod ?? null, ...matchedOrder?.matchAudit ?? {} }
  });
  return {
    status: matchedOrder?.customerId ? "matched" : "unmatched",
    ticketId: newTicket.id,
    isReply: false
  };
}
function isClosedTicket(status) {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s === "closed" || s === "resolved";
}
async function createNewTicketFromClosedTicketReply(input) {
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
    isAlternateSender
  } = input;
  let resolvedApplicationId = ticketMatch.applicationId;
  let resolvedCustomerId = ticketMatch.customerId;
  let resolvedLeadId = ticketMatch.leadId;
  if (!resolvedApplicationId) {
    try {
      const matchedOrder = await matchOrderByContext({
        subject,
        inReplyTo,
        references,
        fromEmail: senderInfo.effectiveEmail,
        xBhsOrder: null,
        xBhsCustomer: null,
        bodySnippet: bodyText.slice(0, 1e3)
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
  const { data: createdTicket, error: tErr } = await supabaseAdmin.from("support_tickets").insert({
    parent_ticket_id: ticketMatch.ticketId,
    application_id: resolvedApplicationId ?? null,
    customer_id: resolvedCustomerId ?? null,
    subject: subject.slice(0, 250),
    description: bodyText.slice(0, 4e3),
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
    updated_at: receivedAt
  }).select("id, ticket_number").single();
  if (tErr) throw new Error(`Failed to create support ticket from closed reply: ${tErr.message}`);
  const newTicket = createdTicket;
  let replyContent = bodyText.slice(0, 8e3);
  if (isAlternateSender) {
    replyContent = `[Inbound message from alternate sender: ${senderInfo.effectiveEmail}]

${replyContent}`;
  }
  const { data: initialReply, error: repErr } = await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: newTicket.id,
    reply_text: replyContent,
    is_internal: false,
    direction: "inbound",
    email_message_id: messageId,
    email_in_reply_to: inReplyTo,
    created_at: receivedAt
  }).select("id").single();
  if (repErr) throw new Error(`Failed to create initial reply on new ticket: ${repErr.message}`);
  const replyId = initialReply.id;
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
    received_at: receivedAt
  });
  await processInboundAttachments({
    accountId: folder.folderId,
    folderId: folder.folderId,
    folderName: folder.folderName,
    zohoUid,
    ticketId: newTicket.id,
    ticketReplyId: replyId
  });
  if (resolvedApplicationId) {
    try {
      const { dispatchEvent } = await import("./engine.server-Clp4bFRY.mjs");
      await dispatchEvent({
        type: "TicketOpened",
        applicationId: resolvedApplicationId,
        ticketId: newTicket.id
      });
    } catch (e) {
      console.error("[workflow] dispatch TicketOpened failed for new ticket from closed reply:", e);
    }
  }
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
      newTicketNumber: newTicket.ticket_number
    }
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
      isAlternateSender
    }
  });
  return {
    status: "matched",
    ticketId: newTicket.id,
    isReply: false
  };
}
async function matchExistingTicket(input) {
  const ticketNumber = extractTicketNumber(input.subject);
  if (ticketNumber) {
    const { data } = await supabaseAdmin.from("support_tickets").select("id, ticket_number, ticket_email, application_id, customer_id, status").eq("ticket_number", ticketNumber).maybeSingle();
    if (data) {
      const r = data;
      let appId = r.application_id;
      let custId = r.customer_id;
      if (!appId) {
        const { applicationCode: applicationCode2 } = extractOrderCodes(input.subject, input.bodySnippet);
        if (applicationCode2) {
          const { data: app } = await supabaseAdmin.from("applications").select("id, customer_id").eq("application_code", applicationCode2).maybeSingle();
          if (app) {
            appId = app.id;
            if (!custId) custId = app.customer_id;
            await supabaseAdmin.from("support_tickets").update({ application_id: appId, customer_id: custId, is_unlinked: false, order_link_status: "linked" }).eq("id", r.id);
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
        reopenCount: void 0
      };
    }
  }
  const ids = [input.inReplyTo, ...input.references].filter(Boolean);
  if (ids.length > 0) {
    const { data: replies } = await supabaseAdmin.from("ticket_replies").select("ticket_id").in("email_message_id", ids).not("ticket_id", "is", null).order("created_at", { ascending: false }).limit(5);
    for (const rep of replies ?? []) {
      if (rep.ticket_id) {
        const { data: t } = await supabaseAdmin.from("support_tickets").select("id, ticket_number, ticket_email, application_id, customer_id, status").eq("id", rep.ticket_id).maybeSingle();
        if (t) {
          const r = t;
          let appId = r.application_id;
          let custId = r.customer_id;
          if (!appId) {
            const { applicationCode: applicationCode2 } = extractOrderCodes(input.subject, input.bodySnippet);
            if (applicationCode2) {
              const { data: app } = await supabaseAdmin.from("applications").select("id, customer_id").eq("application_code", applicationCode2).maybeSingle();
              if (app) {
                appId = app.id;
                if (!custId) custId = app.customer_id;
                await supabaseAdmin.from("support_tickets").update({ application_id: appId, customer_id: custId, is_unlinked: false, order_link_status: "linked" }).eq("id", r.id);
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
            reopenCount: void 0
          };
        }
      }
    }
  }
  const { applicationCode } = extractOrderCodes(input.subject, input.bodySnippet);
  if (applicationCode) {
    const { data: app } = await supabaseAdmin.from("applications").select("id, customer_id, lead_id").eq("application_code", applicationCode).maybeSingle();
    if (app) {
      const appId = app.id;
      const { data: t } = await supabaseAdmin.from("support_tickets").select("id, ticket_number, ticket_email, application_id, customer_id, status").eq("application_id", appId).in("status", ["open", "in_progress", "waiting_customer"]).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (t) {
        const r = t;
        return {
          ticketId: r.id,
          ticketNumber: r.ticket_number,
          ticketEmail: r.ticket_email,
          applicationId: r.application_id,
          customerId: r.customer_id,
          leadId: app.lead_id ?? null,
          status: r.status,
          reopenCount: void 0
        };
      }
    }
  }
  return null;
}
async function matchOrderByContext(input) {
  const { applicationCode } = extractOrderCodes(input.subject, input.bodySnippet);
  const normalizedEmail = input.fromEmail?.trim().toLowerCase() || null;
  if (normalizedEmail) {
    const { data: rawCustomers } = await supabaseAdmin.from("customers").select("id").ilike("primary_email", normalizedEmail);
    const customers = rawCustomers ?? [];
    if (customers.length === 1) {
      const customerId = customers[0].id;
      const { data: rawApps } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, application_code, created_at").eq("customer_id", customerId).eq("is_deleted", false).order("created_at", { ascending: false });
      const apps = rawApps ?? [];
      if (apps.length === 0) {
        return {
          applicationId: null,
          leadId: null,
          customerId,
          orderLinkStatus: "unlinked",
          resolutionMethod: "EMAIL_CUSTOMER_ORDER",
          matchAudit: {
            matchedCustomer: customerId,
            ordersFound: 0,
            selectedLatest: false
          }
        };
      }
      if (apps.length === 1) {
        if (applicationCode && apps[0].application_code !== applicationCode) {
          return {
            applicationId: null,
            leadId: null,
            customerId,
            orderLinkStatus: "needs_review",
            resolutionMethod: "EMAIL_ORDER_NUMBER_CONFLICT",
            matchAudit: {
              matchedCustomer: customerId,
              customerOrderCode: apps[0].application_code,
              emailOrderCode: applicationCode,
              reason: "Order number in email does not belong to matched customer's single order"
            }
          };
        }
        return {
          applicationId: apps[0].id,
          leadId: apps[0].lead_id,
          customerId,
          orderLinkStatus: "linked",
          resolutionMethod: "EMAIL_CUSTOMER_ORDER",
          matchAudit: {
            matchedCustomer: customerId,
            matchedOrder: apps[0].id,
            ordersFound: 1,
            selectedLatest: true
          }
        };
      }
      if (applicationCode) {
        const matchingByCode = apps.filter((a) => a.application_code === applicationCode);
        if (matchingByCode.length === 1) {
          return {
            applicationId: matchingByCode[0].id,
            leadId: matchingByCode[0].lead_id,
            customerId,
            orderLinkStatus: "linked",
            resolutionMethod: "ORDER_NUMBER",
            matchAudit: {
              matchedCustomer: customerId,
              matchedOrder: matchingByCode[0].id,
              ordersFound: apps.length,
              orderCode: applicationCode,
              selectedLatest: matchingByCode[0].id === apps[0].id
            }
          };
        }
        if (matchingByCode.length > 1) {
          return {
            applicationId: null,
            leadId: null,
            customerId,
            orderLinkStatus: "needs_review",
            resolutionMethod: "DUPLICATE_ORDER_NUMBER",
            matchAudit: {
              matchedCustomer: customerId,
              orderCode: applicationCode,
              duplicateCount: matchingByCode.length,
              reason: "Multiple database records contain the same order number for this customer"
            }
          };
        }
        return {
          applicationId: null,
          leadId: null,
          customerId,
          orderLinkStatus: "needs_review",
          resolutionMethod: "EMAIL_ORDER_NUMBER_CONFLICT",
          matchAudit: {
            matchedCustomer: customerId,
            emailOrderCode: applicationCode,
            customerOrderCodes: apps.map((a) => a.application_code).filter(Boolean),
            ordersFound: apps.length,
            reason: "Order number in email does not belong to any of this customer's orders"
          }
        };
      }
      return {
        applicationId: apps[0].id,
        leadId: apps[0].lead_id,
        customerId,
        orderLinkStatus: "linked",
        resolutionMethod: "EMAIL_CUSTOMER_ORDER",
        matchAudit: {
          matchedCustomer: customerId,
          matchedOrder: apps[0].id,
          ordersFound: apps.length,
          selectedLatest: true,
          note: "Multiple orders; selected most recently created (no order number in email)"
        }
      };
    }
    if (customers.length > 1) {
      if (applicationCode) {
        const { data: rawCodeApps } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, application_code").eq("application_code", applicationCode).eq("is_deleted", false);
        const codeApps = rawCodeApps ?? [];
        if (codeApps.length === 1) {
          return {
            applicationId: codeApps[0].id,
            leadId: codeApps[0].lead_id,
            customerId: codeApps[0].customer_id,
            orderLinkStatus: "linked",
            resolutionMethod: "ORDER_NUMBER",
            matchAudit: {
              multipleCustomersForEmail: true,
              customerCount: customers.length,
              orderCode: applicationCode,
              matchedOrder: codeApps[0].id,
              matchedCustomer: codeApps[0].customer_id
            }
          };
        }
        if (codeApps.length > 1) {
          return {
            applicationId: null,
            leadId: null,
            customerId: null,
            orderLinkStatus: "needs_review",
            resolutionMethod: "DUPLICATE_ORDER_NUMBER",
            matchAudit: {
              multipleCustomersForEmail: true,
              customerCount: customers.length,
              orderCode: applicationCode,
              duplicateCount: codeApps.length,
              reason: "Multiple database records contain the same order number and multiple customers share the same email"
            }
          };
        }
      }
      return {
        applicationId: null,
        leadId: null,
        customerId: null,
        orderLinkStatus: "needs_review",
        resolutionMethod: "MULTIPLE_CUSTOMERS_SAME_EMAIL",
        matchAudit: {
          customerCount: customers.length,
          customerIds: customers.map((c) => c.id),
          emailOrderCode: applicationCode ?? null,
          reason: "Multiple customer records share the same email address"
        }
      };
    }
  }
  if (applicationCode) {
    const { data: rawCodeApps } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id, application_code").eq("application_code", applicationCode).eq("is_deleted", false);
    const codeApps = rawCodeApps ?? [];
    if (codeApps.length === 1) {
      return {
        applicationId: codeApps[0].id,
        leadId: codeApps[0].lead_id,
        customerId: codeApps[0].customer_id,
        orderLinkStatus: "linked",
        resolutionMethod: "ORDER_NUMBER",
        matchAudit: {
          orderCode: applicationCode,
          matchedOrder: codeApps[0].id,
          matchedCustomer: codeApps[0].customer_id,
          emailMatchedCustomer: false
        }
      };
    }
    if (codeApps.length > 1) {
      return {
        applicationId: null,
        leadId: null,
        customerId: null,
        orderLinkStatus: "needs_review",
        resolutionMethod: "DUPLICATE_ORDER_NUMBER",
        matchAudit: {
          orderCode: applicationCode,
          duplicateCount: codeApps.length,
          reason: "Multiple database records contain the same order number"
        }
      };
    }
  }
  const ids = [input.inReplyTo, ...input.references].filter(Boolean);
  if (ids.length > 0) {
    const { data: logs } = await supabaseAdmin.from("email_logs").select("application_id, lead_id, customer_id").in("message_id", ids).not("application_id", "is", null).order("created_at", { ascending: false }).limit(1);
    if (logs && logs.length > 0) {
      const r = logs[0];
      if (r.application_id) {
        return {
          applicationId: r.application_id,
          leadId: r.lead_id,
          customerId: r.customer_id,
          orderLinkStatus: "linked",
          resolutionMethod: "thread_headers",
          matchAudit: {
            threadHeaderMatch: true,
            matchedOrder: r.application_id,
            matchedCustomer: r.customer_id
          }
        };
      }
    }
  }
  if (input.xBhsOrder) {
    const { data: app } = await supabaseAdmin.from("applications").select("id, lead_id, customer_id").eq("id", input.xBhsOrder).maybeSingle();
    if (app) {
      const r = app;
      return {
        applicationId: r.id,
        leadId: r.lead_id,
        customerId: r.customer_id,
        orderLinkStatus: "linked",
        resolutionMethod: "x_bhs_order",
        matchAudit: {
          xBhsOrderHeader: input.xBhsOrder,
          matchedOrder: r.id,
          matchedCustomer: r.customer_id
        }
      };
    }
  }
  return null;
}
export {
  createNewTicketFromClosedTicketReply,
  isClosedTicket,
  pollZohoInbox
};
