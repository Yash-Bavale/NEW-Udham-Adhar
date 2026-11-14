import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { ACCESS_MESSAGE } from "./callerdesk-webrtc.config-CFRtE2mu.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number } from "../_libs/zod.mjs";
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
const getWebRtcStatus_createServerFn_handler = createServerRpc({
  id: "29a99c679947ba05957c8271fb172fd2e5c439cb712a41fcd78059f308cf01b8",
  name: "getWebRtcStatus",
  filename: "src/lib/telephony/callerdesk-webrtc.functions.ts"
}, (opts) => getWebRtcStatus.__executeServer(opts));
const getWebRtcStatus = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getWebRtcStatus_createServerFn_handler, async ({
  context
}) => {
  const {
    accessFor,
    loadAccount
  } = await import("./callerdesk-webrtc.server-Cdgo40_z.mjs");
  const a = accessFor(context.userId, await loadAccount(context.userId));
  if (!a.authorized) return {
    authorized: false
  };
  return {
    authorized: true,
    enabled: a.enabled,
    missing: a.missing,
    canRegister: a.canRegister,
    reason: a.reason,
    message: ACCESS_MESSAGE[a.reason]
  };
});
const getWebRtcSession_createServerFn_handler = createServerRpc({
  id: "ce294dc403958b755c35bbbda8af5e1651efab537079d4b894d07b29b5d21200",
  name: "getWebRtcSession",
  filename: "src/lib/telephony/callerdesk-webrtc.functions.ts"
}, (opts) => getWebRtcSession.__executeServer(opts));
const getWebRtcSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(getWebRtcSession_createServerFn_handler, async ({
  context
}) => {
  const {
    loadAccount,
    readEnv,
    resolveSession
  } = await import("./callerdesk-webrtc.server-Cdgo40_z.mjs");
  try {
    return await resolveSession(context.userId, await loadAccount(context.userId), readEnv());
  } catch (e) {
    const r = e.message;
    throw new Error(ACCESS_MESSAGE[r] ?? "Browser phone credentials could not be loaded. Ask an admin to re-save your SIP login.");
  }
});
const initiateWebRtcCall_createServerFn_handler = createServerRpc({
  id: "2254d21959939138c2885aeea81793d8c2b2d400be0d57f36de4f8d3bc6d2219",
  name: "initiateWebRtcCall",
  filename: "src/lib/telephony/callerdesk-webrtc.functions.ts"
}, (opts) => initiateWebRtcCall.__executeServer(opts));
const initiateWebRtcCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  number: string().regex(/^\+?\d{8,15}$/),
  customerId: string().uuid().nullable().optional(),
  leadId: string().uuid().nullable().optional(),
  applicationId: string().uuid().nullable().optional()
}).parse(d)).handler(initiateWebRtcCall_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    accessFor,
    loadAccount
  } = await import("./callerdesk-webrtc.server-Cdgo40_z.mjs");
  if (!accessFor(context.userId, await loadAccount(context.userId)).canRegister) throw new Error("Browser calling is not available for your account.");
  const {
    normalizeIndianMobile,
    lookupCaller
  } = await import("./phone.server-hLkvO94r.mjs");
  const mobile = normalizeIndianMobile(data.number);
  const row = {
    provider: "callerdesk",
    direction: "outbound",
    status: "ringing",
    last_event: "browser_dial",
    call_id: `webrtc:${crypto.randomUUID()}`,
    employee_id: context.userId,
    called_number: mobile ?? data.number.replace(/\D/g, ""),
    started_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (data.customerId || data.leadId || data.applicationId) {
    Object.assign(row, {
      customer_id: data.customerId ?? null,
      lead_id: data.leadId ?? null,
      application_id: data.applicationId ?? null
    });
  } else if (mobile) {
    try {
      const m = await lookupCaller(mobile);
      if (m.orders.length === 1) row.application_id = m.orders[0].id;
      else if (!m.orders.length && m.lead) row.lead_id = m.lead.id;
    } catch {
    }
  }
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: saved,
    error
  } = await supabaseAdmin.from("telephony_calls").insert(row).select("id").single();
  if (error) throw new Error("Could not record this call. Please retry.");
  return {
    callRowId: saved.id
  };
});
const endWebRtcCall_createServerFn_handler = createServerRpc({
  id: "06b5e65179bc3fbf45e5866dc6006ec12b0f38ae33fd2e3b4d1bdfa03c6d6f62",
  name: "endWebRtcCall",
  filename: "src/lib/telephony/callerdesk-webrtc.functions.ts"
}, (opts) => endWebRtcCall.__executeServer(opts));
const endWebRtcCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  callRowId: string().uuid(),
  answeredAt: number().int().positive().nullable()
}).parse(d)).handler(endWebRtcCall_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const now = /* @__PURE__ */ new Date();
  const patch = {
    status: data.answeredAt ? "ended" : "missed",
    last_event: "browser_ended",
    ended_at: now.toISOString(),
    updated_at: now.toISOString()
  };
  if (data.answeredAt) {
    patch.answered_at = new Date(data.answeredAt).toISOString();
    patch.duration_seconds = Math.max(0, Math.round((now.getTime() - data.answeredAt) / 1e3));
  }
  await supabaseAdmin.from("telephony_calls").update(patch).eq("id", data.callRowId).eq("employee_id", context.userId).in("status", ["ringing", "answered"]);
  return {
    ok: true
  };
});
const lookupIncomingCaller_createServerFn_handler = createServerRpc({
  id: "0dfd70de5fb5f7a6a39736984be95c5bda5f56ea5fee84caab42019e2a0ec5e0",
  name: "lookupIncomingCaller",
  filename: "src/lib/telephony/callerdesk-webrtc.functions.ts"
}, (opts) => lookupIncomingCaller.__executeServer(opts));
const lookupIncomingCaller = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  number: string().max(40)
}).parse(d)).handler(lookupIncomingCaller_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    data: staff
  } = await context.supabase.rpc("has_any_staff_role", {
    _user_id: context.userId
  });
  if (!staff) throw new Error("Forbidden");
  const {
    lookupCaller
  } = await import("./phone.server-hLkvO94r.mjs");
  return lookupCaller(data.number);
});
const recordInboundWebRtcCall_createServerFn_handler = createServerRpc({
  id: "e1a2200e76ec3de9445b40eb5525e6673c81b4f21b5ef049052ae61f0b5ebf7b",
  name: "recordInboundWebRtcCall",
  filename: "src/lib/telephony/callerdesk-webrtc.functions.ts"
}, (opts) => recordInboundWebRtcCall.__executeServer(opts));
const recordInboundWebRtcCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  key: string().uuid(),
  number: string().max(40),
  applicationId: string().uuid().nullable()
}).parse(d)).handler(recordInboundWebRtcCall_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    accessFor,
    loadAccount
  } = await import("./callerdesk-webrtc.server-Cdgo40_z.mjs");
  if (!accessFor(context.userId, await loadAccount(context.userId)).canRegister) throw new Error("Browser calling is not available for your account.");
  const {
    normalizeIndianMobile,
    lookupCaller
  } = await import("./phone.server-hLkvO94r.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const db = supabaseAdmin;
  const callId = `webrtc:in:${data.key}`;
  const {
    data: found
  } = await db.from("telephony_calls").select("id, employee_id").eq("call_id", callId).maybeSingle();
  const mobile = normalizeIndianMobile(data.number);
  const link = {};
  if (mobile) {
    try {
      const r = await lookupCaller(mobile);
      const chosen = data.applicationId ? r.orders.find((o) => o.id === data.applicationId) : r.orders.length === 1 ? r.orders[0] : null;
      if (chosen) link.application_id = chosen.id;
      if (r.lead) link.lead_id = r.lead.id;
    } catch {
    }
  }
  if (found) {
    if (found.employee_id !== context.userId) throw new Error("Forbidden");
    if (Object.keys(link).length) await db.from("telephony_calls").update({
      ...link,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", found.id);
    return {
      callRowId: found.id
    };
  }
  const row = {
    provider: "callerdesk",
    direction: "inbound",
    status: "ringing",
    last_event: "browser_ringing",
    call_id: callId,
    employee_id: context.userId,
    caller_number: mobile ?? data.number.replace(/\D/g, ""),
    started_at: (/* @__PURE__ */ new Date()).toISOString(),
    ...link
  };
  const {
    data: saved,
    error
  } = await db.from("telephony_calls").upsert(row, {
    onConflict: "call_id",
    ignoreDuplicates: true
  }).select("id").maybeSingle();
  if (error) throw new Error("Could not record this call.");
  if (saved) return {
    callRowId: saved.id
  };
  const {
    data: again
  } = await db.from("telephony_calls").select("id").eq("call_id", callId).single();
  return {
    callRowId: again.id
  };
});
export {
  endWebRtcCall_createServerFn_handler,
  getWebRtcSession_createServerFn_handler,
  getWebRtcStatus_createServerFn_handler,
  initiateWebRtcCall_createServerFn_handler,
  lookupIncomingCaller_createServerFn_handler,
  recordInboundWebRtcCall_createServerFn_handler
};
