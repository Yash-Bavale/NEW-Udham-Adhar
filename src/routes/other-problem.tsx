import { createFileRoute } from "@tanstack/react-router";
import {
  getContentfulSeoArticle,
  getContentfulServicePage,
  type ContentfulSeoArticle,
  type ContentfulServicePage,
} from "@/lib/contentful/client.functions";
import { cfToSeoPageData } from "@/lib/contentful/seo-page-data";
import { SeoContentPage, buildSeoJsonLd } from "@/components/site/SeoContentPage";
import { RichServicePage } from "@/components/site/RichServicePage";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/other-problem")({
  loader: async () => {
    const [cfArticle, cms] = await Promise.all([
      getContentfulSeoArticle({ data: { slug: "other-problem" } }).catch(() => null),
      getContentfulServicePage({ data: { slug: "other-problem" } }).catch(() => null),
    ]);
    return { cfArticle, cms };
  },
  head: ({ loaderData }) => {
    const data = loaderData as {
      cfArticle: ContentfulSeoArticle | null;
      cms: ContentfulServicePage | null;
    } | undefined;
    if (data?.cfArticle) {
      const d = cfToSeoPageData(data.cfArticle);
      return {
        meta: [
          { title: d.seo.metaTitle },
          { name: "description", content: d.seo.metaDescription },
          { property: "og:title", content: d.seo.ogTitle },
          { property: "og:description", content: d.seo.ogDescription },
          { property: "og:type", content: "article" },
          { property: "og:url", content: d.canonical },
        ],
        links: [{ rel: "canonical", href: d.canonical }],
        scripts: [{ type: "application/ld+json", children: buildSeoJsonLd(d) }],
      };
    }
    const cms = data?.cms;
    return {
      meta: [
        { title: cms?.metaTitle || "Other Udyam Problems — Forgot OTP, Mobile, PAN/Aadhaar Issues" },
        { name: "description", content: cms?.metaDescription || "Help with forgotten registered mobile/email, PAN/Aadhaar name mismatch, and other Udyam Adhar issues." },
        { property: "og:title", content: cms?.metaTitle || "Other Udyam Adhar Problems" },
        { property: "og:description", content: cms?.metaDescription || "Get consultancy help for forgotten OTP, mobile/email recovery, PAN/Aadhaar corrections, and more." },
      ],
      links: [
        { rel: "canonical", href: "https://udyamadhar.in/other-problem" },
      ],
    };
  },
  component: function OtherProblemPage() {
    const { cfArticle, cms } = Route.useLoaderData() as {
      cfArticle: ContentfulSeoArticle | null;
      cms: ContentfulServicePage | null;
    };
    if (cfArticle) {
      return <SeoContentPage data={cfToSeoPageData(cfArticle)} />;
    }
    if (cms?.longDescription) {
      return (
        <RichServicePage
          serviceTitle={cms.name || "Other Problem"}
          h1={cms.name}
          intro={cms.shortDescription}
          longDescriptionHtml={cms.longDescription}
        />
      );
    }
    return <SeoLandingPage title="Other Problem" linkTitle="Udyog Aadhar Registration" html={html} />;
  },
});
