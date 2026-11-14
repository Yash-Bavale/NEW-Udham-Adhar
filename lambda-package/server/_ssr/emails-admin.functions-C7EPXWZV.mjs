import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import { T as TEMPLATES } from "./registry-DV_lUXjY.mjs";
import { R as React } from "../_libs/react.mjs";
import "../_libs/seroval.mjs";
import { r as render } from "../_libs/react-email__render.mjs";
import { o as object, s as string, r as record, d as any } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/prettier.mjs";
import "../_libs/html-to-text.mjs";
import "../_libs/selderee__plugin-htmlparser2.mjs";
import "../_libs/selderee.mjs";
import "../_libs/parseley.mjs";
import "../_libs/leac.mjs";
import "../_libs/peberminta.mjs";
import "../_libs/domhandler.mjs";
import "../_libs/domelementtype.mjs";
import "../_libs/htmlparser2.mjs";
import "../_libs/entities.mjs";
import "../_libs/deepmerge.mjs";
import "../_libs/dom-serializer.mjs";
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
const listLeadEmails_createServerFn_handler = createServerRpc({
  id: "868b6920182a334ad84e6e0896f18feea08ccd9b69e0fad1f044a6ce276c3337",
  name: "listLeadEmails",
  filename: "src/lib/crm/emails-admin.functions.ts"
}, (opts) => listLeadEmails.__executeServer(opts));
const listLeadEmails = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  leadId: string().uuid()
})).handler(listLeadEmails_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: roleRows
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  const roles = new Set((roleRows ?? []).map((r) => r.role));
  const allowed = ["super_admin", "admin", "operations", "support", "accounts", "finance", "executive", "manager"];
  if (!allowed.some((r) => roles.has(r))) return {
    logs: [],
    queue: []
  };
  const admin = await getAdmin();
  const {
    data: templateRows
  } = await admin.from("email_templates").select("code");
  const templateSet = new Set((templateRows ?? []).map((t) => t.code));
  const {
    data: logs,
    error: logErr
  } = await admin.from("email_logs").select("*").eq("lead_id", data.leadId).order("sent_at", {
    ascending: false
  });
  if (logErr) throw new Error(logErr.message);
  const {
    data: queue,
    error: queueErr
  } = await admin.from("email_queue").select("*").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  });
  if (queueErr) throw new Error(queueErr.message);
  const mark = (row) => ({
    ...row,
    template_exists: Boolean(row.template_code && templateSet.has(row.template_code))
  });
  return {
    logs: (logs || []).map(mark),
    queue: (queue || []).map(mark)
  };
});
const SendEmailSchema = object({
  leadId: string().uuid(),
  templateCode: string(),
  variables: record(string(), any()),
  toEmail: string().email().optional()
});
const sendLeadEmail_createServerFn_handler = createServerRpc({
  id: "c6977c6a5c7e6e9f6eec748213346d3cb5b868338abc225d32707e116867bb11",
  name: "sendLeadEmail",
  filename: "src/lib/crm/emails-admin.functions.ts"
}, (opts) => sendLeadEmail.__executeServer(opts));
const sendLeadEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SendEmailSchema.parse(i)).handler(sendLeadEmail_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "operations", "admin"]);
  const {
    leadId,
    templateCode,
    variables,
    toEmail
  } = data;
  const entry = TEMPLATES[templateCode];
  if (!entry) throw new Error("Invalid template code");
  const admin = await getAdmin();
  const {
    data: lead
  } = await admin.from("leads").select("*").eq("id", leadId).single();
  if (!lead) throw new Error("Lead not found");
  const {
    data: app
  } = await admin.from("applications").select("id, application_code").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    resolveApplicationCode
  } = await import("./resolve-order-number.server-BMud2UpT.mjs");
  const orderNumber = app?.application_code ?? await resolveApplicationCode(leadId, {
    applicationId: app?.id ?? null
  });
  if (!orderNumber) throw new Error("Order number not ready yet — please retry in a moment.");
  const finalTo = toEmail || lead.email;
  const finalVars = {
    customerName: lead.name,
    orderNumber,
    formLink: `https://${process.env.LOVABLE_APP_DOMAIN || "udyamadhar.in"}/onboarding/${lead.lead_code}`,
    ...variables
  };
  const subject = typeof entry.subject === "function" ? entry.subject(finalVars) : entry.subject;
  const html = await render(React.createElement(entry.component, finalVars));
  const {
    error
  } = await (await getAdmin()).from("email_queue").insert({
    lead_id: leadId,
    to_email: finalTo,
    subject,
    body_html: html,
    template_code: templateCode,
    variables: finalVars,
    created_by: context.userId
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  listLeadEmails_createServerFn_handler,
  sendLeadEmail_createServerFn_handler
};
