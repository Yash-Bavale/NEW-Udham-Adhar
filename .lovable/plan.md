# Revised Master Plan — Phases C through L

Built on Phase A+B foundation (DB tables + dynamic form engine already live). Centered on your real workflow: **paid customers are the business; leads are a pipeline to convert.** Admin panel reshaped accordingly — Customers (paid) is the primary surface, Leads (unpaid) is the secondary surface.

---

## Phase C — NIC 2008 Code Picker

**Goal:** Searchable NIC code field for Udyam forms.

- Seed `nic_codes` table from the dataset you'll provide (CSV/JSON). Batched inserts via `supabase--insert`, 500 rows per batch.
- `pg_trgm` GIN index on `description` + `keywords` for sub-100ms fuzzy search.
- Server fn `searchNicCodes({ q, limit })` → ranked by `similarity()` with exact-code-prefix boost.
- New form field type `nic_code` (single) and `nic_codes_multi` (array, up to 10). Combobox UI with debounced search, shows `code — description` and the activity_type (Manufacturing / Services / Trading).
- Wire into `new_udyam` and `update_udyam` schemas in `service_form_schemas`.

---

## Phase D — Workflow & Status Engine

**Goal:** Every status change goes through one guarded function with side effects.

- Extend `application_status` enum: `awaiting_payment, payment_received, details_pending, details_submitted, documents_pending, documents_verified, under_process_govt, certificate_uploaded, completed, on_hold, rejected, cancelled, refunded`.
- `transitionStatus({ applicationId, toStatus, reason?, actorId })` server fn:
  - Reads `service_workflows.application_statuses` JSON, validates edge `from → to`.
  - Writes `activity_logs` row with old → new.
  - Fires queued side effects: enqueue email (Phase I), assign next role, set SLA timer (Phase G).
- Auto-transitions wired into existing code:
  - PayU webhook success → `awaiting_payment → payment_received → details_pending`.
  - Onboarding form submit → `details_pending → details_submitted` → if all required docs uploaded → `documents_pending → documents_verified` after ops approval.
  - Ops marks "Filed on Govt Portal" → `under_process_govt`.
  - **Certificate upload** (manual, Phase H) → `under_process_govt → certificate_uploaded → completed`.
- Replaces all direct `applications.update({ application_status })` calls across `payu.server.ts`, `onboarding.functions.ts`, admin routes.

---

## Phase E — Dynamic Application Links

**Goal:** Tokenized customer-facing links (no login needed).

- Server fns in `src/lib/links/links.functions.ts`:
  - `createApplicationLink({ applicationId, purpose: 'resume'|'status'|'pay'|'upload'|'certificate', expiresInDays })`.
  - `resolveApplicationLink({ token })` → returns app + lead + current step + last status update.
- Public route `src/routes/app.$token.tsx` (SSR-safe):
  - **status** purpose → live timeline (Phase K-style animated), download invoice + certificate.
  - **resume** → renders the dynamic form for the current step.
  - **pay** → PayU retry button.
  - **upload** → DocumentUploader for pending docs.
- All transactional emails (Phase I) reference `https://udyamadhar.everythinghappens.in/app/{token}`.
- Admin: "Copy customer link" button in customer drawer.

---

## Phase F — PDF Generator (REVISED — narrow scope)

**Removed:** Udyam certificate auto-generation (you upload it manually after govt issues it).

**Build only:**
1. **Zoho-style Tax Invoice redesign** — rewrite `src/lib/invoices/pdf.server.ts`:
   - Logo top-left, "TAX INVOICE" + number top-right.
   - Invoice Date | Due Date | Terms metadata row.
   - Bill To (left) + Place of Supply (right) two-column block.
   - Itemized table: `# | Item & Description | SAC (998311) | Qty | Rate | CGST/SGST/IGST % & amount | Amount`.
   - Right-aligned totals box: Sub Total → CGST → SGST → IGST → Total ₹ → **Total in Words** (Indian format).
   - Notes + Terms & Conditions block.
   - "Authorized Signatory" right-bottom.
   - Navy header band `#1F2D3D`, Inter-style font (Helvetica with proper weights), zebra rows, accent line under totals.
2. **Grievance Application PDF** — Handlebars template from `pdf_templates.code='grievance_application'`, used by Phase G.
3. **Service Acknowledgement letter** — short PDF emailed after payment confirmation as proof of engagement.

`renderPdfFromTemplate(templateCode, data)` server fn → `pdf-lib` rendering → stored in `documents` bucket → `documents` row inserted with `doc_type='generated_*'`.

---

## Phase G — Complaint / Grievance Tracking

**Goal:** First-class grievance lifecycle, separate from application status.

- `complaints` table already created (Phase A). Add `category`, `severity`, `sla_due_at`, `assigned_to` via small migration.
- Customer raises via:
  - Contact form (new `/raise-complaint.tsx` route).
  - Inside `app.$token.tsx` status view → "Raise issue" button.
- Auto-flow:
  - Complaint number `CMP-2026-000001` via sequence.
  - Round-robin assign to `support` role.
  - SLA: 24h default per category, stored in `sla_due_at`.
  - Generate Grievance Application PDF (Phase F #2) attached to customer.
  - Email customer acknowledgement with complaint number + link.
- `pg_cron` every 6h: scan breaching complaints → escalate to admin, send reminder, increment `reminder_count`.
- Admin "Complaints" tab with status board (Open / In Progress / Resolved / Closed) and SLA breach counter.

---

## Phase H — Document Management + Certificate Upload (REVISED)

**Goal:** Verified document pipeline AND manual certificate upload that closes the loop.

**Document verification:**
- `documents` table already extended (Phase A: `version`, `parent_document_id`, `verification_comment`).
- Admin doc panel per customer:
  - List required docs from `service_form_schemas.documents`.
  - Each card: preview thumbnail, status pill (pending/approved/rejected), Approve / Reject (with reason) buttons.
  - Reject → triggers email template `document_rejected` → customer re-uploads → new version with `parent_document_id` → previous version archived but visible.
  - All required docs approved → application auto-moves to `documents_verified`.

**Certificate upload flow (your workflow):**
- New tab "Certificate" inside customer detail drawer.
- Visible when status = `under_process_govt`.
- **Upload Certificate** dropzone:
  - Accepts PDF / JPG / PNG up to 10MB.
  - Field: certificate number (Udyam Registration Number).
  - Optional field: issue date.
  - Stored in `certificates` table + `documents` bucket under `applications/{id}/certificate/`.
  - Trigger: `transitionStatus(applicationId, 'certificate_uploaded')` → auto cascades to `completed`.
  - Side effect: enqueues `certificate_ready` email (template #8) WITH certificate as attachment + secure download link via `app.$token` (purpose=`certificate`).
- Customer download: anytime via tokenized link, no expiry on certificate.
- Re-issue support: admin can upload a "v2" if the customer reports an error → bumps `version`, sends `certificate_corrected` email.

---

## Phase I — Email Automation

**Goal:** All emails template-driven through existing Lovable Email queue (`enqueue_email` RPC).

- Seed `email_templates` table (already exists) with 14 templates:
  1. `lead_received` — instant after lead form submit
  2. `payment_confirmation` — with invoice PDF
  3. `payment_failed` — with retry link
  4. `service_acknowledgement` — formal letter PDF
  5. `details_pending_reminder` — 24h after payment if form not started
  6. `details_pending_followup` — 72h, 7d
  7. `documents_pending_reminder` — 48h after form submit
  8. `document_rejected` — with reason + re-upload link
  9. `documents_verified` — "your application is being filed"
  10. `filed_on_govt_portal` — "we have submitted to MSME portal"
  11. `certificate_ready` — with certificate PDF attached + download link
  12. `complaint_received` — acknowledgement + complaint number
  13. `complaint_resolved` — with resolution notes
  14. `welcome_otp` — for tokenized portal future passwordless access

- Each template has admin edit UI (rich text editor with `{{variable}}` chips).
- `pg_cron` every 4h: scan for stuck steps, enqueue reminders, respect `reminder_count` caps.
- All email events logged in `email_logs` for audit + delivery tracking.

---

## Phase J — Talk to Expert Workflow

**Goal:** Consultation service that converts into a regular service application.

- Customer flow: minimal "describe your need" form → pays consultation fee (₹99) → app status `consultation_pending`.
- Auto-assigned to `support` role; SLA: callback within 4h.
- Ops opens customer drawer → **"Convert to Service"** action:
  - Picks recommended service from 6 options.
  - Pre-fills lead amount (with optional consultation fee credit).
  - Generates child application (`parent_application_id` FK on applications).
  - Auto-generates PayU payment link, queues `recommendation_with_payment_link` email.
- Child app pays → parent `talk_to_expert` app auto-transitions to `completed`.
- Child app continues through its own workflow normally.

---

## Phase K — Advanced CRM Admin Panel (MAJOR — your priority)

**Goal:** Reshape admin into a CRM where **paid Customers are the primary surface** and Leads are secondary pipeline.

### New IA (Information Architecture)

```
Sidebar:
├── Dashboard            ← KPIs, revenue today, pending actions
├── 🟢 Customers (paid)  ← PRIMARY: every paying customer, full 360° view
├── Leads (unpaid)       ← Secondary: pre-payment pipeline
├── Applications         ← All in-progress work (filtered by stage)
├── Complaints           ← SLA board
├── Payments & Invoices  ← Finance view
├── Documents Center     ← Verification queue
├── Communications       ← Email log, template editor
├── Settings
│   ├── Services & Pricing
│   ├── Form Schemas        ← Edit dynamic forms without redeploy
│   ├── Workflows           ← Edit status pipelines
│   ├── Email Templates
│   ├── PDF Templates
│   ├── NIC Codes
│   ├── Payment Gateways
│   ├── Users & Roles
│   └── Branding
```

### Customers (Paid) — the new primary view

The flagship CRM screen.

**List view:**
- Default filter: `payment_status = paid` (i.e. has at least one successful payment).
- Premium SaaS table (TanStack Table):
  - Avatar + Name + Customer Code (CUS-2026-XXXXXX, derived from first lead_code).
  - Service(s) — pill stack.
  - Application status — animated pill with current stage.
  - Lifetime Value (LTV) — sum of all paid invoices.
  - Last Activity — relative time, color-coded.
  - Assigned Ops — avatar.
  - SLA status — green/amber/red dot.
  - Inline actions: View | Send Email | Generate Link | Upload Certificate | Add Note.
- Column visibility, faceted filters (service, status, state, assignee, date range), multi-sort, saved views per user, bulk actions (assign, status change, email blast).
- Realtime: Supabase `postgres_changes` on `leads`, `applications`, `payments` → live counters, toast on new payment.

**Customer detail drawer (right-side, 60% width, glassmorphism):**
Tabbed CRM panel:
1. **Overview** — Hero card: name, contact, total spend, services count, current status. Quick-action row.
2. **Timeline** — Vertical activity feed from `activity_logs` (lead created, payment, form submitted, doc approved, status change, email sent, complaint, note). Icons per event, grouped by day, with framer-motion stagger.
3. **Applications** — Every app of this customer, expandable cards showing form data, current step, assignee, SLA.
4. **Documents** — All uploaded docs with version stacks, approve/reject inline.
5. **Certificate** — Upload + view delivered certificates (Phase H flow).
6. **Payments & Invoices** — Every transaction, refund actions, regenerate invoice, signed download URLs.
7. **Communications** — Every email sent/received, send manual email from any template, log calls/WhatsApp notes.
8. **Complaints** — All open + closed complaints.
9. **Notes** — Internal-only notes thread for ops.
10. **Files** — Free-form file shelf for misc attachments.

### Leads (Unpaid) — secondary

- Default filter: no successful payment yet (status in `lead_created, follow_up_*, payment_pending, payment_failed`).
- Same table component but lighter columns: Name, Mobile, Service, Last Touch, Source, Assignee, Days Stuck.
- Bulk actions: assign, drip campaign, mark lost.
- One-click "Generate Payment Link" → sends payment link via email + WhatsApp.

### Applications view — operational filter

Cross-cuts both customers and leads. Defaults: filter by current step (Pending Form / Pending Docs / Under Review / Govt Portal / Certificate Pending). Kanban toggle option.

### Dashboard widgets (Recharts + framer-motion)

- Revenue today / MTD / YTD with sparkline.
- Conversion funnel: Lead → Payment → Form → Docs → Certificate.
- SLA breach counter (live).
- Assignee leaderboard with completion rate.
- Service-mix pie.
- Pending actions queue ("12 docs to verify, 5 certificates to upload, 3 complaints breaching").

### Premium UX layer

- **Glassmorphism** — `bg-card/60 backdrop-blur-xl border-white/10` on cards, drawers.
- **Framer Motion** — page transitions (fade+slide), list stagger via `AnimatePresence`, drawer slide-in, status-pill flip on change.
- **Realtime** — Supabase subscriptions on key tables → live counters, badge animations, toast notifications.
- **Command palette** (`Cmd+K`) — jump to any customer/lead/complaint by code/name/email/mobile. Quick actions: assign, transition status, send template, upload doc.
- **Keyboard shortcuts** — `n` new lead, `c` copy link, `e` send email, `s` change status.
- **Skeleton loaders + optimistic updates** everywhere.
- **Dark mode polished** (CRM ops work long hours).
- **Mobile-responsive admin** — drawer becomes full sheet on small screens.

---

## Phase L — Bug Fixes + Multi-Gateway Foundation

**Bug fixes:**
- Contact form server fn currently throws generic error → wire to `leads` insert with `lead_source='contact_form'` + enqueue `complaint_received` template.
- Verify PayU success→failed bug (fixed in earlier turn) with end-to-end test transaction logged.
- Audit all direct `applications.update({ status })` calls → replace with `transitionStatus()`.

**Multi-gateway foundation (no second provider activated):**
- `payment_gateways` table already exists. Seed PayU as enabled + default.
- `initiatePayment({ applicationId, gatewayCode })` server fn — switch by gateway code → currently only routes to PayU. Razorpay / Cashfree stubs left as TODOs (commented entry points).
- Admin "Payment Gateways" settings UI — toggle enable/disable, set priority, edit display name.
- Webhook routes scaffolded per gateway under `/api/public/webhooks/{gateway}.ts`.

---

## Sequencing & Dependencies

```
C (NIC)  →  needed for D (forms use NIC codes for transitions)
D (workflow)  →  foundation for E, G, H, I
E (links)  →  needed in I email templates
F (PDF)  →  needed for G (grievance PDF) + invoice upgrade
G (complaints)  →  depends on D + F
H (docs + certificate)  →  depends on D + I
I (emails)  →  depends on D + E + F (for attachments)
J (talk to expert)  →  depends on D + E + I
K (admin CRM)  →  mostly frontend, depends on all data tables existing
L (bugfixes + gateways)  →  depends on D for status transitions
```

**Execution order:** C → D → E → F → G → H → I → J → L → K (K last because it consumes everything).

Each phase = one migration + one batch of code edits.

---

## Out of scope (explicitly excluded)

- Real WhatsApp API integration (only deep links generated).
- SMS sending (email + WhatsApp link only).
- KYC / Aadhaar OTP verification.
- Mobile app (admin responsive web is enough).
- Customer login portal (tokenized links replace passwords for now).
- Razorpay / Cashfree activation (foundation only, you activate later).

---

## Next action after approval

I'll start **Phase C** and need the **NIC 2008 dataset** from you (CSV or JSON with columns: code, description, section, division, group, class). Drop it as an upload and I'll seed + index it in one go.

Then Phases D → L are mine to execute sequentially. Each phase ends with a verification step before the next migration.
