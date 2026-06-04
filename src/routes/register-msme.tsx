import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/register-msme.html?raw";

export const Route = createFileRoute("/register-msme")({
  head: () => ({
    meta: [
      { title: "Register MSME — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Register MSME. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Register MSME — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Register MSME. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/register-msme" },
    ],
  }),
  component: () => <SeoLandingPage title="Register MSME" linkTitle="Register MSME" html={html} />,
});
