import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-msme-registration.html?raw";

export const Route = createFileRoute("/udyam-msme-registration")({
  head: () => ({
    meta: [
      { title: "Udyam MSME Registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam MSME Registration is the official online platform for registering micro, small, or medium enterprises in India. The process is fully digital, free, and Aadhaar-based, allowing businesses to obtain a unique Udyam Registration Number instantly. Upon registration, entrepreneurs receive a digitally signed MSME..." },
      { property: "og:title", content: "Udyam MSME Registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam MSME Registration is the official online platform for registering micro, small, or medium enterprises in India. The process is fully digital, free, and Aadhaar-based, allowing businesses to obtain a unique Udyam Registration Number instantly. Upon registration, entrepreneurs receive a digitally signed MSME..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-msme-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam MSME Registration" linkTitle="Udyam MSME Registration" html={html} />,
});
