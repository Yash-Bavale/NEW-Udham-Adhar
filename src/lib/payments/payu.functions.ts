import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ leadCode: z.string().min(3).max(80) });

/**
 * Build a PayU order for a lead. Thin wrapper over buildPayUOrder so other
 * server code can reuse the logic without calling this RPC stub.
 */
export const createPayUOrder = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const { buildPayUOrder } = await import("@/lib/payments/payu-order.server");
    return buildPayUOrder(data.leadCode);
  });
