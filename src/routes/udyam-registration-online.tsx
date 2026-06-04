import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-online.html?raw";

export const Route = createFileRoute("/udyam-registration-online")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Registration Online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Registration Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Registration Online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Online" linkTitle="Udyam Registration Online" html={html} />,
});
