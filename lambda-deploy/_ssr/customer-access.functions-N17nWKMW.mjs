import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, _ as _enum, s as string } from "../_libs/zod.mjs";
const LeadCode = string().trim().toUpperCase().regex(/^[A-Z]{2}-\d{4}-\d{6}$/);
const Token = string().trim().min(10).max(200);
const exchangeOnboardingAccess = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: Token
}).parse(i)).handler(createSsrRpc("d54ef0f0e4687d54c02c473e13f6542597498ab4d8b31291a14528e244a2f5e2"));
const requestSecureLink = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode
}).parse(i)).handler(createSsrRpc("754f2710651260d2a82cef9ed6f1c31422f8ace7219c9db18a4deabe9123f90f"));
const mintCustomerLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadCode: LeadCode,
  kind: _enum(["form", "payment"])
}).parse(i)).handler(createSsrRpc("3063b58e23c647fd924a0b6676e3a6fb6bdbdc0551609db8c5956f6d1fea9c4e"));
const PublicRef = string().trim().regex(/^[a-f0-9]{32}$/);
const resolveCustomerRef = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  ref: PublicRef
}).parse(i)).handler(createSsrRpc("0bd3c60ff2a62bf1963a67ffde69faa8db38b6ab96bfa4863a6e484040278c0a"));
const customerRefForCode = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: Token
}).parse(i)).handler(createSsrRpc("4aaae77f6d8f19038eea24f6f8dbc0919e4f556dc021105b54d7a4bddcf2b735"));
export {
  requestSecureLink as a,
  customerRefForCode as c,
  exchangeOnboardingAccess as e,
  mintCustomerLink as m,
  resolveCustomerRef as r
};
