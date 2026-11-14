import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, d as any, s as string, _ as _enum } from "../_libs/zod.mjs";
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
const EventInput = object({
  applicationId: string().uuid(),
  event: any()
  // typed union enforced at call sites
});
const dispatchWorkflowEvent_createServerFn_handler = createServerRpc({
  id: "e495dab944592aa1efe4387d4e97ff38d2fdf8e0d47eb8bbf4cff069674f7784",
  name: "dispatchWorkflowEvent",
  filename: "src/lib/workflow/engine.functions.ts"
}, (opts) => dispatchWorkflowEvent.__executeServer(opts));
const dispatchWorkflowEvent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => EventInput.parse(i)).handler(dispatchWorkflowEvent_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    dispatchEvent
  } = await import("./engine.server-Clp4bFRY.mjs");
  const evt = {
    ...data.event,
    applicationId: data.applicationId
  };
  const next = await dispatchEvent(evt, context.userId);
  return next;
});
const getWorkflowState_createServerFn_handler = createServerRpc({
  id: "07a39f5a9f3ef7c4475945a068af14dd1a34903e237e4fe6962e0a316d78f61f",
  name: "getWorkflowState",
  filename: "src/lib/workflow/engine.functions.ts"
}, (opts) => getWorkflowState.__executeServer(opts));
const getWorkflowState = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(getWorkflowState_createServerFn_handler, async ({
  data,
  context
}) => {
  const [state, timers, automations, events] = await Promise.all([context.supabase.from("workflow_states").select("*").eq("application_id", data.applicationId).maybeSingle(), context.supabase.from("workflow_timers").select("*").eq("application_id", data.applicationId).in("status", ["running", "paused"]), context.supabase.from("workflow_automations").select("*").eq("application_id", data.applicationId).in("status", ["running", "paused"]), context.supabase.from("workflow_events").select("*").eq("application_id", data.applicationId).order("created_at", {
    ascending: false
  }).limit(200)]);
  return {
    state: state.data,
    timers: timers.data ?? [],
    automations: automations.data ?? [],
    events: events.data ?? []
  };
});
const controlTimer_createServerFn_handler = createServerRpc({
  id: "7a4da3468a8faefe0abed8d77c1ea9cab689d6335c68da1210c6c556c025f2ac",
  name: "controlTimer",
  filename: "src/lib/workflow/engine.functions.ts"
}, (opts) => controlTimer.__executeServer(opts));
const controlTimer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  timerId: string().uuid(),
  action: _enum(["pause", "resume", "cancel"])
}).parse(i)).handler(controlTimer_createServerFn_handler, async ({
  data,
  context
}) => {
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  if (data.action === "cancel") {
    await context.supabase.from("workflow_timers").update({
      status: "stopped"
    }).eq("id", data.timerId);
    return {
      ok: true
    };
  }
  if (data.action === "pause") {
    const {
      data: row2
    } = await context.supabase.from("workflow_timers").select("fires_at").eq("id", data.timerId).maybeSingle();
    const remaining = row2?.fires_at ? Math.max(0, new Date(row2.fires_at).getTime() - Date.now()) : 0;
    await context.supabase.from("workflow_timers").update({
      status: "paused",
      paused_at: nowIso,
      remaining_ms: remaining
    }).eq("id", data.timerId);
    return {
      ok: true
    };
  }
  const {
    data: row
  } = await context.supabase.from("workflow_timers").select("remaining_ms").eq("id", data.timerId).maybeSingle();
  const firesAt = new Date(Date.now() + (row?.remaining_ms ?? 0)).toISOString();
  await context.supabase.from("workflow_timers").update({
    status: "running",
    paused_at: null,
    remaining_ms: null,
    fires_at: firesAt
  }).eq("id", data.timerId);
  return {
    ok: true
  };
});
const controlAutomation_createServerFn_handler = createServerRpc({
  id: "c0dd0783f9d0e940177779c900d504ee31a2c43813e0385051022b44428b3dfe",
  name: "controlAutomation",
  filename: "src/lib/workflow/engine.functions.ts"
}, (opts) => controlAutomation.__executeServer(opts));
const controlAutomation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  automationId: string().uuid(),
  action: _enum(["pause", "resume", "stop"])
}).parse(i)).handler(controlAutomation_createServerFn_handler, async ({
  data,
  context
}) => {
  if (data.action === "stop") {
    await context.supabase.from("workflow_automations").update({
      status: "stopped",
      ended_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.automationId);
    return {
      ok: true
    };
  }
  await context.supabase.from("workflow_automations").update({
    status: data.action === "pause" ? "paused" : "running"
  }).eq("id", data.automationId);
  return {
    ok: true
  };
});
export {
  controlAutomation_createServerFn_handler,
  controlTimer_createServerFn_handler,
  dispatchWorkflowEvent_createServerFn_handler,
  getWorkflowState_createServerFn_handler
};
