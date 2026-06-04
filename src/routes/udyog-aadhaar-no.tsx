import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-no.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-no")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar No — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhaar No. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar No — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhaar No. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-no" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar No" linkTitle="Udyog Aadhaar No" html={html} />,
});
