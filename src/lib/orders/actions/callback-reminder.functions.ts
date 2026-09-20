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
  created_by_name?: string;
  created_at?: string;
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
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    const staff = await getStaff(context.userId);

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
      created_by_name: staff.staff_name,
      created_at: now.toISOString(),
    };

    // 1. Cancel any active callback reminder on this order first
    await admin
      .from("order_schedulers")
      .update({
        status: "cancelled",
        stopped_at: now.toISOString(),
        stop_reason: "rescheduled_new_callback",
        stop_triggered_by: context.userId,
      })
      .eq("application_id", data.orderId)
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active");

    // 2. Insert new callback reminder
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

    // 3. Log event in application_events if table exists
    try {
      await admin.from("application_events").insert({
        application_id: data.orderId,
        event_type: "callback_scheduled",
        title: `Callback Scheduled: ${data.reasonLabel}`,
        description: `Callback reminder set for ${firesAtDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}. Note: ${data.note || "None"}`,
        actor_id: context.userId,
        actor_name: staff.staff_name,
        metadata: {
          scheduler_id: created.id,
          reason: data.reason,
          reasonLabel: data.reasonLabel,
          fires_at: firesAtIso,
          note: data.note,
        },
      });
    } catch (evtErr) {
      // Non-fatal if application_events has specific constraints
      console.warn("[scheduleOrderCallback] event log warning:", evtErr);
    }

    return {
      success: true,
      scheduler: created,
    };
  });

export const cancelOrderCallback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        schedulerId: z.string().uuid().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const admin = await getAdmin();
    const staff = await getStaff(context.userId);
    const now = new Date().toISOString();

    let query = admin
      .from("order_schedulers")
      .update({
        status: "cancelled",
        stopped_at: now,
        stop_reason: "cancelled_by_staff",
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

    try {
      await admin.from("application_events").insert({
        application_id: data.orderId,
        event_type: "callback_cancelled",
        title: "Callback Reminder Cancelled",
        description: `Callback cancelled by ${staff.staff_name}`,
        actor_id: context.userId,
        actor_name: staff.staff_name,
      });
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

    try {
      await admin.from("application_events").insert({
        application_id: data.orderId,
        event_type: "callback_completed",
        title: "Callback Completed",
        description: `Customer callback marked completed by ${staff.staff_name}.${data.callOutcomeNote ? ` Note: ${data.callOutcomeNote}` : ""}`,
        actor_id: context.userId,
        actor_name: staff.staff_name,
      });
    } catch (evtErr) {
      console.warn("[completeOrderCallback] event log warning:", evtErr);
    }

    return { success: true };
  });

export const getActiveOrderCallback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ orderId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();

    const { data: row, error } = await admin
      .from("order_schedulers")
      .select("id, application_id, status, fires_at, remarks, created_at, created_by")
      .eq("application_id", data.orderId)
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[getActiveOrderCallback] error:", error);
      return null;
    }

    if (!row) return null;

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
    };
  });

export const getDueRemindersSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({}).optional())
  .handler(async ({ context }) => {
    await assertStaff(context.supabase);
    const admin = await getAdmin();
    const nowIso = new Date().toISOString();

    const { data: schedulers, error } = await admin
      .from("order_schedulers")
      .select("id, application_id, status, fires_at, remarks, created_at, created_by")
      .in("scheduler_type", ["our_side_reminder", "callback_reminder"])
      .eq("status", "active")
      .lte("fires_at", nowIso)
      .order("fires_at", { ascending: true })
      .limit(50);

    if (error || !schedulers || schedulers.length === 0) {
      return { dueReminders: [] };
    }

    const appIds = Array.from(new Set(schedulers.map((s) => s.application_id).filter(Boolean))) as string[];
    const { data: apps } = await admin
      .from("applications")
      .select("id, application_code, lead_id, customer_id, assigned_to")
      .in("id", appIds);

    const leadIds = Array.from(new Set((apps ?? []).map((a) => a.lead_id).filter(Boolean))) as string[];
    const { data: leads } = await admin
      .from("leads")
      .select("id, name, mobile, email, service")
      .in("id", leadIds);

    const appMap = new Map((apps ?? []).map((a) => [a.id, a]));
    const leadMap = new Map((leads ?? []).map((l) => [l.id, l]));

    const dueReminders = schedulers.map((s) => {
      const app = s.application_id ? appMap.get(s.application_id) : null;
      const lead = app?.lead_id ? leadMap.get(app.lead_id) : null;

      let parsedRemarks: CallbackRemarks | null = null;
      if (s.remarks) {
        try {
          parsedRemarks = typeof s.remarks === "string" ? JSON.parse(s.remarks) : s.remarks;
        } catch {
          parsedRemarks = { reason: "custom", reasonLabel: s.remarks };
        }
      }

      return {
        id: s.id,
        application_id: s.application_id,
        application_code: app?.application_code || "Order",
        assigned_to: app?.assigned_to || null,
        customer_name: lead?.name || "Customer",
        customer_mobile: lead?.mobile || "",
        service_name: lead?.service || "Service",
        fires_at: s.fires_at,
        remarks: parsedRemarks,
        created_at: s.created_at,
      };
    });

    return { dueReminders };
  });
