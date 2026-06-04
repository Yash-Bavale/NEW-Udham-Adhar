import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-online-registration.html?raw";

export const Route = createFileRoute("/msme-online-registration")({
  head: () => ({
    meta: [
      { title: "MSME online registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME online registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME online registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME online registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-online-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME online registration" linkTitle="MSME online registration" html={html} />,
});
