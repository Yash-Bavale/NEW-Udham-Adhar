import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  PAYU_BASE_URL,
  buildTxnId,
  computeRequestHash,
  getPayUCreds,
} from "@/lib/payments/payu.server";

const Input = z.object({ leadCode: z.string().min(3).max(80) });

/**
 * Build a PayU order for a lead. Returns the action URL and all fields the
 * browser must POST to PayU. Idempotent: re-uses the latest 'created' payment
 * row for this lead if it exists, so refresh doesn't spawn duplicate txns.
 */
export const createPayUOrder = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    // 1. Make sure PayU is on & secrets exist (throws early with a clear msg)
    const { key, salt } = getPayUCreds();

    const { data: gateway } = await supabaseAdmin
      .from("payment_gateways")
      .select("is_enabled, priority")
      .eq("name", "payu")
      .maybeSingle();
    if (!gateway?.is_enabled) {
      throw new Error("PayU is currently disabled. Please try later.");
    }

    // 2. Load the lead
    const { data: lead, error: leadErr } = await supabaseAdmin
      .from("leads")
      .select("id, lead_code, name, email, mobile, total_amount, base_amount, gst_amount, service")
      .eq("lead_code", data.leadCode)
      .maybeSingle();
    if (leadErr) throw new Error(leadErr.message);
    if (!lead) throw new Error("Lead not found");

    // 3. Pick or create application
    const { data: application } = await supabaseAdmin
      .from("applications")
      .select("id, application_code")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 4. Reuse latest pending payment row (idempotent on refresh)
    const { data: existing } = await supabaseAdmin
      .from("payments")
      .select("id, idempotency_key, transaction_id, amount")
      .eq("lead_id", lead.id)
      .eq("gateway_name", "payu")
      .eq("status", "created")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!lead.lead_code) throw new Error("Lead is missing a lead code");
    const leadCode: string = lead.lead_code;

    let txnid: string;
    let paymentId: string;
    if (existing && existing.transaction_id) {
      txnid = existing.transaction_id;
      paymentId = existing.id;
    } else {
      txnid = buildTxnId(leadCode);
      const { data: inserted, error: insErr } = await supabaseAdmin
        .from("payments")
        .insert({
          lead_id: lead.id,
          application_id: application?.id ?? null,
          gateway_name: "payu",
          transaction_id: txnid,
          razorpay_order_id: txnid, // reuse column for cross-gateway order id
          amount: Number(lead.total_amount),
          base_amount: Number(lead.base_amount),
          gst_amount: Number(lead.gst_amount),
          currency: "INR",
          status: "created",
          idempotency_key: `payu:${txnid}`,
        })
        .select("id")
        .single();
      if (insErr || !inserted) {
        throw new Error(insErr?.message ?? "Could not create payment");
      }
      paymentId = inserted.id;
    }

    const amount = Number(lead.total_amount).toFixed(2);
    const productinfo = (lead.service ?? "Service").slice(0, 100);
    const firstname = (lead.name ?? "Customer").slice(0, 60);
    const email = lead.email;

    const origin = process.env.APP_BASE_URL ||
      "https://everythinghappensqindiaserver4cored.lovable.app";
    const surl = `${origin}/api/public/webhooks/payu`;
    const furl = `${origin}/api/public/webhooks/payu`;

    const hash = computeRequestHash({
      key, salt, txnid, amount, productinfo, firstname, email,
      udf1: lead.id, udf2: application?.id ?? "", udf3: leadCode,
    });

    return {
      actionUrl: PAYU_BASE_URL,
      fields: {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone: lead.mobile,
        surl,
        furl,
        hash,
        udf1: lead.id,
        udf2: application?.id ?? "",
        udf3: leadCode,
        service_provider: "payu_paisa",
      } as Record<string, string>,
      paymentId,
      leadCode,
      totalAmount: Number(lead.total_amount),
    };
  });
