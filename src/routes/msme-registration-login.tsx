import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-login.html?raw";

export const Route = createFileRoute("/msme-registration-login")({
    head: () => ({
    meta: [
      { title: "MSME Registration Login" },
      { name: "description", content: "Expert consultancy assistance for msme registration login. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Registration Login" },
      { property: "og:description", content: "Expert consultancy assistance for msme registration login. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-login" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Login" linkTitle="MSME Registration Login | Access Your Udyam Certificate Online" html={html} />,
});
