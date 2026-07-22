## Fix Form Submitted (S03) "possible next" edge highlights

In `src/lib/orders/journey-graph.ts`, update the `POSSIBLE_NEXT_FROM_FORM_SUB` set inside `edgeState` so the blue "possible next" glow at S03 shows only the edges the operator can actually trigger from Form Submitted:

**Remove from set:**
- `e_b02_b03` — Technical Delay → Issue Resolved (only lights up once B02 is clicked)
- `e_b04_cl` — Customer Side Delay → Order Closed (only lights up once B04 is clicked)
- `e_gv_cs` — Application Submitted → Application Accepted/Closed (not a direct next step from S03)

**Add to set:**
- `e_top_cs` — top loop edge from Form Submitted up-and-over to Application Accepted/Closed (this is the missing route the user wants highlighted)

**Keep as-is:**
- `e_fs_b02` (into Technical Delay)
- `e_top_gv` (to Application Submitted Govt Portal)
- `e_bot_b04` (into Customer Side Delay)
- `e_gv_b05`, `e_gv_b06`, `e_cs_b07`, `e_cs_b08` (sub-card drops)

No other files, no logic changes elsewhere — pure edge-list adjustment for the S03 preview highlight.
