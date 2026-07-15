# Compact, Config-Driven Journey Flowchart

Shrink the canvas, add responsive scaling, extract the graph into a pure config module, tighten highlight rules, and add unit tests.

## 1. Compact + responsive canvas

Current canvas is 1720×820 fixed — too wide.

- Shrink node size (`W=120, H=52`) and grid step (`180 → 140` X, `160 → 130` Y).
- New viewBox: **1240×620** — fits comfortably in the workspace column.
- Wrap SVG + overlay in a container that auto-scales:
  ```tsx
  <div ref={wrapRef} className="w-full">
    <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: CANVAS_W, height: CANVAS_H * scale }}>
      …svg + nodes…
    </div>
  </div>
  ```
  Scale = `min(1, wrapWidth / CANVAS_W)` via `ResizeObserver`. On mobile it renders at ~0.3–0.4× with no horizontal scroll; on desktop it renders 1:1.
- Remove the `overflow-x-auto` scroller.
- Node HTML uses `absolute` positions in the same coord space as the SVG so scaling transforms both together.

## 2. Extract graph to config module

New file: **`src/lib/orders/journey-graph.ts`** — pure, no React.

Exports:
- `NODES: NodeDef[]` (id, x, y, kind, tone, icon key string, buttonCode, emailCode, subtitle).
- `EDGES: EdgeDef[]` (from, fromSide, to, toSide, mode, branch, waypoints?).
- `anchor(node, side)`, `pathD(a, b, mode, waypoints)` helpers.
- `activeBranchesFor(phase, terminal, reasonCode)` → `Set<BranchKey>`.
- `mainDoneEdgesFor(currentIdx)` → `Set<string>`.
- `edgeState(edge, { activeBranches, doneMainEdges, terminal })` → `"done" | "active" | "closed" | "idle"`.
- `nodeState(nodeId, { currentIdx, activeBranches, terminal })` → `"done" | "active" | "terminal-ok" | "terminal-bad" | "idle"`.

Icon lookup stays in the component (React-only), keyed by string (`"inbox" | "fileText" | …`) so the config file stays pure JS.

`CustomerJourneyMap.tsx` becomes rendering-only: imports graph + helpers, iterates NODES/EDGES, no hard-coded coordinates or branch logic in the component.

## 3. Highlight rules — exact per stage

Rewrite `activeBranchesFor` to make one and only one sub-branch active for the current phase, matching the flowchart:

| Phase                 | Active branch(es)          | Notes                                    |
|-----------------------|----------------------------|------------------------------------------|
| `form_not_submitted`  | `form-nag`                 | main up to `form_not` = done             |
| `form_submitted`      | (none — main only)         | main up to `form_sub` = done             |
| `technical_delay`     | `technical`                | loop lit; main freezes at `form_sub`     |
| `customer_delay`      | `customer-delay`           | main up to `form_sub` = done             |
| `consultation_done`   | `shortcut`                 | main up to `govt_portal` = done          |
| `awaiting_govt`       | `awaiting`                 | main up to `govt_portal` = done          |
| `status_checked`      | `status`                   | main up to `check_status` = done         |
| `post_wait_submitted` | `status` + `accept`(pre-lit) | main up to `check_status` = done       |
| `completed`           | winning branch to completed| based on last touched (accept/status/shortcut) |
| `closed`              | closing branch to closed_e010 | pick by reasonCode: A→form-nag OR customer-delay; B→reject |

Also fix: when `closed` with reason A but the order actually died on the customer-delay branch, prefer that branch. Heuristic: if `workflowStatus` recently contained "customer" → customer-delay; else form-nag.

## 4. Line/node icon consistency

- All node badges use the same 20px circular icon well; state color comes from the tone system, not from ad-hoc classes.
- All arrowheads are a single shared triangle marker rendered per state color (currently correct).
- Add small directional icons at edge joins where lines change direction (subtle 6px dot at each corner) so orthogonal turns match the drawio look.
- Line strokes: idle 1.25px dashed slate-300; done 2px solid emerald-500; active 2px dashed indigo-500 marching-ants; closed 2px dashed rose-500.
- Node role indicators: `stage` = rounded rectangle with icon left; `action` = same shape + button footer; `terminal` = filled rounded rectangle in tone; `sub` = dashed outline.

## 5. Tests

New file: **`src/components/admin/workspace/__tests__/CustomerJourneyMap.test.tsx`** (Vitest + React Testing Library).

Cases (one per JourneyPhase + terminals):
1. `form_not_submitted` → `form-nag` edges active, main-1 done, all others idle.
2. `form_submitted` → main-1..3 done; no branch active.
3. `technical_delay` → `technical` active; `main-3` idle (not done — still holding).
4. `customer_delay` → `customer-delay` edges active; countdown chip present on `b10_cust`.
5. `consultation_done` → `shortcut` active; `main-4` done.
6. `awaiting_govt` → `awaiting` active; `b05_wait` node active.
7. `status_checked` → `status` active.
8. `post_wait_submitted` → `status` + `accept` active.
9. terminal `completed` → `completed` node = `terminal-ok`.
10. terminal `closed` (reason A) → `closed_e010` = `terminal-bad`; `form-nag`/`customer-delay` closed.
11. terminal `closed` (reason B7) → `reject` closed; `b09_reject` shown red.

Snapshot test for the pure graph config (nodes/edges list stability) so unintentional layout drift shows up in review.

**Approach:** unit-test the pure helpers (`activeBranchesFor`, `edgeState`, `nodeState`) directly — no DOM needed for the highlighting logic. Add ONE integration test that mounts `CustomerJourneyMap` with mocked hooks (`useOrderWorkflow`, `useServerFn`, `useQuery`) and verifies node count, one live "LIVE" badge, and correct edge stroke classes via `container.querySelectorAll('path[data-branch="form-nag"]')` — add `data-branch` and `data-state` attributes to each path/node for testability.

Adds `data-testid`, `data-branch`, `data-state` attributes throughout — no visual change.

## Files

**New**
- `src/lib/orders/journey-graph.ts` — pure config + helpers.
- `src/lib/orders/__tests__/journey-graph.test.ts` — pure-helper unit tests (11 cases).
- `src/components/admin/workspace/__tests__/CustomerJourneyMap.test.tsx` — one integration render test.

**Rewritten**
- `src/components/admin/workspace/CustomerJourneyMap.tsx` — imports config, adds `useResponsiveScale` hook, renders responsive scaled diagram, adds test hooks (`data-*` attrs).

**Untouched**
- `journey-map.ts` (existing config), all server fns, workflow engine, dialogs, `CountdownChip`, `PHASE_ENABLED_BUTTONS`.

## Deliverable

The Customer Journey renders at natural 1240×620 on desktop and auto-shrinks on tablet/mobile with no horizontal scroll bar and no clipping. Only the connector segment matching the current phase lights up. Graph is data-driven from one config file. Unit tests cover every phase transition and terminal outcome.
