import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-registration.html?raw";

export const Route = createFileRoute("/udyam-msme-registration")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam MSME Registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam MSME Registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam MSME Registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Registration" linkTitle="Udyam MSME Registration" html={html} />,
});
