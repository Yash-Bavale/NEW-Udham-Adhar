Add the Google Analytics (gtag.js) tag site-wide via the TanStack root route so it's injected into `<head>` on every page.

## Change

Edit `src/routes/__root.tsx` only. In the root `head()`:

- Add an external script: `{ src: "https://www.googletagmanager.com/gtag/js?id=G-62JC7PRPMM", async: true }` to the `scripts` array.
- Add an inline init script with the gtag config for `G-62JC7PRPMM`.

Both scripts render through TanStack's `<HeadContent />` (already in `RootShell`), so they appear in `<head>` on every route, including admin and legal pages. No other files change.

## Notes

- Single source ensures the "don't add more than one Google tag" rule is respected.
- No `.env` change needed — measurement ID is public.
- No impact on existing meta, SEO tags, or SSR behavior.