import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-new-registration.html?raw";

export const Route = createFileRoute("/udyam-new-registration")({
    head: () => ({
    meta: [
      { title: "Udyam New Registration - Step-by-Step MSME Registration..." },
      { name: "description", content: "Expert consultancy assistance for udyam new registration - step-by-step msme registration.... Get help with Udyam/MSME registration, updates and certificates..." },
      { property: "og:title", content: "Udyam New Registration - Step-by-Step MSME Registration..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam new registration - step-by-step msme registration.... Get help with Udyam/MSME registration, updates and certificates..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-new-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam New Registration" linkTitle="Udyam New Registration - Step-by-Step MSME Registration Guide" html={html} />,
});
