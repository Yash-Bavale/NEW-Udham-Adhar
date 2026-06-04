import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-msme-certificate.html?raw";

export const Route = createFileRoute("/download-msme-certificate")({
  head: () => ({
    meta: [
      { title: "Download MSME certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Download MSME certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Download MSME certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Download MSME certificate. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-msme-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download MSME certificate" linkTitle="Download MSME certificate" html={html} />,
});
