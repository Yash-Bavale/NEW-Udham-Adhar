import { createFileRoute } from "@tanstack/react-router";
import { SeoContentPage, buildSeoJsonLd, type SeoPageData } from "@/components/site/SeoContentPage";
import data from "@/content/seo-batch1/download-udyam-certificate.json";

const page = data as SeoPageData;

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: page.seo.metaTitle },
      { name: "description", content: page.seo.metaDescription },
      { property: "og:title", content: page.seo.ogTitle || page.seo.metaTitle },
      { property: "og:description", content: page.seo.ogDescription || page.seo.metaDescription },
      { property: "og:type", content: "article" },
      { property: "og:url", content: page.canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: page.seo.twitterTitle || page.seo.metaTitle },
      { name: "twitter:description", content: page.seo.twitterDescription || page.seo.metaDescription },
    ],
    links: [{ rel: "canonical", href: page.canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: buildSeoJsonLd(page),
      },
    ],
  }),
  component: () => <SeoContentPage data={page} />,
});
