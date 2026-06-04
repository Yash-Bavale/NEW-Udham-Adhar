import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register.html?raw";

export const Route = createFileRoute("/udyam-register")({
  head: () => ({
    meta: [
      { title: "Udyam register — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam register. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam register — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam register. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam register" linkTitle="Udyam register" html={html} />,
});
