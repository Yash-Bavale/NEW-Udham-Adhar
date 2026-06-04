import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-card.html?raw";

export const Route = createFileRoute("/udyog-aadhar-card")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Card - Old MSME Registration Document" },
      { name: "description", content: "The Udyog Aadhar card was issued to MSMEs under the older registration system to serve as proof of enterprise status. It allowed businesses to access government schemes, subsidies, loans, and participation in procurement tenders. While the card remains valid, businesses are encouraged to register on the modern..." },
      { property: "og:title", content: "Udyog Aadhar Card - Old MSME Registration Document" },
      { property: "og:description", content: "The Udyog Aadhar card was issued to MSMEs under the older registration system to serve as proof of enterprise status. It allowed businesses to access government schemes, subsidies, loans, and participation in procurement tenders. While the card remains valid, businesses are encouraged to register on the modern..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar card" linkTitle="Udyog Aadhar Card - Old MSME Registration Document" html={html} />,
});
