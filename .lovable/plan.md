## What's missing vs. udyamadhar.in

Comparing your screenshots with our current `/` (which only renders the LeadForm + Sample Certificate), four sections from the WordPress home are not present, plus a small mobile-header alignment issue:

1. **"Business Help Services" blue bar** sitting directly above the form (full-width navy strip with right-aligned white title).
2. **FAQ section** — "Frequently Asked Questions for MSME registration in India." with the small uppercase subtitle and an accordion of ~10 Q&A items.
3. **"Udyam Assistance Process – Fast & Simple"** — light-blue band with 4 circular icons (Fill Form & Make Payment → Submit Required Info → Expert Assistance & Verification → Updates Shared via Email), arrows between.
4. **"We provide consultancy services across India"** — bordered card with India map image + facts table (Country, Area, States, Population, Literacy).
5. **Mobile header alignment** — on phones the WP site hides the brand text and stacks just the bilingual heading + a single hamburger; ours shows brand + heading + Contact button which crowds 360 px.

## Plan

### 1. Homepage (`src/routes/index.tsx`)

Restructure into stacked sections (mobile-first), keeping the existing form + sample certificate as the second section:

```text
[ Business Help Services strip ]
[ Form (LeadForm)  |  Sample Certificate ]   ← existing two-column block
[ FAQ accordion ]
[ Process steps (4 icons) ]
[ India map + facts table ]
```

- Build each as a small local component inside `index.tsx` (or split into `src/components/home/` if it gets large). Use semantic tokens (`bg-brand-navy`, `bg-muted`, `text-foreground` etc.) — no raw hex.
- FAQ: use existing shadcn `Accordion` component for the 10 questions (content sourced from `src/content/wp/home.html` / the live FAQ copy).
- Process icons: use `lucide-react` (UserSquare, Fingerprint, Share2, Download) inside white circles on a light-blue band; arrows between via `ArrowRight`. Stack vertically below `sm:`.
- India map: reuse the existing WP CDN image (`https://www.udyamadhar.in/wp-content/uploads/.../india-map.png` — pull the actual URL from the live page when building). Facts table = simple `<table>` with 2 columns.

### 2. Header (`src/components/site/Header.tsx`)

Mobile-only tweak (≥`md` stays as-is):
- Hide the brand block and Contact button on `<md`.
- Keep the centered bilingual heading full-width on mobile.
- Add a hamburger trigger on the right (we already have `Nav.tsx` for mobile menu — wire it in if not).

### 3. Verification

After build:
- Browser to `/` at 375×812, scroll through, screenshot each section, compare side-by-side with the six attached screenshots.
- Confirm tap targets, text wrap, image scaling.

## Out of scope

- Footer (already matches the screenshot — © Business Help Services, social icons, MSME column with Home arrow, Useful Links, Get in touch).
- The 130+ SEO landing pages — they already use `PageHero` + WP HTML and are not in the screenshots.
- Backend / SEO admin — untouched.

## Files

- Edit: `src/routes/index.tsx`, `src/components/site/Header.tsx`
- Possibly add: `src/components/home/FaqSection.tsx`, `ProcessSteps.tsx`, `IndiaCoverage.tsx` (only if `index.tsx` gets noisy)
