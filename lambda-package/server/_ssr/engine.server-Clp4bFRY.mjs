function initialState(assignedTo) {
  return {
    stage: "payment_successful",
    status: "not_started",
    paused: false,
    assignedTo: assignedTo ?? null
  };
}
const CLOSURE_MINUTES = 8 * 60;
const FORM_NUDGE_MINUTES = 5;
function reduce(state, event) {
  switch (event.type) {
    case "OrderCreated":
      return {
        next: { ...state, stage: "payment_successful", status: "not_started", assignedTo: event.assignedTo ?? state.assignedTo },
        effects: [
          { kind: "start_automation", code: "incomplete_form_flow" },
          { kind: "start_timer", timer: "incomplete_form", inMinutes: FORM_NUDGE_MINUTES, dedupKey: "initial" }
        ],
        title: "Order created",
        category: "system",
        icon: "sparkles"
      };
    case "PaymentReceived":
      return { next: state, effects: [], title: `Payment received ₹${event.amount}`, category: "customer", icon: "credit-card" };
    case "InvoiceGenerated":
      return { next: state, effects: [], title: `Invoice ${event.invoiceNumber} generated`, category: "system", icon: "file-text" };
    case "WelcomeEmailSent":
      return { next: state, effects: [], title: "Welcome email sent", category: "email", icon: "mail" };
    case "FormLinkSent":
      return { next: { ...state, stage: "form", status: "not_started" }, effects: [], title: `Form link sent via ${event.channel}`, category: "email", icon: "link" };
    case "FormOpened":
      return { next: state, effects: [], title: "Customer opened form", category: "customer", icon: "eye" };
    case "FormSubmitted":
      return {
        next: { ...state, stage: "verification", status: "verification_pending", paused: false, pauseReason: null },
        effects: [
          { kind: "cancel_timers", timers: ["incomplete_form", "closure"] },
          { kind: "stop_automation", code: "incomplete_form_flow" }
        ],
        title: "Form submitted → verification pending",
        category: "customer",
        icon: "check-circle"
      };
    case "FormTimeout5m":
      return {
        next: { ...state, stage: "form", status: "waiting_customer" },
        effects: [
          { kind: "send_email", template: "incomplete_information", payload: { resumeLink: true } },
          { kind: "start_timer", timer: "closure", inMinutes: CLOSURE_MINUTES, dedupKey: "form_closure" },
          { kind: "record_event", title: "Incomplete information email sent", icon: "mail", category: "email" }
        ],
        title: "Form not submitted in 5 minutes",
        category: "automation",
        icon: "clock"
      };
    case "FormTimeout8h":
    case "ClosureTimerFired":
      return {
        next: { ...state, stage: "closed", status: "closed", paused: false },
        effects: [
          { kind: "send_email", template: "closure_final" },
          { kind: "stop_automation", code: "incomplete_form_flow" },
          { kind: "stop_automation", code: "closure_flow" }
        ],
        title: "Order closed automatically",
        category: "automation",
        icon: "x-circle"
      };
    case "DelayReasonSet": {
      if (event.kind === "customer_side") {
        return {
          next: { ...state, status: "waiting_customer" },
          effects: [
            { kind: "start_automation", code: "closure_flow", context: { reasonCode: event.reasonCode } },
            { kind: "send_email", template: "closure_intimation" },
            { kind: "start_timer", timer: "closure", inMinutes: CLOSURE_MINUTES, dedupKey: `delay_${event.reasonCode}` }
          ],
          title: `Customer-side delay: ${event.reasonCode}`,
          category: "employee",
          icon: "alert-triangle"
        };
      }
      return {
        next: { ...state, status: "under_process", subStatus: "our_side_delay" },
        effects: [
          { kind: "start_automation", code: "gov_reminder_flow", context: { reasonCode: event.reasonCode } },
          { kind: "send_email", template: "gov_delay_notification" },
          { kind: "start_timer", timer: "reminder", inMinutes: 120, dedupKey: "gov_reminder" }
        ],
        title: `Our-side delay: ${event.reasonCode}`,
        category: "employee",
        icon: "server"
      };
    }
    case "CustomerEmailReceived":
      return {
        next: { ...state, paused: true, pauseReason: "ticket_open", activeTicketId: event.ticketId },
        effects: [
          { kind: "pause_timers", timers: ["closure", "reminder", "incomplete_form"] },
          { kind: "pause_automation", code: "closure_flow" },
          { kind: "pause_automation", code: "incomplete_form_flow" }
        ],
        title: "Customer replied → workflow paused",
        category: "customer",
        icon: "message-square"
      };
    case "TicketOpened":
      return { next: { ...state, activeTicketId: event.ticketId }, effects: [], title: "Ticket opened", category: "system", icon: "life-buoy" };
    case "TicketReplied":
      return { next: state, effects: [], title: "Ticket reply", category: "employee", icon: "reply" };
    case "TicketClosed": {
      if (event.outcome === "cooperating") {
        return {
          next: { ...state, paused: false, pauseReason: null, activeTicketId: null },
          effects: [
            { kind: "resume_timers", timers: ["closure", "reminder", "incomplete_form"] },
            { kind: "resume_automation", code: "closure_flow" },
            { kind: "resume_automation", code: "incomplete_form_flow" }
          ],
          title: "Ticket closed — workflow resumed",
          category: "employee",
          icon: "play"
        };
      }
      return {
        next: { ...state, paused: false, pauseReason: null, activeTicketId: null, stage: "closed", status: "closed" },
        effects: [
          { kind: "send_email", template: "closure_final" },
          { kind: "stop_automation", code: "closure_flow" },
          { kind: "stop_automation", code: "incomplete_form_flow" },
          { kind: "cancel_timers", timers: ["closure", "reminder", "incomplete_form"] }
        ],
        title: "Ticket closed — order closed",
        category: "employee",
        icon: "x-circle"
      };
    }
    case "WorkflowResumed":
      return {
        next: { ...state, paused: false, pauseReason: null },
        effects: [
          { kind: "resume_timers", timers: ["closure", "reminder", "incomplete_form"] },
          { kind: "resume_automation", code: "closure_flow" },
          { kind: "resume_automation", code: "incomplete_form_flow" }
        ],
        title: "Workflow resumed by employee",
        category: "employee",
        icon: "play"
      };
    case "VerificationStarted":
      return { next: { ...state, stage: "verification", status: "verification_pending" }, effects: [], title: "Verification started", category: "employee", icon: "shield" };
    case "VerificationCompleted":
      return {
        next: { ...state, stage: "government_portal", status: "upload_pending" },
        effects: [{ kind: "cancel_timers", timers: ["closure"] }, { kind: "stop_automation", code: "closure_flow" }],
        title: "Verification completed → government portal",
        category: "employee",
        icon: "shield-check"
      };
    case "GovUploadPending":
      return { next: { ...state, stage: "government_portal", status: "upload_pending" }, effects: [], title: "Awaiting government upload", category: "system", icon: "upload" };
    case "GovUploaded":
      return { next: { ...state, stage: "government_portal", status: "under_process" }, effects: [], title: "Application uploaded to government portal", category: "employee", icon: "upload-cloud" };
    case "GovApproved":
      return { next: { ...state, stage: "government_portal", status: "approved" }, effects: [{ kind: "stop_automation", code: "gov_reminder_flow" }, { kind: "cancel_timers", timers: ["reminder"] }], title: "Government approved", category: "government", icon: "check" };
    case "GovRejected":
      return {
        next: { ...state, stage: "closed", status: "rejected" },
        effects: [
          { kind: "send_email", template: "gov_rejection" },
          { kind: "stop_automation", code: "gov_reminder_flow" },
          { kind: "cancel_timers", timers: ["reminder"] }
        ],
        title: `Government rejected: ${event.reason}`,
        category: "government",
        icon: "x"
      };
    case "CertificateUploaded":
      return {
        next: { ...state, stage: "completed", status: "completed" },
        effects: [
          { kind: "send_email", template: "order_completed" },
          { kind: "stop_automation", code: "gov_reminder_flow" },
          { kind: "cancel_timers", timers: ["reminder", "closure", "incomplete_form"] }
        ],
        title: "Certificate uploaded — order completed",
        category: "employee",
        icon: "award"
      };
    case "ReminderScheduled":
      return {
        next: state,
        effects: [{ kind: "start_timer", timer: "reminder", inMinutes: event.everyMinutes, dedupKey: "gov_reminder", payload: { every: event.everyMinutes } }],
        title: `Reminder every ${event.everyMinutes} min`,
        category: "employee",
        icon: "bell"
      };
    case "ReminderFired":
      return {
        next: state,
        effects: [{ kind: "start_timer", timer: "reminder", inMinutes: 120, dedupKey: "gov_reminder" }],
        title: "Reminder triggered",
        category: "automation",
        icon: "bell-ring"
      };
    case "OrderClosed":
      return {
        next: { ...state, stage: "closed", status: "closed" },
        effects: [
          { kind: "stop_automation", code: "closure_flow" },
          { kind: "stop_automation", code: "incomplete_form_flow" },
          { kind: "stop_automation", code: "gov_reminder_flow" },
          { kind: "cancel_timers", timers: ["closure", "reminder", "incomplete_form"] }
        ],
        title: `Order closed: ${event.reason}`,
        category: "system",
        icon: "x-circle"
      };
  }
}
async function getAdmin() {
  const m = await import("./client.server-3kDCe7R3.mjs");
  return m.supabaseAdmin;
}
async function loadState(supabase, applicationId) {
  const { data } = await supabase.from("workflow_states").select("stage,status,sub_status,paused,pause_reason,active_ticket_id,assigned_to").eq("application_id", applicationId).maybeSingle();
  if (!data) return initialState();
  return {
    stage: data.stage,
    status: data.status,
    subStatus: data.sub_status,
    paused: !!data.paused,
    pauseReason: data.pause_reason,
    activeTicketId: data.active_ticket_id,
    assignedTo: data.assigned_to
  };
}
async function saveState(supabase, applicationId, next) {
  await supabase.from("workflow_states").upsert(
    {
      application_id: applicationId,
      stage: next.stage,
      status: next.status,
      sub_status: next.subStatus ?? null,
      paused: next.paused,
      pause_reason: next.pauseReason ?? null,
      active_ticket_id: next.activeTicketId ?? null,
      assigned_to: next.assignedTo ?? null,
      last_event_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "application_id" }
  );
}
async function applyEffect(supabase, applicationId, effect, actorId) {
  switch (effect.kind) {
    case "start_timer": {
      const firesAt = new Date(Date.now() + effect.inMinutes * 6e4).toISOString();
      await supabase.from("workflow_timers").upsert(
        {
          application_id: applicationId,
          kind: effect.timer,
          status: "running",
          fires_at: firesAt,
          payload: effect.payload ?? {},
          dedup_key: effect.dedupKey ?? null
        },
        { onConflict: "application_id,kind,dedup_key" }
      );
      return;
    }
    case "cancel_timers":
      await supabase.from("workflow_timers").update({ status: "stopped" }).eq("application_id", applicationId).in("kind", effect.timers).in("status", ["running", "paused"]);
      return;
    case "pause_timers": {
      const { data: rows } = await supabase.from("workflow_timers").select("id,fires_at").eq("application_id", applicationId).in("kind", effect.timers).eq("status", "running");
      const now = Date.now();
      for (const r of rows ?? []) {
        const remaining = Math.max(0, new Date(r.fires_at).getTime() - now);
        await supabase.from("workflow_timers").update({ status: "paused", paused_at: (/* @__PURE__ */ new Date()).toISOString(), remaining_ms: remaining }).eq("id", r.id);
      }
      return;
    }
    case "resume_timers": {
      const { data: rows } = await supabase.from("workflow_timers").select("id,remaining_ms").eq("application_id", applicationId).in("kind", effect.timers).eq("status", "paused");
      for (const r of rows ?? []) {
        const firesAt = new Date(Date.now() + (r.remaining_ms ?? 0)).toISOString();
        await supabase.from("workflow_timers").update({ status: "running", paused_at: null, remaining_ms: null, fires_at: firesAt }).eq("id", r.id);
      }
      return;
    }
    case "start_automation":
      await supabase.from("workflow_automations").upsert(
        {
          application_id: applicationId,
          code: effect.code,
          status: "running",
          context: effect.context ?? {}
        },
        { onConflict: "application_id,code" }
      );
      return;
    case "stop_automation":
      await supabase.from("workflow_automations").update({ status: "stopped", ended_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("application_id", applicationId).eq("code", effect.code).in("status", ["running", "paused"]);
      return;
    case "pause_automation":
      await supabase.from("workflow_automations").update({ status: "paused" }).eq("application_id", applicationId).eq("code", effect.code).eq("status", "running");
      return;
    case "resume_automation":
      await supabase.from("workflow_automations").update({ status: "running" }).eq("application_id", applicationId).eq("code", effect.code).eq("status", "paused");
      return;
    case "send_email": {
      const map = {
        incomplete_information: "welcome_and_form_link",
        closure_final: "order_closure_confirmation",
        closure_intimation: "bhs_e003_customer_delay",
        gov_delay_notification: "bhs_e004_our_side_delay",
        gov_rejection: "order_closure_confirmation",
        order_completed: "order_completed"
      };
      const code = map[effect.template] ?? effect.template;
      let toEmail = null;
      try {
        const { data: app } = await supabase.from("applications").select("customer_id, lead_id").eq("id", applicationId).maybeSingle();
        const row = app;
        if (row?.customer_id) {
          const { data: cust } = await supabase.from("customers").select("primary_email").eq("id", row.customer_id).maybeSingle();
          toEmail = cust?.primary_email ?? null;
        }
        if (!toEmail && row?.lead_id) {
          const { data: lead } = await supabase.from("leads").select("email").eq("id", row.lead_id).maybeSingle();
          toEmail = lead?.email ?? null;
        }
      } catch (err) {
        console.error("[workflow] recipient lookup failed", err);
      }
      if (!toEmail) {
        await supabase.from("workflow_events").insert({
          application_id: applicationId,
          event_type: "email_skipped",
          title: `Email skipped (${effect.template}): no recipient`,
          actor_id: actorId ?? null,
          actor_name: "System",
          is_system: true,
          metadata: { template: code }
        });
        return;
      }
      try {
        const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
        await enqueueFromTemplateInternal(
          code,
          toEmail,
          effect.payload ?? {},
          { applicationId, trigger: "auto" }
        );
        await supabase.from("workflow_events").insert({
          application_id: applicationId,
          event_type: "email_sent",
          title: `Email queued: ${code}`,
          actor_id: actorId ?? null,
          actor_name: "System",
          is_system: true,
          metadata: { template: code, to: toEmail }
        });
      } catch (err) {
        console.error("[workflow] send_email failed", code, err);
        await supabase.from("workflow_events").insert({
          application_id: applicationId,
          event_type: "email_failed",
          title: `Email failed: ${code}`,
          description: String(err),
          actor_id: actorId ?? null,
          actor_name: "System",
          is_system: true,
          metadata: { template: code, to: toEmail }
        });
      }
      return;
    }
    case "record_event":
      await supabase.from("workflow_events").insert({
        application_id: applicationId,
        event_type: "info",
        title: effect.title,
        description: effect.detail ?? null,
        actor_id: actorId ?? null,
        actor_name: "System",
        is_system: true,
        metadata: { icon: effect.icon, category: effect.category }
      });
      return;
  }
}
async function dispatchEvent(event, actorId) {
  const supabase = await getAdmin();
  const prev = await loadState(supabase, event.applicationId);
  const t = reduce(prev, event);
  await saveState(supabase, event.applicationId, t.next);
  for (const eff of t.effects) {
    try {
      await applyEffect(supabase, event.applicationId, eff, actorId);
    } catch (err) {
      console.error("[workflow] effect failed", eff.kind, err);
    }
  }
  await supabase.from("workflow_events").insert({
    application_id: event.applicationId,
    event_type: event.type,
    title: t.title,
    actor_id: actorId ?? null,
    actor_name: actorId ? "Employee" : "System",
    is_system: !actorId,
    metadata: { icon: t.icon, category: t.category, event }
  });
  return t.next;
}
async function tickDueTimers(now = /* @__PURE__ */ new Date()) {
  const supabase = await getAdmin();
  const { data: due } = await supabase.from("workflow_timers").select("id,application_id,kind,payload").eq("status", "running").lte("fires_at", now.toISOString()).limit(200);
  let fired = 0;
  const { handleNewTimer, isNewTimerKind } = await import("./timers-tick.server-D49qSd7Z.mjs");
  for (const t of due ?? []) {
    if (isNewTimerKind(t.kind)) {
      try {
        const handled = await handleNewTimer({
          id: t.id,
          application_id: t.application_id,
          kind: t.kind,
          payload: t.payload ?? null
        });
        if (handled) {
          await supabase.from("workflow_timers").update({ status: "fired", fired_at: now.toISOString() }).eq("id", t.id);
          fired++;
        }
      } catch (err) {
        console.error("[workflow] new-kind timer failed", t.id, err);
      }
      continue;
    }
    let event = null;
    if (t.kind === "incomplete_form") event = { type: "FormTimeout5m", applicationId: t.application_id };
    else if (t.kind === "closure") event = { type: "ClosureTimerFired", applicationId: t.application_id };
    else if (t.kind === "reminder") event = { type: "ReminderFired", applicationId: t.application_id };
    if (event) {
      try {
        await dispatchEvent(event);
        await supabase.from("workflow_timers").update({ status: "fired", fired_at: now.toISOString() }).eq("id", t.id);
        fired++;
      } catch (err) {
        console.error("[workflow] timer dispatch failed", t.id, err);
      }
    }
  }
  return { fired };
}
export {
  dispatchEvent,
  tickDueTimers
};
