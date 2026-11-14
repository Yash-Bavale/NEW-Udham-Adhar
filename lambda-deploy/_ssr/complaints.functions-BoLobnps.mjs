import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, _ as _enum } from "../_libs/zod.mjs";
const STATUSES = ["draft", "submitted", "under_review", "awaiting_response", "resolved", "closed"];
const SEVERITIES = ["low", "normal", "high", "critical"];
const listComplaints = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: string().optional(),
  severity: string().optional(),
  q: string().optional()
}).parse(i ?? {})).handler(createSsrRpc("ee0b99f0cd6aee6c8acafd75e2f0b846e20b65ffe89565fae23a4c00b4e0a2ad"));
const updateComplaintStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  id: string().uuid(),
  status: _enum(STATUSES)
}).parse(input)).handler(createSsrRpc("c8faf6de0d26f6e932e5f45a07d8b3405b13d396c42989ccd704ad9d7d26b8e3"));
const searchLeadsForComplaint = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  q: string().min(1)
}).parse(i)).handler(createSsrRpc("eb088c0811f59cb537b36938bdfe15b96f4d0b1786172c6df167dd012b85d8fe"));
const createComplaint = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  lead_id: string().uuid(),
  application_id: string().uuid().nullish(),
  category: string().max(120).optional(),
  severity: _enum(SEVERITIES).optional(),
  notes: string().max(4e3).optional(),
  description: string().max(5e3).optional(),
  authority_name: string().trim().min(1).max(200),
  authority_ref_number: string().trim().max(200).optional(),
  expected_update_at: string().optional(),
  // ISO from datetime-local
  assigned_to: string().uuid().nullish()
}).parse(i)).handler(createSsrRpc("642929bea5d8ba7673681487984eb825443eade0519e34411c565d5c367c12b2"));
const updateComplaint = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  patch: object({
    authority_name: string().trim().min(1).max(200).optional(),
    authority_ref_number: string().trim().max(200).nullable().optional(),
    description: string().max(5e3).nullable().optional(),
    expected_update_at: string().nullable().optional(),
    category: string().max(120).nullable().optional(),
    severity: _enum(SEVERITIES).optional(),
    assigned_to: string().uuid().nullable().optional()
  }).partial()
}).parse(i)).handler(createSsrRpc("b6fbaa242855e30e2931b57777521c23efc1a8ed0bc94660d6897fa79e12b029"));
const CONTACT_STATUSES = ["lead_created", "under_process", "contacted", "completed", "closed"];
const listContactSubmissions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: string().optional(),
  q: string().optional()
}).parse(i ?? {})).handler(createSsrRpc("e49d6cccb59b6129f16ebe939760c546674b34fbbf8964e9dd65c5e54fff7348"));
const updateContactSubmissionStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  status: _enum(CONTACT_STATUSES)
}).parse(i)).handler(createSsrRpc("4fd78f88e53af2297ce8fb3b5753a1052aee8ba8e773b3c44bb52f69de95df92"));
const updateContactSubmissionNotes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  notes: string().max(4e3)
}).parse(i)).handler(createSsrRpc("24e99414bd1f2312cffb4366cbe46f15efc024ed23ab187eb4a49be95dcaad50"));
const assignContactSubmission = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  assigned_to: string().uuid().nullable()
}).parse(i)).handler(createSsrRpc("703983634b55ac4878c583ee22531b2b05a62029ad23f1e08a6523e8316c27bb"));
const convertContactToComplaint = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  lead_id: string().uuid(),
  authority_name: string().trim().min(1).max(200),
  authority_ref_number: string().trim().max(200).optional(),
  description: string().max(5e3).optional(),
  severity: _enum(SEVERITIES).optional(),
  expected_update_at: string().optional(),
  assigned_to: string().uuid().nullish()
}).parse(i)).handler(createSsrRpc("29226e0ca201fc8c535f8edfb3c0258d7feb439dce88746471c1a6de172dfde4"));
export {
  listContactSubmissions as a,
  assignContactSubmission as b,
  createComplaint as c,
  updateContactSubmissionNotes as d,
  convertContactToComplaint as e,
  updateComplaint as f,
  updateComplaintStatus as g,
  listComplaints as l,
  searchLeadsForComplaint as s,
  updateContactSubmissionStatus as u
};
