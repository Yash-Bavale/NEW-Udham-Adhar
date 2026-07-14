import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "add_order_note",
  title: "Add internal note to order",
  description: "Append an internal note event to an order (application) timeline. Written as the signed-in user.",
  inputSchema: {
    orderId: z.string().uuid().describe("Application UUID."),
    note: z.string().min(1).max(4000).describe("Note text to record on the order timeline."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ orderId, note }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: app, error: appErr } = await sb
      .from("applications")
      .select("id, lead_id, customer_id")
      .eq("id", orderId)
      .maybeSingle();
    if (appErr || !app) {
      return { content: [{ type: "text", text: "Order not found or not visible to you." }], isError: true };
    }

    const { data, error } = await sb
      .from("application_events")
      .insert({
        application_id: app.id,
        lead_id: app.lead_id,
        customer_id: app.customer_id,
        event_type: "note",
        note,
        created_by: ctx.getUserId(),
        staff_name: ctx.getUserEmail() ?? "MCP",
        staff_role: "mcp",
      })
      .select()
      .single();

    if (error) return { content: [{ type: "text", text: `Insert failed: ${error.message}` }], isError: true };
    return {
      content: [{ type: "text", text: `Note added to order ${orderId}.` }],
      structuredContent: { event: data },
    };
  },
});
