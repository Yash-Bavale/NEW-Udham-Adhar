import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-with-annexure.html?raw";

export const Route = createFileRoute("/udyam-print-with-annexure")({
  head: () => ({
    meta: [
      { title: "Udyam Print With Annexure — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Print With Annexure allows businesses to download and print their Udyam certificate along with the annexure, which contains detailed business information for official verifications. By completing OTP verification, both documents are available in PDF format for printing. The certificate and annexure are..." },
      { property: "og:title", content: "Udyam Print With Annexure — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Print With Annexure allows businesses to download and print their Udyam certificate along with the annexure, which contains detailed business information for official verifications. By completing OTP verification, both documents are available in PDF format for printing. The certificate and annexure are..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-with-annexure" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print With Annexure" linkTitle="Udyam Print With Annexure" html={html} />,
});
