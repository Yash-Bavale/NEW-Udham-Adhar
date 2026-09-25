import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getAdmin() {
  const m = await import("@/integrations/supabase/client.server");
  return m.supabaseAdmin;
}

async function assertStaff(_supabase: any, userId?: string) {
  const admin = await getAdmin();
  let query = admin.from("user_roles").select("role");
  if (userId) query = query.eq("user_id", userId);
  const { data } = await query;
  const roles = new Set((data ?? []).map((r: any) => r.role));
  const allowed = ["admin", "super_admin", "operations", "support", "accounts", "finance", "executive", "manager"];
  if (!allowed.some((r) => roles.has(r))) throw new Error("Forbidden");
}

async function getStaff(userId: string) {
  const admin = await getAdmin();
  const [{ data: p }, { data: rr }] = await Promise.all([
    admin.from("profiles").select("display_name, email").eq("id", userId).maybeSingle(),
    admin.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle(),
  ]);
  return {
    staff_name: (p?.display_name as string) || (p?.email as string) || "Staff",
    staff_role: (rr?.role as string) || "staff",
  };
}

export interface CallbackRemarks {
  reason: string;
  reasonLabel: string;
  note?: string | null;
  durationMinutes?: number | null;
  channel?: "call" | "email" | string | null;
  created_by_name?: string;
  created_at?: string;
}

export interface CallbackHistoryItem {
  id: string;
  order_id: string;
  actor_id: string | null;
  actor_name: string;
  actor_role: string | null;
  action_type: "CALLBACK_SCHEDULED" | "CALLBACK_RESCHEDULED" | "CALLBACK_CANCELLED" | "CALLBACK_COMPLETED";
  previous_fires_at: string | null;
  new_fires_at: string | null;
  reason: string;
  reason_label: string;
  previous_reason: string | null;
  previous_reason_label: string | null;
  note: string | null;
  previous_note: string | null;
  channel: string;
  source: string;
  created_at: string;
}

export const scheduleOrderCallback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        reason: z.string().min(1),
        reasonLabel: z.string().min(1),
        durationMinutes: z.number().min(1).optional(),
        customFiresAt: z.string().optional(),
        note: z.string().optional().nullable(),
        channel: z.enum(["call", "email"]).optional().default("call"),
        idempotencyKey: z.string().optional(),
        sessionId: z.string().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    const staff = await getStaff(context.userId);

    // 1. Duplicate & Idempotency Protection: Check if request was already processed
    if (data.idempotencyKey) {
      try {
        const { data: existingHistory } = await admin
          .from("order_callback_history" as any)
          .select("id, new_fires_at, reason_label")
          .eq("idempotency_key", data.idempotencyKey)
          .maybeSingle();

        if (existingHistory) {
          return {
            success: true,
            schedulerId: existingHistory.id,
            firesAt: existingHistory.new_fires_at,
            reasonLabel: existingHistory.reason_label,
          };
        }
      } catch {
        // Continue if table is being created
      }
    }

    const now = new Date();
    let firesAtDate: Date;

    if (data.customFiresAt) {
      firesAtDate = new Date(data.customFiresAt);
      if (isNaN(firesAtDate.getTime())) {
        throw new Error("Invalid custom date/time provided");
      }
    } else if (data.durationMinutes && data.durationMinutes > 0) {
      firesAtDate = new Date(now.getTime() + data.durationMinutes * 60_000);
    } else {
      throw new Error("Either durationMinutes or customFiresAt must be provided");
    }

    const firesAtIso = firesAtDate.toISOString();
    const remarksObj: CallbackRemarks = {
      reason: data.reason,
      reasonLabel: data.reasonLabel,
      note: data.note?.trim() || null,
      durationMinutes: data.durationMinutes ?? null,
      channel: data.channel ?? "call",
      created_by_name: staff.staff_name,
      created_at: now.toISOString(),
    };

    // 2. Fetch current active callback scheduler state to determine if this is a SCHEDULE or RESCHEDULE
    const { data: existingActive } = await admin
      .from("order_schedulers")
      .select("id, status, fires_at, remarks, created_by, created_at")
      .eq("application_id", data.orderId)
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let isReschedule = false;
    let previousFiresAt: string | null = null;
    let previousReason: string | null = null;
    let previousReasonLabel: string | null = null;
    let previousNote: string | null = null;

    if (existingActive) {
      isReschedule = true;
      previousFiresAt = existingActive.fires_at;
      if (existingActive.remarks) {
        try {
          const parsed = typeof existingActive.remarks === "string" ? JSON.parse(existingActive.remarks) : existingActive.remarks;
          previousReason = parsed?.reason || null;
          previousReasonLabel = parsed?.reasonLabel || null;
          previousNote = parsed?.note || null;
        } catch {
          previousReason = "custom";
          previousReasonLabel = existingActive.remarks;
        }
      }
    }

    const actionType = isReschedule ? "CALLBACK_RESCHEDULED" : "CALLBACK_SCHEDULED";

    // 3. Stop any active or paused scheduler on this order first to ensure one_open_scheduler_per_order is never violated
    await admin
      .from("order_schedulers")
      .update({
        status: "stopped",
        stopped_at: now.toISOString(),
        stop_reason: isReschedule ? "rescheduled_new_callback" : "new_callback_scheduled",
        stop_triggered_by: context.userId,
      })
      .eq("application_id", data.orderId)
      .in("status", ["active", "paused"]);

    // 4. Insert new callback reminder
    const { data: created, error } = await admin
      .from("order_schedulers")
      .insert({
        application_id: data.orderId,
        scheduler_type: "our_side_reminder",
        status: "active",
        started_at: now.toISOString(),
        fires_at: firesAtIso,
        remarks: JSON.stringify(remarksObj),
        created_by: context.userId,
      })
      .select("id, application_id, status, fires_at, remarks, created_at")
      .single();

    if (error) {
      console.error("[scheduleOrderCallback] insert error:", error);
      throw new Error(`Failed to schedule callback: ${error.message}`);
    }

    // 5. Create append-only history record in order_callback_history
    try {
      await admin.from("order_callback_history" as any).insert({
        order_id: data.orderId,
        actor_id: context.userId,
        actor_name: staff.staff_name,
        actor_role: staff.staff_role,
        action_type: actionType,
        previous_fires_at: previousFiresAt,
        new_fires_at: firesAtIso,
        reason: data.reason,
        reason_label: data.reasonLabel,
        previous_reason: previousReason,
        previous_reason_label: previousReasonLabel,
        note: data.note?.trim() || null,
        previous_note: previousNote,
        channel: data.channel ?? "call",
        source: "employee",
        session_id: data.sessionId ?? null,
        idempotency_key: data.idempotencyKey ?? null,
      });
    } catch (histErr) {
      console.warn("[scheduleOrderCallback] order_callback_history insert warning:", histErr);
    }

    // 6. Log event in application_events, workflow_events, and activity_logs
    const istFormattedTime = firesAtDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) + " IST";
    const actionLabel = isReschedule ? "Callback Rescheduled" : "Callback Scheduled";
    const noteText = `${actionLabel} for ${istFormattedTime} · Reason: ${data.reasonLabel}${data.note ? ` (${data.note})` : ""}`;

    try {
      await admin.from("application_events").insert({
        application_id: data.orderId,
        event_type: isReschedule ? "callback_rescheduled" : "callback_scheduled",
        note: noteText,
        staff_name: staff.staff_name,
        staff_role: staff.staff_role || "staff",
      } as never);
    } catch (e1) {
      console.warn("[scheduleOrderCallback] application_events insert warning:", e1);
    }

    try {
      const { data: appRow } = await admin.from("applications").select("lead_id").eq("id", data.orderId).maybeSingle();
      await admin.from("workflow_events").insert({
        application_id: data.orderId,
        lead_id: appRow?.lead_id ?? null,
        event_type: isReschedule ? "callback_rescheduled" : "callback_scheduled",
        title: `${actionLabel}: ${data.reasonLabel}`,
        description: `Scheduled for ${istFormattedTime}.${previousFiresAt ? ` (Previous: ${new Date(previousFiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })})` : ""} ${data.note ? `Note: ${data.note}` : ""}`,
        customer_visible: false,
        actor_id: context.userId,
        actor_name: staff.staff_name,
        actor_role: staff.staff_role,
        is_system: false,
        metadata: {
          scheduler_id: created.id,
          action_type: actionType,
          previous_fires_at: previousFiresAt,
          reason: data.reason,
          reasonLabel: data.reasonLabel,
          fires_at: firesAtIso,
          note: data.note,
        },
      } as never);

      if (appRow?.lead_id) {
        await admin.from("activity_logs").insert({
          lead_id: appRow.lead_id,
          user_id: context.userId,
          activity_type: isReschedule ? "callback_rescheduled" : "callback_scheduled",
          activity_description: `${actionLabel} for ${istFormattedTime}: ${data.reasonLabel}`,
        } as never);
      }
    } catch (e2) {
      console.warn("[scheduleOrderCallback] workflow_events insert warning:", e2);
    }

    try {
      const { logEmployeeOrderAction } = await import("@/lib/orders/order-action-logger.server");
      await logEmployeeOrderAction({
        orderId: data.orderId,
        employeeId: context.userId,
        employeeName: staff.staff_name,
        employeeRole: staff.staff_role,
        actionType: actionType,
        notes: `${actionLabel} for ${istFormattedTime} · Reason: ${data.reasonLabel}${data.note ? ` (${data.note})` : ""}`,
        source: "employee",
        supabase: admin,
      });
    } catch (auditErr) {
      console.warn("[scheduleOrderCallback] order_action_logs warning:", auditErr);
    }

    return {
      success: true,
      schedulerId: created.id,
      firesAt: firesAtDate.toISOString(),
      reasonLabel: data.reasonLabel,
      actionType,
    };
  });

export const cancelOrderCallback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        schedulerId: z.string().uuid().optional(),
        reason: z.string().optional().nullable(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    const staff = await getStaff(context.userId);
    const now = new Date().toISOString();

    // Fetch existing scheduler before cancelling to record in history
    const { data: existingActive } = await admin
      .from("order_schedulers")
      .select("id, fires_at, remarks")
      .eq("application_id", data.orderId)
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let query = admin
      .from("order_schedulers")
      .update({
        status: "stopped",
        stopped_at: now,
        stop_reason: data.reason || "cancelled_by_staff",
        stop_triggered_by: context.userId,
      })
      .eq("application_id", data.orderId)
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .in("status", ["active", "paused"]);

    if (data.schedulerId) {
      query = query.eq("id", data.schedulerId);
    }

    const { error } = await query;
    if (error) throw new Error(error.message);

    // Record in order_callback_history
    try {
      let prevReason = null;
      let prevLabel = null;
      if (existingActive?.remarks) {
        try {
          const p = typeof existingActive.remarks === "string" ? JSON.parse(existingActive.remarks) : existingActive.remarks;
          prevReason = p.reason;
          prevLabel = p.reasonLabel;
        } catch {
          prevLabel = existingActive.remarks;
        }
      }

      await admin.from("order_callback_history" as any).insert({
        order_id: data.orderId,
        actor_id: context.userId,
        actor_name: staff.staff_name,
        actor_role: staff.staff_role,
        action_type: "CALLBACK_CANCELLED",
        previous_fires_at: existingActive?.fires_at || null,
        new_fires_at: null,
        reason: data.reason || "cancelled_by_staff",
        reason_label: data.reason || "Cancelled by staff",
        previous_reason: prevReason,
        previous_reason_label: prevLabel,
        channel: "call",
        source: "employee",
      });
    } catch (hErr) {
      console.warn("[cancelOrderCallback] history log warning:", hErr);
    }

    try {
      await admin.from("application_events").insert({
        application_id: data.orderId,
        event_type: "callback_cancelled",
        note: `Callback cancelled by ${staff.staff_name}`,
        staff_name: staff.staff_name,
        staff_role: staff.staff_role || "staff",
      } as never);
    } catch (evtErr) {
      console.warn("[cancelOrderCallback] event log warning:", evtErr);
    }

    return { success: true };
  });

export const completeOrderCallback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        schedulerId: z.string().uuid().optional(),
        callOutcomeNote: z.string().optional().nullable(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    const staff = await getStaff(context.userId);
    const now = new Date().toISOString();

    // Fetch existing scheduler before completing to record in history
    const { data: existingActive } = await admin
      .from("order_schedulers")
      .select("id, fires_at, remarks")
      .eq("application_id", data.orderId)
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let query = admin
      .from("order_schedulers")
      .update({
        status: "completed",
        stopped_at: now,
        stop_reason: data.callOutcomeNote ? `Call completed: ${data.callOutcomeNote}` : "completed_by_staff",
        stop_triggered_by: context.userId,
      })
      .eq("application_id", data.orderId)
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active");

    if (data.schedulerId) {
      query = query.eq("id", data.schedulerId);
    }

    const { error } = await query;
    if (error) throw new Error(error.message);

    // Record in order_callback_history
    try {
      let prevReason = null;
      let prevLabel = null;
      if (existingActive?.remarks) {
        try {
          const p = typeof existingActive.remarks === "string" ? JSON.parse(existingActive.remarks) : existingActive.remarks;
          prevReason = p.reason;
          prevLabel = p.reasonLabel;
        } catch {
          prevLabel = existingActive.remarks;
        }
      }

      await admin.from("order_callback_history" as any).insert({
        order_id: data.orderId,
        actor_id: context.userId,
        actor_name: staff.staff_name,
        actor_role: staff.staff_role,
        action_type: "CALLBACK_COMPLETED",
        previous_fires_at: existingActive?.fires_at || null,
        new_fires_at: null,
        reason: data.callOutcomeNote || "completed_by_staff",
        reason_label: data.callOutcomeNote ? `Completed: ${data.callOutcomeNote}` : "Callback Completed",
        previous_reason: prevReason,
        previous_reason_label: prevLabel,
        channel: "call",
        source: "employee",
      });
    } catch (hErr) {
      console.warn("[completeOrderCallback] history log warning:", hErr);
    }

    try {
      await admin.from("application_events").insert({
        application_id: data.orderId,
        event_type: "callback_completed",
        note: `Customer callback marked completed by ${staff.staff_name}.${data.callOutcomeNote ? ` Note: ${data.callOutcomeNote}` : ""}`,
        staff_name: staff.staff_name,
        staff_role: staff.staff_role || "staff",
      } as never);
    } catch (evtErr) {
      console.warn("[completeOrderCallback] event log warning:", evtErr);
    }

    try {
      const { logEmployeeOrderAction } = await import("@/lib/orders/order-action-logger.server");
      await logEmployeeOrderAction({
        orderId: data.orderId,
        employeeId: context.userId,
        employeeName: staff.staff_name,
        employeeRole: staff.staff_role,
        actionType: "CUSTOMER_CONTACTED",
        notes: `Callback completed by ${staff.staff_name}.${data.callOutcomeNote ? ` Outcome: ${data.callOutcomeNote}` : ""}`,
        source: "employee",
        supabase: admin,
      });
    } catch (auditErr) {
      console.warn("[completeOrderCallback] order_action_logs warning:", auditErr);
    }

    return { success: true };
  });

export const getActiveOrderCallback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ orderId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    const [{ data: row, error }, { data: app }, historyCountRes] = await Promise.all([
      admin
        .from("order_schedulers")
        .select("id, application_id, status, fires_at, remarks, created_at, created_by")
        .eq("application_id", data.orderId)
        .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("applications")
        .select("fulfillment_status, application_status, order_status, workflow_status")
        .eq("id", data.orderId)
        .maybeSingle(),
      admin
        .from("order_callback_history" as any)
        .select("id", { count: "exact", head: true })
        .eq("order_id", data.orderId)
        .then((res: any) => ({ count: res.count ?? 0 }))
        .catch(() => ({ count: 0 })),
    ]);

    if (error) {
      console.error("[getActiveOrderCallback] error:", error);
      return null;
    }

    if (!row) return null;

    const fs = String(app?.fulfillment_status ?? "").toLowerCase();
    const os = String(app?.order_status ?? "").toLowerCase();
    const as = String(app?.application_status ?? "").toLowerCase();
    const ws = String(app?.workflow_status ?? "").toLowerCase();
    const isTerminal =
      ["completed", "order_completed", "consultation_completed", "order_closed", "cancelled", "application_rejected"].includes(fs) ||
      ["completed", "closed", "cancelled"].includes(os) ||
      ["completed", "closed", "cancelled"].includes(as) ||
      ["completed", "closed", "cancelled"].includes(ws);

    if (isTerminal) {
      // Auto-heal: stop lingering scheduler for completed or closed orders
      await admin
        .from("order_schedulers")
        .update({
          status: "stopped",
          stopped_at: new Date().toISOString(),
          stop_reason: fs.includes("complete") ? "order_completed" : "order_closed",
        })
        .eq("application_id", data.orderId)
        .eq("status", "active");
      return null;
    }

    let parsedRemarks: CallbackRemarks | null = null;
    if (row.remarks) {
      try {
        parsedRemarks = typeof row.remarks === "string" ? JSON.parse(row.remarks) : row.remarks;
      } catch {
        parsedRemarks = { reason: "custom", reasonLabel: row.remarks };
      }
    }

    const firesAtTime = row.fires_at ? new Date(row.fires_at).getTime() : 0;
    const isDue = firesAtTime > 0 && firesAtTime <= Date.now();

    return {
      ...row,
      parsedRemarks,
      isDue,
      historyCount: historyCountRes?.count ?? 0,
    };
  });

export const getOrderCallbackHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ orderId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    try {
      const { data: rows, error } = await admin
        .from("order_callback_history" as any)
        .select("id, order_id, actor_id, actor_name, actor_role, action_type, previous_fires_at, new_fires_at, reason, reason_label, previous_reason, previous_reason_label, note, previous_note, channel, source, created_at")
        .eq("order_id", data.orderId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[getOrderCallbackHistory] query error:", error);
        return [];
      }

      if (!rows || rows.length === 0) return [];

      // Join current profile display names for actors
      const actorIds = Array.from(new Set(rows.map((r: any) => r.actor_id).filter(Boolean))) as string[];
      let profMap = new Map<string, string>();
      if (actorIds.length > 0) {
        const { data: profs } = await admin.from("profiles").select("id, display_name, email").in("id", actorIds);
        profMap = new Map((profs ?? []).map((p: any) => [p.id, (p.display_name as string) || (p.email as string)]));
      }

      return rows.map((r: any): CallbackHistoryItem => ({
        ...r,
        actor_name: (r.actor_id && profMap.get(r.actor_id)) || r.actor_name || "Staff",
      }));
    } catch (e) {
      console.warn("[getOrderCallbackHistory] warning:", e);
      return [];
    }
  });

export const getOrderCallbackHistoryCount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ orderId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    try {
      const { count } = await admin
        .from("order_callback_history" as any)
        .select("id", { count: "exact", head: true })
        .eq("order_id", data.orderId);

      return { count: count ?? 0 };
    } catch {
      return { count: 0 };
    }
  });

export const getDueRemindersSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({}).optional())
  .handler(async ({ context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();
    const nowMs = Date.now();

    // Check caller role
    const { data: isSuper } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    const { data: isAdminRole } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const isAdmin = !!(isSuper || isAdminRole);

    // Fetch all active callback reminders
    const { data: schedulers, error } = await admin
      .from("order_schedulers")
      .select("id, application_id, status, fires_at, remarks, created_at, created_by")
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active")
      .order("fires_at", { ascending: true })
      .limit(100);

    if (error || !schedulers || schedulers.length === 0) {
      return { dueReminders: [], upcomingReminders: [] };
    }

    const appIds = Array.from(new Set(schedulers.map((s) => s.application_id).filter(Boolean))) as string[];
    const { data: apps } = await admin
      .from("applications")
      .select("id, application_code, lead_id, customer_id, assigned_to, fulfillment_status, order_status, application_status, workflow_status")
      .in("id", appIds);

    const leadIds = Array.from(new Set((apps ?? []).map((a) => a.lead_id).filter(Boolean))) as string[];
    const { data: leads } = await admin
      .from("leads")
      .select("id, name, mobile, email, service")
      .in("id", leadIds);

    const appMap = new Map((apps ?? []).map((a) => [a.id, a]));
    const leadMap = new Map((leads ?? []).map((l) => [l.id, l]));

    // Auto-heal and filter out any schedulers whose orders are completed or closed
    const nonTerminalSchedulers: typeof schedulers = [];
    const lingeringTerminalAppIds: string[] = [];

    for (const s of schedulers) {
      const app = s.application_id ? appMap.get(s.application_id) : null;
      if (!app) continue;
      const fs = String(app.fulfillment_status ?? "").toLowerCase();
      const os = String(app.order_status ?? "").toLowerCase();
      const as = String(app.application_status ?? "").toLowerCase();
      const ws = String(app.workflow_status ?? "").toLowerCase();
      const isTerminal =
        ["completed", "order_completed", "consultation_completed", "order_closed", "cancelled", "application_rejected"].includes(fs) ||
        ["completed", "closed", "cancelled"].includes(os) ||
        ["completed", "closed", "cancelled"].includes(as) ||
        ["completed", "closed", "cancelled"].includes(ws);

      if (isTerminal) {
        if (s.application_id) lingeringTerminalAppIds.push(s.application_id);
      } else {
        nonTerminalSchedulers.push(s);
      }
    }

    if (lingeringTerminalAppIds.length > 0) {
      await admin
        .from("order_schedulers")
        .update({
          status: "stopped",
          stopped_at: new Date().toISOString(),
          stop_reason: "order_completed_or_closed",
        })
        .in("application_id", lingeringTerminalAppIds)
        .eq("status", "active");
    }

    const mapped = nonTerminalSchedulers.map((s) => {
      const app = s.application_id ? appMap.get(s.application_id) : null;
      const lead = app?.lead_id ? leadMap.get(app.lead_id) : null;

      let parsedRemarks: CallbackRemarks | null = null;
      if (s.remarks) {
        try {
          parsedRemarks = typeof s.remarks === "string" ? JSON.parse(s.remarks) : s.remarks;
        } catch {
          parsedRemarks = { reason: "custom", reasonLabel: row_remarks_fallback(s.remarks) };
        }
      }

      const firesAtTime = s.fires_at ? new Date(s.fires_at).getTime() : 0;
      const isDue = firesAtTime > 0 && firesAtTime <= nowMs;

      return {
        id: s.id,
        application_id: s.application_id,
        application_code: app?.application_code || "Order",
        assigned_to: app?.assigned_to || null,
        created_by: s.created_by || null,
        customer_name: lead?.name || "Customer",
        customer_mobile: lead?.mobile || "",
        service_name: lead?.service || "Service",
        fires_at: s.fires_at,
        isDue,
        remarks: parsedRemarks,
        created_at: s.created_at,
      };
    });

    const { filterRemindersForEmployee } = await import("@/lib/typesafe.server");
    const userScopedReminders = await filterRemindersForEmployee(context.userId, isAdmin, mapped);

    const dueReminders = userScopedReminders.filter((m) => m.isDue);
    const upcomingReminders = userScopedReminders.filter((m) => !m.isDue);

    return { dueReminders, upcomingReminders };
  });

function row_remarks_fallback(r: any): string {
  if (!r) return "Follow-up";
  return typeof r === "string" ? r : "Follow-up";
}
