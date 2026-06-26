import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate.html?raw";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate – Official MSME PDF Download Online" },
      { name: "description", content: "Download Udyam Certificate enables businesses to obtain their official MSME registration document instantly from the Udyam portal. By entering your Udyam..." },
      { property: "og:title", content: "Download Udyam Certificate – Official MSME PDF Download Online" },
      { property: "og:description", content: "Download Udyam Certificate enables businesses to obtain their official MSME registration document instantly from the Udyam portal. By entering your Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate" linkTitle="Download Udyam Certificate – Official MSME PDF Download Online" content={`Download Udyam Certificate enables businesses to obtain their official MSME registration document instantly from the Udyam portal. By entering your Udyam Registration Number and verifying through OTP, you can download a digitally signed PDF certificate. This certificate acts as proof of your enterprise’s MSME status and is required for accessing government loans, subsidies, and tender applications. The download process is free, secure, and available online at any time. Storing and printing your Udyam Certificate ensures compliance, recognition, and uninterrupted eligibility for government programs designed to support small and medium enterprises.`} html={html} />,
});
