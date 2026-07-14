
## Goal

Replace the single-row journey with **4 clearly separated tracks** stacked vertically, each with its own header, color band, stages and action buttons. The active sub-path is always visually highlighted (green = done, indigo = current, amber/rose = live delay/closure), and every branch is always visible even when inactive — so the employee sees at a glance where the order stands and every path it *could* take.

## The 4 Tracks

```text
┌─ 🟢 MAIN JOURNEY ────────────────────────────────────────────────┐
│  Lead → Payment → Order Rcvd → Form → Govt Portal → Final → Done │
│  (7 stage nodes, current one pulses indigo, done ones green)     │
└──────────────────────────────────────────────────────────────────┘

┌─ 🟡 DELAY FLOW  (visible always, "LIVE" chip when active) ───────┐
│  ┌─ Form Not Submitted ─┐ ┌─ Customer Delay ─┐ ┌─ Tech Delay ─┐  │
│  │ E002 Send Form Link  │ │ E004 (Cat A)     │ │ E003 (Cat B) │  │
│  └──────────────────────┘ └──────────────────┘ └──────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌─ 🔴 CLOSURE FLOW  (auto-close countdown + reasons) ──────────────┐
│  Countdown chip · Reason label · [Force Close E010]              │
│  [E008 Govt Rejected]  [T002 Reply w/ Reason 8h auto-close]      │
└──────────────────────────────────────────────────────────────────┘

┌─ 🔵 SUPPORT TICKET FLOW  (only rendered when ticket exists) ─────┐
│  Ticket #XXX open · Workflow paused                              │
│  [T001 Normal Close] [T001 Restart] [T001 Consult Done] [T002]   │
└──────────────────────────────────────────────────────────────────┘
```

Each track is a self-contained card so pausing/resuming, delays and closures never mutate or hide the Main Journey — the main path stays visible with its progress preserved.

## Files to Change

**1. `src/lib/orders/journey-map.ts`** — add a `track` field to each branch/button config.

```ts
export type JourneyTrack = "main" | "delay" | "closure" | "ticket";
```

Re-tag existing branches:
- `form-not-submitted`, `customer-side-delay`, `technical-delay` → `track: "delay"`
- `app-submitted-actions`, `final-status-actions`, `talk-to-expert` → `track: "main"` (stay under their parent stage)
- New `closure` track config: force-close, govt-rejected (E008), T002 reply-reason
- `TICKET_BUTTONS` → `track: "ticket"`

Add `getActiveDelayBranchKey(workflowStatus)` and `getActiveClosureState(closureStage, closureNextAt)` helpers so the UI can highlight without re-deriving.

**2. `src/components/admin/workspace/CustomerJourneyMap.tsx`** — replace the single grid with 4 stacked `<TrackCard>` sections:

- `<MainTrack>`: current 7-stage stepper + only the *positive* branches under `app_submitted` / `check_status` / `completed` (E005, E006, E007, E009). Same visual as today but narrower.
- `<DelayTrack>`: 3 branch cards side-by-side (Form-Not-Submitted, Customer Delay, Tech Delay). All 3 always shown; the one matching `workflowStatus` gets a live ring + "LIVE" chip and a small "Why: {reason}" line pulled from `view` / `closureReasonLabel`.
- `<ClosureTrack>`: shows the countdown chip (already in `view.nextTimer`) + closure-stage label + Force Close + E008 + T002 buttons. When `closed`, the whole card turns slate and shows the final reason.
- `<TicketTrack>`: renders only when `view.activeTicketId`. Shows ticket id, "Workflow paused" banner (moved out of the top), and the 4 T00x buttons. **Not rendered when no ticket** (fixes the earlier ask "don't show ticket actions when no ticket").

Shared visual language:
- Track header: colored dot + bold label + status chip (`Idle` / `Live` / `Paused` / `Closed`).
- Inactive branches: muted (60% opacity, no ring).
- Active branch: colored ring + pulsing dot + reason caption.
- All buttons stay clickable regardless of active state (per prior spec).

**3. No server / migration changes.** All wiring already exists (`useOrderWorkflow`, existing server fns for E002…E010, T001…T003). This is purely a presentation restructure of `CustomerJourneyMap.tsx` + config tags in `journey-map.ts`.

## Behavior Rules

- Main track is *never* replaced or hidden by a delay/closure — it stays with its accumulated green ticks.
- Delay track shows all 3 sub-paths always; highlights the live one with reason text.
- Closure track surfaces the auto-close countdown, closure reason, and every close-button in one place (no more scattered force-close footer + govt-rejected inline).
- Ticket track is conditionally mounted — hidden entirely when there is no active ticket.
- Positive next-step buttons (E005 / E006 / E007 / E009) stay under their Main-track stage columns exactly where they are today (matches your "buttons directly below stage" request).

## Out of Scope

- No changes to email templates, server functions, or workflow engine.
- No new dialogs — reuse `ExternalDelayDialog`, `CloseOrderDialog`, `CompletionGateDialogStandalone`, `GovtRejectedInline`.
- Sidebar collapse, ticket-actions-only-when-ticket-exists were done earlier; only re-affirming ticket-track visibility here.
