import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar.html?raw";

export const Route = createFileRoute("/udyog-aadhaar")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar - Previous MSME Registration System" },
      { name: "description", content: "Udyog Aadhaar was the government’s earlier system for registering micro, small, and medium enterprises before the introduction of the Udyam portal. Through Udyog Aadhaar, businesses applied online to receive a unique Udyog Aadhaar Number (UAN) and a certificate that verified their MSME status. The certificate..." },
      { property: "og:title", content: "Udyog Aadhaar - Previous MSME Registration System" },
      { property: "og:description", content: "Udyog Aadhaar was the government’s earlier system for registering micro, small, and medium enterprises before the introduction of the Udyam portal. Through Udyog Aadhaar, businesses applied online to receive a unique Udyog Aadhaar Number (UAN) and a certificate that verified their MSME status. The certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar" linkTitle="Udyog Aadhaar - Previous MSME Registration System" html={html} />,
});
