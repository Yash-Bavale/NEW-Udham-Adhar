import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-apply-online.html?raw";

export const Route = createFileRoute("/msme-apply-online")({
  head: () => ({
    meta: [
      { title: "MSME Apply Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME Apply Online allows entrepreneurs to register their micro, small, or medium enterprises via the Udyam portal using Aadhaar authentication. The process is fast, paperless, and free, providing instant Udyam Registration Number and certificate. This certificate is essential for accessing government loans,..." },
      { property: "og:title", content: "MSME Apply Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME Apply Online allows entrepreneurs to register their micro, small, or medium enterprises via the Udyam portal using Aadhaar authentication. The process is fast, paperless, and free, providing instant Udyam Registration Number and certificate. This certificate is essential for accessing government loans,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-apply-online" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Apply Online" linkTitle="MSME Apply Online" html={html} />,
});
