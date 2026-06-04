import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-charges.html?raw";

export const Route = createFileRoute("/msme-registration-charges")({
  head: () => ({
    meta: [
      { title: "MSME registration charges — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME registration charges. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME registration charges — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME registration charges. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-charges" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME registration charges" linkTitle="MSME registration charges" html={html} />,
});
