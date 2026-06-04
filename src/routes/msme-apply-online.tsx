import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-apply-online.html?raw";

export const Route = createFileRoute("/msme-apply-online")({
  head: () => ({
    meta: [
      { title: "MSME Apply Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Apply Online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Apply Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Apply Online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-apply-online" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Apply Online" linkTitle="MSME Apply Online" html={html} />,
});
