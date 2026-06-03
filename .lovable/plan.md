# Forced post-payment auto-redirect flow

Rework `src/routes/success.$leadCode.tsx` so the customer never has to click anything — they see an animated 15-second journey and are then dropped straight into the onboarding form.

## New experience (single screen, 15s total)

```text
 0s ──────── 5s ──────── 10s ──────── 15s
 │           │            │             │
 │ Phase 1   │ Phase 2    │ Phase 3     │ → /onboarding/$leadCode
 │ Confirming│ Confirmed  │ Action      │   (replace: true, automatic)
 │ payment   │ ✓          │ needed —    │
 │ (spinner) │ (checkmark │  fill info  │
 │           │  pop)      │ (pulse)     │
```

- **Phase 1 — Confirming (0–5s)**: animated spinner ring, copy "Confirming your payment…", subtle shimmer on the amount.
- **Phase 2 — Confirmed (5–10s)**: ring snaps to a green checkmark with a scale-in/zoom-in pop, copy switches to "Payment confirmed ✓", brief confetti-style accent (CSS only, no new deps).
- **Phase 3 — Action needed (10–15s)**: card flips to amber/red, big pulsing "ACTION NEEDED — Fill incomplete information", a thick countdown ring runs the full 15s underneath so the user always sees total time remaining, and the final 5s show "Opening form in N…".
- **At 15s**: `navigate({ to: "/onboarding/$leadCode", params: { leadCode }, replace: true })` automatically. No "Go Now" button, no "Stay on page" escape, no receipt accordion on this screen.

## What gets removed

- The current "Fill Incomplete Info" CTA button.
- The "Stay on this page" cancel link and `cancelAutoRedirect` logic.
- The receipt disclosure / accordion and the entire detailed receipt card (printing, tax invoice download, etc.) — kept off this screen so it cannot block the redirect. The tax invoice + receipt remain accessible from the onboarding screen and email; no functionality is lost, just not surfaced here.
- The 3-step "Onboarding / Verification / Delivery" strip (distracting on a 15s screen).

## What stays

- The existing payment-confirmation polling (`getApplicationSummary`, 15 attempts × 2s). The 15s countdown only starts once `isLoading === false && data && !error`. If polling fails → existing error screen. If polling times out → existing redirect to `/payment-pending/$leadCode`.
- `trackEvent("payment_success_page_view", …)` on mount and `trackEvent("post_payment_auto_redirect", { leadCode, cancelled: false })` right before navigating.

## Visual / animation details

- Single centered hero card, max-w ~lg, generous vertical padding so it feels like a moment, not a page.
- Phase transitions use existing Tailwind utilities only: `animate-in fade-in zoom-in`, `animate-pulse`, `transition-colors duration-500`, plus the SVG ring with `stroke-dashoffset` transition (already in the file).
- Color shift across phases: slate → emerald → amber/red, driven by phase state, so the card itself communicates urgency.
- Big tabular-nums seconds counter shown throughout phase 3.
- Reduced-motion: respect `prefers-reduced-motion` by skipping the pulse/zoom and just swapping text + colors.

## Technical changes (one file)

`src/routes/success.$leadCode.tsx`:

1. Add `phase: "confirming" | "confirmed" | "action"` derived from `secondsLeft` (>10 confirming, >5 confirmed, else action). Keep the existing `REDIRECT_SECONDS = 15`, `secondsLeft`, and the countdown `useEffect`; drop `autoRedirect` state and `cancelAutoRedirect`.
2. Replace the JSX returned in the success branch with the new single-card layout described above. Remove `showReceipt`, the receipt `<Card>`, the 3-step grid, the manual `<Link>` CTA, the "Stay on this page" button, and the `getCustomerInvoiceUrl` import (no longer used here).
3. Keep all loading / error / pending-redirect branches unchanged.
4. Keep the cleanup that clears the timer on unmount.

No backend, schema, routing, or other-file changes. Plan doc `.lovable/plan.md` will be refreshed to match the new behavior.

## After approval

Once this ships, resume **Phase D — status workflow engine** as previously queued.
