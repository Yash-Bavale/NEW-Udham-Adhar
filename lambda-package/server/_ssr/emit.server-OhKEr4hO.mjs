import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const STORED_KINDS = /* @__PURE__ */ new Set([
  "hot_order_callback",
  "hot_order_alert",
  "order_reminder",
  "order_assigned"
]);
function isStoredNotificationKind(kind) {
  return STORED_KINDS.has(kind);
}
async function emitNotification(input) {
  if (!isStoredNotificationKind(input.kind)) return;
  const { error } = await supabaseAdmin.from("notifications").insert({
    user_id: input.userId,
    kind: input.kind,
    title: input.title,
    body: input.body ?? null,
    href: input.href ?? null,
    entity_kind: input.entityKind ?? null,
    entity_id: input.entityId ?? null
  });
  if (error) throw new Error(`emitNotification failed: ${error.message}`);
}
async function emitToUsers(userIds, base) {
  if (userIds.length === 0) return;
  if (!isStoredNotificationKind(base.kind)) return;
  const rows = userIds.map((userId) => ({
    user_id: userId,
    kind: base.kind,
    title: base.title,
    body: base.body ?? null,
    href: base.href ?? null,
    entity_kind: base.entityKind ?? null,
    entity_id: base.entityId ?? null
  }));
  const { error } = await supabaseAdmin.from("notifications").insert(rows);
  if (error) {
    console.warn("[emitToUsers] insert failed:", error.message);
  }
}
async function emitToRole(role, base) {
  if (!isStoredNotificationKind(base.kind)) return;
  const { data, error } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", role);
  if (error) {
    console.warn("[emitToRole] role lookup failed:", error.message);
    return;
  }
  const ids = Array.from(new Set((data ?? []).map((r) => r.user_id)));
  await emitToUsers(ids, base);
}
export {
  emitNotification,
  emitToRole,
  emitToUsers,
  isStoredNotificationKind
};
