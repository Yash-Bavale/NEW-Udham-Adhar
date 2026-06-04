import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-card.html?raw";

export const Route = createFileRoute("/udyog-aadhar-card")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Card - Old MSME Registration Document
Meta Description: The Udyog Aadhar card was issued to MSMEs under the older registration system to serve as proof of enterprise status. It allowed businesses to access government schemes, subsidies, loans, and participation in procurement tenders. While the card remains valid, businesses are encouraged to register on the modern Udyam portal for instant issuance of digitally signed MSME certificates, faster updates, and broader eligibility for benefits. The Udyog Aadhar card ensured formal recognition, enhanced credibility with banks and clients, and supported access to government financial programs. Migrating to the Udyam portal provides entrepreneurs with a secure, paperless system for MSME certification while retaining all advantages of the previous registration, including legal proof and access to government schemes." },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar card. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar Card - Old MSME Registration Document
Meta Description: The Udyog Aadhar card was issued to MSMEs under the older registration system to serve as proof of enterprise status. It allowed businesses to access government schemes, subsidies, loans, and participation in procurement tenders. While the card remains valid, businesses are encouraged to register on the modern Udyam portal for instant issuance of digitally signed MSME certificates, faster updates, and broader eligibility for benefits. The Udyog Aadhar card ensured formal recognition, enhanced credibility with banks and clients, and supported access to government financial programs. Migrating to the Udyam portal provides entrepreneurs with a secure, paperless system for MSME certification while retaining all advantages of the previous registration, including legal proof and access to government schemes." },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar card. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar card" linkTitle="Udyog Aadhar Card - Old MSME Registration Document
Meta Description: The Udyog Aadhar card was issued to MSMEs under the older registration system to serve as proof of enterprise status. It allowed businesses to access government schemes, subsidies, loans, and participation in procurement tenders. While the card remains valid, businesses are encouraged to register on the modern Udyam portal for instant issuance of digitally signed MSME certificates, faster updates, and broader eligibility for benefits. The Udyog Aadhar card ensured formal recognition, enhanced credibility with banks and clients, and supported access to government financial programs. Migrating to the Udyam portal provides entrepreneurs with a secure, paperless system for MSME certification while retaining all advantages of the previous registration, including legal proof and access to government schemes." html={html} />,
});
