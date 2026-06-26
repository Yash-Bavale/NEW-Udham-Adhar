import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-number.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-number")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" },
      { name: "description", content: "The Udyog Aadhaar number was the unique identifier provided to businesses under the older MSME registration system before the introduction of the Udyam..." },
      { property: "og:title", content: "Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" },
      { property: "og:description", content: "The Udyog Aadhaar number was the unique identifier provided to businesses under the older MSME registration system before the introduction of the Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhaar-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar number" linkTitle="Udyog Aadhaar Number - MSME Identifier Before Udyam Portal" content={`The Udyog Aadhaar number was the unique identifier provided to businesses under the older MSME registration system before the introduction of the Udyam portal. This number served as proof of Micro, Small, or Medium Enterprise status and allowed businesses to access government schemes, loans, subsidies, priority lending, and participation in procurement tenders. While still valid, the government recommends transitioning to Udyam registration for faster, digital certificate issuance and broader access to benefits. The Udyog Aadhaar number was essential for authenticating business identity, maintaining credibility with banks and clients, and ensuring eligibility for financial and operational support. Migrating to Udyam registration provides entrepreneurs with a secure, paperless, and reliable method to obtain digitally signed certificates, maintain accurate records, and enjoy uninterrupted access to government programs aimed at supporting MSME growth, sustainability, and long-term market competitiveness.`} html={html} />,
});
