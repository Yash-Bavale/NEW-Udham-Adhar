// Server-only DB lookups for Cashfree merchant accounts.
import {
  credsFromEnv,
  selectAccountForWebsite,
  CashfreeRoutingError,
  type CashfreeAccountRow,
  type CashfreeCreds,
} from "./cashfree-accounts";

const ACCOUNT_COLS = "id, account_key, is_legacy, is_active";

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin as any;
}

/** Creds for a NEW payment, chosen strictly by the lead's trusted website_id. */
export async function credsForWebsite(websiteId: string | null | undefined): Promise<CashfreeCreds> {
  let mapping = null;
  if (websiteId) {
    const { data } = await (await admin())
      .from("cashfree_website_accounts")
      .select(`is_enabled, account:account_id (${ACCOUNT_COLS})`)
      .eq("website_id", websiteId)
      .maybeSingle();
    mapping = data;
  }
  return credsFromEnv(selectAccountForWebsite(websiteId, mapping), process.env);
}

/** Creds for an EXISTING payment: always the account recorded on it; NULL = historical legacy. */
export async function credsForPayment(paymentAccountId: string | null | undefined): Promise<CashfreeCreds> {
  const q = (await admin()).from("cashfree_merchant_accounts").select(ACCOUNT_COLS);
  const { data } = paymentAccountId
    ? await q.eq("id", paymentAccountId).maybeSingle()
    : await q.eq("is_legacy", true).maybeSingle();
  if (!data) throw new CashfreeRoutingError("Cashfree account for this payment was not found.");
  // Existing payments keep verifying even if the account is later deactivated for new payments.
  return credsFromEnv(data as CashfreeAccountRow, process.env);
}
