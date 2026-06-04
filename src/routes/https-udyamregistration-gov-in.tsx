import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/https-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/https-udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "https UdyamRegistration gov in — Udyam / MSME Consultancy Help" },
      { name: "description", content: "https://UdyamRegistration.gov.in is the official online portal for MSME registration in India. Entrepreneurs can register their enterprises under the Udyam system, access official certificates, verify details, and update their registration anytime. Using Aadhaar and PAN verification, the portal ensures secure,..." },
      { property: "og:title", content: "https UdyamRegistration gov in — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "https://UdyamRegistration.gov.in is the official online portal for MSME registration in India. Entrepreneurs can register their enterprises under the Udyam system, access official certificates, verify details, and update their registration anytime. Using Aadhaar and PAN verification, the portal ensures secure,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/https-udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="https UdyamRegistration gov in" linkTitle="https UdyamRegistration gov in" html={html} />,
});
