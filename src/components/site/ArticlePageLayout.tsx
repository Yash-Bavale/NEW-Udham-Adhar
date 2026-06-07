import { Link } from "@tanstack/react-router";
import { TrustBlock } from "@/components/site/TrustBlock";
import { BASE_URL } from "@/lib/brand";

export interface ArticleSection {
  h2?: string;
  h3?: string;
  body_html?: string;
}

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface ArticleRelated {
  slug: string;
  label: string;
}

export interface ArticlePageProps {
  h1: string;
  intro?: string | null;
  sections: ArticleSection[];
  faq?: ArticleFaq[];
  coverImageUrl?: string | null;
  related?: ArticleRelated[];
  publishedAt?: string | null;
  updatedAt?: string | null;
}

const proseClasses =
  "prose prose-slate max-w-none " +
  "[&_h2]:font-display [&_h2]:text-brand-navy-deep [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 " +
  "[&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 " +
  "[&_a]:text-brand-navy [&_a]:underline " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 " +
  "[&_p]:my-3 [&_strong]:text-foreground";

export function ArticlePageLayout({
  h1,
  intro,
  sections,
  faq,
  coverImageUrl,
  related,
  publishedAt,
  updatedAt,
}: ArticlePageProps) {
  const dateLabel = updatedAt ?? publishedAt;

  return (
    <article>
      <header className="mx-auto max-w-4xl px-4 pt-8 pb-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-navy-deep">
          {h1}
        </h1>
        {dateLabel ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Updated {new Date(dateLabel).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={h1}
            className="mt-4 w-full h-auto rounded-xl border border-border"
            loading="eager"
          />
        ) : null}
      </header>

      <section className="mx-auto max-w-4xl px-4 pb-8">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8">
          <div className={proseClasses}>
            {intro ? (
              <p className="text-lg text-foreground/85 leading-relaxed">{intro}</p>
            ) : null}

            {sections.map((s, i) => (
              <div key={i}>
                {s.h2 ? <h2>{s.h2}</h2> : null}
                {s.h3 ? <h3>{s.h3}</h3> : null}
                {s.body_html ? (
                  <div dangerouslySetInnerHTML={{ __html: s.body_html }} />
                ) : null}
              </div>
            ))}

            {faq && faq.length ? (
              <div className="mt-10">
                <h2>Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faq.map((f, i) => (
                    <div key={i} className="rounded-lg border border-border p-4">
                      <p className="font-semibold text-foreground">{f.q}</p>
                      <div
                        className="mt-2 text-foreground/85"
                        dangerouslySetInnerHTML={{ __html: f.a }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {related && related.length ? (
          <nav
            aria-label="Related articles"
            className="mt-8 rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-xl font-bold text-brand-navy-deep">
              Related reading
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => {
                const path = r.slug.startsWith("/") ? r.slug : `/${r.slug}`;
                return (
                  <li key={r.slug}>
                    <a
                      href={path}
                      className="text-brand-navy underline hover:no-underline"
                    >
                      {r.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </section>

      <TrustBlock />
    </article>
  );
}

export function buildArticleJsonLd(args: {
  slug: string;
  h1: string;
  description?: string | null;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  faq?: ArticleFaq[];
}) {
  const slugPath = args.slug.startsWith("/") ? args.slug : `/${args.slug}`;
  const url = `${BASE_URL}${slugPath}`;
  const graph: unknown[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: args.h1,
      description: args.description ?? undefined,
      image: args.coverImageUrl ?? undefined,
      datePublished: args.publishedAt ?? undefined,
      dateModified: args.updatedAt ?? args.publishedAt ?? undefined,
      mainEntityOfPage: url,
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL + "/" },
        { "@type": "ListItem", position: 2, name: args.h1, item: url },
      ],
    },
  ];
  if (args.faq && args.faq.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: args.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
