import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-pan-registration.html?raw";

export const Route = createFileRoute("/udyam-pan-registration")({
  head: () => ({
    meta: [
      { title: "Udyam PAN Registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam PAN Registration allows businesses to link their PAN details with the official MSME Udyam certificate. This integration ensures accurate enterprise identification, eligibility for government benefits, and access to bank loans or subsidies. The process is secure, digital, and fully online, requiring Aadhaar..." },
      { property: "og:title", content: "Udyam PAN Registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam PAN Registration allows businesses to link their PAN details with the official MSME Udyam certificate. This integration ensures accurate enterprise identification, eligibility for government benefits, and access to bank loans or subsidies. The process is secure, digital, and fully online, requiring Aadhaar..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-pan-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam PAN Registration" linkTitle="Udyam PAN Registration" html={html} />,
});
