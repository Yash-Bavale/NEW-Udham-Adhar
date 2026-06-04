import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-update.html?raw";

export const Route = createFileRoute("/udyam-certificate-update")({
  head: () => ({
    meta: [
      { title: "Udyam certificate update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam certificate update. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam certificate update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam certificate update. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate update" linkTitle="Udyam certificate update" html={html} />,
});
