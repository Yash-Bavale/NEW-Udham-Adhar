import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { L as LEAD_STATUSES_V2 } from "./lead-transitions-BnGgq5Kd.mjs";
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
const TransitionInput = object({
  leadId: string().uuid(),
  toStatus: _enum(LEAD_STATUSES_V2),
  reason: string().trim().min(1).max(2e3).optional()
});
const transitionLeadStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TransitionInput.parse(i)).handler(createSsrRpc("e6075969b838a5a062b1bd5d84660f2c78ae83af2027797a7ebb21ed9ce4e66a"));
const addManualNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  note: string().trim().min(1).max(2e3)
}).parse(i)).handler(createSsrRpc("b353c6087f9fac35710238d4e9182c7820cb9a4959bfd1ed2e5bea26bda5f87c"));
const listLeadEvents = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("aa7b88a0b56a13b4e82bf291bf5e989aba84058f6b65b3a64a648d0e1fd6d7ed"));
export {
  addManualNote,
  listLeadEvents,
  transitionLeadStatus
};
