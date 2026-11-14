import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, s as string, _ as _enum, n as number } from "../_libs/zod.mjs";
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
const REFUND_ROLES = ["super_admin", "admin", "finance", "accounts"];
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
async function executeOrderClosure({
  supabase,
  userId,
  data
}) {
  await assertRole(supabase, [...STAFF]);
  const admin = await getAdmin();
  const name = await actorName(supabase, userId);
  const isSilent = Boolean(data.silent);
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id, customer_id, application_code, workflow_status, fulfillment_status, order_status, created_at").eq("id", data.applicationId).maybeSingle();
  if (!app) throw new Error("Application not found");
  await admin.from("workflow_reminders").update({
    status: "cancelled"
  }).eq("application_id", app.id).in("status", ["pending", "failed"]);
  await admin.from("order_reminders").update({
    is_active: false,
    stopped_at: (/* @__PURE__ */ new Date()).toISOString(),
    stop_reason: isSilent ? "silent_order_closed" : "order_closed"
  }).eq("application_id", app.id);
  try {
    const {
      cancelAllForOrder
    } = await import("./schedulers.server-BPR-45Y2.mjs");
    await cancelAllForOrder(app.id, isSilent ? "silent_order_closed" : "order_closed");
  } catch (schedErr) {
    console.warn("[closeOrder] scheduler cancel warning:", schedErr);
  }
  try {
    const {
      cancelTimers
    } = await import("./timers.server-BikGPSRc.mjs");
    await cancelTimers(app.id);
  } catch (timerErr) {
    console.warn("[closeOrder] timer cancel warning:", timerErr);
  }
  const closedAt = (/* @__PURE__ */ new Date()).toISOString();
  const {
    error: appUpErr
  } = await admin.from("applications").update({
    workflow_status: "closed",
    fulfillment_status: "order_closed",
    order_status: "CLOSED",
    closure_stage: "closed",
    closure_reason_code: data.reasonCode,
    closure_remarks: data.notes ?? data.reasonLabel,
    customer_hold_started_at: null,
    technical_hold_started_at: null,
    technical_hold_kind: null,
    awaiting_govt_started_at: null,
    active_reason_id: null,
    active_reason_text: null,
    workflow_delay_reason: null,
    workflow_expected_review_at: null,
    updated_at: closedAt
  }).eq("id", app.id);
  if (appUpErr) {
    console.error("[executeOrderClosure] update error:", appUpErr);
    throw new Error(`Failed to close order: ${appUpErr.message}`);
  }
  try {
    await admin.from("workflow_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      event_type: isSilent ? "silent_order_closed" : "order_closed",
      title: isSilent ? `Order closed silently — ${data.reasonLabel}` : `Order closed — ${data.reasonLabel}`,
      description: data.notes ?? null,
      customer_visible: !isSilent,
      actor_id: userId,
      actor_name: name,
      is_system: false,
      metadata: {
        reason_code: data.reasonCode,
        reason_label: data.reasonLabel,
        notes: data.notes ?? null,
        silent: isSilent,
        previous_stage: app.fulfillment_status || app.workflow_status || "in_progress",
        email_sent: !isSilent
      }
    });
  } catch (wfEvtErr) {
    console.warn("[closeOrder] workflow_events insert warning:", wfEvtErr);
  }
  try {
    await admin.from("application_events").insert({
      application_id: app.id,
      lead_id: app.lead_id,
      customer_id: app.customer_id,
      event_type: "order_status_change",
      old_value: String(app.order_status ?? "ACTIVE"),
      new_value: "CLOSED",
      note: isSilent ? `Order silently closed (${data.reasonLabel}) — no customer email` : `Order closed (${data.reasonLabel})`,
      created_by: userId,
      staff_name: name,
      staff_role: "staff"
    });
  } catch (appEvtErr) {
    console.warn("[closeOrder] application_events insert warning:", appEvtErr);
  }
  try {
    const {
      logEmployeeOrderAction
    } = await import("./order-action-logger.server-DJE-NEoc.mjs");
    await logEmployeeOrderAction({
      orderId: app.id,
      leadId: app.lead_id,
      customerId: app.customer_id,
      employeeId: userId,
      employeeName: name,
      actionType: "ORDER_CLOSED",
      previousStatus: app.workflow_status || app.order_status || "active",
      newStatus: "CLOSED",
      previousStage: app.fulfillment_status,
      newStage: "Order Closed",
      notes: `Order closed${isSilent ? " silently" : ""}: ${data.reasonLabel}${data.notes ? ` - ${data.notes}` : ""}`,
      source: isSilent ? "admin" : "employee",
      customMetadata: {
        silent: isSilent,
        reasonCode: data.reasonCode,
        reasonLabel: data.reasonLabel,
        emailSent: !isSilent
      },
      supabase: admin
    });
  } catch (auditErr) {
    console.warn("[closeOrder] audit log error:", auditErr);
  }
  if (!isSilent) {
    try {
      const {
        data: lead
      } = await admin.from("leads").select("name, email, mobile, service").eq("id", app.lead_id).maybeSingle();
      const {
        data: latestInvoice
      } = await admin.from("invoices").select("invoice_number").eq("application_id", app.id).order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (lead?.email) {
        const {
          enqueueFromTemplateInternal
        } = await import("./emails.server-BTJhg2a3.mjs");
        const {
          SUPPORT_EMAIL,
          COMPANY_NAME
        } = await import("./brand-DLB0j9eh.mjs");
        const istFmt = (iso) => new Date(iso).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short"
        });
        const {
          data: closureReasonRow
        } = await admin.from("workflow_closure_reasons").select("description, label").eq("code", data.reasonCode).maybeSingle();
        let defaultClosureReply = closureReasonRow?.description;
        if (!defaultClosureReply) {
          const {
            STANDARD_CLOSE_REASONS
          } = await import("./reasons.functions-epqlfHIh.mjs");
          const std = STANDARD_CLOSE_REASONS.find((r) => r.id === data.reasonCode || `R${r.number}` === data.reasonCode || r.label.toLowerCase() === data.reasonLabel.toLowerCase());
          defaultClosureReply = std?.standard_reply || null;
        }
        const closeRemarks = data.notes && data.notes.trim() ? data.notes.trim() : defaultClosureReply || data.reasonLabel || "—";
        await enqueueFromTemplateInternal("order_closure_confirmation", lead.email, {
          customer_name: lead.name ?? "Customer",
          customer_email: lead.email ?? "",
          customer_mobile: lead.mobile ?? "—",
          order_id: app.application_code ?? "",
          order_number: app.application_code ?? "",
          service_name: lead.service ?? "—",
          invoice_number: latestInvoice?.invoice_number ?? "—",
          order_created_at: app.created_at ? istFmt(app.created_at) : "—",
          closure_date: istFmt(closedAt),
          closure_reason: data.reasonLabel,
          reason: data.reasonLabel,
          reason_block: defaultClosureReply || data.reasonLabel,
          employee_remarks: closeRemarks,
          additional_remarks: closeRemarks,
          remarks: closeRemarks,
          date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"),
          company_name: COMPANY_NAME,
          support_email: SUPPORT_EMAIL
        }, {
          toName: lead.name ?? void 0,
          leadId: app.lead_id ?? void 0,
          applicationId: app.id,
          trigger: "manual"
        });
      }
    } catch (e) {
      console.error("[closeOrder] closure email failed", e);
    }
  }
  try {
    await writeAudit({
      supabase,
      entityType: "application",
      entityId: app.id,
      action: isSilent ? "workflow_silent_close_order" : "workflow_close_order",
      oldValue: {
        workflow_status: app.workflow_status
      },
      newValue: {
        workflow_status: "closed",
        reason: data.reasonCode,
        notes: data.notes ?? null,
        silent: isSilent
      },
      actorId: userId
    });
  } catch (auditErr) {
    console.warn("[closeOrder] writeAudit warning:", auditErr);
  }
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: app.id,
      actorId: userId,
      actorName: name,
      actionName: isSilent ? "Silent Close" : "Order Force Closed",
      actionReason: `Order closed (${data.reasonLabel})`,
      supabase: admin
    });
  } catch (hotErr) {
    console.warn("[closeOrder] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true,
    silent: isSilent
  };
}
const closeOrder_createServerFn_handler = createServerRpc({
  id: "17f0721bc034b4970400a330b29343e6721eb01fe6470405b55eeb1ae991dca2",
  name: "closeOrder",
  filename: "src/lib/crm/workflow-closure.functions.ts"
}, (opts) => closeOrder.__executeServer(opts));
const closeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  reasonCode: string().min(1).max(64),
  reasonLabel: string().min(1).max(160),
  notes: string().max(4e3).optional(),
  silent: boolean().optional().default(false)
}).parse(d)).handler(closeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  return executeOrderClosure({
    supabase: context.supabase,
    userId: context.userId,
    data
  });
});
const silentCloseOrder_createServerFn_handler = createServerRpc({
  id: "6c00305b8313de356d6fc20dd2f97a12d6bc4d061a267cf63a7fd39f0dfae5cc",
  name: "silentCloseOrder",
  filename: "src/lib/crm/workflow-closure.functions.ts"
}, (opts) => silentCloseOrder.__executeServer(opts));
const silentCloseOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  reasonCode: string().optional().default("ADMIN_SILENT_CLOSE"),
  reasonLabel: string().optional().default("Silent Close (Admin Override)"),
  notes: string().max(4e3).optional()
}).parse(d)).handler(silentCloseOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  return executeOrderClosure({
    supabase: context.supabase,
    userId: context.userId,
    data: {
      applicationId: data.applicationId,
      reasonCode: data.reasonCode,
      reasonLabel: data.reasonLabel,
      notes: data.notes,
      silent: true
    }
  });
});
const createRefundRequest_createServerFn_handler = createServerRpc({
  id: "5c84987b4df8a607f9b4726f0d1383b336bfc825713aa01e61f0d1f9dc793d1a",
  name: "createRefundRequest",
  filename: "src/lib/crm/workflow-closure.functions.ts"
}, (opts) => createRefundRequest.__executeServer(opts));
const createRefundRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  paymentId: string().uuid().optional(),
  reason: string().max(2e3).optional(),
  reasonCode: string().max(64).optional(),
  customerNotes: string().max(2e3).optional(),
  refundAmount: number().nonnegative().optional(),
  refundMode: _enum(["full", "partial"]).optional()
}).parse(d)).handler(createRefundRequest_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  const name = await actorName(context.supabase, context.userId);
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id, application_code").eq("id", data.applicationId).maybeSingle();
  if (!app) throw new Error("Application not found");
  const {
    data: row,
    error
  } = await admin.from("refund_requests").insert({
    application_id: app.id,
    lead_id: app.lead_id,
    payment_id: data.paymentId ?? null,
    reason: data.reason ?? null,
    reason_code: data.reasonCode ?? null,
    customer_notes: data.customerNotes ?? null,
    refund_amount: data.refundAmount ?? null,
    refund_mode: data.refundMode ?? "full",
    status: "pending",
    created_by: context.userId
  }).select("id").single();
  if (error) throw new Error(error.message);
  await admin.from("applications").update({
    workflow_status: "refund_review"
  }).eq("id", app.id);
  await admin.from("workflow_events").insert({
    application_id: app.id,
    lead_id: app.lead_id,
    event_type: "refund_requested",
    title: "Refund requested",
    description: data.reason ?? null,
    customer_visible: false,
    actor_id: context.userId,
    actor_name: name,
    is_system: false,
    metadata: {
      refund_request_id: row.id,
      amount: data.refundAmount ?? null
    }
  });
  return {
    ok: true,
    id: row.id
  };
});
const listRefundRequests_createServerFn_handler = createServerRpc({
  id: "8d26cdba261f14f0ab9ac68dd289ccc9a884bbf2e560e508edf5a8195ea09a12",
  name: "listRefundRequests",
  filename: "src/lib/crm/workflow-closure.functions.ts"
}, (opts) => listRefundRequests.__executeServer(opts));
const listRefundRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  status: _enum(["pending", "approved", "rejected", "info_needed", "escalated"]).optional(),
  applicationId: string().uuid().optional()
}).parse(d)).handler(listRefundRequests_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...STAFF]);
  const admin = await getAdmin();
  let q = admin.from("refund_requests").select("*, application:applications(application_code, lead_id), lead:leads(name,email,lead_code,service)").order("created_at", {
    ascending: false
  }).limit(200);
  if (data.status) q = q.eq("status", data.status);
  if (data.applicationId) q = q.eq("application_id", data.applicationId);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
const decideRefundRequest_createServerFn_handler = createServerRpc({
  id: "26512d7455b89ae6ebb1899b7cc9642929a509dac6b82725cde3993486c58760",
  name: "decideRefundRequest",
  filename: "src/lib/crm/workflow-closure.functions.ts"
}, (opts) => decideRefundRequest.__executeServer(opts));
const decideRefundRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  id: string().uuid(),
  decision: _enum(["approved", "rejected", "info_needed", "escalated"]),
  adminNotes: string().max(4e3).optional()
}).parse(d)).handler(decideRefundRequest_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, [...REFUND_ROLES]);
  const admin = await getAdmin();
  const name = await actorName(context.supabase, context.userId);
  const {
    data: row
  } = await admin.from("refund_requests").select("*").eq("id", data.id).maybeSingle();
  if (!row) throw new Error("Refund request not found");
  const decided = ["approved", "rejected"].includes(data.decision);
  await admin.from("refund_requests").update({
    status: data.decision,
    admin_notes: data.adminNotes ?? row.admin_notes,
    reviewer_id: context.userId,
    decided_at: decided ? (/* @__PURE__ */ new Date()).toISOString() : null
  }).eq("id", data.id);
  if (data.decision === "approved") {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    await admin.from("applications").update({
      workflow_status: "refund_closed",
      closure_stage: "refund_approved",
      fulfillment_status: "order_closed",
      refund_approved_at: nowIso,
      refund_approved_by: context.userId
    }).eq("id", row.application_id);
    if (row.lead_id) {
      try {
        const {
          transitionLeadStatus
        } = await import("./lead-status.functions-rIiSyzbQ.mjs");
        await transitionLeadStatus({
          data: {
            leadId: row.lead_id,
            toStatus: "refund_approved"
          }
        });
      } catch (err) {
        console.warn("[decideRefundRequest] lead transition to refund_approved failed:", err);
      }
    }
  } else if (data.decision === "rejected") {
    await admin.from("applications").update({
      workflow_status: "closed",
      closure_stage: "closed"
    }).eq("id", row.application_id);
  }
  await admin.from("workflow_events").insert({
    application_id: row.application_id,
    lead_id: row.lead_id,
    event_type: `refund_${data.decision}`,
    title: `Refund ${data.decision.replace("_", " ")}`,
    description: data.adminNotes ?? null,
    customer_visible: ["approved", "rejected"].includes(data.decision),
    actor_id: context.userId,
    actor_name: name,
    is_system: false,
    metadata: {
      refund_request_id: row.id
    }
  });
  await writeAudit({
    supabase: context.supabase,
    entityType: "application",
    entityId: row.application_id,
    action: `refund_${data.decision}`,
    oldValue: {
      status: row.status
    },
    newValue: {
      status: data.decision
    },
    actorId: context.userId
  });
  return {
    ok: true
  };
});
export {
  closeOrder_createServerFn_handler,
  createRefundRequest_createServerFn_handler,
  decideRefundRequest_createServerFn_handler,
  listRefundRequests_createServerFn_handler,
  silentCloseOrder_createServerFn_handler
};
