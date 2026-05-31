import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-no.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-no")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhaar Number (UAN) Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
      { property: "og:title", content: "Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" },
      { property: "og:description", content: "Udyog Aadhaar Number (UAN) Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your Stat" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Number (UAN) – Find, Verify & Update UAN" html={html} />,
});
