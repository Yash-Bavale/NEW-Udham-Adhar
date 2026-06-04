import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print.html?raw";

export const Route = createFileRoute("/udyam-print")({
  head: () => ({
    meta: [
      { title: "Udyam Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Print. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Print. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print" linkTitle="Udyam Print" html={html} />,
});
