import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { i as isUserAdmin } from "./audit-DZHwwAr_.mjs";
import { g as getUserModulePermission } from "./permissions.functions-DO0h7DgB.mjs";
import { c as computeOrderStage, S as STAGE_META } from "./computeOrderStage-D7ejTUnj.mjs";
import { i as istDateKey } from "./datetime-DvkGwlJs.mjs";
import { n as normalizeOrdersFilter } from "./orders-filter-CXWoZisU.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, _ as _enum, s as string, n as number, b as boolean, l as literal } from "../_libs/zod.mjs";
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
import "./createSsrRpc-BO-AEXHh.mjs";
import "./roles-CFhgFhhh.mjs";
import "./consultation-asWR5IET.mjs";
const FULFILLMENT_STAGES = [
  "order_received",
  "awaiting_customer_form",
  "waiting_for_customer_submission",
  "form_submitted",
  "technical_delay",
  "customer_delay",
  "government_processing",
  "consultation_completed",
  "application_approved",
  "application_rejected",
  "order_completed",
  "order_closed"
];
const FULFILLMENT_LABEL = {
  order_received: "Incomplete Form",
  awaiting_customer_form: "Awaiting Customer Form",
  waiting_for_customer_submission: "Waiting for Customer Submission",
  form_submitted: "Form Submitted",
  technical_delay: "Technical Delay",
  customer_delay: "Customer Side Delay",
  government_processing: "Government Processing",
  consultation_completed: "Consultation Completed",
  application_approved: "Application Approved",
  application_rejected: "Application Rejected",
  order_completed: "Order Completed",
  order_closed: "Order Closed",
  order_reopened: "Order Reopened",
  completed: "Order Completed",
  cancelled: "Order Closed"
};
const FULFILLMENT_TRANSITIONS = {
  order_received: ["awaiting_customer_form", "order_closed"],
  awaiting_customer_form: ["waiting_for_customer_submission", "order_closed"],
  waiting_for_customer_submission: ["form_submitted", "order_closed"],
  form_submitted: [
    "technical_delay",
    "customer_delay",
    "government_processing",
    "consultation_completed",
    "application_approved",
    "application_rejected",
    "order_completed",
    "order_closed"
  ],
  order_reopened: [
    "form_submitted",
    "technical_delay",
    "customer_delay",
    "government_processing",
    "consultation_completed",
    "application_approved",
    "application_rejected",
    "order_completed",
    "completed",
    "order_closed"
  ],
  technical_delay: ["form_submitted", "order_closed"],
  customer_delay: ["form_submitted", "order_closed"],
  government_processing: [
    "consultation_completed",
    "application_approved",
    "application_rejected",
    "order_completed",
    "order_closed"
  ],
  consultation_completed: ["application_approved", "application_rejected", "order_completed", "order_closed"],
  application_approved: ["order_completed", "order_closed"],
  application_rejected: ["order_closed"],
  order_completed: [],
  order_closed: [],
  completed: [],
  cancelled: []
};
function getAllowedFulfillmentTransitions(current) {
  return FULFILLMENT_TRANSITIONS[current] ?? [];
}
function hasCurrentCycleCompletion(reopenedAt, activeCallback, events, schedulers) {
  const time = (value) => {
    const parsed = value ? Date.parse(value) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const cycleStart = Math.max(time(reopenedAt), time(activeCallback?.created_at));
  return events.some((event) => {
    if (time(event.created_at) < cycleStart) return false;
    const type = String(event.event_type ?? "").toLowerCase();
    const note = String(event.note ?? "").toLowerCase();
    return type.includes("callback_completed") || type.includes("consultation_completed") || note.includes("callback marked completed") || note.includes("call completed");
  }) || schedulers.some((scheduler) => {
    if (scheduler.status !== "completed" || time(scheduler.created_at) < cycleStart) return false;
    const type = String(scheduler.scheduler_type ?? "").toLowerCase();
    return type.includes("reminder") || type.includes("callback") || type.includes("our_side");
  });
}
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function assertStaff(_supabase, userId) {
  const admin = await getAdmin();
  let query = admin.from("user_roles").select("role");
  if (userId) query = query.eq("user_id", userId);
  const {
    data
  } = await query;
  const roles = new Set((data ?? []).map((r) => r.role));
  const allowed = ["admin", "super_admin", "operations", "support", "accounts", "finance", "executive", "manager"];
  if (!allowed.some((r) => roles.has(r))) throw new Error("Forbidden");
}
async function getStaff(userId) {
  const admin = await getAdmin();
  const [{
    data: p
  }, {
    data: rr
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle()]);
  return {
    staff_name: p?.display_name || p?.email || "Staff",
    staff_role: rr?.role || "staff"
  };
}
function rollupPaymentStatus(payments, total) {
  if (!payments.length) return "Pending";
  const positives = payments.filter((p) => Number(p.amount || 0) >= 0);
  const refunds = payments.filter((p) => Number(p.amount || 0) < 0 || p.status === "refunded");
  if (refunds.length && positives.every((p) => p.status === "refunded")) return "Refunded";
  const paidSum = positives.filter((p) => ["paid", "success", "successful"].includes(p.status)).reduce((s, p) => s + Number(p.amount || 0), 0);
  if (paidSum <= 0) {
    if (positives.some((p) => ["failed", "cancelled"].includes(p.status))) return "Failed";
    return "Pending";
  }
  if (total > 0 && paidSum < total - 0.01) return "Partially Paid";
  return "Paid";
}
const RECONCILE_INTERVAL_MS = 10 * 6e4;
let lastReconcileAt = 0;
let reconcileRunning = false;
async function ensurePaidOrdersIntegrated(admin) {
  try {
    const lookbackDate = new Date(Date.now() - 30 * 24 * 36e5).toISOString();
    const {
      data: pendingPayments
    } = await admin.from("payments").select("id, lead_id, gateway_name, transaction_id, razorpay_order_id, status").in("status", ["created", "attempted", "failed"]).gt("created_at", lookbackDate).limit(50);
    if (pendingPayments && pendingPayments.length > 0) {
      const {
        finalizePaidPayment
      } = await import("./finalize-paid.server-CnNMG_m8.mjs");
      for (const p of pendingPayments) {
        const txnid = p.transaction_id || p.razorpay_order_id;
        if (!txnid) continue;
        const gw = String(p.gateway_name ?? "payu").toLowerCase();
        if (gw === "payu") {
          try {
            const {
              verifyPayUPayment
            } = await import("./payu.server-3jw08lkR.mjs");
            const verified = await verifyPayUPayment(txnid);
            const status = String(verified?.status ?? "").trim().toLowerCase();
            const unmapped = String(verified?.unmappedstatus ?? "").trim().toLowerCase();
            if (status === "success" || unmapped === "captured") {
              const mihpayid = verified?.mihpayid ? String(verified.mihpayid) : null;
              await admin.from("payments").update({
                status: "paid",
                payment_date: (/* @__PURE__ */ new Date()).toISOString(),
                razorpay_payment_id: mihpayid,
                payu_mihpayid: mihpayid,
                raw_response: {
                  verified_payment: verified,
                  source: "ensurePaidOrdersIntegrated"
                }
              }).eq("id", p.id);
              await finalizePaidPayment(p.id, {
                source: "reconcile",
                txnid,
                mihpayid
              });
            }
          } catch (err) {
            console.error(`[ensurePaidOrdersIntegrated] PayU verify failed for ${txnid}:`, err);
          }
        } else if (gw === "ccavenue") {
          try {
            const {
              callOrderStatusApi
            } = await import("./ccavenue.server-DLXDMTcZ.mjs");
            const reconciled = await callOrderStatusApi(txnid);
            if (reconciled.status === "paid") {
              await admin.from("payments").update({
                status: "paid",
                payment_date: (/* @__PURE__ */ new Date()).toISOString(),
                raw_response: {
                  reconciled: reconciled.raw,
                  source: "ensurePaidOrdersIntegrated"
                }
              }).eq("id", p.id);
              await finalizePaidPayment(p.id, {
                source: "reconcile",
                txnid,
                mihpayid: reconciled.trackingId || null
              });
            }
          } catch (err) {
            console.error(`[ensurePaidOrdersIntegrated] CCAvenue verify failed for ${txnid}:`, err);
          }
        }
      }
    }
    const {
      data: unlinkedPayments
    } = await admin.from("payments").select("id, lead_id, application_id, status").in("status", ["paid"]).is("application_id", null).limit(100);
    if (unlinkedPayments && unlinkedPayments.length > 0) {
      const {
        finalizePaidPayment
      } = await import("./finalize-paid.server-CnNMG_m8.mjs");
      for (const p of unlinkedPayments) {
        if (!p.lead_id) continue;
        try {
          await finalizePaidPayment(p.id, {
            source: "reconcile"
          });
        } catch (err) {
          console.error(`[self-heal] finalizePaidPayment failed for ${p.id}:`, err);
        }
      }
    }
    const {
      data: appsWithLeads
    } = await admin.from("applications").select("lead_id").eq("is_deleted", false).not("lead_id", "is", null).limit(200);
    if (appsWithLeads && appsWithLeads.length > 0) {
      const appLeadIds = Array.from(new Set(appsWithLeads.map((a) => a.lead_id)));
      const {
        data: unsyncedLeads
      } = await admin.from("leads").select("id, status").in("id", appLeadIds).not("status", "in", "(payment_successful,under_process,completed)");
      const candidateIds = (unsyncedLeads ?? []).map((l) => l.id);
      let unsyncedIds = [];
      if (candidateIds.length > 0) {
        const {
          data: paidRows
        } = await admin.from("payments").select("lead_id").in("lead_id", candidateIds).eq("status", "paid");
        const {
          data: pendingLinks
        } = await admin.from("payment_links").select("lead_id").in("lead_id", candidateIds).eq("status", "pending");
        const pendingSet = new Set((pendingLinks ?? []).map((r) => r.lead_id));
        unsyncedIds = Array.from(new Set((paidRows ?? []).map((r) => r.lead_id).filter((id) => !pendingSet.has(id))));
      }
      if (unsyncedIds.length > 0) {
        await admin.from("leads").update({
          status: "payment_successful",
          lead_status_v2: "payment_successful"
        }).in("id", unsyncedIds);
      }
    }
    const {
      data: paidLeads
    } = await admin.from("leads").select("id, customer_id, service_id, assigned_to, website_id").in("status", ["payment_successful"]).limit(100);
    if (paidLeads && paidLeads.length > 0) {
      const leadIds = paidLeads.map((l) => l.id);
      const {
        data: existingApps
      } = await admin.from("applications").select("lead_id").in("lead_id", leadIds).eq("is_deleted", false);
      const existingLeadIdSet = new Set((existingApps ?? []).map((a) => a.lead_id));
      const {
        finalizePaidPayment
      } = await import("./finalize-paid.server-CnNMG_m8.mjs");
      for (const l of paidLeads) {
        if (!existingLeadIdSet.has(l.id)) {
          const {
            data: atomicApp
          } = await admin.from("applications").select("id").eq("lead_id", l.id).eq("is_deleted", false).limit(1).maybeSingle();
          if (atomicApp) continue;
          const {
            data: p
          } = await admin.from("payments").select("id").eq("lead_id", l.id).eq("status", "paid").order("created_at", {
            ascending: false
          }).limit(1).maybeSingle();
          if (p?.id) {
            try {
              await finalizePaidPayment(p.id, {
                source: "reconcile"
              });
            } catch (err) {
              console.error(`[self-heal] finalizePaidPayment failed for lead ${l.id}:`, err);
            }
          } else {
            const {
              data: createdApp,
              error: createAppError
            } = await admin.from("applications").insert({
              lead_id: l.id,
              customer_id: l.customer_id ?? null,
              service_id: l.service_id ?? null,
              // Paid orders rotate independently from leads. Leaving this
              // empty lets the order assignment trigger choose the next
              // employee instead of copying the lead owner.
              assigned_to: null,
              website_id: l.website_id ?? null,
              application_status: "payment_received",
              fulfillment_status: "order_received"
            }).select("id").maybeSingle();
            if (createdApp?.id) {
              await admin.from("payments").update({
                application_id: createdApp.id,
                status: "paid"
              }).eq("lead_id", l.id);
            } else if (createAppError?.code !== "23505") {
              console.error(`[self-heal] order create failed for lead ${l.id}:`, createAppError);
            }
          }
        }
      }
    }
    const {
      data: pendingLeads
    } = await admin.from("leads").select("id").eq("status", "payment_pending").limit(100);
    if (pendingLeads && pendingLeads.length > 0) {
      const pIds = pendingLeads.map((l) => l.id);
      const {
        data: pmtRows
      } = await admin.from("payments").select("lead_id").in("lead_id", pIds);
      const {
        data: linkRows
      } = await admin.from("payment_links").select("lead_id").in("lead_id", pIds);
      const {
        data: appRows
      } = await admin.from("applications").select("lead_id").in("lead_id", pIds).eq("is_deleted", false);
      const activePLeadIds = new Set([...(pmtRows ?? []).map((p) => p.lead_id), ...(linkRows ?? []).map((l) => l.lead_id), ...(appRows ?? []).map((a) => a.lead_id)].filter(Boolean));
      const orphanedLeadIds = pIds.filter((id) => !activePLeadIds.has(id));
      if (orphanedLeadIds.length > 0) {
        await admin.from("leads").update({
          status: "new_lead",
          lead_status_v2: "new_lead"
        }).in("id", orphanedLeadIds);
      }
    }
    const {
      data: nullSvcApps
    } = await admin.from("applications").select("id, lead_id, service_id").is("service_id", null).not("lead_id", "is", null).eq("is_deleted", false).limit(100);
    if (nullSvcApps && nullSvcApps.length > 0) {
      const leadIds = Array.from(new Set(nullSvcApps.map((a) => a.lead_id)));
      const {
        data: leadsWithSvc
      } = await admin.from("leads").select("id, service_id, service").in("id", leadIds);
      const leadSvcMap = new Map((leadsWithSvc ?? []).map((l) => [l.id, l]));
      const {
        data: allServices
      } = await admin.from("services").select("id, service_name");
      const svcNameToId = /* @__PURE__ */ new Map();
      for (const s of allServices ?? []) {
        if (s.service_name) {
          svcNameToId.set(s.service_name.trim().toLowerCase(), s.id);
        }
      }
      for (const app of nullSvcApps) {
        const lead = leadSvcMap.get(app.lead_id);
        if (!lead) continue;
        let resolvedServiceId = lead.service_id;
        if (!resolvedServiceId && lead.service) {
          resolvedServiceId = svcNameToId.get(lead.service.trim().toLowerCase()) ?? null;
        }
        if (resolvedServiceId) {
          await admin.from("applications").update({
            service_id: resolvedServiceId
          }).eq("id", app.id);
          if (!lead.service_id) {
            await admin.from("leads").update({
              service_id: resolvedServiceId
            }).eq("id", lead.id);
          }
        }
      }
    }
  } catch (err) {
    console.error("[ensurePaidOrdersIntegrated] error:", err);
  }
}
const CLOSED_FS = /* @__PURE__ */ new Set(["application_rejected", "certificate_rejected", "order_closed", "cancelled"]);
const COMPLETED_FS = /* @__PURE__ */ new Set(["consultation_completed", "order_completed", "completed", "certificate_ready", "certificate_delivered", "certificate_uploaded", "service_completed", "application_approved", "approved"]);
const EXCEPTION_STAGES = ["refund_requested", "refunded", "uninterested"];
const NEEDS_ACTION_STAGES = ["lead_received", "payment_done", "form_submitted", "form_not_submitted", "order_reopened"];
function isNeedsActionOrder(row) {
  if (row.is_terminal) return false;
  if (row.customer_resumed_pending) return true;
  if (row.is_callback_scheduled || row.callback_reminder && !row.callback_reminder.is_due) return false;
  if (row.is_hot) return true;
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  const stage = String(row.stage ?? "").toLowerCase();
  const os = String(row.order_status ?? "").toUpperCase();
  const ws = String(row.workflow_status ?? "").toLowerCase();
  if (stage === "completed" || stage === "closed" || COMPLETED_FS.has(fs) || CLOSED_FS.has(fs)) return false;
  if (isTechnicalDelayOrder(row) || isCustomerDelayOrder(row)) return false;
  if (Boolean(row.form_link_sent_at) || fs === "form_not_submitted" || stage === "form_not_submitted" && os !== "REOPENED" && fs !== "order_reopened" && ws !== "order_reopened" || fs === "awaiting_customer_form" || fs === "waiting_for_customer_submission" || fs === "form_link_sent" || fs === "form_pending" || stage === "form_not_submitted" && Boolean(row.form_link_sent_at)) {
    return false;
  }
  const progressedStages = /* @__PURE__ */ new Set(["submitted_to_govt", "under_processing", "under_review", "certificate_ready", "certificate_delivered", "certificate_uploaded", "consultation_completed", "refunded", "refund_requested", "application_rejected", "certificate_rejected", "verification_pending", "documents_received", "government_processing"]);
  if (progressedStages.has(stage) || progressedStages.has(fs)) return false;
  if (row.in_range_action_taken || row.action_count && row.action_count > 0) {
    return false;
  }
  const isCurrentlyReopened = stage === "order_reopened" || fs === "order_reopened" || ws === "order_reopened" || os === "REOPENED";
  if (isCurrentlyReopened || row.is_hot) return true;
  return stage === "lead_received" || stage === "payment_done" || stage === "form_submitted" || stage === "form_not_submitted" || stage === "order_reopened" || fs === "order_received" || fs === "payment_done" || fs === "form_submitted";
}
function isNeedsActionStage(stage) {
  return NEEDS_ACTION_STAGES.includes(stage);
}
function isCustomerDelayOrder(row) {
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  const stage = String(row.stage ?? "").toLowerCase();
  if (row.is_terminal || stage === "completed" || stage === "closed" || COMPLETED_FS.has(fs) || CLOSED_FS.has(fs)) return false;
  const ws = String(row.workflow_status ?? "").toLowerCase();
  const os = String(row.order_status ?? "").toUpperCase();
  const cbChannel = String(row.callback_reminder?.remarks?.channel ?? "").toLowerCase();
  const cbReason = String(row.callback_reminder?.remarks?.reason ?? "").toLowerCase();
  const cbKind = String(row.callback_reminder?.remarks?.kind ?? "").toLowerCase();
  const schedulerType = String(row.callback_reminder?.scheduler_type ?? "").toLowerCase();
  const reasonCat = String(row.callback_reminder?.remarks?.reasonCategory ?? "").toUpperCase();
  return stage === "customer_delay" || fs === "customer_delay" || fs === "customer_hold" || ws === "customer_delay" || ws === "waiting_for_customer" || ws === "waiting_for_documents" || ws === "customer_non_responsive" || ws === "external_dependency" || os === "CUSTOMER_HOLD" || cbChannel === "customer_delay" || cbReason === "customer_delay" || cbKind === "customer_delay" || cbKind === "external_dependency" || schedulerType === "customer_delay_reminder" || schedulerType === "customer_hold_reminder" || schedulerType === "customer_side_delay" || reasonCat === "A" || Boolean(row.customer_hold_started_at);
}
function isTechnicalDelayOrder(row) {
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  const stage = String(row.stage ?? "").toLowerCase();
  if (row.is_terminal || stage === "completed" || stage === "closed" || COMPLETED_FS.has(fs) || CLOSED_FS.has(fs)) return false;
  if (isCustomerDelayOrder(row)) return false;
  const ws = String(row.workflow_status ?? "").toLowerCase();
  const os = String(row.order_status ?? "").toUpperCase();
  const cbChannel = String(row.callback_reminder?.remarks?.channel ?? "").toLowerCase();
  const cbReason = String(row.callback_reminder?.remarks?.reason ?? "").toLowerCase();
  const cbKind = String(row.callback_reminder?.remarks?.kind ?? "").toLowerCase();
  const schedulerType = String(row.callback_reminder?.scheduler_type ?? "").toLowerCase();
  const reasonCat = String(row.callback_reminder?.remarks?.reasonCategory ?? "").toUpperCase();
  return stage === "technical_delay" || fs === "technical_delay" || fs === "technical_hold" || ws === "technical_delay" || ws === "technical_hold" || ws === "government_portal_pending" || os.includes("TECHNICAL_HOLD") || cbChannel === "technical_delay" || cbReason === "technical_delay" || cbKind === "technical_delay" || schedulerType === "technical_hold_reminder" || schedulerType === "our_side_delay" || reasonCat === "B" || Boolean(row.technical_hold_started_at) && !Boolean(row.customer_hold_started_at);
}
function isCallbackScheduledOrder(row) {
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  const stage = String(row.stage ?? "").toLowerCase();
  if (row.is_terminal || row.is_hot || stage === "completed" || stage === "closed" || COMPLETED_FS.has(fs) || CLOSED_FS.has(fs)) return false;
  return Boolean(row.is_callback_scheduled || row.callback_reminder && !row.callback_reminder.is_due);
}
function bucketOfRow(row, todayIst) {
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  if (EXCEPTION_STAGES.includes(row.stage)) return "exception";
  if (CLOSED_FS.has(fs) || row.stage === "closed") return "closed";
  if (COMPLETED_FS.has(fs) || row.stage === "completed") return "completed";
  if (row.is_hot && !row.in_range_action_taken && !(row.action_count && row.action_count > 0)) {
    return "hot_orders";
  }
  if (row.customer_resumed_pending) return "needs_action";
  if (row.is_callback_scheduled || row.callback_reminder && !row.callback_reminder.is_due) return "reminders";
  if (isCustomerDelayOrder(row)) return "customer_delay";
  if (isTechnicalDelayOrder(row)) return "technical_delay";
  const curToday = todayIst || istDateKey(/* @__PURE__ */ new Date());
  const rowDate = istDateKey(row.created_at);
  if (rowDate && rowDate < curToday && isNeedsActionOrder(row)) {
    return "backlog";
  }
  if (isNeedsActionOrder(row)) {
    return "needs_action";
  }
  return "pending";
}
function getOrderActionStatus(order) {
  if (order.is_hot) {
    return {
      label: "Call Due Now",
      tone: "red"
    };
  }
  if (order.is_callback_scheduled) {
    return {
      label: "Scheduled Callback",
      tone: "blue"
    };
  }
  const fs = order.fulfillment_status ?? "order_received";
  const stage = order.stage;
  const greenStatuses = /* @__PURE__ */ new Set(["application_approved", "consultation_completed", "order_completed", "completed"]);
  if (greenStatuses.has(fs) || stage === "completed") {
    return {
      label: "Order Completed",
      tone: "green"
    };
  }
  if (fs === "order_closed" || fs === "cancelled" || stage === "closed") {
    return {
      label: "Order Closed",
      tone: "red"
    };
  }
  const blueStatuses = /* @__PURE__ */ new Set(["government_processing", "technical_delay", "customer_delay", "application_rejected", "certificate_rejected", "under_processing", "application_submitted", "verification_pending", "documents_received", "waiting_for_customer_submission", "awaiting_customer_form", "form_link_sent", "form_pending"]);
  const blueStages = /* @__PURE__ */ new Set(["technical_delay", "customer_delay", "consultation_completed", "under_review", "in_progress", "submitted_to_govt", "under_processing", "certificate_ready", "refunded", "refund_requested"]);
  if (Boolean(order.in_range_action_taken) || Boolean(order.action_count && order.action_count > 0) || blueStatuses.has(fs) || blueStages.has(stage) || Boolean(order.form_link_sent_at)) {
    return {
      label: "Action Taken",
      tone: "blue"
    };
  }
  return {
    label: "Action Required",
    tone: "red"
  };
}
async function fetchAllPages(build) {
  const PAGE = 1e3;
  const out = [];
  for (let from = 0; ; from += PAGE) {
    const {
      data,
      error
    } = await build(from, from + PAGE - 1);
    if (error) return {
      data: out,
      error
    };
    out.push(...data ?? []);
    if (!data || data.length < PAGE) break;
  }
  return {
    data: out,
    error: null
  };
}
async function fetchInChunks(ids, chunkSize, fetchFn) {
  if (!ids || ids.length === 0) return [];
  const results = [];
  const chunks = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize));
  }
  const batchSize = 10;
  for (let b = 0; b < chunks.length; b += batchSize) {
    const currentBatch = chunks.slice(b, b + batchSize);
    const resList = await Promise.all(currentBatch.map((c) => fetchFn(c)));
    for (const res of resList) {
      if (res.error) console.error("[fetchInChunks] error:", res.error);
      if (res.data) results.push(...res.data);
    }
  }
  return results;
}
const listOrdersV2_createServerFn_handler = createServerRpc({
  id: "2127d0ea2e52451bb93b757bd02a315019800baabc585ac98f871e0270d3040a",
  name: "listOrdersV2",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => listOrdersV2.__executeServer(opts));
const listOrdersV2 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(50),
  fulfillmentStatus: string().optional(),
  serviceId: string().optional(),
  assignedTo: string().optional(),
  paymentStatus: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional(),
  search: string().max(120).optional(),
  bucket: string().optional().default("all"),
  stage: string().optional(),
  actionStatus: string().optional().default("all"),
  pendingAge: string().optional(),
  customDays: string().optional(),
  sortField: _enum(["created_at", "stage", "stage_journey"]).optional().default("created_at"),
  sortOrder: _enum(["asc", "desc"]).optional().default("desc"),
  viewMode: _enum(["self", "team"]).optional().default("self")
}).parse(i ?? {})).handler(listOrdersV2_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertStaff(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    getStaffRoleInfo
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  const staffInfo = await getStaffRoleInfo(admin, context.userId);
  const {
    isAdmin,
    isManager
  } = staffInfo;
  const perm = await getUserModulePermission(context.supabase, context.userId, "orders");
  if (!perm.canView) {
    return {
      rows: [],
      total: 0,
      counts: {
        all: 0,
        needs_action: 0,
        pending: 0,
        completed: 0,
        closed: 0,
        exception: 0,
        actionRequired: 0,
        processed: 0,
        reminders: 0,
        hot_orders: 0,
        technical_delay: 0,
        customer_delay: 0,
        totalAll: 0
      },
      ageBuckets: {
        d1: 0,
        d2: 0,
        d3: 0,
        d7: 0,
        older: 0
      },
      page: data.page,
      pageSize: data.pageSize,
      teamBreakdown: []
    };
  }
  const nowMs = Date.now();
  if (!reconcileRunning && nowMs - lastReconcileAt > RECONCILE_INTERVAL_MS) {
    lastReconcileAt = nowMs;
    reconcileRunning = true;
    ensurePaidOrdersIntegrated(admin).catch((err) => {
      console.error("[listOrdersV2] background reconciliation error:", err);
    }).finally(() => {
      reconcileRunning = false;
    });
  }
  if (!isAdmin && !isManager) {
    const todayKey = istDateKey(/* @__PURE__ */ new Date());
    data.dateFrom = todayKey;
    data.dateTo = todayKey;
  }
  const normalized = normalizeOrdersFilter(data);
  let matchingLeadIds = null;
  if (data.search && data.search.trim()) {
    const s = `%${data.search.trim()}%`;
    const {
      data: matchedLeads
    } = await admin.from("leads").select("id").or(`name.ilike.${s},mobile.ilike.${s},email.ilike.${s},lead_code.ilike.${s}`).limit(200);
    matchingLeadIds = (matchedLeads ?? []).map((l) => l.id);
  }
  function buildBaseQuery() {
    let query = admin.from("applications").select("id, application_code, fulfillment_status, application_status, order_status, created_at, assigned_to, lead_id, customer_id, service_id, form_submitted_at, certificate_uploaded_at, fulfilled_at, updated_at, reopened_at, workflow_status, closure_stage, closure_reason_code, refund_approved_at, refund_processed_at, technical_hold_started_at, technical_hold_kind, customer_hold_started_at, active_reason_text, workflow_delay_reason").eq("is_deleted", false);
    if (data.serviceId && data.serviceId !== "all" && data.serviceId.trim() !== "") {
      query = query.eq("service_id", data.serviceId);
    }
    const hasSearch2 = Boolean(data.search && data.search.trim());
    const isTeamMode = data.viewMode === "team";
    if (isTeamMode) {
      if (data.assignedTo && data.assignedTo !== "all" && data.assignedTo.trim() !== "") {
        if (data.assignedTo === "unassigned") {
          query = query.is("assigned_to", null);
        } else {
          query = query.eq("assigned_to", data.assignedTo);
        }
      } else if (!isAdmin) {
        query = query.neq("assigned_to", context.userId);
      }
    } else {
      if ((isAdmin || isManager) && data.assignedTo && data.assignedTo !== "all" && data.assignedTo.trim() !== "") {
        if (data.assignedTo === "unassigned") {
          query = query.is("assigned_to", null);
        } else {
          query = query.eq("assigned_to", data.assignedTo);
        }
      } else if (!isAdmin && (!isManager || !hasSearch2)) {
        query = query.eq("assigned_to", context.userId);
      }
    }
    if (data.search && data.search.trim()) {
      const term = `%${data.search.trim()}%`;
      if (matchingLeadIds && matchingLeadIds.length > 0) {
        query = query.or(`application_code.ilike.${term},lead_id.in.(${matchingLeadIds.join(",")})`);
      } else {
        query = query.ilike("application_code", term);
      }
    }
    return query;
  }
  const [inRangeCreatedRes, inRangeUpdatedRes, inRangeFulfilledRes, inRangeCertRes, inRangeTechHoldRes, inRangeCustHoldRes, inRangeEventsRes, inRangeCertificatesTableRes, inRangeActionLogsRes, inRangeSchedulersRes, activePortfolioRes] = await Promise.all([(() => {
    let q = buildBaseQuery();
    if (normalized.fromIso) q = q.gte("created_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("created_at", normalized.toIso);
    return q.order("created_at", {
      ascending: false
    }).limit(5e3);
  })(), (() => {
    let q = buildBaseQuery();
    if (normalized.fromIso) q = q.gte("updated_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("updated_at", normalized.toIso);
    return q.order("updated_at", {
      ascending: false
    }).limit(5e3);
  })(), (() => {
    let q = buildBaseQuery();
    if (normalized.fromIso) q = q.gte("fulfilled_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("fulfilled_at", normalized.toIso);
    return q.order("fulfilled_at", {
      ascending: false
    }).limit(5e3);
  })(), (() => {
    let q = buildBaseQuery();
    if (normalized.fromIso) q = q.gte("certificate_uploaded_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("certificate_uploaded_at", normalized.toIso);
    return q.order("certificate_uploaded_at", {
      ascending: false
    }).limit(5e3);
  })(), (() => {
    let q = buildBaseQuery();
    if (normalized.fromIso) q = q.gte("technical_hold_started_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("technical_hold_started_at", normalized.toIso);
    return q.order("technical_hold_started_at", {
      ascending: false
    }).limit(5e3);
  })(), (() => {
    let q = buildBaseQuery();
    if (normalized.fromIso) q = q.gte("customer_hold_started_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("customer_hold_started_at", normalized.toIso);
    return q.order("customer_hold_started_at", {
      ascending: false
    }).limit(5e3);
  })(), (() => {
    let q = admin.from("application_events").select("id, application_id, event_type, old_value, new_value, note, created_by, staff_name, staff_role, created_at");
    if (normalized.fromIso) q = q.gte("created_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("created_at", normalized.toIso);
    return q.order("created_at", {
      ascending: false
    }).limit(1e4);
  })(), (() => {
    let q = admin.from("certificates").select("id, application_id, certificate_number, uploaded_by, issued_at, delivered_at, created_at");
    if (normalized.fromIso) q = q.gte("created_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("created_at", normalized.toIso);
    return q.order("created_at", {
      ascending: false
    }).limit(5e3);
  })(), (() => {
    let q = admin.from("order_action_logs").select("id, order_id, action_type, new_status, new_stage, employee_id, employee_name, notes, created_at");
    if (normalized.fromIso) q = q.gte("created_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("created_at", normalized.toIso);
    return q.order("created_at", {
      ascending: false
    }).limit(1e4);
  })(), (() => {
    let q = admin.from("order_schedulers").select("id, application_id, status, scheduler_type, fires_at, remarks, created_at, created_by");
    if (normalized.fromIso) q = q.gte("created_at", normalized.fromIso);
    if (normalized.toIso) q = q.lte("created_at", normalized.toIso);
    return q.order("created_at", {
      ascending: false
    }).limit(5e3);
  })(), buildBaseQuery().or("closure_stage.is.null,closure_stage.eq.none").not("fulfillment_status", "in", "(completed,order_completed,order_closed,cancelled,application_rejected,certificate_rejected,consultation_completed)").order("created_at", {
    ascending: false
  }).limit(5e3)]);
  if (inRangeCreatedRes.error) throw new Error(inRangeCreatedRes.error.message);
  const mergedAppMap = /* @__PURE__ */ new Map();
  (activePortfolioRes.data ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  (inRangeCreatedRes.data ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  (inRangeUpdatedRes.data ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  (inRangeFulfilledRes.data ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  (inRangeCertRes.data ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  (inRangeTechHoldRes.data ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  (inRangeCustHoldRes.data ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  const inRangeEventAppIds = Array.from(new Set([...(inRangeEventsRes.data ?? []).map((e) => e.application_id), ...(inRangeCertificatesTableRes.data ?? []).map((c) => c.application_id), ...(inRangeActionLogsRes.data ?? []).map((l) => l.order_id), ...(inRangeSchedulersRes.data ?? []).map((s) => s.application_id)].filter((id) => id && !mergedAppMap.has(id))));
  if (inRangeEventAppIds.length > 0) {
    const extraApps = await fetchInChunks(inRangeEventAppIds, 200, (chunk) => buildBaseQuery().in("id", chunk));
    (extraApps ?? []).forEach((a) => mergedAppMap.set(a.id, a));
  }
  const appList = Array.from(mergedAppMap.values());
  if (appList.length === 0) {
    return {
      rows: [],
      total: 0,
      counts: {
        all: 0,
        needs_action: 0,
        pending: 0,
        completed: 0,
        closed: 0,
        exception: 0,
        actionRequired: 0,
        processed: 0,
        reminders: 0,
        hot_orders: 0,
        technical_delay: 0,
        customer_delay: 0,
        totalAll: 0,
        pending_orders: 0
      },
      ageBuckets: {
        d1: 0,
        d2: 0,
        d3: 0,
        d7: 0,
        older: 0
      },
      page: data.page,
      pageSize: data.pageSize,
      teamBreakdown: []
    };
  }
  const ids = appList.map((a) => a.id);
  const [eventsData, certsData, actionLogsData, globalActiveSchedulers] = await Promise.all([
    // Events: only the selected date range (what the counts need), plus the few
    // all-time state markers used for live Hot / reopen / resumed status.
    // Every query is paged so nothing is silently dropped at the 1,000-row API limit.
    (async () => {
      const cols = "id, application_id, event_type, old_value, new_value, note, created_by, staff_name, staff_role, created_at";
      const STATE_TYPES = ["hot_priority_escalated", "order_reopened", "customer_form_resumed", "callback_completed", "consultation_completed", "callback_scheduled"];
      const ranged = await fetchInChunks(ids, 200, (chunk) => fetchAllPages((from, to) => {
        let q = admin.from("application_events").select(cols).in("application_id", chunk);
        if (normalized.fromIso) q = q.gte("created_at", normalized.fromIso);
        if (normalized.toIso) q = q.lte("created_at", normalized.toIso);
        return q.order("created_at", {
          ascending: false
        }).order("id").range(from, to);
      }));
      if (!normalized.fromIso && !normalized.toIso) return ranged;
      const state = await fetchInChunks(ids, 200, (chunk) => fetchAllPages((from, to) => admin.from("application_events").select(cols).in("application_id", chunk).in("event_type", STATE_TYPES).order("created_at", {
        ascending: false
      }).order("id").range(from, to)));
      const seen = new Set(ranged.map((e) => e.id));
      return [...ranged, ...state.filter((e) => !seen.has(e.id))];
    })(),
    fetchInChunks(ids, 200, (chunk) => admin.from("certificates").select("id, application_id, certificate_number, uploaded_by, issued_at, delivered_at, created_at").in("application_id", chunk).order("created_at", {
      ascending: false
    })),
    fetchInChunks(ids, 200, (chunk) => admin.from("order_action_logs").select("id, order_id, action_type, new_status, new_stage, employee_id, employee_name, notes, created_at").in("order_id", chunk).order("created_at", {
      ascending: false
    }).limit(1e4)),
    fetchInChunks(ids, 200, (chunk) => admin.from("order_schedulers").select("id, application_id, status, scheduler_type, fires_at, remarks, created_at, created_by").in("application_id", chunk).order("created_at", {
      ascending: false
    }).limit(5e3))
  ]);
  const eventsRes = {
    data: eventsData
  };
  const certsTableRes = {
    data: certsData
  };
  const actionLogsRes = {
    data: actionLogsData
  };
  const appActionLogsMap = /* @__PURE__ */ new Map();
  const seenActionLogIds = /* @__PURE__ */ new Set();
  for (const l of [...inRangeActionLogsRes.data ?? [], ...actionLogsRes.data ?? []]) {
    if (l && l.order_id) {
      if (l.id) {
        if (seenActionLogIds.has(l.id)) continue;
        seenActionLogIds.add(l.id);
      }
      const arr = appActionLogsMap.get(l.order_id) ?? [];
      arr.push(l);
      appActionLogsMap.set(l.order_id, arr);
    }
  }
  const appEventsMap = /* @__PURE__ */ new Map();
  for (const ev of [...inRangeEventsRes.data ?? [], ...eventsRes.data ?? []]) {
    if (ev && ev.application_id) {
      const arr = appEventsMap.get(ev.application_id) ?? [];
      arr.push(ev);
      appEventsMap.set(ev.application_id, arr);
    }
  }
  const appSchedulersMap = /* @__PURE__ */ new Map();
  for (const s of [...inRangeSchedulersRes.data ?? [], ...globalActiveSchedulers ?? []]) {
    if (s && s.application_id) {
      const arr = appSchedulersMap.get(s.application_id) ?? [];
      arr.push(s);
      appSchedulersMap.set(s.application_id, arr);
    }
  }
  const appCertsMap = /* @__PURE__ */ new Map();
  for (const c of [...inRangeCertificatesTableRes.data ?? [], ...certsTableRes.data ?? []]) {
    if (c && c.application_id) {
      const arr = appCertsMap.get(c.application_id) ?? [];
      arr.push(c);
      appCertsMap.set(c.application_id, arr);
    }
  }
  const leadIds = Array.from(new Set(appList.map((a) => a.lead_id).filter(Boolean)));
  const customerIds = Array.from(new Set(appList.map((a) => a.customer_id).filter(Boolean)));
  const serviceIds = Array.from(new Set(appList.map((a) => a.service_id).filter(Boolean)));
  const staffIds = Array.from(new Set([...appList.map((a) => a.assigned_to), ...Array.from(appEventsMap.values()).flat().map((e) => e.created_by), ...Array.from(appSchedulersMap.values()).flat().map((s) => s.created_by), ...Array.from(appCertsMap.values()).flat().map((c) => c.uploaded_by)].filter(Boolean)));
  const [leadsData, custsData, paysByApp, paysByLead, staffData] = await Promise.all([fetchInChunks(leadIds, 200, (chunk) => admin.from("leads").select("id, name, email, mobile, total_amount, lead_status_v2, lead_code, status, lead_source, service, service_id").in("id", chunk)), fetchInChunks(customerIds, 200, (chunk) => admin.from("customers").select("id, name, primary_mobile, primary_email").in("id", chunk)), fetchInChunks(ids, 200, (chunk) => admin.from("payments").select("id, application_id, lead_id, status, amount, payment_date").in("application_id", chunk)), fetchInChunks(leadIds, 200, (chunk) => admin.from("payments").select("id, application_id, lead_id, status, amount, payment_date").in("lead_id", chunk)), fetchInChunks(staffIds, 200, (chunk) => admin.from("profiles").select("id, full_name, display_name, email, is_active, employment_status").in("id", chunk))]);
  const leadMap = new Map((leadsData ?? []).map((l) => [l.id, l]));
  const activeSchedulers = (globalActiveSchedulers ?? []).filter((s) => s.status === "active");
  const sortedSchedulers = [...activeSchedulers].sort((a, b) => {
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tB - tA;
  });
  const callbackMap = /* @__PURE__ */ new Map();
  for (const s of sortedSchedulers) {
    if (s && s.application_id && !callbackMap.has(s.application_id)) {
      callbackMap.set(s.application_id, s);
    }
  }
  const allServiceIds = Array.from(new Set([...serviceIds, ...(leadsData ?? []).map((l) => l.service_id)].filter(Boolean)));
  const svcsData = await fetchInChunks(allServiceIds, 200, (chunk) => admin.from("services").select("id, service_name").in("id", chunk));
  const custMap = new Map((custsData ?? []).map((c) => [c.id, c]));
  const svcMap = new Map((svcsData ?? []).map((s) => [s.id, s]));
  const staffMap = new Map((staffData ?? []).map((s) => [s.id, s]));
  const payByApp = /* @__PURE__ */ new Map();
  const paidAtByApp = /* @__PURE__ */ new Map();
  const allPaymentsMap = /* @__PURE__ */ new Map();
  for (const p of [...paysByApp, ...paysByLead]) {
    if (p && p.id) allPaymentsMap.set(p.id, p);
  }
  const leadToAppMap = /* @__PURE__ */ new Map();
  for (const a of appList) {
    if (a.lead_id) leadToAppMap.set(a.lead_id, a.id);
  }
  for (const p of allPaymentsMap.values()) {
    const appId = p.application_id || (p.lead_id ? leadToAppMap.get(p.lead_id) : null);
    if (appId) {
      const arr = payByApp.get(appId) ?? [];
      arr.push({
        status: p.status,
        amount: Number(p.amount || 0)
      });
      payByApp.set(appId, arr);
      if (["paid", "success", "successful"].includes(String(p.status)) && p.payment_date) {
        const prev = paidAtByApp.get(appId);
        const cur = p.payment_date;
        if (!prev || cur < prev) paidAtByApp.set(appId, cur);
      }
    }
  }
  const now = Date.now();
  const fromTime = normalized.fromIso ? new Date(normalized.fromIso).getTime() : -Infinity;
  const toTime = normalized.toIso ? new Date(normalized.toIso).getTime() : Infinity;
  const hasDateFilter = Boolean(normalized.fromIso || normalized.toIso);
  const allRows = appList.map((a) => {
    const lead = leadMap.get(a.lead_id);
    const cust = a.customer_id ? custMap.get(a.customer_id) : null;
    const effectiveSvcId = a.service_id || lead?.service_id || null;
    const svc = effectiveSvcId ? svcMap.get(effectiveSvcId) : null;
    const staff = a.assigned_to ? staffMap.get(a.assigned_to) : null;
    const payments = payByApp.get(a.id) ?? [];
    const paidSum = payments.filter((p) => ["paid", "success", "successful"].includes(String(p.status))).reduce((s, p) => s + Number(p.amount || 0), 0);
    const totalAmount = paidSum > 0 ? paidSum : Number(lead?.total_amount || 0);
    const payment_status = rollupPaymentStatus(payments, totalAmount);
    const thisAppActionLogs = appActionLogsMap.get(a.id) ?? [];
    const thisAppEvents = appEventsMap.get(a.id) ?? [];
    const thisAppSchedulers = appSchedulersMap.get(a.id) ?? [];
    const thisAppCerts = appCertsMap.get(a.id) ?? [];
    const cb = callbackMap.get(a.id);
    let parsedRemarks = null;
    if (cb?.remarks) {
      try {
        parsedRemarks = typeof cb.remarks === "string" ? JSON.parse(cb.remarks) : cb.remarks;
      } catch {
        parsedRemarks = {
          reason: "custom",
          reasonLabel: cb.remarks
        };
      }
    }
    const firesAtTime = cb?.fires_at ? new Date(cb.fires_at).getTime() : 0;
    const is_due = firesAtTime > 0 && firesAtTime <= now;
    const hasCompletedCallback = hasCurrentCycleCompletion(a.reopened_at, cb, thisAppEvents, thisAppSchedulers);
    const finalNow = ["completed", "closed", "cancelled"].includes(String(a.fulfillment_status ?? "").toLowerCase()) || ["COMPLETED", "CLOSED", "CANCELLED"].includes(String(a.order_status ?? "").toUpperCase());
    const rawIsReopened = !finalNow && (a.fulfillment_status === "order_reopened" || a.application_status === "order_reopened" || a.order_status === "REOPENED" || a.workflow_status === "order_reopened" || a.workflow_status === "processing_resumed");
    const is_reopened = rawIsReopened && !hasCompletedCallback;
    const effectiveOrderStatus = is_reopened ? a.order_status : a.order_status === "REOPENED" ? a.form_submitted_at ? "IN_PROCESSING" : "FORM_PENDING" : a.order_status;
    const effectiveFulfillmentStatus = is_reopened ? a.fulfillment_status : a.fulfillment_status === "order_reopened" ? a.form_submitted_at ? "form_submitted" : "form_not_submitted" : a.fulfillment_status;
    const effectiveWorkflowStatus = is_reopened ? a.workflow_status : a.workflow_status === "order_reopened" || a.workflow_status === "processing_resumed" ? "processing" : a.workflow_status;
    const stage = computeOrderStage({
      lead_status_v2: lead?.lead_status_v2,
      status: lead?.status,
      payment_successful_at: paidAtByApp.get(a.id) ?? null
    }, {
      form_submitted_at: a.form_submitted_at,
      certificate_uploaded_at: a.certificate_uploaded_at,
      fulfillment_status: effectiveFulfillmentStatus,
      application_status: is_reopened ? a.application_status : a.application_status === "order_reopened" ? "under_process" : a.application_status,
      workflow_status: effectiveWorkflowStatus,
      closure_stage: a.closure_stage,
      refund_approved_at: a.refund_approved_at,
      refund_processed_at: a.refund_processed_at,
      order_status: effectiveOrderStatus,
      technical_hold_started_at: a.technical_hold_started_at
    });
    const fsLower = String(effectiveFulfillmentStatus ?? "").toLowerCase();
    const isTerminal = !is_reopened && (stage === "completed" || stage === "closed" || CLOSED_FS.has(fsLower) || COMPLETED_FS.has(fsLower) || ["completed", "closed", "cancelled"].includes(String(a.application_status ?? "").toLowerCase()) || ["completed", "closed", "cancelled"].includes(String(a.order_status ?? "").toLowerCase()) || ["completed", "closed", "cancelled"].includes(String(a.workflow_status ?? "").toLowerCase()) || Boolean(a.closure_stage) && a.closure_stage !== "none");
    const has_future_callback = !isTerminal && Boolean(cb && firesAtTime > now);
    const hotSinceMs = is_due ? firesAtTime : is_reopened ? Date.parse(a.reopened_at || "") || 0 : 0;
    const actedSinceHot = hotSinceMs > 0 && thisAppActionLogs.some((l) => {
      if (!l?.employee_id) return false;
      const t = String(l.action_type ?? "").toUpperCase();
      if (["ORDER_OPENED", "ORDER_REOPENED", "HOT_ORDER_ADDED", "ORDER_ASSIGNED", "ORDER_REASSIGNED"].includes(t)) return false;
      const ts = Date.parse(l.created_at || "");
      return Number.isFinite(ts) && ts > hotSinceMs;
    });
    const is_hot = !isTerminal && !hasCompletedCallback && !actedSinceHot && (is_due || is_reopened && !has_future_callback);
    let hot_started_at = null;
    if (is_hot) {
      if (is_reopened) {
        hot_started_at = a.reopened_at || a.updated_at || a.created_at;
      } else if (cb) {
        hot_started_at = (cb.fires_at ? new Date(cb.fires_at).toISOString() : null) || cb.created_at || a.updated_at || a.created_at;
      } else {
        hot_started_at = a.updated_at || a.created_at;
      }
    }
    const is_callback_scheduled = has_future_callback;
    const callback_reminder = !isTerminal && cb ? {
      id: cb.id,
      fires_at: cb.fires_at,
      is_due,
      remarks: parsedRemarks,
      scheduler_type: cb.scheduler_type,
      created_at: cb.created_at
    } : null;
    const createdTime = new Date(a.created_at).getTime();
    const inRangeCreated = !hasDateFilter || createdTime >= fromTime && createdTime <= toTime;
    const appStatusLower = String(a.application_status ?? "").toLowerCase();
    const isCompletedStage = stage === "completed" || stage === "certificate_ready" || stage === "consultation_completed" || COMPLETED_FS.has(fsLower) || COMPLETED_FS.has(appStatusLower) || COMPLETED_FS.has(String(a.order_status ?? "").toLowerCase()) || COMPLETED_FS.has(String(a.workflow_status ?? "").toLowerCase()) || String(a.order_status ?? "").toUpperCase() === "COMPLETED";
    const isClosedStage = stage === "closed" || CLOSED_FS.has(fsLower) || CLOSED_FS.has(appStatusLower) || CLOSED_FS.has(String(a.order_status ?? "").toLowerCase()) || CLOSED_FS.has(String(a.workflow_status ?? "").toLowerCase()) || Boolean(a.closure_stage) && a.closure_stage !== "none";
    let compTimestamp = null;
    if (a.fulfilled_at) {
      const t = new Date(a.fulfilled_at).getTime();
      if (!isNaN(t)) compTimestamp = t;
    }
    if (!compTimestamp && a.certificate_uploaded_at) {
      const t = new Date(a.certificate_uploaded_at).getTime();
      if (!isNaN(t)) compTimestamp = t;
    }
    for (const c of thisAppCerts) {
      const t = new Date(c.delivered_at || c.issued_at || c.created_at).getTime();
      if (!isNaN(t) && (!compTimestamp || t > compTimestamp)) compTimestamp = t;
    }
    for (const l of thisAppActionLogs) {
      const at = String(l.action_type || "").toUpperCase();
      const ns = String(l.new_status || "").toUpperCase();
      const nst = String(l.new_stage || "").toUpperCase();
      if (at === "ORDER_COMPLETED" || at === "APPLICATION_COMPLETED" || at === "CERTIFICATE_GENERATED" || at === "CERTIFICATE_DELIVERED" || ns.includes("COMPLET") || nst.includes("COMPLET")) {
        const t = new Date(l.created_at).getTime();
        if (!isNaN(t) && (!compTimestamp || t > compTimestamp)) compTimestamp = t;
      }
    }
    for (const ev of thisAppEvents) {
      const et = String(ev.event_type || "").toLowerCase();
      const nv = String(ev.new_value || "").toLowerCase();
      if (nv.includes("complete") || et.includes("complete") || et.includes("cert") || et === "certificate_uploaded" || et === "certificate_issued" || et === "application_approved" || et === "consultation_completed" || nv === "application_approved") {
        const t = new Date(ev.created_at).getTime();
        if (!isNaN(t) && (!compTimestamp || t > compTimestamp)) compTimestamp = t;
      }
    }
    if (!compTimestamp && isCompletedStage) {
      if (a.updated_at) {
        const t = new Date(a.updated_at).getTime();
        if (!isNaN(t)) compTimestamp = t;
      } else {
        compTimestamp = createdTime;
      }
    }
    const inRangeCompleted = Boolean(isCompletedStage && compTimestamp !== null && (!hasDateFilter || compTimestamp >= fromTime && compTimestamp <= toTime));
    let closeTimestamp = null;
    for (const l of thisAppActionLogs) {
      const at = String(l.action_type || "").toUpperCase();
      const ns = String(l.new_status || "").toUpperCase();
      const nst = String(l.new_stage || "").toUpperCase();
      if (at === "ORDER_CLOSED" || at === "SYSTEM_CLOSE" || ns.includes("CLOSE") || ns.includes("CANCEL") || nst.includes("CLOSE") || nst.includes("CANCEL")) {
        const t = new Date(l.created_at).getTime();
        if (!isNaN(t) && (!closeTimestamp || t > closeTimestamp)) closeTimestamp = t;
      }
    }
    for (const ev of thisAppEvents) {
      const et = String(ev.event_type || "").toLowerCase();
      const nv = String(ev.new_value || "").toLowerCase();
      if (nv.includes("close") || nv.includes("cancel") || et.includes("close") || et.includes("cancel") || et === "workflow_closed" || et === "order_closed") {
        const t = new Date(ev.created_at).getTime();
        if (!isNaN(t) && (!closeTimestamp || t > closeTimestamp)) closeTimestamp = t;
      }
    }
    if (!closeTimestamp && isClosedStage) {
      if (a.updated_at) {
        const t = new Date(a.updated_at).getTime();
        if (!isNaN(t)) closeTimestamp = t;
      } else {
        closeTimestamp = createdTime;
      }
    }
    const inRangeClosed = Boolean(isClosedStage && closeTimestamp !== null && (!hasDateFilter || closeTimestamp >= fromTime && closeTimestamp <= toTime));
    let hasCustDelayInRange = false;
    if (a.customer_hold_started_at) {
      const t = new Date(a.customer_hold_started_at).getTime();
      if (t >= fromTime && t <= toTime) hasCustDelayInRange = true;
    }
    for (const s of thisAppSchedulers) {
      const st = String(s.scheduler_type || "").toLowerCase();
      if (st.includes("customer_side_delay") || st.includes("customer_delay")) {
        const t = new Date(s.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasCustDelayInRange = true;
      }
    }
    for (const l of thisAppActionLogs) {
      const at = String(l.action_type || "").toUpperCase();
      if (at === "CUSTOMER_DELAY_ADDED" || at === "CUSTOMER_DELAY") {
        const t = new Date(l.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasCustDelayInRange = true;
      }
    }
    for (const ev of thisAppEvents) {
      const et = String(ev.event_type || "").toLowerCase();
      const nv = String(ev.new_value || "").toLowerCase();
      if (et.includes("customer_delay") || nv.includes("customer_delay")) {
        const t = new Date(ev.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasCustDelayInRange = true;
      }
    }
    const inRangeCustomerDelay = !isCompletedStage && !isClosedStage && !inRangeCompleted && !inRangeClosed && !isTerminal ? hasDateFilter ? hasCustDelayInRange : isCustomerDelayOrder(a) : false;
    let hasTechDelayInRange = false;
    if (a.technical_hold_started_at) {
      const t = new Date(a.technical_hold_started_at).getTime();
      if (t >= fromTime && t <= toTime) hasTechDelayInRange = true;
    }
    for (const s of thisAppSchedulers) {
      const st = String(s.scheduler_type || "").toLowerCase();
      if (st.includes("technical_delay") || st.includes("our_side_delay")) {
        const t = new Date(s.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasTechDelayInRange = true;
      }
    }
    for (const l of thisAppActionLogs) {
      const at = String(l.action_type || "").toUpperCase();
      if (at === "TECHNICAL_DELAY_ADDED" || at === "TECHNICAL_DELAY") {
        const t = new Date(l.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasTechDelayInRange = true;
      }
    }
    for (const ev of thisAppEvents) {
      const et = String(ev.event_type || "").toLowerCase();
      const nv = String(ev.new_value || "").toLowerCase();
      if (et.includes("technical_delay") || nv.includes("technical_delay")) {
        const t = new Date(ev.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasTechDelayInRange = true;
      }
    }
    const inRangeTechnicalDelay = !isCompletedStage && !isClosedStage && !inRangeCompleted && !inRangeClosed && !isTerminal && !inRangeCustomerDelay ? hasDateFilter ? hasTechDelayInRange : isTechnicalDelayOrder(a) : false;
    let hasCallbackInRange = false;
    for (const s of thisAppSchedulers) {
      const st = String(s.scheduler_type || "").toLowerCase();
      if (st.includes("callback") || st.includes("consultation")) {
        const t = new Date(s.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasCallbackInRange = true;
      }
    }
    for (const l of thisAppActionLogs) {
      const at = String(l.action_type || "").toUpperCase();
      if (at === "CALLBACK_SCHEDULED") {
        const t = new Date(l.created_at).getTime();
        if (t >= fromTime && t <= toTime) hasCallbackInRange = true;
      }
    }
    const inRangeCallbackScheduled = !isCompletedStage && !isClosedStage && !inRangeCompleted && !inRangeClosed && !isTerminal ? hasDateFilter ? hasCallbackInRange : isCallbackScheduledOrder(a) : false;
    const actionHistoryList = [];
    const isHumanStaff = (name) => {
      if (!name) return false;
      const n = String(name).trim().toLowerCase();
      return n.length > 0 && !["system", "automated", "bot", "auto", "auto-assign", "cron", "webhook", "system_job"].includes(n);
    };
    for (const l of thisAppActionLogs) {
      let staffName = l.employee_name || l.staff_name || null;
      if (!staffName || String(staffName).trim().toLowerCase() === "admin / system") {
        const lt = new Date(l.created_at).getTime();
        const match = thisAppEvents.find((ev) => ev.created_by && String(ev.event_type || "").toLowerCase() === "order_status_change" && Math.abs(new Date(ev.created_at).getTime() - lt) < 1e4);
        const actor = match ? staffMap.get(match.created_by) : null;
        staffName = actor?.display_name || actor?.full_name || null;
      }
      if (!isHumanStaff(staffName)) continue;
      const at = String(l.action_type || "").toUpperCase();
      const note = String(l.note || l.remarks || "").toLowerCase();
      if (at === "FORM_SUBMITTED" || at === "ORDER_CREATED" || at === "PAYMENT_RECEIVED" || at === "ORDER_REOPENED" || // Assignment changes are custody moves, not work on the order.
      at === "ORDER_REASSIGNED" || at === "ORDER_ASSIGNED" || at === "ASSIGNMENT_CHANGE" || at === "REASSIGNMENT" || at === "UNASSIGNMENT" || at === "ORDER_OPENED" || at === "HOT_ORDER_ADDED" || note.includes("customer delay closed") || note.includes("auto closed") || note.includes("timeout") || note.includes("system")) {
        continue;
      }
      const t = new Date(l.created_at).getTime();
      if (!hasDateFilter || t >= fromTime && t <= toTime) {
        let title = "Staff Action";
        if (at.includes("COMPLET")) title = "Order Completed";
        else if (at.includes("CUSTOMER_DELAY")) title = "Customer Delay Added";
        else if (at.includes("TECHNICAL_DELAY")) title = "Technical Delay Added";
        else if (at.includes("CALLBACK")) title = "Callback Scheduled";
        else if (at.includes("CLOSE")) title = "Order Closed";
        else if (at.includes("FORM")) title = "Form Link Sent";
        else if (at === "STATUS_CHANGED" && String(l.new_status || "").toUpperCase() === "WAITING_CUSTOMER_INFO") title = "Form Link Sent";
        else if (l.action_type) title = l.action_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        actionHistoryList.push({
          id: `log-${l.id}`,
          action_type: l.action_type || "ACTION",
          title,
          staff_name: staffName,
          actor_id: l.employee_id ?? null,
          created_at: l.created_at,
          note: l.note || l.remarks || null
        });
      }
    }
    for (const c of thisAppCerts) {
      const uploader = c.uploaded_by ? staffMap.get(c.uploaded_by) : null;
      const staffName = uploader?.display_name || uploader?.full_name || null;
      if (!isHumanStaff(staffName)) continue;
      const ts = c.delivered_at || c.issued_at || c.created_at;
      const t = new Date(ts).getTime();
      if (!hasDateFilter || t >= fromTime && t <= toTime) {
        const exists = actionHistoryList.some((x) => (x.action_type.toLowerCase().includes("complet") || x.action_type.toLowerCase().includes("cert")) && Math.abs(new Date(x.created_at).getTime() - t) < 3e5);
        if (!exists) {
          actionHistoryList.push({
            id: `cert-${c.id}`,
            action_type: "ORDER_COMPLETED",
            title: "Order Completed",
            staff_name: staffName,
            actor_id: c.uploaded_by ?? null,
            created_at: ts,
            note: c.certificate_number ? `Certificate delivered (Cert #${c.certificate_number})` : "Order fulfilled and certificate delivered"
          });
        }
      }
    }
    for (const s of thisAppSchedulers) {
      const creator = s.created_by ? staffMap.get(s.created_by) : null;
      const staffName = creator?.display_name || creator?.full_name || null;
      if (!isHumanStaff(staffName)) continue;
      const t = new Date(s.created_at).getTime();
      if (!hasDateFilter || t >= fromTime && t <= toTime) {
        const st = String(s.scheduler_type || "").toLowerCase();
        let parsedRemarks2 = null;
        if (typeof s.remarks === "object" && s.remarks) {
          parsedRemarks2 = s.remarks;
        } else if (typeof s.remarks === "string" && s.remarks) {
          try {
            parsedRemarks2 = JSON.parse(s.remarks);
          } catch {
            parsedRemarks2 = {
              reasonLabel: s.remarks
            };
          }
        }
        const schedReason = String(parsedRemarks2?.reason || s.reason || "").toLowerCase();
        if (schedReason === "order_reopened" || schedReason === "ticket_hot_priority" || schedReason === "reopened") continue;
        let title = "Workflow Scheduler";
        if (st.includes("customer_delay") || st.includes("customer_side")) {
          title = "Customer Delay Added";
        } else if (st.includes("technical_delay") || st.includes("our_side_delay")) {
          title = "Technical Delay Added";
        } else if (st.includes("our_side_reminder") || st.includes("callback") || st.includes("reminder") || st.includes("consultation")) {
          title = "Callback Scheduled";
        }
        const note = parsedRemarks2?.reasonLabel ? parsedRemarks2.note ? `${parsedRemarks2.reasonLabel} (${parsedRemarks2.note})` : parsedRemarks2.reasonLabel : s.reason || parsedRemarks2?.note || null;
        const exists = actionHistoryList.some((x) => Math.abs(new Date(x.created_at).getTime() - t) < 6e4);
        if (!exists) {
          actionHistoryList.push({
            id: `sched-${s.id}`,
            action_type: s.scheduler_type || "SCHEDULER",
            title,
            staff_name: staffName,
            actor_id: s.created_by ?? null,
            created_at: s.created_at,
            note
          });
        }
      }
    }
    for (const ev of thisAppEvents) {
      const et = String(ev.event_type || "").toLowerCase();
      const nv = String(ev.new_value || "").toLowerCase();
      const note = String(ev.note || "").toLowerCase();
      const actor = ev.created_by ? staffMap.get(ev.created_by) : null;
      const staffName = actor?.display_name || actor?.full_name || null;
      if (!isHumanStaff(staffName) || String(ev.staff_role || "").toLowerCase() === "system") continue;
      if (et === "assignment_change" || et === "auto_assignment" || et === "pool_assignment" || et === "reassignment" || et === "unassignment" || et === "order_assigned" || et === "order_reassigned" || et.startsWith("auto_") || et === "order_created" || et === "lead_created" || et === "payment_received" || et === "assignee_updated" || et === "order_reopened" || et === "hot_priority_escalated" || nv === "order_reopened" || nv === "reopened" || note.includes("reopened") || et === "followup_email_sent" || et === "email_sent" || et === "email_failed" || et === "email_skipped" || et === "internal_review_due" || et === "form_submitted" || et === "order_closed" || et === "workflow_closed" || et === "certificate_uploaded" || et === "certificate_delivered" || et === "order_completed" || et === "application_completed" || nv === "form_submitted" || nv === "order_received" || nv === "lead_received" || nv === "payment_done" || nv === "payment_pending" || note.includes("customer submitted") || note.includes("form submitted") || note.includes("customer delay closed") || note.includes("auto closed") || note.includes("timeout")) {
        continue;
      }
      const t = new Date(ev.created_at).getTime();
      if (!hasDateFilter || t >= fromTime && t <= toTime) {
        const exists = actionHistoryList.some((x) => Math.abs(new Date(x.created_at).getTime() - t) < 6e4);
        if (!exists) {
          let title = ev.event_type ? ev.event_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Staff Action";
          if (et.includes("callback_completed")) title = "Callback Completed";
          else if (et.includes("callback_scheduled")) title = "Callback Scheduled";
          else if (et.includes("consultation")) title = "Consultation Completed";
          else if (et.includes("resumed")) title = "Order Resumed / Re-served";
          actionHistoryList.push({
            id: `ev-${ev.id}`,
            action_type: ev.event_type || "EVENT",
            title,
            staff_name: staffName,
            actor_id: ev.created_by ?? null,
            created_at: ev.created_at,
            note: ev.note || ev.new_value || null
          });
        }
      }
    }
    actionHistoryList.sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime());
    const inRangeActionTaken = actionHistoryList.length > 0;
    const actionCount = actionHistoryList.length;
    return {
      id: a.id,
      application_code: a.application_code,
      fulfillment_status: effectiveFulfillmentStatus ?? "order_received",
      lead_status_v2: lead?.lead_status_v2 ?? null,
      created_at: a.created_at,
      completed_at: compTimestamp ? new Date(compTimestamp).toISOString() : null,
      closed_at: closeTimestamp ? new Date(closeTimestamp).toISOString() : null,
      lead_id: a.lead_id,
      lead_code: lead?.lead_code ?? null,
      customer_id: a.customer_id,
      customer_name: lead?.name ?? cust?.name ?? "—",
      customer_mobile: lead?.mobile ?? cust?.primary_mobile ?? null,
      customer_email: lead?.email ?? cust?.primary_email ?? null,
      service_id: effectiveSvcId,
      service_name: svc?.service_name ?? lead?.service ?? null,
      total_amount: totalAmount,
      payment_status,
      assigned_to: a.assigned_to,
      assigned_name: staff ? staff.display_name || staff.full_name || staff.email?.split("@")[0] || "Staff" : null,
      stage,
      is_hot,
      hot_started_at,
      is_callback_scheduled,
      callback_reminder,
      ticket_source: parsedRemarks?.reason === "ticket_hot_priority" || parsedRemarks?.ticketNumber || cb?.ticket_id ? {
        isHotFromTicket: true,
        ticketNumber: parsedRemarks?.ticketNumber || null,
        ticketId: parsedRemarks?.ticketId || cb?.ticket_id || null,
        note: parsedRemarks?.note || null
      } : thisAppEvents.find((e) => (e.event_type === "hot_priority_escalated" || e.event_type === "order_reopened") && (e.note?.includes("Ticket") || e.note?.includes("ticket"))) ? {
        isReopenedFromTicket: true,
        ticketNumber: thisAppEvents.find((e) => (e.event_type === "hot_priority_escalated" || e.event_type === "order_reopened") && (e.note?.includes("Ticket") || e.note?.includes("ticket")))?.note?.match(/#([A-Za-z0-9\-]+)/)?.[1] || null,
        note: thisAppEvents.find((e) => (e.event_type === "hot_priority_escalated" || e.event_type === "order_reopened") && (e.note?.includes("Ticket") || e.note?.includes("ticket")))?.note || null
      } : null,
      order_status: effectiveOrderStatus ?? a.application_status ?? null,
      workflow_status: effectiveWorkflowStatus,
      technical_hold_started_at: a.technical_hold_started_at,
      customer_hold_started_at: a.customer_hold_started_at,
      form_link_sent_at: a.form_link_sent_at ?? null,
      is_terminal: isTerminal,
      in_range: inRangeCreated,
      in_range_created: inRangeCreated,
      in_range_completed: inRangeCompleted,
      in_range_closed: inRangeClosed,
      in_range_customer_delay: inRangeCustomerDelay,
      in_range_technical_delay: inRangeTechnicalDelay,
      in_range_callback_scheduled: inRangeCallbackScheduled,
      in_range_action_taken: inRangeActionTaken,
      latest_action_at: actionHistoryList[0]?.created_at ?? null,
      // Who actually did each action — workforce credit is per actor, never the assignee.
      action_actors: actionHistoryList.map((x) => ({
        actor_id: x.actor_id ?? null,
        created_at: x.created_at
      })),
      action_count: actionCount,
      // Customer submitted the form after a delay; stays in Need Action until staff act on it.
      customer_resumed_pending: (() => {
        if (isTerminal) return false;
        const ev = thisAppEvents.find((e) => e.event_type === "customer_form_resumed");
        if (!ev || String(a.fulfillment_status ?? "") !== "form_submitted") return false;
        const resumedAt = new Date(ev.created_at).getTime();
        const lastAction = actionHistoryList[0]?.created_at ? new Date(actionHistoryList[0].created_at).getTime() : 0;
        return lastAction <= resumedAt;
      })(),
      action_history: actionHistoryList
    };
  });
  const todayIst = istDateKey(/* @__PURE__ */ new Date());
  let baseFilteredRows = allRows;
  if (normalized.stage) {
    baseFilteredRows = baseFilteredRows.filter((r) => r.stage === normalized.stage);
  }
  if (normalized.fulfillmentStatus) {
    baseFilteredRows = baseFilteredRows.filter((r) => r.fulfillment_status === normalized.fulfillmentStatus);
  }
  if (normalized.actionStatus && normalized.actionStatus !== "all") {
    if (normalized.actionStatus === "action_required") {
      baseFilteredRows = baseFilteredRows.filter((r) => {
        const b = bucketOfRow(r, todayIst);
        return b === "needs_action" || b === "backlog";
      });
    } else if (normalized.actionStatus === "processed" || normalized.actionStatus === "action_taken") {
      baseFilteredRows = baseFilteredRows.filter((r) => r.in_range_action_taken);
    } else if (normalized.actionStatus === "hot_orders") {
      baseFilteredRows = baseFilteredRows.filter((r) => r.is_hot);
    } else if (normalized.actionStatus === "scheduled_callback") {
      baseFilteredRows = baseFilteredRows.filter((r) => r.in_range_callback_scheduled);
    }
  }
  if (isAdmin && normalized.paymentStatus) {
    baseFilteredRows = baseFilteredRows.filter((r) => r.payment_status === normalized.paymentStatus);
  }
  if (isAdmin && normalized.pendingAge) {
    let days = 0;
    if (normalized.pendingAge === "custom" && normalized.customDays) {
      days = normalized.customDays || 0;
    } else {
      days = parseInt(normalized.pendingAge, 10) || 0;
    }
    if (days > 0) {
      const thresholdMs = Date.now() - days * 864e5;
      baseFilteredRows = baseFilteredRows.filter((r) => new Date(r.created_at).getTime() <= thresholdMs);
    }
  }
  const counts = {
    all: 0,
    needs_action: 0,
    hot_orders: 0,
    reminders: 0,
    // Call Back Scheduled
    technical_delay: 0,
    backlog: 0,
    customer_delay: 0,
    pending: 0,
    // Action Taken (Unique Orders)
    pending_actions_total: 0,
    // Total Manual Actions Count
    completed: 0,
    closed: 0,
    exception: 0,
    actionRequired: 0,
    processed: 0,
    totalAll: 0,
    pending_orders: 0
  };
  const ageBuckets = {
    d1: 0,
    d2: 0,
    d3: 0,
    d7: 0,
    older: 0
  };
  for (const r of baseFilteredRows) {
    const b = bucketOfRow(r, todayIst);
    isNeedsActionStage(r.stage);
    if (r.in_range_created) {
      counts.totalAll++;
      counts.all++;
      if (b === "exception") {
        counts.exception++;
      }
    }
    if (r.in_range_action_taken) {
      counts.pending++;
      counts.pending_actions_total += r.action_count || 1;
    }
    if (r.in_range_completed) {
      counts.completed++;
      counts.processed++;
    } else if (r.in_range_closed) {
      counts.closed++;
      counts.processed++;
    }
    if (isNeedsActionOrder(r)) {
      counts.needs_action++;
      counts.actionRequired++;
    }
    if (r.is_hot) {
      counts.hot_orders++;
    } else if (isCallbackScheduledOrder(r)) {
      counts.reminders++;
    }
    if (isTechnicalDelayOrder(r)) {
      counts.technical_delay++;
    }
    if (isCustomerDelayOrder(r)) {
      counts.customer_delay++;
    }
    if (b === "pending" || b === "needs_action" || b === "backlog") {
      const d = Math.max(0, Math.floor((now - new Date(r.created_at).getTime()) / 864e5));
      if (d < 1) ageBuckets.d1++;
      else if (d === 1) ageBuckets.d2++;
      else if (d === 2) ageBuckets.d3++;
      else if (d >= 3 && d < 7) ageBuckets.d7++;
      else if (d >= 7) ageBuckets.older++;
    }
  }
  counts.backlog = baseFilteredRows.filter((r) => {
    const rowDate = istDateKey(r.created_at);
    return isNeedsActionOrder(r) && Boolean(rowDate && rowDate < todayIst);
  }).length;
  counts.pending_orders = baseFilteredRows.filter((r) => isNeedsActionOrder(r) || isCallbackScheduledOrder(r) || isTechnicalDelayOrder(r)).length;
  let filtered = baseFilteredRows;
  const rawBucket = normalized.bucket || "all";
  const bucket = !isAdmin && rawBucket === "all" ? "needs_action" : rawBucket;
  if (bucket === "needs_action") {
    filtered = filtered.filter((r) => isNeedsActionOrder(r));
  } else if (bucket === "pending_orders") {
    filtered = filtered.filter((r) => isNeedsActionOrder(r) || isCallbackScheduledOrder(r) || isTechnicalDelayOrder(r));
  } else if (bucket === "hot_orders") {
    filtered = filtered.filter((r) => r.is_hot);
  } else if (bucket === "reminders") {
    filtered = filtered.filter((r) => isCallbackScheduledOrder(r));
  } else if (bucket === "backlog") {
    filtered = filtered.filter((r) => {
      const rowDate = istDateKey(r.created_at);
      return isNeedsActionOrder(r) && Boolean(rowDate && rowDate < todayIst);
    });
  } else if (bucket === "technical_delay") {
    filtered = filtered.filter((r) => isTechnicalDelayOrder(r));
  } else if (bucket === "customer_delay") {
    filtered = filtered.filter((r) => isCustomerDelayOrder(r));
  } else if (bucket === "pending" || bucket === "idle_time") {
    filtered = filtered.filter((r) => r.in_range_action_taken);
  } else if (bucket === "completed") {
    filtered = filtered.filter((r) => r.in_range_completed);
  } else if (bucket === "closed") {
    filtered = filtered.filter((r) => r.in_range_closed);
  } else if (bucket === "exception") {
    filtered = filtered.filter((r) => r.in_range_created && bucketOfRow(r, todayIst) === "exception");
  } else {
    filtered = filtered.filter((r) => r.in_range_created);
  }
  if ((bucket === "needs_action" || bucket === "pending_orders") && (!normalized.sortField || normalized.sortField === "created_at")) {
    filtered.sort((a, b) => {
      if (a.is_hot && !b.is_hot) return -1;
      if (!a.is_hot && b.is_hot) return 1;
      if (a.is_hot && b.is_hot) {
        const hA = a.hot_started_at ? new Date(a.hot_started_at).getTime() : new Date(a.created_at).getTime();
        const hB = b.hot_started_at ? new Date(b.hot_started_at).getTime() : new Date(b.created_at).getTime();
        if (hA !== hB) return hA - hB;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      const tA = new Date(a.created_at).getTime();
      const tB = new Date(b.created_at).getTime();
      return normalized.sortOrder === "asc" ? tA - tB : tB - tA;
    });
  } else if (bucket === "backlog" && (!normalized.sortField || normalized.sortField === "created_at")) {
    filtered.sort((a, b) => {
      const tA = new Date(a.created_at).getTime();
      const tB = new Date(b.created_at).getTime();
      return tA - tB;
    });
  } else if (bucket === "hot_orders" && (!normalized.sortField || normalized.sortField === "created_at")) {
    filtered.sort((a, b) => {
      const hA = a.hot_started_at ? new Date(a.hot_started_at).getTime() : new Date(a.created_at).getTime();
      const hB = b.hot_started_at ? new Date(b.hot_started_at).getTime() : new Date(b.created_at).getTime();
      if (hA !== hB) return hA - hB;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  } else if (bucket === "completed" && (!normalized.sortField || normalized.sortField === "created_at")) {
    filtered.sort((a, b) => {
      const tA = a.completed_at ? new Date(a.completed_at).getTime() : new Date(a.created_at).getTime();
      const tB = b.completed_at ? new Date(b.completed_at).getTime() : new Date(b.created_at).getTime();
      return normalized.sortOrder === "asc" ? tA - tB : tB - tA;
    });
  } else if (bucket === "closed" && (!normalized.sortField || normalized.sortField === "created_at")) {
    filtered.sort((a, b) => {
      const tA = a.closed_at ? new Date(a.closed_at).getTime() : new Date(a.created_at).getTime();
      const tB = b.closed_at ? new Date(b.closed_at).getTime() : new Date(b.created_at).getTime();
      return normalized.sortOrder === "asc" ? tA - tB : tB - tA;
    });
  } else if ((bucket === "pending" || bucket === "customer_delay" || bucket === "technical_delay" || normalized.actionStatus === "processed" || normalized.actionStatus === "action_taken") && (!normalized.sortField || normalized.sortField === "created_at")) {
    filtered.sort((a, b) => {
      const tA = a.latest_action_at ? new Date(a.latest_action_at).getTime() : a.customer_hold_started_at ? new Date(a.customer_hold_started_at).getTime() : a.technical_hold_started_at ? new Date(a.technical_hold_started_at).getTime() : new Date(a.created_at).getTime();
      const tB = b.latest_action_at ? new Date(b.latest_action_at).getTime() : b.customer_hold_started_at ? new Date(b.customer_hold_started_at).getTime() : b.technical_hold_started_at ? new Date(b.technical_hold_started_at).getTime() : new Date(b.created_at).getTime();
      return normalized.sortOrder === "asc" ? tA - tB : tB - tA;
    });
  } else if (normalized.sortField === "stage") {
    filtered.sort((a, b) => {
      const cmp = a.stage.localeCompare(b.stage);
      return normalized.sortOrder === "asc" ? cmp : -cmp;
    });
  } else {
    filtered.sort((a, b) => {
      const tA = new Date(a.created_at).getTime();
      const tB = new Date(b.created_at).getTime();
      return normalized.sortOrder === "asc" ? tA - tB : tB - tA;
    });
  }
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / data.pageSize));
  const page = Math.min(Math.max(1, data.page), maxPage);
  const start = (page - 1) * data.pageSize;
  const rawRows = data.viewMode === "team" ? [] : filtered.slice(start, start + data.pageSize);
  const hasSearch = Boolean(data.search && data.search.trim());
  const isRestrictedManagerOtherEmployee = !isAdmin && isManager && Boolean(data.assignedTo && data.assignedTo !== "all" && data.assignedTo !== context.userId && !hasSearch);
  const rows = isRestrictedManagerOtherEmployee ? rawRows.map((r) => ({
    ...r,
    application_code: "—",
    customer_mobile: null,
    customer_email: null,
    total_amount: null,
    payment_status: null,
    is_other_employee_restricted: true
  })) : rawRows;
  const teamBreakdownMap = /* @__PURE__ */ new Map();
  if (data.viewMode === "team") {
    const [{
      data: profs
    }, {
      data: superAdminRoles
    }] = await Promise.all([admin.from("profiles").select("id, full_name, display_name, email, is_active, employment_status"), admin.from("user_roles").select("user_id").eq("role", "super_admin")]);
    const superAdminIds = new Set((superAdminRoles ?? []).map((r) => String(r.user_id)));
    for (const p of profs ?? []) {
      const uid = String(p.id);
      if (uid === context.userId) continue;
      if (superAdminIds.has(uid)) continue;
      const isAct = p.is_active !== false && p.employment_status !== "ARCHIVED" && p.employment_status !== "TERMINATED" && p.employment_status !== "INACTIVE";
      if (!isAct) continue;
      const name = p.display_name || p.full_name || p.email?.split("@")[0] || "Staff";
      teamBreakdownMap.set(uid, {
        employeeId: uid,
        name,
        email: p.email ?? void 0,
        needsAction: 0,
        pendingOrders: 0,
        latestActionAt: null,
        hotOrders: 0,
        backlog: 0,
        technicalDelay: 0,
        callbackScheduled: 0,
        customerDelay: 0,
        actionTaken: 0,
        completed: 0,
        closed: 0,
        total: 0
      });
    }
    for (const r of baseFilteredRows) {
      if (!r.assigned_to) continue;
      const empId = String(r.assigned_to);
      const entry = teamBreakdownMap.get(empId);
      if (!entry) continue;
      entry.total++;
      if (isNeedsActionOrder(r)) entry.needsAction++;
      if (isNeedsActionOrder(r) || isCallbackScheduledOrder(r) || isTechnicalDelayOrder(r)) entry.pendingOrders++;
      if (r.is_hot) entry.hotOrders++;
      const rowDate = istDateKey(r.created_at);
      if (isNeedsActionOrder(r) && Boolean(rowDate && rowDate < todayIst)) entry.backlog++;
      if (isTechnicalDelayOrder(r)) entry.technicalDelay++;
      if (isCallbackScheduledOrder(r)) entry.callbackScheduled++;
      if (isCustomerDelayOrder(r)) entry.customerDelay++;
      if (r.in_range_completed) entry.completed++;
      if (r.in_range_closed) entry.closed++;
    }
    for (const r of baseFilteredRows) {
      const byActor = /* @__PURE__ */ new Map();
      for (const a of r.action_actors ?? []) {
        if (!a.actor_id) continue;
        const prev = byActor.get(a.actor_id);
        if (!prev || new Date(a.created_at).getTime() > new Date(prev).getTime()) byActor.set(a.actor_id, a.created_at);
      }
      for (const [actorId, latest] of byActor) {
        const entry = teamBreakdownMap.get(actorId);
        if (!entry) continue;
        entry.actionTaken++;
        const tCurr = entry.latestActionAt ? new Date(entry.latestActionAt).getTime() : 0;
        if (new Date(latest).getTime() > tCurr) entry.latestActionAt = latest;
      }
    }
  }
  const teamBreakdown = Array.from(teamBreakdownMap.values()).sort((a, b) => {
    if (b.needsAction !== a.needsAction) return b.needsAction - a.needsAction;
    if (b.hotOrders !== a.hotOrders) return b.hotOrders - a.hotOrders;
    if (b.backlog !== a.backlog) return b.backlog - a.backlog;
    if (b.total !== a.total) return b.total - a.total;
    return a.name.localeCompare(b.name);
  });
  return {
    rows,
    total,
    counts,
    ageBuckets,
    page,
    pageSize: data.pageSize,
    teamBreakdown
  };
});
const listEmployeeAssignedOrders_createServerFn_handler = createServerRpc({
  id: "e82451722893ca5dfec67fd8c60d44dfa9517426a964d54353200dd9b1ac0b81",
  name: "listEmployeeAssignedOrders",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => listEmployeeAssignedOrders.__executeServer(opts));
const listEmployeeAssignedOrders = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(50).default(20)
}).parse(i ?? {})).handler(listEmployeeAssignedOrders_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    getStaffRoleInfo
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  const staffInfo = await getStaffRoleInfo(admin, context.userId);
  if (!staffInfo.isAdmin && !staffInfo.isManager) {
    throw new Error("Forbidden: Only managers and administrators can view employee orders");
  }
  const offset = (data.page - 1) * data.pageSize;
  const countRes = await admin.from("applications").select("id", {
    count: "exact",
    head: true
  }).eq("assigned_to", data.employeeId).eq("is_deleted", false);
  const total = countRes.count ?? 0;
  const {
    data: apps,
    error
  } = await admin.from("applications").select(`
        id,
        created_at,
        application_status,
        fulfillment_status,
        order_status,
        closure_stage,
        closure_reason_code,
        workflow_status,
        technical_hold_started_at,
        customer_hold_started_at,
        form_submitted_at,
        form_link_sent_at,
        certificate_uploaded_at,
        fulfilled_at,
        reopened_at,
        lead_id,
        customer_id,
        services(service_name)
      `).eq("assigned_to", data.employeeId).eq("is_deleted", false).order("created_at", {
    ascending: false
  }).range(offset, offset + data.pageSize - 1);
  if (error) {
    throw new Error(error.message);
  }
  const appList = apps ?? [];
  const leadIds = Array.from(new Set(appList.map((a) => a.lead_id).filter(Boolean)));
  const customerIds = Array.from(new Set(appList.map((a) => a.customer_id).filter(Boolean)));
  const [leadsRes, custsRes] = await Promise.all([leadIds.length > 0 ? admin.from("leads").select("id, name").in("id", leadIds) : Promise.resolve({
    data: []
  }), customerIds.length > 0 ? admin.from("customers").select("id, name").in("id", customerIds) : Promise.resolve({
    data: []
  })]);
  const leadNameMap = /* @__PURE__ */ new Map();
  for (const l of leadsRes.data ?? []) {
    if (l.name) leadNameMap.set(l.id, l.name);
  }
  const custNameMap = /* @__PURE__ */ new Map();
  for (const c of custsRes.data ?? []) {
    if (c.name) custNameMap.set(c.id, c.name);
  }
  const rows = appList.map((a) => {
    const stageKey = computeOrderStage(null, a);
    const stageMeta = STAGE_META[stageKey];
    const stage = {
      label: stageMeta?.label ?? stageKey,
      tone: stageMeta?.tone ?? "emerald"
    };
    const actionStatus = getOrderActionStatus({
      fulfillment_status: a.fulfillment_status,
      stage: stageKey,
      form_link_sent_at: a.form_link_sent_at
    });
    const customerName = a.customer_id && custNameMap.get(a.customer_id) || a.lead_id && leadNameMap.get(a.lead_id) || "—";
    const serviceName = a.services?.service_name || "—";
    return {
      id: a.id,
      createdAt: a.created_at,
      customerName,
      serviceName,
      actionStatus,
      stage
    };
  });
  return {
    orders: rows,
    rows,
    total,
    page: data.page,
    pageSize: data.pageSize,
    hasMore: offset + rows.length < total
  };
});
const getOrderDetailV2_createServerFn_handler = createServerRpc({
  id: "b52c83dc1ea228ab0f2bdd6fb3c20ddbeeee51a1a45bd88de8fa945a6178feee",
  name: "getOrderDetailV2",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => getOrderDetailV2.__executeServer(opts));
const getOrderDetailV2 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(getOrderDetailV2_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const {
    data: app,
    error
  } = await admin.from("applications").select("*").eq("id", data.orderId).maybeSingle();
  if (error || !app) throw new Error("Order not found");
  const [leadRes, custRes, svcRes, paysRes, docsRes, statusEventsRes, staffRes, refundRes, schedRes, appEvRes, userRolesRes] = await Promise.all([app.lead_id ? admin.from("leads").select("id, lead_code, name, email, mobile, total_amount, base_amount, gst_amount, lead_status_v2, status, lead_source, service, language, state").eq("id", app.lead_id).maybeSingle() : Promise.resolve({
    data: null
  }), app.customer_id ? admin.from("customers").select("id, customer_code, name, primary_email, primary_mobile").eq("id", app.customer_id).maybeSingle() : Promise.resolve({
    data: null
  }), app.service_id ? admin.from("services").select("id, service_code, service_name, govt_portal_url").eq("id", app.service_id).maybeSingle() : Promise.resolve({
    data: null
  }), app.lead_id ? admin.from("payments").select("id, status, amount, gateway_name, transaction_id, payment_date, created_at, parent_payment_id, refund_reason, currency").or(`application_id.eq.${data.orderId},lead_id.eq.${app.lead_id}`).order("created_at", {
    ascending: false
  }) : admin.from("payments").select("id, status, amount, gateway_name, transaction_id, payment_date, created_at, parent_payment_id, refund_reason, currency").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }), admin.from("documents").select("id, doc_type, file_path, file_name, mime_type, size_bytes, status, uploaded_at, created_at").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }), admin.from("application_events").select("id, event_type, old_value, new_value, note, staff_name, staff_role, created_at").eq("application_id", data.orderId).eq("event_type", "status_change").order("created_at", {
    ascending: false
  }).limit(50), app.assigned_to ? admin.from("profiles").select("id, display_name, full_name, email").eq("id", app.assigned_to).maybeSingle() : Promise.resolve({
    data: null
  }), admin.from("refund_requests").select("id, status, refund_amount, refund_mode, deduction_amount, decided_at, created_at, reason").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle(), admin.from("order_schedulers").select("id, scheduler_type, status, started_at, fires_at, remarks, ticket_id, created_at").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }).limit(5), admin.from("application_events").select("id, event_type, old_value, new_value, note, staff_name, staff_role, created_at").eq("application_id", data.orderId).in("event_type", ["hot_priority_escalated", "order_reopened", "status_change"]).order("created_at", {
    ascending: false
  }).limit(10), admin.from("user_roles").select("role").eq("user_id", context.userId)]);
  const refundReq = refundRes?.data;
  if (refundReq?.status) {
    app.refund_status = refundReq.status;
    if (refundReq.status === "approved") {
      app.refund_approved_at = app.refund_approved_at || refundReq.decided_at || refundReq.created_at;
      app.closure_stage = "refund_approved";
    }
  }
  const svcData = svcRes?.data;
  let workflowStages = FULFILLMENT_STAGES;
  const workflowPromise = svcData?.service_code ? admin.from("service_workflows").select("application_statuses").eq("service_code", svcData.service_code).maybeSingle() : Promise.resolve({
    data: null
  });
  let payments = paysRes.data ?? [];
  const payIds = payments.map((p) => p.id);
  const invoicePromise = payIds.length > 0 ? admin.from("invoices").select("id, payment_id, invoice_number, pdf_path, issued_at, last_emailed_at, email_attempts, last_email_status, delivery_status, replaced_at, customer_gstin_snapshot").in("payment_id", payIds).is("cancelled_at", null) : Promise.resolve({
    data: []
  });
  const [wfRes, invsRes] = await Promise.all([workflowPromise, invoicePromise]);
  const arr = wfRes?.data?.application_statuses ?? null;
  if (Array.isArray(arr) && arr.length) {
    workflowStages = arr.map((s) => typeof s === "string" ? s : s?.code ?? s?.id ?? "").filter(Boolean);
  }
  const lead = leadRes.data;
  const paidSum = payments.filter((p) => ["paid", "success", "successful"].includes(String(p.status))).reduce((s, p) => s + Number(p.amount || 0), 0);
  const total = paidSum > 0 ? paidSum : Number(lead?.total_amount || 0);
  if (payments.length > 0) {
    const invs = invsRes?.data ?? [];
    const map = new Map((invs ?? []).map((i) => [i.payment_id, i]));
    payments = payments.map((p) => {
      const inv = map.get(p.id);
      return {
        ...p,
        invoice_id: inv?.id ?? null,
        invoice_number: inv?.invoice_number ?? null,
        invoice_issued_at: inv?.issued_at ?? null,
        invoice_last_emailed_at: inv?.last_emailed_at ?? null,
        invoice_email_attempts: inv?.email_attempts ?? 0,
        invoice_last_email_status: inv?.last_email_status ?? null,
        invoice_delivery_status: inv?.delivery_status ?? null,
        invoice_replaced_at: inv?.replaced_at ?? null,
        invoice_gstin: inv?.customer_gstin_snapshot ?? null,
        has_pdf: !!inv?.pdf_path
      };
    });
  }
  const paymentStatus = rollupPaymentStatus(payments.map((p) => ({
    status: String(p.status),
    amount: Number(p.amount || 0)
  })), total);
  const stageEvents = statusEventsRes.data ?? [];
  const stageMeta = {};
  for (const ev of stageEvents) {
    const key = ev.new_value;
    if (key && !stageMeta[key]) stageMeta[key] = {
      at: ev.created_at ?? "",
      staff_name: ev.staff_name ?? null
    };
  }
  if (!stageMeta["order_received"]) {
    stageMeta["order_received"] = {
      at: app.created_at,
      staff_name: null
    };
  }
  const paymentSuccessfulAt = payments.filter((p) => ["paid", "success", "successful"].includes(String(p.status)) && p.payment_date).map((p) => p.payment_date).sort()[0] ?? null;
  const schedulers = schedRes?.data ?? [];
  const appEvents = appEvRes?.data ?? [];
  const activeHotSched = schedulers.find((s) => ["active", "paused"].includes(s.status) && (s.scheduler_type === "our_side_reminder" || s.ticket_id));
  const schedRemarks = activeHotSched?.remarks ? typeof activeHotSched.remarks === "string" ? (() => {
    try {
      return JSON.parse(activeHotSched.remarks);
    } catch {
      return null;
    }
  })() : activeHotSched.remarks : null;
  const ticketEvent = appEvents.find((e) => (e.event_type === "hot_priority_escalated" || e.event_type === "order_reopened") && (e.note?.includes("Ticket") || e.note?.includes("ticket")));
  const isFromTicket = Boolean(schedRemarks?.reason === "ticket_hot_priority" || schedRemarks?.ticketNumber || activeHotSched?.ticket_id || ticketEvent);
  const rawIsReopened = app.order_status === "REOPENED" || app.fulfillment_status === "order_reopened" || app.workflow_status === "order_reopened" || app.workflow_status === "processing_resumed";
  if (rawIsReopened && (!activeHotSched || activeHotSched.status !== "active")) {
    const nextOs = app.form_submitted_at ? "IN_PROCESSING" : "FORM_PENDING";
    const nextFs = app.form_submitted_at ? "form_submitted" : "form_not_submitted";
    app.order_status = nextOs;
    app.fulfillment_status = nextFs;
    app.workflow_status = "processing";
    app.application_status = "under_process";
    app.is_hot = false;
    admin.from("applications").update({
      order_status: nextOs,
      fulfillment_status: nextFs,
      workflow_status: "processing",
      application_status: "under_process",
      is_hot: false,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", app.id).then(() => {
    });
  }
  let ticketCreatedAt = null;
  let ticketReopenedAt = null;
  if (isFromTicket) {
    const tId = schedRemarks?.ticketId || activeHotSched?.ticket_id || null;
    const tNum = schedRemarks?.ticketNumber || ticketEvent?.note?.match(/#([A-Za-z0-9\-]+)/)?.[1] || null;
    if (tId || tNum) {
      const q = admin.from("support_tickets").select("created_at").limit(1);
      const {
        data: t
      } = await (tId ? q.eq("id", tId) : q.eq("ticket_number", tNum)).maybeSingle();
      ticketCreatedAt = t?.created_at ?? null;
    }
    ticketReopenedAt = ticketEvent?.created_at || activeHotSched?.started_at || app.reopened_at || null;
  }
  const ticketEscalation = isFromTicket ? {
    ticketCreatedAt,
    ticketReopenedAt,
    isEscalated: true,
    ticketNumber: schedRemarks?.ticketNumber || ticketEvent?.note?.match(/#([A-Za-z0-9\-]+)/)?.[1] || null,
    ticketId: schedRemarks?.ticketId || activeHotSched?.ticket_id || null,
    note: schedRemarks?.note || ticketEvent?.note || null,
    isHot: Boolean(activeHotSched?.status === "active"),
    isReopened: Boolean((app.order_status === "REOPENED" || app.fulfillment_status === "order_reopened") && activeHotSched?.status === "active"),
    escalatedAt: activeHotSched?.started_at || ticketEvent?.created_at || app.reopened_at || null
  } : null;
  const userRoleList = (userRolesRes?.data ?? []).map((r) => r.role);
  const isSuperAdmin = userRoleList.includes("super_admin") || userRoleList.includes("admin");
  return {
    application: app,
    lead,
    customer: custRes.data,
    service: svcRes.data,
    payments,
    paymentStatus,
    paymentSuccessfulAt,
    total,
    documents: docsRes.data ?? [],
    assignedStaff: staffRes.data ?? null,
    workflowStages,
    stageMeta,
    ticketEscalation,
    isSuperAdmin,
    // Backward compatibility fields initialized empty, populated on-demand
    events: [],
    emailLogs: [],
    orderTickets: [],
    customerTickets: []
  };
});
const getOrderTimelineEvents_createServerFn_handler = createServerRpc({
  id: "d34c7c83506c44f2c86116d6dcd7dfcdc4b6cfb60731a7bf41577677c9c2ea57",
  name: "getOrderTimelineEvents",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => getOrderTimelineEvents.__executeServer(opts));
const getOrderTimelineEvents = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(getOrderTimelineEvents_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const [eventsRes, emailLogRows, templateRows] = await Promise.all([admin.from("application_events").select("id, event_type, old_value, new_value, note, staff_name, staff_role, created_at").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }).limit(200), admin.from("email_logs").select("id, subject, template_code, status, to_email, error_message, created_at, sent_at").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }).limit(200), admin.from("email_templates").select("code")]);
  const templateSet = new Set((templateRows?.data ?? []).map((t) => t.code));
  const emailLogs = (emailLogRows?.data ?? []).map((l) => ({
    ...l,
    template_exists: Boolean(l.template_code && templateSet.has(l.template_code))
  }));
  return {
    events: eventsRes.data ?? [],
    emailLogs
  };
});
const getOrderTickets_createServerFn_handler = createServerRpc({
  id: "3420fec0092851628e781c482bc7e6a0cf27053e8d404f90be37e64553baccd3",
  name: "getOrderTickets",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => getOrderTickets.__executeServer(opts));
const getOrderTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  customerId: string().uuid().nullable().optional()
}).parse(i)).handler(getOrderTickets_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const [orderTicketsRes, customerTicketsRes] = await Promise.all([admin.from("support_tickets").select("id, ticket_number, subject, status, priority, created_at, updated_at").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }).limit(50), data.customerId ? admin.from("support_tickets").select("id, ticket_number, subject, status, priority, application_id, created_at").eq("customer_id", data.customerId).neq("application_id", data.orderId).order("created_at", {
    ascending: false
  }).limit(20) : Promise.resolve({
    data: []
  })]);
  return {
    orderTickets: orderTicketsRes?.data ?? [],
    customerTickets: customerTicketsRes?.data ?? []
  };
});
const updateOrderAssignee_createServerFn_handler = createServerRpc({
  id: "68d63119ba6cd5a50d733a3ee802e67886b18e4148b5a9bc3e62b254909dba49",
  name: "updateOrderAssignee",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => updateOrderAssignee.__executeServer(opts));
const updateOrderAssignee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  assignedTo: string().uuid().nullable()
}).parse(i)).handler(updateOrderAssignee_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    getStaffRoleInfo
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  const roleInfo = await getStaffRoleInfo(admin, context.userId);
  if (!roleInfo.isAdmin && !roleInfo.isManager) {
    throw new Error("Forbidden: Only Admin and Manager can reassign orders");
  }
  const {
    assignOrderCanonical
  } = await import("./assignment-engine.server--SlhbLzd.mjs");
  const res = await assignOrderCanonical({
    orderId: data.orderId,
    newEmployeeId: data.assignedTo,
    changeType: "MANUAL",
    reason: "Manual reassignment by operator/admin",
    source: "manual",
    actorId: context.userId
  });
  if (!res.success && res.error) {
    throw new Error(res.error);
  }
  return {
    ok: true
  };
});
const updateFulfillmentStatus_createServerFn_handler = createServerRpc({
  id: "77bbb9ae007f0bc781f5f1500403ece1573cf472e5e4b0edad5f831634dab4ff",
  name: "updateFulfillmentStatus",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => updateFulfillmentStatus.__executeServer(opts));
const updateFulfillmentStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  toStatus: string(),
  note: string().max(2e3).optional(),
  // Allow a single-step backward move (revert). One stage only,
  // never from `completed` or `cancelled`.
  allowBackward: boolean().optional(),
  // Admin/super-admin override: skip the strict stepwise map so any
  // stage can be set. Verified server-side against the caller's role.
  adminOverride: boolean().optional(),
  // Required when transitioning to `completed`
  certificateDocumentId: string().uuid().optional(),
  certificateNumber: string().trim().min(1).max(120).optional(),
  completionNotes: string().trim().max(2e3).optional(),
  ccEmail: string().trim().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Please provide a valid CC email address."
  })
}).parse(i)).handler(updateFulfillmentStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const {
    data: app
  } = await admin.from("applications").select("id, application_code, fulfillment_status, lead_id, customer_id, service_id, order_status, reopened_at").eq("id", data.orderId).maybeSingle();
  if (!app) throw new Error("Order not found");
  const current = app.fulfillment_status ?? "order_received";
  const target = data.toStatus;
  const isCertUpload = (target === "completed" || target === "order_completed") && Boolean(data.certificateDocumentId);
  if (current === target && !isCertUpload) return {
    ok: true,
    noop: true
  };
  let isAdminOverride = false;
  if (data.adminOverride) {
    const {
      data: roles
    } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    isAdminOverride = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
  }
  const isReopened = app.order_status === "REOPENED" || app.reopened_at != null || current === "order_reopened";
  const allowed = getAllowedFulfillmentTransitions(current);
  const curIdx = FULFILLMENT_STAGES.indexOf(current);
  const tgtIdx = FULFILLMENT_STAGES.indexOf(target);
  const isOneStepBack = data.allowBackward === true && curIdx > 0 && tgtIdx === curIdx - 1 && current !== "completed" && current !== "cancelled" && target !== "cancelled";
  const isCompleteWithCert = (target === "completed" || target === "order_completed") && (isAdminOverride || isReopened || isCertUpload || current !== "cancelled" && current !== "completed");
  const isConsultationJump = target === "consultation_completed" && current !== "cancelled" && current !== "completed" && current !== "order_closed";
  if (!isAdminOverride && !allowed.includes(target) && !isOneStepBack && !isCompleteWithCert && !isConsultationJump) {
    const allowedLabel = allowed.length ? allowed.join(", ") : "none";
    throw new Error(`Cannot move order from "${FULFILLMENT_LABEL[current] ?? current}" to "${FULFILLMENT_LABEL[target] ?? target}". Allowed next stages: ${allowedLabel}.`);
  }
  const isCompletionAction = target === "completed" || target === "order_completed" && Boolean(data.certificateDocumentId);
  if (isCompletionAction) {
    if (!data.certificateDocumentId) {
      throw new Error("Please upload the certificate PDF before marking this order complete.");
    }
    if (!data.certificateNumber || !data.certificateNumber.trim()) {
      throw new Error("Please enter the certificate / document number before completing this order.");
    }
  }
  if (!isCompletionAction) {
    const upd = {
      fulfillment_status: target
    };
    const {
      error: upErr
    } = await admin.from("applications").update(upd).eq("id", data.orderId);
    if (upErr) throw new Error(upErr.message);
  }
  const {
    staff_name,
    staff_role
  } = await getStaff(context.userId);
  if (data.note) {
    await admin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: app.lead_id,
      customer_id: app.customer_id ?? null,
      event_type: "note_added",
      note: data.note,
      created_by: context.userId,
      staff_name,
      staff_role
    });
  }
  if (isCompletionAction) {
    const certNumber = data.certificateNumber.trim();
    const completionNotes = data.completionNotes?.trim() || null;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const {
      data: certDoc
    } = await admin.from("documents").select("id, file_path, file_name, mime_type").eq("id", data.certificateDocumentId).maybeSingle();
    let certificateId = null;
    if (certDoc) {
      const {
        data: certRow,
        error: certErr
      } = await admin.from("certificates").insert({
        application_id: data.orderId,
        lead_id: app.lead_id,
        customer_id: app.customer_id ?? null,
        certificate_number: certNumber,
        file_path: certDoc.file_path,
        file_name: certDoc.file_name,
        mime_type: certDoc.mime_type,
        issued_at: now,
        uploaded_by: context.userId
      }).select("id").single();
      if (certErr) {
        console.error("[fulfillment.complete] certificate insert failed:", certErr);
      } else {
        certificateId = certRow.id;
      }
    }
    const [{
      data: lead
    }, {
      data: customer
    }, {
      data: service
    }] = await Promise.all([app.lead_id ? admin.from("leads").select("name, email, mobile, service").eq("id", app.lead_id).maybeSingle() : Promise.resolve({
      data: null
    }), app.customer_id ? admin.from("customers").select("name, primary_email, primary_mobile").eq("id", app.customer_id).maybeSingle() : Promise.resolve({
      data: null
    }), app.service_id ? admin.from("services").select("service_name, service_code").eq("id", app.service_id).maybeSingle() : Promise.resolve({
      data: null
    })]);
    const recipientEmail = (customer?.primary_email ?? "").trim() || (lead?.email ?? "").trim() || null;
    const recipientName = lead?.name || customer?.name || "Customer";
    const serviceName = service?.service_name || lead?.service || "Service";
    let certificateUrl = null;
    let certAttachment = null;
    if (certDoc?.file_path) {
      const {
        data: signed
      } = await admin.storage.from("documents").createSignedUrl(certDoc.file_path, 60 * 60 * 24 * 7);
      certificateUrl = signed?.signedUrl ?? null;
      try {
        const {
          data: blob,
          error: dlErr
        } = await admin.storage.from("documents").download(certDoc.file_path);
        if (dlErr) throw dlErr;
        if (blob) {
          const buf = Buffer.from(await blob.arrayBuffer());
          if (buf.byteLength <= 9 * 1024 * 1024) {
            const ext = (certDoc.file_name?.split(".").pop() || "pdf").toLowerCase();
            certAttachment = {
              filename: `${certNumber || app.application_code || "certificate"}.${ext}`,
              content_type: certDoc.mime_type || "application/octet-stream",
              content_base64: buf.toString("base64")
            };
          } else {
            console.warn("[certificate] attachment skipped: file >9MB", buf.byteLength);
          }
        }
      } catch (e) {
        console.warn("[certificate] attachment skipped: download failed", e);
      }
    }
    if (!recipientEmail) {
      throw new Error("Customer has no email on file — certificate email was not sent and order was not completed.");
    }
    if (!certificateUrl) {
      throw new Error("Could not generate certificate download link — certificate email was not sent and order was not completed.");
    }
    const normalizedCc = data.ccEmail?.trim() ? data.ccEmail.trim().toLowerCase() : void 0;
    if (recipientEmail && certificateUrl) {
      const completedDateFormatted = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      const {
        enqueueFromTemplateInternal
      } = await import("./emails.server-BTJhg2a3.mjs");
      try {
        await enqueueFromTemplateInternal("order_completed", recipientEmail, {
          customer_name: recipientName,
          service_name: serviceName,
          order_number: app.application_code ?? "",
          certificate_number: certNumber,
          certificate_url: certificateUrl,
          completion_notes: completionNotes ?? "",
          document_name: certAttachment?.filename ?? "Certificate",
          order_code: app.application_code ?? "",
          order_completion_date_time: completedDateFormatted,
          order_completion_date: completedDateFormatted,
          order_completed_date_time: completedDateFormatted,
          order_completed_date: completedDateFormatted,
          order_completed_at: completedDateFormatted,
          completed_date_time: completedDateFormatted,
          completed_date: completedDateFormatted,
          completed_at: completedDateFormatted,
          completion_date_time: completedDateFormatted,
          completion_date: completedDateFormatted,
          completion_at: completedDateFormatted
        }, {
          toName: recipientName,
          leadId: app.lead_id,
          applicationId: data.orderId,
          cc: normalizedCc,
          attachments: certAttachment ? [{
            filename: certAttachment.filename,
            content_type: certAttachment.content_type,
            content_base64: certAttachment.content_base64
          }] : void 0,
          requireImmediateSuccess: true,
          allowDuplicate: true,
          trigger: "manual"
        });
      } catch (sendErr) {
        const failMessage = sendErr?.message || "Failed to submit certificate email";
        console.error("[orders-v2.updateFulfillmentStatus] Certificate email sending failed:", sendErr);
        await admin.from("application_events").insert({
          application_id: data.orderId,
          lead_id: app.lead_id,
          customer_id: app.customer_id ?? null,
          event_type: "certificate_send_failed",
          new_value: "failed",
          note: `Certificate email submission failed for registered email ${recipientEmail}${normalizedCc ? `, with CC to ${normalizedCc}` : ""}. Error: ${failMessage}`,
          created_by: context.userId,
          staff_name,
          staff_role
        });
        throw new Error(`Certificate email submission failed: ${failMessage}. The order was not marked completed.`);
      }
    }
    await admin.from("applications").update({
      fulfillment_status: "order_completed",
      application_status: "completed",
      order_status: "COMPLETED",
      fulfilled_at: now,
      certificate_uploaded_at: now,
      certificate_number: certNumber,
      documents_deleted_at: now,
      documents_deleted_reason: "completed",
      reopened_at: null
    }).eq("id", data.orderId);
    await admin.from("order_schedulers").update({
      status: "stopped",
      stopped_at: now,
      stop_reason: "order_completed",
      stop_triggered_by: context.userId
    }).eq("application_id", data.orderId).in("status", ["active", "paused"]);
    if (certificateId) {
      await admin.from("certificates").update({
        delivered_at: now
      }).eq("id", certificateId);
    }
    try {
      const {
        data: docs
      } = await admin.from("documents").select("id, file_path, doc_type").eq("application_id", data.orderId);
      const removable = (docs ?? []).filter((d) => {
        if (d.id === data.certificateDocumentId) return false;
        if (String(d.doc_type ?? "").toLowerCase() === "certificate") return false;
        return true;
      });
      const paths = removable.map((d) => d.file_path).filter(Boolean);
      if (paths.length) await admin.storage.from("documents").remove(paths);
      const ids = removable.map((d) => d.id).filter(Boolean);
      if (ids.length) await admin.from("documents").delete().in("id", ids);
    } catch (e) {
      console.error("completed order document cleanup failed:", e);
    }
    if (app.lead_id) {
      await admin.from("leads").update({
        lead_status_v2: "closed"
      }).eq("id", app.lead_id);
    }
    const isReissue = current === "completed" || current === "order_completed" || isReopened;
    const historyNote = normalizedCc ? `Certificate email sent successfully to the registered email ${recipientEmail}, with CC to ${normalizedCc}.${completionNotes ? ` Notes: ${completionNotes}` : ""}` : (isReissue ? "Certificate re-issued / resent. " : "Application completed. ") + `Certificate ${certNumber} sent to ${recipientEmail}` + (completionNotes ? `. Notes: ${completionNotes}` : ".");
    await admin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: app.lead_id,
      customer_id: app.customer_id ?? null,
      event_type: isReissue ? "certificate_reissued" : "application_completed",
      new_value: "completed",
      note: historyNote,
      created_by: context.userId,
      staff_name,
      staff_role
    });
    try {
      const {
        completeHotOrderOnQualifyingAction
      } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
      await completeHotOrderOnQualifyingAction({
        orderId: data.orderId,
        actorId: context.userId,
        actorName: staff_name,
        actorRole: staff_role,
        actionName: "Application Accepted",
        actionReason: `Completed with certificate ${certNumber}`,
        supabase: admin
      });
    } catch (hotErr) {
      console.warn("[updateFulfillmentStatus.completed] completeHotOrderOnQualifyingAction warning:", hotErr);
    }
    return {
      ok: true,
      certificateId,
      certificateNumber: certNumber,
      emailQueuedTo: recipientEmail
    };
  }
  try {
    const {
      completeHotOrderOnQualifyingAction
    } = await import("./callback-reminder.functions-6OwGV8Nj.mjs");
    await completeHotOrderOnQualifyingAction({
      orderId: data.orderId,
      actorId: context.userId,
      actorName: staff_name,
      actorRole: staff_role,
      actionName: FULFILLMENT_LABEL[target] || target,
      actionReason: data.note || `Fulfillment stage changed to ${FULFILLMENT_LABEL[target] || target}`,
      supabase: admin
    });
  } catch (hotErr) {
    console.warn("[updateFulfillmentStatus] completeHotOrderOnQualifyingAction warning:", hotErr);
  }
  return {
    ok: true
  };
});
const resendOrderCertificate_createServerFn_handler = createServerRpc({
  id: "87abae69d90f0e807c2d1f89044dcec39780a543c9398637920979f6ad01302c",
  name: "resendOrderCertificate",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => resendOrderCertificate.__executeServer(opts));
const resendOrderCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  ccEmail: string().trim().email("Invalid CC email address").optional().or(literal("")).nullable()
}).parse(i)).handler(resendOrderCertificate_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const normalizedCc = data.ccEmail?.trim() ? data.ccEmail.trim().toLowerCase() : void 0;
  const {
    staff_name,
    staff_role
  } = await getStaff(context.userId);
  const {
    data: cert,
    error: certErr
  } = await admin.from("certificates").select("id, file_path, file_name, mime_type, certificate_number, lead_id, customer_id, application_id").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (certErr) throw new Error(certErr.message);
  if (!cert) throw new Error("No certificate has been issued for this order yet.");
  if (!cert.file_path) throw new Error("Certificate file is missing — cannot resend.");
  const {
    data: signed
  } = await admin.storage.from("documents").createSignedUrl(cert.file_path, 60 * 60 * 24 * 7);
  if (!signed?.signedUrl) throw new Error("Could not generate a fresh download link.");
  let resendAttachment = null;
  try {
    const {
      data: blob,
      error: dlErr
    } = await admin.storage.from("documents").download(cert.file_path);
    if (dlErr) throw dlErr;
    if (blob) {
      const buf = Buffer.from(await blob.arrayBuffer());
      if (buf.byteLength <= 9 * 1024 * 1024) {
        const ext = (cert.file_name?.split(".").pop() || "pdf").toLowerCase();
        resendAttachment = {
          filename: `${cert.certificate_number || "certificate"}.${ext}`,
          content_type: cert.mime_type || "application/octet-stream",
          content_base64: buf.toString("base64")
        };
      } else {
        console.warn("[certificate.resend] attachment skipped: file >9MB", buf.byteLength);
      }
    }
  } catch (e) {
    console.warn("[certificate.resend] attachment skipped: download failed", e);
  }
  const [{
    data: app
  }, {
    data: customer
  }, {
    data: lead
  }] = await Promise.all([admin.from("applications").select("application_code, service_id, lead_id, customer_id").eq("id", data.orderId).maybeSingle(), cert.customer_id ? admin.from("customers").select("name, primary_email").eq("id", cert.customer_id).maybeSingle() : Promise.resolve({
    data: null
  }), cert.lead_id ? admin.from("leads").select("name, email, service").eq("id", cert.lead_id).maybeSingle() : Promise.resolve({
    data: null
  })]);
  const serviceRow = app?.service_id ? (await admin.from("services").select("service_name").eq("id", app.service_id).maybeSingle()).data : null;
  const recipientEmail = (customer?.primary_email ?? "").trim() || (lead?.email ?? "").trim() || null;
  const recipientName = lead?.name || customer?.name || "Customer";
  const serviceName = serviceRow?.service_name || lead?.service || "Service";
  if (!recipientEmail) {
    throw new Error("No email address on file for this customer — cannot resend certificate.");
  }
  try {
    const appAny = app;
    const completedDateFormatted = new Date(appAny?.fulfilled_at ?? appAny?.updated_at ?? /* @__PURE__ */ new Date()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const {
      enqueueFromTemplateInternal
    } = await import("./emails.server-BTJhg2a3.mjs");
    await enqueueFromTemplateInternal("order_completed", recipientEmail, {
      customer_name: recipientName,
      service_name: serviceName,
      order_number: app?.application_code ?? "",
      certificate_number: cert.certificate_number,
      certificate_url: signed.signedUrl,
      document_name: resendAttachment?.filename ?? "Certificate",
      resend: true,
      order_completion_date_time: completedDateFormatted,
      order_completion_date: completedDateFormatted,
      order_completion_time: completedDateFormatted,
      order_completed_date_time: completedDateFormatted,
      order_completed_date: completedDateFormatted,
      order_completed_at: completedDateFormatted,
      completed_date_time: completedDateFormatted,
      completed_date: completedDateFormatted,
      completed_at: completedDateFormatted,
      completion_date_time: completedDateFormatted,
      completion_date: completedDateFormatted,
      completion_at: completedDateFormatted
    }, {
      toName: recipientName,
      leadId: cert.lead_id,
      applicationId: data.orderId,
      cc: normalizedCc,
      attachments: resendAttachment ? [{
        filename: resendAttachment.filename,
        content_type: resendAttachment.content_type,
        content_base64: resendAttachment.content_base64
      }] : void 0,
      requireImmediateSuccess: true,
      allowDuplicate: true,
      trigger: "manual"
    });
  } catch (sendErr) {
    const failMessage = sendErr?.message || "Failed to submit certificate email";
    console.error("[orders-v2.resendOrderCertificate] Certificate email sending failed:", sendErr);
    await admin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: cert.lead_id,
      customer_id: cert.customer_id ?? null,
      event_type: "certificate_resend_failed",
      new_value: "failed",
      note: `Certificate email resend submission failed for registered email ${recipientEmail}${normalizedCc ? `, with CC to ${normalizedCc}` : ""}. Error: ${failMessage}`,
      created_by: context.userId,
      staff_name,
      staff_role
    });
    throw new Error(`Failed to resend certificate email: ${failMessage}`);
  }
  await admin.from("certificates").update({
    delivered_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", cert.id);
  const historyNote = normalizedCc ? `Certificate email sent successfully to the registered email ${recipientEmail}, with CC to ${normalizedCc}.` : `Certificate ${cert.certificate_number ?? ""} resent to ${recipientEmail}.`;
  await admin.from("application_events").insert({
    application_id: data.orderId,
    lead_id: cert.lead_id,
    customer_id: cert.customer_id ?? null,
    event_type: "certificate_resent",
    note: historyNote,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  return {
    ok: true,
    resentTo: recipientEmail
  };
});
const MAX_DOC_BYTES = 15 * 1024 * 1024;
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
const requestOrderDocumentUpload_createServerFn_handler = createServerRpc({
  id: "7b30f69ea58599893f4a8ae2d88f5c7e20e2da37171fdf46b91d756116d300c9",
  name: "requestOrderDocumentUpload",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => requestOrderDocumentUpload.__executeServer(opts));
const requestOrderDocumentUpload = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  docType: string().trim().min(1).max(60),
  fileName: string().trim().min(1).max(200),
  mimeType: string().trim().min(1).max(120),
  sizeBytes: number().int().min(1).max(MAX_DOC_BYTES)
}).parse(i)).handler(requestOrderDocumentUpload_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  if (!ALLOWED_MIME.includes(data.mimeType.toLowerCase())) {
    throw new Error("Unsupported file type. Use PDF, JPG, PNG or WEBP.");
  }
  const ext = (data.fileName.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "bin";
  const safe = data.docType.replace(/[^a-z0-9_-]/gi, "_").slice(0, 40);
  const path = `orders/${data.orderId}/${safe}-${Date.now()}.${ext}`;
  const {
    data: signed,
    error
  } = await admin.storage.from("documents").createSignedUploadUrl(path);
  if (error || !signed) throw new Error(error?.message ?? "Could not start upload.");
  return {
    path,
    token: signed.token,
    signedUrl: signed.signedUrl
  };
});
const confirmOrderDocumentUpload_createServerFn_handler = createServerRpc({
  id: "d470933a0c8489fb0aff43b9f366a84315b763108e87b734e4c1b3ce27d9a9c4",
  name: "confirmOrderDocumentUpload",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => confirmOrderDocumentUpload.__executeServer(opts));
const confirmOrderDocumentUpload = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  docType: string().trim().min(1).max(60),
  filePath: string().min(1).max(400),
  fileName: string().min(1).max(200),
  mimeType: string().min(1).max(120),
  sizeBytes: number().int().min(1).max(MAX_DOC_BYTES)
}).parse(i)).handler(confirmOrderDocumentUpload_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const {
    data: app
  } = await admin.from("applications").select("lead_id").eq("id", data.orderId).maybeSingle();
  const {
    data: row,
    error
  } = await admin.from("documents").insert({
    application_id: data.orderId,
    lead_id: app?.lead_id ?? null,
    doc_type: data.docType,
    file_path: data.filePath,
    file_name: data.fileName,
    mime_type: data.mimeType,
    size_bytes: data.sizeBytes,
    status: "uploaded",
    uploaded_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select("id").single();
  if (error) throw new Error(error.message);
  const {
    staff_name,
    staff_role
  } = await getStaff(context.userId);
  await admin.from("application_events").insert({
    application_id: data.orderId,
    lead_id: app?.lead_id ?? null,
    event_type: "document_uploaded",
    note: `${data.docType}: ${data.fileName}`,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  return {
    documentId: row.id
  };
});
const getOrderDocumentSignedUrl_createServerFn_handler = createServerRpc({
  id: "8c2424cad7224077f54cca04271460d5d1dae95781478ce2b14087821a6617b2",
  name: "getOrderDocumentSignedUrl",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => getOrderDocumentSignedUrl.__executeServer(opts));
const getOrderDocumentSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  path: string().min(1)
}).parse(i)).handler(getOrderDocumentSignedUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    getStaffRoleInfo,
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  const roleInfo = await getStaffRoleInfo(admin, context.userId);
  if (!roleInfo.isStaff) throw new Error("Forbidden: Staff access required");
  let path = data.path.trim();
  const m = path.match(/\/object\/(?:public|sign|authenticated)\/documents\/([^?]+)/);
  if (m) path = decodeURIComponent(m[1]);
  path = path.replace(/^\/+/, "").replace(/^documents\//, "");
  if (!roleInfo.isAdmin && !roleInfo.isManager) {
    const {
      data: docRow
    } = await admin.from("documents").select("application_id").or(`file_path.eq.${path},file_path.ilike.%${path}%`).limit(1).maybeSingle();
    if (docRow?.application_id) {
      await assertCanAccessOrder({
        orderId: docRow.application_id,
        userId: context.userId,
        admin
      });
    }
  }
  try {
    const {
      data: signed,
      error
    } = await admin.storage.from("documents").createSignedUrl(path, 600);
    if (error || !signed?.signedUrl) {
      console.error("[getOrderDocumentSignedUrl] sign failed:", error?.message);
      return {
        url: null,
        error: "File not found in storage"
      };
    }
    return {
      url: signed.signedUrl,
      error: null
    };
  } catch (e) {
    console.error("[getOrderDocumentSignedUrl] unexpected:", e);
    return {
      url: null,
      error: "Could not open document"
    };
  }
});
const addOrderNoteV2_createServerFn_handler = createServerRpc({
  id: "21aebf8dd4084e78572d702968cc6c7c7e6519e3b21c0a398283cd18bd8a4ff9",
  name: "addOrderNoteV2",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => addOrderNoteV2.__executeServer(opts));
const addOrderNoteV2 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  note: string().trim().min(1).max(2e3)
}).parse(i)).handler(addOrderNoteV2_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const {
    data: app
  } = await admin.from("applications").select("lead_id, customer_id").eq("id", data.orderId).maybeSingle();
  const {
    staff_name,
    staff_role
  } = await getStaff(context.userId);
  const {
    error
  } = await admin.from("application_events").insert({
    application_id: data.orderId,
    lead_id: app?.lead_id ?? null,
    customer_id: app?.customer_id ?? null,
    event_type: "note_added",
    note: data.note,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const ChangeServiceInput = object({
  orderId: string().uuid(),
  newServiceId: string().uuid()
});
const changeOrderService_createServerFn_handler = createServerRpc({
  id: "2e3406b16d6176e31753371c6512f018b272d89c1be77cab76ec23942270547c",
  name: "changeOrderService",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => changeOrderService.__executeServer(opts));
const changeOrderService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ChangeServiceInput.parse(i)).handler(changeOrderService_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const isAdmin = await isUserAdmin(context.supabase, context.userId);
  if (!isAdmin) {
    const {
      data: roleRows2
    } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    const ok = (roleRows2 ?? []).some((r) => ["manager", "operations", "executive", "support"].includes(r.role));
    if (!ok) throw new Error("Forbidden");
  }
  const {
    data: app,
    error: appErr
  } = await admin.from("applications").select("id, lead_id, customer_id, service_id, fulfillment_status, application_status, form_submitted_at").eq("id", data.orderId).maybeSingle();
  if (appErr) throw new Error(appErr.message);
  if (!app) throw new Error("Order not found");
  const stage = String(app.fulfillment_status ?? "");
  if (["completed", "order_completed", "order_closed", "cancelled"].includes(stage)) {
    throw new Error("Service cannot be changed on completed or closed orders.");
  }
  const {
    data: newSvc,
    error: svcErr
  } = await admin.from("services").select("id, service_code, service_name, base_amount, gst_amount, total_amount, govt_portal_url").eq("id", data.newServiceId).maybeSingle();
  if (svcErr) throw new Error(svcErr.message);
  if (!newSvc) throw new Error("Selected service not found");
  if (newSvc.id === app.service_id) throw new Error("This is already the selected service.");
  const {
    data: paidRows
  } = await admin.from("payments").select("amount, status").eq("lead_id", app.lead_id).eq("status", "paid");
  const paidSum = (paidRows ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const newTotal = Number(newSvc.total_amount) || 0;
  const delta = Math.round((newTotal - paidSum) * 100) / 100;
  const {
    data: oldSvc
  } = app.service_id ? await admin.from("services").select("service_name").eq("id", app.service_id).maybeSingle() : {
    data: null
  };
  const leadUpdate = {
    service: newSvc.service_name,
    service_id: newSvc.id
  };
  if (paidSum <= 0) {
    leadUpdate.base_amount = newSvc.base_amount;
    leadUpdate.gst_amount = newSvc.gst_amount;
    leadUpdate.total_amount = newSvc.total_amount;
  }
  const {
    error: leadUpdErr
  } = await admin.from("leads").update(leadUpdate).eq("id", app.lead_id);
  if (leadUpdErr) throw new Error(leadUpdErr.message);
  const {
    SERVICE_CHANGE_STAGE_RESET,
    syncSubmissionForOrder
  } = await import("./submission-sync.server-DxEiXZ3U.mjs");
  const {
    error: appUpdErr
  } = await admin.from("applications").update({
    service_id: newSvc.id,
    ...SERVICE_CHANGE_STAGE_RESET
  }).eq("id", app.id);
  if (appUpdErr) throw new Error(appUpdErr.message);
  try {
    await syncSubmissionForOrder({
      admin,
      applicationId: app.id,
      leadId: app.lead_id,
      targetServiceId: newSvc.id,
      targetServiceCode: newSvc.service_code,
      resetToDraft: true
    });
  } catch (syncErr) {
    console.warn("Failed to synchronize submission on service change:", syncErr);
  }
  let topUpLinkId = null;
  if (delta > 0.01) {
    const {
      data: leadRow
    } = await admin.from("leads").select("lead_code").eq("id", app.lead_id).maybeSingle();
    const leadCode = leadRow?.lead_code;
    if (leadCode) {
      await admin.from("payment_links").update({
        status: "cancelled"
      }).eq("lead_id", app.lead_id).eq("status", "pending");
      await admin.from("leads").update({
        status: "payment_pending",
        lead_status_v2: "payment_pending"
      }).eq("id", app.lead_id);
      const origin = process.env.APP_BASE_URL || "https://udyamadhar.in";
      const txnid = `TOPUP-${leadCode}-${Date.now().toString(36)}`.toUpperCase();
      const {
        data: link
      } = await admin.from("payment_links").insert({
        lead_id: app.lead_id,
        amount: delta,
        txnid,
        payment_url: `${origin}/payment/${encodeURIComponent(leadCode)}`,
        status: "pending",
        expires_at: new Date(Date.now() + 30 * 864e5).toISOString()
      }).select("id").single();
      topUpLinkId = link?.id ?? null;
    }
  }
  const [{
    data: profile
  }, {
    data: roleRows
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", context.userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", context.userId)]);
  await admin.from("application_events").insert({
    application_id: app.id,
    lead_id: app.lead_id,
    customer_id: app.customer_id,
    event_type: "service_changed",
    old_value: oldSvc?.service_name ?? null,
    new_value: newSvc.service_name,
    note: (delta > 0.01 ? `Service changed. Top-up of ₹${delta.toFixed(2)} required.` : delta < -0.01 ? `Service changed. Customer overpaid by ₹${Math.abs(delta).toFixed(2)} (no refund per policy).` : `Service changed. Amount unchanged.`) + ` Order reset to Incomplete Form (was ${stage || "unknown"}); customer must submit the new service form.`,
    created_by: context.userId,
    staff_name: profile?.display_name || profile?.email || "Staff",
    staff_role: roleRows?.[0]?.role ?? "staff"
  });
  let invoiceRegenerated = false;
  let emailSent = false;
  let emailError = null;
  let topUpUrl = null;
  const mode = delta > 0.01 ? "upgrade" : delta < -0.01 ? "downgrade" : "same";
  try {
    const {
      data: leadRow
    } = await admin.from("leads").select("lead_code, name, email, mobile").eq("id", app.lead_id).maybeSingle();
    const {
      data: appRow
    } = await admin.from("applications").select("application_code").eq("id", app.id).maybeSingle();
    if (!leadRow?.email || !leadRow.lead_code) {
      return {
        ok: true,
        newService: newSvc,
        paidSum,
        newTotal,
        delta,
        mode,
        topUpLinkId,
        topUpUrl,
        invoiceRegenerated,
        emailSent,
        emailError: "No customer email on file"
      };
    }
    const origin = process.env.APP_BASE_URL || "https://udyamadhar.in";
    const onboardingUrl = `${origin}/onboarding/${encodeURIComponent(leadRow.lead_code)}`;
    const paymentUrl = `${origin}/payment/${encodeURIComponent(leadRow.lead_code)}`;
    topUpUrl = mode === "upgrade" ? paymentUrl : null;
    let attachment = null;
    if (mode !== "upgrade") {
      const {
        data: paidPayments
      } = await admin.from("payments").select("id").eq("lead_id", app.lead_id).eq("status", "paid").order("created_at", {
        ascending: false
      }).limit(1);
      const latestPayment = paidPayments?.[0];
      if (latestPayment?.id) {
        const {
          generateAndStore,
          loadInvoiceAttachmentByPayment
        } = await import("./invoices.functions-CoU4f0R2.mjs");
        const actorLabel = profile?.display_name || profile?.email || "staff";
        await generateAndStore(latestPayment.id, {
          id: context.userId,
          label: actorLabel
        });
        invoiceRegenerated = true;
        attachment = await loadInvoiceAttachmentByPayment(latestPayment.id);
      }
    }
    const fmt = (n) => n.toFixed(2);
    const modeMessage = mode === "same" ? "Your order has been updated to the new service. There is no change in the amount payable — you can continue with the onboarding form using the button below." : mode === "downgrade" ? `The new service costs less than what you have already paid. As per our policy, no refund is issued for the difference; the amount you have already paid is retained in full for this order. You can continue with the onboarding form using the button below.` : `The new service has a higher total than the amount currently paid. Please complete the balance payment using the button below so we can proceed with processing your order.`;
    const balanceRowHtml = mode === "upgrade" ? `<tr>
              <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:14px; color:#B54708; font-weight:700; border-top:2px solid #C9A227;">Balance Due Now</td>
              <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:14px; color:#B54708; font-weight:700; border-top:2px solid #C9A227;">&#8377;${fmt(delta)}</td>
            </tr>` : mode === "downgrade" ? `<tr>
                <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:13.5px; color:#5B6270;">Overpayment (retained, no refund)</td>
                <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:13.5px; color:#2B2E33; font-weight:600;">&#8377;${fmt(Math.abs(delta))}</td>
              </tr>` : "";
    const upgradeNoteHtml = mode === "upgrade" ? `<tr><td style="padding:16px 30px 0 30px;">
              <div style="background:#FFF7E6; border:1px solid #F5D08A; border-radius:6px; padding:12px 14px; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:13px; color:#7A4E00; line-height:1.6;">
                <strong>Note:</strong> The onboarding form link for the new service will be shared once the balance payment of &#8377;${fmt(delta)} is received.
              </div>
            </td></tr>` : "";
    const ctaLabel = mode === "upgrade" ? `Pay Balance ₹${fmt(delta)}` : "Continue to Onboarding Form";
    const ctaUrl = mode === "upgrade" ? paymentUrl : onboardingUrl;
    const ctaNote = mode === "upgrade" ? "Secure payment powered by our payment partner." : "This link is unique to your order — please do not share it.";
    const vars = {
      customer_name: leadRow.name ?? "",
      order_number: appRow?.application_code ?? leadRow.lead_code,
      previous_service: oldSvc?.service_name ?? "—",
      new_service: newSvc.service_name,
      amount_paid: fmt(paidSum),
      new_total: fmt(newTotal),
      balance_due: fmt(Math.max(0, delta)),
      mode_message: modeMessage,
      cta_url: ctaUrl,
      cta_label: ctaLabel,
      cta_note: ctaNote,
      balance_row_html: balanceRowHtml,
      upgrade_note_html: upgradeNoteHtml,
      support_email: "help@businesshelpservices.com"
    };
    const {
      enqueueFromTemplateInternal
    } = await import("./emails.server-BTJhg2a3.mjs");
    await enqueueFromTemplateInternal("service_changed", leadRow.email, vars, {
      toName: leadRow.name ?? void 0,
      leadId: app.lead_id,
      applicationId: app.id,
      attachments: attachment ? [attachment] : void 0,
      trigger: "manual",
      requireImmediateSuccess: false
    });
    emailSent = true;
  } catch (e) {
    emailError = e instanceof Error ? e.message : String(e);
    console.error("[changeOrderService] service-changed email failed", e);
  }
  return {
    ok: true,
    newService: newSvc,
    paidSum,
    newTotal,
    delta,
    mode,
    topUpLinkId,
    topUpUrl,
    invoiceRegenerated,
    emailSent,
    emailError
  };
});
const resendServiceChangeEmail_createServerFn_handler = createServerRpc({
  id: "36fe73f03f0fe1aadf51dfa318bb4e0541ed55e116c9240ad693dabb665e67ec",
  name: "resendServiceChangeEmail",
  filename: "src/lib/crm/orders-v2.functions.ts"
}, (opts) => resendServiceChangeEmail.__executeServer(opts));
const resendServiceChangeEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  orderId: string().uuid()
}).parse(d)).handler(resendServiceChangeEmail_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    assertCanAccessOrder
  } = await import("./order-auth.server-Bv4mY1MC.mjs");
  await assertCanAccessOrder({
    orderId: data.orderId,
    userId: context.userId,
    admin
  });
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id, customer_id, service_id").eq("id", data.orderId).maybeSingle();
  if (!app) throw new Error("Order not found");
  const {
    data: lead
  } = await admin.from("leads").select("lead_code, name, email, service, base_amount, gst_amount, total_amount").eq("id", app.lead_id).maybeSingle();
  if (!lead?.email || !lead.lead_code) throw new Error("No customer email on file");
  const {
    data: svc
  } = app.service_id ? await admin.from("services").select("service_name, total_amount").eq("id", app.service_id).maybeSingle() : {
    data: null
  };
  const {
    data: paidRows
  } = await admin.from("payments").select("amount, status").eq("lead_id", app.lead_id).eq("status", "paid");
  const paidSum = (paidRows ?? []).reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const newTotal = Number(svc?.total_amount ?? lead.total_amount ?? 0);
  const delta = Math.round((newTotal - paidSum) * 100) / 100;
  const mode = delta > 0.01 ? "upgrade" : delta < -0.01 ? "downgrade" : "same";
  const origin = process.env.APP_BASE_URL || "https://udyamadhar.in";
  const onboardingUrl = `${origin}/onboarding/${encodeURIComponent(lead.lead_code)}`;
  const paymentUrl = `${origin}/payment/${encodeURIComponent(lead.lead_code)}`;
  const fmt = (n) => n.toFixed(2);
  const modeMessage = mode === "same" ? "Your order has been updated to the new service. There is no change in the amount payable — you can continue with the onboarding form using the button below." : mode === "downgrade" ? `The new service costs less than what you have already paid. As per our policy, no refund is issued for the difference; the amount you have already paid is retained in full for this order. You can continue with the onboarding form using the button below.` : `The new service has a higher total than the amount currently paid. Please complete the balance payment using the button below so we can proceed with processing your order.`;
  const balanceRowHtml = mode === "upgrade" ? `<tr>
            <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:14px; color:#B54708; font-weight:700; border-top:2px solid #C9A227;">Balance Due Now</td>
            <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:14px; color:#B54708; font-weight:700; border-top:2px solid #C9A227;">&#8377;${fmt(delta)}</td>
          </tr>` : mode === "downgrade" ? `<tr>
              <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:13.5px; color:#5B6270;">Overpayment (retained, no refund)</td>
              <td style="padding:10px 0; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:13.5px; color:#2B2E33; font-weight:600;">&#8377;${fmt(Math.abs(delta))}</td>
            </tr>` : "";
  const upgradeNoteHtml = mode === "upgrade" ? `<tr><td style="padding:16px 30px 0 30px;">
            <div style="background:#FFF7E6; border:1px solid #F5D08A; border-radius:6px; padding:12px 14px; font-family:'Segoe UI', Arial, Helvetica, sans-serif; font-size:13px; color:#7A4E00; line-height:1.6;">
              <strong>Note:</strong> The onboarding form link for the new service will be shared once the balance payment of &#8377;${fmt(delta)} is received.
            </div>
          </td></tr>` : "";
  const ctaLabel = mode === "upgrade" ? `Pay Balance ₹${fmt(delta)}` : "Continue to Onboarding Form";
  const ctaUrl = mode === "upgrade" ? paymentUrl : onboardingUrl;
  const ctaNote = mode === "upgrade" ? "Secure payment powered by our payment partner." : "This link is unique to your order — please do not share it.";
  const vars = {
    customer_name: lead.name ?? "",
    order_number: lead.lead_code,
    previous_service: "—",
    new_service: svc?.service_name ?? lead.service,
    amount_paid: fmt(paidSum),
    new_total: fmt(newTotal),
    balance_due: fmt(Math.max(0, delta)),
    mode_message: modeMessage,
    cta_url: ctaUrl,
    cta_label: ctaLabel,
    cta_note: ctaNote,
    balance_row_html: balanceRowHtml,
    upgrade_note_html: upgradeNoteHtml,
    support_email: "help@businesshelpservices.com"
  };
  const {
    enqueueFromTemplateInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  await enqueueFromTemplateInternal("service_changed", lead.email, vars, {
    toName: lead.name ?? void 0,
    leadId: app.lead_id,
    applicationId: app.id,
    trigger: "manual",
    requireImmediateSuccess: false
  });
  return {
    ok: true,
    recipient: lead.email
  };
});
export {
  addOrderNoteV2_createServerFn_handler,
  changeOrderService_createServerFn_handler,
  confirmOrderDocumentUpload_createServerFn_handler,
  getOrderDetailV2_createServerFn_handler,
  getOrderDocumentSignedUrl_createServerFn_handler,
  getOrderTickets_createServerFn_handler,
  getOrderTimelineEvents_createServerFn_handler,
  listEmployeeAssignedOrders_createServerFn_handler,
  listOrdersV2_createServerFn_handler,
  requestOrderDocumentUpload_createServerFn_handler,
  resendOrderCertificate_createServerFn_handler,
  resendServiceChangeEmail_createServerFn_handler,
  updateFulfillmentStatus_createServerFn_handler,
  updateOrderAssignee_createServerFn_handler
};
