import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Gateway-agnostic payment initiator. Picks the right gateway impl by code
 * and returns a uniform hosted-form payload for the browser to POST.
 *
 * Wired: PayU, CCAvenue. Razorpay/Cashfree slots are reserved.
 */
const Input = z.object({
  leadCode: z.string().trim().min(3).max(80),
  gatewayCode: z.string().trim().min(2).max(40).optional(),
});

export type InitiatePaymentResult = {
  actionUrl: string;
  fields: Record<string, string>;
  paymentId: string;
  leadCode: string;
  totalAmount: number;
  gateway: string;
};

export const initiatePayment = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }): Promise<InitiatePaymentResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let chosen = data.gatewayCode?.toLowerCase();
    if (!chosen) {
      const { data: gw } = await supabaseAdmin
        .from("payment_gateways")
        .select("name")
        .eq("is_enabled", true)
        .order("priority", { ascending: true })
        .limit(1)
        .maybeSingle();
      chosen = gw?.name ?? "payu";
    }

    switch (chosen) {
      case "payu": {
        const { buildPayUOrder } = await import("@/lib/payments/payu-order.server");
        const order = await buildPayUOrder(data.leadCode);
        return { ...order, gateway: "payu" };
      }
      case "ccavenue": {
        const { buildCcavenueOrderForLead } = await import(
          "@/lib/payments/ccavenue-order.server"
        );
        const order = await buildCcavenueOrderForLead(data.leadCode);
        return { ...order, gateway: "ccavenue" };
      }
      case "razorpay":
      case "cashfree":
        throw new Error(`${chosen} is not enabled yet. Please choose another option.`);
      default:
        throw new Error(`Unknown payment gateway: ${chosen}`);
    }
  });
