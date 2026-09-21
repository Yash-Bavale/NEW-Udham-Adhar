import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getUserModulePermission } from "@/lib/crm/permissions.functions";
import { rerankWithSystemOne } from "@/lib/typesafe.server";

export type SearchHit = {
  kind: "application" | "lead" | "invoice" | "certificate" | "complaint" | "ticket";
  id: string;
  name?: string;
  code?: string;
  created_at?: string;
  mobile?: string | null;
  email?: string | null;
  service?: string | null;
  stage?: string | null;
  title: string;
  subtitle?: string;
  href: string;
  relevanceScore?: number;
  details?: string;
};

export const globalSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { q: string }) => d)
  .handler(async ({ data, context }): Promise<{ hits: SearchHit[] }> => {
    const q = (data.q || "").trim();
    if (q.length < 2) return { hits: [] };
    const s = context.supabase;
    const userId = context.userId;
    const like = `%${q}%`;
    const tokens = q
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2);

    const [leadsPerm, ordersPerm, invoicesPerm, complaintsPerm, supportPerm] = await Promise.all([
      getUserModulePermission(s, userId, "leads"),
      getUserModulePermission(s, userId, "orders"),
      getUserModulePermission(s, userId, "invoices"),
      getUserModulePermission(s, userId, "complaints"),
      getUserModulePermission(s, userId, "support"),
    ]);

    // Build search filters for multi-token / natural language queries
    const leadFilter = tokens.length > 1
      ? tokens.map((tok) => `name.ilike.%${tok}%,email.ilike.%${tok}%,mobile.ilike.%${tok}%,lead_code.ilike.%${tok}%,service.ilike.%${tok}%`).join(",")
      : `name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like},service.ilike.${like}`;

    const [l, aByCode, inv, cert, comp, tickets] = await Promise.all([
      leadsPerm.canView
        ? s.from("leads")
            .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, notes, created_at")
            .or(leadFilter)
            .limit(15)
        : Promise.resolve({ data: [] }),
      ordersPerm.canView
        ? s.from("applications")
            .select("id, application_code, application_status, fulfillment_status, lead_id, created_at, services(service_name)")
            .ilike("application_code", like)
            .limit(10)
        : Promise.resolve({ data: [] }),
      invoicesPerm.canView
        ? s.from("invoices")
            .select("id, invoice_number, total_amount, status, created_at")
            .ilike("invoice_number", like)
            .limit(5)
        : Promise.resolve({ data: [] }),
      s.from("certificates")
        .select("id, certificate_number, file_name, created_at")
        .or(`certificate_number.ilike.${like},file_name.ilike.${like}`)
        .limit(5),
      complaintsPerm.canView
        ? s.from("complaints")
            .select("id, complaint_number, status, severity, category, description, created_at")
            .or(`complaint_number.ilike.${like},description.ilike.${like},notes.ilike.${like}`)
            .limit(8)
        : Promise.resolve({ data: [] }),
      supportPerm.canView
        ? s.from("support_tickets")
            .select("id, ticket_number, subject, status, priority, ticket_email, description, created_at")
            .or(`ticket_number.ilike.${like},subject.ilike.${like},ticket_email.ilike.${like},description.ilike.${like}`)
            .limit(8)
        : Promise.resolve({ data: [] }),
    ]);

    // Pull applications linked to matching leads so searches on customer details surface orders
    const leadIds = (l.data || []).map((r: any) => r.id).filter(Boolean);
    let linkedApps: any[] = [];
    if (ordersPerm.canView && leadIds.length) {
      const { data: linked } = await s
        .from("applications")
        .select("id, application_code, application_status, fulfillment_status, lead_id, created_at, services(service_name)")
        .in("lead_id", leadIds)
        .order("created_at", { ascending: false })
        .limit(15);
      linkedApps = linked ?? [];
    }

    const allLeadIds = Array.from(
      new Set([
        ...leadIds,
        ...(aByCode.data || []).map((r: any) => r.lead_id).filter(Boolean),
        ...(linkedApps || []).map((r: any) => r.lead_id).filter(Boolean),
      ]),
    );

    // Fetch full details of all relevant leads
    let fullLeads: any[] = l.data || [];
    const missingLeadIds = allLeadIds.filter((id) => !fullLeads.some((fl) => fl.id === id));
    if (missingLeadIds.length) {
      const { data: mLeads } = await s
        .from("leads")
        .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, notes, created_at")
        .in("id", missingLeadIds);
      if (mLeads) fullLeads = [...fullLeads, ...mLeads];
    }

    const leadMap = new Map<string, any>(fullLeads.map((r: any) => [r.id, r]));

    const candidateHits: SearchHit[] = [];

    // 1. ORDERS / APPLICATIONS
    const seenApp = new Set<string>();
    const allApps = [...(aByCode.data || []), ...linkedApps].filter((r: any) => {
      if (seenApp.has(r.id)) return false;
      seenApp.add(r.id);
      return true;
    });

    allApps.forEach((r: any) => {
      const lead = r.lead_id ? leadMap.get(r.lead_id) : null;
      const serviceName = (r.services as any)?.service_name || lead?.service || null;
      candidateHits.push({
        kind: "application",
        id: r.id,
        name: lead?.name || "Order",
        code: r.application_code,
        created_at: r.created_at,
        mobile: lead?.mobile || null,
        email: lead?.email || null,
        service: serviceName,
        stage: r.application_status || r.fulfillment_status,
        title: r.application_code,
        subtitle: [r.application_status || r.fulfillment_status, serviceName, lead?.name].filter(Boolean).join(" · "),
        details: `Order Code: ${r.application_code}, Service: ${serviceName ?? "General"}, Status: ${r.application_status ?? ""}, Customer: ${lead?.name ?? ""}, Mobile: ${lead?.mobile ?? ""}`,
        href: `/admin/orders/${r.id}`,
      });
    });

    // 2. LEADS
    (l.data || []).forEach((r: any) =>
      candidateHits.push({
        kind: "lead",
        id: r.id,
        name: r.name || "Lead",
        code: r.lead_code,
        created_at: r.created_at,
        mobile: r.mobile || null,
        email: r.email || null,
        service: r.service || null,
        stage: r.lead_status_v2 || r.status,
        title: r.name || r.lead_code,
        subtitle: [r.lead_code, r.service, r.lead_status_v2 || r.status, r.email, r.mobile].filter(Boolean).join(" · "),
        details: `Lead Name: ${r.name ?? ""}, Code: ${r.lead_code ?? ""}, Service: ${r.service ?? ""}, Status: ${r.lead_status_v2 ?? r.status ?? ""}, Notes: ${r.notes ?? ""}`,
        href: `/admin/leads/${r.id}`,
      }),
    );

    // 3. SUPPORT TICKETS
    (tickets.data || []).forEach((r: any) =>
      candidateHits.push({
        kind: "ticket",
        id: r.id,
        title: r.ticket_number || r.subject || "Support Ticket",
        subtitle: [r.status, r.priority ? `Priority: ${r.priority}` : null, r.ticket_email].filter(Boolean).join(" · "),
        stage: r.status,
        details: `Ticket Number: ${r.ticket_number}, Subject: ${r.subject}, Priority: ${r.priority}, Status: ${r.status}, Email: ${r.ticket_email}, Description: ${r.description ?? ""}`,
        href: `/admin/emails`,
      }),
    );

    // 4. COMPLAINTS
    (comp.data || []).forEach((r: any) =>
      candidateHits.push({
        kind: "complaint",
        id: r.id,
        title: r.complaint_number || r.id,
        subtitle: [r.status, r.severity ? `Severity: ${r.severity}` : null, r.category].filter(Boolean).join(" · "),
        stage: r.status,
        details: `Complaint Number: ${r.complaint_number}, Category: ${r.category ?? ""}, Severity: ${r.severity ?? ""}, Status: ${r.status}, Description: ${r.description ?? ""}`,
        href: `/admin/complaints/${r.id}`,
      }),
    );

    // 5. INVOICES
    (inv.data || []).forEach((r: any) =>
      candidateHits.push({
        kind: "invoice",
        id: r.id,
        title: r.invoice_number,
        subtitle: `₹${r.total_amount}${r.status ? ` · ${r.status}` : ""}`,
        details: `Invoice Number: ${r.invoice_number}, Amount: ₹${r.total_amount}, Status: ${r.status ?? ""}`,
        href: `/admin/finance/gst`,
      }),
    );

    // 6. CERTIFICATES
    (cert.data || []).forEach((r: any) =>
      candidateHits.push({
        kind: "certificate",
        id: r.id,
        title: r.certificate_number || r.file_name,
        subtitle: r.certificate_number ? `Certificate: ${r.certificate_number}` : "Document",
        details: `Certificate Number: ${r.certificate_number ?? ""}, File: ${r.file_name ?? ""}`,
        href: `/admin/certificates`,
      }),
    );

    if (candidateHits.length === 0) {
      return { hits: [] };
    }

    // Apply TypeSafe System One Reranking for intelligent semantic relevance
    const reranked = await rerankWithSystemOne(q, candidateHits, {
      timeoutMs: 2500,
      maxCandidates: 25,
    });

    // Exact identifier match boost (e.g. exact application code, ticket number, invoice number)
    const normalizedQ = q.toLowerCase();
    const finalHits = reranked.map((h) => {
      let score = h.relevanceScore ?? 0.5;
      const titleLower = (h.title || "").toLowerCase();
      const codeLower = (h.code || "").toLowerCase();
      if (titleLower === normalizedQ || codeLower === normalizedQ) {
        score += 1.0;
      } else if (titleLower.includes(normalizedQ) || codeLower.includes(normalizedQ)) {
        score += 0.3;
      }
      return { ...h, finalScore: score };
    });

    finalHits.sort((a, b) => b.finalScore - a.finalScore);

    return {
      hits: finalHits.map(({ details, finalScore, ...rest }) => rest),
    };
  });
