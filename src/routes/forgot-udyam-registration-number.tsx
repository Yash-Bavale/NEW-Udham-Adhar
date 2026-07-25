import { createFileRoute } from "@tanstack/react-router";
import { getContentfulSeoArticle, type ContentfulSeoArticle } from "@/lib/contentful/client.functions";
import { SeoContentPage, buildSeoJsonLd, type SeoPageData } from "@/components/site/SeoContentPage";
import data from "@/content/seo-batch1/forgot-udyam-registration-number.json";

const page = data as SeoPageData;

export const Route = createFileRoute("/forgot-udyam-registration-number")({
  loader: async () => ({ cms: await getContentfulSeoArticle({ data: { slug: "forgot-udyam-registration-number" } }) }),
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
  component: () => <SeoContentPage data={page} />,
});
