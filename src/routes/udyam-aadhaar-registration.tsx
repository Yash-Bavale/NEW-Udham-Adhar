import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Registration - Link Aadhaar for MSME Registration" },
      { name: "description", content: "Udyam Aadhaar registration is the official process of linking an entrepreneur’s Aadhaar number with their MSME registration on the Udyam portal. This..." },
      { property: "og:title", content: "Udyam Aadhaar Registration - Link Aadhaar for MSME Registration" },
      { property: "og:description", content: "Udyam Aadhaar registration is the official process of linking an entrepreneur’s Aadhaar number with their MSME registration on the Udyam portal. This..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-aadhaar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar registration" linkTitle="Udyam Aadhaar Registration - Link Aadhaar for MSME Registration" content={`Udyam Aadhaar registration is the official process of linking an entrepreneur’s Aadhaar number with their MSME registration on the Udyam portal. This Aadhaar linkage ensures secure, fast, and paperless registration, allowing businesses to complete the process without submitting physical documents. Once registration is completed, a digitally signed MSME certificate is issued instantly, providing proof of the enterprise’s legal status. The Udyam Aadhaar registration simplifies verification for banks, financial institutions, and government authorities, ensuring authenticity and compliance. It also allows businesses to update their details online, access government schemes, and avail of loans, subsidies, and other benefits designed for micro, small, and medium enterprises. By completing Udyam Aadhaar registration, startups, small businesses, and existing enterprises gain credibility, formal recognition, and uninterrupted eligibility for financial assistance and government support programs, all through a seamless digital process.`} html={html} />,
});
