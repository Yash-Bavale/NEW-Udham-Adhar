import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Bulletproof lookup for a lead by lead_code, application_code, or UUID.
 * Normalizes space/dash variations (e.g. "UA 2026-016721" vs "UA-2026-016721" vs "UA%202026-016721").
 */
export async function findLeadByCode(
  codeInput: string,
  cols: string = "*",
): Promise<any | null> {
  if (!codeInput) return null;
  const raw = codeInput.trim();
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw).trim();
  } catch {
    decoded = raw;
  }

  // Candidate variations
  const normalizedDash = decoded.replace(/[\s_]+/g, "-").toUpperCase();
  const normalizedSpace = decoded.replace(/[\s_-]+/g, " ").toUpperCase();

  // 1. If code starts with AP-, check applications table first
  if (decoded.toUpperCase().startsWith("AP-") || normalizedDash.startsWith("AP-")) {
    const appCodes = Array.from(new Set([raw, decoded, normalizedDash]));
    for (const ac of appCodes) {
      const { data: app } = await supabaseAdmin
        .from("applications")
        .select(`lead_id, leads:lead_id (${cols})`)
        .eq("application_code", ac)
        .maybeSingle();
      if ((app as any)?.leads) return (app as any).leads;
    }
  }

  // 2. Direct exact or normalized query on leads table
  const leadCodes = Array.from(new Set([raw, decoded, normalizedDash, normalizedSpace]));
  for (const lc of leadCodes) {
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select(cols)
      .eq("lead_code", lc)
      .maybeSingle();
    if (lead) return lead;
  }

  // 3. Case-insensitive ilike match
  const { data: ilikeLead } = await supabaseAdmin
    .from("leads")
    .select(cols)
    .ilike("lead_code", normalizedDash)
    .maybeSingle();
  if (ilikeLead) return ilikeLead;

  // 4. UUID fallback
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded)) {
    const { data: byId } = await supabaseAdmin
      .from("leads")
      .select(cols)
      .eq("id", decoded)
      .maybeSingle();
    if (byId) return byId;
  }

  return null;
}
