import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download-certificate.html?raw";

export const Route = createFileRoute("/udyam-download-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam Download Certificate - Instant MSME Certificate Ac..." },
      { name: "description", content: "Expert consultancy assistance for udyam download certificate - instant msme certificate ac.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Download Certificate - Instant MSME Certificate Ac..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam download certificate - instant msme certificate ac.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download Certificate" linkTitle="Udyam Download Certificate - Instant MSME Certificate Access" html={html} />,
});
