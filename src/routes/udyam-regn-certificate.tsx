import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-regn-certificate.html?raw";

export const Route = createFileRoute("/udyam-regn-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Regn Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Regn Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Regn Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Regn Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-regn-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Regn Certificate" linkTitle="Udyam Regn Certificate" html={html} />,
});
