import { createFileRoute } from "@tanstack/react-router";
import { getContentfulSeoArticle, type ContentfulSeoArticle } from "@/lib/contentful/client.functions";
import { SeoContentPage, buildSeoJsonLd, type SeoPageData } from "@/components/site/SeoContentPage";
import data from "@/content/seo-batch1/udyam-registration-benefits.json";

const page = data as SeoPageData;

export const Route = createFileRoute("/udyam-registration-benefits")({
  loader: async () => ({ cms: await getContentfulSeoArticle({ data: { slug: "udyam-registration-benefits" } }) }),
  head: ({ loaderData }) => {
    const cms = (loaderData as { cms: ContentfulSeoArticle | null } | undefined)?.cms;
    return ({
    meta: [
      { title: cms?.metaTitle || page.seo.metaTitle },
      { name: "description", content: cms?.metaDescription || page.seo.metaDescription },
      { property: "og:title", content: page.seo.ogTitle || cms?.metaTitle || page.seo.metaTitle },
      { property: "og:description", content: page.seo.ogDescription || cms?.metaDescription || page.seo.metaDescription },
      { property: "og:type", content: "article" },
      { property: "og:url", content: cms?.canonicalUrl || page.canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.seo.twitterTitle || page.seo.metaTitle },
      { name: "twitter:description", content: page.seo.twitterDescription || page.seo.metaDescription },
    ],
    links: [{ rel: "canonical", href: cms?.canonicalUrl || page.canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: buildSeoJsonLd(page),
      },
    ],
  });
  },
  component: function SeoRoute() {
    const { cms } = Route.useLoaderData() as { cms: ContentfulSeoArticle | null };
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
  },
});
