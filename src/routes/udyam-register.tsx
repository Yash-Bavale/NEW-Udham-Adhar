import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register.html?raw";

export const Route = createFileRoute("/udyam-register")({
    head: () => ({
    meta: [
      { title: "Udyam Register - How to Register Your Business as MSME" },
      { name: "description", content: "Expert consultancy assistance for udyam register - how to register your business as msme. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "Udyam Register - How to Register Your Business as MSME" },
      { property: "og:description", content: "Expert consultancy assistance for udyam register - how to register your business as msme. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Register - How to Register Your Business as MSME" html={html} />,
});
