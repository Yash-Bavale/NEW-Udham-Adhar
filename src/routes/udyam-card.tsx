import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card.html?raw";

export const Route = createFileRoute("/udyam-card")({
  head: () => ({
    meta: [
      { title: "Udyam card — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam card. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam card — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam card. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam card" linkTitle="Udyam card" html={html} />,
});
