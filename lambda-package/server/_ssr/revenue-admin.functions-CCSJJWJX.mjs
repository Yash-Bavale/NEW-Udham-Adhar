import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, b as boolean, s as string, n as number, _ as _enum, a as array } from "../_libs/zod.mjs";
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
const IST_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function istWeekday(d) {
  const s = d.toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short"
  });
  const i = IST_WEEKDAYS.indexOf(s);
  return i < 0 ? d.getUTCDay() : i;
}
function resolveRangeDates(preset, fromIso, toIso) {
  const now = /* @__PURE__ */ new Date();
  const istStartOfDay = (d) => {
    const s = new Date(d);
    const istStr = s.toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata"
    });
    const parts = istStr.split("/");
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month, day, 0, 0, 0) - 5.5 * 3600 * 1e3);
  };
  const todayStart = istStartOfDay(now);
  const msDay = 86400 * 1e3;
  let start;
  let end = now;
  let label = "Today";
  switch (preset) {
    case "today":
      start = todayStart;
      end = new Date(todayStart.getTime() + msDay - 1);
      label = "Today";
      break;
    case "yesterday":
      start = new Date(todayStart.getTime() - msDay);
      end = new Date(todayStart.getTime() - 1);
      label = "Yesterday";
      break;
    case "7d":
      start = new Date(todayStart.getTime() - 6 * msDay);
      label = "Last 7 Days";
      break;
    case "30d":
      start = new Date(todayStart.getTime() - 29 * msDay);
      label = "Last 30 Days";
      break;
    case "this_week": {
      const distanceToMon = (istWeekday(now) + 6) % 7;
      start = new Date(todayStart.getTime() - distanceToMon * msDay);
      label = "This Week";
      break;
    }
    case "last_week": {
      const distanceToMon = (istWeekday(now) + 6) % 7;
      const thisMon = new Date(todayStart.getTime() - distanceToMon * msDay);
      start = new Date(thisMon.getTime() - 7 * msDay);
      end = new Date(thisMon.getTime() - 1);
      label = "Last Week";
      break;
    }
    case "this_month": {
      const istMonthStr = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });
      const parts = istMonthStr.split("/");
      const month = parseInt(parts[0], 10) - 1;
      const year = parseInt(parts[2], 10);
      start = new Date(Date.UTC(year, month, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      label = "This Month";
      break;
    }
    case "last_month": {
      const istMonthStr = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });
      const parts = istMonthStr.split("/");
      let month = parseInt(parts[0], 10) - 1 - 1;
      let year = parseInt(parts[2], 10);
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      start = new Date(Date.UTC(year, month, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      const nextMonth = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      end = new Date(nextMonth.getTime() - 1);
      label = "Last Month";
      break;
    }
    case "this_fy": {
      const istStr = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata"
      });
      const parts = istStr.split("/");
      const month = parseInt(parts[0], 10) - 1;
      const year = parseInt(parts[2], 10);
      const fyStartYear = month >= 3 ? year : year - 1;
      start = new Date(Date.UTC(fyStartYear, 3, 1, 0, 0, 0) - 5.5 * 3600 * 1e3);
      label = `FY ${fyStartYear}-${(fyStartYear + 1).toString().slice(-2)}`;
      break;
    }
    case "custom":
      start = fromIso ? new Date(fromIso) : todayStart;
      end = toIso ? new Date(toIso) : now;
      label = "Custom Range";
      break;
    default:
      start = todayStart;
  }
  const durationMs = end.getTime() - start.getTime() + 1;
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs + 1);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    prevStartIso: prevStart.toISOString(),
    prevEndIso: prevEnd.toISOString(),
    label,
    durationMs
  };
}
const REVENUE_CACHE = /* @__PURE__ */ new Map();
function invalidateRevenueCache() {
  REVENUE_CACHE.clear();
}
const FilterSchema = object({
  preset: _enum(["today", "yesterday", "7d", "30d", "this_week", "last_week", "this_month", "last_month", "this_fy", "custom"]).default("today"),
  fromIso: string().optional(),
  toIso: string().optional(),
  gateway: string().optional(),
  service: string().optional(),
  status: string().optional(),
  paymentMethod: string().optional(),
  minAmount: number().optional(),
  maxAmount: number().optional(),
  search: string().optional(),
  forceRefresh: boolean().optional()
});
const getRevenueOverview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => FilterSchema.parse(i ?? {})).handler(createSsrRpc("1dd01761d6106c37dc7defe795e7b9cddf327446eefff3c888ab4075f32b9021"));
const LedgerSchema = object({
  page: number().int().min(1).default(1),
  pageSize: number().int().min(10).max(100).default(50),
  tab: _enum(["all", "successful", "pending", "failed", "refunded"]).default("all"),
  search: string().optional(),
  gateway: string().optional(),
  status: string().optional(),
  service: string().optional(),
  paymentMethod: string().optional(),
  minAmount: number().optional(),
  maxAmount: number().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
});
const listPaymentLedger = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LedgerSchema.parse(i ?? {})).handler(createSsrRpc("24ec6c1c5edfcedc81472bc9bc54c71af0b0731d2f3ad1e1eb0cd979e81cab47"));
const getTransactionDetail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  paymentId: string().uuid()
}).parse(i)).handler(createSsrRpc("99ca93a2951d4255b26eae2e59eebc39fc70a61b461a703b5e8d3315e96cf01d"));
const ExportSchema = object({
  format: _enum(["csv", "excel"]).default("csv"),
  scope: _enum(["filtered", "range", "all"]).default("filtered"),
  tab: _enum(["all", "successful", "pending", "failed", "refunded"]).default("all"),
  gateway: string().optional(),
  paymentMethod: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional(),
  minAmount: number().optional(),
  maxAmount: number().optional(),
  search: string().optional(),
  columns: array(string()).optional()
});
const exportRevenueTransactions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ExportSchema.parse(i ?? {})).handler(createSsrRpc("5aebe7431208fb9825a6244bb07831f951b04a087118f7f7e6cd2d9a0987db79"));
const DayWiseSchema = object({
  preset: _enum(["today", "yesterday", "7d", "30d", "this_week", "last_week", "this_month", "last_month", "this_fy", "custom"]).default("today"),
  fromIso: string().optional(),
  toIso: string().optional()
});
const exportDayWiseRevenue = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => DayWiseSchema.parse(i ?? {})).handler(createSsrRpc("918d8aae65ebe20712bed437989b3f302e0625664bfa9df72ef042771c08d4bc"));
export {
  exportDayWiseRevenue,
  exportRevenueTransactions,
  getRevenueOverview,
  getTransactionDetail,
  invalidateRevenueCache,
  listPaymentLedger,
  resolveRangeDates
};
