// Admin-only functions to manage inbox, emails, and support tickets.
// Provides comprehensive reporting and manual ingestion capabilities.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function requireAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const rows = (roles ?? []) as Array<{ role: string }>;
  const isAdmin = rows.some((r) => r.role === "admin" || r.role === "super_admin");
  if (!isAdmin) throw new Error("Forbidden: admin role required");
}

/**
 * Get comprehensive inbox statistics and recent activity.
 * Shows fetched emails, matched tickets, unmatched emails, and errors.
 */
export const getInboxStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const admin = await getAdmin();

    const [
      emailLogs,
      tickets,
      quarantined,
      ticketReplies,
      emailQueue,
    ] = await Promise.all([
      admin
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("direction", "incoming"),
      admin
        .from("support_tickets")
        .select("*", { count: "exact", head: true }),
      admin
        .from("inbound_email_quarantine")
        .select("*", { count: "exact", head: true }),
      admin
        .from("ticket_replies")
        .select("*", { count: "exact", head: true }),
      admin
        .from("email_queue")
        .select("*", { count: "exact", head: true }),
    ]);

    // Get last 7 days of email logs
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recent7d } = await admin
      .from("email_logs")
      .select("*")
      .eq("direction", "incoming")
      .gte("received_at", since7d)
      .order("received_at", { ascending: false })
      .limit(100);

    // Count by status
    const statusCounts = {} as Record<string, number>;
    (recent7d ?? []).forEach((log: any) => {
      const status = log.status || "unknown";
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
    });

    // Count quarantined by reason
    const { data: quarantineReasons } = await admin
      .from("inbound_email_quarantine")
      .select("reason")
      .limit(1000);
    const reasonCounts = {} as Record<string, number>;
    (quarantineReasons ?? []).forEach((q: any) => {
      const reason = q.reason || "unknown";
      reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
    });

    return {
      totals: {
        incomingEmailLogs: emailLogs.count ?? 0,
        supportTickets: tickets.count ?? 0,
        ticketReplies: ticketReplies.count ?? 0,
        quarantinedEmails: quarantined.count ?? 0,
        outgoingQueue: emailQueue.count ?? 0,
      },
      recent7days: {
        emails: recent7d?.length ?? 0,
        statusCounts,
      },
      quarantine: {
        total: quarantined.count ?? 0,
        reasonCounts,
      },
      inbox: "help@businesshelpservices.com",
    };
  });

/**
 * Get detailed list of recent incoming emails.
 */
export const getRecentInboxEmails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      limit: z.number().int().min(1).max(100).default(50),
      page: z.number().int().min(1).default(1),
      direction: z.enum(["incoming", "outgoing"]).default("incoming"),
    }).parse(i)
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const admin = await getAdmin();

    const from = (data.page - 1) * data.limit;
    const to = from + data.limit - 1;

    const { data: rows, count, error } = await admin
      .from("email_logs")
      .select(
        "id, from_email, to_email, subject, status, direction, received_at, sent_at, template_code, application_id, customer_id, lead_id, zoho_mail_uid",
        { count: "exact" }
      )
      .eq("direction", data.direction)
      .order("received_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      emails: rows ?? [],
      total: count ?? 0,
      page: data.page,
      pageSize: data.limit,
      totalPages: Math.ceil((count ?? 0) / data.limit),
    };
  });

/**
 * Get quarantined (unmatched/sender-mismatch) emails.
 */
export const getQuarantinedEmails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      limit: z.number().int().min(1).max(100).default(50),
      page: z.number().int().min(1).default(1),
      reason: z.enum(["no_match", "sender_mismatch"]).optional(),
    }).parse(i)
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const admin = await getAdmin();

    const from = (data.page - 1) * data.limit;
    const to = from + data.limit - 1;

    let q = admin
      .from("inbound_email_quarantine")
      .select(
        "id, from_email, to_email, subject, reason, received_at, body_text, matched_ticket_id, zoho_mail_uid",
        { count: "exact" }
      );

    if (data.reason) {
      q = q.eq("reason", data.reason);
    }

    const { data: rows, count, error } = await q
      .order("received_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      emails: rows ?? [],
      total: count ?? 0,
      page: data.page,
      pageSize: data.limit,
      totalPages: Math.ceil((count ?? 0) / data.limit),
    };
  });

/**
 * Get all support tickets with counts and filters.
 */
export const getAllTickets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      limit: z.number().int().min(1).max(100).default(50),
      page: z.number().int().min(1).default(1),
      status: z.enum(["open", "in_progress", "waiting_customer", "resolved", "closed"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    }).parse(i)
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const admin = await getAdmin();

    const from = (data.page - 1) * data.limit;
    const to = from + data.limit - 1;

    let q = admin
      .from("support_tickets")
      .select(
        "id, ticket_number, subject, status, priority, created_at, updated_at, first_response_at, resolved_at, closed_at, application_id, customer_id, ticket_email, assigned_to",
        { count: "exact" }
      );

    if (data.status) q = q.eq("status", data.status);
    if (data.priority) q = q.eq("priority", data.priority);

    const { data: rows, count, error } = await q
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      tickets: rows ?? [],
      total: count ?? 0,
      page: data.page,
      pageSize: data.limit,
      totalPages: Math.ceil((count ?? 0) / data.limit),
    };
  });

/**
 * Manually trigger email polling from Zoho inbox.
 */
export const pollInboxNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      limit: z.number().int().min(1).max(200).default(50),
    }).parse(i)
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);

    const { pollZohoInbox } = await import("@/lib/mail/inbox-matcher.server");
    const result = await pollZohoInbox(data.limit);

    return {
      ok: true,
      ...result,
      timestamp: new Date().toISOString(),
      message: `Fetched ${result.fetched} emails: ${result.new} new, ${result.matched} matched, ${result.unmatched} unmatched, ${result.errors} errors`,
    };
  });

/**
 * Get ticket conversation (ticket + all replies).
 */
export const getTicketConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ ticketId: z.string().uuid() }).parse(i)
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const admin = await getAdmin();

    const { data: ticket, error: ticketErr } = await admin
      .from("support_tickets")
      .select("*")
      .eq("id", data.ticketId)
      .maybeSingle();

    if (ticketErr) throw new Error(ticketErr.message);
    if (!ticket) throw new Error("Ticket not found");

    const { data: replies, error: repliesErr } = await admin
      .from("ticket_replies")
      .select("*")
      .eq("ticket_id", data.ticketId)
      .order("created_at", { ascending: true });

    if (repliesErr) throw new Error(repliesErr.message);

    return {
      ticket,
      replies: replies ?? [],
      replyCount: replies?.length ?? 0,
    };
  });

/**
 * Get email statistics by sender domain.
 */
export const getEmailsByDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const admin = await getAdmin();

    const { data: logs, error } = await admin
      .from("email_logs")
      .select("from_email")
      .eq("direction", "incoming")
      .order("received_at", { ascending: false });

    if (error) throw new Error(error.message);

    const domainCounts = {} as Record<string, { count: number; emails: Set<string> }>;

    (logs ?? []).forEach((log: any) => {
      const email = (log.from_email || "").toLowerCase().trim();
      if (!email) return;
      const domain = email.split("@")[1] || "unknown";
      if (!domainCounts[domain]) {
        domainCounts[domain] = { count: 0, emails: new Set() };
      }
      domainCounts[domain].count++;
      domainCounts[domain].emails.add(email);
    });

    const summary = Object.entries(domainCounts)
      .map(([domain, data]) => ({
        domain,
        count: data.count,
        uniqueSenders: data.emails.size,
        sampleEmails: Array.from(data.emails).slice(0, 5),
      }))
      .sort((a, b) => b.count - a.count);

    return { summary, total: logs?.length ?? 0 };
  });
