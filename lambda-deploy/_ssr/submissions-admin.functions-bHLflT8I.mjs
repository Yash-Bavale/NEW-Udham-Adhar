import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, n as number, s as string, _ as _enum } from "../_libs/zod.mjs";
const listSubmissions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: string().max(40).optional(),
  service_code: string().max(80).optional(),
  search: string().max(120).optional(),
  limit: number().int().min(1).max(200).default(100)
}).parse(i ?? {})).handler(createSsrRpc("9b8bd700c57751d04c989cb03c005aea4af7f1d9edddc32ee9b8f2097ff5f7d1"));
const getSubmission = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("f0b8bb7969191da953cca0c54fd3d7059ede7bd771b7663867bb3c46f168afd3"));
const updateSubmissionStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  status: _enum(["draft", "submitted", "approved", "rejected", "needs_changes"]),
  notes: string().max(2e3).optional()
}).parse(i)).handler(createSsrRpc("7f703a537117361002261c33441590d2150b449abfa8ae2f1906aae23d4ed18a"));
const getFormSubmissionForApplication = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(createSsrRpc("6d7d13cbe721fc08caba335a5171fce85df5d53a68cee07f3f18ea3a41b62ec6"));
const getFormSubmissionForLead = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("2e8ae0fe00588510f9813504109fd48e2234cfbfb13c8a784e04499332903297"));
const resendFormLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("4ec1a89ebe00abe521f11103e8b3ac8d29872581b44dfae40f2d065556a537f4"));
export {
  getFormSubmissionForApplication as a,
  getSubmission as b,
  getFormSubmissionForLead as g,
  listSubmissions as l,
  resendFormLink as r,
  updateSubmissionStatus as u
};
