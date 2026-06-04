import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-login.html?raw";

export const Route = createFileRoute("/msme-registration-login")({
  head: () => ({
    meta: [
      { title: "MSME Registration Login — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Registration Login. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Registration Login — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Registration Login. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-login" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Login" linkTitle="MSME Registration Login" html={html} />,
});
