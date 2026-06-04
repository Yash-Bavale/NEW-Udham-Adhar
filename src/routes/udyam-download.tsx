import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download.html?raw";

export const Route = createFileRoute("/udyam-download")({
  head: () => ({
    meta: [
      { title: "Udyam download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam download" linkTitle="Udyam download" html={html} />,
});
