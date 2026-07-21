## Goal

When **Admin Override** is enabled in the order workspace, any stage/button click bypasses transition validation — no more "illegal transition NEW_ORDER → SUBMITTED_TO_GOVT" or "Cannot move order from … Allowed next stages: …" errors.

## Root cause

Override today only *unlocks the buttons in the UI*. The actual writes still hit two independent guards that throw:

1. **Client-side gate** — `src/lib/crm/orders-v2.functions.ts` `updateFulfillmentStatus` throws `Cannot move order from "X" to "Y". Allowed next stages: …` when the target isn't in the allowed list.
2. **DB RPC gate** — `transition_order_status` (migration `20260714095433`) throws `illegal transition X -> Y` unless the caller passes `_force = true` **and** is a super admin (`is_super_admin`).

The `adminOverride` flag from `WorkspaceShell` never reaches either guard, so admins (non-super) still hit both errors.

## Changes

### 1. Propagate an `adminOverride` flag on every stage-changing server fn

- `src/lib/crm/orders-v2.functions.ts` → `updateFulfillmentStatus`: add `adminOverride: boolean` to the input schema. When true, skip the `allowed.includes(target)` throw entirely (still require staff, still require cert fields when target is `completed`).
- `src/lib/orders/order-status.functions.ts` → `transitionOrder`: already accepts `force`; add `adminOverride` alias that sets `_force: true` on the RPC.
- `src/lib/orders/order-actions.functions.ts` (three call sites at lines 29, 134, 259/264) and `src/lib/orders/actions/hold-actions.functions.ts` (5 RPC calls): accept an optional `adminOverride` from the caller and forward as `_force: true` to `transition_order_status`.

### 2. Loosen the RPC gate for admins when force is set

New migration replacing `public.transition_order_status`:

- Keep the current signature and behaviour.
- Change the bypass condition from `_force AND is_super_admin(v_actor)` to `_force AND has_role(v_actor, 'admin') OR is_super_admin(v_actor)` — i.e. an authenticated admin (or super admin) passing `_force = true` skips the `allowed` check. Everyone else keeps the strict map.
- No other logic changes.

### 3. Wire the workspace `adminOverride` state to every action call

`src/components/admin/workspace/WorkspaceShell.tsx` already owns `adminOverride`. Pass it into every mutation that ends up calling one of the server fns above (fulfillment updater, journey B01–B08 handlers, `CustomerJourneyMap` action buttons, `FulfillmentStatusUpdater` and any `StatusTransition` invocation reachable from the workspace). The flag rides through as `{ adminOverride: true }` on the server-fn call payload.

### 4. Keep guardrails that aren't stage-map related

- Certificate + cert-number validation for `completed` stays enforced even with override (data integrity, not a transition rule).
- Timer/scheduler cleanup on close stays.
- Transition guard in `src/lib/workflow/transition-guard.server.ts` is action-semantic (delay category, hold resolution) — unchanged; the override flag only bypasses the ordered stage map + RPC map.

## Out of scope

- Ticket flows, email templates, journey diagram visuals.
- override remains admin/super-admin only, gated by the existing `isAdmin` check in `WorkspaceShell`.

## Verification

- As admin with override OFF: current errors still appear (regression check).
- As admin with override ON: change `order_received → submitted_to_govt`, `order_received → consultation_completed`, and other jumps succeed; `application_events` records the jump with the actor.
- As super admin: unchanged (already bypassed).