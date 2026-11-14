import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, n as number, _ as _enum } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
const COMPANY_STATE = (process.env.COMPANY_STATE ?? "Maharashtra").trim();
const COMPANY_GSTIN = (process.env.COMPANY_GSTIN ?? "27COFPD1743E2ZB").trim() || null;
const DEFAULT_SAC = "998311";
const GST_RATE = 18;
const BUCKET = "invoices";
async function logInvoiceEvent(invoiceId, eventType, detail = {}, actor) {
  try {
    const admin = await getAdmin();
    await admin.from("invoice_events").insert({
      invoice_id: invoiceId,
      event_type: eventType,
      actor_id: actor?.id ?? null,
      actor_label: actor?.label ?? "system",
      detail
    });
  } catch (e) {
    console.error("[invoice_events] log failed", e);
  }
}
async function generateAndStore(paymentId, actor) {
  const admin = await getAdmin();
  const {
    data: payment,
    error: pErr
  } = await admin.from("payments").select("id, lead_id, application_id, amount, base_amount, gst_amount, gateway_name, transaction_id, payment_date, created_at, status").eq("id", paymentId).single();
  if (pErr || !payment) throw new Error(pErr?.message ?? "Payment not found");
  if (payment.status !== "paid") throw new Error("Invoice can only be generated for paid payments");
  const {
    data: lead
  } = await admin.from("leads").select("id, lead_code, name, email, mobile, state, service, service_id, gstin").eq("id", payment.lead_id).single();
  if (!lead) throw new Error("Lead not found");
  let applicationCode = null;
  if (payment.application_id) {
    const {
      data: app
    } = await admin.from("applications").select("application_code").eq("id", payment.application_id).maybeSingle();
    applicationCode = app?.application_code ?? null;
  }
  let sacCode = DEFAULT_SAC;
  if (lead.service_id) {
    const {
      data: svc
    } = await admin.from("services").select("sac_code").eq("id", lead.service_id).maybeSingle();
    if (svc?.sac_code) sacCode = svc.sac_code;
  }
  const {
    data: existing
  } = await admin.from("invoices").select("id, invoice_number, pdf_path, customer_gstin_snapshot").eq("payment_id", paymentId).is("cancelled_at", null).maybeSingle();
  const customerState = (lead.state ?? "").trim();
  const isIntraState = !!customerState && customerState.toLowerCase() === COMPANY_STATE.toLowerCase();
  const gstTotal = Number(payment.gst_amount);
  const cgst = isIntraState ? gstTotal / 2 : 0;
  const sgst = isIntraState ? gstTotal / 2 : 0;
  const igst = isIntraState ? 0 : gstTotal;
  const cgstRate = isIntraState ? GST_RATE / 2 : 0;
  const sgstRate = isIntraState ? GST_RATE / 2 : 0;
  const igstRate = isIntraState ? 0 : GST_RATE;
  const snapshotFields = {
    cgst_amount: cgst,
    sgst_amount: sgst,
    igst_amount: igst,
    cgst_rate: cgstRate,
    sgst_rate: sgstRate,
    igst_rate: igstRate,
    place_of_supply: customerState || null,
    company_state_snapshot: COMPANY_STATE,
    customer_state_snapshot: customerState || null,
    company_gstin_snapshot: COMPANY_GSTIN,
    customer_gstin_snapshot: lead.gstin ?? null,
    sac_code: sacCode
  };
  let invoiceId;
  let invoiceNumber;
  if (existing) {
    invoiceId = existing.id;
    invoiceNumber = existing.invoice_number;
    if (!existing.pdf_path) {
      await admin.from("invoices").update(snapshotFields).eq("id", invoiceId);
    }
  } else {
    const {
      data: row,
      error: invErr
    } = await admin.from("invoices").insert({
      lead_id: payment.lead_id,
      application_id: payment.application_id,
      payment_id: payment.id,
      base_amount: Number(payment.base_amount),
      gst_amount: gstTotal,
      total_amount: Number(payment.amount),
      ...snapshotFields
    }).select("id, invoice_number").single();
    if (invErr?.code === "23505") {
      const {
        data: winner
      } = await admin.from("invoices").select("id, invoice_number").eq("payment_id", paymentId).is("cancelled_at", null).maybeSingle();
      if (!winner) throw new Error(invErr.message);
      invoiceId = winner.id;
      invoiceNumber = winner.invoice_number;
    } else {
      if (invErr || !row) throw new Error(invErr?.message ?? "Could not create invoice");
      invoiceId = row.id;
      invoiceNumber = row.invoice_number;
    }
  }
  const data = {
    invoiceNumber,
    invoiceDate: payment.payment_date ? new Date(payment.payment_date) : new Date(payment.created_at),
    customerName: lead.name,
    customerEmail: lead.email,
    customerMobile: lead.mobile,
    customerState: lead.state,
    serviceName: lead.service,
    leadCode: lead.lead_code,
    applicationCode,
    baseAmount: Number(payment.base_amount),
    gstAmount: Number(payment.gst_amount),
    totalAmount: Number(payment.amount),
    cgstAmount: cgst,
    sgstAmount: sgst,
    igstAmount: igst,
    sacCode,
    placeOfSupply: customerState || null,
    customerGstin: (existing ? existing.customer_gstin_snapshot : lead.gstin) ?? null,
    paymentId: payment.transaction_id ?? null,
    gatewayName: payment.gateway_name
  };
  const {
    renderInvoicePdf
  } = await import("./pdf.server-Cf72Fy26.mjs");
  const pdfBytes = await renderInvoicePdf(data);
  const path = `${new Date(payment.payment_date ?? payment.created_at).getFullYear()}/${invoiceNumber}.pdf`;
  const {
    error: upErr
  } = await admin.storage.from(BUCKET).upload(path, pdfBytes, {
    contentType: "application/pdf",
    upsert: true
  });
  if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);
  await admin.from("invoices").update({
    pdf_path: path,
    pdf_generated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", invoiceId);
  await logInvoiceEvent(invoiceId, existing ? "regenerated" : "generated", {
    invoice_number: invoiceNumber,
    pdf_path: path,
    payment_id: paymentId
  }, actor);
  return invoiceId;
}
const generateInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  paymentId: string().uuid()
}).parse(i)).handler(createSsrRpc("7f541ec4c21fd5bf6586bd077731828f214fbdccdae3f3411fccedef33eb01a5"));
async function generateInvoiceInternal(paymentId) {
  return generateAndStore(paymentId);
}
async function loadInvoiceAttachmentByPayment(paymentId) {
  const admin = await getAdmin();
  const {
    data: inv
  } = await admin.from("invoices").select("invoice_number, pdf_path, application_id, lead_id").eq("payment_id", paymentId).is("cancelled_at", null).maybeSingle();
  if (!inv?.pdf_path) return null;
  const {
    data: blob,
    error
  } = await admin.storage.from(BUCKET).download(inv.pdf_path);
  if (error || !blob) return null;
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  const b64 = btoa(bin);
  let orderRef = inv.invoice_number;
  if (inv.application_id) {
    const {
      data: app
    } = await admin.from("applications").select("application_code").eq("id", inv.application_id).maybeSingle();
    if (app?.application_code) orderRef = app.application_code;
  } else if (inv.lead_id) {
    const {
      data: l
    } = await admin.from("leads").select("lead_code").eq("id", inv.lead_id).maybeSingle();
    if (l?.lead_code) orderRef = l.lead_code;
  }
  return {
    filename: `Invoice-${orderRef}.pdf`,
    content_base64: b64,
    content_type: "application/pdf"
  };
}
async function markInvoiceEmailedByPayment(paymentId, opts) {
  try {
    const admin = await getAdmin();
    const {
      data: inv
    } = await admin.from("invoices").select("id, email_attempts").eq("payment_id", paymentId).is("cancelled_at", null).maybeSingle();
    if (!inv?.id) return;
    const actor = {
      id: null,
      label: opts.actorLabel ?? "webhook"
    };
    if (opts.success) {
      await admin.from("invoices").update({
        last_emailed_at: (/* @__PURE__ */ new Date()).toISOString(),
        email_attempts: Number(inv.email_attempts ?? 0) + 1,
        last_email_status: "queued",
        delivery_status: "queued"
      }).eq("id", inv.id);
      await logInvoiceEvent(inv.id, "emailed", {
        recipient: opts.recipient,
        attachment: opts.attachmentFilename ?? null,
        template: opts.template
      }, actor);
    } else {
      await admin.from("invoices").update({
        last_email_status: "failed",
        delivery_status: "failed",
        email_attempts: Number(inv.email_attempts ?? 0) + 1
      }).eq("id", inv.id);
      await logInvoiceEvent(inv.id, "email_failed", {
        recipient: opts.recipient,
        template: opts.template,
        error: opts.error ?? null
      }, actor);
    }
  } catch (e) {
    console.error("[markInvoiceEmailedByPayment] failed", e);
  }
}
const resendInvoiceEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  paymentId: string().uuid()
}).parse(i)).handler(createSsrRpc("3871aad8f7aa4b63a7c3905da37ea64de043477018c4ea6a35c989eca4e9b7c2"));
const regenerateInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  invoiceId: string().uuid()
}).parse(i)).handler(createSsrRpc("19619d444b07e0eafca626f19645913442a406761552949b9d618e78465c476a"));
const regenerateAllInvoices = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("3fc0c3cf1bc3dce4cb172c070dce51713283c5ef38f03aaf95122a2d7badeca0"));
const getInvoiceSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  invoiceId: string().uuid()
}).parse(i)).handler(createSsrRpc("563e6fa692fda355cabdf62c1ea270c5a4ff7f4913a989b27f15884364d989c2"));
const listInvoices = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4ceacdfbbf9c22889f80e0c88db7c75311a897eec25a557f265f8d416f73ffb1"));
const getCustomerInvoiceUrl = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: string().min(3).max(50)
}).parse(i)).handler(createSsrRpc("bbd99b5215687dc0e22283b828ab654992dd1106b158acf3774bf9d3d97aa96b"));
const PageFilters = object({
  q: string().trim().max(120).optional(),
  status: string().optional(),
  gateway: string().optional(),
  serviceId: string().uuid().optional(),
  gstType: _enum(["cgst_sgst", "igst"]).optional(),
  from: string().optional(),
  to: string().optional(),
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(25)
});
const listPaymentsAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => PageFilters.parse(i ?? {})).handler(createSsrRpc("03772da093af34994f616823bc27ec41359870b376d9b8283c22bf1d80627fb1"));
const listInvoicesAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => PageFilters.parse(i ?? {})).handler(createSsrRpc("733c48f3386602879162d46a78ccb33ab7331e9f8b8b8bec11eb2de407b5490e"));
const getPaymentsFilterMeta = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("6b22e8814b71573e1de2d64cb074c1b83c4105412685752d3725349a6b4a743c"));
const previewInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  invoiceId: string().uuid()
}).parse(i)).handler(createSsrRpc("601f6f422fbd9c48fff7a562049f15955d4608aee15bbebe2a4bb93046170ec3"));
const replaceInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  invoiceId: string().uuid(),
  fileBase64: string().min(10),
  filename: string().max(200).optional()
}).parse(i)).handler(createSsrRpc("aadb5e10457500de8bbf781749bcfd79f4a9c145fccfaa3f17dc8cf32d937814"));
const listInvoiceEvents = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  invoiceId: string().uuid()
}).parse(i)).handler(createSsrRpc("ecb86802e09595b5aa50024a9e3ed97280264586e2c3837ecb65e39ac564dec8"));
const getInvoiceDetail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  invoiceId: string().uuid()
}).parse(i)).handler(createSsrRpc("485da0b0b57cf9ce0253228c501728e37775f078e2b910bae6d2d4246c244a58"));
const updateInvoiceGstin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  invoiceId: string().uuid(),
  gstin: string().trim().max(20),
  sendEmail: boolean().default(false)
}).parse(i)).handler(createSsrRpc("43a50e85219edf7f93f3299a04e4ae48cd6bf5283226a9775db4f7ba062221c2"));
export {
  generateAndStore,
  generateInvoice,
  generateInvoiceInternal,
  getCustomerInvoiceUrl,
  getInvoiceDetail,
  getInvoiceSignedUrl,
  getPaymentsFilterMeta,
  listInvoiceEvents,
  listInvoices,
  listInvoicesAdmin,
  listPaymentsAdmin,
  loadInvoiceAttachmentByPayment,
  markInvoiceEmailedByPayment,
  previewInvoice,
  regenerateAllInvoices,
  regenerateInvoice,
  replaceInvoice,
  resendInvoiceEmail,
  updateInvoiceGstin
};
