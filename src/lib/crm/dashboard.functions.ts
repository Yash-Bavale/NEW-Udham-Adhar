import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const leadHead = () => supabase.from("leads").select("*", { count: "exact", head: true });
    const appHead = () => supabase.from("applications").select("*", { count: "exact", head: true });

    const [total, today, week, inProgress, completed, pending, recentLeads, recentActivity, byStatus, byService] =
      await Promise.all([
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

    return {
      totals: {
        totalLeads: total.count ?? 0,
        todayLeads: today.count ?? 0,
        weekLeads: week.count ?? 0,
        inProgress: inProgress.count ?? 0,
        completed: completed.count ?? 0,
        pending: pending.count ?? 0,
      },
      recentLeads: recentLeads.data ?? [],
      recentActivity: recentActivity.data ?? [],
      statusDistribution: tally(byStatus.data, "status"),
      serviceDistribution: tally(byService.data, "service"),
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
