import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate.html?raw";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Download Udyam Certificate enables businesses to obtain their official MSME registration document instantly from the Udyam portal. By entering your Udyam Registration Number and verifying through OTP, you can download a digitally signed PDF certificate. This certificate acts as proof of your enterprise’s MSME..." },
      { property: "og:title", content: "Download Udyam Certificate — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Download Udyam Certificate enables businesses to obtain their official MSME registration document instantly from the Udyam portal. By entering your Udyam Registration Number and verifying through OTP, you can download a digitally signed PDF certificate. This certificate acts as proof of your enterprise’s MSME..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate" linkTitle="Download Udyam Certificate" html={html} />,
});
