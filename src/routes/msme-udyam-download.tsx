import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-download.html?raw";

export const Route = createFileRoute("/msme-udyam-download")({
  head: () => ({
    meta: [
      { title: "MSME Udyam download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Udyam download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Udyam download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Udyam download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam download" linkTitle="MSME Udyam download" html={html} />,
});
