import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration.html?raw";

export const Route = createFileRoute("/www-udyamregistration")({
  head: () => ({
    meta: [
      { title: "www UdyamRegistration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "www.UdyamRegistration.gov.in is the official government portal for MSME registration. It allows entrepreneurs to register their micro, small, or medium enterprises online using Aadhaar authentication. After registration, businesses can instantly download their Udyam Certificate, verify their Udyam Registration..." },
      { property: "og:title", content: "www UdyamRegistration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "www.UdyamRegistration.gov.in is the official government portal for MSME registration. It allows entrepreneurs to register their micro, small, or medium enterprises online using Aadhaar authentication. After registration, businesses can instantly download their Udyam Certificate, verify their Udyam Registration..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/www-udyamregistration" },
    ],
  }),
  component: () => <SeoLandingPage title="www UdyamRegistration" linkTitle="www UdyamRegistration" html={html} />,
});
