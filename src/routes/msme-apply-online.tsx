import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-apply-online.html?raw";

export const Route = createFileRoute("/msme-apply-online")({
  head: () => ({
    meta: [
      { title: "MSME Apply Online | Udyam Registration for Small Businesses" },
      { name: "description", content: "MSME Apply Online allows entrepreneurs to register their micro, small, or medium enterprises via the Udyam portal using Aadhaar authentication. The..." },
      { property: "og:title", content: "MSME Apply Online | Udyam Registration for Small Businesses" },
      { property: "og:description", content: "MSME Apply Online allows entrepreneurs to register their micro, small, or medium enterprises via the Udyam portal using Aadhaar authentication. The..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-apply-online" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Apply Online" linkTitle="MSME Apply Online | Udyam Registration for Small Businesses" content={`MSME Apply Online allows entrepreneurs to register their micro, small, or medium enterprises via the Udyam portal using Aadhaar authentication. The process is fast, paperless, and free, providing instant Udyam Registration Number and certificate. This certificate is essential for accessing government loans, subsidies, tenders, and schemes. The portal guides businesses step-by-step, including eligibility criteria, required documents, and verification procedures, ensuring error-free registration. Both new registrations and updates for existing businesses are supported. By applying online, enterprises gain formal recognition, compliance with MSME regulations, and access to financial and operational benefits crucial for business growth and sustainability.`} html={html} />,
});
