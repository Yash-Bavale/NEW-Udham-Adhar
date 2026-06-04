import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/free-msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/free-msme-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Registration Certificate Download - Get Your Certificate Online" },
      { name: "description", content: "Free MSME registration certificate download allows registered businesses to access their MSME certificate without any fees through the Udyam portal. The certificate is digital, secure, and instantly available online, confirming the enterprise’s status as a micro, small, or medium business. Having this certificate..." },
      { property: "og:title", content: "MSME Registration Certificate Download - Get Your Certificate Online" },
      { property: "og:description", content: "Free MSME registration certificate download allows registered businesses to access their MSME certificate without any fees through the Udyam portal. The certificate is digital, secure, and instantly available online, confirming the enterprise’s status as a micro, small, or medium business. Having this certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/free-msme-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Free MSME registration certificate download" linkTitle="MSME Registration Certificate Download - Get Your Certificate Online" html={html} />,
});
