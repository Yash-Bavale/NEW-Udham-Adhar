import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { computeResponseHash, getPayUCreds, verifyPayUPayment } from "@/lib/payments/payu.server";
import { generateInvoiceInternal } from "@/lib/crm/invoices.functions";
import { enqueueFromTemplateInternal } from "@/lib/emails/emails.server";

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
        let mihpayid = get("mihpayid");
        let bankrefnum = get("bankrefnum");
        const normalizedStatus = normalizePayUStatus(fields.status);

        // Detect S2S vs browser-return: PayU's server-to-server webhook
        // doesn't send Accept: text/html. Browser-return POST does.
        const accept = request.headers.get("accept") ?? "";
        const isBrowser = accept.includes("text/html");

        if (!receivedHash || !fields.txnid) {
          return new Response("Invalid payload", { status: 400 });
        }

        let verifiedPayment: Awaited<ReturnType<typeof verifyPayUPayment>> | null = null;

        const expected = computeResponseHash({
          ...fields, salt: creds.salt,
          additionalCharges: additionalCharges || undefined,
        });

        const hashMatches = expected.toLowerCase() === receivedHash.toLowerCase();
        if (!hashMatches) {
          try {
            verifiedPayment = await verifyPayUPayment(fields.txnid);
          } catch (e) {
            console.error("[payu] verification lookup failed after hash mismatch", { txnid: fields.txnid, error: e });
          }

          if (!isPayUSuccess(verifiedPayment)) {
            console.error("[payu] hash mismatch", { txnid: fields.txnid });
            return isBrowser
              ? redirectToPending(get("udf3") || fields.txnid)
              : new Response("hash-mismatch", { status: 200 });
          }

          console.warn("[payu] callback hash mismatch but PayU verification confirms success", { txnid: fields.txnid });
        }

        if (!verifiedPayment && shouldVerifyWithPayU(normalizedStatus)) {
          try {
            verifiedPayment = await verifyPayUPayment(fields.txnid);
            console.info("[payu] verify_payment result", {
              txnid: fields.txnid,
              postedStatus: fields.status,
              verifiedStatus: verifiedPayment?.status,
              verifiedUnmappedStatus: verifiedPayment?.unmappedstatus,
              mihpayid: verifiedPayment?.mihpayid,
            });
          } catch (e) {
            console.error("[payu] verification lookup failed", { txnid: fields.txnid, postedStatus: fields.status, error: e });
          }
        }

        // Load payment by txnid (we stored it as both transaction_id and razorpay_order_id)
        const { data: payment } = await supabaseAdmin
          .from("payments")
          .select("id, lead_id, application_id, status, amount")
          .or(`transaction_id.eq.${fields.txnid},razorpay_order_id.eq.${fields.txnid}`)
          .maybeSingle();

        if (!payment) {
          console.error("[payu] payment row missing", fields.txnid);
          return isBrowser
            ? redirectToFailure(get("udf3") || fields.txnid, "Payment record not found")
            : new Response("payment-not-found", { status: 200 });
        }

        if (Number(fields.amount) !== Number(payment.amount)) {
          console.warn("[payu] amount mismatch", {
            txnid: fields.txnid,
            expected: payment.amount,
            received: fields.amount,
          });
        }

        // Idempotency: if already paid, just acknowledge
        if (payment.status === "paid" && (normalizedStatus === "success" || isPayUSuccess(verifiedPayment))) {
          return isBrowser
            ? redirectToSuccess(get("udf3") || fields.txnid)
            : new Response("OK", { status: 200 });
        }

        const verifiedSuccess = isPayUSuccess(verifiedPayment);
        if (verifiedPayment?.mihpayid && !mihpayid) mihpayid = String(verifiedPayment.mihpayid);
        if (verifiedPayment?.bank_ref_num && !bankrefnum) bankrefnum = String(verifiedPayment.bank_ref_num);
        const safeVerifiedPayment = verifiedPayment
          ? JSON.parse(JSON.stringify(verifiedPayment))
          : null;

        const newStatus: "paid" | "failed" | "attempted" =
          verifiedSuccess || normalizedStatus === "success" ? "paid" :
          normalizedStatus === "failure" ? "failed" :
          "attempted";

        const rawPayload: Record<string, string> = {};
        form.forEach((v, k) => { rawPayload[k] = typeof v === "string" ? v : "[file]"; });

        console.info("[payu] callback decision", {
          txnid: fields.txnid,
          leadCode: get("udf3") || null,
          isBrowser,
          hashMatches,
          postedStatus: fields.status,
          normalizedStatus,
          verifiedSuccess,
          newStatus,
        });

        const { error: paymentUpdateError } = await supabaseAdmin.from("payments").update({
          status: newStatus,
          razorpay_payment_id: mihpayid || null,
          razorpay_signature: receivedHash,
          payment_date: newStatus === "paid" ? new Date().toISOString() : null,
          webhook_response: rawPayload,
          raw_response: { mihpayid, bankrefnum, ...fields, verified_payment: safeVerifiedPayment } as any,
        }).eq("id", payment.id);
        if (paymentUpdateError) {
          console.error("[payu] payment update failed", { txnid: fields.txnid, error: paymentUpdateError });
          return isBrowser
            ? redirectToPending(get("udf3") || fields.txnid)
            : new Response("payment-update-failed", { status: 200 });
        }

        if (newStatus === "paid") {
          await supabaseAdmin.from("leads")
            .update({ status: "payment_successful" })
            .eq("id", payment.lead_id);

          if (payment.application_id) {
            await supabaseAdmin.from("applications")
              .update({ application_status: "payment_received" })
              .eq("id", payment.application_id);
          }

          try { await generateInvoiceInternal(payment.id); }
          catch (e) { console.error("[payu] invoice generation failed", e); }

          // Send welcome+receipt+onboarding email (best-effort, never blocks)
          try {
            const { data: leadRow } = await supabaseAdmin
              .from("leads")
              .select("lead_code, name, email, service, base_amount, gst_amount, total_amount")
              .eq("id", payment.lead_id)
              .maybeSingle();
            if (leadRow?.email && leadRow.lead_code) {
              const onboardingUrl = `${APP_ORIGIN}/onboarding/${encodeURIComponent(leadRow.lead_code)}`;
              await enqueueFromTemplateInternal(
                "payment_success",
                leadRow.email,
                {
                  name: leadRow.name ?? "",
                  lead_code: leadRow.lead_code,
                  service: leadRow.service ?? "",
                  base_amount: Number(leadRow.base_amount ?? 0).toFixed(2),
                  gst_amount: Number(leadRow.gst_amount ?? 0).toFixed(2),
                  total_amount: Number(leadRow.total_amount ?? 0).toFixed(2),
                  onboarding_url: onboardingUrl,
                  support_email: "help@businesshelpservices.com",
                },
                { toName: leadRow.name ?? undefined, leadId: payment.lead_id, applicationId: payment.application_id ?? undefined },
              );
            }
          } catch (e) { console.error("[payu] payment_success email enqueue failed", e); }

          return isBrowser
            ? redirectToSuccess(get("udf3") || fields.txnid)
            : new Response("OK", { status: 200 });
        }

        if (newStatus === "failed") {
          await supabaseAdmin.from("leads")
            .update({ status: "payment_pending" })
            .eq("id", payment.lead_id);
          return isBrowser
            ? redirectToFailure(get("udf3") || fields.txnid, "Payment failed")
            : new Response("OK", { status: 200 });
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});

const APP_ORIGIN = process.env.APP_BASE_URL ||
  "https://everythinghappensqindiaserver4cored.lovable.app";

function redirectToSuccess(leadCode: string) {
  return new Response(null, {
    status: 303,
    headers: { Location: `${APP_ORIGIN}/success/${encodeURIComponent(leadCode)}` },
  });
}
function redirectToPending(leadCode: string) {
  return new Response(null, {
    status: 303,
    headers: { Location: `${APP_ORIGIN}/payment-pending/${encodeURIComponent(leadCode)}` },
  });
}
function redirectToFailure(leadCode: string, reason: string) {
  const q = new URLSearchParams({ reason }).toString();
  return new Response(null, {
    status: 303,
    headers: { Location: `${APP_ORIGIN}/payment-failed/${encodeURIComponent(leadCode)}?${q}` },
  });
}

function isPayUSuccess(payment: Record<string, unknown> | null | undefined) {
  const status = normalizePayUStatus(payment?.status);
  const unmapped = normalizePayUStatus(payment?.unmappedstatus);
  return status === "success" || unmapped === "captured";
}

function normalizePayUStatus(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function shouldVerifyWithPayU(status: string) {
  return status === "success" || status === "failure" || status === "failed" || status === "";
}
