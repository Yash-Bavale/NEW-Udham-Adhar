import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhaar.html?raw";

export const Route = createFileRoute("/udyam-adhaar")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration" },
      { name: "description", content: "Udyam Aadhaar links your personal Aadhaar number with your business to enable fast, secure, and paperless MSME registration on the government’s Udyam..." },
      { property: "og:title", content: "Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration" },
      { property: "og:description", content: "Udyam Aadhaar links your personal Aadhaar number with your business to enable fast, secure, and paperless MSME registration on the government’s Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhaar" linkTitle="Udyam Aadhaar - Aadhaar-Based Verification for MSME Registration" content={`Udyam Aadhaar links your personal Aadhaar number with your business to enable fast, secure, and paperless MSME registration on the government’s Udyam portal. This Aadhaar-based verification ensures authenticity and allows instant issuance of a digitally signed MSME certificate, serving as legal proof of enterprise status. The system simplifies registration, reduces paperwork, and allows easy updates of business information such as address, category, or contact details. By linking Aadhaar, entrepreneurs and businesses can access multiple government benefits, including loans, subsidies, priority lending, and participation in procurement tenders. Udyam Aadhaar ensures secure verification, formal recognition, and credibility with banks, financial institutions, and government authorities. The digital approach supports startups, small enterprises, and established businesses in obtaining official certification quickly, maintaining compliance, and leveraging government support for growth, market expansion, and long-term sustainability.`} html={html} />,
});
