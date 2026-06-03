import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/https-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/https-udyamregistration-gov-in")({
    head: () => ({
    meta: [
      { title: "https UdyamRegistration.gov.in" },
      { name: "description", content: "Expert consultancy assistance for https udyamregistration.gov.in. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "https UdyamRegistration.gov.in" },
      { property: "og:description", content: "Expert consultancy assistance for https udyamregistration.gov.in. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/https-udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="https UdyamRegistration.gov.in – Official Government MSME Portal" html={html} />,
});
