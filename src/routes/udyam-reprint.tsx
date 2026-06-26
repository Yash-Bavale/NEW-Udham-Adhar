import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reprint.html?raw";

export const Route = createFileRoute("/udyam-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Reprint Certificate | Reprint MSME Certificate Online" },
      { name: "description", content: "Udyam Reprint allows entrepreneurs to reprint their MSME certificate anytime by downloading it again from the official Udyam portal. The process only..." },
      { property: "og:title", content: "Udyam Reprint Certificate | Reprint MSME Certificate Online" },
      { property: "og:description", content: "Udyam Reprint allows entrepreneurs to reprint their MSME certificate anytime by downloading it again from the official Udyam portal. The process only..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Reprint" linkTitle="Udyam Reprint Certificate | Reprint MSME Certificate Online" content={`Udyam Reprint allows entrepreneurs to reprint their MSME certificate anytime by downloading it again from the official Udyam portal. The process only requires the Udyam Registration Number and OTP verification, ensuring secure access to business details. This feature is useful if the original certificate is lost, misplaced, or needs updating. The reprinted certificate is available in PDF format and can be used for bank loans, tenders, and government schemes. The process is fast, reliable, and paperless, making it convenient for all types of MSMEs. Step-by-step guidance ensures error-free reprinting and seamless document management, keeping your official MSME certificate accessible at all times.`} html={html} />,
});
