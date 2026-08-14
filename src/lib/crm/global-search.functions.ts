import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeOrderStage, STAGE_META, STAGE_BADGE_CLASS } from "./computeOrderStage";

export type SearchHit = {
  kind: "lead" | "application" | "invoice" | "certificate" | "complaint";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  stage?: string;
  stageLabel?: string;
  stageBadgeClass?: string;
  customerName?: string;
  mobile?: string;
  email?: string;
  serviceName?: string;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const globalSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { q: string }) => d)
  .handler(async ({ data, context }): Promise<{ hits: SearchHit[] }> => {
    const q = (data.q || "").trim();
    if (q.length < 2) return { hits: [] };

    const s = context.supabase;
    const isUuid = UUID_REGEX.test(q);
    const like = `%${q}%`;
    const hits: SearchHit[] = [];

    // Parallel queries across customers, leads, applications, invoices, certificates, complaints
    const [c, l, aByCode, inv, cert, comp] = await Promise.all([
      isUuid
        ? s.from("customers")
            .select("id, customer_code, name, primary_email, primary_mobile, udyam_number, gst_number, pan_number")
            .eq("id", q)
            .limit(6)
        : s.from("customers")
            .select("id, customer_code, name, primary_email, primary_mobile, udyam_number, gst_number, pan_number")
            .or(`name.ilike.${like},primary_email.ilike.${like},primary_mobile.ilike.${like},customer_code.ilike.${like},udyam_number.ilike.${like},gst_number.ilike.${like},pan_number.ilike.${like}`)
            .limit(10),

      isUuid
        ? s.from("leads")
            .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, payment_successful_at")
            .eq("id", q)
            .limit(10)
        : s.from("leads")
            .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, payment_successful_at")
            .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like}`)
            .limit(12),

      isUuid
        ? s.from("applications")
            .select("id, application_code, application_status, fulfillment_status, workflow_status, form_submitted_at, certificate_uploaded_at, lead_id, customer_id")
            .or(`id.eq.${q},lead_id.eq.${q},customer_id.eq.${q}`)
            .limit(10)
        : s.from("applications")
            .select("id, application_code, application_status, fulfillment_status, workflow_status, form_submitted_at, certificate_uploaded_at, lead_id, customer_id")
            .ilike("application_code", like)
            .limit(10),

      s.from("invoices").select("id, invoice_number, total_amount").ilike("invoice_number", like).limit(5),
      s.from("certificates").select("id, certificate_number, file_name").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(5),
      s.from("complaints").select("id, complaint_number, status").ilike("complaint_number", like).limit(5),
    ]);

    // Pull applications linked to matching leads OR matching customers
    const leadIds = (l.data || []).map((r: any) => r.id).filter(Boolean);
    const customerIds = (c.data || []).map((r: any) => r.id).filter(Boolean);

    let linkedApps: any[] = [];
    if (leadIds.length > 0 || customerIds.length > 0) {
      const orClauses: string[] = [];
      if (leadIds.length > 0) {
        orClauses.push(`lead_id.in.(${leadIds.map((id) => `"${id}"`).join(",")})`);
      }
      if (customerIds.length > 0) {
        orClauses.push(`customer_id.in.(${customerIds.map((id) => `"${id}"`).join(",")})`);
      }
      const { data: linked } = await s
        .from("applications")
        .select("id, application_code, application_status, fulfillment_status, workflow_status, form_submitted_at, certificate_uploaded_at, lead_id, customer_id")
        .or(orClauses.join(","))
        .order("created_at", { ascending: false })
        .limit(15);
      linkedApps = linked ?? [];
    }

    const seenApp = new Set<string>();
    const allApps = [...(aByCode.data || []), ...linkedApps].filter((r: any) => {
      if (!r?.id || seenApp.has(r.id)) return false;
      seenApp.add(r.id);
      return true;
    });

    // Gather missing leads for allApps
    const allAppLeadIds = Array.from(new Set(allApps.map((a: any) => a.lead_id).filter(Boolean))) as string[];
    const missingLeadIds = allAppLeadIds.filter((id) => !(l.data || []).some((r: any) => r.id === id));
    let extraLeads: any[] = [];
    if (missingLeadIds.length > 0) {
      const { data: ext } = await s
        .from("leads")
        .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, payment_successful_at")
        .in("id", missingLeadIds);
      extraLeads = ext ?? [];
    }

    // Gather missing customers for allApps
    const allAppCustIds = Array.from(new Set(allApps.map((a: any) => a.customer_id).filter(Boolean))) as string[];
    const missingCustIds = allAppCustIds.filter((id) => !(c.data || []).some((r: any) => r.id === id));
    let extraCustomers: any[] = [];
    if (missingCustIds.length > 0) {
      const { data: extC } = await s
        .from("customers")
        .select("id, name, primary_email, primary_mobile")
        .in("id", missingCustIds);
      extraCustomers = extC ?? [];
    }

    const leadMap = new Map<string, any>([...(l.data || []), ...extraLeads].map((r: any) => [r.id, r]));
    const customerMap = new Map<string, any>([...(c.data || []), ...extraCustomers].map((r: any) => [r.id, r]));

    // 1. Applications (Orders) - Displayed with Customer Name FIRST, stage badge, mobile, email, service
    allApps.forEach((app: any) => {
      const lead = app.lead_id ? leadMap.get(app.lead_id) : null;
      const cust = app.customer_id ? customerMap.get(app.customer_id) : null;
      const stage = computeOrderStage(lead, app);
      const stageMeta = STAGE_META[stage] ?? { label: stage };
      const stageBadgeClass = STAGE_BADGE_CLASS[stage] ?? "bg-slate-100 text-slate-700 border-slate-200";

      const customerName = lead?.name || cust?.name || app.application_code || "Customer";
      const mobile = lead?.mobile || cust?.primary_mobile || undefined;
      const email = lead?.email || cust?.primary_email || undefined;
      const serviceName = lead?.service || undefined;

      hits.push({
        kind: "application",
        id: app.id,
        title: app.application_code || app.id,
        href: `/admin/orders/${app.id}`,
        stage,
        stageLabel: stageMeta.label,
        stageBadgeClass,
        customerName,
        mobile,
        email,
        serviceName,
      });
    });

    // 2. Leads (Only leads that do not already have an Order shown above)
    const appLeadIds = new Set(allApps.map((a: any) => a.lead_id).filter(Boolean));
    (l.data || []).forEach((r: any) => {
      if (appLeadIds.has(r.id)) return; // Skip lead if order is already shown
      hits.push({
        kind: "lead",
        id: r.id,
        title: r.name || r.lead_code,
        subtitle: [r.lead_code, r.service, r.email, r.mobile].filter(Boolean).join(" · "),
        href: `/admin/leads/${r.id}`,
        customerName: r.name || r.lead_code,
        mobile: r.mobile || undefined,
        email: r.email || undefined,
        serviceName: r.service || undefined,
      });
    });

    // 3. System Records (Invoices, Certificates, Complaints)
    (inv.data || []).forEach((r: any) =>
      hits.push({
        kind: "invoice",
        id: r.id,
        title: r.invoice_number,
        subtitle: `₹${r.total_amount}`,
        href: `/admin/finance/gst`,
      })
    );
    (cert.data || []).forEach((r: any) =>
      hits.push({
        kind: "certificate",
        id: r.id,
        title: r.certificate_number || r.file_name,
        href: `/admin/certificates`,
      })
    );
    (comp.data || []).forEach((r: any) =>
      hits.push({
        kind: "complaint",
        id: r.id,
        title: r.complaint_number || r.id,
        subtitle: r.status,
        href: `/admin/complaints/${r.id}`,
      })
    );

    return { hits };
  });
