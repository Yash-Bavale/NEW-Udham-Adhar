import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam.html?raw";

export const Route = createFileRoute("/print-udyam")({
  head: () => ({
    meta: [
      { title: "Print Udyam — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Print Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Print Udyam — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Print Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam" linkTitle="Print Udyam" html={html} />,
});
