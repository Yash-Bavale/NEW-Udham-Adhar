import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
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
const listOrderTickets_createServerFn_handler = createServerRpc({
  id: "8446842926479d9bb065c40b7124967c797ca4f270272cc9e07577d7043a6ea3",
  name: "listOrderTickets",
  filename: "src/lib/tickets/list-order-tickets.functions.ts"
}, (opts) => listOrderTickets.__executeServer(opts));
const listOrderTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(listOrderTickets_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: rows,
    error
  } = await context.supabase.from("support_tickets").select("id, ticket_number, subject, status, priority, reopened_count, last_closed_at, created_at, updated_at").eq("application_id", data.orderId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return {
    tickets: rows ?? []
  };
});
export {
  listOrderTickets_createServerFn_handler
};
