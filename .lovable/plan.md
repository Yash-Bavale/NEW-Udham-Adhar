## 1. Onboarding stepper – completed steps look empty on "Done"

**Root cause:** In `src/components/onboarding/OnboardingShell.tsx`, the motion `animate.backgroundColor` is set to `"hsl(var(--primary))"`, but this template uses Tailwind v4 with `oklch` tokens — `--primary` isn't an HSL triplet, so motion paints the circle transparent, hiding the navy fill and the check icon for completed steps.

**Fix:** Remove the inline `backgroundColor` from the motion span and rely on the existing `bg-brand-navy text-white` className for the "done" state. Result on the Done page: Details ✓ — Documents ✓ — 3 Done (active), with the navy progress bar already at 100%.

## 2. Done page copy

In `src/routes/onboarding.$leadCode.done.tsx`, replace:

> "Our expert will review everything and call you on your registered mobile within **one working day**."

with:

> "Our team will contact you on your registered mobile number as soon as possible."

Also grep for any other "one working day" / "1 working day" strings across the project and rewrite them to "as soon as possible". Known hits to check: `src/lib/constants.ts`, `src/lib/email-templates/client-info-request.tsx`, `src/lib/invoices/pdf.server.ts`, `src/lib/onboarding/onboarding.functions.ts`, `src/lib/onboarding/schemas.ts`, `src/routes/apply.$leadCode.summary.tsx`, `src/content/wp/refund-cancellation-policy.html`, `src/components/admin/LeadEmailsTab.tsx`.

## 3. "Need help? Contact our team" link behavior

Currently in `OnboardingShell.tsx` this links to `/contact`. Change behavior:

- Replace the `<Link>` with a `<button>` that:
  1. Calls a new server function `requestFormHelp({ leadCode })` which:
     - inserts an `activity_logs` row for the lead (`activity_type: "form_help_requested"`, description: "Customer requested help completing the form") so the CRM surfaces it on the lead timeline,
     - updates `leads.status` is **not** changed; instead we set a flag-style activity only (keeps existing status engine intact).
  2. On success, navigates to `/onboarding/$leadCode/done` and shows the message: *"Our expert is contacting you to help submit the form."*
- The Done page reads a `?help=1` query param (or the activity) and, when present, shows that alternate help message instead of the standard submitted message. Keeps a single Done route.
- Replace the link text "Need help? Contact our team" with "Need help submitting the form? **Contact our team for help**" (no longer navigates to `/contact`).

## 4. Payment gateway logos

In `src/routes/apply.$leadCode.summary.tsx` (lines ~116–118 + render block ~386), the gateway tiles use solid color chips with text labels ("PayU", "Razorpay", "Cashfree"). Replace with the official wordmark SVGs:

- Add three small inline SVG components (or `<img>` from `src/assets/gateways/`) — `PayULogo`, `RazorpayLogo`, `CashfreeLogo` — using the brands' actual logos (PayU green wordmark, Razorpay navy "Razorpay" wordmark, Cashfree purple wordmark).
- Render inside the same rounded white tile (white background + 1px border) so the brands read correctly, instead of the current colored chip.
- Keep the "LIVE" / "SOON" badge logic and the radio selection unchanged.

## 5. Field input ergonomics (PIN code, state, mobile, PAN, Aadhaar)

In `src/components/onboarding/OnboardingForm.tsx` `FieldRenderer`, derive sensible HTML input attributes from field metadata so the mobile keyboard and validation match the field:

- Add `INDIA_STATES` constant (29 states + 8 UTs) to `src/lib/onboarding/schemas.ts`.
- For any field with `key === "state"`, render a `<select>` populated from `INDIA_STATES` instead of a free-text input (applies to every schema variant — `NEW_UDYAM`, the update / migration schemas, etc. — by changing the renderer, not each schema).
- For `key === "pincode"` or pattern `^\d{6}$`: set `type="tel"`, `inputMode="numeric"`, `maxLength={6}`, strip non-digits on change.
- For `tel` fields with `^[6-9]\d{9}$`: `inputMode="numeric"`, `maxLength={10}`, strip non-digits.
- For Aadhaar (`^\d{12}$`): `inputMode="numeric"`, `maxLength={12}`, strip non-digits.
- For PAN (`^[A-Z]{5}\d{4}[A-Z]$`): force uppercase on change, `maxLength={10}`.
- For `type: "number"`: add `inputMode="decimal"`.

These rules live in `FieldRenderer`, so every onboarding form (all "Link"s/services) gets them automatically.

## 6. Remove "Talk to Expert" entirely

- Delete the route file `src/routes/talk-to-expert.tsx`.
- Delete the API route `src/routes/api/public/talk-to-expert.ts`.
- Remove the `TALK_TO_EXPERT_OPTIONS` constant and any related schema entries in `src/lib/onboarding/schemas.ts`.
- Remove navigation references: search `Header.tsx`, `Nav.tsx`, `Footer.tsx`, `SeoLandingPage.tsx` and any other place linking to `/talk-to-expert` and delete those links/menu items.
- Remove the constant in `src/lib/constants.ts` if it exists.
- `routeTree.gen.ts` will regenerate automatically after the route file is deleted.

## Files touched

- `src/components/onboarding/OnboardingShell.tsx` — fix stepper, replace help link with button.
- `src/components/onboarding/OnboardingForm.tsx` — smart field rendering, state dropdown, numeric input modes.
- `src/routes/onboarding.$leadCode.done.tsx` — new copy + optional help-message branch.
- `src/routes/apply.$leadCode.summary.tsx` — replace gateway chips with real logos.
- `src/lib/onboarding/schemas.ts` — add `INDIA_STATES`, drop talk-to-expert constant.
- `src/lib/onboarding/onboarding.functions.ts` — add `requestFormHelp` server fn.
- Copy sweep across the files listed in section 2 to remove "one working day".
- Delete `src/routes/talk-to-expert.tsx`, `src/routes/api/public/talk-to-expert.ts`.
- Remove Talk-to-Expert nav entries from header/nav/footer/SEO landing components.

## Out of scope

- No DB schema changes (uses existing `activity_logs`).
- No payment gateway logic changes — only the visual logos on the picker.
- District field stays a free-text input (state→district mapping is a much larger change; flag if you want it next turn).
