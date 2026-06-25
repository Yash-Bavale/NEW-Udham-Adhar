## Goal
Restore the original premium "concentric ring + step pips" countdown design that previously ran on the 30-second post-lead-form page, and use that same design for both:
- `/processing/$leadCode` — 30 seconds (post-lead-form)
- `/success/$leadCode` — 60 seconds (post-payment)

The current emerald `CountdownCard` (single SVG ring + step pill) is not what the user approved. The earlier brand-navy/amber design with concentric rotating rings, animated center icon, gradient progress bar, and a grid of step pips is the canonical one.

## Changes

### 1. Rewrite `src/components/site/CountdownCard.tsx`
Replace the emerald single-ring layout with the original premium design, kept as a reusable shared component:
- Ambient blurred background blobs (brand-navy + amber).
- Card: `rounded-3xl border bg-card/85 backdrop-blur shadow-2xl`.
- Concentric loader (w-32 h-32):
  - Outer slow ring (8s rotate).
  - Gradient sweep ring (1.8s rotate, brand-navy top/right).
  - Inner counter-rotating ring (2.4s, amber bottom/left).
  - Center pulsing dot with the active step icon (animates on change).
- Large countdown number `{remaining}s` in brand-navy.
- Gradient progress bar (brand-navy → brand-navy-deep → amber).
- Step pips grid: `grid-cols-2 sm:grid-cols-N` (N = steps.length, capped at 6) showing done / active / pending states with check icon when complete.
- Footer: encrypted/ISO line + optional ref code.
- Props unchanged: `totalSeconds`, `elapsed`, `steps`, `leadCode`, `holdLabel`, `holdSub` so existing callers keep working.

### 2. `src/routes/processing.$leadCode.tsx`
- Keep 30-second timer, 4 steps (Securing → Validating → Compliance → Finalising).
- Continue using `<CountdownCard />`; no logic change.

### 3. `src/routes/success.$leadCode.tsx`
- Keep 60-second timer, 6 steps already defined.
- Continue using `<CountdownCard />` with `holdLabel` / `holdSub` for the late-confirmation case; no logic change.

### 4. No other files touched
- Timer durations, redirects, polling, and tracking remain exactly as they are.
- No backend, server-function, or styling-token changes.

## Verification
- Visit `/processing/<code>` → confirm concentric rings, navy/amber palette, step pips grid, 30s countdown.
- Visit `/success/<code>` after a test payment → confirm identical look with 6 step pips and 60s countdown.
- Resize to mobile → pips collapse to 2 columns, card stays centered.
