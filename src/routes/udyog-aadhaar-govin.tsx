import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-govin.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-govin")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Govin — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyog Aadhaar gov.in was the official government portal for MSME registration, UAN issuance, and verification. It allowed entrepreneurs to register small and medium enterprises using Aadhaar authentication and obtain a unique Udyog Aadhaar Number. Though now replaced by the Udyam Registration system, the portal..." },
      { property: "og:title", content: "Udyog Aadhaar Govin — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyog Aadhaar gov.in was the official government portal for MSME registration, UAN issuance, and verification. It allowed entrepreneurs to register small and medium enterprises using Aadhaar authentication and obtain a unique Udyog Aadhaar Number. Though now replaced by the Udyam Registration system, the portal..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-govin" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Govin" linkTitle="Udyog Aadhaar Govin" html={html} />,
});
