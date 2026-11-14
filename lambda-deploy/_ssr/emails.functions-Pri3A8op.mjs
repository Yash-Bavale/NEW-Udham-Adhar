import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { o as object, s as string, b as boolean, _ as _enum, n as number, a as array } from "../_libs/zod.mjs";
const getEmailDashboard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4fe9eaf50f738360bae134bfb999b35b3d0cd7d95193b6785a0e6dbba772317e"));
const getSmtpSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d7f5f55726d446a674e3196ec5d4274263597d06eb6aad8b33dc7a4cc5dcdab1"));
const SmtpInput = object({
  from_email: string().email().max(160),
  from_name: string().trim().min(1).max(120),
  reply_to: string().email().max(160).nullable().optional(),
  daily_quota: number().int().min(0).max(1e5),
  is_enabled: boolean(),
  notes: string().max(1e3).nullable().optional()
});
const saveSmtpSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SmtpInput.parse(i)).handler(createSsrRpc("798f509a1b80c5953a72119cffd3a6f8e0d0bab90823ae495aeb24216c2eb487"));
const getMailProviderSetting = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("665473392f3c3a66c40443da611b26f68339e0123671329875cfad4ecb64c5f3"));
const setMailProviderSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  choice: _enum(["auto", "zoho", "zeptomail"])
}).parse(i)).handler(createSsrRpc("2d90deabaa6d8e1dcf70500fc9c920e19839d0d6271e059b5271cca1428d0cf3"));
const sendTestEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  toEmail: string().email(),
  subject: string().min(1).max(200).optional()
}).parse(i)).handler(createSsrRpc("cea0f513beae0a10d45fae42411f1863d054def9c90fcd80a0f95e7bf666169e"));
const processEmailQueueNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b6e24206718ff59d0462b3bef0390ea09c23a27d65774f412139a74730a134fb"));
const retryFailedEmailsNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number().int().min(1).max(200).optional()
}).parse(i ?? {})).handler(createSsrRpc("241953f126eb4fe1ef508785175104af6d69b155a52bc7b3446b52e7ebefd508"));
const listEmailTemplates = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("32ef5ad05f019d464a283c2ef59e928f058a9c76c176bbdcd543d3cf6713b84c"));
const toggleEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  code: string().min(1),
  enabled: boolean(),
  reason: string().trim().max(500).optional()
}).parse(i)).handler(createSsrRpc("de7b499e119d14314a77e83ab4dff63e0a0e9225a8d694d74d6f30a50094f526"));
const setEmailTemplateDispatchMode = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  code: string().min(1),
  dispatch_mode: _enum(["auto", "manual"])
}).parse(i)).handler(createSsrRpc("fd7232795931abda353df2e9e8928705e11050e83048cfd6e07390ead56ac454"));
const sendOrderTemplateEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  templateCode: string().min(1).max(80)
}).parse(i)).handler(createSsrRpc("082b0a40b4298c398d357448fa8068fe86758e8c54aa92b3fb9bf4995b3bcec1"));
const TemplateInput = object({
  id: string().uuid().optional(),
  code: string().trim().min(2).max(80).regex(/^[a-zA-Z0-9_-]+$/, "code must contain only letters, numbers, hyphens or underscores"),
  name: string().trim().min(2).max(120),
  subject: string().trim().min(2).max(200),
  body_html: string().min(2).max(12e4),
  body_text: string().max(5e4).nullable().optional(),
  description: string().max(500).nullable().optional(),
  variables: array(string().max(60)).max(50).default([]),
  is_enabled: boolean().default(true),
  dispatch_mode: _enum(["auto", "manual"]).optional()
});
const saveEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TemplateInput.parse(i)).handler(createSsrRpc("4c96274b17860b41866821e57cc8a7f08539ccce6dcc04b8a561f30c2903329b"));
const duplicateEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("8af738b0ce7d72c81c7476176ba266494cb07ffe0d8b3282190250de142b4376"));
const deleteEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("76b74460706c1efc5b6b5d9f74dcc0400d468a7dc23640fbcf38da73361cca18"));
const LogsInput = object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(50),
  search: string().trim().max(200).optional(),
  status: _enum(["sent", "failed", "bounced"]).optional()
});
const listEmailLogs = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LogsInput.parse(i ?? {})).handler(createSsrRpc("93499bd1da03c5adf57649d5a9386e400c566bd800f89ec071e2ad4c8c8d8b43"));
const TestTplInput = object({
  code: string().trim().min(1).max(80),
  toEmail: string().email(),
  variablesJson: string().max(1e4).optional()
});
const sendTestTemplateEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TestTplInput.parse(i)).handler(createSsrRpc("ea2f93c736af85d566e73fa4b23b31e07fdb401502dde24f002eedc266ff73fa"));
export {
  saveEmailTemplate as a,
  getSmtpSettings as b,
  saveSmtpSettings as c,
  sendTestEmail as d,
  duplicateEmailTemplate as e,
  deleteEmailTemplate as f,
  getEmailDashboard as g,
  sendTestTemplateEmail as h,
  listEmailLogs as i,
  getMailProviderSetting as j,
  setMailProviderSetting as k,
  listEmailTemplates as l,
  sendOrderTemplateEmail as m,
  processEmailQueueNow as p,
  retryFailedEmailsNow as r,
  setEmailTemplateDispatchMode as s,
  toggleEmailTemplate as t
};
