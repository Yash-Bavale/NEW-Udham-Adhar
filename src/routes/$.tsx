import { createFileRoute, redirect, notFound } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getArticleBySlug } from "@/lib/seo-articles.functions";
import {
  ArticlePageLayout,
  buildArticleJsonLd,
  type ArticleFaq,
  type ArticleSection,
} from "@/components/site/ArticlePageLayout";
import { BASE_URL } from "@/lib/brand";
import { LEGACY_REDIRECTS } from "@/lib/legacy-redirects";

const setGoneStatus = createIsomorphicFn()
  .client(() => {})
  .server(() => {
    // Lazy import so client bundle never sees the server-only module.
    void import("@tanstack/react-start/server").then(({ setResponseStatus }) =>
      setResponseStatus(410),
    );
  });



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
  "udyam-msme-government-portal-for-msme-registration",
  "udyam-register-how-to-register-your-business-as-msme",
  "kviconline-all-services-united-in-one-place",
  "online-kvic-the-new-face-of-digital-khadi",
  "home",
  "home-3",
  "home-2",
  "shop-act",
  "nlm-scheme",
  "cmegp-scheme",
  "udyam-registration-form-2",
  "udyam-registration-certificate-download-2",
]);
// Anything starting with these prefixes is retired legacy content → 410.
const GONE_PREFIXES = [
  "annasaheb-patil-",
  "wp-",
  "wp_",
  "xmlrpc",
  "pmegp",
  "pmgp-",
  "pm-egp",
  "prime-minister-employment-",
  "kvic-",
  "kvic_",
  "kviconline",
  "elementor-hf",
  "feed",
  "category/",
  "author/",
  "tag/",
  "page/",
  "?p=",
];

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

    // First segment (for multi-segment paths like /wp-content/uploads/foo).
    const firstSeg = lower.split("/")[0] ?? lower;

    // 410 Gone for retired legacy paths — check BEFORE multi-segment handoff
    // so /wp-content/*, /feed/*, /category/* return 410 instead of redirecting.
    if (isGone(lower) || isGone(firstSeg)) {
      setGoneStatus();
      return { gone: true as const };
    }

    // Canonicalise multi-segment paths: strip trailing slash + lowercase → 301.
    if (raw !== lower) {
      // Multi-segment: nothing to serve at that depth, but land on the
      // canonical (lowercase, no trailing slash) form of the first segment.
      if (stripped.includes("/")) {
        throw redirect({ to: "/" });
      }
      throw redirect({
        to: "/$",
        params: { _splat: lower },
        statusCode: 301,
      });
    }

    // Already-lowercase multi-segment splats: nothing to serve, hand off.
    if (stripped.includes("/")) {
      throw redirect({ to: "/" });
    }

    // Batch-1 SEO: 301 redirect legacy slugs to their new canonical URL.
    const legacy = LEGACY_REDIRECTS[lower];
    if (legacy) {
      throw redirect({ to: legacy, statusCode: 301 });
    }




    try {
      const result = await getArticleBySlug({ data: { slug: lower } });
      return result;
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const a = (loaderData as any)?.article;
    if (!a) {
      if ((loaderData as any)?.gone) {
        return {
          meta: [
            { title: "Gone — Udyam Adhar" },
            { name: "robots", content: "noindex" },
          ],
        };
      }
      return {};
    }
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
  const data = Route.useLoaderData() as any;
  if (data?.gone) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">410 — Gone</h1>
        <p className="mt-4 text-muted-foreground">
          This page has been permanently removed.
        </p>
        <a href="/" className="mt-6 inline-block text-primary underline">
          Return to homepage
        </a>
      </div>
    );
  }
  const { article, related } = data;
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
