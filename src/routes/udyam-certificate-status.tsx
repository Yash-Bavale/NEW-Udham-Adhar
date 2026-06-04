import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-status.html?raw";

export const Route = createFileRoute("/udyam-certificate-status")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Status — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Certificate Status. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Certificate Status — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Certificate Status. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Status" linkTitle="Udyam Certificate Status" html={html} />,
});
