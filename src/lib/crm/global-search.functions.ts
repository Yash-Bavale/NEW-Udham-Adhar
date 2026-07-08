import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SearchHit = {
  kind: "customer" | "lead" | "application" | "invoice" | "certificate" | "complaint";
  id: string;
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
    const like = `%${q}%`;
    const hits: SearchHit[] = [];

    const [c, l, aByCode, inv, cert, comp] = await Promise.all([
      s.from("customers")
        .select("id, customer_code, name, primary_email, primary_mobile, udyam_number, gst_number, pan_number")
        .or(`name.ilike.${like},primary_email.ilike.${like},primary_mobile.ilike.${like},customer_code.ilike.${like},udyam_number.ilike.${like},gst_number.ilike.${like},pan_number.ilike.${like}`)
        .limit(6),
      s.from("leads")
        .select("id, lead_code, name, email, mobile, service")
        .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like}`)
        .limit(10),
      s.from("applications")
        .select("id, application_code, application_status, lead_id")
        .ilike("application_code", like)
        .limit(6),
      s.from("invoices").select("id, invoice_number, total_amount").ilike("invoice_number", like).limit(5),
      s.from("certificates").select("id, certificate_number, file_name").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(5),
      s.from("complaints").select("id, complaint_number, status").ilike("complaint_number", like).limit(5),
    ]);

    // Pull applications linked to matching leads/customers so email/mobile searches surface orders.
    const leadIds = (l.data || []).map((r: any) => r.id).filter(Boolean);
    const customerIds = (c.data || []).map((r: any) => r.id).filter(Boolean);
    let linkedApps: any[] = [];
    if (leadIds.length || customerIds.length) {
      const orClauses: string[] = [];
      if (leadIds.length) orClauses.push(`lead_id.in.(${leadIds.join(",")})`);
      if (customerIds.length) orClauses.push(`customer_id.in.(${customerIds.join(",")})`);
      const { data: linked } = await s
        .from("applications")
        .select("id, application_code, application_status, lead_id")
        .or(orClauses.join(","))
        .order("created_at", { ascending: false })
        .limit(10);
      linkedApps = linked ?? [];
    }
    const leadNameById = new Map<string, string>((l.data || []).map((r: any) => [r.id, r.name || r.lead_code]));
    const seenApp = new Set<string>();
    const allApps = [...(aByCode.data || []), ...linkedApps].filter((r: any) => {
      if (seenApp.has(r.id)) return false;
      seenApp.add(r.id);
      return true;
    });

    (c.data || []).forEach((r: any) =>
      hits.push({
        kind: "customer",
        id: r.id,
        title: r.name || r.customer_code,
        subtitle: [r.customer_code, r.primary_email, r.primary_mobile, r.udyam_number].filter(Boolean).join(" · "),
        href: `/admin/customers/${r.id}`,
      })
    );
    (l.data || []).forEach((r: any) =>
      hits.push({
        kind: "lead",
        id: r.id,
        title: r.name || r.lead_code,
        subtitle: [r.lead_code, r.service, r.email, r.mobile].filter(Boolean).join(" · "),
        href: `/admin/leads/${r.id}`,
      })
    );
    allApps.forEach((r: any) =>
      hits.push({
        kind: "application",
        id: r.id,
        title: r.application_code,
        subtitle: [r.application_status, r.lead_id ? leadNameById.get(r.lead_id) : null].filter(Boolean).join(" · "),
        href: `/admin/orders/${r.id}`,
      })
    );
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
