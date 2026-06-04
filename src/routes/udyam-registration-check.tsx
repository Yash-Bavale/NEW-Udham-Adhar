import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-check.html?raw";

export const Route = createFileRoute("/udyam-registration-check")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Check — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Registration Check. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Registration Check — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Registration Check. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-check" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Check" linkTitle="Udyam Registration Check" html={html} />,
});
