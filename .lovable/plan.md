## Goal

Rename the legal business entity to **"Udyam Registration Consultancy & Assistance Services"** and surface it as the main `<h1>` on the homepage so it ranks in SEO. No other copy or layout changes.

## Changes

### 1. `src/lib/brand.ts`
Update the single source of truth:
```ts
export const LEGAL_ENTITY = "Udyam Registration Consultancy & Assistance Services";
```
`SITE_NAME`, `CONTACT_EMAIL`, `BASE_URL`, and `LEGAL_FOOTER_LINE` stay as-is. Any place that already imports `LEGAL_ENTITY` (footer disclaimer, llms.txt, llms-full.txt) will pick up the new name automatically.

### 2. `src/routes/index.tsx` — add the page H1
The homepage currently has no `<h1>`. Add one as the first element inside the hero `<section>` (above `<LeadForm />`), using the new entity name so it becomes the page's primary heading for SEO:

```tsx
<h1 className="sr-only">Udyam Registration Consultancy & Assistance Services</h1>
```

`sr-only` keeps the existing visual layout untouched while giving crawlers a single, keyword-rich H1. If you'd prefer the H1 to be visible, say so and I'll style it into the hero instead.

## Explicitly NOT changing

- All other hardcoded "Business Help Services" strings across routes, FAQs, email templates, invoices, and JSON-LD remain untouched (per "don't change anything else").
- No meta titles, descriptions, or structured-data org names are modified.
- No styling, components, or other routes are touched.

## Files touched

- `src/lib/brand.ts` (1 line)
- `src/routes/index.tsx` (1 added `<h1>`)
