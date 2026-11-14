import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, n as number, b as boolean, s as string } from "../_libs/zod.mjs";
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
const listMyNotifications_createServerFn_handler = createServerRpc({
  id: "c69695ee8338dba9c4d350af69956b373e056ac03a34efabd4925a4ccb934d02",
  name: "listMyNotifications",
  filename: "src/lib/crm/notifications.functions.ts"
}, (opts) => listMyNotifications.__executeServer(opts));
const listMyNotifications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  onlyUnread: boolean().optional(),
  limit: number().int().min(1).max(200).optional()
}).optional().parse(data ?? {})).handler(listMyNotifications_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  let q = supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", {
    ascending: false
  }).limit(data?.limit ?? 50);
  if (data?.onlyUnread) q = q.is("read_at", null);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
const getUnreadNotificationCount_createServerFn_handler = createServerRpc({
  id: "f2c6767e9b0e44f145664eb145a7b3ca9e79901e5b7aee61df42c4a79789eb19",
  name: "getUnreadNotificationCount",
  filename: "src/lib/crm/notifications.functions.ts"
}, (opts) => getUnreadNotificationCount.__executeServer(opts));
const getUnreadNotificationCount = createServerFn({
  method: "GET"
}).handler(getUnreadNotificationCount_createServerFn_handler, async () => {
  const {
    getRequest
  } = await import("./server-BvFUsV4_.mjs");
  const authHeader = getRequest()?.headers?.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!token || !url || !key) return {
    count: 0
  };
  const {
    createClient
  } = await import("../_libs/supabase__supabase-js.mjs");
  const supabase = createClient(url, key, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const {
    data,
    error: claimsError
  } = await supabase.auth.getClaims(token);
  const userId = data?.claims?.sub;
  if (claimsError || !userId) return {
    count: 0
  };
  const {
    count,
    error
  } = await supabase.from("notifications").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId).is("read_at", null);
  if (error) return {
    count: 0
  };
  return {
    count: count ?? 0
  };
});
const markNotificationRead_createServerFn_handler = createServerRpc({
  id: "d2dafb67d3372ec274e8ec9446326171333b85be156e5271cde802283e173467",
  name: "markNotificationRead",
  filename: "src/lib/crm/notifications.functions.ts"
}, (opts) => markNotificationRead.__executeServer(opts));
const markNotificationRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  id: string().uuid()
}).parse(data)).handler(markNotificationRead_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("notifications").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const markAllNotificationsRead_createServerFn_handler = createServerRpc({
  id: "45f96ec2adb10ed28feebac8ffa33b0f6c14b6015edc62b913abd3de40c396b9",
  name: "markAllNotificationsRead",
  filename: "src/lib/crm/notifications.functions.ts"
}, (opts) => markAllNotificationsRead.__executeServer(opts));
const markAllNotificationsRead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(markAllNotificationsRead_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("notifications").update({
    read_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId).is("read_at", null);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteNotification_createServerFn_handler = createServerRpc({
  id: "bb2da9d9bd6ade64a5b503127144b735390dd5d8176b03710abef7013c2baa7b",
  name: "deleteNotification",
  filename: "src/lib/crm/notifications.functions.ts"
}, (opts) => deleteNotification.__executeServer(opts));
const deleteNotification = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  id: string().uuid()
}).parse(data)).handler(deleteNotification_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("notifications").delete().eq("id", data.id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getSidebarNotificationCounts_createServerFn_handler = createServerRpc({
  id: "e8e3212186e8b01b6252003eaebe4fd50796a9196fabeaa2834128b023c9610b",
  name: "getSidebarNotificationCounts",
  filename: "src/lib/crm/notifications.functions.ts"
}, (opts) => getSidebarNotificationCounts.__executeServer(opts));
const getSidebarNotificationCounts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getSidebarNotificationCounts_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const admin = await getAdmin();
  const safeCount = (promise) => Promise.resolve(promise).then(({
    count,
    error
  }) => error ? 0 : count ?? 0).catch(() => 0);
  const [notifications, leads, orders, docReview, tasks, complaints, tickets, quarantine, refunds] = await Promise.all([safeCount(admin.from("notifications").select("id", {
    count: "exact",
    head: true
  }).eq("user_id", userId).is("read_at", null)), safeCount(admin.from("leads").select("id", {
    count: "exact",
    head: true
  }).in("status", ["new_lead", "lead_created"])), safeCount(admin.from("applications").select("id", {
    count: "exact",
    head: true
  }).eq("fulfillment_status", "awaiting_customer_form")), safeCount(admin.from("documents").select("id", {
    count: "exact",
    head: true
  }).eq("status", "pending")), safeCount(admin.from("tasks").select("id", {
    count: "exact",
    head: true
  }).eq("is_completed", false)), safeCount(admin.from("complaints").select("id", {
    count: "exact",
    head: true
  }).not("status", "in", '("resolved","closed")')), safeCount(admin.from("support_tickets").select("id", {
    count: "exact",
    head: true
  }).not("status", "in", '("resolved","closed")')), safeCount(admin.from("inbound_email_quarantine").select("id", {
    count: "exact",
    head: true
  }).is("reviewed_at", null)), safeCount(admin.from("refund_requests").select("id", {
    count: "exact",
    head: true
  }).in("status", ["pending", "info_needed", "escalated"]))]);
  return {
    notifications,
    leads,
    orders,
    docReview,
    tasks,
    complaints,
    tickets,
    quarantine,
    refunds
  };
});
export {
  deleteNotification_createServerFn_handler,
  getSidebarNotificationCounts_createServerFn_handler,
  getUnreadNotificationCount_createServerFn_handler,
  listMyNotifications_createServerFn_handler,
  markAllNotificationsRead_createServerFn_handler,
  markNotificationRead_createServerFn_handler
};
