import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as assertRole } from "./audit-DZHwwAr_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, s as string } from "../_libs/zod.mjs";
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
const listAuditLogs_createServerFn_handler = createServerRpc({
  id: "cf4cf9cddbb6aac45968f2c2632802af04240c2e67fd4aa06efe0025d51553b1",
  name: "listAuditLogs",
  filename: "src/lib/crm/audit.functions.ts"
}, (opts) => listAuditLogs.__executeServer(opts));
const listAuditLogs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  entityType: string().optional(),
  entityId: string().optional(),
  actorEmail: string().optional(),
  limit: number().default(200)
})).handler(listAuditLogs_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertRole(context.supabase, ["super_admin", "admin"]);
  let q = (await getAdmin()).from("audit_logs").select("*").order("created_at", {
    ascending: false
  });
  if (data.entityType) q = q.eq("entity_type", data.entityType);
  if (data.entityId) q = q.eq("entity_id", data.entityId);
  if (data.actorEmail) q = q.ilike("actor_email", `%${data.actorEmail}%`);
  const {
    data: rows,
    error
  } = await q.limit(Math.min(data.limit, 1e3));
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
export {
  listAuditLogs_createServerFn_handler
};
