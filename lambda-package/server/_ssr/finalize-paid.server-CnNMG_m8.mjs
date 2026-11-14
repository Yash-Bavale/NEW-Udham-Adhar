import { generateInvoiceInternal, loadInvoiceAttachmentByPayment, markInvoiceEmailedByPayment } from "./invoices.functions-CoU4f0R2.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
const APP_ORIGIN = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
async function finalizePaidPayment(paymentId, opts) {
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const { data: payment } = await supabaseAdmin.from("payments").select("id, lead_id, application_id, status, transaction_id, razorpay_payment_id, amount, created_at, parent_payment_id").eq("id", paymentId).maybeSingle();
  if (!payment) throw new Error(`Payment ${paymentId} not found`);
  const { data: earlierPaid } = await supabaseAdmin.from("payments").select("id, created_at").eq("lead_id", payment.lead_id).eq("status", "paid").neq("id", payment.id).lte("created_at", payment.created_at).order("created_at", { ascending: true }).limit(1).maybeSingle();
  const isTopUp = !!earlierPaid;
  if (isTopUp && !payment.parent_payment_id) {
    await supabaseAdmin.from("payments").update({ parent_payment_id: earlierPaid.id }).eq("id", payment.id);
  }
  let applicationId = payment.application_id;
  if (!applicationId) {
    const { data: existingApp } = await supabaseAdmin.from("applications").select("id").eq("lead_id", payment.lead_id).eq("is_deleted", false).order("created_at", { ascending: true }).limit(1).maybeSingle();
    if (existingApp) {
      applicationId = existingApp.id;
    } else {
      const { data: lead } = await supabaseAdmin.from("leads").select("id, service_id, service, customer_id, assigned_to, website_id").eq("id", payment.lead_id).maybeSingle();
      let targetServiceId = lead?.service_id ?? null;
      if (!targetServiceId && lead?.service) {
        const { data: svc } = await supabaseAdmin.from("services").select("id").ilike("service_name", lead.service.trim()).maybeSingle();
        if (svc?.id) {
          targetServiceId = svc.id;
          await supabaseAdmin.from("leads").update({ service_id: svc.id }).eq("id", payment.lead_id);
        }
      }
      const { data: createdApp, error: appErr } = await supabaseAdmin.from("applications").insert({
        lead_id: payment.lead_id,
        customer_id: lead?.customer_id ?? null,
        service_id: targetServiceId,
        // Orders have their own round-robin queue. Do not inherit the lead
        // owner here, otherwise the application trigger cannot pick the next
        // employee and consecutive orders follow the lead rotation instead.
        assigned_to: null,
        website_id: lead?.website_id ?? null,
        application_status: "payment_received",
        fulfillment_status: "order_received"
      }).select("id").single();
      if (appErr?.code === "23505") {
        const { data: concurrentApp, error: concurrentAppErr } = await supabaseAdmin.from("applications").select("id").eq("lead_id", payment.lead_id).eq("is_deleted", false).maybeSingle();
        if (concurrentAppErr) console.error("[finalize] concurrent app lookup failed", concurrentAppErr);
        applicationId = concurrentApp?.id ?? null;
      } else if (appErr) {
        console.error("[finalize] app create failed", appErr);
      }
      if (createdApp) {
        applicationId = createdApp.id;
        try {
          const { autoAssignLeadOrOrder } = await import("./auto-assign.server-D-MYRWKz.mjs");
          await autoAssignLeadOrOrder({
            leadId: payment.lead_id,
            applicationId: createdApp.id,
            serviceId: targetServiceId
          });
        } catch (assignErr) {
          console.error("[finalize] Auto-assignment failed:", assignErr);
        }
      }
    }
    if (applicationId) {
      await supabaseAdmin.from("payments").update({ application_id: applicationId }).eq("id", payment.id);
    }
  }
  const payAmount = Number(payment.amount ?? 0);
  const { data: pendingLinks } = await supabaseAdmin.from("payment_links").select("id, amount, created_at").eq("lead_id", payment.lead_id).eq("status", "pending").lte("created_at", payment.created_at).order("created_at", { ascending: false });
  const matchLink = (pendingLinks ?? []).find(
    (l) => payAmount > 0 && Math.abs(Number(l.amount ?? 0) - payAmount) < 0.01
  );
  if (matchLink) {
    await supabaseAdmin.from("payment_links").update({ status: "paid", paid_at: (/* @__PURE__ */ new Date()).toISOString(), payment_id: payment.id }).eq("id", matchLink.id);
  }
  const { count: stillPending } = await supabaseAdmin.from("payment_links").select("id", { count: "exact", head: true }).eq("lead_id", payment.lead_id).eq("status", "pending");
  if (!stillPending) {
    const { error: leadErr } = await supabaseAdmin.from("leads").update({
      status: "payment_successful",
      lead_status_v2: "payment_successful"
    }).eq("id", payment.lead_id);
    if (leadErr) console.error("[finalize] lead status update failed", leadErr);
  }
  if (applicationId && !isTopUp) {
    try {
      const { transitionStatusSystem } = await import("./transitions.server-Dp22-Q6w.mjs");
      const tr = await transitionStatusSystem({
        applicationId,
        toStatus: "payment_received",
        reason: `Payment finalized (${opts.source})`,
        metadata: { txnid: opts.txnid ?? payment.transaction_id, mihpayid: opts.mihpayid ?? payment.razorpay_payment_id, source: opts.source }
      });
      if (!tr.ok) console.error("[finalize] transition failed", tr.reason);
    } catch (e) {
      console.error("[finalize] transition threw", e);
    }
  }
  let invoiceAttachment = null;
  let invoiceRow = null;
  try {
    await generateInvoiceInternal(payment.id);
    invoiceAttachment = await loadInvoiceAttachmentByPayment(payment.id);
    if (!invoiceAttachment) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      invoiceAttachment = await loadInvoiceAttachmentByPayment(payment.id);
    }
    const { data: inv } = await supabaseAdmin.from("invoices").select("invoice_number, issued_at, sac_code, place_of_supply, cgst_amount, sgst_amount, igst_amount, base_amount, gst_amount, total_amount, last_emailed_at").eq("payment_id", payment.id).is("cancelled_at", null).maybeSingle();
    invoiceRow = inv;
  } catch (e) {
    console.error("[finalize] invoice generation failed", e);
  }
  const templateKey = isTopUp ? "topup_payment_received" : "order_confirmation";
  const guardCodes = isTopUp ? ["E013", "topup_payment_received"] : ["E001", "order_confirmation"];
  const { data: existingEmailQueue } = await supabaseAdmin.from("email_queue").select("id").eq("lead_id", payment.lead_id).in("template_code", guardCodes).maybeSingle();
  const alreadyEmailed = !!invoiceRow?.last_emailed_at || !!existingEmailQueue;
  if (alreadyEmailed) {
    console.info("[finalize] E001 already queued or sent for payment, skipping", payment.id);
    return { ok: true, applicationId };
  }
  try {
    const { data: leadRow } = await supabaseAdmin.from("leads").select("lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount").eq("id", payment.lead_id).maybeSingle();
    if (leadRow?.email && leadRow.lead_code) {
      const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
      const { amountInWordsINR } = await import("./amount-in-words-B01UxNER.mjs");
      const { resolveApplicationCode } = await import("./resolve-order-number.server-BMud2UpT.mjs");
      const orderNumber = await resolveApplicationCode(payment.lead_id, { applicationId });
      if (orderNumber) {
        const onboardingUrl = `${APP_ORIGIN}/onboarding/${encodeURIComponent(leadRow.lead_code)}`;
        const invoiceUrl = `${APP_ORIGIN}/api/public/invoice/${encodeURIComponent(leadRow.lead_code)}`;
        const total = Number(invoiceRow?.total_amount ?? leadRow.total_amount ?? 0);
        const issued = invoiceRow?.issued_at ? new Date(invoiceRow.issued_at) : /* @__PURE__ */ new Date();
        const now = /* @__PURE__ */ new Date();
        const fmt = (d) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST";
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
          invoice_url: "",
          invoice_download_url: "",
          transaction_id: opts.mihpayid || opts.txnid || payment.transaction_id || payment.id,
          payment_reference: opts.mihpayid || opts.txnid || payment.transaction_id || payment.id,
          payment_datetime: fmt(now),
          payment_date: fmt(now),
          service_fee: Number(invoiceRow?.base_amount ?? leadRow.base_amount ?? 0).toFixed(2),
          support_email: "help@businesshelpservices.com"
        };
        try {
          await enqueueFromTemplateInternal(
            templateKey,
            leadRow.email,
            commonVars,
            {
              toName: leadRow.name ?? void 0,
              leadId: payment.lead_id,
              applicationId: applicationId ?? void 0,
              attachments: invoiceAttachment ? [invoiceAttachment] : void 0
            }
          );
          await markInvoiceEmailedByPayment(payment.id, {
            recipient: leadRow.email,
            template: templateKey,
            attachmentFilename: invoiceAttachment?.filename ?? null,
            success: true,
            actorLabel: `payu-${opts.source}`
          });
        } catch (e) {
          await markInvoiceEmailedByPayment(payment.id, {
            recipient: leadRow.email,
            template: templateKey,
            attachmentFilename: invoiceAttachment?.filename ?? null,
            success: false,
            error: e instanceof Error ? e.message : String(e),
            actorLabel: `payu-${opts.source}`
          });
        }
      }
    }
  } catch (e) {
    console.error("[finalize] email pipeline failed", e);
  }
  return { ok: true, applicationId };
}
export {
  finalizePaidPayment
};
