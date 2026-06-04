import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createPayUOrder } from "@/lib/payments/payu.functions";

/**
 * Gateway-agnostic payment initiator. Picks the right gateway impl by code
 * and returns a uniform hosted-form payload for the browser to POST.
 *
 * Today only PayU is wired. Razorpay/Cashfree slots are reserved.
 */
const Input = z.object({
  leadCode: z.string().trim().min(3).max(80),
  gatewayCode: z.string().trim().min(2).max(40).optional(),
});

export type InitiatePaymentResult = Awaited<ReturnType<typeof createPayUOrder>> & {
  gateway: string;
};

export const initiatePayment = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }): Promise<InitiatePaymentResult> => {
    // Resolve gateway: explicit override → first enabled by priority.
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
        return { ...order, gateway: "payu" };
      }
      case "razorpay":
      case "cashfree":
        throw new Error(`${chosen} is not enabled yet. Please use PayU.`);
      default:
        throw new Error(`Unknown payment gateway: ${chosen}`);
    }
  });
