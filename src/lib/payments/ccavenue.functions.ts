import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

const Input = z.object({ leadCode: z.string().min(3).max(80) });

/**
 * Build a CCAvenue order for a lead. Returns the action URL + the encrypted
 * payload the browser must POST. Mirrors createPayUOrder for symmetry —
 * idempotent against retries and blocks a new order once the lead is paid.
 */
export const createCcavenueOrder = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const { CCAV_REDIRECT_URL, buildCcavOrderId, buildCcavPayload, encryptRequest, getCcavCreds } =
      await import("@/lib/payments/ccavenue.server");
    const { merchantId, accessCode, workingKey } = getCcavCreds();

    const { data: gateway } = await (await getAdmin())
      .from("payment_gateways")
      .select("is_enabled")
      .eq("name", "ccavenue")
      .maybeSingle();
    if (!gateway?.is_enabled) {
      throw new Error("CCAvenue is currently disabled. Please try another option.");
    }

    const { data: lead, error: leadErr } = await (await getAdmin())
      .from("leads")
      .select("id, lead_code, name, email, mobile, total_amount, base_amount, gst_amount, service, state")
      .eq("lead_code", data.leadCode)
      .maybeSingle();
    if (leadErr) throw new Error(leadErr.message);
    if (!lead) throw new Error("Lead not found");
    if (!lead.lead_code) throw new Error("Lead is missing a lead code");

    const { data: application } = await (await getAdmin())
      .from("applications")
      .select("id, application_code")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: paidAlready } = await (await getAdmin())
      .from("payments")
      .select("id")
      .eq("lead_id", lead.id)
      .eq("status", "paid")
      .limit(1)
      .maybeSingle();
    if (paidAlready) {
      throw new Error("This application has already been paid.");
    }

    // Mark stale CCAvenue attempts as failed so we never reuse order_id.
    await (await getAdmin())
      .from("payments")
      .update({ status: "failed" })
      .eq("lead_id", lead.id)
      .eq("gateway_name", "ccavenue")
      .in("status", ["created", "attempted"]);

    const orderId = buildCcavOrderId(lead.lead_code);
    const amount = Number(lead.total_amount).toFixed(2);

    const { data: inserted, error: insErr } = await (await getAdmin())
      .from("payments")
      .insert({
        lead_id: lead.id,
        application_id: application?.id ?? null,
        gateway_name: "ccavenue",
        transaction_id: orderId,
        razorpay_order_id: orderId, // reuse column for cross-gateway order id
        amount: Number(lead.total_amount),
        base_amount: Number(lead.base_amount),
        gst_amount: Number(lead.gst_amount),
        currency: "INR",
        status: "created",
        idempotency_key: `ccavenue:${orderId}`,
      })
      .select("id")
      .single();
    if (insErr || !inserted) {
      throw new Error(insErr?.message ?? "Could not create payment");
    }
    const paymentId = inserted.id;

    const origin = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL ||
      "https://udyamadhar.everythinghappens.in";
    const redirectUrl = `${origin}/api/public/webhooks/ccavenue`;
    const cancelUrl   = `${origin}/api/public/webhooks/ccavenue`;

    const billingName = (lead.name ?? "Customer").slice(0, 60);
    const merchantParams = buildCcavPayload({
      merchant_id: merchantId,
      order_id: orderId,
      currency: "INR",
      amount,
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
      language: "EN",
      billing_name: billingName,
      billing_email: lead.email,
      billing_tel: lead.mobile ?? "",
      billing_country: "India",
      billing_state: lead.state ?? "",
      merchant_param1: lead.id,
      merchant_param2: application?.id ?? "",
      merchant_param3: lead.lead_code,
      merchant_param4: (lead.service ?? "").slice(0, 60),
      integration_type: "iframe_normal",
    });

    const encRequest = encryptRequest(merchantParams, workingKey);

    console.info("[ccavenue] initiate", {
      env: (process.env.CCAV_ENV ?? "live").trim().toLowerCase(),
      actionUrl: CCAV_REDIRECT_URL,
      merchantId,
      accessCodePrefix: accessCode.slice(0, 4),
      accessCodeLen: accessCode.length,
      workingKeyLen: workingKey.length,
      orderId,
      amount,
      encRequestLen: encRequest.length,
    });

    return {
      actionUrl: CCAV_REDIRECT_URL,
      fields: {
        encRequest,
        access_code: accessCode,
      } as Record<string, string>,
      paymentId,
      leadCode: lead.lead_code,
      totalAmount: Number(lead.total_amount),
    };
  });
