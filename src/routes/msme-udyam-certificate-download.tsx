import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/msme-udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Udyam certificate download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Udyam certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Udyam certificate download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Udyam certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam certificate download" linkTitle="MSME Udyam certificate download" html={html} />,
});
