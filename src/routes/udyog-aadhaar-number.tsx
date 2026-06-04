import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-number.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-number")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar number — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhaar number. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar number — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhaar number. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar number" linkTitle="Udyog Aadhaar number" html={html} />,
});
