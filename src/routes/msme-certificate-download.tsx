import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-download.html?raw";

export const Route = createFileRoute("/msme-certificate-download")({
    head: () => ({
    meta: [
      { title: "MSME Certificate Download - Get Your MSME Certificate On..." },
      { name: "description", content: "Expert consultancy assistance for msme certificate download - get your msme certificate on.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "MSME Certificate Download - Get Your MSME Certificate On..." },
      { property: "og:description", content: "Expert consultancy assistance for msme certificate download - get your msme certificate on.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Download" linkTitle="MSME Certificate Download - Get Your MSME Certificate Online" html={html} />,
});
