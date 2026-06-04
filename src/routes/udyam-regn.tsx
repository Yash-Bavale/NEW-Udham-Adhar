import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-regn.html?raw";

export const Route = createFileRoute("/udyam-regn")({
  head: () => ({
    meta: [
      { title: "Udyam regn — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam regn. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam regn — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam regn. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-regn" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam regn" linkTitle="Udyam regn" html={html} />,
});
