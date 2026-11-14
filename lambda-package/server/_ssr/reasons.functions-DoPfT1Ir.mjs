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
const listCloseReasons_createServerFn_handler = createServerRpc({
  id: "cf6e6729a8ff40c24ef20d7be8c0c6bd9c885baa44053e5f2a3fb94965cf62b6",
  name: "listCloseReasons",
  filename: "src/lib/orders/actions/reasons.functions.ts"
}, (opts) => listCloseReasons.__executeServer(opts));
const listCloseReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listCloseReasons_createServerFn_handler, async ({
  context
}) => {
  const admin = (await import("./client.server-3kDCe7R3.mjs")).supabaseAdmin;
  const {
    data: wfReasons
  } = await admin.from("workflow_closure_reasons").select("id, code, label, description, sort_order, is_active").eq("is_active", true).order("sort_order");
  const mappedWf = (wfReasons ?? []).map((r, idx) => ({
    id: r.id,
    category: "Closure Reasons",
    number: idx + 1,
    label: r.label,
    standard_reply: r.description || null,
    sort_order: r.sort_order ?? (idx + 1) * 10
  }));
  try {
    const {
      data: legacyData
    } = await context.supabase.rpc("list_order_close_reasons");
    const legacy = legacyData ?? [];
    if (mappedWf.length > 0) {
      const wfLabels = new Set(mappedWf.map((w) => w.label.toLowerCase().trim()));
      const filteredLegacy = legacy.filter((l) => !wfLabels.has(l.label.toLowerCase().trim()));
      return [...mappedWf, ...filteredLegacy];
    }
    return legacy;
  } catch {
    return mappedWf;
  }
});
export {
  listCloseReasons_createServerFn_handler
};
