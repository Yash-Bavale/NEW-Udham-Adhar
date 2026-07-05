/**
 * Support-ticket atomic actions (BHS v2 — Phase 7 / Scheduler 6).
 *
 * - replyToTicket           → public staff reply + arm 24h auto-close
 * - closeTicketWithReply    → E008 email + close (final reply included)
 * - closeTicketFinal        → E009 email + close (no further action)
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

async function loadTicket(ticketId: string) {
  const admin = await getAdmin();
  const { data, error } = await admin
    .from("support_tickets")
    .select("id, subject, status, application_id, customer_id")
    .eq("id", ticketId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Ticket not found");
  return data as {
    id: string;
    subject: string;
    status: string | null;
    application_id: string | null;
    customer_id: string | null;
  };
}

async function loadCustomerEmail(customerId: string | null) {
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

    await admin.from("ticket_replies").insert({
      ticket_id: ticket.id,
      reply_text: data.message,
      is_internal: data.isInternal ?? false,
      created_by: context.userId,
    } as never);

    if (!data.isInternal) {
      await admin
        .from("support_tickets")
        .update({ status: "waiting_customer", updated_at: new Date().toISOString() } as never)
        .eq("id", ticket.id);
    }

    // Arm ticket-autoclose only when we have an application context and it's a public reply.
    if (data.armAutoclose && !data.isInternal && ticket.application_id) {
      const { startTicketAutocloseScheduler } = await import("@/lib/scheduling/schedulers.server");
      await startTicketAutocloseScheduler({
        ticketId: ticket.id,
        applicationId: ticket.application_id,
        createdBy: context.userId,
      });
    }

    return { ok: true };
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
    } as never);

    await admin
      .from("support_tickets")
      .update({
        status: "closed",
        resolved_at: now,
        resolved_by: context.userId,
        updated_at: now,
      } as never)
      .eq("id", ticket.id);

    // Cancel any armed auto-close.
    const { cancelTicketAutocloseByTicket } = await import("@/lib/scheduling/schedulers.server");
    await cancelTicketAutocloseByTicket(ticket.id, "closed_by_staff");

    const cust = await loadCustomerEmail(ticket.customer_id);
    if (cust.email) {
      const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E008_TICKET_CLOSED_REPLY,
          cust.email,
          {
            customerName: cust.name,
            ticketSubject: ticket.subject,
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
        updated_at: now,
      } as never)
      .eq("id", ticket.id);

    await admin.from("ticket_replies").insert({
      ticket_id: ticket.id,
      reply_text: data.reason || "Ticket closed — no further action required.",
      is_internal: true,
      created_by: context.userId,
    } as never);

    const { cancelTicketAutocloseByTicket } = await import("@/lib/scheduling/schedulers.server");
    await cancelTicketAutocloseByTicket(ticket.id, "closed_final");

    const cust = await loadCustomerEmail(ticket.customer_id);
    if (cust.email) {
      const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
      try {
        await enqueueFromTemplateInternal(
          BHS_EMAILS.E009_TICKET_CLOSED_FINAL,
          cust.email,
          {
            customerName: cust.name,
            ticketSubject: ticket.subject,
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
