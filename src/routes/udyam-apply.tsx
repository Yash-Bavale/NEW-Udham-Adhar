import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-apply.html?raw";

export const Route = createFileRoute("/udyam-apply")({
  head: () => ({
    meta: [
      { title: "Udyam Apply — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Apply. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Apply — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Apply. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-apply" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Apply" linkTitle="Udyam Apply" html={html} />,
});
