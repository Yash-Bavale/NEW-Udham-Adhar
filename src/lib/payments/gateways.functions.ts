import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";

const Input = z.object({ leadCode: z.string().trim().min(3).max(80) });

/**
 * Public summary used on /apply/:leadCode/summary.
 * Returns service info, customer contact, full pricing breakdown (base/GST/total)
 * and enabled payment gateways.
 */
export const getApplicationSummary = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    console.log("[getApplicationSummary] code:", data.leadCode);
    const code = data.leadCode.trim();
    const cols = "id, lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount, status, lead_status_v2, service_id";

    // Accept either a lead_code (UA-...) or an application_code (AP-...).
    let lead: any = null;
    if (code.toUpperCase().startsWith("AP-")) {
      const { data: app, error: appErr } = await supabaseAdmin
        .from("applications")
        .select(`lead_id, leads:lead_id (${cols})`)
        .eq("application_code", code)
        .maybeSingle();
      if (appErr) throw new Error(appErr.message);
      lead = (app as any)?.leads ?? null;
    } else {
      const { data: byLead, error } = await supabaseAdmin
        .from("leads")
        .select(cols)
        .eq("lead_code", code)
        .maybeSingle();
      if (error) throw new Error(error.message);
      lead = byLead;
    }
    if (!lead) throw new Error("Application not found");


    // Fetch service description separately
    let serviceDescription = "";
    if (lead.service_id) {
      const { data: svc } = await supabaseAdmin
        .from("services")
        .select("description")
        .eq("id", lead.service_id)
        .maybeSingle();
      if (svc) serviceDescription = svc.description || "";
    }

    // Fetch payment record separately
    const { data: payments } = await supabaseAdmin
      .from("payments")
      .select("transaction_id, gateway_name, payment_date, status, amount")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false });

    const isAwaitingConvertedServicePayment =
      lead.status === "payment_pending" || lead.lead_status_v2 === "payment_pending";
    const successfulPayment = isAwaitingConvertedServicePayment
      ? null
      : payments?.find(p => p.status === 'paid') || null;

    const { data: gateways } = await supabaseAdmin
      .from("payment_gateways")
      .select("name, display_name, is_enabled, priority")
      .eq("is_enabled", true)
      .order("priority", { ascending: true });

    return {
      lead: {
        leadCode: lead.lead_code,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        service: lead.service,
        serviceDescription,
        baseAmount: Number(lead.base_amount ?? 0),
        gstAmount: Number(lead.gst_amount ?? 0),
        totalAmount: Number(lead.total_amount ?? 0),
        status: lead.status,
        leadStatusV2: lead.lead_status_v2,
        payment: successfulPayment,
      },
      gateways: gateways ?? [],
    };
  });

// ── Customer self-edit of contact details (pre-payment only) ──

const UpdateContact = z.object({
  leadCode: z.string().trim().min(3).max(80),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  // Ownership proof — caller must echo back the email OR mobile already on
  // the lead. Without this, anyone who guesses a lead_code could repurpose
  // someone else's application. This is the public customer-facing edit flow
  // (apply.$leadCode.summary.tsx) so we cannot use requireSupabaseAuth.
  currentEmail: z.string().trim().email().max(160).optional(),
  currentMobile: z.string().trim().regex(/^[6-9]\d{9}$/).optional(),
}).refine((v) => v.currentEmail || v.currentMobile, {
  message: "currentEmail or currentMobile is required to prove ownership",
});

export const updateLeadContact = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => UpdateContact.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Only allow edits before payment is captured
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, status, email, mobile")
      .eq("lead_code", data.leadCode)
      .maybeSingle();
    if (!lead) throw new Error("Application not found");
    if (lead.status === "payment_successful" || lead.status === "completed") {
      throw new Error("Details can't be changed after payment.");
    }

    // Verify caller owns this lead by matching one of the existing contact fields.
    const emailMatches = data.currentEmail &&
      lead.email && lead.email.toLowerCase() === data.currentEmail.toLowerCase();
    const mobileMatches = data.currentMobile && lead.mobile === data.currentMobile;
    if (!emailMatches && !mobileMatches) {
      throw new Error("Verification failed. Please contact support.");
    }

    const { error } = await supabaseAdmin
      .from("leads")
      .update({
        name: data.name,
        email: data.email.toLowerCase(),
        mobile: data.mobile,
      })
      .eq("id", lead.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


// ── Admin: gateway management ──

export const listGateways = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { supabase } = context;
    const { data, error } = await supabase
      .from("payment_gateways")
      .select("id, name, display_name, is_enabled, priority, webhook_secret_name, updated_at")
      .order("priority", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

const GatewayUpdate = z.object({
  id: z.string().uuid(),
  is_enabled: z.boolean(),
  priority: z.number().int().min(0).max(999),
});

export const updateGateway = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => GatewayUpdate.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await assertRole(supabase, ["super_admin"]);
    const { error } = await supabase
      .from("payment_gateways")
      .update({ is_enabled: data.is_enabled, priority: data.priority })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
