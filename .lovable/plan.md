# Phase 5.1 — Make the workflow engine visible in the admin order UI

Phase 5 only added a new "Workflow engine" card. The existing Customer Journey, Process Tracker, Order Workflow panel and Unified Timeline still read the legacy `p.stage` / `application.workflow_status` / `application.closure_stage` fields, so the redesign is invisible. This phase rewires those four surfaces to the engine tables (`workflow_states`, `workflow_timers`, `workflow_automations`, `workflow_events`) and adds the missing Payment section.

## What changes

### 1. Shared engine hook + stage mapping (new)

- New `src/lib/workflow/engine-view.ts` (client-safe):
  - `WORKFLOW_TO_JOURNEY`: maps engine `WorkflowStage` (`payment_successful`, `form`, `verification`, `government_portal`, `completed`, `closed`) → journey node (`payment`, `form`, `verification`, `govt`, `processing`, `completed`).
  - `deriveJourneyView(state, timers, automations, application)`: returns `{ activeNode, doneNodes, blockedNodes, paused, pauseReason, activeTicket, paymentStatus, nextTimer, activeAutomation }`. Falls back to legacy `computeOrderStage` only when no `workflow_states` row exists yet.
- New `src/hooks/useOrderWorkflow.ts`: wraps `useServerFn(getWorkflowState)` + `useQuery` (15s refetch, focus refetch), keyed by `applicationId`. Single source of truth reused by the four surfaces below.

### 2. CustomerJourneyMap — engine-driven + folds in the standalone card

- Accept `applicationId` (not just legacy `stage`); call `useOrderWorkflow` internally.
- Active/done/blocked nodes derived from `deriveJourneyView`.
- Header row inside the map card now shows: overall chip (Running / Paused / Completed / Stopped), active-ticket badge, pause reason, and the next-firing timer (`AlarmClock · fires in 42m`) + running automation chips — this is the fold-in of `OrderWorkflowLiveStatus`.
- Keep the legacy cancellation strip (`CANCEL_STEPS`) but drive it from engine `sub_status`/`stage=closed` instead of `closure_stage`.

### 3. ProcessTracker — engine-driven colors

- Accept optional `applicationId`; when provided, read engine stage via `useOrderWorkflow` and:
  - `done` = nodes before engine stage.
  - `current` = engine stage node.
  - `blocked` = current node when `paused === true` OR `active_ticket_id` present (red instead of blue).
- Falls back to the passed `stage` prop when no engine row exists (keeps existing call sites working).

### 4. OrderWorkflowPanel — engine controls, not legacy closure fields

- Replace the current `workflowStatus / closureStage / closureNextAt / cancellationRequestedAt` inputs with `useOrderWorkflow(applicationId)`.
- New panel body:
  - Header: engine stage + status + sub-status chips, pause reason, active-ticket link.
  - Payment mini-card (see §3).
  - **Timers list** with kind label, `fires in …`, and Pause / Resume / Cancel buttons wired to existing engine server fns (`pauseTimer`, `resumeTimer`, `cancelTimer` — add thin wrappers in `engine.functions.ts` if missing).
  - **Automations list** with Pause / Resume / Stop.
  - **Advance / Pause workflow** buttons that dispatch engine events (`PauseWorkflow`, `ResumeWorkflow`, `AdvanceStage`) through existing `dispatchWorkflowEvent`.
  - All mutations invalidate the `["order-workflow-state", applicationId]` query.

### 5. UnifiedTimeline — merge engine events

- Extend `UnifiedTimeline` props with `workflowEvents` (fetched via new `listWorkflowEventsForOrder({ applicationId })` server fn under `src/lib/workflow/engine.functions.ts`, RLS-scoped by staff role).
- Merge into the existing chronological stream with a new category `workflow` (icon `Cog`, tint indigo). Event titles use the same `TIMER_LABEL` / `AUTO_LABEL` / `STAGE_LABEL` maps.
- `WorkspaceShell` passes them in on the Activity tab.

### 6. Remove the standalone card

- Delete `src/components/admin/workspace/OrderWorkflowLiveStatus.tsx`.
- Remove its render + import from `WorkspaceShell.tsx` (functionality is now inside `CustomerJourneyMap` and `OrderWorkflowPanel`).

## Files touched

- New: `src/lib/workflow/engine-view.ts`, `src/hooks/useOrderWorkflow.ts`
- Edited: `src/components/admin/workspace/CustomerJourneyMap.tsx`, `src/components/admin/workspace/OrderWorkflowPanel.tsx`, `src/components/admin/workspace/WorkspaceShell.tsx`, `src/components/admin/ProcessTracker.tsx`, `src/components/admin/UnifiedTimeline.tsx`, `src/lib/workflow/engine.functions.ts` (add `listWorkflowEventsForOrder` + timer/automation control wrappers if missing)
- Deleted: `src/components/admin/workspace/OrderWorkflowLiveStatus.tsx`

## Verification

- `tsgo` typecheck.
- Manual: open an order → Customer Journey card shows engine chip + payment row + highlighted node matching engine stage; Employee Workflow tab shows live timers with Pause/Resume; Activity tab shows a `workflow` event when the cron tick fires a timer; ProcessTracker turns red when workflow is paused or has an active ticket.