import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-online-registration.html?raw";

export const Route = createFileRoute("/udyam-online-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Online Registration - Quick MSME Registration Process — Udyam Registration Consultancy" },
      { name: "description", content: "Udyam Online Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udyam Online Registration - Quick MSME Registration Process" },
      { property: "og:description", content: "Udyam Online Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Online Registration - Quick MSME Registration Process" html={html} />,
});
