import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-msme-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Certificate Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam MSME Certificate Download allows entrepreneurs to instantly access and download their official MSME certificate in PDF format from the Udyam portal. By entering your Udyam Number and completing OTP verification, businesses can securely retrieve their certificate for printing and official use. The certificate..." },
      { property: "og:title", content: "Udyam MSME Certificate Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam MSME Certificate Download allows entrepreneurs to instantly access and download their official MSME certificate in PDF format from the Udyam portal. By entering your Udyam Number and completing OTP verification, businesses can securely retrieve their certificate for printing and official use. The certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Certificate Download" linkTitle="Udyam MSME Certificate Download" html={html} />,
});
