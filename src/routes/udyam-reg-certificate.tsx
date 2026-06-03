import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reg-certificate.html?raw";

export const Route = createFileRoute("/udyam-reg-certificate")({
    head: () => ({
    meta: [
      { title: "Udyam Reg Certificate - Download MSME Registration Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam reg certificate - download msme registration certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Reg Certificate - Download MSME Registration Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam reg certificate - download msme registration certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-reg-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Reg Certificate" linkTitle="Udyam Reg Certificate - Download MSME Registration Certificate" html={html} />,
});
