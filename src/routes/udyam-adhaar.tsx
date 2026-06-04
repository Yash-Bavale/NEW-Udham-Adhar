import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhaar.html?raw";

export const Route = createFileRoute("/udyam-adhaar")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration" },
      { name: "description", content: "Udyam Aadhaar links your personal Aadhaar number with your business to enable fast, secure, and paperless MSME registration on the government’s Udyam portal. This Aadhaar-based verification ensures authenticity and allows instant issuance of a digitally signed MSME certificate, serving as legal proof of enterprise..." },
      { property: "og:title", content: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration" },
      { property: "og:description", content: "Udyam Aadhaar links your personal Aadhaar number with your business to enable fast, secure, and paperless MSME registration on the government’s Udyam portal. This Aadhaar-based verification ensures authenticity and allows instant issuance of a digitally signed MSME certificate, serving as legal proof of enterprise..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhaar" linkTitle="Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration" html={html} />,
});
