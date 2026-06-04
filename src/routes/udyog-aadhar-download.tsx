import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Download" linkTitle="Udyog Aadhar Download" html={html} />,
});
