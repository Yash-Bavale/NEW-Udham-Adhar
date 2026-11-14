import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, n as number, _ as _enum, a as array } from "../_libs/zod.mjs";
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
const getEmailDashboard_createServerFn_handler = createServerRpc({
  id: "4fe9eaf50f738360bae134bfb999b35b3d0cd7d95193b6785a0e6dbba772317e",
  name: "getEmailDashboard",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => getEmailDashboard.__executeServer(opts));
const getEmailDashboard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getEmailDashboard_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString();
  const counts = async (status) => {
    const {
      count
    } = await supabase.from("email_queue").select("*", {
      count: "exact",
      head: true
    }).eq("status", status);
    return count ?? 0;
  };
  const [queued, sending, failed, dlq, sent24h, sent7d, recentLogs, topErrors, failedRows, queueRows, logRows, templates] = await Promise.all([counts("queued"), counts("sending"), counts("failed"), counts("dlq"), supabase.from("email_logs").select("*", {
    count: "exact",
    head: true
  }).eq("status", "sent").gte("sent_at", since24h).then((r) => r.count ?? 0), supabase.from("email_logs").select("*", {
    count: "exact",
    head: true
  }).eq("status", "sent").gte("sent_at", since7d).then((r) => r.count ?? 0), supabase.from("email_logs").select("id, to_email, subject, status, error_message, smtp_response, sent_at, template_code").order("sent_at", {
    ascending: false
  }).limit(20), supabase.from("email_queue").select("id, to_email, subject, last_error, attempts").eq("status", "dlq").order("updated_at", {
    ascending: false
  }).limit(10), supabase.from("email_queue").select("id, to_email, subject, template_code, attempts, max_attempts, next_attempt_at, last_error, created_at").eq("status", "failed").order("created_at", {
    ascending: false
  }).limit(100), supabase.from("email_queue").select("template_code"), supabase.from("email_logs").select("template_code, status"), supabase.from("email_templates").select("code")]);
  const templateSet = new Set((templates.data ?? []).map((t) => t.code));
  const queueUnmatched = (queueRows.data ?? []).filter((r) => !r.template_code || !templateSet.has(r.template_code)).length;
  const sentLogsUnmatched = (logRows.data ?? []).filter((r) => r.status === "sent" && (!r.template_code || !templateSet.has(r.template_code))).length;
  const allLogsUnmatched = (logRows.data ?? []).filter((r) => !r.template_code || !templateSet.has(r.template_code)).length;
  return {
    counts: {
      queued,
      sending,
      failed,
      dlq,
      sent24h,
      sent7d,
      queueUnmatched,
      sentLogsUnmatched,
      allLogsUnmatched
    },
    recentLogs: recentLogs.data ?? [],
    dlqRows: topErrors.data ?? [],
    failedRows: failedRows.data ?? []
  };
});
const getSmtpSettings_createServerFn_handler = createServerRpc({
  id: "d7f5f55726d446a674e3196ec5d4274263597d06eb6aad8b33dc7a4cc5dcdab1",
  name: "getSmtpSettings",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => getSmtpSettings.__executeServer(opts));
const getSmtpSettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getSmtpSettings_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("smtp_settings").select("id, from_email, from_name, reply_to, daily_quota, is_enabled, notes, updated_at").order("updated_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    settings: data,
    hasSmtpHost: Boolean(process.env.SMTP_HOST),
    hasSmtpUser: Boolean(process.env.SMTP_USER),
    hasSmtpPass: Boolean(process.env.SMTP_PASS)
  };
});
const SmtpInput = object({
  from_email: string().email().max(160),
  from_name: string().trim().min(1).max(120),
  reply_to: string().email().max(160).nullable().optional(),
  daily_quota: number().int().min(0).max(1e5),
  is_enabled: boolean(),
  notes: string().max(1e3).nullable().optional()
});
const saveSmtpSettings_createServerFn_handler = createServerRpc({
  id: "798f509a1b80c5953a72119cffd3a6f8e0d0bab90823ae495aeb24216c2eb487",
  name: "saveSmtpSettings",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => saveSmtpSettings.__executeServer(opts));
const saveSmtpSettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SmtpInput.parse(i)).handler(saveSmtpSettings_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: existing
  } = await supabase.from("smtp_settings").select("id").order("updated_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const payload = {
    ...data,
    updated_by: userId
  };
  if (existing) {
    const {
      error
    } = await supabase.from("smtp_settings").update(payload).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabase.from("smtp_settings").insert(payload);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const getMailProviderSetting_createServerFn_handler = createServerRpc({
  id: "665473392f3c3a66c40443da611b26f68339e0123671329875cfad4ecb64c5f3",
  name: "getMailProviderSetting",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => getMailProviderSetting.__executeServer(opts));
const getMailProviderSetting = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMailProviderSetting_createServerFn_handler, async () => {
  const {
    mailProviderChoice,
    resolveMailProvider,
    senderEmailFor
  } = await import("./transport.server-COs9qGOQ.mjs");
  const {
    zeptoConfigured
  } = await import("./zeptomail.server-FqoGmUCt.mjs");
  const active = await resolveMailProvider();
  return {
    choice: await mailProviderChoice(),
    active,
    senderEmail: senderEmailFor(active),
    zeptoConfigured: zeptoConfigured(),
    zohoConfigured: Boolean(process.env.ZOHO_SMTP_USER || process.env.ZOHO_FROM_EMAIL)
  };
});
const setMailProviderSetting_createServerFn_handler = createServerRpc({
  id: "2d90deabaa6d8e1dcf70500fc9c920e19839d0d6271e059b5271cca1428d0cf3",
  name: "setMailProviderSetting",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => setMailProviderSetting.__executeServer(opts));
const setMailProviderSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  choice: _enum(["auto", "zoho", "zeptomail"])
}).parse(i)).handler(setMailProviderSetting_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    error
  } = await supabaseAdmin.from("app_settings").upsert({
    id: 1,
    email_provider: data.choice,
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_by: context.userId
  }, {
    onConflict: "id"
  });
  if (error) throw new Error(error.message);
  const {
    clearMailProviderCache,
    resolveMailProvider
  } = await import("./transport.server-COs9qGOQ.mjs");
  clearMailProviderCache();
  return {
    ok: true,
    choice: data.choice,
    active: await resolveMailProvider()
  };
});
const sendTestEmail_createServerFn_handler = createServerRpc({
  id: "cea0f513beae0a10d45fae42411f1863d054def9c90fcd80a0f95e7bf666169e",
  name: "sendTestEmail",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => sendTestEmail.__executeServer(opts));
const sendTestEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  toEmail: string().email(),
  subject: string().min(1).max(200).optional()
}).parse(i)).handler(sendTestEmail_createServerFn_handler, async ({
  data
}) => {
  const {
    enqueueEmailInternal,
    processQueueInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  await enqueueEmailInternal({
    templateCode: null,
    toEmail: data.toEmail,
    subject: data.subject ?? "SMTP test from Business Help Services",
    bodyHtml: "<p>This is a test email sent from the admin email console.</p><p>If you received this, SMTP is configured correctly.</p>",
    bodyText: "This is a test email. If you received this, SMTP is configured correctly.",
    variables: {
      purpose: "smtp_test"
    },
    allowWithoutTemplate: true
  });
  const result = await processQueueInternal(5);
  return {
    queued: true,
    ...result
  };
});
const processEmailQueueNow_createServerFn_handler = createServerRpc({
  id: "b6e24206718ff59d0462b3bef0390ea09c23a27d65774f412139a74730a134fb",
  name: "processEmailQueueNow",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => processEmailQueueNow.__executeServer(opts));
const processEmailQueueNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(processEmailQueueNow_createServerFn_handler, async () => {
  const {
    processQueueInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  return await processQueueInternal(50);
});
const retryFailedEmailsNow_createServerFn_handler = createServerRpc({
  id: "241953f126eb4fe1ef508785175104af6d69b155a52bc7b3446b52e7ebefd508",
  name: "retryFailedEmailsNow",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => retryFailedEmailsNow.__executeServer(opts));
const retryFailedEmailsNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number().int().min(1).max(200).optional()
}).parse(i ?? {})).handler(retryFailedEmailsNow_createServerFn_handler, async ({
  data
}) => {
  const {
    processQueueInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  const m = await import("./client.server-3kDCe7R3.mjs");
  const admin = m.supabaseAdmin;
  const {
    data: released
  } = await admin.from("email_queue").update({
    next_attempt_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("status", "failed").select("id");
  const result = await processQueueInternal(data.limit ?? 50);
  return {
    released: released?.length ?? 0,
    ...result
  };
});
const listEmailTemplates_createServerFn_handler = createServerRpc({
  id: "32ef5ad05f019d464a283c2ef59e928f058a9c76c176bbdcd543d3cf6713b84c",
  name: "listEmailTemplates",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => listEmailTemplates.__executeServer(opts));
const listEmailTemplates = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listEmailTemplates_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  let {
    data,
    error
  } = await supabase.from("email_templates").select("id, code, name, subject, body_html, body_text, description, variables, is_enabled, is_system, updated_at, disabled_reason, last_toggled_by, last_toggled_at, last_sent_at, total_sent, category, flow_id, sr_no, dispatch_mode").order("name", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  const codes = new Set((data ?? []).map((t) => t.code));
  if (!codes.has("R001") || !codes.has("R002") || !codes.has("E011")) {
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-3kDCe7R3.mjs");
      const {
        BUILTIN_TEMPLATES
      } = await import("./emails.server-BTJhg2a3.mjs");
      if (!codes.has("R001") && BUILTIN_TEMPLATES.R001) {
        await supabaseAdmin.from("email_templates").upsert({
          code: "R001",
          name: "R001 – Refund Request Approved",
          subject: BUILTIN_TEMPLATES.R001.subject,
          body_html: BUILTIN_TEMPLATES.R001.body_html,
          category: "Refunds",
          flow_id: "R001",
          sr_no: 1,
          dispatch_mode: "manual",
          is_enabled: true,
          is_system: true,
          variables: ["order_number", "customer_name", "service_name", "refund_status", "refund_amount", "refund_amount_formatted", "refund_approval_date_and_time", "refund_reference_no", "payment_reference", "customer_email", "customer_mobile", "executive_name"]
        }, {
          onConflict: "code"
        });
      }
      if (!codes.has("R002") && BUILTIN_TEMPLATES.R002) {
        await supabaseAdmin.from("email_templates").upsert({
          code: "R002",
          name: "R002 – Refund Request Not Approved / Rejected",
          subject: BUILTIN_TEMPLATES.R002.subject,
          body_html: BUILTIN_TEMPLATES.R002.body_html,
          category: "Refunds",
          flow_id: "R002",
          sr_no: 2,
          dispatch_mode: "manual",
          is_enabled: true,
          is_system: true,
          variables: ["order_number", "customer_name", "invoice_number", "service_name", "order_created_at", "closure_date", "customer_email", "customer_mobile", "employee_remarks", "executive_name"]
        }, {
          onConflict: "code"
        });
      }
      if (!codes.has("E011") && BUILTIN_TEMPLATES.E011) {
        await supabaseAdmin.from("email_templates").upsert({
          code: "E011",
          name: "E011 – Technical Delay Resolved",
          subject: BUILTIN_TEMPLATES.E011.subject,
          body_html: BUILTIN_TEMPLATES.E011.body_html,
          category: "Delay & Hold",
          flow_id: "E011",
          sr_no: 11,
          dispatch_mode: "manual",
          is_enabled: true,
          is_system: true,
          variables: ["order_number", "customer_name", "service_name", "resolved_at", "customer_email", "customer_mobile", "executive_name"]
        }, {
          onConflict: "code"
        });
      }
      const refetch = await supabase.from("email_templates").select("id, code, name, subject, body_html, body_text, description, variables, is_enabled, is_system, updated_at, disabled_reason, last_toggled_by, last_toggled_at, last_sent_at, total_sent, category, flow_id, sr_no, dispatch_mode").order("name", {
        ascending: true
      });
      if (refetch.data) data = refetch.data;
    } catch (err) {
      console.warn("[listEmailTemplates] Auto-seed error:", err);
    }
  }
  return {
    rows: data ?? []
  };
});
const toggleEmailTemplate_createServerFn_handler = createServerRpc({
  id: "de7b499e119d14314a77e83ab4dff63e0a0e9225a8d694d74d6f30a50094f526",
  name: "toggleEmailTemplate",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => toggleEmailTemplate.__executeServer(opts));
const toggleEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  code: string().min(1),
  enabled: boolean(),
  reason: string().trim().max(500).optional()
}).parse(i)).handler(toggleEmailTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const [{
    data: isAdmin
  }, {
    data: isSuper
  }] = await Promise.all([supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin"
  }), supabase.rpc("has_role", {
    _user_id: userId,
    _role: "super_admin"
  })]);
  if (!isAdmin && !isSuper) throw new Error("Forbidden");
  const patch = {
    is_enabled: data.enabled,
    disabled_reason: data.enabled ? null : data.reason ?? null,
    last_toggled_by: userId,
    last_toggled_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const {
    error
  } = await supabase.from("email_templates").update(patch).eq("code", data.code);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const setEmailTemplateDispatchMode_createServerFn_handler = createServerRpc({
  id: "fd7232795931abda353df2e9e8928705e11050e83048cfd6e07390ead56ac454",
  name: "setEmailTemplateDispatchMode",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => setEmailTemplateDispatchMode.__executeServer(opts));
const setEmailTemplateDispatchMode = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  code: string().min(1),
  dispatch_mode: _enum(["auto", "manual"])
}).parse(i)).handler(setEmailTemplateDispatchMode_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const [{
    data: isAdmin
  }, {
    data: isSuper
  }] = await Promise.all([supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin"
  }), supabase.rpc("has_role", {
    _user_id: userId,
    _role: "super_admin"
  })]);
  if (!isAdmin && !isSuper) throw new Error("Forbidden");
  const {
    error
  } = await supabase.from("email_templates").update({
    dispatch_mode: data.dispatch_mode
  }).eq("code", data.code);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const sendOrderTemplateEmail_createServerFn_handler = createServerRpc({
  id: "082b0a40b4298c398d357448fa8068fe86758e8c54aa92b3fb9bf4995b3bcec1",
  name: "sendOrderTemplateEmail",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => sendOrderTemplateEmail.__executeServer(opts));
const sendOrderTemplateEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  templateCode: string().min(1).max(80)
}).parse(i)).handler(sendOrderTemplateEmail_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: lead,
    error: leadErr
  } = await supabase.from("leads").select("id, lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount").eq("id", data.leadId).maybeSingle();
  if (leadErr) throw new Error(leadErr.message);
  if (!lead?.email) throw new Error("Lead has no email address on file.");
  const {
    data: app
  } = await supabase.from("applications").select("id, application_code").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    resolveApplicationCode
  } = await import("./resolve-order-number.server-BMud2UpT.mjs");
  const orderNumber = app?.application_code ?? await resolveApplicationCode(data.leadId, {
    applicationId: app?.id ?? null
  });
  if (!orderNumber) throw new Error("Order number not ready yet — please retry in a moment.");
  const appOrigin = process.env.APP_BASE_URL || process.env.SUPABASE_URL || "";
  const onboardingUrl = lead.lead_code ? `${appOrigin}/onboarding/${encodeURIComponent(lead.lead_code)}` : "";
  const vars = {
    customer_name: lead.name ?? "",
    name: lead.name ?? "",
    customer_email: lead.email,
    customer_mobile: lead.mobile ?? "",
    order_number: orderNumber,
    lead_code: lead.lead_code ?? "",
    service_name: lead.service ?? "",
    service: lead.service ?? "",
    form_link: onboardingUrl,
    onboarding_url: onboardingUrl,
    service_fee: Number(lead.base_amount ?? 0).toFixed(2),
    gst_amount: Number(lead.gst_amount ?? 0).toFixed(2),
    total_amount: Number(lead.total_amount ?? 0).toFixed(2),
    support_email: "help@businesshelpservices.com"
  };
  const {
    enqueueFromTemplateInternal,
    processQueueInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  await enqueueFromTemplateInternal(data.templateCode, lead.email, vars, {
    toName: lead.name ?? void 0,
    leadId: lead.id,
    applicationId: app?.id ?? void 0,
    trigger: "manual",
    requireImmediateSuccess: true
  });
  const result = await processQueueInternal(5);
  return {
    ok: true,
    template: data.templateCode,
    ...result
  };
});
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
const saveEmailTemplate_createServerFn_handler = createServerRpc({
  id: "4c96274b17860b41866821e57cc8a7f08539ccce6dcc04b8a561f30c2903329b",
  name: "saveEmailTemplate",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => saveEmailTemplate.__executeServer(opts));
const saveEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TemplateInput.parse(i)).handler(saveEmailTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.id) {
    const {
      id,
      ...patch
    } = data;
    const {
      error: error2
    } = await supabase.from("email_templates").update(patch).eq("id", id);
    if (error2) throw new Error(error2.message);
    return {
      ok: true,
      id
    };
  }
  const {
    data: row,
    error
  } = await supabase.from("email_templates").insert({
    ...data,
    created_by: userId
  }).select("id").single();
  if (error) throw new Error(error.message);
  return {
    ok: true,
    id: row.id
  };
});
const duplicateEmailTemplate_createServerFn_handler = createServerRpc({
  id: "8af738b0ce7d72c81c7476176ba266494cb07ffe0d8b3282190250de142b4376",
  name: "duplicateEmailTemplate",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => duplicateEmailTemplate.__executeServer(opts));
const duplicateEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(duplicateEmailTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: src,
    error
  } = await supabase.from("email_templates").select("*").eq("id", data.id).single();
  if (error || !src) throw new Error(error?.message ?? "Template not found");
  const newCode = `${src.code}_copy_${Date.now().toString(36)}`.slice(0, 80);
  const {
    data: row,
    error: insErr
  } = await supabase.from("email_templates").insert({
    code: newCode,
    name: `${src.name} (copy)`,
    subject: src.subject,
    body_html: src.body_html,
    body_text: src.body_text,
    description: src.description,
    variables: src.variables,
    is_enabled: false,
    is_system: false,
    created_by: userId
  }).select("id").single();
  if (insErr) throw new Error(insErr.message);
  return {
    ok: true,
    id: row.id
  };
});
const deleteEmailTemplate_createServerFn_handler = createServerRpc({
  id: "76b74460706c1efc5b6b5d9f74dcc0400d468a7dc23640fbcf38da73361cca18",
  name: "deleteEmailTemplate",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => deleteEmailTemplate.__executeServer(opts));
const deleteEmailTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(deleteEmailTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: src
  } = await supabase.from("email_templates").select("is_system").eq("id", data.id).maybeSingle();
  if (src?.is_system) throw new Error("System templates cannot be deleted. Disable instead.");
  const {
    error
  } = await supabase.from("email_templates").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const LogsInput = object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(1).max(100).default(50),
  search: string().trim().max(200).optional(),
  status: _enum(["sent", "failed", "bounced"]).optional()
});
const listEmailLogs_createServerFn_handler = createServerRpc({
  id: "93499bd1da03c5adf57649d5a9386e400c566bd800f89ec071e2ad4c8c8d8b43",
  name: "listEmailLogs",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => listEmailLogs.__executeServer(opts));
const listEmailLogs = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LogsInput.parse(i ?? {})).handler(listEmailLogs_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const from = (data.page - 1) * data.pageSize;
  const to = from + data.pageSize - 1;
  const {
    data: tplRows
  } = await supabase.from("email_templates").select("code");
  const templateSet = new Set((tplRows ?? []).map((t) => t.code));
  let q = supabase.from("email_logs").select("id, to_email, subject, status, error_message, smtp_response, attempt, template_code, sent_at", {
    count: "exact"
  }).order("sent_at", {
    ascending: false
  }).range(from, to);
  if (data.status) q = q.eq("status", data.status);
  if (data.search) {
    const s = data.search.replace(/[,()]/g, " ").trim();
    q = q.or(`to_email.ilike.%${s}%,subject.ilike.%${s}%`);
  }
  const {
    data: rows,
    error,
    count
  } = await q;
  if (error) throw new Error(error.message);
  return {
    rows: (rows ?? []).map((r) => ({
      ...r,
      template_exists: Boolean(r.template_code && templateSet.has(r.template_code))
    })),
    total: count ?? 0,
    page: data.page,
    pageSize: data.pageSize
  };
});
const TestTplInput = object({
  code: string().trim().min(1).max(80),
  toEmail: string().email(),
  variablesJson: string().max(1e4).optional()
});
const sendTestTemplateEmail_createServerFn_handler = createServerRpc({
  id: "ea2f93c736af85d566e73fa4b23b31e07fdb401502dde24f002eedc266ff73fa",
  name: "sendTestTemplateEmail",
  filename: "src/lib/emails/emails.functions.ts"
}, (opts) => sendTestTemplateEmail.__executeServer(opts));
const sendTestTemplateEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TestTplInput.parse(i)).handler(sendTestTemplateEmail_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: tpl,
    error
  } = await supabase.from("email_templates").select("code, subject, body_html, body_text, variables, is_enabled").eq("code", data.code).maybeSingle();
  if (error) throw new Error(error.message);
  if (!tpl) throw new Error(`Template '${data.code}' not found`);
  const sampleFor = (k) => {
    const lk = k.toLowerCase();
    if (lk.includes("email")) return data.toEmail;
    if (lk.includes("name")) return "Sample Customer";
    if (lk.includes("phone") || lk.includes("mobile")) return "9876543210";
    if (lk.includes("amount") || lk.includes("price") || lk.includes("total")) return "₹1,499";
    if (lk.includes("date") || lk.includes("time")) return (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    });
    if (lk.includes("order") || lk.includes("application")) return "AP-2026-000000";
    if (lk.includes("invoice")) return "UA-2026-000000";
    if (lk.includes("transaction") || lk.includes("txn") || lk.includes("reference")) return "TXN-TEST-1234567890";
    if (lk.includes("url") || lk.includes("link")) return "https://udyamadhar.in";
    if (lk.includes("service")) return "Download Udyam Certificate";
    if (lk.includes("certificate")) return "UDYAM-XX-00-0000000";
    if (lk.includes("reason")) return "Sample reason for testing";
    return `[Sample ${k}]`;
  };
  const auto = {};
  for (const v of tpl.variables ?? []) auto[v] = sampleFor(v);
  let overrides = {};
  if (data.variablesJson?.trim()) {
    try {
      const parsed = JSON.parse(data.variablesJson);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [k, v] of Object.entries(parsed)) overrides[k] = String(v ?? "");
      } else throw new Error("Variables JSON must be an object");
    } catch (e) {
      throw new Error(`Invalid variables JSON: ${e.message}`);
    }
  }
  const variables = {
    ...auto,
    ...overrides
  };
  const {
    enqueueFromTemplateInternal,
    processQueueInternal
  } = await import("./emails.server-BTJhg2a3.mjs");
  if (!tpl.is_enabled) {
    const {
      renderTemplate,
      renderTemplateHtml
    } = await import("./smtp.server-D7qNu26j.mjs");
    const {
      enqueueEmailInternal
    } = await import("./emails.server-BTJhg2a3.mjs");
    await enqueueEmailInternal({
      templateCode: `TEST_${tpl.code}`,
      toEmail: data.toEmail,
      subject: `[TEST] ${renderTemplate(tpl.subject, variables)}`,
      bodyHtml: renderTemplateHtml(tpl.body_html, variables),
      bodyText: tpl.body_text ? renderTemplate(tpl.body_text, variables) : null,
      variables
    });
  } else {
    await enqueueFromTemplateInternal(tpl.code, data.toEmail, variables);
  }
  const result = await processQueueInternal(5);
  return {
    ok: true,
    template: tpl.code,
    variablesUsed: variables,
    ...result
  };
});
export {
  deleteEmailTemplate_createServerFn_handler,
  duplicateEmailTemplate_createServerFn_handler,
  getEmailDashboard_createServerFn_handler,
  getMailProviderSetting_createServerFn_handler,
  getSmtpSettings_createServerFn_handler,
  listEmailLogs_createServerFn_handler,
  listEmailTemplates_createServerFn_handler,
  processEmailQueueNow_createServerFn_handler,
  retryFailedEmailsNow_createServerFn_handler,
  saveEmailTemplate_createServerFn_handler,
  saveSmtpSettings_createServerFn_handler,
  sendOrderTemplateEmail_createServerFn_handler,
  sendTestEmail_createServerFn_handler,
  sendTestTemplateEmail_createServerFn_handler,
  setEmailTemplateDispatchMode_createServerFn_handler,
  setMailProviderSetting_createServerFn_handler,
  toggleEmailTemplate_createServerFn_handler
};
