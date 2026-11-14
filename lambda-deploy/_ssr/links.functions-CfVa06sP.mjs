import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, _ as _enum, s as string } from "../_libs/zod.mjs";
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
const LINK_PURPOSES = ["status", "resume", "pay", "upload", "certificate"];
function randToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
const CreateInput = object({
  leadId: string().uuid(),
  applicationId: string().uuid().optional(),
  purpose: _enum(LINK_PURPOSES),
  ttlHours: number().min(1).max(24 * 30).default(72)
});
const createApplicationLink_createServerFn_handler = createServerRpc({
  id: "044194b71fb61b46c1d41d35a74a8fc9431765d51c255b3af3e0f62a3ffe29f0",
  name: "createApplicationLink",
  filename: "src/lib/applications/links.functions.ts"
}, (opts) => createApplicationLink.__executeServer(opts));
const createApplicationLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CreateInput.parse(i)).handler(createApplicationLink_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const token = randToken();
  const expires = new Date(Date.now() + data.ttlHours * 36e5).toISOString();
  const {
    data: row,
    error
  } = await supabase.from("application_links").insert({
    lead_id: data.leadId,
    application_id: data.applicationId ?? null,
    purpose: data.purpose,
    token,
    expires_at: expires,
    created_by: userId
  }).select("token, expires_at, purpose").single();
  if (error) throw new Error(error.message);
  return {
    token: row.token,
    expiresAt: row.expires_at,
    purpose: row.purpose,
    url: `/app/${row.token}`
  };
});
const ResolveInput = object({
  token: string().min(8).max(128)
});
const resolveApplicationLink_createServerFn_handler = createServerRpc({
  id: "935b085390b565f0181d2bf15cefb3bfebbbe896c480ad26b69ba6a1c4caac05",
  name: "resolveApplicationLink",
  filename: "src/lib/applications/links.functions.ts"
}, (opts) => resolveApplicationLink.__executeServer(opts));
const resolveApplicationLink = createServerFn({
  method: "POST"
}).inputValidator((i) => ResolveInput.parse(i)).handler(resolveApplicationLink_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: link,
    error
  } = await supabaseAdmin.from("application_links").select("id, lead_id, application_id, purpose, expires_at, used_at").eq("token", data.token).maybeSingle();
  if (error) throw new Error(error.message);
  if (!link) return {
    ok: false,
    reason: "not_found"
  };
  if (link.used_at && link.purpose !== "status") {
    return {
      ok: false,
      reason: "used"
    };
  }
  if (new Date(link.expires_at).getTime() < Date.now()) {
    return {
      ok: false,
      reason: "expired"
    };
  }
  const [{
    data: lead
  }, {
    data: app
  }] = await Promise.all([supabaseAdmin.from("leads").select("id, lead_code, name, service, total_amount, status").eq("id", link.lead_id).maybeSingle(), link.application_id ? supabaseAdmin.from("applications").select("id, application_code, application_status, form_status, document_status").eq("id", link.application_id).maybeSingle() : Promise.resolve({
    data: null
  })]);
  const {
    issueCustomerToken
  } = await import("./customer-access.server-C_oBiISE.mjs");
  const accessToken = lead?.id ? await issueCustomerToken(lead.id, link.purpose === "pay" ? "co" : "ob", {
    reason: `app_link_${link.purpose}`
  }) : null;
  return {
    ok: true,
    accessToken,
    purpose: link.purpose,
    lead,
    application: app
  };
});
export {
  createApplicationLink_createServerFn_handler,
  resolveApplicationLink_createServerFn_handler
};
