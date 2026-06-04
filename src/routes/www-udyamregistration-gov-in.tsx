import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/www-udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "www.udyamregistration gov in — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for www.udyamregistration gov in. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "www.udyamregistration gov in — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for www.udyamregistration gov in. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/www-udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="www.udyamregistration gov in" linkTitle="www.udyamregistration gov in" html={html} />,
});
