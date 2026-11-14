import { createHmac } from "crypto";
const CASHFREE_API_VERSION = "2023-08-01";
async function createCashfreeOrder(params, creds) {
  const { clientId, clientSecret, apiUrl } = creds;
  const body = {
    order_id: params.orderId,
    order_amount: params.orderAmount,
    order_currency: params.orderCurrency || "INR",
    customer_details: {
      customer_id: params.customerId,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
      customer_name: params.customerName || params.customerEmail
    },
    order_meta: {
      return_url: params.returnUrl,
      ...params.notifyUrl ? { notify_url: params.notifyUrl } : {}
    }
  };
  const res = await fetch(`${apiUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": clientId,
      "x-client-secret": clientSecret
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[cashfree] createOrder failed", { status: res.status, body: text });
    throw new Error(`Cashfree order creation failed (HTTP ${res.status}): ${text}`);
  }
  return await res.json();
}
async function getOrderStatus(orderId, creds) {
  const { clientId, clientSecret, apiUrl } = creds;
  const res = await fetch(`${apiUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-version": CASHFREE_API_VERSION,
      "x-client-id": clientId,
      "x-client-secret": clientSecret
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cashfree order status check failed (HTTP ${res.status}): ${text}`);
  }
  return await res.json();
}
async function verifyWebhookSignature(timestamp, rawBody, receivedSignature, clientSecret) {
  const data = timestamp + rawBody;
  const computed = createHmac("sha256", clientSecret).update(data).digest("base64");
  return computed === receivedSignature;
}
function buildCashfreeOrderId(leadCode) {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 8);
  return `CF-${leadCode}-${ts}-${rnd}`.toUpperCase();
}
export {
  buildCashfreeOrderId,
  createCashfreeOrder,
  getOrderStatus,
  verifyWebhookSignature
};
