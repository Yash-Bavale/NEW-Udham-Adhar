/**
 * getTicketWorkspace — one-shot loader for the full-page ticket workspace.
 * Returns everything the 3-column detail page needs so first paint is instant.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

export const getTicketWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ ticketId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const { data: ticket, error } = await admin
      .from("support_tickets")
      .select(
        "id, ticket_number, subject, description, status, priority, assigned_to, resolved_at, resolved_by, closed_at, first_response_at, last_customer_message_at, last_staff_message_at, ticket_email, source, created_at, updated_at, customer_id, application_id, service_id, customers(id, name, primary_email, primary_mobile, state, language, created_at, lifetime_value, total_applications, completed_applications), applications(id, application_code, order_status, fulfillment_status, assigned_to, created_at, service_id, services(service_name)), services(service_name)"
      )
      .eq("id", data.ticketId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!ticket) throw new Error("Ticket not found");

    const t = ticket as any;
    const customerId = t.customer_id as string | null;
    const applicationId = t.application_id as string | null;

    // Fire the remaining queries in parallel.
    const [
      repliesRes,
      emailsRes,
      eventsRes,
      docsRes,
      prevTicketsRes,
      prevOrdersRes,
      complaintsRes,
      refundsRes,
      paymentsRes,
      invoicesRes,
      assigneeProfilesRes,
    ] = await Promise.all([
      admin
        .from("ticket_replies")
        .select("id, reply_text, is_internal, created_by, created_at, direction, emailed_at, email_message_id")
        .eq("ticket_id", data.ticketId)
        .order("created_at", { ascending: true }),
      applicationId
        ? admin
            .from("email_logs")
            .select("id, subject, from_email, to_email, direction, body_html, body_text, created_at, sent_at, status, message_id")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: true })
            .limit(200)
        : Promise.resolve({ data: [] as any[], error: null }),
      applicationId
        ? admin
            .from("application_events")
            .select("id, event_type, old_value, new_value, note, staff_name, staff_role, created_at, created_by")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(60)
        : Promise.resolve({ data: [] as any[], error: null }),
      applicationId
        ? admin
            .from("documents")
            .select("id, doc_type, file_name, file_path, mime_type, size_bytes, status, uploaded_at, verified_at, verified_by, remarks")
            .eq("application_id", applicationId)
            .order("uploaded_at", { ascending: false })
        : Promise.resolve({ data: [] as any[], error: null }),
      customerId
        ? admin
            .from("support_tickets")
            .select("id, ticket_number, subject, status, priority, created_at")
            .eq("customer_id", customerId)
            .neq("id", data.ticketId)
            .order("created_at", { ascending: false })
            .limit(20)
        : Promise.resolve({ data: [] as any[], error: null }),
      customerId
        ? admin
            .from("applications")
            .select("id, application_code, order_status, created_at, services(service_name)")
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false })
            .limit(20)
        : Promise.resolve({ data: [] as any[], error: null }),
      customerId
        ? admin
            .from("complaints")
            .select("id, complaint_number, description, status, severity, created_at")
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [] as any[], error: null }),
      applicationId
        ? admin
            .from("refund_requests")
            .select("id, refund_amount, status, created_at, application_id")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [] as any[], error: null }),
      applicationId
        ? admin
            .from("payments")
            .select("id, amount, status, gateway_name, payment_date, created_at")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: [] as any[], error: null }),
      applicationId
        ? admin
            .from("invoices")
            .select("id, invoice_number, total_amount, delivery_status, created_at")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [] as any[], error: null }),
      Promise.resolve(null),
    ]);

    // Resolve profile names for authors/assignees.
    const ids = new Set<string>();
    if (t.assigned_to) ids.add(t.assigned_to);
    if (t.resolved_by) ids.add(t.resolved_by);
    if (t.applications?.assigned_to) ids.add(t.applications.assigned_to);
    (repliesRes.data ?? []).forEach((r: any) => r.created_by && ids.add(r.created_by));
    (eventsRes.data ?? []).forEach((r: any) => r.created_by && ids.add(r.created_by));
    (docsRes.data ?? []).forEach((r: any) => r.verified_by && ids.add(r.verified_by));

    const nameMap = new Map<string, string>();
    if (ids.size) {
      const { data: profs } = await admin
        .from("profiles")
        .select("id, full_name, display_name, email")
        .in("id", Array.from(ids));
      (profs ?? []).forEach((p: any) =>
        nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff")
      );
    }

    const replies = (repliesRes.data ?? []).map((r: any) => ({
      ...r,
      author_name: r.created_by ? nameMap.get(r.created_by) ?? "Staff" : "System",
    }));

    // Merge inbound emails that landed on this order but aren't in ticket_replies yet.
    const seenMessageIds = new Set(replies.map((r) => r.email_message_id).filter(Boolean));
    const emailOnly = (emailsRes.data ?? []).filter(
      (e: any) => e.direction === "inbound" && e.message_id && !seenMessageIds.has(e.message_id)
    );

    // Compute lifetime value from payments (fallback to customers.lifetime_value if empty).
    let lifetimeValue = Number(t.customers?.lifetime_value ?? 0);
    if (!lifetimeValue && customerId) {
      const { data: pays } = await admin
        .from("payments")
        .select("amount, status")
        .eq("customer_id", customerId)
        .in("status", ["paid"]);
      lifetimeValue = (pays ?? []).reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);
    }

    const openTicketsForCustomer = (prevTicketsRes.data ?? []).filter((r: any) =>
      ["open", "in_progress", "waiting_customer"].includes(r.status)
    ).length;
    const closedTicketsForCustomer =
      (prevTicketsRes.data ?? []).length - openTicketsForCustomer;

    return {
      ticket: {
        ...t,
        assigned_name: t.assigned_to ? nameMap.get(t.assigned_to) ?? null : null,
        resolved_name: t.resolved_by ? nameMap.get(t.resolved_by) ?? null : null,
        executive_name: t.applications?.assigned_to
          ? nameMap.get(t.applications.assigned_to) ?? null
          : null,
      },
      replies,
      inboundEmails: emailOnly,
      events: (eventsRes.data ?? []).map((r: any) => ({
        ...r,
        actor_name: r.created_by ? nameMap.get(r.created_by) ?? r.staff_name ?? "System" : r.staff_name ?? "System",
      })),
      documents: (docsRes.data ?? []).map((r: any) => ({
        ...r,
        verified_name: r.verified_by ? nameMap.get(r.verified_by) ?? null : null,
      })),
      payments: paymentsRes.data ?? [],
      invoices: invoicesRes.data ?? [],
      previousTickets: prevTicketsRes.data ?? [],
      previousOrders: prevOrdersRes.data ?? [],
      complaints: complaintsRes.data ?? [],
      refunds: refundsRes.data ?? [],
      customerStats: {
        lifetimeValue,
        totalOrders: Number(t.customers?.total_applications ?? (prevOrdersRes.data ?? []).length),
        completedOrders: Number(t.customers?.completed_applications ?? 0),
        openTickets: openTicketsForCustomer + (["open", "in_progress", "waiting_customer"].includes(t.status) ? 1 : 0),
        closedTickets: closedTicketsForCustomer,
      },
    };
  });
