import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number.html?raw";

export const Route = createFileRoute("/udyam-registration-number")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Number — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Registration Number. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Registration Number — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Registration Number. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Number" linkTitle="Udyam Registration Number" html={html} />,
});
