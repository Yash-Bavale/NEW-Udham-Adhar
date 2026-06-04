import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Certificate Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam MSME Certificate Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam MSME Certificate Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam MSME Certificate Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate Download" linkTitle="Udyam MSME Certificate Download" html={html} />,
});
