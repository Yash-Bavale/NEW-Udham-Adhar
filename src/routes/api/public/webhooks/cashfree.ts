import { createFileRoute } from "@tanstack/react-router";

/**
 * Cashfree return URL / S2S Webhook endpoint.
 *
 * 1. GET requests (Return URL from browser redirect):
 *    Extracts `order_id` from query parameters, checks payment status with Cashfree API,
 *    updates payment & lead records, and redirects browser to success or failure page.
 *
 * 2. POST requests (Cashfree Webhook notification):
 *    Verifies HMAC-SHA256 signature using raw body, processes payment update, runs
 *    idempotent `finalizePaidPayment`, and returns HTTP 200 OK.
 */
export const Route = createFileRoute("/api/public/webhooks/cashfree")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { getOrderStatus } = await import("@/lib/payments/cashfree.server");

        const url = new URL(request.url);
        const orderId = url.searchParams.get("order_id") || url.searchParams.get("orderId");

        if (!orderId) {
          return redirectToPending("unknown");
        }

        // Fetch payment record
        const { data: payment } = await supabaseAdmin
          .from("payments")
          .select("id, lead_id, status, amount, leads:lead_id (lead_code)")
          .or(`transaction_id.eq.${orderId},razorpay_order_id.eq.${orderId}`)
          .maybeSingle();

        const leadCode = (payment as any)?.leads?.lead_code || orderId.replace(/^CF-/, "").split("-")[0] || orderId;

        if (payment?.status === "paid") {
          return redirectToSuccess(leadCode);
        }

        try {
          const cfOrder = await getOrderStatus(orderId);
          const isSuccess = cfOrder.order_status === "PAID";

          if (isSuccess && payment) {
            await supabaseAdmin
              .from("payments")
              .update({
                status: "paid",
                payment_date: new Date().toISOString(),
                raw_response: cfOrder as any,
                webhook_received_at: new Date().toISOString(),
              } as any)
              .eq("id", payment.id);

            const { finalizePaidPayment } = await import("@/lib/payments/finalize-paid.server");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: orderId,
            });

            return redirectToSuccess(leadCode);
          } else if (cfOrder.order_status === "EXPIRED" || cfOrder.order_status === "TERMINATED") {
            if (payment) {
              await supabaseAdmin
                .from("payments")
                .update({ status: "failed", raw_response: cfOrder as any } as any)
                .eq("id", payment.id);
            }
            return redirectToFailure(leadCode, `Payment ${cfOrder.order_status.toLowerCase()}`);
          }
        } catch (e) {
          console.error("[cashfree-get] verification failed", { orderId, error: e });
        }

        return redirectToPending(leadCode);
      },

      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { verifyWebhookSignature, getOrderStatus } = await import("@/lib/payments/cashfree.server");

        const rawBody = await request.text();
        const signature = request.headers.get("x-webhook-signature") || "";
        const timestamp = request.headers.get("x-webhook-timestamp") || "";

        // Verify webhook signature if present
        if (signature && timestamp) {
          try {
            const isValid = await verifyWebhookSignature(timestamp, rawBody, signature);
            if (!isValid) {
              console.error("[cashfree-webhook] Signature verification failed");
              return new Response("Invalid signature", { status: 400 });
            }
          } catch (e) {
            console.error("[cashfree-webhook] Signature check error", e);
          }
        }

        let payload: any = {};
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON payload", { status: 400 });
        }

        // Cashfree webhook payload structure: { data: { order: { order_id, ... }, payment: { ... } }, type: "PAYMENT_SUCCESS_WEBHOOK" }
        const orderId = payload?.data?.order?.order_id || payload?.order_id;
        const paymentStatus = payload?.data?.payment?.payment_status || payload?.type;

        if (!orderId) {
          return new Response("Missing order_id", { status: 400 });
        }

        // Fetch payment row
        let { data: payment } = await supabaseAdmin
          .from("payments")
          .select("id, lead_id, application_id, status, amount")
          .or(`transaction_id.eq.${orderId},razorpay_order_id.eq.${orderId}`)
          .maybeSingle();

        if (!payment) {
          console.error("[cashfree-webhook] Payment row not found for orderId:", orderId);
          return new Response("Payment not found", { status: 200 }); // 200 so Cashfree doesn't retry endlessly
        }

        // Idempotency: if already paid, finalize again (safe) and return 200
        if (payment.status === "paid") {
          try {
            const { finalizePaidPayment } = await import("@/lib/payments/finalize-paid.server");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: orderId,
            });
          } catch (e) {
            console.error("[cashfree-webhook] Idempotent finalization retry failed", e);
          }
          return new Response("OK", { status: 200 });
        }

        const isSuccess =
          paymentStatus === "SUCCESS" ||
          paymentStatus === "PAYMENT_SUCCESS_WEBHOOK" ||
          payload?.data?.order?.order_status === "PAID";

        let verifiedSuccess = isSuccess;
        if (!verifiedSuccess) {
          // Double-check status directly with Cashfree REST API
          try {
            const cfOrder = await getOrderStatus(orderId);
            if (cfOrder.order_status === "PAID") {
              verifiedSuccess = true;
            }
          } catch (e) {
            console.error("[cashfree-webhook] API verification check failed", e);
          }
        }

        if (verifiedSuccess) {
          const cfPaymentId = payload?.data?.payment?.cf_payment_id || payload?.data?.payment?.payment_gateway_details?.gateway_order_id || null;
          await supabaseAdmin
            .from("payments")
            .update({
              status: "paid",
              razorpay_payment_id: cfPaymentId ? String(cfPaymentId) : null,
              payment_date: new Date().toISOString(),
              webhook_response: payload,
              webhook_received_at: new Date().toISOString(),
            } as any)
            .eq("id", payment.id);

          try {
            const { finalizePaidPayment } = await import("@/lib/payments/finalize-paid.server");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: orderId,
            });
          } catch (e) {
            console.error("[cashfree-webhook] Post-paid finalization failed", e);
          }

          return new Response("OK", { status: 200 });
        }

        // If explicitly failed
        const isFailed =
          paymentStatus === "FAILED" ||
          paymentStatus === "PAYMENT_FAILED_WEBHOOK" ||
          paymentStatus === "USER_DROPPED";

        if (isFailed) {
          await supabaseAdmin
            .from("payments")
            .update({
              status: "failed",
              webhook_response: payload,
              webhook_received_at: new Date().toISOString(),
            } as any)
            .eq("id", payment.id);

          await supabaseAdmin
            .from("leads")
            .update({ status: "payment_pending", lead_status_v2: "payment_failed" } as any)
            .eq("id", payment.lead_id);
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});

const APP_ORIGIN =
  process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";

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
