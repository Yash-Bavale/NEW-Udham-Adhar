import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam msme certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam msme certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate" html={html} />,
});
