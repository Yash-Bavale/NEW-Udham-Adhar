import { createFileRoute, redirect } from "@tanstack/react-router";
import { getArticleBySlug } from "@/lib/seo-articles.functions";
import {
  ArticlePageLayout,
  buildArticleJsonLd,
  type ArticleFaq,
  type ArticleSection,
} from "@/components/site/ArticlePageLayout";
import { BASE_URL } from "@/lib/brand";

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const splat = ((params as any)._splat ?? "").toString();
    // Bail early for known internal/static paths — only match a single segment.
    if (!splat || splat.includes("/") || splat.startsWith(".")) {
      throw redirect({ to: "/" });
    }
    try {
      const result = await getArticleBySlug({ data: { slug: splat } });
      return result;
    } catch {
      throw redirect({ to: "/" });
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
