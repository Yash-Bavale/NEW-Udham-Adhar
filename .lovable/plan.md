# Change support email `.in` → `.com` everywhere

Update `help@businesshelpservices.in` to `help@businesshelpservices.com` in the 6 places it appears, then re-verify the Zoho inbox diagnosis with the correct address.

## Files to edit

1. **`src/lib/brand.ts`** — `SUPPORT_EMAIL` constant (single source of truth; drives most templates, footers, and reply-to headers automatically).
2. **`src/routes/api/public/contact.ts`** — hardcoded `to:` on the contact-form notification.
3. **`src/routes/api/public/complaint.ts`** — hardcoded `to:` on the complaint-form notification.
4. **`src/routes/api/public/talk-to-expert.ts`** — hardcoded `to:` on the expert-callback notification.
5. **`src/lib/crm/cancellation.functions.ts`** — hardcoded support address in the cancellation email body.
6. **`supabase/migrations/20260531125701_...sql`** — historical migration; leave as-is (already applied; editing it does nothing and risks a hash mismatch). Note it in the plan but don't touch.

Content HTML files (`src/content/wp/contact.html`, `contact-us.html`) already use `.com` — no change needed.

## Zoho re-check after the change

The Zoho mailbox login is `help@businesshelpservices.in` (that's the actual Zoho account — the `.in` domain hosts the mailbox on Zoho Mail India DC). Changing the customer-facing display address to `.com` does **not** change:

- `ZOHO_MAIL_REFRESH_TOKEN` / `ZOHO_MAIL_ACCOUNT_ID` — tied to the Zoho user, not to the address customers see
- `ZOHO_MAIL_DC=in` — correct for a `.in` Zoho account
- SMTP creds

So the Zoho inbox 401 diagnosis is independent of this rename. After the rename, I'll still add the diagnostic endpoint (from the previous plan) so we get Zoho's actual error body and fix the real cause of the 401 — not guess.

## Verification

- `rg 'businesshelpservices\.in' src/` returns nothing after edits.
- Templates that import `SUPPORT_EMAIL` from `@/lib/brand` update automatically — no per-template edits needed.
- Preview the contact / complaint / talk-to-expert forms and confirm the internal notification `to:` shows `.com`.
