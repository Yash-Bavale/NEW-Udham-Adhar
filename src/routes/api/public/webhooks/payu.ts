import { createFileRoute } from "@tanstack/react-router";
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
        const { computeResponseHash, getPayUCreds, verifyPayUPayment } = await import(
          "@/lib/payments/payu.server"
        );
        let creds: ReturnType<typeof getPayUCreds>;
        try {
          creds = getPayUCreds();
        } catch (e) {
          console.error("[payu] not configured", e);
          return new Response("Gateway not configured", { status: 500 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

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
            ? redirectToPending(get("udf3") || fields.txnid)
            : new Response("payment-not-found", { status: 200 });
        }

        if (Number(fields.amount) !== Number(payment.amount)) {
          console.warn("[payu] amount mismatch", {
            txnid: fields.txnid,
            expected: payment.amount,
            received: fields.amount,
          });
        }

        // Idempotency: once paid, never let a later browser/S2S retry downgrade it.
        if (payment.status === "paid") {
          return isBrowser
            ? redirectToSuccess(get("udf3") || fields.txnid)
            : new Response("OK", { status: 200 });
        }

        const verifiedSuccess = isPayUSuccess(verifiedPayment);
        const verifiedFailure = isPayUFailure(verifiedPayment);
        if (verifiedPayment?.mihpayid && !mihpayid) mihpayid = String(verifiedPayment.mihpayid);
        if (verifiedPayment?.bank_ref_num && !bankrefnum) bankrefnum = String(verifiedPayment.bank_ref_num);
        const safeVerifiedPayment = verifiedPayment
          ? JSON.parse(JSON.stringify(verifiedPayment))
          : null;

        const newStatus: "paid" | "failed" | "attempted" =
          verifiedSuccess || normalizedStatus === "success" || normalizedStatus === "captured" ? "paid" :
          verifiedFailure ? "failed" :
          "attempted";

        const rawPayload: Record<string, string> = {};
        form.forEach((v, k) => { rawPayload[k] = typeof v === "string" ? v : "[file]"; });

        console.info("[payu] callback decision", {
          txnid: fields.txnid,
          leadCode: get("udf3") || null,
          isBrowser,
          hashMatches,
          expectedHashPrefix: expected.slice(0, 12),
          receivedHashPrefix: receivedHash.slice(0, 12),
          postedStatus: fields.status,
          normalizedStatus,
          verifiedSuccess,
          verifiedFailure,
          newStatus,
        });

        const { error: paymentUpdateError } = await supabaseAdmin.from("payments").update({
          status: newStatus,
          razorpay_payment_id: mihpayid || null,
          razorpay_signature: receivedHash,
          payment_date: newStatus === "paid" ? new Date().toISOString() : null,
          webhook_response: rawPayload,
          raw_response: { mihpayid, bankrefnum, ...fields, verified_payment: safeVerifiedPayment } as any,
          payu_mihpayid: mihpayid || null,
          payu_mode: get("mode") || null,
          payu_bank_ref_num: bankrefnum || null,
          payu_net_amount_debit: get("net_amount_debit") ? Number(get("net_amount_debit")) : null,
          payu_error_message: get("error_Message") || get("field9") || null,
          webhook_received_at: new Date().toISOString(),
          is_test_payment: (await import("@/lib/payments/payu.server")).PAYU_MODE !== "live",
        } as any).eq("id", payment.id);
        if (paymentUpdateError) {
          console.error("[payu] payment update failed", { txnid: fields.txnid, error: paymentUpdateError });
          await logWebhookError("payu", paymentUpdateError.message, rawPayload);
          return isBrowser
            ? redirectToPending(get("udf3") || fields.txnid)
            : new Response("payment-update-failed", { status: 200 });
        }

        if (newStatus === "paid") {
          try {
            // 1. Auto-create application if missing (mirrors spec 4A-1).
            let applicationId = payment.application_id as string | null;
            if (!applicationId) {
              const { data: lead } = await supabaseAdmin
                .from("leads")
                .select("id, service_id, customer_id, assigned_to")
                .eq("id", payment.lead_id)
                .maybeSingle();
              const { data: createdApp, error: appErr } = await supabaseAdmin
                .from("applications")
                .insert({
                  lead_id: payment.lead_id,
                  customer_id: lead?.customer_id ?? null,
                  service_id: lead?.service_id ?? null,
                  assigned_to: lead?.assigned_to ?? null,
                  fulfillment_status: "order_received" as any,
                } as any)
                .select("id")
                .single();
              if (appErr) {
                console.error("[payu] application auto-create failed", appErr);
                await logWebhookError("payu", `app auto-create: ${appErr.message}`, rawPayload);
              } else if (createdApp) {
                applicationId = createdApp.id;
                await supabaseAdmin.from("payments").update({ application_id: applicationId } as any).eq("id", payment.id);
              }
            }

            // 2. Flip legacy + v2 lead status to payment_successful.
            const { error: leadUpdateError } = await supabaseAdmin.from("leads")
              .update({ status: "payment_successful", lead_status_v2: "payment_successful" } as any)
              .eq("id", payment.lead_id);
            if (leadUpdateError) console.error("[payu] lead update failed", { txnid: fields.txnid, leadId: payment.lead_id, error: leadUpdateError });

            // 3. Mark payment_links for this lead as paid.
            await supabaseAdmin
              .from("payment_links" as any)
              .update({ status: "paid", paid_at: new Date().toISOString(), payment_id: payment.id } as any)
              .eq("lead_id", payment.lead_id)
              .eq("status", "pending");

            // 4. Move application's fulfillment_status forward.
            if (applicationId) {
              const { transitionStatusSystem } = await import("@/lib/applications/transitions.server");
              const tr = await transitionStatusSystem({
                applicationId,
                toStatus: "payment_received",
                reason: "PayU webhook payment success",
                metadata: { txnid: fields.txnid, mihpayid },
              });
              if (!tr.ok) console.error("[payu] transition failed", { txnid: fields.txnid, applicationId, reason: tr.reason });
            }

            // 5. Generate invoice (PDF + storage), then load PDF for attaching.
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
            } catch (e) {
              console.error("[payu] invoice generation failed", e);
              await logWebhookError("payu", `invoice: ${e instanceof Error ? e.message : "unknown"}`, rawPayload);
            }

            // 6. Send E001 order confirmation with invoice PDF attached.
            try {
              const { data: leadRow } = await supabaseAdmin
                .from("leads")
                .select("lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount")
                .eq("id", payment.lead_id)
                .maybeSingle();
              if (leadRow?.email && leadRow.lead_code) {
                const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
                const { amountInWordsINR } = await import("@/lib/invoices/amount-in-words");
                const onboardingUrl = `${APP_ORIGIN}/onboarding/${encodeURIComponent(leadRow.lead_code)}`;
                const invoiceUrl = `${APP_ORIGIN}/api/public/invoice/${encodeURIComponent(leadRow.lead_code)}`;
                const total = Number(invoiceRow?.total_amount ?? leadRow.total_amount ?? 0);
                const issued = invoiceRow?.issued_at ? new Date(invoiceRow.issued_at) : new Date();
                const commonVars = {
                  name: leadRow.name ?? "",
                  customer_name: leadRow.name ?? "",
                  customer_email: leadRow.email,
                  customer_mobile: leadRow.mobile ?? "",
                  lead_code: leadRow.lead_code,
                  leadCode: leadRow.lead_code,
                  order_number: leadRow.lead_code,
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
                  form_link: onboardingUrl,
                  onboarding_url: onboardingUrl,
                  invoice_url: invoiceUrl,
                  invoice_download_url: invoiceUrl,
                  transaction_id: mihpayid || fields.txnid || payment.id,
                  payment_datetime: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST",
                  support_email: "help@businesshelpservices.com",
                };

                // E001 — immediate order confirmation / receipt.
                try {
                  await enqueueFromTemplateInternal(
                    "order_confirmation",
                    leadRow.email,
                    commonVars,
                    {
                      toName: leadRow.name ?? undefined,
                      leadId: payment.lead_id,
                      applicationId: applicationId ?? undefined,
                      attachments: invoiceAttachment ? [invoiceAttachment] : undefined,
                    },
                  );

                  const { markInvoiceEmailedByPayment } = await import("@/lib/crm/invoices.functions");
                  await markInvoiceEmailedByPayment(payment.id, {
                    recipient: leadRow.email,
                    template: "order_confirmation",
                    attachmentFilename: invoiceAttachment?.filename ?? null,
                    success: true,
                    actorLabel: "payu-webhook",
                  });
                } catch (e) {
                  const { markInvoiceEmailedByPayment } = await import("@/lib/crm/invoices.functions");
                  await markInvoiceEmailedByPayment(payment.id, {
                    recipient: leadRow.email,
                    template: "order_confirmation",
                    attachmentFilename: invoiceAttachment?.filename ?? null,
                    success: false,
                    error: e instanceof Error ? e.message : String(e),
                    actorLabel: "payu-webhook",
                  });
                  throw e;
                }
              }
            } catch (e) {
              console.error("[payu] post-payment email enqueue failed", e);
              await logWebhookError("payu", `emails: ${e instanceof Error ? e.message : "unknown"}`, rawPayload);
            }
          } catch (e) {
            console.error("[payu] post-payment workflow failed", e);
            await logWebhookError("payu", `post-paid: ${e instanceof Error ? e.message : "unknown"}`, rawPayload);
          }

          return isBrowser
            ? redirectToSuccess(get("udf3") || fields.txnid)
            : new Response("OK", { status: 200 });
        }

        if (newStatus === "failed") {
          await supabaseAdmin.from("leads")
            .update({ status: "payment_pending", lead_status_v2: "payment_failed" } as any)
            .eq("id", payment.lead_id);
          await supabaseAdmin
            .from("payment_links" as any)
            .update({ status: "failed" } as any)
            .eq("lead_id", payment.lead_id)
            .eq("status", "pending");
          return isBrowser
            ? redirectToFailure(get("udf3") || fields.txnid, "Payment failed")
            : new Response("OK", { status: 200 });
        }

        return isBrowser
          ? redirectToPending(get("udf3") || fields.txnid)
          : new Response("OK", { status: 200 });
      },
    },
  },
});

async function logWebhookError(webhookType: string, errorMessage: string, payload: Record<string, unknown>) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("webhook_error_log" as any).insert({
      webhook_type: webhookType,
      error_message: errorMessage.slice(0, 2000),
      raw_payload: payload as any,
    } as any);
  } catch (e) {
    console.error("[webhook] error-log insert failed", e);
  }
}

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

function isPayUSuccess(payment: Record<string, unknown> | null | undefined) {
  const status = normalizePayUStatus(payment?.status);
  const unmapped = normalizePayUStatus(payment?.unmappedstatus);
  return status === "success" || unmapped === "captured";
}

function isPayUFailure(payment: Record<string, unknown> | null | undefined) {
  const status = normalizePayUStatus(payment?.status);
  const unmapped = normalizePayUStatus(payment?.unmappedstatus);
  return status === "failure" || status === "failed" || ["bounced", "dropped", "failed", "usercancelled"].includes(unmapped);
}

function normalizePayUStatus(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function shouldVerifyWithPayU(status: string) {
  return status === "success" || status === "failure" || status === "failed" || status === "";
}
