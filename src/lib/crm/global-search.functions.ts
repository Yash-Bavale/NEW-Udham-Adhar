import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getUserModulePermission } from "@/lib/crm/permissions.functions";

export type SearchHit = {
  kind: "application" | "lead" | "invoice" | "certificate" | "complaint";
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
    const hits: SearchHit[] = [];

    const [leadsPerm, ordersPerm, invoicesPerm, complaintsPerm] = await Promise.all([
      getUserModulePermission(s, userId, "leads"),
      getUserModulePermission(s, userId, "orders"),
      getUserModulePermission(s, userId, "invoices"),
      getUserModulePermission(s, userId, "complaints"),
    ]);

    const [l, aByCode, inv, cert, comp] = await Promise.all([
      leadsPerm.canView
        ? s.from("leads")
            .select("id, lead_code, name, email, mobile, service, created_at")
            .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like}`)
            .limit(10)
        : Promise.resolve({ data: [] }),
      ordersPerm.canView
        ? s.from("applications")
            .select("id, application_code, application_status, lead_id, created_at, services(service_name)")
            .ilike("application_code", like)
            .limit(6)
        : Promise.resolve({ data: [] }),
      invoicesPerm.canView
        ? s.from("invoices").select("id, invoice_number, total_amount").ilike("invoice_number", like).limit(5)
        : Promise.resolve({ data: [] }),
      s.from("certificates").select("id, certificate_number, file_name").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(5),
      complaintsPerm.canView
        ? s.from("complaints").select("id, complaint_number, status").ilike("complaint_number", like).limit(5)
        : Promise.resolve({ data: [] }),
    ]);

    // Pull applications linked to matching leads so email/mobile searches surface orders.
    const leadIds = (l.data || []).map((r: any) => r.id).filter(Boolean);
    let linkedApps: any[] = [];
    if (ordersPerm.canView && leadIds.length) {
      const { data: linked } = await s
        .from("applications")
        .select("id, application_code, application_status, lead_id, created_at, services(service_name)")
        .in("lead_id", leadIds)
        .order("created_at", { ascending: false })
        .limit(10);
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
        .select("id, lead_code, name, email, mobile, service, created_at")
        .in("id", missingLeadIds);
      if (mLeads) fullLeads = [...fullLeads, ...mLeads];
    }

    const leadMap = new Map<string, any>(fullLeads.map((r: any) => [r.id, r]));

    const seenApp = new Set<string>();
    const allApps = [...(aByCode.data || []), ...linkedApps].filter((r: any) => {
      if (seenApp.has(r.id)) return false;
      seenApp.add(r.id);
      return true;
    });

    // 1. SHOW ORDERS (APPLICATIONS) FIRST
    allApps.forEach((r: any) => {
      const lead = r.lead_id ? leadMap.get(r.lead_id) : null;
      const serviceName = (r.services as any)?.service_name || lead?.service || null;
      hits.push({
        kind: "application",
        id: r.id,
        name: lead?.name || "Order",
        code: r.application_code,
        created_at: r.created_at,
        mobile: lead?.mobile || null,
        email: lead?.email || null,
        service: serviceName,
        stage: r.application_status,
        title: r.application_code,
        subtitle: [r.application_status, lead?.name].filter(Boolean).join(" · "),
        href: `/admin/orders/${r.id}`,
      });
    });

    // 2. SHOW LEADS SECOND
    (l.data || []).forEach((r: any) =>
      hits.push({
        kind: "lead",
        id: r.id,
        name: r.name || "Lead",
        code: r.lead_code,
        created_at: r.created_at,
        mobile: r.mobile || null,
        email: r.email || null,
        service: r.service || null,
        title: r.name || r.lead_code,
        subtitle: [r.lead_code, r.service, r.email, r.mobile].filter(Boolean).join(" · "),
        href: `/admin/leads/${r.id}`,
      }),
    );

    // 3. OTHER RESULTS (INVOICES, CERTIFICATES, COMPLAINTS)
    (inv.data || []).forEach((r: any) =>
      hits.push({
        kind: "invoice",
        id: r.id,
        title: r.invoice_number,
        subtitle: `₹${r.total_amount}`,
        href: `/admin/finance/gst`,
      }),
    );
    (cert.data || []).forEach((r: any) =>
      hits.push({
        kind: "certificate",
        id: r.id,
        title: r.certificate_number || r.file_name,
        href: `/admin/certificates`,
      }),
    );
    (comp.data || []).forEach((r: any) =>
      hits.push({
        kind: "complaint",
        id: r.id,
        title: r.complaint_number || r.id,
        subtitle: r.status,
        href: `/admin/complaints/${r.id}`,
      }),
    );

    return { hits };
  });
