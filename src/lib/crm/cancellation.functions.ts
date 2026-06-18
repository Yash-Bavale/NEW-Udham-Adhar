// Cancellation workflow — staff records customer cancellation request (Step 1).
// Sets applications.closure_stage='request_received', schedules step2 in
// workflow_settings.step2_days, and enqueues the Step 1 email immediately.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SUPPORT_EMAIL =
  (typeof process !== "undefined" && process.env?.INTERNAL_NOTIFICATION_EMAIL) ||
  "support@udyamadhar.in";
const REFUND_POLICY_URL = "https://udyamadhar.in/refund-policy";

export const requestCancellation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        applicationId: z.string().uuid(),
        reason: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify staff role.
    const { data: isStaff } = await supabase.rpc("has_any_staff_role", {
      _user_id: userId,
    });
    if (!isStaff) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { enqueueFromTemplateInternal } = await import(
      "@/lib/emails/emails.server"
    );

    const { data: app, error: appErr } = await supabaseAdmin
      .from("applications")
      .select("id, application_code, lead_id, closure_stage")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (appErr || !app) throw new Error("Application not found");
    if (app.closure_stage && app.closure_stage !== "none") {
      throw new Error("Cancellation already in progress");
    }

    const { data: settings } = await supabaseAdmin
      .from("workflow_settings")
      .select("step2_days, step1_template_code, enabled")
      .limit(1)
      .maybeSingle();
    if (settings?.enabled === false) {
      throw new Error("Workflow automation is disabled in Settings");
    }
    const step2Days = settings?.step2_days ?? 7;
    const nextAt = new Date(Date.now() + step2Days * 86400_000).toISOString();

    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("name, email, service")
      .eq("id", app.lead_id)
      .maybeSingle();

    // Persist Step 1 stage.
    const { error: updErr } = await supabaseAdmin
      .from("applications")
      .update({
        cancellation_requested_at: new Date().toISOString(),
        closure_stage: "request_received",
        closure_next_at: nextAt,
      })
      .eq("id", app.id);
    if (updErr) throw new Error(updErr.message);

    // Activity log + internal note.
    await supabaseAdmin.from("activity_logs").insert({
      lead_id: app.lead_id,
      application_id: app.id,
      user_id: userId,
      activity_type: "cancellation_requested",
      activity_description: `Customer cancellation request recorded${
        data.reason ? `: ${data.reason}` : ""
      }`,
    });

    // Step 1 email immediately.
    if (lead?.email) {
      try {
        await enqueueFromTemplateInternal(
          settings?.step1_template_code ?? "cancellation-request-received",
          lead.email,
          {
            customer_name: lead.name ?? "",
            order_number: app.application_code ?? "",
            service_name: lead.service ?? "",
            refund_policy_url: REFUND_POLICY_URL,
            support_email: SUPPORT_EMAIL,
          },
          { toName: lead.name ?? undefined, leadId: app.lead_id },
        );
      } catch (e) {
        console.error("[cancellation] step1 email failed", e);
      }
    }

    return { ok: true, closureNextAt: nextAt };
  });

export const cancelClosureWorkflow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ applicationId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("has_any_staff_role", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("applications")
      .update({ closure_stage: "none", closure_next_at: null })
      .eq("id", data.applicationId);
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("activity_logs").insert({
      lead_id: null,
      application_id: data.applicationId,
      user_id: context.userId,
      activity_type: "cancellation_reverted",
      activity_description: "Cancellation workflow reverted by staff",
    });
    return { ok: true };
  });
