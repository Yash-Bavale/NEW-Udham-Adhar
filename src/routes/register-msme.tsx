import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/register-msme.html?raw";

export const Route = createFileRoute("/register-msme")({
    head: () => ({
    meta: [
      { title: "Register MSME - Online Process for Business Registration" },
      { name: "description", content: "Expert consultancy assistance for register msme - online process for business registration. Get help with Udyam/MSME registration, updates and certificates a..." },
      { property: "og:title", content: "Register MSME - Online Process for Business Registration" },
      { property: "og:description", content: "Expert consultancy assistance for register msme - online process for business registration. Get help with Udyam/MSME registration, updates and certificates a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/register-msme" },
    ],
  }),
  component: () => <SeoLandingPage title="Register MSME - Online Process for Business Registration" html={html} />,
});
