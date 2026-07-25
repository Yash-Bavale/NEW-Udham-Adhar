import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { SeoContentPage, buildSeoJsonLd, type SeoPageData } from "@/components/site/SeoContentPage";
import data from "@/content/seo-batch1/msme-certificate-benefits.json";
import { getContentfulSeoArticle, type ContentfulSeoArticle } from "@/lib/contentful/client.functions";

const page = data as SeoPageData;

export const Route = createFileRoute("/msme-certificate-benefits")({
  loader: async () => {
    const cms = await getContentfulSeoArticle({ data: { slug: "msme-certificate-benefits" } });
    return { cms };
  },
  head: ({ loaderData }) => {
    const cms = (loaderData as { cms: ContentfulSeoArticle | null } | undefined)?.cms;
    const title = cms?.metaTitle || page.seo.metaTitle;
    const desc = cms?.metaDescription || page.seo.metaDescription;
    const canonical = cms?.canonicalUrl || page.canonical;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: page.seo.ogTitle || title },
        { property: "og:description", content: page.seo.ogDescription || desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: page.seo.twitterTitle || title },
        { name: "twitter:description", content: page.seo.twitterDescription || desc },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: buildSeoJsonLd(page),
        },
      ],
    };
  },
  component: RouteView,
});

function RouteView() {
  const { cms } = useLoaderData({ from: "/msme-certificate-benefits" }) as {
    cms: ContentfulSeoArticle | null;
  };
  // If Contentful has a published article with a non-trivial body, prefer its H1;
  // body content still renders from the local JSON for now (rich formatting).
  const merged: SeoPageData = cms?.title
    ? { ...page, h1: cms.title }
    : page;
  return <SeoContentPage data={merged} />;
}
