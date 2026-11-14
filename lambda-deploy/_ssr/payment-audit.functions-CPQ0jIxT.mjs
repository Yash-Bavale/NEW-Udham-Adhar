import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
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
const num = (v) => Number(v ?? 0);
const money = (v) => `₹${num(v).toLocaleString("en-IN", {
  maximumFractionDigits: 2
})}`;
const auditOrderPayments_createServerFn_handler = createServerRpc({
  id: "cb0dcac84b823bc63911ae523fd36e8bff736727bc7280844feade19352c0107",
  name: "auditOrderPayments",
  filename: "src/lib/payments/payment-audit.functions.ts"
}, (opts) => auditOrderPayments.__executeServer(opts));
const auditOrderPayments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  code: string().min(3)
})).handler(auditOrderPayments_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "finance", "accounts"]);
  const db = await getAdmin();
  const code = data.code.trim().toUpperCase();
  let application = null;
  let leadId = null;
  if (code.startsWith("AP")) {
    const {
      data: app
    } = await db.from("applications").select("id, application_code, lead_id, customer_id, order_status, fulfillment_status, created_at").eq("application_code", code).maybeSingle();
    if (!app) throw new Error(`No order found for ${code}`);
    application = app;
    leadId = app.lead_id;
  } else {
    const {
      data: lead2
    } = await db.from("leads").select("id").eq("lead_code", code).maybeSingle();
    if (!lead2) throw new Error(`No lead found for ${code}`);
    leadId = lead2.id;
    const {
      data: app
    } = await db.from("applications").select("id, application_code, lead_id, customer_id, order_status, fulfillment_status, created_at").eq("lead_id", leadId).order("created_at", {
      ascending: true
    }).limit(1).maybeSingle();
    application = app ?? null;
  }
  const applicationId = application?.["id"] ?? null;
  const {
    data: lead
  } = leadId ? await db.from("leads").select("id, lead_code, name, email, status, lead_status_v2, created_at").eq("id", leadId).maybeSingle() : {
    data: null
  };
  const [paymentsRes, linksRes, invoicesRes, emailsRes, historyRes] = await Promise.all([db.from("payments").select("id, amount, base_amount, gst_amount, status, gateway_name, transaction_id, payu_mihpayid, razorpay_payment_id, parent_payment_id, payment_date, created_at, application_id, lead_id").eq(leadId ? "lead_id" : "application_id", leadId ?? applicationId).order("created_at", {
    ascending: true
  }), leadId ? db.from("payment_links").select("id, txnid, amount, status, payment_id, created_at, paid_at, expires_at").eq("lead_id", leadId).order("created_at", {
    ascending: true
  }) : Promise.resolve({
    data: []
  }), leadId ? db.from("invoices").select("id, invoice_number, payment_id, total_amount, issued_at, last_emailed_at, pdf_path").eq("lead_id", leadId).order("issued_at", {
    ascending: true
  }) : Promise.resolve({
    data: []
  }), db.from("email_logs").select("id, template_code, to_email, subject, status, sent_at").or([leadId ? `lead_id.eq.${leadId}` : null, applicationId ? `application_id.eq.${applicationId}` : null].filter(Boolean).join(",")).order("sent_at", {
    ascending: true
  }).limit(200), applicationId ? db.from("application_status_history").select("id, from_status, to_status, reason, created_at").eq("application_id", applicationId).order("created_at", {
    ascending: true
  }) : Promise.resolve({
    data: []
  })]);
  const payments = (paymentsRes.data ?? []).filter((p) => !applicationId || !p.application_id || p.application_id === applicationId);
  const links = linksRes.data ?? [];
  const invoices = invoicesRes.data ?? [];
  const emails = emailsRes.data ?? [];
  const history = historyRes.data ?? [];
  const paid = payments.filter((p) => p.status === "paid");
  const paidTotal = paid.reduce((s, p) => s + num(p.amount), 0);
  const invoiceTotal = invoices.reduce((s, i) => s + num(i.total_amount), 0);
  const gatewayRef = (p) => p.transaction_id || p.payu_mihpayid || p.razorpay_payment_id || null;
  const checks = [];
  const add = (id, label, severity, detail) => checks.push({
    id,
    label,
    severity,
    detail
  });
  add("order", "Order record", application ? "ok" : "warn", application ? `${application["application_code"]} · status ${application["order_status"] ?? "—"} / ${application["fulfillment_status"] ?? "—"}` : "No AP order linked to this lead yet");
  const missingRef = paid.filter((p) => !gatewayRef(p));
  add("gateway_ref", "Gateway reference on paid payments", paid.length === 0 ? "warn" : missingRef.length ? "error" : "ok", paid.length === 0 ? "No paid payment recorded" : missingRef.length ? `${missingRef.length} paid payment(s) have no gateway transaction id — cannot be reconciled with the gateway` : paid.map((p) => `${p.gateway_name ?? "?"} ${gatewayRef(p)} (${money(p.amount)})`).join(", "));
  const invoiceByPayment = new Map(invoices.map((i) => [i.payment_id, i]));
  const missingInvoice = paid.filter((p) => !invoiceByPayment.has(p.id));
  add("invoice_coverage", "Invoice per paid payment", paid.length === 0 ? "warn" : missingInvoice.length ? "error" : "ok", paid.length === 0 ? "No paid payment to invoice" : missingInvoice.length ? `${missingInvoice.length} paid payment(s) without an invoice` : `${invoices.length} invoice(s): ${invoices.map((i) => i.invoice_number ?? i.id.slice(0, 8)).join(", ")}`);
  const delta = Math.round((paidTotal - invoiceTotal) * 100) / 100;
  add("amount_match", "Paid total vs invoiced total", paid.length === 0 ? "warn" : Math.abs(delta) > 0.5 ? "error" : "ok", `Paid ${money(paidTotal)} · Invoiced ${money(invoiceTotal)}${Math.abs(delta) > 0.5 ? ` · difference ${money(delta)}` : ""}`);
  const now = Date.now();
  const pendingLinks = links.filter((l) => l.status === "pending");
  const stalePending = pendingLinks.filter((l) => l.expires_at && new Date(l.expires_at).getTime() < now);
  const paidLinksNoPayment = links.filter((l) => l.status === "paid" && !l.payment_id);
  add("payment_links", "Payment links", paidLinksNoPayment.length ? "error" : pendingLinks.length ? "warn" : "ok", [`${links.length} link(s)`, pendingLinks.length ? `${pendingLinks.length} pending (${money(pendingLinks.reduce((s, l) => s + num(l.amount), 0))})` : null, stalePending.length ? `${stalePending.length} expired but still pending` : null, paidLinksNoPayment.length ? `${paidLinksNoPayment.length} marked paid with no payment row` : null].filter(Boolean).join(" · "));
  const leadStatus = lead?.status ?? null;
  const leadStatusV2 = lead?.lead_status_v2 ?? null;
  let leadSeverity = "ok";
  let leadDetail = `status ${leadStatus ?? "—"} / v2 ${leadStatusV2 ?? "—"}`;
  if (paid.length > 0 && pendingLinks.length === 0 && leadStatus !== "payment_successful") {
    leadSeverity = "error";
    leadDetail += " — payment settled but lead is not marked payment_successful";
  } else if (paid.length === 0 && leadStatus === "payment_successful") {
    leadSeverity = "error";
    leadDetail += " — lead marked payment_successful with no settled payment";
  } else if (paid.length > 0 && pendingLinks.length > 0) {
    leadSeverity = "warn";
    leadDetail += " — top-up link outstanding, lead intentionally kept in payment_pending";
  }
  add("lead_status", "Lead status vs payments", leadSeverity, leadDetail);
  add("transitions", "Order status transitions", history.length === 0 && paid.length > 0 ? "warn" : "ok", history.length === 0 ? "No transitions recorded" : `${history.length} transition(s), latest: ${history[history.length - 1]?.from_status ?? "—"} → ${history[history.length - 1]?.to_status}`);
  const codes = emails.map((e) => e.template_code ?? "");
  const e001 = emails.filter((e) => e.template_code === "E001" || e.template_code === "order_confirmation" || e.template_code === "payment_success");
  const topUps = paid.filter((p) => p.parent_payment_id);
  const e013 = emails.filter((e) => e.template_code === "E013" || e.template_code === "topup_payment_received");
  const emailIssues = [];
  if (paid.length > 0 && e001.length === 0) emailIssues.push("no order-confirmation (E001) email sent for the settled payment");
  if (e001.length > 1) emailIssues.push(`${e001.length} order-confirmation emails sent (duplicate)`);
  if (topUps.length > e013.length) emailIssues.push(`${topUps.length} top-up payment(s) but only ${e013.length} top-up (E013) email(s)`);
  const failedEmails = emails.filter((e) => e.status !== "sent");
  if (failedEmails.length) emailIssues.push(`${failedEmails.length} email(s) failed/bounced`);
  add("emails", "Email sends", emailIssues.length ? paid.length && e001.length === 0 ? "error" : "warn" : "ok", emailIssues.length ? emailIssues.join(" · ") : `${emails.length} email(s) logged${codes.length ? ` (${[...new Set(codes.filter(Boolean))].join(", ")})` : ""}`);
  const undelivered = invoices.filter((i) => !i.last_emailed_at);
  add("invoice_delivery", "Invoice delivery", invoices.length === 0 ? "warn" : undelivered.length ? "warn" : "ok", invoices.length === 0 ? "No invoices" : undelivered.length ? `${undelivered.length} invoice(s) never emailed` : "All invoices emailed");
  const errors = checks.filter((c) => c.severity === "error").length;
  const warnings = checks.filter((c) => c.severity === "warn").length;
  return {
    code,
    verdict: errors ? "mismatch" : warnings ? "review" : "clean",
    errors,
    warnings,
    checks,
    order: application ? {
      code: application["application_code"],
      orderStatus: application["order_status"] ?? null,
      fulfillmentStatus: application["fulfillment_status"] ?? null,
      createdAt: application["created_at"]
    } : null,
    lead: lead ? {
      code: lead.lead_code,
      name: lead.name,
      email: lead.email,
      status: leadStatus,
      statusV2: leadStatusV2
    } : null,
    payments: payments.map((p) => ({
      id: p.id,
      amount: num(p.amount),
      status: p.status,
      gateway: p.gateway_name,
      reference: gatewayRef(p),
      isTopUp: Boolean(p.parent_payment_id),
      at: p.payment_date ?? p.created_at,
      invoice: invoiceByPayment.get(p.id)?.invoice_number ?? null
    })),
    links: links.map((l) => ({
      id: l.id,
      txnid: l.txnid,
      amount: num(l.amount),
      status: l.status,
      createdAt: l.created_at
    })),
    invoices: invoices.map((i) => ({
      id: i.id,
      number: i.invoice_number,
      total: num(i.total_amount),
      issuedAt: i.issued_at,
      emailedAt: i.last_emailed_at
    })),
    transitions: history.map((h) => ({
      from: h.from_status,
      to: h.to_status,
      reason: h.reason,
      at: h.created_at
    })),
    emails: emails.map((e) => ({
      id: e.id,
      code: e.template_code,
      to: e.to_email,
      subject: e.subject,
      status: e.status,
      at: e.sent_at
    })),
    totals: {
      paid: paidTotal,
      invoiced: invoiceTotal,
      delta
    }
  };
});
export {
  auditOrderPayments_createServerFn_handler
};
