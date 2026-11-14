import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { r as requireTelephonyAdmin, E as EMPTY_IVR_DRAFT, I as IvrDraftSchema } from "./ivr.config-CYf-fKNa.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number } from "../_libs/zod.mjs";
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
const getIvrDraft_createServerFn_handler = createServerRpc({
  id: "e7b149fb264f74ca595143db653047e05a9f77ad4b35c7a7b4d2bd34b902dc35",
  name: "getIvrDraft",
  filename: "src/lib/telephony/ivr.functions.ts"
}, (opts) => getIvrDraft.__executeServer(opts));
const getIvrDraft = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getIvrDraft_createServerFn_handler, async ({
  context
}) => {
  await requireTelephonyAdmin(context);
  const {
    data,
    error
  } = await context.supabase.from("callerdesk_ivr_settings").select("config, revision, sync_status, updated_at").eq("id", "primary").maybeSingle();
  if (error) throw new Error("Could not load IVR settings.");
  return {
    config: data ? IvrDraftSchema.parse(data.config) : EMPTY_IVR_DRAFT,
    revision: data?.revision ?? 0,
    syncStatus: "not_applied",
    updatedAt: data?.updated_at ?? null
  };
});
const saveIvrDraft_createServerFn_handler = createServerRpc({
  id: "c170b5c939e887ebe3322c5035b1020ab47da960f720bb564ea04c4f8d853650",
  name: "saveIvrDraft",
  filename: "src/lib/telephony/ivr.functions.ts"
}, (opts) => saveIvrDraft.__executeServer(opts));
const saveIvrDraft = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  config: IvrDraftSchema,
  revision: number().int().min(0)
}).parse(d)).handler(saveIvrDraft_createServerFn_handler, async ({
  context,
  data
}) => {
  await requireTelephonyAdmin(context);
  const row = {
    config: data.config,
    revision: data.revision + 1,
    sync_status: "not_applied",
    updated_by: context.userId,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const query = data.revision === 0 ? context.supabase.from("callerdesk_ivr_settings").insert({
    id: "primary",
    ...row
  }) : context.supabase.from("callerdesk_ivr_settings").update(row).eq("id", "primary").eq("revision", data.revision);
  const {
    data: saved,
    error
  } = await query.select("revision, updated_at").maybeSingle();
  if (error?.code === "23505" || !error && !saved) throw new Error("Another administrator saved changes. Reload settings before saving again.");
  if (error || !saved) throw new Error("IVR settings could not be saved.");
  return {
    revision: saved.revision,
    updatedAt: saved.updated_at,
    syncStatus: "not_applied"
  };
});
const checkCallerDeskApi_createServerFn_handler = createServerRpc({
  id: "d8d156737c93b048a2e95445e9c57065c3a617ec5087ba2685a183cbefae5e41",
  name: "checkCallerDeskApi",
  filename: "src/lib/telephony/ivr.functions.ts"
}, (opts) => checkCallerDeskApi.__executeServer(opts));
const checkCallerDeskApi = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(checkCallerDeskApi_createServerFn_handler, async ({
  context
}) => {
  await requireTelephonyAdmin(context);
  const authcode = process.env["CALLERDESK_AUTHCODE"];
  if (!authcode) return {
    ok: false,
    message: "CALLERDESK_AUTHCODE is missing."
  };
  const body = new FormData();
  body.set("authcode", authcode);
  try {
    const res = await fetch("https://app.callerdesk.io/api/getmemberlist_V2", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(15e3)
    });
    const payload = await res.json().catch(() => null);
    if (res.ok && String(payload?.type).toLowerCase() === "success" && Array.isArray(payload?.getmember)) return {
      ok: true,
      message: `CallerDesk API reachable; ${payload.getmember.length} members returned. No call placed.`
    };
    const message = String(payload?.message ?? "").toLowerCase();
    return {
      ok: false,
      message: message.includes("inactive") ? "CallerDesk reports that this API account is inactive." : "CallerDesk refused the member lookup. Verify the API account and auth code in the CallerDesk portal."
    };
  } catch {
    return {
      ok: false,
      message: "CallerDesk could not be reached. Retry the account check."
    };
  }
});
export {
  checkCallerDeskApi_createServerFn_handler,
  getIvrDraft_createServerFn_handler,
  saveIvrDraft_createServerFn_handler
};
