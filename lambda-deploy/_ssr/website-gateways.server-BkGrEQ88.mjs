import { gatewayAllowedOnWebsite } from "./website-gateways-jUN09uZm.mjs";
async function websiteGatewayRules(websiteId) {
  let rules = [];
  if (websiteId) {
    const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
    const { data, error } = await supabaseAdmin.from("website_payment_gateways").select("gateway_name, is_enabled, is_default").eq("website_id", websiteId);
    if (error) throw new Error("Could not load payment options for this website.");
    rules = data ?? [];
  }
  if (!gatewayAllowedOnWebsite("cashfree", rules)) return rules;
  const { credsForWebsite } = await import("./cashfree-accounts.server-guyWBqWD.mjs");
  const { CashfreeRoutingError } = await import("./cashfree-accounts-DA0CVHDC.mjs");
  try {
    await credsForWebsite(websiteId);
    return rules;
  } catch (error) {
    if (!(error instanceof CashfreeRoutingError)) throw error;
    return [
      ...rules.filter((r) => r.gateway_name !== "cashfree"),
      { gateway_name: "cashfree", is_enabled: false, is_default: false }
    ];
  }
}
async function assertGatewayAllowedForWebsite(websiteId, gateway, label) {
  const rules = await websiteGatewayRules(websiteId);
  if (!gatewayAllowedOnWebsite(gateway, rules)) throw new Error(`${label} is not available on this website. Please choose another payment option.`);
}
export {
  assertGatewayAllowedForWebsite,
  websiteGatewayRules
};
