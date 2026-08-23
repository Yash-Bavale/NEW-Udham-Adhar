import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SearchHit = {
  kind: "application" | "lead" | "invoice" | "certificate" | "complaint";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
};

function formatSearchDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso)).replace(",", "");
  } catch {
    return "";
  }
}

export const globalSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { q: string }) => d)
  .handler(async ({ data, context }): Promise<{ hits: SearchHit[] }> => {
    const q = (data.q || "").trim();
    if (q.length < 2) return { hits: [] };
    const s = context.supabase;
    const like = `%${q}%`;
    const hits: SearchHit[] = [];

    // 1. Fetch matching leads, customers, applications by code, applications by lead details, and auxiliary entities in parallel
    const [l, custs, aByCode, aByLeadJoin, inv, cert, comp] = await Promise.all([
      s.from("leads")
        .select("id, lead_code, name, email, mobile, service, created_at")
        .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like}`)
        .limit(15),
      s.from("customers")
        .select("id, name, primary_email, primary_mobile")
        .or(`name.ilike.${like},primary_email.ilike.${like},primary_mobile.ilike.${like}`)
        .limit(15),
      s.from("applications")
        .select("id, application_code, application_status, order_status, lead_id, customer_id, created_at, leads(id, name, email, mobile, service, lead_code), customers(id, name, primary_email, primary_mobile)")
        .ilike("application_code", like)
        .limit(10),
      s.from("applications")
        .select("id, application_code, application_status, order_status, lead_id, customer_id, created_at, leads!inner(id, name, email, mobile, service, lead_code), customers(id, name, primary_email, primary_mobile)")
        .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like}`, { foreignTable: "leads" })
        .limit(10),
      s.from("invoices").select("id, invoice_number, total_amount, created_at").ilike("invoice_number", like).limit(5),
      s.from("certificates").select("id, certificate_number, file_name, created_at").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(5),
      s.from("complaints").select("id, complaint_number, status, created_at").ilike("complaint_number", like).limit(5),
    ]);

    // 2. Additional ID-based applications lookup
    const leadIds = (l.data || []).map((r: any) => r.id).filter(Boolean);
    const customerIds = (custs.data || []).map((r: any) => r.id).filter(Boolean);

    const extraQueries: Promise<any>[] = [];
    if (leadIds.length > 0) {
      extraQueries.push(
        s.from("applications")
          .select("id, application_code, application_status, order_status, lead_id, customer_id, created_at, leads(id, name, email, mobile, service, lead_code), customers(id, name, primary_email, primary_mobile)")
          .in("lead_id", leadIds)
          .order("created_at", { ascending: false })
          .limit(10)
      );
    }
    if (customerIds.length > 0) {
      extraQueries.push(
        s.from("applications")
          .select("id, application_code, application_status, order_status, lead_id, customer_id, created_at, leads(id, name, email, mobile, service, lead_code), customers(id, name, primary_email, primary_mobile)")
          .in("customer_id", customerIds)
          .order("created_at", { ascending: false })
          .limit(10)
      );
    }

    const extraResults = await Promise.all(extraQueries);
    const linkedApps: any[] = [];
    extraResults.forEach((res) => {
      if (res.data) linkedApps.push(...res.data);
    });

    const leadMap = new Map<string, any>((l.data || []).map((r: any) => [r.id, r]));
    const custMap = new Map<string, any>((custs.data || []).map((r: any) => [r.id, r]));

    const seenApp = new Set<string>();
    const allApps = [...(aByCode.data || []), ...(aByLeadJoin.data || []), ...linkedApps].filter((r: any) => {
      if (seenApp.has(r.id)) return false;
      seenApp.add(r.id);
      return true;
    });

    // 1. SHOW ORDERS (APPLICATIONS) FIRST
    allApps.forEach((r: any) => {
      const leadInfo = r.leads || (r.lead_id ? leadMap.get(r.lead_id) : null);
      const custInfo = r.customers || (r.customer_id ? custMap.get(r.customer_id) : null);

      const custName = leadInfo?.name || custInfo?.name || "Customer";
      const appCode = r.application_code || r.id;
      const status = (r.order_status || r.application_status || "Active").toLowerCase().replace(/_/g, " ");

      const mobile = leadInfo?.mobile || custInfo?.primary_mobile || null;
      const email = leadInfo?.email || custInfo?.primary_email || null;
      const service = leadInfo?.service || "Service Application";
      const dateStr = formatSearchDate(r.created_at);

      hits.push({
        kind: "application",
        id: r.id,
        title: `${custName} · ${appCode} (${status})`,
        subtitle: [mobile, email, service, dateStr].filter(Boolean).join(" · "),
        href: `/admin/orders/${r.id}`,
      });
    });

    // 2. SHOW LEADS SECOND
    (l.data || []).forEach((r: any) => {
      const custName = r.name || r.lead_code;
      const leadCode = r.lead_code;
      const titleText = r.name ? `${r.name} · ${leadCode}` : leadCode;
      const mobile = r.mobile || null;
      const email = r.email || null;
      const service = r.service || null;
      const dateStr = formatSearchDate(r.created_at);

      hits.push({
        kind: "lead",
        id: r.id,
        title: titleText,
        subtitle: [mobile, email, service, dateStr].filter(Boolean).join(" · "),
        href: `/admin/leads/${r.id}`,
      });
    });

    // 3. OTHER RESULTS (INVOICES, CERTIFICATES, COMPLAINTS)
    (inv.data || []).forEach((r: any) =>
      hits.push({
        kind: "invoice",
        id: r.id,
        title: `Invoice ${r.invoice_number}`,
        subtitle: [`₹${r.total_amount}`, formatSearchDate(r.created_at)].filter(Boolean).join(" · "),
        href: `/admin/finance/gst`,
      })
    );
    (cert.data || []).forEach((r: any) =>
      hits.push({
        kind: "certificate",
        id: r.id,
        title: r.certificate_number || r.file_name,
        subtitle: formatSearchDate(r.created_at),
        href: `/admin/certificates`,
      })
    );
    (comp.data || []).forEach((r: any) =>
      hits.push({
        kind: "complaint",
        id: r.id,
        title: `Complaint ${r.complaint_number || r.id}`,
        subtitle: [r.status, formatSearchDate(r.created_at)].filter(Boolean).join(" · "),
        href: `/admin/complaints/${r.id}`,
      })
    );

    return { hits };
  });
