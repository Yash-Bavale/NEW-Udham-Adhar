# Customer Journey — True Flowchart Layout

Scrap the stacked lane rows. Rebuild `CustomerJourneyMap.tsx` as an **SVG flowchart** that mirrors the drawio diagram: nodes placed on an XY grid, orthogonal connector lines with arrowheads, and the single live path lit up in color while inactive paths stay ghosted grey.

## Layout (matches uploaded drawio image)

```text
                                                    ┌─ B04 Consultation Done ─┐
                                                    │                          │
Order ─► Form Not ─► Form ─► B02 Tech ─► B03 Fix ─► APP SUBMITTED ──► CHECK ──►┼─► B07 After-Wait ─► ✅ Completed
Recv     Submitted   Sub'd    Delay      Resolved   TO GOVT PORTAL    STATUS  ││    │
  │        │           │        ▲                        ▲            │      ││    ├─► B08 Accepted+PDF ─► ✅
  │        │           │        └──── (B03 loops up) ────┘            │      │└─► B05 Waiting Approval ┘
  │        │           │                                              │      │
  │        │           └─► B10 Customer Delay ───┐                    ▼      └─► B09 Rejected ─► ❌ Closed
  │        │                    │                │              B06 Status
  │        └─► B01 Form Reminder│(8h auto-close) │              Checked
  │                 │           ▼                │              +Reminder
  │                 └──────► ❌ Closed (E010) ◄──┘
  └────────────────────────────► 🎫 Ticket Sub-lane (T001/T002)
```

## Approach

**Single SVG canvas** (~1600×760) with:
- **Node components** = rounded rects with icon + label + button-code chip, absolutely positioned by `x,y` from a config map.
- **Edges** = SVG `<path d="M x1 y1 L x2 y2 …" />` with orthogonal (elbow) routing, arrowhead marker at the tip.
- **Live-path highlight** = derive active edge/node set from `derivePhase()` + `deriveJourneyLiveState()`; those get colored stroke (`--primary`, animated `stroke-dasharray` flow); everything else stays `stroke-slate-200` dashed.
- **Icons** = lucide (`FileText`, `Clock`, `Building2`, `Search`, `CheckCircle2`, `XCircle`, `Ticket`, `AlertTriangle`, `Send`).
- **Buttons** stay attached to their node (bottom of the rect) but only clickable when `PHASE_ENABLED_BUTTONS[phase]` includes that code — otherwise 40% opacity + `cursor-not-allowed`.

## Node & edge config (data-driven)

```ts
// journey-graph.ts (new file)
export const NODES: Record<string, { x:number; y:number; w:number; h:number; label:string; icon:LucideIcon; kind:"stage"|"action"|"terminal"; tone:Tone; buttonCode?:ButtonCode }> = {
  order_recv:   { x:  40, y:300, ... label:"Order Received",     icon:Inbox },
  form_not:     { x: 220, y:300, ... label:"Form Not Submitted", icon:FileText },
  form_sub:     { x: 400, y:300, ... label:"Form Submitted",     icon:FileCheck },
  b02_tech:     { x: 580, y:220, ... buttonCode:"B02" },
  b03_fix:      { x: 720, y:220, ... buttonCode:"B03" },
  govt_portal:  { x: 900, y:300, ... label:"App Submitted to Govt", icon:Building2 },
  b04_consult:  { x: 900, y:180, ... buttonCode:"B04" },
  b05_wait:     { x:1080, y:400, ... buttonCode:"B05" },
  check_status: { x:1180, y:300, ... label:"Check Final Status", icon:Search },
  b06_remind:   { x:1180, y:180, ... buttonCode:"B06" },
  b07_after:    { x:1360, y:220, ... buttonCode:"B07" },
  b08_accept:   { x:1360, y:300, ... buttonCode:"B08" },
  b09_reject:   { x:1360, y:400, ... buttonCode:"B09" },
  completed:    { x:1540, y:260, ... label:"Completed",  icon:CheckCircle2, kind:"terminal", tone:"emerald" },
  b01_reminder: { x: 220, y:460, ... buttonCode:"B01" },   // form-not-submitted branch
  b10_cust:     { x: 400, y:460, ... buttonCode:"B10" },   // customer-side-delay branch
  closed_e010:  { x:1540, y:460, ... label:"Order Closed", icon:XCircle, kind:"terminal", tone:"rose" },
  ticket_lane:  { x:  40, y:620, ... label:"Support Ticket", icon:Ticket, kind:"sub" },
};

export const EDGES: Array<{ from:string; to:string; via?:"H"|"V"|"HV"|"VH"; branch:BranchKey }> = [
  // main happy path
  { from:"order_recv",  to:"form_not",     branch:"main" },
  { from:"form_not",    to:"form_sub",     branch:"main" },
  { from:"form_sub",    to:"b02_tech",     via:"VH", branch:"technical" },
  { from:"b02_tech",    to:"b03_fix",      branch:"technical" },
  { from:"b03_fix",     to:"govt_portal",  via:"HV", branch:"technical" },
  { from:"form_sub",    to:"govt_portal",  branch:"main" },
  { from:"govt_portal", to:"b04_consult",  via:"VH", branch:"shortcut" },
  { from:"b04_consult", to:"completed",    via:"HV", branch:"shortcut" },
  { from:"govt_portal", to:"check_status", branch:"main" },
  { from:"check_status",to:"b06_remind",   via:"VH", branch:"awaiting" },
  { from:"check_status",to:"b07_after",    branch:"awaiting" },
  { from:"check_status",to:"b08_accept",   branch:"main" },
  { from:"check_status",to:"b09_reject",   via:"HV", branch:"rejected" },
  { from:"b07_after",   to:"completed",    branch:"awaiting" },
  { from:"b08_accept",  to:"completed",    branch:"main" },
  { from:"b09_reject",  to:"closed_e010",  branch:"rejected" },
  // delay/close branches
  { from:"form_not",    to:"b01_reminder", via:"VH", branch:"form-nag" },
  { from:"b01_reminder",to:"closed_e010",  via:"HV", branch:"form-nag" },
  { from:"form_sub",    to:"b10_cust",     via:"VH", branch:"customer-delay" },
  { from:"b10_cust",    to:"closed_e010",  via:"HV", branch:"customer-delay" },
  { from:"b05_wait",    to:"b08_accept",   branch:"awaiting" },
];
```

## Live highlighting

`activeBranches: Set<BranchKey>` derived from phase:
| Phase | Active branches |
|---|---|
| `form_not_submitted` | `main`(order→form_not) + `form-nag` |
| `form_submitted` | `main` up to govt_portal |
| `technical_delay` | `technical` loop |
| `customer_delay` | `customer-delay` (+ reopened `main` per `POST_B10_ALLOWED`) |
| `consultation_done` | `shortcut` |
| `awaiting_govt` | `awaiting` |
| `status_checked` | `main` + `awaiting` after check |
| `completed` | full green trace to `completed` |
| `closed` | red trace to `closed_e010` |

Rendering rules:
- **Active edge**: `stroke-2 stroke-primary` + `strokeDasharray="8 4"` + `animate` (`stroke-dashoffset` marching ants via CSS keyframe).
- **Completed edge** (already passed): solid `stroke-emerald-500`, no animation.
- **Idle edge**: `stroke-slate-200 stroke-1 stroke-dashed`.
- **Terminal reached**: emerald or rose fill on the terminal node.
- Countdown chip floats above the active button (uses existing `CountdownChip`).
- Ticket sub-lane sits below on a violet strip; when open, dashed violet arrow rises to the currently-paused stage node.

## Orthogonal routing

Small helper `elbow(from, to, via)` returns the `d` string:
- `via="H"` → straight horizontal
- `via="V"` → straight vertical
- `via="HV"` → horizontal then vertical (right-angle)
- `via="VH"` → vertical then horizontal
Anchors picked from node edge midpoints (`x+w`, `y+h/2` for right, etc.). No collision solver needed — grid is hand-tuned in the config.

## Files

**New**
- `src/lib/orders/journey-graph.ts` — NODES + EDGES + `activeBranchesForPhase(phase)` helper + `elbow()` path builder.
- `src/components/admin/workspace/journey/FlowNode.tsx` — rounded-rect node with icon, label, optional button pill, `state: "idle"|"active"|"done"|"terminal-ok"|"terminal-bad"`.
- `src/components/admin/workspace/journey/FlowEdge.tsx` — `<path>` + arrowhead marker, respects state.

**Rewritten**
- `src/components/admin/workspace/CustomerJourneyMap.tsx` — replaces the row layout entirely: one `<svg viewBox="0 0 1600 760">` that maps NODES/EDGES, plus a floating action layer for buttons (HTML overlay absolutely positioned at each node's coords so clicks + tooltips still work). Keeps all existing mutation wiring (`mutFormLink`, `mutResume`, `mutSubmit`, ticket dialogs, reason picker, etc.).

**Untouched**
- `journey-map.ts` config, `PHASE_ENABLED_BUTTONS`, all server functions, workflow engine, templates, migrations.

## Responsiveness

- Canvas has fixed `viewBox`; wrap in horizontal-scroll container on `<lg` screens.
- Add zoom-out toggle (0.75× / 1× / 1.25×) via CSS transform on the SVG wrapper.

## Deliverable

An operator opening an order sees the exact drawio flowchart, one path lit up in `--primary` with marching-ants animation ending at a live-countdown button chip, everything else greyed. No stacked lanes, no overlapping cards.
