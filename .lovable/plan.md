# Client Presentation: Architecture & Web Flow

I'll generate a polished `.pptx` deck (delivered to `/mnt/documents/`) that you can send directly to the client. No code changes — this is a document artifact.

## Deck outline (~18 slides)

1. **Cover** — Project name, tagline, date, prepared-for client
2. **Executive Summary** — What the platform does, business goal
3. **High-Level Architecture** — Frontend, Backend (Lovable Cloud), Payments (PayU), Email (SMTP), Admin CRM — block diagram
4. **Technology Stack** — TanStack Start, React 19, Tailwind v4, Postgres, Edge runtime, PayU, Resend/SMTP
5. **User-Facing Web Flow** — Landing → Service selection → Lead form → Payment → Onboarding form → Document upload → Status tracking
6. **Lead Capture Flow** — Form fields, validation, dedup (count duplicates, don't block reuse of email/mobile)
7. **Payment Flow (PayU)** — Hosted checkout sequence, hash signing, success/failure callbacks, test vs live mode
8. **Post-Payment Flow** — Application creation, invoice generation, confirmation email, onboarding form trigger
9. **Onboarding & Document Flow** — Service-specific forms, document upload, verification states
10. **Admin / CRM Panel** — Dashboard, Leads, Applications, Payments, Documents, Emails, Settings
11. **Roles & Permissions** — super_admin, operations, support, accounts, finance + RLS model
12. **Database Schema (key tables)** — leads, applications, payments, invoices, documents, services, user_roles, email_queue
13. **Email System** — Templates, queue, SMTP, suppression, unsubscribe
14. **Security** — RLS, role-based access, PayU hash verification, audit logs, secrets handling
15. **Analytics & Activity Logs** — Events captured, dashboards
16. **Deployment & Environments** — Preview vs Live URLs, stable project URLs, custom domain
17. **Web Flow Diagram (visual)** — End-to-end customer journey
18. **Next Steps & Roadmap** — Go-live checklist (PayU live keys, SMTP, domain), future enhancements

## Design

- Clean professional theme — Navy + warm accent (suited for a govt/services brand like Udyam Adhar)
- Diagrams rendered as vector shapes inside slides (no external images required)
- Each slide has a clear title, body, and footer with page number

## Process

- Use `pptxgenjs` to build the deck
- Render to PDF and inspect every slide for layout/overflow issues
- Fix any issues, re-verify, then deliver the final `.pptx` (plus a PDF preview)

After you approve, I'll generate the file and share both the `.pptx` and a PDF preview.