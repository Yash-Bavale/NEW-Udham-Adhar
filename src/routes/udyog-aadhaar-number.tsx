import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-number.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-number")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar number - msme identifier before udyam portal. Get help with Udyam/MSME registration, updates and certificates..." },
      { property: "og:title", content: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar number - msme identifier before udyam portal. Get help with Udyam/MSME registration, updates and certificates..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Number" linkTitle="Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" html={html} />,
});
