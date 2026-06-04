import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhaar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhaar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Download" linkTitle="Udyog Aadhaar Download" html={html} />,
});
