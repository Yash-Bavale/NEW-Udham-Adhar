class CashfreeRoutingError extends Error {
}
function selectAccountForWebsite(websiteId, mapping) {
  if (!websiteId) throw new CashfreeRoutingError("Payment cannot start: order has no website.");
  if (!mapping || !mapping.account)
    throw new CashfreeRoutingError("Cashfree is not set up for this website.");
  if (!mapping.is_enabled) throw new CashfreeRoutingError("Cashfree is disabled for this website.");
  if (!mapping.account.is_active)
    throw new CashfreeRoutingError("The Cashfree account for this website is inactive.");
  return mapping.account;
}
function credsFromStored(account, stored) {
  const clientId = stored.clientId.trim();
  const clientSecret = stored.clientSecret.trim();
  if (!clientId || !clientSecret) {
    throw new CashfreeRoutingError(`Cashfree account ${account.account_key} has no credentials configured.`);
  }
  const isProd = stored.mode === "production";
  return {
    accountId: account.id,
    clientId,
    clientSecret,
    isProd,
    apiUrl: isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"
  };
}
function credsFromEnv(account, env) {
  const prefix = account.is_legacy ? "CASHFREE_" : `CASHFREE_${account.account_key}_`;
  const clientId = String(env[`${prefix}CLIENT_ID`] ?? "").trim();
  const clientSecret = String(env[`${prefix}CLIENT_SECRET`] ?? "").trim();
  const mode = String(env[`${prefix}MODE`] ?? "").trim().toLowerCase();
  if (!clientId || !clientSecret) {
    throw new CashfreeRoutingError(`Cashfree account ${account.account_key} has no credentials configured.`);
  }
  let isProd;
  if (mode) isProd = mode === "production" || mode === "live" || mode === "prod";
  else if (account.is_legacy)
    isProd = !(clientId.toUpperCase().startsWith("TEST") || clientSecret.toLowerCase().includes("test"));
  else throw new CashfreeRoutingError(`Cashfree account ${account.account_key} has no mode configured.`);
  return {
    accountId: account.id,
    clientId,
    clientSecret,
    isProd,
    apiUrl: isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg"
  };
}
export {
  CashfreeRoutingError,
  credsFromEnv,
  credsFromStored,
  selectAccountForWebsite
};
