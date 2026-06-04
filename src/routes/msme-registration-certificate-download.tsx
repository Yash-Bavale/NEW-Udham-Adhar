import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/msme-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Registration Certificate Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME Registration Certificate Download allows businesses to instantly access their Udyam Certificate online. Using your URN and registered mobile number for OTP verification, you can download a digitally signed PDF certificate. This official document confirms your enterprise classification as micro, small, or..." },
      { property: "og:title", content: "MSME Registration Certificate Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME Registration Certificate Download allows businesses to instantly access their Udyam Certificate online. Using your URN and registered mobile number for OTP verification, you can download a digitally signed PDF certificate. This official document confirms your enterprise classification as micro, small, or..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Certificate Download" linkTitle="MSME Registration Certificate Download" html={html} />,
});
