import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-regn-certificate.html?raw";

export const Route = createFileRoute("/udyam-regn-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Regn Certificate - MSME Registration Proof" },
      { name: "description", content: "The Udyam regn certificate serves as the official documentation that your business is legally recognized as a Micro, Small, or Medium Enterprise under the Government of India’s Udyam registration system. Issued immediately after the completion of the online registration, this certificate provides a unique Udyam..." },
      { property: "og:title", content: "Udyam Regn Certificate - MSME Registration Proof" },
      { property: "og:description", content: "The Udyam regn certificate serves as the official documentation that your business is legally recognized as a Micro, Small, or Medium Enterprise under the Government of India’s Udyam registration system. Issued immediately after the completion of the online registration, this certificate provides a unique Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-regn-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Regn Certificate" linkTitle="Udyam Regn Certificate - MSME Registration Proof" html={html} />,
});
