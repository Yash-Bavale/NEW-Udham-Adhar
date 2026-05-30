import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udyam-register-print.html?raw";

export const Route = createFileRoute("/udyam-register-print")({
  head: () => ({
    meta: [
      { title: "Udyam Register Print | MSME Certificate Online Printing — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Register Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
      { property: "og:title", content: "Udyam Register Print | MSME Certificate Online Printing" },
      { property: "og:description", content: "Udyam Register Print Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andh" },
    ],
  }),
  component: () => <WpPage title="Udyam Register Print | MSME Certificate Online Printing" html={html} />,
});
