## What you're asking for

1. When Customer Delay is active on an order that already has a form submitted, the **main "Current Stage"** should read **Form Submitted** (not Customer Delay, not Order Received). The delay is shown separately as the amber **CUSTOMER DELAY** sub-badge that already exists.
2. Give Super Admin a setting to change the **Customer Delay auto-close duration** (HH:MM). New customer-delay triggers use that value; existing timers keep their original fire time.

## Fix 1 — Stage label

In `src/lib/crm/computeOrderStage.ts`, revert the customer/technical delay branches so they map back to `form_submitted`:

```
if (fs === "technical_delay" || fs === "customer_delay") return "form_submitted";
```

Result: header shows **Form Submitted** as the stage; the amber **CUSTOMER DELAY** chip beside it (driven by `journey-map.derivePhase` → `activeSubKey === "customer-delay"`) continues to indicate the delay. Fulfillment column reads "Customer Delay" because we now stamp `fulfillment_status = 'customer_delay'` from the previous fix.

The `technical_delay` / `customer_delay` OrderStage enum values added last turn will be dropped again (with matching entries in `STAGE_META`, `STAGE_BADGE_CLASS`, `stageActionMap.STAGE_ACTIONS`) to keep the type surface clean.

Journey-map current-node highlighting is unaffected (it uses `derivePhase`, not `computeOrderStage`), so the amber "Customer Side Delay" node stays lit and the "Form Submitted" node stays as the base current stage.

## Fix 2 — Configurable customer-delay auto-close

**Storage.** Add a single-row `public.app_settings` table (id = 1) with the field:
- `customer_delay_autoclose_minutes` (integer, minutes; default 480 = 8h business time)

Row is preseeded. RLS: readable by any `authenticated` user (so the scheduler can read via the server auth client if needed); writable only by `super_admin`. Service role bypasses RLS for the scheduler read path.

**Server plumbing.**
- `src/lib/scheduling/schedulers.server.ts` → new helper `readCustomerDelayAutocloseSeconds()` reads `app_settings.customer_delay_autoclose_minutes * 60`, falls back to `DEFAULT_CLOSURE_SECONDS` (8h).
- `startCustomerClosureScheduler(...)` uses that helper when `input.totalSeconds` is omitted. Existing scheduler rows are untouched.

**Super-admin UI.** Add a "Timers" card to `src/routes/admin.super.tsx` with a single HH:MM input bound to the setting. Save calls a new `updateCustomerDelayAutocloseMinutes` server function guarded by `has_role(auth.uid(), 'super_admin')`. HH:MM is parsed to minutes on save (range 00:15 – 168:00, i.e. 15 min to 7 days).

## Technical notes

- Only computeOrderStage.ts, STAGE_META/STAGE_BADGE_CLASS, and stageActionMap.ts revert; no changes to journey-graph.ts, journey-map.ts, or CustomerJourneyMap.tsx (they already render the sub-badge correctly).
- Migration adds `app_settings` with correct GRANTs and RLS (SELECT to authenticated, INSERT/UPDATE gated by super_admin via `has_role`).
- No backfill needed; existing schedulers keep firing on their pre-set `fires_at`.

## Out of scope

- Ticket auto-close, our-side reminder, and feedback follow-up durations stay hard-coded for now (call these out separately if you want them configurable too).
