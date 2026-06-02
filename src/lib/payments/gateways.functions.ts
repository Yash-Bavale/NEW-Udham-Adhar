import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({ leadCode: z.string().trim().min(3).max(80) });

/**
 * Public summary used on /apply/:leadCode/summary.
 * Returns service info, customer contact, full pricing breakdown (base/GST/total)
 * and enabled payment gateways.
 */
export const getApplicationSummary = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .select(
        "id, lead_code, name, email, mobile, service, base_amount, gst_amount, total_amount, status",
      )
      .eq("lead_code", data.leadCode)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!lead) throw new Error("Application not found");

    const { data: gateways } = await supabaseAdmin
      .from("payment_gateways")
      .select("name, display_name, is_enabled, priority")
      .eq("is_enabled", true)
      .order("priority", { ascending: true });

    return {
      lead: {
        leadCode: lead.lead_code,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        service: lead.service,
        baseAmount: Number(lead.base_amount ?? 0),
        gstAmount: Number(lead.gst_amount ?? 0),
        totalAmount: Number(lead.total_amount ?? 0),
        status: lead.status,
      },
      gateways: gateways ?? [],
    };
  });

// ── Customer self-edit of contact details (pre-payment only) ──

const UpdateContact = z.object({
  leadCode: z.string().trim().min(3).max(80),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export const updateLeadContact = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => UpdateContact.parse(i))
  .handler(async ({ data }) => {
    // Only allow edits before payment is captured
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("id, status")
      .eq("lead_code", data.leadCode)
      .maybeSingle();
    if (!lead) throw new Error("Application not found");
    if (lead.status === "payment_successful" || lead.status === "completed") {
      throw new Error("Details can't be changed after payment.");
    }

    const { error } = await supabaseAdmin
      .from("leads")
      .update({
        name: data.name,
        email: data.email.toLowerCase(),
        mobile: data.mobile,
      })
      .eq("id", lead.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ── Admin: gateway management ──

export const listGateways = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("payment_gateways")
      .select("id, name, display_name, is_enabled, priority, webhook_secret_name, updated_at")
      .order("priority", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

const GatewayUpdate = z.object({
  id: z.string().uuid(),
  is_enabled: z.boolean(),
  priority: z.number().int().min(0).max(999),
});

export const updateGateway = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => GatewayUpdate.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("payment_gateways")
      .update({ is_enabled: data.is_enabled, priority: data.priority })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
