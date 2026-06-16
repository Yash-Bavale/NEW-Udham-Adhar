import { createFileRoute, redirect, notFound } from "@tanstack/react-router";
import { getArticleBySlug } from "@/lib/seo-articles.functions";
import {
  ArticlePageLayout,
  buildArticleJsonLd,
  type ArticleFaq,
  type ArticleSection,
} from "@/components/site/ArticlePageLayout";
import { BASE_URL } from "@/lib/brand";

// Retired / never-offered legacy slugs — return 410 Gone so Google de-indexes
// them quickly instead of re-crawling forever (faster than a soft 404).
const GONE_EXACT = new Set<string>([
  "obc-mahamandal-loan-scheme",
  "pmfme-scheme",
  "download-udyam-certificate-2",
  "udyam-registration-form",
  "annasaheb-patil-loan-scheme-documents",
  "annasaheb-patil-mahamandal-loan-scheme-details",
  "annasaheb-patil-customer-care",
  "annasaheb-patil-business-loan",
  "annasaheb-patil-loi",
]);
const GONE_PREFIXES = ["annasaheb-patil-", "wp-", "xmlrpc"];

function isGone(slug: string) {
  if (GONE_EXACT.has(slug)) return true;
  return GONE_PREFIXES.some((p) => slug.startsWith(p));
}

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const raw = ((params as any)._splat ?? "").toString();

    // Bail on internal/static/multi-segment paths.
    if (!raw || raw.startsWith(".")) {
      throw redirect({ to: "/" });
    }

    // Strip trailing slash. Lowercase for canonicalisation.
    const stripped = raw.replace(/\/+$/, "");
    const lower = stripped.toLowerCase();

    // 410 Gone for retired legacy paths.
    if (isGone(lower)) {
      throw new Response("Gone", { status: 410 });
    }

    // Well-known files served by dedicated routes — redirect bare slug to the file.
    if (lower === "sitemap") throw redirect({ to: "/sitemap.xml" });
    if (lower === "llms") throw redirect({ to: "/llms.txt" });
    if (lower === "robots") throw redirect({ to: "/robots.txt" });

    // Multi-segment splats: nothing to serve here, hand off.
    if (stripped.includes("/")) {
      throw redirect({ to: "/" });
    }

    // Canonicalise: trailing slash or uppercase → 301 to lowercase.
    if (raw !== lower) {
      throw redirect({
        to: "/$",
        params: { _splat: lower },
        statusCode: 301,
      });
    }

    try {
      const result = await getArticleBySlug({ data: { slug: lower } });
      if (!result || (result as any).isNotFound || !(result as any).article) {
        throw notFound();
      }
      return result;
    } catch (e) {
      if (e && typeof e === "object" && "isNotFound" in (e as any)) throw e;
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const a = (loaderData as any)?.article;
    if (!a) return {};
    const slugPath = a.slug.startsWith("/") ? a.slug : `/${a.slug}`;
    const title = a.meta_title ?? a.h1 ?? a.label;
    const description = a.meta_description ?? "";
    const url = `${BASE_URL}${slugPath}`;
    const faq = (Array.isArray(a.faq) ? a.faq : []) as ArticleFaq[];
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(a.cover_image_url
          ? [{ property: "og:image", content: a.cover_image_url }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildArticleJsonLd({
              slug: a.slug,
              h1: a.h1 ?? a.label,
              description: a.meta_description,
              coverImageUrl: a.cover_image_url,
              publishedAt: a.published_at,
              updatedAt: a.updated_at,
              faq,
            }),
          ),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <a href="/" className="mt-6 inline-block text-primary underline">
        Return to homepage
      </a>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground">{String(error)}</p>
      <a href="/" className="mt-6 inline-block text-primary underline">
        Return to homepage
      </a>
    </div>
  ),
  component: ArticleRoute,
});

function ArticleRoute() {
  const { article, related } = Route.useLoaderData();
  const sections = (Array.isArray(article.sections) ? article.sections : []) as ArticleSection[];
  const faq = (Array.isArray(article.faq) ? article.faq : []) as ArticleFaq[];
  return (
    <ArticlePageLayout
      h1={article.h1 ?? article.label}
      intro={article.intro}
      sections={sections}
      faq={faq}
      coverImageUrl={article.cover_image_url}
      related={related}
      publishedAt={article.published_at}
      updatedAt={article.updated_at}
    />
  );
}
