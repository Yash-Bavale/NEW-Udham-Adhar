import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({ leadCode: z.string().trim().min(3).max(80) });

/**
 * Public summary used on /apply/:leadCode/summary.
 * Returns service name, customer name, total amount, and enabled payment gateways.
 * Pricing breakdown (base/GST) is intentionally NOT exposed publicly — only `total`.
 */
export const getApplicationSummary = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const { data: lead, error } = await supabaseAdmin
      .from("leads")
      .select("id, lead_code, name, email, mobile, service, total_amount, status")
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
        totalAmount: Number(lead.total_amount ?? 0),
        status: lead.status,
      },
      gateways: gateways ?? [],
    };
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
