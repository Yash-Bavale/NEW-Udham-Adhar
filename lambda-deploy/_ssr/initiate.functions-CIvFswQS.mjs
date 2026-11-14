import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn, g as getRequest } from "./server-BFjd5iLF.mjs";
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
const Input = object({
  leadCode: string().trim().min(3).max(80),
  gatewayCode: string().trim().min(2).max(40).optional(),
  accessToken: string().trim().min(10).max(200),
  returnOrigin: string().trim().max(200).optional()
});
const initiatePayment_createServerFn_handler = createServerRpc({
  id: "131c74d9038cd8c20abaa9935ed6cb336533d516eb0b64c9a26b40d972195500",
  name: "initiatePayment",
  filename: "src/lib/payments/initiate.functions.ts"
}, (opts) => initiatePayment.__executeServer(opts));
const initiatePayment = createServerFn({
  method: "POST"
}).inputValidator((i) => Input.parse(i)).handler(initiatePayment_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const access = await import("./customer-access.server-C_oBiISE.mjs");
  const leadId = await access.leadIdByCode(data.leadCode);
  await access.assertCustomerAccess(data.accessToken, leadId, "payment", data.leadCode);
  const returnNonce = access.newReturnNonce();
  const remember = async (order) => {
    const request = getRequest();
    const requestOrigin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const browserOrigin = requestOrigin ?? (referer ? new URL(referer).origin : null);
    const normalizedOrigin = access.normalizeReturnOrigin(data.returnOrigin ?? browserOrigin);
    console.log("[payment-return-debug]", {
      receivedOrigin: data.returnOrigin ?? null,
      requestOrigin,
      normalizedOrigin
    });
    await access.saveReturnContext(order.paymentId, normalizedOrigin, returnNonce);
    return order;
  };
  let chosen = (data.gatewayCode?.toLowerCase() ?? "").trim();
  if (!chosen) {
    const {
      data: gws
    } = await supabaseAdmin.from("payment_gateways").select("name, config").eq("is_enabled", true).order("priority", {
      ascending: true
    });
    const {
      data: lw
    } = await supabaseAdmin.from("leads").select("website_id").eq("lead_code", data.leadCode).maybeSingle();
    const {
      applyWebsiteGateways
    } = await import("./website-gateways-jUN09uZm.mjs");
    const {
      websiteGatewayRules
    } = await import("./website-gateways.server-BkGrEQ88.mjs");
    const site = applyWebsiteGateways((gws ?? []).map((g) => ({
      name: String(g.name),
      isDefault: Boolean(g.config?.is_default)
    })), await websiteGatewayRules(lw?.website_id));
    const gw = site.find((g) => g.isDefault) ?? null;
    if (!gw?.name) {
      throw new Error("No active payment gateway is currently enabled. Please contact support.");
    }
    chosen = gw.name.toLowerCase();
  }
  if (chosen.includes("cashfree")) chosen = "cashfree";
  else if (chosen.includes("payu")) chosen = "payu";
  else if (chosen.includes("ccavenue")) chosen = "ccavenue";
  switch (chosen) {
    case "payu": {
      const {
        buildPayUOrder
      } = await import("./payu-order.server-B8pgZD7o.mjs");
      const order = await remember(await buildPayUOrder(data.leadCode, returnNonce));
      return {
        ...order,
        gateway: "payu"
      };
    }
    case "ccavenue": {
      const {
        buildCcavenueOrderForLead
      } = await import("./ccavenue-order.server-ChP8K_DF.mjs");
      const order = await remember(await buildCcavenueOrderForLead(data.leadCode, returnNonce));
      return {
        ...order,
        gateway: "ccavenue"
      };
    }
    case "cashfree": {
      const {
        buildCashfreeOrder
      } = await import("./cashfree-order.server-CW9tOEeO.mjs");
      const order = await remember(await buildCashfreeOrder(data.leadCode, returnNonce));
      return {
        ...order,
        gateway: "cashfree"
      };
    }
    case "razorpay":
      throw new Error(`${chosen} is not enabled yet. Please choose another option.`);
    default:
      throw new Error(`Unknown payment gateway: ${chosen}`);
  }
});
export {
  initiatePayment_createServerFn_handler
};
