import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card-download.html?raw";

export const Route = createFileRoute("/udyam-card-download")({
  head: () => ({
    meta: [
      { title: "Udyam Card Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Card Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Card Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Card Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-card-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Card Download" linkTitle="Udyam Card Download" html={html} />,
});
