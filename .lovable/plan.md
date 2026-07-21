## SEO fixes plan

Address the four failing findings from the SEO scanner.

### 1. Duplicate metadata + long titles — `src/routes/__root.tsx`

- Remove duplicate `description` and `og:description` entries at lines 107–108 (already declared at 92 and 98).
- Shorten root `title`, `og:title`, `twitter:title` to under 60 chars, e.g. `"Udyam Registration | MSME Certificate"` (44 chars).

### 2. Homepage title — `src/routes/index.tsx`

- Shorten `HOMEPAGE_TITLE` (currently 82 chars) to under 60, e.g. `"Udyam Registration & MSME Certificate"` (43 chars). Update matching `og:title` usage.

### 3. Long SEO landing titles — `src/content/seo-batch1/*.json`

- Trim `metaTitle`/`ogTitle` on the 3 files that exceed 60 chars (`udyam-registration.json`, `udyam-certificate.json`, `msme-registration.json`) and audit the rest of the batch folder in the same pass. Drop the "| Udyam Aadhar" suffix where needed.

### 4. Contact page — `src/routes/contact.tsx`

- Rewrite meta + og description (currently repeats "Business Help Services" three times, and og says "help with your Business Help Services" & its wrongg it should says help with your Udyam registration or MSME reghistartion like this ) to a clear unique sentence.

### 5. Sitemap out-of-sync — `src/routes/sitemap[.]xml.ts`

- Missing routes flagged: `/complaint`, `/admin-login`, `/llms.txt`, `/llms-full.txt`, `/$` (404). Correct treatment:
  - Continue to exclude `/admin-login`, `/llms.txt`, `/llms-full.txt`, `/$` (not indexable pages) — the scanner just flags them as missing but they should stay out. Add a code comment documenting the intentional exclusion so the finding is understood.
  - Add `/complaint` (remove it from `EXCLUDED_PREFIXES`) since it's a real public page.
- Stale entries (`/aadhar-udyam-certificate`, `/aadhar-udyam-print`, `/download-udyam`, `/download-udyam-aadhar`, `/download-udyam-certificate-online`) come from disabled `seo_pages` rows still marked `enabled=true` or from an older cached sitemap. Verify: the sitemap only emits routes present in `routeTree.gen` plus `seo_pages` where `enabled=true`, so these must be lingering DB rows — disable them via a Supabase update in the same turn.

### 6. Mark findings fixed

- After edits, call `seo_chat--update_findings` for the four IDs (metadata_quality, social_preview, sitemap). Leave `gsc:gsc` as-is since it requires the user to authorize the Google Search Console connector — mention this to the user.

### Technical notes

- Root route emits root-level `og:image`. This is a violation of the "leaf-only og:image" rule but is out of scope for these findings — do not touch.
- No new files, no migrations. Pure string edits + one Supabase update to disable stale `seo_pages`.