// Outgoing email transport selector (server-only).
// Keeps templates, queue, retries, threading and logging untouched — it only
// decides WHICH service physically delivers the message.

import { isZohoAuthOrRateLimitError, sendViaZoho, type ZohoSendInput, type ZohoSendResult } from "./zoho-smtp.server";
import { sendViaZepto, zeptoConfigured, zeptoFromEmail } from "./zeptomail.server";

export type MailProvider = "zoho" | "zeptomail";

/**
 * Active provider:
 *  - EMAIL_PROVIDER=zeptomail  -> ZeptoMail (requires ZEPTOMAIL_TOKEN)
 *  - EMAIL_PROVIDER=zoho       -> Zoho
 *  - unset                     -> ZeptoMail when configured, otherwise Zoho
 */
export function activeMailProvider(): MailProvider {
  const pref = (process.env.EMAIL_PROVIDER || "").trim().toLowerCase();
  if (pref === "zoho") return "zoho";
  if (pref === "zeptomail" || pref === "zepto") return zeptoConfigured() ? "zeptomail" : "zoho";
  return zeptoConfigured() ? "zeptomail" : "zoho";
}

export async function sendViaActiveProvider(input: ZohoSendInput): Promise<ZohoSendResult> {
  return activeMailProvider() === "zeptomail" ? sendViaZepto(input) : sendViaZoho(input);
}

export function activeSenderEmail(): string {
  return activeMailProvider() === "zeptomail"
    ? zeptoFromEmail()
    : (process.env.ZOHO_FROM_EMAIL || process.env.ZOHO_SMTP_USER || "help@businesshelpservices.com").trim().toLowerCase();
}

/**
 * Provider-side throttling / blocking that must pause the whole batch instead of
 * burning retry attempts on individual emails.
 */
export function isProviderThrottleError(error: string | null | undefined): boolean {
  const value = (error || "").toLowerCase();
  return (
    isZohoAuthOrRateLimitError(value) ||
    value.includes("unusual sending activity") ||
    value.includes("try after sometime") ||
    value.includes("5.4.6") ||
    value.includes("sending limit") ||
    value.includes("quota") ||
    value.includes("429") ||
    value.includes("temporarily blocked") ||
    value.includes("sm_133") // ZeptoMail: sending blocked / credits exhausted
  );
}
