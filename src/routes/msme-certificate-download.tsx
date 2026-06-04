import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-download.html?raw";

export const Route = createFileRoute("/msme-certificate-download")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Download - Get Your MSME Certificate Online" },
      { name: "description", content: "MSME certificate download is an essential feature of the Udyam registration portal that allows registered businesses to access and retrieve their official MSME certificate anytime they need it. After completing the registration process and receiving the Udyam Registration Number, entrepreneurs can log in to the..." },
      { property: "og:title", content: "MSME Certificate Download - Get Your MSME Certificate Online" },
      { property: "og:description", content: "MSME certificate download is an essential feature of the Udyam registration portal that allows registered businesses to access and retrieve their official MSME certificate anytime they need it. After completing the registration process and receiving the Udyam Registration Number, entrepreneurs can log in to the..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Download" linkTitle="MSME Certificate Download - Get Your MSME Certificate Online" html={html} />,
});
