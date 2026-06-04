import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-govin.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-govin")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Govin – Official MSME Registration Support" },
      { name: "description", content: "Udyog Aadhaar gov.in was the official government portal for MSME registration, UAN issuance, and verification. It allowed entrepreneurs to register small..." },
      { property: "og:title", content: "Udyog Aadhaar Govin – Official MSME Registration Support" },
      { property: "og:description", content: "Udyog Aadhaar gov.in was the official government portal for MSME registration, UAN issuance, and verification. It allowed entrepreneurs to register small..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-govin" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Govin" linkTitle="Udyog Aadhaar Govin – Official MSME Registration Support" content={`Udyog Aadhaar gov.in was the official government portal for MSME registration, UAN issuance, and verification. It allowed entrepreneurs to register small and medium enterprises using Aadhaar authentication and obtain a unique Udyog Aadhaar Number. Though now replaced by the Udyam Registration system, the portal continues to provide access to old UAN details, verification tools, and migration assistance. Aadhaar-based verification ensures secure access while maintaining the accuracy of historic MSME records. Businesses can check, update, and migrate their registration to Udyam, unlocking enhanced digital services, instant certificate issuance, and continued eligibility for government schemes, loans, subsidies, and procurement opportunities.`} html={html} />,
});
