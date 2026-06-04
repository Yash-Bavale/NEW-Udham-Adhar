import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhar-download.html?raw";

export const Route = createFileRoute("/udyam-adhar-download")({
  head: () => ({
    meta: [
      { title: "Udyam Adhar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Adhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Adhar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Adhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhar Download" linkTitle="Udyam Adhar Download" html={html} />,
});
