## Why the images are broken on production

The custom domain is now `www.udyamadhar.in`. The old WordPress site that used to live at `udyamadhar.in/wp-content/...` no longer serves those URLs (the domain now points to the Lovable app), so every image referenced as `https://udyamadhar.in/wp-content/uploads/...` returns 404 — that's the Sample Certificate. The India map `https://upload.wikimedia.org/...` is being blocked by Wikimedia's hotlink/referrer policy on the live domain.

Fix = stop hotlinking. Download both assets, host them via Lovable Assets CDN, and rewrite all references.

## Plan

### 1. Host images on Lovable Assets CDN
- Download `udyam-certificate-design-1.webp` (sample certificate) from a working mirror and upload via `lovable-assets create` → `src/assets/udyam-certificate.webp.asset.json`.
- Download the India map SVG/PNG and upload → `src/assets/india-map.png.asset.json`.
- Also pull the small icons used in contact pages (facebook/instagram/whatsapp/youtube, complain.png, udyam-aadhar.jpeg) and host them the same way.

### 2. Rewrite references
- `src/components/site/IndiaMap.tsx` → use the hosted India map URL (drop Wikimedia).
- `src/components/site/TrustBlock.tsx` → use hosted India map.
- All `src/content/wp/*.html` files → bulk `sed` replacement of every `https://udyamadhar.in/wp-content/uploads/.../<filename>.(webp|jpeg|png)` and the `srcset` variants → single hosted CDN URL (drop the responsive variants; one source is fine for these reference images).

### 3. Sitemap on the production domain
`src/routes/sitemap[.]xml.ts` currently uses `BASE_URL = "https://udyamadhar.everythinghappens.in"`. Change to `https://www.udyamadhar.in` so `https://www.udyamadhar.in/sitemap.xml` advertises the right canonical URLs. Also update `public/robots.txt` `Sitemap:` line to the new domain.

### 4. Verify
- Open the published site, confirm Sample Certificate and India map render.
- Hit `/sitemap.xml` on the live domain, confirm `<loc>` entries start with `https://www.udyamadhar.in`.

### Files touched
- New: `src/assets/udyam-certificate.webp.asset.json`, `src/assets/india-map.png.asset.json` (+ a few icon pointers)
- Edited: `src/components/site/IndiaMap.tsx`, `src/components/site/TrustBlock.tsx`, all `src/content/wp/*.html` containing external image URLs, `src/routes/sitemap[.]xml.ts`, `public/robots.txt`
