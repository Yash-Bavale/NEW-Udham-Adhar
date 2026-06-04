import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Print Udyam Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Printing your Udyam Certificate online is a simple and secure process for all registered MSMEs. By accessing the official Udyam portal, entrepreneurs can retrieve their MSME registration certificate using their Udyam Registration Number and registered mobile number for OTP verification. The certificate is digitally..." },
      { property: "og:title", content: "Print Udyam Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Printing your Udyam Certificate online is a simple and secure process for all registered MSMEs. By accessing the official Udyam portal, entrepreneurs can retrieve their MSME registration certificate using their Udyam Registration Number and registered mobile number for OTP verification. The certificate is digitally..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate" linkTitle="Print Udyam Certificate" html={html} />,
});
