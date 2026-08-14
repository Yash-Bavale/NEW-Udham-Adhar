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

export const globalSearch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { q: string }) => d)
  .handler(async ({ data, context }): Promise<{ hits: SearchHit[] }> => {
    const q = (data.q || "").trim();
    if (q.length < 2) return { hits: [] };
    const s = context.supabase;
    const like = `%${q}%`;
    const hits: SearchHit[] = [];

    const [l, aByCode, inv, cert, comp] = await Promise.all([
      s.from("leads")
        .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, payment_successful_at")
        .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like}`)
        .limit(10),
      s.from("applications")
        .select("id, application_code, application_status, fulfillment_status, workflow_status, form_submitted_at, certificate_uploaded_at, lead_id")
        .ilike("application_code", like)
        .limit(8),
      s.from("invoices").select("id, invoice_number, total_amount").ilike("invoice_number", like).limit(5),
      s.from("certificates").select("id, certificate_number, file_name").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(5),
      s.from("complaints").select("id, complaint_number, status").ilike("complaint_number", like).limit(5),
    ]);

    // Pull applications linked to matching leads so email/mobile/name searches surface orders.
    const leadIds = (l.data || []).map((r: any) => r.id).filter(Boolean);
    let linkedApps: any[] = [];
    if (leadIds.length) {
      const { data: linked } = await s
        .from("applications")
        .select("id, application_code, application_status, fulfillment_status, workflow_status, form_submitted_at, certificate_uploaded_at, lead_id")
        .in("lead_id", leadIds)
        .order("created_at", { ascending: false })
        .limit(10);
      linkedApps = linked ?? [];
    }

    const seenApp = new Set<string>();
    const allApps = [...(aByCode.data || []), ...linkedApps].filter((r: any) => {
      if (seenApp.has(r.id)) return false;
      seenApp.add(r.id);
      return true;
    });

    // Gather all lead records required for allApps
    const allAppLeadIds = Array.from(new Set(allApps.map((a: any) => a.lead_id).filter(Boolean))) as string[];
    const missingLeadIds = allAppLeadIds.filter((id) => !(l.data || []).some((r: any) => r.id === id));

    let extraLeads: any[] = [];
    if (missingLeadIds.length) {
      const { data: ext } = await s
        .from("leads")
        .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, payment_successful_at")
        .in("id", missingLeadIds);
      extraLeads = ext ?? [];
    }

    const leadMap = new Map<string, any>(
      [...(l.data || []), ...extraLeads].map((r: any) => [r.id, r])
    );

    // Build application hits with computed stage, customer name, mobile & email
    allApps.forEach((app: any) => {
      const lead = app.lead_id ? leadMap.get(app.lead_id) : null;
      const stage = computeOrderStage(lead, app);
      const stageMeta = STAGE_META[stage] ?? { label: stage };
      const stageBadgeClass = STAGE_BADGE_CLASS[stage] ?? "bg-slate-100 text-slate-700 border-slate-200";

      hits.push({
        kind: "application",
        id: app.id,
        title: app.application_code || app.id,
        href: `/admin/orders/${app.id}`,
        stage,
        stageLabel: stageMeta.label,
        stageBadgeClass,
        customerName: lead?.name || "—",
        mobile: lead?.mobile || undefined,
        email: lead?.email || undefined,
        serviceName: lead?.service || undefined,
      });
    });

    // Build lead hits
    (l.data || []).forEach((r: any) =>
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
