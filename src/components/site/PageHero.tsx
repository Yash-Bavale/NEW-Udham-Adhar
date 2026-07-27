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

/** Same shell as PageHero, but renders trusted HTML (e.g. ported WordPress content). */
export function WpPage({
  title,
  html,
  legal,
}: {
  title: string;
  html: string;
  legal?: boolean;
}) {
  const branded = useBrandedHtml(html);
  return (
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
  );
}
