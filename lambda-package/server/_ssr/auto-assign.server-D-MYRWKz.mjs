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
async function autoAssignLeadOrOrder(opts) {
  try {
    const { data: config } = await supabaseAdmin.from("lead_assignment_config").select("is_active").is("service_id", null).maybeSingle();
    if (!config || config.is_active === false) return null;
    if (opts.applicationId) {
      const { data: app } = await supabaseAdmin.from("applications").select("assigned_to, service_id, website_id").eq("id", opts.applicationId).maybeSingle();
      if (!app) return null;
      if (app.assigned_to) return app.assigned_to;
      opts.serviceId = opts.serviceId ?? app.service_id ?? null;
      opts.websiteId = opts.websiteId ?? app.website_id ?? null;
    } else if (opts.leadId) {
      const { data: lead } = await supabaseAdmin.from("leads").select("assigned_to, service_id, website_id").eq("id", opts.leadId).maybeSingle();
      if (!lead) return null;
      if (lead.assigned_to) return lead.assigned_to;
      opts.serviceId = opts.serviceId ?? lead.service_id ?? null;
      opts.websiteId = opts.websiteId ?? lead.website_id ?? null;
    } else {
      return null;
    }
    const { data: picked, error: pickErr } = await supabaseAdmin.rpc("assign_pool_pick", {
      _service_id: opts.serviceId ?? null,
      _website_id: opts.websiteId ?? null,
      _module: opts.applicationId ? "work.orders" : "work.leads"
    });
    if (pickErr) {
      console.error("[autoAssignLeadOrOrder] pick failed:", pickErr);
      return null;
    }
    let staffUserId = picked ?? null;
    if (!staffUserId) {
      let poolQ = supabaseAdmin.from("assignment_pool").select("id, user_id, last_assigned_at, total_assigned").eq("is_active", true);
      if (opts.serviceId) {
        poolQ = poolQ.or(`service_id.eq.${opts.serviceId},service_id.is.null`);
      }
      const { data: fallbackPool } = await poolQ.order("last_assigned_at", { ascending: true, nullsFirst: true }).order("total_assigned", { ascending: true }).limit(1).maybeSingle();
      if (fallbackPool?.user_id) {
        const { data: prof } = await supabaseAdmin.from("profiles").select("id, is_active, employment_status, auto_assign_enabled").eq("id", fallbackPool.user_id).maybeSingle();
        const isProfValid = prof && prof.is_active !== false && (prof.employment_status === "ACTIVE" || !prof.employment_status) && prof.auto_assign_enabled !== false;
        if (isProfValid) {
          staffUserId = fallbackPool.user_id;
          const curCount = Number(fallbackPool.total_assigned || 0) + 1;
          await supabaseAdmin.from("assignment_pool").update({ last_assigned_at: (/* @__PURE__ */ new Date()).toISOString(), total_assigned: curCount }).eq("id", fallbackPool.id);
        }
      }
    }
    if (!staffUserId) return null;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    if (opts.applicationId) {
      const { data: rpcRes } = await supabaseAdmin.rpc("assign_application", {
        p_application_id: opts.applicationId,
        p_new_assignee: staffUserId,
        p_assignment_type: "AUTO_ASSIGNMENT",
        p_actor_type: "system",
        p_source: "auto_assignment:round_robin",
        p_check_expected: true,
        p_expected_previous: null,
        p_auto_assigned: true
      });
      const updatedApp = rpcRes?.status === "assigned" ? { lead_id: rpcRes.lead_id } : null;
      if (updatedApp?.lead_id) {
        await supabaseAdmin.from("leads").update({ assigned_to: staffUserId, assigned_at: nowIso, auto_assigned: true, updated_at: nowIso }).eq("id", updatedApp.lead_id);
      }
      try {
        const { logEmployeeOrderAction } = await import("./order-action-logger.server-DJE-NEoc.mjs");
        await logEmployeeOrderAction({
          orderId: opts.applicationId,
          employeeId: staffUserId,
          actionType: "ORDER_ASSIGNED",
          notes: "Auto-assigned via round-robin pool",
          source: "system",
          supabase: supabaseAdmin
        });
      } catch (logErr) {
        console.warn("[autoAssignLeadOrOrder] Audit log warning:", logErr);
      }
    } else if (opts.leadId) {
      await supabaseAdmin.from("leads").update({ assigned_to: staffUserId, assigned_at: nowIso, auto_assigned: true, updated_at: nowIso }).eq("id", opts.leadId).is("assigned_to", null);
    }
    try {
      const { emitToUsers } = await import("./emit.server-OhKEr4hO.mjs");
      await emitToUsers([staffUserId], {
        kind: "order_assigned",
        title: opts.applicationId ? "New Order Assigned" : "New Lead Assigned",
        body: opts.applicationId ? "A new order has been automatically assigned to your queue." : "A new lead has been automatically assigned to your queue.",
        href: opts.applicationId ? `/admin/orders/${opts.applicationId}` : `/admin/leads`,
        entityKind: opts.applicationId ? "application" : "lead",
        entityId: (opts.applicationId || opts.leadId) ?? ""
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
export {
  autoAssignLeadOrOrder
};
