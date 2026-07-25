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
  const overrides = cms ? {
    h1: cms.title,
    metaTitle: cms.metaTitle,
    metaDescription: cms.metaDescription,
    aiOverview: cms.aiOverview,
    quickFacts: cms.quickFacts,
    body: cms.bodySections,
    eeat: cms.eeat,
    faq: cms.faqs,
    internalLinks: cms.internalLinks,
    howto: cms.howto,
    cta: cms.ctas,
  } : null;
  return <SeoContentPage data={page} overrides={overrides} />;
}
