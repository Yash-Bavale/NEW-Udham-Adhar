import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, s as string, _ as _enum } from "../_libs/zod.mjs";
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
async function requireStaff(supabase, userId) {
  const {
    data
  } = await supabase.rpc("has_any_staff_role", {
    _user_id: userId
  });
  if (!data) throw new Error("Forbidden");
}
const refundStats_createServerFn_handler = createServerRpc({
  id: "e2a65903eef495a17e983d66c62ae516501984bac0ddeca5e8694bb12a73f0a8",
  name: "refundStats",
  filename: "src/lib/crm/refunds-v2.functions.ts"
}, (opts) => refundStats.__executeServer(opts));
const refundStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(refundStats_createServerFn_handler, async ({
  context
}) => {
  await requireStaff(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: rows
  } = await admin.from("refund_requests").select("id, status, refund_amount, processed_at, created_at, application:applications(id, refund_processed_at, order_status)");
  const all = rows ?? [];
  const num = (v) => v == null ? 0 : Number(v) || 0;
  const isProc = (r) => Boolean(r.processed_at || r.status === "processed" || r.application?.refund_processed_at || r.application?.order_status === "REFUND_PROCESSED");
  const byStatus = (s) => all.filter((r) => !isProc(r) && (r.status ?? "pending") === s);
  const sum = (arr) => arr.reduce((a, r) => a + num(r.refund_amount), 0);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1e3;
  return {
    totals: {
      all: all.length,
      pending: byStatus("pending").length,
      info_needed: byStatus("info_needed").length,
      escalated: byStatus("escalated").length,
      approved: byStatus("approved").length,
      rejected: byStatus("rejected").length,
      processed: all.filter(isProc).length
    },
    amounts: {
      pending: sum(byStatus("pending")),
      approved: sum(byStatus("approved")),
      processedThisMonth: all.filter((r) => isProc(r) && (r.processed_at || r.application?.refund_processed_at) && new Date(r.processed_at || r.application.refund_processed_at).getMonth() === (/* @__PURE__ */ new Date()).getMonth() && new Date(r.processed_at || r.application.refund_processed_at).getFullYear() === (/* @__PURE__ */ new Date()).getFullYear()).reduce((a, r) => a + num(r.refund_amount), 0),
      totalProcessed: all.filter(isProc).reduce((a, r) => a + num(r.refund_amount), 0)
    },
    agingPending: {
      under24h: byStatus("pending").filter((r) => r.created_at && now - new Date(r.created_at).getTime() < dayMs).length,
      over24h: byStatus("pending").filter((r) => r.created_at && now - new Date(r.created_at).getTime() >= dayMs && now - new Date(r.created_at).getTime() < 3 * dayMs).length,
      over72h: byStatus("pending").filter((r) => r.created_at && now - new Date(r.created_at).getTime() >= 3 * dayMs).length
    }
  };
});
const listRefundsAdvanced_createServerFn_handler = createServerRpc({
  id: "60cfd8d6342eb1b86e2a11ef3033f65d7933f707a50a30daef0487d5acd98d13",
  name: "listRefundsAdvanced",
  filename: "src/lib/crm/refunds-v2.functions.ts"
}, (opts) => listRefundsAdvanced.__executeServer(opts));
const listRefundsAdvanced = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  status: _enum(["all", "pending", "info_needed", "escalated", "approved", "rejected", "processed"]).default("all"),
  search: string().max(120).optional(),
  limit: number().int().min(1).max(200).default(100)
}).parse(raw)).handler(listRefundsAdvanced_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireStaff(context.supabase, context.userId);
  const admin = await getAdmin();
  const selectFields = "id, application_id, lead_id, reason, refund_amount, refund_mode, deduction_amount, deduction_reason, gateway_ref, gateway_name, status, admin_notes, customer_notes, created_at, decided_at, processed_at, info_needed_note, escalation_note, application:applications(id, application_code, order_status, service_id, refund_processed_at), lead:leads(id, name, email, mobile, service, lead_code)";
  let rawRows = [];
  if (data.status === "processed") {
    const [byProcessedAt, byApproved] = await Promise.all([admin.from("refund_requests").select(selectFields).not("processed_at", "is", null).order("created_at", {
      ascending: false
    }).limit(data.limit), admin.from("refund_requests").select(selectFields).eq("status", "approved").order("created_at", {
      ascending: false
    }).limit(data.limit)]);
    if (byProcessedAt.error) throw new Error(byProcessedAt.error.message);
    if (byApproved.error) throw new Error(byApproved.error.message);
    const map = /* @__PURE__ */ new Map();
    for (const r of byProcessedAt.data ?? []) map.set(r.id, r);
    for (const r of byApproved.data ?? []) map.set(r.id, r);
    rawRows = Array.from(map.values()).sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
  } else {
    let q = admin.from("refund_requests").select(selectFields).order("created_at", {
      ascending: false
    }).limit(data.limit);
    if (data.status !== "all") {
      q = q.eq("status", data.status);
    }
    const {
      data: rowsData,
      error
    } = await q;
    if (error) throw new Error(error.message);
    rawRows = rowsData ?? [];
  }
  const isProc = (r) => Boolean(r.processed_at || r.status === "processed" || r.application?.refund_processed_at || r.application?.order_status === "REFUND_PROCESSED");
  const normalizedRows = (rawRows ?? []).map((r) => {
    if (isProc(r)) {
      if (!r.processed_at && r.application?.refund_processed_at) {
        r.processed_at = r.application.refund_processed_at;
      }
      if (r.status !== "processed") {
        r.status = "processed";
        Promise.resolve(admin.from("refund_requests").update({
          processed_at: r.processed_at || (/* @__PURE__ */ new Date()).toISOString(),
          status: "processed"
        }).eq("id", r.id)).catch((err) => {
          if (String(err?.message || "").toLowerCase().includes("enum")) {
            Promise.resolve(admin.from("refund_requests").update({
              processed_at: r.processed_at || (/* @__PURE__ */ new Date()).toISOString()
            }).eq("id", r.id)).catch(() => {
            });
          }
        });
      }
    }
    return r;
  });
  let rows = normalizedRows;
  if (data.status === "processed") {
    rows = normalizedRows.filter((r) => isProc(r));
  } else if (data.status === "approved") {
    rows = normalizedRows.filter((r) => !isProc(r) && r.status === "approved");
  } else if (data.status !== "all") {
    rows = normalizedRows.filter((r) => !isProc(r) && r.status === data.status);
  }
  const filtered = data.search?.trim() ? rows.filter((r) => {
    const s = data.search.toLowerCase();
    return r.lead?.name?.toLowerCase().includes(s) || r.lead?.email?.toLowerCase().includes(s) || r.lead?.mobile?.includes(s) || r.application?.application_code?.toLowerCase().includes(s) || r.reason?.toLowerCase().includes(s);
  }) : rows;
  const finalRows = filtered;
  const appIds = Array.from(new Set(finalRows.map((r) => r.application_id).filter(Boolean)));
  const paymentMap = /* @__PURE__ */ new Map();
  if (appIds.length > 0) {
    const {
      data: pays
    } = await admin.from("payments").select("application_id, transaction_id, gateway_name, amount, status").in("application_id", appIds).order("created_at", {
      ascending: false
    });
    for (const p of pays ?? []) {
      if (p.application_id && !paymentMap.has(p.application_id) && Number(p.amount) > 0) {
        paymentMap.set(p.application_id, {
          transaction_id: p.transaction_id ?? null,
          gateway_name: p.gateway_name ?? null,
          amount: Number(p.amount) || 0
        });
      }
    }
  }
  const rowsWithPayment = finalRows.map((r) => ({
    ...r,
    payment: paymentMap.get(r.application_id) ?? null
  }));
  return {
    rows: rowsWithPayment
  };
});
const getRefundDetail_createServerFn_handler = createServerRpc({
  id: "d501189b91a655e5accd4a82330fd2abb54fd77e722bf3485295a47e0d83fcb6",
  name: "getRefundDetail",
  filename: "src/lib/crm/refunds-v2.functions.ts"
}, (opts) => getRefundDetail.__executeServer(opts));
const getRefundDetail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  id: string().uuid()
}).parse(raw)).handler(getRefundDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireStaff(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: req,
    error
  } = await admin.from("refund_requests").select("*, application:applications(id, application_code, order_status, fulfillment_status, service_id, customer_id, refund_processed_at, refund_gateway_ref), lead:leads(id, name, email, mobile, service, state, lead_code, base_amount, gst_amount, total_amount)").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!req) throw new Error("Refund request not found");
  const appId = req.application_id;
  const [{
    data: rawPayments
  }, {
    data: events
  }, {
    data: customer
  }] = await Promise.all([admin.from("payments").select("id, amount, currency, status, gateway_name, transaction_id, payment_date, parent_payment_id, refund_reason, created_at").eq("application_id", appId).order("created_at", {
    ascending: false
  }), admin.from("refund_request_events").select("id, action, note, meta, actor_id, actor_name, actor_role, created_at").eq("request_id", data.id).order("created_at", {
    ascending: true
  }), req.application?.customer_id ? admin.from("customers").select("id, name, primary_email, primary_mobile, state, customer_code").eq("id", req.application.customer_id).maybeSingle() : Promise.resolve({
    data: null
  })]);
  if (!req.processed_at && req.application?.refund_processed_at) {
    const pAt = req.application.refund_processed_at;
    req.processed_at = pAt;
    if (!req.gateway_ref && req.application.refund_gateway_ref) {
      req.gateway_ref = req.application.refund_gateway_ref;
    }
    admin.from("refund_requests").update({
      processed_at: pAt,
      gateway_ref: req.gateway_ref ?? req.application?.refund_gateway_ref
    }).eq("id", req.id).then(() => {
    });
  }
  const payments = rawPayments ?? [];
  const negPayments = payments.filter((p) => Number(p.amount) < 0);
  let cleanedPayments = payments;
  if (negPayments.length > 1) {
    const dupNegIds = negPayments.slice(1).map((p) => p.id);
    cleanedPayments = payments.filter((p) => !dupNegIds.includes(p.id));
    admin.from("payments").delete().in("id", dupNegIds).then(() => {
    });
  }
  return {
    request: req,
    payments: cleanedPayments,
    events: events ?? [],
    customer: customer ?? null
  };
});
export {
  getRefundDetail_createServerFn_handler,
  listRefundsAdvanced_createServerFn_handler,
  refundStats_createServerFn_handler
};
