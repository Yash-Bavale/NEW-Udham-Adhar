import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam registration certificate download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam registration certificate download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam registration certificate download" linkTitle="Udyam registration certificate download" html={html} />,
});
