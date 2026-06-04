import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-certificate.html?raw";

export const Route = createFileRoute("/aadhar-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Aadhar Udyam certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Udyam certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Aadhar Udyam certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam certificate" linkTitle="Aadhar Udyam certificate" html={html} />,
});
