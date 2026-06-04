import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-number.html?raw";

export const Route = createFileRoute("/udyam-number")({
  head: () => ({
    meta: [
      { title: "Udyam number — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam number. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam number — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam number. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam number" linkTitle="Udyam number" html={html} />,
});
