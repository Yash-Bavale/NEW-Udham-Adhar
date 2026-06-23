## Goal

After a successful payment or any payment status (pending, failed), the user should land on a 1-minute (60s) countdown screen that visually matches the 30s "processing" screen shown after the lead form is submitted (`src/routes/processing.$leadCode.tsx`).

## Current state

- `src/routes/success.$leadCode.tsx` already has:
  - `TOTAL_SECONDS = 60`
  - The same concentric-ring loader, step pips, animated progress bar, and trust footer as `processing.$leadCode.tsx` (only color accent differs: emerald vs amber, which is intentional for the "payment successful" context).
- **Problem:** the redesigned countdown only renders **after** `confirmed === true`. Until the polling loop confirms the webhook landed (can be 2–10+ seconds, up to 30s), the user sees a small plain spinner with "Confirming payment…". That gap is the part that doesn't match the post-lead experience, which jumps straight into the rich countdown.

## Change

Render the redesigned 60s countdown UI **immediately** on mount, while the confirmation poll runs in the background. The auto-redirect to `/onboarding/$leadCode` waits for **both** conditions: countdown finished **and** payment confirmed.

### Behavior rules

1. On mount: start the 60s countdown immediately and start polling `getApplicationSummary` in parallel 
2. Step labels stay as today; the first step subtitle changes from "Confirming transaction with bank" to a wording that works both before and after confirmation (e.g. keep "Confirming transaction with bank" — it already reads correctly during the wait).
3. When countdown hits 0:
  - If `confirmed === true` → redirect to `/onboarding/$leadCode` (current behavior).
  - If still not confirmed → hold on the final step ("Almost ready") with a subtle "Finalising confirmation…" sub-label and keep polling; redirect as soon as confirmed.
4. If the 15-attempt poll exhausts without confirmation → redirect to `/payment-pending/$leadCode` (current behavior, unchanged).
5. Error state (server fn throws) → same red error card as today.

### Files

- `src/routes/success.$leadCode.tsx` — restructure the render so the countdown card is the default view; remove the standalone "Confirming payment…" spinner block; gate the final navigation on `confirmed && elapsed >= TOTAL_SECONDS`.

No other files change. No new components, no design-token changes, no schema or server-fn changes.

## Verification

- Typecheck clean (`tsc --noEmit` via build).
- Manual: hit `/success/<leadCode>` for a paid lead → rich 60s countdown shows from t=0, redirects to onboarding at t=60. For a not-yet-confirmed lead → countdown shows from t=0, last step holds until webhook lands or until pending-redirect fires.