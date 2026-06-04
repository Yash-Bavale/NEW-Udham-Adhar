import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/msme-registration-process")({
  head: () => ({
    meta: [
      { title: "MSME Registration Process — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Registration Process. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Registration Process — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Registration Process. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-process" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Process" linkTitle="MSME Registration Process" html={html} />,
});
