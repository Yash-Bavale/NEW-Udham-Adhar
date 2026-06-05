import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  callOrderStatusApi,
  decryptResponse,
  getCcavCreds,
  normalizeCcavStatus,
  parseCcavPayload,
} from "@/lib/payments/ccavenue.server";
import { generateInvoiceInternal } from "@/lib/crm/invoices.functions";
import { enqueueFromTemplateInternal } from "@/lib/emails/emails.server";

/**
 * CCAvenue redirect/response endpoint. CCAvenue POSTs `encResp` containing
 * the encrypted key=value payload after a transaction. We decrypt, verify,
 * update the payment + lead + application, and 303-redirect the browser to
 * success / failure / pending pages. Idempotent against repeated callbacks.
 */
export const Route = createFileRoute("/api/public/webhooks/ccavenue")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let creds: ReturnType<typeof getCcavCreds>;
        try {
          creds = getCcavCreds();
        } catch (e) {
          console.error("[ccavenue] not configured", e);
          return new Response("Gateway not configured", { status: 500 });
        }

        const form = await request.formData();
        const encResp = form.get("encResp")?.toString() ?? "";
        if (!encResp) {
          return new Response("Missing encResp", { status: 400 });
        }

        let payload: Record<string, string>;
        try {
          const decrypted = decryptResponse(encResp, creds.workingKey);
          payload = parseCcavPayload(decrypted);
        } catch (e) {
          console.error("[ccavenue] decrypt failed", e);
          return new Response("Invalid payload", { status: 400 });
        }

        const orderId = payload.order_id || payload.merchant_param0 || "";
        const trackingId = payload.tracking_id || payload.reference_no || "";
        const orderStatus = payload.order_status || payload.status || "";
        const amount = payload.amount || payload.mer_amount || "";
        const failureMessage = payload.failure_message || payload.status_message || "";
        const leadCodeFromParam = payload.merchant_param3 || "";

        if (!orderId) {
          return new Response("Missing order_id", { status: 400 });
        }

        // Browser-return vs server-to-server: CCAvenue's response URL is hit
        // by the user's browser as a form POST, so Accept includes text/html.
        const accept = request.headers.get("accept") ?? "";
        const isBrowser = accept.includes("text/html");

        // Find the payment row by order_id (stored as transaction_id and razorpay_order_id).
        const { data: payment } = await supabaseAdmin
          .from("payments")
          .select("id, lead_id, application_id, status, amount")
          .or(`transaction_id.eq.${orderId},razorpay_order_id.eq.${orderId}`)
          .maybeSingle();

        if (!payment) {
          console.error("[ccavenue] payment row missing", { orderId });
          return isBrowser
            ? redirectToPending(leadCodeFromParam || orderId)
            : new Response("payment-not-found", { status: 200 });
        }

        let normalized = normalizeCcavStatus(orderStatus);

        // For "attempted" (Awaited / Initiated) or amount mismatch, reconcile
        // via Status API to get the authoritative state.
        const amountMismatch = amount && Number(amount) !== Number(payment.amount);
        if (amountMismatch || normalized === "attempted" || normalized === "created") {
          try {
            const reconciled = await callOrderStatusApi(orderId);
            console.info("[ccavenue] reconciled", {
              orderId,
              postedStatus: orderStatus,
              reconciledStatus: reconciled.status,
            });
            normalized = reconciled.status;
            if (reconciled.amount) payload.amount = reconciled.amount;
            if (reconciled.bankRefNo) payload.bank_ref_no = reconciled.bankRefNo;
            if (reconciled.trackingId && !payload.tracking_id) {
              payload.tracking_id = reconciled.trackingId;
            }
            payload._reconciled = JSON.stringify(reconciled.raw);
          } catch (e) {
            console.error("[ccavenue] status api lookup failed", { orderId, error: e });
          }
        }

        // Idempotency: never downgrade a paid record.
        if (payment.status === "paid") {
          return isBrowser
            ? redirectToSuccess(leadCodeFromParam || orderId)
            : new Response("OK", { status: 200 });
        }

        const newStatus: "paid" | "failed" | "attempted" =
          normalized === "paid" ? "paid" :
          normalized === "failed" ? "failed" :
          "attempted";

        const rawPayload: Record<string, string> = {};
        form.forEach((v, k) => { rawPayload[k] = typeof v === "string" ? v : "[file]"; });

        console.info("[ccavenue] callback decision", {
          orderId,
          leadCode: leadCodeFromParam || null,
          isBrowser,
          postedStatus: orderStatus,
          normalized,
          newStatus,
        });

        const { error: paymentUpdateError } = await supabaseAdmin
          .from("payments")
          .update({
            status: newStatus,
            razorpay_payment_id: trackingId || null,
            payment_date: newStatus === "paid" ? new Date().toISOString() : null,
            webhook_response: rawPayload,
            raw_response: { tracking_id: trackingId, order_status: orderStatus, ...payload } as any,
          })
          .eq("id", payment.id);
        if (paymentUpdateError) {
          console.error("[ccavenue] payment update failed", { orderId, error: paymentUpdateError });
          return isBrowser
            ? redirectToPending(leadCodeFromParam || orderId)
            : new Response("payment-update-failed", { status: 200 });
        }

        if (newStatus === "paid") {
          const { error: leadUpdateError } = await supabaseAdmin
            .from("leads")
            .update({ status: "payment_successful" })
            .eq("id", payment.lead_id);
          if (leadUpdateError) {
            console.error("[ccavenue] lead update failed", { orderId, leadId: payment.lead_id, error: leadUpdateError });
          }

          if (payment.application_id) {
            const { transitionStatusSystem } = await import("@/lib/applications/transitions.server");
            const tr = await transitionStatusSystem({
              applicationId: payment.application_id,
              toStatus: "payment_received",
              reason: "CCAvenue webhook payment success",
              metadata: { orderId, trackingId },
            });
            if (!tr.ok) console.error("[ccavenue] transition failed", { orderId, applicationId: payment.application_id, reason: tr.reason });
          }

          try { await generateInvoiceInternal(payment.id); }
          catch (e) { console.error("[ccavenue] invoice generation failed", e); }

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
          } catch (e) { console.error("[ccavenue] payment_success email enqueue failed", e); }

          return isBrowser
            ? redirectToSuccess(leadCodeFromParam || orderId)
            : new Response("OK", { status: 200 });
        }

        if (newStatus === "failed") {
          await supabaseAdmin.from("leads")
            .update({ status: "payment_pending" })
            .eq("id", payment.lead_id);
          return isBrowser
            ? redirectToFailure(leadCodeFromParam || orderId, failureMessage || "Payment failed")
            : new Response("OK", { status: 200 });
        }

        return isBrowser
          ? redirectToPending(leadCodeFromParam || orderId)
          : new Response("OK", { status: 200 });
      },
    },
  },
});

const APP_ORIGIN = process.env.APP_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  "https://udyamadhar.everythinghappens.in";

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
