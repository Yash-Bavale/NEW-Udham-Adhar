import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { BHS_EMAILS } from "./bhs-templates-Gd1TLGXv.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, a as array, n as number, s as string, b as boolean, _ as _enum } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function loadTicket(ticketId) {
  const admin = await getAdmin();
  const {
    data,
    error
  } = await admin.from("support_tickets").select("id, ticket_number, subject, status, application_id, customer_id, ticket_email, first_response_at").eq("id", ticketId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Ticket not found");
  return data;
}
async function loadCustomer(customerId) {
  if (!customerId) return {
    email: null,
    mobile: null,
    name: "Customer"
  };
  const admin = await getAdmin();
  const {
    data
  } = await admin.from("customers").select("primary_email, primary_mobile, name").eq("id", customerId).maybeSingle();
  const c = data;
  return {
    email: c?.primary_email ?? null,
    mobile: c?.primary_mobile ?? null,
    name: c?.name ?? "Customer"
  };
}
function formatTicketDate(iso = (/* @__PURE__ */ new Date()).toISOString()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(new Date(iso));
}
async function loadThreadHeaders(ticketId, applicationId) {
  const admin = await getAdmin();
  const {
    data
  } = await admin.from("ticket_replies").select("email_message_id").eq("ticket_id", ticketId).not("email_message_id", "is", null).order("created_at", {
    ascending: true
  });
  const ids = (data ?? []).map((r) => r.email_message_id).filter(Boolean);
  let orderThreadId = null;
  let orderThreadSubject = null;
  if (applicationId) {
    const {
      data: appRow
    } = await admin.from("applications").select("email_thread_message_id, email_thread_subject").eq("id", applicationId).maybeSingle();
    const a = appRow;
    orderThreadId = a?.email_thread_message_id ?? null;
    orderThreadSubject = a?.email_thread_subject ?? null;
  }
  const allRefs = [orderThreadId, ...ids].filter(Boolean);
  if (allRefs.length === 0) {
    return {
      inReplyTo: null,
      references: null,
      threadSubject: orderThreadSubject
    };
  }
  return {
    inReplyTo: allRefs[allRefs.length - 1],
    references: allRefs.map((i) => i.startsWith("<") ? i : `<${i}>`).join(" "),
    threadSubject: orderThreadSubject
  };
}
async function loadActorName(actorId) {
  const admin = await getAdmin();
  try {
    const {
      data: prof
    } = await admin.from("profiles").select("display_name, full_name, email").eq("id", actorId).maybeSingle();
    const p = prof;
    return p?.display_name || p?.full_name || p?.email?.split("@")[0] || "Support";
  } catch {
    return "Support";
  }
}
async function stampReplyEmailDelivery(input) {
  const admin = await getAdmin();
  const now = input.emailedAt ?? (/* @__PURE__ */ new Date()).toISOString();
  let patch = {
    emailed_at: now,
    email_in_reply_to: input.inReplyTo
  };
  if (input.queueId) {
    try {
      const {
        data: log
      } = await admin.from("email_logs").select("id, message_id").eq("queue_id", input.queueId).eq("direction", "outgoing").order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      const l = log;
      patch = {
        ...patch,
        email_message_id: l?.message_id ?? null,
        email_send_log_id: l?.id ?? null
      };
    } catch {
    }
  }
  await admin.from("ticket_replies").update(patch).eq("id", input.replyId);
}
async function sendTicketTemplateEmail(opts) {
  const cust = await loadCustomer(opts.ticket.customer_id);
  const recipient = opts.ticket.ticket_email || cust.email;
  if (!recipient) throw new Error("Customer has no registered email address on this ticket.");
  const actorName = await loadActorName(opts.actorId);
  const thread = await loadThreadHeaders(opts.ticket.id, opts.ticket.application_id ?? null);
  const ticketNumber = opts.ticket.ticket_number ?? opts.ticket.id.slice(0, 8);
  const threadedSubject = thread.threadSubject ? thread.threadSubject.toLowerCase().startsWith("re:") ? thread.threadSubject : `Re: ${thread.threadSubject}` : `Re: [#${ticketNumber}] ${opts.ticket.subject}`;
  const {
    enqueueFromTemplateInternal,
    enqueueEmailInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  try {
    const result = await enqueueFromTemplateInternal(opts.code, recipient, {
      customer_name: cust.name,
      customerName: cust.name,
      customer_email: cust.email ?? "",
      customerEmail: cust.email ?? "",
      customer_mobile: cust.mobile ?? "",
      customerMobile: cust.mobile ?? "",
      ticket_number: ticketNumber,
      ticketNumber,
      ticket_subject: opts.ticket.subject,
      ticketSubject: opts.ticket.subject,
      closure_date: formatTicketDate(),
      closureDate: formatTicketDate(),
      fromName: `${actorName} · Business Help Services`,
      executive_name: actorName,
      ...opts.extraVars ?? {}
    }, {
      toName: cust.name,
      applicationId: opts.ticket.application_id ?? void 0,
      inReplyTo: thread.inReplyTo,
      references: thread.references,
      threadSubject: threadedSubject,
      requireImmediateSuccess: true,
      trigger: "manual"
    });
    const queueId = result?.queueId ?? null;
    if (opts.replyId) {
      await stampReplyEmailDelivery({
        replyId: opts.replyId,
        queueId,
        inReplyTo: thread.inReplyTo
      });
    }
    return {
      emailed: true,
      recipient,
      queueId
    };
  } catch (templateErr) {
    console.warn(`[tickets] template '${opts.code}' failed or not found in DB, falling back to direct email delivery:`, templateErr);
    const fallbackMessage = String(opts.extraVars?.replyMessage || opts.extraVars?.employee_reply || opts.extraVars?.employeeReply || opts.ticket.subject || "Support Ticket Update");
    const isHtml = /<[a-z][\s\S]*>/i.test(fallbackMessage);
    const bodyHtml = isHtml ? `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${fallbackMessage}</div>` : `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${escapeHtml(fallbackMessage).replace(/\n/g, "<br />")}</div>`;
    const result = await enqueueEmailInternal({
      toEmail: recipient,
      toName: cust.name,
      subject: threadedSubject,
      bodyHtml,
      bodyText: fallbackMessage,
      applicationId: opts.ticket.application_id ?? void 0,
      variables: {
        __allow_without_template: true,
        __in_reply_to: thread.inReplyTo,
        __references: thread.references
      },
      allowWithoutTemplate: true,
      requireImmediateSuccess: true
    });
    const queueId = result?.queueId ?? null;
    if (opts.replyId) {
      await stampReplyEmailDelivery({
        replyId: opts.replyId,
        queueId,
        inReplyTo: thread.inReplyTo
      });
    }
    return {
      emailed: true,
      recipient,
      queueId
    };
  }
}
function escapeHtml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
async function sendTicketAdHocReply(opts) {
  const totalB64 = (opts.attachments ?? []).reduce((n, a) => n + a.content_base64.length, 0);
  if (totalB64 > 20 * 1024 * 1024) throw new Error("Attachments are too large to email (max ~15 MB total).");
  const atts = opts.attachments?.length ? opts.attachments : void 0;
  if (atts) opts = {
    ...opts,
    message: opts.message.replace(/<div data-crm-attachments="1"[\s\S]*$/, "") || " "
  };
  const cust = await loadCustomer(opts.ticket.customer_id);
  const recipient = opts.ticket.ticket_email || cust.email;
  if (!recipient) throw new Error("Customer has no registered email address on this ticket.");
  await loadActorName(opts.actorId);
  const thread = await loadThreadHeaders(opts.ticket.id, opts.ticket.application_id ?? null);
  const ticketNumber = opts.ticket.ticket_number ?? opts.ticket.id.slice(0, 8);
  const subjectBase = thread.threadSubject || `[#${ticketNumber}] ${opts.ticket.subject}`;
  const subject = subjectBase.toLowerCase().startsWith("re:") ? subjectBase : `Re: ${subjectBase}`;
  const bodyText = opts.message.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim() || opts.message;
  const isHtmlBody = /<[a-z][\s\S]*>/i.test(opts.message);
  const bodyHtml = isHtmlBody ? `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${opts.message}</div>` : `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${escapeHtml(opts.message).replace(/\n/g, "<br />")}</div>`;
  const {
    enqueueEmailInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  const result = await enqueueEmailInternal({
    toEmail: recipient,
    toName: cust.name,
    subject,
    bodyHtml,
    bodyText,
    cc: opts.cc,
    bcc: opts.bcc,
    applicationId: opts.ticket.application_id ?? void 0,
    variables: {
      __allow_without_template: true,
      __in_reply_to: thread.inReplyTo,
      __references: thread.references,
      ...opts.cc ? {
        __cc: opts.cc
      } : {},
      ...opts.bcc ? {
        __bcc: opts.bcc
      } : {}
    },
    allowWithoutTemplate: true,
    requireImmediateSuccess: true,
    attachments: atts
  });
  const queueId = result?.queueId ?? null;
  await stampReplyEmailDelivery({
    replyId: opts.replyId,
    queueId,
    inReplyTo: thread.inReplyTo
  });
  return {
    emailed: true,
    recipient,
    queueId
  };
}
const ReplyInput = object({
  ticketId: string().uuid(),
  message: string().min(1),
  isInternal: boolean().optional(),
  closeTicket: boolean().optional().default(true),
  armAutoclose: boolean().default(true),
  cc: string().optional(),
  bcc: string().optional(),
  attachments: array(object({
    filename: string().min(1).max(255),
    content_base64: string().min(1),
    content_type: string().max(200)
  })).max(10).optional(),
  storedFiles: array(object({
    storage_path: string().min(1).max(500),
    file_name: string().min(1).max(255),
    mime_type: string().max(200),
    file_size: number().int().nonnegative()
  })).max(10).optional()
});
const replyToTicket_createServerFn_handler = createServerRpc({
  id: "d9c9ef36b53cf84b9a2e945fb56104fdba1ba96871e0671aa2fcc9ca6f4bcf3f",
  name: "replyToTicket",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => replyToTicket.__executeServer(opts));
const replyToTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ReplyInput.parse(i)).handler(replyToTicket_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const ticket = await loadTicket(data.ticketId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: replyRow,
    error: repErr
  } = await admin.from("ticket_replies").insert({
    ticket_id: ticket.id,
    reply_text: data.message,
    is_internal: data.isInternal ?? false,
    created_by: context.userId,
    direction: data.isInternal ? "note" : "outbound"
  }).select("id").single();
  if (repErr) throw new Error(repErr.message);
  const ticketPrefix = `tickets/${ticket.id}/`;
  const linkFiles = (data.storedFiles ?? []).filter((f) => f.storage_path.startsWith(ticketPrefix) && !f.storage_path.includes(".."));
  if (linkFiles.length) {
    try {
      await admin.from("ticket_reply_attachments").insert(linkFiles.map((f) => ({
        ticket_id: ticket.id,
        ticket_reply_id: replyRow.id,
        file_name: f.file_name,
        file_size: f.file_size,
        mime_type: f.mime_type || "application/octet-stream",
        storage_bucket: "documents",
        storage_path: f.storage_path
      })));
    } catch (e) {
      console.warn("[replyToTicket] attachment link failed", e);
    }
  }
  if (data.isInternal) {
    return {
      ok: true,
      emailed: false,
      reason: "internal_note"
    };
  }
  const willClose = data.closeTicket !== false;
  const patch = {
    status: willClose ? "closed" : "waiting_customer",
    resolved_at: willClose ? now : null,
    resolved_by: willClose ? context.userId : null,
    closed_at: willClose ? now : null,
    updated_at: now,
    last_staff_message_at: now
  };
  if (!ticket.first_response_at) patch.first_response_at = now;
  await admin.from("support_tickets").update(patch).eq("id", ticket.id);
  if (willClose) {
    try {
      const {
        cancelTicketAutocloseByTicket
      } = await import("./schedulers.server-BPR-45Y2.mjs");
      await cancelTicketAutocloseByTicket(ticket.id, "closed_on_reply");
    } catch {
    }
    if (ticket.application_id) {
      try {
        const {
          dispatchEvent
        } = await import("./engine.server-Clp4bFRY.mjs");
        await dispatchEvent({
          type: "TicketClosed",
          applicationId: ticket.application_id,
          ticketId: ticket.id,
          outcome: "cooperating",
          actorId: context.userId
        }, context.userId);
      } catch (e) {
        console.error("[workflow] TicketClosed dispatch failed", e);
      }
    }
  } else if (data.armAutoclose) {
    try {
      const {
        startTicketAutocloseScheduler
      } = await import("./schedulers.server-BPR-45Y2.mjs");
      await startTicketAutocloseScheduler({
        ticketId: ticket.id,
        applicationId: ticket.application_id ?? null,
        totalSeconds: 24 * 60 * 60,
        createdBy: context.userId,
        note: "Standard employee reply auto-close timer"
      });
    } catch {
    }
  }
  if (ticket.application_id) {
    try {
      const {
        logEmployeeOrderAction
      } = await import("./order-action-logger.server-DJE-NEoc.mjs");
      await logEmployeeOrderAction({
        orderId: ticket.application_id,
        employeeId: context.userId,
        actionType: "TICKET_REPLIED",
        notes: `${willClose ? "Replied & closed" : "Replied to"} ticket #${ticket.ticket_number || ticket.id.slice(0, 8)}`,
        source: "employee",
        supabase: admin
      });
    } catch (auditErr) {
      console.warn("[replyToTicket] order action audit log error:", auditErr);
    }
  }
  const cust = await loadCustomer(ticket.customer_id);
  const recipient = ticket.ticket_email || cust.email;
  if (!recipient) {
    return {
      ok: true,
      emailed: false,
      reason: "no_recipient_email"
    };
  }
  try {
    const result = await sendTicketAdHocReply({
      ticket,
      actorId: context.userId,
      replyId: replyRow.id,
      message: data.message,
      cc: data.cc,
      bcc: data.bcc,
      attachments: data.attachments
    });
    return {
      ok: true,
      emailed: true,
      recipient: result.recipient
    };
  } catch (e) {
    console.error("[tickets] reply email failed", e);
    throw new Error(e instanceof Error ? e.message : "Reply was saved and ticket closed in CRM, but the email was not sent.");
  }
});
const CloseWithReplyInput = object({
  ticketId: string().uuid(),
  message: string().min(1)
});
const closeTicketWithReply_createServerFn_handler = createServerRpc({
  id: "a50e92b3bc0b31686b381bbc186bfa0469955c928cebda915d4d45ddb3f14325",
  name: "closeTicketWithReply",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => closeTicketWithReply.__executeServer(opts));
const closeTicketWithReply = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CloseWithReplyInput.parse(i)).handler(closeTicketWithReply_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const ticket = await loadTicket(data.ticketId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await admin.from("ticket_replies").insert({
    ticket_id: ticket.id,
    reply_text: data.message,
    is_internal: false,
    created_by: context.userId,
    direction: "outbound"
  });
  await admin.from("support_tickets").update({
    status: "closed",
    resolved_at: now,
    resolved_by: context.userId,
    closed_at: now,
    updated_at: now,
    last_staff_message_at: now
  }).eq("id", ticket.id);
  const {
    cancelTicketAutocloseByTicket
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await cancelTicketAutocloseByTicket(ticket.id, "closed_by_staff");
  if (ticket.application_id) {
    try {
      const {
        dispatchEvent
      } = await import("./engine.server-Clp4bFRY.mjs");
      await dispatchEvent({
        type: "TicketClosed",
        applicationId: ticket.application_id,
        ticketId: ticket.id,
        outcome: "not_cooperating",
        actorId: context.userId
      }, context.userId);
    } catch (e) {
      console.error("[workflow] TicketClosed dispatch failed", e);
    }
  }
  const cust = await loadCustomer(ticket.customer_id);
  const recipient = ticket.ticket_email || cust.email;
  if (recipient) {
    const {
      enqueueFromTemplateInternal
    } = await import("./emails.server-BTJhg2a3.mjs");
    try {
      await enqueueFromTemplateInternal(BHS_EMAILS.E009_TICKET_RESOLVED, recipient, {
        customerName: cust.name,
        ticketSubject: ticket.subject,
        ticketNumber: ticket.ticket_number ?? ticket.id.slice(0, 8),
        replyMessage: data.message,
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
      }, {
        applicationId: ticket.application_id ?? void 0,
        trigger: "manual"
      });
    } catch (e) {
      console.error("[tickets] E008 enqueue failed", e);
    }
  }
  return {
    ok: true
  };
});
const CloseFinalInput = object({
  ticketId: string().uuid(),
  reason: string().optional()
});
const closeTicketFinal_createServerFn_handler = createServerRpc({
  id: "9329bbe0908519771e7717498711da76208d92dc640056a7dad5b7fcd6031c21",
  name: "closeTicketFinal",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => closeTicketFinal.__executeServer(opts));
const closeTicketFinal = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CloseFinalInput.parse(i)).handler(closeTicketFinal_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const ticket = await loadTicket(data.ticketId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await admin.from("support_tickets").update({
    status: "closed",
    resolved_at: now,
    resolved_by: context.userId,
    closed_at: now,
    updated_at: now
  }).eq("id", ticket.id);
  await admin.from("ticket_replies").insert({
    ticket_id: ticket.id,
    reply_text: data.reason || "Ticket closed — no further action required.",
    is_internal: true,
    created_by: context.userId,
    direction: "note"
  });
  const {
    cancelTicketAutocloseByTicket
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await cancelTicketAutocloseByTicket(ticket.id, "closed_final");
  if (ticket.application_id) {
    try {
      const {
        dispatchEvent
      } = await import("./engine.server-Clp4bFRY.mjs");
      await dispatchEvent({
        type: "TicketClosed",
        applicationId: ticket.application_id,
        ticketId: ticket.id,
        outcome: "not_cooperating",
        actorId: context.userId
      }, context.userId);
    } catch (e) {
      console.error("[workflow] TicketClosed dispatch failed", e);
    }
  }
  const cust = await loadCustomer(ticket.customer_id);
  const recipient = ticket.ticket_email || cust.email;
  if (recipient) {
    const {
      enqueueFromTemplateInternal
    } = await import("./emails.server-BTJhg2a3.mjs");
    try {
      await enqueueFromTemplateInternal(BHS_EMAILS.E010_TICKET_CLOSED_FINAL, recipient, {
        customerName: cust.name,
        ticketSubject: ticket.subject,
        ticketNumber: ticket.ticket_number ?? ticket.id.slice(0, 8),
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
      }, {
        applicationId: ticket.application_id ?? void 0,
        trigger: "manual"
      });
    } catch (e) {
      console.error("[tickets] E009 enqueue failed", e);
    }
  }
  return {
    ok: true
  };
});
const getTicketOrderContext_createServerFn_handler = createServerRpc({
  id: "d39f7a313a28a3ae4629f9222f47e7b1aba875239da644152c18a0af43e1e440",
  name: "getTicketOrderContext",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => getTicketOrderContext.__executeServer(opts));
const getTicketOrderContext = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(getTicketOrderContext_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    data: row
  } = await admin.from("applications").select("id, application_code, order_status, fulfillment_status, service_id, customer_id, services(service_name), customers(name, primary_email, primary_mobile)").eq("id", data.orderId).maybeSingle();
  if (!row) return null;
  const r = row;
  return {
    id: r.id,
    application_code: r.application_code,
    order_status: r.order_status,
    fulfillment_status: r.fulfillment_status,
    service_name: r.services?.service_name ?? null,
    customer_name: r.customers?.name ?? null,
    customer_email: r.customers?.primary_email ?? null,
    customer_mobile: r.customers?.primary_mobile ?? null
  };
});
const ResumeInput = object({
  ticketId: string().uuid(),
  resumeTo: _enum(["IN_PROCESSING", "SUBMITTED_TO_GOVT"]).default("IN_PROCESSING"),
  note: string().max(1e3).optional()
});
const resolveTicketAndResumeOrder_createServerFn_handler = createServerRpc({
  id: "a8176ce5c4f52210a1f824a706bd9699e51636c514ec317056128c1a3a2c2346",
  name: "resolveTicketAndResumeOrder",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => resolveTicketAndResumeOrder.__executeServer(opts));
const resolveTicketAndResumeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ResumeInput.parse(i)).handler(resolveTicketAndResumeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const ticket = await loadTicket(data.ticketId);
  if (!ticket.application_id) {
    throw new Error("This ticket is not linked to an order.");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    error: tErr
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: ticket.application_id,
    _new_status: data.resumeTo,
    _remarks: `Resumed from ticket ${ticket.ticket_number ?? ticket.id.slice(0, 8)}${data.note ? " — " + data.note : ""}`
  });
  if (tErr) throw new Error(tErr.message);
  await admin.from("support_tickets").update({
    status: "resolved",
    resolved_at: now,
    resolved_by: context.userId,
    closed_at: now,
    updated_at: now
  }).eq("id", ticket.id);
  try {
    const {
      cancelTicketAutocloseByTicket
    } = await import("./schedulers.server-BPR-45Y2.mjs");
    await cancelTicketAutocloseByTicket(ticket.id, "resolved_and_resumed");
  } catch {
  }
  await admin.from("application_events").insert({
    application_id: ticket.application_id,
    customer_id: ticket.customer_id,
    event_type: "order_resumed_from_ticket",
    new_value: data.resumeTo,
    note: `Ticket ${ticket.ticket_number ?? ""} resolved · resumed → ${data.resumeTo}`,
    created_by: context.userId
  });
  try {
    const {
      dispatchEvent
    } = await import("./engine.server-Clp4bFRY.mjs");
    await dispatchEvent({
      type: "TicketClosed",
      applicationId: ticket.application_id,
      ticketId: ticket.id,
      outcome: "cooperating",
      actorId: context.userId
    }, context.userId);
  } catch (e) {
    console.error("[workflow] TicketClosed dispatch failed", e);
  }
  return {
    ok: true,
    resumeTo: data.resumeTo
  };
});
async function resumePausedCustomerDelayForTicket(ticket) {
  if (!ticket.application_id) return;
  const admin = await getAdmin();
  try {
    const {
      data: rows
    } = await admin.from("order_schedulers").select("id").eq("application_id", ticket.application_id).eq("status", "paused").eq("paused_by_ticket_id", ticket.id).in("scheduler_type", ["customer_closure_24h", "customer_side_delay"]);
    if (!rows?.length) return;
    const {
      resumeScheduler
    } = await import("./schedulers.server-BPR-45Y2.mjs");
    for (const row of rows) await resumeScheduler(row.id);
  } catch (e) {
    console.error("[tickets] customer-delay resume failed", e);
  }
}
async function dispatchTicketClosedCooperating(ticket, actorId) {
  if (!ticket.application_id) return;
  try {
    const {
      dispatchEvent
    } = await import("./engine.server-Clp4bFRY.mjs");
    await dispatchEvent({
      type: "TicketClosed",
      applicationId: ticket.application_id,
      ticketId: ticket.id,
      outcome: "cooperating",
      actorId
    }, actorId);
  } catch (e) {
    console.error("[workflow] TicketClosed(cooperating) dispatch failed", e);
  }
  await resumePausedCustomerDelayForTicket(ticket);
}
async function markTicketClosed(ticketId, actorId, noteText, reason) {
  const admin = await getAdmin();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await admin.from("support_tickets").update({
    status: "closed",
    resolved_at: now,
    resolved_by: actorId,
    closed_at: now,
    updated_at: now,
    last_staff_message_at: now
  }).eq("id", ticketId);
  await admin.from("ticket_replies").insert({
    ticket_id: ticketId,
    reply_text: noteText,
    is_internal: true,
    created_by: actorId,
    direction: "note"
  });
  try {
    const {
      cancelTicketAutocloseByTicket
    } = await import("./schedulers.server-BPR-45Y2.mjs");
    await cancelTicketAutocloseByTicket(ticketId, reason);
  } catch {
  }
}
const closeTicketNormalT001_createServerFn_handler = createServerRpc({
  id: "b986717c6d840e8063209d60ece8e5308853eafb3aeaeb3543267dd60c979cf1",
  name: "closeTicketNormalT001",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => closeTicketNormalT001.__executeServer(opts));
const closeTicketNormalT001 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(closeTicketNormalT001_createServerFn_handler, async ({
  data,
  context
}) => {
  const ticket = await loadTicket(data.ticketId);
  await markTicketClosed(ticket.id, context.userId, "Closed: Normal / no action required.", "closed_normal_no_action");
  await dispatchTicketClosedCooperating(ticket, context.userId);
  return {
    ok: true
  };
});
const closeTicketRestartT001_createServerFn_handler = createServerRpc({
  id: "2eb2b4190cb9b3be465e648582b0b669b7eaf0dcf4c4ff62c62cfeb6fe773566",
  name: "closeTicketRestartT001",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => closeTicketRestartT001.__executeServer(opts));
const closeTicketRestartT001 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(closeTicketRestartT001_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const ticket = await loadTicket(data.ticketId);
  if (!ticket.application_id) throw new Error("This ticket is not linked to an order.");
  const now = (/* @__PURE__ */ new Date()).toISOString();
  try {
    await context.supabase.rpc("restart_order_from_ticket", {
      _ticket_id: ticket.id
    });
  } catch (rpcErr) {
    console.warn("[closeTicketRestartT001] restart_order_from_ticket RPC notice:", rpcErr);
  }
  const {
    error: upErr
  } = await supabaseAdmin.from("applications").update({
    order_status: "REOPENED",
    fulfillment_status: "form_submitted",
    workflow_status: "processing_resumed",
    closure_stage: "none",
    application_status: "form_submitted",
    closure_reason_id: null,
    closure_reason_code: null,
    closure_reason_text: null,
    closure_remarks: null,
    closure_next_at: null,
    cancellation_requested_at: null,
    customer_hold_started_at: null,
    technical_hold_started_at: null,
    technical_hold_kind: null,
    active_reason_id: null,
    active_reason_text: null,
    workflow_delay_reason: null,
    workflow_expected_review_at: null,
    reopened_at: now,
    reopened_by: context.userId,
    updated_at: now
  }).eq("id", ticket.application_id);
  if (upErr) throw new Error(`Failed to update application status: ${upErr.message}`);
  await supabaseAdmin.from("support_tickets").update({
    status: "closed",
    resolved_at: now,
    resolved_by: context.userId,
    closed_at: now,
    updated_at: now,
    last_staff_message_at: now
  }).eq("id", ticket.id);
  try {
    await supabaseAdmin.from("ticket_replies").insert({
      ticket_id: ticket.id,
      reply_text: "Closed: Restarted & reopened order to active workflow.",
      is_internal: true,
      created_by: context.userId,
      direction: "note"
    });
  } catch (replyErr) {
    console.warn("[closeTicketRestartT001] ticket reply log warning:", replyErr);
  }
  try {
    const {
      data: staffProf
    } = await supabaseAdmin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle();
    const staffName = staffProf?.display_name || staffProf?.email || "Staff";
    await supabaseAdmin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: now,
      stop_reason: "order_reopened_from_ticket",
      stop_triggered_by: context.userId,
      updated_at: now
    }).eq("application_id", ticket.application_id).in("status", ["active", "paused"]);
    await supabaseAdmin.from("order_schedulers").insert({
      application_id: ticket.application_id,
      scheduler_type: "our_side_reminder",
      status: "active",
      started_at: now,
      fires_at: now,
      remarks: JSON.stringify({
        reason: "order_reopened",
        reasonLabel: `Order Reopened from Ticket #${ticket.ticket_number ?? ""} - Urgent Action Required`,
        note: `Order reopened from ticket ${ticket.ticket_number ?? ""}`,
        durationMinutes: 0,
        channel: ticket?.channel === "call" ? "call" : "email",
        created_by_name: staffName,
        created_at: now
      }),
      created_by: context.userId
    });
    await supabaseAdmin.from("application_events").insert({
      application_id: ticket.application_id,
      event_type: "status_change",
      old_value: "closed",
      new_value: "order_reopened",
      note: `Order reopened from support ticket ${ticket.ticket_number ?? ""}`,
      staff_name: staffName,
      staff_role: "staff"
    });
    if (ticket.lead_id) {
      await supabaseAdmin.from("activity_logs").insert({
        lead_id: ticket.lead_id,
        user_id: context.userId,
        activity_type: "order_reopened",
        activity_description: `Order reopened from ticket ${ticket.ticket_number ?? ""}`
      });
    }
    const {
      ensureActiveAssigneeForReopenedOrder
    } = await import("./assignment-engine.server--SlhbLzd.mjs");
    await ensureActiveAssigneeForReopenedOrder({
      orderId: ticket.application_id,
      actorId: context.userId,
      origin: "ticket_restart",
      ticketNumber: ticket.ticket_number ?? null
    });
  } catch (evtErr) {
    console.warn("[restartOrderFromTicket] timeline/scheduler log warning:", evtErr);
  }
  return {
    ok: true,
    applicationId: ticket.application_id,
    ticketId: ticket.id
  };
});
const closeTicketConsultationT001_createServerFn_handler = createServerRpc({
  id: "875bc4b40bc43054de83cc0383b5667754e5ced6e7246ae8db60958f2d32991a",
  name: "closeTicketConsultationT001",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => closeTicketConsultationT001.__executeServer(opts));
const closeTicketConsultationT001 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid()
}).parse(i)).handler(closeTicketConsultationT001_createServerFn_handler, async ({
  data,
  context
}) => {
  const ticket = await loadTicket(data.ticketId);
  await sendTicketTemplateEmail({
    ticket,
    code: BHS_EMAILS.T001_TICKET_COMPLETED,
    actorId: context.userId,
    extraVars: {
      ticket_close_variant: "consultation_done",
      employee_reply: "Your consultation / support request has been completed. Please reach out if you need anything further.",
      employeeReply: "Your consultation / support request has been completed. Please reach out if you need anything further.",
      replyMessage: "Your consultation / support request has been completed. Please reach out if you need anything further."
    }
  });
  await markTicketClosed(ticket.id, context.userId, "T001 sent — Consultation / support completed.", "closed_t001_consultation");
  await dispatchTicketClosedCooperating(ticket, context.userId);
  return {
    ok: true
  };
});
const closeTicketReplyReasonT002_createServerFn_handler = createServerRpc({
  id: "3988ab34b8572744b4aee23991d321bea08f8967870a22ae6be93a1a5c32b51c",
  name: "closeTicketReplyReasonT002",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => closeTicketReplyReasonT002.__executeServer(opts));
const closeTicketReplyReasonT002 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  reasonId: string().uuid().nullable().optional(),
  reasonLabel: string().max(200).optional(),
  replyBody: string().min(1)
}).parse(i)).handler(closeTicketReplyReasonT002_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const ticket = await loadTicket(data.ticketId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: replyRow,
    error: replyErr
  } = await admin.from("ticket_replies").insert({
    ticket_id: ticket.id,
    reply_text: data.replyBody,
    is_internal: false,
    created_by: context.userId,
    direction: "outbound"
  }).select("id").single();
  if (replyErr) throw new Error(replyErr.message);
  await sendTicketTemplateEmail({
    ticket,
    code: BHS_EMAILS.T002_TICKET_REPLY,
    actorId: context.userId,
    replyId: replyRow.id,
    extraVars: {
      ticket_close_variant: "reply_with_reason",
      reason: data.reasonLabel ?? "",
      selected_reason: data.reasonLabel ?? "",
      reasonBlock: data.reasonLabel ?? "",
      reason_block: data.reasonLabel ?? "",
      employee_reply: data.replyBody,
      employee_remarks: data.replyBody,
      employeeRemarks: data.replyBody,
      replyMessage: data.replyBody,
      // T002 prints this as "Reply Date & Time" — use the actual reply timestamp.
      followup_date: formatTicketDate(now),
      followupDate: formatTicketDate(now)
    }
  });
  const patch = {
    status: "waiting_customer",
    updated_at: now,
    last_staff_message_at: now
  };
  if (!ticket.first_response_at) patch.first_response_at = now;
  await admin.from("support_tickets").update(patch).eq("id", ticket.id);
  const {
    startTicketAutocloseScheduler
  } = await import("./schedulers.server-BPR-45Y2.mjs");
  await startTicketAutocloseScheduler({
    ticketId: ticket.id,
    applicationId: ticket.application_id ?? null,
    totalSeconds: 8 * 60 * 60,
    createdBy: context.userId,
    note: data.reasonLabel ?? null
  });
  return {
    ok: true
  };
});
const closeTicketRefundR002_createServerFn_handler = createServerRpc({
  id: "7ae5b100d8255f04fcbcc6fcff9a4bc89d92185caf898149a00cd623707d9ca8",
  name: "closeTicketRefundR002",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => closeTicketRefundR002.__executeServer(opts));
const closeTicketRefundR002 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  replyBody: string().optional(),
  reasonLabel: string().max(200).optional()
}).parse(i)).handler(closeTicketRefundR002_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const ticket = await loadTicket(data.ticketId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const remarks = data.reasonLabel?.trim() || data.replyBody?.trim() || "Refund request reviewed & closed";
  const replyText = data.replyBody?.trim() || "Dear Customer,\n\nWe have reviewed your refund request and regret to inform you that your refund request cannot be approved at this stage as per our service and refund policy.\n\nRegards,\nSupport Team";
  const {
    data: replyRow,
    error: replyErr
  } = await admin.from("ticket_replies").insert({
    ticket_id: ticket.id,
    reply_text: `R002 Refund Rejected: ${remarks}`,
    is_internal: false,
    created_by: context.userId,
    direction: "refund_rejected"
  }).select("id").single();
  if (replyErr) throw new Error(replyErr.message);
  await sendTicketTemplateEmail({
    ticket,
    code: "R002",
    actorId: context.userId,
    replyId: replyRow.id,
    extraVars: {
      ticket_close_variant: "refund_rejected",
      employee_remarks: remarks,
      additional_remarks: remarks,
      remarks,
      reason: remarks,
      selected_reason: remarks,
      replyMessage: replyText
    }
  });
  const patch = {
    status: "closed",
    resolved_at: now,
    resolved_by: context.userId,
    closed_at: now,
    updated_at: now,
    last_staff_message_at: now
  };
  if (!ticket.first_response_at) patch.first_response_at = now;
  await admin.from("support_tickets").update(patch).eq("id", ticket.id);
  try {
    const {
      cancelTicketAutocloseByTicket
    } = await import("./schedulers.server-BPR-45Y2.mjs");
    await cancelTicketAutocloseByTicket(ticket.id, "closed_refund_r002");
  } catch {
  }
  if (ticket.application_id) {
    try {
      const {
        dispatchEvent
      } = await import("./engine.server-Clp4bFRY.mjs");
      await dispatchEvent({
        type: "TicketClosed",
        applicationId: ticket.application_id,
        ticketId: ticket.id,
        outcome: "not_cooperating",
        actorId: context.userId
      }, context.userId);
    } catch (e) {
      console.error("[workflow] TicketClosed dispatch failed", e);
    }
  }
  return {
    ok: true
  };
});
const getTicketAttachmentUploadUrl_createServerFn_handler = createServerRpc({
  id: "06b48d78dfde01bebe6d3642904b439fb3adb2a72c1748dc844a29beb7c38e19",
  name: "getTicketAttachmentUploadUrl",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => getTicketAttachmentUploadUrl.__executeServer(opts));
const getTicketAttachmentUploadUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  fileName: string().min(1).max(200),
  mimeType: string().min(1).max(120)
}).parse(i)).handler(getTicketAttachmentUploadUrl_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  (data.fileName.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);
  const safeName = data.fileName.replace(/[^a-z0-9._-]/gi, "_").slice(0, 50);
  const path = `tickets/${data.ticketId}/${Date.now()}_${safeName}`;
  const {
    data: signed,
    error
  } = await admin.storage.from("documents").createSignedUploadUrl(path);
  if (error || !signed) throw new Error(error?.message ?? "Could not create attachment upload URL.");
  return {
    path,
    token: signed.token,
    signedUrl: signed.signedUrl
  };
});
const confirmTicketAttachment_createServerFn_handler = createServerRpc({
  id: "96ec3e176fbf36926c6f13b2d01cf96b3716c2a00d6bfe2b21e5e438d57513a8",
  name: "confirmTicketAttachment",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => confirmTicketAttachment.__executeServer(opts));
const confirmTicketAttachment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid(),
  applicationId: string().uuid().nullable().optional(),
  filePath: string().min(1),
  fileName: string().min(1),
  mimeType: string().min(1),
  sizeBytes: number().int().min(1)
}).parse(i)).handler(confirmTicketAttachment_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    data: signed
  } = await admin.storage.from("documents").createSignedUrl(data.filePath, 31536e3);
  const signedUrl = signed?.signedUrl ?? null;
  if (data.applicationId) {
    try {
      await admin.from("documents").insert({
        application_id: data.applicationId,
        doc_type: "support_attachment",
        file_name: data.fileName,
        file_path: data.filePath,
        mime_type: data.mimeType,
        size_bytes: data.sizeBytes,
        status: "verified",
        uploaded_at: (/* @__PURE__ */ new Date()).toISOString(),
        uploaded_by: context.userId,
        remarks: `Uploaded via ticket reply (Ticket ID: ${data.ticketId})`
      });
    } catch {
    }
  }
  return {
    filePath: data.filePath,
    fileName: data.fileName,
    url: signedUrl
  };
});
const makeOrderHotFromTicket_createServerFn_handler = createServerRpc({
  id: "713d3edb49d13391d62b4b21cdc36c66cb157d606fa0be7cb185b611287ad861",
  name: "makeOrderHotFromTicket",
  filename: "src/lib/tickets/ticket-actions.functions.ts"
}, (opts) => makeOrderHotFromTicket.__executeServer(opts));
const makeOrderHotFromTicket = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  ticketId: string().uuid().optional(),
  orderId: string().uuid().optional(),
  note: string().max(1e3).optional()
}).parse(i)).handler(makeOrderHotFromTicket_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  let targetOrderId = data.orderId;
  let ticketNumber = "";
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (data.ticketId) {
    const ticket = await loadTicket(data.ticketId);
    if (!targetOrderId && ticket.application_id) {
      targetOrderId = ticket.application_id;
    }
    if (!targetOrderId && ticket.customer_id) {
      const {
        data: latestApp
      } = await admin.from("applications").select("id, application_code").eq("customer_id", ticket.customer_id).eq("is_deleted", false).order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (latestApp?.id) {
        targetOrderId = latestApp.id;
        await admin.from("support_tickets").update({
          application_id: targetOrderId,
          updated_at: now
        }).eq("id", data.ticketId);
      }
    }
    ticketNumber = ticket.ticket_number ?? "";
  }
  if (!targetOrderId) {
    throw new Error("No linked order found for this ticket.");
  }
  const {
    data: preApp
  } = await admin.from("applications").select("id, lead_id, customer_id, application_code, order_status, fulfillment_status, workflow_status, application_status, form_submitted_at, assigned_to").eq("id", targetOrderId).maybeSingle();
  if (!preApp) {
    throw new Error("Linked order not found.");
  }
  const previousStage = preApp.fulfillment_status || preApp.workflow_status || preApp.order_status || "closed";
  const previousStatus = preApp.order_status || "CLOSED";
  const {
    data: staffProf
  } = await admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle();
  const staffName = staffProf?.display_name || staffProf?.email || "Staff";
  const {
    error: upErr
  } = await admin.from("applications").update({
    order_status: "REOPENED",
    fulfillment_status: "form_submitted",
    workflow_status: "processing_resumed",
    closure_stage: "none",
    application_status: "form_submitted",
    closure_reason_id: null,
    closure_reason_code: null,
    closure_reason_text: null,
    closure_remarks: null,
    closure_next_at: null,
    cancellation_requested_at: null,
    customer_hold_started_at: null,
    technical_hold_started_at: null,
    technical_hold_kind: null,
    active_reason_id: null,
    active_reason_text: null,
    workflow_delay_reason: null,
    workflow_expected_review_at: null,
    reopened_at: now,
    reopened_by: context.userId,
    updated_at: now
  }).eq("id", targetOrderId);
  if (upErr) {
    console.error("[makeOrderHotFromTicket] update error:", upErr);
    throw new Error(`Failed to reopen order status: ${upErr.message}`);
  }
  await admin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: now,
    stop_reason: "ticket_hot_priority_override",
    stop_triggered_by: context.userId,
    updated_at: now
  }).eq("application_id", targetOrderId).in("status", ["active", "paused"]);
  const reasonLabel = ticketNumber ? `Hot Priority from Ticket #${ticketNumber}` : "Escalated to Hot Priority";
  const {
    data: created,
    error
  } = await admin.from("order_schedulers").insert({
    application_id: targetOrderId,
    ticket_id: data.ticketId || null,
    scheduler_type: "our_side_reminder",
    status: "active",
    started_at: now,
    fires_at: now,
    remarks: JSON.stringify({
      reason: "ticket_hot_priority",
      reasonLabel,
      note: data.note || (ticketNumber ? `Order marked Hot Priority from support ticket #${ticketNumber}` : "Escalated to hot priority"),
      durationMinutes: 0,
      channel: "email",
      origin: "support_ticket",
      ticketId: data.ticketId || null,
      ticketNumber: ticketNumber || null,
      created_by_name: staffName,
      created_at: now
    }),
    created_by: context.userId
  }).select("id, application_id, status, fires_at, remarks, created_at").single();
  if (error) {
    console.error("[makeOrderHotFromTicket] insert error:", error);
    throw new Error(`Failed to set hot priority: ${error.message}`);
  }
  try {
    const {
      ensureActiveAssigneeForReopenedOrder
    } = await import("./assignment-engine.server--SlhbLzd.mjs");
    await ensureActiveAssigneeForReopenedOrder({
      orderId: targetOrderId,
      actorId: context.userId,
      origin: "ticket_hot",
      ticketNumber: ticketNumber || null,
      currentAssigneeId: preApp.assigned_to
    });
  } catch (assignErr) {
    console.warn("[makeOrderHotFromTicket] auto-reassign warning:", assignErr);
  }
  if (preApp.lead_id) {
    try {
      const [{
        data: lead
      }, {
        data: paidPayment
      }] = await Promise.all([admin.from("leads").select("id, lead_status_v2, status").eq("id", preApp.lead_id).maybeSingle(), admin.from("payments").select("id").eq("lead_id", preApp.lead_id).eq("status", "paid").limit(1).maybeSingle()]);
      if (lead) {
        const isClosedLead = ["closed", "closed_refunded", "uninterested"].includes(String(lead.lead_status_v2 ?? "")) || ["closed", "uninterested"].includes(String(lead.status ?? ""));
        if (isClosedLead) {
          const nextLeadStatus = paidPayment ? "payment_successful" : "contacted";
          await admin.from("leads").update({
            lead_status_v2: nextLeadStatus,
            status: nextLeadStatus,
            updated_at: now
          }).eq("id", lead.id);
        }
      }
    } catch (leadErr) {
      console.warn("[makeOrderHotFromTicket] lead status update warning:", leadErr);
    }
  }
  try {
    const noteSuffix = data.note ? `
Remarks for Assignee: "${data.note}"` : "";
    await admin.from("workflow_events").insert({
      application_id: targetOrderId,
      lead_id: preApp.lead_id ?? null,
      event_type: "order_reopened",
      title: "Order Reopened & Escalated to Hot Priority",
      description: `Order reopened and marked Hot Priority from Ticket #${ticketNumber || ""}.${noteSuffix}`,
      customer_visible: false,
      actor_id: context.userId,
      actor_name: staffName,
      is_system: false,
      metadata: {
        event: "ORDER_REOPENED_HOT",
        previousStage,
        previousStatus,
        newStage: "Order Reopened",
        reopenedBy: context.userId,
        reopenedAt: now,
        ticketNumber: ticketNumber || null,
        note: data.note || null
      }
    });
    await admin.from("application_events").insert({
      application_id: targetOrderId,
      lead_id: preApp.lead_id ?? null,
      customer_id: preApp.customer_id ?? null,
      event_type: "hot_priority_escalated",
      old_value: String(previousStatus),
      new_value: "REOPENED",
      note: data.note ? `[Hot Priority Escalation from Ticket #${ticketNumber || ""}] Note for Assignee: ${data.note}` : `Order reopened and escalated to Hot Priority from Ticket #${ticketNumber || ""}`,
      created_by: context.userId,
      staff_name: staffName,
      staff_role: "staff"
    });
    if (data.ticketId) {
      await admin.from("activity_logs").insert({
        user_id: context.userId,
        activity_type: "ticket_order_hot_escalated",
        activity_description: `Linked order was reopened and marked on HOT PRIORITY by ${staffName}${data.note ? ` (Note: ${data.note})` : ""}`
      });
      const noteText = data.note ? `Closed: Reopened order & prioritized as Hot Order. Note: ${data.note}` : "Closed: Reopened order & prioritized as Hot Order";
      await admin.from("ticket_replies").insert({
        ticket_id: data.ticketId,
        reply_text: noteText,
        is_internal: true,
        created_by: context.userId,
        direction: "reopened_order"
      });
      const patch = {
        status: "closed",
        resolved_at: now,
        resolved_by: context.userId,
        closed_at: now,
        updated_at: now,
        last_staff_message_at: now
      };
      await admin.from("support_tickets").update(patch).eq("id", data.ticketId);
      try {
        const {
          cancelTicketAutocloseByTicket
        } = await import("./schedulers.server-BPR-45Y2.mjs");
        await cancelTicketAutocloseByTicket(data.ticketId, "closed_reopened_hot");
      } catch {
      }
    }
    const assignedTarget = preApp.assigned_to;
    if (assignedTarget && assignedTarget !== context.userId) {
      const {
        createNotification
      } = await import("./notifications.functions-DjXHSykb.mjs");
      await createNotification({
        user_id: assignedTarget,
        kind: "hot_order_alert",
        title: `🔥 Hot Order Escalation: ${preApp.application_code || "Order"}`,
        body: data.note ? `Note from ${staffName}: "${data.note}"` : `Order was marked as Hot Priority from Support Ticket #${ticketNumber || ""}`,
        href: `/admin/orders/${targetOrderId}`,
        entity_kind: "application",
        entity_id: targetOrderId
      }).catch((notifErr) => console.warn("[makeOrderHotFromTicket] notif warning:", notifErr));
    }
  } catch (e) {
    console.warn("[makeOrderHotFromTicket] audit logging warning:", e);
  }
  return {
    ok: true,
    scheduler: created
  };
});
export {
  closeTicketConsultationT001_createServerFn_handler,
  closeTicketFinal_createServerFn_handler,
  closeTicketNormalT001_createServerFn_handler,
  closeTicketRefundR002_createServerFn_handler,
  closeTicketReplyReasonT002_createServerFn_handler,
  closeTicketRestartT001_createServerFn_handler,
  closeTicketWithReply_createServerFn_handler,
  confirmTicketAttachment_createServerFn_handler,
  getTicketAttachmentUploadUrl_createServerFn_handler,
  getTicketOrderContext_createServerFn_handler,
  makeOrderHotFromTicket_createServerFn_handler,
  replyToTicket_createServerFn_handler,
  resolveTicketAndResumeOrder_createServerFn_handler
};
