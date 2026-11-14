import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, r as record, f as unknown, s as string, _ as _enum } from "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
const APPLICATION_STATUSES = ["awaiting_payment", "payment_received", "details_pending", "form_submitted", "documents_pending", "documents_submitted", "under_review", "under_process", "certificate_uploaded", "certificate_ready", "completed", "on_hold", "rejected", "cancelled", "refund_pending", "refunded", "consultation_pending", "consultation_scheduled"];
const Input = object({
  applicationId: string().uuid(),
  toStatus: _enum(APPLICATION_STATUSES),
  reason: string().max(500).optional(),
  metadata: record(string(), unknown()).optional(),
  /** Skip the allow-list check (system cascades only). */
  force: boolean().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => Input.parse(input)).handler(createSsrRpc("f7af9d99116d6a3673b6e094ea6763e425ad86f5f4998ca5b25024dd30c53683"));
const HistoryInput = object({
  applicationId: string().uuid()
});
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => HistoryInput.parse(input)).handler(createSsrRpc("e63a84739fbb7771c5979a87913ccc06c65fba345379fadf0f3be4c007a00d1d"));
const ALLOWED = {
  awaiting_payment: ["payment_received", "cancelled"],
  payment_received: ["details_pending", "consultation_pending"],
  details_pending: ["form_submitted", "on_hold"],
  form_submitted: ["documents_pending", "under_review", "completed"],
  documents_pending: ["documents_submitted", "on_hold"],
  documents_submitted: ["under_review"],
  under_review: ["under_process", "rejected", "on_hold"],
  under_process: ["certificate_uploaded", "rejected", "on_hold"],
  certificate_uploaded: ["certificate_ready"],
  certificate_ready: ["completed"],
  completed: [],
  on_hold: ["under_review", "under_process", "cancelled"],
  rejected: ["refund_pending"],
  cancelled: ["refund_pending"],
  refund_pending: ["refunded"],
  refunded: [],
  consultation_pending: ["consultation_scheduled", "cancelled"],
  consultation_scheduled: ["details_pending", "completed"]
};
const TERMINAL_OK = ["on_hold", "cancelled", "refund_pending"];
async function transitionStatusSystem(input) {
  if (!APPLICATION_STATUSES.includes(input.toStatus)) {
    return { ok: false, reason: `Unknown status: ${input.toStatus}` };
  }
  const { data: app, error: fetchErr } = await supabaseAdmin.from("applications").select("id, application_status").eq("id", input.applicationId).maybeSingle();
  if (fetchErr) return { ok: false, reason: fetchErr.message };
  if (!app) return { ok: false, reason: "Application not found" };
  const from = app.application_status;
  const to = input.toStatus;
  if (from === to) return { ok: true, noop: true, from, to };
  if (!input.force) {
    const allowed = ALLOWED[from] ?? [];
    if (!allowed.includes(to) && !TERMINAL_OK.includes(to)) {
      return { ok: false, reason: `Invalid transition ${from} → ${to}` };
    }
  }
  const { error: updErr } = await supabaseAdmin.from("applications").update({ application_status: to, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", input.applicationId);
  if (updErr) return { ok: false, reason: updErr.message };
  await supabaseAdmin.from("application_status_history").insert({
    application_id: input.applicationId,
    from_status: from,
    to_status: to,
    reason: input.reason ?? null,
    actor_id: input.actorId ?? null,
    metadata: input.metadata ?? {}
  });
  return { ok: true, noop: false, from, to };
}
export {
  transitionStatusSystem
};
