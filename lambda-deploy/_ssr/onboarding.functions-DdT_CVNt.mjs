import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { MAX_DOC_SIZE_BYTES } from "./schemas-DClqju6h.mjs";
import { o as object, s as string, b as boolean, r as record, u as union, n as number, e as _null, _ as _enum } from "../_libs/zod.mjs";
const LeadCode = string().trim().regex(/^[A-Z]{2}-\d{4}-\d{6}$/, "Invalid reference code");
const AccessToken = string().trim().min(10).max(200);
const getOnboarding = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: AccessToken
}).parse(i)).handler(createSsrRpc("568493b198ca8dd94c8a85f18f0b6657e4d71573f746ad9e06c79e0141f2af24"));
const SubmitInput = object({
  leadCode: LeadCode,
  accessToken: AccessToken,
  // List-type answers (NIC activities, plants, bank details) are JSON strings and can be long.
  data: record(string().min(1).max(80), union([string().max(5e4), number(), boolean(), _null()])),
  draft: boolean().optional()
});
const submitOnboarding = createServerFn({
  method: "POST"
}).inputValidator((i) => SubmitInput.parse(i)).handler(createSsrRpc("f2d2eb1a7cb2aa66e8afaefccd6dc38f0e92285810d24be34d15d9b64a767868"));
const UploadReqInput = object({
  leadCode: LeadCode,
  accessToken: AccessToken,
  docType: string().trim().min(1).max(60),
  fileName: string().trim().min(1).max(200),
  mimeType: string().trim().min(1).max(120),
  sizeBytes: number().int().min(1).max(MAX_DOC_SIZE_BYTES, `File too large. Max ${Math.round(MAX_DOC_SIZE_BYTES / 1024 / 1024)} MB.`)
});
const requestDocumentUpload = createServerFn({
  method: "POST"
}).inputValidator((i) => UploadReqInput.parse(i)).handler(createSsrRpc("d26efa7f1fc95b3400ac689b8f615e6a9023db787c42ac54b1e7249313b818fe"));
const ConfirmInput = object({
  leadCode: LeadCode,
  accessToken: AccessToken,
  docType: string().min(1).max(60),
  filePath: string().min(1).max(400),
  fileName: string().min(1).max(200),
  mimeType: string().min(1).max(120),
  sizeBytes: number().int().min(1).max(MAX_DOC_SIZE_BYTES)
});
const confirmDocumentUpload = createServerFn({
  method: "POST"
}).inputValidator((i) => ConfirmInput.parse(i)).handler(createSsrRpc("c64910ba5499b5d1e99d9126def59689b440e0a506943d28e49aeaabdedcf19c"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("aa709b406f4abd9550489179d2acbd69d4be33753e2e8ca268cfe4d048706eea"));
const getDocumentSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("b53554934776d755cb0399c3fcf53ff1fe00a59ace30c4a5174f1b5042a5cd0d"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  status: _enum(["pending", "approved", "rejected"]),
  remarks: string().max(500).optional().nullable()
}).parse(i)).handler(createSsrRpc("a85b06c6d418e4161ea026be601679e2eeed25ac21afbdd8f6e2f291e5f4f3d5"));
const requestFormHelp = createServerFn({
  method: "POST"
}).inputValidator((i) => object({
  leadCode: LeadCode,
  accessToken: AccessToken
}).parse(i)).handler(createSsrRpc("12ffab2d72b91e45d5a5887365c611c85db07c831a9b11477bc1712424abfed7"));
export {
  getOnboarding as a,
  requestDocumentUpload as b,
  confirmDocumentUpload as c,
  getDocumentSignedUrl as g,
  requestFormHelp as r,
  submitOnboarding as s
};
