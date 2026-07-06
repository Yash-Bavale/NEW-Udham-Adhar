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
  if (!customerId) return { email: null as string | null, name: "Customer" };
  const admin = await getAdmin();
  const { data } = await admin
    .from("customers")
    .select("primary_email, name")
    .eq("id", customerId)
    .maybeSingle();
  const c = data as { primary_email: string | null; name: string | null } | null;
  return { email: c?.primary_email ?? null, name: c?.name ?? "Customer" };
}

/** Build In-Reply-To / References chain from the latest outbound reply on this ticket. */
async function loadThreadHeaders(ticketId: string): Promise<{
  inReplyTo: string | null;
  references: string | null;
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
  if (ids.length === 0) return { inReplyTo: null, references: null };
  return {
    inReplyTo: ids[ids.length - 1],
    references: ids.map((i) => (i.startsWith("<") ? i : `<${i}>`)).join(" "),
  };
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

    // Arm ticket-autoclose (works for both order-linked and standalone tickets).
    if (data.armAutoclose) {
      const { startTicketAutocloseScheduler } = await import("@/lib/scheduling/schedulers.server");
      await startTicketAutocloseScheduler({
        ticketId: ticket.id,
        applicationId: ticket.application_id ?? null,
        createdBy: context.userId,
      });
    }

    // Try to send the reply email. If the customer has no email on file we
    // still keep the reply row — staff can see it, but flag that nothing was
    // emailed so the UI can show a warning.
    const cust = await loadCustomer(ticket.customer_id);
    const recipient = ticket.ticket_email || cust.email;
    if (!recipient) {
      return { ok: true, emailed: false, reason: "no_recipient_email" };
    }

    // Build actor + threading data
    let actorName = "Support";
    try {
      const { data: prof } = await admin
        .from("profiles")
        .select("display_name, full_name, email")
        .eq("id", context.userId)
        .maybeSingle();
      const p = prof as { display_name?: string | null; full_name?: string | null; email?: string | null } | null;
      actorName = p?.display_name || p?.full_name || p?.email?.split("@")[0] || "Support";
    } catch { /* non-fatal */ }

    const thread = await loadThreadHeaders(ticket.id);

    try {
      const { enqueueEmailInternal } = await import("@/lib/emails/emails.server");
      const ticketNumber = ticket.ticket_number ?? ticket.id.slice(0, 8);
      const result = await enqueueEmailInternal({
        templateCode: null,
        toEmail: recipient,
        toName: cust.name,
        subject: `Re: [#${ticketNumber}] ${ticket.subject}`,
        bodyHtml: `<p>Hi ${cust.name || "Customer"},</p><div>${data.message.replace(/\n/g, "<br/>")}</div><p>Regards,<br/>${actorName} · Business Help Services</p>`,
        bodyText: `Hi ${cust.name || "Customer"},\n\n${data.message}\n\nRegards,\n${actorName} · Business Help Services`,
        variables: {
          customerName: cust.name,
          replyMessage: data.message,
          ticketNumber,
          ticketSubject: ticket.subject,
          fromName: `${actorName} · Business Help Services`,
          __in_reply_to: thread.inReplyTo,
          __references: thread.references,
        },
        applicationId: ticket.application_id ?? undefined,
      });

      // Best-effort: look up the outbound Message-ID from email_logs by queue_id
      // and stash it on the ticket_replies row so the next reply can chain.
      const queueId = (result as { queueId?: string | null } | undefined)?.queueId ?? null;
      if (queueId) {
        try {
          const { data: log } = await admin
            .from("email_logs")
            .select("id, message_id")
            .eq("queue_id", queueId)
            .eq("direction", "outgoing")
            .order("sent_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          const l = log as { id: string | null; message_id: string | null } | null;
          if (l?.message_id) {
            await admin
              .from("ticket_replies")
              .update({
                email_message_id: l.message_id,
                email_in_reply_to: thread.inReplyTo,
                email_send_log_id: l.id,
                emailed_at: now,
              } as never)
              .eq("id", (replyRow as { id: string }).id);
          } else {
            await admin
              .from("ticket_replies")
              .update({ emailed_at: now } as never)
              .eq("id", (replyRow as { id: string }).id);
          }
        } catch { /* non-fatal */ }
      }
      return { ok: true, emailed: true, recipient };
    } catch (e) {
      console.error("[tickets] reply email failed", e);
      return { ok: true, emailed: false, reason: "email_error" };
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

    const cust = await loadCustomer(ticket.customer_id);
    const recipient = ticket.ticket_email || cust.email;
    if (recipient) {
      const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E008_TICKET_CLOSED_REPLY,
          recipient,
          {
            customerName: cust.name,
            ticketSubject: ticket.subject,
            ticketNumber: ticket.ticket_number ?? ticket.id.slice(0, 8),
            replyMessage: data.message,
            fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
          },
          { applicationId: ticket.application_id ?? undefined },
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

    const cust = await loadCustomer(ticket.customer_id);
    const recipient = ticket.ticket_email || cust.email;
    if (recipient) {
      const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E009_TICKET_CLOSED_FINAL,
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
