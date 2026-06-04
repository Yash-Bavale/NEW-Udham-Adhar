import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate.html?raw";

export const Route = createFileRoute("/msme-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate" linkTitle="MSME Certificate" html={html} />,
});
