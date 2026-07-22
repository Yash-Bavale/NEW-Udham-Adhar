## Google Ads conversion label update

The site already loads the Google tag (`AW-18336340451`) on every page via `src/routes/__root.tsx`, and the lead form (`src/components/site/LeadForm.tsx`), Contact page, and Talk-to-Expert page already fire a `gtag_report_conversion()` call after a successful submit. Only the conversion label needs to change to the new one you generated.

### Change

- `src/routes/__root.tsx`, line 152: replace the old `send_to` value
  - from: `'AW-18336340451/1BGJCNDNmPEZEI6f2cs-'`
  - to: `'AW-18336340451/tS7UCOaYs9McEOOzuadE'`

That's the whole change — no new script tag needed. The existing `gtag_report_conversion` helper already runs the event exactly as Google's snippet describes, and it's already wired to the lead form submit.

### Verification after publish

1. Submit a test lead on the site.
2. In DevTools Network, filter `collect?v=2` — you should see a hit to `google-analytics.com/g/collect` (or `googleadservices.com`) with `en=conversion` and the new label.
3. Conversions will appear in Google Ads within a few hours (Ads takes longer than GA4 to attribute).
