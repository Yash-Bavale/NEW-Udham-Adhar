import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar.html?raw";

export const Route = createFileRoute("/udyog-aadhar")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar - Old MSME Registration Process Explained — Business Help Services Consultancy" },
      { name: "description", content: "Udyog Aadhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
      { property: "og:title", content: "Udyog Aadhar - Old MSME Registration Process Explained" },
      { property: "og:description", content: "Udyog Aadhar Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State Andhra Prade" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar - Old MSME Registration Process Explained" html={html} />,
});
