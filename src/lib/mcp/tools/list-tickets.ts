import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_tickets",
  title: "List support tickets",
  description: "List recent support tickets, optionally filtered by status or a customer email.",
  inputSchema: {
    status: z.string().optional().describe("Optional status, e.g. open, pending, resolved, closed."),
    customerEmail: z.string().email().optional().describe("Optional customer email to filter by."),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, customerEmail, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let q = sb
      .from("support_tickets")
      .select("id, ticket_number, subject, status, priority, customer_email, application_id, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (status) q = q.eq("status", status);
    if (customerEmail) q = q.ilike("customer_email", customerEmail.toLowerCase());

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: `Query failed: ${error.message}` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { rows: data ?? [] },
    };
  },
});
