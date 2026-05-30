import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/aadhar-udyog-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyog-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyog Registration - Aadhaar-Based MSME Registration Process — Udyam Registration Consultancy" },
      { name: "description", content: "Aadhar Udyog Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Aadhar Udyog Registration - Aadhaar-Based MSME Registration " },
      { property: "og:description", content: "Aadhar Udyog Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="Aadhar Udyog Registration - Aadhaar-Based MSME Registration " html={html} />,
});
