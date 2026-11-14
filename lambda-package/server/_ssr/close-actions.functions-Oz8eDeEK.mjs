import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { s as string, o as object, _ as _enum } from "../_libs/zod.mjs";
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
const OrderId = string().uuid();
const closeOrderSystem_createServerFn_handler = createServerRpc({
  id: "975937810f01a96133e4199fe30d0693dab6d027c1fde165320e566a19e2c75d",
  name: "closeOrderSystem",
  filename: "src/lib/orders/actions/close-actions.functions.ts"
}, (opts) => closeOrderSystem.__executeServer(opts));
const closeOrderSystem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable(),
  source: _enum(["timer", "ticket", "cron", "govt_rejection", "manual_override"])
}).parse(raw)).handler(closeOrderSystem_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: updated,
    error
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: "CLOSED",
    _reason_id: data.reasonId,
    _remarks: data.remarks ?? `system_close:${data.source}`,
    _force: true
  });
  if (error) throw new Error(error.message);
  const [{
    cancelTimers
  }, {
    cancelAllForOrder
  }] = await Promise.all([import("./timers.server-BikGPSRc.mjs"), import("./schedulers.server-BPR-45Y2.mjs")]);
  await cancelTimers(data.orderId);
  await cancelAllForOrder(data.orderId, `system_close:${data.source}`);
  const {
    supabaseAdmin: adminForClose
  } = await import("./client.server-3kDCe7R3.mjs");
  await adminForClose.from("applications").update({
    fulfillment_status: "order_closed"
  }).eq("id", data.orderId);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: ctx
  } = await supabaseAdmin.from("applications").select("application_code, lead_id, closure_reason_id, active_reason_id, closure_remarks, customers(primary_email, name), order_close_reasons:closure_reason_id(label, standard_reply), delay_reasons:active_reason_id(label)").eq("id", data.orderId).maybeSingle();
  const email = ctx?.customers?.primary_email;
  const reasonLabel = ctx?.order_close_reasons?.label || ctx?.delay_reasons?.label || ctx?.closure_remarks || null;
  let e010Ok = false;
  let e010Err = null;
  if (email) {
    try {
      const [{
        enqueueFromTemplateInternal
      }, {
        BHS_EMAILS
      }] = await Promise.all([import("./emails.server-BTJhg2a3.mjs"), import("./bhs-templates-Gd1TLGXv.mjs")]);
      await enqueueFromTemplateInternal(BHS_EMAILS.E010_ORDER_CLOSED, email, {
        customerName: ctx?.customers?.name || "Customer",
        customer_name: ctx?.customers?.name || "Customer",
        orderNumber: ctx?.application_code || data.orderId.slice(0, 8),
        order_number: ctx?.application_code || data.orderId.slice(0, 8),
        reason: reasonLabel || data.remarks || "Order closed per selected reason",
        closure_reason: reasonLabel || data.remarks || "Order closed per selected reason",
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
      }, {
        applicationId: data.orderId,
        leadId: ctx?.lead_id ?? void 0,
        trigger: "manual"
      });
      e010Ok = true;
    } catch (e) {
      e010Err = e?.message ?? String(e);
      console.error("[closeOrderSystem] E010 enqueue failed", e);
    }
  } else {
    e010Err = "no_customer_email";
  }
  try {
    await supabaseAdmin.from("application_events").insert({
      application_id: data.orderId,
      lead_id: ctx?.lead_id ?? null,
      event_type: "system_close",
      new_value: "CLOSED",
      note: `source=${data.source}; e010=${e010Ok ? "queued" : `failed:${e010Err}`}`,
      staff_name: "System",
      staff_role: "system"
    });
  } catch (e) {
    console.error("[closeOrderSystem] audit insert failed", e);
  }
  return {
    ok: true,
    order: updated,
    source: data.source,
    e010Queued: e010Ok,
    e010Error: e010Err
  };
});
const handleGovtRejected_createServerFn_handler = createServerRpc({
  id: "60e9eb2914cc6c98a5084e5fee2694116cae17bdf415eb27866fc316dbaba4d7",
  name: "handleGovtRejected",
  filename: "src/lib/orders/actions/close-actions.functions.ts"
}, (opts) => handleGovtRejected.__executeServer(opts));
const handleGovtRejected = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable()
}).parse(raw)).handler(handleGovtRejected_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: updated,
    error
  } = await context.supabase.rpc("transition_order_status", {
    _order_id: data.orderId,
    _new_status: "CLOSED",
    _reason_id: data.reasonId,
    _remarks: data.remarks ?? "Government rejected the application",
    _force: true
  });
  if (error) throw new Error(error.message);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  await supabaseAdmin.from("applications").update({
    fulfillment_status: "application_rejected"
  }).eq("id", data.orderId);
  const [{
    cancelTimers
  }, {
    cancelAllForOrder
  }] = await Promise.all([import("./timers.server-BikGPSRc.mjs"), import("./schedulers.server-BPR-45Y2.mjs")]);
  await cancelTimers(data.orderId);
  await cancelAllForOrder(data.orderId, "govt_rejection");
  await supabaseAdmin.from("applications").update({
    fulfillment_status: "order_closed"
  }).eq("id", data.orderId);
  return {
    ok: true,
    order: updated,
    source: "govt_rejection"
  };
});
export {
  closeOrderSystem_createServerFn_handler,
  handleGovtRejected_createServerFn_handler
};
