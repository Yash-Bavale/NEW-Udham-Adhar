import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-login.html?raw";

export const Route = createFileRoute("/msme-registration-login")({
  head: () => ({
    meta: [
      { title: "MSME Registration Login | Access Your Udyam Certificate Online" },
      { name: "description", content: "MSME Registration Login enables businesses to securely access their Udyam certificate and registration details using Aadhaar-based OTP verification. The..." },
      { property: "og:title", content: "MSME Registration Login | Access Your Udyam Certificate Online" },
      { property: "og:description", content: "MSME Registration Login enables businesses to securely access their Udyam certificate and registration details using Aadhaar-based OTP verification. The..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/msme-registration-login" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Login" linkTitle="MSME Registration Login | Access Your Udyam Certificate Online" content={`MSME Registration Login enables businesses to securely access their Udyam certificate and registration details using Aadhaar-based OTP verification. The portal allows entrepreneurs to view, update, download, or print their certificate for official purposes such as bank loans, tenders, and government subsidies. The process is digital, secure, and user-friendly, eliminating the need for paperwork. Step-by-step instructions guide users through a hassle-free login experience. Maintaining active login access ensures compliance with MSME regulations, uninterrupted access to benefits, and quick retrieval of essential business documentation.`} html={html} />,
});
