import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-portal.html?raw";

export const Route = createFileRoute("/udyam-portal")({
  head: () => ({
    meta: [
      { title: "Udyam portal — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam portal. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam portal — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam portal. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam portal" linkTitle="Udyam portal" html={html} />,
});
