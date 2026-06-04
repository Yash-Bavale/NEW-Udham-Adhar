import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/https-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/https-udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "https UdyamRegistration.gov.in – Official Government MSME Portal" },
      { name: "description", content: "https://UdyamRegistration.gov.in is the official online portal for MSME registration in India. Entrepreneurs can register their enterprises under the..." },
      { property: "og:title", content: "https UdyamRegistration.gov.in – Official Government MSME Portal" },
      { property: "og:description", content: "https://UdyamRegistration.gov.in is the official online portal for MSME registration in India. Entrepreneurs can register their enterprises under the..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/https-udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="https UdyamRegistration gov in" linkTitle="https UdyamRegistration.gov.in – Official Government MSME Portal" content={`https://UdyamRegistration.gov.in is the official online portal for MSME registration in India. Entrepreneurs can register their enterprises under the Udyam system, access official certificates, verify details, and update their registration anytime. Using Aadhaar and PAN verification, the portal ensures secure, paperless, and reliable registration. MSMEs can download their certificates instantly, access government schemes, loans, subsidies, and priority procurement opportunities. This free-to-use government portal streamlines the registration process, provides digital recognition, and ensures uninterrupted compliance and eligibility for all MSME-related benefits, supporting business growth and credibility.`} html={html} />,
});
