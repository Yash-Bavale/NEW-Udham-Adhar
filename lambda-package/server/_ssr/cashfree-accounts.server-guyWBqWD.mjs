import { CashfreeRoutingError, selectAccountForWebsite, credsFromStored, credsFromEnv } from "./cashfree-accounts-DA0CVHDC.mjs";
const ACCOUNT_COLS = "id, account_key, is_legacy, is_active";
async function admin() {
  return (await import("./client.server-3kDCe7R3.mjs")).supabaseAdmin;
}
function credentialAad(accountId) {
  return `cashfree-account:${accountId}`;
}
async function encryptPaymentSecret(plain, accountId) {
  const { encryptSecret } = await import("./telephony-crypto.server-DKg2AF09.mjs");
  return encryptSecret(plain, credentialAad(accountId), process.env["PAYMENT_CREDENTIAL_KEY"]);
}
async function resolveCreds(account) {
  if (!account.is_legacy) {
    const { data: row } = await (await admin()).from("cashfree_account_credentials").select("client_id, client_secret_ciphertext, mode").eq("account_id", account.id).maybeSingle();
    if (row) {
      const { decryptSecret } = await import("./telephony-crypto.server-DKg2AF09.mjs");
      let secret;
      try {
        secret = await decryptSecret(row.client_secret_ciphertext, credentialAad(account.id), process.env["PAYMENT_CREDENTIAL_KEY"]);
      } catch {
        throw new CashfreeRoutingError(`Cashfree account ${account.account_key} credentials could not be read.`);
      }
      return credsFromStored(account, { clientId: row.client_id, clientSecret: secret, mode: row.mode });
    }
  }
  return credsFromEnv(account, process.env);
}
async function credsForWebsite(websiteId) {
  let mapping = null;
  if (websiteId) {
    const { data } = await (await admin()).from("cashfree_website_accounts").select(`is_enabled, account:account_id (${ACCOUNT_COLS})`).eq("website_id", websiteId).maybeSingle();
    mapping = data;
  }
  return resolveCreds(selectAccountForWebsite(websiteId, mapping));
}
async function credsForPayment(paymentAccountId) {
  const q = (await admin()).from("cashfree_merchant_accounts").select(ACCOUNT_COLS);
  const { data } = paymentAccountId ? await q.eq("id", paymentAccountId).maybeSingle() : await q.eq("is_legacy", true).maybeSingle();
  if (!data) throw new CashfreeRoutingError("Cashfree account for this payment was not found.");
  return resolveCreds(data);
}
async function testCashfreeCreds(c) {
  const base = c.isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
  try {
    const res = await fetch(`${base}/orders/bhs-credential-check-${Date.now()}`, {
      headers: { "x-client-id": c.clientId, "x-client-secret": c.clientSecret, "x-api-version": "2023-08-01", accept: "application/json" }
    });
    if (res.status === 401 || res.status === 403) return { ok: false, message: "Cashfree rejected these keys. Check the App ID, Secret Key and Live/Test mode." };
    if (res.status === 404 || res.ok) return { ok: true, message: "Cashfree accepted these keys." };
    return { ok: false, message: `Cashfree could not be reached (status ${res.status}). Try again.` };
  } catch {
    return { ok: false, message: "Cashfree could not be reached. Try again." };
  }
}
export {
  credentialAad,
  credsForPayment,
  credsForWebsite,
  encryptPaymentSecret,
  testCashfreeCreds
};
