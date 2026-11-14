import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, a as array } from "../_libs/zod.mjs";
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
const COMPANY_EMAIL = "help@businesshelpservices.com";
const AUTHORIZED_ROLES = ["admin", "super_admin", "operations", "finance", "accounts", "manager", "executive"];
const searchDisputeOrder_createServerFn_handler = createServerRpc({
  id: "2ece10d34e38bb933b9ca68e29595220cb39787cd35a25f4fa9d77f44212d539",
  name: "searchDisputeOrder",
  filename: "src/lib/disputes/dispute-manager.functions.ts"
}, (opts) => searchDisputeOrder.__executeServer(opts));
const searchDisputeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderQuery: string().min(1)
}).parse(i)).handler(searchDisputeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, AUTHORIZED_ROLES);
  const admin = await getAdmin();
  const query = data.orderQuery.trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);
  let app = null;
  if (isUuid) {
    const {
      data: res
    } = await admin.from("applications").select("*").eq("id", query).maybeSingle();
    app = res;
  }
  if (!app) {
    const {
      data: res
    } = await admin.from("applications").select("*").ilike("application_code", query).order("created_at", {
      ascending: false
    }).limit(1).maybeSingle();
    app = res;
  }
  if (!app) {
    const {
      data: leadMatch
    } = await admin.from("leads").select("id").ilike("lead_code", query).limit(1).maybeSingle();
    if (leadMatch) {
      const {
        data: res
      } = await admin.from("applications").select("*").eq("lead_id", leadMatch.id).order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      app = res;
    }
  }
  if (!app) {
    return null;
  }
  const applicationId = app.id;
  const leadId = app.lead_id;
  const {
    data: leadRow
  } = leadId ? await admin.from("leads").select("*").eq("id", leadId).maybeSingle() : {
    data: null
  };
  const lead = leadRow || {};
  const [paymentsRes, invoicesRes, certificatesRes, emailLogsRes, emailQueueRes, eventsRes, profileRes, historyRes] = await Promise.all([admin.from("payments").select("*").eq("application_id", applicationId).order("created_at", {
    ascending: false
  }), admin.from("invoices").select("*").or(`application_id.eq.${applicationId},lead_id.eq.${leadId}`).order("created_at", {
    ascending: false
  }), admin.from("certificates").select("*").or(`application_id.eq.${applicationId},lead_id.eq.${leadId}`).order("created_at", {
    ascending: false
  }), admin.from("email_logs").select("*").or(`application_id.eq.${applicationId},lead_id.eq.${leadId}`).order("sent_at", {
    ascending: false
  }), admin.from("email_queue").select("*").or(`application_id.eq.${applicationId},lead_id.eq.${leadId}`).order("created_at", {
    ascending: false
  }), admin.from("application_events").select("*").eq("application_id", applicationId).order("created_at", {
    ascending: false
  }), app.assigned_to ? admin.from("profiles").select("id, display_name, email").eq("id", app.assigned_to).maybeSingle() : Promise.resolve({
    data: null
  }), admin.from("dispute_evidence_records").select("*").eq("order_id", applicationId).order("generated_at", {
    ascending: false
  })]);
  const payments = paymentsRes.data ?? [];
  const successfulPayment = payments.find((p) => ["paid", "success", "successful", "completed"].includes(String(p.status || "").toLowerCase())) || payments[0] || null;
  const invoices = invoicesRes.data ?? [];
  const latestInvoice = invoices[0] || null;
  const certificates = certificatesRes.data ?? [];
  const latestCert = certificates[0] || null;
  const queueById = /* @__PURE__ */ new Map();
  for (const q of emailQueueRes.data ?? []) {
    queueById.set(q.id, q);
  }
  const attachmentNames = (row) => {
    const raw = row?.variables?.__attachments;
    if (!Array.isArray(raw)) return [];
    return raw.map((attachment) => typeof attachment?.filename === "string" ? attachment.filename : "").filter(Boolean);
  };
  const dedupMap = /* @__PURE__ */ new Map();
  for (const l of emailLogsRes.data ?? []) {
    const key = l.queue_id ? `q:${l.queue_id}` : l.message_id ? `m:${l.message_id}` : `l:${l.id}`;
    const q = l.queue_id ? queueById.get(l.queue_id) : null;
    const merged = {
      id: l.id,
      subject: l.subject || q?.subject || "Email Notification",
      from_email: l.from_email || COMPANY_EMAIL,
      to_email: l.to_email || lead.email || "customer@email.com",
      sent_at: l.sent_at || q?.sent_at || l.created_at,
      status: l.status || q?.status || "sent",
      template_code: l.template_code || q?.template_code || null,
      body_html: l.body_html || q?.body_html || null,
      body_text: l.body_text || q?.body_text || null,
      message_id: l.message_id || null,
      attempt: l.attempt ?? 1,
      error_message: l.error_message || null,
      smtp_response: l.smtp_response || null,
      attachment_names: attachmentNames(q)
    };
    const st = String(merged.status).toLowerCase();
    const isSentOrAttempted = merged.sent_at != null || ["sent", "delivered", "attempted", "failed", "bounced"].includes(st);
    if (isSentOrAttempted) {
      dedupMap.set(key, merged);
    }
  }
  for (const q of emailQueueRes.data ?? []) {
    const key = `q:${q.id}`;
    if (!dedupMap.has(key)) {
      const st = String(q.status || "").toLowerCase();
      if (["sent", "delivered"].includes(st)) {
        dedupMap.set(key, {
          id: q.id,
          subject: q.subject || "Email Notification",
          from_email: COMPANY_EMAIL,
          to_email: q.to_email || lead.email || "customer@email.com",
          sent_at: q.sent_at || q.created_at,
          status: q.status || "sent",
          template_code: q.template_code || null,
          body_html: q.body_html || null,
          body_text: q.body_text || null,
          message_id: null,
          attempt: q.attempts ?? 1,
          error_message: q.last_error || null,
          smtp_response: null,
          attachment_names: attachmentNames(q)
        });
      }
    }
  }
  const sentEmailsList = Array.from(dedupMap.values()).sort((a, b) => new Date(a.sent_at || 0).getTime() - new Date(b.sent_at || 0).getTime());
  const rawEvents = eventsRes.data ?? [];
  const timelineEvents = rawEvents.filter((ev) => {
    const note = String(ev.note || "").toLowerCase();
    if (note.includes("internal comment only")) return false;
    return true;
  }).map((ev) => {
    let label = ev.event_type;
    const et = String(ev.event_type || "").toLowerCase();
    if (et.includes("order_received") || et.includes("order_created")) label = "Incomplete Form";
    else if (et.includes("form_submitted") || et.includes("form_link_sent")) label = "Form Submission Action";
    else if (et.includes("submitted_to_govt") || et.includes("application_submitted")) label = "Application Submitted to Authority";
    else if (et.includes("completed") || et.includes("certificate_uploaded")) label = "Order Completed / Certificate Issued";
    else if (et.includes("closed") || et.includes("rejected")) label = "Order Closed";
    else if (et.includes("customer_delay")) label = "Customer Delay Hold";
    else if (et.includes("technical_delay")) label = "Technical Delay Hold";
    else if (et.includes("call_completed")) label = "Customer Contact Completed";
    return {
      id: ev.id,
      eventType: ev.event_type,
      label,
      note: ev.note || null,
      createdAt: ev.created_at,
      staffName: ev.staff_name || null
    };
  });
  const evidenceHistory = (historyRes?.data ?? []).map((h) => ({
    id: h.id,
    generatedAt: h.generated_at || h.created_at,
    generatedByName: h.generated_by_name || "Authorized Staff",
    fileName: h.file_name,
    filePath: h.file_path,
    itemCount: h.item_count ?? 0,
    invoiceIncluded: Boolean(h.invoice_included),
    certificateIncluded: Boolean(h.certificate_included),
    selectedEmailCount: Array.isArray(h.selected_email_ids) ? h.selected_email_ids.length : 0
  }));
  const assignedStaffProfile = profileRes?.data;
  return {
    applicationId: app.id,
    applicationCode: app.application_code || app.id.slice(0, 8),
    leadId: app.lead_id,
    customerId: app.customer_id ?? null,
    customerName: lead.name || "Valued Customer",
    customerMobile: lead.mobile || "—",
    customerEmail: lead.email || "—",
    customerState: lead.state || null,
    serviceName: lead.service || "Udyam Registration & Compliance Support",
    orderDate: app.created_at,
    orderStatus: app.order_status || "PENDING",
    fulfillmentStatus: app.fulfillment_status || "in_processing",
    workflowStatus: app.workflow_status || "active",
    totalAmount: Number(lead.total_amount || successfulPayment?.amount || 0),
    assignedStaff: assignedStaffProfile ? {
      id: assignedStaffProfile.id,
      name: assignedStaffProfile.display_name || assignedStaffProfile.email || "Staff",
      email: assignedStaffProfile.email || ""
    } : null,
    payment: successfulPayment ? {
      id: successfulPayment.id,
      status: successfulPayment.status || "PAID",
      amount: Number(successfulPayment.amount || 0),
      baseAmount: Number(successfulPayment.base_amount || 0),
      gstAmount: Number(successfulPayment.gst_amount || 0),
      gatewayName: successfulPayment.gateway_name || "Razorpay",
      transactionId: successfulPayment.transaction_id || null,
      paymentDate: successfulPayment.payment_date || successfulPayment.created_at,
      createdAt: successfulPayment.created_at
    } : null,
    invoice: latestInvoice ? {
      id: latestInvoice.id,
      invoiceNumber: latestInvoice.invoice_number || "INV-ISSUED",
      totalAmount: Number(latestInvoice.total_amount || 0),
      status: "ISSUED",
      pdfPath: latestInvoice.pdf_path || null,
      createdAt: latestInvoice.created_at
    } : null,
    certificate: latestCert ? {
      id: latestCert.id,
      certificateNumber: latestCert.certificate_number || null,
      fileName: latestCert.file_name || null,
      filePath: latestCert.file_path || null,
      mimeType: latestCert.mime_type || null,
      issuedAt: latestCert.issued_at || latestCert.created_at,
      deliveredAt: latestCert.delivered_at || null
    } : null,
    sentEmails: sentEmailsList,
    orderTimeline: timelineEvents,
    evidenceHistory
  };
});
const prepareDisputeEvidencePackage_createServerFn_handler = createServerRpc({
  id: "5672ba5ce6c14047dfcd150b21c917373989ecabf17d5ee68bd10e9e36ae33ec",
  name: "prepareDisputeEvidencePackage",
  filename: "src/lib/disputes/dispute-manager.functions.ts"
}, (opts) => prepareDisputeEvidencePackage.__executeServer(opts));
const prepareDisputeEvidencePackage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  includeInvoice: boolean()
}).parse(i)).handler(prepareDisputeEvidencePackage_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, AUTHORIZED_ROLES);
  if (!data.includeInvoice) return {
    invoiceUrl: null
  };
  const admin = await getAdmin();
  const {
    data: invoice
  } = await admin.from("invoices").select("pdf_path").eq("application_id", data.orderId).not("pdf_path", "is", null).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (!invoice?.pdf_path) throw new Error("The saved invoice PDF is not ready");
  const {
    data: signed,
    error
  } = await admin.storage.from("invoices").createSignedUrl(invoice.pdf_path, 60 * 10);
  if (error || !signed?.signedUrl) throw new Error("Could not open the saved invoice PDF");
  return {
    invoiceUrl: signed.signedUrl
  };
});
const saveBrowserDisputeEvidencePackage_createServerFn_handler = createServerRpc({
  id: "4cb54d7f9b5c50672ff86432d4dafd35a57a1652c3baeea600c8482b3b2b5369",
  name: "saveBrowserDisputeEvidencePackage",
  filename: "src/lib/disputes/dispute-manager.functions.ts"
}, (opts) => saveBrowserDisputeEvidencePackage.__executeServer(opts));
const saveBrowserDisputeEvidencePackage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  disputeId: string().max(200).optional().nullable(),
  selectedEmailIds: array(string().uuid()).max(50),
  invoiceIncluded: boolean(),
  pdfBase64: string().min(100).max(28e6)
}).parse(i)).handler(saveBrowserDisputeEvidencePackage_createServerFn_handler, async ({
  data,
  context
}) => {
  const user = await assertRole(context.supabase, AUTHORIZED_ROLES);
  const admin = await getAdmin();
  const {
    data: app
  } = await admin.from("applications").select("id, application_code").eq("id", data.orderId).maybeSingle();
  if (!app) throw new Error("Application record not found");
  const pdfBytes = Uint8Array.from(atob(data.pdfBase64), (char) => char.charCodeAt(0));
  if (pdfBytes.length < 5 || new TextDecoder().decode(pdfBytes.slice(0, 5)) !== "%PDF-") throw new Error("The generated file is not a valid PDF");
  const {
    data: profile
  } = await admin.from("profiles").select("display_name, email").eq("id", user.id).maybeSingle();
  const now = /* @__PURE__ */ new Date();
  const packageId = crypto.randomUUID();
  const cleanOrderCode = String(app.application_code || app.id.slice(0, 8)).replace(/[^a-zA-Z0-9_-]/g, "_");
  const dateStamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const fileName = `dispute-evidence-${cleanOrderCode}-${dateStamp}.pdf`;
  const storagePath = `dispute-evidence/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${cleanOrderCode}/${fileName}`;
  const {
    error: uploadError
  } = await admin.storage.from("documents").upload(storagePath, pdfBytes, {
    contentType: "application/pdf",
    upsert: true
  });
  if (uploadError) throw new Error(`Failed to save dispute PDF: ${uploadError.message}`);
  const itemCount = data.selectedEmailIds.length + (data.invoiceIncluded ? 1 : 0);
  const {
    error: recordError
  } = await admin.from("dispute_evidence_records").insert({
    id: packageId,
    order_id: app.id,
    application_code: app.application_code,
    generated_by: user.id,
    generated_by_name: profile?.display_name || profile?.email || "Admin",
    generated_at: now.toISOString(),
    file_path: storagePath,
    file_name: fileName,
    selected_email_ids: data.selectedEmailIds,
    invoice_included: data.invoiceIncluded,
    certificate_included: false,
    item_count: itemCount,
    metadata: {
      disputeId: data.disputeId?.trim() || null,
      totalPdfBytes: pdfBytes.length,
      renderer: "crm-browser"
    }
  });
  if (recordError) {
    await admin.storage.from("documents").remove([storagePath]);
    throw new Error(`Failed to record dispute PDF: ${recordError.message}`);
  }
  const {
    data: signed
  } = await admin.storage.from("documents").createSignedUrl(storagePath, 60 * 60);
  return {
    success: true,
    recordId: packageId,
    signedUrl: signed?.signedUrl || null,
    fileName,
    filePath: storagePath,
    itemCount
  };
});
const getDisputeEvidenceSignedUrl_createServerFn_handler = createServerRpc({
  id: "ef90c0d98ae5021a2d754723d4e659399a98111b6c64fb68eef52eea8b368cb1",
  name: "getDisputeEvidenceSignedUrl",
  filename: "src/lib/disputes/dispute-manager.functions.ts"
}, (opts) => getDisputeEvidenceSignedUrl.__executeServer(opts));
const getDisputeEvidenceSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  recordId: string().uuid()
}).parse(i)).handler(getDisputeEvidenceSignedUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, AUTHORIZED_ROLES);
  const admin = await getAdmin();
  const {
    data: row,
    error
  } = await admin.from("dispute_evidence_records").select("file_path, file_name").eq("id", data.recordId).single();
  if (error || !row?.file_path) {
    throw new Error("Dispute evidence package not found");
  }
  const {
    data: signed
  } = await admin.storage.from("documents").createSignedUrl(row.file_path, 60 * 60);
  if (!signed?.signedUrl) {
    throw new Error("Failed to generate download link");
  }
  return {
    signedUrl: signed.signedUrl,
    fileName: row.file_name
  };
});
const deleteDisputeEvidenceRecord_createServerFn_handler = createServerRpc({
  id: "d836104feccf04cf7d9cad7af7654fd68ec5d280bae32c6a32555bd5b678d6ed",
  name: "deleteDisputeEvidenceRecord",
  filename: "src/lib/disputes/dispute-manager.functions.ts"
}, (opts) => deleteDisputeEvidenceRecord.__executeServer(opts));
const deleteDisputeEvidenceRecord = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  recordId: string().uuid()
}).parse(i)).handler(deleteDisputeEvidenceRecord_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, AUTHORIZED_ROLES);
  const admin = await getAdmin();
  const {
    data: row
  } = await admin.from("dispute_evidence_records").select("file_path").eq("id", data.recordId).maybeSingle();
  if (row?.file_path) {
    await admin.storage.from("documents").remove([row.file_path]);
  }
  await admin.from("dispute_evidence_records").delete().eq("id", data.recordId);
  return {
    success: true
  };
});
const deleteAllDisputeEvidenceRecords_createServerFn_handler = createServerRpc({
  id: "5eb986dae561fcc4fad2953cd410f430ab95d8dbb50e9b88e060b40095011fe9",
  name: "deleteAllDisputeEvidenceRecords",
  filename: "src/lib/disputes/dispute-manager.functions.ts"
}, (opts) => deleteAllDisputeEvidenceRecords.__executeServer(opts));
const deleteAllDisputeEvidenceRecords = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid().optional()
}).parse(i)).handler(deleteAllDisputeEvidenceRecords_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, AUTHORIZED_ROLES);
  const admin = await getAdmin();
  let query = admin.from("dispute_evidence_records").select("id, file_path");
  if (data.orderId) {
    query = query.eq("order_id", data.orderId);
  }
  const {
    data: rows
  } = await query;
  const paths = (rows ?? []).map((r) => r.file_path).filter(Boolean);
  if (paths.length > 0) {
    await admin.storage.from("documents").remove(paths);
  }
  let delQuery = admin.from("dispute_evidence_records").delete();
  if (data.orderId) {
    delQuery = delQuery.eq("order_id", data.orderId);
  } else {
    delQuery = delQuery.neq("id", "00000000-0000-0000-0000-000000000000");
  }
  await delQuery;
  return {
    success: true,
    deletedCount: (rows ?? []).length
  };
});
export {
  deleteAllDisputeEvidenceRecords_createServerFn_handler,
  deleteDisputeEvidenceRecord_createServerFn_handler,
  getDisputeEvidenceSignedUrl_createServerFn_handler,
  prepareDisputeEvidencePackage_createServerFn_handler,
  saveBrowserDisputeEvidencePackage_createServerFn_handler,
  searchDisputeOrder_createServerFn_handler
};
