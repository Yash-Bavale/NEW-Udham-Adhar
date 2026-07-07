import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

const TICKET_STATUSES = ["open", "in_progress", "waiting_customer", "resolved", "closed"] as const;
const PRIORITIES = ["urgent", "high", "medium", "low"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof PRIORITIES)[number];

// Re-export the emailing reply from ticket-actions so the UI has a single source of truth.
export { replyToTicket } from "@/lib/tickets/ticket-actions.functions";

export const listTickets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(25),
        q: z.string().default(""),
        status: z.enum(TICKET_STATUSES).optional(),
        statuses: z.array(z.enum(TICKET_STATUSES)).optional(),
        priority: z.enum(PRIORITIES).optional(),
        assignedTo: z.string().uuid().optional(),
        scope: z.enum(["mine", "all"]).default("all"),
        sort: z.enum(["newest", "oldest", "updated", "unassigned"]).default("newest"),
        unassignedOnly: z.boolean().default(false),
      })
      .parse(i ?? {})
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;

    let q = admin
      .from("support_tickets")
      .select(
        "id, ticket_number, subject, status, priority, assigned_to, created_at, updated_at, last_customer_message_at, last_staff_message_at, customer_id, application_id, service_id, customers(name, primary_mobile), applications(application_code), services(service_name)",
        { count: "exact" }
      )
      .range(from, to);

    if (data.sort === "oldest") q = q.order("created_at", { ascending: true });
    else if (data.sort === "updated") q = q.order("updated_at", { ascending: false });
    else if (data.sort === "unassigned")
      q = q
        .order("assigned_to", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: false });
    else q = q.order("created_at", { ascending: false });

    if (data.unassignedOnly || data.sort === "unassigned") q = q.is("assigned_to", null);
    if (data.status) q = q.eq("status", data.status);
    else if (data.statuses && data.statuses.length) q = q.in("status", data.statuses);
    if (data.priority) q = q.eq("priority", data.priority);
    if (data.assignedTo) q = q.eq("assigned_to", data.assignedTo);
    if (data.scope === "mine") q = q.eq("assigned_to", context.userId);
    if (data.q.trim()) {
      const like = `%${data.q.trim()}%`;
      q = q.or(`ticket_number.ilike.${like},subject.ilike.${like}`);
    }

    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);

    const assignees = Array.from(
      new Set((rows ?? []).map((r: any) => r.assigned_to).filter(Boolean))
    ) as string[];
    const nameMap = new Map<string, string>();
    if (assignees.length) {
      const { data: profs } = await admin
        .from("profiles")
        .select("id, full_name, display_name, email")
        .in("id", assignees);
      (profs ?? []).forEach((p: any) =>
        nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff")
      );
    }

    const tickets = (rows ?? []).map((r: any) => ({
      id: r.id,
      ticket_number: r.ticket_number,
      subject: r.subject,
      status: r.status as TicketStatus,
      priority: (r.priority as TicketPriority) ?? "medium",
      assigned_to: r.assigned_to,
      assigned_name: r.assigned_to ? nameMap.get(r.assigned_to) ?? null : null,
      created_at: r.created_at,
      updated_at: r.updated_at,
      last_customer_message_at: r.last_customer_message_at,
      last_staff_message_at: r.last_staff_message_at,
      customer_id: r.customer_id,
      customer_name: r.customers?.name ?? null,
      application_id: r.application_id,
      application_code: r.applications?.application_code ?? null,
      service_name: r.services?.service_name ?? null,
    }));

    return { tickets, total: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

export const getTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { data: row, error } = await admin
      .from("support_tickets")
      .select(
        "id, ticket_number, subject, description, status, priority, assigned_to, resolved_at, resolved_by, closed_at, first_response_at, last_customer_message_at, last_staff_message_at, ticket_email, source, created_at, updated_at, customer_id, application_id, service_id, customers(id, name, primary_email, primary_mobile), applications(id, application_code), services(service_name)"
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Ticket not found");

    const { data: replies } = await admin
      .from("ticket_replies")
      .select("id, reply_text, is_internal, created_by, created_at, direction, emailed_at, email_message_id")
      .eq("ticket_id", data.id)
      .order("created_at", { ascending: true });

    const authorIds = Array.from(
      new Set([
        ...(replies ?? []).map((r) => r.created_by).filter(Boolean) as string[],
        ...(row.assigned_to ? [row.assigned_to] : []),
        ...(row.resolved_by ? [row.resolved_by] : []),
      ])
    );
    const nameMap = new Map<string, string>();
    if (authorIds.length) {
      const { data: profs } = await admin
        .from("profiles")
        .select("id, full_name, display_name, email")
        .in("id", authorIds);
      (profs ?? []).forEach((p: any) =>
        nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff")
      );
    }

    return {
      ticket: {
        ...row,
        assigned_name: row.assigned_to ? nameMap.get(row.assigned_to) ?? null : null,
        resolved_name: row.resolved_by ? nameMap.get(row.resolved_by) ?? null : null,
      },
      replies: (replies ?? []).map((r: any) => ({
        ...r,
        author_name: r.created_by ? nameMap.get(r.created_by) ?? "Staff" : "System",
      })),
    };
  });

export const checkOpenTicketForOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ applicationId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { data: row } = await admin
      .from("support_tickets")
      .select("id, ticket_number, subject, status")
      .eq("application_id", data.applicationId)
      .in("status", ["open", "in_progress", "waiting_customer"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return row ?? null;
  });

export const createTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        subject: z.string().trim().min(3).max(200),
        description: z.string().trim().max(5000).optional(),
        priority: z.enum(PRIORITIES).default("medium"),
        assignedTo: z.string().uuid().nullable().optional(),
        customerId: z.string().uuid(),
        applicationId: z.string().uuid().nullable().optional(),
        source: z.enum(["staff", "email_inbound", "web"]).default("staff"),
        allowDuplicate: z.boolean().default(false),
        category: z.enum(["technical", "order_related", "suggestion_to_owner"]).nullable().optional(),
        attachmentUrl: z.string().url().max(2000).nullable().optional(),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();

    // Dedup: reuse existing open ticket for the same order unless overridden.
    if (data.applicationId && !data.allowDuplicate) {
      const { data: existing } = await admin
        .from("support_tickets")
        .select("id, ticket_number")
        .eq("application_id", data.applicationId)
        .in("status", ["open", "in_progress", "waiting_customer"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const ex = existing as { id: string; ticket_number: string | null } | null;
      if (ex) {
        return { id: ex.id, ticket_number: ex.ticket_number ?? "", reused: true as const };
      }
    }


    // Enforce "registered email only" — resolve and snapshot the customer's email up-front.
    const { data: cust } = await admin
      .from("customers")
      .select("name, primary_email")
      .eq("id", data.customerId)
      .maybeSingle();
    const custRow = cust as { name: string | null; primary_email: string | null } | null;
    const ticketEmail = custRow?.primary_email?.trim().toLowerCase() || null;
    if (!ticketEmail) {
      throw new Error(
        "Customer has no registered email address on file. Add an email to the customer profile before opening a ticket."
      );
    }

    let serviceId: string | null = null;
    if (data.applicationId) {
      const { data: app } = await admin
        .from("applications")
        .select("service_id")
        .eq("id", data.applicationId)
        .maybeSingle();
      serviceId = (app?.service_id as string | null) ?? null;
    }

    // Auto-assign from assignment_pool round-robin when no explicit assignee.
    let resolvedAssignee: string | null = data.assignedTo ?? null;
    let autoAssignedPoolId: string | null = null;
    if (!resolvedAssignee) {
      const { data: poolRow } = await admin
        .from("assignment_pool")
        .select("id, user_id, service_id, last_assigned_at, total_assigned")
        .eq("is_active", true)
        .or(
          serviceId
            ? `service_id.eq.${serviceId},service_id.is.null`
            : `service_id.is.null`
        )
        .order("service_id", { ascending: true, nullsFirst: false })
        .order("last_assigned_at", { ascending: true, nullsFirst: true })
        .order("total_assigned", { ascending: true })
        .limit(1)
        .maybeSingle();
      const p = poolRow as { id: string; user_id: string } | null;
      if (p) {
        resolvedAssignee = p.user_id;
        autoAssignedPoolId = p.id;
      }
    }

    const { data: ins, error } = await admin
      .from("support_tickets")
      .insert({
        subject: data.subject,
        description: data.description ?? null,
        priority: data.priority,
        assigned_to: resolvedAssignee,
        customer_id: data.customerId,
        application_id: data.applicationId ?? null,
        service_id: serviceId,
        status: "open",
        ticket_email: ticketEmail,
        source: data.source,
        category: data.category ?? null,
        attachment_url: data.attachmentUrl ?? null,
      } as never)
      .select("id, ticket_number")
      .single();
    if (error) throw new Error(error.message);

    if (autoAssignedPoolId) {
      const { data: cur } = await admin
        .from("assignment_pool")
        .select("total_assigned")
        .eq("id", autoAssignedPoolId)
        .maybeSingle();
      const curCount = ((cur as { total_assigned: number | null } | null)?.total_assigned ?? 0) + 1;
      await admin
        .from("assignment_pool")
        .update({ last_assigned_at: new Date().toISOString(), total_assigned: curCount } as never)
        .eq("id", autoAssignedPoolId);
    }

    if (data.applicationId) {
      await admin.from("application_events").insert({
        application_id: data.applicationId,
        customer_id: data.customerId,
        event_type: "ticket_created",
        new_value: ins!.ticket_number,
        created_by: context.userId,
      } as never);
    }

    return { id: ins!.id, ticket_number: ins!.ticket_number, reused: false as const };
  });


export const updateTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(TICKET_STATUSES).optional(),
        priority: z.enum(PRIORITIES).optional(),
        assignedTo: z.string().uuid().nullable().optional(),
        resolutionNote: z.string().trim().max(2000).optional(),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const now = new Date().toISOString();
    const patch: Record<string, unknown> = {};
    if (data.status) {
      patch.status = data.status;
      if (data.status === "resolved") {
        patch.resolved_at = now;
        patch.resolved_by = context.userId;
      } else if (data.status === "closed") {
        patch.closed_at = now;
      } else {
        // Re-opening clears resolution timestamps
        patch.resolved_at = null;
        patch.resolved_by = null;
        patch.closed_at = null;
      }
    }
    if (data.priority) patch.priority = data.priority;
    if (data.assignedTo !== undefined) patch.assigned_to = data.assignedTo;

    if (Object.keys(patch).length === 0) return { ok: true };

    const { data: row, error } = await admin
      .from("support_tickets")
      .update(patch as never)
      .eq("id", data.id)
      .select(
        "application_id, customer_id, ticket_number, ticket_email, subject, status"
      )
      .single();
    if (error) throw new Error(error.message);

    if (data.status && row.application_id) {
      await admin.from("application_events").insert({
        application_id: row.application_id,
        customer_id: row.customer_id,
        event_type: "ticket_status_change",
        new_value: data.status,
        note: `Ticket ${row.ticket_number}`,
        created_by: context.userId,
      } as never);
    }

    // Close auto-close scheduler when transitioning to resolved.
    if (data.status === "resolved") {
      // Cancel any armed auto-close scheduler
      try {
        const { cancelTicketAutocloseByTicket } = await import(
          "@/lib/scheduling/schedulers.server"
        );
        await cancelTicketAutocloseByTicket(data.id, "resolved_by_staff");
      } catch { /* non-fatal */ }
    }

    // ── Send the customer email on resolve/close (E009 / E010). ──
    if (data.status === "resolved" || data.status === "closed") {
      try {
        // Pull recipient details (customer email + name).
        let recipient: string | null = row.ticket_email ?? null;
        let customerName = "Customer";
        if (row.customer_id) {
          const { data: cust } = await admin
            .from("customers")
            .select("primary_email, name")
            .eq("id", row.customer_id)
            .maybeSingle();
          const c = cust as { primary_email: string | null; name: string | null } | null;
          recipient = recipient || c?.primary_email || null;
          customerName = c?.name ?? "Customer";
        }

        if (recipient) {
          const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
          const { BHS_EMAILS } = await import("@/lib/emails/bhs-templates");
          const templateCode =
            data.status === "resolved"
              ? BHS_EMAILS.E009_TICKET_RESOLVED
              : BHS_EMAILS.E010_TICKET_CLOSED_FINAL;
          await enqueueFromTemplateInternal(
            templateCode,
            recipient,
            {
              customerName,
              ticketSubject: row.subject,
              ticketNumber: row.ticket_number ?? data.id.slice(0, 8),
              replyMessage: data.resolutionNote ?? "",
              fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
            },
            { applicationId: row.application_id ?? undefined, toName: customerName },
          );
        }
      } catch (e) {
        console.error("[tickets] resolve/close email failed", e);
      }
    }


    return { ok: true };
  });


// replyToTicket now lives in `@/lib/tickets/ticket-actions.functions` and is re-exported at the top of this file.


export const searchCustomerOptions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ q: z.string().default("") }).parse(i ?? {}))
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    let query = admin
      .from("customers")
      .select("id, customer_code, name, primary_email, primary_mobile")
      .order("created_at", { ascending: false })
      .limit(15);
    const q = data.q.trim();
    if (q) {
      const like = `%${q}%`;
      query = query.or(
        `name.ilike.${like},primary_email.ilike.${like},primary_mobile.ilike.${like},customer_code.ilike.${like}`
      );
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });
