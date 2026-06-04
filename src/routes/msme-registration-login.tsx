import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-login.html?raw";

export const Route = createFileRoute("/msme-registration-login")({
  head: () => ({
    meta: [
      { title: "MSME Registration Login — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME Registration Login enables businesses to securely access their Udyam certificate and registration details using Aadhaar-based OTP verification. The portal allows entrepreneurs to view, update, download, or print their certificate for official purposes such as bank loans, tenders, and government subsidies. The..." },
      { property: "og:title", content: "MSME Registration Login — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME Registration Login enables businesses to securely access their Udyam certificate and registration details using Aadhaar-based OTP verification. The portal allows entrepreneurs to view, update, download, or print their certificate for official purposes such as bank loans, tenders, and government subsidies. The..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-login" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Login" linkTitle="MSME Registration Login" html={html} />,
});
