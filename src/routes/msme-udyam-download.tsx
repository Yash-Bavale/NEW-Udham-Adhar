import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-download.html?raw";

export const Route = createFileRoute("/msme-udyam-download")({
  head: () => ({
    meta: [
      { title: "MSME Udyam Download - Download MSME Certificate Online" },
      { name: "description", content: "MSME Udyam download provides registered businesses with instant access to their official Udyam certificate, a vital document that proves their MSME status and enables them to claim various government benefits. After completing registration on the Udyam portal using Aadhaar verification and basic business details,..." },
      { property: "og:title", content: "MSME Udyam Download - Download MSME Certificate Online" },
      { property: "og:description", content: "MSME Udyam download provides registered businesses with instant access to their official Udyam certificate, a vital document that proves their MSME status and enables them to claim various government benefits. After completing registration on the Udyam portal using Aadhaar verification and basic business details,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam download" linkTitle="MSME Udyam Download - Download MSME Certificate Online" html={html} />,
});
