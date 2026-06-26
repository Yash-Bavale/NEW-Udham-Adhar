Wrap the H1 + description `<section>` (lines 218–226 in `src/routes/index.tsx`) with the `sr-only` Tailwind class so it stays in the SSR HTML (still readable by Google/AI crawlers and counted as the page H1) but is visually hidden from users.

Change:
- Replace section className with `sr-only` (and drop the visible padding/typography classes since they no longer matter).
- Keep `<h1>` and `<p>` content unchanged so SEO findings remain green.

No other code, copy, or metadata touched.