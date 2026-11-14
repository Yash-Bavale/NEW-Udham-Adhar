import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
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
const getLeadTimeline_createServerFn_handler = createServerRpc({
  id: "fecb9b24901ff281edebf8340bde67064997a73b8b8411e126686ab2336d8677",
  name: "getLeadTimeline",
  filename: "src/lib/crm/lead-timeline.functions.ts"
}, (opts) => getLeadTimeline.__executeServer(opts));
const getLeadTimeline = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(getLeadTimeline_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    leadId
  } = data;
  const [acts, notes, emails, payments, onb, docs, analytics, leadRow] = await Promise.all([supabase.from("activity_logs").select("id, activity_type, activity_description, user_id, created_at").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(200), supabase.from("lead_notes").select("id, note, user_id, created_at").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(200), supabase.from("email_logs").select("id, status, subject, to_email, template_code, error_message, created_at").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(200), supabase.from("payments").select("id, status, amount, gateway_name, transaction_id, created_at, payment_date").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(100), supabase.from("onboarding_submissions").select("id, status, service_code, submitted_at, created_at, updated_at").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(50), supabase.from("documents").select("id, file_name, doc_type, status, uploaded_at, verified_at").eq("lead_id", leadId).order("uploaded_at", {
    ascending: false
  }).limit(200), supabase.from("analytics_events").select("id, event_name, page_url, created_at").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(200), supabase.from("leads").select("id, lead_source, created_at, name").eq("id", leadId).maybeSingle()]);
  const items = [];
  (acts.data ?? []).forEach((r) => items.push({
    id: `a-${r.id}`,
    kind: "activity",
    at: r.created_at,
    title: r.activity_description,
    actorId: r.user_id,
    meta: {
      type: r.activity_type
    }
  }));
  (notes.data ?? []).forEach((r) => items.push({
    id: `n-${r.id}`,
    kind: "note",
    at: r.created_at,
    title: "Internal note",
    detail: r.note,
    actorId: r.user_id
  }));
  (emails.data ?? []).forEach((r) => items.push({
    id: `e-${r.id}`,
    kind: "email",
    at: r.created_at,
    title: `Email ${r.status}: ${r.subject ?? ""}`,
    detail: r.error_message ? `Error: ${r.error_message}` : `To ${r.to_email ?? ""}`,
    meta: {
      template: r.template_code
    }
  }));
  (payments.data ?? []).forEach((r) => items.push({
    id: `p-${r.id}`,
    kind: "payment",
    at: r.payment_date ?? r.created_at,
    title: `Payment ${r.status} — ₹${Number(r.amount).toFixed(2)}`,
    detail: r.transaction_id ? `Txn ${r.transaction_id} via ${r.gateway_name}` : `via ${r.gateway_name}`
  }));
  (onb.data ?? []).forEach((r) => items.push({
    id: `o-${r.id}`,
    kind: "onboarding",
    at: r.submitted_at ?? r.updated_at ?? r.created_at,
    title: `Onboarding ${r.status}`,
    detail: `Service ${r.service_code}`
  }));
  (docs.data ?? []).forEach((r) => items.push({
    id: `d-${r.id}`,
    kind: "document",
    at: r.verified_at ?? r.uploaded_at,
    title: `Doc ${r.status}: ${r.doc_type}`,
    detail: r.file_name
  }));
  (analytics.data ?? []).forEach((r) => items.push({
    id: `x-${r.id}`,
    kind: "analytics",
    at: r.created_at,
    title: r.event_name,
    detail: r.page_url
  }));
  if (leadRow.data) {
    const src = leadRow.data.lead_source ?? "unknown";
    const [channel, ...pathParts] = src.split(":");
    const path = pathParts.join(":");
    items.push({
      id: `src-${leadRow.data.id}`,
      kind: "activity",
      at: leadRow.data.created_at,
      title: `Lead created — Source: ${channel || "unknown"}`,
      detail: path ? `Landing page: ${path}` : void 0
    });
  }
  items.sort((a, b) => a.at < b.at ? 1 : -1);
  return {
    items: items.slice(0, 500)
  };
});
export {
  getLeadTimeline_createServerFn_handler
};
