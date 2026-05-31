import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration-online.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration-online")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration Online – Simple Process, Benefits & Eligibility Guide — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhar Registration Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
      { property: "og:title", content: "Udyog Aadhar Registration Online – Simple Process, Benefits " },
      { property: "og:description", content: "Udyog Aadhar Registration Online Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select You" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration Online – Simple Process, Benefits " html={html} />,
});
