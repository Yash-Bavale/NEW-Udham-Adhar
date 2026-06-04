import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-registration.html?raw";

export const Route = createFileRoute("/msme-udyam-registration")({
  head: () => ({
    meta: [
      { title: "MSME Udyam registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Udyam registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Udyam registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Udyam registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam registration" linkTitle="MSME Udyam registration" html={html} />,
});
