import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, _ as _enum, s as string, b as boolean } from "../_libs/zod.mjs";
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
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function requireAdmin(supabase, userId) {
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const rows = roles ?? [];
  const isAdmin = rows.some((r) => r.role === "admin" || r.role === "super_admin");
  if (!isAdmin) throw new Error("Forbidden: admin role required");
}
const getPipelineHealth_createServerFn_handler = createServerRpc({
  id: "3e692d70973f4a11e54fa6da52e86b5d5cc0d0f8f85eb3d5c75ed9fe3c69ab65",
  name: "getPipelineHealth",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => getPipelineHealth.__executeServer(opts));
const getPipelineHealth = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getPipelineHealth_createServerFn_handler, async ({
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    getAllCheckpoints
  } = await import("./checkpoint.server-MYsV3SGk.mjs");
  const mailbox = (process.env.ZOHO_FROM_EMAIL || "help@businesshelpservices.com").trim().toLowerCase();
  const checkpoints = await getAllCheckpoints(mailbox);
  const startOfToday = /* @__PURE__ */ new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayIso = startOfToday.toISOString();
  const [discoveredToday, completedToday, errorsToday, newTicketsToday, openErrors, unlinkedTickets, recentAuditLogs, recentErrors] = await Promise.all([admin.from("email_ingestion_audit_logs").select("*", {
    count: "exact",
    head: true
  }).eq("stage", "DISCOVERED").gte("created_at", todayIso), admin.from("email_ingestion_audit_logs").select("*", {
    count: "exact",
    head: true
  }).eq("stage", "COMPLETED").gte("created_at", todayIso), admin.from("email_processing_errors").select("*", {
    count: "exact",
    head: true
  }).gte("created_at", todayIso), admin.from("support_tickets").select("*", {
    count: "exact",
    head: true
  }).eq("source", "email_inbound").gte("created_at", todayIso), admin.from("email_processing_errors").select("*", {
    count: "exact",
    head: true
  }).in("status", ["new", "retrying"]), admin.from("support_tickets").select("*", {
    count: "exact",
    head: true
  }).or("is_unlinked.eq.true,order_link_status.eq.needs_review"), admin.from("email_ingestion_audit_logs").select("id, zoho_mail_uid, zoho_folder_name, stage, sender_normalized, subject, matched_ticket_id, created_at").order("created_at", {
    ascending: false
  }).limit(10), admin.from("email_processing_errors").select("id, zoho_mail_uid, zoho_folder_name, from_email, subject, error_stage, error_message, status, created_at").in("status", ["new", "retrying"]).order("created_at", {
    ascending: false
  }).limit(10)]);
  let latestSyncAt = null;
  let isHealthy = true;
  for (const cp of checkpoints) {
    if (!latestSyncAt || cp.last_sync_at > latestSyncAt) {
      latestSyncAt = cp.last_sync_at;
    }
    if (cp.status === "error" && cp.consecutive_failures >= 3) {
      isHealthy = false;
    }
  }
  return {
    mailbox,
    isHealthy,
    lastSyncAt: latestSyncAt,
    checkpoints,
    today: {
      discovered: discoveredToday.count ?? 0,
      completed: completedToday.count ?? 0,
      errors: errorsToday.count ?? 0,
      newTickets: newTicketsToday.count ?? 0
    },
    openErrorsCount: openErrors.count ?? 0,
    unlinkedTicketsCount: unlinkedTickets.count ?? 0,
    recentAuditLogs: recentAuditLogs.data ?? [],
    recentErrors: recentErrors.data ?? []
  };
});
const getProcessingErrors_createServerFn_handler = createServerRpc({
  id: "149ee577f7b0a3af6727fea443b5b65c956be4e65a9dd1a4640814fe84c3966a",
  name: "getProcessingErrors",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => getProcessingErrors.__executeServer(opts));
const getProcessingErrors = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: _enum(["new", "retrying", "resolved", "failed", "dismissed", "all"]).default("new"),
  page: number().int().min(1).default(1),
  limit: number().int().min(1).max(100).default(30)
}).parse(i)).handler(getProcessingErrors_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const from = (data.page - 1) * data.limit;
  const to = from + data.limit - 1;
  let q = admin.from("email_processing_errors").select("*", {
    count: "exact"
  });
  if (data.status !== "all") {
    q = q.eq("status", data.status);
  }
  const {
    data: rows,
    count,
    error
  } = await q.order("created_at", {
    ascending: false
  }).range(from, to);
  if (error) throw new Error(error.message);
  return {
    errors: rows ?? [],
    total: count ?? 0,
    page: data.page,
    pageSize: data.limit,
    totalPages: Math.ceil((count ?? 0) / data.limit)
  };
});
const retryProcessingError_createServerFn_handler = createServerRpc({
  id: "9bfeccd8321347372a8a9d8ae37859585d198ac98b49c265ab28fbe3a9735c85",
  name: "retryProcessingError",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => retryProcessingError.__executeServer(opts));
const retryProcessingError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(retryProcessingError_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: row
  } = await admin.from("email_processing_errors").select("*").eq("id", data.id).maybeSingle();
  if (!row) throw new Error("Processing error record not found");
  const r = row;
  await admin.from("email_processing_errors").update({
    status: "retrying",
    retry_count: (r.retry_count || 0) + 1,
    last_retried_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  try {
    const {
      pollZohoInbox
    } = await import("./inbox-matcher.server-90b1dcqx.mjs");
    const result = await pollZohoInbox({
      folderIds: r.zoho_folder_id ? [r.zoho_folder_id] : void 0,
      limit: 50
    });
    await admin.from("email_processing_errors").update({
      status: "resolved",
      resolved_at: (/* @__PURE__ */ new Date()).toISOString(),
      resolved_by: context.userId,
      resolution_action: "retry_success",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.id);
    return {
      ok: true,
      message: `Retried successfully. Ingestion counters: ${result.matched} matched, ${result.new} new.`
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await admin.from("email_processing_errors").update({
      status: "failed",
      error_message: msg,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.id);
    throw new Error(`Retry failed: ${msg}`);
  }
});
const createTicketFromProcessingError_createServerFn_handler = createServerRpc({
  id: "25bd823752ad6f1d56a44ec9b1238c2af05a0553dd118cc4c16c24f012d91820",
  name: "createTicketFromProcessingError",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => createTicketFromProcessingError.__executeServer(opts));
const createTicketFromProcessingError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  customerId: string().uuid().optional(),
  applicationId: string().uuid().optional()
}).parse(i)).handler(createTicketFromProcessingError_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const {
    data: row
  } = await admin.from("email_processing_errors").select("*").eq("id", data.id).maybeSingle();
  if (!row) throw new Error("Processing error not found");
  const r = row;
  const subject = (r.subject || "(no subject)").slice(0, 240);
  const bodyText = r.body_snippet || "Manual ticket created from processing error";
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const {
    data: created,
    error: tErr
  } = await admin.from("support_tickets").insert({
    subject,
    description: bodyText.slice(0, 4e3),
    source: "email_inbound",
    status: "open",
    customer_id: data.customerId ?? null,
    application_id: data.applicationId ?? null,
    ticket_email: r.from_email,
    is_unlinked: !data.customerId || !data.applicationId,
    order_link_status: data.applicationId ? "linked" : "unlinked",
    last_customer_message_at: now,
    created_at: now,
    updated_at: now
  }).select("id, ticket_number").single();
  if (tErr) throw new Error(`Ticket creation failed: ${tErr.message}`);
  const t = created;
  await admin.from("ticket_replies").insert({
    ticket_id: t.id,
    reply_text: bodyText,
    is_internal: false,
    direction: "inbound",
    email_message_id: r.message_id,
    created_at: now
  });
  await admin.from("email_processing_errors").update({
    status: "resolved",
    resolved_at: now,
    resolved_by: context.userId,
    resolution_action: `created_ticket_${t.ticket_number}`,
    matched_ticket_id: t.id,
    updated_at: now
  }).eq("id", data.id);
  return {
    ok: true,
    ticketId: t.id,
    ticketNumber: t.ticket_number
  };
});
const searchEmailAuditTrace_createServerFn_handler = createServerRpc({
  id: "4d32bcdb7e184bc01f23d4af7fcf66399d581a4f09cc0d90db737adfc2d8b221",
  name: "searchEmailAuditTrace",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => searchEmailAuditTrace.__executeServer(opts));
const searchEmailAuditTrace = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  query: string().trim().min(1).max(200)
}).parse(i)).handler(searchEmailAuditTrace_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const term = data.query.toLowerCase();
  const {
    data: auditRows
  } = await admin.from("email_ingestion_audit_logs").select("id, zoho_mail_uid, zoho_folder_name, message_id, sender_normalized, reply_to_email, to_email, subject, stage, matched_ticket_id, matched_application_id, matched_customer_id, is_duplicate, metadata, error_details, created_at").or(`sender_normalized.ilike.%${term}%,subject.ilike.%${term}%,message_id.ilike.%${term}%,zoho_mail_uid.ilike.%${term}%`).order("created_at", {
    ascending: false
  }).limit(50);
  const {
    data: ticketRows
  } = await admin.from("support_tickets").select("id, ticket_number, subject, status, ticket_email, application_id, customer_id, created_at").or(`ticket_number.ilike.%${term}%,subject.ilike.%${term}%,ticket_email.ilike.%${term}%`).order("created_at", {
    ascending: false
  }).limit(20);
  const {
    data: errorRows
  } = await admin.from("email_processing_errors").select("id, zoho_mail_uid, from_email, subject, error_stage, error_message, status, created_at").or(`from_email.ilike.%${term}%,subject.ilike.%${term}%,zoho_mail_uid.ilike.%${term}%`).order("created_at", {
    ascending: false
  }).limit(20);
  return {
    auditEvents: auditRows ?? [],
    tickets: ticketRows ?? [],
    processingErrors: errorRows ?? []
  };
});
const pollInboxNow_createServerFn_handler = createServerRpc({
  id: "1adb81ec67c9714414753a32764ba32fca21b9bed5deadf0bec39eeeb2de966b",
  name: "pollInboxNow",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => pollInboxNow.__executeServer(opts));
const pollInboxNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number().int().min(1).max(200).default(50)
}).parse(i ?? {})).handler(pollInboxNow_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const {
    pollZohoInbox
  } = await import("./inbox-matcher.server-90b1dcqx.mjs");
  const result = await pollZohoInbox({
    limit: data.limit
  });
  return {
    ok: true,
    fetched: result.fetched,
    new: result.new,
    matched: result.matched,
    unmatched: result.unmatched,
    duplicates: result.duplicates,
    errors: result.errors,
    foldersScanned: result.foldersScanned,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    message: `Scanned ${result.foldersScanned.length} folders: fetched ${result.fetched}, ${result.new} new, ${result.matched} matched, ${result.unmatched} unlinked, ${result.duplicates} duplicates, ${result.errors} errors.`
  };
});
const getRecentInboxEmails_createServerFn_handler = createServerRpc({
  id: "7cb16efe2570f0dabdb180c60727fcb4b0264b5a9e03cba10f27826c405bdfd4",
  name: "getRecentInboxEmails",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => getRecentInboxEmails.__executeServer(opts));
const getRecentInboxEmails = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number().int().min(1).max(100).default(50),
  page: number().int().min(1).default(1),
  direction: _enum(["incoming", "outgoing"]).default("incoming")
}).parse(i)).handler(getRecentInboxEmails_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const from = (data.page - 1) * data.limit;
  const to = from + data.limit - 1;
  const {
    data: rows,
    count,
    error
  } = await admin.from("email_logs").select("id, from_email, to_email, subject, status, direction, sent_at, created_at, template_code, application_id, customer_id, lead_id, zoho_mail_uid", {
    count: "exact"
  }).eq("direction", data.direction).order("created_at", {
    ascending: false
  }).range(from, to);
  if (error) throw new Error(error.message);
  return {
    emails: rows ?? [],
    total: count ?? 0,
    page: data.page,
    pageSize: data.limit,
    totalPages: Math.ceil((count ?? 0) / data.limit)
  };
});
const getAllTickets_createServerFn_handler = createServerRpc({
  id: "4114b5e00919843cc0d5a1ce0686f19123e81e048eb91f5cf6589f07eb6da8d1",
  name: "getAllTickets",
  filename: "src/lib/mail/inbox-admin.functions.ts"
}, (opts) => getAllTickets.__executeServer(opts));
const getAllTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number().int().min(1).max(100).default(50),
  page: number().int().min(1).default(1),
  status: _enum(["open", "in_progress", "waiting_customer", "resolved", "closed"]).optional(),
  unlinkedOnly: boolean().optional()
}).parse(i)).handler(getAllTickets_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireAdmin(context.supabase, context.userId);
  const admin = await getAdmin();
  const from = (data.page - 1) * data.limit;
  const to = from + data.limit - 1;
  let q = admin.from("support_tickets").select("id, ticket_number, subject, status, priority, is_unlinked, order_link_status, alternate_sender_email, created_at, updated_at, first_response_at, resolved_at, closed_at, application_id, customer_id, ticket_email, assigned_to", {
    count: "exact"
  });
  if (data.status) q = q.eq("status", data.status);
  if (data.unlinkedOnly) q = q.or("is_unlinked.eq.true,order_link_status.eq.needs_review");
  const {
    data: rows,
    count,
    error
  } = await q.order("created_at", {
    ascending: false
  }).range(from, to);
  if (error) throw new Error(error.message);
  return {
    tickets: rows ?? [],
    total: count ?? 0,
    page: data.page,
    pageSize: data.limit,
    totalPages: Math.ceil((count ?? 0) / data.limit)
  };
});
export {
  createTicketFromProcessingError_createServerFn_handler,
  getAllTickets_createServerFn_handler,
  getPipelineHealth_createServerFn_handler,
  getProcessingErrors_createServerFn_handler,
  getRecentInboxEmails_createServerFn_handler,
  pollInboxNow_createServerFn_handler,
  retryProcessingError_createServerFn_handler,
  searchEmailAuditTrace_createServerFn_handler
};
