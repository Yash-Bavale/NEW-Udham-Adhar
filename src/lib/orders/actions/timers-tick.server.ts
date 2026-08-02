// Phase 4 — Handlers for the new-lifecycle timer kinds.
// Invoked from workflow-tick (engine.server.tickDueTimers) for kinds the
// legacy state machine doesn't know about. Server-only; never imported by
// client code.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { TimerKind } from "./timers.server";

const NEW_KINDS: TimerKind[] = [
  "form_pending_nudge_4h",
  "form_pending_autoclose_8h",
  "customer_hold_reminder",
  "technical_hold_reminder",
  "awaiting_govt_internal_reminder",
];

export function isNewTimerKind(kind: string): kind is TimerKind {
  return (NEW_KINDS as string[]).includes(kind);
}

/** Handle a single due timer of the new lifecycle. Returns true if handled. */
export async function handleNewTimer(t: {
  id: string;
  application_id: string;
  kind: string;
  payload: Record<string, unknown> | null;
}): Promise<boolean> {
  if (!isNewTimerKind(t.kind)) return false;

  switch (t.kind) {
    case "form_pending_nudge_4h":
      await sendFormNudge(t.application_id);
      return true;

    case "form_pending_autoclose_8h":
      await autoCloseForm(t.application_id);
      return true;

    case "customer_hold_reminder":
    case "technical_hold_reminder":
      await sendHoldReminder(t.application_id, t.kind, t.payload ?? {});
      await rearmIfRecurring(t.id, t.application_id, t.kind);
      return true;

    case "awaiting_govt_internal_reminder":
      await notifyInternal(t.application_id);
      await rearmIfRecurring(t.id, t.application_id, t.kind);
      return true;
  }
  return false;
}

// ── helpers ──────────────────────────────────────────────────────────
async function loadCtx(appId: string) {
  const { data } = await supabaseAdmin
    .from("applications")
    .select("application_code, lead_id, assigned_to, customers(primary_email, name)")
    .eq("id", appId)
    .maybeSingle();
  return data as any;
}

async function sendFormNudge(appId: string) {
  const ctx = await loadCtx(appId);
  const email = ctx?.customers?.primary_email;
  if (!email) return;
  const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
    import("@/lib/emails/emails.server"),
    import("@/lib/emails/bhs-templates"),
  ]);
  try {
    await enqueueFromTemplateInternal(
      BHS_EMAILS.E003_FORM_LINK,
      email,
      {
        customerName: ctx?.customers?.name || "Customer",
        orderNumber: ctx?.application_code || appId.slice(0, 8),
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
      },
      { applicationId: appId, leadId: ctx?.lead_id ?? undefined },
    );
  } catch (e) {
    console.error("[timers-tick] form nudge failed", e);
  }
}

async function autoCloseForm(appId: string) {
  // Safety: never auto-close an order whose form already arrived or that has
  // already moved past the form stage.
  const { data: app } = await supabaseAdmin
    .from("applications")
    .select("order_status, fulfillment_status, form_status")
    .eq("id", appId)
    .maybeSingle();
  const row = app as any;
  if (!row) return;
  const formIn =
    String(row.form_status ?? "").toLowerCase() === "submitted" ||
    ["form_submitted", "documents_received", "under_processing", "completed", "order_completed", "order_closed", "cancelled"].includes(
      String(row.fulfillment_status ?? ""),
    ) ||
    ["FORM_RECEIVED", "INFO_RECEIVED", "IN_PROCESSING", "COMPLETED", "CLOSED", "REFUND_PROCESSED"].includes(
      String(row.order_status ?? ""),
    );
  if (formIn) {
    const { cancelTimers } = await import("./timers.server");
    await cancelTimers(appId, ["form_pending_nudge_4h", "form_pending_autoclose_8h"]);
    return;
  }

  // Pick a default reason: the first active "form abandoned" style reason.
  const { data: reason } = await supabaseAdmin
    .from("order_close_reasons")
    .select("id")
    .eq("is_active", true)
    .order("number")
    .limit(1)
    .maybeSingle();
  const reasonId = (reason as any)?.id;
  if (!reasonId) {
    console.error("[timers-tick] no default close reason found");
    return;
  }
  // Force-close via RPC.
  const { error } = await supabaseAdmin.rpc("transition_order_status" as any, {
    _order_id: appId,
    _new_status: "CLOSED",
    _reason_id: reasonId,
    _remarks: "Auto-close: form not received within 8h",
    _force: true,
  } as any);
  if (error) {
    console.error("[timers-tick] autoclose transition failed", error.message);
    return;
  }
  // Cancel remaining form timers + send E010.
  const { cancelTimers } = await import("./timers.server");
  await cancelTimers(appId, ["form_pending_nudge_4h", "form_pending_autoclose_8h"]);
  const ctx = await loadCtx(appId);
  const email = ctx?.customers?.primary_email;
  if (email) {
    const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
      import("@/lib/emails/emails.server"),
      import("@/lib/emails/bhs-templates"),
    ]);
    try {
      await enqueueFromTemplateInternal(
        BHS_EMAILS.E010_TICKET_CLOSED_FINAL,
        email,
        {
          customerName: ctx?.customers?.name || "Customer",
          orderNumber: ctx?.application_code || appId.slice(0, 8),
          reason: "Form not received within 8 hours",
          fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
        },
        { applicationId: appId, leadId: ctx?.lead_id ?? undefined },
      );
    } catch (e) {
      console.error("[timers-tick] autoclose E010 failed", e);
    }
  }
}

async function sendHoldReminder(
  appId: string,
  kind: "customer_hold_reminder" | "technical_hold_reminder",
  payload: Record<string, unknown>,
) {
  // Technical-hold reminders are internal-only when kind === 'internal'.
  if (kind === "technical_hold_reminder" && (payload as any)?.kind === "internal") {
    await notifyInternal(appId);
    return;
  }
  const ctx = await loadCtx(appId);
  const email = ctx?.customers?.primary_email;
  if (!email) return;
  const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
    import("@/lib/emails/emails.server"),
    import("@/lib/emails/bhs-templates"),
  ]);
  const template =
    kind === "customer_hold_reminder"
      ? BHS_EMAILS.E004_CUSTOMER_DELAY
      : BHS_EMAILS.E005_OUR_SIDE_DELAY;
  try {
    await enqueueFromTemplateInternal(
      template,
      email,
      {
        customerName: ctx?.customers?.name || "Customer",
        orderNumber: ctx?.application_code || appId.slice(0, 8),
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
      },
      { applicationId: appId, leadId: ctx?.lead_id ?? undefined },
    );
  } catch (e) {
    console.error("[timers-tick] hold reminder failed", kind, e);
  }
}

async function notifyInternal(appId: string) {
  const ctx = await loadCtx(appId);
  const assignee = ctx?.assigned_to as string | null | undefined;
  if (!assignee) return;
  try {
    await supabaseAdmin.from("notifications").insert({
      user_id: assignee,
      kind: "order_reminder",
      title: "Order needs follow-up",
      body: `Order ${ctx?.application_code || appId.slice(0, 8)} awaiting action`,
      href: `/admin/orders/${appId}`,
      entity_kind: "order",
      entity_id: appId,
    } as never);
  } catch (e) {
    console.error("[timers-tick] internal notify failed", e);
  }
}

async function rearmIfRecurring(timerId: string, appId: string, kind: string) {
  const { data: prev } = await supabaseAdmin
    .from("workflow_timers")
    .select("recurring, custom_interval_minutes, payload, dedup_key")
    .eq("id", timerId)
    .maybeSingle();
  const row = prev as any;
  if (!row?.recurring || !row?.custom_interval_minutes) return;
  const firesAt = new Date(Date.now() + row.custom_interval_minutes * 60_000).toISOString();
  await supabaseAdmin.from("workflow_timers").insert({
    application_id: appId,
    kind,
    status: "running",
    fires_at: firesAt,
    recurring: true,
    custom_interval_minutes: row.custom_interval_minutes,
    payload: row.payload ?? {},
    dedup_key: row.dedup_key ?? null,
  } as never);
}
