function getIstString(date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(date);
}
async function logEmployeeOrderAction(params) {
  try {
    const {
      orderId,
      leadId,
      customerId,
      employeeId,
      employeeName,
      employeeRole,
      actionType,
      previousStatus,
      newStatus,
      previousStage,
      newStage,
      notes,
      source = "employee",
      customMetadata = {},
      supabase
    } = params;
    if (!orderId) {
      console.warn("[logEmployeeOrderAction] Skipping log: missing orderId");
      return { success: false, error: "Missing orderId" };
    }
    const client = supabase;
    if (!client) {
      console.warn("[logEmployeeOrderAction] No Supabase client provided");
      return { success: false, error: "No Supabase client" };
    }
    const now = /* @__PURE__ */ new Date();
    const nowIso = now.toISOString();
    const nowIst = getIstString(now);
    const { data: order } = await client.from("applications").select(
      "id, application_code, assigned_to, assigned_at, created_at, order_status, fulfillment_status, application_status, customer_id, lead_id"
    ).eq("id", orderId).maybeSingle();
    const { data: lastAction } = await client.from("order_action_logs").select("created_at").eq("order_id", orderId).order("created_at", { ascending: false }).limit(1).maybeSingle();
    let timeSpentSinceAssignmentMs = null;
    if (order?.assigned_at) {
      const assignedTime = new Date(order.assigned_at).getTime();
      timeSpentSinceAssignmentMs = Math.max(0, now.getTime() - assignedTime);
    }
    let timeSpentSincePreviousActionMs = null;
    if (lastAction?.created_at) {
      const prevActionTime = new Date(lastAction.created_at).getTime();
      timeSpentSincePreviousActionMs = Math.max(0, now.getTime() - prevActionTime);
    }
    let slaStatus = "compliant";
    let isSlaBreached = false;
    const isHotOrder = order?.fulfillment_status === "order_reopened" || order?.order_status === "REOPENED";
    if (isHotOrder) {
      if (timeSpentSinceAssignmentMs !== null) {
        if (timeSpentSinceAssignmentMs > 18e5) {
          slaStatus = "breached";
          isSlaBreached = true;
        } else if (timeSpentSinceAssignmentMs > 12e5) {
          slaStatus = "at_risk";
        }
      }
    } else if (actionType === "ORDER_COMPLETED" || actionType === "ORDER_CLOSED") {
      if (timeSpentSinceAssignmentMs !== null && timeSpentSinceAssignmentMs > 864e5) {
        slaStatus = "breached";
        isSlaBreached = true;
      }
    } else {
      if (timeSpentSinceAssignmentMs !== null) {
        if (timeSpentSinceAssignmentMs > 72e5) {
          slaStatus = "breached";
          isSlaBreached = true;
        } else if (timeSpentSinceAssignmentMs > 54e5) {
          slaStatus = "at_risk";
        }
      }
    }
    let finalEmpName = employeeName;
    let finalEmpRole = employeeRole;
    if (employeeId && (!finalEmpName || !finalEmpRole)) {
      const { data: profile } = await client.from("profiles").select("id, full_name, display_name, email").eq("id", employeeId).maybeSingle();
      if (profile) {
        finalEmpName = finalEmpName || profile.full_name || profile.display_name || profile.email || "Employee";
      }
    }
    if (employeeId && !finalEmpRole) {
      const { data: roleRow } = await client.from("user_roles").select("role").eq("user_id", employeeId).limit(1).maybeSingle();
      finalEmpRole = roleRow?.role || "employee";
    }
    const normalizedSource = source === "super_admin" ? "admin" : source || "employee";
    const insertPayload = {
      order_id: orderId,
      lead_id: leadId || order?.lead_id || null,
      customer_id: customerId || order?.customer_id || null,
      employee_id: employeeId || order?.assigned_to || null,
      employee_name: finalEmpName || "Admin / System",
      employee_role: finalEmpRole || "system",
      action_type: actionType,
      previous_status: previousStatus || null,
      new_status: newStatus || order?.order_status || order?.fulfillment_status || null,
      previous_stage: previousStage || null,
      new_stage: newStage || order?.fulfillment_status || null,
      timestamp: nowIso,
      created_at_ist: nowIst,
      time_spent_since_assignment_ms: timeSpentSinceAssignmentMs,
      time_spent_since_previous_action_ms: timeSpentSincePreviousActionMs,
      sla_status: slaStatus,
      is_sla_breached: isSlaBreached,
      notes: notes || null,
      source: normalizedSource,
      created_at: nowIso
    };
    const { data: inserted, error: insertErr } = await client.from("order_action_logs").insert(insertPayload).select("id").single();
    if (insertErr) {
      console.error("[logEmployeeOrderAction] Error logging order action:", insertErr);
      return { success: false, error: insertErr.message };
    }
    const effectiveEmpId = employeeId || order?.assigned_to;
    if (effectiveEmpId) {
      try {
        await client.from("employee_activity_log").insert({
          employee_id: effectiveEmpId,
          auth_user_id: effectiveEmpId,
          action_type: actionType,
          order_id: orderId,
          previous_status: previousStatus || null,
          new_status: newStatus || order?.order_status || null,
          previous_stage: previousStage || null,
          new_stage: newStage || order?.fulfillment_status || null,
          metadata: {
            notes: notes || null,
            slaStatus,
            source: normalizedSource,
            ...customMetadata
          }
        });
      } catch {
      }
    }
    return { success: true, actionId: inserted?.id };
  } catch (err) {
    console.error("[logEmployeeOrderAction] Unexpected error:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
export {
  logEmployeeOrderAction
};
