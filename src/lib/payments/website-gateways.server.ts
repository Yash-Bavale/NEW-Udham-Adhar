import { gatewayAllowedOnWebsite, type WebsiteGatewayRule } from "./website-gateways";

/** Website-specific gateway rules (empty = follow global switches). */
export async function websiteGatewayRules(websiteId: string | null | undefined): Promise<WebsiteGatewayRule[]> {
  if (!websiteId) return [];
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin as any).from("website_payment_gateways")
    .select("gateway_name, is_enabled, is_default").eq("website_id", websiteId);
  if (error) throw new Error("Could not load payment options for this website.");
  return data ?? [];
}

/** Throws when the lead's website has switched this gateway off. */
export async function assertGatewayAllowedForWebsite(websiteId: string | null | undefined, gateway: string, label: string) {
  const rules = await websiteGatewayRules(websiteId);
  if (!gatewayAllowedOnWebsite(gateway, rules)) throw new Error(`${label} is not available on this website. Please choose another payment option.`);
}
