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
const Input = object({
  destination: string().min(6).max(20),
  customerId: string().uuid().nullable().optional(),
  leadId: string().uuid().nullable().optional(),
  applicationId: string().uuid().nullable().optional()
});
const initiateClickToCall_createServerFn_handler = createServerRpc({
  id: "164d8ff79d8fc1ec17a4d9e9a666155e25c71f0f5d6495888c8f4284785af090",
  name: "initiateClickToCall",
  filename: "src/lib/telephony/outbound.functions.ts"
}, (opts) => initiateClickToCall.__executeServer(opts));
const initiateClickToCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => Input.parse(i)).handler(initiateClickToCall_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    normalizeIndianMobile
  } = await import("./phone.server-hLkvO94r.mjs");
  const destination = normalizeIndianMobile(data.destination);
  if (!destination) throw new Error("This phone number is not a valid Indian mobile number.");
  const {
    data: me,
    error: meErr
  } = await context.supabase.from("profiles").select("id, is_active, smartflo_agent_id, mobile").eq("id", context.userId).maybeSingle();
  if (meErr) throw new Error("Could not load your profile.");
  if (!me) throw new Error("Your employee profile was not found.");
  if (me.is_active !== true) throw new Error("Your account is not active, so you cannot place calls.");
  const mappedMemberId = typeof me.smartflo_agent_id === "string" && /^\d+$/.test(me.smartflo_agent_id.trim()) ? me.smartflo_agent_id.trim() : null;
  const agentMobile = normalizeIndianMobile(me.mobile);
  if (!agentMobile && !mappedMemberId) throw new Error("Your profile has no valid mobile number. Ask an admin to add the number you use in CallerDesk.");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  const since = new Date(Date.now() - 9e4).toISOString();
  const {
    data: dupe
  } = await db.from("telephony_calls").select("id, ref_id").eq("employee_id", context.userId).eq("direction", "outbound").eq("called_number", destination).in("status", ["ringing", "answered"]).gte("started_at", since).order("started_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (dupe) return {
    ok: true,
    alreadyInProgress: true,
    refId: dupe.ref_id ?? null
  };
  const {
    callerDeskClickToCall
  } = await import("./callerdesk.server-CUv6QXrh.mjs");
  const {
    campid,
    memberId
  } = await callerDeskClickToCall(agentMobile, mappedMemberId, destination);
  const refId = campid ?? `cd-${crypto.randomUUID()}`;
  const {
    data: row,
    error
  } = await db.from("telephony_calls").insert({
    provider: "callerdesk",
    call_id: refId,
    ref_id: refId,
    direction: "outbound",
    status: "ringing",
    last_event: "initiated",
    employee_id: context.userId,
    agent_id: memberId,
    customer_id: data.customerId ?? null,
    lead_id: data.leadId ?? null,
    application_id: data.applicationId ?? null,
    caller_number: agentMobile,
    called_number: destination,
    started_at: (/* @__PURE__ */ new Date()).toISOString()
  }).select("id").maybeSingle();
  if (error) {
    console.log(JSON.stringify({
      event: "callerdesk_click_to_call",
      stage: "insert",
      error: error.message
    }));
    return {
      ok: true,
      refId,
      recorded: false
    };
  }
  return {
    ok: true,
    refId,
    recorded: true,
    callRowId: row?.id ?? null
  };
});
export {
  initiateClickToCall_createServerFn_handler
};
