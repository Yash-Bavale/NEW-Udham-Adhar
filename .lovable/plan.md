
## Goal

Pass Core Web Vitals on mobile for `/` (and all marketing routes). Current: LCP 5.1s, FCP 5.1s, TTFB 4.2s. Target: TTFB <0.8s, LCP <2.5s.

## Root causes found in code

1. **TTFB 4.2s** — every request is SSR'd by the Cloudflare Worker. The homepage SSR pulls in the Footer, which calls `useServerFn(listPublicSeoPages)` on mount (no impact on SSR HTML itself but adds JS payload). More importantly, no prerender is configured, so each visit re-renders.
2. **LCP image not preloaded** — `udyam-sample-certificate.webp` (~130 KB, remote `/__l5e/...` URL) is the LCP candidate. It has `fetchPriority="high"` on the `<img>`, but the browser discovers it only after the React tree mounts. No `<link rel="preload">` in the route head.
3. **Render-blocking 3rd party JS** — `translate.google.com/translate_a/element.js` is appended to `<body>` in `Header`'s `useEffect`, but it's heavy (~hundreds of KB) and runs on every page load even when the user never opens the language dropdown. GA `gtag.js` also fires immediately.
4. **Footer fetch on mount** — every page (including `/`) calls `listPublicSeoPages` server fn at mount, just to populate the gated SEO tree that only renders after a password unlock.

## Fix plan

### 1. Preload the LCP image (biggest single LCP win)
- In `src/routes/index.tsx` `head().links`, add:
  - `{ rel: "preload", as: "image", href: certImg.url, fetchpriority: "high" }`
- Keep the existing `loading="eager" fetchPriority="high"` on the `<img>`.

### 2. Prerender marketing routes (TTFB win)
- Add `prerender: { enabled: true }` to the `Route` config of static marketing pages so they're served as static HTML from the edge:
  - `/`, `/about-us`, `/about`, `/contact`, `/faqs`, all `wp/*` SEO landing routes, all legal pages (`/privacy-policy`, `/terms-conditions`, `/disclaimer`, …), and all `seo-*` landing slugs that render from a `?raw` HTML import.
- Skip prerender for any route that needs per-request data (`/admin/*`, `/processing/$leadCode`, payment flows). Verify by checking each route's `loader`.

### 3. Lazy-load Google Translate
- In `src/components/site/Header.tsx`, remove the auto-bootstrap `useEffect` that injects `translate.google.com/element.js` on mount.
- Inject the script only when the user opens the language `<select>` for the first time (e.g. `onFocus` / `onPointerDown` handler), or if `readStoredLang()` is non-English on hydration (so previously translated users still see translation). Most visitors will never trigger it.

### 4. Defer GA `gtag.js` to idle
- In `src/routes/__root.tsx`, keep GA but move it out of `head().scripts`. Add a tiny `useEffect` in `RootComponent` that, on `requestIdleCallback` (fallback `setTimeout(..., 1500)`), creates the gtag `<script>` and runs the inline init. This removes ~40 KB from the critical path while keeping analytics.

### 5. Defer Footer SEO-pages fetch
- In `src/components/site/Footer.tsx`, only call `loadSeoPages()` after the user expands the SEO tree (i.e. after `unlocked` becomes true). Until then, render nothing under the gate. Removes one server-fn round-trip from every page load.

### 6. Quick wins on the same pass
- Add `rel="preconnect"` for `https://www.googletagmanager.com` only when GA is about to load (skip if we lazy-load GA).
- Verify the homepage `<img>` has explicit `width` / `height` attributes (avoid CLS during preload). The cert image currently has `w-full h-auto` only — add intrinsic `width={1200} height={849}` (or correct ratio) so the browser reserves space.

## Out of scope (do not touch this turn)

- CRM/admin code, design tokens, copy, content, business logic.
- Any data model or migration changes.

## Verification

After deploy, re-run PageSpeed on `https://udyamadhar.in/` (mobile). Expect:
- TTFB drops from 4.2s → <0.8s (prerendered HTML served from edge).
- LCP drops to <2.5s (preloaded image + no render-blocking GTranslate).
- FCP tracks LCP improvement.
