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

    // 1. Fetch matching leads, applications by code, invoices, certificates, and complaints
    const [l, aByCode, inv, cert, comp] = await Promise.all([
      s.from("leads")
        .select("id, lead_code, name, email, mobile, service, created_at")
        .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like}`)
        .limit(10),
      s.from("applications")
        .select("id, application_code, application_status, lead_id, created_at")
        .ilike("application_code", like)
        .limit(6),
      s.from("invoices").select("id, invoice_number, total_amount, created_at").ilike("invoice_number", like).limit(5),
      s.from("certificates").select("id, certificate_number, file_name, created_at").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(5),
      s.from("complaints").select("id, complaint_number, status, created_at").ilike("complaint_number", like).limit(5),
    ]);

    // 2. Pull applications linked to matching leads so email/mobile/name searches surface orders.
    const leadIds = (l.data || []).map((r: any) => r.id).filter(Boolean);
    let linkedApps: any[] = [];
    if (leadIds.length > 0) {
      const { data: linked } = await s
        .from("applications")
        .select("id, application_code, application_status, lead_id, created_at")
        .in("lead_id", leadIds)
        .order("created_at", { ascending: false })
        .limit(10);
      linkedApps = linked ?? [];
    }

    const leadMap = new Map<string, any>((l.data || []).map((r: any) => [r.id, r]));
    const seenApp = new Set<string>();
    const allApps = [...(aByCode.data || []), ...linkedApps].filter((r: any) => {
      if (seenApp.has(r.id)) return false;
      seenApp.add(r.id);
      return true;
    });

    // 3. Ensure lead details exist for any apps found directly by application_code
    const missingLeadIds = allApps
      .map((a: any) => a.lead_id)
      .filter((id: string) => id && !leadMap.has(id));

    if (missingLeadIds.length > 0) {
      const { data: extraLeads } = await s
        .from("leads")
        .select("id, lead_code, name, email, mobile, service, created_at")
        .in("id", Array.from(new Set(missingLeadIds)));
      (extraLeads || []).forEach((item: any) => leadMap.set(item.id, item));
    }

    // 4. SHOW ORDERS (APPLICATIONS) FIRST
    allApps.forEach((r: any) => {
      const leadInfo = r.lead_id ? leadMap.get(r.lead_id) : null;
      const custName = leadInfo?.name || "Customer";
      const appCode = r.application_code || r.id;
      const status = (r.application_status || "Active").toLowerCase().replace(/_/g, " ");

      const mobile = leadInfo?.mobile || null;
      const email = leadInfo?.email || null;
      const service = leadInfo?.service || "Service Application";
      const dateStr = formatSearchDate(r.created_at || leadInfo?.created_at);

      hits.push({
        kind: "application",
        id: r.id,
        title: `${custName} · ${appCode} (${status})`,
        subtitle: [mobile, email, service, dateStr].filter(Boolean).join(" · "),
        href: `/admin/orders/${r.id}`,
      });
    });

    // 5. SHOW LEADS SECOND
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

    // 6. OTHER RESULTS (INVOICES, CERTIFICATES, COMPLAINTS)
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
