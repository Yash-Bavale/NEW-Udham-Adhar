// PayU helpers — server-only.
// PayU Standard / Web SDK: HTML form post to /_payment with sha512 hash.
// Test URL: https://test.payu.in/_payment
// Live URL: https://secure.payu.in/_payment
import { createHash } from "crypto";

export const PAYU_MODE: "test" | "live" =
  (process.env.PAYU_MODE as "test" | "live") || "live";


export const PAYU_BASE_URL =
  PAYU_MODE === "live"
    ? "https://secure.payu.in/_payment"
    : "https://test.payu.in/_payment";

export function getPayUCreds() {
  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;
  if (!key || !salt) {
    throw new Error(
      "PayU is not configured. Set PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT.",
    );
  }
  return { key, salt };
}

// Outgoing hash (request to PayU):
// sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
export function computeRequestHash(args: {
  key: string;
  txnid: string;
  amount: string; // string with 2 decimals
  productinfo: string;
  firstname: string;
  email: string;
  salt: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
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
    "", // udf6
    "", // udf7
    "", // udf8
    "", // udf9
    "", // udf10
    args.salt,
  ].join("|");
  return createHash("sha512").update(seq).digest("hex");
}

// Incoming hash (webhook / return from PayU):
// sha512(salt|status|||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
export function computeResponseHash(args: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  status: string;
  salt: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}): string {
  const base = [
    args.salt,
    args.status,
    "", "", "", "", "", "", // 6 empty (udf10..udf6)
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
    args.key,
  ].join("|");
  const prefixed = args.additionalCharges
    ? `${args.additionalCharges}|${base}`
    : base;
  return createHash("sha512").update(prefixed).digest("hex");
}

export function buildTxnId(leadCode: string): string {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${leadCode}-${ts}-${rnd}`.toUpperCase();
}
