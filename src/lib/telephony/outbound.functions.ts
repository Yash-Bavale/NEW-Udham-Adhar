import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Smartflo outbound Click-to-Call.
 * Agent-first flow: Smartflo rings the employee's Smartflo endpoint (agent id),
 * then dials the customer and bridges both legs. Lifecycle events arrive on the
 * existing /api/public/telephony/smartflo/events webhook and are correlated by ref_id.
 * The inbound dialplan and inbound webhook behaviour are untouched.
 */

const CLICK_TO_CALL_URL = "https://api-smartflo.tatateleservices.com/v1/click_to_call";

const Input = z.object({
  destination: z.string().min(6).max(20),
  customerId: z.string().uuid().nullable().optional(),
  leadId: z.string().uuid().nullable().optional(),
  applicationId: z.string().uuid().nullable().optional(),
});

export const initiateClickToCall = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data, context }) => {
    const { normalizeIndianMobile } = await import("@/lib/telephony/smartflo.server");
    const destination = normalizeIndianMobile(data.destination);
    if (!destination) throw new Error("This phone number is not a valid Indian mobile number.");

    // Agent identity always comes from the authenticated employee's own profile.
    const { data: me, error: meErr } = await (context.supabase as any)
      .from("profiles").select("id, is_active, smartflo_agent_id, mobile")
      .eq("id", context.userId).maybeSingle();
    if (meErr) throw new Error("Could not load your profile.");
    if (!me) throw new Error("Your employee profile was not found.");
    if (me.is_active !== true) throw new Error("Your account is not active, so you cannot place calls.");

    const cd = await import("@/lib/telephony/callerdesk.server");
    if (cd.activeProvider() === "callerdesk") {
      const agentMobile = normalizeIndianMobile(me.mobile);
      if (!agentMobile) throw new Error("Your profile has no valid mobile number. Ask an admin to add the number you use in CallerDesk.");
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const db = supabaseAdmin as any;
      const since = new Date(Date.now() - 90_000).toISOString();
      const { data: dupe } = await db.from("telephony_calls").select("id, ref_id")
        .eq("employee_id", context.userId).eq("direction", "outbound")
        .eq("called_number", destination).in("status", ["ringing", "answered"])
        .gte("started_at", since).limit(1).maybeSingle();
      if (dupe) return { ok: true as const, alreadyInProgress: true as const, refId: dupe.ref_id ?? null };
      const { campid } = await cd.callerDeskClickToCall(agentMobile, destination);
      const refId = campid ?? `cd-${crypto.randomUUID()}`;
      const { data: row, error } = await db.from("telephony_calls").insert({
        provider: "callerdesk", call_id: refId, ref_id: refId, direction: "outbound",
        status: "ringing", last_event: "initiated", employee_id: context.userId, agent_id: agentMobile,
        customer_id: data.customerId ?? null, lead_id: data.leadId ?? null, application_id: data.applicationId ?? null,
        caller_number: agentMobile, called_number: destination, started_at: new Date().toISOString(),
      }).select("id").maybeSingle();
      if (error) return { ok: true as const, refId, recorded: false as const };
      return { ok: true as const, refId, recorded: true as const, callRowId: row?.id ?? null };
    }

    const agentId = typeof me.smartflo_agent_id === "string" ? me.smartflo_agent_id.trim() : "";
    if (!agentId) throw new Error("No Smartflo Agent ID is set on your profile. Ask an admin to add it.");

    const token = process.env["SMARTFLO_API_TOKEN"];
    if (!token) throw new Error("Calling is not configured yet. Please contact an admin.");
    const callerId = process.env["SMARTFLO_CALLER_ID"] || undefined;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as any;

    // Guard against double-clicks / duplicate initiation within a short window.
    const since = new Date(Date.now() - 90_000).toISOString();
    const { data: dupe } = await db.from("telephony_calls").select("id, ref_id, status")
      .eq("employee_id", context.userId).eq("direction", "outbound")
      .eq("called_number", destination).in("status", ["ringing", "answered"])
      .gte("started_at", since).order("started_at", { ascending: false }).limit(1).maybeSingle();
    if (dupe) return { ok: true as const, alreadyInProgress: true as const, refId: dupe.ref_id ?? null };

    let res: Response;
    try {
      res = await fetch(CLICK_TO_CALL_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          agent_number: agentId,
          destination_number: destination,
          ...(callerId ? { caller_id: callerId } : {}),
          async: 1,
          call_timeout: 1800,
          custom_identifier: {
            employee_id: context.userId,
            customer_id: data.customerId ?? null,
            lead_id: data.leadId ?? null,
            application_id: data.applicationId ?? null,
          },
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch (e) {
      console.log(JSON.stringify({ event: "smartflo_click_to_call", stage: "network", error: (e as Error)?.message }));
      throw new Error("Could not reach the calling service. Please try again.");
    }

    const text = await res.text();
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch { /* non-JSON provider reply */ }
    const refId: string | null =
      (typeof body?.ref_id === "string" && body.ref_id) ||
      (typeof body?.data?.ref_id === "string" && body.data.ref_id) || null;
    const accepted = res.ok && body?.success !== false && refId !== null;

    // Log status only — never the token or the provider's raw body.
    console.log(JSON.stringify({
      event: "smartflo_click_to_call", http: res.status, accepted,
      employee_id: context.userId, has_ref: !!refId,
    }));

    if (!accepted) {
      const providerMsg = typeof body?.message === "string" ? body.message : null;
      throw new Error(providerMsg && providerMsg.length < 200 ? `Call not started: ${providerMsg}` : "The calling service did not start this call. Please try again.");
    }

    const now = new Date().toISOString();
    const { data: row, error } = await db.from("telephony_calls").insert({
      provider: "smartflo",
      // Placeholder until the PBX sends its own call_id; the webhook matches on ref_id and replaces it.
      call_id: refId,
      ref_id: refId,
      direction: "outbound",
      status: "ringing",
      last_event: "initiated",
      employee_id: context.userId,
      agent_id: agentId,
      customer_id: data.customerId ?? null,
      lead_id: data.leadId ?? null,
      application_id: data.applicationId ?? null,
      caller_number: callerId ?? agentId,
      called_number: destination,
      started_at: now,
    }).select("id").maybeSingle();
    if (error) {
      console.log(JSON.stringify({ event: "smartflo_click_to_call", stage: "insert", error: error.message }));
      // The call itself is already ringing; don't fail the user action over logging.
      return { ok: true as const, refId, recorded: false as const };
    }

    return { ok: true as const, refId, recorded: true as const, callRowId: row?.id ?? null };
  });
