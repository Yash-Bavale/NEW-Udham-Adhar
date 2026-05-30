import { createFileRoute } from "@tanstack/react-router";
import { WpPage } from "@/components/site/PageHero";
import html from "@/content/wp/udhar-aadhar-registration.html?raw";

export const Route = createFileRoute("/udhar-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udhar Aadhar Registration Online – Easy Process, Eligibility & Benefits Guide — Udyam Registration Consultancy" },
      { name: "description", content: "Udyog Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
      { property: "og:title", content: "Udhar Aadhar Registration Online – Easy Process, Eligibility" },
      { property: "og:description", content: "Udyog Aadhar Registration Please leave this field empty. Applicant Name / आवेदक का नाम Email / ईमेल Mobile No / मोबाइल नंबर State / राज्य Select Your State" },
    ],
  }),
  component: () => <WpPage title="Udhar Aadhar Registration Online – Easy Process, Eligibility" html={html} />,
});
