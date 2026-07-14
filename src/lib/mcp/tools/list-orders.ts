import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_orders",
  title: "List orders",
  description:
    "List recent orders (applications) the signed-in user can see. Supports optional status filter and search by application code, customer name, email, or mobile.",
  inputSchema: {
    status: z.string().optional().describe("Optional order_status enum, e.g. NEW_ORDER, IN_PROCESSING, CLOSED."),
    search: z.string().optional().describe("Optional text to match application code, customer name, email, or mobile."),
    limit: z.number().int().min(1).max(50).default(20).describe("Max rows to return (1–50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let q = sb
      .from("applications")
      .select(
        "id, application_code, order_status, application_status, fulfillment_status, service, created_at, updated_at, customer_id, lead_id",
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) q = q.eq("order_status", status);
    if (search && search.trim()) {
      const s = search.trim();
      q = q.or(`application_code.ilike.%${s}%`);
    }

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: `Query failed: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { rows: data ?? [] },
    };
  },
});
