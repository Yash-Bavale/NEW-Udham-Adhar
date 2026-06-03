import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-certificate.html?raw";

export const Route = createFileRoute("/aadhar-udyam-certificate")({
    head: () => ({
    meta: [
      { title: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certifica..." },
      { name: "description", content: "Expert consultancy assistance for aadhar udyam certificate - aadhaar linked msme certifica.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Aadhar Udyam Certificate - Aadhaar Linked MSME Certifica..." },
      { property: "og:description", content: "Expert consultancy assistance for aadhar udyam certificate - aadhaar linked msme certifica.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Certificate" linkTitle="Aadhar Udyam Certificate - Aadhaar Linked MSME Certification" html={html} />,
});
