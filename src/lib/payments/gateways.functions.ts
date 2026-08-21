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

    // When customer opens summary / payment page, mark status as payment_pending if currently new/contacted
    if (
      ["new_lead", "contacted", "follow_up_required", "lead_created"].includes(lead.status ?? "") ||
      ["new_lead", "contacted", "follow_up_required", "lead_created"].includes(lead.lead_status_v2 ?? "")
    ) {
      await supabaseAdmin
        .from("leads")
        .update({ status: "payment_pending", lead_status_v2: "payment_pending" } as any)
        .eq("id", lead.id);
      lead.status = "payment_pending";
      lead.lead_status_v2 = "payment_pending";
    }


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

    // Check if there is an active pending payment link for a service change / top-up
    const { data: pendingLink } = await supabaseAdmin
      .from("payment_links" as any)
      .select("amount, expires_at, status")
      .eq("lead_id", lead.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const hasPendingLink = !!pendingLink && Number((pendingLink as any).amount) > 0;
    const pendingAmount = hasPendingLink ? Number((pendingLink as any).amount) : 0;

    const isAwaitingConvertedServicePayment =
      hasPendingLink || lead.status === "payment_pending" || lead.lead_status_v2 === "payment_pending";
    const successfulPayment = isAwaitingConvertedServicePayment
      ? null
      : payments?.find(p => p.status === 'paid') || null;

    const effectiveTotal = hasPendingLink ? pendingAmount : Number(lead.total_amount ?? 0);
    const effectiveBase = hasPendingLink ? Math.round((effectiveTotal / 1.18) * 100) / 100 : Number(lead.base_amount ?? 0);
    const effectiveGst = hasPendingLink ? Math.round((effectiveTotal - effectiveBase) * 100) / 100 : Number(lead.gst_amount ?? 0);

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
        baseAmount: effectiveBase,
        gstAmount: effectiveGst,
        totalAmount: effectiveTotal,
        status: lead.status,
        leadStatusV2: lead.lead_status_v2,
        payment: successfulPayment,
      },
      hasPendingLink,
      pendingAmount,
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

/**
 * Read-only credential self-check for CCAvenue. Calls the Order Status API
 * with a dummy reference: CCAvenue rejects bad merchant id / access code /
 * working key with an explicit error, while a valid setup replies "order not
 * found". No writes, super-admin only.
 */
export const checkCcavenueCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context.supabase, ["super_admin"]);
    try {
      const { callOrderStatusApi } = await import("@/lib/payments/ccavenue.server");
      const res = await callOrderStatusApi("CCAV-SELFCHECK-000000");
      const raw = res.raw ?? {};
      const errText = String(
        raw.error_desc ?? raw.reason ?? raw.status_message ?? raw.message ?? "",
      ).toLowerCase();
      const keys = Object.keys(raw);
      if (keys.length === 0) {
        return {
          ok: false,
          message:
            "CCAvenue did not return a readable response. The working key is most likely wrong (decryption failed).",
        };
      }
      if (errText.includes("access code") || errText.includes("merchant") || errText.includes("authentication")) {
        return {
          ok: false,
          message:
            `CCAvenue blocked the Status/Refund API (${errText}). Checkout is unaffected — this only means CCAvenue has not enabled the Merchant Web API for this account, or this server's outbound IP is not whitelisted.`,
        };
      }
      if (errText.includes("decrypt")) {
        return { ok: false, message: "Could not decrypt the CCAvenue response — the working key looks wrong." };
      }

      return {
        ok: true,
        message:
          "CCAvenue accepted the credentials (test lookup returned a normal 'order not found' style response).",
      };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : String(e) };
    }
  });
