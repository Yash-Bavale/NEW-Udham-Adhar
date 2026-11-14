import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
let cachedWorkflow = null;
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
function tallyBy(rows, key) {
  const out = {};
  for (const r of rows) {
    const v = String(r[key] ?? "unknown");
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}
const getWorkflowDashboard_createServerFn_handler = createServerRpc({
  id: "f0e7d80f063c91dc5897e4c06084e2a959baadc70f5e772b1e16d17f27df34bb",
  name: "getWorkflowDashboard",
  filename: "src/lib/workflow/dashboard.functions.ts"
}, (opts) => getWorkflowDashboard.__executeServer(opts));
const getWorkflowDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getWorkflowDashboard_createServerFn_handler, async () => {
  if (cachedWorkflow && Date.now() < cachedWorkflow.expiresAt) {
    return cachedWorkflow.data;
  }
  const admin = await getAdmin();
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const in1hIso = new Date(Date.now() + 60 * 6e4).toISOString();
  const dayAgoIso = new Date(Date.now() - 24 * 36e5).toISOString();
  const [statesRes, timersRes, autosRes, emailsRes] = await Promise.all([admin.from("workflow_states").select("stage,status,paused,active_ticket_id"), admin.from("workflow_timers").select("kind,status,fires_at").in("status", ["running", "paused"]), admin.from("workflow_automations").select("code,status").in("status", ["running", "paused"]), admin.from("email_send_log").select("message_id,status,created_at").gte("created_at", dayAgoIso).limit(2e3)]);
  const stateRows = statesRes.data ?? [];
  const timerRows = timersRes.data ?? [];
  const autoRows = autosRes.data ?? [];
  const emailRows = emailsRes.data ?? [];
  const latestByMsg = /* @__PURE__ */ new Map();
  for (const r of emailRows) {
    if (!r.message_id) continue;
    const prev = latestByMsg.get(r.message_id);
    if (!prev || r.created_at > prev) latestByMsg.set(r.message_id, r.status ?? "unknown");
  }
  const statuses = Array.from(latestByMsg.values());
  const count = (s) => statuses.filter((v) => v === s).length;
  const runningTimers = timerRows.filter((t) => t.status === "running");
  const dueNext1h = runningTimers.filter((t) => t.fires_at && t.fires_at >= nowIso && t.fires_at <= in1hIso).length;
  const result = {
    states: {
      total: stateRows.length,
      paused: stateRows.filter((r) => r.paused).length,
      byStage: tallyBy(stateRows, "stage"),
      byStatus: tallyBy(stateRows, "status"),
      activeTickets: stateRows.filter((r) => !!r.active_ticket_id).length
    },
    timers: {
      running: runningTimers.length,
      paused: timerRows.filter((t) => t.status === "paused").length,
      dueNext1h,
      byKind: tallyBy(timerRows, "kind")
    },
    automations: {
      running: autoRows.filter((a) => a.status === "running").length,
      paused: autoRows.filter((a) => a.status === "paused").length,
      byCode: tallyBy(autoRows, "code")
    },
    emails24h: {
      total: statuses.length,
      sent: count("sent"),
      failed: count("dlq") + count("failed") + count("bounced") + count("complained"),
      suppressed: count("suppressed"),
      pending: count("pending")
    },
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  cachedWorkflow = {
    expiresAt: Date.now() + 3e4,
    data: result
  };
  return result;
});
export {
  getWorkflowDashboard_createServerFn_handler
};
