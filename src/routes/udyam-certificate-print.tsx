import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-print.html?raw";

export const Route = createFileRoute("/udyam-certificate-print")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Certificate Print provides MSMEs the ability to download and print their official MSME registration certificate instantly. Using the Udyam Registration Number and OTP verification, businesses can securely access a digitally signed PDF version of their certificate. The Udyam certificate serves as official..." },
      { property: "og:title", content: "Udyam Certificate Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Certificate Print provides MSMEs the ability to download and print their official MSME registration certificate instantly. Using the Udyam Registration Number and OTP verification, businesses can securely access a digitally signed PDF version of their certificate. The Udyam certificate serves as official..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Print" linkTitle="Udyam Certificate Print" html={html} />,
});
