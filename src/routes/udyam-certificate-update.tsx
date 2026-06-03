import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-update.html?raw";

export const Route = createFileRoute("/udyam-certificate-update")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate Update - Modify Your MSME Registration..." },
      { name: "description", content: "Expert consultancy assistance for udyam certificate update - modify your msme registration.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Certificate Update - Modify Your MSME Registration..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate update - modify your msme registration.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Update - Modify Your MSME Registration Details" html={html} />,
});
