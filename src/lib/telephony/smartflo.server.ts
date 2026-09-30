/**
 * Smartflo (Tata Tele) API Dialplan — incoming-call routing, Phase A.
 * Read-only: reuses existing leads/customers/applications assignment
 * (assigned_to) and never reassigns anything.
 */
import { createHash, timingSafeEqual } from "crypto";

export type DialplanInput = {
  uuid?: string;
  call_id?: string;
  caller_id_number?: string;
  call_to_number?: string;
  start_stamp?: string;
  [k: string]: unknown;
};

export type Transfer = { transfer: { type: string; data: string[] } };
export type DialplanResponse = Transfer[];

export type MatchResult = {
  customerId: string | null;
  leadId: string | null;
  applicationId: string | null;
  employeeId: string | null;
  employeeActive: boolean;
  agentId: string | null; // Smartflo agent/extension id from profiles.smartflo_agent_id
};

export type Lookup = (mobile10: string) => Promise<MatchResult>;

const CLOSED_ORDER = [
  "COMPLETED", "CLOSED", "CERTIFICATE_ISSUED", "REFUND_APPROVED", "REFUND_PROCESSED",
];

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
export function hashNumber(m: string | null): string | null {
  return m ? createHash("sha256").update(m).digest("hex").slice(0, 16) : null;
}

export function fallbackResponse(): DialplanResponse {
  const type = process.env["SMARTFLO_FALLBACK_TYPE"]; // e.g. queue | department | ivr | extension
  const id = process.env["SMARTFLO_FALLBACK_ID"];
  // Empty array = no instruction; Smartflo then applies its own failover.
  return type && id ? [{ transfer: { type, data: [id] } }] : [];
}

export function verifySmartflo(request: Request): boolean {
  const secret = process.env["SMARTFLO_WEBHOOK_SECRET"];
  if (!secret) return false;
  const url = new URL(request.url);
  const given =
    request.headers.get("x-smartflo-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("token") ||
    "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Default DB lookup using existing tables. */
export const dbLookup: Lookup = async (m) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const variants = [m, `+91${m}`, `91${m}`, `0${m}`, `+91 ${m}`];
  const [leadsRes, custRes] = await Promise.all([
    supabaseAdmin.from("leads").select("id, customer_id, assigned_to")
      .in("mobile", variants).order("created_at", { ascending: false }).limit(10),
    supabaseAdmin.from("customers").select("id").in("primary_mobile", variants)
      .eq("is_deleted", false).limit(1),
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
    const { data, error } = await supabaseAdmin.from("applications")
      .select("id, lead_id, assigned_to")
      .or(ors)
      .not("order_status", "in", `(${CLOSED_ORDER.join(",")})`)
      .order("created_at", { ascending: false }).limit(1);
    if (error) throw error;
    app = data?.[0] ?? null;
  }
  const lead = (app && leads.find((l) => l.id === app!.lead_id)) || leads[0] || null;
  const employeeId = app?.assigned_to ?? lead?.assigned_to ?? null;
  let employeeActive = false;
  let agentId: string | null = null;
  if (employeeId) {
    const { data, error } = await supabaseAdmin.from("profiles")
      .select("is_active, smartflo_agent_id").eq("id", employeeId).maybeSingle();
    if (error) throw error;
    employeeActive = (data as { is_active?: boolean } | null)?.is_active === true;
    const rawAgentId = (data as any)?.smartflo_agent_id;
    agentId = typeof rawAgentId === "string" && rawAgentId.trim().length > 0 ? rawAgentId.trim() : null;
  }
  return {
    customerId, leadId: lead?.id ?? null, applicationId: app?.id ?? null,
    employeeId, employeeActive,
    agentId,
  };
};

export async function routeCall(
  input: DialplanInput,
  lookup: Lookup = dbLookup,
  timeoutMs = 2500,
): Promise<{ response: DialplanResponse; log: Record<string, unknown> }> {
  const started = Date.now();
  const mobile = normalizeIndianMobile(input.caller_id_number);
  const log: Record<string, unknown> = {
    event: "smartflo_dialplan",
    call_id: input.call_id ?? null,
    uuid: input.uuid ?? null,
    caller_masked: maskNumber(mobile),
    caller_hash: hashNumber(mobile),
  };
  const done = (response: DialplanResponse, extra: Record<string, unknown>) => {
    Object.assign(log, extra, { response_ms: Date.now() - started });
    console.log(JSON.stringify(log));
    return { response, log };
  };

  if (!mobile) return done(fallbackResponse(), { decision: "fallback", failure_reason: "invalid_caller_number" });

  let match: MatchResult;
  try {
    match = await Promise.race([
      lookup(mobile),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("lookup_timeout")), timeoutMs)),
    ]);
  } catch (e) {
    return done(fallbackResponse(), {
      decision: "fallback", failure_reason: `lookup_error:${(e as Error)?.message ?? "unknown"}`,
    });
  }

  const ids = {
    customer_id: match.customerId, lead_id: match.leadId,
    application_id: match.applicationId, employee_id: match.employeeId,
  };
  if (!match.leadId && !match.customerId) return done(fallbackResponse(), { ...ids, decision: "fallback", failure_reason: "no_match" });
  if (!match.employeeId) return done(fallbackResponse(), { ...ids, decision: "fallback", failure_reason: "no_assigned_employee" });
  if (!match.employeeActive) return done(fallbackResponse(), { ...ids, decision: "fallback", failure_reason: "employee_inactive" });
  if (!match.agentId) return done(fallbackResponse(), { ...ids, decision: "fallback", failure_reason: "agent_mapping_missing" });

  const type = process.env["SMARTFLO_AGENT_TRANSFER_TYPE"] || "agent";
  return done([{ transfer: { type, data: [match.agentId] } }], { ...ids, decision: "transfer_employee", agent_id: match.agentId });
}
