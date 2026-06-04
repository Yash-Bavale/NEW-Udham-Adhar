import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-reprint.html?raw";

export const Route = createFileRoute("/udyam-certificate-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Reprint — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Certificate Reprint allows businesses to download and reprint their MSME certificate from the official Udyam portal if the original copy is lost or misplaced. By entering your Udyam Number and verifying via OTP, entrepreneurs can instantly access a secure PDF for printing and official use. The certificate is..." },
      { property: "og:title", content: "Udyam Certificate Reprint — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Certificate Reprint allows businesses to download and reprint their MSME certificate from the official Udyam portal if the original copy is lost or misplaced. By entering your Udyam Number and verifying via OTP, entrepreneurs can instantly access a secure PDF for printing and official use. The certificate is..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Reprint" linkTitle="Udyam Certificate Reprint" html={html} />,
});
