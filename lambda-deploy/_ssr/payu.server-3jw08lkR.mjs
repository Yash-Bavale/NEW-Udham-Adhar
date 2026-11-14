import { createHash } from "crypto";
const PAYU_MODE = String(process.env.PAYU_MODE ?? "").trim().toLowerCase() === "live" ? "live" : "test";
const PAYU_BASE_URL = PAYU_MODE === "live" ? "https://secure.payu.in/_payment" : "https://test.payu.in/_payment";
const PAYU_POSTSERVICE_URL = PAYU_MODE === "live" ? "https://secure.payu.in/merchant/postservice?form=2" : "https://test.payu.in/merchant/postservice?form=2";
function getPayUCreds() {
  const key = process.env.PAYU_MERCHANT_KEY || process.env.PAYU_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT || process.env.PAYU_SALT;
  const merchantId = process.env.PAYU_MERCHANT_ID || process.env.MERCHANT_ID;
  if (!key || !salt) {
    throw new Error(
      "PayU is not configured. Set PAYU_MERCHANT_KEY/PAYU_KEY and PAYU_MERCHANT_SALT/PAYU_SALT."
    );
  }
  return { key, salt, merchantId };
}
async function verifyPayUPayment(txnid) {
  const { key, salt } = getPayUCreds();
  const command = "verify_payment";
  const hash = createHash("sha512").update(`${key}|${command}|${txnid}|${salt}`).digest("hex");
  const body = new URLSearchParams({ key, command, var1: txnid, hash });
  const response = await fetch(PAYU_POSTSERVICE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) {
    throw new Error(`PayU verification failed with HTTP ${response.status}`);
  }
  const payload = await response.json();
  const details = payload.transaction_details?.[txnid];
  return details && typeof details === "object" ? details : null;
}
function computeRequestHash(args) {
  const seq = [
    args.key,
    args.txnid,
    args.amount,
    args.productinfo,
    args.firstname,
    args.email,
    args.udf1 ?? "",
    args.udf2 ?? "",
    args.udf3 ?? "",
    args.udf4 ?? "",
    args.udf5 ?? "",
    "",
    // udf6
    "",
    // udf7
    "",
    // udf8
    "",
    // udf9
    "",
    // udf10
    args.salt
  ].join("|");
  return createHash("sha512").update(seq).digest("hex");
}
function computeResponseHash(args) {
  const base = [
    args.salt,
    args.status,
    "",
    "",
    "",
    "",
    "",
    // 5 empty fields (udf10..udf6)
    args.udf5 ?? "",
    args.udf4 ?? "",
    args.udf3 ?? "",
    args.udf2 ?? "",
    args.udf1 ?? "",
    args.email,
    args.firstname,
    args.productinfo,
    args.amount,
    args.txnid,
    args.key
  ].join("|");
  const prefixed = args.additionalCharges ? `${args.additionalCharges}|${base}` : base;
  return createHash("sha512").update(prefixed).digest("hex");
}
function buildTxnId(leadCode) {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${leadCode}-${ts}-${rnd}`.toUpperCase();
}
export {
  PAYU_BASE_URL,
  PAYU_MODE,
  buildTxnId,
  computeRequestHash,
  computeResponseHash,
  getPayUCreds,
  verifyPayUPayment
};
