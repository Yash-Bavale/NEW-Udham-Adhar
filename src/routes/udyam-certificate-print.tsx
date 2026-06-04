import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-print.html?raw";

export const Route = createFileRoute("/udyam-certificate-print")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Certificate Print. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Certificate Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Certificate Print. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Print" linkTitle="Udyam Certificate Print" html={html} />,
});
