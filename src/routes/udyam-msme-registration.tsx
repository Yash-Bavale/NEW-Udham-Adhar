import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-registration.html?raw";

export const Route = createFileRoute("/udyam-msme-registration")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Registration – Official Portal for MSME Certificate" },
      { name: "description", content: "Udyam MSME Registration is the official online platform for registering micro, small, or medium enterprises in India. The process is fully digital, free,..." },
      { property: "og:title", content: "Udyam MSME Registration – Official Portal for MSME Certificate" },
      { property: "og:description", content: "Udyam MSME Registration is the official online platform for registering micro, small, or medium enterprises in India. The process is fully digital, free,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-msme-registration" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Udyam MSME Registration",
          serviceType: "MSME / Udyam registration assistance",
          areaServed: "IN",
          provider: {
            "@type": "Organization",
            name: "Udyam Registration Consultancy & Assistance Services",
            url: "https://udyamadhar.in",
          },
          url: "https://udyamadhar.in/udyam-msme-registration",
        }),
      },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Registration" linkTitle="Udyam MSME Registration – Official Portal for MSME Certificate" content={`Udyam MSME Registration is the official online platform for registering micro, small, or medium enterprises in India. The process is fully digital, free, and Aadhaar-based, allowing businesses to obtain a unique Udyam Registration Number instantly. Upon registration, entrepreneurs receive a digitally signed MSME certificate, confirming legal recognition and eligibility for government schemes, loans, subsidies, and procurement opportunities. The portal is secure, user-friendly, and designed for startups, small businesses, and medium enterprises to register efficiently without paperwork. Udyam MSME Registration ensures compliance with regulations, enhances credibility with banks and authorities, and provides uninterrupted access to benefits, supporting business growth, financial assistance, and operational sustainability.`} html={html} />,
});
