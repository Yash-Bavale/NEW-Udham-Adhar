import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, _ as _enum, s as string } from "../_libs/zod.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const Input = object({
  q: string().trim().max(120).default(""),
  activity: _enum(["Manufacturing", "Services", "Trading"]).nullable().optional(),
  limit: number().int().min(1).max(50).default(20)
});
const searchNicCodes_createServerFn_handler = createServerRpc({
  id: "fdd3883e9759e666d09c7eb23a1c3a7f7093102c8bbd05cc15ab961af17da738",
  name: "searchNicCodes",
  filename: "src/lib/onboarding/nic.functions.ts"
}, (opts) => searchNicCodes.__executeServer(opts));
const searchNicCodes = createServerFn({
  method: "POST"
}).inputValidator((i) => Input.parse(i)).handler(searchNicCodes_createServerFn_handler, async ({
  data
}) => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    const supabase = createClient(url, key, {
      auth: {
        storage: void 0,
        persistSession: false,
        autoRefreshToken: false
      }
    });
    const {
      data: rows,
      error
    } = await supabase.rpc("search_nic_codes", {
      q: data.q,
      activity: data.activity ?? void 0,
      limit_n: data.limit
    });
    if (error) {
      console.error("[nic.search] rpc error", error);
      return {
        results: [],
        error: "NIC search is temporarily unavailable. Please try again."
      };
    }
    const results = (rows ?? []).map((r) => ({
      code: String(r.code),
      description: String(r.description),
      section: r.section,
      division: r.division,
      group_code: r.group_code,
      class_code: r.class_code,
      activity_type: r.activity_type
    }));
    return {
      results,
      error: null
    };
  } catch (e) {
    console.error("[nic.search] crash", e);
    return {
      results: [],
      error: "Could not load NIC codes. Please try again."
    };
  }
});
export {
  searchNicCodes_createServerFn_handler
};
