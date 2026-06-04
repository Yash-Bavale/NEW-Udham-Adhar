import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-free.html?raw";

export const Route = createFileRoute("/msme-registration-free")({
  head: () => ({
    meta: [
      { title: "MSME Registration Free — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Registration Free. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Registration Free — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Registration Free. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-free" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Free" linkTitle="MSME Registration Free" html={html} />,
});
