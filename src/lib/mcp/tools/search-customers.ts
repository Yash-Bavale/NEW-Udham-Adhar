import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "search_customers",
  title: "Search customers",
  description: "Search customers by name, email, or mobile. Returns up to 20 matches.",
  inputSchema: {
    query: z.string().min(1).describe("Text to match against name, primary_email, or primary_mobile."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const q = query.trim();
    const { data, error } = await sb
      .from("customers")
      .select("id, customer_code, name, primary_email, primary_mobile, state, created_at")
      .or(`name.ilike.%${q}%,primary_email.ilike.%${q}%,primary_mobile.ilike.%${q}%`)
      .limit(20);

    if (error) return { content: [{ type: "text", text: `Query failed: ${error.message}` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { rows: data ?? [] },
    };
  },
});
