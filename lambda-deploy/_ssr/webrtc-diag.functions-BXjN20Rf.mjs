import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
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
const DIAG_TYPE = "webrtc_diag";
const DIAG_ROLES = ["super_admin", "admin"];
async function isDiagAdmin(ctx) {
  for (const r of DIAG_ROLES) {
    const {
      data
    } = await ctx.supabase.rpc("has_role", {
      _user_id: ctx.userId,
      _role: r
    });
    if (data === true) return true;
  }
  return false;
}
async function requireSuperAdmin(ctx) {
  if (!await isDiagAdmin(ctx)) throw new Error("Only admins can use browser phone diagnostics.");
}
const EventSchema = object({
  event: string().min(1).max(40),
  state: string().max(40).optional(),
  sipCode: number().int().optional().nullable(),
  reason: string().max(500).optional().nullable(),
  number: string().max(20).optional().nullable(),
  detail: string().max(1e3).optional().nullable()
});
const logWebRtcEvent_createServerFn_handler = createServerRpc({
  id: "dd7d46b7ea327b08659aa3a559ab2cfe54293fef562482d2e87559d88c4790fb",
  name: "logWebRtcEvent",
  filename: "src/lib/telephony/webrtc-diag.functions.ts"
}, (opts) => logWebRtcEvent.__executeServer(opts));
const logWebRtcEvent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => EventSchema.parse(d)).handler(logWebRtcEvent_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireSuperAdmin(context);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    redact
  } = await import("./callerdesk-webrtc.config-CFRtE2mu.mjs");
  const secrets = [process.env["CALLERDESK_SIP_PASSWORD"], process.env["CALLERDESK_AUTHCODE"], process.env["CALLERDESK_WEBHOOK_TOKEN"]];
  const safe = {
    ...data,
    reason: data.reason ? redact(data.reason, secrets) : data.reason,
    detail: data.detail ? redact(data.detail, secrets) : data.detail,
    number: data.number ? redact(data.number, secrets) : data.number
  };
  const {
    error
  } = await supabaseAdmin.from("activity_logs").insert({
    activity_type: DIAG_TYPE,
    activity_description: `${safe.event}${safe.sipCode ? ` (${safe.sipCode})` : ""}${safe.reason ? `: ${safe.reason}` : ""}`.slice(0, 500),
    user_id: context.userId,
    metadata: {
      ...safe,
      userAgent: void 0
    }
  });
  if (error) throw new Error("Browser phone test log could not be saved.");
  return {
    ok: true
  };
});
const listWebRtcEvents_createServerFn_handler = createServerRpc({
  id: "b334d85b2e2ac82f4b29429a685679c429122c575d02ac976438df598dc74425",
  name: "listWebRtcEvents",
  filename: "src/lib/telephony/webrtc-diag.functions.ts"
}, (opts) => listWebRtcEvents.__executeServer(opts));
const listWebRtcEvents = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listWebRtcEvents_createServerFn_handler, async ({
  context
}) => {
  await requireSuperAdmin(context);
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("activity_logs").select("id, created_at, activity_description, metadata").eq("activity_type", DIAG_TYPE).order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const troubleshootWebRtc_createServerFn_handler = createServerRpc({
  id: "59672288ea477c51778b4b3b38d79bd5f6259e5785a195f4834e47e90c5b14c2",
  name: "troubleshootWebRtc",
  filename: "src/lib/telephony/webrtc-diag.functions.ts"
}, (opts) => troubleshootWebRtc.__executeServer(opts));
const troubleshootWebRtc = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  status: string().max(200),
  details: string().max(3e3)
}).parse(d)).handler(troubleshootWebRtc_createServerFn_handler, async ({
  data,
  context
}) => {
  await requireSuperAdmin(context);
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured.");
  const {
    supabaseAdmin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: rows
  } = await supabaseAdmin.from("activity_logs").select("created_at, activity_description").eq("activity_type", DIAG_TYPE).order("created_at", {
    ascending: false
  }).limit(20);
  const recent = (rows ?? []).map((r) => `${r.created_at} ${r.activity_description}`).join("\n") || "none";
  const instructions = `You troubleshoot a CRM browser phone: SIP.js over WSS to CallerDesk's Asterisk (wss://app.callerdesk.io:5000/ws), reached through FortiClient VPN on the agent's PC. Outbound calls INVITE sip:<digits>@app.callerdesk.io. Give a short likely cause, then 3-6 numbered concrete next steps (what to check in the CRM, the VPN, the browser, or what to ask CallerDesk support). Interpret SIP codes precisely (401/403/404/408/480/486/488/503 etc). Never ask for passwords. Plain language, under 200 words.`;
  const input = `Status: ${data.status}
Details: ${data.details}
Recent logged events (newest first):
${recent}`;
  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch"
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      instructions,
      input,
      stream: true,
      store: false,
      reasoning: {
        effort: "low"
      }
    })
  });
  if (!res.ok || !res.body) {
    let msg = `AI request failed (${res.status}).`;
    try {
      const j = await res.json();
      msg = j?.error?.message ?? j?.message ?? msg;
    } catch {
    }
    if (res.status === 402) msg = "AI credits are used up. Add credits in Settings → Plans & credits.";
    if (res.status === 429) msg = "AI is busy right now. Try again in a minute.";
    throw new Error(msg);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "", text = "";
  for (; ; ) {
    const {
      value,
      done
    } = await reader.read();
    if (done) break;
    buf += dec.decode(value, {
      stream: true
    });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const ev = JSON.parse(payload);
        if (ev.type === "response.output_text.delta" && typeof ev.delta === "string") text += ev.delta;
        if (ev.type === "response.failed" || ev.type === "error") throw new Error(ev?.response?.error?.message ?? ev?.message ?? "AI request failed.");
      } catch (e) {
        if (e instanceof Error && !(e instanceof SyntaxError)) throw e;
      }
    }
  }
  return {
    advice: text.trim() || "No advice returned."
  };
});
export {
  listWebRtcEvents_createServerFn_handler,
  logWebRtcEvent_createServerFn_handler,
  troubleshootWebRtc_createServerFn_handler
};
