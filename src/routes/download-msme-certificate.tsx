import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-msme-certificate.html?raw";

export const Route = createFileRoute("/download-msme-certificate")({
    head: () => ({
    meta: [
      { title: "Download MSME Certificate - Importance and Benefits for..." },
      { name: "description", content: "Expert consultancy assistance for download msme certificate - importance and benefits for.... Get help with Udyam/MSME registration, updates and certificates..." },
      { property: "og:title", content: "Download MSME Certificate - Importance and Benefits for..." },
      { property: "og:description", content: "Expert consultancy assistance for download msme certificate - importance and benefits for.... Get help with Udyam/MSME registration, updates and certificates..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download MSME Certificate - Importance and Benefits for Small Businesses" html={html} />,
});
