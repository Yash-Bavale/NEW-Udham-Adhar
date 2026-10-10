/** Provider-neutral telephony helpers (server-only): number normalisation and CRM record matching. */

const CLOSED_ORDER = ["COMPLETED", "CLOSED", "CERTIFICATE_ISSUED", "REFUND_APPROVED", "REFUND_PROCESSED"];

export type MatchResult = {
  customerId: string | null;
  leadId: string | null;
  applicationId: string | null;
  employeeId: string | null;
};

export function normalizeIndianMobile(raw: unknown): string | null {
  const d = String(raw ?? "").replace(/\D/g, "");
  const ten = d.length > 10 ? d.slice(-10) : d;
  if (!/^[6-9]\d{9}$/.test(ten)) return null;
  if (d.length > 10 && !/^(0|91|091|0091)$/.test(d.slice(0, -10))) return null;
  return ten;
}

export function maskNumber(m: string | null): string {
  return m ? `******${m.slice(-4)}` : "unknown";
}

/** Matches a customer mobile to existing leads/customers/open orders (read-only, never reassigns). */
export async function dbLookup(m: string): Promise<MatchResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const variants = [m, `+91${m}`, `91${m}`, `0${m}`, `+91 ${m}`];
  const [leadsRes, custRes] = await Promise.all([
    supabaseAdmin.from("leads").select("id, customer_id, assigned_to")
      .in("mobile", variants).order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("customers").select("id").in("primary_mobile", variants).eq("is_deleted", false).limit(1),
  ]);
  if (leadsRes.error) throw leadsRes.error;
  if (custRes.error) throw custRes.error;
  const leads = leadsRes.data ?? [];
  const customerId = custRes.data?.[0]?.id ?? leads.find((l) => l.customer_id)?.customer_id ?? null;
  const leadIds = leads.map((l) => l.id);

  let app: { id: string; lead_id: string | null; assigned_to: string | null } | null = null;
  if (leadIds.length || customerId) {
    const ors = [
      leadIds.length ? `lead_id.in.(${leadIds.join(",")})` : null,
      customerId ? `customer_id.eq.${customerId}` : null,
    ].filter(Boolean).join(",");
    const { data, error } = await supabaseAdmin.from("applications").select("id, lead_id, assigned_to")
      .or(ors).not("order_status", "in", `(${CLOSED_ORDER.join(",")})`)
      .order("created_at", { ascending: false }).limit(1);
    if (error) throw error;
    app = data?.[0] ?? null;
  }
  const lead = (app && leads.find((l) => l.id === app!.lead_id)) || leads[0] || null;
  return {
    customerId, leadId: lead?.id ?? null, applicationId: app?.id ?? null,
    employeeId: app?.assigned_to ?? lead?.assigned_to ?? null,
  };
}
