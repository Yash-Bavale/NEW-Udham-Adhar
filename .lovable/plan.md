## Goal
Replace the cluttered Workflow tab with one simple, linear status manager. No duplicated panels, no hidden dropdowns, no parallel "journey map + workflow + timeline" stacks competing for attention.

## What's wrong today
- Three things show the same info: `CustomerJourneyMap`, `StageStepper` (top), and `OrderWorkflowPanel` chips.
- "Under Processing / Government Portal Pending" chips, "Manual status override" accordion, and action buttons (External Delay / Customer Replied / Resume / Refund / Close) all live side-by-side with no clear primary action.
- No obvious "change status to X" control — user has to hunt.
- Scheduled reminders + timeline + action buttons crammed into one card.

## New Workflow tab (single panel, top → bottom)

```
┌─ ORDER STATUS ────────────────────────────────────────────┐
│  Current: ● Payment Done           Lane: Happy Path        │
│  Since 26 Jun 2026, 05:58 pm IST                           │
│                                                            │
│  [ ← Move Back ]    [ Advance to: Order Received → ]       │
└────────────────────────────────────────────────────────────┘

┌─ STAGE MAP (read-only progress) ──────────────────────────┐
│  ✓ Lead → ✓ Payment → ● Order Received → ○ Form → ○ Docs   │
│  → ○ Verification → ○ Submitted → ○ Processing → ○ Done    │
└────────────────────────────────────────────────────────────┘

┌─ NEED TO PAUSE OR CANCEL? ────────────────────────────────┐
│  [ Mark External Delay ]  [ Start Cancellation ]           │
│  (only these two switch lanes; everything else is linear)  │
└────────────────────────────────────────────────────────────┘

┌─ TIMELINE & REMINDERS (collapsed by default) ─────────────┐
│  ▸ 4 reminders · 3 events                                  │
└────────────────────────────────────────────────────────────┘
```

When lane = External Delay → top card swaps to: current reason, [Customer Replied] [Resume Order] [Close Order].
When lane = Cancellation → top card swaps to the 7-step closure stepper with one contextual CTA (Send Policy / Mark Replied / Force Close), matching current closure_stage.

## Removals
- Delete `CustomerJourneyMap` from the tab (its info merges into Stage Map + lane badge).
- Delete the duplicate `StageStepper` at top of Workflow tab (keep only the one inside Order Status panel).
- Delete "Manual status override" disclosure — replaced by explicit Advance/Move Back buttons that walk the canonical stage list.
- Collapse Scheduled Reminders + Timeline into one collapsible "History" section.

## Files
- Rewrite `src/components/admin/workspace/OrderWorkflowPanel.tsx` as the single panel above (three stacked cards, lane-aware top card).
- Edit `src/components/admin/workspace/WorkspaceShell.tsx`: Workflow tab renders only `<OrderWorkflowPanel />`. Remove `CustomerJourneyMap` import + render from this tab.
- No backend changes. Reuses existing `advanceStage`, `setExternalDelay`, `resumeOrder`, cancellation functions, and `closure_stage`.

## Result
One panel, one current status, one primary action ("Advance"), two clearly-labeled escape hatches (Delay / Cancel), history tucked away. No dropdown hunting, no duplicate stage visualizations.