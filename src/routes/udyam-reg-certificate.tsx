import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reg-certificate.html?raw";

export const Route = createFileRoute("/udyam-reg-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam reg certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam reg certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam reg certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam reg certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-reg-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam reg certificate" linkTitle="Udyam reg certificate" html={html} />,
});
