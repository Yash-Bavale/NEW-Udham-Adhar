import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/ms-me-certificate.html?raw";

export const Route = createFileRoute("/ms-me-certificate")({
  head: () => ({
    meta: [
      { title: "MS ME Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MS ME Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MS ME Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MS ME Certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/ms-me-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MS ME Certificate" linkTitle="MS ME Certificate" html={html} />,
});
