import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const leadHead = () => supabase.from("leads").select("*", { count: "exact", head: true });
    const appHead = () => supabase.from("applications").select("*", { count: "exact", head: true });

    const [
      total, today, week, inProgress, completed, pending,
      recentLeads, recentActivity, byStatus, byService,
      trendRows, contactRows, myRoles,
    ] = await Promise.all([
      leadHead(),
      leadHead().gte("created_at", startOfToday),
      leadHead().gte("created_at", sevenDaysAgo),
      appHead().in("application_status", [
        "details_pending",
        "documents_pending",
        "under_review",
        "under_process",
      ]),
      appHead().eq("application_status", "completed"),
      appHead().eq("application_status", "awaiting_payment"),
      supabase
        .from("leads")
        .select("id, lead_code, name, service, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("activity_logs")
        .select("id, activity_type, activity_description, created_at, lead_id")
        .order("created_at", { ascending: false })
        .limit(15),
      supabase.from("leads").select("status").limit(5000),
      supabase.from("leads").select("service").limit(5000),
      supabase
        .from("leads")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo)
        .limit(5000),
      // For unique-customer count: pull email + mobile across all leads
      supabase.from("leads").select("email, mobile").limit(10000),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    const tally = <T,>(rows: T[] | null, key: keyof T) => {
      const map: Record<string, number> = {};
      (rows ?? []).forEach((r) => {
        const k = String(r[key] ?? "unknown");
        map[k] = (map[k] ?? 0) + 1;
      });
      return Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label, value }));
    };

    // 30-day trend bucketed by date (YYYY-MM-DD)
    const trendMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      trendMap.set(key, 0);
    }
    (trendRows.data ?? []).forEach((r: { created_at: string }) => {
      const key = r.created_at.slice(0, 10);
      if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
    });
    const trend = Array.from(trendMap.entries()).map(([date, count]) => ({
      date: date.slice(5), // MM-DD for axis
      count,
    }));

    // Unique customer counts (de-duplicated by email/mobile, case-insensitive)
    const uniqueEmails = new Set<string>();
    const uniqueMobiles = new Set<string>();
    (contactRows.data ?? []).forEach((r: { email?: string | null; mobile?: string | null }) => {
      if (r.email) uniqueEmails.add(r.email.trim().toLowerCase());
      if (r.mobile) uniqueMobiles.add(r.mobile.replace(/\D/g, ""));
    });

    return {
      totals: {
        totalLeads: total.count ?? 0,
        todayLeads: today.count ?? 0,
        weekLeads: week.count ?? 0,
        inProgress: inProgress.count ?? 0,
        completed: completed.count ?? 0,
        pending: pending.count ?? 0,
        uniqueCustomers: uniqueEmails.size,
        uniqueMobiles: uniqueMobiles.size,
      },
      recentLeads: recentLeads.data ?? [],
      recentActivity: recentActivity.data ?? [],
      statusDistribution: tally(byStatus.data, "status"),
      serviceDistribution: tally(byService.data, "service"),
      trend,
      currentUser: {
        hasStaffRole: (myRoles.data ?? []).length > 0,
        roles: (myRoles.data ?? []).map((r: { role: string }) => r.role),
      },
    };
  });

export const listActivityLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("activity_logs")
      .select("id, activity_type, activity_description, lead_id, application_id, user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });
