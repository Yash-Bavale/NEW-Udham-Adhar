import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ORDER_ACCESS_ROLES = ["operations", "executive", "manager", "admin", "super_admin", "support"] as const;

export async function autoAssignLeadOrOrder(opts: {
  leadId?: string | null;
  applicationId?: string | null;
  serviceId?: string | null;
}): Promise<string | null> {
  try {
    // 1. Check lead_assignment_config (global toggle)
    const { data: config } = await supabaseAdmin
      .from("lead_assignment_config")
      .select("is_active")
      .is("service_id", null)
      .maybeSingle();

    if (config && config.is_active === false) {
      return null; // Explicitly disabled by admin
    }

    let staffUserId: string | null = null;
    let poolIdToUpdate: string | null = null;
    let poolCurrentCount = 0;

    // 2. Try querying assignment_pool for next active employee via round-robin
    let query = supabaseAdmin
      .from("assignment_pool")
      .select("id, user_id, service_id, last_assigned_at, total_assigned")
      .eq("is_active", true);

    if (opts.serviceId) {
      query = query.or(`service_id.eq.${opts.serviceId},service_id.is.null`);
    } else {
      query = query.is("service_id", null);
    }

    const { data: poolRow } = await query
      .order("service_id", { ascending: true, nullsFirst: false })
      .order("last_assigned_at", { ascending: true, nullsFirst: true })
      .order("total_assigned", { ascending: true })
      .limit(1)
      .maybeSingle();

    const p = poolRow as { id: string; user_id: string; total_assigned?: number } | null;
    if (p && p.user_id) {
      staffUserId = p.user_id;
      poolIdToUpdate = p.id;
      poolCurrentCount = p.total_assigned ?? 0;
    } else {
      // Fallback: If no explicit assignment_pool row exists, select from active staff users with order access roles
      const { data: roleRows } = await supabaseAdmin
        .from("user_roles")
        .select("user_id, role")
        .in("role", ORDER_ACCESS_ROLES);

      const staffIds = Array.from(new Set((roleRows ?? []).map((r: any) => r.user_id)));
      if (staffIds.length > 0) {
        const { data: activeProfs } = await supabaseAdmin
          .from("profiles")
          .select("id, is_active")
          .in("id", staffIds);

        const activeStaffIds = (activeProfs ?? [])
          .filter((pf: any) => pf.is_active !== false)
          .map((pf: any) => pf.id);

        if (activeStaffIds.length > 0) {
          // Round-robin fallback based on least assigned applications
          const { data: counts } = await supabaseAdmin
            .from("applications")
            .select("assigned_to");

          const assignCounts = new Map<string, number>();
          activeStaffIds.forEach((id) => assignCounts.set(id, 0));
          (counts ?? []).forEach((app: any) => {
            if (app.assigned_to && assignCounts.has(app.assigned_to)) {
              assignCounts.set(app.assigned_to, (assignCounts.get(app.assigned_to) ?? 0) + 1);
            }
          });

          // Sort by count ascending
          const sorted = activeStaffIds.sort(
            (a, b) => (assignCounts.get(a) ?? 0) - (assignCounts.get(b) ?? 0)
          );
          staffUserId = sorted[0];
        }
      }
    }

    if (!staffUserId) return null;

    const nowIso = new Date().toISOString();

    // 3. Assign lead if leadId provided
    if (opts.leadId) {
      await supabaseAdmin
        .from("leads")
        .update({ assigned_to: staffUserId, updated_at: nowIso } as never)
        .eq("id", opts.leadId);
    }

    // 4. Assign order/application if applicationId provided
    if (opts.applicationId) {
      await supabaseAdmin
        .from("applications")
        .update({ assigned_to: staffUserId, updated_at: nowIso } as never)
        .eq("id", opts.applicationId);
    }

    // 5. Update assignment_pool metrics if from pool
    if (poolIdToUpdate) {
      await supabaseAdmin
        .from("assignment_pool")
        .update({ last_assigned_at: nowIso, total_assigned: poolCurrentCount + 1 } as never)
        .eq("id", poolIdToUpdate);
    }

    // 6. Notify assigned employee
    try {
      const { emitToUsers } = await import("@/lib/notifications/emit.server");
      await emitToUsers([staffUserId], {
        kind: "order_assigned",
        title: "New Order Assigned",
        body: opts.applicationId
          ? "A new order has been automatically assigned to your queue."
          : "A new lead has been automatically assigned to your queue.",
        href: opts.applicationId ? `/admin/orders/${opts.applicationId}` : `/admin/leads`,
        entityKind: opts.applicationId ? "application" : "lead",
        entityId: (opts.applicationId || opts.leadId) ?? "",
      });
    } catch (notifyErr) {
      console.error("[autoAssignLeadOrOrder] Notification emit failed:", notifyErr);
    }

    return staffUserId;
  } catch (err) {
    console.error("[autoAssignLeadOrOrder] Failed:", err);
    return null;
  }
}
