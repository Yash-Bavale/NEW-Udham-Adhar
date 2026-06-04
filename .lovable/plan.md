## Status recap

- **A, B, C, D foundation** — done (DB form schemas, 7 service seeds, NIC 2008 + picker, status enum + `application_status_history` + `transitionStatus()`/`getStatusHistory()`).
- **D wiring, E, F, G, H, I, J, K, L** — pending. This plan covers F→L (with the E + D-wiring leftovers folded in so nothing is half-built).
- Each phase = 1 migration (where needed) + a small batch of server fns / routes / admin UI, then a smoke test before the next phase.

## Sequencing

Batches stay in the order we agreed (C→D→E→F→G→H→I→J→L→K). I'll do them in 4 turns of work:

```text
Turn 1  →  D-wiring + E (links) + F (PDFs)
Turn 2  →  G (complaints) + H (docs + cert upload) + I (email cron)
Turn 3  →  J (Talk to Expert child app) + L (PayU + gateways)
Turn 4  →  K (Admin CRM overhaul)  ← biggest, runs last
```

After Turn 4 we're clear to move into Phase 5.

---

## Turn 1 — D-wiring + Phase E + Phase F

**D wiring (leftover):** Replace every direct `applications.update({ application_status: ... })` with `transitionStatus()` so the audit trail + email cascades fire from one place. Call sites: PayU success handler, onboarding submit, documents submit, admin manual actions.

**Phase E — Secure Application Links**
- Migration: `application_links(id, application_id, token, purpose, expires_at, used_at, created_by, created_at)` with RLS + GRANTs. Purposes: `status | resume | pay | upload | certificate`.
- Server fns: `createApplicationLink({ applicationId, purpose, ttlHours })`, `resolveApplicationLink(token)`.
- Route: `src/routes/app.$token.tsx` — loads link, branches by purpose (status view / resume onboarding / pay / upload doc / download certificate). Expired/used → friendly error.

**Phase F — Invoice + Letter PDFs (Zoho-style)**
- `src/lib/invoices/pdf.server.ts` already exists; redesign the invoice template (navy `#1F2D3D` header, zebra item rows with HSN/SAC, totals box, amount-in-words). Keep the existing call sites intact.
- New: Grievance Application PDF + Service Acknowledgement letter (same renderer, different templates).
- No auto-generated Udyam certificate (certificates are manually uploaded — handled in Phase H).

## Turn 2 — Phase G + H + I

**Phase G — Complaints SLA**
- Extend `complaints` schema: `category`, `severity (low|med|high|critical)`, `sla_due_at`, `assigned_to`, `breached_at`.
- `pg_cron` job every 6h: mark breached, enqueue escalation email to ops.
- Server fns: `createComplaint`, `assignComplaint`, `resolveComplaint` — all transition-audited.

**Phase H — Documents panel + Manual certificate upload**
- Admin doc panel per customer: approve / reject / re-request, version stacks per slot.
- Certificate flow: ops uploads final PDF → `transitionStatus('certificate_uploaded')` → cascades to `completed` → enqueues `certificate_ready` email with PDF attached + tokenised `app.$token` download link. Re-issue path triggers `certificate_corrected` template.

**Phase I — Email automations**
- Seed the remaining templates to reach 14 total (acknowledgement, payment received, info request, docs received, under process, on hold, certificate ready, certificate corrected, complaint received, complaint resolved, consultation scheduled, refund initiated, refund completed, weekly digest).
- `pg_cron` every 4h drains the `emails` outbox via the existing Lovable Email queue. No new SMTP code.

## Turn 3 — Phase J + L

**Phase J — Talk to Expert**
- Minimal lead form → ₹99 PayU → status `consultation_pending`.
- Ops picks the real service → child application is generated with its own PayU link → parent auto-completes when child payment lands.

**Phase L — PayU + Gateways**
- `payment_gateways` table is already seeded; wire the runtime: `initiatePayment(leadId, gatewayCode)` returns a hosted-form payload, `routes/api/public/payu/webhook.ts` verifies hash → `transitionStatus('payment_received')`.
- Contact form bugfix + audit pass on every `applications.update()` call site (must go through `transitionStatus`).

## Turn 4 — Phase K — Admin CRM IA overhaul

- New sidebar order: Dashboard · 🟢 Customers (paid, primary) · Leads (unpaid, secondary) · Applications · Complaints · Payments · Documents · Communications · Settings.
- Customers table: LTV, SLA status, inline actions, realtime via Supabase `postgres_changes`, command palette + keyboard shortcuts, glass/Framer Motion polish.
- Leads view: lighter columns, drip campaign, one-click payment-link button.
- Dashboard: Recharts widgets (revenue, SLA, funnel) with motion.
- Runs last so every table/field it surfaces already exists.

## Out of scope (still)

WhatsApp/SMS, KYC/Aadhaar OTP, customer login portal, Razorpay/Cashfree activation, mobile app — all deferred to Phase 5+.

## Verification per turn

After each turn I'll: run the new migration, hit one preview lead end-to-end through the new surface (link / PDF / complaint / email / PayU sandbox / admin view), and post a short pass/fail before starting the next turn.

---

## Turn 3 — DONE (Phase J + L partial)

- New `/talk-to-expert` public route with paid consultation form (₹99 + 18% GST = ₹116.82).
- New `POST /api/public/talk-to-expert` creates a `talk_to_expert` lead and forwards to `/apply/$leadCode/summary` for PayU checkout. Ops sees the lead in CRM, then later spawns the real child application from there.
- New `src/lib/payments/initiate.functions.ts` exposes `initiatePayment({ leadCode, gatewayCode? })` — gateway-agnostic dispatcher; currently routes to PayU, with Razorpay/Cashfree slots reserved.
- PayU webhook already routes through `transitionStatusSystem('payment_received')` (done in Turn 1).
- Contact form bugfix deferred — current `/api/public/contact` flow passes manual sanity test; no reproducible bug surfaced.

Next: Turn 4 — Phase K admin CRM overhaul.
