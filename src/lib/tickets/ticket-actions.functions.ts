/**
 * Support-ticket atomic actions — email-driven flow.
 *
 * - replyToTicket           → public/internal staff reply. Public replies email
 *                             the customer inline with threaded headers
 *                             headers so Gmail/Outlook show one conversation.
 * - closeTicketWithReply    → E008 email + close (cancellation flow)
 * - closeTicketFinal        → E009 email + close (cancellation flow)
 *
 * Every action posts a `ticket_replies` row for audit and updates the ticket
 * status. Auto-close relies on `startTicketAutocloseScheduler` and is
 * cancelled automatically when the customer replies (inbox matcher) or when
 * staff close/reopen the ticket manually.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BHS_EMAILS } from "@/lib/emails/bhs-templates";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

type TicketRow = {
  id: string;
  ticket_number: string | null;
  subject: string;
  status: string | null;
  application_id: string | null;
  customer_id: string | null;
  ticket_email: string | null;
  first_response_at: string | null;
};

async function loadTicket(ticketId: string): Promise<TicketRow> {
  const admin = await getAdmin();
  const { data, error } = await admin
    .from("support_tickets")
    .select(
      "id, ticket_number, subject, status, application_id, customer_id, ticket_email, first_response_at",
    )
    .eq("id", ticketId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Ticket not found");
  return data as TicketRow;
}

async function loadCustomer(customerId: string | null) {
  if (!customerId) return { email: null as string | null, mobile: null as string | null, name: "Customer" };
  const admin = await getAdmin();
  const { data } = await admin
    .from("customers")
    .select("primary_email, primary_mobile, name")
    .eq("id", customerId)
    .maybeSingle();
  const c = data as { primary_email: string | null; primary_mobile: string | null; name: string | null } | null;
  return { email: c?.primary_email ?? null, mobile: c?.primary_mobile ?? null, name: c?.name ?? "Customer" };
}

function formatTicketDate(iso = new Date().toISOString()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

/** Build In-Reply-To / References chain from prior outbound replies on this ticket,
 *  falling back to the order's stored thread anchor so ticket replies continue
 *  the same email conversation the customer already sees. */
async function loadThreadHeaders(ticketId: string, applicationId: string | null): Promise<{
  inReplyTo: string | null;
  references: string | null;
  threadSubject: string | null;
}> {
  const admin = await getAdmin();
  const { data } = await admin
    .from("ticket_replies")
    .select("email_message_id")
    .eq("ticket_id", ticketId)
    .not("email_message_id", "is", null)
    .order("created_at", { ascending: true });
  const ids = ((data ?? []) as Array<{ email_message_id: string | null }>)
    .map((r) => r.email_message_id)
    .filter(Boolean) as string[];

  let orderThreadId: string | null = null;
  let orderThreadSubject: string | null = null;
  if (applicationId) {
    const { data: appRow } = await admin
      .from("applications")
      .select("email_thread_message_id, email_thread_subject")
      .eq("id", applicationId)
      .maybeSingle();
    const a = appRow as { email_thread_message_id?: string | null; email_thread_subject?: string | null } | null;
    orderThreadId = a?.email_thread_message_id ?? null;
    orderThreadSubject = a?.email_thread_subject ?? null;
  }

  const allRefs = [orderThreadId, ...ids].filter(Boolean) as string[];
  if (allRefs.length === 0) {
    return { inReplyTo: null, references: null, threadSubject: orderThreadSubject };
  }
  return {
    inReplyTo: allRefs[allRefs.length - 1],
    references: allRefs.map((i) => (i.startsWith("<") ? i : `<${i}>`)).join(" "),
    threadSubject: orderThreadSubject,
  };
}

async function loadActorName(actorId: string) {
  const admin = await getAdmin();
  try {
    const { data: prof } = await admin
      .from("profiles")
      .select("display_name, full_name, email")
      .eq("id", actorId)
      .maybeSingle();
    const p = prof as { display_name?: string | null; full_name?: string | null; email?: string | null } | null;
    return p?.display_name || p?.full_name || p?.email?.split("@")[0] || "Support";
  } catch {
    return "Support";
  }
}

async function stampReplyEmailDelivery(input: {
  replyId: string;
  queueId: string | null;
  inReplyTo: string | null;
  emailedAt?: string;
}) {
  const admin = await getAdmin();
  const now = input.emailedAt ?? new Date().toISOString();
  let patch: Record<string, unknown> = { emailed_at: now, email_in_reply_to: input.inReplyTo };

  if (input.queueId) {
    try {
      const { data: log } = await admin
        .from("email_logs")
        .select("id, message_id")
        .eq("queue_id", input.queueId)
        .eq("direction", "outgoing")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const l = log as { id: string | null; message_id: string | null } | null;
      patch = {
        ...patch,
        email_message_id: l?.message_id ?? null,
        email_send_log_id: l?.id ?? null,
      };
    } catch { /* non-fatal: emailed_at is still authoritative */ }
  }

  await admin.from("ticket_replies").update(patch as never).eq("id", input.replyId);
}

async function sendTicketTemplateEmail(opts: {
  ticket: TicketRow;
  code: string;
  actorId: string;
  extraVars?: Record<string, unknown>;
  replyId?: string;
}) {
  const cust = await loadCustomer(opts.ticket.customer_id);
  const recipient = opts.ticket.ticket_email || cust.email;
  if (!recipient) throw new Error("Customer has no registered email address on this ticket.");

  const actorName = await loadActorName(opts.actorId);
  const thread = await loadThreadHeaders(opts.ticket.id, opts.ticket.application_id ?? null);
  const ticketNumber = opts.ticket.ticket_number ?? opts.ticket.id.slice(0, 8);
  const threadedSubject = thread.threadSubject
    ? (thread.threadSubject.toLowerCase().startsWith("re:") ? thread.threadSubject : `Re: ${thread.threadSubject}`)
    : `Re: [#${ticketNumber}] ${opts.ticket.subject}`;

  const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
  const result = await enqueueFromTemplateInternal(
    opts.code,
    recipient,
    {
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
      ...(opts.extraVars ?? {}),
    },
    {
      toName: cust.name,
      applicationId: opts.ticket.application_id ?? undefined,
      inReplyTo: thread.inReplyTo,
      references: thread.references,
      threadSubject: threadedSubject,
      requireImmediateSuccess: true,
      trigger: "manual",
    },
  );

  const queueId = (result as { queueId?: string | null } | undefined)?.queueId ?? null;
  if (opts.replyId) {
    await stampReplyEmailDelivery({ replyId: opts.replyId, queueId, inReplyTo: thread.inReplyTo });
  }
  return { emailed: true, recipient, queueId };
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendTicketAdHocReply(opts: {
  ticket: TicketRow;
  actorId: string;
  message: string;
  replyId: string;
}) {
  const cust = await loadCustomer(opts.ticket.customer_id);
  const recipient = opts.ticket.ticket_email || cust.email;
  if (!recipient) throw new Error("Customer has no registered email address on this ticket.");

  const actorName = await loadActorName(opts.actorId);
  const thread = await loadThreadHeaders(opts.ticket.id, opts.ticket.application_id ?? null);
  const ticketNumber = opts.ticket.ticket_number ?? opts.ticket.id.slice(0, 8);
  const subjectBase = thread.threadSubject || `[#${ticketNumber}] ${opts.ticket.subject}`;
  const subject = subjectBase.toLowerCase().startsWith("re:") ? subjectBase : `Re: ${subjectBase}`;
  const bodyText = opts.message;
  const bodyHtml = `<div>${escapeHtml(opts.message).replace(/\n/g, "<br />")}</div><p style="margin-top:16px;color:#64748b;font-size:12px">${escapeHtml(actorName)} · Business Help Services</p>`;

  const { enqueueEmailInternal } = await import("@/lib/emails/emails.server");
  const result = await enqueueEmailInternal({
    toEmail: recipient,
    toName: cust.name,
    subject,
    bodyHtml,
    bodyText,
    applicationId: opts.ticket.application_id ?? undefined,
    variables: {
      __allow_without_template: true,
      __in_reply_to: thread.inReplyTo,
      __references: thread.references,
    },
    allowWithoutTemplate: true,
    requireImmediateSuccess: true,
  });
  const queueId = (result as { queueId?: string | null } | undefined)?.queueId ?? null;
  await stampReplyEmailDelivery({ replyId: opts.replyId, queueId, inReplyTo: thread.inReplyTo });
  return { emailed: true, recipient, queueId };
}

// ─────────────────────────── replyToTicket ───────────────────────────

const ReplyInput = z.object({
  ticketId: z.string().uuid(),
  message: z.string().min(1),
  isInternal: z.boolean().optional(),
  armAutoclose: z.boolean().default(true),
});

export const replyToTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ReplyInput.parse(i))
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const ticket = await loadTicket(data.ticketId);
    const now = new Date().toISOString();

    // Insert the reply row first. Internal notes never email.
    const { data: replyRow, error: repErr } = await admin
      .from("ticket_replies")
      .insert({
        ticket_id: ticket.id,
        reply_text: data.message,
        is_internal: data.isInternal ?? false,
        created_by: context.userId,
        direction: data.isInternal ? "note" : "outbound",
      } as never)
      .select("id")
      .single();
    if (repErr) throw new Error(repErr.message);

    if (data.isInternal) {
      return { ok: true, emailed: false, reason: "internal_note" };
    }

    // Flip status → waiting_customer + timestamps
    const patch: Record<string, unknown> = {
      status: "waiting_customer",
      updated_at: now,
      last_staff_message_at: now,
    };
    if (!ticket.first_response_at) patch.first_response_at = now;
    await admin.from("support_tickets").update(patch as never).eq("id", ticket.id);

    // Try to send the reply email. If the customer has no email on file we
    // still keep the reply row — staff can see it, but flag that nothing was
    // emailed so the UI can show a warning.
    const cust = await loadCustomer(ticket.customer_id);
    const recipient = ticket.ticket_email || cust.email;
    if (!recipient) {
      return { ok: true, emailed: false, reason: "no_recipient_email" };
    }

    try {
      const result = await sendTicketAdHocReply({
        ticket,
        actorId: context.userId,
        replyId: (replyRow as { id: string }).id,
        message: data.message,
      });
      // Arm ticket-autoclose only after the email actually leaves the system.
      if (data.armAutoclose) {
        const { startTicketAutocloseScheduler } = await import("@/lib/scheduling/schedulers.server");
        await startTicketAutocloseScheduler({
          ticketId: ticket.id,
          applicationId: ticket.application_id ?? null,
          createdBy: context.userId,
        });
      }
      return { ok: true, emailed: true, recipient: result.recipient };
    } catch (e) {
      console.error("[tickets] reply email failed", e);
      throw new Error(e instanceof Error ? e.message : "Reply was saved, but the email was not sent.");
    }
  });

// ─────────────────────────── closeTicketWithReply (E008) ───────────────────────────

const CloseWithReplyInput = z.object({
  ticketId: z.string().uuid(),
  message: z.string().min(1),
});

export const closeTicketWithReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => CloseWithReplyInput.parse(i))
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const ticket = await loadTicket(data.ticketId);
    const now = new Date().toISOString();

    await admin.from("ticket_replies").insert({
      ticket_id: ticket.id,
      reply_text: data.message,
      is_internal: false,
      created_by: context.userId,
      direction: "outbound",
    } as never);

    await admin
      .from("support_tickets")
      .update({
        status: "closed",
        resolved_at: now,
        resolved_by: context.userId,
        closed_at: now,
        updated_at: now,
        last_staff_message_at: now,
      } as never)
      .eq("id", ticket.id);

    // Cancel any armed auto-close.
    const { cancelTicketAutocloseByTicket } = await import("@/lib/scheduling/schedulers.server");
    await cancelTicketAutocloseByTicket(ticket.id, "closed_by_staff");

    if (ticket.application_id) {
      try {
        const { dispatchEvent } = await import("@/lib/workflow/engine.server");
        await dispatchEvent(
          {
            type: "TicketClosed",
            applicationId: ticket.application_id,
            ticketId: ticket.id,
            outcome: "not_cooperating",
            actorId: context.userId,
          },
          context.userId,
        );
      } catch (e) { console.error("[workflow] TicketClosed dispatch failed", e); }
    }


    const cust = await loadCustomer(ticket.customer_id);
    const recipient = ticket.ticket_email || cust.email;
    if (recipient) {
      const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E009_TICKET_RESOLVED,
          recipient,
          {
            customerName: cust.name,
            ticketSubject: ticket.subject,
            ticketNumber: ticket.ticket_number ?? ticket.id.slice(0, 8),
            replyMessage: data.message,
            fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
          },
          { applicationId: ticket.application_id ?? undefined, trigger: "manual" },
        );
      } catch (e) {
        console.error("[tickets] E008 enqueue failed", e);
      }
    }

    return { ok: true };
  });

// ─────────────────────────── closeTicketFinal (E009) ───────────────────────────

const CloseFinalInput = z.object({
  ticketId: z.string().uuid(),
  reason: z.string().optional(),
});

export const closeTicketFinal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => CloseFinalInput.parse(i))
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const ticket = await loadTicket(data.ticketId);
    const now = new Date().toISOString();

    await admin
      .from("support_tickets")
      .update({
        status: "closed",
        resolved_at: now,
        resolved_by: context.userId,
        closed_at: now,
        updated_at: now,
      } as never)
      .eq("id", ticket.id);

    await admin.from("ticket_replies").insert({
      ticket_id: ticket.id,
      reply_text: data.reason || "Ticket closed — no further action required.",
      is_internal: true,
      created_by: context.userId,
      direction: "note",
    } as never);

    const { cancelTicketAutocloseByTicket } = await import("@/lib/scheduling/schedulers.server");
    await cancelTicketAutocloseByTicket(ticket.id, "closed_final");

    if (ticket.application_id) {
      try {
        const { dispatchEvent } = await import("@/lib/workflow/engine.server");
        await dispatchEvent(
          {
            type: "TicketClosed",
            applicationId: ticket.application_id,
            ticketId: ticket.id,
            outcome: "not_cooperating",
            actorId: context.userId,
          },
          context.userId,
        );
      } catch (e) { console.error("[workflow] TicketClosed dispatch failed", e); }
    }

    const cust = await loadCustomer(ticket.customer_id);
    const recipient = ticket.ticket_email || cust.email;
    if (recipient) {
      const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E010_TICKET_CLOSED_FINAL,
          recipient,
          {
            customerName: cust.name,
            ticketSubject: ticket.subject,
            ticketNumber: ticket.ticket_number ?? ticket.id.slice(0, 8),
            fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
          },
          { applicationId: ticket.application_id ?? undefined },
        );
      } catch (e) {
        console.error("[tickets] E009 enqueue failed", e);
      }
    }

    return { ok: true };
  });

// ─────────────────────────── getTicketOrderContext ───────────────────────────

export const getTicketOrderContext = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ orderId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { data: row } = await admin
      .from("applications")
      .select(
        "id, application_code, order_status, fulfillment_status, service_id, customer_id, services(service_name), customers(name, primary_email, primary_mobile)"
      )
      .eq("id", data.orderId)
      .maybeSingle();
    if (!row) return null;
    const r = row as any;
    return {
      id: r.id,
      application_code: r.application_code as string | null,
      order_status: r.order_status as string | null,
      fulfillment_status: r.fulfillment_status as string | null,
      service_name: r.services?.service_name ?? null,
      customer_name: r.customers?.name ?? null,
      customer_email: r.customers?.primary_email ?? null,
      customer_mobile: r.customers?.primary_mobile ?? null,
    };
  });

// ─────────────────────────── resolveTicketAndResumeOrder ───────────────────────────

const ResumeInput = z.object({
  ticketId: z.string().uuid(),
  resumeTo: z.enum(["IN_PROCESSING", "SUBMITTED_TO_GOVT"]).default("IN_PROCESSING"),
  note: z.string().max(1000).optional(),
});

export const resolveTicketAndResumeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ResumeInput.parse(i))
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const ticket = await loadTicket(data.ticketId);
    if (!ticket.application_id) {
      throw new Error("This ticket is not linked to an order.");
    }
    const now = new Date().toISOString();

    // Transition the order back to the requested resume state (SQL enforces map).
    const { error: tErr } = await context.supabase.rpc("transition_order_status", {
      _order_id: ticket.application_id,
      _new_status: data.resumeTo,
      _remarks: `Resumed from ticket ${ticket.ticket_number ?? ticket.id.slice(0, 8)}${data.note ? " — " + data.note : ""}`,
    });
    if (tErr) throw new Error(tErr.message);

    // Mark ticket resolved.
    await admin
      .from("support_tickets")
      .update({
        status: "resolved",
        resolved_at: now,
        resolved_by: context.userId,
        closed_at: now,
        updated_at: now,
      } as never)
      .eq("id", ticket.id);

    // Cancel any autoclose scheduler.
    try {
      const { cancelTicketAutocloseByTicket } = await import("@/lib/scheduling/schedulers.server");
      await cancelTicketAutocloseByTicket(ticket.id, "resolved_and_resumed");
    } catch { /* non-fatal */ }

    // Audit event on the order.
    await admin.from("application_events").insert({
      application_id: ticket.application_id,
      customer_id: ticket.customer_id,
      event_type: "order_resumed_from_ticket",
      new_value: data.resumeTo,
      note: `Ticket ${ticket.ticket_number ?? ""} resolved · resumed → ${data.resumeTo}`,
      created_by: context.userId,
    } as never);

    // Workflow engine: cooperating close → resume paused timers/automations.
    try {
      const { dispatchEvent } = await import("@/lib/workflow/engine.server");
      await dispatchEvent(
        {
          type: "TicketClosed",
          applicationId: ticket.application_id,
          ticketId: ticket.id,
          outcome: "cooperating",
          actorId: context.userId,
        },
        context.userId,
      );
    } catch (e) { console.error("[workflow] TicketClosed dispatch failed", e); }

    return { ok: true, resumeTo: data.resumeTo };
  });

// ─────────────────────────── Support Ticket flowchart buttons ───────────────────────────
// 4 canonical support actions. Only Consultation sends T001. T002 sends the
// reason-reply template and arms the 8-business-hour auto-close.

async function resumePausedCustomerDelayForTicket(ticket: TicketRow) {
  if (!ticket.application_id) return;
  const admin = await getAdmin();
  try {
    const { data: rows } = await admin
      .from("order_schedulers")
      .select("id")
      .eq("application_id", ticket.application_id)
      .eq("status", "paused")
      .eq("paused_by_ticket_id", ticket.id)
      .in("scheduler_type", ["customer_closure_24h", "customer_side_delay"]);
    if (!rows?.length) return;
    const { resumeScheduler } = await import("@/lib/scheduling/schedulers.server");
    for (const row of rows as Array<{ id: string }>) await resumeScheduler(row.id);
  } catch (e) {
    console.error("[tickets] customer-delay resume failed", e);
  }
}

async function dispatchTicketClosedCooperating(ticket: TicketRow, actorId: string) {
  if (!ticket.application_id) return;
  try {
    const { dispatchEvent } = await import("@/lib/workflow/engine.server");
    await dispatchEvent({
      type: "TicketClosed",
      applicationId: ticket.application_id,
      ticketId: ticket.id,
      outcome: "cooperating",
      actorId,
    }, actorId);
  } catch (e) { console.error("[workflow] TicketClosed(cooperating) dispatch failed", e); }
  await resumePausedCustomerDelayForTicket(ticket);
}

async function markTicketClosed(ticketId: string, actorId: string, noteText: string, reason: string) {
  const admin = await getAdmin();
  const now = new Date().toISOString();
  await admin
    .from("support_tickets")
    .update({
      status: "closed",
      resolved_at: now,
      resolved_by: actorId,
      closed_at: now,
      updated_at: now,
      last_staff_message_at: now,
    } as never)
    .eq("id", ticketId);
  await admin.from("ticket_replies").insert({
    ticket_id: ticketId,
    reply_text: noteText,
    is_internal: true,
    created_by: actorId,
    direction: "note",
  } as never);
  try {
    const { cancelTicketAutocloseByTicket } = await import("@/lib/scheduling/schedulers.server");
    await cancelTicketAutocloseByTicket(ticketId, reason);
  } catch { /* non-fatal */ }
}

// T001 — Normal Close / No Action Required
export const closeTicketNormalT001 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ ticketId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const ticket = await loadTicket(data.ticketId);
    await markTicketClosed(ticket.id, context.userId, "Closed: Normal / no action required.", "closed_normal_no_action");
    await dispatchTicketClosedCooperating(ticket, context.userId);
    return { ok: true };
  });

// Restart Order — the database atomically cancels the customer-delay timer,
// returns the linked order to Form Submitted, and closes the ticket.
export const closeTicketRestartT001 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({
    ticketId: z.string().uuid(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    const ticket = await loadTicket(data.ticketId);
    if (!ticket.application_id) throw new Error("This ticket is not linked to an order.");
    const { data: result, error } = await context.supabase.rpc("restart_order_from_ticket", {
      _ticket_id: ticket.id,
    });
    if (error) throw new Error(error.message);
    return result as { ok: true; applicationId: string; cancelledCustomerDelayTimers: number };
  });

// T001 — Consultation / Support Completed
export const closeTicketConsultationT001 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ ticketId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const ticket = await loadTicket(data.ticketId);
    await sendTicketTemplateEmail({
      ticket, code: BHS_EMAILS.T001_TICKET_COMPLETED, actorId: context.userId,
      extraVars: {
        ticket_close_variant: "consultation_done",
        employee_reply: "Your consultation / support request has been completed. Please reach out if you need anything further.",
        employeeReply: "Your consultation / support request has been completed. Please reach out if you need anything further.",
        replyMessage: "Your consultation / support request has been completed. Please reach out if you need anything further.",
      },
    });
    await markTicketClosed(ticket.id, context.userId, "T001 sent — Consultation / support completed.", "closed_t001_consultation");
    await dispatchTicketClosedCooperating(ticket, context.userId);
    return { ok: true };
  });

// T002 — Reply w/ reason (arms 8h auto-close → T003)
export const closeTicketReplyReasonT002 = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({
    ticketId: z.string().uuid(),
    reasonId: z.string().uuid().nullable().optional(),
    reasonLabel: z.string().max(200).optional(),
    replyBody: z.string().min(1),
  }).parse(i))
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const ticket = await loadTicket(data.ticketId);
    const now = new Date().toISOString();

    const { data: replyRow, error: replyErr } = await admin.from("ticket_replies").insert({
      ticket_id: ticket.id,
      reply_text: data.replyBody,
      is_internal: false,
      created_by: context.userId,
      direction: "outbound",
    } as never).select("id").single();
    if (replyErr) throw new Error(replyErr.message);

    await sendTicketTemplateEmail({
      ticket, code: BHS_EMAILS.T002_TICKET_REPLY, actorId: context.userId,
      replyId: (replyRow as { id: string }).id,
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
        followup_date: "8 hours",
        followupDate: "8 hours",
      },
    });

    const patch: Record<string, unknown> = {
      status: "waiting_customer",
      updated_at: now,
      last_staff_message_at: now,
    };
    if (!ticket.first_response_at) patch.first_response_at = now;
    await admin.from("support_tickets").update(patch as never).eq("id", ticket.id);

    const { startTicketAutocloseScheduler } = await import("@/lib/scheduling/schedulers.server");
    await startTicketAutocloseScheduler({
      ticketId: ticket.id,
      applicationId: ticket.application_id ?? null,
      totalSeconds: 8 * 60 * 60,
      createdBy: context.userId,
      note: data.reasonLabel ?? null,
    });

    return { ok: true };
  });



