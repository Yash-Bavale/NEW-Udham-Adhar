import { createDecipheriv, randomUUID, createCipheriv, createHash } from "crypto";
function ccavEnv() {
  const v = (process.env.CCAV_ENV ?? "live").trim().toLowerCase();
  return v === "test" ? "test" : "live";
}
const CCAV_REDIRECT_URL = ccavEnv() === "test" ? "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction" : "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
const CCAV_API_URL = ccavEnv() === "test" ? "https://apitest.ccavenue.com/apis/servlet/DoWebTrans" : "https://api.ccavenue.com/apis/servlet/DoWebTrans";
const CCAV_IV = Buffer.from([
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15
]);
function getCcavCreds() {
  const merchantId = (process.env.CCAV_MERCHANT_ID ?? "").trim();
  const accessCode = (process.env.CCAV_ACCESS_CODE ?? "").trim();
  const workingKey = (process.env.CCAV_WORKING_KEY ?? "").trim();
  if (!merchantId || !accessCode || !workingKey) {
    throw new Error(
      "CCAvenue is not configured. Set CCAV_MERCHANT_ID, CCAV_ACCESS_CODE and CCAV_WORKING_KEY (no surrounding whitespace)."
    );
  }
  return { merchantId, accessCode, workingKey };
}
function deriveKey(workingKey) {
  return createHash("md5").update(workingKey).digest();
}
function encryptRequest(plaintext, workingKey) {
  const cipher = createCipheriv("aes-128-cbc", deriveKey(workingKey), CCAV_IV);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return enc.toString("hex");
}
function decryptResponse(cipherHex, workingKey) {
  const decipher = createDecipheriv("aes-128-cbc", deriveKey(workingKey), CCAV_IV);
  const dec = Buffer.concat([
    decipher.update(Buffer.from(cipherHex, "hex")),
    decipher.final()
  ]);
  return dec.toString("utf8");
}
function parseCcavPayload(payload) {
  const out = {};
  for (const pair of payload.split("&")) {
    if (!pair) continue;
    const idx = pair.indexOf("=");
    if (idx < 0) {
      out[decodeURIComponent(pair)] = "";
      continue;
    }
    const k = decodeURIComponent(pair.slice(0, idx));
    const v = decodeURIComponent(pair.slice(idx + 1));
    out[k] = v;
  }
  return out;
}
function buildCcavPayload(params) {
  return Object.entries(params).filter(([, v]) => v !== void 0 && v !== null && v !== "").map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
}
function buildCcavOrderId(leadCode) {
  const ts = Date.now().toString(36);
  const rnd = randomUUID().slice(0, 6);
  return `CCAV-${leadCode}-${ts}-${rnd}`.toUpperCase().slice(0, 50);
}
function normalizeCcavStatus(raw) {
  const v = String(raw ?? "").trim().toLowerCase();
  if (v === "success" || v === "successful" || v === "shipped") return "paid";
  if (v === "refunded") return "refunded";
  if (v === "aborted" || v === "failure" || v === "failed" || v === "invalid" || v === "auto-cancelled" || v === "timeout" || v === "cancelled") {
    return "failed";
  }
  if (v === "awaited" || v === "initiated" || v === "pending") return "attempted";
  return "created";
}
async function callDoWebTrans({ command, payload }) {
  const { accessCode, workingKey } = getCcavCreds();
  const enc = encryptRequest(JSON.stringify(payload), workingKey);
  const body = new URLSearchParams({
    enc_request: enc,
    access_code: accessCode,
    command,
    request_type: "JSON",
    response_type: "JSON",
    version: "1.2"
  });
  const res = await fetch(CCAV_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const text = await res.text();
  const outer = parseCcavPayload(text);
  const encResponse = (outer.enc_response || outer.encResponse || "").trim();
  if (!encResponse) {
    return { ok: false, status: res.status, body: outer, raw: text };
  }
  if (!/^[0-9a-fA-F]+$/.test(encResponse) || encResponse.length % 32 !== 0) {
    return {
      ok: false,
      status: res.status,
      body: {
        error_code: outer.enc_error_code || "api_error",
        error_desc: encResponse
      },
      raw: text
    };
  }
  let decrypted;
  try {
    decrypted = decryptResponse(encResponse, workingKey);
  } catch {
    return {
      ok: false,
      status: res.status,
      body: { error_code: "decrypt_failed", error_desc: "Could not decrypt the CCAvenue response (working key mismatch)." },
      raw: text
    };
  }
  let inner = {};
  try {
    const obj = JSON.parse(decrypted);
    inner = flattenJsonResult(obj);
  } catch {
    inner = parseCcavPayload(decrypted);
  }
  return { ok: res.ok, status: res.status, body: inner, raw: decrypted };
}
function flattenJsonResult(obj) {
  if (!obj || typeof obj !== "object") return {};
  const out = {};
  const walk = (v) => {
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v)) {
        if (val && typeof val === "object") walk(val);
        else if (val !== void 0 && val !== null) out[k] = String(val);
      }
    }
  };
  walk(obj);
  return out;
}
async function callOrderStatusApi(orderNo) {
  const result = await callDoWebTrans({
    command: "orderStatusTracker",
    payload: { order_no: orderNo }
  });
  const r = result.body;
  const orderStatus = r.error_code ? "" : r.order_status || r.Order_Status || "";
  return {
    status: normalizeCcavStatus(orderStatus),
    orderNo: r.order_no || r.order_id || orderNo,
    amount: r.order_amt || r.amount || null,
    trackingId: r.reference_no || r.tracking_id || null,
    bankRefNo: r.order_bank_ref_no || r.bank_ref_no || null,
    raw: r
  };
}
async function callRefundApi(args) {
  const result = await callDoWebTrans({
    command: "refundOrder",
    payload: {
      reference_no: args.refNo,
      refund_amount: args.refundAmount.toFixed(2),
      refund_ref_no: args.refundRef
    }
  });
  const r = result.body;
  if (r.error_code) {
    return {
      ok: false,
      refundStatus: r.error_code,
      refundRef: args.refundRef,
      reason: r.error_desc || null,
      raw: r
    };
  }
  const refundStatus = r.refund_status || r.RefundStatus || "";
  const ok = refundStatus === "0" || refundStatus.toLowerCase() === "success";
  return {
    ok,
    refundStatus,
    refundRef: r.reference_no || args.refundRef || null,
    reason: r.reason || r.error_desc || r.reason_desc || null,
    raw: r
  };
}
export {
  CCAV_API_URL,
  CCAV_REDIRECT_URL,
  buildCcavOrderId,
  buildCcavPayload,
  callOrderStatusApi,
  callRefundApi,
  decryptResponse,
  encryptRequest,
  getCcavCreds,
  normalizeCcavStatus,
  parseCcavPayload
};
