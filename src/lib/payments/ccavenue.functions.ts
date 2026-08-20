import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ leadCode: z.string().min(3).max(80) });

/**
 * Build a CCAvenue order for a lead. Thin wrapper over
 * buildCcavenueOrderForLead so other server code can reuse the logic without
 * calling this RPC stub.
 */
export const createCcavenueOrder = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const { buildCcavenueOrderForLead } = await import("@/lib/payments/ccavenue-order.server");
    return buildCcavenueOrderForLead(data.leadCode);
  });
