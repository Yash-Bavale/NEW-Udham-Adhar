import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam.html?raw";

export const Route = createFileRoute("/udyam")({
  head: () => ({
    meta: [
      { title: "Udyam — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam" linkTitle="Udyam" html={html} />,
});
