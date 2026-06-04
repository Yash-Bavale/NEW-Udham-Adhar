import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-fee.html?raw";

export const Route = createFileRoute("/msme-registration-fee")({
  head: () => ({
    meta: [
      { title: "MSME registration fee — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME registration fee. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME registration fee — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME registration fee. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-fee" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME registration fee" linkTitle="MSME registration fee" html={html} />,
});
