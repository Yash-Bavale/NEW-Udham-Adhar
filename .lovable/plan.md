## Goal

After a successful payment, the customer lands on `/success/$leadCode` and is given a **15-second countdown** with a strong "attention needed" message before being **automatically redirected** to the onboarding form (`/onboarding/$leadCode`).

## Scope

Single file: `src/routes/success.$leadCode.tsx`. No backend, schema, or routing changes. The existing "Attention Needed → Fill Incomplete Info" amber card is where the countdown lives.

## Behavior

1. Once payment is confirmed (existing polling already does this), the success page shows the amber card.
2. A **15 → 0** countdown starts immediately, displayed prominently inside the card.
3. The card copy emphasizes: *"Attention — you have incomplete information. We'll redirect you to the form in N seconds."*
4. A circular progress ring (or animated bar) wraps the number for visual urgency.
5. A secondary "Pause / Stay on this page" link cancels the auto-redirect (so users who want to view the receipt aren't yanked away). This is important: opening the receipt accordion or clicking print should also cancel the timer.
6. When the countdown hits 0 (and not cancelled), call `navigate({ to: "/onboarding/$leadCode", params: { leadCode }, replace: true })`.
7. On unmount, clear the interval. `replace: true` keeps the back button sane.
8. Fire a `trackEvent("post_payment_auto_redirect", { leadCode, cancelled })` on either auto-redirect or cancel for analytics.

## Edge cases

- Don't start the countdown until `isLoading === false` and `data` is present — otherwise the user could be bounced before the page even paints.
- Don't start it on the `error` branch or the pending fallback.
- If user clicks the manual "Go Now" button, cancel timer first to prevent double navigation.
- Print receipt flow: clicking "Print Receipt" or "Download Tax Invoice" auto-cancels the timer.

## Visual treatment

- Number rendered in a 64px display font inside a circular ring that animates from full to empty over 15s (CSS `stroke-dasharray` + `transition`).
- Amber/red accent matching the existing `border-amber-300` card.
- Subtext: *"Redirecting in **N** seconds…"* with a small "Stay on this page" ghost button beneath.

## After this ships

Resume **Phases C → L** (the paused roadmap from message #350) starting with **Phase C — NIC 2008 dataset**. I'll ping you for the CSV/JSON when we get there.

## Files touched

- `src/routes/success.$leadCode.tsx` — add `useState`/`useEffect` countdown, ring SVG, cancel handlers; relabel button.