## Problem

In the current Lead Quick Actions card:
- "Send Payment Link via WhatsApp" and "Send Payment Link via Email" buttons only render *after* a payment link has been generated. Since most leads don't have a link yet, only "Generate Payment Link" shows (as in the screenshot).
- "Mark as Contacted" only flips status; it does not send the WhatsApp intro message the user described.

The message templates (`buildIntroMessage`, `buildPaymentLinkMessage`) already match the exact wording/formatting requested — no change needed there.

## Changes (single file: `src/components/admin/LeadWorkspacePanel.tsx`, `QuickActionsCard`)

1. **Always show both "Send Payment Link" buttons** (WhatsApp + Email) regardless of whether a link exists yet.
   - On click, if `paymentUrl` is already available → open `wa.me` / `mailto:` immediately with the prefilled message.
   - If not, call `createPaymentLink` first, refetch, then open the WhatsApp/Email link with the newly generated URL prefilled.
   - Disable buttons briefly while generating; toast on failure.
   - Keep the "Generate Payment Link" button + link preview row when no link exists (so employees can still just copy it), but the two Send buttons are always visible directly under "Payment Link".

2. **Mark as Contacted → also fire WhatsApp intro**
   - After `transitionFn` succeeds and status flips to `contacted`, if `waNumber(lead.mobile)` exists, open `https://wa.me/<number>?text=<encoded introMsg>` in a new tab.
   - Do not open WhatsApp on the "undo → new_lead" path.
   - Guard with a small helper so pop-up blockers still allow it (open synchronously in the click handler via `window.open('', '_blank')` then set `.location`).

3. **Small guards**
   - Both Send buttons disabled (with tooltip/hint text) when mobile / email is missing respectively.
   - Reuse existing `buildIntroMessage` and `buildPaymentLinkMessage` — no template edits.

No changes to backend, DB, other components, or unrelated UI. No layout redesign — only the Quick Actions button set + Mark-as-Contacted handler.

## Verification

- Lead with no payment link: both Send buttons visible; clicking WhatsApp generates a link, then opens WhatsApp with the payment-link message prefilled.
- Lead with existing payment link: Send buttons open WhatsApp/Email instantly with prefilled message.
- Mark as Contacted on a lead with a mobile: status flips + WhatsApp tab opens with intro message.
- Mark as Contacted "undo": no WhatsApp opened.
