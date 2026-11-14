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
const NEW_KINDS = [
  "form_pending_nudge_4h",
  "form_pending_autoclose_8h",
  "customer_hold_reminder",
  "technical_hold_reminder",
  "awaiting_govt_internal_reminder"
];
function isNewTimerKind(kind) {
  return NEW_KINDS.includes(kind);
}
async function handleNewTimer(t) {
  if (!isNewTimerKind(t.kind)) return false;
  switch (t.kind) {
    case "form_pending_nudge_4h":
      await sendFormNudge(t.application_id);
      return true;
    case "form_pending_autoclose_8h":
      await autoCloseForm(t.application_id);
      return true;
    case "customer_hold_reminder": {
      const closed = await autoCloseCustomerDelay(t.application_id);
      if (!closed) throw new Error(`Customer-delay auto-close failed for ${t.application_id}`);
      return true;
    }
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
async function loadCtx(appId) {
  const { data } = await supabaseAdmin.from("applications").select("application_code, lead_id, assigned_to, customers(primary_email, name)").eq("id", appId).maybeSingle();
  return data;
}
async function sendFormNudge(appId) {
  const ctx = await loadCtx(appId);
  const email = ctx?.customers?.primary_email;
  if (!email) return;
  const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
    import("./emails.server-BTJhg2a3.mjs"),
    import("./bhs-templates-Gd1TLGXv.mjs")
  ]);
  try {
    await enqueueFromTemplateInternal(
      BHS_EMAILS.E003_FORM_LINK,
      email,
      {
        customerName: ctx?.customers?.name || "Customer",
        orderNumber: ctx?.application_code || appId.slice(0, 8),
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
      },
      { applicationId: appId, leadId: ctx?.lead_id ?? void 0 }
    );
  } catch (e) {
    console.error("[timers-tick] form nudge failed", e);
  }
}
async function autoCloseForm(appId) {
  const { autoCloseOverdueOrder } = await import("./auto-close.server-DpoJMDPx.mjs");
  const result = await autoCloseOverdueOrder(appId, "form_pending");
  if (!result.ok) throw new Error(`Form-pending auto-close failed: ${result.skipped}`);
}
async function autoCloseCustomerDelay(appId) {
  const { autoCloseOverdueOrder } = await import("./auto-close.server-DpoJMDPx.mjs");
  const res = await autoCloseOverdueOrder(appId, "customer_delay");
  return res.ok || res.skipped === "resolved";
}
async function sendHoldReminder(appId, kind, payload) {
  if (kind === "technical_hold_reminder" && payload?.kind === "internal") {
    await notifyInternal(appId);
    return;
  }
  const ctx = await loadCtx(appId);
  const email = ctx?.customers?.primary_email;
  if (!email) return;
  const [{ enqueueFromTemplateInternal }, { BHS_EMAILS }] = await Promise.all([
    import("./emails.server-BTJhg2a3.mjs"),
    import("./bhs-templates-Gd1TLGXv.mjs")
  ]);
  const template = kind === "customer_hold_reminder" ? BHS_EMAILS.E004_CUSTOMER_DELAY : BHS_EMAILS.E005_OUR_SIDE_DELAY;
  try {
    await enqueueFromTemplateInternal(
      template,
      email,
      {
        customerName: ctx?.customers?.name || "Customer",
        orderNumber: ctx?.application_code || appId.slice(0, 8),
        fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
      },
      { applicationId: appId, leadId: ctx?.lead_id ?? void 0 }
    );
  } catch (e) {
    console.error("[timers-tick] hold reminder failed", kind, e);
  }
}
async function notifyInternal(appId) {
  const ctx = await loadCtx(appId);
  const assignee = ctx?.assigned_to;
  if (!assignee) return;
  try {
    await supabaseAdmin.from("notifications").insert({
      user_id: assignee,
      kind: "order_reminder",
      title: "Order needs follow-up",
      body: `Order ${ctx?.application_code || appId.slice(0, 8)} awaiting action`,
      href: `/admin/orders/${appId}`,
      entity_kind: "order",
      entity_id: appId
    });
  } catch (e) {
    console.error("[timers-tick] internal notify failed", e);
  }
}
async function rearmIfRecurring(timerId, appId, kind) {
  const { data: prev } = await supabaseAdmin.from("workflow_timers").select("recurring, custom_interval_minutes, payload, dedup_key").eq("id", timerId).maybeSingle();
  const row = prev;
  if (!row?.recurring || !row?.custom_interval_minutes) return;
  const firesAt = new Date(Date.now() + row.custom_interval_minutes * 6e4).toISOString();
  await supabaseAdmin.from("workflow_timers").insert({
    application_id: appId,
    kind,
    status: "running",
    fires_at: firesAt,
    recurring: true,
    custom_interval_minutes: row.custom_interval_minutes,
    payload: row.payload ?? {},
    dedup_key: row.dedup_key ?? null
  });
}
export {
  handleNewTimer,
  isNewTimerKind
};
