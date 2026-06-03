import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-registration.html?raw";

export const Route = createFileRoute("/msme-udyam-registration")({
    head: () => ({
    meta: [
      { title: "MSME Udyam Adhar - Quick and Free MSME Regist..." },
      { name: "description", content: "Expert consultancy assistance for msme udyam/msme - quick and free msme regist.... Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Udyam Adhar - Quick and Free MSME Regist..." },
      { property: "og:description", content: "Expert consultancy assistance for msme udyam/msme - quick and free msme regist.... Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam Registration" linkTitle="MSME Udyam Registration - Quick and Free MSME Registration" html={html} />,
});
