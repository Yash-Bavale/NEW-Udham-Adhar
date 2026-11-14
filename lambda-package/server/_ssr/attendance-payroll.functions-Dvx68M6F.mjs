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
const FULL_DAY_SECONDS = 6 * 3600;
const MIN_DAY_SECONDS = 30 * 60;
const istDate = (iso) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date(iso));
const getMonthlyAttendance_createServerFn_handler = createServerRpc({
  id: "aabf2ace5da0bceb6608f833d01e2f87a0b5c943a88ce256e84f68af7333d2a6",
  name: "getMonthlyAttendance",
  filename: "src/lib/crm/attendance-payroll.functions.ts"
}, (opts) => getMonthlyAttendance.__executeServer(opts));
const getMonthlyAttendance = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  month: string().regex(/^\d{4}-\d{2}$/)
}).parse(d)).handler(getMonthlyAttendance_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    supabaseAdmin: admin
  } = await import("./client.server-3kDCe7R3.mjs");
  const {
    data: roleRows
  } = await admin.from("user_roles").select("role").eq("user_id", userId);
  const roles = new Set((roleRows ?? []).map((r) => String(r.role)));
  if (!roles.has("admin") && !roles.has("super_admin") && !roles.has("manager")) throw new Error("Forbidden");
  const [y, m] = data.month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const fromIso = (/* @__PURE__ */ new Date(`${data.month}-01T00:00:00+05:30`)).toISOString();
  const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  const toIso = (/* @__PURE__ */ new Date(`${nextMonth}-01T00:00:00+05:30`)).toISOString();
  const todayIst = istDate((/* @__PURE__ */ new Date()).toISOString());
  const dates = Array.from({
    length: daysInMonth
  }, (_, i) => `${data.month}-${String(i + 1).padStart(2, "0")}`).filter((d) => d <= todayIst);
  const {
    data: staffRoles
  } = await admin.from("user_roles").select("user_id, role");
  const staffIds = [...new Set((staffRoles ?? []).filter((r) => r.role !== "customer").map((r) => r.user_id))];
  const {
    data: profiles
  } = staffIds.length ? await admin.from("profiles").select("id, full_name, display_name, email, employee_code, is_active").in("id", staffIds) : {
    data: []
  };
  const sessions = [];
  for (let off = 0; off < 5e4; off += 1e3) {
    const {
      data: rows,
      error
    } = await admin.from("employee_sessions").select("employee_id, auth_user_id, login_at, logout_at, last_heartbeat_at, active_seconds, idle_seconds, away_seconds").gte("login_at", fromIso).lt("login_at", toIso).order("login_at").range(off, off + 999);
    if (error) throw new Error(error.message);
    sessions.push(...rows ?? []);
    if ((rows ?? []).length < 1e3) break;
  }
  const stream = [];
  for (let off = 0; off < 2e5; off += 1e3) {
    const {
      data: rows,
      error
    } = await supabase.rpc("get_employee_perf_stream", {
      p_from: fromIso,
      p_to: toIso,
      p_employee: null
    }).range(off, off + 999);
    if (error) throw new Error(`Work data unavailable: ${error.message}`);
    stream.push(...rows ?? []);
    if ((rows ?? []).length < 1e3) break;
  }
  const map = /* @__PURE__ */ new Map();
  const get = (emp, date) => {
    let e = map.get(emp);
    if (!e) {
      e = /* @__PURE__ */ new Map();
      map.set(emp, e);
    }
    let a = e.get(date);
    if (!a) {
      a = {
        first: null,
        last: null,
        active: 0,
        idle: 0,
        completed: /* @__PURE__ */ new Set(),
        closed: /* @__PURE__ */ new Set(),
        actions: 0
      };
      e.set(date, a);
    }
    return a;
  };
  const touch = (a, t) => {
    if (!t) return;
    if (!a.first || t < a.first) a.first = t;
    if (!a.last || t > a.last) a.last = t;
  };
  for (const s of sessions) {
    const emp = s.employee_id ?? s.auth_user_id;
    if (!emp) continue;
    const a = get(emp, istDate(s.login_at));
    a.active += s.active_seconds ?? 0;
    a.idle += (s.idle_seconds ?? 0) + (s.away_seconds ?? 0);
    touch(a, s.login_at);
    touch(a, s.logout_at ?? s.last_heartbeat_at);
  }
  for (const r of stream) {
    if (!r.employee_id) continue;
    if (r.kind !== "action" && r.kind !== "completion" && r.kind !== "closure") continue;
    const a = get(r.employee_id, istDate(r.occurred_at));
    touch(a, r.occurred_at);
    a.actions++;
    if (r.kind === "completion") a.completed.add(r.application_id);
    if (r.kind === "closure") a.closed.add(r.application_id);
  }
  const employees = (profiles ?? []).map((p) => {
    const e = map.get(p.id);
    const days = dates.map((date) => {
      const a = e?.get(date);
      if (!a) return {
        date,
        first_at: null,
        last_at: null,
        active_seconds: 0,
        idle_seconds: 0,
        worked_seconds: 0,
        completed: 0,
        closed: 0,
        actions: 0,
        status: "absent"
      };
      const span = a.first && a.last ? Math.max(0, (Date.parse(a.last) - Date.parse(a.first)) / 1e3) : 0;
      const worked = a.active + a.idle > 0 ? Math.max(a.active + a.idle, span) : span;
      const hasWork = a.actions > 0;
      const status = worked >= FULL_DAY_SECONDS ? "full" : worked >= MIN_DAY_SECONDS || hasWork ? "half" : "absent";
      return {
        date,
        first_at: a.first,
        last_at: a.last,
        active_seconds: a.active,
        idle_seconds: a.idle,
        worked_seconds: Math.round(worked),
        completed: a.completed.size,
        closed: a.closed.size,
        actions: a.actions,
        status
      };
    });
    const sum = (f) => days.reduce((n, d) => n + f(d), 0);
    return {
      employee_id: p.id,
      name: p.full_name || p.display_name || p.email || "—",
      employee_code: p.employee_code ?? null,
      full_days: days.filter((d) => d.status === "full").length,
      half_days: days.filter((d) => d.status === "half").length,
      absent_days: days.filter((d) => d.status === "absent").length,
      days_worked: days.filter((d) => d.status !== "absent").length,
      completed: sum((d) => d.completed),
      closed: sum((d) => d.closed),
      actions: sum((d) => d.actions),
      active_seconds: sum((d) => d.active_seconds),
      idle_seconds: sum((d) => d.idle_seconds),
      days
    };
  }).filter((e) => e.days_worked > 0 || (profiles ?? []).find((p) => p.id === e.employee_id)?.is_active).sort((a, b) => b.days_worked - a.days_worked || a.name.localeCompare(b.name));
  return {
    month: data.month,
    dates,
    employees
  };
});
export {
  getMonthlyAttendance_createServerFn_handler
};
