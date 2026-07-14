import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_order",
  title: "Get order",
  description: "Get full details of an order (application) by id or application_code, including recent events and payments.",
  inputSchema: {
    id: z.string().optional().describe("Application UUID."),
    code: z.string().optional().describe("Application code, e.g. AP-2026-000123."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, code }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!id && !code) {
      return { content: [{ type: "text", text: "Provide either id or code." }], isError: true };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const base = sb.from("applications").select("*");
    const { data: order, error } = id
      ? await base.eq("id", id).maybeSingle()
      : await base.eq("application_code", code!).maybeSingle();
    if (error) return { content: [{ type: "text", text: `Query failed: ${error.message}` }], isError: true };
    if (!order) return { content: [{ type: "text", text: "Not found" }], isError: true };

    const [{ data: events }, { data: payments }] = await Promise.all([
      sb.from("application_events").select("*").eq("application_id", order.id).order("created_at", { ascending: false }).limit(20),
      sb.from("payments").select("*").eq("application_id", order.id).order("created_at", { ascending: false }).limit(10),
    ]);

    const result = { order, events: events ?? [], payments: payments ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
