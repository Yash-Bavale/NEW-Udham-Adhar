import { type ReactNode } from "react";
import { LEGAL_FOOTER_LINE, SITE_NAME, LEGAL_ENTITY, COMPANY_NAME, SUPPORT_EMAIL, BASE_URL } from "@/lib/brand";
import { useOptionalBrand } from "@/lib/websites/brand-context";

const proseClasses =
  "p-6 md:p-10 space-y-4 text-foreground/85 text-[15px] leading-relaxed " +
  "[&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 " +
  "[&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 " +
  "[&_h4]:font-display [&_h4]:text-foreground [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-5 " +
  "[&_a]:text-brand-navy [&_a]:underline " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 " +
  "[&_p]:my-3 [&_strong]:text-foreground [&_table]:w-full [&_th]:text-left [&_th,&_td]:border [&_th,&_td]:border-border [&_th,&_td]:px-2 [&_th,&_td]:py-1";

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rewrites the legacy hardcoded brand strings inside ported HTML content so
 * every site in the `websites` table renders its own name / entity / contact.
 */
function useBrandedHtml(html: string) {
  const brand = useOptionalBrand();
  if (!brand) return html;
  const pairs: Array<[string, string]> = [
    [LEGAL_ENTITY, brand.legalEntity],
    [COMPANY_NAME, brand.companyName],
    [SUPPORT_EMAIL, brand.supportEmail],
    [BASE_URL, brand.baseUrl],
    ["udyamadhar.in", brand.domain],
    [SITE_NAME, brand.siteName],
  ];
  let out = html;
  for (const [from, to] of pairs) {
    if (!to || from === to) continue;
    out = out.replace(new RegExp(escapeRe(from), "g"), to);
  }
  return out;
}

function LegalFooter() {
  const brand = useOptionalBrand();
  return (
    <p className="mt-6 border-t border-border pt-4 text-xs italic text-muted-foreground">
      {brand?.legalFooterLine || LEGAL_FOOTER_LINE}
    </p>
  );
}


/** Standard inner-page container with a title band matching the homepage cards. */
export function PageHero({
  title,
  children,
  legal,
}: {
  title: string;
  children?: ReactNode;
  legal?: boolean;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white text-center py-5">
          <h1 className="text-2xl md:text-3xl font-bold font-display">{title}</h1>
        </div>
        <div className={proseClasses}>
          {children}
          {legal ? <LegalFooter /> : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Removes headings/anchors at the top of ported HTML that simply repeat the
 * page title, so the fallback page never shows the same title 2-3 times.
 */
function stripDuplicateTitle(html: string, title: string) {
  const norm = (s: string) =>
    s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  const target = norm(title);
  if (!target) return html;
  let out = html;
  const blockRe = /^\s*(?:<a\b[^>]*>\s*)?<h1\b[^>]*>[\s\S]*?<\/h1\s*>(?:\s*<\/a>)?\s*/i;
  for (let i = 0; i < 4; i++) {
    const m = out.match(blockRe);
    if (!m || norm(m[0]) !== target) break;
    out = out.slice(m[0].length);
  }
  return out;
}

/** Same shell as PageHero, but renders trusted HTML (e.g. ported WordPress content). */
export function WpPage({
  title,
  html,
  legal,
  withForm,
}: {
  title: string;
  html: string;
  legal?: boolean;
  /** Content/SEO pages keep the standard enquiry form + sample certificate. */
  withForm?: boolean;
}) {
  const branded = useBrandedHtml(stripDuplicateTitle(html, title));
  return (
    <div>
      {withForm ? (
        <section
          id="lead-form"
          className="mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start"
        >
          <LeadForm title={title} />
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-form-header text-white text-center py-4">
              <h2 className="text-xl font-bold font-display">Sample Certificate</h2>
            </div>
            <div className="p-6">
              <img
                src={certImg.url}
                alt="Sample Udyam Adhar Certificate"
                width={800}
                height={1035}
                className="w-full h-auto rounded-md border border-border"
                loading="eager"
              />
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Note: Sample Udyam Adhar Certificate shown for reference purposes only.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-form-header text-white text-center py-5">
            <h1 className="text-2xl md:text-3xl font-bold font-display">{title}</h1>
          </div>
          <div className={proseClasses}>
            <div dangerouslySetInnerHTML={{ __html: branded }} />

            {legal ? <LegalFooter /> : null}
          </div>
        </div>
      </section>

      {withForm ? <TrustBlock /> : null}
    </div>
  );
}
