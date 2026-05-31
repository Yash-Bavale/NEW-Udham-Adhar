import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { computeResponseHash, getPayUCreds } from "@/lib/payments/payu.server";
import { generateInvoiceInternal } from "@/lib/crm/invoices.functions";

/**
 * PayU return / S2S endpoint. PayU posts x-www-form-urlencoded with the
 * payment result. We verify the response hash, mark the payment + lead +
 * application, generate the invoice, and redirect the user back to a
 * success/failure page on our domain.
 *
 * This endpoint is idempotent: re-posting the same txn won't double-update.
 */
export const Route = createFileRoute("/api/public/webhooks/payu")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let creds: { key: string; salt: string };
        try {
          creds = getPayUCreds();
        } catch (e) {
          console.error("[payu] not configured", e);
          return new Response("Gateway not configured", { status: 500 });
        }

        const form = await request.formData();
        const get = (k: string) => (form.get(k)?.toString() ?? "");

        const fields = {
          key: get("key"),
          txnid: get("txnid"),
          amount: get("amount"),
          productinfo: get("productinfo"),
          firstname: get("firstname"),
          email: get("email"),
          status: get("status"),
          udf1: get("udf1"),
          udf2: get("udf2"),
          udf3: get("udf3"),
          udf4: get("udf4"),
          udf5: get("udf5"),
        };
        const receivedHash = get("hash");
        const additionalCharges = get("additionalCharges");
        const mihpayid = get("mihpayid");
        const bankrefnum = get("bankrefnum");

        if (!receivedHash || !fields.txnid) {
          return new Response("Invalid payload", { status: 400 });
        }

        const expected = computeResponseHash({
          ...fields, salt: creds.salt,
          additionalCharges: additionalCharges || undefined,
        });

        if (expected.toLowerCase() !== receivedHash.toLowerCase()) {
          console.error("[payu] hash mismatch", { txnid: fields.txnid });
          return redirectToFailure(get("udf3") || fields.txnid, "Signature verification failed");
        }

        // Load payment by txnid (we stored it as both transaction_id and razorpay_order_id)
        const { data: payment } = await supabaseAdmin
          .from("payments")
          .select("id, lead_id, application_id, status")
          .or(`transaction_id.eq.${fields.txnid},razorpay_order_id.eq.${fields.txnid}`)
          .maybeSingle();

        if (!payment) {
          console.error("[payu] payment row missing", fields.txnid);
          return redirectToFailure(get("udf3") || fields.txnid, "Payment record not found");
        }

        // Idempotency: if already paid, just redirect
        if (payment.status === "paid" && fields.status === "success") {
          return redirectToSuccess(get("udf3") || fields.txnid);
        }

        const newStatus =
          fields.status === "success" ? "paid" :
          fields.status === "failure" ? "failed" :
          "pending";

        const rawPayload: Record<string, string> = {};
        form.forEach((v, k) => { rawPayload[k] = typeof v === "string" ? v : "[file]"; });

        await supabaseAdmin.from("payments").update({
          status: newStatus,
          razorpay_payment_id: mihpayid || null,
          razorpay_signature: receivedHash,
          payment_date: newStatus === "paid" ? new Date().toISOString() : null,
          webhook_response: rawPayload,
          raw_response: { mihpayid, bankrefnum, ...fields },
        }).eq("id", payment.id);

        if (newStatus === "paid") {
          // Update lead + application
          await supabaseAdmin.from("leads")
            .update({ status: "payment_successful" })
            .eq("id", payment.lead_id);

          if (payment.application_id) {
            await supabaseAdmin.from("applications")
              .update({ application_status: "payment_received" })
              .eq("id", payment.application_id);
          }

          // Generate invoice (non-fatal)
          try { await generateInvoiceInternal(payment.id); }
          catch (e) { console.error("[payu] invoice generation failed", e); }

          return redirectToSuccess(get("udf3") || fields.txnid);
        }

        if (newStatus === "failed") {
          await supabaseAdmin.from("leads")
            .update({ status: "payment_pending" })
            .eq("id", payment.lead_id);
          return redirectToFailure(get("udf3") || fields.txnid, "Payment failed");
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});

function redirectToSuccess(leadCode: string) {
  return new Response(null, { status: 303, headers: { Location: `/success/${encodeURIComponent(leadCode)}` } });
}
function redirectToFailure(leadCode: string, reason: string) {
  const q = new URLSearchParams({ reason }).toString();
  return new Response(null, { status: 303, headers: { Location: `/payment-pending/${encodeURIComponent(leadCode)}?${q}` } });
}
