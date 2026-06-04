import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-download.html?raw";

export const Route = createFileRoute("/udyam-print-download")({
  head: () => ({
    meta: [
      { title: "Udyam Print Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Print Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Print Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Print Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Download" linkTitle="Udyam Print Download" html={html} />,
});
