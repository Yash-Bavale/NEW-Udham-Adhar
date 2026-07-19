// Phase 2 — Hold / Form / Await-Govt actions per order-lifecycle-spec v2.
// One createServerFn per spec button. Handlers only; helpers are inside handler
// bodies or imported from *.server.ts modules (server-fn split rules).

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ── shared validators ───────────────────────────────────────────────
const OrderId = z.string().uuid();
const ReminderMinutes = z.number().int().min(15).max(60 * 24 * 30); // 15min…30d

// ── Mark Form Pending (send E003 + arm 4h nudge + 8h auto-close) ────
export const markFormPending = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ orderId: OrderId, transitionOnly: z.boolean().default(false) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: updated, error } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: "FORM_PENDING",
    });
    if (error) throw new Error(error.message);

    const { armTimer } = await import("./timers.server");
    await armTimer({ applicationId: data.orderId, kind: "form_pending_nudge_4h", firesInMinutes: 4 * 60 });
    await armTimer({ applicationId: data.orderId, kind: "form_pending_autoclose_8h", firesInMinutes: 8 * 60 });

    return { ok: true, order: updated };
  });

// ── Mark Form Received (cancels form timers) ────────────────────────
export const markFormReceived = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ orderId: OrderId }).parse(raw))
  .handler(async ({ data, context }) => {
    const { data: updated, error } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: "FORM_RECEIVED",
    });
    if (error) throw new Error(error.message);

    const { cancelTimers } = await import("./timers.server");
    await cancelTimers(data.orderId, ["form_pending_nudge_4h", "form_pending_autoclose_8h"]);

    return { ok: true, order: updated };
  });

// ── Start Technical Hold (external → E005 customer email; internal → silent)
export const startTechnicalHold = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z
      .object({
        orderId: OrderId,
        kind: z.enum(["external", "internal"]),
        reasonId: z.string().uuid(),
        reminderMinutes: ReminderMinutes,
        remarks: z.string().max(2000).optional().nullable(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const targetStatus = data.kind === "external" ? "TECHNICAL_HOLD_EXTERNAL" : "TECHNICAL_HOLD_INTERNAL";

    const { data: updated, error } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: targetStatus,
      _reason_id: data.reasonId,
      _remarks: data.remarks ?? undefined,
    });
    if (error) throw new Error(error.message);

    // Stamp hold metadata + S05 Technical Delay fulfillment stage.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("applications")
      .update({
        technical_hold_started_at: new Date().toISOString(),
        technical_hold_kind: data.kind,
        active_reason_id: data.reasonId,
        fulfillment_status: "technical_delay",
      } as never)
      .eq("id", data.orderId);

    // Arm the recurring reminder timer.
    const { armTimer } = await import("./timers.server");
    await armTimer({
      applicationId: data.orderId,
      kind: "technical_hold_reminder",
      firesInMinutes: data.reminderMinutes,
      recurring: true,
      intervalMinutes: data.reminderMinutes,
      payload: { kind: data.kind, reasonId: data.reasonId },
    });

    // External-only: notify the customer via E005-style template.
    if (data.kind === "external") {
      const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
        import("@/lib/emails/emails.server"),
        import("@/lib/emails/bhs-templates"),
      ]);
      const { data: cust } = await supabaseAdmin
        .from("applications")
        .select("customers(primary_email, name), application_code, lead_id")
        .eq("id", data.orderId)
        .maybeSingle();
      const email = (cust as any)?.customers?.primary_email as string | undefined;
      if (email) {
        try {
          await enqueueFromTemplateInternal(
            BHS_EMAILS.E005_OUR_SIDE_DELAY,
            email,
            {
              customerName: ((cust as any)?.customers?.name as string) || "Customer",
              orderNumber: ((cust as any)?.application_code as string) || data.orderId.slice(0, 8),
              fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
            },
            { applicationId: data.orderId, leadId: ((cust as any)?.lead_id as string) ?? undefined },
          );
        } catch (e) {
          console.error("[startTechnicalHold] E005 enqueue failed", e);
        }
      }
    }

    return { ok: true, order: updated };
  });

// ── Mark Awaiting Govt Approval (internal-only reminders, no customer email)
export const markAwaitingGovt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ orderId: OrderId, reminderMinutes: ReminderMinutes }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: updated, error } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: "AWAITING_GOVT_APPROVAL",
    });
    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("applications")
      .update({ awaiting_govt_started_at: new Date().toISOString(), fulfillment_status: "government_processing" } as never)
      .eq("id", data.orderId);

    const { armTimer } = await import("./timers.server");
    await armTimer({
      applicationId: data.orderId,
      kind: "awaiting_govt_internal_reminder",
      firesInMinutes: data.reminderMinutes,
      recurring: true,
      intervalMinutes: data.reminderMinutes,
      payload: { internal_only: true },
    });

    return { ok: true, order: updated };
  });

// ── Resume from any hold (cancels reminders, moves back to IN_PROCESSING) ──
export const resumeFromHold = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ orderId: OrderId, target: z.enum(["IN_PROCESSING", "FORM_RECEIVED", "INFO_RECEIVED"]).default("IN_PROCESSING") }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Snapshot pre-resume state so we know whether the customer was notified
    // of a technical hold (external) and therefore needs the E011 resume email.
    const { data: preRow } = await supabaseAdmin
      .from("applications")
      .select("technical_hold_kind, lead_id, application_code, customers(primary_email, name)")
      .eq("id", data.orderId)
      .maybeSingle();
    const wasExternalTechHold = (preRow as any)?.technical_hold_kind === "external";

    const { data: updated, error } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: data.target,
    });
    if (error) throw new Error(error.message);

    const { cancelTimers } = await import("./timers.server");
    await cancelTimers(data.orderId, [
      "customer_hold_reminder",
      "technical_hold_reminder",
      "awaiting_govt_internal_reminder",
    ]);

    await supabaseAdmin
      .from("applications")
      .update({
        technical_hold_started_at: null,
        technical_hold_kind: null,
        customer_hold_started_at: null,
        awaiting_govt_started_at: null,
        active_reason_id: null,
        active_reason_text: null,
        // Delay resolved → revert to S04 Form Submitted (happy-flow hub)
        fulfillment_status: "form_submitted",
      } as never)
      .eq("id", data.orderId);

    // E011 — Technical Delay Resolved: notify the customer that we've resumed.
    if (wasExternalTechHold) {
      const email = (preRow as any)?.customers?.primary_email as string | undefined;
      if (email) {
        try {
          const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
            import("@/lib/emails/emails.server"),
            import("@/lib/emails/bhs-templates"),
          ]);
          const resolvedAt = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true,
          });
          await enqueueFromTemplateInternal(
            BHS_EMAILS.E011_TECHNICAL_DELAY_RESOLVED,
            email,
            {
              customerName: ((preRow as any)?.customers?.name as string) || "Customer",
              orderNumber: ((preRow as any)?.application_code as string) || data.orderId.slice(0, 8),
              resolved_at: resolvedAt,
              resolvedAt,
              fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
            },
            { applicationId: data.orderId, leadId: ((preRow as any)?.lead_id as string) ?? undefined },
          );
        } catch (e) {
          console.error("[resumeFromHold] E011 enqueue failed", e);
        }
      }
    }

    return { ok: true, order: updated };
  });
