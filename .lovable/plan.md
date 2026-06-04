# SEO Audit & Fix Plan — Udyamadhar.in

## Source of truth

- **Keyword Sequence doc**: 13 parent sections × ~10 children = 131 numbered keywords + 13 parent labels.
- **Udyam website information.docx**: Full `Title` + `Meta Description` for entries **1–70 only**. Entries **71–131** are listed by name with no copy supplied.

## Audit deliverable (Section 1–9 report)

I will run a script that joins three sources — master doc (#1–131), `seo_pages` DB rows (132 rows), and `src/routes/*.tsx` files — and produce a Markdown report covering:

- **§1 Missing pages** — keyword numbers with no route file
- **§2 Header mismatches** — Form Header (`LeadForm title`) vs Content Header (`<h1>`) vs expected keyword name
- **§3 Linked SEO heading mismatches** — `linkTitle` vs source-doc title
- **§4 Meta title issues** — current `head().meta[title]` vs source title
- **§5 Meta description issues** — current meta description vs source
- **§8 Extra pages** — routes/DB rows not in the 131 keywords
- **§9 Final fix list** — consolidated change set

The report is written to `/mnt/documents/seo-audit.md` and surfaced as an artifact.

## Implementation

### A. Per-route fixes (131 SEO route files in `src/routes/`)

For every keyword #1–131:

1. Ensure a route file exists at the expected slug (kebab-case of the keyword). Create the missing ones using `SeoLandingPage`. Where two keywords collide on the same slug (e.g. #21 and #11 both "Udyog Aadhar Registration", #46 and #56 both "Udyam MSME Certificate"), keep one canonical slug and add a numeric suffix (`-2`) for the duplicate, matching what already exists.
2. Set `head().meta`:
   - `title` and `og:title` = source-doc Title for #1–70; for #71–131 generate `"<Keyword> — Consultancy Assistance for MSME / Udyam Registration"` (≤60 chars where possible).
   - `description` and `og:description` = source-doc Meta Description for #1–70; for #71–131 generate a 140–155-char keyword-led summary.
   - `canonical` link kept at `https://udyamadhar.everythinghappens.in/<slug>`.
3. Set `<SeoLandingPage title="<Keyword Name>" linkTitle="<Source Title or descriptive H2>" html={html} />` so:
   - **Form Header** (rendered from `title`) = exact keyword name.
   - **Content Header** (`<h1>` in prose) = exact keyword name.
   - **Linked SEO Heading** (`<h2><a>`) = the source-doc Title (or the descriptive variant for #71–131).

### B. Nav, Sidebar, and Footer parent structure

**Behaviour change requested:** parents (Udyamregistration, Udyam Regn Certificate, Udyamregistration Gov In, Aadhar Udyog Registration, Udyog Aadhar Certificate Download, Official MSME Registration Website, Aadhaar Udyam, MSME Registration Process, Udyam Aadhaar Download PDF, Udyog Aadhar Registration, Udhayam Aadhar Download, Print MSME Udyam Certificate, Udyam Registration Online) become **plain text labels**, not links. The parent keyword is added as the **first child link** under itself (which matches the Keyword Sequence doc — e.g. parent "Udyamregistration" with child #1 "Udyamregistration" linking to `/udyamregistration`).

Files touched:
- `src/components/site/Footer.tsx` — `SeoTree`: render parent as `<span>` (no `<a href>`), prepend the parent's own slug as the first entry of `childSlugs` so it appears as a link inside.
- `src/components/site/Nav.tsx` and `src/lib/constants.ts` (NAV_LINKS) — same treatment for the top nav dropdown if it surfaces SEO categories. If nav currently flat-links to SEO pages, leave nav as-is and apply the change only to the footer/sidebar tree that mirrors the screenshot.
- Any sidebar component used by the SEO landing pages (search the codebase for the rendered `Udyamregistration / Udyam Regn / Udyam …` tree shown in the annotated screenshot) gets the same treatment.

### C. Database alignment (`seo_pages` table)

Migration to:
- `UPDATE` each row's `label` and `sort_order` to match the keyword sequence (1–131).
- `INSERT` any missing slugs, `DELETE` rows not present in the master list (after confirming no published external link to them).
- Includes `GRANT` re-affirmation (no schema change).

### D. Sitemap & robots

No changes needed — `sitemap.xml` already auto-discovers routes + `seo_pages`. It will pick up new/renamed routes automatically.

## Technical notes

- Source doc has empty Title/Description for #71–131; I will generate consistent copy using the existing pattern from `udyam-download-online.tsx` etc. (`"Expert consultancy assistance for <keyword>. …"`). If you'd prefer to author these manually, say so before implementation and I'll skip generated copy for that range and leave a `TODO` per route.
- Slug collisions (#21 vs #11, #46 vs #56, #131 vs #27) are handled by reusing the existing `-2` slugs already present in the DB.
- All new copies preserve the existing `SeoLandingPage` shape; no UI redesign.

## Out of scope

- Visual redesign of the landing pages, lead form, or sample certificate card.
- Changes to non-SEO pages (admin, onboarding, policy pages).
- Content rewrites inside the imported WordPress HTML body.

## Estimated change footprint

- ~30–60 new route files (for keywords currently missing).
- ~70 existing route files edited (head meta + linkTitle).
- 1 migration (`seo_pages` re-sync).
- 1–3 component edits (Footer/Nav/Sidebar parent rendering).
- 1 generated audit artifact at `/mnt/documents/seo-audit.md`.
