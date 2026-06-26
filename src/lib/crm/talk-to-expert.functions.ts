import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertRole } from "@/lib/audit";
import { isTalkToExpertLead, isUnconvertedConsultationLead } from "@/lib/crm/consultation";

const STAFF_ROLES = [
  "super_admin", "admin", "manager", "executive",
  "support", "accounts", "finance", "operations",
] as const;

const Input = z.object({
  leadId: z.string().uuid(),
  serviceId: z.string().uuid(),
});

function appOrigin() {
  return process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
}
function newTrackingToken(leadCode: string) {
  return `LNK-${leadCode}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}

/**
 * Convert a Talk-to-Expert lead into a real paid service.
 * - Updates the lead with the new service & pricing (server-computed, never returned).
 * - Mints a fresh payment link.
 * - Sends the link to the customer via email (template: consultation_service_converted).
 *
 * Employee sees zero pricing — this is intentional per product spec.
 */
export const convertConsultationLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data, context }) => {
    await assertRole(context.supabase, [...STAFF_ROLES] as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: lead, error: leadErr } = await supabaseAdmin
      .from("leads")
      .select("id, lead_code, name, email, mobile, service, lead_source")
      .eq("id", data.leadId)
      .maybeSingle();
    if (leadErr) throw new Error(leadErr.message);
    if (!lead) throw new Error("Lead not found");
    if (!isTalkToExpertLead(lead)) {
      throw new Error("This lead is not a Talk-to-Expert consultation.");
    }
    if (!isUnconvertedConsultationLead(lead)) {
      throw new Error("Lead has already been converted to a service.");
    }

    const { data: svc, error: svcErr } = await supabaseAdmin
      .from("services")
      .select("id, service_name, base_amount, gst_amount, total_amount, is_active")
      .eq("id", data.serviceId)
      .maybeSingle();
    if (svcErr) throw new Error(svcErr.message);
    if (!svc || !svc.is_active) throw new Error("Service unavailable.");

    const base = Number(svc.base_amount ?? 0);
    const gst = Number(svc.gst_amount ?? 0);
    const total = Number(svc.total_amount ?? base + gst);

    // 1. Update lead → new service + pricing + status
    const { error: updErr } = await supabaseAdmin
      .from("leads")
      .update({
        service: svc.service_name,
        service_id: svc.id,
        base_amount: base,
        gst_amount: gst,
        total_amount: total,
        status: "payment_pending",
        lead_status_v2: "payment_pending",
      } as never)
      .eq("id", lead.id);
    if (updErr) throw new Error(updErr.message);

    // Keep the paid consultation order visible, but make it point at the newly
    // selected service and wait for the second payment before normal fulfillment.
    const { data: app } = await supabaseAdmin
      .from("applications")
      .select("id")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (app?.id) {
      await supabaseAdmin
        .from("applications")
        .update({
          service_id: svc.id,
          application_status: "awaiting_payment",
          workflow_status: "waiting_for_customer",
          workflow_priority: "high",
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", app.id);

      await supabaseAdmin.from("workflow_events").insert({
        application_id: app.id,
        lead_id: lead.id,
        event_type: "consultation_converted",
        title: "Consultation converted to service",
        description: `Customer requirement confirmed. New service selected: ${svc.service_name}. Payment link sent automatically.`,
        customer_visible: false,
        actor_id: context.userId,
        actor_name: "Staff",
        is_system: false,
        metadata: { service_id: svc.id, service_name: svc.service_name, payment_url: paymentUrl } as never,
      } as never);
    }

    // 2. Activity log
    await supabaseAdmin.from("activity_logs").insert({
      lead_id: lead.id,
      user_id: context.userId,
      activity_type: "service_converted",
      activity_description: `Converted from Expert Consultation → ${svc.service_name}`,
      metadata: { service_id: svc.id, service_name: svc.service_name } as never,
    } as never);

    // 3. Void any existing pending links, mint a fresh one
    await supabaseAdmin
      .from("payment_links" as any)
      .update({ status: "expired" } as any)
      .eq("lead_id", lead.id)
      .eq("status", "pending");

    const leadCode = lead.lead_code ?? lead.id;
    const txnid = newTrackingToken(leadCode);
    const paymentUrl = `${appOrigin()}/payment/${encodeURIComponent(leadCode)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error: linkErr } = await supabaseAdmin
      .from("payment_links" as any)
      .insert({
        lead_id: lead.id,
        txnid,
        payment_url: paymentUrl,
        amount: total,
        status: "pending",
        expires_at: expiresAt,
        created_by: context.userId,
      } as any);
    if (linkErr) throw new Error(linkErr.message);

    // 4. Email the customer (best-effort)
    if (lead.email) {
      try {
        const { enqueueFromTemplateInternal } = await import("@/lib/emails/emails.server");
        await enqueueFromTemplateInternal(
          "consultation_service_converted",
          lead.email,
          {
            customer_name: lead.name,
            order_number: leadCode,
            service: svc.service_name,
            payment_url: paymentUrl,
            total_amount: total.toFixed(2),
            support_email: "help@businesshelpservices.com",
            business_name: "Business Help Services",
            website: "udyamadhar.in",
          },
          { toName: lead.name, leadId: lead.id },
        );
      } catch {
        // Don't fail the whole conversion if email enqueue hiccups.
      }
    }

    return { ok: true as const };
  });
