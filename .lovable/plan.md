
# Backend Architecture Audit — Udyam Ops OS

Read-only audit based on the live database (38 tables, ~5.7k leads, ~5.7k applications, ~4.1k customers, 7 services) and the `src/lib/crm/*.functions.ts` server layer. No file changes proposed in this plan; intent is to agree on what to refactor before more UI work.

---

## Deliverable 1 — Entity Relationship Diagram

Tables exist and `*_id` columns exist, but **the database has zero declared `FOREIGN KEY` constraints** (verified via `information_schema.table_constraints`). Every relationship below is *implicit* — enforced only by application code, not by Postgres.

```text
                        ┌────────────────┐
                        │   customers    │ (4,089)
                        │  customer_code │
                        └───┬────────┬───┘
                            │1       │1
                           *│       *│
                    ┌───────▼──┐  ┌──▼──────────┐
                    │  leads   │  │ applications│
                    │  (5,691) │1─*│   (5,683)  │
                    │ lead_code│  │ app_code    │
                    └──┬─┬─┬───┘  └─┬─┬─┬─┬─┬─┬─┘
                       │ │ │        │ │ │ │ │ │
       lead_notes  ◄───┘ │ │        │ │ │ │ │ └──► certificates (1)
       lead_source       │ │        │ │ │ │ └────► complaints (4)
                         │ │        │ │ │ └──────► documents (29)
                         │ │        │ │ └────────► onboarding_submissions (30)
                         │ │        │ └──────────► application_status_history (0)
                         │ │        └────────────► application_links (0)
                         │ │
                         │ └──► email_queue / email_logs / activity_logs
                         └────► payments (7) ──► invoices (29) ──► payment_settlements (0)
                                                                  gateway_settlements (0)

   services (7) ──┬──► service_form_schemas  (jsonb form definition, v1)
                  ├──► service_workflows     (jsonb status list, not an engine)
                  └──► (referenced by leads.service_id, applications.service_id)

   auth.users ──► profiles (1:1)  ──► user_roles (1:N, app_role enum)
                                      ▲
                                      └── no teams, no permissions table, no task table
```

Cardinalities (as implemented):

- customer **1—N** leads, **1—N** applications, **1—N** invoices, **1—N** certificates
- lead **1—1** application (in practice — 5,691 vs 5,683), **1—N** payments, **1—N** documents
- application **1—N** payments, **1—N** documents, **1—N** complaints, **1—1** certificate (no uniqueness enforced), **1—N** onboarding_submissions
- service **1—N** leads/applications, **1—N** form_schemas (versioned), **1—1** workflow
- user **N—N** roles via `user_roles` (no team, no per-resource permission)
- No M:N anywhere — no `application_services`, no `customer_services`, no `task_assignees`, no `role_permissions`.

**Missing entities entirely**: `tasks`, `teams`, `permissions`, `role_permissions`, `service_versions`, `application_services` (line-items), `refunds` (refunds are child `payments` rows by convention), `communications` (only emails are logged; no calls/WhatsApp/SMS).

---

## Deliverable 2 — Customer Architecture

Current flow when an existing customer buys another service (traced through `find_or_create_customer` SQL function + `leads-admin.functions.ts` + `applications.functions.ts`):

```text
public lead form / admin "Add Lead"
        │
        ▼
find_or_create_customer(name,email,mobile,state)   ← matches on mobile, then email
        │
        ▼  customer_id (existing or new)
INSERT leads (customer_id, service_id, …)          ← always a NEW lead row
        │
        ▼
admin converts → INSERT applications (lead_id, customer_id, service_id)
        │
        ▼
payment link (CCAvenue/PayU) → INSERT payments (lead_id, application_id, customer_id)
        │
        ▼ webhook on "paid"
generateInvoiceInternal() → INSERT invoices (lead_id, application_id, payment_id, customer_id)
```

What this means in practice:

- A returning customer **always** creates a new `lead` + new `application`. Customer is deduped by mobile/email.
- `customers.total_applications / completed_applications / pending_applications / lifetime_value` columns exist but **are never updated** by any trigger or server fn (grep confirms). They are dead counters.
- `customers.last_service_id` is set on initial create, never refreshed.
- There is no "customer portal" entity tying multiple applications together — the join is only via `customer_id`.

This works, but the customer record is effectively a deduped contact card, not a true customer master.

---

## Deliverable 3 — Application Architecture

Application is *intended* to be the central object and the schema supports it, but several relations are weak:

```text
applications
├── customer_id          ✓ set on create
├── lead_id              ✓ set on create (1:1 in practice)
├── service_id           ✓ but service_code is duplicated on leads.service (text)
├── application_status   ✓ enum (19 values — too many, see D9)
├── form_status          ✗ free text, not enum, not validated
├── document_status      ✗ free text, not enum, not validated
├── assigned_to          ✓ → auth.users (no team, single assignee only)
├── closure_stage        ✓ enum
└── (no priority, no due_date, no sla, no value, no expected_close)
```

Child collections all join on `application_id` **and** `lead_id` (denormalised dual key). This is convenient but means deleting/merging a lead or moving an app to a different lead is unsafe — there is no FK and no cascade.

Timeline is reconstructed at read-time by `getOrderNotes` (merges `activity_logs` + `lead_notes`). There is no single `application_events` stream and `application_status_history` is **empty (0 rows)** despite being defined — nothing writes to it. The real status trail lives only in `activity_logs` via the `log_application_activity` trigger.

---

## Deliverable 4 — Service Engine

`services` (7 rows) — flat catalog: code, name, base/gst/total amount, sort_order, is_active.

`service_form_schemas` (7 rows, one per service):

- `schema jsonb` — sections + fields + validations stored as JSON
- `documents jsonb` — required document list
- `version int`, `is_active bool` — versioning column exists, **never bumped** (all rows v1)
- No row-level audit of edits
- Validations are JSON Schema-ish but enforced **only client-side** in `OnboardingForm.tsx`; server fn `submitOnboarding` does shallow validation

`service_workflows` (7 rows):

- `application_statuses jsonb` — array of allowed status strings per service
- `default_assignee_role` — text (not enum)
- **Not a state machine** — no allowed transitions, no guards, no entry/exit actions

Emails are linked by **convention only** — code does `enqueue_email('welcome_mail', …)`; nothing in the DB ties `email_templates.code` to a service or a status. `workflow_settings` is a *single global row* with `step1/step2/step3` reminder template codes — same for all services.

Verdict: forms are data-driven (good); workflows are essentially hard-coded.

---

## Deliverable 5 — Workflow Engine

What exists:

- `application_status` enum with 19 values (overlaps heavily with `lead_status`'s 12 values)
- `applications.application_status` column
- `application_status_history` table — **0 rows, never written**
- `src/lib/crm/status-engine.ts` — TypeScript constant defining allowed transitions; runs client-side and in a few server fns. Not in DB.
- `service_workflows.application_statuses` jsonb — read but not enforced

What does not exist:

- DB-level transition guards (no trigger checks old→new)
- Per-service transitions (engine is global)
- Admin UI to author workflows (page exists but writes to `service_workflows.application_statuses` only)
- Entry/exit hooks, conditions, parallel branches, SLAs, escalations

A status change today: server fn updates `applications.application_status` → trigger writes to `activity_logs` (free text) → UI reads activity_logs. The "engine" is just an UPDATE.

---

## Deliverable 6 — Task Engine

**No tasks table exists.** Searched: `tasks`, `assignments`, `work_items`, `todo` — none present.

What's currently used as a task substitute:

- `applications.assigned_to` — single user
- `applications.application_status` — drives "what to do next" implicitly
- `complaints` — has `assigned_to`, `sla_due_at`, `severity` (closest thing to a task)
- "My Work" page (`my-work.functions.ts`) — synthesises a task list by querying applications where `assigned_to = me AND status IN (…)`

Consequence: no task can exist independent of an application (e.g. "call this lead back tomorrow"), no multi-assignee, no due dates on applications, no checklists, no task templates per service, no team queues.

---

## Deliverable 7 — Finance Engine

```text
payments (7)
├── gateway_name (ccavenue|payu|razorpay-legacy)
├── base_amount + gst_amount = amount        ← captured at payment time
├── parent_payment_id  ← refunds are child rows with negative amount
├── status enum: created|attempted|paid|failed|refunded
└── application_id, lead_id, customer_id (denormalised)
        │
        ▼  on webhook 'paid'
invoices (29)
├── invoice_number (sequence: INV-YYYY-000001)
├── place_of_supply  → cgst/sgst/igst split (intra vs inter state)
├── pdf_path → invoices storage bucket
└── 1 invoice per payment (no consolidated invoice, no credit note)
        │
        ▼  manual import (not wired)
gateway_settlements (0 rows)  ── M:N via ── payment_settlements (0 rows)
```

Observations:

- Revenue math (`revenueStats`) is computed live from `payments WHERE status='paid'`. No materialised view; with 100k payments this becomes slow.
- Refunds are modelled as child `payments` rows (negative amount). Works but reports must `SUM(amount)` including negatives — easy to get wrong; there is no `refunds` view.
- GST split is computed at PDF render time using `COMPANY_STATE` env. If the company state changes, historical invoices renderer changes too — **not pinned per invoice**.
- No credit notes, no proforma, no partial-payment schedule, no multi-currency (currency column exists but always INR).
- Settlements tables exist but are empty and unused.

---

## Deliverable 8 — Permission System

```text
user_roles (user_id, role app_role)
  app_role enum = {admin, super_admin, operations, support, accounts, finance}
                              │
                              ▼
              has_role(uid, role)  /  current_user_is_admin()
                              │
                              ▼
       RLS policies on each table check (role1 OR role2 OR …)
```

- **Role-based only** — no permission table, no per-resource ACL, no per-team scoping.
- Every staff role can read every customer/lead/application (no "assigned-to-me" filter in RLS). Sales rep can read all 5,691 leads.
- API protection = `assertRole()` inside server fns + RLS. Belt-and-braces, but the role lists are hardcoded into ~40 files; adding a role requires touching all of them.
- Page visibility is enforced in `admin.tsx` route by checking roles client-side; route gate exists but UI inside a page is not role-aware (e.g. finance can see admin buttons that 403 on click).
- `bootstrap_first_admin` trigger auto-grants `admin` to the first signup — fine for setup, must be confirmed removed before scale-out.
- No audit on role grants (`user_roles` inserts/updates not in `audit_logs`).

---

## Deliverable 9 — Current Technical Debt (brutally honest)

**Data integrity**

1. **Zero foreign key constraints in the entire public schema.** Orphan rows are inevitable at scale; cascades are impossible. This is the single biggest issue.
2. `applications.form_status` and `document_status` are free text — drift guaranteed.
3. Dual keys (`lead_id` + `application_id` + `customer_id`) on payments/documents/invoices — must be kept in sync by app code; no constraint.
4. `customers` aggregate counters (`total_applications`, `lifetime_value`, etc.) are never updated — actively misleading.
5. `application_status_history` table exists, code never inserts. Status trail lives in `activity_logs` (text). Auditability is weak.

**Schema design**

6. `application_status` enum has 19 values mixing payment, document, ops, refund, consultation stages — should be split into `payment_status` + `fulfilment_status` + `closure_stage`.
7. `lead_status` (12 values) overlaps with `application_status` (19) — same concepts named differently.
8. `payments.razorpay_order_id/razorpay_payment_id/razorpay_signature` columns are used for CCAvenue/PayU too. Misleading; should be `gateway_order_id` etc.
9. Service catalog is flat — no versioning of pricing (changing `base_amount` rewrites history of what a customer "should have paid").
10. No `tasks`, `teams`, `task_templates`. Ops cannot delegate sub-work or run a queue.

**Workflow**

11. Workflow engine is hardcoded in TypeScript; admin UI says it's configurable but only stores a status list.
12. No SLA tracking on applications (only on complaints).
13. Email cadence (`workflow_settings`) is a single global row — cannot vary per service or per status.

**Performance / scalability**

14. `revenueStats` does full table scan of `payments`. At 100k rows still OK; combined with several similar scans on every dashboard load, it will bite.
15. `activity_logs` (already 11.4k rows for 5.7k leads) is queried by `getOrderNotes` with no pagination beyond a hard limit. No index on `(lead_id, created_at desc)` declared (none would be visible without indexes query, but worth confirming).
16. `getDashboardMetrics` SQL function aggregates over the full `leads` and `applications` tables every call. No caching.
17. Client-side filtering of leads/orders — `admin.leads.tsx` filters in JS after fetching first page. Won't scale.

**Security**

18. RLS treats every staff role as fully privileged readers across all PII. No "least privilege" — a `support` user can read every lead's email & mobile.
19. `assertRole` is duplicated in ~40 server fns with slightly different role lists. Inconsistencies are very likely; one omission = privilege escalation.
20. Service role key writes (`supabaseAdmin`) bypass RLS — used in many `*.functions.ts`. Each such use needs a manual auth check; coverage is inconsistent.
21. No row-level audit on role grants.
22. Webhooks (`ccavenue`, `payu`) verify signatures (good) but no replay protection beyond `idempotency_key` on `payments`.

**Operational**

23. Settlement tables exist but unused — finance reconciliation is manual.
24. No event bus / outbox — emails enqueued via PGMQ but no general domain-event stream, so analytics, search indexing, and CRM integrations have nothing to subscribe to.
25. No soft-delete on leads/applications/customers — `DELETE` is destructive.

---

## Deliverable 10 — Redesign Plan

**Keep (works, well-modelled)**

- `customers` master + `find_or_create_customer` dedupe
- `service_form_schemas` JSON-schema-driven forms (versioned)
- `payments` + `invoices` + child-refund pattern, CCAvenue/PayU integrations
- `email_queue` + PGMQ + `email_send_log` + suppressions/unsubscribe — solid
- RLS-on-everything approach + `has_role` SECURITY DEFINER pattern
- `audit_logs` table shape (just needs more writers)

**Refactor**

- Split `application_status` enum → `payment_status` + `fulfilment_status` + `closure_stage` (latter already exists).
- Rewrite status transitions as a DB function `transition_application(app_id, new_status, reason)` that (a) validates against `service_workflows`, (b) writes `application_status_history`, (c) raises domain event. Remove client-side `status-engine.ts`.
- Rename `payments.razorpay_*` → `gateway_*`. Backward-compat view for old code.
- Move `assertRole` lists into one config map (`src/lib/auth/role-matrix.ts`) keyed by capability, not hardcoded per fn.
- Replace flat workflow_settings with per-service `service_email_cadences` (status × delay × template).

**Replace**

- "My Work" page synthesis → real `tasks` table (`id, application_id, type, assignee_id, due_at, status, payload`). Auto-generate from status transitions; allow manual.
- `customers.total_*` dead counters → SQL view or trigger-maintained aggregates.

**Delete**

- `workflow_settings` single-row table (move into per-service config).
- `email_send_state` single-row throttle table (move to Redis/edge KV or compute live).
- Unused `payment_settlements` table if `gateway_settlements` covers the use case.

**Merge**

- `lead_status` + `application_status` into a single, narrower lifecycle enum — leads become pre-application applications (status = `inquiry`).
- `activity_logs` + `application_status_history` + `lead_notes` + `customer_notes` → one `events` stream with `(entity_type, entity_id, kind, body, actor, created_at)`.

**Split**

- `applications` → `applications` (header) + `application_services` (line items) when one application can bundle multiple services.
- `documents` versioning → keep parent + version chain in `document_versions` child table (today versions share the same table).

**Add**

- `tasks`, `teams`, `team_members`, `task_templates`
- `permissions` + `role_permissions` (capability-based)
- `application_events` (domain-event outbox) + worker
- `service_pricing_versions` so historical invoices stay correct after price changes
- **All missing FK constraints** (with `ON DELETE RESTRICT` for parents like customer/service, `ON DELETE CASCADE` for child notes/events)
- Indexes on every `(entity_id, created_at desc)` log table

**Migration strategy**

1. Add FKs in audit-only mode: run `SELECT` queries to find existing orphans, fix data, then `ALTER TABLE … ADD CONSTRAINT NOT VALID` + `VALIDATE` per table in batches.
2. Introduce new tables (`tasks`, `permissions`, `application_events`, `service_pricing_versions`) alongside existing ones; dual-write from server fns for one release.
3. Backfill `application_status_history` from `activity_logs` regex.
4. Cut over reads to new tables; remove dual-write; drop dead columns/tables in a follow-up migration.
5. Status-enum split is the riskiest — do it last, behind a feature flag, with a view that exposes the legacy column.

---

## Final Question — Can this support 10k customers / 100k applications / 50 services / 100 employees / 5 years?

**NO.**

What will break first, in order:

1. **Around 20–30k applications**: dashboard + leads/orders pages get slow because filtering is client-side and aggregate queries are unindexed full scans.
2. **At ~50 services**: the global `workflow_settings` and hardcoded TypeScript status engine become unmaintainable; every service needs custom email cadence and transitions.
3. **At ~20 employees**: lack of a `tasks` table and team queues forces ops to coordinate in spreadsheets; assigned_to single-user-per-application is a bottleneck.
4. **At ~5 years of history**: no FKs means data quality has decayed; reporting is unreliable; GDPR/right-to-erasure is impossible to execute safely.
5. **At any scale, security**: every staff role reads every customer's PII — fails the first compliance audit.

**Minimum changes required before scaling** (not a rebuild, but non-negotiable):

- Add foreign keys + indexes (1–2 days, biggest single ROI)
- Introduce `tasks` and `application_events` tables
- Split `application_status` into payment/fulfilment/closure
- Move filtering & pagination server-side on leads/orders/dashboard
- Capability-based permissions + scope `support`/`finance` reads to assigned/own data
- Per-service workflow + email cadence configuration
- Write `application_status_history` for real and stop relying on free-text `activity_logs` for the status trail

Everything else from Deliverable 10 can be phased over subsequent quarters.
