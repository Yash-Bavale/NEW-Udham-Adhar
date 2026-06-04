import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/www-udyamregistration.html?raw";

export const Route = createFileRoute("/www-udyamregistration")({
  head: () => ({
    meta: [
      { title: "www UdyamRegistration – Official Portal for MSME Registration" },
      { name: "description", content: "www.UdyamRegistration.gov.in is the official government portal for MSME registration. It allows entrepreneurs to register their micro, small, or medium..." },
      { property: "og:title", content: "www UdyamRegistration – Official Portal for MSME Registration" },
      { property: "og:description", content: "www.UdyamRegistration.gov.in is the official government portal for MSME registration. It allows entrepreneurs to register their micro, small, or medium..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/www-udyamregistration" },
    ],
  }),
  component: () => <SeoLandingPage title="www UdyamRegistration" linkTitle="www UdyamRegistration – Official Portal for MSME Registration" content={`www.UdyamRegistration.gov.in is the official government portal for MSME registration. It allows entrepreneurs to register their micro, small, or medium enterprises online using Aadhaar authentication. After registration, businesses can instantly download their Udyam Certificate, verify their Udyam Registration Number, and update or edit registration details anytime. The portal provides a secure, paperless, and free registration process, ensuring MSME compliance and recognition. Using this official platform, startups and established enterprises can access government schemes, loans, subsidies, and procurement benefits, facilitating business growth, credibility, and sustainability.`} html={html} />,
});
