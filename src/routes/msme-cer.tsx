import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-cer.html?raw";

export const Route = createFileRoute("/msme-cer")({
  head: () => ({
    meta: [
      { title: "MSME Cer — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Cer. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Cer — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Cer. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-cer" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Cer" linkTitle="MSME Cer" html={html} />,
});
