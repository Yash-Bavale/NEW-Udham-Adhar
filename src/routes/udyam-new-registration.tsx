import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-new-registration.html?raw";

export const Route = createFileRoute("/udyam-new-registration")({
  head: () => ({
    meta: [
      { title: "Udyam New Registration - Step-by-Step MSME Registration Guide" },
      { name: "description", content: "Udyam new registration is designed for businesses applying for MSME certification for the first time on the official government portal. The process is completely free, paperless, and requires only basic business information and Aadhaar verification. Upon successful registration, businesses receive a unique Udyam..." },
      { property: "og:title", content: "Udyam New Registration - Step-by-Step MSME Registration Guide" },
      { property: "og:description", content: "Udyam new registration is designed for businesses applying for MSME certification for the first time on the official government portal. The process is completely free, paperless, and requires only basic business information and Aadhaar verification. Upon successful registration, businesses receive a unique Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-new-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam New Registration" linkTitle="Udyam New Registration - Step-by-Step MSME Registration Guide" html={html} />,
});
