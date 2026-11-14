import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, _ as _enum } from "../_libs/zod.mjs";
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
const createFollowUp_createServerFn_handler = createServerRpc({
  id: "ff3f815eb40dc4cf12a0087b8034090c17d4ad68f387fbde80aeb24cbf8e22a2",
  name: "createFollowUp",
  filename: "src/lib/crm/follow-ups.functions.ts"
}, (opts) => createFollowUp.__executeServer(opts));
const createFollowUp = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  scheduledAt: string().min(1),
  // ISO string from <input type=datetime-local>
  reason: _enum(["call_back", "documents_pending", "refund_followup", "general", "other"]),
  reasonNote: string().trim().max(500).optional(),
  assignedTo: string().uuid().nullable().optional()
}).parse(i)).handler(createFollowUp_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    data: lead
  } = await admin.from("leads").select("customer_id").eq("id", data.leadId).maybeSingle();
  const {
    data: app
  } = await admin.from("applications").select("id").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    error
  } = await admin.from("follow_ups").insert({
    lead_id: data.leadId,
    customer_id: lead?.customer_id ?? null,
    application_id: app?.id ?? null,
    scheduled_at: new Date(data.scheduledAt).toISOString(),
    reason: data.reason,
    reason_note: data.reasonNote?.trim() || null,
    assigned_to: data.assignedTo ?? null,
    created_by: context.userId
  });
  if (error) throw new Error(error.message);
  await admin.from("leads").update({
    next_followup_at: new Date(data.scheduledAt).toISOString(),
    followup_note: data.reasonNote?.trim() || data.reason
  }).eq("id", data.leadId);
  return {
    ok: true
  };
});
const listFollowUpsForLead_createServerFn_handler = createServerRpc({
  id: "89e64d3af38c4fe97260d131faccea2fbda2dceacc78515f4d22adb466e2b54d",
  name: "listFollowUpsForLead",
  filename: "src/lib/crm/follow-ups.functions.ts"
}, (opts) => listFollowUpsForLead.__executeServer(opts));
const listFollowUpsForLead = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(listFollowUpsForLead_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    data: rows,
    error
  } = await admin.from("follow_ups").select("id, scheduled_at, reason, reason_note, assigned_to, is_completed, completed_at, completion_note, created_at").eq("lead_id", data.leadId).order("scheduled_at", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
const completeFollowUp_createServerFn_handler = createServerRpc({
  id: "c8ae2564d5472e3ea5314c853ecf9d3784b7d02bd722a3499ed370c7bdd1e4d7",
  name: "completeFollowUp",
  filename: "src/lib/crm/follow-ups.functions.ts"
}, (opts) => completeFollowUp.__executeServer(opts));
const completeFollowUp = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  note: string().trim().max(2e3).optional()
}).parse(i)).handler(completeFollowUp_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    error
  } = await admin.from("follow_ups").update({
    is_completed: true,
    completed_at: (/* @__PURE__ */ new Date()).toISOString(),
    completion_note: data.note ?? null
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  completeFollowUp_createServerFn_handler,
  createFollowUp_createServerFn_handler,
  listFollowUpsForLead_createServerFn_handler
};
