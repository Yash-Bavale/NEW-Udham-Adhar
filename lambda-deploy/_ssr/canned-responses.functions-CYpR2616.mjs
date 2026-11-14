import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, b as boolean, n as number } from "../_libs/zod.mjs";
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
const listCannedResponses_createServerFn_handler = createServerRpc({
  id: "37c656f57d1d1c6a759771d425548dbc040e60e526bf500057efb4875e1312e1",
  name: "listCannedResponses",
  filename: "src/lib/tickets/canned-responses.functions.ts"
}, (opts) => listCannedResponses.__executeServer(opts));
const listCannedResponses = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  activeOnly: boolean().default(false),
  category: string().optional()
}).parse(i ?? {})).handler(listCannedResponses_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  let q = admin.from("canned_responses").select("id, title, body, category, sort_order, is_active, created_at, updated_at").order("sort_order", {
    ascending: true
  }).order("title", {
    ascending: true
  });
  if (data.activeOnly) q = q.eq("is_active", true);
  if (data.category) q = q.eq("category", data.category);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const createCannedResponse_createServerFn_handler = createServerRpc({
  id: "3cbf4afcd8a68e686caf817245b6a2b81485697d3d4d0a8d3163d94b945b7562",
  name: "createCannedResponse",
  filename: "src/lib/tickets/canned-responses.functions.ts"
}, (opts) => createCannedResponse.__executeServer(opts));
const createCannedResponse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  title: string().trim().min(2).max(100),
  body: string().trim().min(2).max(8e3),
  category: string().trim().max(50).optional(),
  sort_order: number().int().min(0).default(0),
  is_active: boolean().default(true)
}).parse(i)).handler(createCannedResponse_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    data: row,
    error
  } = await admin.from("canned_responses").insert({
    title: data.title,
    body: data.body,
    category: data.category ?? null,
    sort_order: data.sort_order,
    is_active: data.is_active,
    created_by: context.userId
  }).select("id").single();
  if (error) throw new Error(error.message);
  return row;
});
const updateCannedResponse_createServerFn_handler = createServerRpc({
  id: "6de72b3689721a7d175e2b0854746cc92c3c581cb89aa196d336470dc7f3afa3",
  name: "updateCannedResponse",
  filename: "src/lib/tickets/canned-responses.functions.ts"
}, (opts) => updateCannedResponse.__executeServer(opts));
const updateCannedResponse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  title: string().trim().min(2).max(100).optional(),
  body: string().trim().min(2).max(8e3).optional(),
  category: string().trim().max(50).nullable().optional(),
  sort_order: number().int().min(0).optional(),
  is_active: boolean().optional()
}).parse(i)).handler(updateCannedResponse_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    id,
    ...patch
  } = data;
  const {
    error
  } = await admin.from("canned_responses").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteCannedResponse_createServerFn_handler = createServerRpc({
  id: "af4259d0703d838f4e2a4de7bf83bd244dff09349ac5961c5c1dcee10706dd58",
  name: "deleteCannedResponse",
  filename: "src/lib/tickets/canned-responses.functions.ts"
}, (opts) => deleteCannedResponse.__executeServer(opts));
const deleteCannedResponse = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(deleteCannedResponse_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    error
  } = await admin.from("canned_responses").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createCannedResponse_createServerFn_handler,
  deleteCannedResponse_createServerFn_handler,
  listCannedResponses_createServerFn_handler,
  updateCannedResponse_createServerFn_handler
};
