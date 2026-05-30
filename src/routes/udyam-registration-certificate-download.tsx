import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-registration-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Certificate Download - Official MSME Proof — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Registration Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Sel" },
      { property: "og:title", content: "Udyam Registration Certificate Download - Official MSME Proo" },
      { property: "og:description", content: "Udyam Registration Certificate Download Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Sel" },
    ],
  }),
  component: () => <WpPage title="Udyam Registration Certificate Download - Official MSME Proo" html={html} />,
});
