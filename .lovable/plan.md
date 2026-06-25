## Goal

Keep the shared "premium concentric ring" design on both pages (already in place) and split the timers:

- **Lead-form processing** (`/processing/$leadCode`) → **30 seconds**
- **Post-payment success** (`/success/$leadCode`) → **60 seconds** (unchanged)

## Changes

### 1. `src/routes/processing.$leadCode.tsx`
- `TOTAL_SECONDS = 30` (currently 60)
- Re-space the 4 step markers to fit 30s:
  - `at: 0` — Securing your details
  - `at: 8` — Validating application data
  - `at: 15` — Running compliance checks
  - `at: 22` — Finalising your application
- No visual/markup changes — same ring loader, gradient progress bar, step pips, lock footer.

### 2. `src/routes/success.$leadCode.tsx`
- No code changes. Already `TOTAL_SECONDS = 60` with steps at 0/15/30/45 and the identical design.

## Out of scope

- No design tokens, copy, or redirect-logic changes.
- No backend / server-fn changes.
