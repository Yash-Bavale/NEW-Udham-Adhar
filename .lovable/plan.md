## Update Payment Success Page to Match Lead-Form Processing Design

Rewrite `src/routes/success.$leadCode.tsx` to reuse the exact visual language from `src/routes/processing.$leadCode.tsx` (the 30-sec post lead-form waiting screen), but with a **60-second** timer and payment-relevant copy.

### Changes (single file: `src/routes/success.$leadCode.tsx`)

1. **Timer**: keep `TOTAL_SECONDS = 60` (was already 60 — confirming, not 30).
2. **Visual design** — replace current emerald SVG ring + step-pill layout with the processing page's:
   - Concentric spinning ring loader (outer slow ring + brand-navy gradient sweep + counter-rotating amber inner ring + pulsing center icon)
   - Same card chrome: `rounded-3xl border border-border bg-card/85 backdrop-blur shadow-2xl`
   - Same ambient brand-navy + amber blurred blobs
   - Same big seconds counter (`text-5xl ... text-brand-navy` with `s` suffix)
   - Same gradient progress bar (`from-brand-navy via-brand-navy-deep to-amber-500`)
   - Same 4-up step pip grid below
   - Same "End-to-end encrypted · ISO 27001 aligned" footer line
3. **Step copy** — payment-success themed, 4 steps spaced across 60s:
   - 0s — ShieldCheck — "Verifying payment" / "Confirming transaction with your bank"
   - 15s — FileText — "Preparing your application" / "Setting up your secure onboarding form"
   - 30s — Sparkles — "Personalising your form" / "Tailoring fields to your selected service"
   - 45s — CheckCircle2 — "Almost ready" / "Opening your form in a moment"
4. **Preserve existing logic** unchanged:
   - Polling `getApplicationSummary` for paid status
   - `pendingFallback` → redirect to `/payment-pending/$leadCode`
   - On confirmed + timer done → redirect to `/onboarding/$leadCode`
   - Error state UI
   - `trackEvent` calls
   - Ref code display at bottom (keep, styled to match)
5. Keep `<TrustBlock />` at the bottom.

No backend / server-fn changes. No other files touched.
