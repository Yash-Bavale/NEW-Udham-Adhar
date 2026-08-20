import { createFileRoute } from "@tanstack/react-router";
import { generateInvoiceInternal } from "@/lib/crm/invoices.functions";

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
        const { callOrderStatusApi, decryptResponse, getCcavCreds, normalizeCcavStatus, parseCcavPayload } =
          await import("@/lib/payments/ccavenue.server");
        let creds: ReturnType<typeof getCcavCreds>;
        try {
          creds = getCcavCreds();
        } catch (e) {
          console.error("[ccavenue] not configured", e);
          return new Response("Gateway not configured", { status: 500 });
        }

        const form = await readFormFields(request);
        if (!form) {
          return new Response("Unsupported payload", { status: 400 });
        }
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

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

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
        const amountMismatch = Boolean(amount) && Number(amount) !== Number(payment.amount);
        let reconciliationFailed = false;
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
            reconciliationFailed = true;
            console.error("[ccavenue] status api lookup failed", { orderId, error: e });
          }
        }

        // Never auto-confirm a payment whose amount disagrees with our record
        // when the Status API could not vouch for it — hold it for manual review.
        if (amountMismatch && reconciliationFailed && normalized === "paid") {
          console.error("[ccavenue] amount mismatch unverified, holding as attempted", {
            orderId,
            postedAmount: amount,
            expectedAmount: payment.amount,
          });
          normalized = "attempted";
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

          let invoiceAttachment: { filename: string; content_base64: string; content_type: string } | null = null;
          let invoiceRow: any = null;
          try {
            await generateInvoiceInternal(payment.id);
            const { loadInvoiceAttachmentByPayment } = await import("@/lib/crm/invoices.functions");
            invoiceAttachment = await loadInvoiceAttachmentByPayment(payment.id);
            const { data: inv } = await supabaseAdmin
              .from("invoices")
              .select("invoice_number, issued_at, sac_code, place_of_supply, cgst_amount, sgst_amount, igst_amount, base_amount, gst_amount, total_amount")
              .eq("payment_id", payment.id)
              .maybeSingle();
            invoiceRow = inv;
          } catch (e) { console.error("[ccavenue] invoice generation failed", e); }

          try {
            const { data: leadRow } = await supabaseAdmin
              .from("leads")
              .select("lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount")
              .eq("id", payment.lead_id)
              .maybeSingle();
            if (leadRow?.email && leadRow.lead_code) {
              const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
              const { markInvoiceEmailedByPayment } = await import("@/lib/crm/invoices.functions");
              const { amountInWordsINR } = await import("@/lib/invoices/amount-in-words");
              const { resolveApplicationCode } = await import("@/lib/orders/resolve-order-number.server");
              const orderNumber = await resolveApplicationCode(payment.lead_id, { applicationId: payment.application_id });
              if (!orderNumber) {
                throw new Error("Order number not ready yet — E001 email was not sent.");
              }
              const onboardingUrl = `${APP_ORIGIN}/onboarding/${encodeURIComponent(leadRow.lead_code)}`;
              const invoiceUrl = `${APP_ORIGIN}/api/public/invoice/${encodeURIComponent(leadRow.lead_code)}`;
              const total = Number(invoiceRow?.total_amount ?? leadRow.total_amount ?? 0);
              const issued = invoiceRow?.issued_at ? new Date(invoiceRow.issued_at) : new Date();
              try {
                await enqueueFromTemplateInternal(
                  "order_confirmation",
                  leadRow.email,
                  {
                    name: leadRow.name ?? "",
                    customer_name: leadRow.name ?? "",
                    customer_email: leadRow.email,
                    customer_mobile: leadRow.mobile ?? "",
                    lead_code: leadRow.lead_code,
                    order_number: orderNumber,
                    service: leadRow.service ?? "",
                    service_name: leadRow.service ?? "",
                    base_amount: Number(invoiceRow?.base_amount ?? leadRow.base_amount ?? 0).toFixed(2),
                    gst_amount: Number(invoiceRow?.gst_amount ?? leadRow.gst_amount ?? 0).toFixed(2),
                    total_amount: total.toFixed(2),
                    amount: total.toFixed(2),
                    amount_in_words: amountInWordsINR(total),
                    invoice_number: invoiceRow?.invoice_number ?? "",
                    invoice_date: issued.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
                    sac_code: invoiceRow?.sac_code ?? "998311",
                    place_of_supply: invoiceRow?.place_of_supply ?? "Maharashtra",
                    cgst_amount: Number(invoiceRow?.cgst_amount ?? 0).toFixed(2),
                    sgst_amount: Number(invoiceRow?.sgst_amount ?? 0).toFixed(2),
                    igst_amount: Number(invoiceRow?.igst_amount ?? 0).toFixed(2),
                    onboarding_url: onboardingUrl,
                    form_link: onboardingUrl,
                    invoice_url: invoiceUrl,
                    invoice_download_url: invoiceUrl,
                    transaction_id: trackingId || orderId || payment.id,
                    payment_reference: trackingId || orderId || payment.id,
                    payment_datetime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST",
                    payment_date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST",
                    service_fee: Number(invoiceRow?.base_amount ?? leadRow.base_amount ?? 0).toFixed(2),
                    support_email: "help@businesshelpservices.com",
                  },
                  {
                    toName: leadRow.name ?? undefined,
                    leadId: payment.lead_id,
                    applicationId: payment.application_id ?? undefined,
                    attachments: invoiceAttachment ? [invoiceAttachment] : undefined,
                  },
                );

                await markInvoiceEmailedByPayment(payment.id, {
                  recipient: leadRow.email,
                  template: "order_confirmation",
                  attachmentFilename: invoiceAttachment?.filename ?? null,
                  success: true,
                  actorLabel: "ccavenue-webhook",
                });
              } catch (e) {
                await markInvoiceEmailedByPayment(payment.id, {
                  recipient: leadRow.email,
                  template: "order_confirmation",
                  attachmentFilename: invoiceAttachment?.filename ?? null,
                  success: false,
                  error: e instanceof Error ? e.message : String(e),
                  actorLabel: "ccavenue-webhook",
                });
                throw e;
              }
            }
          } catch (e) { console.error("[ccavenue] order_confirmation email enqueue failed", e); }


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
  "https://udyamadhar.in";

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

async function readFormFields(request: Request): Promise<URLSearchParams | null> {
  const ct = (request.headers.get("content-type") ?? "").toLowerCase();
  try {
    if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
      const fd = await request.formData();
      const params = new URLSearchParams();
      for (const [k, v] of fd.entries()) params.append(k, typeof v === "string" ? v : "");
      return params;
    }
    const body = await request.text();
    if (!body) return new URLSearchParams();
    if (ct.includes("application/json") || body.trimStart().startsWith("{")) {
      const json = JSON.parse(body) as Record<string, unknown>;
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(json)) params.append(k, v == null ? "" : String(v));
      return params;
    }
    return new URLSearchParams(body);
  } catch {
    return null;
  }
}
