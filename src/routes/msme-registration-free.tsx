import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-free.html?raw";

export const Route = createFileRoute("/msme-registration-free")({
  head: () => ({
    meta: [
      { title: "MSME Registration Free – Government Udyam Registration" },
      { name: "description", content: "MSME registration on the Udyam portal is completely free, with no fees or hidden charges. Entrepreneurs can register their micro, small, or medium..." },
      { property: "og:title", content: "MSME Registration Free – Government Udyam Registration" },
      { property: "og:description", content: "MSME registration on the Udyam portal is completely free, with no fees or hidden charges. Entrepreneurs can register their micro, small, or medium..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Free" linkTitle="MSME Registration Free – Government Udyam Registration" content={`MSME registration on the Udyam portal is completely free, with no fees or hidden charges. Entrepreneurs can register their micro, small, or medium enterprises online using Aadhaar authentication. Upon registration, businesses receive an instant, digitally signed Udyam Certificate, proving their MSME status. This certificate allows access to government schemes, subsidies, loans, and priority procurement opportunities. The portal ensures a secure, paperless, and convenient registration process for startups and established businesses. By providing free registration, the government supports formalization, credibility, and operational growth of enterprises across India, making it easier to participate in financial programs and expand business opportunities.`} html={html} />,
});
