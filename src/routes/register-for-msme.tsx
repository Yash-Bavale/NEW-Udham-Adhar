import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/register-for-msme.html?raw";

export const Route = createFileRoute("/register-for-msme")({
  head: () => ({
    meta: [
      { title: "Register for MSME — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Register for MSME. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Register for MSME — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Register for MSME. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/register-for-msme" },
    ],
  }),
  component: () => <SeoLandingPage title="Register for MSME" linkTitle="Register for MSME" html={html} />,
});
