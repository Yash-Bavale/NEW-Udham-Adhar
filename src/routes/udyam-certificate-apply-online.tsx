import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply-online.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply-online")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Apply | Register Your MSME Online" },
      { name: "description", content: "Udyam Certificate Apply provides a fast and secure way for businesses to register under the MSME scheme and obtain their official certificate. By entering..." },
      { property: "og:title", content: "Udyam Certificate Apply | Register Your MSME Online" },
      { property: "og:description", content: "Udyam Certificate Apply provides a fast and secure way for businesses to register under the MSME scheme and obtain their official certificate. By entering..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-certificate-apply-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Apply Online" linkTitle="Udyam Certificate Apply | Register Your MSME Online" content={`Udyam Certificate Apply provides a fast and secure way for businesses to register under the MSME scheme and obtain their official certificate. By entering Aadhaar and business details, the certificate is issued instantly in PDF format for banking, tenders, and government schemes. The process is completely online, paperless, and free of charge. Step-by-step guidance ensures entrepreneurs can complete the application without errors. Receiving the Udyam Certificate confirms enterprise classification and eligibility for subsidies, loans, and other government benefits. Udyam Certificate Apply streamlines MSME registration and enhances operational credibility for micro, small, and medium enterprises.`} html={html} />,
});
