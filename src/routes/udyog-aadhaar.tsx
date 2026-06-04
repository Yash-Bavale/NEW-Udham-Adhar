import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar.html?raw";

export const Route = createFileRoute("/udyog-aadhaar")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhaar. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhaar — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhaar. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar" linkTitle="Udyog Aadhaar" html={html} />,
});
