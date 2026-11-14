import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, r as record, d as any, b as boolean, _ as _enum } from "../_libs/zod.mjs";
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
const STAFF = ["super_admin", "admin", "manager", "operations", "executive", "support", "finance", "accounts"];
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function actorName(supabase, userId) {
  const {
    data
  } = await supabase.from("profiles").select("display_name, email").eq("id", userId).maybeSingle();
  return data?.display_name || data?.email || "Staff";
}
const listWorkflowEvents_createServerFn_handler = createServerRpc({
  id: "fe7953f392b66ecd37c4ffb1340a423e171201938de5cea5dfecccc2c236cf5d",
  name: "listWorkflowEvents",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => listWorkflowEvents.__executeServer(opts));
const listWorkflowEvents = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid()
}).parse(d)).handler(listWorkflowEvents_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const {
    data: rows,
    error
  } = await admin.from("workflow_events").select("*").eq("application_id", data.applicationId).order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return {
    events: rows ?? []
  };
});
const listWorkflowReminders_createServerFn_handler = createServerRpc({
  id: "0e23263f3aa24b2ca04e233c1028ea0ba3c3304d250b05d9bf39d1fa08281eda",
  name: "listWorkflowReminders",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => listWorkflowReminders.__executeServer(opts));
const listWorkflowReminders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid()
}).parse(d)).handler(listWorkflowReminders_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const {
    data: rows,
    error
  } = await admin.from("workflow_reminders").select("*").eq("application_id", data.applicationId).order("due_at", {
    ascending: true
  }).limit(100);
  if (error) throw new Error(error.message);
  return {
    reminders: rows ?? []
  };
});
const listDelayReasons_createServerFn_handler = createServerRpc({
  id: "da9d6d9c3d8004b320f0cf7c11c397ee2dcbf6fa79d35d73f58a42a06073fa80",
  name: "listDelayReasons",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => listDelayReasons.__executeServer(opts));
const listDelayReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listDelayReasons_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const {
    data,
    error
  } = await admin.from("workflow_delay_reasons").select("code,label,description,side,email_template_code").eq("is_active", true).order("sort_order");
  if (error) throw new Error(error.message);
  return {
    reasons: data ?? []
  };
});
const listClosureReasons_createServerFn_handler = createServerRpc({
  id: "21cf5bdf472b1a08d7a6b6a5005857b5d1fc8e3d479943f6396bfaec13cf77d4",
  name: "listClosureReasons",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => listClosureReasons.__executeServer(opts));
const listClosureReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listClosureReasons_createServerFn_handler, async ({
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const {
    data,
    error
  } = await admin.from("workflow_closure_reasons").select("code,label,description").eq("is_active", true);
  const DEFAULT_REASONS = [{
    code: "E010",
    label: "Customer Non-Responsive (Auto/Force Close)",
    description: "Customer did not respond within expected SLA timeframe"
  }, {
    code: "FORCE_CLOSE",
    label: "Force Close (Admin Override)",
    description: "Administrative force closure"
  }, {
    code: "GOVT_REJECTED",
    label: "Government Portal Rejection",
    description: "Application rejected by government portal"
  }, {
    code: "CUSTOMER_CANCELLED",
    label: "Customer Requested Cancellation",
    description: "Customer requested order cancellation"
  }, {
    code: "DUPLICATE_ORDER",
    label: "Duplicate / Invalid Order",
    description: "Duplicate or invalid application submission"
  }];
  const reasons = data && data.length > 0 ? data : DEFAULT_REASONS;
  return {
    reasons
  };
});
const appendWorkflowEvent_createServerFn_handler = createServerRpc({
  id: "6af93f738eb386d4b69f4ada2d3ea06b746dcce13ad8028ee779a193d920c102",
  name: "appendWorkflowEvent",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => appendWorkflowEvent.__executeServer(opts));
const appendWorkflowEvent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  eventType: string().min(1).max(64),
  title: string().min(1).max(200),
  description: string().max(4e3).optional(),
  customerVisible: boolean().optional(),
  metadata: record(string(), any()).optional()
}).parse(d)).handler(appendWorkflowEvent_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const {
    data: app
  } = await admin.from("applications").select("lead_id").eq("id", data.applicationId).maybeSingle();
  const name = await actorName(context.supabase, context.userId);
  const {
    error
  } = await admin.from("workflow_events").insert({
    application_id: data.applicationId,
    lead_id: app?.lead_id ?? null,
    event_type: data.eventType,
    title: data.title,
    description: data.description ?? null,
    customer_visible: data.customerVisible ?? false,
    actor_id: context.userId,
    actor_name: name,
    is_system: false,
    metadata: data.metadata ?? {}
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const PRIORITY = _enum(["low", "normal", "high", "urgent"]);
const setExternalDelay_createServerFn_handler = createServerRpc({
  id: "a5ca012de55c756cbdcd5e32d5729343fa721101501b748ce2589b600869ae27",
  name: "setExternalDelay",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => setExternalDelay.__executeServer(opts));
const setExternalDelay = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  reasonCode: string().min(1).max(64),
  reasonLabel: string().min(1).max(160),
  internalNote: string().max(4e3).optional(),
  customerNote: string().max(4e3).optional(),
  expectedReviewAt: string().min(1),
  priority: PRIORITY.default("normal"),
  kind: _enum(["external_dependency", "government_portal_pending"]).default("external_dependency"),
  evidence: object({
    fileName: string().trim().min(1).max(255),
    mimeType: string().trim().min(1).max(100),
    base64Data: string().min(1)
  }).optional()
}).parse(d)).handler(setExternalDelay_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const name = await actorName(context.supabase, context.userId);
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id, application_code, workflow_status, order_status").eq("id", data.applicationId).maybeSingle();
  if (!app) throw new Error("Application not found");
  const {
    data: lead
  } = await admin.from("leads").select("name, email, mobile, service, lead_code, assigned_to, created_at").eq("id", app.lead_id).maybeSingle();
  const {
    data: latestInvoice
  } = await admin.from("invoices").select("invoice_number, issued_at").eq("lead_id", app.lead_id).order("issued_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const fmtIST = (d) => d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }) + " IST";
  const holdNowIst = fmtIST(/* @__PURE__ */ new Date());
  const expectedIst = data.expectedReviewAt ? fmtIST(new Date(data.expectedReviewAt)) : "";
  const orderCreatedIst = lead?.created_at ? fmtIST(new Date(lead.created_at)) : "";
  const {
    data: reasonRow
  } = await admin.from("workflow_delay_reasons").select("code,label,description,side,email_template_code").eq("code", data.reasonCode).maybeSingle();
  const side = reasonRow?.side === "internal" ? "internal" : "customer";
  const reasonBlock = reasonRow?.description || data.reasonLabel;
  const defaultTplForSide = side === "internal" ? "bhs_e004_our_side_delay" : "bhs_e003_customer_delay";
  const customerTplCode = reasonRow?.email_template_code || defaultTplForSide;
  const holdStatusLabel = reasonRow?.label || data.reasonLabel;
  const expectedReviewIso = new Date(data.expectedReviewAt).toISOString();
  const workflowStatus = side === "internal" ? "government_portal_pending" : "waiting_for_customer";
  let evidenceDocId = null;
  let evidenceStoragePath = null;
  let evidenceSizeBytes = null;
  let emailAttachments = void 0;
  if (data.evidence && side === "internal") {
    const allowedMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const reqMime = data.evidence.mimeType.toLowerCase();
    if (!allowedMimes.includes(reqMime)) {
      throw new Error("Unsupported screenshot format. Please upload PNG, JPG, or WEBP.");
    }
    const match = data.evidence.base64Data.match(/^data:([^;]+);base64,(.+)$/);
    const rawBase64 = match ? match[2] : data.evidence.base64Data;
    const buffer = Buffer.from(rawBase64, "base64");
    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error("Evidence screenshot exceeds 5 MB size limit.");
    }
    if (buffer.length < 10) {
      throw new Error("Invalid or empty screenshot file.");
    }
    evidenceSizeBytes = buffer.length;
    const extMatch = data.evidence.fileName.match(/\.(png|jpg|jpeg|webp)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : reqMime.includes("png") ? "png" : reqMime.includes("webp") ? "webp" : "jpg";
    const safeName = `portal-error-${Date.now()}.${ext}`;
    evidenceStoragePath = `orders/${app.id}/technical-delay/${safeName}`;
    const {
      error: uploadErr
    } = await admin.storage.from("documents").upload(evidenceStoragePath, buffer, {
      contentType: reqMime,
      upsert: true
    });
    if (uploadErr) {
      console.error("[setExternalDelay] storage upload error:", uploadErr);
      throw new Error(`Failed to upload evidence screenshot: ${uploadErr.message}`);
    }
    const {
      data: docRow,
      error: docErr
    } = await admin.from("documents").insert({
      application_id: app.id,
      lead_id: app.lead_id ?? null,
      doc_type: "portal_error_screenshot",
      file_path: evidenceStoragePath,
      file_name: data.evidence.fileName,
      mime_type: reqMime,
      size_bytes: buffer.length,
      status: "uploaded",
      uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select("id").maybeSingle();
    if (docErr) {
      console.warn("[setExternalDelay] documents table insert warning:", docErr);
    }
    evidenceDocId = docRow?.id ?? null;
    emailAttachments = [{
      filename: data.evidence.fileName,
      content_base64: rawBase64,
      content_type: reqMime
    }];
  }
  const holdStartedAt = (/* @__PURE__ */ new Date()).toISOString();
  const {
    error: updErr
  } = await admin.from("applications").update({
    workflow_status: workflowStatus,
    workflow_delay_reason: data.reasonCode,
    workflow_expected_review_at: expectedReviewIso,
    workflow_priority: data.priority,
    ...side === "customer" ? {
      order_status: "CUSTOMER_HOLD",
      fulfillment_status: "customer_delay",
      customer_hold_started_at: holdStartedAt
    } : {
      order_status: "TECHNICAL_HOLD_EXTERNAL",
      fulfillment_status: "technical_delay",
      technical_hold_started_at: holdStartedAt,
      technical_hold_kind: "external"
    }
  }).eq("id", app.id);
  if (updErr) throw new Error(updErr.message);
  const events = [{
    application_id: app.id,
    lead_id: app.lead_id,
    event_type: side === "internal" ? "internal_delay" : "external_delay",
    title: `${side === "internal" ? "Internal / our-side delay" : "Customer-side delay"} — ${data.reasonLabel}`,
    description: data.internalNote ?? null,
    customer_visible: false,
    actor_id: context.userId,
    actor_name: name,
    is_system: false,
    metadata: {
      reason_code: data.reasonCode,
      side,
      priority: data.priority,
      expected_review_at: expectedReviewIso,
      ...data.evidence && side === "internal" ? {
        evidence_attached: true,
        evidence_filename: data.evidence.fileName,
        evidence_mime_type: data.evidence.mimeType,
        evidence_size_bytes: evidenceSizeBytes,
        evidence_storage_path: evidenceStoragePath,
        evidence_document_id: evidenceDocId
      } : {
        evidence_attached: false
      }
    }
  }];
  if (side === "customer" && data.customerNote && data.customerNote.trim()) {
    events.push({
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: "customer_communication",
      title: "Customer-visible delay note",
      description: data.customerNote.trim(),
      customer_visible: true,
      actor_id: context.userId,
      actor_name: name,
      is_system: false,
      metadata: {
        reason_code: data.reasonCode
      }
    });
  }
  await admin.from("workflow_events").insert(events);
  if (side === "customer") {
    const {
      data: setting
    } = await admin.from("app_settings").select("customer_delay_autoclose_minutes").eq("id", 1).maybeSingle();
    const closeMinutes = Math.max(1, Number(setting?.customer_delay_autoclose_minutes ?? 480));
    const {
      armTimer
    } = await import("./timers.server-BikGPSRc.mjs");
    await armTimer({
      applicationId: app.id,
      kind: "customer_hold_reminder",
      firesInMinutes: closeMinutes,
      payload: {
        reasonCode: data.reasonCode
      }
    });
    await admin.from("workflow_reminders").update({
      status: "cancelled"
    }).eq("application_id", app.id).eq("kind", "pending_closure_followup").eq("status", "pending");
    const {
      cancelAllForOrder
    } = await import("./schedulers.server-BPR-45Y2.mjs");
    await cancelAllForOrder(app.id, "replaced_by_customer_hold_timer");
    if (lead?.email) {
      try {
        const {
          enqueueFromTemplateInternal
        } = await import("./emails.server-BTJhg2a3.mjs");
        const {
          SUPPORT_EMAIL,
          COMPANY_NAME
        } = await import("./brand-DLB0j9eh.mjs");
        await enqueueFromTemplateInternal(customerTplCode || "bhs_e003_customer_delay", lead.email, {
          customer_name: lead.name ?? "Customer",
          customer_email: lead.email ?? "",
          customer_mobile: lead.mobile ?? "",
          order_id: app.application_code ?? "",
          order_number: app.application_code ?? "",
          service_name: lead.service ?? "",
          invoice_number: latestInvoice?.invoice_number ?? "—",
          order_created_at: orderCreatedIst,
          hold_status_label: holdStatusLabel,
          followup_date: holdNowIst,
          expected_update_date: expectedIst,
          employee_remarks: data.customerNote && data.customerNote.trim() || data.internalNote && data.internalNote.trim() || reasonBlock || "—",
          additional_remarks: data.customerNote && data.customerNote.trim() || data.internalNote && data.internalNote.trim() || reasonBlock || "—",
          remarks: data.customerNote && data.customerNote.trim() || data.internalNote && data.internalNote.trim() || reasonBlock || "—",
          reason: data.reasonLabel,
          reason_block: reasonBlock,
          date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"),
          company_name: COMPANY_NAME,
          support_email: SUPPORT_EMAIL,
          customer_note: data.customerNote && data.customerNote.trim() || reasonBlock || ""
        }, {
          toName: lead.name ?? void 0,
          leadId: app.lead_id ?? void 0,
          applicationId: app.id,
          trigger: "manual",
          allowDuplicate: true
        });
      } catch (e) {
        console.error("[workflow] customer-side delay email failed:", e);
      }
    }
    try {
      await admin.from("application_events").insert({
        created_by: context.userId,
        application_id: app.id,
        lead_id: app.lead_id,
        event_type: "customer_delay_marked",
        note: `Customer delay marked: ${data.reasonLabel}${data.internalNote ? ` (${data.internalNote})` : ""}`,
        staff_name: name,
        staff_role: "staff"
      });
    } catch (evtErr) {
      console.warn("[setExternalDelay] customer_delay_marked event warning:", evtErr);
    }
    {
      const {
        emitToUsers,
        emitToRole
      } = await import("./emit.server-OhKEr4hO.mjs");
      const notifBase = {
        kind: "customer_hold_started",
        title: `Customer-Side Delay — ${data.reasonLabel}`,
        body: `Order ${app.application_code ?? ""} paused. Auto-closes in 8 hours if no response.`,
        href: `/admin/orders/${app.id}`,
        entityKind: "application",
        entityId: app.id
      };
      if (lead?.assigned_to) await emitToUsers([lead.assigned_to], notifBase);
      await emitToRole("super_admin", notifBase);
    }
  } else {
    const {
      emitToUsers,
      emitToRole
    } = await import("./emit.server-OhKEr4hO.mjs");
    const notifBase = {
      kind: "our_side_delay_start",
      title: `Our-Side Delay — ${data.reasonLabel}`,
      body: `Order ${app.application_code ?? ""} paused (internal delay).`,
      href: `/admin/orders/${app.id}`,
      entityKind: "application",
      entityId: app.id
    };
    if (lead?.assigned_to) {
      await emitToUsers([lead.assigned_to], notifBase);
    }
    await emitToRole("super_admin", notifBase);
    await emitToRole("admin", notifBase);
    try {
      await admin.from("application_events").insert({
        created_by: context.userId,
        application_id: app.id,
        event_type: "technical_delay_marked",
        note: `Technical delay marked: ${data.reasonLabel}${data.evidence ? ` · Evidence: ${data.evidence.fileName}` : ""}${data.internalNote ? ` (${data.internalNote})` : ""}`,
        staff_name: name,
        staff_role: "staff"
      });
    } catch (evtErr) {
      console.warn("[setExternalDelay] application_events warning:", evtErr);
    }
    try {
      const {
        logEmployeeOrderAction
      } = await import("./order-action-logger.server-DJE-NEoc.mjs");
      await logEmployeeOrderAction({
        orderId: app.id,
        employeeId: context.userId,
        employeeName: name,
        actionType: "TECHNICAL_DELAY_ADDED",
        notes: `Technical delay marked: ${data.reasonLabel}.${data.evidence ? ` Evidence attached: ${data.evidence.fileName}.` : ""}${data.internalNote ? ` Note: ${data.internalNote}` : ""}`,
        source: "employee",
        supabase: admin
      });
    } catch (auditErr) {
      console.warn("[setExternalDelay] order_action_logs warning:", auditErr);
    }
    if (lead?.email) {
      try {
        const {
          enqueueFromTemplateInternal
        } = await import("./emails.server-BTJhg2a3.mjs");
        const {
          SUPPORT_EMAIL,
          COMPANY_NAME
        } = await import("./brand-DLB0j9eh.mjs");
        await enqueueFromTemplateInternal(customerTplCode, lead.email, {
          customer_name: lead.name ?? "Customer",
          customer_email: lead.email ?? "",
          customer_mobile: lead.mobile ?? "",
          order_id: app.application_code ?? "",
          order_number: app.application_code ?? "",
          service_name: lead.service ?? "",
          invoice_number: latestInvoice?.invoice_number ?? "—",
          order_created_at: orderCreatedIst,
          hold_status_label: holdStatusLabel,
          followup_date: holdNowIst,
          expected_update_date: expectedIst,
          employee_remarks: data.internalNote && data.internalNote.trim() || reasonBlock || "—",
          additional_remarks: data.internalNote && data.internalNote.trim() || reasonBlock || "—",
          remarks: data.internalNote && data.internalNote.trim() || reasonBlock || "—",
          reason: data.reasonLabel,
          reason_block: reasonBlock,
          date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"),
          company_name: COMPANY_NAME,
          support_email: SUPPORT_EMAIL
        }, {
          toName: lead.name ?? void 0,
          leadId: app.lead_id ?? void 0,
          applicationId: app.id,
          trigger: "manual",
          allowDuplicate: true,
          attachments: emailAttachments
        });
      } catch (e) {
        console.error("[workflow] our-side delay email failed", e);
      }
    }
  }
  await writeAudit({
    supabase: context.supabase,
    entityType: "application",
    entityId: app.id,
    action: side === "internal" ? "workflow_internal_delay" : "workflow_external_delay",
    oldValue: {
      workflow_status: app.workflow_status
    },
    newValue: {
      workflow_status: workflowStatus,
      reason: data.reasonCode,
      side
    },
    actorId: context.userId
  });
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: app.id,
      actorId: context.userId,
      actorName: name,
      actionName: side === "internal" ? "Technical Delay" : "Customer Delay",
      actionReason: `${side === "internal" ? "Technical Delay" : "Customer Delay"} action performed: ${data.reasonLabel}`,
      supabase: admin
    });
  } catch (hotErr) {
    console.warn("[setExternalDelay] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    side
  };
});
const resumeOrder_createServerFn_handler = createServerRpc({
  id: "88b2c0a30e259b02476c36a336c6e49582e40494fce6ed45c6d1e4edc98640a4",
  name: "resumeOrder",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => resumeOrder.__executeServer(opts));
const resumeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  note: string().max(2e3).optional()
}).parse(d)).handler(resumeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const name = await actorName(context.supabase, context.userId);
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id, workflow_status, application_code").eq("id", data.applicationId).maybeSingle();
  if (!app) throw new Error("Application not found");
  const {
    data: lead
  } = await admin.from("leads").select("name, email, service").eq("id", app.lead_id).maybeSingle();
  await admin.from("workflow_reminders").update({
    status: "cancelled"
  }).eq("application_id", app.id).eq("status", "pending");
  await admin.from("order_schedulers").update({
    status: "stopped",
    stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
    stop_reason: "order_resumed",
    stop_triggered_by: context.userId
  }).eq("application_id", app.id).in("status", ["active", "paused"]);
  await admin.from("order_reminders").update({
    is_active: false,
    stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
    stop_reason: "order_resumed"
  }).eq("application_id", app.id);
  await admin.from("applications").update({
    workflow_status: "processing_resumed",
    workflow_delay_reason: null,
    workflow_expected_review_at: null
  }).eq("id", app.id);
  await admin.from("workflow_events").insert({
    application_id: app.id,
    lead_id: app.lead_id,
    event_type: "resumed",
    title: "Order resumed",
    description: data.note ?? null,
    customer_visible: false,
    actor_id: context.userId,
    actor_name: name,
    is_system: false,
    metadata: {}
  });
  if (lead?.email) {
    try {
      const {
        enqueueFromTemplateInternal
      } = await import("./emails.server-BTJhg2a3.mjs");
      const {
        SUPPORT_EMAIL,
        COMPANY_NAME
      } = await import("./brand-DLB0j9eh.mjs");
      await enqueueFromTemplateInternal("bhs_order_resumed", lead.email, {
        customer_name: lead.name ?? "Customer",
        order_id: app.application_code ?? "",
        order_number: app.application_code ?? "",
        service_name: lead.service ?? "",
        resume_note: data.note ?? "",
        company_name: COMPANY_NAME,
        support_email: SUPPORT_EMAIL
      }, {
        toName: lead.name ?? void 0,
        leadId: app.lead_id ?? void 0,
        applicationId: app.id,
        trigger: "manual"
      });
    } catch (e) {
      console.error("[workflow] resume email failed", e);
    }
  }
  {
    const {
      emitToUsers,
      emitToRole
    } = await import("./emit.server-OhKEr4hO.mjs");
    const notifBase = {
      kind: "order_status_change",
      title: `Order Resumed — ${app.application_code ?? ""}`,
      body: `${name} resumed processing.${data.note ? ` Note: ${data.note}` : ""}`,
      href: `/admin/orders/${app.id}`,
      entityKind: "application",
      entityId: app.id
    };
    const {
      data: leadRow
    } = await admin.from("leads").select("assigned_to").eq("id", app.lead_id).maybeSingle();
    if (leadRow?.assigned_to && leadRow.assigned_to !== context.userId) {
      await emitToUsers([leadRow.assigned_to], notifBase);
    }
    await emitToRole("super_admin", notifBase);
  }
  await writeAudit({
    supabase: context.supabase,
    entityType: "application",
    entityId: app.id,
    action: "workflow_resume",
    oldValue: {
      workflow_status: app.workflow_status
    },
    newValue: {
      workflow_status: "processing_resumed"
    },
    actorId: context.userId
  });
  return {
    ok: true
  };
});
const markCustomerReplied_createServerFn_handler = createServerRpc({
  id: "ac3259a8b2f79a78c18eef3be950db1a5440f184e23ec5591981811aac4ca088",
  name: "markCustomerReplied",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => markCustomerReplied.__executeServer(opts));
const markCustomerReplied = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  summary: string().max(2e3).optional()
}).parse(d)).handler(markCustomerReplied_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const name = await actorName(context.supabase, context.userId);
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id").eq("id", data.applicationId).maybeSingle();
  if (!app) throw new Error("Application not found");
  await admin.from("workflow_events").insert({
    application_id: app.id,
    lead_id: app.lead_id,
    event_type: "customer_replied",
    title: "Customer replied",
    description: data.summary ?? null,
    customer_visible: false,
    actor_id: context.userId,
    actor_name: name,
    is_system: false,
    metadata: {}
  });
  const {
    data: lead
  } = await admin.from("leads").select("assigned_to, name, lead_code").eq("id", app.lead_id).maybeSingle();
  if (lead?.assigned_to) {
    await admin.from("notifications").insert({
      user_id: lead.assigned_to,
      title: "Customer replied",
      body: `${lead.name ?? "Customer"} replied on ${lead.lead_code ?? ""}`,
      kind: "customer_reply",
      link_to: `/admin/orders/${app.id}`
    });
  }
  return {
    ok: true
  };
});
const cancelWorkflowReminder_createServerFn_handler = createServerRpc({
  id: "0badad713f90f6888cfa77b2356fdc2be9a50b04cbd94d1f1a380b93da87827b",
  name: "cancelWorkflowReminder",
  filename: "src/lib/crm/workflow.functions.ts"
}, (opts) => cancelWorkflowReminder.__executeServer(opts));
const cancelWorkflowReminder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  id: string().uuid()
}).parse(d)).handler(cancelWorkflowReminder_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const {
    error
  } = await admin.from("workflow_reminders").update({
    status: "cancelled"
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  appendWorkflowEvent_createServerFn_handler,
  cancelWorkflowReminder_createServerFn_handler,
  listClosureReasons_createServerFn_handler,
  listDelayReasons_createServerFn_handler,
  listWorkflowEvents_createServerFn_handler,
  listWorkflowReminders_createServerFn_handler,
  markCustomerReplied_createServerFn_handler,
  resumeOrder_createServerFn_handler,
  setExternalDelay_createServerFn_handler
};
