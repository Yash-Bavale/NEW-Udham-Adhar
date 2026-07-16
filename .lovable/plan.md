## Goal
Make the buttons that light up on the Customer Journey Map match the mapping in your chart exactly.

## Reference (from your image)
```text
Form Not submitted  → B01
Form submitted      → B02, B04, B05, B08, B10
B01 sent            → No active buttons until customer submits form
B02 sent            → B03
B03 sent            → B04, B05, B08, B09, B10
B04 sent            → B08, B09
B05 sent            → B06, B07, B08, B09, B10
B06 sent            → B07, B08, B09, B10
B07 sent            → B08, B09
B08 sent            → No active buttons (order completed)
B09 sent            → No active buttons (order closed)
B10 sent            → back to Form Submitted set: B02, B04, B05, B08, B10
```

## Gaps in current code (`src/lib/orders/journey-map.ts`)
1. `customer_delay` (post-B10) currently exposes **B09** — chart says it should return to the Form Submitted set with **B10**, not B09.
2. `form_not_submitted` currently keeps **B01** enabled even after B01 was already sent — chart says once B01 is sent, no button is active until the form is actually submitted.
3. `technical_delay` (post-B02) shows only **B03** ✓, and B03 → `form_submitted` set naturally resumes ✓ but B03's resume set (`B04, B05, B08, B09, B10`) differs from the plain `form_submitted` set (`B02, B04, B05, B08, B10`). Need a distinct `post_b03_resume` phase.
4. Everything else already matches (B04→B08,B09; B05→B06,B07,B08,B09,B10; B06→B07,B08,B09,B10; B07→B08,B09; B08/B09 terminal).

## Changes

### `src/lib/orders/journey-map.ts`
- `POST_B10_ALLOWED` → `["B02","B04","B05","B08","B10"]` (drop B09, add B10 back — mirrors Form Submitted per chart).
- Add two new `JourneyPhase` values: `"form_link_sent"` and `"post_b03_resume"`.
- `PHASE_ENABLED_BUTTONS`:
  - `form_link_sent: []`  (B01 was already sent, wait for customer)
  - `post_b03_resume: ["B04","B05","B08","B09","B10"]`
- Extend `DerivePhaseInput` with `formLinkSent?: boolean` and `techDelayResolved?: boolean` (parallels the existing `postWaitSubmitted` flag for B07).
- `derivePhase()`:
  - If `activeSubKey === "form-not-submitted"` and `formLinkSent` → return `"form_link_sent"`.
  - After a technical delay is resolved (phase would otherwise be `form_submitted` and `techDelayResolved` is true) → return `"post_b03_resume"`.

### `src/components/admin/workspace/CustomerJourneyMap.tsx`
- Track `formLinkSent` and `techDelayResolved` per order (localStorage, same pattern already used for `postWaitSubmitted`/B07):
  - Set `formLinkSent = true` after a successful B01 (`sendFormLink`) mutation; clear it when phase leaves `form-not-submitted` (i.e. customer submitted).
  - Set `techDelayResolved = true` after B03 (resume from technical hold); clear it when phase advances into the govt flow or a new technical delay starts.
- Pass both flags into `derivePhase(...)` so button gating updates immediately.
- Toolbar buttons already read `PHASE_ENABLED_BUTTONS[phase]`, so no per-button branching needed beyond the derive change.

### No changes needed
- `journey-graph.ts` (SVG/highlight rules) — buttons enable/disable is driven purely by `PHASE_ENABLED_BUTTONS`; edge/branch highlights stay as-is.
- Server-side transition guards — this is a UI enable/disable change only; the underlying action handlers already validate.

## Verification
- Load an order in each state and confirm the enabled toolbar matches the chart row:
  - Fresh `form_pending` order → only **B01** enabled.
  - Click B01 → toolbar goes empty until the customer submits.
  - Form submitted → **B02, B04, B05, B08, B10** enabled.
  - Click B02 (technical delay) → only **B03** enabled.
  - Click B03 → **B04, B05, B08, B09, B10** enabled.
  - Click B10 (customer delay) → **B02, B04, B05, B08, B10** enabled again (B09 gone).
  - Progress through B05→B06→B07 and confirm each row matches.
- Typecheck must pass (new phases added to the `Record<JourneyPhase, ButtonCode[]>` map).
