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
    const rawQ = (data.q || "").trim();
    // Sanitize query to avoid PostgREST syntax errors with special chars
    const cleanQ = rawQ.replace(/[^a-zA-Z0-9@._\-\s]/g, "").trim();
    if (cleanQ.length < 2) return { hits: [] };

    const s = context.supabase;
    const term = cleanQ.replace(/\s+/g, "%");
    const like = `%${term}%`;
    const hits: SearchHit[] = [];

    try {
      // 1. Fetch matching leads, customers, applications, and system records in parallel
      const [lRes, cRes, aByCodeRes, invRes, certRes, compRes] = await Promise.allSettled([
        s.from("leads")
          .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, payment_successful_at")
          .or(`name.ilike.${like},email.ilike.${like},mobile.ilike.${like},lead_code.ilike.${like}`)
          .limit(10),
        s.from("customers")
          .select("id, customer_code, name, primary_email, primary_mobile")
          .or(`name.ilike.${like},primary_email.ilike.${like},primary_mobile.ilike.${like},customer_code.ilike.${like}`)
          .limit(10),
        s.from("applications")
          .select("id, application_code, application_status, fulfillment_status, workflow_status, form_submitted_at, certificate_uploaded_at, lead_id, customer_id")
          .ilike("application_code", like)
          .limit(8),
        s.from("invoices").select("id, invoice_number, total_amount").ilike("invoice_number", like).limit(5),
        s.from("certificates").select("id, certificate_number, file_name").or(`certificate_number.ilike.${like},file_name.ilike.${like}`).limit(5),
        s.from("complaints").select("id, complaint_number, status").ilike("complaint_number", like).limit(5),
      ]);

      const leads = lRes.status === "fulfilled" ? (lRes.value.data ?? []) : [];
      const customers = cRes.status === "fulfilled" ? (cRes.value.data ?? []) : [];
      const appsByCode = aByCodeRes.status === "fulfilled" ? (aByCodeRes.value.data ?? []) : [];
      const invoices = invRes.status === "fulfilled" ? (invRes.value.data ?? []) : [];
      const certificates = certRes.status === "fulfilled" ? (certRes.value.data ?? []) : [];
      const complaints = compRes.status === "fulfilled" ? (compRes.value.data ?? []) : [];

      // 2. Fetch applications linked to matching leads or customers
      const leadIds = leads.map((r: any) => r.id).filter(Boolean);
      const customerIds = customers.map((r: any) => r.id).filter(Boolean);

      let linkedApps: any[] = [];
      if (leadIds.length > 0 || customerIds.length > 0) {
        try {
          const orClauses: string[] = [];
          if (leadIds.length) orClauses.push(`lead_id.in.(${leadIds.join(",")})`);
          if (customerIds.length) orClauses.push(`customer_id.in.(${customerIds.join(",")})`);

          const { data: linked } = await s
            .from("applications")
            .select("id, application_code, application_status, fulfillment_status, workflow_status, form_submitted_at, certificate_uploaded_at, lead_id, customer_id")
            .or(orClauses.join(","))
            .order("created_at", { ascending: false })
            .limit(10);
          linkedApps = linked ?? [];
        } catch (e) {
          console.error("[globalSearch] linkedApps fetch failed:", e);
        }
      }

      // Combine and deduplicate application results
      const seenApp = new Set<string>();
      const allApps = [...appsByCode, ...linkedApps].filter((r: any) => {
        if (!r?.id || seenApp.has(r.id)) return false;
        seenApp.add(r.id);
        return true;
      });

      // 3. Resolve missing leads for applications
      const allAppLeadIds = Array.from(new Set(allApps.map((a: any) => a.lead_id).filter(Boolean))) as string[];
      const missingLeadIds = allAppLeadIds.filter((id) => !leads.some((r: any) => r.id === id));

      let extraLeads: any[] = [];
      if (missingLeadIds.length > 0) {
        try {
          const { data: ext } = await s
            .from("leads")
            .select("id, lead_code, name, email, mobile, service, status, lead_status_v2, payment_successful_at")
            .in("id", missingLeadIds);
          extraLeads = ext ?? [];
        } catch { /* ignore */ }
      }

      const leadMap = new Map<string, any>(
        [...leads, ...extraLeads].map((r: any) => [r.id, r])
      );

      const customerMap = new Map<string, any>(
        customers.map((c: any) => [c.id, c])
      );

      // Build application search hits
      allApps.forEach((app: any) => {
        const lead = app.lead_id ? leadMap.get(app.lead_id) : null;
        const cust = app.customer_id ? customerMap.get(app.customer_id) : null;
        const stage = computeOrderStage(lead, app);
        const stageMeta = STAGE_META[stage] ?? { label: stage };
        const stageBadgeClass = STAGE_BADGE_CLASS[stage] ?? "bg-slate-100 text-slate-700 border-slate-200";

        const customerName = lead?.name || cust?.name || "Customer";
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

      // Build lead search hits
      leads.forEach((r: any) =>
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

      // Invoices
      invoices.forEach((r: any) =>
        hits.push({
          kind: "invoice",
          id: r.id,
          title: r.invoice_number,
          subtitle: `₹${r.total_amount}`,
          href: `/admin/finance/gst`,
        })
      );

      // Certificates
      certificates.forEach((r: any) =>
        hits.push({
          kind: "certificate",
          id: r.id,
          title: r.certificate_number || r.file_name,
          href: `/admin/certificates`,
        })
      );

      // Complaints
      complaints.forEach((r: any) =>
        hits.push({
          kind: "complaint",
          id: r.id,
          title: r.complaint_number || r.id,
          subtitle: r.status,
          href: `/admin/complaints/${r.id}`,
        })
      );
    } catch (err) {
      console.error("[globalSearch] handler error:", err);
    }

    return { hits };
  });
