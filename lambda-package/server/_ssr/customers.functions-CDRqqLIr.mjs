import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
const listCustomers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("0449bfb26b1a47bae455379cd53cf8331b3c15b2dc3b74403b76af38a3de1456"));
const getCustomer360 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("c9fab14567506a7602dfc4ad844cc8e1ba5d4424f30f786b5fccc796c0efb1da"));
const addCustomerNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("4dbb6757d30f46ffef629a42eb01e0bcafed15825ca07dc9082df129169c4574"));
const updateCustomer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("19a4b5be0f82bd385f2d800a56e99a1945eac997fae13f8c8aac4e6d54847130"));
const uploadCustomerKyc = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("d933b30de9c7f68233a221e99d85a647716654f80f7b1722eb1c42cb6be7668a"));
const getCustomerKycSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("1af26807d563a4183803fc1099c32dbae5a1b568f7c20b4b17a573c925abf22f"));
const getRepeatPurchaseMetrics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("973d466e32de56f2346284c571c6322fce00b1af7acf9e20a21a2ed0f56e9bc5"));
export {
  getCustomer360 as a,
  addCustomerNote as b,
  uploadCustomerKyc as c,
  getCustomerKycSignedUrl as d,
  getRepeatPurchaseMetrics as g,
  listCustomers as l,
  updateCustomer as u
};
