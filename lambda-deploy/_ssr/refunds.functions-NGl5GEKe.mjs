import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { transitionLeadStatus } from "./lead-status.functions-rIiSyzbQ.mjs";
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
import "./createSsrRpc-BO-AEXHh.mjs";
import "./lead-transitions-BnGgq5Kd.mjs";
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function assertFinanceOrAdmin(userId) {
  const admin = await getAdmin();
  const {
    data
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r) => r.role);
  const ok = roles.some((r) => ["admin", "super_admin", "finance"].includes(r));
  if (!ok) throw new Error("Forbidden: refund actions require admin or finance role.");
}
async function getStaff(userId) {
  const admin = await getAdmin();
  const [{
    data: profile
  }, {
    data: roles
  }] = await Promise.all([admin.from("profiles").select("display_name, email").eq("id", userId).maybeSingle(), admin.from("user_roles").select("role").eq("user_id", userId)]);
  return {
    staff_name: profile?.display_name || profile?.email || "Staff",
    staff_role: roles?.[0]?.role ?? "staff"
  };
}
const approveRefund_createServerFn_handler = createServerRpc({
  id: "aaf61620faceaf5d5caa71f36233696aa4538dc557db8f4f1f608aeef52f817f",
  name: "approveRefund",
  filename: "src/lib/crm/refunds.functions.ts"
}, (opts) => approveRefund.__executeServer(opts));
const approveRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  policyNote: string().trim().max(2e3).optional()
}).parse(i)).handler(approveRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.userId);
  const admin = await getAdmin();
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id, customer_id").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (!app) throw new Error("No application found for this lead.");
  const {
    error: upErr
  } = await admin.from("applications").update({
    fulfillment_status: "order_closed",
    workflow_status: "refund_closed",
    closure_stage: "refund_approved",
    refund_approved_at: (/* @__PURE__ */ new Date()).toISOString(),
    refund_approved_by: context.userId
  }).eq("id", app.id);
  if (upErr) throw new Error(upErr.message);
  const {
    staff_name,
    staff_role
  } = await getStaff(context.userId);
  await admin.from("application_events").insert({
    application_id: app.id,
    lead_id: data.leadId,
    customer_id: app.customer_id ?? null,
    event_type: "refund_approved",
    note: data.policyNote ?? null,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  await transitionLeadStatus({
    data: {
      leadId: data.leadId,
      toStatus: "refund_approved"
    }
  });
  return {
    ok: true
  };
});
const markRefundProcessed_createServerFn_handler = createServerRpc({
  id: "9573e437b1ae63bcb34e0328b56cc0c42a1cc33eea492ff5e2709a9538cd4257",
  name: "markRefundProcessed",
  filename: "src/lib/crm/refunds.functions.ts"
}, (opts) => markRefundProcessed.__executeServer(opts));
const markRefundProcessed = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  gatewayRef: string().trim().min(2).max(200)
}).parse(i)).handler(markRefundProcessed_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.userId);
  const admin = await getAdmin();
  const {
    data: app
  } = await admin.from("applications").select("id, lead_id, customer_id").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (!app) throw new Error("No application found for this lead.");
  const {
    data: origPayment
  } = await admin.from("payments").select("id, amount, currency, gateway_name, customer_id").eq("application_id", app.id).eq("status", "paid").order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (!origPayment) throw new Error("No successful payment found to refund.");
  const {
    error: insErr
  } = await admin.from("payments").insert({
    lead_id: data.leadId,
    application_id: app.id,
    customer_id: origPayment.customer_id ?? null,
    parent_payment_id: origPayment.id,
    amount: -Math.abs(Number(origPayment.amount)),
    currency: origPayment.currency ?? "INR",
    status: "refunded",
    gateway_name: origPayment.gateway_name,
    transaction_id: data.gatewayRef,
    refund_reason: "refund_processed",
    payment_date: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (insErr) throw new Error(insErr.message);
  await admin.from("payments").update({
    status: "refunded"
  }).eq("id", origPayment.id);
  await admin.from("applications").update({
    refund_processed_at: (/* @__PURE__ */ new Date()).toISOString(),
    refund_gateway_ref: data.gatewayRef
  }).eq("id", app.id);
  await admin.from("refund_requests").update({
    status: "processed",
    gateway_ref: data.gatewayRef,
    gateway_name: origPayment.gateway_name,
    processed_at: (/* @__PURE__ */ new Date()).toISOString(),
    processed_by: context.userId
  }).eq("application_id", app.id);
  try {
    const {
      invalidateRevenueCache
    } = await import("./revenue-admin.functions-CCSJJWJX.mjs");
    invalidateRevenueCache();
  } catch (err) {
    console.error("[markRefundProcessed] invalidateRevenueCache failed:", err);
  }
  const {
    staff_name,
    staff_role
  } = await getStaff(context.userId);
  await admin.from("application_events").insert({
    application_id: app.id,
    lead_id: data.leadId,
    customer_id: app.customer_id ?? null,
    event_type: "refund_processed",
    note: `Refund processed via gateway ref ${data.gatewayRef}.`,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  await transitionLeadStatus({
    data: {
      leadId: data.leadId,
      toStatus: "refunded"
    }
  });
  return {
    ok: true
  };
});
const rejectRefund_createServerFn_handler = createServerRpc({
  id: "db3cc9b5df7abcc9f0342f59301780d8f998bc5570bab41ff7257dcd5e69e901",
  name: "rejectRefund",
  filename: "src/lib/crm/refunds.functions.ts"
}, (opts) => rejectRefund.__executeServer(opts));
const rejectRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  reason: string().trim().min(3).max(2e3)
}).parse(i)).handler(rejectRefund_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertFinanceOrAdmin(context.userId);
  const admin = await getAdmin();
  const {
    data: app
  } = await admin.from("applications").select("id, customer_id").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    staff_name,
    staff_role
  } = await getStaff(context.userId);
  await admin.from("application_events").insert({
    application_id: app?.id ?? null,
    lead_id: data.leadId,
    customer_id: app?.customer_id ?? null,
    event_type: "refund_rejected",
    note: data.reason,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  await transitionLeadStatus({
    data: {
      leadId: data.leadId,
      toStatus: "closed"
    }
  });
  return {
    ok: true
  };
});
export {
  approveRefund_createServerFn_handler,
  markRefundProcessed_createServerFn_handler,
  rejectRefund_createServerFn_handler
};
