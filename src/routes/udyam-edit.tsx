import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-edit.html?raw";

export const Route = createFileRoute("/udyam-edit")({
  head: () => ({
    meta: [
      { title: "Udyam Edit — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Edit. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Edit — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Edit. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-edit" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Edit" linkTitle="Udyam Edit" html={html} />,
});
