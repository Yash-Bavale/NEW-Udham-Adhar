import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-update")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhaar Update. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar Update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhaar Update. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Update" linkTitle="Udyog Aadhaar Update" html={html} />,
});
