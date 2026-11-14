const WEBSITE_GATEWAYS = ["cashfree", "payu", "ccavenue"];
function normalizeGatewayName(name) {
  const n = String(name ?? "").trim().toLowerCase();
  if (n.includes("cashfree")) return "cashfree";
  if (n.includes("payu")) return "payu";
  if (n.includes("ccavenue")) return "ccavenue";
  return n;
}
function gatewayAllowedOnWebsite(name, rules) {
  const rule = rules.find((r) => r.gateway_name === normalizeGatewayName(name));
  return rule ? rule.is_enabled : true;
}
function applyWebsiteGateways(list, rules) {
  const allowed = list.filter((g) => gatewayAllowedOnWebsite(g.name, rules));
  const siteDefault = rules.find((r) => r.is_default && r.is_enabled)?.gateway_name;
  const pick = siteDefault && allowed.find((g) => normalizeGatewayName(g.name) === siteDefault) || allowed.find((g) => g.isDefault) || allowed[0];
  return allowed.map((g) => ({ ...g, isDefault: g === pick }));
}
export {
  WEBSITE_GATEWAYS,
  applyWebsiteGateways,
  gatewayAllowedOnWebsite,
  normalizeGatewayName
};
