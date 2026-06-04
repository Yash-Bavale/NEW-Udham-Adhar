import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-with-annexure.html?raw";

export const Route = createFileRoute("/udyam-print-with-annexure")({
  head: () => ({
    meta: [
      { title: "Udyam Print With Annexure — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Print With Annexure. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Print With Annexure — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Print With Annexure. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-with-annexure" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print With Annexure" linkTitle="Udyam Print With Annexure" html={html} />,
});
