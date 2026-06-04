import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-portal.html?raw";

export const Route = createFileRoute("/msme-registration-portal")({
  head: () => ({
    meta: [
      { title: "MSME Registration Portal - Official Site for MSME Registration
Meta Description: The MSME registration portal is the official government website for registering micro, small, or medium enterprises in India. It provides a secure, paperless, and free registration process through Aadhaar-based verification. Entrepreneurs can complete the registration online, obtain a unique Udyam Registration Number, and instantly receive a digitally signed MSME certificate. This certificate acts as legal proof of business status and allows access to government schemes, loans, subsidies, and priority procurement benefits. The portal also enables businesses to update details, download certificates, and maintain compliance with regulatory requirements. By using the MSME registration portal, startups and established enterprises can ensure credibility, uninterrupted access to benefits, and seamless participation in government-supported programs for growth and sustainability." },
      { name: "description", content: "Expert consultancy assistance for MSME registration portal. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Registration Portal - Official Site for MSME Registration
Meta Description: The MSME registration portal is the official government website for registering micro, small, or medium enterprises in India. It provides a secure, paperless, and free registration process through Aadhaar-based verification. Entrepreneurs can complete the registration online, obtain a unique Udyam Registration Number, and instantly receive a digitally signed MSME certificate. This certificate acts as legal proof of business status and allows access to government schemes, loans, subsidies, and priority procurement benefits. The portal also enables businesses to update details, download certificates, and maintain compliance with regulatory requirements. By using the MSME registration portal, startups and established enterprises can ensure credibility, uninterrupted access to benefits, and seamless participation in government-supported programs for growth and sustainability." },
      { property: "og:description", content: "Expert consultancy assistance for MSME registration portal. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-portal" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME registration portal" linkTitle="MSME Registration Portal - Official Site for MSME Registration
Meta Description: The MSME registration portal is the official government website for registering micro, small, or medium enterprises in India. It provides a secure, paperless, and free registration process through Aadhaar-based verification. Entrepreneurs can complete the registration online, obtain a unique Udyam Registration Number, and instantly receive a digitally signed MSME certificate. This certificate acts as legal proof of business status and allows access to government schemes, loans, subsidies, and priority procurement benefits. The portal also enables businesses to update details, download certificates, and maintain compliance with regulatory requirements. By using the MSME registration portal, startups and established enterprises can ensure credibility, uninterrupted access to benefits, and seamless participation in government-supported programs for growth and sustainability." html={html} />,
});
