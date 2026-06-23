## Goal
Re-enable the rich summary + multi-gateway payment page that was bypassed earlier, and restore the full flow: Lead form → Summary/Payment → PayU → 1‑minute success countdown → Onboarding form.

## Current state (verified)

The pages are all already implemented and working — only the routing-after-submit is wrong:

| Route | Status | What it does |
|---|---|---|
| `LeadForm.tsx` | bypassed | After submit, navigates to `/payment/$leadCode` (the stripped-down PayU-only page) |
| `/apply/$leadCode/summary` | exists, unused | Full premium summary: service info, editable contact, GST invoice preview, gateway picker (PayU/Razorpay/Cashfree/PhonePe/CCAvenue with logos and "Live/Soon" badges), Pay Now button that auto-posts to the selected gateway |
| `/payment/$leadCode` | exists | Stripped-down PayU-only page — keep as a fallback only |
| `/success/$leadCode` | exists | 60-second countdown with steps + ambient design, auto-redirects to `/onboarding/$leadCode` |
| `/onboarding/$leadCode` | exists | Service-specific after-payment form |
| `/processing/$leadCode` | exists, unused | The old 30s pre-payment delay loop — already removed from the flow |

## What changes

Single edit: `src/components/site/LeadForm.tsx`

In `onSubmit`, change the navigate target from `/payment/$leadCode` to `/apply/$leadCode/summary`:

```tsx
navigate({
  to: "/apply/$leadCode/summary",
  params: { leadCode: lead.leadCode },
});
```

That's it. Everything downstream (`/apply/.../summary` → gateway POST → PayU webhook → `/success/...` → 60s countdown → `/onboarding/...`) is already wired and live in code.

## Why this is enough

- The summary page already calls `getApplicationSummary` which returns the lead + all enabled gateways from the `payment_gateways` table.
- The summary page already calls `initiatePayment({ leadCode, gatewayCode })` and auto-posts the returned form to the gateway action URL — supports PayU and CCAvenue today (others show "Soon").
- The PayU webhook handler (audited last turn) already flips lead status, creates the application, queues emails, and the user lands on `/success/$leadCode`.
- The success page already does the 1-minute countdown with the same premium design language as the processing page, then redirects to `/onboarding/$leadCode`.

## Non-goals (explicitly out of scope)
- No new gateways enabled (Razorpay/Cashfree/PhonePe remain "Soon" pills).
- No design changes to summary / success / onboarding pages.
- No DB or webhook changes.
- The old `/processing/$leadCode` route stays in code as dead route (safe to delete later if you want; not removing now to avoid breaking any in-flight links).

## Verification
After the change:
1. Submit lead form on `/` → lands on `/apply/<code>/summary` showing service info, editable details, GST split, gateway list with PayU selected.
2. Click "Pay Now" → auto-redirects to PayU test/live page.
3. Complete payment → PayU returns → lands on `/success/<code>` with 60s countdown.
4. Countdown completes → auto-redirects to `/onboarding/<code>` form.
