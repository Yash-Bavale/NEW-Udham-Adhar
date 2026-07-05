// Server functions for the Employee Action Panel — atomic order actions that
// combine transition + email + scheduler side-effects.
//
// Phase 3 delivers the Customer-Side Delay action. Additional actions
// (Our-Side Delay, Send Form Link, Mark Submitted, Complete, Refund) land in
// Phase 5 on top of these primitives.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CustomerSideDelayInput = z.object({
  orderId: z.string().uuid(),
  reasonId: z.string().uuid(),
  remarks: z.string().max(2000).optional().nullable(),
});

/**
 * Customer-Side Delay:
 *   1. Transition order → CUSTOMER_HOLD (enforced by SQL map).
 *   2. Queue email E003 to the customer.
 *   3. Start Scheduler 2 (24h business-time auto-close → E004).
 */
export const customerSideDelay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => CustomerSideDelayInput.parse(raw))
  .handler(async ({ data, context }) => {
    // 1. Transition (RLS/security-definer enforces map)
    const { data: updated, error: tErr } = await context.supabase.rpc("transition_order_status", {
      _order_id: data.orderId,
      _new_status: "CUSTOMER_HOLD",
      _reason_id: data.reasonId,
      _remarks: data.remarks ?? undefined,
      _force: false,
    });
    if (tErr) throw new Error(tErr.message);

    // 2 + 3 run server-side with admin client
    const [{ enqueueFromTemplateInternal }, { startCustomerClosureScheduler }, { supabaseAdmin }] = await Promise.all([
      import("@/lib/emails/emails.server"),
      import("@/lib/scheduling/schedulers.server"),
      import("@/integrations/supabase/client.server"),
    ]);
    const { BHS_EMAILS } = await import("@/lib/emails/bhs-templates");

    // Reason label for E003
    const { data: reason } = await supabaseAdmin
      .from("delay_reasons")
      .select("label")
      .eq("id", data.reasonId)
      .maybeSingle();

    const app = updated as Record<string, unknown> | null;
    const customerId = (app?.customer_id as string | undefined) ?? null;
    const orderCode = (app?.application_code as string | undefined) ?? data.orderId.slice(0, 8);
    const leadId = (app?.lead_id as string | undefined) ?? null;

    let emailQueued = false;
    if (customerId) {
      const { data: cust } = await supabaseAdmin
        .from("customers")
        .select("primary_email, name")
        .eq("id", customerId)
        .maybeSingle();
      if (cust?.primary_email) {
        try {
          await enqueueFromTemplateInternal(
            BHS_EMAILS.E003_CUSTOMER_DELAY,
            cust.primary_email as string,
            {
              customerName: (cust.name as string) || "Customer",
              orderNumber: orderCode,
              delayReason: (reason?.label as string) || "Awaiting information from your side",
              fromName: process.env.ZOHO_FROM_NAME || "Udyam Support",
            },
            { applicationId: data.orderId, leadId: leadId ?? undefined },
          );
          emailQueued = true;
        } catch (e) {
          console.error("[customerSideDelay] E003 enqueue failed", e);
        }
      }
    }

    const scheduler = await startCustomerClosureScheduler({
      applicationId: data.orderId,
      reasonId: data.reasonId,
      remarks: data.remarks ?? null,
      createdBy: context.userId,
    });

    return {
      ok: true,
      order: updated,
      emailQueued,
      scheduler: { id: scheduler?.id, firesAt: scheduler?.fires_at },
    };
  });
