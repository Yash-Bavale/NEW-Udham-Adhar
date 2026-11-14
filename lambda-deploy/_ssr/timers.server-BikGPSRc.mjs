import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function armTimer(input) {
  const firesAt = new Date(Date.now() + input.firesInMinutes * 6e4).toISOString();
  await supabaseAdmin.from("workflow_timers").update({ status: "cancelled" }).eq("application_id", input.applicationId).eq("kind", input.kind).in("status", ["running", "paused"]);
  const { data, error } = await supabaseAdmin.from("workflow_timers").insert({
    application_id: input.applicationId,
    kind: input.kind,
    status: "running",
    fires_at: firesAt,
    recurring: input.recurring ?? false,
    custom_interval_minutes: input.intervalMinutes ?? null,
    payload: input.payload ?? {},
    dedup_key: input.dedupKey ?? null
  }).select("id, fires_at").single();
  if (error) throw new Error(`armTimer(${input.kind}): ${error.message}`);
  return data;
}
async function cancelTimers(applicationId, kinds) {
  let q = supabaseAdmin.from("workflow_timers").update({ status: "cancelled" }).eq("application_id", applicationId).in("status", ["running", "paused"]);
  if (kinds && kinds.length > 0) q = q.in("kind", kinds);
  const { error } = await q;
  if (error) throw new Error(`cancelTimers: ${error.message}`);
}
export {
  armTimer,
  cancelTimers
};
