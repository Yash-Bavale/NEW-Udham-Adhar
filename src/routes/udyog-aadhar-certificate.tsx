import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar certificate" linkTitle="Udyog Aadhar certificate" html={html} />,
});
