import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/msme-registration-process")({
    head: () => ({
    meta: [
      { title: "MSME Registration Process" },
      { name: "description", content: "Expert consultancy assistance for msme registration process. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Registration Process" },
      { property: "og:description", content: "Expert consultancy assistance for msme registration process. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-process" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Process – Step-by-Step Guide for Udyam MSME Registration" html={html} />,
});
