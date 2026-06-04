import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-certificate.html?raw";

export const Route = createFileRoute("/udyam-print-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Print Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Print Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Print Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Print Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Certificate" linkTitle="Udyam Print Certificate" html={html} />,
});
