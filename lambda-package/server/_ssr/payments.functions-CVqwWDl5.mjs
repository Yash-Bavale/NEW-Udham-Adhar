import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole, w as writeAudit } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number } from "../_libs/zod.mjs";
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
const listPaymentsSafe_createServerFn_handler = createServerRpc({
  id: "6fa3bf56936c0d26113e7a04809f389b07cf426d5b5c0a3237086c5a0a02d0eb",
  name: "listPaymentsSafe",
  filename: "src/lib/crm/payments.functions.ts"
}, (opts) => listPaymentsSafe.__executeServer(opts));
const listPaymentsSafe = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listPaymentsSafe_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("payments_safe").select("*").order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const listPaymentsFull_createServerFn_handler = createServerRpc({
  id: "50ef44b91bac83cd17e6535cbde2d041c5bc7de3b2e7615c9f1115f3b16b1f9f",
  name: "listPaymentsFull",
  filename: "src/lib/crm/payments.functions.ts"
}, (opts) => listPaymentsFull.__executeServer(opts));
const listPaymentsFull = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listPaymentsFull_createServerFn_handler, async ({
  context
}) => {
  const {
    data: roles
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
  if (!ok) throw new Error("Forbidden");
  const {
    data,
    error
  } = await (await getAdmin()).from("payments").select("*").order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const revenueStats_createServerFn_handler = createServerRpc({
  id: "a1686ef4b8a37642fb43d1b7dbff9af37c0e23ecf6475e5ec8bf89eb2fce930e",
  name: "revenueStats",
  filename: "src/lib/crm/payments.functions.ts"
}, (opts) => revenueStats.__executeServer(opts));
const revenueStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(revenueStats_createServerFn_handler, async ({
  context
}) => {
  const {
    data: roles
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
  if (!ok) throw new Error("Forbidden");
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 864e5);
  const monthAgo = new Date(Date.now() - 30 * 864e5);
  const {
    data: paid
  } = await (await getAdmin()).from("payments").select("amount, gst_amount, base_amount, payment_date, created_at, status").eq("status", "paid");
  const rows = paid ?? [];
  const sum = (xs, key) => xs.reduce((s, r) => s + Number(r[key] ?? 0), 0);
  const since = (d) => rows.filter((r) => new Date(r.payment_date ?? r.created_at) >= d);
  return {
    total: {
      count: rows.length,
      revenue: sum(rows, "amount"),
      gst: sum(rows, "gst_amount"),
      base: sum(rows, "base_amount")
    },
    today: {
      count: since(today).length,
      revenue: sum(since(today), "amount")
    },
    week: {
      count: since(weekAgo).length,
      revenue: sum(since(weekAgo), "amount")
    },
    month: {
      count: since(monthAgo).length,
      revenue: sum(since(monthAgo), "amount")
    }
  };
});
const RefundInput = object({
  paymentId: string().uuid(),
  amount: number().positive(),
  reason: string().trim().min(3).max(500)
});
const refundPayment_createServerFn_handler = createServerRpc({
  id: "cb5cd1edb0683d4b8c27db182aaa1e516f1fe2b939d1944801019c7368c7b994",
  name: "refundPayment",
  filename: "src/lib/crm/payments.functions.ts"
}, (opts) => refundPayment.__executeServer(opts));
const refundPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => RefundInput.parse(i)).handler(refundPayment_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "accounts"]);
  const {
    data: payment,
    error
  } = await (await getAdmin()).from("payments").select("id, lead_id, application_id, gateway_name, status, amount, transaction_id, razorpay_order_id, razorpay_payment_id, raw_response, base_amount, gst_amount, currency").eq("id", data.paymentId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!payment) throw new Error("Payment not found");
  if (payment.status !== "paid") throw new Error("Only paid payments can be refunded");
  const {
    data: existingRefunds
  } = await (await getAdmin()).from("payments").select("amount").eq("parent_payment_id", payment.id);
  const refundedSoFar = (existingRefunds ?? []).reduce((s, r) => s + Math.abs(Number(r.amount ?? 0)), 0);
  const remaining = Number(payment.amount) - refundedSoFar;
  if (data.amount > remaining + 1e-3) {
    throw new Error(`Refund exceeds refundable balance (₹${remaining.toFixed(2)})`);
  }
  if (payment.gateway_name === "ccavenue") {
    const {
      callRefundApi
    } = await import("./ccavenue.server-DLXDMTcZ.mjs");
    const refNo = payment.raw_response?.tracking_id || payment.razorpay_payment_id || payment.transaction_id;
    if (!refNo) throw new Error("CCAvenue tracking_id missing on payment");
    const refundRef = `RF-${payment.id.slice(0, 8)}-${Date.now().toString(36)}`.toUpperCase();
    const result = await callRefundApi({
      refNo,
      refundAmount: data.amount,
      refundRef
    });
    if (!result.ok) {
      throw new Error(`CCAvenue refund failed: ${result.reason ?? result.refundStatus}`);
    }
    const {
      data: childRow,
      error: childErr
    } = await (await getAdmin()).from("payments").insert({
      lead_id: payment.lead_id,
      application_id: payment.application_id,
      gateway_name: payment.gateway_name,
      parent_payment_id: payment.id,
      transaction_id: refundRef,
      razorpay_order_id: refundRef,
      razorpay_payment_id: result.refundRef,
      amount: -Math.abs(data.amount),
      base_amount: 0,
      gst_amount: 0,
      currency: payment.currency ?? "INR",
      status: "refunded",
      refund_reason: data.reason,
      payment_date: (/* @__PURE__ */ new Date()).toISOString(),
      raw_response: result.raw
    }).select("id").single();
    if (childErr) throw new Error(childErr.message);
    const fullyRefunded = refundedSoFar + data.amount >= Number(payment.amount) - 1e-3;
    if (fullyRefunded) {
      await (await getAdmin()).from("payments").update({
        status: "refunded"
      }).eq("id", payment.id);
    }
    await writeAudit({
      supabase: context.supabase,
      entityType: "payment",
      entityId: payment.id,
      action: fullyRefunded ? "refund_full" : "refund_partial",
      newValue: {
        amount: data.amount,
        reason: data.reason,
        refundRef,
        child: childRow?.id
      }
    });
    return {
      ok: true,
      fullyRefunded,
      childPaymentId: childRow?.id,
      refundRef
    };
  }
  if (payment.gateway_name === "payu") {
    throw new Error("PayU refunds are not wired yet. Issue the refund from the PayU dashboard.");
  }
  throw new Error(`Refunds for gateway '${payment.gateway_name}' are not supported.`);
});
const ReconcileInput = object({
  paymentId: string().uuid()
});
const reconcilePaymentStatus_createServerFn_handler = createServerRpc({
  id: "019efab430c8cc2fb376e96fc17c9a1b4d9f9261bdadf738e84ed4b25a5df33d",
  name: "reconcilePaymentStatus",
  filename: "src/lib/crm/payments.functions.ts"
}, (opts) => reconcilePaymentStatus.__executeServer(opts));
const reconcilePaymentStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ReconcileInput.parse(i)).handler(reconcilePaymentStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin", "accounts", "finance"]);
  const {
    data: payment,
    error
  } = await (await getAdmin()).from("payments").select("id, gateway_name, status, transaction_id, razorpay_order_id, lead_id").eq("id", data.paymentId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!payment) throw new Error("Payment not found");
  const gateway = String(payment.gateway_name ?? "").toLowerCase();
  if (gateway === "payu") {
    const {
      verifyPayUPayment
    } = await import("./payu.server-3jw08lkR.mjs");
    const txnid = payment.transaction_id || payment.razorpay_order_id;
    if (!txnid) throw new Error("Payment is missing a transaction id");
    const verified = await verifyPayUPayment(txnid);
    const status = String(verified?.status ?? "").trim().toLowerCase();
    const unmapped = String(verified?.unmappedstatus ?? "").trim().toLowerCase();
    const success = status === "success" || unmapped === "captured";
    const failure = status === "failure" || status === "failed" || ["bounced", "dropped", "failed", "usercancelled"].includes(unmapped);
    const newStatus = success ? "paid" : failure ? "failed" : payment.status;
    if (newStatus === payment.status && !success) {
      return {
        ok: true,
        status: newStatus,
        raw: verified
      };
    }
    const mihpayid = verified?.mihpayid ? String(verified.mihpayid) : null;
    await (await getAdmin()).from("payments").update({
      status: newStatus,
      payment_date: newStatus === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
      webhook_received_at: newStatus === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
      razorpay_payment_id: mihpayid,
      payu_mihpayid: mihpayid,
      payu_bank_ref_num: verified?.bank_ref_num ? String(verified.bank_ref_num) : null,
      raw_response: {
        verified_payment: verified,
        source: "admin-reconcile"
      }
    }).eq("id", payment.id);
    if (newStatus === "paid") {
      const {
        finalizePaidPayment
      } = await import("./finalize-paid.server-CnNMG_m8.mjs");
      await finalizePaidPayment(payment.id, {
        source: "reconcile",
        txnid,
        mihpayid
      });
    } else if (newStatus === "failed") {
      await (await getAdmin()).from("leads").update({
        status: "payment_pending",
        lead_status_v2: "payment_failed"
      }).eq("id", payment.lead_id);
    }
    await writeAudit({
      supabase: context.supabase,
      entityType: "payment",
      entityId: payment.id,
      action: "status_reconciled",
      oldValue: {
        status: payment.status
      },
      newValue: {
        status: newStatus,
        source: "payu.verify_payment"
      }
    });
    return {
      ok: true,
      status: newStatus,
      raw: verified
    };
  }
  if (gateway === "ccavenue") {
    const {
      callOrderStatusApi
    } = await import("./ccavenue.server-DLXDMTcZ.mjs");
    const orderId = payment.transaction_id || payment.razorpay_order_id;
    if (!orderId) throw new Error("Payment is missing an order id");
    const result = await callOrderStatusApi(orderId);
    const newStatus = result.status === "paid" ? "paid" : result.status === "failed" ? "failed" : result.status === "refunded" ? "refunded" : result.status === "attempted" ? "attempted" : payment.status;
    if (newStatus !== payment.status) {
      await (await getAdmin()).from("payments").update({
        status: newStatus,
        payment_date: newStatus === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
        raw_response: result.raw
      }).eq("id", payment.id);
      if (newStatus === "paid") {
        const {
          finalizePaidPayment
        } = await import("./finalize-paid.server-CnNMG_m8.mjs");
        await finalizePaidPayment(payment.id, {
          source: "reconcile",
          txnid: orderId,
          mihpayid: result.trackingId || null
        });
      } else if (newStatus === "failed") {
        await (await getAdmin()).from("leads").update({
          status: "payment_pending",
          lead_status_v2: "payment_failed"
        }).eq("id", payment.lead_id);
      }
      await writeAudit({
        supabase: context.supabase,
        entityType: "payment",
        entityId: payment.id,
        action: "status_reconciled",
        oldValue: {
          status: payment.status
        },
        newValue: {
          status: newStatus,
          source: "ccavenue.orderStatusTracker"
        }
      });
    }
    return {
      ok: true,
      status: newStatus,
      raw: result.raw
    };
  }
  if (gateway === "cashfree") {
    const {
      getOrderStatus
    } = await import("./cashfree.server-DDK211Dz.mjs");
    const orderId = payment.transaction_id || payment.razorpay_order_id;
    if (!orderId) throw new Error("Payment is missing an order id");
    const {
      credsForPayment
    } = await import("./cashfree-accounts.server-guyWBqWD.mjs");
    const {
      data: acct
    } = await (await getAdmin()).from("payments").select("payment_account_id").eq("id", payment.id).single();
    const cfOrder = await getOrderStatus(orderId, await credsForPayment(acct?.payment_account_id));
    const cfStatus = String(cfOrder?.order_status ?? "").toUpperCase();
    const newStatus = cfStatus === "PAID" ? "paid" : cfStatus === "EXPIRED" || cfStatus === "TERMINATED" ? "failed" : payment.status;
    if (newStatus === payment.status) {
      return {
        ok: true,
        status: newStatus,
        raw: cfOrder
      };
    }
    if (newStatus === "paid") {
      const paidAmount = Number(cfOrder.order_amount ?? 0);
      const {
        data: full
      } = await (await getAdmin()).from("payments").select("amount").eq("id", payment.id).single();
      if (Math.abs(paidAmount - Number(full?.amount ?? 0)) > 0.01) {
        throw new Error(`Amount mismatch at gateway (₹${paidAmount} vs ₹${full?.amount})`);
      }
    }
    await (await getAdmin()).from("payments").update({
      status: newStatus,
      payment_date: newStatus === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
      webhook_received_at: newStatus === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
      raw_response: {
        api_confirmed: cfOrder,
        source: "admin-reconcile"
      }
    }).eq("id", payment.id);
    if (newStatus === "paid") {
      const {
        finalizePaidPayment
      } = await import("./finalize-paid.server-CnNMG_m8.mjs");
      await finalizePaidPayment(payment.id, {
        source: "reconcile",
        txnid: orderId
      });
    } else if (newStatus === "failed") {
      await (await getAdmin()).from("leads").update({
        status: "payment_pending",
        lead_status_v2: "payment_failed"
      }).eq("id", payment.lead_id);
    }
    await writeAudit({
      supabase: context.supabase,
      entityType: "payment",
      entityId: payment.id,
      action: "status_reconciled",
      oldValue: {
        status: payment.status
      },
      newValue: {
        status: newStatus,
        source: "cashfree.orderStatus"
      }
    });
    return {
      ok: true,
      status: newStatus,
      raw: cfOrder
    };
  }
  throw new Error(`Reconciliation for gateway '${payment.gateway_name}' is not wired.`);
});
export {
  listPaymentsFull_createServerFn_handler,
  listPaymentsSafe_createServerFn_handler,
  reconcilePaymentStatus_createServerFn_handler,
  refundPayment_createServerFn_handler,
  revenueStats_createServerFn_handler
};
