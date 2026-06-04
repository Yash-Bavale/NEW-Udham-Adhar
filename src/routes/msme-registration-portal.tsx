import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-portal.html?raw";

export const Route = createFileRoute("/msme-registration-portal")({
  head: () => ({
    meta: [
      { title: "MSME registration portal — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME registration portal. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME registration portal — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME registration portal. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME registration portal" linkTitle="MSME registration portal" html={html} />,
});
