import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/msme-udyam-certificate-download")({
    head: () => ({
    meta: [
      { title: "MSME Udyam Certificate Download - Instant Online Access" },
      { name: "description", content: "Expert consultancy assistance for msme udyam certificate download - instant online access. Get help with Udyam/MSME registration, updates and certificates ac..." },
      { property: "og:title", content: "MSME Udyam Certificate Download - Instant Online Access" },
      { property: "og:description", content: "Expert consultancy assistance for msme udyam certificate download - instant online access. Get help with Udyam/MSME registration, updates and certificates ac..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam Certificate Download - Instant Online Access" html={html} />,
});
