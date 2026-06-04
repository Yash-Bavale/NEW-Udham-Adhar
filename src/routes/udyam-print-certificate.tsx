import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-certificate.html?raw";

export const Route = createFileRoute("/udyam-print-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Print Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Print Certificate provides a simple and secure way to print your MSME certificate directly from the official portal. By downloading the certificate PDF after OTP verification, entrepreneurs can access an official document containing all key business details. This certificate is essential for bank loans,..." },
      { property: "og:title", content: "Udyam Print Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Print Certificate provides a simple and secure way to print your MSME certificate directly from the official portal. By downloading the certificate PDF after OTP verification, entrepreneurs can access an official document containing all key business details. This certificate is essential for bank loans,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Certificate" linkTitle="Udyam Print Certificate" html={html} />,
});
