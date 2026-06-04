import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reprint.html?raw";

export const Route = createFileRoute("/udyam-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Reprint — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Reprint. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Reprint — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Reprint. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Reprint" linkTitle="Udyam Reprint" html={html} />,
});
