import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reprint.html?raw";

export const Route = createFileRoute("/udyam-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Reprint — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Reprint allows entrepreneurs to reprint their MSME certificate anytime by downloading it again from the official Udyam portal. The process only requires the Udyam Registration Number and OTP verification, ensuring secure access to business details. This feature is useful if the original certificate is lost,..." },
      { property: "og:title", content: "Udyam Reprint — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Reprint allows entrepreneurs to reprint their MSME certificate anytime by downloading it again from the official Udyam portal. The process only requires the Udyam Registration Number and OTP verification, ensuring secure access to business details. This feature is useful if the original certificate is lost,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Reprint" linkTitle="Udyam Reprint" html={html} />,
});
