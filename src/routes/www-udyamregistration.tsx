import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration.html?raw";

export const Route = createFileRoute("/www-udyamregistration")({
  head: () => ({
    meta: [
      { title: "www UdyamRegistration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for www UdyamRegistration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "www UdyamRegistration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for www UdyamRegistration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/www-udyamregistration" },
    ],
  }),
  component: () => <SeoLandingPage title="www UdyamRegistration" linkTitle="www UdyamRegistration" html={html} />,
});
