import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, b as boolean, n as number, _ as _enum } from "../_libs/zod.mjs";
const Input = object({
  leadCode: string().trim().min(3).max(80),
  accessToken: string().trim().min(10).max(200)
});
const getApplicationSummary = createServerFn({
  method: "POST"
}).inputValidator((i) => Input.parse(i)).handler(createSsrRpc("d2d1919a68fd9d08baebe96c655a187f25a4bcfd40745577844c3a2180b40dae"));
const UpdateContact = object({
  leadCode: string().trim().min(3).max(80),
  accessToken: string().trim().min(10).max(200),
  name: string().trim().min(2).max(120),
  email: string().trim().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  currentEmail: string().trim().email().max(160).optional(),
  currentMobile: string().trim().regex(/^[6-9]\d{9}$/).optional()
}).refine((v) => v.currentEmail || v.currentMobile, {
  message: "currentEmail or currentMobile is required to prove ownership"
});
const updateLeadContact = createServerFn({
  method: "POST"
}).inputValidator((i) => UpdateContact.parse(i)).handler(createSsrRpc("b0ae9c064171c2de5f323c1dfda080c3a203e50f5491efcb7f3b2123728dcc35"));
const listGateways = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4e8e88977ddb97dd593ce7f551542820185b53a6b656830f0a87bf718d37fd87"));
const GatewayUpdate = object({
  id: string().uuid(),
  display_name: string().trim().min(1).optional(),
  is_enabled: boolean().optional(),
  priority: number().int().min(0).max(999).optional(),
  logo_url: string().trim().nullable().optional(),
  is_default: boolean().optional(),
  description: string().trim().nullable().optional()
});
const updateGateway = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => GatewayUpdate.parse(i)).handler(createSsrRpc("ad8f7485f17d344a376154f86c82b33b021de429a28d9353abafaa3e17ebf4b2"));
const LogoUploadSchema = object({
  id: string().uuid(),
  fileBase64: string(),
  fileName: string(),
  mimeType: string()
});
const uploadGatewayLogo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LogoUploadSchema.parse(i)).handler(createSsrRpc("c928c74a3ac6888dbaad8614a5b11b51d00f78d0123cade2a5cbac362869074e"));
const checkCcavenueCredentials = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("60c340c86c87ebf31fbc35a80bee87cc159a655b56904f51965efc12b82223f0"));
const listWebsiteGateways = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d1653e71979212c9a27274cd6c5362e87e89dbbbb46fb5b675d66858ad2d19bd"));
const WebsiteGatewayInput = object({
  websiteId: string().uuid(),
  gateway: _enum(["cashfree", "payu", "ccavenue"]),
  isEnabled: boolean(),
  isDefault: boolean()
});
const setWebsiteGateway = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WebsiteGatewayInput.parse(i)).handler(createSsrRpc("299b87b386cf821c9d2175b3ee03f20b9d19efc7459ff8588feee4bd5640c943"));
const setWebsitePaymentsEnabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  websiteId: string().uuid(),
  enabled: boolean()
}).parse(i)).handler(createSsrRpc("68a0749206bdc320b8012142b4adc5cca47557871e787824af8cc7ed62b7e3a1"));
const listCashfreeAccounts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("93370f49b87a0612ddb801b4160c30de41ab3f1a7d58f67f8e127bb88e5fca12"));
const SaveAccountInput = object({
  accountId: string().uuid().optional(),
  label: string().trim().min(2).max(80),
  accountKey: string().trim().toUpperCase().regex(/^[A-Z][A-Z0-9_]{1,30}$/, "Use letters, numbers and _ only").optional(),
  clientId: string().trim().min(4).max(200),
  clientSecret: string().trim().min(8).max(500),
  mode: _enum(["production", "sandbox"])
});
const saveCashfreeAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SaveAccountInput.parse(i)).handler(createSsrRpc("9c4111329a69a79f89481e64f3feff498d735bcde7c8e2f6c75460ddbb31aa1d"));
const setCashfreeAccountActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  accountId: string().uuid(),
  isActive: boolean()
}).parse(i)).handler(createSsrRpc("334d63f0b24a687445ce01e9d9cfdd0f73f178d19cd91a7b9208f4557bca986b"));
const setWebsiteCashfreeAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  websiteId: string().uuid(),
  accountId: string().uuid()
}).parse(i)).handler(createSsrRpc("62922bda681f7d917a254c37aca9a817debd776b1f6de58692e0b9674d974332"));
export {
  uploadGatewayLogo as a,
  listCashfreeAccounts as b,
  checkCcavenueCredentials as c,
  setCashfreeAccountActive as d,
  listWebsiteGateways as e,
  setWebsiteGateway as f,
  setWebsiteCashfreeAccount as g,
  setWebsitePaymentsEnabled as h,
  getApplicationSummary as i,
  updateLeadContact as j,
  listGateways as l,
  saveCashfreeAccount as s,
  updateGateway as u
};
