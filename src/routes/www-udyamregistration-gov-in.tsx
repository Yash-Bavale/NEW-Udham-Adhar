import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration-gov-in.html?raw";

export const Route = createFileRoute("/www-udyamregistration-gov-in")({
  head: () => ({
    meta: [
      { title: "www.udyamregistration.gov.in - Official MSME Registration Website" },
      { name: "description", content: "www.udyamregistration.gov.in is the official government portal for MSME registration and certification in India. It provides a secure, free, and fast..." },
      { property: "og:title", content: "www.udyamregistration.gov.in - Official MSME Registration Website" },
      { property: "og:description", content: "www.udyamregistration.gov.in is the official government portal for MSME registration and certification in India. It provides a secure, free, and fast..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/www-udyamregistration-gov-in" },
    ],
  }),
  component: () => <SeoLandingPage title="www.udyamregistration.gov.in" linkTitle="www.udyamregistration.gov.in - Official MSME Registration Website" content={`www.udyamregistration.gov.in is the official government portal for MSME registration and certification in India. It provides a secure, free, and fast digital platform for businesses to register as micro, small, or medium enterprises. Entrepreneurs and business owners can complete the registration using Aadhaar-based verification, which ensures authenticity and reduces paperwork. Once the registration is complete, businesses instantly receive a unique Udyam Registration Number and a digitally signed MSME certificate. This certificate serves as legal proof of the enterprise’s MSME status and unlocks access to government benefits, including loans, subsidies, tax exemptions, and priority in procurement tenders. The portal also allows businesses to update their details, download certificates anytime, and maintain compliance with government schemes. www.udyamregistration.gov.in simplifies the MSME registration process for startups, small businesses, and established enterprises, providing a paperless, reliable, and user-friendly experience that supports business growth, financial access, and operational expansion across India’s competitive market.`} html={html} />,
});
