import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-card.html?raw";

export const Route = createFileRoute("/udyog-aadhar-card")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar card — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar card. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar card — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar card. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar card" linkTitle="Udyog Aadhar card" html={html} />,
});
