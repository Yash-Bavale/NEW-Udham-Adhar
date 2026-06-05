Generate the CRM architecture discovery report as both a PDF and a DOCX, saved to `/mnt/documents/` and surfaced as downloadable artifacts.

## Contents

The report will mirror the discovery I produced earlier, organized into clear sections:

1. Sidebar / navigation structure
2. Routes & pages map (admin + public)
3. Lead, application, customer modules
4. Service forms (hardcoded vs Form Builder gap)
5. Payments, invoices (GST split), settlements
6. Documents, certificates
7. Communications (email queue, WhatsApp/SMS gaps)
8. Roles & permissions (incl. `finance` role gap)
9. Database schema overview
10. Identified bugs & gaps
11. Redesign recommendations (Keep / Improve / Remove / Merge / Split / Add)

## Approach (technical)

- Write a Node script using `docx` to generate `CRM_Architecture_Report.docx` with proper headings, tables, and styling.
- Convert the DOCX to PDF via LibreOffice headless (`run_libreoffice.py` skill script).
- Save both files to `/mnt/documents/`.
- Run visual QA: render PDF pages to images and inspect for layout issues; fix and re-render if needed.
- Emit `<presentation-artifact>` tags for both files so you can download them.

No app code will change — this is a one-off document export.