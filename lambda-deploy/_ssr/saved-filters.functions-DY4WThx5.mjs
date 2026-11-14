import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean } from "../_libs/zod.mjs";
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
const FilterJsonSchema = object({
  search: string().max(200).optional(),
  status: string().max(40).optional(),
  assignedTo: string().uuid().nullable().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
}).partial();
const listSavedFilters_createServerFn_handler = createServerRpc({
  id: "b25dd7970bedbdbdff7b3c458bcbdfe08487a7961a260d1d7052e9649ea40b23",
  name: "listSavedFilters",
  filename: "src/lib/crm/saved-filters.functions.ts"
}, (opts) => listSavedFilters.__executeServer(opts));
const listSavedFilters = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listSavedFilters_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("saved_lead_filters").select("id, name, filter_json, is_default, created_at, updated_at").eq("user_id", userId).order("is_default", {
    ascending: false
  }).order("name", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
const CreateInput = object({
  name: string().trim().min(1).max(80),
  filter_json: FilterJsonSchema,
  is_default: boolean().optional()
});
const createSavedFilter_createServerFn_handler = createServerRpc({
  id: "4839d762df335f667e0b74d5aef107beacc0003ce45065551a880693e02b5f46",
  name: "createSavedFilter",
  filename: "src/lib/crm/saved-filters.functions.ts"
}, (opts) => createSavedFilter.__executeServer(opts));
const createSavedFilter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CreateInput.parse(i)).handler(createSavedFilter_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.is_default) {
    await supabase.from("saved_lead_filters").update({
      is_default: false
    }).eq("user_id", userId);
  }
  const {
    data: row,
    error
  } = await supabase.from("saved_lead_filters").insert({
    user_id: userId,
    name: data.name,
    filter_json: data.filter_json,
    is_default: data.is_default ?? false
  }).select("id").single();
  if (error) throw new Error(error.message);
  return {
    id: row.id
  };
});
const UpdateInput = object({
  id: string().uuid(),
  name: string().trim().min(1).max(80).optional(),
  filter_json: FilterJsonSchema.optional(),
  is_default: boolean().optional()
});
const updateSavedFilter_createServerFn_handler = createServerRpc({
  id: "a530035146e8ddda76500756657e0953cb7b950eee253147a9631c1ed73831f7",
  name: "updateSavedFilter",
  filename: "src/lib/crm/saved-filters.functions.ts"
}, (opts) => updateSavedFilter.__executeServer(opts));
const updateSavedFilter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpdateInput.parse(i)).handler(updateSavedFilter_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  if (data.is_default) {
    await supabase.from("saved_lead_filters").update({
      is_default: false
    }).eq("user_id", userId);
  }
  const patch = {};
  if (data.name !== void 0) patch.name = data.name;
  if (data.filter_json !== void 0) patch.filter_json = data.filter_json;
  if (data.is_default !== void 0) patch.is_default = data.is_default;
  const {
    error
  } = await supabase.from("saved_lead_filters").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteSavedFilter_createServerFn_handler = createServerRpc({
  id: "d3447064a35da20230170714e09da71fe23e6ab0445238d746cad37ec7383e5d",
  name: "deleteSavedFilter",
  filename: "src/lib/crm/saved-filters.functions.ts"
}, (opts) => deleteSavedFilter.__executeServer(opts));
const deleteSavedFilter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(deleteSavedFilter_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    error
  } = await supabase.from("saved_lead_filters").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createSavedFilter_createServerFn_handler,
  deleteSavedFilter_createServerFn_handler,
  listSavedFilters_createServerFn_handler,
  updateSavedFilter_createServerFn_handler
};
