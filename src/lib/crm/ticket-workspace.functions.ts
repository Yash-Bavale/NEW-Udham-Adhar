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

    // 1. Fetch primary ticket record
    const { data: ticket, error: ticketErr } = await admin
      .from("support_tickets")
      .select(
        "id, ticket_number, subject, description, status, priority, assigned_to, resolved_at, resolved_by, closed_at, first_response_at, last_customer_message_at, last_staff_message_at, ticket_email, source, created_at, updated_at, customer_id, application_id, service_id, parent_ticket_id"
      )
      .eq("id", data.ticketId)
      .maybeSingle();

    if (ticketErr) {
      console.error("[getTicketWorkspace] fetch ticket error:", ticketErr);
      throw new Error(ticketErr.message);
    }
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const t = ticket as any;
    let customerId = t.customer_id as string | null;
    let applicationId = t.application_id as string | null;

    // 2. Order Resolution & Self-Healing (If unlinked, extract AP code from subject/body/sender)
    if (!applicationId) {
      try {
        const { extractOrderCodes } = await import("@/lib/mail/email-normalizer");
        const { applicationCode, leadCode } = extractOrderCodes(t.subject, t.description);
        if (applicationCode) {
          const { data: foundApp } = await admin
            .from("applications")
            .select("id, application_code, order_status, fulfillment_status, assigned_to, created_at, service_id, customer_id, lead_id, is_hot")
            .eq("application_code", applicationCode)
            .maybeSingle();
          if (foundApp) {
            applicationId = (foundApp as any).id;
            if (!customerId && (foundApp as any).customer_id) {
              customerId = (foundApp as any).customer_id;
            }
            // Auto-heal support_tickets in database so subsequent loads are instant
            await admin
              .from("support_tickets")
              .update({
                application_id: applicationId,
                customer_id: customerId || (foundApp as any).customer_id || null,
                is_unlinked: false,
                order_link_status: "linked",
              } as never)
              .eq("id", data.ticketId);
          }
        } else if (leadCode) {
          const { data: foundLead } = await admin
            .from("leads")
            .select("id, customer_id")
            .eq("lead_code", leadCode)
            .maybeSingle();
          if (foundLead) {
            const { data: foundApp } = await admin
              .from("applications")
              .select("id, application_code, order_status, fulfillment_status, assigned_to, created_at, service_id, customer_id, lead_id, is_hot")
              .eq("lead_id", (foundLead as any).id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            if (foundApp) {
              applicationId = (foundApp as any).id;
              if (!customerId) customerId = (foundApp as any).customer_id || (foundLead as any).customer_id;
              await admin
                .from("support_tickets")
                .update({
                  application_id: applicationId,
                  customer_id: customerId,
                  is_unlinked: false,
                  order_link_status: "linked",
                } as never)
                .eq("id", data.ticketId);
            }
          }
        } else if (t.ticket_email) {
          const { data: matchedLead } = await admin
            .from("leads")
            .select("id, customer_id")
            .eq("email", t.ticket_email.trim().toLowerCase())
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (matchedLead) {
            const { data: foundApp } = await admin
              .from("applications")
              .select("id, application_code, order_status, fulfillment_status, assigned_to, created_at, service_id, customer_id, lead_id, is_hot")
              .eq("lead_id", (matchedLead as any).id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            if (foundApp) {
              applicationId = (foundApp as any).id;
              if (!customerId) customerId = (foundApp as any).customer_id || (matchedLead as any).customer_id;
              await admin
                .from("support_tickets")
                .update({
                  application_id: applicationId,
                  customer_id: customerId,
                  is_unlinked: false,
                  order_link_status: "linked",
                } as never)
                .eq("id", data.ticketId);
            }
          }
        }
      } catch (e) {
        console.warn("[getTicketWorkspace] auto-heal order linking warning:", e);
      }
    }

    // 3. Fetch linked application and associated lead
    let applicationData: any = null;
    let leadData: any = null;
    if (applicationId) {
      try {
        const { data: app } = await admin
          .from("applications")
          .select("id, application_code, order_status, fulfillment_status, assigned_to, created_at, service_id, lead_id, customer_id, is_hot")
          .eq("id", applicationId)
          .maybeSingle();
        applicationData = app;

        if (app?.lead_id) {
          const { data: lead } = await admin
            .from("leads")
            .select("id, name, email, mobile, service, total_amount, lead_code")
            .eq("id", app.lead_id)
            .maybeSingle();
          leadData = lead;
        }
        if (!customerId && app?.customer_id) {
          customerId = app.customer_id;
        }
      } catch (e) {
        console.warn("[getTicketWorkspace] application fetch warning:", e);
      }
    }

    // 4. Fetch customer details
    let customerData: any = null;
    const effectiveCustomerId = customerId || applicationData?.customer_id;
    if (effectiveCustomerId) {
      try {
        const { data: cust } = await admin
          .from("customers")
          .select("id, name, primary_email, primary_mobile, state, language, created_at, lifetime_value, total_applications, completed_applications")
          .eq("id", effectiveCustomerId)
          .maybeSingle();
        customerData = cust;
      } catch (e) {
        console.warn("[getTicketWorkspace] customer fetch warning:", e);
      }
    }

    // Customer name resolution: if customer record has placeholder/test name (like 'Tesr'/'Test') or is missing,
    // sync with authoritative applicant name from leadData
    if (leadData) {
      const isPlaceholderName =
        !customerData?.name ||
        /^(tesr|test|customer|demo|null|undefined)$/i.test(customerData.name.trim());
      if (isPlaceholderName && leadData.name) {
        if (customerData) {
          customerData.name = leadData.name;
          if (customerData.id) {
            admin.from("customers").update({ name: leadData.name } as never).eq("id", customerData.id).then(() => {}).catch(() => {});
          }
        } else {
          customerData = {
            id: effectiveCustomerId || null,
            name: leadData.name,
            primary_email: leadData.email || t.ticket_email,
            primary_mobile: leadData.mobile,
            state: null,
            language: null,
            created_at: null,
            lifetime_value: leadData.total_amount,
            total_applications: 1,
            completed_applications: 0,
          };
        }
      }
    }

    // 5. Fetch service details
    const effectiveServiceId = t.service_id || applicationData?.service_id || null;
    let serviceData: any = null;
    if (effectiveServiceId) {
      try {
        const { data: svc } = await admin
          .from("services")
          .select("id, service_name")
          .eq("id", effectiveServiceId)
          .maybeSingle();
        serviceData = svc;
      } catch (e) {
        console.warn("[getTicketWorkspace] service fetch warning:", e);
      }
    }

    // 5. Fire auxiliary queries in parallel with safe error guards
    const [
      repliesList,
      eventsList,
      docsList,
      prevTicketsList,
      prevOrdersList,
      complaintsList,
      refundsList,
      paymentsList,
      invoicesList,
      activeScheduler,
      parentTicket,
      childTickets,
    ] = await Promise.all([
      admin
        .from("ticket_replies")
        .select("id, reply_text, is_internal, created_by, created_at, direction, emailed_at, email_message_id, email_send_log_id")
        .eq("ticket_id", data.ticketId)
        .order("created_at", { ascending: true })
        .then((r) => r.data ?? [], () => []),

      applicationId
        ? admin
            .from("application_events")
            .select("id, event_type, old_value, new_value, note, staff_name, staff_role, created_at, created_by")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(60)
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      applicationId
        ? admin
            .from("documents")
            .select("id, doc_type, file_name, file_path, mime_type, size_bytes, status, uploaded_at, verified_at, verified_by, remarks")
            .eq("application_id", applicationId)
            .order("uploaded_at", { ascending: false })
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      customerId
        ? admin
            .from("support_tickets")
            .select("id, ticket_number, subject, status, priority, created_at")
            .eq("customer_id", customerId)
            .neq("id", data.ticketId)
            .order("created_at", { ascending: false })
            .limit(20)
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      customerId
        ? admin
            .from("applications")
            .select("id, application_code, order_status, created_at, service_id")
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false })
            .limit(20)
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      customerId
        ? admin
            .from("complaints")
            .select("id, complaint_number, description, status, severity, created_at")
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false })
            .limit(10)
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      applicationId
        ? admin
            .from("refund_requests")
            .select("id, refund_amount, status, created_at, application_id")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(10)
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      applicationId
        ? admin
            .from("payments")
            .select("id, amount, status, gateway_name, payment_date, created_at")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(10)
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      applicationId
        ? admin
            .from("invoices")
            .select("id, invoice_number, total_amount, delivery_status, created_at")
            .eq("application_id", applicationId)
            .order("created_at", { ascending: false })
            .limit(5)
            .then((r) => r.data ?? [], () => [])
        : Promise.resolve([]),

      applicationId
        ? admin
            .from("order_schedulers")
            .select("id, status, fires_at, remarks")
            .eq("application_id", applicationId)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()
            .then((r) => r.data, () => null)
        : Promise.resolve(null),

      t.parent_ticket_id
        ? admin
            .from("support_tickets")
            .select("id, ticket_number, subject, status, created_at")
            .eq("id", t.parent_ticket_id)
            .maybeSingle()
            .then((r) => r.data, () => null)
        : Promise.resolve(null),

      admin
        .from("support_tickets")
        .select("id, ticket_number, subject, status, created_at")
        .eq("parent_ticket_id" as any, data.ticketId)
        .order("created_at", { ascending: false })
        .then((r) => r.data ?? [], () => []),
    ]);

    const parentTicketData = parentTicket;
    const childTicketsData = childTickets;

    // 6. Resolve profile names for authors/assignees
    const ids = new Set<string>();
    if (t.assigned_to) ids.add(t.assigned_to);
    if (t.resolved_by) ids.add(t.resolved_by);
    if (applicationData?.assigned_to) ids.add(applicationData.assigned_to);
    repliesList.forEach((r: any) => r.created_by && ids.add(r.created_by));
    eventsList.forEach((r: any) => r.created_by && ids.add(r.created_by));
    docsList.forEach((r: any) => r.verified_by && ids.add(r.verified_by));

    const nameMap = new Map<string, string>();
    if (ids.size) {
      try {
        const { data: profs } = await admin
          .from("profiles")
          .select("id, full_name, display_name, email")
          .in("id", Array.from(ids));
        (profs ?? []).forEach((p: any) =>
          nameMap.set(p.id, p.full_name ?? p.display_name ?? p.email ?? "Staff")
        );
      } catch (e) {
        console.warn("[getTicketWorkspace] profiles lookup warning:", e);
      }
    }

    // 7. Hydrate email details for replies linked to email_logs
    const sendLogIds = Array.from(new Set(repliesList.map((r: any) => r.email_send_log_id).filter(Boolean)));
    const messageIds = Array.from(new Set(repliesList.map((r: any) => r.email_message_id).filter(Boolean)));

    const emailById = new Map<string, any>();
    const emailByMsgId = new Map<string, any>();
    let allMatchedEmails: any[] = [];

    const mailOrs: string[] = [];
    if (sendLogIds.length) mailOrs.push(`id.in.(${sendLogIds.join(",")})`);
    if (messageIds.length) mailOrs.push(`message_id.in.(${messageIds.join(",")})`);
    if (applicationId) mailOrs.push(`application_id.eq.${applicationId}`);
    else if (customerId) mailOrs.push(`customer_id.eq.${customerId}`);

    if (mailOrs.length) {
      try {
        const { data: matchedEmails } = await admin
          .from("email_logs")
          .select("id, subject, from_email, to_email, direction, body_html, body_text, created_at, sent_at, status, message_id, template_code, application_id")
          .or(mailOrs.join(","));

        allMatchedEmails = matchedEmails ?? [];
        allMatchedEmails.forEach((e: any) => {
          if (e.id) emailById.set(e.id, e);
          if (e.message_id) emailByMsgId.set(e.message_id, e);
        });
      } catch (e) {
        console.warn("[getTicketWorkspace] email_logs query warning:", e);
      }
    }

    const replies = repliesList.map((r: any) => {
      let linkedEmail = (r.email_send_log_id ? emailById.get(r.email_send_log_id) : null) ??
                        (r.email_message_id ? emailByMsgId.get(r.email_message_id) : null) ??
                        null;

      // Fallback matching by direction and timestamp proximity (within 5 minutes)
      if (!linkedEmail && allMatchedEmails.length > 0) {
        const replyTime = new Date(r.created_at).getTime();
        linkedEmail = allMatchedEmails.find((e: any) => {
          const isDirMatch = r.direction === "inbound"
            ? (e.direction === "incoming" || e.direction === "inbound")
            : (e.direction === "outgoing" || e.direction === "outbound");
          if (!isDirMatch) return false;
          const eTime = new Date(e.sent_at || e.created_at).getTime();
          return Math.abs(eTime - replyTime) < 300_000;
        }) ?? null;
      }

      return {
        ...r,
        author_name: r.created_by
          ? nameMap.get(r.created_by) ?? "Staff"
          : (r.direction === "inbound" ? (customerData?.name ?? "Customer") : "System"),
        subject: linkedEmail?.subject ?? null,
        body_html: linkedEmail?.body_html ?? null,
        from_email: linkedEmail?.from_email ?? null,
        template_code: linkedEmail?.template_code ?? null,
        email_status: linkedEmail?.status ?? (r.emailed_at ? "sent" : null),
      };
    });

    // 8. Compute customer stats & lifetime value
    let lifetimeValue = Number(customerData?.lifetime_value ?? 0);
    if (!lifetimeValue && customerId) {
      try {
        const { data: pays } = await admin
          .from("payments")
          .select("amount, status")
          .eq("customer_id", customerId)
          .in("status", ["paid"]);
        lifetimeValue = (pays ?? []).reduce((sum: number, p: any) => sum + Number(p.amount ?? 0), 0);
      } catch (e) {
        console.warn("[getTicketWorkspace] lifetimeValue calc warning:", e);
      }
    }

    const openTicketsForCustomer = prevTicketsList.filter((r: any) =>
      ["open", "in_progress", "waiting_customer"].includes(r.status)
    ).length;
    const closedTicketsForCustomer = prevTicketsList.length - openTicketsForCustomer;

    // 9. Determine if order is hot dynamically
    const firesAt = activeScheduler?.fires_at ? new Date(activeScheduler.fires_at).getTime() : 0;
    const isDue = firesAt > 0 && firesAt <= Date.now();
    const isReopened =
      applicationData?.fulfillment_status === "order_reopened" ||
      applicationData?.order_status === "REOPENED";
    const isHotOrder = Boolean(applicationData) && (isDue || isReopened);

    const appPayload = applicationData
      ? {
          ...applicationData,
          is_hot: isHotOrder,
          services: serviceData ? { service_name: serviceData.service_name } : null,
        }
      : null;

    return {
      ticket: {
        ...t,
        application_id: applicationId,
        applications: appPayload,
        customers: customerData,
        services: serviceData ? { service_name: serviceData.service_name } : null,
        assigned_name: t.assigned_to ? nameMap.get(t.assigned_to) ?? null : null,
        resolved_name: t.resolved_by ? nameMap.get(t.resolved_by) ?? null : null,
        executive_name: applicationData?.assigned_to
          ? nameMap.get(applicationData.assigned_to) ?? null
          : null,
      },
      replies,
      events: eventsList.map((r: any) => ({
        ...r,
        actor_name: r.created_by ? nameMap.get(r.created_by) ?? r.staff_name ?? "System" : r.staff_name ?? "System",
      })),
      documents: docsList.map((r: any) => ({
        ...r,
        verified_name: r.verified_by ? nameMap.get(r.verified_by) ?? null : null,
      })),
      payments: paymentsList,
      invoices: invoicesList,
      previousTickets: prevTicketsList,
      previousOrders: prevOrdersList,
      complaints: complaintsList,
      refunds: refundsList,
      emails: allMatchedEmails,
      parentTicket: parentTicketData,
      childTickets: childTicketsData,
      customerStats: {
        lifetimeValue,
        totalOrders: Number(customerData?.total_applications ?? prevOrdersList.length),
        completedOrders: Number(customerData?.completed_applications ?? 0),
        openTickets: openTicketsForCustomer + (["open", "in_progress", "waiting_customer"].includes(t.status) ? 1 : 0),
        closedTickets: closedTicketsForCustomer,
      },
    };
  });
