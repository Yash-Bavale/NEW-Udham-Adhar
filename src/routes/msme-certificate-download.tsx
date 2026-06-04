import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-download.html?raw";

export const Route = createFileRoute("/msme-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Certificate Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Certificate Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Certificate Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Download" linkTitle="MSME Certificate Download" html={html} />,
});
