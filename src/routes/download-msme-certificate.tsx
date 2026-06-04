import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-msme-certificate.html?raw";

export const Route = createFileRoute("/download-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Download MSME Certificate - Importance and Benefits for Small Businesses" },
      { name: "description", content: "Download MSME certificate is the process of obtaining the official document certifying your business as a micro, small, or medium enterprise under the Udyam registration system. This certificate is essential for accessing government schemes, financial assistance, priority lending, interest subsidies, procurement..." },
      { property: "og:title", content: "Download MSME Certificate - Importance and Benefits for Small Businesses" },
      { property: "og:description", content: "Download MSME certificate is the process of obtaining the official document certifying your business as a micro, small, or medium enterprise under the Udyam registration system. This certificate is essential for accessing government schemes, financial assistance, priority lending, interest subsidies, procurement..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download MSME certificate" linkTitle="Download MSME Certificate - Importance and Benefits for Small Businesses" html={html} />,
});
