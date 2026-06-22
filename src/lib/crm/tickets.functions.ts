import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

const TICKET_STATUSES = ["open", "in_progress", "waiting_customer", "resolved", "closed"] as const;
const PRIORITIES = ["high", "medium", "low"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof PRIORITIES)[number];

export const listTickets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(25),
        q: z.string().default(""),
        status: z.enum(TICKET_STATUSES).optional(),
        priority: z.enum(PRIORITIES).optional(),
        assignedTo: z.string().uuid().optional(),
        scope: z.enum(["mine", "all"]).default("all"),
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
        "id, ticket_number, subject, status, priority, assigned_to, created_at, customer_id, application_id, service_id, customers(name, primary_mobile), applications(application_code), services(service_name)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (data.status) q = q.eq("status", data.status);
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
        "id, ticket_number, subject, description, status, priority, assigned_to, resolved_at, resolved_by, created_at, updated_at, customer_id, application_id, service_id, customers(id, name, primary_email, primary_mobile), applications(id, application_code, service_name), services(service_name)"
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Ticket not found");

    const { data: replies } = await admin
      .from("ticket_replies")
      .select("id, reply_text, is_internal, created_by, created_at")
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
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();

    let serviceId: string | null = null;
    if (data.applicationId) {
      const { data: app } = await admin
        .from("applications")
        .select("service_id")
        .eq("id", data.applicationId)
        .maybeSingle();
      serviceId = (app?.service_id as string | null) ?? null;
    }

    const { data: ins, error } = await admin
      .from("support_tickets")
      .insert({
        subject: data.subject,
        description: data.description ?? null,
        priority: data.priority,
        assigned_to: data.assignedTo ?? null,
        customer_id: data.customerId,
        application_id: data.applicationId ?? null,
        service_id: serviceId,
        status: "open",
      } as never)
      .select("id, ticket_number")
      .single();
    if (error) throw new Error(error.message);

    if (data.applicationId) {
      await admin.from("application_events").insert({
        application_id: data.applicationId,
        customer_id: data.customerId,
        event_type: "ticket_created",
        new_value: ins!.ticket_number,
        created_by: context.userId,
      } as never);
    }

    // Best-effort email enqueue (template optional)
    try {
      const { data: cust } = await admin
        .from("customers")
        .select("name, primary_email")
        .eq("id", data.customerId)
        .maybeSingle();
      if (cust?.primary_email) {
        const m = await import("@/lib/emails/emails.server");
        await m.enqueueFromTemplateInternal(
          "ticket_created",
          cust.primary_email,
          {
            customer_name: cust.name ?? "",
            ticket_number: ins!.ticket_number,
            subject: data.subject,
          },
          { toName: cust.name ?? undefined, applicationId: data.applicationId ?? undefined }
        );
      }
    } catch {
      // template missing or send failure — non-fatal
    }

    return { id: ins!.id, ticket_number: ins!.ticket_number };
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
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const patch: Record<string, unknown> = {};
    if (data.status) {
      patch.status = data.status;
      if (data.status === "resolved") {
        patch.resolved_at = new Date().toISOString();
        patch.resolved_by = context.userId;
      } else {
        patch.resolved_at = null;
        patch.resolved_by = null;
      }
    }
    if (data.priority) patch.priority = data.priority;
    if (data.assignedTo !== undefined) patch.assigned_to = data.assignedTo;

    if (Object.keys(patch).length === 0) return { ok: true };

    const { data: row, error } = await admin
      .from("support_tickets")
      .update(patch as never)
      .eq("id", data.id)
      .select("application_id, customer_id, ticket_number, status")
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
    return { ok: true };
  });

export const replyToTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        ticketId: z.string().uuid(),
        text: z.string().trim().min(1).max(5000),
        isInternal: z.boolean().default(false),
      })
      .parse(i)
  )
  .handler(async ({ data, context }) => {
    const admin = await getAdmin();
    const { error } = await admin.from("ticket_replies").insert({
      ticket_id: data.ticketId,
      reply_text: data.text,
      is_internal: data.isInternal,
      created_by: context.userId,
    } as never);
    if (error) throw new Error(error.message);

    // If staff sent a customer reply, move ticket to in_progress (if currently open).
    if (!data.isInternal) {
      await admin
        .from("support_tickets")
        .update({ status: "in_progress" } as never)
        .eq("id", data.ticketId)
        .eq("status", "open");
    }
    return { ok: true };
  });

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
