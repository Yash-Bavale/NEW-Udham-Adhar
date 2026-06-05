import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { assertRole, writeAudit } from "@/lib/audit";
import {
  callOrderStatusApi,
  callRefundApi,
} from "@/lib/payments/ccavenue.server";


/** Sanitized list for ops/support — no amounts. */
export const listPaymentsSafe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("payments_safe")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

/** Full payment list — finance / super_admin only. */
export const listPaymentsFull = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
    if (!ok) throw new Error("Forbidden");

    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

/** Revenue stats — finance / super_admin only. */
export const revenueStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId);
    const ok = (roles ?? []).some((r) => r.role === "super_admin" || r.role === "finance");
    if (!ok) throw new Error("Forbidden");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 86400_000);
    const monthAgo = new Date(Date.now() - 30 * 86400_000);

    const { data: paid } = await supabaseAdmin
      .from("payments")
      .select("amount, gst_amount, base_amount, payment_date, created_at, status")
      .eq("status", "paid");

    const rows = paid ?? [];
    const sum = (xs: typeof rows, key: "amount" | "gst_amount" | "base_amount") =>
      xs.reduce((s, r) => s + Number(r[key] ?? 0), 0);

    const since = (d: Date) =>
      rows.filter((r) => new Date(r.payment_date ?? r.created_at) >= d);

    return {
      total: { count: rows.length, revenue: sum(rows, "amount"), gst: sum(rows, "gst_amount"), base: sum(rows, "base_amount") },
      today: { count: since(today).length, revenue: sum(since(today), "amount") },
      week: { count: since(weekAgo).length, revenue: sum(since(weekAgo), "amount") },
      month: { count: since(monthAgo).length, revenue: sum(since(monthAgo), "amount") },
    };
  });
