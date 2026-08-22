import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ leadCode: z.string().min(3).max(80) });

/**
 * Build a Cashfree order for a lead. Thin wrapper over buildCashfreeOrder
 * so other server code can reuse the logic without calling this RPC stub.
 */
export const createCashfreeOrderFn = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const { buildCashfreeOrder } = await import("@/lib/payments/cashfree-order.server");
    return buildCashfreeOrder(data.leadCode);
  });
