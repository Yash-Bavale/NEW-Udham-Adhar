## Revert Lead Form + remove reCAPTCHA

### Changes

1. **`src/components/site/LeadForm.tsx`** — restore the previous simple version (Name, Mobile, Email, Service dropdown). Drop the 15 expanded fields added recently. Keep the active-services filter already wired in.

2. **Remove reCAPTCHA from the lead form flow:**
   - Remove the `grecaptcha` script load, widget render, and token state from `LeadForm.tsx`.
   - Remove the `verifyCaptcha` call from the lead submit path in `src/lib/leads.functions.ts` (if wired there) so submission no longer requires a token.
   - Leave `src/lib/captcha.functions.ts` and the `RECAPTCHA_*` secrets in place (unused, no cost) unless you want them deleted too — say the word.

3. No DB changes. The extra lead columns from the expanded form (if any were added) stay in the schema untouched; they just won't be populated by the public form anymore.

### Files touched
- `src/components/site/LeadForm.tsx` (rewrite to simple version)
- `src/lib/leads.functions.ts` (drop captcha verification + any newly-added optional field handling from the public submit fn)
- `src/routes/__root.tsx` only if a reCAPTCHA script tag was added there (verify during build)

### Not touched
- Admin, orders, onboarding, journey map — unrelated.
- `captcha.functions.ts` and secrets — kept for potential future reuse.

Confirm and I'll implement.
