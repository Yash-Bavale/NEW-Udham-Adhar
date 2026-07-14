import { auth, defineMcp } from "@lovable.dev/mcp-js";
import addOrderNote from "./tools/add-order-note";
import dashboardMetrics from "./tools/dashboard-metrics";
import getOrder from "./tools/get-order";
import listOrders from "./tools/list-orders";
import listTickets from "./tools/list-tickets";
import searchCustomers from "./tools/search-customers";
import whoami from "./tools/whoami";

// Build the OAuth issuer from the Supabase project ref. Do NOT use SUPABASE_URL —
// it becomes a `.lovable.cloud` proxy on publish, which mcp-js rejects (RFC 8414
// issuer mismatch). VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "udyam-ops-mcp",
  title: "Udyam Ops OS",
  version: "0.1.0",
  instructions:
    "Tools for the Udyam Ops CRM. Use `list_orders` / `get_order` to inspect orders, `search_customers` and `list_tickets` for customer support context, `dashboard_metrics` for live business KPIs, and `add_order_note` to record an internal note on an order. All actions run as the signed-in staff user; RLS applies.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoami, listOrders, getOrder, searchCustomers, listTickets, dashboardMetrics, addOrderNote],
});
