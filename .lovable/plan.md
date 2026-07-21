## Goal
Fix journey rendering at S08 (Consultation Completed) so it visually reads as a completed order with only B07/B08 actionable.

## Rules confirmed
- **Path highlight**: ONLY the `Application Submitted (Govt Portal)` card AND the `Consultation Completed (B06)` card render green/done. All upstream nodes (Order Received, Form Not Submitted, Form Submitted) and their connectors stay idle (grey). No blue Active/LIVE glow anywhere at S08.
- **Buttons**: Only B07 (Application Accepted) and B08 (Application Rejected) are clickable. Force Close remains visible as always. Everything else disabled/idle tone.
- **Header chip**: `Current: Consultation Completed · ORDER COMPLETED` (emerald tone).

## Changes

### 1. `src/lib/orders/journey-graph.ts`
- `nodeState(nodeId, ...)` when phase = `consultation_done`:
  - `govt_portal` → `done` (green, no glow)
  - `b06_consult` → `done` (green, no glow, no LIVE badge)
  - all other main-line nodes (`order_rec`, `form_not`, `form_sub`) → `idle`
  - `b07_accept`, `b08_reject` → `active-actionable` (buttons lit)
  - every other branch card → `idle`
- `edgeState(...)` when phase = `consultation_done`:
  - Only the edge `govt_portal → b06_consult` renders `done` (green).
  - All other edges → `idle` (grey).
- `currentStageNodeFor(...)` when phase = `consultation_done`: return `null` (no LIVE/active glow node; both target cards read as `done` instead).

### 2. `src/lib/orders/journey-map.ts`
- `deriveJourneyLiveState`: when `stage === "consultation_completed"`, set `terminal = "completed"` and `subStateLabel = "Order Completed"` so the header chip renders emerald "ORDER COMPLETED".
- Keep `derivePhase` returning `consultation_done` for S08 (already correct); button gating already limited to B07/B08.

### 3. `src/components/admin/workspace/CustomerJourneyMap.tsx`
- Header "Current" label: when phase = `consultation_done`, show `Consultation Completed` + emerald `ORDER COMPLETED` chip (drop the "Awaiting Govt Response" chip).
- Ensure no node renders the LIVE badge when `currentStageNodeFor` returns null.

## Out of scope
B07/B08 handler wiring (already done previous turn), dashboard KPIs (already counted), email templates, force-close.

## Verification
Load AP-2026-007376 (S08):
- Only `Application Submitted (Govt Portal)` and `Consultation Completed` cards are green.
- Upstream cards & connectors are grey/idle.
- No blue LIVE glow.
- Only B07 & B08 buttons clickable; Force Close visible.
- Header: `Current: Consultation Completed` + emerald `ORDER COMPLETED` chip.