import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-regn.html?raw";

export const Route = createFileRoute("/udyam-regn")({
    head: () => ({
    meta: [
      { title: "Udyam Regn - Quick MSME Registration Online" },
      { name: "description", content: "Expert consultancy assistance for udyam regn - quick msme registration online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Regn - Quick MSME Registration Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam regn - quick msme registration online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-regn" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Regn - Quick MSME Registration Online" html={html} />,
});
