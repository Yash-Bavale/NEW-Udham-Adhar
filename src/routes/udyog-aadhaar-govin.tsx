import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-govin.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-govin")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Govin — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhaar Govin. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar Govin — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhaar Govin. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-govin" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Govin" linkTitle="Udyog Aadhaar Govin" html={html} />,
});
