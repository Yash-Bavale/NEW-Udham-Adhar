import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "dashboard_metrics",
  title: "Dashboard metrics",
  description:
    "Return live business metrics: total leads, today/week counts, order status distribution, and 30-day trend. Requires a staff role.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await sb.rpc("get_dashboard_metrics");
    if (error) return { content: [{ type: "text", text: `Query failed: ${error.message}` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: (data ?? {}) as Record<string, unknown>,
    };
  },
});
