import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { D as DEFAULT_BUSINESS_HOURS } from "./business-hours-B-Ly-oQa.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, a as array, s as string, n as number } from "../_libs/zod.mjs";
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
const HM = /^([01]\d|2[0-3]):[0-5]\d$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const UpdateInput = object({
  timezone: string().min(3).max(64).default("Asia/Kolkata"),
  openTime: string().regex(HM),
  closeTime: string().regex(HM),
  workingDays: array(number().int().min(0).max(6)).min(1).max(7),
  holidays: array(string().regex(ISO_DATE)).max(365)
});
function rowToConfig(row) {
  if (!row) return DEFAULT_BUSINESS_HOURS;
  return {
    timezone: row.timezone ?? "Asia/Kolkata",
    openTime: (row.open_time ?? "10:00:00").slice(0, 5),
    closeTime: (row.close_time ?? "18:00:00").slice(0, 5),
    workingDays: Array.isArray(row.working_days) ? row.working_days : [1, 2, 3, 4, 5, 6],
    holidays: Array.isArray(row.holidays) ? row.holidays : []
  };
}
const getBusinessHoursConfig_createServerFn_handler = createServerRpc({
  id: "486a3e3c02066d5821f4be070bc0416f1f50182e06fc3d1b396dcd02a6da32ae",
  name: "getBusinessHoursConfig",
  filename: "src/lib/scheduling/business-hours.functions.ts"
}, (opts) => getBusinessHoursConfig.__executeServer(opts));
const getBusinessHoursConfig = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getBusinessHoursConfig_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("business_hours_config").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  const row = data;
  return {
    config: rowToConfig(row),
    updatedAt: row?.updated_at ?? null
  };
});
const updateBusinessHoursConfig_createServerFn_handler = createServerRpc({
  id: "c59d6a6c5f50ec681c098ce0cb8106520ddf6082b3d485c7d72792ffec2c69e6",
  name: "updateBusinessHoursConfig",
  filename: "src/lib/scheduling/business-hours.functions.ts"
}, (opts) => updateBusinessHoursConfig.__executeServer(opts));
const updateBusinessHoursConfig = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => UpdateInput.parse(raw)).handler(updateBusinessHoursConfig_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: isSA
  } = await context.supabase.rpc("is_super_admin", {
    _user_id: context.userId
  });
  if (!isSA) throw new Error("Only Super Admin can update business hours.");
  if (data.openTime >= data.closeTime) {
    throw new Error("Open time must be earlier than close time.");
  }
  const {
    error
  } = await context.supabase.from("business_hours_config").upsert({
    id: 1,
    timezone: data.timezone,
    open_time: data.openTime,
    close_time: data.closeTime,
    working_days: data.workingDays,
    holidays: data.holidays,
    updated_by: context.userId,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  getBusinessHoursConfig_createServerFn_handler,
  updateBusinessHoursConfig_createServerFn_handler
};
