## SEO Consolidation & Accessibility Fixes

Approach approved: **#2 — keep all pages, fix canonicals, trim sitemap.** No content deletion.

### 1. AdsBot accessibility (`public/robots.txt`)

Add explicit allow blocks so Google Ads landing-page checks never get ambiguously matched:

```
User-agent: AdsBot-Google
Allow: /

User-agent: AdsBot-Google-Mobile
Allow: /
```

Keep existing `User-agent: *` rules intact.

### 2. Kill the `/home` duplicate

- Delete `src/routes/home.tsx`.
- Add `/home` (and any `/home/*`) to the 410 Gone matcher in `src/routes/$.tsx` so the URL stops existing instead of redirecting. Single homepage = `https://udyamadhar.in/`.

### 3. Canonical + trailing-slash normalization

Extend the normalizer in `src/routes/$.tsx` to:

- Lowercase multi-segment paths (not just top-level).
- Strip trailing slashes on all depths except `/`.
- 301 to the normalized form.

### 4. Cluster canonicals (approach #2)

Audit `src/content/seo-batch1/*.json` + `src/content/wp/*.html` + the sitemap generator. Group near-duplicates into clusters, pick one canonical per cluster. For every variant page:

- Its route's `head()` emits `<link rel="canonical">` and `og:url` pointing at the **cluster primary**, not itself.
- Remove the variant from `sitemap.xml` output (primary stays).
- Page stays live, content untouched, direct links keep working.

Proposed initial clusters (final list produced during implementation from the actual file audit):

- **udyam-registration** ← udyam-registration-online, udyam-registration-process, msme-registration, udyam-registration-free
- **udyam-certificate** ← udyam-registration-certificate, download-udyam-certificate, print-udyam-certificate
- **udyam-registration-number** ← udyam-registration-number-verify, verify-udyam-certificate, forgot-udyam-registration-number
- **udyog-aadhaar-govin** ← udyog-aadhaar-government-in, udyog-aadhaar-register, udyog-aadhar-card, www-udyamregistration
- **udyog-aadhaar-to-udyam-migration** (standalone primary)
- Standalone primaries kept as-is: udyam-login, udyam-reprint, udyam-registration-status, udyam-registration-update, udyam-registration-fee, udyam-registration-documents-required, udyam-registration-eligibility, udyam-registration-benefits, msme-certificate-benefits

Target sitemap size: ~205 → ~60–80 URLs, all with self-referencing canonicals.

### 5. Legacy 410 sweep

Verify every dead government-scheme URL flagged in the audit resolves to 410 via `src/routes/$.tsx` matcher. Add any missing patterns.

### 6. Verification

- Curl `/robots.txt`, `/home`, a variant page (check canonical header/tag), and `/sitemap.xml` (count URLs).
- Confirm build passes.
- Tell you to hit Rescan in the SEO tab.

### Technical notes

- Canonical goes in the leaf route's `head()` `links` array (never in `__root.tsx` — router concatenates `links` and would emit both). `og:url` in `meta` is fine to update alongside.
- Sitemap lives in `src/routes/sitemap[.]xml.ts` (or the static generator — I'll match whichever mechanism is currently in use, no migration without asking).
- The final cluster → primary mapping will be produced from the actual file audit before I flip canonicals; if any cluster grouping looks wrong to you, tell me during implementation and I'll adjust before touching the sitemap.