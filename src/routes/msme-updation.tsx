import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-updation.html?raw";

export const Route = createFileRoute("/msme-updation")({
  head: () => ({
    meta: [
      { title: "MSME Updation - How to Update Your MSME Registration Details" },
      { name: "description", content: "MSME updation allows registered businesses to keep their details current on the Udyam portal. Entrepreneurs can update business type, address, owner..." },
      { property: "og:title", content: "MSME Updation - How to Update Your MSME Registration Details" },
      { property: "og:description", content: "MSME updation allows registered businesses to keep their details current on the Udyam portal. Entrepreneurs can update business type, address, owner..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-updation" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME updation" linkTitle="MSME Updation - How to Update Your MSME Registration Details" content={`MSME updation allows registered businesses to keep their details current on the Udyam portal. Entrepreneurs can update business type, address, owner details, and nature of activity to ensure accuracy and compliance. Regular updates are necessary to maintain eligibility for government schemes, subsidies, loans, and procurement tenders. The process is free, paperless, and secure, ensuring that businesses retain valid MSME status and access benefits without interruption. MSME updation also enhances credibility with financial institutions, clients, and government authorities. Accurate information allows businesses to fully leverage government support, operational guidance, and financial assistance, promoting growth, competitiveness, and sustainability in India’s MSME sector.`} html={html} />,
});
