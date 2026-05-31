import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SERVICES, SERVICE_LABELS, INDIAN_STATES, LANGUAGES } from "./constants";

const LeadInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: z.enum(INDIAN_STATES as [string, ...string[]]),
  language: z.enum(LANGUAGES as [string, ...string[]]),
  service: z.enum(SERVICE_LABELS as unknown as [string, ...string[]]),
  consent: z.literal(true, { message: "You must accept the terms to proceed" }),
});

/**
 * Public lead intake server function.
 * - Looks up service + dynamic pricing from DB
 * - Dedupes by email OR mobile within last 30 days (reuses lead, no duplicate row)
 * - Creates a linked application row
 * - Activity log entries are written automatically by DB triggers
 */
export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadInput.parse(input))
  .handler(async ({ data }) => {
    // 1. Map form label -> internal slug -> DB service row
    const slug = SERVICES.find((s) => s.label === data.service)?.slug;
    if (!slug) {
      throw new Error("Selected service is not available. Please try again.");
    }

    const { data: service, error: svcErr } = await supabaseAdmin
      .from("services")
      .select("id, service_name, base_amount, gst_amount, total_amount, is_active")
      .eq("service_code", slug)
      .maybeSingle();

    if (svcErr) throw new Error(svcErr.message);
    if (!service || !service.is_active) {
      throw new Error("Selected service is not currently available.");
    }

    const baseAmount = Number(service.base_amount);
    const gstAmount = Number(service.gst_amount);
    const totalAmount = Number(service.total_amount);

    // 2. Dedupe by email OR mobile in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: existing, error: dupErr } = await supabaseAdmin
      .from("leads")
      .select("id, lead_code, base_amount, gst_amount, total_amount")
      .or(`email.eq.${data.email.toLowerCase()},mobile.eq.${data.mobile}`)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dupErr) throw new Error(dupErr.message);

    let leadId: string;
    let leadCode: string;

    if (existing) {
      // Update existing lead with the latest submission details
      const { data: updated, error: updErr } = await supabaseAdmin
        .from("leads")
        .update({
          name: data.name,
          state: data.state,
          language: data.language,
          service: data.service,
          service_id: service.id,
          base_amount: baseAmount,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          lead_source: "website",
        })
        .eq("id", existing.id)
        .select("id, lead_code")
        .single();
      if (updErr || !updated) throw new Error(updErr?.message ?? "Could not update existing lead.");
      leadId = updated.id;
      leadCode = updated.lead_code as string;
    } else {
      // Create new lead
      const { data: row, error } = await supabaseAdmin
        .from("leads")
        .insert({
          name: data.name,
          email: data.email.toLowerCase(),
          mobile: data.mobile,
          state: data.state,
          language: data.language,
          service: data.service,
          service_id: service.id,
          base_amount: baseAmount,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          status: "new_lead",
          lead_source: "website",
        })
        .select("id, lead_code")
        .single();
      if (error || !row) {
        throw new Error(error?.message ?? "Could not save your details. Please try again.");
      }
      leadId = row.id;
      leadCode = row.lead_code as string;
    }

    // 3. Create application row (one per submission). Trigger writes activity log.
    const { error: appErr } = await supabaseAdmin
      .from("applications")
      .insert({
        lead_id: leadId,
        service_id: service.id,
        application_status: "awaiting_payment",
      });
    if (appErr) {
      // non-fatal: lead is saved, but log so we can fix
      console.error("Application insert failed:", appErr.message);
    }

    return {
      leadId,
      leadCode,
      baseAmount,
      gstAmount,
      totalAmount,
    };
  });
