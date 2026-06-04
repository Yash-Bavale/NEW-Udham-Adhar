import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-registration.html?raw";

export const Route = createFileRoute("/msme-udyam-registration")({
  head: () => ({
    meta: [
      { title: "MSME Udyam Registration - Quick and Free MSME Registration" },
      { name: "description", content: "MSME Udyam registration is the official online process that allows businesses to register as Micro, Small, or Medium Enterprises under the Government of India’s Udyam portal. The registration is free, paperless, and fast, designed to simplify formal recognition for small and medium businesses across India...." },
      { property: "og:title", content: "MSME Udyam Registration - Quick and Free MSME Registration" },
      { property: "og:description", content: "MSME Udyam registration is the official online process that allows businesses to register as Micro, Small, or Medium Enterprises under the Government of India’s Udyam portal. The registration is free, paperless, and fast, designed to simplify formal recognition for small and medium businesses across India...." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam Registration" linkTitle="MSME Udyam Registration - Quick and Free MSME Registration" html={html} />,
});
