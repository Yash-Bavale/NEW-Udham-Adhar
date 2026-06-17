import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPayUOrder } from "@/lib/payments/payu.functions";
import { createCcavenueOrder } from "@/lib/payments/ccavenue.functions";

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
        const order = await createPayUOrder({ data: { leadCode: data.leadCode } });
        return {
          actionUrl: order.actionUrl,
          fields: order.fields,
          paymentId: order.paymentId,
          leadCode: order.leadCode,
          totalAmount: order.totalAmount,
          gateway: "payu",
        };
      }
      case "ccavenue": {
        const order = await createCcavenueOrder({ data: { leadCode: data.leadCode } });
        return {
          actionUrl: order.actionUrl,
          fields: order.fields,
          paymentId: order.paymentId,
          leadCode: order.leadCode,
          totalAmount: order.totalAmount,
          gateway: "ccavenue",
        };
      }
      case "razorpay":
      case "cashfree":
        throw new Error(`${chosen} is not enabled yet. Please choose another option.`);
      default:
        throw new Error(`Unknown payment gateway: ${chosen}`);
    }
  });
