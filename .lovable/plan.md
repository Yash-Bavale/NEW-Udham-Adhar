## Goal

Fix the two completion paths so both **B06 Consultation Completed (S08)** and **B07 Application Accepted (S11)** are treated as valid completed orders, with correct journey highlighting and correct follow-up buttons.

## Current problems

1. After B06, the journey highlight jumps to "Application Submitted / Govt Portal" instead of glowing the **Consultation Completed (B06)** card.
2. Post-B06, follow-up buttons include unrelated ones (B04, B05, etc.) instead of only **B07** and **B08**.
3. Dashboards/KPIs treat S08 differently from S11; both should count as Completed.
4. Force Close visibility/behaviour needs to remain across both terminal-completed states.

## Changes

### 1. Stage mapping (`src/lib/crm/computeOrderStage.ts`)
- Keep `consultation_completed` as a distinct `OrderStage` (already added).
- Ensure fulfillment `S08 → consultation_completed`, `S11 → order_completed`.
- Mark both `consultation_completed` and `order_completed` as `isCompleted = true` for KPI/list rollups.

### 2. Button gating (`src/lib/orders/journey-map.ts`)
- Add phase `CONSULTATION_DONE` triggered when fulfillment = `S08`.
- `PHASE_ENABLED_BUTTONS[CONSULTATION_DONE] = ['B07', 'B08']` only (plus Force Close E010 always).
- Remove B04/B05/B09/B10 from post-B06 allowed set.
- `derivePhase()`: if `fulfillment_status === 'consultation_completed'` return `CONSULTATION_DONE`.

### 3. Journey highlight (`src/lib/orders/journey-graph.ts` + `CustomerJourneyMap.tsx`)
- `currentStageNodeFor(order)`: when stage = `consultation_completed`, return the **B06 sub-branch card node id** (not the govt-portal main node).
- Mark main-line edge into "Application Submitted / Govt Portal" as `done` (path traversed) but not `active`.
- B06 card gets `active` emerald glow + LIVE badge; B07/B08 cards render active buttons.

### 4. Action handlers
- `B07` (Application Accepted): allow transition from `S08 → S11` in `fulfillment-transitions.ts` (currently only from S07/S09). Sends E007 with certificate.
- `B08` (Application Rejected): allow transition from `S08 → S12` similarly. Sends E008 with reason.
- Both close order and stop schedulers.

### 5. Completion semantics
- `isOrderCompleted(order)` helper: returns true for `S08` OR `S11`.
- Update:
  - My Work / Dashboard KPI queries (`get_dashboard_metrics` RPC + client counters)
  - Orders list "Completed" filter
  - Any "active orders" query excludes both S08 and S11.

### 6. Force Close
- Remains available across all non-terminal + S08 (allow reopening/closing consult-completed if needed). Terminal S11/S12/S10 hide it (already the case).

## Files touched

- `src/lib/crm/computeOrderStage.ts`
- `src/lib/orders/journey-map.ts`
- `src/lib/orders/journey-graph.ts`
- `src/components/admin/workspace/CustomerJourneyMap.tsx`
- `src/lib/orders/fulfillment-transitions.ts`
- `src/lib/orders/actions/*.functions.ts` (B07, B08 handlers)
- `src/lib/crm/stageActionMap.ts`
- DB migration: update `get_dashboard_metrics` to count S08+S11 as completed.

## Out of scope

Email template edits, UI redesign of the map, and ticket-system changes.

## Verification

- Order at S08: journey highlights B06 card; only B07, B08, Force Close visible.
- B07 from S08 → S11, order marked Completed, E007 sent.
- B08 from S08 → S12, order Closed-Rejected, E008 sent.
- Dashboard "Completed" count includes both S08-only and S11 orders.
- AP-2026-007376 (currently S08) renders correctly.
