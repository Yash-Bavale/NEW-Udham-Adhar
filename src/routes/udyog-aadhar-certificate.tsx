import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Certificate - Old MSME Registration Document" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar certificate - old msme registration document. Get help with Udyam/MSME registration, updates and certificates ..." },
      { property: "og:title", content: "Udyog Aadhar Certificate - Old MSME Registration Document" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar certificate - old msme registration document. Get help with Udyam/MSME registration, updates and certificates ..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Certificate" linkTitle="Udyog Aadhar Certificate - Old MSME Registration Document" html={html} />,
});
