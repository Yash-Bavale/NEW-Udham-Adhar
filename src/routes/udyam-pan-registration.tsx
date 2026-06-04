import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-pan-registration.html?raw";

export const Route = createFileRoute("/udyam-pan-registration")({
  head: () => ({
    meta: [
      { title: "Udyam PAN Registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam PAN Registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam PAN Registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam PAN Registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-pan-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam PAN Registration" linkTitle="Udyam PAN Registration" html={html} />,
});
