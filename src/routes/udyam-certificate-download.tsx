import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam certificate download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam certificate download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate download" linkTitle="Udyam certificate download" html={html} />,
});
