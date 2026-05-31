import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-free-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-free-registration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Free Registration - Old MSME Registration Process — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhar Free Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
      { property: "og:title", content: "Udyog Aadhar Free Registration - Old MSME Registration Proce" },
      { property: "og:description", content: "Udyog Aadhar Free Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your " },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Free Registration - Old MSME Registration Proce" html={html} />,
});
