## Goal
Keep the existing complaint submission form on `/complaint-grievance-policy` intact, and restore the original "Complaint & Grievance Policy" content below it.

## Source of truth
The original policy HTML still exists at `src/content/wp/grievance-redressal-policy.html` (14 sections — Introduction, Scope, Submission, Review Process, Communication, Nature of Services, Non-Eligible Refunds, Disputes, Language Support, Fair Usage, Records, Disclaimer, Final Authority, Contact). We'll reuse it as-is rather than retyping.

## Changes

1. **`src/routes/complaint-grievance-policy.tsx`**
   - Import the raw HTML: `import policyHtml from "@/content/wp/grievance-redressal-policy.html?raw";`
   - Render `<ComplaintFormPage />` followed by a new `<PolicyContent html={policyHtml} />` section in a fragment as the route component (instead of pointing `component` directly at `ComplaintFormPage`).

2. **New component `src/components/site/PolicyContent.tsx`** (small, presentational)
   - Renders a styled container (matching site typography — `container`, `prose`-style spacing, `font-display` headings, muted body) with `dangerouslySetInnerHTML={{ __html: html }}`.
   - Adds top padding/border so it visually separates from the form section above.

## Out of scope
- No changes to the form UI, fields, submission logic, CRM integration, or email notifications.
- No SEO/meta changes (current head() already fits a policy + form page).
