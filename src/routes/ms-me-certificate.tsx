import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/ms-me-certificate.html?raw";

export const Route = createFileRoute("/ms-me-certificate")({
  head: () => ({
    meta: [
      { title: "MS ME Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "The MS ME Certificate is an official document issued under the Udyam Registration system, verifying the registration of micro, small, or medium enterprises. Entrepreneurs can download the certificate online using their Udyam Number and OTP verification. This certificate is essential for availing government loans,..." },
      { property: "og:title", content: "MS ME Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "The MS ME Certificate is an official document issued under the Udyam Registration system, verifying the registration of micro, small, or medium enterprises. Entrepreneurs can download the certificate online using their Udyam Number and OTP verification. This certificate is essential for availing government loans,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/ms-me-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MS ME Certificate" linkTitle="MS ME Certificate" html={html} />,
});
