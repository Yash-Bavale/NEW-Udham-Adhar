import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-form.html?raw";

export const Route = createFileRoute("/udyam-registration-form")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Form — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Registration Form. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Registration Form — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Registration Form. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-form" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Form" linkTitle="Udyam Registration Form" html={html} />,
});
