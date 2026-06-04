import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-updation.html?raw";

export const Route = createFileRoute("/msme-updation")({
  head: () => ({
    meta: [
      { title: "MSME updation — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME updation. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME updation — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME updation. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-updation" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME updation" linkTitle="MSME updation" html={html} />,
});
