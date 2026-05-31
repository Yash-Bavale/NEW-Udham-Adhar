import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-certificate.html?raw";

export const Route = createFileRoute("/udyam-print-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam Print Certificate | MSME Certificate Printing Guide" },
      { name: "description", content: "Expert consultancy assistance for udyam print certificate | msme certificate printing guide. Get help with Udyam/MSME registration, updates and certificates ..." },
      { property: "og:title", content: "Udyam Print Certificate | MSME Certificate Printing Guide" },
      { property: "og:description", content: "Expert consultancy assistance for udyam print certificate | msme certificate printing guide. Get help with Udyam/MSME registration, updates and certificates ..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Certificate | MSME Certificate Printing Guide" html={html} />,
});
