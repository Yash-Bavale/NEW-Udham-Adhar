import { c as createServerRpc } from "./createServerRpc-Cfd5n8x1.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { L as LEAD_STATUSES_V2, a as LEAD_TRANSITIONS_V2, b as LEAD_AUTO_CHAIN, c as LEAD_STATUS_EMAIL } from "./lead-transitions-BnGgq5Kd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string, _ as _enum } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function getStaff(supabase, userId) {
  const [{
    data: profile
  }, {
    data: roles
  }] = await Promise.all([supabase.from("profiles").select("display_name, email").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId)]);
  const staff_name = profile?.display_name || profile?.email || "Staff";
  const staff_role = roles?.[0]?.role ?? "staff";
  return {
    staff_name,
    staff_role
  };
}
async function queueEmailForStatus(opts) {
  const templateCode = LEAD_STATUS_EMAIL[opts.status];
  if (!templateCode || !opts.toEmail) return;
  const admin = await getAdmin();
  const {
    data: tpl
  } = await admin.from("email_templates").select("code, subject, body_html, body_text, variables").eq("code", templateCode).maybeSingle();
  const subject = tpl?.subject ?? `[${templateCode}] Update on your order`;
  const body_html = tpl?.body_html ?? `<p>Hi {{name}}, this is an automated notice regarding your order. (template: ${templateCode})</p>`;
  const body_text = tpl?.body_text ?? null;
  await admin.from("email_queue").insert({
    template_code: templateCode,
    to_email: opts.toEmail,
    to_name: opts.toName,
    subject,
    body_html,
    body_text,
    variables: {
      ...opts.variables ?? {},
      lead_id: opts.leadId,
      status: opts.status
    },
    lead_id: opts.leadId,
    application_id: opts.applicationId ?? null,
    created_by: opts.createdBy
  });
}
const TransitionInput = object({
  leadId: string().uuid(),
  toStatus: _enum(LEAD_STATUSES_V2),
  reason: string().trim().min(1).max(2e3).optional()
});
const transitionLeadStatus_createServerFn_handler = createServerRpc({
  id: "e6075969b838a5a062b1bd5d84660f2c78ae83af2027797a7ebb21ed9ce4e66a",
  name: "transitionLeadStatus",
  filename: "src/lib/crm/lead-status.functions.ts"
}, (opts) => transitionLeadStatus.__executeServer(opts));
const transitionLeadStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => TransitionInput.parse(i)).handler(transitionLeadStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    leadId
  } = data;
  const toStatus = data.toStatus;
  const {
    data: lead,
    error: leadErr
  } = await admin.from("leads").select("id, lead_code, name, email, mobile, customer_id, lead_status_v2, status").eq("id", leadId).single();
  if (leadErr || !lead) throw new Error("Lead not found");
  const fromStatus = lead.lead_status_v2 ?? "new_lead";
  if (fromStatus === toStatus) return {
    ok: true,
    noop: true
  };
  const allowed = LEAD_TRANSITIONS_V2[fromStatus] ?? [];
  if (!allowed.includes(toStatus)) {
    throw new Error(`Transition not allowed: ${fromStatus} → ${toStatus}`);
  }
  if (toStatus === "uninterested" && !data.reason) {
    throw new Error("Reason is required when marking a lead as uninterested.");
  }
  if (fromStatus === "under_process" && toStatus === "closed") {
    const {
      data: app
    } = await admin.from("applications").select("id, fulfillment_status").eq("lead_id", leadId).order("created_at", {
      ascending: false
    }).limit(1).maybeSingle();
    if (!app || app.fulfillment_status !== "completed") {
      throw new Error("Cannot close: linked order is not yet completed.");
    }
  }
  const {
    data: latestApp
  } = await admin.from("applications").select("id").eq("lead_id", leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    staff_name,
    staff_role
  } = await getStaff(admin, context.userId);
  const {
    error: updErr
  } = await admin.from("leads").update({
    lead_status_v2: toStatus
  }).eq("id", leadId);
  if (updErr) throw new Error(updErr.message);
  try {
    await admin.from("leads").update({
      status: toStatus
    }).eq("id", leadId);
  } catch {
  }
  await admin.from("application_events").insert({
    application_id: latestApp?.id ?? null,
    lead_id: leadId,
    customer_id: lead.customer_id ?? null,
    event_type: "lead_status_change",
    old_value: fromStatus,
    new_value: toStatus,
    note: data.reason ?? null,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  const pretty = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  await admin.from("activity_logs").insert({
    lead_id: leadId,
    application_id: latestApp?.id ?? null,
    activity_type: "lead_status_change",
    activity_description: `Lead status: ${pretty(fromStatus)} → ${pretty(toStatus)}${data.reason ? ` — ${data.reason}` : ""}`,
    user_id: context.userId
  });
  if (lead.email) {
    await queueEmailForStatus({
      status: toStatus,
      leadId,
      toEmail: lead.email,
      toName: lead.name,
      applicationId: latestApp?.id ?? null,
      variables: {
        lead_code: lead.lead_code,
        name: lead.name,
        reason: data.reason
      },
      createdBy: context.userId
    });
  }
  if (toStatus === "uninterested") {
    await admin.from("leads").update({
      lead_status_v2: "refund_requested"
    }).eq("id", leadId);
    if (latestApp?.id) {
      await admin.from("applications").update({
        refund_requested_at: (/* @__PURE__ */ new Date()).toISOString(),
        refund_reason: data.reason ?? null
      }).eq("id", latestApp.id);
    }
    await admin.from("application_events").insert({
      application_id: latestApp?.id ?? null,
      lead_id: leadId,
      customer_id: lead.customer_id ?? null,
      event_type: "lead_status_change",
      old_value: "uninterested",
      new_value: "refund_requested",
      note: "Auto-transition after uninterested.",
      created_by: context.userId,
      staff_name,
      staff_role: "system"
    });
  }
  const chain = LEAD_AUTO_CHAIN[toStatus];
  if (chain) {
    await admin.from("leads").update({
      lead_status_v2: chain
    }).eq("id", leadId);
    await admin.from("application_events").insert({
      application_id: latestApp?.id ?? null,
      lead_id: leadId,
      customer_id: lead.customer_id ?? null,
      event_type: "lead_status_change",
      old_value: toStatus,
      new_value: chain,
      note: "Auto-chain.",
      created_by: context.userId,
      staff_name,
      staff_role: "system"
    });
  }
  return {
    ok: true,
    from: fromStatus,
    to: toStatus
  };
});
const addManualNote_createServerFn_handler = createServerRpc({
  id: "b353c6087f9fac35710238d4e9182c7820cb9a4959bfd1ed2e5bea26bda5f87c",
  name: "addManualNote",
  filename: "src/lib/crm/lead-status.functions.ts"
}, (opts) => addManualNote.__executeServer(opts));
const addManualNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  note: string().trim().min(1).max(2e3)
}).parse(i)).handler(addManualNote_createServerFn_handler, async ({
  data,
  context
}) => {
  const admin = await getAdmin();
  const {
    data: lead
  } = await admin.from("leads").select("id, customer_id").eq("id", data.leadId).single();
  if (!lead) throw new Error("Lead not found");
  const {
    data: latestApp
  } = await admin.from("applications").select("id").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  const {
    staff_name,
    staff_role
  } = await getStaff(admin, context.userId);
  const {
    error
  } = await admin.from("application_events").insert({
    application_id: latestApp?.id ?? null,
    lead_id: data.leadId,
    customer_id: lead.customer_id ?? null,
    event_type: "note_added",
    note: data.note,
    created_by: context.userId,
    staff_name,
    staff_role
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listLeadEvents_createServerFn_handler = createServerRpc({
  id: "aa7b88a0b56a13b4e82bf291bf5e989aba84058f6b65b3a64a648d0e1fd6d7ed",
  name: "listLeadEvents",
  filename: "src/lib/crm/lead-status.functions.ts"
}, (opts) => listLeadEvents.__executeServer(opts));
const listLeadEvents = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(listLeadEvents_createServerFn_handler, async ({
  data
}) => {
  const admin = await getAdmin();
  const {
    data: events,
    error
  } = await admin.from("application_events").select("id, event_type, old_value, new_value, note, staff_name, staff_role, created_at").eq("lead_id", data.leadId).order("created_at", {
    ascending: false
  }).limit(500);
  if (error) throw new Error(error.message);
  return {
    events: events ?? []
  };
});
export {
  addManualNote_createServerFn_handler,
  listLeadEvents_createServerFn_handler,
  transitionLeadStatus_createServerFn_handler
};
