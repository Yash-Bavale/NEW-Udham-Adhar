// Post-paid workflow, shared between the PayU webhook, admin reconcile, and
// the periodic PayU reconciliation cron. Given a payments.id that is (or is
// about to be flipped to) `paid`, this:
//   1. creates the application if missing
//   2. flips the lead + payment_links to payment_successful/paid
//   3. transitions the application to payment_received
//   4. generates the invoice PDF
//   5. queues the E001 order-confirmation email with the invoice attached
//
// Fully idempotent: safe to call multiple times for the same payment.

import { generateInvoiceInternal, loadInvoiceAttachmentByPayment, markInvoiceEmailedByPayment } from "@/lib/crm/invoices.functions";

const APP_ORIGIN =
  process.env.APP_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  "https://udyamadhar.in";

type FinalizeOpts = {
  source: "webhook" | "reconcile" | "cron";
  txnid?: string | null;
  mihpayid?: string | null;
};

export async function finalizePaidPayment(paymentId: string, opts: FinalizeOpts) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: payment } = await supabaseAdmin
    .from("payments")
    .select("id, lead_id, application_id, status, transaction_id, razorpay_payment_id")
    .eq("id", paymentId)
    .maybeSingle();
  if (!payment) throw new Error(`Payment ${paymentId} not found`);

  // 1) Application
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
    if (appErr) console.error("[finalize] app create failed", appErr);
    if (createdApp) {
      applicationId = createdApp.id;
      await supabaseAdmin.from("payments").update({ application_id: applicationId } as any).eq("id", payment.id);
    }
  }

  // 2) Lead + payment_links
  await supabaseAdmin.from("leads")
    .update({ status: "payment_successful", lead_status_v2: "payment_successful" } as any)
    .eq("id", payment.lead_id);

  await supabaseAdmin
    .from("payment_links" as any)
    .update({ status: "paid", paid_at: new Date().toISOString(), payment_id: payment.id } as any)
    .eq("lead_id", payment.lead_id)
    .eq("status", "pending");

  // 3) Move application forward
  if (applicationId) {
    try {
      const { transitionStatusSystem } = await import("@/lib/applications/transitions.server");
      const tr = await transitionStatusSystem({
        applicationId,
        toStatus: "payment_received",
        reason: `Payment finalized (${opts.source})`,
        metadata: { txnid: opts.txnid ?? payment.transaction_id, mihpayid: opts.mihpayid ?? payment.razorpay_payment_id, source: opts.source },
      });
      if (!tr.ok) console.error("[finalize] transition failed", tr.reason);
    } catch (e) {
      console.error("[finalize] transition threw", e);
    }
  }

  // 4) Invoice
  let invoiceAttachment: Awaited<ReturnType<typeof loadInvoiceAttachmentByPayment>> = null;
  let invoiceRow: any = null;
  try {
    await generateInvoiceInternal(payment.id);
    invoiceAttachment = await loadInvoiceAttachmentByPayment(payment.id);
    const { data: inv } = await supabaseAdmin
      .from("invoices")
      .select("invoice_number, issued_at, sac_code, place_of_supply, cgst_amount, sgst_amount, igst_amount, base_amount, gst_amount, total_amount")
      .eq("payment_id", payment.id)
      .maybeSingle();
    invoiceRow = inv;
  } catch (e) {
    console.error("[finalize] invoice generation failed", e);
  }

  // 5) E001 email
  try {
    const { data: leadRow } = await supabaseAdmin
      .from("leads")
      .select("lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount")
      .eq("id", payment.lead_id)
      .maybeSingle();
    if (leadRow?.email && leadRow.lead_code) {
      const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
      const { amountInWordsINR } = await import("@/lib/invoices/amount-in-words");
      const { resolveApplicationCode } = await import("@/lib/orders/resolve-order-number.server");
      const orderNumber = await resolveApplicationCode(payment.lead_id, { applicationId });
      if (orderNumber) {
        const onboardingUrl = `${APP_ORIGIN}/onboarding/${encodeURIComponent(leadRow.lead_code)}`;
        const invoiceUrl = `${APP_ORIGIN}/api/public/invoice/${encodeURIComponent(leadRow.lead_code)}`;
        const total = Number(invoiceRow?.total_amount ?? leadRow.total_amount ?? 0);
        const issued = invoiceRow?.issued_at ? new Date(invoiceRow.issued_at) : new Date();
        const now = new Date();
        const fmt = (d: Date) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST";
        const commonVars = {
          name: leadRow.name ?? "",
          customer_name: leadRow.name ?? "",
          customer_email: leadRow.email,
          customer_mobile: leadRow.mobile ?? "",
          lead_code: leadRow.lead_code,
          leadCode: leadRow.lead_code,
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
          form_link: onboardingUrl,
          onboarding_url: onboardingUrl,
          invoice_url: invoiceUrl,
          invoice_download_url: invoiceUrl,
          transaction_id: opts.mihpayid || opts.txnid || payment.transaction_id || payment.id,
          payment_reference: opts.mihpayid || opts.txnid || payment.transaction_id || payment.id,
          payment_datetime: fmt(now),
          payment_date: fmt(now),
          service_fee: Number(invoiceRow?.base_amount ?? leadRow.base_amount ?? 0).toFixed(2),
          support_email: "help@businesshelpservices.com",
        };
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
          await markInvoiceEmailedByPayment(payment.id, {
            recipient: leadRow.email,
            template: "order_confirmation",
            attachmentFilename: invoiceAttachment?.filename ?? null,
            success: true,
            actorLabel: `payu-${opts.source}`,
          });
        } catch (e) {
          await markInvoiceEmailedByPayment(payment.id, {
            recipient: leadRow.email,
            template: "order_confirmation",
            attachmentFilename: invoiceAttachment?.filename ?? null,
            success: false,
            error: e instanceof Error ? e.message : String(e),
            actorLabel: `payu-${opts.source}`,
          });
        }
      }
    }
  } catch (e) {
    console.error("[finalize] email pipeline failed", e);
  }

  return { ok: true, applicationId };
}
