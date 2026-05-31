import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-regn-certificate.html?raw";

export const Route = createFileRoute("/udyam-regn-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam Regn Certificate - MSME Registration Proof" },
      { name: "description", content: "Expert consultancy assistance for udyam regn certificate - msme registration proof. Get help with Udyam/MSME registration, updates and certificates across In..." },
      { property: "og:title", content: "Udyam Regn Certificate - MSME Registration Proof" },
      { property: "og:description", content: "Expert consultancy assistance for udyam regn certificate - msme registration proof. Get help with Udyam/MSME registration, updates and certificates across In..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-regn-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Regn Certificate - MSME Registration Proof" html={html} />,
});
