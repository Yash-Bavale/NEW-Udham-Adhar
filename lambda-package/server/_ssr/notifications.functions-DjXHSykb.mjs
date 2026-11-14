import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, n as number, b as boolean } from "../_libs/zod.mjs";
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
const listMyNotifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  onlyUnread: boolean().optional(),
  limit: number().int().min(1).max(200).optional()
}).optional().parse(data ?? {})).handler(createSsrRpc("c69695ee8338dba9c4d350af69956b373e056ac03a34efabd4925a4ccb934d02"));
const getUnreadNotificationCount = createServerFn({
  method: "GET"
}).handler(createSsrRpc("f2c6767e9b0e44f145664eb145a7b3ca9e79901e5b7aee61df42c4a79789eb19"));
const markNotificationRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  id: string().uuid()
}).parse(data)).handler(createSsrRpc("d2dafb67d3372ec274e8ec9446326171333b85be156e5271cde802283e173467"));
const markAllNotificationsRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("45f96ec2adb10ed28feebac8ffa33b0f6c14b6015edc62b913abd3de40c396b9"));
const deleteNotification = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  id: string().uuid()
}).parse(data)).handler(createSsrRpc("bb2da9d9bd6ade64a5b503127144b735390dd5d8176b03710abef7013c2baa7b"));
async function createNotification(input) {
  const {
    error
  } = await (await getAdmin()).from("notifications").insert({
    user_id: input.user_id,
    kind: input.kind,
    title: input.title,
    body: input.body ?? null,
    href: input.href ?? null,
    entity_kind: input.entity_kind ?? null,
    entity_id: input.entity_id ?? null
  });
  if (error) throw new Error(error.message);
}
const getSidebarNotificationCounts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("e8e3212186e8b01b6252003eaebe4fd50796a9196fabeaa2834128b023c9610b"));
export {
  createNotification,
  deleteNotification,
  getSidebarNotificationCounts,
  getUnreadNotificationCount,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead
};
