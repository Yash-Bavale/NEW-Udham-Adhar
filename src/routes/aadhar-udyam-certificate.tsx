import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-certificate.html?raw";

export const Route = createFileRoute("/aadhar-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" },
      { name: "description", content: "The Aadhar Udyam certificate is issued after linking an entrepreneur’s Aadhaar number with their MSME registration on the official Udyam portal. This digitally signed certificate confirms the business as a registered Micro, Small, or Medium Enterprise, serving as legal proof for banks, financial institutions,..." },
      { property: "og:title", content: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" },
      { property: "og:description", content: "The Aadhar Udyam certificate is issued after linking an entrepreneur’s Aadhaar number with their MSME registration on the official Udyam portal. This digitally signed certificate confirms the business as a registered Micro, Small, or Medium Enterprise, serving as legal proof for banks, financial institutions,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam certificate" linkTitle="Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" html={html} />,
});
