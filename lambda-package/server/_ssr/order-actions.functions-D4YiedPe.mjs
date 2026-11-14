import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, b as boolean, n as number, _ as _enum } from "../_libs/zod.mjs";
const CustomerSideDelayInput = object({
  orderId: string().uuid(),
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => CustomerSideDelayInput.parse(raw)).handler(createSsrRpc("07800048615b4c2dc10f3fe3036dc9d1578b6dbd4c118c4545416566ee253bcd"));
const OurSideDelayInput = object({
  orderId: string().uuid(),
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable(),
  /** grace = 30-min business-time hold before auto reminders kick in.
   *  auto  = start recurring 2h business-time reminders immediately.
   *  manual = one-shot reminder at explicit remindAt.
   *  stop  = transition without arming any reminder (reason is enough). */
  mode: _enum(["grace", "auto", "manual", "stop"]),
  intervalSeconds: number().int().min(300).max(24 * 3600).optional(),
  remindAt: string().datetime().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => OurSideDelayInput.parse(raw)).handler(createSsrRpc("6856102e0cdebdaf7c6d82d3c0c7ef3db14d91f9aeabfc566a9ed0c9fcf09a36"));
const sendFormLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  transitionToWaiting: boolean().default(true)
}).parse(raw)).handler(createSsrRpc("adeb0e75e2ef29d9fd0c6ea3392660738a76f4c62f1c33743613ae2a4c56f88e"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(createSsrRpc("e814f27c2f587f64a006887db25e32b44faf994b1cb78c96e73fb0bdd5aadcd3"));
const markSubmittedToGovt = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  referenceNumber: string().max(200).optional()
}).parse(raw)).handler(createSsrRpc("3c55940c2d822478489139398ea01d186066bb1577cae00aeb562c8769b4ec09"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(createSsrRpc("256ec20717c47cce284f7bea750973905a22d938ccd893a54ebab751e4c8b31a"));
const completeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(createSsrRpc("11a4cf2d7dd09379fc3c4cf0418cebbffa4d1e434a7d87c6f59cb6f171798f87"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  reason: string().min(3).max(2e3),
  amount: number().positive().optional(),
  mode: _enum(["full", "partial"]).optional(),
  customerNotes: string().max(2e3).optional()
}).parse(raw)).handler(createSsrRpc("df1ae59a7f5f018a0d24113ba519afd977688e1adc326b5e857389147a0659b4"));
const approveRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  amount: number().positive(),
  adminNotes: string().max(2e3).optional(),
  mode: _enum(["full", "partial"]).optional(),
  deductionAmount: number().min(0).optional(),
  deductionReason: string().max(500).optional()
}).parse(raw)).handler(createSsrRpc("126d554582061618a151b6471904d5d4a0e1ed0e3984301ded150dfdf9d60839"));
const rejectRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  reason: string().min(3).max(2e3)
}).parse(raw)).handler(createSsrRpc("16d4fe804ed5561f8208f71be62439795719e825860cb75ffb9b264fe9e3adf9"));
const requestRefundInfo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().min(3).max(2e3)
}).parse(raw)).handler(createSsrRpc("0ea4d2f5d1847b7c19d9f613329eefc7b1d8f365f011e56d59ec16a1b6864bf2"));
const escalateRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().min(3).max(2e3)
}).parse(raw)).handler(createSsrRpc("69ba3d5a14057fbaf9a778837d2272b001100ec37cfca9382e6510939e6560e6"));
const addRefundNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().min(1).max(2e3)
}).parse(raw)).handler(createSsrRpc("ee90d54753a68e9dab9aec7563aaa41c56a07b11ddee544ba0d078cf03647f3b"));
const markRefundProcessed = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  amount: number().positive(),
  paymentReference: string().min(1).max(200),
  gatewayName: string().max(60).optional(),
  processedOn: string().datetime().optional()
}).parse(raw)).handler(createSsrRpc("bfaf7c929d50cc138682db317bd483e72b3fbc215672095cd58346801bba44ea"));
const reopenOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  remarks: string().max(2e3).optional()
}).parse(raw)).handler(createSsrRpc("139cfe50af2c54ecfb9839c55ae9ccf4c83c6228ef78b8acd6e2f1027946564a"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  reasonId: string().uuid().optional(),
  remarks: string().max(2e3).optional()
}).parse(raw)).handler(createSsrRpc("689fb74e74add6e8405035f16e80a0ec153925c679935db680207f704a42a466"));
const sendManualReminder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid(),
  note: string().max(1e3).optional()
}).parse(raw)).handler(createSsrRpc("0a0717370d67ad8f065badb00209f693544d7eb79c1282b2a800d01bc0a0c8b1"));
export {
  approveRefund as a,
  requestRefundInfo as b,
  addRefundNote as c,
  markSubmittedToGovt as d,
  escalateRefund as e,
  completeOrder as f,
  reopenOrder as g,
  sendManualReminder as h,
  markRefundProcessed as m,
  rejectRefund as r,
  sendFormLink as s
};
