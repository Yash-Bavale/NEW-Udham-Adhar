import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-certificate.html?raw";

export const Route = createFileRoute("/udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate - Download Official MSME Certificate Online — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
      { property: "og:title", content: "Udyam Certificate - Download Official MSME Certificate Onlin" },
      { property: "og:description", content: "Udyam Certificate Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra " },
    ],
  }),
  component: () => <WpPage title="Udyam Certificate - Download Official MSME Certificate Onlin" html={html} />,
});
