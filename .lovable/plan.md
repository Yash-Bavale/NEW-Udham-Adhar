# System Overview Document — Plan

I'll generate a single markdown file at `/mnt/documents/system-overview.md` (downloadable) capturing the current state of the app so you can plan new flows, features, and changes against it.

## Discovery approach

Before writing, I'll audit these areas in parallel:

1. **Routes tree** — `src/routes/` (public site, admin, onboarding, api/public, auth)
2. **Admin workspace** — `src/components/admin/*` (shell, sidebar, dashboards, order workspace, panels, dialogs)
3. **Server functions** — `src/lib/crm/*.functions.ts`, `src/lib/applications/*`, `src/lib/payments/*`, `src/lib/emails/*`, `src/lib/finance/*`, `src/lib/onboarding/*`
4. **Stage/workflow engines** — `fulfillment-transitions.ts`, `lead-transitions.ts`, `status-engine.ts`, `computeOrderStage.ts`, `workflow-*.functions.ts`
5. **Roles & access** — `src/lib/roles.ts`, `useRole.ts`, `has_role` / `has_any_staff_role` RPCs
6. **Database** — table list already known (54 tables); I'll group them by domain
7. **Edge functions** — `supabase/functions/*` (only `delete-order-documents` exists)
8. **Public API routes** — `src/routes/api/public/*` (webhooks, cron, payment callbacks)
9. **Integrations** — Supabase, payment gateways (Razorpay, PayU, CCAvenue), SMTP (Zoho), Lovable AI

## Document structure

```
# Udyam Ops OS — System Overview

## 1. Executive Summary
   - Product purpose, stack (TanStack Start + Supabase + Cloudflare Worker)
   - Two audiences: public site visitors + internal CRM staff

## 2. Architecture
   - Frontend: TanStack Start SSR, file-based routes
   - Backend: createServerFn (app logic), server routes (webhooks/cron), 1 edge fn
   - Data: Supabase Postgres with RLS + user_roles
   - Auth: Supabase Auth (staff email/password)

## 3. Public Website (Customer-facing)
   - Route inventory (/, /about-us, /faqs, /services/*, /download-certificate, etc.)
   - Lead capture forms → leads table
   - Onboarding flow (/onboarding, /apply) → onboarding_submissions
   - Payment flows (/payment*, /processing, /success)
   - Complaint intake (/complaint)
   - SEO: sitemap.xml, robots.txt, JSON-LD, head metadata

## 4. Roles & Access Model
   - Roles: super_admin, admin, manager, executive, operations, support, accounts, finance
   - `has_role()` / `has_any_staff_role()` RPCs
   - Module access matrix from `roles.ts` (who sees what, money-hiding rules)

## 5. Admin Workspace
   - Shell layout (AdminShell, sidebar, command palette, keyboard shortcuts, notifications)
   - Role-based landing (`/admin` → dashboard/finance/my-work)
   - Sections:
     • Dashboard (Executive + Super Admin)
     • My Work (employee inbox)
     • Leads (list, detail, bulk ops, assignment, saved filters)
     • Orders/Applications (workspace, stages, documents, payments)
     • Customers
     • Complaints & Support Tickets
     • Tasks & Follow-ups
     • Finance (invoices, GST report, settlements, refunds)
     • Emails (templates, queue, logs, bulk send)
     • Settings (services, workflows, automation rules, reason library,
       assignment pool, SMTP, gateways, SEO pages/articles, users)
     • Activity Log & Audit Log

## 6. Lead Lifecycle
   - Sources → leads table
   - Statuses & transitions (`lead-transitions.ts`)
   - Auto-assignment (assignment_pool, round-robin config)
   - Conversion → order/application

## 7. Order / Fulfillment Workflow
   - Stages (from `fulfillment-transitions.ts`):
     order_received → documents_received → verification_pending →
     application_submitted → under_processing → completed (+ cancelled)
   - Allowed transitions map + gates (certificate upload for completion)
   - Cancellation & refund multi-stage workflow
   - External delay handling
   - Order workspace panels: journey, documents, payments, notes,
     workflow, closure, invoice history

## 8. Employee Flow (Executive / Manager / Support / Operations)
   - Landing on /admin/my-work
   - Assigned leads/orders queue
   - Actions: update status, upload docs, send emails, create tasks,
     add notes, request refunds, close orders
   - Money visibility rules per role

## 9. Payments
   - Gateways: Razorpay, PayU, CCAvenue (server + client functions)
   - Payment links, initiate, webhooks
   - Settlements + reconciliation
   - Refund request workflow (executive → admin approval)

## 10. Email System
   - Templates (email_templates table + registry)
   - Queue + send state + logs + suppression list
   - Providers: Zoho SMTP + generic SMTP
   - Unsubscribe tokens
   - Bulk email dialog

## 11. Documents & Certificates
   - Uploads to Supabase storage
   - Document review workflow
   - Certificate generation & delivery

## 12. Automation & Workflow Engine
   - workflow_automation_rules
   - workflow_reminders (SLA/follow-up)
   - workflow_closure_reasons, workflow_delay_reasons
   - Cron endpoint: /api/public/cron/closure-workflow

## 13. Public API & Webhooks
   - Inventory of /api/public/* routes
   - Payment gateway webhooks
   - Cron endpoints

## 14. Edge Functions
   - `delete-order-documents` (the only one — storage cleanup)
   - Note: everything else is TanStack server functions, not edge fns

## 15. Database Schema (grouped)
   - Identity: profiles, user_roles
   - CRM: leads, customers, applications, complaints, tasks, follow_ups
   - Fulfillment: documents, certificates, application_events,
     application_status_history, application_links
   - Finance: invoices, invoice_events, payments, payment_links,
     payment_settlements, refund_requests, gateway_settlements
   - Email: email_templates, email_queue, email_logs, email_send_log,
     email_send_state, email_unsubscribe_tokens, suppressed_emails
   - Workflow: workflow_settings, workflow_automation_rules,
     workflow_reminders, workflow_events, workflow_closure_reasons,
     workflow_delay_reasons, service_workflows
   - Config: services, service_form_schemas, payment_gateways, smtp_settings,
     nic_codes, pdf_templates, assignment_pool, lead_assignment_config
   - Content/SEO: seo_pages
   - Audit: audit_log, audit_logs, activity_logs, analytics_events,
     webhook_error_log
   - Support: support_tickets, ticket_replies, notifications
   - Notes: lead_notes, customer_notes, saved_lead_filters,
     onboarding_submissions

## 16. Integrations
   - Supabase (DB, Auth, Storage, Realtime)
   - Lovable AI Gateway (if used)
   - Payment gateways
   - Zoho SMTP

## 17. Known Constraints & Conventions
   - Realtime channels prefixed `user:<auth.uid()>:...`
   - RLS on all public tables
   - Role storage in user_roles only (never on profiles)
   - Admin subtree uses `ssr: false`
   - Public routes must be SSR + shareable head metadata

## 18. Suggested Areas for New Flows / Improvements
   - (placeholder section for you to fill in)
```

## Deliverable

- File: `/mnt/documents/system-overview.md`
- Emitted as `<presentation-artifact>` so you can download/preview immediately
- No code changes to the project

Shall I proceed?
