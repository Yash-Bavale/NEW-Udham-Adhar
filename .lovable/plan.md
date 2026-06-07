## Goal
Now that the site is republished with the `google-site-verification` meta tag live in production HTML, complete the Google Search Console setup for `https://udyamadhar.in/`.

## Steps
1. Call the Site Verification API (META method) for `https://udyamadhar.in/`. Google fetches the homepage and confirms the meta tag.
2. Register the verified site as a Search Console property via `PUT /webmasters/v3/sites/{encoded-url}`.
3. Submit the sitemap `https://udyamadhar.in/sitemap.xml` via `PUT /webmasters/v3/sites/{encoded-url}/sitemaps/{encoded-sitemap-url}`.
4. Mark the SEO finding `gsc:gsc` as fixed.

## Notes
- No code changes — purely API calls through the connector gateway.
- If verification fails (meta tag not yet visible to Google's crawler due to CDN cache), retry once after a short wait; otherwise report the exact error.
- Sitemap already lives at `src/routes/sitemap[.]xml.ts` with `BASE_URL = https://udyamadhar.in`, so no edits needed there.
