# Adopt S01–S12 as the single source of truth

Rewires the order lifecycle to the 12 canonical stages from the uploaded doc. Old orders are left as-is (their old enum values remain valid) — only new activity uses the new stages. No data backfill.

## New canonical stages

| Code | `fulfillment_status_enum` value | Label |
|------|--------------------------------|-------|
| S01 | `order_received` (existing) | Order Received |
| S02 | `awaiting_customer_form` (new) | Awaiting Customer Form |
| S03 | `waiting_for_customer_submission` (new) | Waiting for Customer Submission |
| S04 | `form_submitted` (existing) | Form Submitted |
| S05 | `technical_delay` (existing) | Technical Delay |
| S06 | `customer_delay` (existing) | Customer Side Delay |
| S07 | `government_processing` (new) | Government Processing |
| S08 | `consultation_completed` (existing) | Consultation Completed |
| S09 | `application_approved` (new) | Application Approved |
| S10 | `application_rejected` (new, replaces `certificate_rejected` for new orders) | Application Rejected |
| S11 | `order_completed` (existing) — alias of `completed` for the new flow | Order Completed |
| S12 | `order_closed` (existing) | Order Closed |

Legacy enum values (`documents_received`, `verification_pending`, `application_submitted`, `under_processing`, `completed`, `cancelled`, `awaiting_govt`, `certificate_rejected`, `ticket_open`, `form_not_submitted`) stay in the enum for backward compat but are removed from the UI stage picker and journey map. `completed` is folded into `order_completed` for new writes.

## Database migration (single migration)

1. `ALTER TYPE public.fulfillment_status_enum ADD VALUE IF NOT EXISTS` for the 5 new values.
2. New table `public.order_stage_catalog` (code S01–S12, enum_value, label, sort_order) seeded with the 12 rows — small reference table used by admin UI for labels/badges. GRANT SELECT to `authenticated`; ALL to `service_role`; RLS enabled with a read-any-authenticated policy.
3. New SQL helper `public.next_fulfillment_stages(_from fulfillment_status_enum)` returning the allowed forward stages per the S01–S12 graph (see State machine below). Supersedes ad-hoc guards in code.

No data backfill; old rows keep their existing enum values.

## Code changes

Rewrite these files to key off the S01–S12 vocabulary. Business logic is unchanged where it already matches the doc — only labels and enum values change.

- `src/lib/crm/fulfillment-transitions.ts` — replace `FulfillmentStatus` union, `FULFILLMENT_STAGES`, `FULFILLMENT_LABEL`, `FULFILLMENT_BADGE`, `FULFILLMENT_TRANSITIONS` with the S01–S12 set. Keep legacy values in a separate `LEGACY_FULFILLMENT_STATUSES` union so old rows still render (labelled from a fallback map) but aren't offered as forward targets.
- `src/lib/orders/journey-map.ts` — retarget `JOURNEY_STAGES`, `stageToJourneyIndex`, `deriveJourneyLiveState`, `derivePhase` at S01–S12. Button gating (B01–B10) already matches the doc; only the stage keys the branches attach to are renamed (`order_received` → S01, `form_submitted` → S04, `app_submitted` → S07, `check_status` stays on S07, `completed` → S11).
- `src/lib/orders/journey-graph.ts` — node labels + `currentStageNodeFor` remapped to S01–S12.
- `src/lib/crm/workflow-closure.functions.ts` — `closeOrder` writes `fulfillment_status = 'order_closed'` (already correct), `handleGovtRejected` writes `application_rejected` instead of `certificate_rejected`.
- `src/lib/orders/actions/hold-actions.functions.ts` — `startTechnicalHold` / customer delay actions write `technical_delay` / `customer_delay` and resume back to `form_submitted` when cleared (already the behavior; verified).
- `src/lib/crm/orders-v2.functions.ts` — `complete_with_cert` writes `order_completed` (was `completed`). Certificate-attach guard unchanged.
- `src/lib/crm/stageActionMap.ts` — regenerate stage→primary CTA map against S01–S12. Old `OrderStage` keys that map to legacy fulfillment values are collapsed.
- `src/components/admin/FulfillmentStatusUpdater.tsx`, `src/components/admin/workspace/StageStepper.tsx`, `src/components/admin/workspace/CustomerJourneyMap.tsx` — read labels/colors from the new `FULFILLMENT_LABEL` / `FULFILLMENT_BADGE`.
- Unit tests: extend `src/lib/orders/__tests__/journey-graph.test.ts` with cases for each S01–S12 transition. Add a small `fulfillment-transitions.test.ts` asserting the allowed-transitions graph matches the doc.

## State machine (S01–S12)

```text
S01 Order Received
  └─auto→ S02 Awaiting Customer Form
S02 Awaiting Customer Form           (B01 available)
  └─B01→ S03 Waiting for Customer Submission
S03 Waiting for Customer Submission  (no buttons)
  └─customer submits→ S04 Form Submitted
S04 Form Submitted                   (B02, B04, B05, B06, B07, B08)
  ├─B02→ S05 Technical Delay ──B03──▶ S04
  ├─B04→ S06 Customer Side Delay ──resume──▶ S04
  │                              └─8h auto──▶ S12 Order Closed
  ├─B05→ S07 Government Processing
  ├─B06→ S08 Consultation Completed
  ├─B07→ S09 Application Approved ──cert upload──▶ S11 Order Completed
  └─B08→ S10 Application Rejected ──▶ S12 Order Closed
S07 Government Processing            (B04, B05, B06, B07, B08 same set)
S09 → S11 Order Completed (terminal)
S10 → S12 Order Closed (terminal)
Admin B09/B10 override remains orthogonal (unlocks all buttons).
```

## Not doing
- No migration of existing orders — they keep whatever legacy stage they had. New activity uses S01–S12.
- No changes to ticket flow (T001/T002) beyond renaming stage references.
- No UI redesign — same journey map, same buttons, only labels + enum values change.
