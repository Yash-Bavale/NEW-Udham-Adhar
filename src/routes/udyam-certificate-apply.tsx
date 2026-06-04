import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply")({
  head: () => ({
    meta: [
      { title: "Udyam certificate apply — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam certificate apply. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam certificate apply — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam certificate apply. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-apply" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate apply" linkTitle="Udyam certificate apply" html={html} />,
});
