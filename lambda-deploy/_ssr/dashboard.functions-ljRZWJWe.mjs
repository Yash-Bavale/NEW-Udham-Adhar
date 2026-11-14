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
const getDashboardStats_createServerFn_handler = createServerRpc({
  id: "a6f0560507698b550ff0997b2a5e78434e44a45cead455eaacffed5a8538589e",
  name: "getDashboardStats",
  filename: "src/lib/crm/dashboard.functions.ts"
}, (opts) => getDashboardStats.__executeServer(opts));
const getDashboardStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getDashboardStats_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const [metricsRes, recentLeads, recentActivity, myRoles] = await Promise.all([supabase.rpc("get_dashboard_metrics"), supabase.from("leads").select("id, lead_code, name, service, status, created_at").order("created_at", {
    ascending: false
  }).limit(10), supabase.from("activity_logs").select("id, activity_type, activity_description, created_at, lead_id").order("created_at", {
    ascending: false
  }).limit(15), supabase.from("user_roles").select("role").eq("user_id", userId)]);
  if (metricsRes.error) throw new Error(metricsRes.error.message);
  const m = metricsRes.data ?? {};
  return {
    totals: {
      totalLeads: m.totalLeads ?? 0,
      todayLeads: m.todayLeads ?? 0,
      weekLeads: m.weekLeads ?? 0,
      inProgress: m.inProgress ?? 0,
      completed: m.completed ?? 0,
      pending: m.pending ?? 0,
      uniqueCustomers: m.uniqueCustomers ?? 0,
      uniqueMobiles: m.uniqueMobiles ?? 0
    },
    recentLeads: recentLeads.data ?? [],
    recentActivity: recentActivity.data ?? [],
    statusDistribution: m.statusDistribution ?? [],
    serviceDistribution: m.serviceDistribution ?? [],
    trend: m.trend ?? [],
    currentUser: {
      hasStaffRole: (myRoles.data ?? []).length > 0,
      roles: (myRoles.data ?? []).map((r) => r.role)
    }
  };
});
const listActivityLogs_createServerFn_handler = createServerRpc({
  id: "78314a488ea7596688dedae269bf64dece81f4fdc8705769902567e6eb14e08f",
  name: "listActivityLogs",
  filename: "src/lib/crm/dashboard.functions.ts"
}, (opts) => listActivityLogs.__executeServer(opts));
const listActivityLogs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listActivityLogs_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("activity_logs").select("id, activity_type, activity_description, lead_id, application_id, user_id, created_at").order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return {
    rows: data ?? []
  };
});
export {
  getDashboardStats_createServerFn_handler,
  listActivityLogs_createServerFn_handler
};
