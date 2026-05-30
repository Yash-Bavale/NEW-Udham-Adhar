import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/print-udyam-certificate.html?raw";

export const Route = createFileRoute("/print-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Print Udyam Certificate Online | Download Udyam Registration Certificate — Udyam Registration Consultancy" },
      { name: "description", content: "Print Udyam Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
      { property: "og:title", content: "Print Udyam Certificate Online | Download Udyam Registration" },
      { property: "og:description", content: "Print Udyam Certificate Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
    ],
  }),
  component: () => <WpPage title="Print Udyam Certificate Online | Download Udyam Registration" html={html} />,
});
